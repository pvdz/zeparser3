//import {
let {PARSE_MODE_DIV} = require('../../utils');
//} from '../../utils';

//import ZeTokenizer, {
let {$ERROR, $PUNCTUATOR} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer.mjs';

let punctuators = [
  [`{`, $PUNCTUATOR],
  ['}', $PUNCTUATOR],
  [`(`, $PUNCTUATOR],
  [')', $PUNCTUATOR],
  [`[`, $PUNCTUATOR],
  [']', $PUNCTUATOR],
  [`.`, $PUNCTUATOR],
  ['...', $PUNCTUATOR],
  [';', $PUNCTUATOR],
  [',', $PUNCTUATOR],
  ['<', $PUNCTUATOR],
  ['>', $PUNCTUATOR],
  ['<<', $PUNCTUATOR],
  ['>>', $PUNCTUATOR],
  ['>>>', $PUNCTUATOR],
  ['<=', $PUNCTUATOR],
  ['>=', $PUNCTUATOR],
  ['<<=', $PUNCTUATOR],
  ['>>=', $PUNCTUATOR],
  ['>>>=', $PUNCTUATOR],
  ['=', $PUNCTUATOR],
  ['=>', $PUNCTUATOR],
  ['==', $PUNCTUATOR],
  ['===', $PUNCTUATOR],
  ['!', $PUNCTUATOR],
  ['!=', $PUNCTUATOR],
  ['!==', $PUNCTUATOR],
  ['+', $PUNCTUATOR],
  ['++', $PUNCTUATOR],
  ['+=', $PUNCTUATOR],
  ['-', $PUNCTUATOR],
  ['--', $PUNCTUATOR],
  ['-=', $PUNCTUATOR],
  ['*', $PUNCTUATOR],
  ['*=', $PUNCTUATOR],
  ['**', $PUNCTUATOR],
  ['**=', $PUNCTUATOR],
  ['/', $PUNCTUATOR, PARSE_MODE_DIV],
  ['/=', $PUNCTUATOR, PARSE_MODE_DIV],
  ['%', $PUNCTUATOR],
  ['%=', $PUNCTUATOR],
  ['&', $PUNCTUATOR],
  ['&&', $PUNCTUATOR],
  ['&=', $PUNCTUATOR],
  ['|', $PUNCTUATOR],
  ['||', $PUNCTUATOR],
  ['|=', $PUNCTUATOR],
  ['?', $PUNCTUATOR],
  [':', $PUNCTUATOR],
  ['^', $PUNCTUATOR],
  ['^=', $PUNCTUATOR],
];

//export default punctuators;
module.exports = punctuators;
