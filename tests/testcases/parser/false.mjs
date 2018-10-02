import {$ASI, $IDENT, $PUNCTUATOR, $TICK_BODY, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('false keyword', _ => {
    //
    //test('as a statement', {
    //  code: 'false',
    //  ast: {},
    //  tokens: [],
    //});
    //
    //test('as an expression', {
    //  code: 'false',
    //  ast: {},
    //  tokens: [],
    //});

    test('regex test bad', {
      code: 'false\n/foo/;',
      throws: 'Expected to parse a value',
      desc: 'ASI cannot apply so this must be a division and it will fail',
      tokens: [],
    });

    test('regex test good', {
      code: 'false\n/foo/g;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: false, raw: 'false'},
                operator: '/',
                right: {type: 'Identifier', name: 'foo'},
              },
              operator: '/',
              right: {type: 'Identifier', name: 'g'},
            },
          },
        ],
      },
      desc: 'ASI cannot apply so this must be a division which passes because of the `g` "flag"; this is `(false/foo)/g`',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
  });
