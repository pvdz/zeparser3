let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('unary ops', _ => {

  test('positive prefix',{
    code: '+a',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UnaryExpression',
        operator: '+',
        prefix: true,
        argument: {type: 'Identifier', name: 'a'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('negative prefix',{
    code: '-a',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UnaryExpression',
        operator: '-',
        prefix: true,
        argument: {type: 'Identifier', name: 'a'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('bitwise invert',{
    code: '~a',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UnaryExpression',
        operator: '~',
        prefix: true,
        argument: {type: 'Identifier', name: 'a'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('incremental prefix',{
    code: '++a',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UpdateExpression',
        operator: '++',
        prefix: true,
        argument: {type: 'Identifier', name: 'a'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('decremental prefix',{
    code: '--a',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UpdateExpression',
        operator: '--',
        prefix: true,
        argument: {type: 'Identifier', name: 'a'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('incremental suffix',{
    code: 'a++',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UpdateExpression',
        argument: {type: 'Identifier', name: 'a'},
        operator: '++',
        prefix: false,
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $ASI],
  });
  
  test('decremental suffix',{
    code: 'a--',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UpdateExpression',
        argument: {type: 'Identifier', name: 'a'},
        operator: '--',
        prefix: false,
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $ASI],
  });
  
  test('boolean invert',{
    code: '!a',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'UnaryExpression',
        operator: '!',
        prefix: true,
        argument: {type: 'Identifier', name: 'a'},
      }},
    ]},
    tokens: [$PUNCTUATOR, $IDENT, $ASI],
  });
});
