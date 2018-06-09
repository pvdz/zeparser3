let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('async keyword', _ => {
    test('async is callable as long as it isnt the statement expression itself (group)', {
      code: 'foo, async()',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'SequenceExpression',
                expressions: [
                  {type: 'Identifier', name: 'foo'},
                  {
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'async'},
                    arguments: [],
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async is callable as long as it isnt the statement expression itself (arg)', {
      code: 'foo(async())',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [{type: 'CallExpression', callee: {type: 'Identifier', name: 'async'}, arguments: []}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async hack should not consume nested args when it has no args itself', {
      code: 'foo(async(), x)',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
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
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'async'},
                    arguments: [],
                  },
                  {type: 'Identifier', name: 'x'},
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('async is callable with args', {
      code: 'foo(async(x,y,z))',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
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
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'async'},
                    arguments: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}, {type: 'Identifier', name: 'z'}],
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async hack shold not consume args that are part of the wrapper call', {
      code: 'foo(async(x,y,z), a, b)',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
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
                    type: 'CallExpression',
                    callee: {type: 'Identifier', name: 'async'},
                    arguments: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}, {type: 'Identifier', name: 'z'}],
                  },
                  {type: 'Identifier', name: 'a'},
                  {type: 'Identifier', name: 'b'},
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
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $IDENT,
          $PUNCTUATOR,
          $ASI,
        ],
      },
    });

    test('async can be just a value', {
      code: 'foo(async[x])',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [{type: 'MemberExpression', object: {type: 'Identifier', name: 'async'}, property: {type: 'Identifier', name: 'x'}, computed: true}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('reminder to myself that dynamic property access must have at least some expression', {
      code: 'foo(async[])',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        throws: 'Expected to parse a value',
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async is callable as long as it isnt the statement expression itself', {
      code: 'foo(async)',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [{type: 'Identifier', name: 'async'}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('async is callable as long as it isnt the statement expression itself', {
      code: 'foo(async.foo)',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'foo'},
                arguments: [{type: 'MemberExpression', object: {type: 'Identifier', name: 'async'}, property: {type: 'Identifier', name: 'foo'}, computed: false}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('valid async arrow expression with parens', {
      code: 'f(async ()=>c)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'f'},
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {type: 'Identifier', name: 'c'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('valid async arrow expression with no parens', {
      code: 'f(async foo=>c)',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'f'},
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'foo'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {type: 'Identifier', name: 'c'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('valid async function expression', {
      code: 'f(async function(){})',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'f'},
              arguments: [
                {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: null,
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

    test('illegal async arrow expression with paren because of newline', {
      code: 'f(async\n()=>c)',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41',
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('illegal async arrow expression without paren because of newline', {
      code: 'f(async\nfoo=>c)',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41',
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('illegal async function expression because of newline', {
      code: 'f(async\nfunction(){})',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        throws: 'Next ord should be 41',
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('calling async as a function (so not an async function but async as a var name)', {
      code: 'f(async ())',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [{type: 'CallExpression', callee: {type: 'Identifier', name: 'async'}, arguments: []}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('using async a regular var name instead of keyword', {
      code: 'f(async)',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [{type: 'Identifier', name: 'async'}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('async as the arrow argument, weird but I suppose valid in SCRIPT mode', {
      code: 'f(async => x)',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [
                  {
                    type: 'ArrowFunctionExpression',
                    params: [{type: 'Identifier', name: 'async'}],
                    id: null,
                    generator: false,
                    async: false,
                    expression: true,
                    body: {type: 'Identifier', name: 'x'},
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('empty arrow with block body disambiguation inside template', {
      code: '`a ${async ()=>{}} b`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [],
                  id: null,
                  generator: false,
                  async: true,
                  expression: false,
                  body: {type: 'BlockStatement', body: []},
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    test('empty arrow with block body disambiguation inside template', {
      code: '`a ${async ()=>x} b`',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'TemplateLiteral',
              expressions: [
                {
                  type: 'ArrowFunctionExpression',
                  params: [],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {type: 'Identifier', name: 'x'},
                },
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
              ],
            },
          },
        ],
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
    });

    test('async can be a label type in script mode', {
      code: 'async: function f(){}',
      throws: 'cannot be used as a label',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'LabeledStatement',
              label: {type: 'Identifier', name: 'async'},
              body: {
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
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('confirming that async with newline doesnt stop the identifier statement parsing', {
      code: 'async\n: function f(){}',
      throws: 'cannot be used as a label',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'LabeledStatement',
              label: {type: 'Identifier', name: 'async'},
              body: {
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
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async can not have line terminator after it; should throw before function decl', {
      code: 'async\nfunction f(){}',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'async'}},
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
      },
      tokens: [$IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async as a var name called in global', {
      code: 'async();',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'async'},
                arguments: [],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async statement with newline should still be parseable as legacy expression', {
      code: 'async\n();',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'async'},
                arguments: [],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async statement with newline should still be parseable as legacy expression too', {
      code: 'async\n(2);',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'async'},
                arguments: [{type: 'Literal', value: '<TODO>', raw: '2'}],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async as a var name with property access', {
      code: 'async[x];',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'MemberExpression',
                object: {type: 'Identifier', name: 'async'},
                property: {type: 'Identifier', name: 'x'},
                computed: true,
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async should be assignable', {
      code: 'async = 5 + 5;',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'async'},
                operator: '=',
                right: {
                  type: 'BinaryExpression',
                  left: {type: 'Literal', value: '<TODO>', raw: '5'},
                  operator: '+',
                  right: {type: 'Literal', value: '<TODO>', raw: '5'},
                },
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('async should still parse properly wn', {
      code: 'async + 10;',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'async'},
                operator: '+',
                right: {type: 'Literal', value: '<TODO>', raw: '10'},
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('async var name statement that has an immediate eof', {
      code: 'async',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'async',
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $ASI],
    });

    test('async var name expression that has an immediate eof', {
      code: 'x + async',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'x'},
                operator: '+',
                right: {type: 'Identifier', name: 'async'},
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('async arrow statement (useless but valid?) without parens', {
      code: 'async foo => bar;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: 'foo'}],
              id: null,
              generator: false,
              async: true,
              expression: true,
              body: {type: 'Identifier', name: 'bar'},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('async arrow statement (useless but valid?) with parens and zero args', {
      code: 'async () => bar;',
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
              async: true,
              expression: true,
              body: {type: 'Identifier', name: 'bar'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('async arrow statement (useless but valid?) with parens and one arg', {
      code: 'async (foo) => bar;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [{type: 'Identifier', name: 'foo'}],
              id: null,
              generator: false,
              async: true,
              expression: true,
              body: {type: 'Identifier', name: 'bar'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('async can not have line terminator after it; the await is invalid', {
      code: 'async\nfunction f(){await x}',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        throws: 'Unable to ASI',
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('regular async arrow let statement without newline', {
      code: 'let f = async function g(){}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'f'},
                init: {
                  type: 'FunctionExpression',
                  generator: false,
                  async: true,
                  expression: false,
                  id: {type: 'Identifier', name: 'g'},
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async can not have line terminator after it; should work but not generate an async function', {
      code: 'let f = async\nfunction g(){}',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {type: 'Identifier', name: 'f'},
                  init: {type: 'Identifier', name: 'async'},
                },
              ],
            },
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'g'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('async with newline breaking an expression mid-air', {
      code: 'let f = a + b + async\nfunction g(){} + d',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {type: 'Identifier', name: 'f'},
                  init: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: 'a'},
                      operator: '+',
                      right: {type: 'Identifier', name: 'b'},
                    },
                    operator: '+',
                    right: {type: 'Identifier', name: 'async'},
                  },
                },
              ],
            },
            {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'g'},
              params: [],
              body: {
                type: 'BlockStatement',
                body: [],
              },
            },
            {type: 'ExpressionStatement', expression: {type: 'UnaryExpression', operator: '+', prefix: true, argument: {type: 'Identifier', name: 'd'}}},
          ],
        },
      },
      tokens: [
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $PUNCTUATOR,
        $IDENT,
        $ASI,
        $IDENT,
        $IDENT,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $PUNCTUATOR,
        $IDENT,
        $ASI,
      ],
    });

    test('async arrow to test ast', {
      code: 'let f = a + b + async()=>d',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {type: 'Identifier', name: 'f'},
                init: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '+',
                    right: {type: 'Identifier', name: 'b'},
                  },
                  operator: '+',
                  right: {
                    type: 'ArrowFunctionExpression',
                    params: [],
                    id: null,
                    generator: false,
                    async: true,
                    expression: true,
                    body: {type: 'Identifier', name: 'd'},
                  },
                },
              },
            ],
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('async testing ast without newline', {
      code: 'let f = a + b + async() + d',
      throws: 'must be followed by a function',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {type: 'Identifier', name: 'f'},
                  init: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'a'},
                        operator: '+',
                        right: {type: 'Identifier', name: 'b'},
                      },
                      operator: '+',
                      right: {type: 'CallExpression', callee: {type: 'Identifier', name: 'async'}, arguments: []},
                    },
                    operator: '+',
                    right: {type: 'Identifier', name: 'd'},
                  },
                },
              ],
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('async legacy ast should be same as if without the newline', {
      code: 'let f = a + b + async\n() + d',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {type: 'Identifier', name: 'f'},
                  init: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {type: 'Identifier', name: 'a'},
                        operator: '+',
                        right: {type: 'Identifier', name: 'b'},
                      },
                      operator: '+',
                      right: {type: 'CallExpression', callee: {type: 'Identifier', name: 'async'}, arguments: []},
                    },
                    operator: '+',
                    right: {type: 'Identifier', name: 'd'},
                  },
                },
              ],
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('async can not have line terminator after it; the await is invalid and should throw', {
      code: 'let f = async\nfunction g(){await x}',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        throws: 'Unable to ASI', // because `await x` requires a semi between now
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async can not have line terminator after it; arrow expression wont be async', {
      code: 'let f = async\ng => g',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {type: 'Identifier', name: 'f'},
                  init: {type: 'Identifier', name: 'async'},
                },
              ],
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                params: [{type: 'Identifier', name: 'g'}],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'g'},
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('async can not have line terminator after it; should throw at await because arrow expression wont be async', {
      code: 'let f = async\ng => await g',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        throws: 'Unable to ASI', // because `await g` is illegal, it espects a semi
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async can not have line terminator after it; SCRIPT mode will throw after pasing the `async()` as a regular call', {
      code: 'let f = async\n(g) => g',
      throws: 'cannot be followed by a newline',
      SLOPPY_SCRIPT: {
        throws: 'Unable to ASI', // this one is ugly, but the problem occurs after parsing `let f=async()` at the arrow
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('not pretty but this should be legal in SCRIPT mode, `in` is edge case to single-param arrow functions', {
      code: 'async in {}',
      throws: 'cannot be followed by',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'async'},
                operator: 'in',
                right: {type: 'ObjectExpression', properties: []},
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('not pretty but this should be legal in SCRIPT mode, `instanceof` is edge case to single-param arrow functions', {
      code: 'async instanceof {}',
      throws: 'cannot be followed by',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'async'},
                operator: 'instanceof',
                right: {type: 'ObjectExpression', properties: []},
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async `in` check as expression', {
      code: 'f(async in {})',
      throws: 'cannot be followed by',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [
                  {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'async'},
                    operator: 'in',
                    right: {type: 'ObjectExpression', properties: []},
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async `instanceof` check as expression', {
      code: 'f(async instanceof {})',
      throws: 'cannot be followed by',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [
                  {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'async'},
                    operator: 'instanceof',
                    right: {type: 'ObjectExpression', properties: []},
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('async `in` check as expression for operator precedence', {
      code: 'f(a + async in b)',
      throws: 'cannot be followed by',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [
                  {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: 'a'},
                      operator: '+',
                      right: {type: 'Identifier', name: 'async'},
                    },
                    operator: 'in',
                    right: {type: 'Identifier', name: 'b'},
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('async `instanceof` check as expression for operator precedence', {
      code: 'f(a + async instanceof b)',
      throws: 'cannot be followed by',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'f'},
                arguments: [
                  {
                    type: 'BinaryExpression',
                    left: {
                      type: 'BinaryExpression',
                      left: {type: 'Identifier', name: 'a'},
                      operator: '+',
                      right: {type: 'Identifier', name: 'async'},
                    },
                    operator: 'instanceof',
                    right: {type: 'Identifier', name: 'b'},
                  },
                ],
              },
            },
          ],
        },
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('async() with dot prop', {
      code: 'log(async().foo);',
      throws: 'The `async` identifier is a keyword',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'log'},
                arguments: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'async'},
                      arguments: [],
                    },
                    property: {type: 'Identifier', name: 'foo'},
                    computed: false,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
    });

    test('async() with dynamic prop', {
      code: 'log(async()[foo]);',
      throws: 'The `async` identifier is a keyword',
      SLOPPY_SCRIPT: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'log'},
                arguments: [
                  {
                    type: 'MemberExpression',
                    object: {
                      type: 'CallExpression',
                      callee: {type: 'Identifier', name: 'async'},
                      arguments: [],
                    },
                    property: {type: 'Identifier', name: 'foo'},
                    computed: true,
                  },
                ],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
    });

    test('arrow as expression', {
      code: 'foo(async () => foo)',
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
                  type: 'ArrowFunctionExpression',
                  params: [],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {type: 'Identifier', name: 'foo'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('export an async arrow', {
      code: 'export default async (x) => y',
      throws: 'module goal',
      MODULE: {
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExportDefaultDeclaration',
              declaration: {
                type: 'ArrowFunctionExpression',
                params: [{type: 'Identifier', name: 'x'}],
                id: null,
                generator: false,
                async: true,
                expression: true,
                body: {type: 'Identifier', name: 'y'},
              },
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      },
    });
  });
