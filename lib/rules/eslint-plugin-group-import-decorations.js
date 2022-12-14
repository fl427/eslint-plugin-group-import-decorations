/**
 * @fileoverview Group import decorations in React projects
 * @author fl427
 * eslint开发方法集合：https://cn.eslint.org/docs/developer-guide/working-with-rules
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Group import decorations in React projects",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code',
    schema: [{
      type: 'object',
    }],
    messages: {
      sort: '运行ESLint规则来整理import分组',
      nameComment: '分组注释错误',
      intervalComment: '同组的节点之间存在多余注释'
    },
  },

  create(context) {
    // 拿到配置对象，对象的key即为组名(ex: 'react')，对象的value即为该组对应正则(ex: '^react')
    const options = context.options[0] || {
      "react": "^react",
      "style": ".(css|scss|less|sass)$",
      "common": ".(png|jpg|jpeg|svg|gif|json)$",
      "hooks":"/hooks/",
      "src": "@src/",
    };
    const groups = [];
    // 遍历配置对象，构造分组数组
    for (let name in options) {
      const reg = options[name];
      groups.push({
        name,
        reg,
        imports: []
      })
    }

    // 用户没有指定other则将无法分类的import项统一放入other分组中
    if (!options['other']) {
      groups.push({
        name: 'other',
        rules: '.*',
        imports: [],
      })
    }

    // group前注释错误
    function isGroupNameError(node, name) {
      // getSourceCode返回一个SourceCode对象，可以使用该对象处理传递给 ESLint 的源代码。
      const sourceCode = context.getSourceCode();
      // getCommentsBefore返回一个在给定的节点或 token 之前的注释的数组
      const commentsBefore = sourceCode.getCommentsBefore(node);
      // 没有注释 或者 最近的一行注释和指定的group名字不匹配
      return {
        // 没有注释
        noNameComment: !commentsBefore.length,
        // 有注释但注释错误
        groupNameIsError: commentsBefore.length && commentsBefore[commentsBefore.length - 1].value !== ` ${name}`
      }
    }

    return {
      Program: programNode => {
        // SourceCode 是获取被检查源码的更多信息的主要对象。可以使用 getSourceCode()在任何时间检索 SourceCode 对象。
        const sourceCode = context.getSourceCode();
        // importNodes存放所有的import node
        const importNodes = [];
        // 将import node放到正则匹配的数组中
        for (const node of programNode.body) {
          if (node.type === 'ImportDeclaration') {
            // 是引用语句
            importNodes.push(node);
            // 遍历每个分组
            for (let group of groups) {
              const regex = new RegExp(group.reg, 'ig');
              // 这个node符合该rule，放到对应的数组中
              if (regex.test(node.source.value)) {
                if (Boolean(group.imports) === false) {
                  group.imports = [];
                }
                group.imports.push({
                  // 每次推入一个node，group.imports的长度就+1，我们将当前node的序号记录下来，方便后续判断哪一个import node是当前组的第一个，从而添加组前注释
                  idx: group.imports.length,
                  name: group.name,
                  node,
                });
                break;
              }
            }
          }
        }

        // 平铺存放按顺序排好的{idx, name, node}结构体，后续与原始的import nodes对比
        let orderImport = [];
        for (let group of groups) {
          orderImport = orderImport.concat(group.imports);
        }

        // 遍历所有的import nodes，利用fixer让import nodes的顺序与整理好的group-imports一致(通过替换文本实现)
        for (let index = 0; index < importNodes.length; index++) {
          // 原始node
          const node = importNodes[index];
          const prevNode = importNodes[index - 1];
          // {idx, name, node}结构体
          const orderedNode = orderImport[index];
          const prevOrderedNode = orderImport[index - 1];
          // getText返回给定节点的源码。省略 node，返回整个源码。
          const nowText = sourceCode.getText(node);
          const orderedNodeText = sourceCode.getText(orderedNode.node);
          if (nowText !== orderedNodeText) {
            context.report({
              node,
              messageId: 'sort',
              // replaceText替换给定的节点或记号内的文本
              fix: fixer => fixer.replaceText(node, orderedNodeText),
            });
          } else {
            // 是该组的第一个节点，判断这个节点的注释是否正确，不正确则在前面插入注释
            const { noNameComment, groupNameIsError } = isGroupNameError(orderedNode.node, orderedNode.name)
            // 是该组的第一个节点，没有注释或者注释错误都要插入一行注释
            const isFirstNodeAndCommentErr = orderedNode.idx === 0 && (noNameComment || groupNameIsError);
            // 不是第一个节点，但是它之前有注释且注释错误，需要插入一行注释来纠正错误，我们不会在没有注释的情况下插入注释，因为我们只希望注释放在第一个节点前面
            const otherNodeAndCommentErr = orderedNode.idx != 0 && groupNameIsError
            if (isFirstNodeAndCommentErr || otherNodeAndCommentErr) {
              context.report({
                node,
                messageId: 'nameComment',
                // insertTextBeforeRange在给定的节点或记号之前插入文本
                fix: fixer => fixer.insertTextBeforeRange(node.range, `// ${orderedNode.name}\n`),
              });
            }

            // 如果前后两个node是同一组，而它们之间存在注释，则去除注释
            if (prevNode && prevOrderedNode && sourceCode.commentsExistBetween(prevNode, node) && prevOrderedNode.name === orderedNode.name) {
              context.report({
                node,
                messageId: 'intervalComment',
                // removeRange删除给定范围内的文本
                fix: fixer => fixer.removeRange([prevNode.range[1] + 1, node.range[0] - 1]),
              });
            }
          }
        }
      }
    };
  },
};
