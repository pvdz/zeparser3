// ./t fuzz

console.log('\n---------------\n');

import {performance} from 'perf_hooks';

import {GOAL_MODULE, GOAL_SCRIPT} from "../../src/zetokenizer.mjs";
import Par from "../../src/zeparser.mjs";

import {
  dumpFuzzOutput,
  warnOsd,
} from './fuzzutils.mjs';
import {generateEsFuzzCode} from './fuzzers/esfuzz.mjs';
import {generateEslumpCode} from './fuzzers/eslump.mjs';
import {
  generateZefuzzCode_classMethods,
  generateZefuzzCode_arrows,
  generateZefuzzCode_bindingPatterns,
} from './fuzzers/zefuzz.mjs';

import {testZePrinter} from "../run_zeprinter.mjs";
import {fuzzAgainstNode} from "./fuzz_against_node.mjs";

console.log('ZeFuzz - a ZeParser fuzzing tool');

let VERBOSE = true;
const NO_PRINTER = process.argv.includes('--no-printer');
if (NO_PRINTER) console.log('-- Not testing ZePrinter');
const TEST_NODE = process.argv.includes('--node');
if (TEST_NODE) console.log('-- Comparing pass/fail to node by compiling a function');
console.log('');

const BOLD = '\x1b[;1;1m';
const DIM = '\x1b[30;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

const FUZZERS = [
  // These functions should be callable without args and return randomly generated source code to test
  generateEsFuzzCode,
  generateEslumpCode,
  generateZefuzzCode_classMethods,
  generateZefuzzCode_arrows,
  generateZefuzzCode_bindingPatterns,
];
const INJECTS = [
  // Newline checks for ASI
  '\n',
  // Newline-forward-slash does regex vs division assertion checks
  '\n/',
  // Newline-regex does regex vs division assertion checks
  '\n/x/',
  // Newline-regex-flag does regex vs division assertion checks
  '\n/x/g',
  // Forward slash also does regex assertion checks
  '/',
  // Equals does assignability / destructuring assertion checks
  '=',
  // Whitespace does general weirdness checks
  ' ',
  // // An odd duck being right-associative but a regular op otherwise (unlike `yield`)
  // '**',
];

let startTick = performance.now();
let lastCounter = 0;
let lastTick = performance.now();
let lastSpeed = 0;
let lastTotalSpeed = 0;

let buffer = [];
let p = (input, trimming) => {
  ++counts.zeparserParsed;
  let z = Par(input, GOAL_SCRIPT, true, {
    strictMode: false,
    webCompat: true,
    // astRoot: ast,
    // tokenStorage: tokens,
    // getTokenizer: tok => tokenizer = tok,
    // targetEsVersion: ES || Infinity,
    fullErrorContext: true,
    templateNewlineNormalization: false, // Fine for fuzzing. This way we can re-use the AST for a zeprinter test

    // Collect output but don't print it in case the retry fails
    $log: (...args) => trimming || buffer.push(args), // shhh
    $warn: (...args) => trimming || buffer.push(args), // shhh
    $error: (...args) => trimming || buffer.push(args), // shhh
  });

  return z;
};

const vlog = console.log;
const log = VERBOSE ? console.log : (...args) => VERBOSE && vlog(...args);
if (VERBOSE) console.log = console.warn = console.error = (...args) => VERBOSE && vlog(...args);

let counts = {
  fuzzedTests: 0, // How many fuzzed inputs were fuzzed?
  fuzzedBytes: 0, // How many input bytes were fuzzed?
  injectedTests: 0, // How many inputs were generated in total (includes derivatives / partials)
  injectionMode: 0, // How often did injection mode run? (should be 1%)
  zeparserParsed: 0, // How often has ZeParser parsed input? (How often has the `p` function been called)
  bytesParsed: 0, // How many bytes has ZeParser parsed?
  zeparserPassedFuzz: 0,
  nodePassedFuzz: 0,
  reduced: 0, // How many cases did we reduce (but not fatal)? This is an expensive step so we need to keep this low
};

let injectionMode = false; // Global: currently parsing input that was deliberately broken? (Only affects stats)
(function(){
  while (true) {
    let from = Math.floor(Math.random() * 3);
    let input = FUZZERS[from]();
    ++counts.fuzzedTests;
    counts.fuzzedBytes += input.length; // sure, "characters", call off the dogs.

    if (cycle(input)) return;

    // In 1% of inputs do brute force breakage tests with chars that are likely to trip the parser (like `/`)
    if (Math.random() < 0.005) {
      injectionMode = true;
      ++counts.injectionMode;
      ++counts.injectedTests;
      for (let i=0; i<input.length; ++i) {
        ++counts.injectedTests;
        let chr = INJECTS[Math.floor(Math.random() * INJECTS.length)];
        let brokenInput = input.slice(0, i) + chr + input.slice(i);
        if (cycle(brokenInput)) return;
      }
      injectionMode = false;
    }
  }
})();
warnOsd('end of fuzzer');
console.log('Test failed. End of fuzzer.');

function parseZeParser(input, counts, trimming) {
  let zefailed = false;
  let z;
  try {
    counts.bytesParsed += input.length;
    z = p(input, trimming);
    if (!injectionMode) ++counts.zeparserPassedFuzz;
  } catch (e) {
    zefailed = e.message;
  }

  let zeparserAsserted = zefailed && zefailed.toLowerCase().includes('assert');
  let zeparserCrashed = !zeparserAsserted && zefailed && !(zefailed.includes('Parser error!') || zefailed.includes('Tokenizer error!'));

  if (zeparserAsserted) {
    dumpFuzzOutput(input, input, zefailed, 'zeparser assertion failed');
    warnOsd('zeparser assertion');
    console.log(BOLD + BLINK + 'ASSERTION FAIL' + RESET);
    process.exit();
  } else if (zeparserCrashed) {
    dumpFuzzOutput(input, input, zefailed, 'zeparser had non-graceful exit');
    warnOsd('zeparser assertion');
    console.log(BOLD + BLINK + 'ZeParser CRASHED HARD' + RESET);
    process.exit();
  }

  return {z, e: zefailed};
}

function cycle(input) {
  input = input
  // https://tc39.github.io/ecma262/#prod-WhiteSpace Normalize whitespace to regular spaces for printing
  .replace(/[\x09\x0b\x0c\xa0\uFEFF]/g, ' ')
  // https://www.compart.com/en/unicode/category/Zs
  .replace(/[\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
  // replace other unicode gunk to an x for printing (we can do separate unicode runs later)
  .replace(/([^\x20-\x7f\n\r])/ug, 'x');
  buffer = [];

  let {z, e: zefailed} = parseZeParser(input, counts, false);

  if (TEST_NODE) {
    fuzzAgainstNode(input, zefailed, counts, injectionMode, parseZeParser);
  }

  if (z && !NO_PRINTER) {
    // Note: this is a very slow test. Easily cuts down efficiency to a third.
    try {
      testZePrinter(input, 'web', true, z.ast, false, false, false);
    } catch (e) {
      dumpFuzzOutput(input, input, zefailed, 'zeprinter failed');
      warnOsd('zeparser assertion');
      process.exit();
    }
  }

  if (!(counts.zeparserParsed % 88)) {
    let t = performance.now();
    let d = t - lastTick;
    if (d >= 1000) {
      let n = counts.fuzzedTests - lastCounter;
      lastSpeed = Math.round(n / (d/1000));
      lastTotalSpeed = Math.round(counts.fuzzedTests / ((t - startTick) / 1000));
      lastCounter = counts.fuzzedTests;
      lastTick = t;
    }

    let totalTime = Math.round((t-startTick)/1000);

    let stats = `
      time: ${totalTime},
      fuzz: ${dotted(counts.fuzzedTests)} being ${dotted(counts.fuzzedBytes)} bytes (${dotted(Math.round(counts.fuzzedBytes/totalTime))} b/s),
      ${dotted(counts.zeparserPassedFuzz)} passed,
      passrate: ${(counts.zeparserPassedFuzz/counts.fuzzedTests*100).toPrecision(2)}%,
      inj-mode: ${dotted(counts.injectionMode)},
      injected: ${dotted(counts.injectedTests)},
      total bytes parsed: ${dotted(counts.bytesParsed)} (${dotted(Math.round(counts.bytesParsed/totalTime))} b/s),
      current: ${lastSpeed} tests/s,
      total: ${lastTotalSpeed} tests/s,
      reduced ${counts.reduced}
    `.replace(/[\n ]+/g, ' ');

    process.stdout.write('\x1b[0G' + stats);
  }

  return false;
}
function dotted(ns) {
  ns = ''+ns;
  let o = '';
  for (let i = ns.length - 1, j = 0; i>=0; --i) {
    o = ns[i] + o;
    if (i && ++j === 3) {
      o = '.' + o;
      j = 0;
    }
  }
  return o;
}
