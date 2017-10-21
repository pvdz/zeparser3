#!/usr/bin/env node

// use https://astexplorer.net/ for ast comparisons

let fs = require('fs');

let {
  MODE_MODULE,
  MODE_SCRIPT,

  toPrint,
} = require('./utils.js');
let { default: ZeParser,
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,
} = require('../src/zeparser'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)

let ZeParserBuild = require('../build/build.js').default;

let {
  $EOF,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)

let dir = __dirname + '/testcases/parser';
let files = [];
function rdr(path, file) {
  if (fs.statSync(path + file).isFile(path + file)) files.push(path + file);
  else fs.readdirSync(path).forEach(s => rdr(path + file, s));
}
rdr(dir, '/');


let describes = files.map(path => ({from:path, describe:require(path)}));

let cases = [];
let X = (parentDesc, from, desc, func) => func(X.bind(undefined, parentDesc + ' | ' + desc, from), Y.bind(undefined, parentDesc + ' | ' + desc, from));
let Y = (parentDesc, from, desc, obj) => cases.push({desc: parentDesc + ' |> ' + desc, from, obj});
describes.forEach(({from, describe}) => X('', from, '', describe));

// todo

// (new) regular expression edge cases. in particular with destructuring patterns and asi
// `[]\n/x` (division)
// `[]\n/x/` (Error)
// `[]\n/x/g` (division)
// (x)/y
// (x)=>/y/
// for (/x/ in y); (Illegal lhs)
// x => {} / y  (Illegal; {} is a body statement, has no value. no prod parses it)


let checkAST = true;
let parserDesc = '';
function all(parser, tests) {
  for (let {desc, from, obj:test} of tests) {
    if (typeof test === 'string') console.log(' --- ' + test + ' --- ');
    else if (Array.isArray(test)) all(parser, test);
    else one(parser, test);
  }
}
function one(parser, testObj) {
  let {code} = testObj;
  ++testi;
  if (_one(parser, '   ', code, testObj)) {
    _one(parser, '[a]', '\n' + code, testObj);
    _one(parser, '[b]', code + '\n', testObj);
    _one(parser, '[c]', ' ' + code, testObj);
    _one(parser, '[d]', code + ' ', testObj);
  }
}
function _one(Parser, testSuffix, code, testObj) {
  let {mode} = testObj;
  // by default test both module and script parsing modes
  // if overridden, only parse that mode
  if (mode !== undefined && mode !== MODE_SCRIPT && mode !== MODE_MODULE) throw new Error('test setup problem: invalid mode');
  if (mode !== undefined) mode = [mode];
  else mode = [MODE_SCRIPT, MODE_MODULE];
  mode.forEach(m => __one(Parser, testSuffix + '[' + (m === MODE_SCRIPT ? 'Script' : 'Module') + ']', code, m, testObj));
}
function __one(Parser, testSuffix, code, mode, {ast, SCRIPT: scriptModeObj, MODULE: moduleModeObj, throws, desc, tokens}) {
  ++testj;

                                                          //if (testj !== 309) return;
  testSuffix += '['+testj+']';

  // goal specific overrides
  if (mode === MODE_SCRIPT && scriptModeObj) {
    if (scriptModeObj.throws) throws = scriptModeObj.throws;
    if (scriptModeObj.ast) ast = scriptModeObj.ast;
    if (scriptModeObj.tokens) tokens = scriptModeObj.tokens;
  }
  if (mode === MODE_MODULE && moduleModeObj) {
    if (moduleModeObj.throws) throws = moduleModeObj.throws;
    if (moduleModeObj.ast) ast = moduleModeObj.ast;
    if (moduleModeObj.tokens) tokens = moduleModeObj.tokens;
  }

  let prefix = parserDesc + ': ' + testi + testSuffix;

  let wasError = '';
  let stack;
  try {
    var obj = Parser(code, mode, COLLECT_TOKENS_SOLID);
    e = new Error();
  } catch(e) {
    wasError = e.message;
    var obj = '' + e.stack;
    e = stack;
  }
  stack = e.stack;

  let passed = false;
  if (!tokens || (!throws && !ast)) {
    throw new Error(`Bad tst case: Missing expected token list, or ast|throws for: \`${toPrint(code)}\``);
  } else if (typeof obj === 'string') {
    if (!throws && wasError) {
      THROW(prefix, 'unexpected CRASH', code, stack);
      console.log('Thrown error:', wasError);
      ++fail;
      ++crash;
    } else if (wasError && wasError.indexOf(throws) >= 0) {
      console.log(`${prefix} PASS: \`${toPrint(code)}\` :: (properly throws)`);
      ++pass;
      passed = true;
    } else if (wasError) {
      THROW(prefix, 'thrown message mismatch', code, stack);
      console.log('Thrown error:', wasError);
      console.log('Expected error message to contain: "' + throws + '"');
      ++fail;
    }
  } else if (throws) {
    THROW(prefix, '_failed_ to throw', code, stack);
    console.log('Expected error message to contain: "' + throws + '"');
    ++fail;
  } else if (checkAST && JSON.stringify(ast) !== JSON.stringify(obj.ast)) {
    THROW(prefix, 'AST mismatch', code, stack);

    console.log('Actual ast:', require('util').inspect(obj.ast, false, null));

    let s1 = JSON.stringify(ast);
    let s2 = JSON.stringify(obj.ast);
    let max = Math.max(s1.length, s2.length);
    let n = 0;
    let step = 200;
    let steps = 0;
    while (n < max) {
      let x1 = s1.slice(Math.min(n, s1.length), Math.min(n + step, s1.length));
      let x2 = s2.slice(Math.min(n, s2.length), Math.min(n + step, s2.length));

      console.log('want[' + steps + ']:', x1 === x2 ? 'SAME' : 'DIFF', x1);
      console.log('real[' + steps + ']:', x1 === x2 ? 'SAME' : 'DIFF', x2);
      n += step;
      ++steps;
    }

    ++fail;
  } else if (obj.tokens.map(t => t.type).join(' ') !== [...tokens, $EOF].join(' ')) {
    THROW(prefix, 'TOKEN mismatch', code, stack);

    console.log('Actual tokens:', obj.tokens.map(t => debug_toktype(t.type)).join(' '));
    console.log('Wanted tokens:', [...tokens, $EOF].map(debug_toktype).join(' '));
    ++fail;
  } else {
    console.log(`${prefix} PASS: \`${toPrint(code)}\``);
    ++pass;
    passed = true;
  }

  if (STOP_AFTER_FAIL && fail) throw 'stopped';
  return passed;
}

function THROW(prefix, errmsg, code, stack) {
  console.log(`${prefix} ERROR: \`${toPrint(code)}\` :: ` + errmsg);
  console.log('Stack:', stack);
}

const STOP_AFTER_FAIL = true;
let pass = 0;
let fail = 0;
let crash = 0;
let testi = 0;
let testj = 0;
try {
  [
    [ZeParser, true, 'dev build'],
    //[ZeParserBuild, false, 'prod build'],
  ].forEach(([parser, hasAst, desc],i) => {
    checkAST = hasAst;
    parserDesc = '## ' + desc;
    all(parser, cases);
  });
} finally {
  console.log(`
  #####
  passed: ${pass}, crashed: ${crash}, failed: ${fail-crash}
  `);
}
