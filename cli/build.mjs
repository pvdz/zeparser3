#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const ASSERTS = false;
const AST = false;
const COMMENTS = true;

// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

(async() => {

  let [utils, zetokenizer, zeparser] = (await Promise.all([
    await fs.promises.readFile(path.join(dirname, '../src/utils.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/zetokenizer.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/zeparser.mjs')),
  ])).map(scrub);

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

  await fs.promises.writeFile('build/build.js', build);

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
        // .replace(/^\s*AST_.*/mg, '0x002')
        .replace(/^\s*AST_.*/mg, '0x002')
      ;
    }
    if (!COMMENTS) {
      s = s
        .replace(/^\s*\/\/.*\n/mg, '');
    }

    return s;
  }

  console.log('finished');
})();
