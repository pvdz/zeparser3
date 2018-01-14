let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  $REGEX,
} = require('../../../../src/zetokenizer');


module.exports = (describe, test) => describe('functions', _ => {

  // note: this file is about function _expressions_. Don't put generic function stuff here.

  test('simpelest anonymous function expression',{
    code: 'foo(function(){})',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {
          type: 'FunctionExpression',
          generator: false,
          async: false,
          expression: false,
          id: null,
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      ]}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('simpelest named function expression',{
    code: 'foo(function f(){})',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'FunctionExpression', generator: false, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
      ]}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('simpelest anonymous generator expression',{
    code: 'foo(function*(){})',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'FunctionExpression', generator: true, async: false, expression: false, id: null, params: [], body: {type: 'BlockStatement', body: []}},
      ]}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('simpelest named generator expression',{
    code: 'foo(function* f(){})',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'FunctionExpression', generator: true, async: false, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
      ]}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('simpelest anonymous async function expression',{
    code: 'foo(async function(){})',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'FunctionExpression', generator: false, async: true, expression: false, id: null, params: [], body: {type: 'BlockStatement', body: []}},
      ]}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('simpelest async named function expression',{
    code: 'foo(async function f(){})',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
        {type: 'FunctionExpression', generator: false, async: true, expression: false, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
      ]}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  describe('regex edge case', _ => {

    describe('sans async', _ => {

      describe('declaration', _ => {

        test('sans flag', {
          code: 'function f(){}\n/foo/',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [],
                body: { type: 'BlockStatement', body: [] } },
                { type: 'ExpressionStatement',
                  expression: { type: 'Literal', value: '<TODO>', raw: '/foo/' } } ] },
          desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });

        test('with flag', {
          code: 'function f(){}\n/foo/g',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [],
                body: { type: 'BlockStatement', body: [] } },
                { type: 'ExpressionStatement',
                  expression: { type: 'Literal', value: '<TODO>', raw: '/foo/g' } } ] },
          desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
      });

      describe('expression', _ => {
        test('sans flag', {
          code: 'typeof function f(){}\n/foo/',
          throws: 'Expected to parse a value',
          desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [],
        });

        test('with flag', {
          code: 'typeof function f(){}\n/foo/g',
          ast: { type: 'Program',
            body:
              [ { type: 'ExpressionStatement',
                expression:
                { type: 'BinaryExpression',
                  left:
                  { type: 'BinaryExpression',
                    left:
                    { type: 'UnaryExpression',
                      operator: 'typeof',
                      prefix: true,
                      argument:
                      { type: 'FunctionExpression',
                        generator: false,
                        async: false,
                        expression: false,
                        id: { type: 'Identifier', name: 'f' },
                        params: [],
                        body: { type: 'BlockStatement', body: [] } } },
                    operator: '/',
                    right: { type: 'Identifier', name: 'foo' } },
                  operator: '/',
                  right: { type: 'Identifier', name: 'g' } } } ] },
          desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });
      });
    });

    describe('with async', _ => {

      describe('declaration', _ => {

        test('sans flag', {
          code: 'async function f(){}\n/foo/',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: true,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [],
                body: { type: 'BlockStatement', body: [] } },
                { type: 'ExpressionStatement',
                  expression: { type: 'Literal', value: '<TODO>', raw: '/foo/' } } ] },
          desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });

        test('with flag', {
          code: 'async function f(){}\n/foo/g',
          ast: { type: 'Program',
            body:
              [ { type: 'FunctionDeclaration',
                generator: false,
                async: true,
                expression: false,
                id: { type: 'Identifier', name: 'f' },
                params: [],
                body: { type: 'BlockStatement', body: [] } },
                { type: 'ExpressionStatement',
                  expression: { type: 'Literal', value: '<TODO>', raw: '/foo/g' } } ] },
          desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
        });
      });

      describe('expression', _ => {

        test('sans flag', {
          code: 'typeof async function f(){}\n/foo/',
          throws: 'Expected to parse a value',
          desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [],
        });

        test('with flag', {
          code: 'typeof async function f(){}\n/foo/g',
          ast: { type: 'Program',
            body:
              [ { type: 'ExpressionStatement',
                expression:
                { type: 'BinaryExpression',
                  left:
                  { type: 'BinaryExpression',
                    left:
                    { type: 'UnaryExpression',
                      operator: 'typeof',
                      prefix: true,
                      argument:
                      { type: 'FunctionExpression',
                        generator: false,
                        async: true,
                        expression: false,
                        id: { type: 'Identifier', name: 'f' },
                        params: [],
                        body: { type: 'BlockStatement', body: [] } } },
                    operator: '/',
                    right: { type: 'Identifier', name: 'foo' } },
                  operator: '/',
                  right: { type: 'Identifier', name: 'g' } } } ] },
          desc: 'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
          tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });
      });
    });
  });
  // error for generator AND async
});
