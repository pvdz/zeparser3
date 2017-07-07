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

let relationals = [
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
];

module.exports = relationals;
