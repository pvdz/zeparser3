//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'if statement',
  {
    code: 'if (foo) bar;',
    ast: {type: 'Program', body: [
      {type: 'IfStatement',
        test: {type: 'Identifier', name: 'foo'},
        consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
        alternate: null,
      },
    ]},
    desc: 'simple if without else',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'if (foo) bar; else doo;',
    ast: {type: 'Program', body: [
      {type: 'IfStatement',
        test: {type: 'Identifier', name: 'foo'},
        consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'bar'}},
        alternate: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'doo'}},
      },
    ]},
    desc: 'simple if without else',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
  },
  {
    code: 'if (foo) a; if (bar) b; else c;',
    ast: {type: 'Program', body: [
      {type: 'IfStatement',
        test: {type: 'Identifier', name: 'foo'},
        consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'a'}},
        alternate: null,
      },
      {type: 'IfStatement',
        test: {type: 'Identifier', name: 'bar'},
        consequent: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'b'}},
        alternate: {type: 'ExpressionStatement', expression: {type: 'Identifier', name: 'c'}},
      }
    ]},
    desc: 'simple if without else',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
