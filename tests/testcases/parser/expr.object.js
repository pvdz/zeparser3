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

let objects = [
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
];

module.exports = objects;
