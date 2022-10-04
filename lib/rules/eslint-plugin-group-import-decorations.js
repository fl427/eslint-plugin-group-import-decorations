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
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                rules: {
                  type: 'string',
                }
              },
              required: ['name', 'rules']
            }
          }
        }
      }
    ], // Add a schema if the rule has options
    messages: {
      sort: '运行ESLint规则来整理import分组',
      comment: '分组注释错误',
    },
  },

  create(context) {
    // 拿到配置
    const options = context.options[0] || {};
    const groupsRules = options.groups;

    // 无法分类项默认为other
    const defaultGroup = [{
      name: 'other',
      rules: '.*',
      imports: [],
    }];

    // 为每一个group添加import属性，推入import项node节点
    const groups = [];
    for (let i = 0; i < groupsRules.length; i++) {
      const group = groupsRules[i];
      groups.push({
        ...group,
        imports: []
      })
    }
    groups.concat(defaultGroup)

    // group前注释错误
    function isGroupNameError(node, name) {
      // getSourceCode返回一个SourceCode对象，可以使用该对象处理传递给 ESLint 的源代码。
      const sourceCode = context.getSourceCode();
      // getCommentsBefore返回一个在给定的节点或 token 之前的注释的数组
      const commentsBefore = sourceCode.getCommentsBefore(node);
      // 没有注释 或者 最近的一行注释和指定的group名字不匹配
      // return !commentsBefore.length || commentsBefore[commentsBefore.length - 1].value !== ` ${name}`;
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
            for (let i = 0; i < groups.length; i++) {
              const group = groups[i];
              const regex = new RegExp(group.rules, 'ig');
              // 这个node符合该rule，放到对应的数组中
              if (regex.test(node.source.value)) {
                if (Boolean(group.imports) === false) {
                  group.imports = [];
                }
                group.imports.push(node);
                break;
              }
            }
          }
        }

        // 存放按顺序排好的{idx, name, node}结构体，后续与原始的import nodes对比
        let orderImport = [];
        // groups排序
        for (let i = 0; i < groups.length; i++) {
          const group = groups[i];
          // 将group的imports项进行整理，添加组名和当前node对应的idx，方便判断哪一个import node是当前组的第一个，从而添加组前注释
          const transformedGroupImports = group.imports.map((node, idx) => ({
            idx,
            name: group.name,
            node,
          }));

          orderImport = orderImport.concat(transformedGroupImports);
        }

        // 遍历所有的import nodes，利用fixer让import nodes的顺序与整理好的group-imports一致(通过替换文本实现)
        importNodes.forEach((node, index) => {
          const sorted = orderImport[index];
          // getText返回给定节点的源码。省略 node，返回整个源码。
          const nowText = sourceCode.getText(node);
          const sortedText = sourceCode.getText(sorted.node);
          if (nowText !== sortedText) {
            context.report({
              node,
              messageId: 'sort',
              // replaceText替换给定的节点或记号内的文本
              fix: fixer => fixer.replaceText(node, sortedText),
            });
          } else {
            // 是该组的第一个节点，判断这个节点的注释是否正确，不正确则在前面插入注释
            const { noNameComment, groupNameIsError } = isGroupNameError(sorted.node, sorted.name)
            // 是该组的第一个节点，没有注释或者注释错误都要插入一行注释
            const isFirstNodeAndCommentErr = sorted.idx === 0 && (noNameComment || groupNameIsError);
            // 不是第一个节点，但是它之前有注释且注释错误，需要插入一行注释来纠正错误，我们不会在没有注释的情况下插入注释，因为我们只希望注释放在第一个节点前面
            const otherNodeAndCommentErr = sorted.idx != 0 && groupNameIsError
            if (isFirstNodeAndCommentErr || otherNodeAndCommentErr) {
              context.report({
                node,
                messageId: 'comment',
                // insertTextBeforeRange在给定的节点或记号之前插入文本
                fix: fixer => fixer.insertTextBeforeRange(node.range, `// ${sorted.name}\n`),
              });
            }
          }
        })
      }
    };
  },
};
