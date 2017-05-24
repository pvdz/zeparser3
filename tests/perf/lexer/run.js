#!/usr/bin/env node
// node --sampling_heap_profiler_suppress_randomness ./tests/perf/lexer/run.js

//import ZeTokenizer, {
let { default: ZeTokenizer,
  $ASI,
  $COMMENT,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $CRLF,
  $EOF,
  $ERROR,
  $IDENT,
  $NL,
  $NUMBER,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $PUNCTUATOR,
  $REGEX,
  $REGEXU,
  $SPACE,
  $STRING,
  $STRING_DOUBLE,
  $STRING_SINGLE,
  $TAB,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
  $WHITE,

  debug_toktype,
} = require('../../../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';


function run() {
  let code = require('fs').readFileSync(__dirname + '/fuzzed.js').toString();
  let tok = ZeTokenizer(code, false);
  let out;

  console.log('running...');
  console.time('finished');
  let slashIsRegex = true;
  let strictMode = false;
  let fromTemplate = true;

  let count = 0;
  let errors = 0;
  let last;
  do {
    last = tok(slashIsRegex, strictMode, fromTemplate, true);
    ++count;
    if (last.type === $ERROR) ++errors;
  } while (last.type !== $EOF);
  console.timeEnd('finished');
  console.log('Parsed', code.length, 'bytes into', count, 'tokens, found', errors, 'errors');
}
run();
