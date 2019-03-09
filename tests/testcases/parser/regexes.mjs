import {$ASI, $IDENT, $PUNCTUATOR, $REGEX} from '../../../src/zetokenizer';

// Tests in this file should concern themselves with parser ambiguity, not lexer test cases. Those can
// be found in the lexer tests and regressions that concern one token should be added there (in duplicate).

export default (describe, test) => describe('regexes', _ => {
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

  describe('assertions have no quantifier unless web and sans u', _ => {

    // production of assertions: https://tc39.github.io/ecma262/#prod-Assertion

    describe('without u flag', _ => {

      describe('not quantified (litmus)', _ => {

        test.pass('start of line/input', {
          code: '/^x/',
        });

        test.pass('end of line/input', {
          code: '/x$/',
        });

        test.pass('word break', {
          code: '/a\\bb/',
        });

        test.pass('not word break', {
          code: '/a\\Bb/',
        });

        test.pass('positive lookahead', {
          code: '/a(?=x)b/',
        });
        test.pass('negative lookahead', {
          code: '/a(?!x)b/',
        });

        test.pass('positive lookbehind default', {
          code: '/a(?<=x)b/',
        });

        test.fail('positive lookbehind es8', {
          code: '/a(?<=x)b/',
          desc: 'added in es9 so fails here',
          ES: 8,
        });

        test.pass('positive lookbehind es9', {
          code: '/a(?<=x)b/',
          ES: 9,
        });

        test.pass('positive lookbehind es latest', {
          code: '/a(?<=x)b/',
          ES: Infinity,
        });

        test.pass('negative lookbehind default', {
          code: '/a(?<!x)b/',
        });

        test.fail('negative lookbehind es8', {
          code: '/a(?<!x)b/',
          desc: 'added in es9 so fails here',
          ES: 8,
        });

        test.pass('negative lookbehind es9', {
          code: '/a(?<!x)b/',
          ES: 9,
        });

        test.pass('negative lookbehind es latest', {
          code: '/a(?<!x)b/',
          ES: Infinity,
        });
      });

      describe('not webcompat', _ => {

        test.fail('start of line/input', {
          code: '/^?x/',
        });

        test.fail('end of line/input', {
          code: '/x$?/',
        });

        test.fail('word break', {
          code: '/a\\b?b/',
        });

        test.fail('not word break', {
          code: '/a\\B?b/',
        });

        test.fail('positive lookahead', {
          code: '/a(?=x)?b/',
        });

        test.fail('negative lookahead', {
          code: '/a(?!x)?b/',
        });

        test.fail('positive lookbehind', {
          code: '/a(?<=x)?b/',
        });

        test.fail('negative lookbehind', {
          code: '/a(?<!x)?b/',
        });
      });

      describe('webcompat', _ => {

        test.fail('start of line/input', {
          code: '/^?x/',
          WEB: true,
        });

        test.fail('end of line/input', {
          code: '/x$?/',
          WEB: true,
        });

        test.fail('word break', {
          code: '/a\\b?b/',
          WEB: true,
        });

        test.fail('not word break', {
          code: '/a\\B?b/',
          WEB: true,
        });

        test.pass('positive lookahead', {
          code: '/a(?=x)?b/',
          WEB: true,
        });

        test.pass('negative lookahead', {
          code: '/a(?!x)?b/',
          WEB: true,
        });

        test.fail('positive lookbehind', {
          code: '/a(?<=x)?b/',
          WEB: true,
        });

        test.fail('negative lookbehind', {
          code: '/a(?<!x)?b/',
          WEB: true,
        });
      });
    });

    describe('with u flag', _ => {

      describe('not quantified (litmus)', _ => {

        test.pass('start of line/input', {
          code: '/^x/u',
        });

        test.pass('end of line/input', {
          code: '/x$/u',
        });

        test.pass('word break', {
          code: '/a\\bb/u',
        });

        test.pass('not word break', {
          code: '/a\\Bb/u',
        });

        test.pass('positive lookahead', {
          code: '/a(?=x)b/u',
        });

        test.pass('negative lookahead', {
          code: '/a(?!x)b/u',
        });

        test.pass('positive lookbehind', {
          code: '/a(?<=x)b/u',
        });

        test.pass('negative lookbehind', {
          code: '/a(?<!x)b/u',
        });
      });

      describe('not webcompat', _ => {

        test.fail('start of line/input', {
          code: '/^?x/u',
        });

        test.fail('end of line/input', {
          code: '/x$?/u',
        });

        test.fail('word break', {
          code: '/a\\b?b/u',
        });

        test.fail('not word break', {
          code: '/a\\B?b/u',
        });

        test.fail('positive lookahead', {
          code: '/a(?=x)?b/u',
        });

        test.fail('negative lookahead', {
          code: '/a(?!x)?b/u',
        });

        test.fail('positive lookbehind', {
          code: '/a(?<=x)?b/u',
        });

        test.fail('negative lookbehind', {
          code: '/a(?<!x)?b/u',
        });
      });

      describe('webcompat', _ => {

        test.fail('start of line/input', {
          code: '/^?x/u',
          WEB: true,
        });

        test.fail('end of line/input', {
          code: '/x$?/u',
          WEB: true,
        });

        test.fail('word break', {
          code: '/a\\b?b/u',
          WEB: true,
        });

        test.fail('not word break', {
          code: '/a\\B?b/u',
          WEB: true,
        });

        test.fail('positive lookahead', {
          code: '/a(?=x)?b/u',
          WEB: true,
        });

        test.fail('negative lookahead', {
          code: '/a(?!x)?b/u',
          WEB: true,
        });

        test.fail('positive lookbehind', {
          code: '/a(?<=x)?b/u',
          WEB: true,
        });

        test.fail('negative lookbehind', {
          code: '/a(?<!x)?b/u',
          WEB: true,
        });
      });
    });
  });

  describe('some annexb stuff', _ => {

    describe('octal escape in char class', _ => {

      // https://tc39.github.io/ecma262/#prod-CharacterClass
      // https://tc39.github.io/ecma262/#prod-ClassRanges
      // https://tc39.github.io/ecma262/#prod-NonemptyClassRanges
      // NonemptyClassRanges is extended by annex B:
      //   https://tc39.github.io/ecma262/#sec-patterns-static-semantics-early-errors-annexb
      //   NonemptyClassRangesNoDash :: ClassAtomNoDash - ClassAtom ClassRanges
      // https://tc39.github.io/ecma262/#prod-annexB-ClassAtomNoDash
      // https://tc39.github.io/ecma262/#prod-annexB-ClassEscape
      // https://tc39.github.io/ecma262/#prod-annexB-CharacterEscape
      // https://tc39.github.io/ecma262/#prod-annexB-LegacyOctalEscapeSequence
      // note:
      // https://tc39.github.io/ecma262/#sec-literals-string-literals
      // A conforming implementation, when processing strict mode code, must not extend the syntax of EscapeSequence to include LegacyOctalEscapeSequence as described in B.1.2.

      test.fail('without web compat', {
        code: `/[\\12-\\14]/`,
      });

      test.pass('web compat without u-flag', {
        code: `/[\\12-\\14]/`,
        WEB: true,
      });

      test.fail('web compat with u-flag', {
        code: `/[\\12-\\14]/u`,
        WEB: true,
      });
    });

    describe('8 9 escaped', _ => {

      describe('without web compat', _ => {

        // these fail because the back reference does not have that many groups

        test.fail('escaped 8 single', {
          code: '/7\\8/',
        });

        test.fail('escaped 9 single', {
          code: '/7\\9/',
        });

        test.fail('escaped 8a', {
          code: '/7\\8a/',
        });

        test.fail('escaped 9a', {
          code: '/7\\9a/',
        });

        test.fail('escaped 8 double', {
          code: '/7\\89/',
        });

        test.fail('escaped 9 double', {
          code: '/7\\98/',
        });

        test.fail('escaped 8 too many digits', {
          code: '/\\8912/',
        });

        test.fail('escaped 9 too many digits', {
          code: '/\\986a/',
        });
      });

      describe('with web compat without u-flag', _ => {

        test.pass('escaped 8 single', {
          code: '/7\\8/',
          WEB: true,
        });

        test.pass('escaped 9 single', {
          code: '/7\\9/',
          WEB: true,
        });

        test.pass('escaped 8a', {
          code: '/7\\8a/',
          WEB: true,
        });

        test.pass('escaped 9a', {
          code: '/7\\9a/',
          WEB: true,
        });

        test.pass('escaped 8 double', {
          code: '/7\\89/',
          WEB: true,
        });

        test.pass('escaped 9 double', {
          code: '/7\\98/',
          WEB: true,
        });

        test.pass('escaped 8 too many digits', {
          code: '/\\8912/',
          WEB: true,
        });

        test.pass('escaped 9 too many digits', {
          code: '/\\986a/',
          WEB: true,
        });
      });

      describe('with web compat with u-flag', _ => {

        test.fail('escaped 8 single', {
          code: '/7\\8/u',
          WEB: true,
        });

        test.fail('escaped 9 single', {
          code: '/7\\9/u',
          WEB: true,
        });

        test.fail('escaped 8a', {
          code: '/7\\8a/u',
          WEB: true,
        });

        test.fail('escaped 9a', {
          code: '/7\\9a/u',
          WEB: true,
        });

        test.fail('escaped 8 double', {
          code: '/7\\89/u',
          WEB: true,
        });

        test.fail('escaped 9 double', {
          code: '/7\\98/u',
          WEB: true,
        });

        test.fail('escaped 8 too many digits', {
          code: '/\\8912/u',
          WEB: true,
        });

        test.fail('escaped 9 too many digits', {
          code: '/\\986a/u',
          WEB: true,
        });
      });
    });

    describe('00 escaped', _ => {

      test.fail('without webcompat', {
        code: '/\\00/',
      });

      test.pass('with webcompat without u-flag', {
        code: '/\\00/',
        WEB: true,
      });

      test.fail('with webcompat with u-flag', {
        code: '/\\00/u',
        WEB: true,
      });
    });

    describe('500 escaped', _ => {

      test.fail('without webcompat', {
        code: '/\\500/',
      });

      test.pass('with webcompat without u-flag', {
        code: '/\\500/',
        WEB: true,
      });

      test.fail('with webcompat with u-flag', {
        code: '/\\500/u',
        WEB: true,
      });
    });

    describe('non-existing backreference becomes decimal escape', _ => {

      test.fail('without web compat', {
        code: '/foo \\2 bar/',
      });

      test.pass('with web compat without u-flag', {
        code: '/foo \\2 bar/',
        WEB: true,
      });

      test.fail('with web compat and u-flag', {
        code: '/foo \\2 bar/u',
        WEB: true,
      });

      test.fail('too many digits', {
        code: '/foo \\1234 bar/',
      });
    });

    describe('invalid escape char', _ => {

      test.fail('non-special char escaped without web compat', {
        code: '/\\a/',
      });

      test.pass('non-special char escaped with web compat without u-flag', {
        code: '/\\a/',
        WEB: true,
      });

      test.fail('non-special char escaped with web compat and u-flag', {
        code: '/\\a/u',
        WEB: true,
      });
    });

    describe('incomplete hex escape', _ => {

      test.fail('only x without web compat', {
        code: '/\\x/',
      });

      test.pass('only x with web compat without u-flag', {
        code: '/\\x/',
        WEB: true,
      });

      test.fail('only x with web compat and u-flag', {
        code: '/\\x/u',
        WEB: true,
      });

      test.fail('x and one char without web compat', {
        code: '/\\xa/',
      });

      test.pass('x and one char with web compat without u-flag', {
        code: '/\\xa/',
        WEB: true,
      });

      test.fail('x and one char with web compat and u-flag', {
        code: '/\\xa/u',
        WEB: true,
      });
    });

    describe('incomplete unicode escape', _ => {

      test.fail('only u without web compat', {
        code: '/\\u/',
      });

      test.pass('only u with web compat without u-flag', {
        code: '/\\u/',
        WEB: true,
      });

      test.fail('only u with web compat and u-flag', {
        code: '/\\u/u',
        WEB: true,
      });

      test.fail('u and one char without web compat', {
        code: '/\\ua/',
      });

      test.pass('u and one char with web compat without u-flag', {
        code: '/\\ua/',
        WEB: true,
      });

      test.fail('u and one char with web compat and u-flag', {
        code: '/\\ua/u',
        WEB: true,
      });
    });

    describe('incomplete c escape', _ => {

      test.fail('atom only c without web compat', {
        code: '/\\c/',
      });

      test.pass('atom only c with web compat without u-flag', {
        code: '/\\c/',
        WEB: true,
      });

      test.fail('atom only c with web compat and u-flag', {
        code: '/\\c/u',
        WEB: true,
      });

      test.fail('charclass only c without web compat', {
        code: '/[\\c]/',
      });

      test.pass('charclass only c with web compat without u-flag', {
        code: '/[\\c]/',
        WEB: true,
      });

      test.fail('charclass only c with web compat and u-flag', {
        code: '/[\\c]/u',
        WEB: true,
      });
    });

    describe('syntax chars without context', _ => {

      [']', '{', '}'].forEach(c => {
        describe('char=' + c, _ => {

          test.fail('without web compat', {
            code: '/' + c + '/',
          });

          test.pass('with web compat without u-flag', {
            code: '/' + c + '/',
            WEB: true,
          });

          test.fail('with web compat and u-flag', {
            code: '/' +  c + '/u',
            WEB: true,
          });
        });
      });
    });

    describe('char class in a range', _ => {

      // https://tc39.github.io/ecma262/#sec-runtime-semantics-characterrangeorunion-abstract-operation
      // If A does not contain exactly one character or B does not contain exactly one character, then

      test.fail('left without', {
        code: '/[\\d-a]+/',
      });

      test.pass('left with web without u-flag', {
        code: '/[\\d-a]+/',
        WEB: true,
      });

      test.fail('left with web with u-flag', {
        code: '/[\\d-a]+/u',
        WEB: true,
      });

      test.fail('right without', {
        code: '/[a-\\d]+/',
      });

      test.pass('right with web without u-flag', {
        code: '/[a-\\d]+/',
        WEB: true,
      });

      test.fail('right with web with u-flag', {
        code: '/[a-\\d]+/u',
        WEB: true,
      });

      test.fail('both without web without u-flag', {
        code: '/[\\s-\\d]+/',
      });

      test.fail('both without web with u-flag', {
        code: '/[\\s-\\d]+/u',
      });

      test.pass('both with web without u-flag', {
        code: '/[\\s-\\d]+/',
        WEB: true,
      });

      test.fail('both with web with u-flag', {
        code: '/[\\s-\\d]+/u',
        WEB: true,
      });

      test.pass('unicode bla', {
        code: '/[💩-💫]/u',
      });
    });
  });

  describe('named capturing groups', _ => {

    test.pass('simple group', {
      code: '/foo(?<x>bar)/',
    });

    test.pass('start with dollar', {
      code: '/foo(?<$foo>bar)/',
    });

    test.pass('start with underscore', {
      code: '/foo(?<_foo>bar)/',
    });

    test.pass('contains dollar', {
      code: '/foo(?<brag$foo>bar)/',
    });

    test.pass('contains underscore', {
      code: '/foo(?<brag_foo>bar)/',
    });

    test.pass('double group', {
      code: '/(?<a>a).|(?<x>x)/;',
    });

    test.fail('cannot use a name more than once', {
      code: '/a (?<foo>b) (?<foo>c)/',
    });

    describe('k escape', _ => {

      test.pass('must have group', {
        code: '/(?<x>y)\\k<x>/',
      });

      test.fail('fails without group', {
        code: '/(?<x>y)\\k<z>/',
      });
    });

    describe('bad syntax cases', _ => {

      test.fail('empty name', {
        code: '/(?<>a)/',
      });

      test.fail('missing closing bracket', {
        code: '/(?<aa)/',
      });

      test.fail('starting with num', {
        code: '/(?<42a>a)/',
      });

      test.fail('starting with colon', {
        code: '/(?<:a>a)/',
      });

      test.fail('containing colon', {
        code: '/(?<a:>a)/',
      });

      test.fail('dupe name', {
        code: '/(?<a>a)(?<a>a)/',
      });

      test.fail('dupe and extra name', {
        code: '/(?<a>a)(?<b>b)(?<a>a)/',
      });

      test.fail('k class missing arg', {
        code: '/(?<a>.)\\k/',
      });

      test.fail('k arg not closed', {
        code: '/(?<a>.)\\k<a/',
      });

      test.fail('k arg empty name', {
        code: '/(?<a>.)\\k<>/',
      });

      test.fail('k arg does not exist', {
        code: '/(?<a>.)\\k<b>/',
      });

      test.fail('k arg partial match', {
        code: '/(?<a>a)\\k<ab>/',
      });

      test.fail('k arg also partial match', {
        code: '/(?<ab>a)\\k<a>/',
      });

      test.fail('k before partial match', {
        code: '/\\k<a>(?<ab>a)/',
      });

      test.fail('k arg unclosed group', {
        code: '/\\k<a(?<a>a)/',
      });
    });
  });

  test.pass('hex escaped zero in character class should not be considered an error', {
    // regression: was comparing the decoded escape to absolute error codes
    code: 'x = /[\\x00]/;',
  });
  test.pass('shorter lodash case', {
    code: 'x = /[^\\x00-\\x2f]+/g;',
  });
  test.pass('shorter lodash case', {
    code: 'x = /[^\\x00-\\x2f]+/g;',
  });
  test.pass('lodash case', {
    code: 'x = /[^\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\x7f]+/g;',
  });
});
