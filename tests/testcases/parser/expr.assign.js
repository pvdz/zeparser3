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

let assigns = [
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
];

module.exports = assigns;
