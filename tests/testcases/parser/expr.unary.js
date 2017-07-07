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

let unaries = [
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
];

module.exports = unaries;
