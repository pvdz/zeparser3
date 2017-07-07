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

let ins = [
  '  in/instanceof',
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
];

module.exports = ins;
