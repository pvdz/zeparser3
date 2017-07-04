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
  'try statement',
  {
    code: 'try {} catch(e) {}',
    ast: {type: 'Program', body: [
      {type: 'TryStatement',
        block: {type: 'BlockStatement', body: []},
        handler: {type: 'CatchClause', param: {type: 'Identifier', name: 'e'}, body: {type: 'BlockStatement', body: []}},
        finalizer: null,
      },
    ]},
    desc: 'empty try/catch',
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'try {} finally {}',
    ast: {type: 'Program', body: [
      {type: 'TryStatement',
        block: {type: 'BlockStatement', body: []},
        handler: null,
        finalizer: {type: 'BlockStatement', body: []},
      },
    ]},
    desc: 'empty try/finally',
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: 'try {} catch(e) {} finally {}',
    ast: {type: 'Program', body: [
      {type: 'TryStatement',
        block: {type: 'BlockStatement', body: []},
        handler: {type: 'CatchClause', param: {type: 'Identifier', name: 'e'}, body: {type: 'BlockStatement', body: []}},
        finalizer: {type: 'BlockStatement', body: []},
      },
    ]},
    desc: 'empty try/catch/finally',
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
