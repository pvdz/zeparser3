//import ZeTokenizer, {
let {
  $CRLF,
  $ERROR,
  $NL,
  $STRING_SINGLE,
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

//import string_body from './string_body';
let string_body = require('./string_body'); // Λλ
let strings_single = string_body.slice(0);

// these test should happen for all string tests but it's just far easier to put them here than make it generic
strings_single.push(
  [`Λ a " b λ`, $STRING_SINGLE],
  [`Λ a " b " c λ`, $STRING_SINGLE],
  [`Λ a \\" b λ`, $STRING_SINGLE],
  [`Λ a \\" b \\" c λ`, $STRING_SINGLE],
  //[`Λ a ' b λ`, $STRING_SINGLE],
  //[`Λ a ' b ' c λ`, $STRING_SINGLE],
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

strings_single = strings_single.map(([inputs, ...rest]) => {
  let input = (typeof inputs === 'string' ? `${inputs.replace(/Λ|λ/g, '\'')}` : inputs.map(s => `${s.replace(/Λ|λ/g, '\'')}`));
  return [input, ...rest];
});

//export default strings_single;
module.exports = strings_single;
