let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('functions', _ => {

  describe('declaration', _ => {

    test('empty function decl',{
      code: 'function f(){}',
      ast: {type: 'Program', body: [{
        type: 'FunctionDeclaration',
        generator: false,
        async: false,
        expression: false,
        id: {type: 'Identifier', name: 'f'},
        params: [],
        body: {
          type: 'BlockStatement', body: [],
        },
      }]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    describe('illegal statements in strict mode', _ => {

      test('inside while', {
        code: `while (false) function g() {}`,
        startInStrictMode: true,
        throws: 'Function statement',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('inside if', {
        code: `if (false) function g() {}`,
        startInStrictMode: true,
        throws: 'Function statement',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('inside else', {
        code: `if (false) foo; else function g() {}`,
        startInStrictMode: true,
        throws: 'Function statement',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('inside for', {
        code: `for (a in b) function g() {}`,
        startInStrictMode: true,
        throws: 'Function statement',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('inside do', {
        code: `do function g() {} while (false)`,
        startInStrictMode: true,
        throws: 'Function statement',
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('inside label', {
        code: `foo: function g() {}`,
        startInStrictMode: true,
        throws: 'Function statement',
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('deep nested', {
        code: `if (x) if (x) if (x) if (x) if (x) if (x) function g() {}`,
        startInStrictMode: true,
        throws: 'Function statement',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('inside block', {
        code: `{ function g() {} }`,
        startInStrictMode: true,
        ast: { type: 'Program', body: [{type: 'BlockStatement', body: [{
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier', name: 'g' },
          params: [],
          body: {
            type: 'BlockStatement', body: [],
          },
        }]}]},
        tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('inside nested block', {
        code: `{{{ function g() {} }}}`,
        startInStrictMode: true,
        ast: {
          type: 'Program', body: [
            {type: 'BlockStatement', body: [{type: 'BlockStatement', body: [{type: 'BlockStatement', body: [{
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: { type: 'Identifier', name: 'g' },
              params: [],
              body: {
                type: 'BlockStatement', body: [],
              },
            }]}]}]}],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        desc: 'make sure lexerflags get reset on block boundary'
      });

      test('preceded by other statement in a block', {
        code: `
          {
            if (x) y;
            function g() {}
          }
        `,
        startInStrictMode: true,
        ast: {type: 'Program', body: [{
          type: 'BlockStatement',
          body: [{
            type: 'IfStatement',
            test: {type: 'Identifier', name: 'x'},
            consequent: {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'y'},
            },
            alternate: null,
          }, {
            type: 'FunctionDeclaration',
            generator: false,
            async: false,
            expression: false,
            id: { type: 'Identifier', name: 'g' },
            params: [],
            body: { type: 'BlockStatement', body: []},
          }],
        }]},
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        desc: 'slightly redundant but lexerflags should not flow over from previous statement',
      });

      test('nested inside block', {
        code: `if (x) { function g() {} }`,
        startInStrictMode: true,
        ast: {type: 'Program', body: [{
          type: 'IfStatement',
          test: { type: 'Identifier', name: 'x' },
          consequent: {
            type: 'BlockStatement',
            body: [{
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: { type: 'Identifier', name: 'g' },
              params: [],
              body: { type: 'BlockStatement', body: []},
            }],
          },
          alternate: null,
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        desc: 'block should reset lexerflags',
      });

      test('preceded by other statement in a nested block', {
        code: `
          if (z) {
            if (x) y;
            function g() {}
          }
        `,
        startInStrictMode: true,
        ast: { type: 'Program', body: [{
          type: 'IfStatement',
          test: { type: 'Identifier', name: 'z' },
          consequent: {
            type: 'BlockStatement',
            body: [{
              type: 'IfStatement',
              test: { type: 'Identifier', name: 'x' },
              consequent: {
                type: 'ExpressionStatement',
                expression: { type: 'Identifier', name: 'y' },
              },
              alternate: null,
            }, {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'g'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            }]},
            alternate: null,
        }]},
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        desc: 'make sure lexerflags get reset on block boundary',
      });
    });
  });

  describe('function args', _ => {

    test('function decl, one arg, empty body',{
      code: 'function f(a){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'Identifier', name: 'a'},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('function decl, two args, empty body',{
      code: 'function f(a,b){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('simple arg default',{
      code: 'function f(a=b){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'AssignmentPattern',
            left: {type: 'Identifier', name: 'a'},
            right: {type: 'Identifier', name: 'b'},
          },
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('arg default that is also an assignment',{
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
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('an array destructuring arg',{
      code: 'function f([a]){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('an array destructuring arg with arg default (an AssignmentPattern!)',{
      code: 'function f([a]=x){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'AssignmentPattern',
            left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
            right: {type: 'Identifier', name: 'x'},
          },
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('an array destructuring arg with destructuring default (also an AssignmentPattern!)',{
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
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('array destructuring with an AssignmentPattern AND AssignmentExpression',{
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
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('array destructuring with an AssignmentPattern AND a _compound_ AssignmentExpression',{
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
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('array destructuring with an AssignmentPattern AND AssignmentExpression AND another outer arg default',{
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
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('an array destructuring arg and regular arg',{
      code: 'function f([a], b){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
          {type: 'Identifier', name: 'b'},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('regular arg and an array destructuring arg',{
      code: 'function f(b, [a]){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
          {type: 'Identifier', name: 'b'},
          {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}]},
        ], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('body', _ => {

    test('function decl, no args, one stmt',{
      code: 'function f(){foo}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
        ]}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
    });

    test('function decl, no args, two stmts',{
      code: 'function f(){foo;bar}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: [
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
          {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
        ]}},
      ]},
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
    });
  });

  // there are more extensive tests in the async test file
  describe('async', _ => {

    test('empty async function',{
      code: 'async function f(){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: false, async: true, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  // there are more extensive tests in the generator test file
  describe('generators', _ => {

    test('empty async function',{
      code: 'function* f(){}',
      ast: {type: 'Program', body: [
        {type: 'FunctionDeclaration', generator: true, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });
  });
});
