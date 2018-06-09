let {$IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('while statement', _ => {
    test('simple while', {
      code: 'while (foo) bar;',
      ast: {
        type: 'Program',
        body: [{type: 'WhileStatement', test: {type: 'Identifier', name: 'foo'}, body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}}],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });
  });
