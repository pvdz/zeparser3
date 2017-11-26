let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  $REGEX,
} = require('../../../src/zetokenizer');


// note: Most regex tests can be found in the tokenizer. Tests in here mainly test the "div or regex" disambiguation.
module.exports = (describe, test) => describe('regular expression disambiguation', _ => {

  test('char class with escaped backslash and trailing dash',{
    code: `middleDashMatch = /[\\-]/.exec`,
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression', left: {type: 'Identifier', name: 'middleDashMatch'},
        operator: '=',
        right: {
          type: 'MemberExpression',
          object: {type: 'Literal', value: '<TODO>', raw: '/[\\-]/'},
          property: {type: 'Identifier', name: 'exec'},
          computed: false
        }
      },
    }]},
    tokens: [$IDENT, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $ASI],
    desc: 'the dash should not be considered a range and the backslash should not change this either way',
  });

  //test('named back reference', {
  //  code: `match(/(?x.).\kx/u)`,
  //  throws: 'xxx',
  //  tokens: [$IDENT, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $ASI],
  //});
});
