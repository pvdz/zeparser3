import fs from 'fs';
import {performance} from 'perf_hooks';

import {testZeParser} from './parse_zeparser.mjs';
import {testBabel} from './parse_babel.mjs';
import {testAcorn} from './parse_acorn.mjs';

const USE_BUILD = process.argv.includes('-b');
const ZEPARSER_DEV_FILE = '../src/zeparser.mjs';
const ZEPARSER_PROD_FILE = '../build/build_w_ast.mjs';

(async function(){
  let zeparser = (await import(USE_BUILD ? ZEPARSER_PROD_FILE : ZEPARSER_DEV_FILE)).default;

  let parsers = [
    {name: 'zepar', parse: (code, testVariant) => testZeParser(zeparser, code, testVariant, true)}, // zeparser, code, testVariant, enableAnnexb
    {name: 'babel', parse: (code, testVariant) => testBabel(code, testVariant)}, // code, mode
    {name: 'acorn', parse: (code, testVariant) => testAcorn(code, testVariant, undefined)}, // code, mode, version
  ];

  async function read(obj) {
    obj.code = await fs.promises.readFile(obj.path, 'utf8');
    return obj;
  }

  let files = [
    // Sanity test and quick overhead baseline check. Basically this file in an earlier iteration.
    await read({path: 'ignore/perf/es6.tiny.js', mode: 'module'}),

    // A million corner cases
    await read({path: 'ignore/perf/es5.js1k.js', mode: 'web'}),

    // From babel repo
    await read({path: 'ignore/perf/es6.material-ui-core.js', mode: 'web'}),
    await read({path: 'ignore/perf/es6.angular-compiler.js', mode: 'module'}),

    // Random
    await read({path: 'ignore/perf/es5.moment-with-locales.js', mode: 'web'}),
    await read({path: 'ignore/perf/es6.mljs.js', mode: 'module'}),

    // old... 20mb
    USE_BUILD && await read({path: 'ignore/perf/es5.webkit.npm.1.0.0.js', mode: 'web'}),
  ].filter(Boolean);

  files.forEach(({path, code, mode}) => {
    console.group('File:', code.length, 'bytes:', path);
    let ztime = 0;
    parsers.forEach(({name, parse}) => {
      let t1 = performance.now();
      try {
        parse(code, mode);
      } catch (e) {
        console.log('Failed!', name, '->', path, '::', e.message);
      }
      let t2 = performance.now();
      let time = t2 - t1;
      if (ztime === 0) {
        if (name !== 'zepar') throw 'z should run first so we can delta against the rest';
        ztime = time;
        console.log('Parse time for ' + name + ': ' + (Math.round(ztime * 100)/100) + ' ms');
      } else {
        let delta = time - ztime;
        console.log('Parse time for ' + name + ': ' + (Math.round(time * 100)/100) + ' ms (' + (delta > 0 ? '+' : '') + (Math.round(delta * 100)/100) + ' ms)');
      }
    });
    console.groupEnd();
  });

})();

