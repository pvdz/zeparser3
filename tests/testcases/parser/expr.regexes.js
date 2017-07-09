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

// note: Most regex tests can be found in the tokenizer. Tests in here mainly test the "div or regex" ambiguation.

let regexes = [
  '  array',
  {
    code: `middleDashMatch = /[\\-]/.exec`,
    ast: {type: 'Program', body: [{
      type: 'ExpressionStatement', expression: {
        type: 'AssignmentExpression', left: {type: 'Identifier', name: 'middleDashMatch'},
        operator: '=',
        right: {
          type: 'MemberExpression',
          object: {type: 'Literal', value: '<TODO>', raw: '/[\\-]/'},
          property: {type: 'Identifier', name: 'exec'},
          computed: false
        }
      },
    }]},
    desc: 'empty array',
    tokens: [$IDENT, $PUNCTUATOR, $REGEX, $PUNCTUATOR, $IDENT, $ASI],
  },
];

module.exports =regexes;
