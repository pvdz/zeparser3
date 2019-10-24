// Benchmark core file. This file basically gets called with N=x and will execute a parse test for one file for that step
// I run this through `./t p --build`. This will make ./t call this script in an indefinite loop, passing on incrementing
// values for N until it exits non-zero, and then loops again from N=1. Infinitely.

// You can call this script directly
// (This is not the same because the same node instance is used for all tests so the parsers pollute the GC for each other!);
//    node --experimental-modules --max-old-space-size=8192 tests/perf.mjs -b
//    node --single-threaded --single-threaded-gc --predictable --predictable-gc-schedule --no-compilation-cache --experimental-modules --max-old-space-size=8192 tests/perf.mjs -b

import fs from 'fs';
import {performance} from 'perf_hooks';
import path from 'path';

import {testZeParser} from './parse_zeparser.mjs';
import {testBabel} from './parse_babel.mjs';
import {testAcorn} from './parse_acorn.mjs';

let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

const USE_BUILD = process.argv.includes('-b');
const RESET_BASELINE = process.argv.includes('--reset');
const IMPROVE_BASELINE = process.argv.includes('--record');
let N = process.argv.includes('n') ? parseInt(process.argv[process.argv.indexOf('n') + 1]) : -1;
const Nstart = N;
const NO_HEADER = process.argv.includes('--no-header');
const ZEPARSER_DEV_FILE = path.resolve('./src/zeparser.mjs');
const ZEPARSER_PROD_FILE = path.resolve('./build/build_w_ast.mjs');

if (!Number.isInteger(N)) throw new Error('The argument for `n` must be a number');

const BOLD = '\x1b[;1;1m';
const BOLD_GREEN = '\x1b[1;32m';
const DIM = '\x1b[30;1m';
const DIM_RED = '\x1b[;31m';
const DIM_GREEN = '\x1b[;32m';
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
    if (obj === undefined) throw new Error('no');
    obj.code = await fs.promises.readFile(obj.path, 'utf8');
    return obj;
  }

  // See ./perf_data.json for example. I tuck it under /ignore because webstorm goes haywire trying to reindex the file while running the benchmark and updating it
  let data = JSON.parse(fs.readFileSync(path.join(dirname, '../ignore/perf_data.json'), 'utf8'));

  // Note: the baselines are lowest times for my machine ... ymmv. But it helps to approximate deviation by system load
  let files = [
    // Sanity test and quick overhead baseline check. Basically this file in an earlier iteration.
    await read(data['es6.tiny']),

    // A million corner cases
    await read(data['es5.js1k']),

    // From babel repo
    await read(data['es6.material-ui-core']),
    await read(data['es6.angular-compiler']),

    // Unicode heavy strings / regexes
    await read(data['es5.moment-with-locales']),

    // Random
    await read(data['es6.mljs']),

    // old... 20mb
    USE_BUILD && await read(data['es5.webkit']),
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
    bd: 15,
    ad: 10,
  };
  function print(name, baseline, time) {
    let base = baseline[name];
    let zbase = baseline.zepar;
    let bzd = zbase - base;
    let ftime = Math.floor(time);
    let td = ftime - base;
    let tdza = ftime - baseline.acorn;
    let tdzb = ftime - baseline.babel;

    console.log(
      // Title
      N >= 0 ? DIM + 'n=' + String(Nstart).padStart(2, '0') + RESET : '',
      ('Parse time for ' + name + ': ').padEnd(cols.parser, ' '),
      // Basline for this parser
      DIM + (''+base).padStart(cols.base, ' ') + RESET,
      // Delta between baseline of other parsers and baseline of zeparser
      DIM + (name === 'zepar' ? '' : (bzd > 0 ? '+' : '') + bzd + '').padStart(cols.bzd, ' ') + RESET,
      // Current result of current parser
      (time + ' ms').padStart(cols.time, ' '),
      // Delta between current result and baseline result (of current parser)
      (td < 0 ? (name === 'zepar' ? BOLD_GREEN : DIM_GREEN) : name === 'zepar' ? BOLD : DIM) + (' (b ' + (td > 0 ? '+' : '-') + ' ' + Math.abs(td) + ' ms)').padStart(cols.td, ' ') + RESET,
      '       ',
      // Delta between current result of zeparser and baseline of acorn/babel
      DIM + (name === 'zepar' ? (tdzb <= 0 ? DIM_GREEN : DIM_RED) + ('bb ' + (tdzb < 0 ? '-' : '+') + ' ' + Math.abs(tdzb) + 'ms').padEnd(cols.bd, ' ') : ''.padEnd(cols.bd, ' ')) + RESET,
      DIM + (name === 'zepar' ? (tdza <= 0 ? DIM_GREEN : DIM_RED) + ('aa ' + (tdza < 0 ? '-' : '+') + ' ' + Math.abs(tdza) + 'ms').padEnd(cols.ad, ' ') : ''.padEnd(cols.ad, ' ')) + RESET,
      ''
    );
  }

  if (!NO_HEADER && N <= 1 && N != -2) {
    console.log('Using parser from:', USE_BUILD ? ZEPARSER_PROD_FILE : ZEPARSER_DEV_FILE);
    console.log('\n');
    console.log(' ',
      'parser    '.padStart(cols.parser, ' '),
      'base'.padStart(cols.base, ' '),
      'bzd'.padStart(cols.bzd, ' '),
      'time'.padStart(cols.time, ' '),
      'td'.padStart(cols.td, ' '),
      'ad'.padStart(cols.ad, ' '),
      'bd'.padStart(cols.bd, ' '),
      '\n'
    );
  }

  files.forEach(({path, code, mode, baseline}, filei) => {
    if (N <= 1) console.log('File:', code.length, 'bytes:', path);
    parsers.forEach(({name, parse}) => {
      if (--N > 0) return;
      let t1 = performance.now();
      try {
        parse(code, mode);
      } catch (e) {
        console.log('Failed!', name, '->', path, '::', e.message);
      }
      let t2 = performance.now();
      let time = t2 - t1;
      let b = baseline[name];
      let t = p2(time);
      print(name, baseline, t);
      if (RESET_BASELINE || t < b) baseline[name] = Math.floor(t);
      if (N >= 0) {
        if ((RESET_BASELINE || (IMPROVE_BASELINE && t < b))) {
          for (let key in data) delete data[key].code;
          fs.writeFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf_data.json', JSON.stringify(data));
        }
        // Signal ./t that this script is not finished, just the current run
        process.exit(0);
      }
    });
  });
})().then(() => {
  if (N >= 0) {
    // signals ./t that this script is done
    // console.log('exit(1)')
    process.exit(1);
  }
});
