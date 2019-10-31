// Run this through `./t d`

import zeparser from '../build/build_w_ast.mjs';
import {COLLECT_TOKENS_SOLID, COLLECT_TOKENS_NONE , GOAL_MODULE, GOAL_SCRIPT} from "../src/zetokenizer.mjs";
import fs from 'fs';

// let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es5.moment-with-locales.js', 'utf8');
// let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es5.webkit.npm.1.0.0.js', 'utf8');
// let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es3.fb.newsfeed.min.js', 'utf8');
// let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es5.js1k.js', 'utf8');
// let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es6.angular-compiler.js', 'utf8'); // module!
let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es6.material-ui-core.js', 'utf8');
// let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es6.mljs.js', 'utf8');
// let input = fs.readFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf/es6.tiny.js', 'utf8');


function testZeParser(zeparser, code, testVariant, enableAnnexb) {
  return zeparser(
    code,
    testVariant === 'module' ? GOAL_MODULE : GOAL_SCRIPT,
    COLLECT_TOKENS_NONE,
    {
      strictMode: testVariant === 'strict',
      webCompat: enableAnnexb || testVariant === 'web',
      // targetEsVersion: tob.inputOptions.es,
      babelCompat: false,
      acornCompat: false,

      $log: () => {},
      $warn: () => {},
      $error: () => {},
    },
  );
}

console.time('Parse time');
testZeParser(zeparser, input, 'sloppy', true);
console.timeEnd('Parse time');
