let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $REGEX} = require('../../../src/zetokenizer');

// TODO: replace the startInStrictMode stuff with sloppy mode results instead
module.exports = (describe, test) =>
  describe('functions', _ => {
    // arrow specific tests go into expressions/arrow
    // expression specific tests go into expressions/function

    describe('declaration', _ => {
      test('empty function decl', {
        code: 'function f(){}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      // TODO: test this under an es5 flag. for es6+ this is legal (again)
      // describe('illegal statements in strict mode', _ => {
      //   test('inside while', {
      //     code: `while (false) function g() {}`,
      //     throws: 'Function statement',
      //     SLOPPY_SCRIPT: {
      //       ast: {
      //         type: 'Program',
      //         body: [
      //           {
      //             type: 'WhileStatement',
      //             test: {type: 'Literal', value: false, raw: 'false'},
      //             body: {
      //               type: 'FunctionDeclaration',
      //               generator: false,
      //               async: false,
      //               expression: false,
      //               id: {type: 'Identifier', name: 'g'},
      //               params: [],
      //               body: {type: 'BlockStatement', body: []},
      //             },
      //           },
      //         ],
      //       },
      //     },
      //     tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      //   });
      //
      //   test('inside if', {
      //     code: `if (false) function g() {}`,
      //     startInStrictMode: true,
      //     throws: 'Function statement',
      //     tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      //   });
      //
      //   test('inside else', {
      //     code: `if (false) foo; else function g() {}`,
      //     startInStrictMode: true,
      //     throws: 'Function statement',
      //     tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      //   });
      //
      //   test('inside for', {
      //     code: `for (a in b) function g() {}`,
      //     startInStrictMode: true,
      //     throws: 'Function statement',
      //     tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      //   });
      //
      //   test('inside do', {
      //     code: `do function g() {} while (false)`,
      //     startInStrictMode: true,
      //     throws: 'Function statement',
      //     tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      //   });
      //
      //   test('inside label', {
      //     code: `foo: function g() {}`,
      //     startInStrictMode: true,
      //     throws: 'Function statement',
      //     tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      //   });
      //
      //   test('deep nested', {
      //     code: `if (x) if (x) if (x) if (x) if (x) if (x) function g() {}`,
      //     startInStrictMode: true,
      //     throws: 'Function statement',
      //     tokens: [
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //       $ASI,
      //     ],
      //   });
      //
      //   test('inside block', {
      //     code: `{ function g() {} }`,
      //     startInStrictMode: true,
      //     ast: {
      //       type: 'Program',
      //       body: [
      //         {
      //           type: 'BlockStatement',
      //           body: [
      //             {
      //               type: 'FunctionDeclaration',
      //               generator: false,
      //               async: false,
      //               expression: false,
      //               id: {type: 'Identifier', name: 'g'},
      //               params: [],
      //               body: {
      //                 type: 'BlockStatement',
      //                 body: [],
      //               },
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     tokens: [$PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      //   });
      //
      //   test('inside nested block', {
      //     code: `{{{ function g() {} }}}`,
      //     startInStrictMode: true,
      //     ast: {
      //       type: 'Program',
      //       body: [
      //         {
      //           type: 'BlockStatement',
      //           body: [
      //             {
      //               type: 'BlockStatement',
      //               body: [
      //                 {
      //                   type: 'BlockStatement',
      //                   body: [
      //                     {
      //                       type: 'FunctionDeclaration',
      //                       generator: false,
      //                       async: false,
      //                       expression: false,
      //                       id: {type: 'Identifier', name: 'g'},
      //                       params: [],
      //                       body: {
      //                         type: 'BlockStatement',
      //                         body: [],
      //                       },
      //                     },
      //                   ],
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      //     desc: 'make sure lexerflags get reset on block boundary',
      //   });
      //
      //   test('preceded by other statement in a block', {
      //     code: `
      //     {
      //       if (x) y;
      //       function g() {}
      //     }
      //   `,
      //     startInStrictMode: true,
      //     ast: {
      //       type: 'Program',
      //       body: [
      //         {
      //           type: 'BlockStatement',
      //           body: [
      //             {
      //               type: 'IfStatement',
      //               test: {type: 'Identifier', name: 'x'},
      //               consequent: {
      //                 type: 'ExpressionStatement',
      //                 expression: {type: 'Identifier', name: 'y'},
      //               },
      //               alternate: null,
      //             },
      //             {
      //               type: 'FunctionDeclaration',
      //               generator: false,
      //               async: false,
      //               expression: false,
      //               id: {type: 'Identifier', name: 'g'},
      //               params: [],
      //               body: {type: 'BlockStatement', body: []},
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      //     desc: 'slightly redundant but lexerflags should not flow over from previous statement',
      //   });
      //
      //   test('nested inside block', {
      //     code: `if (x) { function g() {} }`,
      //     startInStrictMode: true,
      //     ast: {
      //       type: 'Program',
      //       body: [
      //         {
      //           type: 'IfStatement',
      //           test: {type: 'Identifier', name: 'x'},
      //           consequent: {
      //             type: 'BlockStatement',
      //             body: [
      //               {
      //                 type: 'FunctionDeclaration',
      //                 generator: false,
      //                 async: false,
      //                 expression: false,
      //                 id: {type: 'Identifier', name: 'g'},
      //                 params: [],
      //                 body: {type: 'BlockStatement', body: []},
      //               },
      //             ],
      //           },
      //           alternate: null,
      //         },
      //       ],
      //     },
      //     tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      //     desc: 'block should reset lexerflags',
      //   });
      //
      //   test('preceded by other statement in a nested block', {
      //     code: `
      //     if (z) {
      //       if (x) y;
      //       function g() {}
      //     }
      //   `,
      //     startInStrictMode: true,
      //     ast: {
      //       type: 'Program',
      //       body: [
      //         {
      //           type: 'IfStatement',
      //           test: {type: 'Identifier', name: 'z'},
      //           consequent: {
      //             type: 'BlockStatement',
      //             body: [
      //               {
      //                 type: 'IfStatement',
      //                 test: {type: 'Identifier', name: 'x'},
      //                 consequent: {
      //                   type: 'ExpressionStatement',
      //                   expression: {type: 'Identifier', name: 'y'},
      //                 },
      //                 alternate: null,
      //               },
      //               {
      //                 type: 'FunctionDeclaration',
      //                 generator: false,
      //                 async: false,
      //                 expression: false,
      //                 id: {type: 'Identifier', name: 'g'},
      //                 params: [],
      //                 body: {type: 'BlockStatement', body: []},
      //               },
      //             ],
      //           },
      //           alternate: null,
      //         },
      //       ],
      //     },
      //     tokens: [
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $IDENT,
      //       $IDENT,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //       $PUNCTUATOR,
      //     ],
      //     desc: 'make sure lexerflags get reset on block boundary',
      //   });
      // });
    });

    describe('expression', _ => {
      // note: this file is about function _expressions_. Don't put generic function stuff here.

      test('simpelest anonymous function expression', {
        code: 'foo(function(){})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [
                  {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: true,
                    id: null,
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('simpelest named function expression', {
        code: 'foo(function f(){})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [
                  {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: true,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('simpelest anonymous generator expression', {
        code: 'foo(function*(){})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [{type: 'FunctionExpression', generator: true, async: false, expression: true, id: null, params: [], body: {type: 'BlockStatement', body: []}}],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('simpelest named generator expression', {
        code: 'foo(function* f(){})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [
                  {
                    type: 'FunctionExpression',
                    generator: true,
                    async: false,
                    expression: true,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('simpelest anonymous async function expression', {
        code: 'foo(async function(){})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [{
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: true,
                  id: null,
                  params: [],
                  body: {type: 'BlockStatement', body: []}
                }],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('simpelest async named function expression', {
        code: 'foo(async function f(){})',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [
                  {
                    type: 'FunctionExpression',
                    generator: false,
                    async: true,
                    expression: true,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      describe('rest', _ => {
        test('support only rest arg', {
          code: 'function f(...rest){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [
                  {
                    type: 'RestElement',
                    argument: {type: 'Identifier', name: 'rest'},
                  },
                ],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('support rest arg with other args', {
          code: 'function f(a, b, ...rest){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [
                  {type: 'Identifier', name: 'a'},
                  {type: 'Identifier', name: 'b'},
                  {
                    type: 'RestElement',
                    argument: {type: 'Identifier', name: 'rest'},
                  },
                ],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('rest must be last', {
          code: 'function f(...rest, b){}',
          throws: 'rest',
        });

        test('rest cannot be middle', {
          code: 'function f(a, ...rest, b){}',
          throws: 'rest',
        });

        test('rest has no assignment expression', {
          code: 'function f(...rest = x){}',
          throws: 'rest',
        });

        test('rest cannot be addition', {
          code: 'function f(...rest + x){}',
          throws: 'not destructible',
        });

        test('rest cannot be a property', {
          code: 'function f(...rest.foo){}',
          throws: 'not destructible',
        });

        test('rest cannot be a group', {
          code: 'function f(...(x)){}',
          throws: 'rest arg',
        });
      });

      describe('regex edge case', _ => {
        describe('sans async', _ => {
          describe('declaration', _ => {
            test('sans flag', {
              code: 'function f(){}\n/foo/',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '/foo/'},
                  },
                ],
              },
              desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
            });

            test('with flag', {
              code: 'function f(){}\n/foo/g',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '/foo/g'},
                  },
                ],
              },
              desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
            });
          });

          describe('expression', _ => {
            test('sans flag', {
              code: 'typeof function f(){}\n/foo/',
              throws: 'Expected to parse a value',
              desc:
                'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
              tokens: [],
            });

            test('with flag', {
              code: 'typeof function f(){}\n/foo/g',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'UnaryExpression',
                          operator: 'typeof',
                          prefix: true,
                          argument: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: false,
                            expression: true,
                            id: {type: 'Identifier', name: 'f'},
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                        },
                        operator: '/',
                        right: {type: 'Identifier', name: 'foo'},
                      },
                      operator: '/',
                      right: {type: 'Identifier', name: 'g'},
                    },
                  },
                ],
              },
              desc:
                'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
              tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
            });
          });
        });

        describe('with async', _ => {
          describe('declaration', _ => {
            test('sans flag', {
              code: 'async function f(){}\n/foo/',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: true,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '/foo/'},
                  },
                ],
              },
              desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
              tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
            });

            test('with flag', {
              code: 'async function f(){}\n/foo/g',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: true,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {type: 'Literal', value: '<TODO>', raw: '/foo/g'},
                  },
                ],
              },
              desc: 'note: not a division because func decl requires no semi so there is no need to ASI',
              tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI],
            });
          });

          describe('expression', _ => {
            test('sans flag', {
              code: 'typeof async function f(){}\n/foo/',
              throws: 'Expected to parse a value',
              desc:
                'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
              tokens: [],
            });

            test('with flag', {
              code: 'typeof async function f(){}\n/foo/g',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'UnaryExpression',
                          operator: 'typeof',
                          prefix: true,
                          argument: {
                            type: 'FunctionExpression',
                            generator: false,
                            async: true,
                            expression: true,
                            id: {type: 'Identifier', name: 'f'},
                            params: [],
                            body: {type: 'BlockStatement', body: []},
                          },
                        },
                        operator: '/',
                        right: {type: 'Identifier', name: 'foo'},
                      },
                      operator: '/',
                      right: {type: 'Identifier', name: 'g'},
                    },
                  },
                ],
              },
              desc:
                'note: an expression statement requires a semi so ASI is attempted and will fail because it will not apply when the next line starts with a forward slash so it is a division',
              tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
            });
          });
        });
      });
      // error for generator AND async
    });

    describe('function args', _ => {

      describe('classic vars', _ => {
        test('one arg', {
          code: 'function f(a){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'a'}],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('two args', {
          code: 'function f(a,b){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('trailing comma', _ => {

        describe('enabled', _ => {

          [undefined, 8, 9, Infinity].forEach(ES => {
            test.fail('must have args to trail', {
              code: 'function f(,){}',
              ES,
            });

            test.fail('just commas is error', {
              code: 'function f(,,){}',
              ES,
            });

            test('one arg', {
              code: 'function f(a,){}',
              ES,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [{type: 'Identifier', name: 'a'}],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('two args', {
              code: 'function f(a,b,){}',
              ES,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test.fail('cannot elide', {
              code: 'function f(a,,){}',
              ES,
            });

            test('after default', {
              code: 'function f(a = b,){}',
              ES,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {type: 'Identifier', name: 'a'},
                        right: {type: 'Identifier', name: 'b'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test.fail('not allowed after rest', {
              code: 'function f(...a,){}',
              ES,
            });

            test('after array destruct', {
              code: 'function f([x],){}',
              ES,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'x'}],
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('after object destruct', {
              code: 'function f({a},){}',
              ES,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {type: 'Identifier', name: 'a'},
                            kind: 'init',
                            method: false,
                            computed: false,
                            value: {type: 'Identifier', name: 'a'},
                            shorthand: true,
                          },
                        ],
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test.fail('rest cant even have an default', {
              code: 'function f(...a = x,){}',
              ES,
            });

            test('after array destruct with default', {
              code: 'function f([x] = y,){}',
              ES,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'x'}],
                        },
                        right: {type: 'Identifier', name: 'y'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('after object destruct with default', {
              code: 'function f({a} = b,){}',
              ES,
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'a'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'a'},
                              shorthand: true,
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'b'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });
          });
        });

        describe('disabled', _ => {

          [6, 7].forEach(ES => {
            test.fail('must have args to trail', {
              code: 'function f(,){}',
              ES,
            });

            test.fail('just commas is error', {
              code: 'function f(,,){}',
              ES,
            });

            test.fail('one arg', {
              code: 'function f(a,){}',
              ES,
            });

            test.fail('two args', {
              code: 'function f(a,b,){}',
              ES,
            });

            test.fail('cannot elide', {
              code: 'function f(a,,){}',
              ES,
            });

            test.fail('after default', {
              code: 'function f(a = b,){}',
              ES,
            });

            test.fail('not allowed after rest', {
              code: 'function f(...a,){}',
              ES,
            });

            test.fail('after array destruct', {
              code: 'function f([x],){}',
              ES,
            });

            test.fail('after object destruct', {
              code: 'function f({a},){}',
              ES,
            });

            test.fail('rest cant even have an default', {
              code: 'function f(...a = x,){}',
              ES,
            });

            test.fail('after array destruct with default', {
              code: 'function f([x] = y,){}',
              ES,
            });

            test.fail('after object destruct with default', {
              code: 'function f({a} = b,){}',
              ES,
            });
          });
        });
      });

      describe('defaults', _ => {
        test('simple arg default', {
          code: 'function f(a=b){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {type: 'Identifier', name: 'a'},
                    right: {type: 'Identifier', name: 'b'},
                  },
                ],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('arg default that is also an assignment', {
          code: 'function f(a=b=c){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                expression: false,
                id: {type: 'Identifier', name: 'f'},
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {type: 'Identifier', name: 'a'},
                    right: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'b'},
                      operator: '=',
                      right: {type: 'Identifier', name: 'c'},
                    },
                  },
                ],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('destructuring', _ => {
        // these cases should mirror conceptual tests from let.js where they make sense here

        // for destructuring, these are the array pattern tests to check for all places where we'd want to check it:
        // note: the "init" is optional in this context since the arg is the init. I think the assignment is a default.
        // function f([]){}
        // function f([] = x){}
        // function f([,]){}
        // function f([,] = x){}
        // function f([,,]){}
        // function f([,,] = x){}
        // function f([foo]){}
        // function f([foo] = x){}
        // function f([foo,]){}
        // function f([foo,] = x){}
        // function f([foo,,]){}
        // function f([foo,,] = x){}
        // function f([,foo]){}
        // function f([,foo] = x){}
        // function f([,,foo]){}
        // function f([,,foo] = x){}
        // function f([foo,bar]){}
        // function f([foo,bar] = x){}
        // function f([foo,,bar]){}
        // function f([foo,,bar] = x){}
        // function f([foo], [foo]){}
        // function f([foo] = x, [foo] = y){}
        // function f([foo], b){}
        // function f([foo] = x, b){}
        // function f([foo], b = y){}
        // function f([foo] = x, b = y){}
        // function f(x, [foo]){}
        // function f(x, [foo] = y){}
        // function f(x = y, [foo] = z){}
        // function f(x = y, [foo]){}
        // function f([foo=a]){}
        // function f([foo=a] = c){}
        // function f([foo=a,bar]){}
        // function f([foo=a,bar] = x){}
        // function f([foo,bar=b]){}
        // function f([foo,bar=b] = x){}
        // function f([foo=a,bar=b]){}
        // function f([foo=a,bar=b] = x){}
        // function f([...bar] = obj){}
        // function f([foo, ...bar] = obj){}
        // function f([...foo, bar] = obj){}   // error
        // function f([...foo,] = obj){}       // ok!
        // function f([...foo,,] = obj){}      // error
        // function f([...[a, b]] = obj){}
        // function f([...[a, b],] = obj){}    // ok!
        // function f([...[a, b],,] = obj){}   // error
        // function f([x, ...[a, b]] = obj){}
        // function f([...bar = foo] = obj){}  // error (TODO: except in funcs, arrows, and maybe `for`?)
        // function f([... ...foo] = obj){}    // error
        // function f([...] = obj){}           // error
        // function f([...,] = obj){}          // error
        // function f([.x] = obj){}            // error
        // function f([..x] = obj){}           // error

        // and these are the object versions:
        // function f({} = x){}
        // function f({,} = x){}             // error
        // function f({,,} = x){}            // error
        // function f({foo} = x){}
        // function f({foo,} = x){}          // ok
        // function f({foo,,} = x){}         // error
        // function f({,foo} = x){}          // error
        // function f({,,foo} = x){}         // error
        // function f({foo,bar} = x){}
        // function f({foo,,bar} = x){}      // error
        // function f({foo} = x, {foo} = y){}
        // function f({foo} = x, b){}
        // function f({foo} = x, b = y){}
        // function f(x, {foo} = y){}
        // function f(x = y, {foo} = z){}
        // function f({foo=a} = x){}
        // function f({foo=a,bar} = x){}
        // function f({foo,bar=b} = x){}
        // function f({foo=a,bar=b} = x){}
        // function f({foo:a} = x){}
        // function f({foo:a,bar} = x){}
        // function f({foo,bar:b} = x){}
        // function f({foo:a,bar:b} = x){}
        // function f({foo:a,bar:b} = x){}
        // function f({foo:a=b} = x){}
        // function f({foo:a=b, bar:c=d} = x){}
        // function f({foo}){}
        // function f({foo=a}){}
        // function f({foo:a}){}
        // function f({foo:a=b}){}
        // function f({foo}, bar){}
        // function f(foo, {bar}){}

        describe('array', _ => {
          // function f([]){}
          // function f([] = x){}
          // function f([,]){}
          // function f([,] = x){}
          // function f([,,]){}
          // function f([,,] = x){}
          // function f([foo]){}
          // function f([foo] = x){}
          // function f([foo,]){}
          // function f([foo,] = x){}
          // function f([foo,,]){}
          // function f([foo,,] = x){}
          // function f([,foo]){}
          // function f([,foo] = x){}
          // function f([,,foo]){}
          // function f([,,foo] = x){}
          // function f([foo,bar]){}
          // function f([foo,bar] = x){}
          // function f([foo,,bar]){}
          // function f([foo,,bar] = x){}
          // function f([foo], [foo]){}
          // function f([foo] = x, [foo] = y){}
          // function f([foo], b){}
          // function f([foo] = x, b){}
          // function f([foo], b = y){}
          // function f([foo] = x, b = y){}
          // function f(x, [foo]){}
          // function f(x, [foo] = y){}
          // function f(x = y, [foo] = z){}
          // function f(x = y, [foo]){}
          // function f([foo=a]){}
          // function f([foo=a] = c){}
          // function f([foo=a,bar]){}
          // function f([foo=a,bar] = x){}
          // function f([foo,bar=b]){}
          // function f([foo,bar=b] = x){}
          // function f([foo=a,bar=b]){}
          // function f([foo=a,bar=b] = x){}

          test('empty array sans default', {
            code: 'function f([]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [{type: 'ArrayPattern', elements: []}],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('empty array with default', {
            code: 'function f([] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'ArrayPattern', elements: []},
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('empty array one comma sans default', {
            code: 'function f([,]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [{type: 'ArrayPattern', elements: [null]}],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('empty array one comma with default', {
            code: 'function f([,] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'ArrayPattern', elements: [null]},
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('empty array double comma sans default', {
            code: 'function f([,,]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [{type: 'ArrayPattern', elements: [null, null]}],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('empty array double comma with default', {
            code: 'function f([,,] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'ArrayPattern', elements: [null, null]},
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident in array sans default', {
            code: 'function f([foo]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident in array with default', {
            code: 'function f([foo] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident trailing comma in array sans default', {
            code: 'function f([foo,]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident trailing comma in array with default', {
            code: 'function f([foo,] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident double trailing comma in array sans default', {
            code: 'function f([foo,,]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}, null],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident double trailing comma in array with default', {
            code: 'function f([foo,,] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}, null],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident leading comma in array sans default', {
            code: 'function f([,foo]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [null, {type: 'Identifier', name: 'foo'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident leading comma in array with default', {
            code: 'function f([,foo] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [null, {type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident double leading comma in array sans default', {
            code: 'function f([,,foo]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [null, null, {type: 'Identifier', name: 'foo'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('one ident double leading comma in array with default', {
            code: 'function f([,,foo] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [null, null, {type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double ident in array sans default', {
            code: 'function f([foo,bar]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double ident in array with default', {
            code: 'function f([foo,bar] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}, {type: 'Identifier', name: 'bar'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double ident double comma in array sans default', {
            code: 'function f([foo,,bar]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}, null, {type: 'Identifier', name: 'bar'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double ident double comma in array with default', {
            code: 'function f([foo,,bar] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}, null, {type: 'Identifier', name: 'bar'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double destruct on same name in array sans default', {
            code: 'function f([foo], [foo]){}',
            throws: 'bound',
          });

          test('double destruct in array sans default', {
            code: 'function f([foo], [bar]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}],
                    },
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'bar'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double destruct in array with default', {
            code: 'function f([foo] = x, [bar] = y){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'bar'}],
                      },
                      right: {type: 'Identifier', name: 'y'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
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
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('destruct and ident sans default', {
            code: 'function f([foo], b){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}],
                    },
                    {type: 'Identifier', name: 'b'},
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('destruct and ident with default', {
            code: 'function f([foo] = x, b){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                    {type: 'Identifier', name: 'b'},
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('destruct and ident with default', {
            code: 'function f([foo], b = y){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}],
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'b'},
                      right: {type: 'Identifier', name: 'y'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('destruct and ident both default', {
            code: 'function f([foo] = x, b = y){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'b'},
                      right: {type: 'Identifier', name: 'y'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('ident and destruct sans default', {
            code: 'function f(x, [foo]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {type: 'Identifier', name: 'x'},
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('ident and destruct with default', {
            code: 'function f(x, [foo] = y){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {type: 'Identifier', name: 'x'},
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'y'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('ident and destruct both default', {
            code: 'function f(x = y, [foo] = z){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'x'},
                      right: {type: 'Identifier', name: 'y'},
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [{type: 'Identifier', name: 'foo'}],
                      },
                      right: {type: 'Identifier', name: 'z'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
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
              $PUNCTUATOR,
            ],
          });

          test('ident and destruct left default', {
            code: 'function f(x = y, [foo]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {type: 'Identifier', name: 'x'},
                      right: {type: 'Identifier', name: 'y'},
                    },
                    {
                      type: 'ArrayPattern',
                      elements: [{type: 'Identifier', name: 'foo'}],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('ident in array with default sans default', {
            code: 'function f([foo=a]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'foo'},
                          right: {type: 'Identifier', name: 'a'},
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('ident in array with default with default', {
            code: 'function f([foo=a] = c){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'foo'},
                            right: {type: 'Identifier', name: 'a'},
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'c'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double ident in array with default and sans default, sans default', {
            code: 'function f([foo=a,bar]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'foo'},
                          right: {type: 'Identifier', name: 'a'},
                        },
                        {type: 'Identifier', name: 'bar'},
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double ident in array with default and sans default, with default', {
            code: 'function f([foo=a,bar] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'foo'},
                            right: {type: 'Identifier', name: 'a'},
                          },
                          {type: 'Identifier', name: 'bar'},
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('double ident in array sans default and with default, sans default', {
            code: 'function f([foo,bar=b]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {type: 'Identifier', name: 'foo'},
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'bar'},
                          right: {type: 'Identifier', name: 'b'},
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('double ident in array sans default and with default, with default', {
            code: 'function f([foo,bar=b] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [
                          {type: 'Identifier', name: 'foo'},
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'bar'},
                            right: {type: 'Identifier', name: 'b'},
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('double ident in array both default, sans default', {
            code: 'function f([foo=a,bar=b]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'foo'},
                          right: {type: 'Identifier', name: 'a'},
                        },
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'bar'},
                          right: {type: 'Identifier', name: 'b'},
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('double ident in array both default, with default', {
            code: 'function f([foo=a,bar=b] = x){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'foo'},
                            right: {type: 'Identifier', name: 'a'},
                          },
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'bar'},
                            right: {type: 'Identifier', name: 'b'},
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'x'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('ident with default that is an assignment sans default', {
            code: 'function f([a=b=c]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'a'},
                          right: {
                            type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'b'},
                            operator: '=',
                            right: {type: 'Identifier', name: 'c'},
                          },
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('ident with default that is a compound assignment', {
            code: 'function f([a=b+=c]){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'AssignmentPattern',
                          left: {type: 'Identifier', name: 'a'},
                          right: {
                            type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'b'},
                            operator: '+=',
                            right: {type: 'Identifier', name: 'c'},
                          },
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('ident with default that is an assignment with default', {
            code: 'function f([a = b = c] = arr){}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'a'},
                            right: {
                              type: 'AssignmentExpression',
                              left: {type: 'Identifier', name: 'b'},
                              operator: '=',
                              right: {type: 'Identifier', name: 'c'},
                            },
                          },
                        ],
                      },
                      right: {type: 'Identifier', name: 'arr'},
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('regression case 1', {
            code: 'function f({b: []}) {}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'b'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {type: 'ArrayPattern', elements: []},
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('regression case 2', {
            code: 'function f([{b}]) {}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'b'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'Identifier', name: 'b'},
                              shorthand: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
          });

          test('regression case 3', {
            code: 'function f([a, {b: []}]) {}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {type: 'Identifier', name: 'a'},
                        {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {type: 'Identifier', name: 'b'},
                              kind: 'init',
                              method: false,
                              computed: false,
                              value: {type: 'ArrayPattern', elements: []},
                              shorthand: false,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $IDENT,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('array in object', {
            code: 'function fk({x: [a, {b: []}]}) {}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'fk'},
                  params: [
                    {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {type: 'Identifier', name: 'x'},
                          kind: 'init',
                          method: false,
                          computed: false,
                          value: {
                            type: 'ArrayPattern',
                            elements: [
                              {type: 'Identifier', name: 'a'},
                              {
                                type: 'ObjectPattern',
                                properties: [
                                  {
                                    type: 'Property',
                                    key: {type: 'Identifier', name: 'b'},
                                    kind: 'init',
                                    method: false,
                                    computed: false,
                                    value: {type: 'ArrayPattern', elements: []},
                                    shorthand: false,
                                  },
                                ],
                              },
                            ],
                          },
                          shorthand: false,
                        },
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
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
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          test('array in array', {
            code: 'function f([a, [b], c]) {}',
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'FunctionDeclaration',
                  generator: false,
                  async: false,
                  expression: false,
                  id: {type: 'Identifier', name: 'f'},
                  params: [
                    {
                      type: 'ArrayPattern',
                      elements: [
                        {type: 'Identifier', name: 'a'},
                        {
                          type: 'ArrayPattern',
                          elements: [{type: 'Identifier', name: 'b'}],
                        },
                        {type: 'Identifier', name: 'c'},
                      ],
                    },
                  ],
                  body: {type: 'BlockStatement', body: []},
                },
              ],
            },
            tokens: [
              $IDENT,
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
              $PUNCTUATOR,
              $PUNCTUATOR,
            ],
          });

          describe('rest operator', _ => {
            test('simple rest arg sans default', {
              code: 'function f([...bar]){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'RestElement',
                            argument: {type: 'Identifier', name: 'bar'},
                          },
                        ],
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('simple rest arg with default', {
              code: 'function f([...bar] = obj){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'RestElement',
                              argument: {type: 'Identifier', name: 'bar'},
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('rest as second part sans default', {
              code: 'function f([foo, ...bar]){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {type: 'Identifier', name: 'foo'},
                          {
                            type: 'RestElement',
                            argument: {type: 'Identifier', name: 'bar'},
                          },
                        ],
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('rest as second part with default', {
              code: 'function f([foo, ...bar] = obj){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {type: 'Identifier', name: 'foo'},
                            {
                              type: 'RestElement',
                              argument: {type: 'Identifier', name: 'bar'},
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
            });

            test('rest with arg after it sans default', {
              code: 'function f([...foo, bar]){}',
              throws: 'rest arg',
            });

            test('rest with arg after it with default', {
              code: 'function f([...foo, bar] = obj){}',
              throws: 'rest arg',
            });

            test('rest with trailing comma sans default', {
              code: 'function f([...foo,]){}',
              throws: 'rest arg',
            });

            test('rest with trailing comma with default', {
              code: 'function f([...foo,] = obj){}',
              throws: 'rest arg',
            });

            test('rest with double trailing comma sans default', {
              code: 'function f([...foo,,]){}',
              throws: 'rest arg',
            });

            test('rest with double trailing comma with default', {
              code: 'function f([...foo,,] = obj){}',
              throws: 'rest arg',
            });

            test('rest with destruct with two ident sans default', {
              code: 'function f([...[a, b]]){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                            },
                          },
                        ],
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [
                $IDENT,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
              ],
            });

            test('rest with destruct with two ident with default', {
              code: 'function f([...[a, b]] = obj){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'RestElement',
                              argument: {
                                type: 'ArrayPattern',
                                elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                              },
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [
                $IDENT,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
              ],
            });

            test('rest with destruct with two ident with trailing comma sans default', {
              code: 'function f([...[a, b],]){}',
              throws: 'rest arg',
            });

            test('rest with destruct with two ident with trailing comma with default', {
              code: 'function f([...[a, b],] = obj){}',
              throws: 'rest arg',
            });

            test('rest with destruct with two ident with double trailing comma sans default', {
              code: 'function f([...[a, b],,] = obj){}',
              throws: 'rest arg',
            });

            test('rest with destruct with two ident with double trailing comma with default', {
              code: 'function f([...[a, b],,] = obj){}',
              throws: 'rest arg',
            });

            test('nested rest as second sans default', {
              code: 'function f([x, ...[a, b]]){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {type: 'Identifier', name: 'x'},
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'ArrayPattern',
                              elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                            },
                          },
                        ],
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [
                $IDENT,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
              ],
            });

            test('nested rest as second with default', {
              code: 'function f([x, ...[a, b]] = obj){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {type: 'Identifier', name: 'x'},
                            {
                              type: 'RestElement',
                              argument: {
                                type: 'ArrayPattern',
                                elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                              },
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [
                $IDENT,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
              ],
            });

            test('rest with local default sans default', {
              code: 'function f([...bar = foo]){}',
              throws: 'rest arg',
            });

            test('rest with local default with default', {
              code: 'function f([...bar = foo] = obj){}',
              throws: 'rest arg',
            });

            test('double rest sans default', {
              code: 'function f([... ...foo]){}',
              throws: 'Can not rest twice',
            });

            test('double rest with default', {
              code: 'function f([... ...foo] = obj){}',
              throws: 'Can not rest twice',
            });

            test('missing rest value sans default', {
              code: 'function f([...]){}',
              throws: true,
            });

            test('missing rest value with default', {
              code: 'function f([...] = obj){}',
              throws: true,
            });

            test('missing rest value with comma sans default', {
              code: 'function f([...,]){}',
              throws: true,
            });

            test('missing rest value with comma with default', {
              code: 'function f([...,] = obj){}',
              throws: true,
            });

            test('single dot not a rest', {
              code: 'function f([.x]){}',
              throws: true,
            });

            test('double dot vs rest', {
              code: 'function f([..x]){}',
              throws: true,
            });

            test('spread and rest sans default', {
              code: 'function f( [a=[...b], ...c]){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'AssignmentPattern',
                            left: {type: 'Identifier', name: 'a'},
                            right: {
                              type: 'ArrayExpression',
                              elements: [
                                {
                                  type: 'SpreadElement',
                                  argument: {type: 'Identifier', name: 'b'},
                                },
                              ],
                            },
                          },
                          {
                            type: 'RestElement',
                            argument: {type: 'Identifier', name: 'c'},
                          },
                        ],
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [
                $IDENT,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
              ],
            });

            test('spread and rest with default', {
              code: 'function f( [a=[...b], ...c] = obj){}',
              ast: {
                type: 'Program',
                body: [
                  {
                    type: 'FunctionDeclaration',
                    generator: false,
                    async: false,
                    expression: false,
                    id: {type: 'Identifier', name: 'f'},
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'AssignmentPattern',
                              left: {type: 'Identifier', name: 'a'},
                              right: {
                                type: 'ArrayExpression',
                                elements: [
                                  {
                                    type: 'SpreadElement',
                                    argument: {type: 'Identifier', name: 'b'},
                                  },
                                ],
                              },
                            },
                            {
                              type: 'RestElement',
                              argument: {type: 'Identifier', name: 'c'},
                            },
                          ],
                        },
                        right: {type: 'Identifier', name: 'obj'},
                      },
                    ],
                    body: {type: 'BlockStatement', body: []},
                  },
                ],
              },
              tokens: [
                $IDENT,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $IDENT,
                $PUNCTUATOR,
                $PUNCTUATOR,
                $PUNCTUATOR,
              ],
            });

            test('spread on array with default on function', {
              code: 'f = function([...[ x ] = []]) {};',
              throws: true,
            });

            test('spread on array with default on array', {
              code: 'f = ([...[ x ] = []]) => {};',
              throws: true,
            });
          });
        });
      });
    });

    describe('body', _ => {
      test('function decl, no args, one stmt', {
        code: 'function f(){foo}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });

      test('function decl, no args, two stmts', {
        code: 'function f(){foo;bar}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}],
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });
    });

    // there are more extensive tests in the async test file
    describe('async', _ => {
      test('empty async function', {
        code: 'async function f(){}',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: true,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    // there are more extensive tests in the yield test file
    describe('generators', _ => {
      test('empty generator function', {
        code: 'function* f(){}',
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
              body: {type: 'BlockStatement', body: []},
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    test('array elision in arrow params', {
      code: 'f = ([[,] = g()]) => {};',
      ast: true,
      tokens: true,
    });

    test('class expr in arrow params', {
      code: 'f = (x = class{}) => {};',
      ast: true,
      tokens: true,
    });

    describe('yield and await keyword cases', _ => {

      // barring exceptions -- for all functions and methods goes:
      // - name of the func keeps outer scope await/yield state. exception: function expressions clear it.
      // - args and body explicitly set it according to the type of this function (so async sets await clears yield, etc)
      // This means you can use `await` as a function name as long as you are not in strict mode and not already inside
      // an async function and it's okay if the function whose name is being defined is actually async itself.
      // the cases to test are a cross product of:
      // <global, inside async, inside generator> * <yield, await> * <regular, async, generator, async gen> * <name, arg-name, arg-default, body> * <class method, obj method, decl, expr, default>

      describe('global', _ => {

        describe('name', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x decl', _ => {

            test.pass('func decl can be called yield', {
              code: 'function yield() {}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async func decl can be called yield', {
              code: 'async function yield() {}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail_strict('generator func decl can be called yield in sloppy mode', {
              code: 'function *yield() {}',
            });

            test.pass('async generator func decl can be called yield', {
              code: 'async function *yield() {}',
              // only illegal in strict mode
              STRICT: { throws: 'yield' },
            });

            test.pass('func decl can be called await', {
              code: 'function await() {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.pass('async func decl can be called await', {
              code: 'async function await() {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.pass('generator func decl can be called await', {
              code: 'function *await() {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.pass('async generator func decl can be called await', {
              code: 'async function *await() {}',
              // only illegal in goal mode
              MODULE: {throws: 'await'},
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x expr', _ => {

            test.fail_strict('func expr called yield', {
              code: 'let f = function yield() {}',
            });

            test.fail_strict('async func expr can be called yield', {
              code: 'let f = async function yield() {}',
            });

            test.fail('generator func expr can be called yield in sloppy', {
              code: 'let f = function *yield() {}',
            });

            test('async generator func expr can not be called yield', {
              code: 'let f = async function *yield() {}',
              throws: 'yield',
            });

            test.pass('func expr can be called await', {
              code: 'let f = function await() {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async func expr can be called await', {
              code: 'let f = async function await() {}',
            });

            test.pass('generator func expr can be called await', {
              code: 'let f = function *await() {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async generator func expr can be called await', {
              code: 'let f = async function *await() {}',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x class method', _ => {

            // since class methods are properties the name can be keywords so skipping the other tests for this
            test.pass('class method can be called yield', {
              code: 'class A {yield() {}}',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x obj method', _ => {

            // since obj methods are properties the name can be keywords so skipping the other tests for this
            test.pass('obj method can be called yield', {
              code: 'A = {yield() {}}',
            });
          });
        });

        describe('arg-name', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x decl', _ => {

            test.pass('func decl arg called yield', {
              code: 'function f(yield) {}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async func decl arg called yield', {
              code: 'async function f(yield) {}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('generator func decl arg called yield', {
              code: 'function *f(yield) {}',
              throws: 'yield',
            });

            test('async generator func decl arg called yield', {
              code: 'async function *f(yield) {}',
              throws: 'yield',
            });

            test.pass('func decl arg called await', {
              code: 'function f(await) {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async func decl arg called await', {
              code: 'async function f(await) {}',
              throws: 'await',
            });

            test.pass('generator func decl arg called await', {
              code: 'function *f(await) {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async generator func decl arg called await', {
              code: 'async function *f(await) {}',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x expr', _ => {

            test.pass('func expr arg called yield', {
              code: 'let f = function f(yield) {}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async func expr arg called yield', {
              code: 'let f = async function f(yield) {}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('generator func expr arg called yield', {
              code: 'let f = function *f(yield) {}',
              throws: 'yield',
            });

            test('async generator func expr arg called yield', {
              code: 'let f = async function *f(yield) {}',
              throws: 'yield',
            });

            test.pass('func expr arg called await', {
              code: 'let f = function f(await) {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async func expr arg called await', {
              code: 'let f = async function f(await) {}',
              throws: 'await',
            });

            test.pass('generator func expr arg called await', {
              code: 'let f = function *f(await) {}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async generator func expr arg called await', {
              code: 'let f = async function *f(await) {}',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method arg called yield', {
              code: 'class A {f(yield) {}}',
              throws: 'yield',
            });

            test.fail('async class method arg called yield', {
              code: 'class A {async f(yield) {}}',
              throws: 'yield',
            });

            test.fail('generator class method arg called yield', {
              code: 'class A {*f(yield) {}}',
              throws: 'yield',
            });

            test.fail('async generator class method arg called yield', {
              code: 'class A {async *f(yield) {}}',
              throws: 'yield',
            });

            test.pass('class method arg called await', {
              code: 'class A {f(await) {}}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async class method arg called await', {
              code: 'class A {async f(await) {}}',
              throws: 'await',
            });

            test.pass('generator class method arg called await', {
              code: 'class A {*f(await) {}}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.pass('async generator class method arg called await', {
              code: 'class A {async *f(await) {}}',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x obj method', _ => {

            test.pass('obj method arg called yield', {
              code: 'o = {f(yield) {}}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async obj method arg called yield', {
              code: 'o = {async f(yield) {}}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('generator obj method arg called yield', {
              code: 'o = {*f(yield) {}}',
              throws: 'yield',
            });

            test.fail('async generator obj method arg called yield', {
              code: 'o = {async *f(yield) {}}',
              throws: 'yield',
            });

            test.pass('obj method arg called await', {
              code: 'o = {f(await) {}}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test.fail('async obj method arg called await', {
              code: 'o = {async f(await) {}}',
              throws: 'await',
            });

            test.pass('generator obj method arg called await', {
              code: 'o = {*f(await) {}}',
              // only illegal in goal mode
              MODULE: {
                throws: 'await',
              },
            });

            test('async generator obj method arg called await', {
              code: 'o = {async *f(await) {}}',
              throws: 'await',
            });
          });
        });

        describe('arg-default', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x decl', _ => {

            test.fail('func decl yield', {
              code: 'function f(x=yield 100) {}',
            });

            test.fail('async func decl yield', {
              code: 'async function f(x=yield 100) {}',
              desc: 'async+yield',
            });

            test.fail('generator func decl yield', {
              code: 'function *f(x=yield 100) {}',
              desc:' explicitly disallowed',
            });

            test('async generator func decl yield', {
              code: 'async function *f(x=yield 100) {}',
              throws: 'yield',
            });

            test.fail('func decl arg await', {
              code: 'function f(x=await foo) {}',
            });

            test.fail('async func decl await', {
              code: 'async function f(x=await foo) {}',
              throws: 'await',
            });

            test.fail('generator func decl await', {
              code: 'function *f(x=await foo) {}',
            });

            test('async generator func decl await', {
              code: 'async function *f(x=await foo) {}',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x expr', _ => {

            test.fail('func expr yield', {
              code: 'let f = function f(x=yield 100) {}',
            });

            test.fail('async func expr yield', {
              code: 'let f = async function f(x=yield 100) {}',
            });

            test.fail('generator func expr yield', {
              code: 'let f = function *f(x=yield 100) {}',
            });

            test('async generator func expr yield', {
              code: 'let f = async function *f(x=yield 100) {}',
              throws: 'yield',
            });

            test.fail('func expr await', {
              code: 'let f = function f(x=await foo) {}',
            });

            test.fail('async func expr await', {
              code: 'let f = async function f(x=await foo) {}',
              throws: 'await',
            });

            test.fail('generator func expr await', {
              code: 'let f = function *f(x=await foo) {}',
            });

            test('async generator func expr await', {
              code: 'let f = async function *f(x=await foo) {}',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method yield', {
              code: 'class A {f(x=yield 100) {}}',
            });

            test.fail('async class method yield', {
              code: 'class A {async f(x=yield 100) {}}',
            });

            test.fail('generator class method yield', {
              code: 'class A {*f(x=yield 100) {}}',
            });

            test.fail('async generator class method yield', {
              code: 'class A {async *f(x=yield 100) {}}',
              throws: 'yield',
            });

            test.fail('class method await', {
              code: 'class A {f(x=await foo) {}}',
              throws: 'await',
            });

            test.fail('async class method await', {
              code: 'class A {async f(x=await foo) {}}',
              throws: 'await',
            });

            test.fail('generator class method await', {
              code: 'class A {*f(x=await foo) {}}',
              throws: 'await',
            });

            test('async generator class method await', {
              // https://tc39.github.io/ecma262/#prod-AwaitExpression
              // In the FormalParameters of an AsyncFunctionDeclaration, AsyncFunctionExpression, AsyncGeneratorDeclaration, or AsyncGeneratorExpression. AwaitExpression;
              // in this position is a Syntax error via static semantics.
              code: 'class A {async *f(x=await foo) {}}',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x obj method', _ => {

            test.fail('obj method yield', {
              code: 'o = {f(x=yield 100) {}}',
            });

            test.fail('async obj method yield', {
              code: 'o = {async f(x=yield 100) {}}',
            });

            test.fail('generator obj method yield', {
              code: 'o = {*f(x=yield 100) {}}',
            });

            test.fail('async generator obj method yield', {
              code: 'o = {async *f(x=yield 100) {}}',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('obj method await', {
              code: 'o = {f(x=await foo) {}}',
            });

            test.fail('async obj method await', {
              code: 'o = {async f(x=await foo) {}}',
              throws: 'await',
            });

            test.fail('generator obj method await', {
              code: 'o = {*f(x=await foo) {}}',
            });

            test.fail('async generator obj method await', {
              code: 'o = {async *f(x=await foo) {}}',
              throws: 'await',
            });
          });
        });

        describe('body', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x decl', _ => {

            test.fail('func decl yield', {
              code: 'function f() { return yield 100; }',
            });

            test.fail('async func decl yield', {
              code: 'async function f() { return yield 100; }',
              desc: 'async+yield',
            });

            test.pass('generator func decl yield', {
              code: 'function *f() { return yield 100; }',
            });

            test.pass('async generator func decl yield', {
              code: 'async function *f() { return yield 100; }',
            });

            test.fail('func decl arg await', {
              code: 'function f() { return await foo; }',
            });

            test.pass('async func decl await', {
              code: 'async function f() { return await foo; }',
            });

            test.fail('generator func decl await', {
              code: 'function *f() { return await foo; }',
            });

            test.pass('async generator func decl await', {
              code: 'async function *f() { return await foo; }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x expr', _ => {

            test.fail('func expr yield', {
              code: 'let f = function f() { return yield 100; }',
            });

            test.fail('async func expr yield', {
              code: 'let f = async function f() { return yield 100; }',
            });

            test.pass('generator func expr yield', {
              code: 'let f = function *f() { return yield 100; }',
            });

            test.pass('async generator func expr yield', {
              code: 'let f = async function *f() { return yield 100; }',
            });

            test.fail('func expr await', {
              code: 'let f = function f() { return await foo; }',
            });

            test.pass('async func expr await', {
              code: 'let f = async function f() { return await foo; }',
            });

            test.fail('generator func expr await', {
              code: 'let f = function *f() { return await foo; }',
            });

            test.pass('async generator func expr await', {
              code: 'let f = async function *f() { return await foo; }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method yield', {
              code: 'class A {f() { return yield 100; }}',
              throws: 'yield',
            });

            test.fail('async class method yield', {
              code: 'class A {async f() { return yield 100; }}',
              throws: 'yield',
            });

            test.pass('generator class method yield', {
              code: 'class A {*f() { return yield 100; }}',
            });

            test.pass('async generator class method containing yield', {
              code: 'class A {async *f() { return yield 100; }}',
            });

            test.fail('class method await', {
              code: 'class A {f() { return await foo; }}',
              throws: 'await',
            });

            test.pass('async class method await', {
              code: 'class A {async f() { return await foo; }}',
            });

            test.fail('generator class method await', {
              code: 'class A {*f() { return await foo; }}',
              throws: 'await',
            });

            test.pass('async generator class method containing await', {
              code: 'class A {async *f() { return await foo; }}',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x obj method', _ => {

            test.fail('obj method yield', {
              code: 'o = {f() { return yield 100; }}',
            });

            test.fail('async obj method yield', {
              code: 'o = {async f() { return yield 100; }}',
            });

            test.pass('generator obj method yield', {
              code: 'o = {*f() { return yield 100; }}',
            });

            test.pass('async generator obj method containing yield', {
              code: 'o = {async *f() { return yield 100; }}',
            });

            test.fail('obj method await', {
              code: 'o = {f() { return await foo; }}',
            });

            test.pass('async obj method await', {
              code: 'o = {async f() { return await foo; }}',
            });

            test.fail('generator obj method await', {
              code: 'o = {*f() { return await foo; }}',
            });

            test.pass('async generator obj method containing await', {
              code: 'o = {async *f() { return await foo; }}',
            });
          });
        });
      });

      describe('normal async', _ => {

        describe('name', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x decl', _ => {

            test.pass('func decl can be called yield', {
              code: 'async function as(){ function yield() {} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async func decl can be called yield', {
              code: 'async function as(){ async function yield() {} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail_strict('generator func decl can be called yield', {
              code: 'async function as(){ function *yield() {} }',
            });

            test.pass('async generator func decl can be called yield', {
              code: 'async function as(){ async function *yield() {} }',
              // only illegal in strict mode
              STRICT: { throws: 'yield' },
            });

            test.fail('func decl can be called await', {
              code: 'async function as(){ function await() {} }',
              throws: 'await',
            });

            test.fail('async func decl can be called await', {
              code: 'async function as(){ async function await() {} }',
              throws: 'await',
            });

            test.fail('generator func decl can be called await', {
              code: 'async function as(){ function *await() {} }',
              throws: 'await',
            });

            test.fail('async generator func decl can be called await', {
              code: 'async function as(){ async function *await() {} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x expr', _ => {

            test.fail_strict('func expr can be called yield', {
              code: 'async function as(){ let f = function yield() {} }',
            });

            test.fail_strict('async func expr can be called yield', {
              code: 'async function as(){ let f = async function yield() {} }',
            });

            test.fail('generator func expr can be called yield', {
              code: 'async function as(){ let f = function *yield() {} }',
            });

            test('async generator func expr cannot be called yield', {
              code: 'async function as(){ let f = async function *yield() {} }',
              throws: 'yield',
            });

            test.pass('func expr can be called await', {
              code: 'async function as(){ let f = function await() {} }',
              MODULE: {throws: true},
            });

            test.fail('async func expr can be called await', {
              code: 'async function as(){ let f = async function await() { }',
              throws: 'await',
            });

            test.pass('generator func expr can be called await', {
              code: 'async function as(){ let f = function *await() {} }',
              MODULE: {throws: true},
            });

            test.fail('async generator func expr can be called await', {
              code: 'async function as(){ let f = async function *await() {} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x class method', _ => {

            // since class methods are properties the name can be keywords so skipping the other tests for this
            test.pass('class method can be called yield', {
              code: 'async function as(){ class A {yield() {}} }',
            });

            test.pass('class method can be called await', {
              code: 'async function as(){ class A {await() {}} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x obj method', _ => {

            // since obj methods are properties the name can be keywords so skipping the other tests for this
            test.pass('obj method can be called yield', {
              code: 'async function as(){ A = {yield() {}} }',
            });

            test.pass('obj method can be called await', {
              code: 'async function as(){ A = {await() {}} }',
            });
          });
        });

        describe('arg-name', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x decl', _ => {

            test.pass('func decl arg called yield', {
              code: 'async function as(){ function f(yield) {} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async func decl arg called yield', {
              code: 'async function as(){ async function f(yield) {} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('generator func decl arg called yield', {
              code: 'async function as(){ function *f(yield) {} }',
              throws: 'yield',
            });

            test('async generator func decl arg called yield', {
              code: 'async function as(){ async function *f(yield) {} }',
              throws: 'yield',
            });

            test.pass('func decl arg called await', {
              code: 'async function as(){ function f(await) {} }',
              desc: 'args are reset and so no longer a problem',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async func decl arg called await', {
              code: 'async function as(){ async function f(await) {} }',
              throws: 'await',
            });

            test.pass('generator func decl arg called await', {
              code: 'async function as(){ function *f(await) {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async generator func decl arg called await', {
              code: 'async function as(){ async function *f(await) {} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x expr', _ => {

            test.pass('func expr arg called yield', {
              code: 'async function as(){ let f = function f(yield) {} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async func expr arg called yield', {
              code: 'async function as(){ let f = async function f(yield) {} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('generator func expr arg called yield', {
              code: 'async function as(){ let f = function *f(yield) {} }',
              throws: 'yield',
            });

            test('async generator func expr arg called yield', {
              code: 'async function as(){ let f = async function *f(yield) {} }',
              throws: 'yield',
            });

            test.pass('func expr arg called await', {
              code: 'async function as(){ let f = function f(await) {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async func expr arg called await', {
              code: 'async function as(){ let f = async function f(await) {} }',
              throws: 'await',
            });

            test.pass('generator func expr arg called await', {
              code: 'async function as(){ let f = function *f(await) {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async generator func expr arg called await', {
              code: 'async function as(){ let f = async function *f(await) {} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method arg called yield', {
              code: 'async function as(){ class A {f(yield) {}} }',
              throws: 'yield',
            });

            test.fail('async class method arg called yield', {
              code: 'async function as(){ class A {async f(yield) {}} }',
              throws: 'yield',
            });

            test.fail('generator class method arg called yield', {
              code: 'async function as(){ class A {*f(yield) {}} }',
              throws: 'yield',
            });

            test.fail('async generator class method arg called yield', {
              code: 'async function as(){ class A {async *f(yield) {}} }',
              throws: 'yield',
            });

            test.pass('class method arg called await', {
              code: 'async function as(){ class A {f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async class method arg called await', {
              code: 'async function as(){ class A {async f(await) {}} }',
              throws: 'await',
            });

            test.pass('generator class method arg called await', {
              code: 'async function as(){ class A {*f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test('async generator class method arg called await', {
              code: 'async function as(){ class A {async *f(await) {}} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x obj method', _ => {

            test.pass('obj method arg called yield', {
              code: 'async function as(){ o = {f(yield) {}} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.pass('async obj method arg called yield', {
              code: 'async function as(){ o = {async f(yield) {}} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('generator obj method arg called yield', {
              code: 'async function as(){ o = {*f(yield) {}} }',
              throws: 'yield',
            });

            test.pass('async generator obj method arg called yield', {
              code: 'async function as(){ o = {async *f(yield) {}} }',
              throws: 'yield',
            });

            test.pass('obj method arg called await', {
              code: 'async function as(){ o = {f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async obj method arg called await', {
              code: 'async function as(){ o = {async f(await) {}} }',
              throws: 'await',
            });

            test.pass('generator obj method arg called await', {
              code: 'async function as(){ o = {*f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test('async generator obj method arg called await', {
              code: 'async function as(){ o = {async *f(await) {}} }',
              throws: 'await',
            });
          });
        });

        describe('arg-default', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x decl', _ => {

            test.fail('func decl yield', {
              code: 'async function as(){ function f(x=yield 100) {} }',
            });

            test.fail('async func decl yield', {
              code: 'async function as(){ async function f(x=yield 100) {} }',
              desc: 'async+yield',
            });

            test.fail('generator func decl yield', {
              code: 'async function as(){ function *f(x=yield 100) {} }',
              desc:' explicitly disallowed',
            });

            test('async generator func decl yield', {
              code: 'async function as(){ async function *f(x=yield 100) {} }',
              throws: 'yield',
            });

            test.fail('func decl arg await', {
              code: 'async function as(){ function f(x=await foo) {} }',
            });

            test.fail('async func decl await', {
              code: 'async function as(){ async function f(x=await foo) {} }',
              throws: 'await',
            });

            test.fail('generator func decl await', {
              code: 'async function as(){ function *f(x=await foo) {} }',
            });

            test.fail('async generator func decl await', {
              code: 'async function as(){ async function *f(x=await foo) {} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x expr', _ => {

            test.fail('func expr yield', {
              code: 'async function as(){ let f = function f(x=yield 100) {} }',
            });

            test.fail('async func expr yield', {
              code: 'async function as(){ let f = async function f(x=yield 100) {} }',
            });

            test.fail('generator func expr yield', {
              code: 'async function as(){ let f = function *f(x=yield 100) {} }',
            });

            test('async generator func expr yield', {
              code: 'async function as(){ let f = async function *f(x=yield 100) {} }',
              throws: 'yield',
            });

            test.fail('func expr await', {
              code: 'async function as(){ let f = function f(x=await foo) {} }',
            });

            test.fail('async func expr await', {
              code: 'async function as(){ let f = async function f(x=await foo) {} }',
              throws: 'await',
            });

            test.fail('generator func expr await', {
              code: 'async function as(){ let f = function *f(x=await foo) {} }',
            });

            test.fail('async generator func expr await', {
              code: 'async function as(){ let f = async function *f(x=await foo) {} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method yield', {
              code: 'async function as(){ class A {f(x=yield 100) {}} }',
              throws: 'yield',
            });

            test.fail('async class method yield', {
              code: 'async function as(){ class A {async f(x=yield 100) {}} }',
              throws: 'yield',
            });

            test.fail('generator class method yield', {
              code: 'async function as(){ class A {*f(x=yield 100) {}} }',
              throws: 'yield',
            });

            test.fail('async generator class method yield', {
              code: 'async function as(){ class A {async *f(x=yield 100) {}} }',
              throws: 'yield',
            });

            test.fail('class method await', {
              code: 'async function as(){ class A {f(x=await foo) {}} }',
              throws: 'await',
            });

            test.fail('async class method await', {
              code: 'async function as(){ class A {async f(x=await foo) {}} }',
              throws: 'await',
            });

            test.fail('generator class method await', {
              code: 'async function as(){ class A {*f(x=await foo) {}} }',
            });

            test.fail('async generator class method await', {
              code: 'async function as(){ class A {async *f(x=await foo) {}} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x obj method', _ => {

            test.fail('obj method yield', {
              code: 'async function as(){ o = {f(x=yield 100) {}} }',
            });

            test.fail('async obj method yield', {
              code: 'async function as(){ o = {async f(x=yield 100) {}} }',
            });

            test.fail('generator obj method yield', {
              code: 'async function as(){ o = {*f(x=yield 100) {}} }',
            });

            test.fail('async generator obj method yield', {
              code: 'async function as(){ o = {async *f(x=yield 100) {}} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('obj method await', {
              code: 'async function as(){ o = {f(x=await foo) {}} }',
            });

            test.fail('async obj method await', {
              code: 'async function as(){ o = {async f(x=await foo) {}} }',
              throws: 'await',
            });

            test.fail('generator obj method await', {
              code: 'async function as(){ o = {*f(x=await foo) {}} }',
            });

            test.fail('async generator obj method await', {
              code: 'async function as(){ o = {async *f(x=await foo) {}} }',
            });
          });
        });

        describe('body', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x decl', _ => {

            test.fail('func decl yield', {
              code: 'async function as(){ function f() { return yield 100; } }',
            });

            test.fail('async func decl yield', {
              code: 'async function as(){ async function f() { return yield 100; } }',
              desc: 'async+yield',
            });

            test.pass('generator func decl yield', {
              code: 'async function as(){ function *f() { return yield 100; } }',
            });

            test.pass('async generator func decl yield', {
              code: 'async function as(){ async function *f() { return yield 100; } }',
            });

            test.fail('func decl arg await', {
              code: 'async function as(){ function f() { return await foo; } }',
            });

            test.pass('async func decl await', {
              code: 'async function as(){ async function f() { return await foo; } }',
            });

            test.fail('generator func decl await', {
              code: 'async function as(){ function *f() { return await foo; } }',
            });

            test.pass('async generator func decl await', {
              code: 'async function as(){ async function *f() { return await foo; } }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x expr', _ => {

            test.fail('func expr yield', {
              code: 'async function as(){ let f = function f() { return yield 100; } }',
            });

            test.fail('async func expr yield', {
              code: 'async function as(){ let f = async function f() { return yield 100; } }',
            });

            test.pass('generator func expr yield', {
              code: 'async function as(){ let f = function *f() { return yield 100; } }',
            });

            test.pass('async generator func expr yield', {
              code: 'async function as(){ let f = async function *f() { return yield 100; } }',
            });

            test.fail('func expr await', {
              code: 'async function as(){ let f = function f() { return await foo; } }',
            });

            test.pass('async func expr await', {
              code: 'async function as(){ let f = async function f() { return await foo; } }',
            });

            test.fail('generator func expr await', {
              code: 'async function as(){ let f = function *f() { return await foo; } }',
            });

            test.pass('async generator func expr await', {
              code: 'async function as(){ let f = async function *f() { return await foo; } }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method yield', {
              code: 'async function as(){ class A {f() { return yield 100; }} }',
              throws: 'yield',
            });

            test.fail('async class method yield', {
              code: 'async function as(){ class A {async f() { return yield 100; }} }',
              throws: 'yield',
            });

            test.pass('generator class method yield', {
              code: 'async function as(){ class A {*f() { return yield 100; }} }',
            });

            test.pass('async generator class method containing yield', {
              code: 'async function as(){ class A {async *f() { return yield 100; }} }',
            });

            test.fail('class method await', {
              code: 'async function as(){ class A {f() { return await foo; }} }',
              throws: 'await',
            });

            test.pass('async class method await', {
              code: 'async function as(){ class A {async f() { return await foo; }} }',
            });

            test.fail('generator class method await', {
              code: 'async function as(){ class A {*f() { return await foo; }} }',
              throws: 'await',
            });

            test.pass('async generator class method containing await', {
              code: 'async function as(){ class A {async *f() { return await foo; }} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x obj method', _ => {

            test.fail('obj method yield', {
              code: 'async function as(){ o = {f() { return yield 100; }} }',
            });

            test.fail('async obj method yield', {
              code: 'async function as(){ o = {async f() { return yield 100; }} }',
            });

            test.pass('generator obj method yield', {
              code: 'async function as(){ o = {*f() { return yield 100; }} }',
            });

            test.pass('async generator obj method containing yield', {
              code: 'async function as(){ o = {async *f() { return yield 100; }} }',
            });

            test.fail('obj method await', {
              code: 'async function as(){ o = {f() { return await foo; }} }',
            });

            test.pass('async obj method await', {
              code: 'async function as(){ o = {async f() { return await foo; }} }',
            });

            test.fail('generator obj method await', {
              code: 'async function as(){ o = {*f() { return await foo; }} }',
            });

            test.pass('async generator obj method containing await', {
              code: 'async function as(){ o = {async *f() { return await foo; }} }',
            });
          });
        });
      });

      describe('generator', _ => {

        describe('name', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x decl', _ => {

            test.fail('func decl can be called yield', {
              code: 'function *as(){ function yield() {} }',
              throws: 'yield',
            });

            test.fail('async func decl can be called yield', {
              code: 'function *as(){ async function yield() {} }',
              throws: 'yield',
            });

            test.fail('generator func decl can not be called yield', {
              code: 'function *as(){ function *yield() {} }',
            });

            test('async generator func decl can be called yield', {
              code: 'function *as(){ async function *yield() {} }',
              throws: 'yield',
            });

            test.pass('func decl can be called await', {
              code: 'function *as(){ function await() {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.pass('async func decl can be called await', {
              code: 'function *as(){ async function await() {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.pass('generator func decl can be called await', {
              code: 'function *as(){ function *await() {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.pass('async generator func decl can be called await', {
              code: 'function *as(){ async function *await() {} }',
              STRICT: {
                throws: 'await',
              },
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x expr', _ => {

            test.fail_strict('func expr can be called yield', {
              code: 'function *as(){ let f = function yield() {} }',
            });

            test.fail_strict('async func expr can not be called yield', {
              code: 'function *as(){ let f = async function yield() {} }',
            });

            test.fail('generator func expr not can be called yield', {
              code: 'function *as(){ let f = function *yield() {} }',
            });

            test('async generator func expr can be called yield', {
              code: 'function *as(){ let f = async function *yield() {} }',
              throws: 'yield',
            });

            test.fail_strict('func expr can be called await', {
              code: 'function *as(){ let f = function await() {} }',
            });

            test.fail('async func expr can be called await', {
              code: 'function *as(){ let f = async function await() { }',
            });

            test.fail_strict('generator func expr can be called await', {
              code: 'function *as(){ let f = function *await() {} }',
              throws: 'await',
            });

            test('async generator func expr can not be called await', {
              code: 'function *as(){ let f = async function *await() {} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x class method', _ => {

            // since class methods are properties the name can be keywords so skipping the other tests for this
            test.pass('class method can be called yield', {
              code: 'function *as(){ class A {yield() {}} }',
            });

            test.pass('class method can be called await', {
              code: 'function *as(){ class A {await() {}} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x name x obj method', _ => {

            // since obj methods are properties the name can be keywords so skipping the other tests for this
            test.pass('obj method can be called yield', {
              code: 'function *as(){ A = {yield() {}} }',
            });

            test.pass('obj method can be called await', {
              code: 'function *as(){ A = {await() {}} }',
            });
          });
        });

        describe('arg-name', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x decl', _ => {

            test.pass('func decl arg called yield', {
              code: 'function *as(){ function f(yield) {} }',
              STRICT: {throws: 'yield'},
            });

            test.pass('async func decl arg called yield', {
              code: 'function *as(){ async function f(yield) {} }',
              STRICT: {throws: 'yield'},
            });

            test.fail('generator func decl arg called yield', {
              code: 'function *as(){ function *f(yield) {} }',
              throws: 'yield',
            });

            test('async generator func decl arg called yield', {
              code: 'function *as(){ async function *f(yield) {} }',
              throws: 'yield',
            });

            test.pass('func decl arg called await', {
              code: 'function *as(){ function f(await) {} }',
              desc: 'args are reset and so no longer a problem',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async func decl arg called await', {
              code: 'function *as(){ async function f(await) {} }',
              throws: 'await',
            });

            test.pass('generator func decl arg called await', {
              code: 'function *as(){ function *f(await) {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async generator func decl arg called await', {
              code: 'function *as(){ async function *f(await) {} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x expr', _ => {

            test.pass('func expr arg called yield', {
              code: 'function *as(){ let f = function f(yield) {} }',
              STRICT: {throws: 'yield'},
            });

            test.pass('async func expr arg called yield', {
              code: 'function *as(){ let f = async function f(yield) {} }',
              STRICT: {throws: 'yield'},
            });

            test.fail('generator func expr arg called yield', {
              code: 'function *as(){ let f = function *f(yield) {} }',
              throws: 'yield',
            });

            test('async generator func expr arg called yield', {
              code: 'function *as(){ let f = async function *f(yield) {} }',
              throws: 'yield',
            });

            test.pass('func expr arg called await', {
              code: 'function *as(){ let f = function f(await) {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async func expr arg called await', {
              code: 'function *as(){ let f = async function f(await) {} }',
              throws: 'await',
            });

            test.pass('generator func expr arg called await', {
              code: 'function *as(){ let f = function *f(await) {} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async generator func expr arg called await', {
              code: 'function *as(){ let f = async function *f(await) {} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test('class method arg called yield', {
              code: 'function *as(){ class A {f(yield) {}} }',
              throws: 'yield',
            });

            test('async class method arg called yield', {
              code: 'function *as(){ class A {async f(yield) {}} }',
              throws: 'yield',
            });

            test.fail('generator class method arg called yield', {
              code: 'function *as(){ class A {*f(yield) {}} }',
              throws: 'yield',
            });

            test.fail('async generator class method arg called yield', {
              code: 'function *as(){ class A {async *f(yield) {}} }',
              throws: 'yield',
            });

            test.pass('class method arg called await', {
              code: 'function *as(){ class A {f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async class method arg called await', {
              code: 'function *as(){ class A {async f(await) {}} }',
              throws: 'await',
            });

            test.pass('generator class method arg called await', {
              code: 'function *as(){ class A {*f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test('async generator class method arg called await', {
              code: 'function *as(){ class A {async *f(await) {}} }',
              throws: 'await',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-name x obj method', _ => {

            test.pass('obj method arg called yield', {
              code: 'function *as(){ o = {f(yield) {}} }',
              STRICT: {throws: 'yield'},
            });

            test.pass('async obj method arg called yield', {
              code: 'function *as(){ o = {async f(yield) {}} }',
              STRICT: {throws: 'yield'},
            });

            test.fail('generator obj method arg called yield', {
              code: 'function *as(){ o = {*f(yield) {}} }',
              throws: 'yield',
            });

            test.pass('async generator obj method arg called yield', {
              code: 'function *as(){ o = {async *f(yield) {}} }',
              throws: 'yield',
            });

            test.pass('obj method arg called await', {
              code: 'function *as(){ o = {f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test.fail('async obj method arg called await', {
              code: 'function *as(){ o = {async f(await) {}} }',
              throws: 'await',
            });

            test.pass('generator obj method arg called await', {
              code: 'function *as(){ o = {*f(await) {}} }',
              STRICT: {
                throws: 'await',
              },
            });

            test('async generator obj method arg called await', {
              code: 'function *as(){ o = {async *f(await) {}} }',
              throws: 'await',
            });
          });
        });

        describe('arg-default', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x decl', _ => {

            test.fail('func decl yield in arg is okay as long as the func is not a generator itself', {
              code: 'function *as(){ function f(x=yield 100) {} }',
            });

            test.fail('async func decl yield', {
              code: 'function *as(){ async function f(x=yield 100) {} }',
              desc: 'async+yield',
            });

            test.fail('generator func decl yield', {
              code: 'function *as(){ function *f(x=yield 100) {} }',
              desc:' explicitly disallowed',
            });

            test('async generator func decl yield', {
              code: 'function *as(){ async function *f(x=yield 100) {} }',
              throws: 'yield',
            });

            test.fail('func decl arg await', {
              code: 'function *as(){ function f(x=await foo) {} }',
            });

            test.fail('async func decl await', {
              code: 'function *as(){ async function f(x=await foo) {} }',
              throws: 'await',
            });

            test.fail('generator func decl await', {
              code: 'function *as(){ function *f(x=await foo) {} }',
            });

            test.fail('async generator func decl await', {
              code: 'function *as(){ async function *f(x=await foo) {} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x expr', _ => {

            test.fail('yield is okay in func arg as long as the arg is not a generator itself', {
              code: 'function *as(){ let f = function f(x=yield 100) {} }',
            });

            test.fail('async func expr yield', {
              code: 'function *as(){ let f = async function f(x=yield 100) {} }',
            });

            test.fail('generator func expr yield', {
              code: 'function *as(){ let f = function *f(x=yield 100) {} }',
            });

            test('async generator func expr yield', {
              code: 'function *as(){ let f = async function *f(x=yield 100) {} }',
              throws: 'yield',
            });

            test.fail('func expr await', {
              code: 'function *as(){ let f = function f(x=await foo) {} }',
            });

            test.fail('async func expr await', {
              code: 'function *as(){ let f = async function f(x=await foo) {} }',
              throws: 'await',
            });

            test.fail('generator func expr await', {
              code: 'function *as(){ let f = function *f(x=await foo) {} }',
            });

            test.fail('async generator func expr await', {
              code: 'function *as(){ let f = async function *f(x=await foo) {} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method yield is okay in args as long as the method is not a generator', {
              code: 'function *as(){ class A {f(x=yield 100) {}} }',
            });

            test.fail('async class method yield', {
              code: 'function *as(){ class A {async f(x=yield 100) {}} }',
            });

            test.fail('generator class method yield', {
              code: 'function *as(){ class A {*f(x=yield 100) {}} }',
            });

            test.fail('async generator class method yield', {
              code: 'function *as(){ class A {async *f(x=yield 100) {}} }',
              throws: 'yield',
            });

            test.fail('class method await', {
              code: 'function *as(){ class A {f(x=await foo) {}} }',
              throws: 'await',
            });

            test.fail('async class method await', {
              code: 'function *as(){ class A {async f(x=await foo) {}} }',
              throws: 'await',
            });

            test.fail('generator class method await', {
              code: 'function *as(){ class A {*f(x=await foo) {}} }',
            });

            test.fail('async generator class method await', {
              code: 'function *as(){ class A {async *f(x=await foo) {}} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x obj method', _ => {

            test.fail('obj method yield is okay in param if the func is not a generator itself', {
              code: 'function *as(){ o = {f(x=yield 100) {}} }',
            });

            test.fail('async obj method yield', {
              code: 'function *as(){ o = {async f(x=yield 100) {}} }',
            });

            test.fail('generator obj method yield', {
              code: 'function *as(){ o = {*f(x=yield 100) {}} }',
            });

            test.fail('async generator obj method yield', {
              code: 'function *as(){ o = {async *f(x=yield 100) {}} }',
              // only illegal in strict mode
              STRICT: {
                throws: 'yield',
              },
            });

            test.fail('obj method await', {
              code: 'function *as(){ o = {f(x=await foo) {}} }',
            });

            test.fail('async obj method await', {
              code: 'function *as(){ o = {async f(x=await foo) {}} }',
              throws: 'await',
            });

            test.fail('generator obj method await', {
              code: 'function *as(){ o = {*f(x=await foo) {}} }',
            });

            test.fail('async generator obj method await', {
              code: 'function *as(){ o = {async *f(x=await foo) {}} }',
            });
          });
        });

        describe('body', _ => {

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x decl', _ => {

            test.fail('func decl yield', {
              code: 'function *as(){ function f() { return yield 100; } }',
            });

            test.fail('async func decl yield', {
              code: 'function *as(){ async function f() { return yield 100; } }',
              desc: 'async+yield',
            });

            test.pass('generator func decl yield', {
              code: 'function *as(){ function *f() { return yield 100; } }',
            });

            test.pass('async generator func decl yield', {
              code: 'function *as(){ async function *f() { return yield 100; } }',
            });

            test.fail('func decl arg await', {
              code: 'function *as(){ function f() { return await foo; } }',
            });

            test.pass('async func decl await', {
              code: 'function *as(){ async function f() { return await foo; } }',
            });

            test.fail('generator func decl await', {
              code: 'function *as(){ function *f() { return await foo; } }',
            });

            test.pass('async generator func decl await', {
              code: 'function *as(){ async function *f() { return await foo; } }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x expr', _ => {

            test.fail('func expr yield', {
              code: 'function *as(){ let f = function f() { return yield 100; } }',
            });

            test.fail('async func expr yield', {
              code: 'function *as(){ let f = async function f() { return yield 100; } }',
            });

            test.pass('generator func expr yield', {
              code: 'function *as(){ let f = function *f() { return yield 100; } }',
            });

            test.pass('async generator func expr yield', {
              code: 'function *as(){ let f = async function *f() { return yield 100; } }',
            });

            test.fail('func expr await', {
              code: 'function *as(){ let f = function f() { return await foo; } }',
            });

            test.pass('async func expr await', {
              code: 'function *as(){ let f = async function f() { return await foo; } }',
            });

            test.fail('generator func expr await', {
              code: 'function *as(){ let f = function *f() { return await foo; } }',
            });

            test.pass('async generator func expr await', {
              code: 'function *as(){ let f = async function *f() { return await foo; } }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x class method', _ => {

            // note: classes are strict mode so `yield` is always illegal as method arg name

            test.fail('class method yield', {
              code: 'function *as(){ class A {f() { return yield 100; }} }',
            });

            test.fail('async class method yield', {
              code: 'function *as(){ class A {async f() { return yield 100; }} }',
            });

            test.pass('generator class method yield', {
              code: 'function *as(){ class A {*f() { return yield 100; }} }',
            });

            test.pass('async generator class method containing yield', {
              code: 'function *as(){ class A {async *f() { return yield 100; }} }',
            });

            test.fail('class method await', {
              code: 'function *as(){ class A {f() { return await foo; }} }',
              throws: 'await',
            });

            test.pass('async class method await', {
              code: 'function *as(){ class A {async f() { return await foo; }} }',
            });

            test.fail('generator class method await', {
              code: 'function *as(){ class A {*f() { return await foo; }} }',
              throws: 'await',
            });

            test.pass('async generator class method containing await', {
              code: 'function *as(){ class A {async *f() { return await foo; }} }',
            });
          });

          describe('global x <yield, await> x <regular, async, generator, async gen> x arg-default x obj method', _ => {

            test.fail('obj method yield', {
              code: 'function *as(){ o = {f() { return yield 100; }} }',
            });

            test.fail('async obj method yield', {
              code: 'function *as(){ o = {async f() { return yield 100; }} }',
            });

            test.pass('generator obj method yield', {
              code: 'function *as(){ o = {*f() { return yield 100; }} }',
            });

            test.pass('async generator obj method containing yield', {
              code: 'function *as(){ o = {async *f() { return yield 100; }} }',
            });

            test.fail('obj method await', {
              code: 'function *as(){ o = {f() { return await foo; }} }',
            });

            test.pass('async obj method await', {
              code: 'function *as(){ o = {async f() { return await foo; }} }',
            });

            test.fail('generator obj method await', {
              code: 'function *as(){ o = {*f() { return await foo; }} }',
            });

            test.pass('async generator obj method containing await', {
              code: 'function *as(){ o = {async *f() { return await foo; }} }',
            });
          });
        });
      });
    });

    describe('eval/args name', _ => {

      describe('decl', _ => {

        test.fail('eval in strict mode', {
          code: '"use strict"; function eval(){}',
        });

        test.fail('arguments in strict mode', {
          code: '"use strict"; function eval(){}',
        });

        test.fail('eval when function contains strict mode', {
          code: 'function eval(){ "use strict"; }',
        });

        test.fail('arguments when function contains strict mode', {
          code: 'function arguments(){ "use strict"; }',
        });
      });

      describe('expr', _ => {

        test.fail('eval in strict mode', {
          code: '"use strict"; (function eval(){})',
        });

        test.fail('arguments in strict mode', {
          code: '"use strict"; (function eval(){})',
        });

        test.fail('eval when function contains strict mode', {
          code: '(function eval(){ "use strict"; })',
        });

        test.fail('arguments when function contains strict mode', {
          code: '(function arguments(){ "use strict"; })',
        });
      });
    });

    describe('func statements', _ => {

      test('base if', {
        code: 'if (x) function f(){}',
        WEB: {
          ast: true,
          tokens: true,
        },
        STRICT: {throws: true},
      });

      test.fail('`if` always bad without web compat', {
        code: 'if (x) function f(){}',
      });

      test('base else', {
        code: 'if (x) ; else function f(){}',
        WEB: {
          ast: true,
          tokens: true,
        },
        STRICT: {throws: true},
      });

      test.fail('`else` always bad without web compat', {
        code: 'if (x) ; else function f(){}',
      });

      test('`while` always bad with web compat', {
        code: 'while (true) function f(){}',
        WEB: {throws: true},
        STRICT: {throws: true},
      });

      test.fail('`while` always bad without web compat', {
        code: 'while (true) function f(){}',
      });
    });
  });

// TODO: mirror tests for all functions (regular, expr, arrow, objlit method, class method)
// TODO: function statements not okay in ES5 strict mode but okay before/after/outside
