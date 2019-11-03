import fs from 'fs';
import path from 'path';

import Par from '../src/zeparser.mjs';
import {GOAL_MODULE} from "../src/zetokenizer.mjs";
import {scrub} from './scrub.mjs';
import Terser from 'terser';

const ASSERTS = false;
const COMMENTS = true;

// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

const SCRUB_OTHERS = process.argv.includes('--no-compat'); // force all occurrences of compatAcorn and compatBabel to false
const NATIVE_SYMBOLS = process.argv.includes('--native-symbols'); // Replace `PERF_$` with `%`?
const NO_MIN = NATIVE_SYMBOLS || process.argv.includes('--no-min'); // skip minifier (cant use minifier with native symbols regardless)

if (NATIVE_SYMBOLS) console.log('Will convert `PERF_$` prefixed functions into `%` prefixed native functions...!');

(async() => {
  let sources = (await Promise.all([
    await fs.promises.readFile(path.join(dirname, '../src/tools/perf.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/charcodes.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/utils.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/tokentype.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/lexerflags.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/zetokenizer.mjs')),
    await fs.promises.readFile(path.join(dirname, '../src/zeparser.mjs')),
  ]));

  Promise.all([
    generate('build_w_ast.mjs', ASSERTS, true, COMMENTS),
    // generate('build_no_ast.js', ASSERTS, false, COMMENTS),
  ]);

  async function generate(filename, keepAsserts, keepAst, keepComments) {

    let [perf, charcodes, utils, tokentype, lexerflags, zetokenizer, zeparser] = sources.map(processSource);

    let build = `

${!NATIVE_SYMBOLS ? '' : `
const allFuncs = [];
// <perf.js>
${perf}
// </perf.js>
`}

const exp = (function(){ // otherwise terser wont minify the names ...

// <charcodes.js>
${charcodes}
// </charcodes.js>

// <utils.js>
${utils}
// </utils.js>

// <tokentype.js>
${tokentype}
// </tokentype.js>

// <lexerflags.js>
${lexerflags}
// </lexerflags.js>

// <zetokenizer.js>
${zetokenizer}
// </zetokenizer.js>

// <zeparser.js>
${zeparser}
// </zeparser.js>

return {
  ZeParser,
  toktypeToString,
};
})();

const {
  ZeParser,
  toktypeToString,
} = exp;

export default ZeParser;
export {
  ZeParser,
  toktypeToString,
${NATIVE_SYMBOLS?`
  PERF_OptimizeFunctionOnNextCall,
  PERF_getStatus,
  PERF_HasFastProperties,
  PERF_HaveSameMap,
  PERF_hasFastSmiElements,
  PERF_hasFastObjectElements,
  PERF_hasFastDoubleElements,
  PERF_hasDictionaryElements,
  PERF_hasFastHoleyElements,
  PERF_haveSameMap,
  PERF_isValidSmi,
  PERF_isSmi,
  PERF_hasFastSmiOrObjectElements,
  PERF_hasSloppyArgumentsElements,
  PERF_CollectGarbage,
  PERF_DebugPrint,
  allFuncs,
`:''}
};
`;

    // Sanity check, won't work with native symbols (obviously)
    if (!NATIVE_SYMBOLS) {
      Par(build, GOAL_MODULE, false, {
        webCompat: false, // Probably...
        fullErrorContext: true,

        // $log: () => {},
        // $warn: () => {},
        // $error: () => {},
      });
    }

    let sizeBefore = build.length;
    if (NO_MIN) {
      console.log('Skipping minification step');
    } else {
      console.time('Terser time');
      console.log('Minification through Terser...');
      let t = Terser.minify(build, {
        mangle: true,
        compress: true,
        module: true
      });
      if (t.error) console.log('Terser threw an error:'),console.log(t.error);
      build = t.code;
      console.timeEnd('Terser time');
    }

    let outDir = path.join(dirname, '../build/');
    if (!fs.existsSync(outDir)) await fs.promises.mkdir(outDir);
    let outPath = path.join(outDir, filename);
    await fs.promises.writeFile(outPath, build);

    function processSource(source) {
      source = source
      .toString('utf-8')
      .replace(/\/\/ <SCRUB DEV>([\s\S]*?)\/\/ <\/SCRUB DEV>/g, '// scrubbed dev\n')
      ;
      if (!keepAsserts) {
        source = source
        .replace(/\/\/ <SCRUB ASSERTS>([\s\S]*?)\/\/ <\/SCRUB ASSERTS>/g, '"003 assert scrubbed"')
        .replace(/\/\/ <SCRUB ASSERTS TO COMMENT>([\s\S]*?)\/\/ <\/SCRUB ASSERTS TO COMMENT>/g, '/* 004 assert scrubbed */')
        ;
      }

      let z = Par(source, GOAL_MODULE, true, {
        webCompat: false, // Probably...
        // astRoot: ast,
        // tokenStorage: tokens,
        // getTokenizer: tok => tokenizer = tok,
        // targetEsVersion: ES || Infinity,
        fullErrorContext: true,

        $log: () => {},
        $warn: () => {},
        $error: () => {},
      });

      source = scrub(z.ast);

      return source;
    }

    console.log('Wrote', outPath, '(' + sizeBefore + ' -> ' + build.length + ' bytes)');
  }

  console.log('finished');
})();
