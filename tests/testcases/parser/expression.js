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

let arrays = require('./expr.array');
let awaits = require('./expr.await');
let assigns = require('./expr.assign');
let bitwises = require('./expr.bitwise');
let calls = require('./expr.call');
let functions = require('./expr.function');
let grouparrows = require('./expr.grouparrow');
let idents = require('./expr.ident');
let ins = require('./expr.ins');
let literals = require('./expr.literal');
let logicals = require('./expr.logical');
let maths = require('./expr.math');
let members = require('./expr.member');
let mixeds = require('./expr.mixed');
let news = require('./expr.new');
let objects = require('./expr.object');
let precedents = require('./expr.precedent');
let relationals = require('./expr.relational');
let regexes = require('./expr.regexes');
let templates = require('./expr.template');
let ternaries = require('./expr.ternary');
let unaries = require('./expr.unary');

let tests = [
  'expression statement',
  ...arrays,
  ...awaits,
  ...assigns,
  ...bitwises,
  ...calls,
  ...functions,
  ...grouparrows,
  ...idents,
  ...ins,
  ...literals,
  ...logicals,
  ...maths,
  ...members,
  ...mixeds,
  ...news,
  ...objects,
  ...precedents,
  ...regexes,
  ...relationals,
  ...templates,
  ...ternaries,
  ...unaries,
];

//export default tests;
module.exports = tests;
