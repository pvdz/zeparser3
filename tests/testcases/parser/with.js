let {
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('with statement', _ => {

  test('var, one var, no init, semi',{
    code: 'with (foo) bar;',
    ast: {type: 'Program', body: [
      {type: 'WithStatement', object: { type: 'Identifier', name: 'foo' }, body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });
});
