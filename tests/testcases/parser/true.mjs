import {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} from '../../../src/zetokenizer.mjs';

export default (describe, test) =>
  describe('true keyword', _ => {
    //
    //test('as a statement', {
    //  code: 'true',
    //  ast: {},
    //  tokens: [],
    //});
    //
    //test('as an expression', {
    //  code: 'true',
    //  ast: {},
    //  tokens: [],
    //});

    describe('regex edge cases', _ => {
      test('division', {
        code: 'true\n/foo;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: true, raw: 'true'},
                operator: '/',
                right: {type: 'Identifier', name: 'foo'},
              },
            },
          ],
        },
        desc: 'ASI cannot apply so this must be a division which passes because of the `g` "flag"; this is `(true/foo)/g`',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('regex test bad', {
        code: 'true\n/foo/;',
        throws: 'Expected to parse a value',
        desc: 'ASI cannot apply so this must be a division and it will fail',
        tokens: [],
      });

      test('regex test good', {
        code: 'true\n/foo/g;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Literal', value: true, raw: 'true'},
                  operator: '/',
                  right: {type: 'Identifier', name: 'foo'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        desc: 'ASI cannot apply so this must be a division which passes because of the `g` "flag"; this is `(true/foo)/g`',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });
