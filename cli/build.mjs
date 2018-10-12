#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const ASSERTS = false;
const COMMENTS = true;

// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

(async() => {

  let sources = (await Promise.all([
    await fs.promises.readFile(path.join(dirname, '../src/utils.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/zetokenizer.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/zeparser.mjs')),
  ]));

  Promise.all([
    generate('build_w_ast.js', ASSERTS, true, COMMENTS),
    generate('build_no_ast.js', ASSERTS, false, COMMENTS),
  ]);

  async function generate(filename, keepAsserts, keepAst, keepComments) {

    let [utils, zetokenizer, zeparser] = sources.map(scrub);

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

  GOAL_MODULE,
  GOAL_SCRIPT,
};
`;

    let outPath = path.join(dirname, '../build/', filename);
    await fs.promises.writeFile(outPath, build);

    function scrub(s) {
      s = s
        .toString('utf-8')
        .match(/\/\/ <BODY>([\s\S]*)\/\/ <\/BODY>/)[1]
        .replace(/\/\/ <SCRUB DEV>([\s\S]*?)\/\/ <\/SCRUB DEV>/g, '// scrubbed dev\n')
      ;
      if (!keepAsserts) {
        s = s
          .replace(/\/\/ <SCRUB ASSERTS>([\s\S]*?)\/\/ <\/SCRUB ASSERTS>/g, '"003 assert scrubbed"')
          .replace(/^\s*ASSERT\(.*/mg, '"001 assert scrubbed"')
          .replace(/ASSERT_(skip\w+)\(.*?, (\w+)/g, '$1($2')
          .replace(/ASSERT_skip\(.*?\)/g, 'skip()')
        ;
      }
      if (!keepAst) {
        s = s
          .replace(/\/\/ <SCRUB AST>([\s\S]*?)\/\/ <\/SCRUB AST>/g, '"004 ast scrubbed"')
          // .replace(/^\s*AST_.*/mg, '0x002')
          .replace(/^\s*AST_.*/mg, '"002 ast scrubbed"')
        ;
      }
      if (!keepComments) {
        s = s
          .replace(/^\s*\/\/.*\n/mg, '');
      }

      return s;
    }

    console.log('Wrote', outPath);
  }

  console.log('finished');
})();
