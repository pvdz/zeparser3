import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR} from '../../../src/zetokenizer.mjs';

export default (describe, test) =>
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

    test('function call, one arg, number lit starting with dot', {
      code: 'foo(.200)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'foo'},
              arguments: [{type: 'Literal', value: '<TODO>', raw: '.200'}],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    describe('trailing comma', _ => {
      describe('enabled', _ => {
        [undefined, 8, 9, Infinity].forEach(ES => {
          test('not on no args', {
            code: 'foo(,);',
            ES,
            throws: 'Expected to parse a value',
          });

          test('not just commas', {
            code: 'foo(,,);',
            ES,
            throws: 'Expected to parse a value',
          });

          test('one arg', {
            code: 'foo(x,);',
            ES,
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
            ES,
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
            ES,
            throws: 'Expected to parse a value',
          });

          test.pass('can after spread', {
            code: 'foo(...a,);',
            ES,
          });
        });
      });

      describe('disabled', _ => {
        [6, 7].forEach(ES => {
          test.fail('not on no args', {
            code: 'foo(,);',
            ES,
          });

          test.fail('not just commas', {
            code: 'foo(,,);',
            ES,
          });

          test.fail('one arg', {
            code: 'foo(x,);',
            ES,
          });

          test.fail('two args', {
            code: 'foo(x,y,);',
            ES,
          });

          test.fail('cannot elide', {
            code: 'foo(a,,);',
            ES,
          });

          test.fail('can after spread', {
            code: 'foo(...a,);',
            ES,
          });
        });
      });
    });

    describe('calling with a pattern, reported in #14', _ => {
      // The object must be a pattern because of the assignment

      describe('with plain func name', _ => {
        test.pass('when the object is an expression', {
          code: 'foo({a})',
        });

        test.fail('when the object must be a pattern (shorthand+assignment)', {
          code: 'foo({a=1})',
        });

        test.fail('patterns AND assignment patterns', {
          code: 'foo({a=1}. {b=2}, {c=3} = {}))',
        });

        test.pass('as an assignment pattern the whole thing is a valid parameter again', {
          code: 'foo({c=3} = {})',
        });
      });

      describe('when the func name is `async`', _ => {
        test.pass('when the object is an expression', {
          code: 'async({a})',
        });

        test.fail('when the object must be a pattern (shorthand+assignment)', {
          code: 'async({a=1})',
        });

        test.fail('patterns AND assignment patterns', {
          code: 'async({a=1}. {b=2}, {c=3} = {}))',
        });

        test.pass('as an assignment pattern the whole thing is a valid parameter again', {
          code: 'async({c=3} = {})',
        });
      });

      describe('when the func name is `yield`', _ => {
        test.fail_strict('when the object is an expression', {
          code: 'yield({a})',
        });

        test.fail('when the object must be a pattern (shorthand+assignment)', {
          code: 'yield({a=1})',
        });

        test.fail('patterns AND assignment patterns', {
          code: 'yield({a=1}. {b=2}, {c=3} = {}))',
        });

        test.fail_strict('as an assignment pattern the whole thing is a valid parameter again', {
          code: 'yield({c=3} = {})',
        });
      });
    });
  });
