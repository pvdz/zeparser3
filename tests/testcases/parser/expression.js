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

let tests = [
  'expression statement',

  [
    '  ident statement',
    {
      code: 'foo;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
      ]},
      desc: 'ident with semi',
      tokens: [$IDENT, $PUNCTUATOR],
    },
    {
      code: 'foo',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
      ]},
      desc: 'ident with eof',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'foo;bar;',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
      ]},
      desc: 'double ident with semi',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
    },
    {
      code: 'foo\nbar',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}},
        {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
      ]},
      desc: 'double ident with asi',
      tokens: [$IDENT, $ASI, $IDENT, $ASI],
    },
  ], // ident
  [
    '  member',
    {
      code: 'foo.bar',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'MemberExpression',
          object: {type: 'Identifier', name: 'foo'},
          property: {type: 'Identifier', name: 'bar'},
          computed: false,
        }},
      ]},
      desc: 'function call, no args',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
], // member
  [
    '  call',
    {
      code: 'foo()',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: []}},
      ]},
      desc: 'function call, no args',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(a)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'Identifier', name: 'a'},
        ]}},
      ]},
      desc: 'function call, one arg',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(a, b, c)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
          {type: 'Identifier', name: 'c'},
        ]}},
      ]},
      desc: 'function call, three args',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(...a)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'SpreadElement', argument: {type: 'Identifier', name: 'a'}},
        ]}},
      ]},
      desc: 'function call, one arg, spread',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(a, b, ...c)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'Identifier', name: 'a'},
          {type: 'Identifier', name: 'b'},
          {type: 'SpreadElement', argument: {type: 'Identifier', name: 'c'}},
        ]}},
      ]},
      desc: 'function call, three args, spread',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(a)(b)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'CallExpression',
          callee: {
            type: 'CallExpression',
            callee: {type: 'Identifier', name: 'foo'},
            arguments: [{type: 'Identifier', name: 'a'}],
          },
          arguments: [{type: 'Identifier', name: 'b'}],
        }},
      ]},
      desc: 'chained calls',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(a)(b)(c)(d)(e)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression',
          callee: {type: 'CallExpression',
            callee: {type: 'CallExpression',
              callee: {type: 'CallExpression',
                callee: {type: 'CallExpression',
                  callee: {type: 'Identifier', name: 'foo'},
                  arguments: [{type: 'Identifier', name: 'a'}],
                },
                arguments: [{type: 'Identifier', name: 'b'}],
              },
              arguments: [{type: 'Identifier', name: 'c'}],
            },
            arguments: [{type: 'Identifier', name: 'd'}],
          },
          arguments: [{type: 'Identifier', name: 'e'}],
        }},
      ]},
      desc: 'chained calls',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
  ], // call
  [
    '  array',
    [
      '    literal',
      {
        code: '[]',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'ArrayExpression', elements: []}},
        ]},
        desc: 'empty array',
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $ASI],
      },
      {
        code: '[x]',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'ArrayExpression', elements: [
            {type: 'Identifier', name: 'x'},
          ]}},
        ]},
        desc: 'empty array',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
      },
    ], // literal
    [
      '    destructuring',
      {
        code: '[foo] = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'one var, no init, semi',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: '[foo = A] = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'AssignmentPattern',
                left: {type: 'Identifier', name: 'foo'},
                operator: '=', // innocent artifact because the AssignmentPattern was an AssignmentExpression before
                right: {type: 'Identifier', name: 'A'},
              },
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'one var, with init, semi',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: '[foo, bar] = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
              {type: 'Identifier', name: 'bar'},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'two vars, no init, semi',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: '[foo = A, bar = B] = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'foo'}, operator: '=',right: {type: 'Identifier', name: 'A'}},
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, operator: '=',right: {type: 'Identifier', name: 'B'}},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'two vars, both init, semi',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: '[foo, [x,y,z], bar = B] = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
              {type: 'ArrayPattern', elements: [
                {type: 'Identifier', name: 'x'},
                {type: 'Identifier', name: 'y'},
                {type: 'Identifier', name: 'z'},
              ]},
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, operator: '=', right: {type: 'Identifier', name: 'B'}},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'let, nested array pattern',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: '[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
                {type: 'ArrayPattern', elements: [{
                  type: 'ArrayPattern', elements: [{
                    type: 'ArrayPattern', elements: [{
                      type: 'ArrayPattern', elements: [{
                        type: 'ArrayPattern', elements: [{
                          type: 'ArrayPattern', elements: [{
                            type: 'ArrayPattern', elements: [{
                              type: 'ArrayPattern', elements: [{
                                type: 'ArrayPattern', elements: [{
                                  type: 'ArrayPattern', elements: [{
                                    type: 'ArrayPattern', elements: [{
                                      type: 'ArrayPattern', elements: [{
                                        type: 'ArrayPattern', elements: [
                                        {type: 'Identifier', name: 'x'},
                                        {type: 'Identifier', name: 'y'},
                                        {type: 'Identifier', name: 'z'},
                                      ]},
                                    ]},
                                  ]},
                                ]},
                              ]},
                            ]},
                          ]},
                        ]},
                      ]},
                    ]},
                  ]},
                ]},
              ]},
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, operator: '=', right: {type: 'Identifier', name: 'B'}},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'let, super nested array pattern to make sure that isnt hardcoded',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: '[foo, [x,y = 20,z], bar = B] = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [
              {type: 'Identifier', name: 'foo'},
              {type: 'ArrayPattern', elements: [
                {type: 'Identifier', name: 'x'},
                {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'y'}, operator: '=', right: {type: 'Literal', value: '<TODO>', raw: '20'}},
                {type: 'Identifier', name: 'z'},
              ]},
              {type: 'AssignmentPattern', left: {type: 'Identifier', name: 'bar'}, operator: '=', right: {type: 'Identifier', name: 'B'}},
            ]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'let, nested array pattern with inner init and outer init',
        tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      {
        code: 'foo([a, b] = arr);',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement',
          expression: {type: 'CallExpression',
            callee: {type: 'Identifier', name: 'foo'},
            arguments: [
              {type: 'AssignmentExpression',
                left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]},
                operator: '=',
                right: {type: 'Identifier', name: 'arr'},
              },
            ],
          },
        }]},
        desc: 'destructuring array as call arg',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      {
        code: '([foo]) = arr;',
        ast: {type: 'Program', body: [
          {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
            left: {type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'foo'}]},
            operator: '=',
            right: {type: 'Identifier', name: 'arr'},
          }},
        ]},
        desc: 'parenthesis should not matter for destructuring ast',
        tokens: [$PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
      },
      // (a=/i/) = /i/   -> error (invalid lhs)
      // [a,b=[x,y]] = z  -> should not transform the inner array to a arraydestruct
    ], // destructuring
  ], // array
  [
    '  object', // must be wrapped because block, using call wrapper, safer than group because of arrow syntax
    [
      '    literal',
      {
        code: 'wrap({});',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
          {type: 'ObjectExpression', properties: []},
        ]}}]},
        desc: 'empty object',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
      },
      [
        '    identifier properties',
        {
          code: 'wrap({a});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
            ]},
          ]}}]},
          desc: 'object with one shorthand',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
            ]},
          ]}}]},
          desc: 'object with one classic property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a, b});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
              {type: 'Property', key: {type: 'Identifier', name: 'b'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'b'}},
            ]},
          ]}}]},
          desc: 'object with two shorthand',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b, c:d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object with two classic properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a, c:d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
              {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object with a shorthand and a classic property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b, c});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'c'}},
            ]},
          ]}}]},
          desc: 'object with a classic property and a shorthand',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        //{ error without the "outer" assignment, can only init shorthand when destructuring
        //  code: 'wrap({a=b});',
        //  ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
        //    {type: 'ObjectExpression', properties: [
        //      {type: 'Property',
        //        key: {type: 'Identifier', name: 'a'},
        //        kind: 'init',
        //        method: false,
        //        shorthand: true,
        //        computed: false,
        //        value: {
        //          type: 'AssignmentExpression',
        //          left: {type: 'Identifier', name: 'a'}, // same token as above
        //          right: {type: 'Identifier', name: 'b'},
        //        },
        //      },
        //    ]},
        //  ]}}]},
        //  desc: 'object with one shorthand',
        //  tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        //},
      ], // ident props
      [
        '    number properties',
        {
          code: 'wrap({15:b});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '15'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
            ]},
          ]}}]},
          desc: 'object with one number property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({.9:a, 0x84:b, 0b1:c, 0o27:d, 1e234:e});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '.9'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'a'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0x84'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0b1'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'c'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0o27'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '1e234'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'e'}},
            ]},
          ]}}]},
          desc: 'object with one number property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_HEX, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_BIN, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_OCT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({1:b, 0:d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '1'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object with two number properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        // error with number as shorthand
      ], // number props
      [
        '    string properties',
        {
          code: 'wrap({"a":b});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"a"'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
            ]},
          ]}}]},
          desc: 'object with one double quoted property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({"a":b, "c":d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"a"'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"c"'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object with two double quoted properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({\'a\':b});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
            ]},
          ]}}]},
          desc: 'object with one double quoted property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({\'a\':b, \'c\':d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object with two double quoted properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({\'a\':b, c:d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object with two double quoted properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({"a":b, \'c\':d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"a"'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object with a single and a double quoted property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // string props
      [
        '      computed properties',
        {
          code: 'wrap({[a]:b});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
            ]},
          ]}}]},
          desc: 'object literal, one computed property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({[a]:b, [15]:d});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '15'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'd'}},
            ]},
          ]}}]},
          desc: 'object literal, one computed property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },

        // computed property that is a comma expression
      ], // computed props
      [
        '    identifier method',
        {
          code: 'wrap({foo(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({foo(){}, bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({foo(a,b,c){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [
                  {type: 'Identifier', name: 'a'},
                  {type: 'Identifier', name: 'b'},
                  {type: 'Identifier', name: 'c'},
                ],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one method with params',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // ident method
      [
        '    number method',
        {
          code: 'wrap({0(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({.9(){}, 0x84(){}, 0b1(){}, 0o27(){}, 1e234(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '.9'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0x84'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0b1'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '0o27'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '1e234'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_HEX, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_BIN, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_OCT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // number method
      [
        '    string method',
        {
          code: 'wrap({"foo"(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"foo"'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one double string keyed method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({\'foo\'(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'foo\''}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one single string keyed method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // string method
      [
        '    async method',
        {
          code: 'wrap({async foo(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({async "foo"(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"foo"'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async dstring method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({async \'foo\'(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'foo\''}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async sstring method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({async 100(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '100'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async number method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({async [foo](){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({async foo(){}, async bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two async methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({async foo(){}, bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({foo(){}, async bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: true,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // async method
      [
        '    generator method',
        {
          code: 'wrap({*foo(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({*"foo"(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"foo"'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({*\'foo\'(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'foo\''}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({*123(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '123'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({*[foo](){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one computed generator method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({* foo(){},*bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two async methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({* foo(){}, bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({foo(){}, *bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: true,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // generator method
      [
        '    getters (ident)',
        {
          code: 'wrap({get foo(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({get foo(){}, get bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two async methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({get foo(){}, bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({foo(){}, get bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        '    getters (computed)',
        {
          code: 'wrap({get [foo](){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'get', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({get [foo](){}, get [bar](){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'get', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'get', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two async methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({get [foo](){}, [bar](){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'get', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({[foo](){}, get [bar](){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'get', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        '    getters (rest)',
        {
          code: 'wrap({get \'foo\'(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'foo\''}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({get "foo"(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"foo"'}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({get 123(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '123'}, kind: 'get', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // getters
      [
        '    setters (ident)',
        {
          code: 'wrap({set foo(a){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'a'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({set foo(b){}, set bar(d){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'b'}],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'd'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two async methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({set foo(c){}, bar(){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'c'}],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({foo(){}, set bar(e){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'e'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        '    setters (computed)',
        {
          code: 'wrap({set [foo](a){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'set', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'a'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({set [foo](b){}, set [bar](d){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'set', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'b'}],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'set', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'd'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with two async methods',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({set [foo](c){}, [bar](){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'set', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'c'}],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({[foo](){}, set [bar](e){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: true, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [],
                body: {type: 'BlockStatement', body: []}
              }},
              {type: 'Property', key: {type: 'Identifier', name: 'bar'}, kind: 'set', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'e'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with an async method and an ident method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        '    setters (destruct arg)',
        {
          code: 'wrap({set [foo]([a, b]){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'set', method: false, shorthand: false, computed: true, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'a'}, {type: 'Identifier', name: 'b'}]}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        '    setters (rest)',
        {
          code: 'wrap({set \'foo\'(a){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'foo\''}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'a'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({set "foo"(a){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '"foo"'}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'a'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({set 123(a){}});',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '123'}, kind: 'set', method: false, shorthand: false, computed: false, value: {
                type: 'FunctionExpression',
                generator: false,
                async: false,
                expression: false,
                id: null,
                params: [{type: 'Identifier', name: 'a'}],
                body: {type: 'BlockStatement', body: []}
              }},
            ]},
          ]}}]},
          desc: 'object with one async method',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
        },

      ], // setters

      // call({[x]}) is illegal; dynamic properties can not be shorthand
      // can not use async/generators on getters/setters ({async get foo(){}})
      // getters with non-zero param count
      // setters with not-one param count
      // shorthand get, set, async
    ], // literal
    [
      '    destructuring',
      {
        code: 'wrap({}=obj);',
        ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
          {type: 'AssignmentExpression',
            left: {type: 'ObjectPattern', properties: []},
            operator: '=',
            right: {type: 'Identifier', name: 'obj'},
          },
        ]}}]},
        desc: 'empty object destruct',
        tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
      },
      [
        '    identifier properties',
        {
          code: 'wrap({a}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object destruct with one shorthand',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object destruct with one classic property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a, b}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
                {type: 'Property', key: {type: 'Identifier', name: 'b'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'b'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object destruct with two shorthand',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b, c:d}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object destruct with two classic properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a, c:d}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
                {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object destruct with a shorthand and a classic property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b, c}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'c'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object destruct with a classic property and a shorthand',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a=b}=c);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false,
                  value: {
                    type: 'AssignmentPattern',
                    left: {type: 'Identifier', name: 'a'}, // same token as above
                    operator: '=',
                    right: {type: 'Identifier', name: 'b'},
                  },
                },
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'c'},
            },
          ]}}]},
          desc: 'object destruct with one shorthand with initializer, invalid when not destructuring',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:v=b}=c);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false,
                  value: {
                    type: 'AssignmentPattern',
                    left: {type: 'Identifier', name: 'v'},
                    operator: '=',
                    right: {type: 'Identifier', name: 'b'},
                  },
                },
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'c'},
            },
          ]}}]},
          desc: 'object destruct with one pair with initializer',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        // wrap({a:b=x}=y);
      ], // ident props
      [
        '    string properties',
        {
          code: 'wrap({a:b}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object with one double quoted property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b, c:d}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object with two double quoted properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({\'a\':b}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object with one double quoted property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({\'a\':b, \'c\':d}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object with two double quoted properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({\'a\':b, c:d}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'a\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Identifier', name: 'c'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object with two double quoted properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({a:b, \'c\':d}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '\'c\''}, kind: 'init', method: false, shorthand: false, computed: false, value: {type: 'Identifier', name: 'd'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object with two double quoted properties',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $STRING_SINGLE, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
      ], // string props
      [
        '      computed properties',
        {
          code: 'wrap({[a]:b}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object literal, one computed property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },
        {
          code: 'wrap({[a]:b, [15]:d}=obj);',
          ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'wrap'}, arguments: [
            {type: 'AssignmentExpression',
              left: {type: 'ObjectPattern', properties: [
                {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'b'}},
                {type: 'Property', key: {type: 'Literal', value: '<TODO>', raw: '15'}, kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'd'}},
              ]},
              operator: '=',
              right: {type: 'Identifier', name: 'obj'},
            },
          ]}}]},
          desc: 'object literal, one computed property',
          tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
        },

        // computed property that is a comma expression
      ], // computed props
    ], // destructuring
  ], // object
  [
    '    mixed array/object destructuring',
    {
      code: '[a, {b}, c] = obj',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'a'},
            {type: 'ObjectPattern', properties: [
              {
                type: 'Property',
                key: {type: 'Identifier', name: 'b'},
                kind: 'init',
                method: false,
                shorthand: true,
                computed: false,
                value: {type: 'Identifier', name: 'b'},
              },
            ]},
            {type: 'Identifier', name: 'c'},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'obj'},
        }},
      ]},
      desc: 'object with shorthand inside array',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '[a, {b:d}, c] = obj',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'a'},
            {type: 'ObjectPattern', properties: [
              {
                type: 'Property',
                key: {type: 'Identifier', name: 'b'},
                kind: 'init',
                method: false,
                shorthand: false,
                computed: false,
                value: {type: 'Identifier', name: 'd'},
              },
            ]},
            {type: 'Identifier', name: 'c'},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'obj'},
        }},
      ]},
      desc: 'object with property pair inside array',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '[a, {[b]:d}, c] = obj',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'a'},
            {type: 'ObjectPattern', properties: [
              {
                type: 'Property',
                key: {type: 'Identifier', name: 'b'},
                kind: 'init',
                method: false,
                shorthand: false,
                computed: true,
                value: {type: 'Identifier', name: 'd'},
              },
            ]},
            {type: 'Identifier', name: 'c'},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'obj'},
        }},
      ]},
      desc: 'object with computed property inside array',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '[please, {[make]: it}, stop] = bwahahahaha',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'Identifier', name: 'please'},
            {type: 'ObjectPattern', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'make'},  kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'it'}},
            ]},
            {type: 'Identifier', name: 'stop'},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'bwahahahaha'},
        }},
      ]},
      desc: 'horrible addition. this could also be a valid array without the assignment suffixed',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '[pweeze = [pretty] = please, {[make]: it}, stop] = bwahahahaha',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'ArrayPattern', elements: [
            {type: 'AssignmentPattern',
              left: {type: 'Identifier', name: 'pweeze'},
              operator: '=',
              right: {type: 'AssignmentExpression',
                left: {type: 'ArrayPattern', elements: [
                  {type: 'Identifier', name: 'pretty'},
                ]},
                operator: '=',
                right: {type: 'Identifier', name: 'please'},
              },
            },
            {type: 'ObjectPattern', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'make'},  kind: 'init', method: false, shorthand: false, computed: true, value: {type: 'Identifier', name: 'it'}},
            ]},
            {type: 'Identifier', name: 'stop'},
          ]},
          operator: '=',
          right: {type: 'Identifier', name: 'bwahahahaha'},
        }},
      ]},
      desc: 'double assignment in first deconstruction',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'log({foo: [bar]} = obj);',

      ast: {type: 'Program', body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {type: 'Identifier', name: 'log'},
            arguments: [
              {
                type: 'AssignmentExpression',
                left: {type: 'ObjectPattern', properties: [{
                  type: 'Property', key: {type: 'Identifier', name: 'foo'}, kind: 'init', method: false, shorthand: false, computed: false, value: {
                    type: 'ArrayPattern', elements: [{type: 'Identifier', name: 'bar'}],
                  },
                }]},
                operator: '=',
                right: {type: 'Identifier', name: 'obj'},
              },
            ],
          },
        }],
      },
      desc: 'horrible addition. this could also be a valid array without the assignment suffixed',
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    },
  ], // mixed
  [
    '  functions',
    {
      code: 'foo(function(){})',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'FunctionExpression', generator: false, async: false, expression: true, id: null, params: [], body: {type: 'BlockStatement', body: []}},
        ]}},
      ]},
      desc: 'simpelest anonymous function expression',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(function f(){})',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'FunctionExpression', generator: false, async: false, expression: true, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
        ]}},
      ]},
      desc: 'simpelest named function expression',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(function*(){})',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'FunctionExpression', generator: true, async: false, expression: true, id: null, params: [], body: {type: 'BlockStatement', body: []}},
        ]}},
      ]},
      desc: 'simpelest anonymous generator expression',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(function* f(){})',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'FunctionExpression', generator: true, async: false, expression: true, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
        ]}},
      ]},
      desc: 'simpelest named generator expression',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(async function(){})',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'FunctionExpression', generator: false, async: true, expression: true, id: null, params: [], body: {type: 'BlockStatement', body: []}},
        ]}},
      ]},
      desc: 'simpelest anonymous async function expression',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'foo(async function f(){})',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'CallExpression', callee: {type: 'Identifier', name: 'foo'}, arguments: [
          {type: 'FunctionExpression', generator: false, async: true, expression: true, id: {type: 'Identifier', name: 'f'}, params: [], body: {type: 'BlockStatement', body: []}},
        ]}},
      ]},
      desc: 'simpelest async named function expression',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    // error for generator AND async
  ], // functions
  [
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
  ], // group/arrow
  [
    '  literals',
    {
      code: 'null',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: null,
          raw: 'null',
        }},
      ]},
      desc: 'null literal',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'true',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: true,
          raw: 'true',
        }},
      ]},
      desc: 'true literal',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'false',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: false,
          raw: 'false',
        }},
      ]},
      desc: 'false literal',
      tokens: [$IDENT, $ASI],
    },
    {
      code: 'super',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Super',
        }},
      ]},
      desc: 'super literal', // to be refined...
      tokens: [$IDENT, $ASI],
    },
    {
      code: '"foo"',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: '<TODO>',
          raw: '"foo"',
        }},
      ]},
      desc: 'double string literal',
      tokens: [$STRING_DOUBLE, $ASI],
    },
    {
      code: `'foo'`,
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: '<TODO>',
          raw: `'foo'`,
        }},
      ]},
      desc: 'single string literal',
      tokens: [$STRING_SINGLE, $ASI],
    },
    {
      code: '123',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: '<TODO>',
          raw: '123',
        }},
      ]},
      desc: 'decimal number',
      tokens: [$NUMBER_DEC, $ASI],
    },
    {
      code: '0x123',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: '<TODO>',
          raw: '0x123',
        }},
      ]},
      desc: 'hexadecimal number',
      tokens: [$NUMBER_HEX, $ASI],
    },
    {
      code: '0o123',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: '<TODO>',
          raw: '0o123',
        }},
      ]},
      desc: 'octal number',
      tokens: [$NUMBER_OCT, $ASI],
    },
    {
      code: '0b1010',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: '<TODO>',
          raw: '0b1010',
        }},
      ]},
      desc: 'binary number',
      tokens: [$NUMBER_BIN, $ASI],
    },
    {
      code: '0456',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'Literal',
          value: '<TODO>',
          raw: '0456',
        }},
      ]},
      desc: 'legacy octal number',
      tokens: [$NUMBER_OLD, $ASI],
    },
    {
      code: 'this',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ThisExpression',
        }},
      ]},
      desc: 'this keyword',
      tokens: [$IDENT, $ASI],
    },
  ], // literals
  [
    '  template',
    {
      code: '`foo`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [],
          quasis: [
            {type: 'TemplateElement', tail: true, value: {raw: '`foo`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'pure template',
      tokens: [$TICK_PURE, $ASI],
    },
    {
      code: '`foo${bar}baz`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'Identifier', name: 'bar'},
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'head${expr}tail template',
      tokens: [$TICK_HEAD, $IDENT, $TICK_TAIL, $ASI],
    },
    {
      code: '`foo ${a} and ${b} and ${c} baz`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'Identifier', name: 'a'},
            {type: 'Identifier', name: 'b'},
            {type: 'Identifier', name: 'c'},
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'template with multiple middle pieces',
      tokens: [$TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI],
    },
    {
      code: '{`foo baz`}',
      ast: {type: 'Program', body: [
        {type: 'BlockStatement', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'TemplateLiteral',
            expressions: [
            ],
            quasis: [
              {type: 'TemplateElement', tail: true, value: {raw: '`foo baz`', cooked: '<TODO>'}},
            ],
          }},
        ]},
      ]},
      desc: 'block wrapped 1-part template to check disambiguation',
      tokens: [$PUNCTUATOR, $TICK_PURE, $ASI, $PUNCTUATOR],
    },
    {
      code: '{`foo ${a} baz`}',
      ast: {type: 'Program', body: [
        {type: 'BlockStatement', body: [
          {type: 'ExpressionStatement', expression: {
            type: 'TemplateLiteral',
            expressions: [
              {type: 'Identifier', name: 'a'},
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
            ],
          }},
        ]},
      ]},
      desc: 'block wrapped 2-part template to check disambiguation',
      tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_TAIL, $ASI, $PUNCTUATOR],
    },
    {
      code: '{`foo ${a} and ${b} and ${c} baz`}',
      ast: {type: 'Program', body: [
        {type: 'BlockStatement', body: [
          {type: 'ExpressionStatement', expression: {type: 'TemplateLiteral',
            expressions: [
              {type: 'Identifier', name: 'a'},
              {type: 'Identifier', name: 'b'},
              {type: 'Identifier', name: 'c'},
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
            ],
          }},
        ]},
      ]},
      desc: 'block wrapped 3-part template to check disambiguation',
      tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $ASI, $PUNCTUATOR],
    },
    {
      code: '`foo${{}}baz`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'ObjectExpression', properties: []}
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'object literal inside the tick expression',
      tokens: [$TICK_HEAD, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    },
    {
      code: '`foo${{a,b}}baz`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'ObjectExpression', properties: [
              {type: 'Property', key: {type: 'Identifier', name: 'a'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'a'}},
              {type: 'Property', key: {type: 'Identifier', name: 'b'}, kind: 'init', method: false, shorthand: true, computed: false, value: {type: 'Identifier', name: 'b'}},
            ]},
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'object literal with multiple shorthands inside the tick expression',
      tokens: [$TICK_HEAD, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $TICK_TAIL, $ASI],
    },
    {
      code: '`foo${`foo`}baz`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {
              type: 'TemplateLiteral',
              expressions: [],
              quasis: [
                {type: 'TemplateElement', tail: true, value: {raw: '`foo`', cooked: '<TODO>'}},
              ],
            },
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'head${expr}tail template',
      tokens: [$TICK_HEAD, $TICK_PURE, $TICK_TAIL, $ASI],
    },
    {
      code: '`foo${`foo${bar}baz`}baz`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {
              type: 'TemplateLiteral',
              expressions: [
                {type: 'Identifier', name: 'bar'},
              ],
              quasis: [
                {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
                {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
              ],
            },
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`foo${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '}baz`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'nested tick pairs',
      tokens: [$TICK_HEAD, $TICK_HEAD, $IDENT, $TICK_TAIL, $TICK_TAIL, $ASI],
    },
    {
      code: '{`foo ${a} and ${b} and ${`w ${d} x ${e} y ${f} z`} baz`}',
      ast: {type: 'Program', body: [
        {type: 'BlockStatement', body: [
          {type: 'ExpressionStatement', expression: {type: 'TemplateLiteral',
            expressions: [
              {type: 'Identifier', name: 'a'},
              {type: 'Identifier', name: 'b'},
              {type: 'TemplateLiteral',
                expressions: [
                  {type: 'Identifier', name: 'd'},
                  {type: 'Identifier', name: 'e'},
                  {type: 'Identifier', name: 'f'},
                ],
                quasis: [
                  {type: 'TemplateElement', tail: false, value: {raw: '`w ${', cooked: '<TODO>'}},
                  {type: 'TemplateElement', tail: false, value: {raw: '} x ${', cooked: '<TODO>'}},
                  {type: 'TemplateElement', tail: false, value: {raw: '} y ${', cooked: '<TODO>'}},
                  {type: 'TemplateElement', tail: true, value: {raw: '} z`', cooked: '<TODO>'}},
                ],
              },
            ],
            quasis: [
              {type: 'TemplateElement', tail: false, value: {raw: '`foo ${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: false, value: {raw: '} and ${', cooked: '<TODO>'}},
              {type: 'TemplateElement', tail: true, value: {raw: '} baz`', cooked: '<TODO>'}},
            ],
          }},
        ]},
      ]},
      desc: 'block wrapped 3-part template to check disambiguation',
      tokens: [$PUNCTUATOR, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $TICK_HEAD, $IDENT, $TICK_BODY, $IDENT, $TICK_BODY, $IDENT, $TICK_TAIL, $TICK_TAIL, $ASI, $PUNCTUATOR],
    },
    {
      code: '`a ${function(){}} b`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'FunctionExpression',
              generator: false,
              async: false,
              expression: true,
              id: null,
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'function body disambiguation inside template',
      tokens: [$TICK_HEAD, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    },
    {
      code: '`a ${()=>{}} b`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'ArrowFunctionExpression',
              params: [],
              id: null,
              generator: false,
              expression: false,
              body: {type: 'BlockStatement', body: []},
            },
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'empty arrow with block body disambiguation inside template',
      tokens: [$TICK_HEAD, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $TICK_TAIL, $ASI],
    },
    {
      code: '`a ${(k)=>{x}} b`',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'TemplateLiteral',
          expressions: [
            {type: 'ArrowFunctionExpression',
              params: [
                {type: 'Identifier', name: 'k'},
              ],
              id: null,
              generator: false,
              expression: false,
              body: {type: 'BlockStatement', body: [
                {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'x'}},
              ]},
            },
          ],
          quasis: [
            {type: 'TemplateElement', tail: false, value: {raw: '`a ${', cooked: '<TODO>'}},
            {type: 'TemplateElement', tail: true, value: {raw: '} b`', cooked: '<TODO>'}},
          ],
        }},
      ]},
      desc: 'arrow with block body disambiguation inside template',
      tokens: [$TICK_HEAD, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI, $PUNCTUATOR, $TICK_TAIL, $ASI],
    },
    // empty template `${}`
  ], // template
  [
    '  math',
    {
      code: 'a+b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin +',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a-b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '-',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin -',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a*b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '*',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin *',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a/b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '/',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin /',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a**b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '**',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin ** (pow)',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a%b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '%',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin or',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // math
  [
    '  bitwise',
    {
      code: 'a|b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '|',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin or',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a&b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin &',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a^b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '^',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin or',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '~a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '~',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      desc: 'una ~',
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a<<b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<<',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'rel <<',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a>>b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '>>',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'rel >>',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a>>>b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '>>>',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'rel >>>',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // bitwise
  [
    '  logic',
    {
      code: 'a&&b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&&',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'logical &&',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a||b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '||',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'logical ||',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // logical
  [
    '  relational',
    {
      code: 'a<b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'relational <',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a<=b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'relational <=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a>b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '>',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'relational >',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a>=b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '>=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'relational >=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // relational
  [
    '  ternary',
    {
      code: 'a?b:c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'ConditionalExpression',
          test: {type: 'Identifier', name: 'a'},
          consequent: {type: 'Identifier', name: 'b'},
          alternate: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: 'function call, no args',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // ternary
  [
    '  idents',
    {
      code: 'a in b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: 'in',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin in',
      tokens: [$IDENT, $IDENT, $IDENT, $ASI],
    },
    {
      code: 'a instanceof b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: 'instanceof',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin instanceof',
      tokens: [$IDENT, $IDENT, $IDENT, $ASI],
    },
  ], // idents
  [
    '  assigns',
    {
      code: 'a *= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '*=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin *=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a /= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '/=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin /=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a %= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '%=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin %=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a += b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin +=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a -= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '-=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin -=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a <<= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<<=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin <<=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a >>= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '>>=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin >>=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a >>>= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '>>>=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin >>>=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a &= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin &=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a |= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '|=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin |=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a ^= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '^=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin ^=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a |= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '|=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin |=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a **= b',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '**=',
          right: {type: 'Identifier', name: 'b'},
        }},
      ]},
      desc: 'bin **=',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a = b = c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '=',
          right: {type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '=',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: 'triple eq chain',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a = b = c = d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '=',
          right: {type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '=',
            right: {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'c'},
              operator: '=',
              right: {type: 'Identifier', name: 'd'},
            },
          },
        }},
      ]},
      desc: 'quad eq chain',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // assigns
  [
    '  unary',
    {
      code: '+a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '+',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      desc: 'positive prefix',
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '-a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '-',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      desc: 'negative prefix',
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '~a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '~',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      desc: 'bitwise invert',
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '++a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UpdateExpression',
          operator: '++',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      desc: 'incremental prefix',
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '--a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UpdateExpression',
          operator: '--',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      desc: 'decremental prefix',
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a++',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UpdateExpression',
          argument: {type: 'Identifier', name: 'a'},
          operator: '++',
          prefix: false,
        }},
      ]},
      desc: 'incremental suffix',
      tokens: [$IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'a--',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UpdateExpression',
          argument: {type: 'Identifier', name: 'a'},
          operator: '--',
          prefix: false,
        }},
      ]},
      desc: 'decremental suffix',
      tokens: [$IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: '!a',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'UnaryExpression',
          operator: '!',
          prefix: true,
          argument: {type: 'Identifier', name: 'a'},
        }},
      ]},
      desc: 'boolean invert',
      tokens: [$PUNCTUATOR, $IDENT, $ASI],
    },
  ], // unary
  [
    '  new',
    {
      code: 'new Foo()',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'NewExpression',
          arguments: [],
          callee: {type: 'Identifier', name: 'Foo'},
        }},
      ]},
      desc: 'new on property without parens',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'new Foo(x, y, z)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'NewExpression',
          arguments: [
            {type: 'Identifier', name: 'x'},
            {type: 'Identifier', name: 'y'},
            {type: 'Identifier', name: 'z'},
          ],
          callee: {type: 'Identifier', name: 'Foo'},
        }},
      ]},
      desc: 'new on property without parens',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'new Foo.bar',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'NewExpression',
          arguments: [],
          callee: {type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'bar'},
            computed: false,
          },
        }},
      ]},
      desc: 'new on property without parens',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'new Foo.bar()',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'NewExpression',
          arguments: [],
          callee: {type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'bar'},
            computed: false,
          },
        }},
      ]},
      desc: 'new on property without parens',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    },
    {
      code: 'new Foo.bar(x, y, z)',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'NewExpression',
          arguments: [
            {type: 'Identifier', name: 'x'},
            {type: 'Identifier', name: 'y'},
            {type: 'Identifier', name: 'z'},
          ],
          callee: {type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'bar'},
            computed: false,
          },
        }},
      ]},
      desc: 'new on property without parens',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    },
    {
      code: 'new Foo().bar',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'NewExpression',
          arguments: [],
          callee: {type: 'MemberExpression',
            object: {type: 'Identifier', name: 'Foo'},
            property: {type: 'Identifier', name: 'bar'},
            computed: false,
          },
        }},
      ]},
      desc: 'new on property with parens',
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // new
  [
    '  precedent',
    {
      code: 'a + b + c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '+',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '+',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: 'same level +',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a * b + c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '*',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '+',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '* is higher than +',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a + b * c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '*',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '* is higher than +',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a + b * c * d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+',
          right: {
            type: 'BinaryExpression',
            left: {
              type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'b'},
              operator: '*',
              right: {type: 'Identifier', name: 'c'},
            },
            operator: '*',
            right: {type: 'Identifier', name: 'd'},
          },
        }},
      ]},
      desc: '* is higher than +',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a * b + c * d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '*',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '+',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'c'},
            operator: '*',
            right: {type: 'Identifier', name: 'd'},
          },
        }},
      ]},
      desc: '* is higher than +',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: '(a * b + c) * d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '*',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '+',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '*',
          right: {type: 'Identifier', name: 'd'},
        }},
      ]},
      desc: 'parenthesis override regular precedent (AST doesnt reflect them explicitly)',
      tokens: [$PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n',
      ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '=',
        right: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '+=',
          right: {type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'c'},
            operator: '-=',
            right: {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'd'},
              operator: '**=',
              right: {type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'e'},
                operator: '*=',
                right: {type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'f'},
                  operator: '/=',
                  right: {type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'g'},
                    operator: '%=',
                    right: {type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'h'},
                      operator: '<<=',
                      right: {type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'i'},
                        operator: '>>=',
                        right: {type: 'AssignmentExpression',
                          left: {type: 'Identifier', name: 'j'},
                          operator: '>>>=',
                          right: {type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'k'},
                            operator: '&=',
                            right: {type: 'AssignmentExpression',
                              left: {type: 'Identifier', name: 'l'},
                              operator: '^=',
                              right: {type: 'AssignmentExpression',
                                left: {type: 'Identifier', name: 'm'},
                                operator: '|=',
                                right: {type: 'Identifier', name: 'n'},
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }}]},
      desc: 'assignment precedent test 1/2 (should all chain to the right)',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a|=b^=c&=d>>>=e>>=f<<=g%=h/=i*=j**=k-=l+=m=n',
      ast: {type: 'Program', body: [{type: 'ExpressionStatement', expression: {type: 'AssignmentExpression',
        left: {type: 'Identifier', name: 'a'},
        operator: '|=',
        right: {type: 'AssignmentExpression',
          left: {type: 'Identifier', name: 'b'},
          operator: '^=',
          right: {type: 'AssignmentExpression',
            left: {type: 'Identifier', name: 'c'},
            operator: '&=',
            right: {type: 'AssignmentExpression',
              left: {type: 'Identifier', name: 'd'},
              operator: '>>>=',
              right: {type: 'AssignmentExpression',
                left: {type: 'Identifier', name: 'e'},
                operator: '>>=',
                right: {type: 'AssignmentExpression',
                  left: {type: 'Identifier', name: 'f'},
                  operator: '<<=',
                  right: {type: 'AssignmentExpression',
                    left: {type: 'Identifier', name: 'g'},
                    operator: '%=',
                    right: {type: 'AssignmentExpression',
                      left: {type: 'Identifier', name: 'h'},
                      operator: '/=',
                      right: {type: 'AssignmentExpression',
                        left: {type: 'Identifier', name: 'i'},
                        operator: '*=',
                        right: {type: 'AssignmentExpression',
                          left: {type: 'Identifier', name: 'j'},
                          operator: '**=',
                          right: {type: 'AssignmentExpression',
                            left: {type: 'Identifier', name: 'k'},
                            operator: '-=',
                            right: {type: 'AssignmentExpression',
                              left: {type: 'Identifier', name: 'l'},
                              operator: '+=',
                              right: {
                                type: 'AssignmentExpression',
                                left: {type: 'Identifier', name: 'm'},
                                operator: '=',
                                right: {type: 'Identifier', name: 'n'},
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }}]},
      desc: 'assignment precedent test 2/2 (should all chain to the right)',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a || b || c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {
            type: 'LogicalExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '||',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '||',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '|| should veer to the left',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a && b && c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {
            type: 'LogicalExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '&&',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '&&',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '&& should veer to the left',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a && b || c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {
            type: 'LogicalExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '&&',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '||',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '&& || precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a || b && c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '||',
          right: {
            type: 'LogicalExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '&&',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '&& || precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a | b && c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '|',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '&&',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '&& | precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a && b | c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'LogicalExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&&',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '|',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '&& | precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a ^ b | c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '^',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '|',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '| ^ precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a | b ^ c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '|',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '^',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '| ^ precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a & b ^ c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '&',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '^',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '^ & precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a ^ b & c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '^',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '&',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '^ & precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a == b & c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '==',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '&',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '& == precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a & b == c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '==',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '& == precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a == b != c === d !== e',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '==',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '!=',
              right: {type: 'Identifier', name: 'c'},
            },
            operator: '===',
            right: {type: 'Identifier', name: 'd'},
          },
          operator: '!==',
          right: {type: 'Identifier', name: 'e'},
        }},
      ]},
      desc: 'equality precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a !== b === c != d == e',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'Identifier', name: 'a'},
                operator: '!==',
                right: {type: 'Identifier', name: 'b'},
              },
              operator: '===',
              right: {type: 'Identifier', name: 'c'},
            },
            operator: '!=',
            right: {type: 'Identifier', name: 'd'},
          },
          operator: '==',
          right: {type: 'Identifier', name: 'e'},
        }},
      ]},
      desc: 'equality precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a == b & c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '==',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '&',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '& == precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a & b == c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '&',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '==',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '& == precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a < b == c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '<',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '==',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '== < precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a == b < c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '==',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '<',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '== < precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a < b <= c > d >= e in f instanceof g',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'BinaryExpression',
                  left: {type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: '<',
                    right: {type: 'Identifier', name: 'b'},
                  },
                  operator: '<=',
                  right: {type: 'Identifier', name: 'c'},
                },
                operator: '>',
                right: {type: 'Identifier', name: 'd'},
              },
              operator: '>=',
              right: {type: 'Identifier', name: 'e'},
            },
            operator: 'in',
            right: {type: 'Identifier', name: 'f'},
          },
          operator: 'instanceof',
          right: {type: 'Identifier', name: 'g'},
        }},
      ]},
      desc: 'comparison precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $ASI],
    },
    {
      code: 'a instanceof b in c >= d > e <= f < g',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'BinaryExpression',
                left: {type: 'BinaryExpression',
                  left: {type: 'BinaryExpression',
                    left: {type: 'Identifier', name: 'a'},
                    operator: 'instanceof',
                    right: {type: 'Identifier', name: 'b'},
                  },
                  operator: 'in',
                  right: {type: 'Identifier', name: 'c'},
                },
                operator: '>=',
                right: {type: 'Identifier', name: 'd'},
              },
              operator: '>',
              right: {type: 'Identifier', name: 'e'},
            },
            operator: '<=',
            right: {type: 'Identifier', name: 'f'},
          },
          operator: '<',
          right: {type: 'Identifier', name: 'g'},
        }},
      ]},
      desc: 'comparison precedent test 2/2',
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a << b < c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '<<',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '<',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '< << precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a < b << c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '<<',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '< << precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a << b >> c >>> d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '<<',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '>>',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '>>>',
          right: {type: 'Identifier', name: 'd'},
        }},
      ]},
      desc: 'bit shift precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a >>> b >> c << d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '>>>',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '>>',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '<<',
          right: {type: 'Identifier', name: 'd'},
        }},
      ]},
      desc: 'comparison precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a + b << c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '+',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '<<',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '<< + precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a << b + c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '<<',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '+',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '<< + precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a + b - c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '+',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '-',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: 'addition/subtraction precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a - b + c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '-',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '+',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: 'addition/subtraction precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a * b + c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '*',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '+',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '+ * precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a + b * c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '+',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '*',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '+ * precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a * b / c % d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '*',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '/',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '%',
          right: {type: 'Identifier', name: 'd'},
        }},
      ]},
      desc: 'mul precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a % b / c * d',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {type: 'BinaryExpression',
          left: {type: 'BinaryExpression',
            left: {type: 'BinaryExpression',
              left: {type: 'Identifier', name: 'a'},
              operator: '%',
              right: {type: 'Identifier', name: 'b'},
            },
            operator: '/',
            right: {type: 'Identifier', name: 'c'},
          },
          operator: '*',
          right: {type: 'Identifier', name: 'd'},
        }},
      ]},
      desc: 'mul precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a ** b * c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'a'},
            operator: '**',
            right: {type: 'Identifier', name: 'b'},
          },
          operator: '*',
          right: {type: 'Identifier', name: 'c'},
        }},
      ]},
      desc: '* ** precedent test 1/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a * b ** c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '*',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '**',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '* ** precedent test 2/2',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
    {
      code: 'a ** b ** c',
      ast: {type: 'Program', body: [
        {type: 'ExpressionStatement', expression: {
          type: 'BinaryExpression',
          left: {type: 'Identifier', name: 'a'},
          operator: '**',
          right: {
            type: 'BinaryExpression',
            left: {type: 'Identifier', name: 'b'},
            operator: '**',
            right: {type: 'Identifier', name: 'c'},
          },
        }},
      ]},
      desc: '** right-associative',
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    },
  ], // precedent
];

//export default tests;
module.exports = tests;
