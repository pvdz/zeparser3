//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
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
  ], // decl
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
    {
      code: 'function f(a=b){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'AssignmentPattern',
            left: {type: 'Identifier', name: 'a'},
            right: {type: 'Identifier', name: 'b'},
          },
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'simple arg default',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f(a=b=c){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'AssignmentPattern',
            left: {type: 'Identifier', name: 'a'},
            right: {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'b'},
              operator: '=',
              right: {type: 'Identifier', name: 'c'},
            },
          },
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'arg default that is also an assignment',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f([a]){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'an array destructuring arg',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f([a]=x){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'AssignmentPattern',
            left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
            right: {type: 'Identifier', name: 'x'},
          },
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'an array destructuring arg with arg default (an AssignmentPattern!)',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f([a=b]){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'ArrayPattern', elements: [
            {type: 'AssignmentPattern',
              left: {type: 'Identifier', name: 'a'},
              right: {type: 'Identifier', name: 'b'},
            },
          ]},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'an array destructuring arg with destructuring default (also an AssignmentPattern!)',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f([a=b=c]){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'ArrayPattern', elements: [
            {type: 'AssignmentPattern',
              left: {type: 'Identifier', name: 'a'},
              right: {type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '=',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          ]},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'array destructuring with an AssignmentPattern AND AssignmentExpression',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f([a=b+=c]){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'ArrayPattern', elements: [
            {type: 'AssignmentPattern',
              left: {type: 'Identifier', name: 'a'},
              right: {type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '+=',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          ]},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'array destructuring with an AssignmentPattern AND a _compound_ AssignmentExpression',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f([a = b = c] = arr){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'AssignmentPattern',
            left: {type: 'ArrayPattern', elements: [
              {type: 'AssignmentPattern',
                left: {type: 'Identifier', name: 'a'},
                right: {type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '=',
                  right: {type: 'Identifier', name: 'c'},
                },
              },
            ]},
            right: {type: 'Identifier', name: 'arr'},
          },
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'array destructuring with an AssignmentPattern AND AssignmentExpression AND another outer arg default',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f([a], b){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
          {type: 'Identifier', name: 'b'},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'an array destructuring arg and regular arg',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: 'function f(b, [a]){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'Identifier', name: 'b'},
          {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      desc: 'regular arg and an array destructuring arg',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
  ], // args
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
  ], // body
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
    // test error when doing `async \n function` or even without function (asi causes error)
  ], // async
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
  ], // generator
];

//export default tests;
module.exports = tests;
