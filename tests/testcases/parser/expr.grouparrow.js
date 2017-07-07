//import ZeTokenizer, {
let {
  $ASI,
  $EOF,
  $ERROR,
  $IDENT,
  $NUMBER,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $PUNCTUATOR,
  $REGEX,
  $REGEXU,
  $SPACE,
  $STRING,
  $STRING_DOUBLE,
  $STRING_SINGLE,
  $TAB,
  $TICK,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let ga = [
  '  group/arrow',
  [
    '    group',
    {
      code: '(x);',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
      ]},
      desc: 'silly group',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '((x));',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
      ]},
      desc: 'silly double group',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '((((((((((x))))))))));',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
      ]},
      desc: 'oh come on',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '(a, b);',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
        ]}},
      ]},
      desc: 'group of two vars',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
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
      desc: 'group of some simple values',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
    {
      code: '(a = 1, b = 2);',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'SequenceExpression', expressions: [
          {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'a'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '1'}},
          {type: 'AssignmentExpression', left: {type: 'Identifier', name: 'b'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '2'}},
        ]}},
      ]},
      desc: 'group of some two assignments',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR],
    },
    { // https://tc39.github.io/ecma262/#sec-semantics-static-semantics-isvalidsimpleassignmenttarget
      code: '(a) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '=',
          right: {type: 'Literal', value: '<TODO>', raw: '1'},
        }},
      ]},
      desc: 'assignment to a wrapped identifier, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },
    {
      code: '(a.b) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: false},
          operator: '=',
          right: {type: 'Literal', value: '<TODO>', raw: '1'},
        }},
      ]},
      desc: 'assignment to a wrapped property, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },
    {
      code: '(a[b]) = 1;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'MemberExpression', object: {type: 'Identifier', name: 'a'}, property: {type: 'Identifier', name: 'b'}, computed: true},
          operator: '=',
          right: {type: 'Literal', value: '<TODO>', raw: '1'},
        }},
      ]},
      desc: 'assignment to a wrapped property, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },
    {
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
      desc: 'assignment to a wrapped complex value that ends in a property, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },
    {
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
      desc: 'assignment to a wrapped super property, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },
    {
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
      desc: 'assignment to a wrapped super property, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },
    {
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
      desc: 'assignment to a wrapped this property, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },
    {
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
      desc: 'assignment to a wrapped this property, silly but valid',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR],
    },


    // (); (empty group is error)
    // (a=1)=2; (grouped assignment is _not_ a valid assignment target) https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-isvalidsimpleassignmenttarget
    // assignment to eval and arguments in strict mode should throw (even wrapped)
    // assignment to `yield` and `await` is valid (even wrapped)
    // wrapped reserved words are still a syntax error
  ], // group
  [
    '    arrow',
    {
      code: 'x=>x;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      desc: 'arrow, one arg without parens, expr',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: '()=>x;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
          ],
          id: null,
          generator: false,
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      desc: 'arrow, no args, expr',
      tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: '(x)=>x;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      desc: 'arrow, one arg, expr',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: '(x)=>{x}',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          expression: false,
          body: {type: 'BlockStatement', body: [{type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}}]},
        }},
      ]},
      desc: 'arrow, one arg, block',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $ASI],
    },
    {
      code: '(x)=>{/x/}',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ArrowFunctionExpression',
          params: [
            {type: 'Identifier', name: 'x'},
          ],
          id: null,
          generator: false,
          expression: false,
          body: {type: 'BlockStatement', body: [
            {type: 'ExpressionStatement', expression: {type: 'Literal', value: '<TODO>', raw: '/x/'}},
          ]},
        }},
      ]},
      desc: 'arrow, one arg, block with a regex literal',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $REGEX, $ASI, $PUNCTUATOR, $ASI],
    },
    {
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
          expression: true,
          body: {type: 'Identifier', name: 'x'},
        }},
      ]},
      desc: 'arrow, one arg, expr',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
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
    //},
    {
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
            ], id: null, generator: false, expression: true, body: {type: 'Identifier', name: 'x'},
          },
        }],
      },
      desc: 'group of some two assignments',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
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
    {
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
                expression: true,
                body: {type: 'Identifier', name: 'c'},
              },
            },
          ],
        }],
      },
      desc: 'group of some two assignments',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'f(async ()=>{})',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'f'}, arguments: [
          {
            type: 'ArrowFunctionExpression',
            params: [{type: 'Identifier', name: 'b'}],
            id: null,
            generator: false,
            expression: true,
            body: {type: 'Identifier', name: 'c'},
          },
        ]}},
      ]},
      desc: 'async arrow',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'f(async ())',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'f'}, arguments: [
          {type: 'CallExpression', callee: {type: 'Identifier', name: 'asyn'}, arguments: []},
        ]}},
      ]},
      desc: 'calling async as a function (so not an async function but async as a var name)',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT],
    },
    {
      code: 'f(async)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'f'}, arguments: [
          {type: 'Identifier', name: 'async'},
        ]}},
      ]},
      desc: 'using async a regular var name instead of keyword',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    // need to test invalid async arrows
  ], // arrow
];

module.exports = ga;
