//import ZeTokenizer, {
let {
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
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
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
];

//export default tests;
module.exports = tests;
