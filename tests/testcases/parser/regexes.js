let {$ASI, $IDENT, $PUNCTUATOR, $REGEX} = require('../../../src/zetokenizer');

// Tests in this file should concern themselves with parser ambiguity, not lexer test cases. Those can
// be found in the lexer tests and regressions that concern one token should be added there (in duplicate).

module.exports = (describe, test) => describe('regexes', _ => {
  describe('regular expression disambiguation', _ => {
    describe('method call on regex literal', _ => {
      test('sans flag', {
        code: '/foo/.bar();',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {type: 'Literal', value: '<TODO>', raw: '/foo/'},
                  property: {type: 'Identifier', name: 'bar'},
                  computed: false,
                },
                arguments: [],
              },
            },
          ],
        },
        tokens: [$REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('with flag', {
        code: '/foo/g.bar();',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {type: 'Literal', value: '<TODO>', raw: '/foo/g'},
                  property: {type: 'Identifier', name: 'bar'},
                  computed: false,
                },
                arguments: [],
              },
            },
          ],
        },
        tokens: [$REGEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    describe('AST test after non-special identifier', _ => {
      test('division', {
        code: 'foo\n/bar',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'foo'},
                operator: '/',
                right: {type: 'Identifier', name: 'bar'},
              },
            },
          ],
        },
        desc: 'ASI explicitly does not apply if the next line starts with a forward slash so this is a division',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('sans flag', {
        code: 'foo\n/bar/',
        throws: 'Expected to parse a value',
        desc: 'ASI explicitly does not apply if the next line starts with a forward slash so this is a division and it is missing the last value',
        tokens: [],
      });

      test('with flag', {
        code: 'foo\n/bar/g',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'foo'},
                  operator: '/',
                  right: {type: 'Identifier', name: 'bar'},
                },
                operator: '/',
                right: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
        desc: 'ASI explicitly does not apply if the next line starts with a forward slash so this is a division',
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });
    });

    // TODO: add this to lexer tests
    //test('char class with escaped backslash and trailing dash',{
    //  code: `middleDashMatch = /[\\-]/.exec`,
    //  ast: {type: 'Program', body: [{
    //    type: 'ExpressionStatement', expression: {
    //      type: 'AssignmentExpression',
    //      left: {type: 'Identifier', name: 'middleDashMatch'},
    //      operator: '=',
    //      right: {
    //        type: 'MemberExpression',
    //        object: {type: 'Literal', value: '<TODO>', raw: '/[\\-]/'},
    //        property: {type: 'Identifier', name: 'exec'},
    //        computed: false
    //      }
    //    },
    //  }]},
    //  tokens: [$IDENT, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $ASI],
    //  desc: 'the dash should not be considered a range and the backslash should not change this either way',
    //});

    // TODO: add to lexer tests
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

  test('weird escape in char class is okay without u flag', {
    code: '/[\\ ]/',
    ast: {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {type: 'Literal', value: '<TODO>', raw: '/[\\ ]/'},
        },
      ],
    },
    tokens: [$REGEX, $ASI],
  });

  test.fail('weird escape in char class is bad with u flag', {
    code: '/[\\ ]/u',
  });

  test.pass('character class escape without arg', {
    code: '/[\\d]/',
  });

  describe('property escapes', _ => {

    describe('not web compat', _ => {

      describe('es8 / es2017', _ => {

        // illegal before es9 unless web

        test.fail('property escapes are invalid without u flag', {
          code: '/a\\p{x}b/',
          ES: 8,
        });

        test.fail('property escapes are valid with u flag', {
          code: '/a\\p{x}b/u',
          ES: 8,
        });

        test.fail('class property escapes are illegal without u flag', {
          code: '/[a\\p{x}b]/',
          desc: 'illegal escape char sans flag',
          ES: 8,
        });

        test.fail('class property escapes are valid with u flag', {
          code: '/[a\\p{x}b]/u',
          ES: 8,
        });

        test.fail('double property escapes sans u flag', {
          code: '/\\p{Hex}\\P{Hex}/',
          ES: 8,
        });

        test.fail('double class property escapes sans u flag', {
          code: '/[\\p{Hex}\\P{Hex}]/',
          ES: 8,
        });

        test.fail('double property escapes with u flag', {
          code: '/\\p{Hex}\\P{Hex}/u',
          ES: 8,
        });

        test.fail('double class property escapes with u flag', {
          code: '/[\\p{Hex}\\P{Hex}]/u',
          ES: 8,
        });
      });

      describe('es9 / es latest / default', _ => {

        [undefined, 9, Infinity].forEach(ES => {

          test.fail('property escapes are invalid without u flag', {
            code: '/a\\p{x}b/',
            ES,
          });

          test.pass('property escapes are valid with u flag', {
            code: '/a\\p{x}b/u',
            ES,
          });

          test.fail('class property escapes are illegal without u flag', {
            code: '/[a\\p{x}b]/',
            desc: 'illegal escape char sans flag',
            ES,
          });

          test.pass('class property escapes are valid with u flag', {
            code: '/[a\\p{x}b]/u',
            ES,
          });

          test.fail('double property escapes sans u flag', {
            code: '/\\p{Hex}\\P{Hex}/',
            ES,
          });

          test.fail('double class property escapes sans u flag', {
            code: '/[\\p{Hex}\\P{Hex}]/',
            ES,
          });

          test.pass('double property escapes with u flag', {
            code: '/\\p{Hex}\\P{Hex}/u',
            ES,
          });

          test.pass('double class property escapes with u flag', {
            code: '/[\\p{Hex}\\P{Hex}]/u',
            ES,
          });
        });
      });
    });

    describe('web compat', _ => {

      describe('es8 / es2017', _ => {

        // before es9 only legal in web compat mode and without u flag

        test.pass('property escapes are invalid without u flag', {
          code: '/a\\p{x}b/',
          ES: 8,
          WEB: true,
        });

        test.fail('property escapes are valid with u flag', {
          code: '/a\\p{x}b/u',
          ES: 8,
          WEB: true,
        });

        test.pass('class property escapes are illegal without u flag', {
          code: '/[a\\p{x}b]/',
          desc: 'illegal escape char sans flag',
          ES: 8,
          WEB: true,
        });

        test.fail('class property escapes are valid with u flag', {
          code: '/[a\\p{x}b]/u',
          ES: 8,
          WEB: true,
        });

        test.pass('double property escapes sans u flag', {
          code: '/\\p{Hex}\\P{Hex}/',
          ES: 8,
          WEB: true,
        });

        test.pass('double class property escapes sans u flag', {
          code: '/[\\p{Hex}\\P{Hex}]/',
          ES: 8,
          WEB: true,
        });

        test.fail('double property escapes with u flag', {
          code: '/\\p{Hex}\\P{Hex}/u',
          ES: 8,
          WEB: true,
        });

        test.fail('double class property escapes with u flag', {
          code: '/[\\p{Hex}\\P{Hex}]/u',
          ES: 8,
          WEB: true,
        });
      });

      describe('es9 / es latest / default', _ => {

        [undefined, 9, Infinity].forEach(ES => {

          test.pass('property escapes are invalid without u flag', {
            code: '/a\\p{x}b/',
            ES,
            WEB: true,
          });

          test.pass('property escapes are valid with u flag', {
            code: '/a\\p{x}b/u',
            ES,
          });

          test.pass('class property escapes are illegal without u flag', {
            code: '/[a\\p{x}b]/',
            desc: 'illegal escape char sans flag',
            ES,
            WEB: true,
          });

          test.pass('class property escapes are valid with u flag', {
            code: '/[a\\p{x}b]/u',
            ES,
            WEB: true,
          });

          test.pass('double property escapes sans u flag', {
            code: '/\\p{Hex}\\P{Hex}/',
            ES,
            WEB: true,
          });

          test.pass('double class property escapes sans u flag', {
            code: '/[\\p{Hex}\\P{Hex}]/',
            ES,
            WEB: true,
          });

          test.pass('double property escapes with u flag', {
            code: '/\\p{Hex}\\P{Hex}/u',
            ES,
            WEB: true,
          });

          test.pass('double class property escapes with u flag', {
            code: '/[\\p{Hex}\\P{Hex}]/u',
            ES,
            WEB: true,
          });

          test.pass('edge case', {
            code: '/[\\d]/',
            ES,
            WEB: true,
          });
        });
      });
    });
  });
});
