let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR} = require('../../../src/zetokenizer');

// https://tc39.github.io/ecma262/#prod-AwaitExpression
// await is parsed as an AwaitExpression when the [Await] parameter is present. The [Await] parameter is present in the following contexts:
//  -  In an AsyncFunctionBody.
//  -  In the FormalParameters of an AsyncFunctionDeclaration and AsyncFunctionExpression. AwaitExpression in this position is a Syntax error via static semantics.
//
//  When Module is the syntactic goal symbol and the [Await] parameter is absent, await is parsed as a keyword and will be a Syntax error.
//  When Script is the syntactic goal symbol, await may be parsed as an identifier when the [Await] parameter is absent. This includes the following contexts:
//  -  Anywhere outside of an AsyncFunctionBody or FormalParameters of an AsyncFunctionDeclaration or AsyncFunctionExpression.
//  -  In the BindingIdentifier of a FunctionExpression or GeneratorExpression.
//
// Note that `async` can have no line terminator between itself and the next token when it declares a function async

module.exports = (describe, test) =>
  describe('await', _ => {
    test('simplest await', {
      code: 'async function f(){ await foo; }',
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
                    argument: {type: 'Identifier', name: 'foo'},
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('nested await', {
      code: 'async function f(){ await await foo; }',
      desc: 'await is a unaryexpression that expects a unaryexpression as arg so you can chain them',
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
                      type: 'AwaitExpression',
                      argument: {type: 'Identifier', name: 'foo'},
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('show that the non-keyword is fine here', {
      code: 'awaiting',
      ast: {
        type: 'Program',
        body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'awaiting'}}],
      },
      tokens: [$IDENT, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'await',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'await'}}],
        },
      },
      tokens: [$IDENT, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'await()',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'await'},
                arguments: [],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'await[x]',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: {type: 'Identifier', name: 'await'},
                property: {type: 'Identifier', name: 'x'},
                computed: true,
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'await = 16',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'await'},
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '16'},
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'await - 25',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'await'},
                operator: '-',
                right: {type: 'Literal', value: '<TODO>', raw: '25'},
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'call(await)',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'call'}, arguments: [{type: 'Identifier', name: 'await'}]}}],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'call(await())',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [{type: 'CallExpression', callee: {type: 'Identifier', name: 'await'}, arguments: []}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'call(await[1])',
      throws: 'await',
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
                  {
                    type: 'MemberExpression',
                    object: {type: 'Identifier', name: 'await'},
                    property: {type: 'Literal', value: '<TODO>', raw: '1'},
                    computed: true,
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('await is a valid identifier in script mode', {
      code: 'call(await.foo)',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'call'},
                arguments: [{type: 'MemberExpression', object: {type: 'Identifier', name: 'await'}, property: {type: 'Identifier', name: 'foo'}, computed: false}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('dont throw for await as param name in script mode', {
      code: 'function call(await){}',
      throws: 'Cannot use this name',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              id: {type: 'Identifier', name: 'call'},
              params: [{type: 'Identifier', name: 'await'}],
              body: {type: 'BlockStatement', body: []},
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('dont throw for await in param default value if not an actual await expression and in script mode', {
      code: 'function call(foo=await){}',
      throws: 'await',
      SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              id: {type: 'Identifier', name: 'call'},
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {type: 'Identifier', name: 'foo'},
                  right: {type: 'Identifier', name: 'await'},
                },
              ],
              body: {type: 'BlockStatement', body: []},
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('await var in an async call', {
      code: 'async(await);',
      MODULE: {throws: 'await'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'async'},
              arguments: [{type: 'Identifier', name: 'await'}],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('argless await expression in async', {
      code: 'async function f(){ async(await); }',
      throws: 'value',
    });

    test('await expression in async', {
      code: 'async function f(){ async(await x); }',
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
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'async'},
                    arguments: [
                      {
                        type: 'AwaitExpression',
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
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('can never use await expression as default arg value', {
      code: 'function call(foo=await bar){}',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41 ())', // it's by far too much effort to proc a nice message here
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('arg with default that is awaitable that is an assignment (tests assignability check of an await expr)', {
      code: 'function call(foo=await bar=10){}',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41 ())', // it's by far too much effort to proc a nice message here
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('await var name in a group', {
      code: '(await())',
      throws: 'await',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'await'},
                arguments: [],
              },
            },
          ],
        },
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      },
      tokens: [
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $NUMBER_DEC,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('something with grouping', {
      code: '(await bar())',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41 ())', // it's by far too much effort to proc a nice message here
      },
      tokens: [
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $NUMBER_DEC,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('something with rhs grouping', {
      code: '5 + (await bar())',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41 ())', // it's by far too much effort to proc a nice message here
      },
      tokens: [
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $NUMBER_DEC,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('can never use await expression as default arg value (slightly more complex)', {
      code: 'function call(foo= 5 + (await bar())){}',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41 ())', // it's by far too much effort to proc a nice message here
      },
      tokens: [
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $NUMBER_DEC,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('make failing code is inside async function, should still fail for being in parameter head', {
      code: 'async function x(){ function y(s=await foo){}}',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41 ())', // it's by far too much effort to proc a nice message here
      },
      tokens: [
        $IDENT,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
      ],
    });

    test('the async property is not inherited from parent functions', {
      code: 'async function f(){ let y = x => await x; }',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Unable to ASI',
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('using await inside the arg header of a function inside async should always fail', {
      code: 'let f = () => (y=await foo) => y;',
      throws: 'await',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41 ())', // it's by far too much effort to proc a nice message here
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('an arrow can also be async', {
      code: 'let y = async x => await x',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'y'},
                init: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {
                    type: 'AwaitExpression',
                    argument: {type: 'Identifier', name: 'x'},
                  },
                },
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $ASI],
    });

    test('await in a body of an async arrow', {
      code: 'let y = async x => { await x; }',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'y'},
                init: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: false,
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'AwaitExpression',
                          argument: {type: 'Identifier', name: 'x'},
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    describe('regex edge case is an error', _ => {
      test('sans flag', {
        code: 'async function f(){ await foo\n/foo/ }',
        desc: 'note: asi explicitly does not apply when next line starts with forward slash',
        throws: true,
      });

      test('with flag makes it a division', {
        code: 'async function f(){ await foo\n/foo/g }',
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
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'AwaitExpression',
                          argument: {type: 'Identifier', name: 'foo'},
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
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
      });
    });

    describe('unicode escape edge case', _ => {

      test('var await should throw in async', {
        code: 'async () => { var await; }',
        throws: 'await',
      });

      test('start of await classic escaped', {
        code: 'async () => { var \\u0061wait; }',
        throws: 'await',
      });

      test('start of await es6 escaped', {
        code: 'async () => { var \\u{61}wait; }',
        throws: 'await',
      });

      test('start of await label', {
        code: 'async () => { \\u{61}wait: x }',
        throws: 'await',
      });

      test('mid of await classic escaped', {
        code: 'async () => { var aw\\u0061it; }',
        throws: 'await',
      });

      test('mid of await es6 escaped', {
        code: 'async () => { var aw\\u{61}it; }',
        throws: 'await',
      });

      test('await as sneaky label in async', {
        code: 'async () => { aw\\u{61}it: x }',
        throws: 'await',
      });
    });

    test('inside a new', {
      code: 'async function f(){ new await x; }',
      desc: '`new` expects a NewExpression as arg, which is itself or a MemberExpression which can not lead to AwaitExpression',
      throws: 'new',
    });

    test.pass('newline after await in func is ok', {
      code: 'async function f(){ await \n x; }',
    });

    test.pass('newline after await in stmt header is ok', {
      code: 'async function f(){ if (await \n x) {} }',
    });

    test('new await inside array', {
      code: 'async function f(){ [new await foo] }',
      desc: '`new` expects a NewExpression as arg, which is itself or a MemberExpression which can not lead to AwaitExpression',
      throws: 'new',
    });

    test('new await inside group', {
      code: 'async function f(){ (new await foo) }',
      desc: '`new` expects a NewExpression as arg, which is itself or a MemberExpression which can not lead to AwaitExpression',
      throws: 'new',
    });

    test.pass('new await nested inside group', {
      code: 'async function f(){ new (await foo) }',
    });

    test.fail('cannot omit await arg', {
      code: 'async function f(){ await; }',
    });

    describe('await as func id', _ => {

      test.pass('plain function decl', {
        code: 'function await(){}',
        MODULE: {throws: 'await'},
      });

      test.pass('async function decl', {
        code: 'async function await(){}',
        MODULE: {throws: 'await'},
      });

      test.pass('generator function decl', {
        code: 'function *await(){}',
        MODULE: {throws: 'await'},
      });

      test.pass('async generator function decl', {
        code: 'async function *await(){}',
        MODULE: {throws: 'await'},
      });

      test.pass('plain function expr', {
        code: 'let x = function await(){}',
        MODULE: {throws: 'await'},
      });

      test('async function expr', {
        code: 'let x = async function await(){}',
        throws: 'await',
      });

      test.pass('generator function expr', {
        code: 'let x = function *await(){}',
        MODULE: {throws: 'await'},
      });

      test('async generator function expr', {
        code: 'let x = async function *await(){}',
        throws: 'await',
      });

      test.pass('plain obj method', {
        code: 'let o = {await(){}}',
      });

      test.pass('async obj method', {
        code: 'let o = {async await(){}}',
      });

      test.pass('generator obj method', {
        code: 'let o = {*await(){}}',
      });

      test.pass('async generator obj method', {
        code: 'let o = {async *await(){}}',
      });

      test.pass('plain class method', {
        code: 'class x {await(){}}',
      });

      test.pass('async class method', {
        code: 'class x {async await(){}}',
      });

      test.pass('generator class method', {
        code: 'class x {*await(){}}',
      });

      test.pass('async generator class method', {
        code: 'class x {async *await(){}}',
      });
    });

    describe('await as arg name', _ => {

      describe('non-arrow', _ => {

        test.pass('plain function decl', {
          code: 'function f(await){}',
          MODULE: {throws: 'await'},
        });

        test('async function decl', {
          code: 'async function f(await){}',
          throws: 'await',
        });

        test.pass('generator function decl', {
          code: 'function *f(await){}',
          MODULE: {throws: 'await'},
        });

        test('async generator function decl', {
          code: 'async function *f(await){}',
          throws: 'await',
        });

        test.pass('plain function expr', {
          code: 'let x = function f(await){}',
          MODULE: {throws: 'await'},
        });

        test('async function expr', {
          code: 'let x = async function f(await){}',
          throws: 'await',
        });

        test.pass('generator function expr', {
          code: 'let x = function *f(await){}',
          MODULE: {throws: 'await'},
        });

        test('async generator function expr', {
          code: 'let x = async function *f(await){}',
          throws: 'await',
        });

        test.pass('plain obj method', {
          code: 'let o = {f(await){}}',
          MODULE: {throws: 'await'},
        });

        test('async obj method', {
          code: 'let o = {async f(await){}}',
          throws: 'await',
        });

        test.pass('generator obj method', {
          code: 'let o = {*f(await){}}',
          MODULE: {throws: 'await'},
        });

        test('async generator obj method', {
          code: 'let o = {async *f(await){}}',
          throws: 'await',
        });

        test.pass('plain class method', {
          code: 'class x {f(await){}}',
          MODULE: {throws: 'await'},
        });

        test('async class method', {
          code: 'class x {async f(await){}}',
          throws: 'await',
        });

        test.pass('generator class method', {
          code: 'class x {*f(await){}}',
          MODULE: {throws: 'await'},
        });

        test('async generator class method', {
          code: 'class x {async *f(await){}}',
          throws: 'await',
        });
      });

      describe('arrow', _ => {

        test.pass('plain arrow in global', {
          code: '(await) => x',
          MODULE: {throws: 'await'},
        });

        test.fail('async arrow in global', {
          code: 'async (await) => x',
        });

        test.pass('async call in global', {
          code: 'async(await)',
          MODULE: {throws: 'await'},
        });

        test('plain arrow in async', {
          code: 'async function f(){  (await) => x  }',
          throws: 'value',
        });

        test('make sure await with arg is not accepted as arg just because the await parses now', {
          code: 'async function f(){  (await fail) => x  }',
          throws: 'destructible',
        });

        test.fail('async arrow in async', {
          code: 'async function f(){  async (await) => x  }',
        });

        test('call with await in async', {
          code: 'async function f(){  foo(await)  }',
          throws: 'value',
        });

        test.pass('plain arrow in generator', {
          code: 'function *f(){  (await) => x  }',
          MODULE: {throws: 'await'},
        });

        test.fail('async arrow in generator', {
          code: 'function *f(){  async (await) => x  }',
        });

        test.pass('call with await in generator', {
          code: 'function *f(){  foo(await)  }',
          MODULE: {throws: 'await'},
        });
      });
    });

    describe('await as arg default', _ => {

      describe('argless await', _ => {

        describe('non-arrow', _ => {

          test.pass('plain function decl', {
            code: 'function f(foo = await){}',
            MODULE: {throws: 'await'},
          });

          test('async function decl', {
            code: 'async function f(foo = await){}',
            throws: 'await',
          });

          test.pass('generator function decl', {
            code: 'function *f(foo = await){}',
            MODULE: {throws: 'await'},
          });

          test('async generator function decl', {
            code: 'async function *f(foo = await){}',
            throws: 'await',
          });

          test.pass('plain function expr', {
            code: 'let x = function f(foo = await){}',
            MODULE: {throws: 'await'},
          });

          test('async function expr', {
            code: 'let x = async function f(foo = await){}',
            throws: 'await',
          });

          test.pass('generator function expr', {
            code: 'let x = function *f(foo = await){}',
            MODULE: {throws: 'await'},
          });

          test('async generator function expr', {
            code: 'let x = async function *f(foo = await){}',
            throws: 'await',
          });

          test.pass('plain obj method', {
            code: 'let o = {f(foo = await){}}',
            MODULE: {throws: 'await'},
          });

          test('async obj method', {
            code: 'let o = {async f(foo = await){}}',
            throws: 'await',
          });

          test.pass('generator obj method', {
            code: 'let o = {*f(foo = await){}}',
            MODULE: {throws: 'await'},
          });

          test('async generator obj method', {
            code: 'let o = {async *f(foo = await){}}',
            throws: 'await',
          });

          test.pass('plain class method', {
            code: 'class x {f(foo = await){}}',
            MODULE: {throws: 'await'},
          });

          test('async class method', {
            code: 'class x {async f(foo = await){}}',
            throws: 'await',
          });

          test.pass('generator class method', {
            code: 'class x {*f(foo = await){}}',
            MODULE: {throws: 'await'},
          });

          test('async generator class method', {
            code: 'class x {async *f(foo = await){}}',
            throws: 'await',
          });
        });
      });

      describe('await with arg', _ => {

        describe('in global', _ => {

          describe('non-arrow, just an await', _ => {

            test.fail('plain function decl', {
              code: 'function f(foo = await bar){}',
            });

            test.fail('async function decl', {
              code: 'async function f(foo = await bar){}',
            });

            test.fail('generator function decl', {
              code: 'function *f(foo = await bar){}',
            });

            test.fail('async generator function decl', {
              code: 'async function *f(foo = await bar){}',
            });

            test.fail('plain function expr', {
              code: 'let x = function f(foo = await bar){}',
            });

            test.fail('async function expr', {
              code: 'let x = async function f(foo = await bar){}',
            });

            test.fail('generator function expr', {
              code: 'let x = function *f(foo = await bar){}',
            });

            test.fail('async generator function expr', {
              code: 'let x = async function *f(foo = await bar){}',
            });

            test.fail('plain obj method', {
              code: 'let o = {f(foo = await bar){}}',
            });

            test.fail('async obj method', {
              code: 'let o = {async f(foo = await bar){}}',
            });

            test.fail('generator obj method', {
              code: 'let o = {*f(foo = await bar){}}',
            });

            test.fail('async generator obj method', {
              code: 'let o = {async *f(foo = await bar){}}',
            });

            test.fail('plain class method', {
              code: 'class x {f(foo = await bar){}}',
            });

            test.fail('async class method', {
              code: 'class x {async f(foo = await bar){}}',
            });

            test.fail('generator class method', {
              code: 'class x {*f(foo = await bar){}}',
            });

            test.fail('async generator class method', {
              code: 'class x {async *f(foo = await bar){}}',
            });
          });

          describe('non-arrow, complex nested await', _ => {

            test.fail('plain function decl', {
              code: 'function f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('async function decl', {
              code: 'async function f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('generator function decl', {
              code: 'function *f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('async generator function decl', {
              code: 'async function *f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('plain function expr', {
              code: 'let x = function f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('async function expr', {
              code: 'let x = async function f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('generator function expr', {
              code: 'let x = function *f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('async generator function expr', {
              code: 'let x = async function *f(foo = [{m: t(await bar)}]){}',
            });

            test.fail('plain obj method', {
              code: 'let o = {f(foo = [{m: t(await bar)}]){}}',
            });

            test.fail('async obj method', {
              code: 'let o = {async f(foo = [{m: t(await bar)}]){}}',
            });

            test.fail('generator obj method', {
              code: 'let o = {*f(foo = [{m: t(await bar)}]){}}',
            });

            test.fail('async generator obj method', {
              code: 'let o = {async *f(foo = [{m: t(await bar)}]){}}',
            });

            test.fail('plain class method', {
              code: 'class x {f(foo = [{m: t(await bar)}]){}}',
            });

            test.fail('async class method', {
              code: 'class x {async f(foo = [{m: t(await bar)}]){}}',
            });

            test.fail('generator class method', {
              code: 'class x {*f(foo = [{m: t(await bar)}]){}}',
            });

            test.fail('async generator class method', {
              code: 'class x {async *f(foo = [{m: t(await bar)}]){}}',
            });
          });

          describe('arrow, just an await', _ => {

            test.fail('plain arrow', {
              code: '(foo = await bar) => {}',
            });

            test.fail('async arrow', {
              code: 'async (foo = await bar) => {}',
            });

            test.fail('async call', {
              code: 'async (foo = await bar);',
            });

            test.fail('destructuring obj args arrow', {
              code: '({x} = await bar) => {}',
            });

            test.fail('async destructuring obj args arrow', {
              code: 'async ({x} = await bar) => {}',
            });

            test.fail('async destructuring obj args call', {
              code: 'async ({x} = await bar);',
            });

            test.fail('destructuring arr args arrow', {
              code: '([x] = await bar) => {}',
            });

            test.fail('async destructuring arr args arrow', {
              code: 'async ([x] = await bar) => {}',
            });

            test.fail('async destructuring arr args call', {
              code: 'async ([x] = await bar);',
            });
          });

          describe('arrow, complex await', _ => {

            test.fail('plain arrow', {
              code: '(foo = [{m: 5 + t(await bar)}]) => {}',
            });

            test.fail('async arrow', {
              code: 'async (foo = [{m: 5 + t(await bar)}]) => {}',
            });

            test.fail('async call', {
              code: 'async (foo = [{m: 5 + t(await bar)}]);',
            });

            test.fail('destruct obj arrow', {
              code: '({o} = [{m: 5 + t(await bar)}]) => {}',
            });

            test.fail('async destruct obj arrow', {
              code: 'async ({o} = [{m: 5 + t(await bar)}]) => {}',
            });

            test.fail('async destruct obj call', {
              code: 'async ({o} = [{m: 5 + t(await bar)}]);',
            });

            test.fail('destruct arr arrow', {
              code: '([p] = [{m: 5 + t(await bar)}]) => {}',
            });

            test.fail('async destruct arr arrow', {
              code: 'async ([p] = [{m: 5 + t(await bar)}]) => {}',
            });

            test.fail('async destruct arr call', {
              code: 'async ([p] = [{m: 5 + t(await bar)}]);',
            });
          });
        });

        describe('in async', _ => {

          describe('non-arrow, just an await', _ => {

            test.fail('plain function decl', {
              code: 'async function g(){    function f(foo = await bar){}    }',
            });

            test.fail('async function decl', {
              code: 'async function g(){async function f(foo = await bar){}    }',
            });

            test.fail('generator function decl', {
              code: 'async function g(){function *f(foo = await bar){}    }',
            });

            test.fail('async generator function decl', {
              code: 'async function g(){async function *f(foo = await bar){}    }',
            });

            test.fail('plain function expr', {
              code: 'async function g(){let x = function f(foo = await bar){}    }',
            });

            test.fail('async function expr', {
              code: 'async function g(){let x = async function f(foo = await bar){}    }',
            });

            test.fail('generator function expr', {
              code: 'async function g(){let x = function *f(foo = await bar){}    }',
            });

            test.fail('async generator function expr', {
              code: 'async function g(){let x = async function *f(foo = await bar){}    }',
            });

            test.fail('plain obj method', {
              code: 'async function g(){let o = {f(foo = await bar){}}    }',
            });

            test.fail('async obj method', {
              code: 'async function g(){let o = {async f(foo = await bar){}}    }',
            });

            test.fail('generator obj method', {
              code: 'async function g(){let o = {*f(foo = await bar){}}    }',
            });

            test.fail('async generator obj method', {
              code: 'async function g(){let o = {async *f(foo = await bar){}}    }',
            });

            test.fail('plain class method', {
              code: 'async function g(){class x {f(foo = await bar){}}    }',
            });

            test.fail('async class method', {
              code: 'async function g(){class x {async f(foo = await bar){}}    }',
            });

            test.fail('generator class method', {
              code: 'async function g(){class x {*f(foo = await bar){}}    }',
            });

            test.fail('async generator class method', {
              code: 'async function g(){class x {async *f(foo = await bar){}}    }',
            });
          });

          describe('non-arrow, complex nested await', _ => {

            test.fail('plain function decl', {
              code: 'async function g(){    function f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('async function decl', {
              code: 'async function g(){async function f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('generator function decl', {
              code: 'async function g(){function *f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('async generator function decl', {
              code: 'async function g(){async function *f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('plain function expr', {
              code: 'async function g(){let x = function f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('async function expr', {
              code: 'async function g(){let x = async function f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('generator function expr', {
              code: 'async function g(){let x = function *f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('async generator function expr', {
              code: 'async function g(){let x = async function *f(foo = [h, {m: t(await bar)}]){}    }',
            });

            test.fail('plain obj method', {
              code: 'async function g(){let o = {f(foo = [h, {m: t(await bar)}]){}}    }',
            });

            test.fail('async obj method', {
              code: 'async function g(){let o = {async f(foo = [h, {m: t(await bar)}]){}}    }',
            });

            test.fail('generator obj method', {
              code: 'async function g(){let o = {*f(foo = [h, {m: t(await bar)}]){}}    }',
            });

            test.fail('async generator obj method', {
              code: 'async function g(){let o = {async *f(foo = [h, {m: t(await bar)}]){}}    }',
            });

            test.fail('plain class method', {
              code: 'async function g(){class x {f(foo = [h, {m: t(await bar)}]){}}    }',
            });

            test.fail('async class method', {
              code: 'async function g(){class x {async f(foo = [h, {m: t(await bar)}]){}}    }',
            });

            test.fail('generator class method', {
              code: 'async function g(){class x {*f(foo = [h, {m: t(await bar)}]){}}    }',
            });

            test.fail('async generator class method', {
              code: 'async function g(){class x {async *f(foo = [h, {m: t(await bar)}]){}}    }',
            });
          });

          describe('arrow, just an await', _ => {

            test.fail('plain arrow', {
              // https://tc39.github.io/ecma262/#sec-arrow-function-definitions-static-semantics-early-errors
              code: 'async function a(){     (foo = await bar) => {}     }',
            });

            test.fail('async arrow', {
              code: 'async function a(){     async (foo = await bar) => {}     }',
            });

            test.pass('async call', {
              code: 'async function a(){     async (foo = await bar);     }',
            });

            test.fail('destruct obj arrow', {
              code: 'async function a(){     ({r} = await bar) => {}     }',
            });

            test.fail('async destruct obj arrow', {
              code: 'async function a(){     async ({r} = await bar) => {}     }',
            });

            test.pass('async destruct obj call', {
              code: 'async function a(){     async ({r} = await bar);     }',
            });

            test.fail('destruct arr arrow', {
              code: 'async function a(){     ([v] = await bar) => {}     }',
            });

            test.fail('async destruct arr arrow', {
              code: 'async function a(){     async ([v] = await bar) => {}     }',
            });

            test.pass('async destruct arr call', {
              code: 'async function a(){     async ([v] = await bar);     }',
            });
          });

          describe('arrow, complex await', _ => {

            test.fail('plain arrow', {
              code: 'async function a(){     (foo = [{m: 5 + t(await bar)}]) => {}     }',
            });

            test.fail('async arrow', {
              code: 'async function a(){     async (foo = [{m: 5 + t(await bar)}]) => {}     }',
            });

            test.pass('async call', {
              code: 'async function a(){     async (foo = [{m: 5 + t(await bar)}]);     }',
            });

            test.fail('destruct obj arrow', {
              code: 'async function a(){     ({g} = [{m: 5 + t(await bar)}]) => {}     }',
            });

            test.fail('async destruct obj arrow', {
              code: 'async function a(){     async ({g} = [{m: 5 + t(await bar)}]) => {}     }',
            });

            test.pass('async destruct obj call', {
              code: 'async function a(){     async ({g} = [{m: 5 + t(await bar)}]);     }',
            });

            test.fail('destruct arr arrow', {
              code: 'async function a(){     ([y] = [{m: 5 + t(await bar)}]) => {}     }',
            });

            test.fail('async destruct arr arrow', {
              code: 'async function a(){     async ([y] = [{m: 5 + t(await bar)}]) => {}     }',
            });

            test.pass('async destruct arr call', {
              code: 'async function a(){     async ([y] = [{m: 5 + t(await bar)}]);     }',
            });

            test.fail('await as the property to delete', {
              code: 'async function a(){     async ([y] = delete foo[await x]) => {};     }',
            });

            test.fail('complex delete property', {
              code: 'async function a(){     async ([y] = delete ((foo[await x]))) => {};     }',
            });

            test.fail('complexer delete property', {
              code: 'async function a(){     async ([y] = delete ((((foo))[await x]))) => {};     }',
            });
          });
        });
      });
    });
  });
