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
function read(path, file) {
  let combo = path + file;
  //console.log([path, file], combo)
  console.log('read:', path + file);
  if (fs.statSync(combo).isFile()) {
    files.push(combo);
  } else {
    fs.readdirSync(combo + '/').forEach(s => read(combo + '/', s));
  }
}
read(dir, '');

files = files.filter(f =>! (f.indexOf('test262') >= 0));

files.sort((a,b) => {
  // push test262 to the back so our own unit tests can find problems first
  if (a.indexOf('test262') >= 0) return 1;
  if (b.indexOf('test262') >= 0) return -1;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
});
//console.log(files);

let cases = [];
let descStack = [];
files.map(path => {
  let moduleExports = require(path);
  moduleExports(
    (desc, callback) => {
      descStack.push(desc);
      callback();
      descStack.pop();
    },
    (desc, obj) => {
      cases.push({desc: descStack.join(' \u2B9E ') + ' \u2B8A ' + desc + ' \u2B88', from: path, obj})
    }
  );
});

let checkAST = true;
let parserDesc = '';
function all(parser, tests) {
  for (let {desc, from, obj:test} of tests) {
    one(parser, test, desc, from);
  }
}
function one(parser, testObj, desc, from) {
  let {code} = testObj;
  ++testi;
  if (_one(parser, '   ', code, testObj, desc, from)) {
    _one(parser, '[a]', '\n' + code, testObj, desc, from);
    _one(parser, '[b]', code + '\n', testObj, desc, from);
    _one(parser, '[c]', ' ' + code, testObj, desc, from);
    _one(parser, '[d]', code + ' ', testObj, desc, from);
  }
}
function _one(Parser, testSuffix, code, testObj, desc, from) {
  // shorthand for just goal_script/sloppy settings (prevents unncessary object wrapping *shrug*)
  let sloppyScriptOptions = testObj.SLOPPY_SCRIPT;
  if (sloppyScriptOptions) {
    delete testObj.SLOPPY_SCRIPT;
    testObj.SLOPPY = {SCRIPT: sloppyScriptOptions};
  }

  // test both module and script parsing modes. if a test should have different outcomes between them then it should use
  // the MODULE_MODE and SCRIPT_MODE properties to override the expectations.
  [MODE_SCRIPT, MODE_MODULE].forEach(goal => {
    // similarly, run all tests in both sloppy and strict mode. use STRICT and SLOPPY to add exceptions.
    let ms = '[' + (goal === MODE_SCRIPT ? 'Script' : 'Module') + ']';
    if (goal !== MODE_MODULE) { // module mode is ALWAYS strict mode anyways
      __one(Parser, testSuffix + ms, code, goal, override(testObj.STRICT, Object.assign({startInStrictMode:true}, testObj)), desc, from);
    }
    __one(Parser, testSuffix + ms, code, goal, override(testObj.SLOPPY, Object.assign({startInStrictMode:false}, testObj)), desc, from);
  });
}
function override(wantObj, baseObj) {
  if (wantObj) {
    Object.assign(baseObj, wantObj);
    // must cleanup if ast/throws is used from wantObj
    if (wantObj.ast) delete baseObj.throws;
    if (wantObj.throws) delete baseObj.ast;
  }
  return baseObj;
}
function __one(Parser, testSuffix, code = '', mode, testDetails, desc, from) {
  let {
    ast: expectedAst,
    SCRIPT: scriptModeObj,
    MODULE: moduleModeObj,
    throws: expectedThrows,
    tokens: expectedTokens,
    startInStrictMode,
    debug: _debug,
    SKIP,
  } = testDetails;

  ++testj;

                                                          //if (testj !== 3103) return;
  testSuffix += '[' + (startInStrictMode ? 'Strict' : 'Sloppy') + ']';
  testSuffix += '[' + testj + ']';

  // goal specific overrides
  // (throws override ast and ast overrides throws)
  if (mode === MODE_SCRIPT && scriptModeObj) {
    if (scriptModeObj.STRICT || scriptModeObj.SLOPPY) throw new Error('Bad test: Put STRICT/SLOPPY before MODULE mode');
    if (scriptModeObj.throws) {
      expectedAst = undefined;
      expectedThrows = scriptModeObj.throws;
    }
    if ('SKIP' in scriptModeObj) SKIP = scriptModeObj.SKIP;
    if (scriptModeObj.ast) {
      expectedThrows = undefined;
      expectedAst = scriptModeObj.ast;
    }
    if (scriptModeObj.tokens) expectedTokens = scriptModeObj.tokens;
    if (scriptModeObj.startInStrictMode !== undefined) startInStrictMode = scriptModeObj.startInStrictMode;
  }
  if (mode === MODE_MODULE && moduleModeObj) {
    if ('SKIP' in moduleModeObj) SKIP = moduleModeObj.SKIP;
    if (moduleModeObj.STRICT || moduleModeObj.SLOPPY) throw new Error('Bad test: Put STRICT/SLOPPY before MODULE mode');
    if (moduleModeObj.throws) {
      expectedAst = undefined;
      expectedThrows = moduleModeObj.throws;
    }
    if (moduleModeObj.ast) {
      expectedThrows = undefined;
      expectedAst = moduleModeObj.ast;
    }
    if (moduleModeObj.tokens) expectedTokens = moduleModeObj.tokens;
    if (moduleModeObj.startInStrictMode !== undefined) startInStrictMode = moduleModeObj.startInStrictMode;
  }

  let finalTestOptions = {
    code,
    expectedAst,
    expectedThrows,
    expectedTokens,
    startInStrictMode,
    _debug,
    SKIP,
  };

  let prefix = parserDesc + ': ' + testi + testSuffix;

  if (SKIP) {
    console.log(`${prefix} SKIP: \`${toPrint(code)}\``);
    ++skips;
    return;
  }

  let wasError = '';
  let stack;
  try {
    var obj = Parser(code, mode, COLLECT_TOKENS_SOLID, {strictMode: startInStrictMode});
  } catch(f) {
    wasError = f.message;
    var obj = '' + f.stack;
    stack = f.stack;
  }

  if (!expectedTokens || (!expectedThrows && !expectedAst)) {
    LOG_THROW(prefix, `Bad tst case: Missing ${!expectedTokens ? 'expected token list' : 'ast|throws'} for: \`${toPrint(code)}\``, code, stack, desc);
    console.log('testDetails:', testDetails);
    console.log('finalTestOptions:', finalTestOptions);
    ++fail;
  } else if (wasError) {
    if (!expectedThrows) {
      LOG_THROW(prefix, 'unexpected CRASH', code, stack, desc);
      console.log('Thrown error:', wasError);
      ++fail;
      ++crash;
    } else if (wasError.indexOf('Parser error') !== 0 && wasError.indexOf('Tokenizer error') !== 0) {
      LOG_THROW(prefix, 'Unhandled exception path', code, stack, desc);
      console.log('Thrown error:', wasError);
      ++fail;
      ++crash;
    } else if (expectedThrows === true || wasError.indexOf(expectedThrows) >= 0) {
      console.log(`${prefix} PASS: \`${toPrint(code)}\` :: (properly throws)`);
      ++pass;
    } else {
      LOG_THROW(prefix, 'thrown message mismatch', code, stack, desc);
      console.log('Thrown error:', wasError);
      console.log('Expected error message to contain: "' + expectedThrows + '"');
      ++fail;
    }
  } else if (expectedThrows) {
    ++fail;
    LOG_THROW(prefix, '_failed_ to throw ANY error', code, '', desc);
    if (expectedThrows !== true) {
      console.log('Expected an error message containing: "' + expectedThrows + '"');
    }
  } else if (checkAST && expectedAst !== true && JSON.stringify(expectedAst) !== JSON.stringify(obj.ast)) {
    LOG_THROW(prefix, 'AST mismatch', code, '', desc);

    console.log('Actual ast:', require('util').inspect(obj.ast, false, null));

    let s1 = JSON.stringify(expectedAst);
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
  } else if (expectedTokens !== true && obj.tokens.map(t => t.type).join(' ') !== [...expectedTokens, $EOF].join(' ')) {
    LOG_THROW(prefix, 'TOKEN mismatch', code, '', desc);

    console.log('Actual tokens:', obj.tokens.map(t => debug_toktype(t.type)).join(' '));
    console.log('Wanted tokens:', [...expectedTokens, $EOF].map(debug_toktype).join(' '));
    // the tokenizer is pretty solid by now so I prefer to lazily copy/paste this into the test :)
    console.log('tokens: [$' + obj.tokens.slice(0, -1).map(o => debug_toktype(o.type)).join(', $') + '],');
    ++fail;
  } else {
    console.log(`${prefix} PASS: \`${toPrint(code)}\``);
    ++pass;
  }

  if (STOP_AFTER_FAIL && fail) throw 'stopped';

  function LOG_THROW(prefix, errmsg, code, stack = new Error(errmsg).stack, desc) {
    console.log('\n');
    console.log(`${prefix} ERROR: \`${toPrint(code)}\` :: ` + errmsg);
    if (stack) console.log('Stack:', stack);
    //console.log('Final test options:\n', finalTestOptions);
    console.log('Description:', desc);
    console.log('From:', from);
    if (_debug) console.log('Debug:', _debug);
  }
}

const STOP_AFTER_FAIL = true;
let pass = 0;
let fail = 0;
let crash = 0;
let testi = 0;
let testj = 0;
let skips = 0;
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
  passed: ${pass}, crashed: ${crash}, failed: ${fail-crash}, skipped: ${skips}
  `);
}
