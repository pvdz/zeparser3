/** @format */
import {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('null keyword', _ => {
    test('as a statement', {
      code: 'null',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: null,
              raw: 'null',
            },
          },
        ],
      },
      tokens: [$IDENT, $ASI],
    });
    test('as an expression', {
      code: '+null',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '+',
              prefix: true,
              argument: {
                type: 'Literal',
                value: null,
                raw: 'null',
              },
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    });
    describe('regex edge cases', _ => {
      test('division', {
        code: 'null\n/foo;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: null,
                  raw: 'null',
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            },
          ],
        },
        desc: 'ASI cannot apply so this must be a division and it will fail',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
      test('regex test bad', {
        code: 'null\n/foo/;',
        throws: 'Expected to parse a value',
        desc: 'ASI cannot apply so this must be a division and it will fail',
        tokens: [],
      });
      test('regex test good', {
        code: 'null\n/foo/g;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Literal',
                    value: null,
                    raw: 'null',
                  },
                  operator: '/',
                  right: {
                    type: 'Identifier',
                    name: 'foo',
                  },
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  name: 'g',
                },
              },
            },
          ],
        },
        desc: 'ASI cannot apply so this must be a division which passes because of the `g` "flag"; this is `(null/foo)/g`',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });
