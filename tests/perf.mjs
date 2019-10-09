import fs from 'fs';
import {performance} from 'perf_hooks';

import {testZeParser} from './parse_zeparser.mjs';
import {testBabel} from './parse_babel.mjs';
import {testAcorn} from './parse_acorn.mjs';

const USE_BUILD = process.argv.includes('-b');
const ZEPARSER_DEV_FILE = '../src/zeparser.mjs';
const ZEPARSER_PROD_FILE = '../build/build_w_ast.mjs';

const BOLD = '\x1b[;1;1m';
const BOLD_GREEN = '\x1b[1;32m';
const DIM = '\x1b[30;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

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

  // Note: the baselines are lowest times for my machine ... ymmv. But it helps to approximate deviation by system load
  let files = [
    // Sanity test and quick overhead baseline check. Basically this file in an earlier iteration.
    await read({path: 'ignore/perf/es6.tiny.js', mode: 'module', baseline: {zepar: 4, babel: 5, acorn: 4}}),

    // A million corner cases
    await read({path: 'ignore/perf/es5.js1k.js', mode: 'web', baseline: {zepar: 110, babel: 72, acorn: 56}}),

    // From babel repo
    await read({path: 'ignore/perf/es6.material-ui-core.js', mode: 'web', baseline: {zepar: 310, babel: 290, acorn: 194}}),
    await read({path: 'ignore/perf/es6.angular-compiler.js', mode: 'module', baseline: {zepar: 349, babel: 239, acorn: 181}}),

    // Random
    await read({path: 'ignore/perf/es5.moment-with-locales.js', mode: 'web', baseline: {zepar: 135, babel: 63, acorn: 77}}),
    await read({path: 'ignore/perf/es6.mljs.js', mode: 'module', baseline: {zepar: 163, babel: 103, acorn: 111}}),

    // old... 20mb
    USE_BUILD && await read({path: 'ignore/perf/es5.webkit.npm.1.0.0.js', mode: 'web', baseline: {zepar: 16016, babel: 14847, acorn: 9806}}),
  ].filter(Boolean);


  function p2(x) {
    return Math.round(x * 100) / 100;
  }
  let cols = {
    parser: 25,
    base: 7,
    bzd: 10,
    time: 20,
    td: 17,
    tzd: 15,
    btzd: 10
  };
  function print(name, base, zbase, time, ztime) {
    let bzd = zbase - base;
    let td = Math.floor(time) - base;
    let tzd = ztime - time;
    let btzd = tzd - bzd;
    console.log(
      ('Parse time for ' + name + ': ').padEnd(cols.parser, ' '),
      DIM + (''+base).padStart(cols.base, ' ') + RESET,
      DIM + (name === 'zepar' ? '' : (bzd > 0 ? '+' : '') + bzd + '').padStart(cols.bzd, ' ') + RESET,
      (time + ' ms').padStart(cols.time, ' '),
      (td < 0 ? BOLD_GREEN : name === 'zepar' ? BOLD : DIM) + (' (b ' + (td > 0 ? '+' : '-') + ' ' + Math.abs(td) + ' ms)').padStart(cols.td, ' ') + RESET,
      (name === 'zepar' ? '' : (Math.floor(tzd) === 0 ? '  ' : '') + (' (' + (Math.floor(tzd) === 0 ? DIM : tzd > 0 ? RED + '+' : GREEN + '') + Math.floor(tzd) + ' ms' + RESET + ')').padStart(cols.tzd + (RED.length + RESET.length), ' ')),
      (name === 'zepar'
        ? ''.padStart(cols.btzd, ' ')
        : btzd < 0
          ? (' (' + GREEN + Math.floor(btzd) + RESET + ')').padStart(cols.btzd + GREEN.length + RESET.length, ' ')
          : (' (' + DIM + Math.floor(btzd) + RESET + ')').padStart(cols.btzd + DIM.length + RESET.length, ' ')
      ),
      ''
    );
  }

  console.log('\n');
  console.log(' ',
    'parser    '.padStart(cols.parser, ' '),
    'base'.padStart(cols.base, ' '),
    'bzd'.padStart(cols.bzd, ' '),
    'time'.padStart(cols.time, ' '),
    'td'.padStart(cols.td, ' '),
    'tzd'.padStart(cols.tzd, ' '),
    BOLD + 'btzd'.padStart(cols.btzd, ' ') + RESET,
    '\n'
  );

  files.forEach(({path, code, mode, baseline}) => {
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
      let t = p2(time);
      if (name === 'zepar') {
        if (ztime !== 0) throw 'z should run first so we can delta against the rest';
        ztime = t;
      }
      print(name, baseline[name], baseline.zepar, t, ztime);
    });
    console.groupEnd();
  });
})();
