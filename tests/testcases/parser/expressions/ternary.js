let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('ternary', _ => {

  test('function call, no args',{
    code: 'a?b:c',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'ConditionalExpression',
        test: {type: 'Identifier', name: 'a'},
        consequent: {type: 'Identifier', name: 'b'},
        alternate: {type: 'Identifier', name: 'c'},
      }},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
});
