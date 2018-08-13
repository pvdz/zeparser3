let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('yield', _ => {
    describe('in global', _ => {
      describe('as a statement', _ => {
        test('sans arg', {
          code: 'yield',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Identifier',
                    name: 'yield',
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $ASI],
        });

        test('with arg', {
          code: 'yield x',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            desc: 'cannot be yield outside a generator so it must ASI or bail',
            throws: 'Unable to ASI',
          },
        });

        test('complex arg', {
          code: 'yield x + y',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            desc: 'cannot be yield outside a generator so it must ASI or bail',
            throws: 'Unable to ASI',
          },
        });
      });

      describe('in an expression', _ => {
        test('sans args', {
          code: '5 + yield',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'BinaryExpression',
                    left: {type: 'Literal', value: '<TODO>', raw: '5'},
                    operator: '+',
                    right: {type: 'Identifier', name: 'yield'},
                  },
                },
              ],
            },
            tokens: [$NUMBER_DEC, $PUNCTUATOR, $IDENT, $ASI],
          },
        });

        test('with args', {
          code: '5 + yield x',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'Unable to ASI',
          },
        });

        test('with complex args', {
          code: '5 + yield x + y',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'Unable to ASI',
          },
        });
      });

      describe('inside a call', _ => {
        test('sans args', {
          code: 'call(yield)',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            ast: {
              type: 'Program',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'call'},
                    arguments: [
                      {type: 'Identifier', name: 'yield'},
                    ],
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
        });

        test('with args', {
          code: 'call(yield x)',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            desc: 'cannot be yield outside a generator so it must ASI or bail',
            throws: '())',
          },
        });

        test('complex args', {
          code: 'call(yield x + y)',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            desc: 'cannot be yield outside a generator so it must ASI or bail',
            throws: '())',
          },
        });
      });
    });

    describe('inside a generator', _ => {
      describe('as a statement', _ => {
        test('sans arg', {
          code: 'function* f(){ yield; }',
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
                        argument: null,
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('with arg', {
          code: 'function* f(){ yield x; }',
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
                        argument: {type: 'Identifier', name: 'x'},
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('complex arg', {
          code: 'function* f(){ yield x + y; }',
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
                          operator: '+',
                          right: {type: 'Identifier', name: 'y'},
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('in an expression', _ => {
        test('sans args', {
          code: 'function* f(){ 5 + yield }',
          throws: 'yield',
        });

        test('with args', {
          code: 'function* f(){ 5 + yield x; }',
          throws: 'yield',
        });

        test('with complex args', {
          code: 'function* f(){ 5 + yield x + y; }',
          throws: 'yield',
        });
      });

      describe('inside a call', _ => {
        test('sans args', {
          code: 'function* f(){ call(yield); }',
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
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'call'},
                        arguments: [
                          {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: null,
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('with args', {
          code: 'function* f(){ call(yield x); }',
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
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'call'},
                        arguments: [
                          {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {type: 'Identifier', name: 'x'},
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('complex args', {
          code: 'function* f(){ call(yield x + y); }',
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
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'call'},
                        arguments: [
                          {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {
                              type: 'BinaryExpression',
                              left: {type: 'Identifier', name: 'x'},
                              operator: '+',
                              right: {type: 'Identifier', name: 'y'},
                            },
                          },
                        ],
                      },
                    },
                  ],
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
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $IDENT,
            $PUNCTUATOR,
            $IDENT,
            $PUNCTUATOR,
            $PUNCTUATOR,
            $PUNCTUATOR,
          ],
        });
      });
    });

    describe('inside a non-generator function', _ => {
      describe('as a statement', _ => {
        test('sans arg', {
          code: 'function f(){ yield; }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
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
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'Identifier',
                          name: 'yield',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('with arg', {
          code: 'function f(){ yield x; }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'unable to asi',
          },
        });

        test('complex arg', {
          code: 'function f(){ yield x + y; }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'unable to asi',
          },
        });
      });

      describe('in an expression', _ => {
        test('sans args', {
          code: 'function f(){ 5 + yield }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
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
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'BinaryExpression',
                          left: {type: 'Literal', value: '<TODO>', raw: '5'},
                          operator: '+',
                          right: {type: 'Identifier', name: 'yield'},
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });

        test('with args', {
          code: 'function f(){ 5 + yield x; }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'Unable to ASI',
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $ASI, $PUNCTUATOR],
        });

        test('with complex args', {
          code: 'function f(){ 5 + yield x + y; }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'Unable to ASI',
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
        });
      });

      describe('inside a call', _ => {
        test('sans args', {
          code: 'function f(){ call(yield); }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
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
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'CallExpression',
                          callee: {type: 'Identifier', name: 'call'},
                          arguments: [
                            {
                              type: 'Identifier',
                              name: 'yield',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('with args', {
          code: 'function f(){ call(yield x); }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: '())',
          },
        });

        test('complex args', {
          code: 'function f(){ call(yield x + y); }',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: '())',
          },
        });
      });
    });

    test('yield in assignment rhs is fine', {
      code: `function* g() { let x = yield 3; }`,
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'g'},
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {type: 'Identifier', name: 'x'},
                      init: {
                        type: 'YieldExpression',
                        delegate: false,
                        argument: {type: 'Literal', value: '<TODO>', raw: '3'},
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
      desc: 'AssignmentExpression can go into YieldExpression',
    });

    test('yielding an assignment is fine', {
      code: `function* g(x) { yield x = 3; }`,
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'g'},
            params: [{type: 'Identifier', name: 'x'}],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    delegate: false,
                    argument: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '=',
                      right: {type: 'Literal', value: '<TODO>', raw: '3'},
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
      desc: 'AssignmentExpression can go into YieldExpression',
    });

    test('yielding an assignment with yield in rhs is fine', {
      code: `function* g(x) { yield x = yield 3; }`,
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'g'},
            params: [{type: 'Identifier', name: 'x'}],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    delegate: false,
                    argument: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '=',
                      right: {
                        type: 'YieldExpression',
                        delegate: false,
                        argument: {type: 'Literal', value: '<TODO>', raw: '3'},
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
      desc: 'AssignmentExpression can go into YieldExpression',
    });

    test('yield after a non-assignment op cannot be parsed as an operator, only as var name so this throws in strict', {
      code: `function* g() { yield 3 + yield; }`,
      throws: 'yield',
      desc: 'AssignmentExpression can go into YieldExpression but not after a ConditionalExpression (which plus ends up belonging to)',
    });

    test('yield after a non-assignment op cannot be parsed as an operator, only as var name so this cant work at all', {
      code: `function* g() { yield 3 + yield 4; }`,
      throws: 'yield',
      desc: 'AssignmentExpression can go into YieldExpression but not after a ConditionalExpression (which plus ends up belonging to)',
    });

    test('yield in sloppy mode should still throw without generator', {
      code: 'async function f(){ yield a,b; }',
      throws: 'yield',
      SLOPPY_SCRIPT: {
        throws: 'Unable to ASI',
      },
      desc: '(all tests are ran 4x per input, in mixes of strict/sloppy and module/script mode)',
    });

    describe('regex edge case', _ => {
      describe('keyword', _ => {
        test('division', {
          code: 'function* f(){ yield\n/foo }',
          throws: 'Tried to apply ASI but next token starts with forward slash',
          desc: 'note: spec requires a regex after the yield identifier so a division can never happen here',
          tokens: [],
        });

        test('sans flag', {
          code: 'function* f(){ yield\n/foo/ }',
          throws: 'ASI',
          desc: 'note: yield keyword is not allowed to have a newline and is expected to be a keyword here, the forward slash on the next line prevents ASI, boom',
          tokens: [],
        });

        test('with flag', {
          code: 'function* f(){ yield\n/foo/g }',
          throws: 'ASI',
          desc: 'note: spec requires a regex after the yield identifier so a (double) division can never happen here, ASI cant be applied because of the regex, so boom',
          tokens: [],
        });
      });

      describe('legacy', _ => {
        test('division', {
          code: 'yield\n/foo',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'Tried to apply ASI but next token starts with forward slash',
          },
          desc: 'even in sloppy mode, this should not lead to a division (backwards compat breaking I guess)',
        });

        test('sans flag', {
          code: 'yield\n/foo/',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'ASI',
            desc: 'in all fairness nothing would have saved this',
          },
        });

        test('with flag', {
          code: 'yield\n/foo/g',
          throws: 'yield',
          SLOPPY_SCRIPT: {
            throws: 'ASI',
            desc: 'even in sloppy mode, this should not lead to a division (backwards compat breaking I guess)',
          },
        });
      });
    });

    describe('destructuring and ident disambiguation', _ => {

      // https://tc39.github.io/ecma262/#prod-YieldExpression
      // YieldExpression cannot be used within the FormalParameters of a generator function because any expressions that are part of FormalParameters are evaluated before the resulting generator object is in a resumable state.
      // It is a Syntax Error if UniqueFormalParameters Contains YieldExpression is true.


      // test('yield as an arg of a generator', {
      //   code: 'function *f(yield){}',
      //   desc: 'explicitly not allowed',
      //   throws: 'generator',
      // });
      //
      // test('yield as arg inside a generator', {
      //   code: 'function *f({x: x}) { function f({x: yield}) {} }',
      // });
    });

    describe('arrow func args', _ => {

      test('yield in generator in assigned group', {
        code: 'function *g() { (x = yield) = {}; }',
        desc: 'dont think this legal, babylon thinks so',
        throws: 'invalid assignment',
      });

      test('yield in generator in arrow arg default', {
        code: 'function *g() { (x = yield) => {}; }',
        throws: 'yield',
      });

      test('yield in generator in arrow arg must track assignable as well', {
        code: 'function *g() { (x = y = yield z) => {}; }',
        throws: 'yield',
      });

      test('yield in generator in group must track assignable as well', {
        code: 'function *g() { (x = y = yield z) => {}; }',
        throws: 'yield',
      });

      test('yield in generator in complex arrow arg default', {
        code: 'function *g() { (x = u + yield z) => {}; }',
        throws: 'yield',
      });

      test('yield in generator in weird group', {
        code: 'function *g() { (x = yield); }',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: true,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'g'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '=',
                      right: {type: 'YieldExpression', delegate: false, argument: null},
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });

      test('group yield as rhs sans arg', {
        code: 'function *g() { (x = x + yield); }',
        desc: 'yield inside generator is never a var',
        throws: true,
      });

      test('group yield as rhs with arg', {
        code: 'function *g() { (x = x + yield y); }',
        desc: 'yield inside generator is never a var',
        throws: true,
      });

      test('arrow yield as rhs sans arg', {
        code: 'function *g() { (x = x + yield) => x; }',
        desc: 'yield inside generator is never a var',
        throws: true,
      });

      test('arrow yield as rhs with arg', {
        code: 'function *g() { (x = x + yield y) => x; }',
        desc: 'yield inside generator is never a var',
        throws: true,
      });

      test('yield in second call arg as arrow', {
        code: 'function *g() { (x = x + foo(a, yield y)) => x; }',
        desc: 'yield inside generator is never a var and should throw in func header',
        throws: true,
      });

      test('yield in second call arg as group', {
        code: 'function *g() { (x = x + foo(a, yield y)); }',
        desc: 'yield inside generator is never a var',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: true,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'g'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '=',
                      right: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'x'},
                        operator: '+',
                        right: {
                          type: 'CallExpression',
                          callee: {type: 'Identifier', name: 'foo'},
                          arguments: [
                            {type: 'Identifier', name: 'a'},
                            {
                              type: 'YieldExpression',
                              delegate: false,
                              argument: {type: 'Identifier', name: 'y'},
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      });
    });

    test('confirm LF_NO_YIELD is properly reset with a new Expression 1', {
      code: 'function *g(){ return x + f(yield f); }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'g'},
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'x'},
                    operator: '+',
                    right: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'f'},
                      arguments: [
                        {
                          type: 'YieldExpression',
                          delegate: false,
                          argument: {type: 'Identifier', name: 'f'},
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('confirm LF_NO_YIELD is properly reset with a new Expression 2', {
      code: 'function *g(){ return x + (yield f); }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'g'},
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'x'},
                    operator: '+',
                    right: {
                      type: 'YieldExpression',
                      delegate: false,
                      argument: {type: 'Identifier', name: 'f'},
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    describe('regular func args', _ => {

      test.pass('yield in param default when function itself is not a generator', {
        code: 'function *g() { function f(x = yield) {}; }',
        STRICT: {throws: true},
      });

      test.fail('yield in generator in arrow arg must track assignable as well', {
        code: 'function *g() { function f(x = y = yield z) {}; }',
      });

      test('yield bad in generator in complex arrow arg default', {
        code: 'function *g() { (x = u + yield z) => {}; }',
        desc:' even if this was yield then it would have ot be ident because rhs of +',
        throws: 'yield',
      });

      test.pass('yield as rhs sans arg', {
        code: 'function *g() { function f(x = x + yield) {}; }',
        desc: 'yield inside generator is never a var but this state is determined by the function whose args are being parsed, not any outer function',
        STRICT: {throws: 'yield'},
      });

      test('yield as rhs with arg', {
        code: 'function *g() { function f(x = x + yield y) {}; }',
        desc: 'yield inside generator is never a var',
        throws: true,
      });

      test.fail('yield in second call arg as arrow', {
        code: 'function *g() { function f(x = x + foo(a, yield y)) {}; }',
        desc: 'yield inside generator is never a var',
      });
    });

    describe('state resetting edge cases', _ => {

      describe('yield with arg', _ => {

        describe('nested non-gen funcs inside a generator', _ => {

          test.fail('can never yield in args of nested arrow', {
            code: 'function *f(){  return (x=yield y) => x;  }',
          });

          test.fail('can yield in args of nested regular function', {
            code: 'function *f(){  return function(x=yield y) {};  }',
          });

          test.fail('can yield in args of class constructor', {
            code: 'function *f(){  class x{constructor(a=yield x){}}  }',
            STRICT: {throws: true},
          });

          test.fail('can yield in args of class method', {
            code: 'function *f(){  class x{foo(a=yield x){}}  }',
          });

          test.fail('can yield in args of object method', {
            code: 'function *f(){  x = {foo(a=yield x){}}  }',
          });
        });

        describe('nested generator funcs inside a generator', _ => {

          test.fail('can never yield in args of nested arrow', {
            code: 'function *f(){  return *(x=yield y) => x;  }',
          });

          test.fail('yield in args of nested regular function', {
            code: 'function *f(){  return function*(x=yield y) {};  }',
          });

          test.fail('yield in args of class method', {
            code: 'function *f(){  class x{*foo(a=yield x){}}  }',
          });

          test.fail('yield in args of object method', {
            code: 'function *f(){  x = {*foo(a=yield x){}}  }',
          });
        });

        describe('nested generator funcs inside a non-gen', _ => {

          test.fail('can never yield in args of nested arrow', {
            code: 'function f(){  return *(x=yield y) => x;  }',
          });

          test.fail('yield in args of nested regular function', {
            code: 'function f(){  return function*(x=yield y) {};  }',
          });

          test.fail('yield in args of class method', {
            code: 'function f(){  class x{*foo(a=yield x){}}  }',
          });

          test.fail('yield in args of object method', {
            code: 'function f(){  x = {*foo(a=yield x){}}  }',
          });
        });

        describe('nested non-gen funcs inside a non-gen', _ => {

          test.fail('can never yield in args of nested arrow', {
            code: 'function f(){  return (x=yield y) => x;  }',
          });

          test.fail('yield in args of nested regular function', {
            code: 'function f(){  return function(x=yield y) {};  }',
          });

          test.fail('yield in args of class method', {
            code: 'function f(){  class x{foo(a=yield x){}}  }',
          });

          test.fail('yield in args of object method', {
            code: 'function f(){  x = {foo(a=yield x){}}  }',
          });
        });
      });

      describe('yield without arg could be var', _ => {

        describe('nested non-gen funcs inside a generator', _ => {

          test.fail('can never yield in args of nested arrow', {
            code: 'function *f(){  return (x=yield) => x;  }',
          });

          test.pass('can yield in args of nested regular function', {
            code: 'function *f(){  return function(x=yield) {};  }',
            STRICT: {throws: true},
          });

          test.fail('can yield in args of class constructor', {
            code: 'function *f(){  class x{constructor(a=yield){}}  }',
          });

          test.fail('can yield in args of class method', {
            code: 'function *f(){  class x{foo(a=yield x){}}  }',
          });

          test.fail('can yield in args of object method', {
            code: 'function *f(){  x = {foo(a=yield x){}}  }',
          });
        });

        describe('nested generator funcs inside a generator', _ => {

          test.fail('can never yield in args of nested arrow', {
            code: 'function *f(){  return *(x=yield) => x;  }',
          });

          test.fail('yield in args of nested generator function doesnt matter', {
            code: 'function *f(){  return function*(x=yield) {};  }',
            desc: '(because only the function itsel determines whether yield can appear)',
          });

          test.fail('yield in args of class method', {
            code: 'function *f(){  class x{*foo(a=yield){}}  }',
          });

          test.fail('yield in args of object method', {
            code: 'function *f(){  x = {*foo(a=yield){}}  }',
          });
        });

        describe('nested generator funcs inside a non-gen', _ => {

          test.fail('can never yield in args of nested arrow', {
            code: 'function f(){  return *(x=yield) => x;  }',
          });

          test.fail('yield in args of nested regular function', {
            code: 'function f(){  return function*(x=yield) {};  }',
          });

          test.fail('yield in args of class method', {
            code: 'function f(){  class x{*foo(a=yield){}}  }',
          });

          test.fail('yield in args of object method', {
            code: 'function f(){  x = {*foo(a=yield){}}  }',
          });
        });

        describe('nested non-gen funcs inside a non-gen', _ => {

          test.pass('can never yield in args of nested arrow', {
            code: 'function f(){  return (x=yield) => x;  }',
            STRICT: { throws: true },
          });

          test.pass('yield in args of nested regular function', {
            code: 'function f(){  return function(x=yield) {};  }',
            STRICT: { throws: true },
          });

          test.fail('yield in args of class method', {
            code: 'function f(){  class x{foo(a=yield){}}  }',
          });

          test.pass('yield in args of object method', {
            code: 'function f(){  x = {foo(a=yield){}}  }',
            STRICT: { throws: true },
          });
        });
      });

      test.fail('cant yield in extend value of class', {
        code: 'function *f(){  class x extends yield y{}  }',
        desc: 'a yield is an "AssignmentExpression" and the rhs of `extends` is not accepting assignments',
        throws: 'yield',
      });

      test.pass('can grouped yield in extend value of class', {
        code: 'function *f(){  class x extends (yield y){}  }',
      });

      test.pass('can yield in computed name of class method', {
        code: 'function *f(){  class x{[yield foo](a){}}  }',
      });
    });

    describe('unary operators', _ => {

      describe('yield sans arg', _ => {

        // note: unary ops cannot parse into a yield expression so have to settle for a `yield`
        // as a var name which should throw inside a generator so all these tests should fail

        test.fail('delete', {
          code: 'function *f() {  return delete yield;  }',
          throws: 'yield',
        });

        test.fail('void', {
          code: 'function *f() {  return void yield;  }',
          throws: 'yield',
        });

        test.fail('typeof', {
          code: 'function *f() {  return typeof yield;  }',
          throws: 'yield',
        });

        test.fail('+', {
          code: 'fuction *f() {  return +yield;  }',
        });

        test.fail('-', {
          code: 'fuction *f() {  return -yield;  }',
        });

        test.fail('~', {
          code: 'fuction *f() {  return ~yield;  }',
        });

        test.fail('!', {
          code: 'fuction *f() {  return !yield;  }',
        });

        test.fail('++', {
          code: 'fuction *f() {  return ++yield;  }',
        });

        test.fail('--', {
          code: 'fuction *f() {  return --yield;  }',
        });

        test.fail('await', {
          code: 'fuction *f() {  return await yield;  }',
          desc: 'await requires a unary expression as arg but yield is assignment'
        });
      });

      describe('yield with arg', _ => {

        test.fail('delete', {
          code: 'function *f() {  return delete yield foo;  }',
          throws: 'yield',
        });

        test.fail('void', {
          code: 'function *f() {  return void yield foo;  }',
          throws: 'yield',
        });

        test.fail('typeof', {
          code: 'function *f() {  return typeof yield foo;  }',
          throws: 'yield',
        });

        test.fail('+', {
          code: 'fuction *f() {  return +yield foo;  }',
        });

        test.fail('-', {
          code: 'fuction *f() {  return -yield foo;  }',
        });

        test.fail('~', {
          code: 'fuction *f() {  return ~yield foo;  }',
        });

        test.fail('!', {
          code: 'fuction *f() {  return !yield foo;  }',
        });

        test.fail('++', {
          code: 'fuction *f() {  return ++yield foo;  }',
        });

        test.fail('--', {
          code: 'fuction *f() {  return --yield foo;  }',
        });

        test.fail('await', {
          code: 'fuction *f() {  return await yield foo;  }',
          desc: 'await requires a unary expression as arg but yield is assignment'
        });
      });
    });

    test('spread a yield', {
      code: 'function *g() { [...yield]; }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'g'},
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'SpreadElement',
                        argument: {type: 'YieldExpression', delegate: false, argument: null},
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('yield can be name of func expr inside generator', {
      code: 'function* g() { (function yield() {}) }',
      STRICT: {throws: true},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            expression: false,
            id: {type: 'Identifier', name: 'g'},
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: false,
                    expression: true,
                    id: {type: 'Identifier', name: 'yield'},
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI, $PUNCTUATOR],
    });

    test.fail('gen expr named yield', {
      code: 'var g = function* yield() {};',
    });

    test.pass('gen method named yield', {
      code: '({  * yield() {}  })',
    });

    test('yield in default of generator method inside generator decl', {
      code: 'function *f(){  ({*g(x=yield){}})  }',
      throws: 'yield',
    });

    test('yield in default of generator method inside generator expr', {
      code: '(function *f(){  ({*g(x=yield){}})  })',
      throws: 'yield',
    });
  });

// I don't think a yield expression can ... yield a valid assignment
// TODO: test stuff like `yield x = y` and `x = yield y = z` and `yield = x` and sloppy mode assignments etc
// yield is always a regular varname in typeof yield (similar to +) and therefor an error in strict mode
// yield's argument can be an assignment
// yield\nfoo should apply ASI
// yield\n/foo should not apply ASI, `yield` is never a statement so it's the same as (yield)/foo
// yield\n/foo/ should not apply ASI because the next line starts with forward slash (error always)
// sanity check; yield with and without argument in an expressions (the comma thing) as start/middle/end part
// test all the exceptions noted in https://tc39.github.io/ecma262/#sec-generator-function-definitions-static-semantics-early-errors
