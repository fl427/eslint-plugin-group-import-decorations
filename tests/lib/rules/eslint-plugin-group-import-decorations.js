/**
 * @fileoverview import order
 * @author fl427
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
          "react": "^react",
          "style": ".(css|scss|less|sass)$",
          "src": "@src/",
          "common": ".(png|jpg|jpeg|svg|gif|json)$",
          "hooks":"/hooks/",
        }],
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
        "react": "^react",
        "style": ".(css|scss|less|sass)$",
        "src": "@src/",
        "common": ".(png|jpg|jpeg|svg|gif|json)$",
        "hooks":"/hooks/",
      }],
     },
   ],
 });