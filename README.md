# eslint-plugin-group-import-decorations

Group Import Decorations in React Projects

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
        "group-import-decorations/rule-name": 2
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
                "groups": [
                    {
                        "name": "react",
                        "rules": "^react"
                    },
                    {
                        "name": "style",
                        "rules": ".(css|scss|less|sass)$"
                    },
                    {
                        "name": "layout",
                        "rules": "@layout/"
                    },
                    {
                        "name": "pages",
                        "rules": "@pages/"
                    },
                    {
                        "name": "components",
                        "rules": "/components/"
                    },
                    {
                        "name": "common",
                        "rules": ".(png|jpg|jpeg|svg|gif|json)$"
                    },
                    {
                        "name": "hooks",
                        "rules": "/hooks/"
                    },
                ],
            }
        ],
    }
}
```


