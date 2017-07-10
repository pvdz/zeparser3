#!/usr/bin/env node
// node --sampling_heap_profiler_suppress_randomness ./tests/perf/parser/run.js

// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#52-the-object-being-iterated-is-not-a-simple-enumerable
// node --trace_opt --trace_deopt --allow-natives-syntax test.js

let {
  default: ZeParser,
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,
//} = require('../../../src/zeparser.js');
} = require('../../../build/build.js');

function run() {
  let code = require('fs').readFileSync(__dirname + '/../../../../zeparser3shadow/webkit.npm.1.0.0.js').toString(); // not included in git. (and out of proj root so IDE doesnt crash on it... ugh)

  console.log('running...');
  console.time('finished');
  let out = ZeParser(code, undefined, COLLECT_TOKENS_NONE);
  console.timeEnd('finished');

  //tok.deopt();

  console.log('Parsed', code.length, 'bytes into', out.tokenCountSolid, 'tokens');
}
run();
