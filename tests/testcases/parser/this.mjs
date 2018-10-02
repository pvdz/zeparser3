import {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('this keyword', _ => {
    //
    //test('as a statement', {
    //  code: 'this',
    //  ast: {},
    //  tokens: [],
    //});
    //
    //test('as an expression', {
    //  code: 'this',
    //  ast: {},
    //  tokens: [],
    //});

    describe('regex edge cases', _ => {
      test('regex test good', {
        code: 'this\n/foo;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'ThisExpression'},
                operator: '/',
                right: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        desc: 'ASI cannot apply so this must be a division which passes because of the `g` "flag"; this is `(this/foo)/g`',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('regex test bad', {
        code: 'this\n/foo/;',
        throws: 'Expected to parse a value',
        desc: 'ASI cannot apply so this must be a division and it will fail',
        tokens: [],
      });

      test('regex test good', {
        code: 'this\n/foo/g;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'ThisExpression'},
                  operator: '/',
                  right: {type: 'Identifier', name: 'foo'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        desc: 'ASI cannot apply so this must be a division which passes because of the `g` "flag"; this is `(this/foo)/g`',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });
