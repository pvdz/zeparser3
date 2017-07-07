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

let ternaries = [
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
];

module.exports = ternaries;