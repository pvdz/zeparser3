let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('bitwise', _ => {
    test('bin or', {
      code: 'a|b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '|',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin &', {
      code: 'a&b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '&',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin or', {
      code: 'a^b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '^',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('una ~', {
      code: '~a',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '~',
              prefix: true,
              argument: {type: 'Identifier', name: 'a'},
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    });

    test('rel <<', {
      code: 'a<<b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '<<',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('rel >>', {
      code: 'a>>b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '>>',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('rel >>>', {
      code: 'a>>>b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '>>>',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });
