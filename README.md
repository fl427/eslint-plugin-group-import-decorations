# eslint-plugin-group-import-decorations

此插件的目的在于对 `import` 项分组整理，达成以下效果：
```
// react
import React, {useEffect} from 'react';
// style
import styles from './index.module.scss'
// layout
import Footer from "@layout/footer";
import Header from "@layout/header";
```

## 相关文档
[编写ESLint插件-浅析AST](https://juejin.cn/post/7152185092754898951)

## 代码仓库
https://github.com/fl427/eslint-plugin-group-import-decorations

## NPM
https://www.npmjs.com/package/eslint-plugin-group-import-decorations

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-group-import-decorations`:

```sh
npm install eslint-plugin-group-import-decorations --save-dev
```

## Usage

Add `group-import-decorations` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "group-import-decorations"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "group-import-decorations/group-import-decorations": 2
    }
}
```

## Example .eslintrc.js
```
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:group-import-decorations/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        'import',
        "group-import-decorations",
    ],
    "rules": {
        '@typescript-eslint/no-var-requires': 0,
        "group-import-decorations/group-import-decorations": [
            2,
            {
                "react": "^react",
                "style": ".(css|scss|less|sass)$",
                "layout": "@layout/",
                "pages": "@pages/",
                "common": ".(png|jpg|jpeg|svg|gif|json)$",
                "hooks":"/hooks/",
            }
        ],
    }
}
```


