let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
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

  // error for generator AND async
});
