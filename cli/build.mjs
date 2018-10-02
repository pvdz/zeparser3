#!/usr/bin/env node

let fs = require('fs');

const ASSERTS = false;
const AST = false;

let utils = scrub(fs.readFileSync('src/utils.js'));
let zeparser = scrub(fs.readFileSync('src/zeparser.js'));
let zetokenizer = scrub(fs.readFileSync('src/zetokenizer.js'));

/*
// some day ...

let utils = scrub(await fs.readFile('src/utils.js'));
let zeparser = scrub(await fs.readFile('src/zeparser.js'));
let zetokenizer = scrub(await fs.readFile('src/zetokenizer.js'));
*/

let build = `
"use strict";

// <utils.js>
${utils}
// </utils.js>

// <zetokenizer.js>
${zetokenizer}
// </zetokenizer.js>

// <zeparser.js>
${zeparser}
// </zeparser.js>

module.exports = {
  default: ZeParser,
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,
};
`;

fs.writeFileSync('build/build.js', build);

function scrub(s) {
  s = s
    .toString('utf-8')
    .match(/\/\/ <BODY>([\s\S]*)\/\/ <\/BODY>/)[1]
    .replace(/\/\/ <SCRUB DEV>([\s\S]*?)\/\/ <\/SCRUB DEV>/g, '// scrubbed dev\n')
  ;
  if (!ASSERTS) {
    s = s
      .replace(/\/\/ <SCRUB ASSERTS>([\s\S]*?)\/\/ <\/SCRUB ASSERTS>/g, '0x003')
      .replace(/^\s*ASSERT\(.*/mg, '0x001')
      .replace(/ASSERT_(skip\w+)\(.*?, (\w+)/g, '$1($2')
      .replace(/ASSERT_skip\(.*?\)/g, 'skip()')
    ;
  }
  if (!AST) {
    s = s
      .replace(/\/\/ <SCRUB AST>([\s\S]*?)\/\/ <\/SCRUB AST>/g, '0x004')
      .replace(/^\s*AST_.*/mg, '0x002')
    ;
  }

  return s;
}