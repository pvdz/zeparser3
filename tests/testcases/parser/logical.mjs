/** @format */
import {$ASI, $IDENT, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';
export default (describe, test) =>
  describe('logical ops', _ => {
    test('logical &&', {
      code: 'a&&b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '&&',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
    test('logical ||', {
      code: 'a||b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a',
              },
              operator: '||',
              right: {
                type: 'Identifier',
                name: 'b',
              },
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });
