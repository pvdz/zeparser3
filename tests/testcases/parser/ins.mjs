import {$ASI, $IDENT} from '../../../src/zetokenizer';

export default (describe, test) =>
  describe('in and instanceof', _ => {
    test('bin in', {
      code: 'a in b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: 'in',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $ASI],
    });

    test('bin instanceof', {
      code: 'a instanceof b',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: 'instanceof',
              right: {type: 'Identifier', name: 'b'},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $ASI],
    });
  });
