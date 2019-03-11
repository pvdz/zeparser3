import {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $TICK_HEAD, $TICK_TAIL} from '../../../src/zetokenizer';

export default (describe, test) => describe('async keyword', function() {
  test('async is callable as long as it isnt the statement expression itself (group)', {
    code: 'foo, async()',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async is callable as long as it isnt the statement expression itself (arg)', {
    code: 'foo(async())',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async hack should not consume nested args when it has no args itself', {
    code: 'foo(async(), x)',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('async is callable with args', {
    code: 'foo(async(x,y,z))',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async hack shold not consume args that are part of the wrapper call', {
    code: 'foo(async(x,y,z), a, b)',
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
  });

  test('async can be just a value', {
    code: 'foo(async[x])',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('reminder to myself that dynamic property access must have at least some expression', {
    code: 'foo(async[])',
    throws: 'Expected to parse a value',
  });

  test('async is callable as long as it isnt the statement expression itself', {
    code: 'foo(async)',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('async is callable as long as it isnt the statement expression itself', {
    code: 'foo(async.foo)',
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
    throws: 'async',
  });

  test('calling async as a function (so not an async function but async as a var name)', {
    code: 'f(async ())',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('using async a regular var name instead of keyword', {
    code: 'f(async)',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('async as the arrow argument, weird but I suppose valid in SCRIPT mode', {
    code: 'f(async => x)',
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
    code: 'async: foo',
    ast: {
      type: 'Program',
      body: [
        {
          type: 'LabeledStatement',
          label: {type: 'Identifier', name: 'async'},
          body: {
            type: 'ExpressionStatement',
            expression: {type: 'Identifier', name: 'foo'},
          },
        },
      ],
    },
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('confirming that async with newline doesnt stop the identifier statement parsing', {
    code: 'async\n: foo',
    ast: {
      type: 'Program',
      body: [
        {
          type: 'LabeledStatement',
          label: {type: 'Identifier', name: 'async'},
          body: {
            type: 'ExpressionStatement',
            expression: {type: 'Identifier', name: 'foo'},
          },
        },
      ],
    },
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('async can not have line terminator after it; should throw before function decl', {
    code: 'async\nfunction f(){}',
    ast: {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {type: 'Identifier', name: 'async'},
        },
        {
          type: 'FunctionDeclaration',
          generator: false,
          async: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      ],
    },
    tokens: [$IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('async as a var name called in global', {
    code: 'async();',
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
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('async statement with newline should still be parseable as legacy expression', {
    code: 'async\n();',
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
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('async statement with newline should still be parseable as legacy expression too', {
    code: 'async\n(2);',
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
    tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('async as a var name with property access', {
    code: 'async[x];',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('async should be assignable', {
    code: 'async = 5 + 5;',
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
    tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
  });

  test('async should still parse properly wn', {
    code: 'async + 10;',
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
    tokens: [$IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
  });

  test('async var name statement that has an immediate eof', {
    code: 'async',
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
    tokens: [$IDENT, $ASI],
  });

  test('async var name expression that has an immediate eof', {
    code: 'x + async',
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
    throws: '`await` outside',
    SLOPPY_SCRIPT: {
      throws: 'Unable to ASI',
    },
  });

  test('regular async arrow let declaration without newline', {
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
                id: {type: 'Identifier', name: 'g'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            },
          ],
        },
      ],
    },
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async can not have line terminator after it; should work but not generate an async function', {
    code: 'let f = async\nfunction g(){}',
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
          id: {type: 'Identifier', name: 'g'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      ],
    },
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  });

  test('async with newline breaking an expression mid-air', {
    code: 'let f = a + b + async\nfunction g(){} + d',
    desc: 'note that `+d` after the func decl is valid because the + is also a prefix operator',
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
          id: {type: 'Identifier', name: 'g'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'UnaryExpression',
            operator: '+',
            prefix: true,
            argument: {type: 'Identifier', name: 'd'},
          },
        },
      ],
    },
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test.fail('async arrow to test ast', {
    code: 'let f = a + b + async()=>d',
    desc: 'I hope this old test wasnt important :p this is illegal because arrow is AssignmentExpression and that is not allowed to the right of +',
  });

  test('async testing ast without newline', {
    code: 'let f = a + b + async() + d',
    desc: 'this also tests operator precedent with `async()`, it should be (((a+b)+async())+d) and NOT (a+b)+(async()+d)',
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
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('async legacy ast should be same as if without the newline', {
    code: 'let f = a + b + async\n() + d',
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
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
  });

  test('async can not have line terminator after it; the await is invalid and should throw', {
    code: 'let f = async\nfunction g(){await x}',
    throws: 'await',
    SLOPPY_SCRIPT: {
      throws: 'Unable to ASI', // because `await x` requires a semi between now
    },
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async can not have line terminator after it; arrow expression wont be async', {
    code: 'let f = async\ng => g',
    desc: 'this is different from the `async (x) => x` case which would be a syntax error',
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
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });

  test.fail('async can not have line terminator after it; should throw at await because arrow expression wont be async', {
    code: 'let f = async\ng => await g',
    STRICT: {throws: 'await'},
  });

  test('async can not have line terminator after it; ', {
    code: 'let f = async\n(g) => g',
    desc: 'an error triggers for the newline once the arrow is found',
    throws: 'async',
  });

  test('not pretty but this should be legal in SCRIPT mode, `in` is edge case to single-param arrow functions', {
    code: 'async in {}',
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
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('not pretty but this should be legal in SCRIPT mode, `instanceof` is edge case to single-param arrow functions', {
    code: 'async instanceof {}',
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
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async `in` check as expression', {
    code: 'f(async in {})',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async `instanceof` check as expression', {
    code: 'f(async instanceof {})',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('async `in` check as expression for operator precedence', {
    code: 'f(a + async in b)',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('async `instanceof` check as expression for operator precedence', {
    code: 'f(a + async instanceof b)',
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
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
  });

  test('async() with dot prop', {
    code: 'log(async().foo);',
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
  });

  test('async() with dynamic prop', {
    code: 'log(async()[foo]);',
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

  describe('...', _ => {
    test('arrow with rest second', {
      code: 'async (a, ...b) => a;',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              params: [
                {type: 'Identifier', name: 'a'},
                {
                  type: 'RestElement',
                  argument: {type: 'Identifier', name: 'b'},
                },
              ],
              id: null,
              generator: false,
              async: true,
              expression: true,
              body: {type: 'Identifier', name: 'a'},
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test.fail('dots with arrow must be rest which can not have init 1', {
      code: 'async (a, ...b+b=c) => a;',
    });

    test.fail('dots with arrow must be rest which can not have init 1', {
      code: 'async (a, ...b=true) => a;',
    });

    test.fail('dots with arrow must be rest which can not have init 2', {
      code: 'async (a, ...true=b) => a;',
    });

    test('dots with arrow must be rest which can not have init 3', {
      code: 'async (a, ...b=fail) => a;',
      throws: 'not destructible',
    });

    test('call with spread second', {
      code: 'async(...a);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'async'},
              arguments: [
                {
                  type: 'SpreadElement',
                  argument: {type: 'Identifier', name: 'a'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('call spread with division', {
      code: 'async(...x/y);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'async'},
              arguments: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'x'},
                    operator: '/',
                    right: {type: 'Identifier', name: 'y'},
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('call with spread second', {
      code: 'async(a, ...b);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'async'},
              arguments: [
                {type: 'Identifier', name: 'a'},
                {
                  type: 'SpreadElement',
                  argument: {type: 'Identifier', name: 'b'},
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('call with spread first', {
      code: 'async(...a, b);',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {type: 'Identifier', name: 'async'},
              arguments: [
                {
                  type: 'SpreadElement',
                  argument: {type: 'Identifier', name: 'a'},
                },
                {type: 'Identifier', name: 'b'},
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });
  });

  describe('newline behavior', _ => {

    /*

    // always an error to have an arrow with newline after async
    async \n () => x
    foo + async \n () => x
    return async \n () => x
    break async \n () => x
    var x = async \n () => x, y
    let x = async \n () => x, y
    const x = async \n () => x, y
    export async \n () => x
    (async \n () => x)
    [async \n () => x]
    {x: async \n () => x}
    x[async \n () => x]
    x(async \n () => x)
    function f(x = async \n () => x){}
    `${async \n () => x}`
    do async \n () => x while (x);
    if (async \n () => x) x
    try {} catch(e = async \n () => x) {}   (if that's even legal)
    if (x) async \n () => x else y
    class x extends async \n () => x {}


    // "legal" other forms, though it won't create async functions
    (async \n x => x)
    (async \n function(){})

    */

    describe('statement', _ => {

      test('just a var name', {
        code: 'async',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {type: 'Identifier', name: 'async'},
            },
          ],
        },
        tokens: [$IDENT, $ASI],
      });

      test('func call sans args', {
        code: 'async()',
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
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('func call with newline sans args', {
        code: 'async \n ()',
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
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
      });

      test('func call with args', {
        code: 'async(x, y)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'async'},
                arguments: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      test('func call with newline with args', {
        code: 'async \n (x, y)',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'async'},
                arguments: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      });

      describe('regular async function', _ => {

        test('no newlines', {
          code: 'async function f(){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: true,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('newline after async', {
          code: 'async \n function f(){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'async'},
              },
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('newline after function', {
          code: 'async function \n f(){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: true,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });

        test('newline after both', {
          code: 'async \n function \n f(){}',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'async'},
              },
              {
                type: 'FunctionDeclaration',
                generator: false,
                async: false,
                id: {type: 'Identifier', name: 'f'},
                params: [],
                body: {type: 'BlockStatement', body: []},
              },
            ],
          },
          tokens: [$IDENT, $ASI, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        });
      });

      describe('regular async arrow no args', _ => {

        test('no newlines', {
          code: 'async () => {}',
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
                  expression: false,
                  body: {type: 'BlockStatement', body: []},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
        });

        test('newline after async', {
          code: 'async \n () => {}',
          throws: 'async',
        });

        test('newline after parens', {
          code: 'async () \n => {}',
          throws: 'restricted production',
        });

        test('newline after both', {
          code: 'async \n () \n => {}',
          throws: 'restricted production',
        });
      });

      describe('regular async arrow parenless arg', _ => {

        test('no newlines', {
          code: 'async x => x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('newline after async', {
          code: 'async \n x => x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {type: 'Identifier', name: 'async'},
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: false,
                  expression: true,
                  body: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('newline after param', {
          code: 'async x \n => x',
          throws: 'newline',
        });

        test('newline after both', {
          code: 'async \n x \n => x',
          throws: 'newline',
        });
      });

      describe('regular async arrow one arg', _ => {

        test('no newlines', {
          code: 'async (x) => x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('newline after async', {
          code: 'async \n (x) => x',
          throws: 'async',
        });

        test('newline after args', {
          code: 'async (x) \n => x',
          throws: 'newline',
        });

        test('newline after both', {
          code: 'async \n (x) \n => x',
          throws: 'newline',
        });
      });

      describe('regular async arrow two args', _ => {

        test('no newlines', {
          code: 'async (x, y) => x',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ArrowFunctionExpression',
                  params: [{type: 'Identifier', name: 'x'}, {type: 'Identifier', name: 'y'}],
                  id: null,
                  generator: false,
                  async: true,
                  expression: true,
                  body: {type: 'Identifier', name: 'x'},
                },
              },
            ],
          },
          tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        });

        test('newline after async', {
          code: 'async \n (x, y) => x',
          throws: 'async',
        });

        test('newline after args', {
          code: 'async (x, y) \n => x',
          throws: 'newline',
        });

        test('newline after both', {
          code: 'async \n (x, y) \n => x',
          throws: 'newline',
        });
      });

      test('make sure statement remainder is parsed after call without args', {
        code: 'async() * b',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'async'},
                  arguments: [],
                },
                operator: '*',
                right: {type: 'Identifier', name: 'b'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('sanity test to make sure this conceptually works', {
        code: 'f(a, b) * c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'f'},
                  arguments: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                },
                operator: '*',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('make sure statement remainder is parsed after call with args', {
        code: 'async(a, b) * c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'async'},
                  arguments: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                },
                operator: '*',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      test('make sure statement with newline remainder is parsed after call with args', {
        code: 'async \n (a, b) * c',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'BinaryExpression',
                left: {
                  type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'async'},
                  arguments: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}],
                },
                operator: '*',
                right: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        },
        tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
      });

      describe('asi cases', _ => {

        // test whether ASI is properly adhered to

        test('toplevel statement', {
          code: 'async \n () => x',
          throws: 'async',
        });

        test('return arg', {
          code: 'function f(){   return async \n () => x    }',
          throws: 'async',
        });

        test.fail('break undefined label', {
          code: 'break async \n () => x',
        });

        test.pass('break defined label', {
          code: 'async: for (;;) break async \n () => x',
        });

        test.fail('continue undefined label', {
          code: 'continue async \n () => x',
        });

        test.pass('continue defined label', {
          code: 'async: for (;;) continue async \n () => x',
        });

        test('var decl init with arrow', {
          code: 'var x = async \n () => x',
          throws: 'async',
        });

        test.pass('toplevel async arrow with trailing comma', {
          code: 'async () => x, y',
          desc: 'expression statement parses a sequence expression so the trailing comma is fine',
        });

        test.fail('trailing arrow comma in place where sequence expression is not allowed', {
          code: 'let x = {[async () => x, y]: z}',
          desc: 'the computed property does NOT parse a sequence and the comma is not parsed as the arrow body it causes a crash',
        });

        test('var decl init with trailing decl without', {
          code: 'var x = async () => x, y',
          desc: 'here it is not an error because the comma is part of the var decl',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'x'},
                    init: {
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: true,
                      expression: true,
                      body: {type: 'Identifier', name: 'x'},
                    },
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'y'},
                    init: null,
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test.fail('var decl init with trailing decl with', {
          code: 'var x = async \n () => x, y',
          throws: 'async',
        });

        test('let decl init with arrow', {
          code: 'let x = async \n () => x',
          throws: 'async',
        });

        test('let decl init with another decl without', {
          code: 'let x = async () => x, y',
          desc: 'it is not an error because the comma is part of the decl',
          ast: {
            type: 'Program',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'x'},
                    init: {
                      type: 'ArrowFunctionExpression',
                      params: [],
                      id: null,
                      generator: false,
                      async: true,
                      expression: true,
                      body: {type: 'Identifier', name: 'x'},
                    },
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'y'},
                    init: null,
                  },
                ],
              },
            ],
          },
          tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
        });

        test.fail('let decl init with another decl with', {
          code: 'let x = async \n () => x, y',
          throws: 'async',
        });

        test('const decl init with an arrow', {
          code: 'const x = async \n () => x',
          throws: 'async',
        });

        test.fail('const decl init with another decl without', {
          code: 'const x = async () => x, y',
          desc: 'it is an error because `() =>x, y` would be an error'
        });

        test.fail('const decl init with another decl with', {
          code: 'const x = async \n () => x, y',
          throws: 'async',
        });

        test('export decl without', {
          code: 'export async () => x',
          throws: 'Can only export async functions (not arrows)',
          SLOPPY_SCRIPT: {
            throws: 'module',
          },
        });

        test('export decl with', {
          code: 'export async \n () => x',
          throws: 'async',
          SLOPPY_SCRIPT: {
            throws: 'module',
          },
        });

        test.fail('in a group', {
          code: '(async \n () => x)',
        });

        test.fail('in an array', {
          code: '[async \n () => x]',
        });

        test.fail('in an object', {
          code: 'x={x: async \n () => x}',
        });

        test.fail('in a dynamic property name', {
          code: 'x[async \n () => x]',
        });

        test.fail('in call args', {
          code: 'x(async \n () => x)',
        });

        test.fail('function args', {
          code: 'function f(x = async \n () => x){}',
        });

        test.fail('template literal dynamic parts', {
          code: '`${async \n () => x}`',
        });

        test.fail('do statement', {
          code: 'do async \n () => x while (x);',
        });

        test.fail('if statement', {
          code: 'if (async \n () => x) x',
        });

        test.fail('while statement', {
          code: 'while (async \n () => x) x',
        });

        test.fail('for loop statement 1', {
          code: 'for (async \n () => x;;) x',
        });

        test.fail('for loop statement 2', {
          code: 'for (;async \n () => x;) x',
        });

        test.fail('for loop statement 3', {
          code: 'for (;;async \n () => x) x',
        });

        test.fail('for-in statement', {
          code: 'for (x in async \n () => x) x',
        });

        test.fail('for-of statement', {
          code: 'for (x of async \n () => x) x',
        });

        test.fail('try catch var init', {
          code: 'try {} catch(e = async \n () => x) {}',
          desc: 'okay, bad test',
        });

        test.fail('between if and else ', {
          code: 'if (x) async \n () => x else y',
        });

        test.fail('class extend value', {
          code: 'class x extends async \n () => x {}',
        });

        test.fail('with header', {
          code: 'with (async \n () => x) {}',
        });
      });
    });
  });

  test('edge case to proof that group parser must always return assignability even when async prefixed', {
    code: 'async \n (x) = y;',
    desc: 'this is invalid since this is parsed as `async(x) = y`',
    throws: true,
  });

  describe('object method', _ => {

    test('async object method good', {
      code: '({async foo() {}})',
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
                  key: {type: 'Identifier', name: 'foo'},
                  kind: 'init',
                  method: true,
                  computed: false,
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: true,
                    id: null,
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                  shorthand: false,
                },
              ],
            },
          },
        ],
      },
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test.pass('async object method with newline before async', {
      code: '({\nasync foo() {}})',
    });

    test.fail('async object method with newline after async', {
      code: '({async \n foo() {}})',
      desc: 'restricted production',
    });

    test.pass('async object method with newline after name', {
      code: '({async foo \n () {}})',
    });

    test.pass('async object method with newline after params', {
      code: '({async foo () \n {}})',
    });
  });

  describe('class method', _ => {

    test('async object method good', {
      code: 'class x {async foo() {}}',
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ClassDeclaration',
            id: {type: 'Identifier', name: 'x'},
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  key: {type: 'Identifier', name: 'foo'},
                  static: false,
                  computed: false,
                  kind: 'method',
                  value: {
                    type: 'FunctionExpression',
                    generator: false,
                    async: true,
                    id: null,
                    params: [],
                    body: {type: 'BlockStatement', body: []},
                  },
                },
              ],
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test.pass('async object method with newline before async', {
      code: 'class x {\nasync foo() {}}',
    });

    test.fail('async object method with newline after async', {
      code: 'class x {async \n foo() {}}',
      desc: 'restricted production',
    });

    test.pass('async object method with newline after name', {
      code: 'class x {async foo \n () {}}',
    });

    test.pass('async object method with newline after params', {
      code: 'class x {async foo () \n {}}',
    });
  });

  describe('introduced in es8', _ => {

    // these tests only check es7 since there is plenty of coverage for es8+ and es6 is pretty much covered by es7

    test.fail('func decl', {
      code: 'async function f(){}',
      ES: 7,
    });

    test.fail('func expr', {
      code: 'x = async function(){}',
      ES: 7,
    });

    test.fail('func named expr', {
      code: 'x = async function(){}',
      ES: 7,
    });

    test.fail('arrow no args', {
      code: 'async () => {}',
      ES: 7,
    });

    test.fail('arrow one arg', {
      code: 'async x => {}',
      ES: 7,
    });

    test.fail('arrow multiple args', {
      code: 'async (x, y) => {}',
      ES: 7,
    });

    test.pass('obj method name', {
      code: 'x = {async(){}}',
      ES: 7,
    });

    test.fail('async obj method', {
      code: 'x = {async foo(){}}',
      ES: 7,
    });

    test.fail('class async method', {
      code: 'class x {async foo(){}}',
      ES: 7,
    });

    test.pass('class method name', {
      code: 'class x {async(){}}',
      ES: 7,
    });

    test.pass('class named async', {
      code: 'class async {}',
      ES: 7,
    });

    test.pass('call', {
      code: 'async()',
      ES: 7,
    });

    test.pass('multilined call', {
      code: 'async \n ()',
      ES: 7,
    });

    test.pass('async asi ident', {
      code: 'async \n foo',
      ES: 7,
    });

    test.pass('async asi single-arg arrow', {
      code: 'async \n foo => foo',
      ES: 7,
    });

    test.fail('async asi parened arrow', {
      code: 'async \n () => x',
      desc: 'fails on the arrow since it force-parses a func call',
      ES: 7,
    });

    test.pass('async asi function', {
      code: 'async \n function f(){}',
      ES: 7,
    });

    test.pass('assign async asi function', {
      code: 'let x = async \n function f(){}',
      ES: 7,
    });

    test.pass('let async asi function', {
      code: 'let async \n function f(){}',
      ES: 7,
    });

    test.fail('async asi method', {
      code: 'x = {async \n foo(){}}',
      desc: 'still an error',
      ES: 7,
    });
  });

  test.pass('async function decl names are var bindings in global', {
    code: 'async function f() {} var f;',
    desc: 'global func decls are considered `var` in SCRIPT goal; https://tc39.github.io/ecma262/#sec-block-static-semantics-toplevellexicallydeclarednames',
    MODULE: {throws: 'bound'},
  });

  test('async function decl names are lexical bindings in block scope', {
    code: '{ async function f() {} var f; }',
    throws: 'bound',
  });

  test.pass('async function decl names are lexical bindings in function scope', {
    code: 'function g() {   async function f() {} var f;   }',
  });

  test.fail('stmt: missing function name either way without', {
    code: 'async function(){}',
  });

  test.fail('stmt: missing function name either way with', {
    code: 'async \n function(){}',
  });

  test.pass('expr: missing function name either way without', {
    code: '(async function(){})',
  });

  test.fail('expr: missing function name either way with', {
    code: '(async \n function(){})',
  });

  test.fail('restricted production in statement header', {
    code: 'if (async \n () => x) x',
  });

  test.fail('export can not just export `async` so asi not allowed for function', {
    code: 'export async \n function(){}',
    SCRIPT: {throws: 'module'},
  });

  test.fail('export can not just export `async` so asi not allowed for arrow', {
    code: 'export async \n a => b',
    SCRIPT: {throws: 'module'},
  });

  test.pass('statement async => async', {
    code: 'async => async',
  });

  test.fail('statement async \\n => async', {
    code: 'async \n => async',
    desc: 'arrow can never have newline before it, this error is unrelated to `async`',
  });

  test.pass('expr async => async', {
    code: '(async => async)',
  });

  test.fail('expr async \\n => async', {
    code: '(async \n => async)',
  });

  test.fail('let async => async', {
    code: 'let async => async',
  });

  test.fail('let async \\n => async', {
    code: 'let async \n => async',
  });

  test.fail('let f = async \\n (g) => g', {
    code: 'let f = async \n (g) => g',
  });

  test.fail('let f = async \\n (g = await foo) => g', {
    code: 'let f = async \n (g = await foo) => g',
  });

  test.fail('trailing trash', {
    code: 'async () => x, y`',
    desc: 'flow seems fine with this? logging to report it later',
  });

  test('regression: await was parsing operators when it shouldnt', {
    code: 'async function f() { let y = await x * x }',
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
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'y'},
                    init: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'AwaitExpression',
                        argument: {type: 'Identifier', name: 'x'},
                      },
                      operator: '*',
                      right: {type: 'Identifier', name: 'x'},
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR],
  });

  test.fail_strict('async call with nested await', {
    code: 'async(await);',
  });

  test.fail_strict('async call with nested await', {
    code: 'async(yield);',
  });

  test.pass('async call in generator with var', {
    code: 'function *f(){ async(x); }',
  });

  test.fail_strict('async call in generator with nested yield', {
    code: 'function *f(){ async(await); }',
  });
});
