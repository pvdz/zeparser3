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

let logicals = [
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
];

module.exports = logicals;
