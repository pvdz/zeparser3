let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $TICK_HEAD,
  $TICK_TAIL,
  } = require('../../../src/zetokenizer');

module.exports = (describe, test) => describe('delete', _ => {

  test('base case', {
    code: 'delete x.y',
    ast: { type: 'Program',
      body:
        [ { type: 'ExpressionStatement',
          expression:
          { type: 'UnaryExpression',
            operator: 'delete',
            prefix: true,
            argument:
            { type: 'MemberExpression',
              object: { type: 'Identifier', name: 'x' },
              property: { type: 'Identifier', name: 'y' },
              computed: false } } } ] },
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  describe('regex edge case', _ => {

    test('sans flag', {
      code: 'delete a.b\n/foo/',
      throws: 'Expected to parse a value',
      desc: 'note: asi explicitly does not apply when next line starts with forward slash',
      tokens: [],
    });

    test('with flag', {
      code: 'delete a.b\n/foo/g',
      ast: { type: 'Program',
        body:
          [ { type: 'ExpressionStatement',
            expression:
            { type: 'BinaryExpression',
              left:
              { type: 'BinaryExpression',
                left:
                { type: 'UnaryExpression',
                  operator: 'delete',
                  prefix: true,
                  argument:
                  { type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'a' },
                    property: { type: 'Identifier', name: 'b' },
                    computed: false } },
                operator: '/',
                right: { type: 'Identifier', name: 'foo' } },
              operator: '/',
              right: { type: 'Identifier', name: 'g' } } } ] },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });
  });
});
