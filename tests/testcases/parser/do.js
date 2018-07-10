let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('dowhile statement', _ => {
    test('simple while', {
      code: 'do foo\nwhile (bar);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'foo'},
            },
            test: {type: 'Identifier', name: 'bar'},
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('no asi error', {
      code: 'do foo; while (bar);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'foo'},
            },
            test: {type: 'Identifier', name: 'bar'},
          },
        ],
      },
      desc: 'the problem is that ASI is only applied after newlines or before } or EOF and that this satisfies neither',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('asi error', {
      code: 'do foo while (bar);',
      throws: 'ASI',
      desc: 'the problem is that ASI is only applied after newlines or before } or EOF and that this satisfies neither',
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

// TODO: <es6 there was no asi after do/while. es6+ does apply asi (to confirm that it really was es6...)
