#!/usr/bin/env node

//import {
let {
  toPrint,
} = require('./utils.js');
//} from './utils';
//import ZeParser, {
let { default: ZeParser,
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,
} = require('../src/zeparser'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zeparser';

//import ZeTokenizer, {
let { default: ZeTokenizer,
  $EOF,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

//import blockTests from './testcases/parser/block';
let blockTests = require('./testcases/parser/block');
//import breakTests from './testcases/parser/break';
let breakTests = require('./testcases/parser/break');
//import continueTests from './testcases/parser/continue';
let continueTests = require('./testcases/parser/continue');
//import constTests from './testcases/parser/const';
let constTests = require('./testcases/parser/const');
//import classTests from './testcases/parser/class';
let classTests = require('./testcases/parser/class');
//import debuggerTests from './testcases/parser/debugger';
let debuggerTests = require('./testcases/parser/debugger');
//import doTests from './testcases/parser/do';
let doTests = require('./testcases/parser/do');
//import emptyTests from './testcases/parser/empty';
let emptyTests = require('./testcases/parser/empty');
//import expressionTests from './testcases/parser/expression';
let expressionTests = require('./testcases/parser/expression');
//import exportTests from './testcases/parser/export';
let exportTests = require('./testcases/parser/export');
//import forTests from './testcases/parser/for';
let forTests = require('./testcases/parser/for');
//import functionTests from './testcases/parser/function';
let functionTests = require('./testcases/parser/function');
//import ifTests from './testcases/parser/if';
let ifTests = require('./testcases/parser/if');
//import importTests from './testcases/parser/import';
let importTests = require('./testcases/parser/import');
//import labelTests from './testcases/parser/label';
let labelTests = require('./testcases/parser/label');
//import letTests from './testcases/parser/let';
let letTests = require('./testcases/parser/let');
//import returnTests from './testcases/parser/return';
let returnTests = require('./testcases/parser/return');
//import switchTests from './testcases/parser/switch';
let switchTests = require('./testcases/parser/switch');
//import throwTests from './testcases/parser/throw';
let throwTests = require('./testcases/parser/throw');
//import tryTests from './testcases/parser/try';
let tryTests = require('./testcases/parser/try');
//import varTests from './testcases/parser/var';
let varTests = require('./testcases/parser/var');
//import whileTests from './testcases/parser/while';
let whileTests = require('./testcases/parser/while');
//import withTests from './testcases/parser/with';
let withTests = require('./testcases/parser/with');

let tests = [
  ...blockTests,
  ...breakTests,
  ...continueTests,
  ...constTests,
  ...classTests,
  ...debuggerTests,
  ...doTests,
  ...emptyTests,
  ...exportTests,
  ...expressionTests,
  ...forTests,
  ...functionTests,
  ...ifTests,
  ...importTests,
  ...labelTests,
  ...letTests,
  ...returnTests,
  ...switchTests,
  ...throwTests,
  ...tryTests,
  ...varTests,
  ...whileTests,
  ...withTests,

  // async arrow https://tc39.github.io/ecma262/#prod-AsyncArrowHead
  // (new) regular expression edge cases. in particular with destructuring patterns and asi
  // `[]\n/x` (division)
  // `[]\n/x/` (Error)
  // `[]\n/x/g` (division)
  // (x)/y
  // (x)=>/y/
  // for (/x/ in y); (Illegal lhs)
  // x => {} / y  (Illegal; {} is a body statement, has no value. no prod parses it)

];

function all(tests) {
  for (let test of tests) {
    if (typeof test === 'string') console.log(' --- ' + test + ' --- ');
    else if (Array.isArray(test)) all(test);
    else one(test);
  }
}
function one({code, ast, desc, tokens, stop}) {
  ++testi;
  if (_one('   ', code, ast, desc, tokens, stop)) {
    _one('[a]', '\n' + code, ast, desc, tokens, stop);
    _one('[b]', code + '\n', ast, desc, tokens, stop);
    _one('[c]', ' ' + code, ast, desc, tokens, stop);
    _one('[d]', code + ' ', ast, desc, tokens, stop);
  }
}
function _one(testSuffix, code, ast, desc, tokens, stop=false) {
  let prefix = testi + testSuffix;

                                                          //if (parseInt(testi,10) !== 154) return;

  try {
    var obj = ZeParser(code, undefined, COLLECT_TOKENS_SOLID);
  } catch(e) {
    ++crash;
    var obj = '' + e.stack;
  }

  let passed = false;
  if (typeof obj === 'string') {
    console.log(`${prefix} ERROR: \`${toPrint(code)}\` :: crash`);
    console.log('Stack:', obj);
    ++fail;
  } else if (JSON.stringify(ast) !== JSON.stringify(obj.ast)) {
    console.log(`${prefix} FAIL: \`${toPrint(code)}\` :: AST mismatch`);
    console.log('Actual ast:', require('util').inspect(obj.ast, false, null));

    let s1 = JSON.stringify(ast);
    let s2 = JSON.stringify(obj.ast);
    let max = Math.max(s1.length, s2.length);
    let n = 0;
    let step = 200;
    let steps = 0;
    while (n < max) {
      console.log('want['+steps+']:', s1.slice(Math.min(n, s1.length), Math.min(n + step, s1.length)));
      console.log('real['+steps+']:', s2.slice(Math.min(n, s2.length), Math.min(n + step, s2.length)));
      n += step;
      ++steps;
    }

    ++fail;
  } else if (obj.tokens.map(t => t.type).join(' ') !== [...tokens, $EOF].join(' ')) {
    console.log(`${prefix} FAIL: \`${toPrint(code)}\` :: token mismatch`);
    console.log('Actual tokens:', obj.tokens.map(t => debug_toktype(t.type)).join(' '));
    console.log('Wanted tokens:', [...tokens, $EOF].map(debug_toktype).join(' '));
    ++fail;
  } else {
    console.log(`${prefix} PASS: \`${toPrint(code)}\``);
    ++pass;
    passed = true;
  }

  if (stop) throw 'stop';
  return passed;
}

let pass = 0;
let fail = 0;
let crash = 0;
let testi = 0;
try {
  all(tests);
} finally {
  console.log(`
  #####
  passed: ${pass}, crashed: ${crash}, failed: ${fail-crash}
  `);
}
