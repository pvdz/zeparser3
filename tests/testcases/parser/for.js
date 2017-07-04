//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
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
    {
      code: 'for (a + b * c * d;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '+',
            right: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '*',
                right: {type: 'Identifier', name: 'c'},
              },
              operator: '*',
              right: {type: 'Identifier', name: 'd'},
            },
          },
          test: {type: 'Identifier', name: 'b'},
          update: {type: 'Identifier', name: 'c'},
          body: {type: 'EmptyStatement'}},
      ]},
      desc: 'for-classic, init and test and update, empty body',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'for (a * b + c * d;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {
            type: 'BinaryExpression',
            left: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '*',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '+',
            right: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'c'},
              operator: '*',
              right: {type: 'Identifier', name: 'd'},
            },
          },
          test: {type: 'Identifier', name: 'b'},
          update: {type: 'Identifier', name: 'c'},
          body: {type: 'EmptyStatement'}},
      ]},
      desc: 'for-classic, init and test and update, empty body',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'for ((a * b + c) * d;b;c);',
      ast: {type: 'Program', body: [
        {type: 'ForStatement',
          init: {
            type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '*',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '+',
              right: {type: 'Identifier', name: 'c'},
            },
            operator: '*',
            right: {type: 'Identifier', name: 'd'},
          },
          test: {type: 'Identifier', name: 'b'},
          update: {type: 'Identifier', name: 'c'},
          body: {type: 'EmptyStatement'}},
      ]},
      desc: 'for-classic, expression disambiguation test',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
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
];

//export default tests;
module.exports = tests;
