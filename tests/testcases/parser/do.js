let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('dowhile statement', _ => {

  test('simple while',{
    code: 'do foo\nwhile (bar);',
    ast: {type: 'Program', body: [
      {type: 'DoWhileStatement', body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, test: {type: 'Identifier', name: 'bar'}},
    ]},
    tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });
  // TODO: error for `do foo while (bar);`
});
