//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'dowhile statement',
  {
    code: 'do foo\nwhile (bar);',
    ast: {type: 'Program', body: [
      {type: 'DoWhileStatement', body: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'foo'}}, test: {type: 'Identifier', name: 'bar'}},
    ]},
    desc: 'simple while',
    tokens: [$IDENT, $IDENT, $ASI, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
  },
  // TODO: error for `do foo while (bar);`
];

//export default tests;
module.exports = tests;
