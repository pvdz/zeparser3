#!/usr/bin/env node
// node --sampling_heap_profiler_suppress_randomness ./tests/perf/lexer/run.js

let { default: ZeTokenizer,
  $EOF,
  $ERROR,

  LF_STRICT_MODE,
  LF_FOR_REGEX,
  LF_IN_TEMPLATE,
  LF_NO_FLAGS,
  RETURN_ANY_TOKENS,
} = require('../../../src/zetokenizer');

function run() {
  let code = require('fs').readFileSync(__dirname + '/../sources/fuzzed-tokens.js').toString();
  let tok = ZeTokenizer(code, 6);

  console.log('running...');
  console.time('finished');
  let slashIsRegex = true;
  let strictMode = false;
  let fromTemplate = true;

  let count = 0;
  let errors = 0;
  let last;
  do {
    last = tok(0 | (slashIsRegex ? LF_FOR_REGEX : LF_NO_FLAGS) | (strictMode ? LF_STRICT_MODE : LF_NO_FLAGS) | (fromTemplate ? LF_IN_TEMPLATE : LF_NO_FLAGS), RETURN_ANY_TOKENS );
    ++count;
    if (last.type === $ERROR) ++errors;
  } while (last.type !== $EOF);
  console.timeEnd('finished');

  //tok.deopt();

  console.log('Parsed', code.length, 'bytes into', count, 'tokens, found', errors, 'errors');
}
run();
