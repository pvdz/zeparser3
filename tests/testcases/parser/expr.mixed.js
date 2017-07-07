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

let mixed = [
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
];

module.exports = mixed;
