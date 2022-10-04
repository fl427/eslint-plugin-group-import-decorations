/**
 * @fileoverview Group Import Decorations in React Projects
 * @author fl427
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");

module.exports  = {
    rules: {
        'group-import-decorations': require('./rules/eslint-plugin-group-import-decorations')
    },
}



