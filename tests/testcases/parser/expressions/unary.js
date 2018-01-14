let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../../src/zetokenizer');


module.exports = (describe, test) => describe('unary ops', _ => {

  describe('positive prefix', _ => {

    test('statement',{
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
  });

  describe('negative prefix', _ => {

    test('statement',{
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
  });

  describe('bitwise invert', _ => {

    test('statement',{
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
  });

  describe('incremental prefix', _ => {

    test('statement',{
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
  });

  describe('decremental prefix', _ => {

    test('statement',{
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
  });

  describe('incremental suffix', _ => {

    test('statement',{
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
  });

  describe('decremental suffix', _ => {

    test('statement',{
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
  });

  describe('boolean invert', _ => {

    test('statement',{
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
});

// TODO: disambiguation tests of all the unaries (some have their own test file)
// typeof x++  (the typeof wraps the update)
