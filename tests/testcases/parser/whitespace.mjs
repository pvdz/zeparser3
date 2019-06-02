import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX, $TICK_HEAD, $TICK_PURE, $TICK_TAIL} from '../../../src/zetokenizer.mjs';

export default (describe, test) =>
  describe('whitespace', _ => {
    test('regression; space token not skipped', {
      code: 'x + y',
      ast: true,
      tokens: true,
    });

    test('regression; u0009 token not skipped', {
      code: 'x\u0009+\u0009y',
      ast: true,
      tokens: true,
    });

    test('regression; u000B token not skipped', {
      code: 'x\u000B+\u000By',
      ast: true,
      tokens: true,
    });

    test('regression; u000C token not skipped', {
      code: 'x\u000C+\u000Cy',
      ast: true,
      tokens: true,
    });

    test('regression; u0020 token not skipped', {
      code: 'x\u0020+\u0020y',
      ast: true,
      tokens: true,
    });

    test('regression; u00A0 token not skipped', {
      code: 'x\u00A0+\u00A0y',
      ast: true,
      tokens: true,
    });

    test('regression; u000D token not skipped', {
      code: 'x\u000D+\u000Dy',
      ast: true,
      tokens: true,
    });

    test('regression; u000A token not skipped', {
      code: 'x\u000A+\u000Ay',
      ast: true,
      tokens: true,
    });

    test('regression; u2028 token not skipped', {
      code: 'x\u2028+\u2028y',
      ast: true,
      tokens: true,
    });

    test('regression; u2029 token not skipped', {
      code: 'x\u2029+\u2029y',
      ast: true,
      tokens: true,
    });

    describe('html comments', _ => {
      // https://tc39.github.io/ecma262/#sec-html-like-comments
      // Similar to a MultiLineComment that contains a line terminator code point, a SingleLineHTMLCloseComment
      // is considered to be a LineTerminator for purposes of parsing by the syntactic grammar.
      // note: the SingleLineHTMLCloseComment is not "just" `-->` and so arbitrary occurrences of that token do not
      // yield a pseudo-newline (in particular, I don't think it closes an html open...)

      test('html comment ok except in module goal', {
        code: '<!-- foo -->', // because you can't start an expression with `<`
        MODULE: {throws: true},
        ast: true,
        tokens: true,
      });

      test('html open without close', {
        code: 'call(); <!-- foo',
        MODULE: {throws: true}, // because `;<` is illegal
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('html open without close', {
        code: 'call() <!-- foo',
        MODULE: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'call'},
                    arguments: [],
                  },
                  operator: '<',
                  right: {
                    type: 'UnaryExpression',
                    operator: '!',
                    prefix: true,
                    argument: {
                      type: 'UpdateExpression',
                      operator: '--',
                      prefix: true,
                      argument: {type: 'Identifier', name: 'foo'},
                    },
                  },
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('html open actually has no close', {
        code: 'call(); <!-- foo --> a b c\nf()',
        MODULE: {throws: true}, // but only because you cant decl pre and postfix dec the same var (well and the rest)
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [],
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('html open on its own line', {
        code: 'call()\n<!-- foo\nmore();',
        MODULE: {
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'call'},
                    arguments: [],
                  },
                  operator: '<',
                  right: {
                    type: 'UnaryExpression',
                    operator: '!',
                    prefix: true,
                    argument: {
                      type: 'UpdateExpression',
                      operator: '--',
                      prefix: true,
                      argument: {type: 'Identifier', name: 'foo'},
                    },
                  },
                },
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'more'},
                  arguments: [],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [],
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'more'},
                arguments: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('html close comment can not go after code', {
        code: 'foo() --> foo',
        MODULE: {throws: true}, // because `foo()--` is illegal
        throws: true, // will also parse `foo()--` and fail
      });

      test('same test with newline', {
        code: 'foo()\n--> foo',
        MODULE: {throws: true}, // because `foo()--` is illegal
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test.fail('html close must have newline before it so cannot be at start of program', {
        code: '-->',
      });

      test('html close comment can go on its own line', {
        code: '\n-->',
        MODULE: {throws: true},
        ast: {type: 'Program', body: []},
        tokens: [],
      });

      test('html close comment is considered a newline but everything after is is still a comment', {
        code: '\n-->foo();',
        MODULE: {throws: true},
        ast: {type: 'Program', body: []},
        tokens: [],
      });

      test('html close comment should cause asi', {
        code: 'a\n-->foo bar baz\nb',
        MODULE: {throws: true},
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'a'},
            },
            {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'b'},
            },
          ],
        },
        tokens: [$IDENT, $ASI, $IDENT, $ASI],
      });

      test('html close comment can have multiline comment on a single line before it without needing a newline', {
        code: '/* a b c */ --> foo bar baz',
        MODULE: {throws: true},
        ast: {type: 'Program', body: []},
        tokens: [],
      });

      test('html close comment can have multiple multiline comment on a single line before it', {
        code: '/* a b c */ /* a b c */ /* a b c */ --> foo bar baz',
        MODULE: {throws: true},
        ast: {type: 'Program', body: []},
        tokens: [],
      });

      test('html close comment can have multiline comment on a multiple lines before it', {
        code: '/*\na b c \n*/ --> foo bar baz',
        MODULE: {throws: true},
        ast: {type: 'Program', body: []},
        tokens: [],
      });
    });
  });
