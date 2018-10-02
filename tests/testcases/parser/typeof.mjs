import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('typeof', _ => {
    test('base case', {
      code: 'typeof x',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              prefix: true,
              argument: {type: 'Identifier', name: 'x'},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $ASI],
    });

    describe('disambiguation', _ => {
      // TODO: do this for all the unary ops (delete, ++, etc)
      test('disambiguation left', {
        code: 'typeof x + y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '+',
                right: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        desc: 'the unary should only apply to x, not the whole addition: (+ (typeof x) y)',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('disambiguation right', {
        code: 'x + typeof y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'y'},
                },
              },
            },
          ],
        },
        desc: 'the unary should only apply to y, not the whole addition',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });

      test('disambiguation both', {
        code: 'typeof x + typeof y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '+',
                right: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'y'},
                },
              },
            },
          ],
        },
        desc: 'the unary should only apply to one var, not the whole addition',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
      });
    });

    describe('regex edge case', _ => {
      test('division', {
        code: 'typeof a.b\n/foo',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: 'typeof',
                  prefix: true,
                  argument: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        desc: 'note that the typeof only applies to `a.b` not the whole division',
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('sans flag', {
        code: 'typeof  a.b\n/foo/',
        throws: 'Expected to parse a value',
        desc: 'note: asi explicitly does not apply when next line starts with forward slash',
        tokens: [],
      });

      test('with flag', {
        code: 'typeof a.b\n/foo/g',
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
                    operator: 'typeof',
                    prefix: true,
                    argument: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'a'},
                      property: {type: 'Identifier', name: 'b'},
                      computed: false,
                    },
                  },
                  operator: '/',
                  right: {type: 'Identifier', name: 'foo'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });
  });
