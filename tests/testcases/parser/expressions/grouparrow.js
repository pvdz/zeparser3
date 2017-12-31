let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $REGEX,
  $STRING_DOUBLE,
  $TICK_HEAD,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('parens', _ => {

  describe('group', _ => {
    
    test('silly group',{
      code: '(x);',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('silly double group',{
      code: '((x));',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
      ]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('oh come on',{
      code: '((((((((((x))))))))));',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
      ]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('group of two vars',{
      code: '(a, b);',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ]}},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('group of some simple values',{
      code: '(a, 1, "c", d, e, f);',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'Literal', value: '<TODO>', raw: '1'},
          {type: 'Literal', value: '<TODO>', raw: '"c"'},
          {type: 'Identifier', name: 'd'},
          {type: 'Identifier', name: 'e'},
          {type: 'Identifier', name: 'f'},
        ]}},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('group of some two assignments',{
      code: '(a = 1, b = 2);',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
          {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'a'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '1'}},
          {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'b'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '2'}},
        ]}},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('assignment to a wrapped identifier, silly but valid',{
      // https://tc39.github.io/ecma262/#sec-semantics-static-semantics-isvalidsimpleassignmenttarget
      code: '(a) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '=',
          right: {type: 'Literal', value: '<TODO>', raw: '1'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('assignment to a wrapped property, silly but valid',{
      code: '(a.b) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
          operator: '=',
          right: {type: 'Literal', value: '<TODO>', raw: '1'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('assignment to a wrapped property, silly but valid',{
      code: '(a[b]) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
          operator: '=',
          right: {type: 'Literal', value: '<TODO>', raw: '1'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('assignment to a wrapped complex value that ends in a property, silly but valid',{
      code: '(a.b().c().d) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'MemberExpression',
              object: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {type: 'Identifier', name: 'a'},
                      property: {type: 'Identifier', name: 'b'},
                      computed: false,
                    },
                    arguments: [],
                  },
                  property: {type: 'Identifier', name: 'c'},
                  computed: false,
                },
                arguments: [],
              },
              property: {type: 'Identifier', name: 'd'},
              computed: false,
            },
            operator: '=',
            right: {type: 'Literal', value: '<TODO>', raw: '1'},
          },
        },
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('assignment to a wrapped super property, silly but valid',{
      code: '(super.a) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression:
          {type: 'AssignmentExpression',
            left: {type: 'MemberExpression',
              object: {type: 'Super'},
              property: {type: 'Identifier', name: 'a'},
              computed: false,
            },
            operator: '=',
            right: {type: 'Literal', value: '<TODO>', raw: '1'},
          },
        },
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('assignment to a wrapped super property, silly but valid',{
      code: '(super[a]) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'MemberExpression',
              object: {type: 'Super'},
              property: {type: 'Identifier', name: 'a'},
              computed: true,
            },
            operator: '=',
            right: {type: 'Literal', value: '<TODO>', raw: '1'},
          },
        },
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('assignment to a wrapped this property, silly but valid',{
      code: '(this.a) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'MemberExpression',
              object: {type: 'ThisExpression'},
              property: {type: 'Identifier', name: 'a'},
              computed: false,
            },
            operator: '=',
            right: {type: 'Literal', value: '<TODO>', raw: '1'},
          },
        },
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });

    test('assignment to a wrapped this property, silly but valid',{
      code: '(this[b]) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'MemberExpression',
              object: {type: 'ThisExpression'},
              property: {type: 'Identifier', name: 'b'},
              computed: true,
            },
            operator: '=',
            right: {type: 'Literal', value: '<TODO>', raw: '1'},
          },
        },
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    });


    // (); (empty group is error)
    // (a=1)=2; (grouped assignment is _not_ a valid assignment target) https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-isvalidsimpleassignmenttarget
    // assignment to eval and arguments in strict mode should throw (even wrapped)
    // assignment to `yield` and `await` is valid (even wrapped)
    // wrapped reserved words are still a syntax error
  });

  describe('arrow', _ => {

    test('arrow, one arg without parens, expr',{
      code: 'x=>x;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          async: false,
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow, no args, expr',{
      code: '()=>x;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [],
          id: null,
          generator: false,
          async: false,
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow, one arg, expr',{
      code: '(x)=>x;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          async: false,
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow, one arg, block',{
      code: '(x)=>{x}',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          async: false,
          expression: false,
          body: {type: 'BlockStatement', body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}}]},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $ASI],
    });

    test('arrow, one arg, block with a regex literal',{
      code: '(x)=>{/x/}',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          async: false,
          expression: false,
          body: {type: 'BlockStatement', body: [
            {type: 'ExpressionStatement', expression: {type: 'Literal', value: '<TODO>', raw: '/x/'}},
          ]},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI, $PUNCTUATOR, $ASI],
    });

    test('arrow, one arg, expr',{
      code: '(x, y)=>x;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
            {type: 'Identifier', name: 'y'},
          ],
          id: null,
          generator: false,
          async: false,
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    //{ error
    //  code: '((x)) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
    //  ]},
    //  desc: 'silly double group',
    //  tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    //},
    //{ error
    //  code: '(a, 1, "c", d, e, f) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
    //      {type: 'Identifier', name: 'a'},
    //      {type: 'Literal', value: '<TODO>', raw: '1'},
    //      {type: 'Literal', value: '<TODO>', raw: '"c"'},
    //      {type: 'Identifier', name: 'd'},
    //      {type: 'Identifier', name: 'e'},
    //      {type: 'Identifier', name: 'f'},
    //    ]}},
    //  ]},
    //  desc: 'group of some simple values',
    //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    //});

    test('group of some two assignments',{
      code: '(a = 1, b = 2) => x;',
      ast: {
        type: 'Program', body: [{
          type: 'ExpressionStatement',
          expression: {
            type: 'ArrowFunctionExpression',
            params: [
              {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '1'}
              },
              {
                type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'b'},
                operator: '=',
                right: {type: 'Literal', value: '<TODO>', raw: '2'}
              },
            ], id: null, generator: false, async: false, expression: true, body: {type: 'Identifier', name: 'x'},
          },
        }],
      },
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    //{ error
    //  code: '(a.b) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
    //      left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
    //      operator: '=',
    //      right: {type: 'Literal', value: '<TODO>', raw: '1'},
    //    }},
    //  ]},
    //  desc: 'assignment to a wrapped property, silly but valid',
    //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    //},
    //{ error
    //  code: '(a[b]) => x;',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
    //      left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
    //      operator: '=',
    //      right: {type: 'Literal', value: '<TODO>', raw: '1'},
    //    }},
    //  ]},
    //  desc: 'assignment to a wrapped property, silly but valid',
    //  tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    //},
    //{ error
    //  code: '/i/ * ()=>j',
    //  ast: {type: 'Program', body: [
    //    {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
    //      left: {type: 'Literal', value: '<TODO>', raw: '/i/'},
    //      operator: '*',
    //      right: {type: 'ArrowFunctionExpression',
    //        params: [],
    //        id: null,
    //      }
    //    }},
    //  ]},
    //  desc: 'this is invalid because you cannot match an arrow (in the grammar) on the rhs of a non-assignment operator',
    //  tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    //}

    test('group of some two assignments',{
      code: 'var a = (b) => c;',
      ast: {
        type: 'Program', body: [{
          type: 'VariableDeclaration',
          kind: 'var',
          declarations: [
            {type: 'VariableDeclarator',
              id: {type: 'Identifier', name: 'a'},
              init: {
                type: 'ArrowFunctionExpression',
                params: [{type: 'Identifier', name: 'b'}],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        }],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    });

    test('arrow inside template disambiguation test 1',{
      code: '`X${a => b}Y`',
      ast: {
        type: 'Program', body: [{
          type: 'ExpressionStatement',
          expression: {type: 'TemplateLiteral',
            expressions: [
              {
                type: 'ArrowFunctionExpression',
                params: [{type: 'Identifier', name: 'a'}],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'Identifier', name: 'b'},
              }
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`X${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '}Y`', cooked: '<TODO>'}},
            ],
          },
        }]
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
    });

    test('arrow inside template disambiguation test 1',{
      code: '`X${a => b + c}Y`',
      ast: {
        type: 'Program', body: [{
          type: 'ExpressionStatement',
          expression: {type: 'TemplateLiteral',
            expressions: [
              {
                type: 'ArrowFunctionExpression',
                params: [{type: 'Identifier', name: 'a'}],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'BinaryExpression', left: {type: 'Identifier', name: 'b'}, operator: '+', right: {type: 'Identifier', name: 'c'}},
              }
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`X${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '}Y`', cooked: '<TODO>'}},
            ],
          },
        }]
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $TICK_TAIL, $ASI],
    });

    test('arrow inside template disambiguation test 2; regular curlies in the arrow',{
      code: '`X${a => b + {}}Y`',
      ast: {
        type: 'Program', body: [{
          type: 'ExpressionStatement',
          expression: {type: 'TemplateLiteral',
            expressions: [
              {
                type: 'ArrowFunctionExpression',
                params: [{type: 'Identifier', name: 'a'}],
                id: null,
                generator: false,
                async: false,
                expression: true,
                body: {type: 'BinaryExpression',
                  left: {type: 'Identifier', name: 'b'},
                  operator: '+',
                  right: {type: 'ObjectExpression', properties: []},
                },
              }
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`X${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '}Y`', cooked: '<TODO>'}},
            ],
          },
        }]
      },
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    });

    // should error: `a => {} + x` because arrow with block cannot be lhs of binary expression
  });
});
