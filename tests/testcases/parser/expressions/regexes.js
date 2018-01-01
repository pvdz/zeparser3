let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
  $REGEX,
} = require('../../../../src/zetokenizer');


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

  test('calling a method as expression statement sans flag', {
    code: '/foo/.bar();',
    ast: { type: 'Program',
      body:
        [ { type: 'ExpressionStatement',
          expression:
          { type: 'CallExpression',
            callee:
            { type: 'MemberExpression',
              object: { type: 'Literal', value: '<TODO>', raw: '/foo/' },
              property: { type: 'Identifier', name: 'bar' },
              computed: false },
            arguments: [] } } ] },
    tokens: [$REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('calling a method as expression statement with flag', {
    code: '/foo/g.bar();',
    ast: { type: 'Program',
      body:
        [ { type: 'ExpressionStatement',
          expression:
          { type: 'CallExpression',
            callee:
            { type: 'MemberExpression',
              object: { type: 'Literal', value: '<TODO>', raw: '/foo/g' },
              property: { type: 'Identifier', name: 'bar' },
              computed: false },
            arguments: [] } } ] },
    tokens: [$REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  //test('decimal escapes (annex B.4.1)', {
  //  code: '/[\\12-\\14]/',
  //  ast: {},
  //  tokens: [$REGEX],
  //});

  // (new) regular expression edge cases. in particular with destructuring patterns and asi
  // `[]\n/x` (division)
  // `[]\n/x/` (Error)
  // `[]\n/x/g` (division)
  // (x)/y
  // (x)=>/y/
  // for (/x/ in y); (Illegal lhs)
  // x => {} / y  (Illegal; {} is a body statement, has no value. no prod parses it)

  // new/x/g
  // new\n/x/g

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
