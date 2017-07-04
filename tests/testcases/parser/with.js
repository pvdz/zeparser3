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
  'with statement',
  {
    code: 'with (foo) bar;',
    ast: {type: 'Program', body: [
      {type: 'WithStatement', object: { type: 'Identifier', name: 'foo' }, body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}}},
    ]},
    desc: 'var, one var, no init, semi',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
