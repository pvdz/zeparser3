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

let prefab = {
  ROOT: [
    '',
    'EXPR',
    '{EXPR}',
    'VARDECL;',
    'FUNCDECL',
    'do EXPR; while(EXPR);',
    'for (EXPR; ; ) EXPR',
    'for (; EXPR; ) EXPR',
    'for (; ; EXPR) EXPR',
    'for (EXPR; EXPR; ) EXPR',
    'for (EXPR; ; EXPR) EXPR',
    'for (; EXPR; EXPR) EXPR',
    'for (EXPR; EXPR; EXPR) EXPR',
    'for (VARDECL; EXPR; EXPR) EXPR',
    'for (x in EXPR) EXPR',
    'for (x of EXPR) EXPR',
    'if (EXPR) EXPR',
    'if (EXPR) EXPR; else EXPR',
    'foo: EXPR',
    'return EXPR',
    'switch (EXPR) {}',
    'switch (EXPR) {case EXPR:}',
    'switch (EXPR) {case EXPR: EXPR}',
    'switch (EXPR) {default: EXPR}',
    'throw EXPR',
    'try { EXPR } catch(e) { EXPR }',
    'try { EXPR } finally { EXPR }',
    'try { EXPR } catch(e) { EXPR } finally { EXPR }',
    'while (EXPR) EXPR',
    'with (EXPR) EXPR',

    // expression stuff
    '`a ${XPORFN} b`',
    '`a ${EXPR} b ${EXPR} c`',
    'a: EXPR',
    'a == EXPR',
    'a = EXPR',
    'a => EXPR',
    '() => XPORFN',
    '(ARG) => EXPR',
    '(ARG,ARG) => EXPR',
    'foo(XPORFN)',
    'f(ARG)',
    'f(ARG,ARG)',

    // destructuring
    'DESTR', // destructuring patterns should be valid toplevels. the obj patterns become block statements tho.
    'foo(ARG)', // wrap because object patterns become block statements at the toplevel
    '(DESTR) = EXPR',
    '((((DESTR)))) = EXPR',

    // import export
    'import STRING',
    'import a from STRING',
    'import * as y from STRING',
    'import a, * as y from STRING',
    'import IMPOBJ from STRING',
    'import a, IMPOBJ from STRING',
    'export * from STRING',
    'export IMPOBJ',
    'export IMPOBJ from STRING',
    'export VARDECL',
    'export FUNCDECL',
    'export default FUNCDECL',
    'export default EXPR',
    //'export CLASS',
    //'export default CLASS',
  ],
  STRING: [
    `"xyz"`,
    `'abc'`,
  ],
  IMPOBJ: [
    '{}',
    '{IMPNAME}',
    '{IMPNAME,}',
    '{IMPNAME,IMPNAME}',
    '{IMPNAME,IMPNAME,}',
  ],
  IMPNAME: [
    'x',
    'x as y',
  ],
  FUNCDECL: [
    'function f FUNCRESTALL',
    'function *f FUNCRESTALL',
    'async function f FUNCRESTALL',
  ],
  FUNCRESTALL: [
    '(){EXPR}',
    '(DESTR){EXPR}',
    '(DESTR, DESTR){EXPR}',
    '(DESTR=EXPR, DESTR=EXPR){EXPR}',
  ],
  FUNCXPR: [
    'function f FUNCRESTNA',
    'function *f FUNCRESTNA',
    'async function f FUNCRESTNA',
    'function FUNCRESTNA',
    'function * FUNCRESTNA',
    'async function FUNCRESTNA',
  ],
  FUNCRESTNA: [
    '(){EXXPRNA}',
    '(DESTR){EXXPRNA}',
    '(DESTR, DESTR){EXXPRNA}',
    '(DESTR=EXXPRNA, DESTR=EXXPRNA){EXXPRNA}',
  ],
  ARG: [
    'a',
    'a=EXPR',
    'DESTR',
    'DESTR=EXPR'
  ],
  DESTR: [
    '[a]',
    '[a=EXPR]',
    '{a}',
    '{a:EXPR}',
    '{a=EXPR}',
    '{a:b=EXPR}',
  ],
  VARDECL: [
    //'VARKEYWORD a',
    //'VARKEYWORD a, b',
    'VARKEYWORD a = EXPR',
    'VARKEYWORD a = EXPR, b',
    'VARKEYWORD a, b = EXPR',
    'VARKEYWORD a = EXPR, b = EXPR',
  ],
  VARKEYWORD: [
    'var',
    'let',
    'const',
  ],
  XPORFN: [
    'EXPR',
    'FUNCXPR',
  ],
  EXPR: [
    'EXXPRALL',
    'EXXPRNA OP EXXPRNA',
  ],
  EXXPRNA: _EXPRNA = [
    '/i/',
    '/u/g',
    'd',
    'm/y',
    'g=>h',
    '`tick`',
    '`tick ${x} tock`',
    '`tic ${a} tac ${b} toe`',
  ],
  EXXPRALL: [
    ..._EXPRNA,
    '()=>EXXPRNA',
    'k=>EXXPRNA',
    '(k)=>(EXXPRNA)',
    '(a,b)=>(EXXPRNA)',
    '(k)=>{EXXPRNA}',
  ],
  OP: [
    '*',
    '/',
  ],
};

let arr = [];
function replace(str) {
  let hit = false;
  str.replace(/([A-Z]+)/, key => hit = key);
  if (hit) {
    if (!prefab[hit]) console.log('hit:', hit, str);
    prefab[hit].forEach(s => {
      replace(str.replace(new RegExp(hit, 'g'), s));
    });
  } else {
    arr.push(str);
  }
}
prefab.ROOT.forEach(replace);

let pass = 0;
let fail = 0;
let crash = 0;
let testi = 0;
arr.forEach(code => {
  try {
    var obj = ZeParser(code, undefined, COLLECT_TOKENS_SOLID);
  } catch(e) {
    ++crash;
    var obj = '' + e.stack;
  }

  let passed = false;
  if (typeof obj === 'string') {
    console.log(`ERROR: \`${toPrint(code)}\` :: crash;`);
    console.log('Stack:', obj);
    ++fail;
    exit
  } else {
    console.log(`PASS: \`${toPrint(code)}\``);
    ++pass;
    passed = true;
  }
});

console.log(`
#####
passed: ${pass}, crashed: ${crash}
`);
