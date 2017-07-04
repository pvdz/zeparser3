//import ZeTokenizer, {
let {
  $ASI,
  $IDENT,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'empty statement',
  {
    code: ';',
    ast: {type: 'Program', body: [
      {type: 'EmptyStatement'},
    ]},
    desc: 'just a semi',
    tokens: [$PUNCTUATOR],
  },
  {
    code: '{};',
    ast: {type: 'Program', body: [
      {type: 'BlockStatement', body: []},
      {type: 'EmptyStatement'},
    ]},
    desc: 'just a semi with an empty block',
    tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: ';{}',
    ast: {type: 'Program', body: [
      {type: 'EmptyStatement'},
      {type: 'BlockStatement', body: []},
    ]},
    desc: 'just an empty block with a semi',
    tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
  {
    code: '{;}',
    ast: {type: 'Program', body: [
      {type: 'BlockStatement', body: [
        {type: 'EmptyStatement'},
      ]},
    ]},
    desc: 'just an empty statement inside a block',
    tokens: [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
  },
];

//export default tests;
module.exports = tests;
