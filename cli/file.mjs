#!/usr/bin/env node

/*
git clone https://github.com/babel/babel.git
rm output.js
find ~/apps/babel -name *.js -exec node -e "let fn = process.argv[1]; if (fn.includes('/test/')) {console.log('skipped', fn); process.exit();} console.log( fn); require('fs').appendFileSync('output.js', '// <from> ' + fn + '\n\n' + fs.readFileSync(fn, 'utf8').replace(/^(#!.*?\\n)/gm, '// $1').replace(/^(import type .*?\\n)/gm, '// $1') + '\n// </from> ' + fn + '\n\n');" {} \;
yarn add @babel/core @babel/cli
node_modules/.bin/babel --no-babelrc --plugins @babel
*/
import fs from 'fs';
import path from 'path';


// ((function (_, ...names) {
//   names.forEach(fn => {
//     if (fn.includes('/test/')) {
//       console.log('skipped', fn);
//       return;
//     }
//     console.log(fn);
//     require('fs')
//       .appendFileSync('output.js',
//         '// <from> ' + fn + '\n\n' +
//         fs
//           .readFileSync(fn, 'utf8')
//           .replace(/^#?\n/gm, '')
//           .replace(/^import type .*?\n/gm, '') +
//         '\n// </from> ' + fn + '\n\n'
//       );
//   });
// })(process.argv);


// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

(async function () {
  let flagIndex = process.argv.indexOf('-p');
  let parse;
  switch (process.argv[flagIndex+1]) {
    case 'ast':
      console.log('Loading parser: prod, with ast');
      parse = await (async () => {
        try {
          let {default: parser, GOAL_MODULE, GOAL_SCRIPT} = await import(path.join(dirname, '../build/build_w_ast.js'));
          return code => parser(code, GOAL_SCRIPT);
        } catch(e) {
          console.log('Ignoring prod build test; file could not be loaded');
        }
      })();
      break;

    case 'no-ast':
      console.log('Loading parser: prod, no ast');
      parse = await (async () => {
        try {
          let {default: parser, GOAL_MODULE, GOAL_SCRIPT} = await import(path.join(dirname, '../build/build_w_ast.js'));
          return code => parser(code, GOAL_SCRIPT);
        } catch(e) {
          console.log('Ignoring prod build test; file could not be loaded');
        }
      })();
      break;

    case 'dev':
    default:
      console.log('Loading parser: dev');
      parse = await (async () => {
        let {default: parser, GOAL_MODULE, GOAL_SCRIPT} = await import(path.join(dirname, '../src/zeparser.mjs'));
        return code => parser(code, GOAL_SCRIPT);
      })();
  }

  console.log('Parser:', parse);

  let fn = process.argv[process.argv.length - 1];
  let rfn = path.resolve(fn);
  let code = await fs.promises.readFile(rfn, 'utf8');

  console.log('Content len:', code.length, 'Input file:', rfn);

  let out = parse(code);
  console.log(out);

})().then(() => console.log('good ending')).catch(e => console.log('bad ending', e));

