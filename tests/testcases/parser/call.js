let {$ASI, $IDENT, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('call expression', _ => {
    test('function call, no args', {
      code: 'foo()',
      ast: {
        type: 'Program',
        body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: []}}],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('function call, one arg', {
      code: 'foo(a)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'foo'},
              arguments: [{type: 'Identifier', name: 'a'}],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('function call, three args', {
      code: 'foo(a, b, c)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'foo'},
              arguments: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}, {type: 'Identifier', name: 'c'}],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('function call, one arg, spread', {
      code: 'foo(...a)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'foo'},
              arguments: [{type: 'SpreadElement', argument: {type: 'Identifier', name: 'a'}}],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('function call, three args, spread', {
      code: 'foo(a, b, ...c)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'foo'},
              arguments: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}, {type: 'SpreadElement', argument: {type: 'Identifier', name: 'c'}}],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('chained calls', {
      code: 'foo(a)(b)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [{type: 'Identifier', name: 'a'}],
              },
              arguments: [{type: 'Identifier', name: 'b'}],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('chained calls', {
      code: 'foo(a)(b)(c)(d)(e)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'CallExpression',
                callee: {
                  type: 'CallExpression',
                  callee: {
                    type: 'CallExpression',
                    callee: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'foo'},
                      arguments: [{type: 'Identifier', name: 'a'}],
                    },
                    arguments: [{type: 'Identifier', name: 'b'}],
                  },
                  arguments: [{type: 'Identifier', name: 'c'}],
                },
                arguments: [{type: 'Identifier', name: 'd'}],
              },
              arguments: [{type: 'Identifier', name: 'e'}],
            },
          },
        ],
      },
      tokens: [
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $ASI,
      ],
    });

    describe('trailing comma', _ => {
      describe('enabled', _ => {
        test('not on no args', {
          code: 'foo(,);',
          options: {trailingArgComma: true}, // default
          throws: 'Expected to parse a value',
          tokens: [],
        });

        test('one arg', {
          code: 'foo(x,);',
          options: {trailingArgComma: true}, // default
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'foo'},
                  arguments: [{type: 'Identifier', name: 'x'}],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two args', {
          code: 'foo(x,y,);',
          options: {trailingArgComma: true}, // default
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'foo'},
                  arguments: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('cannot elide', {
          code: 'foo(a,,);',
          options: {trailingArgComma: true}, // default
          throws: 'Expected to parse a value',
          tokens: [],
        });
      });

      describe('disabled', _ => {
        test('not on no args', {
          code: 'foo(,);',
          options: {trailingArgComma: false},
          throws: 'Expected to parse a value',
          tokens: [],
        });

        test('one arg', {
          code: 'foo(x,);',
          options: {trailingArgComma: false},
          throws: 'Option to parse trailing call argument comma',
          tokens: [],
        });

        test('two args', {
          code: 'foo(x,y,);',
          options: {trailingArgComma: false},
          throws: 'Option to parse trailing call argument comma',
          tokens: [],
        });

        test('cannot elide', {
          code: 'foo(a,,);',
          options: {trailingArgComma: false},
          throws: 'Expected to parse a value',
          tokens: [],
        });
      });
    });
  });
