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

const ZEPARSER_DEV_FILE = path.resolve('./src/zeparser.mjs');
const ZEPARSER_PROD_FILE = path.resolve('./build/build_w_ast.mjs');
import ZeParserBuild from '../build/build_w_ast.mjs';
import {testZeParser} from './parse_zeparser.mjs';
import {testBabel} from './parse_babel.mjs';
import {testAcorn} from './parse_acorn.mjs';

let filePath = import.meta.url.replace(/^file:\/\//,'');
let dirname = path.dirname(filePath);

const RESET_BASELINE = process.argv.includes('--reset');
const IMPROVE_BASELINE = process.argv.includes('--record');
let N = process.argv.includes('n') ? parseInt(process.argv[process.argv.indexOf('n') + 1]) : -1;
const Nstart = N;
const NO_HEADER = process.argv.includes('--no-header');
const NO_WEBKIT = process.argv.includes('-q'); // Skip the 20mb benchmark, which takes a long time

if (!Number.isInteger(N)) throw new Error('The argument for `n` must be a number');

const BOLD = '\x1b[;1;1m';
const BOLD_GREEN = '\x1b[1;32m';
const DIM = '\x1b[30;1m';
const DIM_RED = '\x1b[;31m';
const DIM_GREEN = '\x1b[;32m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

let parsers = [
  {name: 'zepar', parse: (code, testVariant) => testZeParser(ZeParserBuild, code, testVariant, true)}, // zeparser, code, testVariant, enableAnnexb
  {name: 'babel', parse: (code, testVariant) => testBabel(code, testVariant)}, // code, mode
  {name: 'acorn', parse: (code, testVariant) => testAcorn(code, testVariant, undefined)}, // code, mode, version
  {name: 'zepa2', parse: (code, testVariant) => testZeParser(ZeParserBuild, code, testVariant, true)}, // zeparser, code, testVariant, enableAnnexb
];

// See ./perf_data.json for example. I tuck it under /ignore because webstorm goes haywire trying to reindex the file while running the benchmark and updating it
// {
//   "es6.tiny": {                            // just a name
//     "path": "ignore/perf/es6.tiny.js",     // path
//     "mode": "module",                      // web | module
//     "baseline": {                          // one entry for each parser (will be fine if its missing)
//       "zepar": 3,
//       "babel": 4,
//       "acorn": 3,
//       "zepa2": 3,
//       ...
//     }
//   },
//   ...
let data = JSON.parse(fs.readFileSync(path.join(dirname, '../ignore/perf_data.json'), 'utf8'));
let files = Object.getOwnPropertyNames(data).filter(s => !!s && (!NO_WEBKIT || s !== 'es5.webkit'));

// Initialize the .code property of each entry to lazy load the input code
files.forEach(title => {
  let obj = data[title];
  Object.defineProperty(obj, 'code', {
    get(){
      let code = fs.readFileSync(obj.path, 'utf8');
      delete obj.code;
      Object.defineProperty(obj, 'code', {
        value: code,
        enumerable: true,
        configurable: true,
      });
      return code;
    },
    enumerable: true,
    configurable: true,
  });
});

function p2(x) {
  return Math.round(x * 100) / 100;
}
let cols = {
  parser: 25,
  prev: 7,
  base: 7,
  bzd: 10,
  time: 20,
  td: 17,
  bd: 15,
  ad: 10,
  dprev: 25,
};
function print(name, baseline, time, lastZtime) {
  let base = baseline[name];
  let zbase = baseline.zepar;
  let bzd = zbase - base;
  let ftime = Math.floor(time);
  let td = ftime - base;
  let tdza = ftime - baseline.acorn;
  let tdzb = ftime - baseline.babel;
  let lzd = Math.floor(time - (lastZtime|0));

  console.log(
    // Title
    N >= 0 ? DIM + 'n=' + String(Nstart).padStart(2, '0') + RESET : '',
    ('Parse time for ' + name + ': ').padEnd(cols.parser, ' '),
    // Basline for this parser
    DIM + (''+(name === 'zepar' ? lastZtime : '')).padStart(cols.prev, ' ') + RESET,
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

    name === 'zepar' ? '' : '  ' + DIM + ((name.startsWith('zepa') ? '' : lzd >= 0 ? DIM_GREEN : DIM_RED) + ('zprev = ' + lastZtime + ' ' + (lzd > 0 ? '+' : '-') + ' ' + Math.abs(lzd) + 'ms').padEnd(cols.dprev, ' ')) + RESET,
    ''
  );
}

if (!NO_HEADER && N <= 1 && N != -2) {
  console.log('Using parser from:', ZEPARSER_PROD_FILE);
  console.log('\n');
  console.log(' ',
    'parser    '.padStart(cols.parser, ' '),
    'prev'.padStart(cols.prev + 3, ' '),
    'base'.padStart(cols.base, ' '),
    'bzd'.padStart(cols.bzd, ' '),
    'time'.padStart(cols.time, ' '),
    'td'.padStart(cols.td, ' '),
    'ad'.padStart(cols.ad, ' '),
    'bd'.padStart(cols.bd, ' '),
    'dprev'.padStart(cols.dprev-10, ' '),
    '\n'
  );
}

files.forEach((title) => {
  let obj = data[title];
  if (N <= 1) {
    console.log('File:', obj.code.length, 'bytes:', obj.path);
  }
  parsers.forEach(({name, parse}) => {
    if (--N > 0) return;

    let {path, code, mode, baseline, last} = obj;
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
    print(name, baseline, t, last);

    let changedStats = IMPROVE_BASELINE;
    if (RESET_BASELINE || t < b) {
      baseline[name] = Math.floor(t);
      changedStats = true;
    }
    if (name === 'zepar') {
      obj.last = Math.floor(t);
      changedStats = true;
    }
    if (N >= 0) {
      if (changedStats) {
        for (let key in data) delete data[key].code;
        fs.writeFileSync('/home/qfox/Dropbox/private/zeparser3/ignore/perf_data.json', JSON.stringify(data));
      }
      // Signal ./t that this script is not finished, just the current run
      process.exit(0);
    }
  });
});
if (N >= 0) {
  // signals ./t that this script is done
  // console.log('exit(1)')
  process.exit(1);
}
