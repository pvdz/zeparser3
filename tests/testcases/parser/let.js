//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
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
      desc: 'let, destructured array with one var, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'let [,,,foo] = arr;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [
            null,
            null,
            null,
            {type: 'Identifier', name: 'foo'},
          ]}, init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      desc: 'let, destructuring with leading elisions, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'let [foo,,,] = arr;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'foo'},
            null,
            null,
          ]}, init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      desc: 'let, destructuring with trailing elisions, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'let {foo} = arr;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'ObjectPattern', properties: [
            {type: 'Identifier', name: 'foo'},
          ]}, init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      desc: 'let, destructuring obj with shorthand, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'let {foo,} = arr;',
      ast: {type: 'Program', body: [
        {type: 'VariableDeclaration', kind: 'let', declarations: [
          {type: 'VariableDeclarator', id: {type: 'ObjectPattern', properties: [
            {type: 'Identifier', name: 'foo'},
          ]}, init: {type: 'Identifier', name: 'arr'}},
        ]},
      ]},
      desc: 'let, destructuring obj with shorthand and trailing comma, no init, semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
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
];

//export default tests;
module.exports = tests;
