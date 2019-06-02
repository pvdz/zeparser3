/** @format */
import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('ternary', _ => {
    test('base case', {
      code: 'a?b:c',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a',
              },
              consequent: {
                type: 'Identifier',
                name: 'b',
              },
              alternate: {
                type: 'Identifier',
                name: 'c',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('precedence case', {
      code: 'a === b ? c : d % e;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a',
                },
                operator: '===',
                right: {
                  type: 'Identifier',
                  name: 'b',
                },
              },
              consequent: {
                type: 'Identifier',
                name: 'c',
              },
              alternate: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'd',
                },
                operator: '%',
                right: {
                  type: 'Identifier',
                  name: 'e',
                },
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
    test('assignment head', {
      code: 'a=b?c:d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '=',
              right: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b',
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c',
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('assignment in middle', {
      code: 'a?b=c:d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a',
              },
              consequent: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b',
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'c',
                },
              },
              alternate: {
                type: 'Identifier',
                name: 'd',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('assignment in tail', {
      code: 'a?b:c=d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a',
              },
              consequent: {
                type: 'Identifier',
                name: 'b',
              },
              alternate: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'c',
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    }); // TODO: await in each part
  });
