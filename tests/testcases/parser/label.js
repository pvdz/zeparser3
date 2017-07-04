//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'labeled statement',
  {
    code: 'foo: bar;',
    ast: {type: 'Program', body: [
      {type: 'LabeledStatement', label: {type: 'Identifier', name: 'foo'}, body:
      {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
      },
    ]},
    desc: 'debugger with semi',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  // TODO: label:functiondecl is explicitly considered a syntax error
  // TODO: labels must be "identifiers", which may not be reserved
];

//export default tests;
module.exports = tests;
