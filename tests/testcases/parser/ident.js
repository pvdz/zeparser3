let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('identifiers', _ => {
    describe('statements', _ => {
      test('ident with semi', {
        code: 'foo;',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR],
      });

      test('ident with eof', {
        code: 'foo',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}],
        },
        tokens: [$IDENT, $ASI],
      });

      test('double ident with semi', {
        code: 'foo;bar;',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('double ident with asi', {
        code: 'foo\nbar',
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}],
        },
        tokens: [$IDENT, $ASI, $IDENT, $ASI],
      });
    });
  });
