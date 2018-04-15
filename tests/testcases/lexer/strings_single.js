let {
  $CRLF,
  $ERROR,
  $NL,
  $STRING_SINGLE,
} = require('../../../src/zetokenizer');

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

strings_single = strings_single.map(([inputs, outs, desc, ...rest]) => {
  let input = (typeof inputs === 'string' ? `${inputs.replace(/Λ|λ/g, '\'')}` : inputs.map(s => `${s.replace(/Λ|λ/g, '\'')}`));
  // desc = '<single string> ' + desc;
  return [input, outs, desc, ...rest];
});

module.exports = strings_single;
