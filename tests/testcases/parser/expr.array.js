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

let arrays = [
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
];

module.exports =arrays;
