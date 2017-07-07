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

module.exports = [
  '  member',
  {
    code: 'foo.bar',
    ast: {type: 'Program', body: [
      {type: 'ExpressionStatement', expression: {
        type: 'MemberExpression',
        object: {type: 'Identifier', name: 'foo'},
        property: {type: 'Identifier', name: 'bar'},
        computed: false,
      }},
    ]},
    desc: 'function call, no args',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $ASI],
  },
];
