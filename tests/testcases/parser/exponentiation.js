let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $STRING_SINGLE} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('exponentiation op', _ => {

    describe('statement', _ => {

      test('base case', {
        code: '2 ** 4',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: '<TODO>', raw: '2'},
                operator: '**',
                right: {type: 'Literal', value: '<TODO>', raw: '4'},
              },
            },
          ],
        },
        tokens: [$NUMBER_DEC, $PUNCTUATOR, $NUMBER_DEC, $ASI],
      });

      test.fail('ES6', {
        code: '2 ** 4',
        ES: 6,
      });

      test.pass('ES7', {
        code: '2 ** 4',
        ES: 7,
      });

      test('tilde is not allowed as lhs', {
        code: '~3 ** 2;',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('typeof  is not allowed as lhs', {
        code: 'typeof 3 ** 2;',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('delete  is not allowed as lhs', {
        code: 'delete 3 ** 2;',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('! is not allowed as lhs', {
        code: '!3 ** 2;',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('new is allowed as lhs, or well, new takes ** as arg but whatever', {
        code: 'new x ** 2;',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Literal', value: '<TODO>', raw: '2'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('new with parens is allowed as lhs', {
        code: 'new x() ** 2;',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Literal', value: '<TODO>', raw: '2'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
      });

      test('negative lhs is not allowed', {
        code: '-x ** 2;',
        desc: 'the prefix minus is just a unary operator and not part of the number token, and not allowed as the lhs to **',
        throws: '**',
      });

      test('+ lhs is not allowed', {
        code: '+x ** 2;',
        desc: 'the prefix minus is just a unary operator and not part of the number token, and not allowed as the lhs to **',
        throws: '**',
      });

      test('true is not assignable but is okay', {
        code: 'true ** a',
        desc: 'assignable is not a proper way to check validity of lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: true, raw: 'true'},
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('++ is unary but is okay', {
        code: '++x ** a',
        desc: 'the ++ is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('-- is unary but is okay', {
        code: '--x ** a',
        desc: 'the -- is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('++ is suffix but is okay', {
        code: 'x++ ** a',
        desc: 'the ++ is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '++',
                  prefix: false,
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('-- is suffix but is okay', {
        code: 'x-- ** a',
        desc: 'the -- is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '--',
                  prefix: false,
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('bad exmaple of nested expression', {
        code: 'a * +a ** a ** 3',
        throws: '**',
      });

      test('good exmaple of nested expression', {
        code: '+a * a ** a ** 3',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
                operator: '*',
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'a'},
                  },
                  operator: '**',
                  right: {type: 'Literal', value: '<TODO>', raw: '3'},
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
      });

      test('yield is fine', {
        code: 'function *f() { yield x ** y }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: true,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      delegate: false,
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'x'},
                        operator: '**',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('await is same as ~', {
        code: 'async function f() { await x ** y }',
        throws: '**',
      });
    });

    describe('expr', _ => {

      test('base case', {
        code: '(2 ** 4)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: '<TODO>', raw: '2'},
                operator: '**',
                right: {type: 'Literal', value: '<TODO>', raw: '4'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $ASI],
      });

      test('tilde is not allowed as lhs', {
        code: '(~3 ** 2)',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('typeof  is not allowed as lhs', {
        code: '(typeof 3 ** 2)',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('delete  is not allowed as lhs', {
        code: '(delete 3 ** 2)',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('! is not allowed as lhs', {
        code: '(!3 ** 2)',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        throws: '**',
      });

      test('new is allowed as lhs, or well, new takes ** as arg but whatever', {
        code: '(new x ** 2)',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Literal', value: '<TODO>', raw: '2'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $ASI],
      });

      test('new with parens is allowed as lhs', {
        code: '(new x() ** 2)',
        desc: 'the lhs of `**` must be an assignment or exponentiation operator... there is no goal that allows this unary expression',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'NewExpression',
                  arguments: [],
                  callee: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Literal', value: '<TODO>', raw: '2'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $ASI],
      });

      test('negative lhs is not allowed', {
        code: '(-x ** 2)',
        desc: 'the prefix minus is just a unary operator and not part of the number token, and not allowed as the lhs to **',
        throws: '**',
      });

      test('+ lhs is not allowed', {
        code: '(+x ** 2)',
        desc: 'the prefix minus is just a unary operator and not part of the number token, and not allowed as the lhs to **',
        throws: '**',
      });

      test('true is not assignable but is okay', {
        code: '(true ** a)',
        desc: 'assignable is not a proper way to check validity of lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Literal', value: true, raw: 'true'},
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('++ is unary but is okay', {
        code: '(++x ** a)',
        desc: 'the ++ is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('-- is unary but is okay', {
        code: '(--x ** a)',
        desc: 'the -- is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  operator: '--',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'x'},
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('++ is postfix but is okay', {
        code: '(x++ ** a)',
        desc: 'the ++ is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '++',
                  prefix: false,
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('-- is postfix but is okay', {
        code: '(x-- ** a)',
        desc: 'the -- is a unary operator so that is not a valid way to confirm lhs',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UpdateExpression',
                  argument: {type: 'Identifier', name: 'x'},
                  operator: '--',
                  prefix: false,
                },
                operator: '**',
                right: {type: 'Identifier', name: 'a'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('bad exmaple of nested expression', {
        code: '(a * +a ** a ** 3)',
        throws: '**',
      });

      test('good exmaple of nested expression', {
        code: '(+a * a ** a ** 3)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'UnaryExpression',
                  operator: '+',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'a'},
                },
                operator: '*',
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '**',
                    right: {type: 'Identifier', name: 'a'},
                  },
                  operator: '**',
                  right: {type: 'Literal', value: '<TODO>', raw: '3'},
                },
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $ASI],
      });

      test('yield is fine', {
        code: 'function *f() { (yield x ** y) }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: true,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'YieldExpression',
                      delegate: false,
                      argument: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'x'},
                        operator: '**',
                        right: {type: 'Identifier', name: 'y'},
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI, $PUNCTUATOR],
      });

      test('await has higher precendence so is okay', {
        code: '(async function f() { (await x ** y) }',
        throws: '**',
      });
    });
  });

