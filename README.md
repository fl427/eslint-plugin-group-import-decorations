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

相关文档：[编写ESLint插件-浅析AST](https://fl427.github.io/2022/10/01/%E7%BC%96%E5%86%99ESLint%E6%8F%92%E4%BB%B6-%E6%B5%85%E6%9E%90AST/)

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


