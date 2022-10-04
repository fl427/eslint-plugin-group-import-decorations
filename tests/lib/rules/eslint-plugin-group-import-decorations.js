/**
 * @fileoverview import order
 * @author tonglinghui
 */
 'use strict';

 // ------------------------------------------------------------------------------
 // Requirements
 // ------------------------------------------------------------------------------
 
 const rule = require("../../../lib/rules/eslint-plugin-group-import-decorations")
 const { RuleTester } = require('eslint');
 
 // ------------------------------------------------------------------------------
 // Tests
 // ------------------------------------------------------------------------------
 
 const ruleTester = new RuleTester({
   parserOptions: {
     ecmaVersion: 2020,
     sourceType: 'module',
   },
 });
 ruleTester.run('eslint-plugin-group-import-decorations', rule, {
  valid: [
    {
      code: 
      `
          // react
          import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
          import { useLocation } from 'react-router-dom';
          // style
          import './index.scss';
          // hooks
          import useInterval from 'src/hooks/useInterval';
          // common
          import noneImg from '../../common/imgs/empty.png';
      `, 
        errors: 1,
        options: [{
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
                "name": "src",
                "rules": "@src/"
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
            {
                "name": "idl",
                "rules": "tool-api"
            }
          ],
        }]
      }
    ],
  invalid: [
     {
      code: `
      import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
      import { useLocation } from 'react-router-dom';
      import './index.scss';
      `,
      errors: 1,
      options: [{
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
                "name": "src",
                "rules": "@src/"
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
            {
                "name": "idl",
                "rules": "tool-api"
            }
        ],
      }]
     },
   ],
 });

//  import './index.scss';
//     import TipBar from '../../components/TipBar';
//     import noneImg from '../../common/imgs/empty.png';
//     import useInterval from 'src/hooks/useInterval';
//     import { GetAqCardInfo } from 'tool-api/sns/service';
//     import ds from 'abc';
//     import xx from 'bcc';

//  import TipBar from '../../components/TipBar';
//        import noneImg from '../../common/imgs/empty.png';
//        import useInterval from 'src/hooks/useInterval';
//        import { GetAqCardInfo } from 'tool-api/sns/service';
//        import xx from 'bcc';
//        import ds from 'abc';
 


// /**
//  * @fileoverview Group import decorations in React projects
//  * @author fl427
//  */
// "use strict";

// //------------------------------------------------------------------------------
// // Requirements
// //------------------------------------------------------------------------------

// const rule = require("../../../lib/rules/eslint-plugin-group-import-decorations"),
//   RuleTester = require("eslint").RuleTester;


// //------------------------------------------------------------------------------
// // Tests
// //------------------------------------------------------------------------------

// const ruleTester = new RuleTester();
// ruleTester.run("eslint-plugin-group-import-decorations", rule, {
//   valid: [
//     {
//       code: `
        // react
        // import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
        // import { useLocation } from 'react-router-dom';
        // import './index.scss';
        // // hooks
        // import useInterval from 'src/hooks/useInterval';
        // // common
        // import noneImg from '../../common/imgs/empty.png';
//       `,
//       errors: 1,
//       options: [{
//         "groups": [
//           {
//               "name": "react",
//               "rules": "^react"
//           },
//           {
//               "name": "style",
//               "rules": ".(css|scss|less|sass)$"
//           },
//           {
//               "name": "components",
//               "rules": "/components/"
//           },
//           {
//               "name": "common",
//               "rules": ".(png|jpg|jpeg|svg|gif|json)$"
//           },
//           {
//               "name": "hooks",
//               "rules": "/hooks/"
//           },
//         ],
//       }]
//     }
//   ],

//   invalid: [
//     {
//       code: `
//        import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
//        import { useLocation } from 'react-router-dom';
//        import './index.scss';
//       `,
//       errors: 1,
//       options: [{
//         "groups": [
//           {
//             "name": "react",
//             "rules": "^react"
//           },
//           {
//               "name": "style",
//               "rules": ".(css|scss|less|sass)$"
//           },
//           {
//               "name": "components",
//               "rules": "/components/"
//           },
//           {
//               "name": "common",
//               "rules": ".(png|jpg|jpeg|svg|gif|json)$"
//           },
//           {
//               "name": "hooks",
//               "rules": "/hooks/"
//           },
//         ]
//       }]
//     },
//   ],
// });
