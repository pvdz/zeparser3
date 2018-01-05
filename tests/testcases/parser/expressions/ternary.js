let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../../src/zetokenizer');


module.exports = (describe, test) => describe('ternary', _ => {

  test('base case',{
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

  test('precedence case', {
    code: 'a === b ? c : d % e;',
    ast: { type: 'Program',
      body:
        [ { type: 'ExpressionStatement',
          expression:
          { type: 'ConditionalExpression',
            test:
            { type: 'BinaryExpression',
              left: { type: 'Identifier', name: 'a' },
              operator: '===',
              right: { type: 'Identifier', name: 'b' } },
            consequent: { type: 'Identifier', name: 'c' },
            alternate:
            { type: 'BinaryExpression',
              left: { type: 'Identifier', name: 'd' },
              operator: '%',
              right: { type: 'Identifier', name: 'e' } } } } ] },
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  });
});
