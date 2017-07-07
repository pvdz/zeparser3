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

let calls = [
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
];

module.exports = calls;
