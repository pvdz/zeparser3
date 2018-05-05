let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');

// TODO: replace the startInStrictMode stuff with sloppy mode results instead
module.exports = (describe, test) => describe('functions', _ => {

  // arrow specific tests go into expressions/arrow
  // expression specific tests go into expressions/function

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
        throws: 'Function statement',
        SLOPPY_SCRIPT: {
          ast: { type: 'Program',
            body:
              [ { type: 'WhileStatement',
                test: { type: 'Literal', value: false, raw: 'false' },
                body:
                  { type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: { type: 'Identifier', name: 'g' },
                    params: [],
                    body: { type: 'BlockStatement', body: [] } } } ] },
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
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

    describe('classic vars', _ => {

      test('one arg', {
        code: 'function f(a){}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
            {type: 'Identifier', name: 'a'},
          ], body: {type: 'BlockStatement', body: []}},
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('two args', {
        code: 'function f(a,b){}',
        ast: {type: 'Program', body: [
          {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
          ], body: {type: 'BlockStatement', body: []}},
        ]},
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('trailing comma', _ => {

      describe('enabled', _ => {

        test('must have args', {
          code: 'function f(,){}',
          options: {trailingArgComma: true}, // default
          throws: 'Expected to parse a(nother) binding but none was found',
          tokens: [],
        });

        test('one arg', {
          code: 'function f(a,){}',
          options: {trailingArgComma: true}, // default
          ast: {type: 'Program', body: [
              {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
                  {type: 'Identifier', name: 'a'},
                ], body: {type: 'BlockStatement', body: []}},
            ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two args', {
          code: 'function f(a,b,){}',
          options: {trailingArgComma: true}, // default
          ast: {type: 'Program', body: [
              {type: 'FunctionDeclaration', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [
                  {type: 'Identifier', name: 'a'},
                  {type: 'Identifier', name: 'b'},
                ], body: {type: 'BlockStatement', body: []}},
            ]},
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('cannot elide', {
          code: 'function f(a,,){}',
          options: {trailingArgComma: true}, // default
          throws: 'Expected to parse a(nother) binding but none was found',
          tokens: [],
        });
      });

      describe('disabled', _ => {

        test('must have args', {
          code: 'function f(,){}',
          options: {trailingArgComma: false},
          throws: 'Expected to parse a(nother) binding but none was found',
          tokens: [],
        });

        test('one arg', {
          code: 'function f(a,){}',
          options: {trailingArgComma: false},
          throws: 'Trailing function argument comma',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two args', {
          code: 'function f(a,b,){}',
          options: {trailingArgComma: false},
          throws: 'Trailing function argument comma',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('cannot elide', {
          code: 'function f(a,,){}',
          options: {trailingArgComma: false},
          throws: 'Expected to parse a(nother) binding but none was found',
          tokens: [],
        });
      });
    });

    describe('defaults', _ => {

      test('simple arg default', {
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

      test('arg default that is also an assignment', {
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
    });

    describe('destructuring', _ => {

      // these cases should mirror conceptual tests from let.js where they make sense here

      // for destructuring, these are the array pattern tests to check for all places where we'd want to check it:
      // note: the "init" is optional in this context since the arg is the init. I think the assignment is a default.
      // function f([]){}
      // function f([] = x){}
      // function f([,]){}
      // function f([,] = x){}
      // function f([,,]){}
      // function f([,,] = x){}
      // function f([foo]){}
      // function f([foo] = x){}
      // function f([foo,]){}
      // function f([foo,] = x){}
      // function f([foo,,]){}
      // function f([foo,,] = x){}
      // function f([,foo]){}
      // function f([,foo] = x){}
      // function f([,,foo]){}
      // function f([,,foo] = x){}
      // function f([foo,bar]){}
      // function f([foo,bar] = x){}
      // function f([foo,,bar]){}
      // function f([foo,,bar] = x){}
      // function f([foo], [foo]){}
      // function f([foo] = x, [foo] = y){}
      // function f([foo], b){}
      // function f([foo] = x, b){}
      // function f([foo], b = y){}
      // function f([foo] = x, b = y){}
      // function f(x, [foo]){}
      // function f(x, [foo] = y){}
      // function f(x = y, [foo] = z){}
      // function f(x = y, [foo]){}
      // function f([foo=a]){}
      // function f([foo=a] = c){}
      // function f([foo=a,bar]){}
      // function f([foo=a,bar] = x){}
      // function f([foo,bar=b]){}
      // function f([foo,bar=b] = x){}
      // function f([foo=a,bar=b]){}
      // function f([foo=a,bar=b] = x){}
      // function f([...bar] = obj){}
      // function f([foo, ...bar] = obj){}
      // function f([...foo, bar] = obj){}   // error
      // function f([...foo,] = obj){}       // ok!
      // function f([...foo,,] = obj){}      // error
      // function f([...[a, b]] = obj){}
      // function f([...[a, b],] = obj){}    // ok!
      // function f([...[a, b],,] = obj){}   // error
      // function f([x, ...[a, b]] = obj){}
      // function f([...bar = foo] = obj){}  // error (TODO: except in funcs, arrows, and maybe `for`?)
      // function f([... ...foo] = obj){}    // error
      // function f([...] = obj){}           // error
      // function f([...,] = obj){}          // error
      // function f([.x] = obj){}            // error
      // function f([..x] = obj){}           // error

      // and these are the object versions:
      // function f({} = x){}
      // function f({,} = x){}             // error
      // function f({,,} = x){}            // error
      // function f({foo} = x){}
      // function f({foo,} = x){}          // ok
      // function f({foo,,} = x){}         // error
      // function f({,foo} = x){}          // error
      // function f({,,foo} = x){}         // error
      // function f({foo,bar} = x){}
      // function f({foo,,bar} = x){}      // error
      // function f({foo} = x, {foo} = y){}
      // function f({foo} = x, b){}
      // function f({foo} = x, b = y){}
      // function f(x, {foo} = y){}
      // function f(x = y, {foo} = z){}
      // function f({foo=a} = x){}
      // function f({foo=a,bar} = x){}
      // function f({foo,bar=b} = x){}
      // function f({foo=a,bar=b} = x){}
      // function f({foo:a} = x){}
      // function f({foo:a,bar} = x){}
      // function f({foo,bar:b} = x){}
      // function f({foo:a,bar:b} = x){}
      // function f({foo:a,bar:b} = x){}
      // function f({foo:a=b} = x){}
      // function f({foo:a=b, bar:c=d} = x){}
      // function f({foo}){}
      // function f({foo=a}){}
      // function f({foo:a}){}
      // function f({foo:a=b}){}
      // function f({foo}, bar){}
      // function f(foo, {bar}){}

      describe('array', _ => {

        // function f([]){}
        // function f([] = x){}
        // function f([,]){}
        // function f([,] = x){}
        // function f([,,]){}
        // function f([,,] = x){}
        // function f([foo]){}
        // function f([foo] = x){}
        // function f([foo,]){}
        // function f([foo,] = x){}
        // function f([foo,,]){}
        // function f([foo,,] = x){}
        // function f([,foo]){}
        // function f([,foo] = x){}
        // function f([,,foo]){}
        // function f([,,foo] = x){}
        // function f([foo,bar]){}
        // function f([foo,bar] = x){}
        // function f([foo,,bar]){}
        // function f([foo,,bar] = x){}
        // function f([foo], [foo]){}
        // function f([foo] = x, [foo] = y){}
        // function f([foo], b){}
        // function f([foo] = x, b){}
        // function f([foo], b = y){}
        // function f([foo] = x, b = y){}
        // function f(x, [foo]){}
        // function f(x, [foo] = y){}
        // function f(x = y, [foo] = z){}
        // function f(x = y, [foo]){}
        // function f([foo=a]){}
        // function f([foo=a] = c){}
        // function f([foo=a,bar]){}
        // function f([foo=a,bar] = x){}
        // function f([foo,bar=b]){}
        // function f([foo,bar=b] = x){}
        // function f([foo=a,bar=b]){}
        // function f([foo=a,bar=b] = x){}


        test('empty array sans default', {
          code: 'function f([]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [ { type: 'ArrayPattern', elements: [] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty array with default', {
          code: 'function f([] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left: { type: 'ArrayPattern', elements: [] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty array one comma sans default', {
          code: 'function f([,]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [ { type: 'ArrayPattern', elements: [ null ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty array one comma with default', {
          code: 'function f([,] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left: { type: 'ArrayPattern', elements: [ null ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty array double comma sans default', {
          code: 'function f([,,]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [ { type: 'ArrayPattern', elements: [ null, null ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('empty array double comma with default', {
          code: 'function f([,,] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left: { type: 'ArrayPattern', elements: [ null, null ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident in array sans default', {
          code: 'function f([foo]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ { type: 'Identifier', name: 'foo' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident in array with default', {
          code: 'function f([foo] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident trailing comma in array sans default', {
          code: 'function f([foo,]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ { type: 'Identifier', name: 'foo' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident trailing comma in array with default', {
          code: 'function f([foo,] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident double trailing comma in array sans default', {
          code: 'function f([foo,,]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ { type: 'Identifier', name: 'foo' }, null ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident double trailing comma in array with default', {
          code: 'function f([foo,,] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' }, null ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident leading comma in array sans default', {
          code: 'function f([,foo]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ null, { type: 'Identifier', name: 'foo' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident leading comma in array with default', {
          code: 'function f([,foo] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ null, { type: 'Identifier', name: 'foo' } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident double leading comma in array sans default', {
          code: 'function f([,,foo]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ null, null, { type: 'Identifier', name: 'foo' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('one ident double leading comma in array with default', {
          code: 'function f([,,foo] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ null, null, { type: 'Identifier', name: 'foo' } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array sans default', {
          code: 'function f([foo,bar]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements:
                      [ { type: 'Identifier', name: 'foo' },
                        { type: 'Identifier', name: 'bar' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array with default', {
          code: 'function f([foo,bar] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements:
                        [ { type: 'Identifier', name: 'foo' },
                          { type: 'Identifier', name: 'bar' } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident double comma in array sans default', {
          code: 'function f([foo,,bar]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements:
                      [ { type: 'Identifier', name: 'foo' },
                        null,
                        { type: 'Identifier', name: 'bar' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident double comma in array with default', {
          code: 'function f([foo,,bar] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements:
                        [ { type: 'Identifier', name: 'foo' },
                          null,
                          { type: 'Identifier', name: 'bar' } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double destruct on same name in array sans default', {
          code: 'function f([foo], [foo]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ { type: 'Identifier', name: 'foo' } ] },
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          desc: 'TODO: this is an error because the same name is bound twice',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double destruct in array sans default', {
          code: 'function f([foo], [bar]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ { type: 'Identifier', name: 'foo' } ] },
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'bar' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double destruct in array with default', {
          code: 'function f([foo] = x, [bar] = y){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] },
                    right: { type: 'Identifier', name: 'x' } },
                    { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'bar' } ] },
                      right: { type: 'Identifier', name: 'y' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('destruct and ident sans default', {
          code: 'function f([foo], b){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ { type: 'Identifier', name: 'foo' } ] },
                    { type: 'Identifier', name: 'b' } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('destruct and ident with default', {
          code: 'function f([foo] = x, b){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] },
                    right: { type: 'Identifier', name: 'x' } },
                    { type: 'Identifier', name: 'b' } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('destruct and ident with default', {
          code: 'function f([foo], b = y){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements: [ { type: 'Identifier', name: 'foo' } ] },
                    { type: 'AssignmentPattern',
                      left: { type: 'Identifier', name: 'b' },
                      right: { type: 'Identifier', name: 'y' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('destruct and ident both default', {
          code: 'function f([foo] = x, b = y){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] },
                    right: { type: 'Identifier', name: 'x' } },
                    { type: 'AssignmentPattern',
                      left: { type: 'Identifier', name: 'b' },
                      right: { type: 'Identifier', name: 'y' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ident and destruct sans default', {
          code: 'function f(x, [foo]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'Identifier', name: 'x' },
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ident and destruct with default', {
          code: 'function f(x, [foo] = y){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'Identifier', name: 'x' },
                    { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      right: { type: 'Identifier', name: 'y' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ident and destruct both default', {
          code: 'function f(x = y, [foo] = z){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left: { type: 'Identifier', name: 'x' },
                    right: { type: 'Identifier', name: 'y' } },
                    { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements: [ { type: 'Identifier', name: 'foo' } ] },
                      right: { type: 'Identifier', name: 'z' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ident and destruct left default', {
          code: 'function f(x = y, [foo]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left: { type: 'Identifier', name: 'x' },
                    right: { type: 'Identifier', name: 'y' } },
                    { type: 'ArrayPattern',
                      elements: [ { type: 'Identifier', name: 'foo' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ident in array with default sans default', {
          code: 'function f([foo=a]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements:
                      [ { type: 'AssignmentPattern',
                        left: { type: 'Identifier', name: 'foo' },
                        right: { type: 'Identifier', name: 'a' } } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ident in array with default with default', {
          code: 'function f([foo=a] = c){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements:
                        [ { type: 'AssignmentPattern',
                          left: { type: 'Identifier', name: 'foo' },
                          right: { type: 'Identifier', name: 'a' } } ] },
                    right: { type: 'Identifier', name: 'c' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array with default and sans default, sans default', {
          code: 'function f([foo=a,bar]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements:
                      [ { type: 'AssignmentPattern',
                        left: { type: 'Identifier', name: 'foo' },
                        right: { type: 'Identifier', name: 'a' } },
                        { type: 'Identifier', name: 'bar' } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array with default and sans default, with default', {
          code: 'function f([foo=a,bar] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements:
                        [ { type: 'AssignmentPattern',
                          left: { type: 'Identifier', name: 'foo' },
                          right: { type: 'Identifier', name: 'a' } },
                          { type: 'Identifier', name: 'bar' } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array sans default and with default, sans default', {
          code: 'function f([foo,bar=b]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements:
                      [ { type: 'Identifier', name: 'foo' },
                        { type: 'AssignmentPattern',
                          left: { type: 'Identifier', name: 'bar' },
                          right: { type: 'Identifier', name: 'b' } } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array sans default and with default, with default', {
          code: 'function f([foo,bar=b] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements:
                        [ { type: 'Identifier', name: 'foo' },
                          { type: 'AssignmentPattern',
                            left: { type: 'Identifier', name: 'bar' },
                            right: { type: 'Identifier', name: 'b' } } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array both default, sans default', {
          code: 'function f([foo=a,bar=b]){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements:
                      [ { type: 'AssignmentPattern',
                        left: { type: 'Identifier', name: 'foo' },
                        right: { type: 'Identifier', name: 'a' } },
                        { type: 'AssignmentPattern',
                          left: { type: 'Identifier', name: 'bar' },
                          right: { type: 'Identifier', name: 'b' } } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('double ident in array both default, with default', {
          code: 'function f([foo=a,bar=b] = x){}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'AssignmentPattern',
                    left:
                    { type: 'ArrayPattern',
                      elements:
                        [ { type: 'AssignmentPattern',
                          left: { type: 'Identifier', name: 'foo' },
                          right: { type: 'Identifier', name: 'a' } },
                          { type: 'AssignmentPattern',
                            left: { type: 'Identifier', name: 'bar' },
                            right: { type: 'Identifier', name: 'b' } } ] },
                    right: { type: 'Identifier', name: 'x' } } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('ident with default that is an assignment sans default', {
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

        test('ident with default that is a compound assignment', {
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

        test('ident with default that is an assignment with default', {
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

        test('regression case', {
          code: 'function f([a, {b: []}]) {}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ArrayPattern',
                    elements:
                      [ { type: 'Identifier', name: 'a' },
                        { type: 'ObjectPattern',
                          properties:
                            [ { type: 'Property',
                              computed: false,
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              key: { type: 'Identifier', name: 'b' },
                              value: { type: 'ArrayPattern', elements: [] } } ] } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('array in object', {
          code: 'function f({x: [a, {b: []}]}) {}',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params:
                  [ { type: 'ObjectPattern',
                    properties:
                      [ { type: 'Property',
                        computed: false,
                        kind: 'init',
                        method: false,
                        shorthand: false,
                        key: { type: 'Identifier', name: 'x' },
                        value:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'a' },
                                { type: 'ObjectPattern',
                                  properties:
                                    [ { type: 'Property',
                                      computed: false,
                                      kind: 'init',
                                      method: false,
                                      shorthand: false,
                                      key: { type: 'Identifier', name: 'b' },
                                      value: { type: 'ArrayPattern', elements: [] } } ] } ] } } ] } ],
                body: { type: 'BlockStatement', body: [] } } ] },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        describe('rest operator', _ => {

          test('simple rest arg sans default', {
            code: 'function f([...bar]){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'ArrayPattern',
                      elements:
                        [ { type: 'RestElement',
                          argument: { type: 'Identifier', name: 'bar' } } ] } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('simple rest arg with default', {
            code: 'function f([...bar] = obj){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'RestElement',
                            argument: { type: 'Identifier', name: 'bar' } } ] },
                      right: { type: 'Identifier', name: 'obj' } } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('rest as second part sans default', {
            code: 'function f([foo, ...bar]){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'ArrayPattern',
                      elements:
                        [ { type: 'Identifier', name: 'foo' },
                          { type: 'RestElement',
                            argument: { type: 'Identifier', name: 'bar' } } ] } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('rest as second part with default', {
            code: 'function f([foo, ...bar] = obj){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'Identifier', name: 'foo' },
                            { type: 'RestElement',
                              argument: { type: 'Identifier', name: 'bar' } } ] },
                      right: { type: 'Identifier', name: 'obj' } } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('rest with arg after it sans default', {
            code: 'function f([...foo, bar]){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with arg after it with default', {
            code: 'function f([...foo, bar] = obj){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with trailing comma sans default', {
            code: 'function f([...foo,]){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with trailing comma with default', {
            code: 'function f([...foo,] = obj){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with double trailing comma sans default', {
            code: 'function f([...foo,,]){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with double trailing comma with default', {
            code: 'function f([...foo,,] = obj){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with destruct with two ident sans default', {
            code: 'function f([...[a, b]]){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'ArrayPattern',
                      elements:
                        [ { type: 'RestElement',
                          argument:
                          { type: 'ArrayPattern',
                            elements:
                              [ { type: 'Identifier', name: 'a' },
                                { type: 'Identifier', name: 'b' } ] } } ] } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('rest with destruct with two ident with default', {
            code: 'function f([...[a, b]] = obj){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'RestElement',
                            argument:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'a' },
                                  { type: 'Identifier', name: 'b' } ] } } ] },
                      right: { type: 'Identifier', name: 'obj' } } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('rest with destruct with two ident with trailing comma sans default', {
            code: 'function f([...[a, b],]){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with destruct with two ident with trailing comma with default', {
            code: 'function f([...[a, b],] = obj){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with destruct with two ident with double trailing comma sans default', {
            code: 'function f([...[a, b],,] = obj){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('rest with destruct with two ident with double trailing comma with default', {
            code: 'function f([...[a, b],,] = obj){}',
            throws: 'follow a rest',
            tokens: [],
          });

          test('nested rest as second sans default', {
            code: 'function f([x, ...[a, b]]){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'ArrayPattern',
                      elements:
                        [ { type: 'Identifier', name: 'x' },
                          { type: 'RestElement',
                            argument:
                            { type: 'ArrayPattern',
                              elements:
                                [ { type: 'Identifier', name: 'a' },
                                  { type: 'Identifier', name: 'b' } ] } } ] } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('nested rest as second with default', {
            code: 'function f([x, ...[a, b]] = obj){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'Identifier', name: 'x' },
                            { type: 'RestElement',
                              argument:
                              { type: 'ArrayPattern',
                                elements:
                                  [ { type: 'Identifier', name: 'a' },
                                    { type: 'Identifier', name: 'b' } ] } } ] },
                      right: { type: 'Identifier', name: 'obj' } } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('rest with local default sans default', {
            code: 'function f([...bar = foo]){}',
            throws: 'Cannot set a default on a rest value',
            tokens: [],
          });

          test('rest with local default with default', {
            code: 'function f([...bar = foo] = obj){}',
            throws: 'Cannot set a default on a rest value',
            tokens: [],
          });

          test('double rest sans default', {
            code: 'function f([... ...foo]){}',
            throws: 'Can not rest twice',
            tokens: [],
          });

          test('double rest with default', {
            code: 'function f([... ...foo] = obj){}',
            throws: 'Can not rest twice',
            tokens: [],
          });

          test('missing rest value sans default', {
            code: 'function f([...]){}',
            throws: 'Rest missing an ident or destruct',
            tokens: [],
          });

          test('missing rest value with default', {
            code: 'function f([...] = obj){}',
            throws: 'Rest missing an ident or destruct',
            tokens: [],
          });

          test('missing rest value with comma sans default', {
            code: 'function f([...,]){}',
            throws: 'Rest missing an ident or destruct',
            tokens: [],
          });

          test('missing rest value with comma with default', {
            code: 'function f([...,] = obj){}',
            throws: 'Rest missing an ident or destruct',
            tokens: [],
          });

          test('single dot not a rest', {
            code: 'function f([.x]){}',
            throws: 'Unexpected token while destructuring',
          });

          test('double dot vs rest', {
            code: 'function f([..x]){}',
            throws: 'Unexpected token while destructuring',
          });

          test('spread and rest sans default', {
            code: 'function f( [a=[...b], ...c]){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'ArrayPattern',
                      elements:
                        [ { type: 'AssignmentPattern',
                          left: { type: 'Identifier', name: 'a' },
                          right:
                          { type: 'ArrayExpression',
                            elements:
                              [ { type: 'SpreadElement',
                                argument: { type: 'Identifier', name: 'b' } } ] } },
                          { type: 'RestElement',
                            argument: { type: 'Identifier', name: 'c' } } ] } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('spread and rest with default', {
            code: 'function f( [a=[...b], ...c] = obj){}',
            ast: { type: 'Program',
              body:
                [ { type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: { type: 'Identifier', name: 'f' },
                  params:
                    [ { type: 'AssignmentPattern',
                      left:
                      { type: 'ArrayPattern',
                        elements:
                          [ { type: 'AssignmentPattern',
                            left: { type: 'Identifier', name: 'a' },
                            right:
                            { type: 'ArrayExpression',
                              elements:
                                [ { type: 'SpreadElement',
                                  argument: { type: 'Identifier', name: 'b' } } ] } },
                            { type: 'RestElement',
                              argument: { type: 'Identifier', name: 'c' } } ] },
                      right: { type: 'Identifier', name: 'obj' } } ],
                  body: { type: 'BlockStatement', body: [] } } ] },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });
        });
      });
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

// TODO: mirror tests for all functions (regular, expr, arrow, objlit method, class method)
// TODO: function statements not okay in ES5 strict mode but okay before/after/outside
