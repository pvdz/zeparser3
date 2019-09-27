import fs from 'fs';

import {testZeParser} from './parse_zeparser.mjs';
import {testBabel} from './parse_babel.mjs';
import {testAcorn} from './parse_acorn.mjs';

const USE_BUILD = process.argv.includes('-b');
const ZEPARSER_DEV_FILE = '../src/zeparser.mjs';
const ZEPARSER_PROD_FILE = '../build/build_w_ast.mjs';

(async function(){
  let zeparser = (await import(USE_BUILD ? ZEPARSER_PROD_FILE : ZEPARSER_DEV_FILE)).default;

  let parsers = [
    {name: 'zeparser', parse: (code, testVariant) => testZeParser(zeparser, code, testVariant, true)}, // zeparser, code, testVariant, enableAnnexb
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
  ];

  files.forEach(({path, code, mode}) => {
    console.group('File:', code.length, 'bytes:', path);
    parsers.forEach(({name, parse}) => {
      console.time('Parse time for ' + name);
      try {
        parse(code, mode);
      } catch (e) {
        console.log('Failed!', name, '->', path, '::', e.message);
      }
      console.timeEnd('Parse time for ' + name);
    });
    console.groupEnd();
  });

})();

