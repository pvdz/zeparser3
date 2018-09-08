let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('restricted productions', _ => {
    describe('update expression', _ => {
      test('base case', {
        code: 'a\n++',
        throws: 'Expected to parse a value',
        tokens: [],
      });

      test('comma expression', {
        code: 'a,b\n++c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UpdateExpression',
                operator: '++',
                prefix: true,
                argument: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('after op', {
        code: 'a=b\n++c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '=',
                right: {type: 'Identifier', name: 'b'},
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UpdateExpression',
                operator: '++',
                prefix: true,
                argument: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI],
      });

      test.fail('inside header', {
        code: 'if (b\n++c);',
      });

      test.fail('inside for p1', {
        code: 'for (b\n++c;;);',
      });

      test.fail('inside for p2', {
        code: 'for (;b\n++c;);',
      });

      test.fail('inside for p3', {
        code: 'for (;b\n++c);',
      });

      test.fail('in a group', {
        code: '(b\n++c);',
      });

      test.fail('in an array', {
        code: 'z=[b\n++c];',
      });

      test.fail('in an objlit', {
        code: 'z={x:b\n++c};',
        desc: 'the error is nonsensical but the problem is that asi is needed here and cant be applied',
      });

      test.fail('in a template', {
        code: '`x${b\n++c}y`;',
      });

      test.fail('in a call', {
        code: 'foo(b\n++c);',
      });

      test.fail('in a func arg default', {
        code: 'function f(x=b\n++c){}',
      });

      test('in a block', {
        code: '{b\n++c};',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {type: 'Identifier', name: 'b'},
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    prefix: true,
                    argument: {type: 'Identifier', name: 'c'},
                  },
                },
              ],
            },
            {type: 'EmptyStatement'},
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('in a sub-block', {
        code: 'while (true) {b\n++c};',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'WhileStatement',
              test: {type: 'Literal', value: true, raw: 'true'},
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Identifier', name: 'b'},
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'UpdateExpression',
                      operator: '++',
                      prefix: true,
                      argument: {type: 'Identifier', name: 'c'},
                    },
                  },
                ],
              },
            },
            {type: 'EmptyStatement'},
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('in an arrow', {
        code: '() => b\n++c;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'b'},
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UpdateExpression',
                operator: '++',
                prefix: true,
                argument: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('after an op', {
        code: 'x *\n++y',
        desc: 'this may throw off the restricted production check for ++ since the newline is fine here',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '*',
                right: {
                  type: 'UpdateExpression',
                  operator: '++',
                  prefix: true,
                  argument: {type: 'Identifier', name: 'y'},
                },
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('after await 1', {
        code: 'async function f(){ await\n++c; }',
        desc: 'this may throw off the restricted production check for ++ since the newline is fine here',
        // note: await is not restricted so the newline is fine here. the await arg is mandatory.
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: true,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AwaitExpression',
                      argument: {
                        type: 'UpdateExpression',
                        operator: '++',
                        prefix: true,
                        argument: {type: 'Identifier', name: 'c'},
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('after await 2', {
        code: 'async function f(){ await b\n++c; }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: true,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AwaitExpression',
                      argument: {type: 'Identifier', name: 'b'},
                    },
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'UpdateExpression',
                      operator: '++',
                      prefix: true,
                      argument: {type: 'Identifier', name: 'c'},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('after typeof', {
        code: 'typeof b\n++c;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UnaryExpression',
                operator: 'typeof',
                prefix: true,
                argument: {type: 'Identifier', name: 'b'},
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UpdateExpression',
                operator: '++',
                prefix: true,
                argument: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });

      test('after new', {
        code: 'new b\n++c;',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NewExpression',
                arguments: [],
                callee: {type: 'Identifier', name: 'b'},
              },
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'UpdateExpression',
                operator: '++',
                prefix: true,
                argument: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $ASI, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      });
    });
  });
