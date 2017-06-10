//import ZeTokenizer, {
let {
  $CRLF,
  $ERROR,
  $NL,
  $STRING_SINGLE,
  $STRING_DOUBLE,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

//import string_body from './string_body';
let string_body = require('./string_body'); // Λλ
let strings_double = string_body.slice(0);

// these test should happen for all string tests but it's just far easier to put them here than make it generic
strings_double.push(
  //[`Λ a " b λ`, $STRING_SINGLE],
  //[`Λ a " b " c λ`, $STRING_SINGLE],
  [`Λ a \\" b λ`, $STRING_SINGLE],
  [`Λ a \\" b \\" c λ`, $STRING_SINGLE],
  [`Λ a ' b λ`, $STRING_SINGLE],
  [`Λ a ' b ' c λ`, $STRING_SINGLE],
  [`Λ a \\' b λ`, $STRING_SINGLE],
  [`Λ a \\' b \\' c λ`, $STRING_SINGLE],
  ["Λ a ` b λ", $STRING_SINGLE],
  ["Λ a ` b ` c λ", $STRING_SINGLE],
  ["Λ a \\` b λ", $STRING_SINGLE],
  ["Λ a \\` b \\` c λ", $STRING_SINGLE],

  [`Λ\nλ`, [$ERROR, $NL, $ERROR], 'newlines are never allowed in regular strings', 'suffixsp'],
  [`Λ\rλ`, [$ERROR, $NL, $ERROR], 'newlines are never allowed in regular strings', 'suffixsp'],
  [`Λ\r\nλ`, [$ERROR, $CRLF, $ERROR], 'newlines are never allowed in regular strings', 'suffixsp']
);

strings_double = strings_double.map(([inputs, outs, ...rest]) => {
  let input = (typeof inputs === 'string' ? `${inputs.replace(/Λ|λ/g, '"')}` : inputs.map(s => `${s.replace(/Λ|λ/g, '"')}`));
  let output = (typeof outs === 'number' ? (outs === $STRING_SINGLE ? $STRING_DOUBLE : outs) : outs.map(o => o === $STRING_SINGLE ? $STRING_DOUBLE : o));
  return [input, output, ...rest]
});

//export default strings_double;
module.exports = strings_double;
