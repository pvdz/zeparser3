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
  $ASI,
  $EOF,
  $ERROR,
  $IDENT,
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
  $TICK,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,

  GOAL_MODULE,
  GOAL_SCRIPT,

  STRICT_MODE,
  SLOPPY_MODE,

  DIV,
  REX,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

let tests = [
  [
    'block statement',
    {
      code: '{}',
      ast: {type: 'Program', body: [{type: 'BlockStatement', body: []}]},
      desc: 'empty block',
      tokens: [$PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '{debugger;}',
      ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
        {type: 'DebuggerStatement'},
      ]}]},
      desc: 'block with debugger and semi',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '{\n  debugger;\n}',
      ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
        {type: 'DebuggerStatement'},
      ]}]},
      desc: 'block with debugger and semi with newlines',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '{debugger}',
      ast: {type: 'Program', body: [{type: 'BlockStatement', body: [
        {type: 'DebuggerStatement'},
      ]}]},
      desc: 'block with debugger and asi',
      tokens: [$PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
    },
  ], // block statement
  [
    'break statement',
    {
      code: 'break;',
      ast: {type: 'Program', body: [{type: 'BreakStatement', label: null}]},
      desc: 'break at eof (without label, with semi)',
      tokens: [$IDENT, $PUNCTUATOR],
    },
    {
      code: 'break',
      ast: {type: 'Program', body: [{type: 'BreakStatement', label: null}]},
      desc: 'break at eof (without label, without semi)',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'break foo;',
      ast: {type: 'Program', body: [{type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}}]},
      desc: 'break at eof (with label, with semi)',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'break foo',
      ast: {type: 'Program', body: [{type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}}]},
      desc: 'break at eof (with label, without semi)',
      tokens: [$IDENT, $IDENT, $ASI],
    },
    {
      code: 'break; break;',
      ast: {type: 'Program', body: [
        {type: 'BreakStatement', label: null},
        {type: 'BreakStatement', label: null},
      ]},
      desc: 'double break',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'break\nbreak;',
      ast: {type: 'Program', body: [
        {type: 'BreakStatement', label: null},
        {type: 'BreakStatement', label: null},
      ]},
      desc: 'double break with asi',
      tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'break foo;break;',
      ast: {type: 'Program', body: [
        {type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}},
        {type: 'BreakStatement', label: null},
      ]},
      desc: 'double break with label and semi',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'break foo\nbreak;',
      ast: {type: 'Program', body: [
        {type: 'BreakStatement', label: {type: 'Identifier', name: 'foo'}},
        {type: 'BreakStatement', label: null},
      ]},
      desc: 'double break with label and asi',
      tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR],
    },
  ], // break statement
  [
    'continue statement',
    {
      code: 'continue;',
      ast: {type: 'Program', body: [{type: 'ContinueStatement', label: null}]},
      desc: 'continue at eof (without label, with semi)',
      tokens: [$IDENT, $PUNCTUATOR],
    },
    {
      code: 'continue',
      ast: {type: 'Program', body: [{type: 'ContinueStatement', label: null}]},
      desc: 'continue at eof (without label, without semi)',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'continue foo;',
      ast: {type: 'Program', body: [{type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}}]},
      desc: 'continue at eof (with label, with semi)',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'continue foo',
      ast: {type: 'Program', body: [{type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}}]},
      desc: 'continue at eof (with label, without semi)',
      tokens: [$IDENT, $IDENT, $ASI],
    },
    {
      code: 'continue; continue;',
      ast: {type: 'Program', body: [
        {type: 'ContinueStatement', label: null},
        {type: 'ContinueStatement', label: null},
      ]},
      desc: 'double continue',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'continue\ncontinue;',
      ast: {type: 'Program', body: [
        {type: 'ContinueStatement', label: null},
        {type: 'ContinueStatement', label: null},
      ]},
      desc: 'double continue with asi',
      tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'continue foo;continue;',
      ast: {type: 'Program', body: [
        {type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}},
        {type: 'ContinueStatement', label: null},
      ]},
      desc: 'double continue with label and semi',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'continue foo\ncontinue;',
      ast: {type: 'Program', body: [
        {type: 'ContinueStatement', label: {type: 'Identifier', name: 'foo'}},
        {type: 'ContinueStatement', label: null},
      ]},
      desc: 'double continue with label and asi',
      tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR],
    },
  ], // continue statement
  [
    'const statement',
    [
      '  regular vars',
      {
        code: 'const foo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          ]},
        ]},
        desc: 'const, one var, no init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'const foo',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          ]}
        ]},
        desc: 'const, one var, no init, eof',
        tokens: [$IDENT, $IDENT, $ASI],
      },
      {
        code: 'const foo, bar;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
          ]},
        ]},
        desc: 'const, two vars, no init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'const foo, bar',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
          ]},
        ]},
        desc: 'const, two vars, no init, eof',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: 'const foo = bar;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
        ]},
        desc: 'const, var with init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'const foo = bar',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
        ]},
        desc: 'const, var with init, eof',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: 'const foo = bar\nconst zoo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null},
          ]},
        ]},
        desc: 'const, var with init, asi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'const foo = bar, zoo = boo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
          ]},
        ]},
        desc: 'const, two vars with both init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'const foo = bar, zoo = boo',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'const', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
          ]},
        ]},
        desc: 'const, two vars with both init, asi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
    ],
    //[
    //  '  array destructuring',
    //  {
    //    code: 'const [foo] = arr;',
    //    ast: {type: 'Program', body: [
    //      {type: 'VariableDeclaration', kind: 'const', declarations: [
    //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
    //      ]},
    //    ]},
    //    desc: 'const, one var, no init, semi',
    //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    //  },
    //],
    //[
    //  '  object destructuring',
    //  {
    //    code: 'const {foo} = arr;',
    //    ast: {type: 'Program', body: [
    //      {type: 'VariableDeclaration', kind: 'const', declarations: [
    //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
    //      ]},
    //    ]},
    //    desc: 'const, one var, no init, semi',
    //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    //  },
    //],
  ], // const statement
  [
    'debugger statement',
    {
      code: 'debugger;',
      ast: {type: 'Program', body: [
        {type: 'DebuggerStatement'},
      ]},
      desc: 'debugger with semi',
      tokens: [$IDENT, $PUNCTUATOR],
    },
    {
      code: 'debugger',
      ast: {type: 'Program', body: [
        {type: 'DebuggerStatement'},
      ]},
      desc: 'debugger without semi at eof',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'debugger\ndebugger;',
      ast: {type: 'Program', body: [
        {type: 'DebuggerStatement'},
        {type: 'DebuggerStatement'},
      ]},
      desc: 'debugger with asi',
      tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR],
    },
  ], // debugger statement
  [
    'dowhile statement',
    {
      code: 'do foo\nwhile (bar);',
      ast: {type: 'Program', body: [
        {type: 'DoWhileStatement', body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, test: {type: 'Identifier', name: 'bar'}},
      ]},
      desc: 'simple while',
      tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    // TODO: error for `do foo while (bar);`
  ], // dowhile statement
  [
    'empty statement',
    {
      code: ';',
      ast: {type: 'Program', body: [
        {type: 'EmptyStatement'},
      ]},
      desc: 'just a semi',
      tokens: [$PUNCTUATOR],
    },
    {
      code: '{};',
      ast: {type: 'Program', body: [
        {type: 'BlockStatement', body: []},
        {type: 'EmptyStatement'},
      ]},
      desc: 'just a semi with an empty block',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: ';{}',
      ast: {type: 'Program', body: [
        {type: 'EmptyStatement'},
        {type: 'BlockStatement', body: []},
      ]},
      desc: 'just an empty block with a semi',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '{;}',
      ast: {type: 'Program', body: [
        {type: 'BlockStatement', body: [
          {type: 'EmptyStatement'},
        ]},
      ]},
      desc: 'just an empty statement inside a block',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
  ], // empty statement
  [
    'expression statement',
    [
      '  ident statement',
      {
        code: 'foo;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
        ]},
        desc: 'ident with semi',
        tokens: [$IDENT, $PUNCTUATOR],
      },
      {
        code: 'foo',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
        ]},
        desc: 'ident with eof',
        tokens: [$IDENT, $ASI],
      },
      {
        code: 'foo;bar;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
        ]},
        desc: 'double ident with semi',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'foo\nbar',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
        ]},
        desc: 'double ident with asi',
        tokens: [$IDENT, $ASI, $IDENT, $ASI],
      },
    ],
  ], // expression statement
  [
    'for statement',
    [
      '  for-classic',
      {
        code: 'for (;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: null, test: null, update: null, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'empty for-classic',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (a;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: null, update: null, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'for-classic, only init, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (;b;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: null, test: {type: 'Identifier', name: 'b'}, update: null, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'for-classic, only test, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (;;c);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: null, test: null, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'for-classic, only update, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (a;b;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: {type: 'Identifier', name: 'b'}, update: null, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'for-classic, only init and test, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (a;;c);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: null, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'for-classic, only init and update, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (;b;c);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: null, test: {type: 'Identifier', name: 'b'}, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'for-classic, only test and update, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (a;b;c);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement', init: {type: 'Identifier', name: 'a'}, test: {type: 'Identifier', name: 'b'}, update: {type: 'Identifier', name: 'c'}, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'for-classic, init and test and update, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      '    var decls',
      {
        code: 'for (var a;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, one var, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (var a,b,c;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'var', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
            ]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, three vars, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (let a;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, one let, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (let a,b,c;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'let', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
            ]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, three lets, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (const a;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, only init, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (const a,b,c;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'const', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'c'}, init: null},
            ]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, three consts, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      '    vars with initializers',
      {
        code: 'for (var a=1;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'var', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
            ]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, one var with init, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (var a=1, b;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'var', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: null},
            ]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, two vars only first has init, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (var a, b=1;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'var', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
            ]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, two vars only second has init, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (var a=1, b=2;;);',
        ast: {type: 'Program', body: [
          {type: 'ForStatement',
            init: {type: 'VariableDeclaration', kind: 'var', declarations: [
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: {type: 'Literal', value: '<TODO>', raw: '1'}},
              {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'b'}, init: {type: 'Literal', value: '<TODO>', raw: '2'}},
            ]},
            test: null,
            update: null,
            body: {type: 'EmptyStatement'}
          },
        ]},
        desc: 'for-classic, two vars both have init, empty body',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
    ],
    [
      '  for-in',
      {
        code: 'for (a in b);',
        ast: {type: 'Program', body: [
          {type: 'ForInStatement', left: {type: 'Identifier', name: 'a'}, right: {type: 'Identifier', name: 'b'}, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'empty for-in',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (var a in b);',
        ast: {type: 'Program', body: [
          {type: 'ForInStatement',
            left: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            right: {type: 'Identifier', name: 'b'},
            body: {type: 'EmptyStatement'},
          },
        ]},
        desc: 'empty for-in',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (let a in b);',
        ast: {type: 'Program', body: [
          {type: 'ForInStatement',
            left: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            right: {type: 'Identifier', name: 'b'},
            body: {type: 'EmptyStatement'},
          },
        ]},
        desc: 'empty for-in',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (const a in b);',
        ast: {type: 'Program', body: [
          {type: 'ForInStatement',
            left: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            right: {type: 'Identifier', name: 'b'},
            body: {type: 'EmptyStatement'},
          },
        ]},
        desc: 'empty for-in',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
    ],
    [
      '  for-of',
     {
        code: 'for (a of b);',
        ast: {type: 'Program', body: [
          {type: 'ForOfStatement', left: {type: 'Identifier', name: 'a'}, right: {type: 'Identifier', name: 'b'}, body: {type: 'EmptyStatement'}},
        ]},
        desc: 'empty for-of',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (var a of b);',
        ast: {type: 'Program', body: [
          {type: 'ForOfStatement',
            left: {type: 'VariableDeclaration', kind: 'var', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            right: {type: 'Identifier', name: 'b'},
            body: {type: 'EmptyStatement'},
          },
        ]},
        desc: 'empty for-of',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (let a of b);',
        ast: {type: 'Program', body: [
          {type: 'ForOfStatement',
            left: {type: 'VariableDeclaration', kind: 'let', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            right: {type: 'Identifier', name: 'b'},
            body: {type: 'EmptyStatement'},
          },
        ]},
        desc: 'empty for-of',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'for (const a of b);',
        ast: {type: 'Program', body: [
          {type: 'ForOfStatement',
            left: {type: 'VariableDeclaration', kind: 'const', declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'a'}, init: null}]},
            right: {type: 'Identifier', name: 'b'},
            body: {type: 'EmptyStatement'},
          },
        ]},
        desc: 'empty for-of',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
    ],
  ], // for statement
  [
    'functions',
    [
      '  function declaration',
      {
        code: 'function f(){}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
        ]},
        desc: 'empty function decl',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
    ],
    [
      '  function args',
      {
        code: 'function f(a){}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
            {type: 'Identifier', name: 'a'},
          ], body: {type: 'BlockStatement', body: []}},
        ]},
        desc: 'function decl, one arg, empty body',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: 'function f(a,b){}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
          ], body: {type: 'BlockStatement', body: []}},
        ]},
        desc: 'function decl, two args, empty body',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
    ],
    [
      '  function body',
      {
        code: 'function f(){foo}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
          ]}},
        ]},
        desc: 'function decl, no args, one stmt',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      },
      {
        code: 'function f(){foo;bar}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
          ]}},
        ]},
        desc: 'function decl, no args, two stmts',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      },
    ],
    [
      '  async function',
      {
        code: 'async function f(){}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: true, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
        ]},
        desc: 'empty async function',
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
    ],
    [
      '  generator function',
      {
        code: 'function* f(){}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: true, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
        ]},
        desc: 'empty async function',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
    ],
  ], // functions
  [
    'if statement',
    {
      code: 'if (foo) bar;',
      ast: {type: 'Program', body: [
        {type: 'IfStatement',
          test: {type: 'Identifier', name: 'foo'},
          consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
          alternate: null,
        },
      ]},
      desc: 'simple if without else',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'if (foo) bar; else doo;',
      ast: {type: 'Program', body: [
        {type: 'IfStatement',
          test: {type: 'Identifier', name: 'foo'},
          consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
          alternate: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'doo'}},
        },
      ]},
      desc: 'simple if without else',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'if (foo) a; if (bar) b; else c;',
      ast: {type: 'Program', body: [
        {type: 'IfStatement',
          test: {type: 'Identifier', name: 'foo'},
          consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'a'}},
          alternate: null,
        },
        {type: 'IfStatement',
          test: {type: 'Identifier', name: 'bar'},
          consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'b'}},
          alternate: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'c'}},
        }
      ]},
      desc: 'simple if without else',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
    },
  ], // if statement
  [
    'labeled statement',
    {
      code: 'foo: bar;',
      ast: {type: 'Program', body: [
        {type: 'LabeledStatement', label: {type: 'Identifier', name: 'foo'}, body:
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
        },
      ]},
      desc: 'debugger with semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    // TODO: label:functiondecl is explicitly considered a syntax error
    // TODO: labels must be "identifiers", which may not be reserved
  ], // labeled statement
  [
    'let statement',
    [
      '  regular vars',
      {
        code: 'let foo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          ]},
        ]},
        desc: 'let, one var, no init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'let foo',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          ]}
        ]},
        desc: 'let, one var, no init, eof',
        tokens: [$IDENT, $IDENT, $ASI],
      },
      {
        code: 'let foo, bar;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
          ]},
        ]},
        desc: 'let, two vars, no init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'let foo, bar',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
          ]},
        ]},
        desc: 'let, two vars, no init, eof',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: 'let foo = bar;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
        ]},
        desc: 'let, var with init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'let foo = bar',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
        ]},
        desc: 'let, var with init, eof',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: 'let foo = bar\nlet zoo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null},
          ]},
        ]},
        desc: 'let, var with init, asi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'let foo = bar, zoo = boo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
          ]},
        ]},
        desc: 'let, two vars with both init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'let foo = bar, zoo = boo',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
          ]},
        ]},
        desc: 'let, two vars with both init, asi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
    ],
    [
      '  array destructuring',
      {
        code: 'let [foo] = arr;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'let', declarations: [
            {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]}, init: {type: 'Identifier', name: 'arr'}},
          ]},
        ]},
        desc: 'let, one var, no init, semi',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
    ],
    //[
    //  '  object destructuring',
    //  {
    //    code: 'let {foo} = arr;',
    //    ast: {type: 'Program', body: [
    //      {type: 'VariableDeclaration', kind: 'let', declarations: [
    //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
    //      ]},
    //    ]},
    //    desc: 'let, one var, no init, semi',
    //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    //  },
    //],
  ], // let statement
  [
    'return statement',
    {
      code: 'return;',
      ast: {type: 'Program', body: [
        {type: 'ReturnStatement', argument: null},
      ]},
      desc: 'return, no value, semi',
      tokens: [$IDENT, $PUNCTUATOR],
    },
    {
      code: 'return',
      ast: {type: 'Program', body: [
        {type: 'ReturnStatement', argument: null},
      ]},
      desc: 'return, no value, eof',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'return;return;',
      ast: {type: 'Program', body: [
        {type: 'ReturnStatement', argument: null},
        {type: 'ReturnStatement', argument: null},
      ]},
      desc: 'double return, no value, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'return\nreturn',
      ast: {type: 'Program', body: [
        {type: 'ReturnStatement', argument: null},
        {type: 'ReturnStatement', argument: null},
      ]},
      desc: 'double return, no value, eof',
      tokens: [$IDENT, $ASI, $IDENT, $ASI],
    },
    {
      code: 'return foo;',
      ast: {type: 'Program', body: [
        {type: 'ReturnStatement', argument: {type: 'Identifier', name: 'foo'}},
      ]},
      desc: 'return, no value, semi',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'return 15;',
      ast: {type: 'Program', body: [
        {type: 'ReturnStatement', argument: {type: 'Literal', value: '<TODO>', raw: '15'}},
      ]},
      desc: 'return, no value, semi',
      tokens: [$IDENT, $NUMBER_DEC, $PUNCTUATOR],
    },
  ], // return statement
  [
    'switch statement',
    {
      code: 'switch (foo) {}',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'foo'}, cases: []},
      ]},
      desc: 'empty switch',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'switch (A) {case B: C;}',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
          {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
          ]},
        ]},
      ]},
      desc: 'switch with a simple case',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'switch (A) {default: B;}',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
          {type: 'SwitchCase', test: null, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'B'}},
          ]},
        ]},
      ]},
      desc: 'switch with a simple default',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'switch (A) {case B: C; default: D;}',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
          {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
          ]},
          {type: 'SwitchCase', test: null, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'D'}},
          ]},
        ]},
      ]},
      desc: 'switch with a simple case and default',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'switch (A) {default: D; case B: C; }',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
          {type: 'SwitchCase', test: null, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'D'}},
          ]},
          {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
          ]},
        ]},
      ]},
      desc: 'switch with a simple default and case',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'switch (A) {case B: C; case D: E;}',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
          {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
          ]},
          {type: 'SwitchCase', test: {type: 'Identifier', name: 'D'}, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'E'}},
          ]},
        ]},
      ]},
      desc: 'switch with a two cases',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'switch (A) {case B: C; break; case D: E; break;}',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
          {type: 'SwitchCase', test: {type: 'Identifier', name: 'B'}, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'C'}},
            {type: 'BreakStatement', label: null},
          ]},
          {type: 'SwitchCase', test: {type: 'Identifier', name: 'D'}, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'E'}},
            {type: 'BreakStatement', label: null},
          ]},
        ]},
      ]},
      desc: 'switch with a two cases',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'switch (A) {default: B; break;}',
      ast: {type: 'Program', body: [
        {type: 'SwitchStatement', discriminant: {type: 'Identifier', name: 'A'}, cases: [
          {type: 'SwitchCase', test: null, consequent: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'B'}},
            {type: 'BreakStatement', label: null},
          ]},
        ]},
      ]},
      desc: 'switch with a simple default and break',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
  ], // switch statement
  [
    'throw statement',
    {
      code: 'throw foo;',
      ast: {type: 'Program', body: [
        {type: 'ThrowStatement', argument: {type: 'Identifier', name: 'foo'}},
      ]},
      desc: 'throw, semi',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'throw foo',
      ast: {type: 'Program', body: [
        {type: 'ThrowStatement', argument: {type: 'Identifier', name: 'foo'}},
      ]},
      desc: 'throw, eof',
      tokens: [$IDENT, $IDENT, $ASI],
    },
  ], // throw statement
  [
    'try statement',
    {
      code: 'try {} catch(e) {}',
      ast: {type: 'Program', body: [
        {type: 'TryStatement',
          block: {type: 'BlockStatement', body: []},
          handler: {type: 'CatchClause', param: {type: 'Identifier', name: 'e'}, body: {type: 'BlockStatement', body: []}},
          finalizer: null,
        },
      ]},
      desc: 'empty try/catch',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'try {} finally {}',
      ast: {type: 'Program', body: [
        {type: 'TryStatement',
          block: {type: 'BlockStatement', body: []},
          handler: null,
          finalizer: {type: 'BlockStatement', body: []},
        },
      ]},
      desc: 'empty try/finally',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'try {} catch(e) {} finally {}',
      ast: {type: 'Program', body: [
        {type: 'TryStatement',
          block: {type: 'BlockStatement', body: []},
          handler: {type: 'CatchClause', param: {type: 'Identifier', name: 'e'}, body: {type: 'BlockStatement', body: []}},
          finalizer: {type: 'BlockStatement', body: []},
        },
      ]},
      desc: 'empty try/catch/finally',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
  ], // try statement
  [
    'var statement',
    [
      '  regular vars',
      {
        code: 'var foo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          ]},
        ]},
        desc: 'var, one var, no init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'var foo',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
          ]}
        ]},
        desc: 'var, one var, no init, eof',
        tokens: [$IDENT, $IDENT, $ASI],
      },
      {
        code: 'var foo, bar;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
          ]},
        ]},
        desc: 'var, two vars, no init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'var foo, bar',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'bar'}, init: null},
          ]},
        ]},
        desc: 'var, two vars, no init, eof',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: 'var foo = bar;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
        ]},
        desc: 'var, var with init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'var foo = bar',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
        ]},
        desc: 'var, var with init, eof',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: 'var foo = bar\nvar zoo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
          ]},
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: null},
          ]},
        ]},
        desc: 'var, var with init, asi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'var foo = bar, zoo = boo;',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
          ]},
        ]},
        desc: 'var, two vars with both init, semi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'var foo = bar, zoo = boo',
        ast: {type: 'Program', body: [
          {type: 'VariableDeclaration', kind: 'var', declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: {type: 'Identifier', name: 'bar'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'zoo'}, init: {type: 'Identifier', name: 'boo'}},
          ]},
        ]},
        desc: 'var, two vars with both init, asi',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
    ],
    //[
    //  '  array destructuring',
    //  {
    //    code: 'var [foo] = arr;',
    //    ast: {type: 'Program', body: [
    //      {type: 'VariableDeclaration', kind: 'var', declarations: [
    //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
    //      ]},
    //    ]},
    //    desc: 'var, one var, no init, semi',
    //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    //  },
    //],
    //[
    //  '  object destructuring',
    //  {
    //    code: 'var {foo} = arr;',
    //    ast: {type: 'Program', body: [
    //      {type: 'VariableDeclaration', kind: 'var', declarations: [
    //        {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'foo'}, init: null},
    //      ]},
    //    ]},
    //    desc: 'var, one var, no init, semi',
    //    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
    //  },
    //],
  ], // var statement
  [
    'while statement',
    {
      code: 'while (foo) bar;',
      ast: {type: 'Program', body: [
        {type: 'WhileStatement', test: {type: 'Identifier', name: 'foo'}, body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}},
      ]},
      desc: 'simple while',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
  ], // while statement
  [
    'with statement',
    {
      code: 'with (foo) bar;',
      ast: {type: 'Program', body: [
        {type: 'WithStatement', object: { type: 'Identifier', name: 'foo' }, body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}},
      ]},
      desc: 'var, one var, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
  ], // with statement

  [
    'expression',

    [
      '  member',
      {
        code: 'foo.bar',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'MemberExpression',
            object: {type: 'Identifier', name: 'foo'},
            property: {type: 'Identifier', name: 'bar'},
            computed: false,
          }},
        ]},
        desc: 'function call, no args',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
      },
    ], // member
    [
      '  call',
      {
        code: 'foo()',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: []}},
        ]},
        desc: 'function call, no args',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      },
      {
        code: 'foo(a)',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
            {type: 'Identifier', name: 'a'},
          ]}},
        ]},
        desc: 'function call, one arg',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      },
      {
        code: 'foo(a, b, c)',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
            {type: 'Identifier', name: 'c'},
          ]}},
        ]},
        desc: 'function call, three args',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      },
      {
        code: 'foo(...a)',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
            {type: 'SpreadElement', argument: {type: 'Identifier', name: 'a'}},
          ]}},
        ]},
        desc: 'function call, one arg, spread',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      },
      {
        code: 'foo(a, b, ...c)',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
            {type: 'SpreadElement', argument: {type: 'Identifier', name: 'c'}},
          ]}},
        ]},
        desc: 'function call, three args, spread',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      },
      {
        code: 'foo(a)(b)',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'CallExpression',
            callee: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'foo'},
              arguments: [{type: 'Identifier', name: 'a'}],
            },
            arguments: [{type: 'Identifier', name: 'b'}],
          }},
        ]},
        desc: 'chained calls',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      },
      {
        code: 'foo(a)(b)(c)(d)(e)',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'CallExpression',
            callee: {type: 'CallExpression',
              callee: {type: 'CallExpression',
                callee: {type: 'CallExpression',
                  callee: {type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'foo'},
                    arguments: [{type: 'Identifier', name: 'a'}],
                  },
                  arguments: [{type: 'Identifier', name: 'b'}],
                },
                arguments: [{type: 'Identifier', name: 'c'}],
              },
              arguments: [{type: 'Identifier', name: 'd'}],
            },
            arguments: [{type: 'Identifier', name: 'e'}],
          }},
        ]},
        desc: 'chained calls',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      },
    ], // call
    [
      '  array',
      [
        '    literal',
        {
          code: '[]',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'ArrayExpression', elements: []}},
          ]},
          desc: 'empty array',
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $ASI],
        },
        {
          code: '[x]',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'ArrayExpression', elements: [
              {type: 'Identifier', name: 'x'},
            ]}},
          ]},
          desc: 'empty array',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        },
      ], // literal
      [
        '    destructuring',
        {
          code: '[foo] = arr;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            }},
          ]},
          desc: 'one var, no init, semi',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: '[foo = A] = arr;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'foo'}, operator: '=', right: {type: 'Identifier', name: 'A'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            }},
          ]},
          desc: 'one var, with init, semi',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: '[foo, bar] = arr;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [
                {type: 'Identifier', name: 'foo'},
                {type: 'Identifier', name: 'bar'},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            }},
          ]},
          desc: 'two vars, no init, semi',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: '[foo = A, bar = B] = arr;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'foo'}, operator: '=',right: {type: 'Identifier', name: 'A'}},
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'bar'}, operator: '=',right: {type: 'Identifier', name: 'B'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            }},
          ]},
          desc: 'two vars, both init, semi',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: '[foo, [x,y,z], bar = B] = arr;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [
                {type: 'Identifier', name: 'foo'},
                {type: 'ArrayPattern', elements: [
                  {type: 'Identifier', name: 'x'},
                  {type: 'Identifier', name: 'y'},
                  {type: 'Identifier', name: 'z'},
                ]},
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'bar'}, operator: '=', right: {type: 'Identifier', name: 'B'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            }},
          ]},
          desc: 'let, nested array pattern',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: '[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [
                {type: 'Identifier', name: 'foo'},
                  {type: 'ArrayPattern', elements: [{
                    type: 'ArrayPattern', elements: [{
                      type: 'ArrayPattern', elements: [{
                        type: 'ArrayPattern', elements: [{
                          type: 'ArrayPattern', elements: [{
                            type: 'ArrayPattern', elements: [{
                              type: 'ArrayPattern', elements: [{
                                type: 'ArrayPattern', elements: [{
                                  type: 'ArrayPattern', elements: [{
                                    type: 'ArrayPattern', elements: [{
                                      type: 'ArrayPattern', elements: [{
                                        type: 'ArrayPattern', elements: [{
                                          type: 'ArrayPattern', elements: [
                                          {type: 'Identifier', name: 'x'},
                                          {type: 'Identifier', name: 'y'},
                                          {type: 'Identifier', name: 'z'},
                                        ]},
                                      ]},
                                    ]},
                                  ]},
                                ]},
                              ]},
                            ]},
                          ]},
                        ]},
                      ]},
                    ]},
                  ]},
                ]},
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'bar'}, operator: '=', right: {type: 'Identifier', name: 'B'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            }},
          ]},
          desc: 'let, super nested array pattern to make sure that isnt hardcoded',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: '[foo, [x,y = 20,z], bar = B] = arr;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'ArrayPattern', elements: [
                {type: 'Identifier', name: 'foo'},
                {type: 'ArrayPattern', elements: [
                  {type: 'Identifier', name: 'x'},
                  {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'y'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '20'}},
                  {type: 'Identifier', name: 'z'},
                ]},
                {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'bar'}, operator: '=', right: {type: 'Identifier', name: 'B'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'arr'},
            }},
          ]},
          desc: 'let, nested array pattern with inner init and outer init',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: 'foo([a, b] = arr);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement',
            expression: {type: 'CallExpression',
              callee: {type: 'Identifier', name: 'foo'},
              arguments: [
                {type: 'AssignmentExpression',
                  left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]},
                  operator: '=',
                  right: {type: 'Identifier', name: 'arr'},
                },
              ],
            },
          }]},
          desc: 'destructuring array as call arg',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        // [a,b=[x,y]] = z  -> should not transform the inner array to a arraydestruct
      ], // destructuring
    ], // array
    [
      '  object', // must be wrapped because block, using call wrapper, safer than group because of arrow syntax
      [
        '    literal',
        {
          code: 'wrap({});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: []},
          ]}}]},
          desc: 'empty object',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        [
          '    identifier properties',
          {
            code: 'wrap({a});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'a'}},
              ]},
            ]}}]},
            desc: 'object with one shorthand',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
              ]},
            ]}}]},
            desc: 'object with one classic property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a, b});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'a'}},
                {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'b'}, value: {type: 'Identifier', name: 'b'}},
              ]},
            ]}}]},
            desc: 'object with two shorthand',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, c:d});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
              ]},
            ]}}]},
            desc: 'object with two classic properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a, c:d});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'a'}},
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
              ]},
            ]}}]},
            desc: 'object with a shorthand and a classic property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, c});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'c'}},
              ]},
            ]}}]},
            desc: 'object with a classic property and a shorthand',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          //{ error without the "outer" assignment, can only init shorthand when destructuring
          //  code: 'wrap({a=b});',
          //  ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
          //    {type: 'ObjectExpression', properties: [
          //      {type: 'Property',
          //        kind: 'init',
          //        method: false,
          //        shorthand: true,
          //        computed: false,
          //        key: {type: 'Identifier', name: 'a'},
          //        value: {
          //          type: 'AssignmentExpression',
          //          left: {type: 'Identifier', name: 'a'}, // same token as above
          //          right: {type: 'Identifier', name: 'b'},
          //        },
          //      },
          //    ]},
          //  ]}}]},
          //  desc: 'object with one shorthand',
          //  tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          //},
        ], // ident props
        [
          '    string properties',
          {
            code: 'wrap({a:b});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
              ]},
            ]}}]},
            desc: 'object with one double quoted property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, c:d});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
              ]},
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({\'a\':b});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, value: {type: 'Identifier', name: 'b'}},
              ]},
            ]}}]},
            desc: 'object with one double quoted property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({\'a\':b, \'c\':d});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, value: {type: 'Identifier', name: 'd'}},
              ]},
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({\'a\':b, c:d});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
              ]},
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, \'c\':d});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, value: {type: 'Identifier', name: 'd'}},
              ]},
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
        ], // string props
        [
          '      computed properties',
          {
            code: 'wrap({[a]:b});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
              ]},
            ]}}]},
            desc: 'object literal, one computed property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({[a]:b, [15]:d});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '15'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'd'}},
              ]},
            ]}}]},
            desc: 'object literal, one computed property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },

          // computed property that is a comma expression
        ], // computed props
        [
          '    identifier method',
          {
            code: 'wrap({foo(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({foo(){}, bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with two methods',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({foo(a,b,c){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [
                    {type: 'Identifier', name: 'a'},
                    {type: 'Identifier', name: 'b'},
                    {type: 'Identifier', name: 'c'},
                  ],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one method with params',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
        ], // ident method
        [
          '    async method',
          {
            code: 'wrap({async foo(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one async method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({async foo(){}, async bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with two async methods',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({async foo(){}, bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({foo(){}, async bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
        ], // async method
        [
          '    generator method',
          {
            code: 'wrap({*foo(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: true,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one async method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({* foo(){},*bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: true,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: true,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with two async methods',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({* foo(){}, bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: true,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({foo(){}, *bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: true,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
        ], // generator method
        [
          '    getters (ident)',
          {
            code: 'wrap({get foo(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one async method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({get foo(){}, get bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with two async methods',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({get foo(){}, bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({foo(){}, get bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          '    getters (computed)',
          {
            code: 'wrap({get [foo](){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one async method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({get [foo](){}, get [bar](){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with two async methods',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({get [foo](){}, [bar](){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({[foo](){}, get [bar](){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'get', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
        ], // getters
        [
          '    setters (ident)',
          {
            code: 'wrap({set foo(a){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'a'}],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one async method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({set foo(b){}, set bar(d){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'b'}],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'd'}],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with two async methods',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({set foo(c){}, bar(){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'c'}],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({foo(){}, set bar(e){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'init', method: true, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'e'}],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          '    setters (computed)',
          {
            code: 'wrap({set [foo](a){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'a'}],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one async method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({set [foo](b){}, set [bar](d){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'b'}],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'd'}],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with two async methods',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({set [foo](c){}, [bar](){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'c'}],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({[foo](){}, set [bar](e){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }},
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'bar'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'Identifier', name: 'e'}],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with an async method and an ident method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
          '    setters (destruct arg)',
          {
            code: 'wrap({set [foo]([a, b]){}});',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'ObjectExpression', properties: [
                {type: 'Property', kind: 'set', method: false, shorthand: false, computed: true, key: {type: 'Identifier', name: 'foo'}, value: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: false,
                  expression: false,
                  id: null,
                  params: [{type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]}],
                  body: {type: 'BlockStatement', body: []}
                }},
              ]},
            ]}}]},
            desc: 'object with one async method',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          },
        ], // setters

        // call({[x]}) is illegal; dynamic properties can not be shorthand
        // can not use async/generators on getters/setters ({async get foo(){}})
        // getters with non-zero param count
        // setters with not-one param count
      ],
      [
        '    destructuring',
        {
          code: 'wrap({}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: []},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'empty object destruct',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        [
          '    identifier properties',
          {
            code: 'wrap({a}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'a'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object destruct with one shorthand',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object destruct with one classic property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a, b}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'a'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'b'}, value: {type: 'Identifier', name: 'b'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object destruct with two shorthand',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, c:d}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object destruct with two classic properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a, c:d}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'a'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object destruct with a shorthand and a classic property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, c}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'c'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object destruct with a classic property and a shorthand',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a=b}=c);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: true, computed: false,
                    key: {type: 'Identifier', name: 'a'},
                    value: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'a'}, // same token as above
                      operator: '=',
                      right: {type: 'Identifier', name: 'b'},
                    },
                  },
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'c'},
              },
            ]}}]},
            desc: 'object destruct with one shorthand with initializer, invalid when not destructuring',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:v=b}=c);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false,
                    key: {type: 'Identifier', name: 'a'},
                    value: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'v'},
                      operator: '=',
                      right: {type: 'Identifier', name: 'b'},
                    },
                  },
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'c'},
              },
            ]}}]},
            desc: 'object destruct with one pair with initializer',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          // wrap({a:b=x}=y);
        ], // ident props
        [
          '    string properties',
          {
            code: 'wrap({a:b}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object with one double quoted property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, c:d}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({\'a\':b}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, value: {type: 'Identifier', name: 'b'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object with one double quoted property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({\'a\':b, \'c\':d}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, value: {type: 'Identifier', name: 'b'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, value: {type: 'Identifier', name: 'd'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({\'a\':b, c:d}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, value: {type: 'Identifier', name: 'b'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'c'}, value: {type: 'Identifier', name: 'd'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({a:b, \'c\':d}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'a'}, value: {type: 'Identifier', name: 'b'}},
                  {type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, value: {type: 'Identifier', name: 'd'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object with two double quoted properties',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
        ], // string props
        [
          '      computed properties',
          {
            code: 'wrap({[a]:b}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object literal, one computed property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },
          {
            code: 'wrap({[a]:b, [15]:d}=obj);',
            ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [
                  {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
                  {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '15'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'd'}},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ]}}]},
            desc: 'object literal, one computed property',
            tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
          },

          // computed property that is a comma expression
        ], // computed props
      ], // destructuring
    ], // object
    [
      '    mixed array/object destructuring',
      {
        code: '[a, {b}, c] = obj',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'a'},
              {type: 'ObjectPattern', properties: [
                {
                  type: 'Property',
                  kind: 'init',
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {type: 'Identifier', name: 'b'},
                  value: {type: 'Identifier', name: 'b'},
                },
              ]},
              {type: 'Identifier', name: 'c'},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'obj'},
          }},
        ]},
        desc: 'object with shorthand inside array',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: '[a, {b:d}, c] = obj',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'a'},
              {type: 'ObjectPattern', properties: [
                {
                  type: 'Property',
                  kind: 'init',
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {type: 'Identifier', name: 'b'},
                  value: {type: 'Identifier', name: 'd'},
                },
              ]},
              {type: 'Identifier', name: 'c'},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'obj'},
          }},
        ]},
        desc: 'object with property pair inside array',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: '[a, {[b]:d}, c] = obj',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'a'},
              {type: 'ObjectPattern', properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'b'},
                  kind: 'init',
                  method: false,
                  shorthand: false,
                  computed: true,
                  value: {type: 'Identifier', name: 'd'},
                },
              ]},
              {type: 'Identifier', name: 'c'},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'obj'},
          }},
        ]},
        desc: 'object with computed property inside array',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: '[please, {[make]: it}, stop] = bwahahahaha',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'please'},
              {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'make'},  kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'it'}},
              ]},
              {type: 'Identifier', name: 'stop'},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'bwahahahaha'},
          }},
        ]},
        desc: 'horrible addition. this could also be a valid array without the assignment suffixed',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: '[pweeze = [pretty] = please, {[make]: it}, stop] = bwahahahaha',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'pweeze'},
                operator: '=',
                right: {type: 'AssignmentExpression',
                  left: {type: 'ArrayPattern', elements: [
                    {type: 'Identifier', name: 'pretty'},
                  ]},
                  operator: '=',
                  right: {type: 'Identifier', name: 'please'},
                },
              },
              {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'make'},  kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'it'}},
              ]},
              {type: 'Identifier', name: 'stop'},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'bwahahahaha'},
          }},
        ]},
        desc: 'double assignment in first deconstruction',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      },
      {
        code: 'log({foo: [bar]} = obj);',

        ast: {type: 'Program', body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'log'},
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {type: 'ObjectPattern', properties: [{
                    type: 'Property', kind: 'init', method: false, shorthand: false, computed: false, key: {type: 'Identifier', name: 'foo'}, value: {
                      type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'bar'}],
                    },
                  }]},
                  operator: '=',
                  right: {type: 'Identifier', name: 'obj'},
                },
              ],
            },
          }],
        },
        desc: 'horrible addition. this could also be a valid array without the assignment suffixed',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
    ], // mixed
    [
      '  group/arrow',
      [
        '    group',
        {
          code: '(x);',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
          ]},
          desc: 'silly group',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: '((x));',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
          ]},
          desc: 'silly double group',
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: '((((((((((x))))))))));',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
          ]},
          desc: 'oh come on',
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: '(a, b);',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
              {type: 'Identifier', name: 'a'},
              {type: 'Identifier', name: 'b'},
            ]}},
          ]},
          desc: 'group of two vars',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: '(a, 1, "c", d, e, f);',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
              {type: 'Identifier', name: 'a'},
              {type: 'Literal', value: '<TODO>', raw: '1'},
              {type: 'Literal', value: '<TODO>', raw: '"c"'},
              {type: 'Identifier', name: 'd'},
              {type: 'Identifier', name: 'e'},
              {type: 'Identifier', name: 'f'},
            ]}},
          ]},
          desc: 'group of some simple values',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: '(a = 1, b = 2);',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
              {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'a'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '1'}},
              {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'b'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '2'}},
            ]}},
          ]},
          desc: 'group of some two assignments',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
        },
        { // https://tc39.github.io/ecma262/#sec-semantics-static-semantics-isvalidsimpleassignmenttarget
          code: '(a) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '=',
              right: {type: 'Literal', value: '<TODO>', raw: '1'},
            }},
          ]},
          desc: 'assignment to a wrapped identifier, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },
        {
          code: '(a.b) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
              operator: '=',
              right: {type: 'Literal', value: '<TODO>', raw: '1'},
            }},
          ]},
          desc: 'assignment to a wrapped property, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },
        {
          code: '(a[b]) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
              left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
              operator: '=',
              right: {type: 'Literal', value: '<TODO>', raw: '1'},
            }},
          ]},
          desc: 'assignment to a wrapped property, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },
        {
          code: '(a.b().c().d) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'MemberExpression',
                          object: {type: 'Identifier', name: 'a'},
                          property: {type: 'Identifier', name: 'b'},
                          computed: false,
                        },
                        arguments: [],
                      },
                      property: {type: 'Identifier', name: 'c'},
                      computed: false,
                    },
                    arguments: [],
                  },
                  property: {type: 'Identifier', name: 'd'},
                  computed: false,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ]},
          desc: 'assignment to a wrapped complex value that ends in a property, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },
        {
          code: '(super.a) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression:
              {type: 'AssignmentExpression',
                left: {type: 'MemberExpression',
                  object: {type: 'Super'},
                  property: {type: 'Identifier', name: 'a'},
                  computed: false,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ]},
          desc: 'assignment to a wrapped super property, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },
        {
          code: '(super[a]) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
                left: {type: 'MemberExpression',
                  object: {type: 'Super'},
                  property: {type: 'Identifier', name: 'a'},
                  computed: true,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ]},
          desc: 'assignment to a wrapped super property, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },
        {
          code: '(this.a) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
                left: {type: 'MemberExpression',
                  object: {type: 'ThisExpression'},
                  property: {type: 'Identifier', name: 'a'},
                  computed: false,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ]},
          desc: 'assignment to a wrapped this property, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },
        {
          code: '(this[b]) = 1;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
                left: {type: 'MemberExpression',
                  object: {type: 'ThisExpression'},
                  property: {type: 'Identifier', name: 'b'},
                  computed: true,
                },
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'},
              },
            },
          ]},
          desc: 'assignment to a wrapped this property, silly but valid',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        },


        // (); (empty group is error)
        // (a=1)=2; (grouped assignment is _not_ a valid assignment target) https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-isvalidsimpleassignmenttarget
        // assignment to eval and arguments in strict mode should throw (even wrapped)
        // assignment to `yield` and `await` is valid (even wrapped)
        // wrapped reserved words are still a syntax error
      ], // group
      [
        '    arrow',
        {
          code: '(x)=>x;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {
              type: 'ArrowFunctionExpression',
              params: [
                {type: 'Identifier', name: 'x'},
              ],
              id: null,
              generator: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            }},
          ]},
          desc: 'arrow, one arg, expr',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        {
          code: '(x, y)=>x;',
          ast: {type: 'Program', body: [
            {type: 'ExpressionStatement', expression: {
              type: 'ArrowFunctionExpression',
              params: [
                {type: 'Identifier', name: 'x'},
                {type: 'Identifier', name: 'y'},
              ],
              id: null,
              generator: false,
              expression: true,
              body: {type: 'Identifier', name: 'x'},
            }},
          ]},
          desc: 'arrow, one arg, expr',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },



        //{ error
        //  code: '((x)) => x;',
        //  ast: {type: 'Program', body: [
        //    {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
        //  ]},
        //  desc: 'silly double group',
        //  tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        //},
        //{ error
        //  code: '(a, 1, "c", d, e, f) => x;',
        //  ast: {type: 'Program', body: [
        //    {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
        //      {type: 'Identifier', name: 'a'},
        //      {type: 'Literal', value: '<TODO>', raw: '1'},
        //      {type: 'Literal', value: '<TODO>', raw: '"c"'},
        //      {type: 'Identifier', name: 'd'},
        //      {type: 'Identifier', name: 'e'},
        //      {type: 'Identifier', name: 'f'},
        //    ]}},
        //  ]},
        //  desc: 'group of some simple values',
        //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        //},
        {
          code: '(a = 1, b = 2) => x;',
          ast: {
            type: 'Program', body: [{
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [
                  {
                    type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '=',
                    right: {type: 'Literal', value: '<TODO>', raw: '1'}
                  },
                  {
                    type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'b'},
                    operator: '=',
                    right: {type: 'Literal', value: '<TODO>', raw: '2'}
                  },
                ], id: null, generator: false, expression: true, body: {type: 'Identifier', name: 'x'},
              },
            }],
          },
          desc: 'group of some two assignments',
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
        },
        //{ error
        //  code: '(a.b) => x;',
        //  ast: {type: 'Program', body: [
        //    {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        //      left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
        //      operator: '=',
        //      right: {type: 'Literal', value: '<TODO>', raw: '1'},
        //    }},
        //  ]},
        //  desc: 'assignment to a wrapped property, silly but valid',
        //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        //},
        //{ error
        //  code: '(a[b]) => x;',
        //  ast: {type: 'Program', body: [
        //    {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        //      left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
        //      operator: '=',
        //      right: {type: 'Literal', value: '<TODO>', raw: '1'},
        //    }},
        //  ]},
        //  desc: 'assignment to a wrapped property, silly but valid',
        //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
        //},

      ],
    ], // group/arrow

    [
      '  literals',
      {
        code: 'null',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: null,
            raw: 'null',
          }},
        ]},
        desc: 'null literal',
        tokens: [$IDENT, $ASI],
      },
      {
        code: 'true',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: true,
            raw: 'true',
          }},
        ]},
        desc: 'true literal',
        tokens: [$IDENT, $ASI],
      },
      {
        code: 'false',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: false,
            raw: 'false',
          }},
        ]},
        desc: 'false literal',
        tokens: [$IDENT, $ASI],
      },
      {
        code: 'super',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Super',
          }},
        ]},
        desc: 'super literal', // to be refined...
        tokens: [$IDENT, $ASI],
      },
      {
        code: '"foo"',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: '<TODO>',
            raw: '"foo"',
          }},
        ]},
        desc: 'double string literal',
        tokens: [$STRING_DOUBLE, $ASI],
      },
      {
        code: `'foo'`,
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: '<TODO>',
            raw: `'foo'`,
          }},
        ]},
        desc: 'single string literal',
        tokens: [$STRING_SINGLE, $ASI],
      },
      {
        code: '123',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: '<TODO>',
            raw: '123',
          }},
        ]},
        desc: 'decimal number',
        tokens: [$NUMBER_DEC, $ASI],
      },
      {
        code: '0x123',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: '<TODO>',
            raw: '0x123',
          }},
        ]},
        desc: 'hexadecimal number',
        tokens: [$NUMBER_HEX, $ASI],
      },
      {
        code: '0o123',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: '<TODO>',
            raw: '0o123',
          }},
        ]},
        desc: 'octal number',
        tokens: [$NUMBER_OCT, $ASI],
      },
      {
        code: '0b1010',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: '<TODO>',
            raw: '0b1010',
          }},
        ]},
        desc: 'binary number',
        tokens: [$NUMBER_BIN, $ASI],
      },
      {
        code: '0456',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'Literal',
            value: '<TODO>',
            raw: '0456',
          }},
        ]},
        desc: 'legacy octal number',
        tokens: [$NUMBER_OLD, $ASI],
      },
      {
        code: 'this',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'ThisExpression',
          }},
        ]},
        desc: 'this keyword',
        tokens: [$IDENT, $ASI],
      },
    ], // literals
    [
      '  template',
      {
        code: '`foo`',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'TemplateLiteral',
            expressions: [],
            quasis: [
              {type: 'TemplateElement', tail: true, value: {raw: '`foo`', cooked: '<TODO>'}},
            ],
          }},
        ]},
        desc: 'pure template',
        tokens: [$TICK_PURE, $ASI],
      },
      {
        code: '`foo${bar}baz`',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'TemplateLiteral',
            expressions: [
              {type: 'Identifier', name: 'bar'},
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
            ],
          }},
        ]},
        desc: 'head${expr}tail template',
        tokens: [$TICK_HEAD, $IDENT, $TICK_TAIL, $ASI],
      },
      // nested template stuff
    ], // template
  ], // expression
];


function all(tests) {
  for (let test of tests) {
    if (typeof test === 'string') console.log(' --- ' + test + ' --- ');
    else if (Array.isArray(test)) all(test);
    else one(test);
  }
}
function one({code, ast, desc, tokens}) {
  ++testi;
  if (_one('   ', code, ast, desc, tokens)) {
    _one('[a]', '\n' + code, ast, desc, tokens);
    _one('[b]', code + '\n', ast, desc, tokens);
    _one('[c]', ' ' + code, ast, desc, tokens);
    _one('[d]', code + ' ', ast, desc, tokens);
  }
}
function _one(testSuffix, code, ast, desc, tokens) {
  let prefix = testi + testSuffix;

                                                                                            //if (parseInt(prefix,10) !== 119) return;

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

  return passed;
}

let pass = 0;
let fail = 0;
let crash = 0;
let testi = 0;
all(tests);
console.log(`
#####
passed: ${pass}, crashed: ${crash}, failed: ${fail-crash}
`);
