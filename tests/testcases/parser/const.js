//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
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
];

//export default tests;
module.exports = tests;
