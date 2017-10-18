let {
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('debugger statement', _ => {

  test('debugger with semi',{
    code: 'foo: bar;',
    ast: {type: 'Program', body: [
      {type: 'LabeledStatement', label: {type: 'Identifier', name: 'foo'}, body:
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });

  // TODO: label:functiondecl is explicitly considered a syntax error
  // TODO: labels must be "identifiers", which may not be reserved
});
