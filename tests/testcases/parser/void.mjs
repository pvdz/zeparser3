/** @format */

import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('void', _ => {
    test('base case', {
      code: 'void x',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'void',
              prefix: true,
              argument: {
                type: 'Identifier',
                name: 'x',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $ASI],
    });
    describe('regex edge case', _ => {
      test('sans flag', {
        code: 'void a\n/foo/',
        throws: 'Expected to parse a value',
        desc: 'note: asi explicitly does not apply when next line starts with forward slash',
        tokens: [],
      });
      test('with flag', {
        code: 'void a\n/foo/g',
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
                    type: 'UnaryExpression',
                    operator: 'void',
                    prefix: true,
                    argument: {
                      type: 'Identifier',
                      name: 'a',
                    },
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
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });
  });
