#!/usr/bin/env node
// node --sampling_heap_profiler_suppress_randomness ./tests/perf/lexer/run.js

//import ZeTokenizer, {
let { default: ZeTokenizer,
  $EOF,
  $ERROR,

  STRICT_MODE,
  FOR_REGEX,
  IN_TEMPLATE,
} = require('../../../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';


function run() {
  let code = require('fs').readFileSync(__dirname + '/../sources/fuzzed-tokens.js').toString();
  let tok = ZeTokenizer(code, false);

  console.log('running...');
  console.time('finished');
  let slashIsRegex = true;
  let strictMode = false;
  let fromTemplate = true;

  let count = 0;
  let errors = 0;
  let last;
  do {
    last = tok(0 | (slashIsRegex ? FOR_REGEX : 0) | (strictMode ? STRICT_MODE : 0) | (fromTemplate ? IN_TEMPLATE : 0), true);
    ++count;
    if (last.type === $ERROR) ++errors;
  } while (last.type !== $EOF);
  console.timeEnd('finished');

  //tok.deopt();

  console.log('Parsed', code.length, 'bytes into', count, 'tokens, found', errors, 'errors');
}
run();
