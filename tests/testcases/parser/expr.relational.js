let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('relational operators', _ => {

  test('relational <',{
    code: 'a<b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '<',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('relational <=',{
    code: 'a<=b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '<=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('relational >',{
    code: 'a>b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '>',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('relational >=',{
    code: 'a>=b',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'BinaryExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '>=',
        right: {type: 'Identifier', name: 'b'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
});
