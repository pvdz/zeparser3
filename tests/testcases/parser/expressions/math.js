let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../../src/zetokenizer');


module.exports = (describe, test) => describe('math ops', _ => {

  test('bin +',{
    code: 'a+b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '+',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin -',{
    code: 'a-b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '-',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin *',{
    code: 'a*b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '*',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin /',{
    code: 'a/b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '/',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin ** (pow)',{
    code: 'a**b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '**',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('bin or',{
    code: 'a%b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '%',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
});
