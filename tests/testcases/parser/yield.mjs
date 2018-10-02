import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) =>
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

    describe('arguments checks', _ => {

      describe('arrow func args inside generator', _ => {

        test.fail('as assignment target', {
          code: 'function *g() { yield = {}; }',
        });

        test('in assigned group', {
          code: 'function *g() { (x = yield) = {}; }',
          throws: 'invalid assignment',
        });

        test.fail('as parenless arg name', {
          code: 'function *g() { yield => {}; }',
        });

        test('in arrow arg default', {
          code: 'function *g() { (x = yield) => {}; }',
          throws: 'yield',
        });

        test.fail('in arrow arg must track assignable as well', {
          code: 'function *g() { (x = y = yield z) => {}; }',
        });

        test.pass('in group must track assignable as well', {
          code: 'function *g() { (x = y = yield z) }',
        });

        test('in complex arrow arg default', {
          code: 'function *g() { (x = u + yield z) => {}; }',
          throws: 'yield',
        });

        test('in weird group', {
          code: 'function *g() { (x = yield); }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: true,
                async: false,
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

        test.pass('yield in second call arg as group', {
          code: 'function *g() { (x = x + foo(a, yield y)); }',
          desc: 'should be fine in group',
        });

        test.pass('argless yield in computed property in group', {
          code: 'function *g(){ (x = {[yield]: 1}) }',
        });

        test.pass('arged yield in computed property in group', {
          code: 'function *g(){ (x = {[yield y]: 1}) }',
        });

        test('argless yield in computed property in arrow arg default', {
          code: 'function *g(){ (x = {[yield]: 1}) => z }',
          throws: 'yield',
        });

        test('arged yield in computed property in arrow arg default', {
          code: 'function *g(){ (x = {[yield y]: 1}) => z }',
          throws: 'yield',
        });

        test.pass('argless yield in array in group', {
          code: 'function *g(){ (x = [yield]) }',
        });

        test.pass('arged yield in array in group', {
          code: 'function *g(){ (x = [yield y]) }',
        });

        test('argless yield in array in arrow arg default', {
          code: 'function *g(){ (x = [yield]) => z }',
          throws: 'yield',
        });

        test('arged yield in array in arrow arg default', {
          code: 'function *g(){ (x = [yield y]) => z }',
          throws: 'yield',
        });
      });

      describe('arrow func args in block scope', _ => {

        test('as assignment target', {
          code: '{ yield = {}; }',
          STRICT: {throws: 'strict mode'},
          ast: {
            type: 'Program',
            body: [
              {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'yield'},
                      operator: '=',
                      right: {type: 'ObjectExpression', properties: []},
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test.fail('babel case', {
          code: '(x = x) = x;',
          desc: 'assignments are not assignable and as such a wrapped assignment cannot be assigned to; almost all parsers allowed this though and babel considered the inner assignment a Pattern',
        });

        test.fail('blocked in assigned group', {
          code: '{ (x = yield) = {}; }',
          desc: 'assignments are not assignable and as such a wrapped assignment cannot be assigned to',
        });

        test.pass('as parenless arg name', {
          code: '{ yield => {}; }',
          STRICT: {throws: 'strict mode'},
        });

        test.pass('in arrow arg default', {
          code: '{ (x = yield) => {}; }',
          STRICT: {throws: 'strict mode'},
        });

        test.fail('in arrow arg must track assignable as well', {
          code: '{ (x = y = yield z) => {}; }',
        });

        test.fail('in group must track assignable as well', {
          code: '{ (x = y = yield z); }',
        });

        test.fail('in complex arrow arg default', {
          code: '{ (x = u + yield z) => {}; }',
        });

        test('in weird group', {
          code: '{ (x = yield); }',
          STRICT: {throws: 'strict mode'},
          ast: {
            type: 'Program',
            body: [
              {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'x'},
                      operator: '=',
                      right: {type: 'Identifier', name: 'yield'},
                    },
                  },
                ],
              },
            ],
          },
          tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test.pass('group yield as rhs sans arg', {
          code: '{ (x = x + yield); }',
          desc: 'yield inside generator is never a var',
          STRICT: {throws: 'strict mode'},
        });

        test('group yield as rhs with arg', {
          code: '{ (x = x + yield y); }',
          desc: 'yield inside generator is never a var',
          throws: true,
        });

        test.pass('arrow yield as rhs sans arg', {
          code: '{ (x = x + yield) => x; }',
          desc: 'yield inside generator is never a var',
          STRICT: {throws: 'strict mode'},
        });

        test('arrow yield as rhs with arg', {
          code: '{ (x = x + yield y) => x; }',
          desc: 'yield inside generator is never a var',
          throws: true,
        });

        test('yield in second call arg as arrow', {
          code: '{ (x = x + foo(a, yield y)) => x; }',
          desc: 'yield inside generator is never a var and should throw in func header',
          throws: true,
        });

        test.pass('yield in second call arg as group', {
          code: '{ (x = x + foo(a, yield y)); }',
          desc: 'should be fine in group',
          throws: true,
        });

        test.pass('argless yield in computed property in group', {
          code: '{ (x = {[yield]: 1}) }',
          STRICT: {throws: 'strict mode'},
        });

        test.fail('arged yield in computed property in group', {
          code: '{ (x = {[yield y]: 1}) }',
        });

        test.pass('argless yield in computed property in arrow arg default', {
          code: '{ (x = {[yield]: 1}) => z }',
          STRICT: {throws: 'strict mode'},
        });

        test.fail('arged yield in computed property in arrow arg default', {
          code: '{ (x = {[yield y]: 1}) => z }',
        });

        test.pass('argless yield in array in group', {
          code: '{ (x = [yield]) }',
          STRICT: {throws: 'strict mode'},
        });

        test.fail('arged yield in array in group', {
          code: '{ (x = [yield y]) }',
        });

        test.pass('argless yield in array in arrow arg default', {
          code: '{ (x = [yield]) => z }',
          STRICT: {throws: 'strict mode'},
        });

        test.fail('arged yield in array in arrow arg default', {
          code: '{ (x = [yield y]) => z }',
        });
      });

      describe('async arrow func args', _ => {

        test.fail('as assignment target', {
          code: 'function *g() { async yield = {}; }',
        });

        test.fail('in assigned group', {
          code: 'function *g() { async (x = yield) = {}; }',
        });

        test('as parenless arg name', {
          code: 'function *g() { async yield => {}; }',
          throws: 'yield',
        });

        test('in arrow arg default', {
          code: 'function *g() { async (x = yield) => {}; }',
          throws: 'yield',
        });

        test('in arrow arg must track assignable as well', {
          code: 'function *g() { async (x = y = yield z) => {}; }',
          throws: 'yield',
        });

        test('in group must track assignable as well', {
          code: 'function *g() { async (x = y = yield z) => {}; }',
          throws: 'yield',
        });

        test('in complex arrow arg default', {
          code: 'function *g() { async (x = u + yield z) => {}; }',
          throws: 'yield',
        });

        test('in weird group', {
          code: 'function *g() { async (x = yield); }',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: true,
                async: false,
                id: {type: 'Identifier', name: 'g'},
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'CallExpression',
                        callee: {type: 'Identifier', name: 'async'},
                        arguments: [
                          {
                            type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'x'},
                            operator: '=',
                            right: {type: 'YieldExpression', delegate: false, argument: null},
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('group yield as rhs sans arg', {
          code: 'function *g() { async (x = x + yield); }',
          desc: 'yield inside generator is never a var',
          throws: true,
        });

        test('group yield as rhs with arg', {
          code: 'function *g() { async (x = x + yield y); }',
          desc: 'yield inside generator is never a var',
          throws: true,
        });

        test('arrow yield as rhs sans arg', {
          code: 'function *g() { async (x = x + yield) => x; }',
          desc: 'yield inside generator is never a var',
          throws: true,
        });

        test('arrow yield as rhs with arg', {
          code: 'function *g() { async (x = x + yield y) => x; }',
          desc: 'yield inside generator is never a var',
          throws: true,
        });

        test('yield in second call arg as arrow', {
          code: 'function *g() { async (x = x + foo(a, yield y)) => x; }',
          desc: 'yield inside generator is never a var and should throw in func header',
          throws: true,
        });

        test.pass('yield in second call arg as group', {
          code: 'function *g() { async (x = x + foo(a, yield y)); }',
          desc: 'should be fine in group',
        });

        test.pass('argless yield in computed property in group', {
          code: 'function *g(){ async (x = {[yield]: 1}) }',
        });

        test.pass('arged yield in computed property in group', {
          code: 'function *g(){ async (x = {[yield y]: 1}) }',
        });

        test('argless yield in computed property in arrow arg default', {
          code: 'function *g(){ async (x = {[yield]: 1}) => z }',
          throws: 'yield',
        });

        test('arged yield in computed property in arrow arg default', {
          code: 'function *g(){ async (x = {[yield y]: 1}) => z }',
          throws: 'yield',
        });

        test.pass('argless yield in array in group', {
          code: 'function *g(){ async (x = [yield]) }',
        });

        test.pass('arged yield in array in group', {
          code: 'function *g(){ async (x = [yield y]) }',
        });

        test('argless yield in array in arrow arg default', {
          code: 'function *g(){ async (x = [yield]) => z }',
          throws: 'yield',
        });

        test('arged yield in array in arrow arg default', {
          code: 'function *g(){ async (x = [yield y]) => z }',
          throws: 'yield',
        });
      });

      describe('more arg checks', _ => {

        // https://tc39.github.io/ecma262/#prod-YieldExpression
        // YieldExpression cannot be used within the FormalParameters of a generator function because any expressions that are part of FormalParameters are evaluated before the resulting generator object is in a resumable state.
        // It is a Syntax Error if UniqueFormalParameters Contains YieldExpression is true.

        test.fail('yield as an arg of a generator', {
          code: 'function *f(yield){}',
          desc: 'explicitly not allowed',
        });

        test.pass('yield as arg inside a generator', {
          code: 'function *f({x: x}) { function f({x: yield}) {} }',
          desc: 'the inner function resets the state',
          STRICT: {throws: true},
        });

        test.pass('yield var legal in async arrow arg default', {
          code: 'async (x = yield) => {}',
          desc: 'allowed because the AsyncArrowHead prod uses ArrowFormalParameters [~Yield, +Await], meaning `_no_await` but yield is fine',
          STRICT: {throws: true},
        });

        test.pass('yield var legal in async call', {
          code: 'async (yield)',
          STRICT: {throws: true},
        });

        test.pass('yield var legal in async assignment call', {
          code: 'async (x = yield)',
          STRICT: {throws: true},
        });

        test.fail('yield expr illegal in async call', {
          code: 'async (yield x)',
        });

        test.fail('yield expr illegal in async assignment call', {
          code: 'async (x = yield y)',
        });

        test.pass('grouped yield var legal in arrow arg default', {
          code: 'async (x = (yield)) => {}',
          STRICT: {throws: true},
        });

        test.pass('assigned yield var legal in arrow arg default', {
          code: 'async (x = z = yield) => {}',
          STRICT: {throws: true},
        });

        test.fail('no arg yield expr is in arrow arg default', {
          code: 'function *f(){ async (x = yield) => {} }',
        });

        test.fail('arged yield expr is illegal in arrow arg default', {
          code: 'function *f(){ async (x = yield y) => {} }',
        });

        test.fail('grouped no arg yield expr is illegal in arrow arg default', {
          code: 'function *f(){ async (x = (yield)) => {} }',
        });

        test.fail('grouped arged yield expr is illegal in arrow arg default', {
          code: 'function *f(){ async (x = (yield y)) => {} }',
        });

        test.fail('assigned no arg yield expr is illegal in arrow arg default', {
          code: 'function *f(){ async (x = z = yield) => {} }',
        });

        test.fail('assigned arged yield expr is illegal in arrow arg default', {
          code: 'function *f(){ async (x = z = yield y) => {} }',
        });

        test.fail('yield expr illegal in async arrow arg default', {
          code: 'async (x = yield y) => {}',
        });

        test.fail('grouped yield expr illegal in arrow arg default', {
          code: 'async (x = (yield x)) => {}',
        });

        test.fail('grouped yield expr illegal in async call', {
          code: 'async (x = (yield x))',
        });

        test.pass('assigned yield var legal in async call', {
          code: 'async (x = z = yield)',
          STRICT: {throws: true},
        });

        test.pass('no arg yield expr in async call', {
          code: 'function *f(){ async (yield) }',
        });

        test.pass('no arg yield expr in async assignment call', {
          code: 'function *f(){ async (x = yield) }',
        });

        test.pass('arged yield expr in async assignment call', {
          code: 'function *f(){ async (x = yield y) }',
        });

        test.pass('regression', {
          code: 'iter = yield();',
          STRICT: {throws: true},
        });
      });
    });

    test('confirm LF_NO_YIELD is properly reset with an Expression 1', {
      code: 'function *g(){ return x + f(yield f); }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
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

    test('confirm LF_NO_YIELD is properly reset with an Expression 2', {
      code: 'function *g(){ return x + (yield f); }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
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

    test.fail_strict('func expr inherits yieldable from itself so parent scope is irrelevant and yield is okay in sloppy', {
      code: 'function* g() { (function yield() {}) }',
    });

    test.fail('gen expr named yield is okay in sloppy', {
      code: 'var g = function* yield() {};',
      desc: 'there is an extensive suite for these cases in the yield test file',
    });

    test.pass('gen method named yield', {
      code: '({  * yield() {}  })',
      desc: 'there is an extensive suite for these cases in the yield test file',
    });

    test('yield in default of generator method inside generator decl', {
      code: 'function *f(){  ({*g(x=yield){}})  }',
      throws: 'yield',
    });

    test('yield in default of generator method inside generator expr', {
      code: '(function *f(){  ({*g(x=yield){}})  })',
      throws: 'yield',
    });

    test('parse in all parts of ternary', {
      code: 'function *f() { (yield 1) ? yield 2 : yield 3; }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            id: {type: 'Identifier', name: 'f'},
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ConditionalExpression',
                    test: {
                      type: 'YieldExpression',
                      delegate: false,
                      argument: {type: 'Literal', value: '<TODO>', raw: '1'},
                    },
                    consequent: {
                      type: 'YieldExpression',
                      delegate: false,
                      argument: {type: 'Literal', value: '<TODO>', raw: '2'},
                    },
                    alternate: {
                      type: 'YieldExpression',
                      delegate: false,
                      argument: {type: 'Literal', value: '<TODO>', raw: '3'},
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('parse with arg head of ternary (should put ternary as arg of yield entirely)', {
      code: 'function *f() { yield 1 ? 2 : 3; }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
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
                      type: 'ConditionalExpression',
                      test: {type: 'Literal', value: '<TODO>', raw: '1'},
                      consequent: {type: 'Literal', value: '<TODO>', raw: '2'},
                      alternate: {type: 'Literal', value: '<TODO>', raw: '3'},
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    test.pass('parse with arg head of ternary', {
      code: 'function *f() { 1 ? yield 2 : 3; }',
    });

    test.pass('parse with arg tail of ternary', {
      code: 'function *f() { 1 ? 2 : yield 3; }',
    });

    test.fail('parse in all parts of ternary', {
      code: 'function *f() { yield ? yield : yield ; }',
    });

    test.fail('parse in head of ternary', {
      code: 'function *f() { yield ? 1 : 1 ; }',
    });

    test.pass('parse in body of ternary', {
      code: 'function *f() { 1 ? yield : 1 ; }',
    });

    test.pass('parse in tail of ternary', {
      code: 'function *f() { 1 ? 1 : yield ; }',
    });

    test('arg-less yield inside group', {
      code: '({ *g1() {   (yield)  }})',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'g1'},
                  kind: 'init',
                  method: true,
                  computed: false,
                  value: {
                    type: 'FunctionExpression',
                    generator: true,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {type: 'YieldExpression', delegate: false, argument: null},
                        },
                      ],
                    },
                  },
                  shorthand: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('arg-full yield inside group', {
      code: '({ *g1() {   (yield 1)  }})',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {type: 'Identifier', name: 'g1'},
                  kind: 'init',
                  method: true,
                  computed: false,
                  value: {
                    type: 'FunctionExpression',
                    generator: true,
                    async: false,
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {type: 'Literal', value: '<TODO>', raw: '1'},
                          },
                        },
                      ],
                    },
                  },
                  shorthand: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $ASI, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test.fail_strict('yield as shorthand array destruct assign in global', {
      code: '([yield] = x)',
      desc: 'in sloppy this is fine',
    });

    test.fail_strict('yield as shorthand in array pattern in arrow in global', {
      code: '([yield]) => x',
      desc: 'in sloppy this is fine',
    });

    test.fail_strict('yield as shorthand in array lit in global', {
      code: '([yield])',
      desc: 'in sloppy this is fine',
    });

    test.pass('arg-less yield inside array', {
      code: '({ *g1() {   [yield]  }})',
    });

    test.pass('arg-full yield inside array', {
      code: '({ *g1() {   [yield 1]  }})',
    });

    test.fail_strict('yield as shorthand object destruct assign in global', {
      code: '({yield} = x)',
      desc: 'in sloppy this is fine',
    });

    test.fail_strict('yield as shorthand in object pattern in arrow in global', {
      code: '({yield}) => x',
      desc: 'in sloppy this is fine',
    });

    test.fail_strict('yield as shorthand in object lit in global', {
      code: '({yield})',
      desc: 'in sloppy this is fine',
    });

    test.fail('yield as shorthand in generator', {
      code: '({ *g1() {   return {yield}  }})',
      desc: 'fails because yield is not allowed to be a var name inside a generator and a shorthand kind of is both',
    });

    test.pass('arg-less yield inside object', {
      code: '({ *g1() {   return {x: yield}  }})',
    });

    test.pass('arg-full yield inside object', {
      code: '({ *g1() {   return {x: yield 1}  }})',
    });

    test('yield spread yield yield no comma', {
      code: 'function *g() {yield {     ...yield yield    };}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            id: {type: 'Identifier', name: 'g'},
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
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {type: 'YieldExpression', delegate: false, argument: null},
                          },
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('spread yield yield no comma', {
      code: 'function *g() {x={     ...yield yield    };}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
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
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {type: 'YieldExpression', delegate: false, argument: null},
                          },
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('spread yield comma', {
      code: 'function *g() {x={     ...yield,    };}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
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
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {type: 'YieldExpression', delegate: false, argument: null},
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('spread yield x comma', {
      code: 'function *g() {x={     ...yield x,    };}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
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
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {type: 'Identifier', name: 'x'},
                          },
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('spread yield yield comma', {
      code: 'function *g() {x={     ...yield yield,    };}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
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
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {type: 'YieldExpression', delegate: false, argument: null},
                          },
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('spread yield yield comma', {
      code: 'function *g() {yield {     ...yield yield,    };}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            id: {type: 'Identifier', name: 'g'},
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
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'YieldExpression',
                            delegate: false,
                            argument: {type: 'YieldExpression', delegate: false, argument: null},
                          },
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    // test('dinges', {
    //   code: 'function *g() { yield {...(x),}}',
    // });

    test('dinges', {
      code: 'function *g() { yield {...(x,y),}}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            generator: true,
            async: false,
            id: {type: 'Identifier', name: 'g'},
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
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'SequenceExpression',
                            expressions: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                          },
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI, $PUNCTUATOR],
    });

    test.fail('new arg with yield ag', {
      code: 'function *g() { new yield foo}',
    });

    test.fail('new arg without yield ag', {
      code: 'function *g() { new yield }',
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
//
// +if script mode, these should all work:
//   +- `(yield)`
//   +- `(yield = x)`
//   +- `(x = yield)`
//   +- `(x = yield = x)`
//   +- `yield`
//   +- `yield = x`
//   +- `([yield])`
//   +- `(x = a + yield)`
//   +- `([x = yield])`
//   +- `([x, {y: [yield]}] = z)`
//   +- `([x, {y: [yield]}])`
//   +And these should all fail:
//   +- `(yield) => x`
//   +- `(yield = x) => x`
//   +- `(x = yield) => x`
//   +- `(x = yield = x) => x`
//   +- `yield => x`
//   +- `([yield]) => x`
//   +- `([x = yield]) => x`
//   +- `([x = yield y]) => x`
//   +- `([x, {y: [yield]}]) => x`
