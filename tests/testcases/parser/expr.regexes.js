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

  //describe('tokenizer hints', _ => {
  //
  //  describe('new', _ => {
  //
  //    test('after new sans flag', {
  //      code: 'new /foo/.expando()',
  //      desc: 'like, RegExp.prototype.expando = function(){}; new /foo/expando(); would be valid and work and confuse you to heck'
  //    });
  //
  //    test('after new with flag', {
  //      code: 'new /foo/g.expando()',
  //    });
  //
  //    test('after new spaceless', {
  //      code: 'new/foo/g.expando()',
  //      desc: 'a little artificial',
  //    });
  //  });
  //
  //  // test all operators and keywords in the same way
  //});

  //test('named back reference', {
  //  code: `match(/(?x.).\kx/u)`,
  //  throws: 'xxx',
  //  tokens: [$IDENT, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $ASI],
  //});
});
