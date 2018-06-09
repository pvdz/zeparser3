let {$ASI, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $STRING_SINGLE} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('math ops', _ => {
    describe('addition +', _ => {
      test('statement', {
        code: 'a+b',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '+',
                right: {type: 'Identifier', name: 'b'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('string + x as expression', {
        code: 'x("" + y)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'x'},
                arguments: [
                  {
                    type: 'BinaryExpression',
                    left: {type: 'Literal', value: '<TODO>', raw: '""'},
                    operator: '+',
                    right: {type: 'Identifier', name: 'y'},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });
    });

    test('bin -', {
      code: 'a-b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '-',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin *', {
      code: 'a*b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '*',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin /', {
      code: 'a/b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '/',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin ** (pow)', {
      code: 'a**b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '**',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('bin or', {
      code: 'a%b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '%',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });
