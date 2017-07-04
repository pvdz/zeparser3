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

let tests = [
  'throw statement',
  {
    code: 'throw foo;',
    ast: {type: 'Program', body: [
      {type: 'ThrowStatement', argument: {type: 'Identifier', name: 'foo'}},
    ]},
    desc: 'throw, semi',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'throw foo',
    ast: {type: 'Program', body: [
      {type: 'ThrowStatement', argument: {type: 'Identifier', name: 'foo'}},
    ]},
    desc: 'throw, eof',
    tokens: [$IDENT, $IDENT, $ASI],
  },
];

//export default tests;
module.exports = tests;
