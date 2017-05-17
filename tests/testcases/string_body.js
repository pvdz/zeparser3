// these cases are "unboxed" string test cases. that means these tests are only
// bodies that still need a single quote, double quote, or backtick wrapper.
// this way we can generate the same series of tests for six different situations
// (single quote, double quote, backtick wrap, backtick head, backtick middle, backtick tail)


//import {
let {
  PASS,
  FAIL,
  MODE_MODULE,
  MODE_SCRIPT,
  USE_SLOPPY_MODE,
  USE_STRICT_MODE,
  PARSE_MODE_DIV,
  PARSE_MODE_REGEX,
} = require('../utils');
//} from './utils';

//import ZeTokenizer, {
let { ZeTokenizer,
  //$ASI, // determined by parser
  $COMMENT,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $CRLF,
  $EOF,
  $ERROR,
  $IDENT,
  $NL,
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
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
  $WHITE,

  GOAL_MODULE,
  GOAL_SCRIPT,

  STRICT_MODE,
  SLOPPY_MODE,

  DIV,
  REX,

  debug_toktype,
} = require('../../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

let string_body = [
  // all string test should cover the same tests so the delimiter (single quote, double quote, etc) are marked
  // with a lambda. the start is upper case (Λ) and end lower case (λ). We make the distinction for the template
  // tests (`...${) which may use different delimiters for each side.

  // simple single quoted strings
  [`Λλ`, $STRING_SINGLE, 'empty string'],
  [`Λsome contentλ`, $STRING_SINGLE],
  [`Λvarλ`, $STRING_SINGLE, 'keyword'],
  [`Λx / yλ`, $STRING_SINGLE, 'forward slash'],

  // add these cases manually to individual test files because it's too much work to generalize them
  //[`Λ a " b λ`, $STRING_SINGLE],
  //[`Λ a " b " c λ`, $STRING_SINGLE],
  //[`Λ a ' b λ`, $STRING_SINGLE],
  //[`Λ a ' b ' c λ`, $STRING_SINGLE],
  //["Λ a ` b λ", $STRING_SINGLE],
  //["Λ a ` b ` c λ", $STRING_SINGLE],

  [[`Λ\\\nλ`, `Λpre\\\nλ`, `Λ\\\npostλ`, `Λpre\\\npostλ`], $STRING_SINGLE, 'line continuations are okay'],
  [[`Λ\\\rλ`, `Λpre\\\rλ`, `Λ\\\rpostλ`, `Λpre\\\rpostλ`], $STRING_SINGLE, 'line continuations are okay'],
  [[`Λ\\\r\nλ`, `Λpre\\\r\nλ`, `Λ\\\r\npostλ`, `Λpre\\\r\npostλ`], $STRING_SINGLE, 'line continuations are okay and crlf is considered one newline, not two, so it can be line-continuation-escaped like this'],

  // unfinished strings

  [`Λ`, $ERROR, 'unclosed empty string literal', 'suffixsp'],
  [`Λfoo`, $ERROR, 'unclosed string literal', 'suffixsp'],

  // escape tests

  [[`Λ\\'λ`, `Λ\\"λ`, `Λ\\\\λ`, `Λ\\bλ`, `Λ\\fλ`, `Λ\\nλ`, `Λ\\rλ`, `Λ\\tλ`, `Λ\\vλ`], $STRING_SINGLE],
  [[`Λprefix \\'λ`, `Λprefix\\"λ`, `Λprefix\\\\λ`, `Λprefix\\bλ`, `Λprefix\\fλ`, `Λprefix\\nλ`, `Λprefix\\rλ`, `Λprefix\\tλ`, `Λprefix\\vλ`], $STRING_SINGLE],
  [[`Λ\\'suffixλ`, `Λ\\"suffixλ`, `Λ\\\\suffixλ`, `Λ\\bsuffixλ`, `Λ\\fsuffixλ`, `Λ\\nsuffixλ`, `Λ\\rsuffixλ`, `Λ\\tsuffixλ`, `Λ\\vsuffixλ`], $STRING_SINGLE],
  [[`Λ\\Pλ`, `Λprefix\\Qλ`, `Λ\\Rsuffixλ`], $STRING_SINGLE, 'not really an escape but valid nonetheless'],
  [[`Λ\\r\\nλ`, `Λprefix\\r\\nλ`, `Λ\\r\\nsuffixλ`, `Λ\\rinfix\\nsuffixλ`], $STRING_SINGLE],

  [[`Λ\\u0123λ`, `Λ\\u4567λ`, `Λ\\u89abλ`, `Λ\\ucdefλ`, `Λ\\uABCDλ`, `Λ\\uDE00λ`], $STRING_SINGLE],
  [`Λprefix \\u0123λ`, $STRING_SINGLE],
  [`Λ\\u0123 postfixλ`, $STRING_SINGLE],
  [`Λ\\u0123\\u4567λ`, $STRING_SINGLE],
  [[`Λ\\ufailλ`, `Λ\\uafailλ`, `Λ\\u0failλ`, `Λ\\uxxxxλ`], $ERROR, 'unicode escapes with invalid content'],
  [[`Λ\\uλ`, `Λ\\uaλ`, `Λ\\uabλ`, `Λ\\uabcλ`], $ERROR, 'incomplete unicode escapes'],
  [[`Λ\\u`, `Λ\\ua`, `Λ\\uab`, `Λ\\uabc`], $ERROR, 'unclosed strings with incomplete unicode escapes', 'suffixsp'],

  [[`Λ\\u{0123}λ`, `Λ\\u{4567}λ`, `Λ\\u{89abc}λ`, `Λ\\u{defAB}λ`, `Λ\\u{CDEF}λ`], $STRING_SINGLE],
  [`Λprefix \\u{012345}λ`, $STRING_SINGLE],
  [`Λ\\u{012345} postfixλ`, $STRING_SINGLE],
  [`Λ\\u{012345}\\u{6789a}λ`, $STRING_SINGLE],
  [[`Λ\\u{}λ`, `Λ\\u{fail}λ`, `Λ\\u{afail}λ`, `Λ\\u{0fail}λ`, `Λ\\u{xxxx}λ`], $ERROR, 'long unicode escape bad contents'],
  [[`Λ\\u{λ`, `Λ\\u{aλ`, `Λ\\u{afλ`, `Λ\\u{012λ`, `Λ\\u{01234λ`, `Λ\\u{012345λ`], $ERROR, 'unclosed long unicode escapes'],
  [[`Λ\\u{1}λ`, `Λ\\u{12}λ`, `Λ\\u{123}λ`, `Λ\\u{1234}λ`, `Λ\\u{12345}λ`, `Λ\\u{103456}λ`], $STRING_SINGLE, 'incomplete long unicode escapes'],
  [[`Λ\\u{`, `Λ\\u{a`, `Λ\\u{af`, `Λ\\u{123`, `Λ\\u{1234`, `Λ\\u{12345`, `Λ\\u{103456`], $ERROR, 'incomplete long unicode escapes in unclosed string', 'suffixsp'],

  [`Λ\\u{10ffff}λ`, $STRING_SINGLE, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`Λ\\u{110000}λ`, $ERROR, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`Λ\\u{0000000000000000000010ffff}λ`, $STRING_SINGLE, 'must take care that the hex may still have any number of leading zeroes'],
  [`Λ\\u{00000000000000000000110000}λ`, $ERROR, 'must take care that the hex may still have any number of leading zeroes'],

  // legacy octal (can parse multiple octal digits but no more such that the sum exceeds 255)

  [`Λ\\0λ`, $STRING_SINGLE, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'include a NUL byte (legal in both modes, the only exception)'],
  // single digit
  [[`Λ\\1λ`, `Λ\\2λ`, `Λ\\3λ`, `Λ\\4λ`, `Λ\\5λ`, `Λ\\6λ`, `Λ\\7λ`], $ERROR, USE_STRICT_MODE, 'octal escape illegal in strict mode'],
  [[`Λ\\1λ`, `Λ\\2λ`, `Λ\\3λ`, `Λ\\4λ`, `Λ\\5λ`, `Λ\\6λ`, `Λ\\7λ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'OctalDigit [lookahead ∉ OctalDigit]'],
  [[`Λ\\1aλ`, `Λ\\2bλ`, `Λ\\3cλ`, `Λ\\48λ`, `Λ\\5*λ`, `Λ\\6 λ`, `Λ\\7\\\nλ`], $ERROR, USE_STRICT_MODE, 'octal escape with non octal'],
  [[`Λ\\1aλ`, `Λ\\2bλ`, `Λ\\3cλ`, `Λ\\48λ`, `Λ\\5*λ`, `Λ\\6 λ`, `Λ\\7\\\nλ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'octal escape with non octal'],
  [[`Λ\\0`, `Λ\\1`, `Λ\\2`, `Λ\\3`, `Λ\\4`, `Λ\\5`, `Λ\\6`, `Λ\\7`, `Λ\\8`, `Λ\\9`], $ERROR, [USE_SLOPPY_MODE, USE_STRICT_MODE], 'octal escape unclosed string', 'suffixsp'],
  [[`Λ\\8λ`, `Λ\\9λ`, `Λ\\8`, `Λ\\9`, `Λ\\8a`, `Λ\\9b`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'non-octal-digit-escape is never legal', 'suffixsp'], // browsers and node do allow this... some even in strict mode.
  // double octal starting with 0 1 2 3 (parsed as up to three digits as long as they are all octal)
  [[`Λ\\00λ`, `Λ\\01λ`, `Λ\\02λ`, `Λ\\10λ`, `Λ\\11λ`, `Λ\\12λ`, `Λ\\20λ`, `Λ\\21λ`, `Λ\\22λ`, `Λ\\30λ`, `Λ\\31λ`, `Λ\\32λ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (end of string)'],
  [[`Λ\\00λ`, `Λ\\01λ`, `Λ\\02λ`, `Λ\\10λ`, `Λ\\11λ`, `Λ\\12λ`, `Λ\\20λ`, `Λ\\21λ`, `Λ\\22λ`, `Λ\\30λ`, `Λ\\31λ`, `Λ\\32λ`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (end of string)'],
  [[`Λ\\008λ`, `Λ\\019λ`, `Λ\\02aλ`, `Λ\\10rλ`, `Λ\\11tλ`, `Λ\\12 λ`, `Λ\\20\\nλ`, `Λ\\21eλ`, `Λ\\22fλ`, `Λ\\30Gλ`, `Λ\\31\\\nλ`, `Λ\\32/λ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (other character/high digit)'],
  [[`Λ\\008λ`, `Λ\\019λ`, `Λ\\02aλ`, `Λ\\10rλ`, `Λ\\11tλ`, `Λ\\12 λ`, `Λ\\20\\nλ`, `Λ\\21eλ`, `Λ\\22fλ`, `Λ\\30Gλ`, `Λ\\31\\\nλ`, `Λ\\32/λ`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (other character/high digit)'],
  [[`Λ\\00`, `Λ\\01`, `Λ\\02`, `Λ\\10`, `Λ\\11`, `Λ\\12`, `Λ\\20`, `Λ\\21`, `Λ\\22`, `Λ\\30`, `Λ\\31`, `Λ\\32`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (eol/eof)', 'suffixsp'],
  // double octal starting with 4 5 6 7 (never parsed as three digits)
  [[`Λ\\40λ`, `Λ\\51λ`, `Λ\\62λ`, `Λ\\73λ`, `Λ\\44λ`, `Λ\\55λ`, `Λ\\66λ`, `Λ\\66λ`, `Λ\\77λ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'FourToSeven OctalDigit end of string'],
  [[`Λ\\40λ`, `Λ\\51λ`, `Λ\\62λ`, `Λ\\73λ`, `Λ\\44λ`, `Λ\\55λ`, `Λ\\66λ`, `Λ\\66λ`, `Λ\\77λ`], $ERROR, USE_STRICT_MODE, 'FourToSeven OctalDigit end of string'],
  [[`Λ\\409λ`, `Λ\\511λ`, `Λ\\62aλ`, `Λ\\73Xλ`, `Λ\\44\\\'λ`, `Λ\\55-λ`, `Λ\\66*λ`, `Λ\\66 λ`, `Λ\\77\\\nλ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'FourToSeven OctalDigit other char'],
  [[`Λ\\409λ`, `Λ\\511λ`, `Λ\\62aλ`, `Λ\\73Xλ`, `Λ\\55-λ`, `Λ\\66*λ`, `Λ\\66 λ`, `Λ\\77\\\nλ`], $ERROR, USE_STRICT_MODE, 'FourToSeven OctalDigit other char'],
  [`Λ\\44\\λ`, $ERROR, USE_STRICT_MODE, 'FourToSeven OctalDigit other char', 'suffixsp'],
  [[`Λ\\40`, `Λ\\51`, `Λ\\62`, `Λ\\73`, `Λ\\44`, `Λ\\55`, `Λ\\66`, `Λ\\67`, `Λ\\76`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'FourToSeven OctalDigit eol/eof', 'suffixsp'],
  // triple octals
  [[`Λ\\000λ`, `Λ\\012λ`, `Λ\\023λ`, `Λ\\104λ`, `Λ\\115λ`, `Λ\\126λ`, `Λ\\207λ`, `Λ\\210λ`, `Λ\\221λ`, `Λ\\302λ`, `Λ\\313λ`, `Λ\\324λ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (end of string)'],
  [[`Λ\\000λ`, `Λ\\012λ`, `Λ\\023λ`, `Λ\\104λ`, `Λ\\115λ`, `Λ\\126λ`, `Λ\\207λ`, `Λ\\210λ`, `Λ\\221λ`, `Λ\\302λ`, `Λ\\313λ`, `Λ\\324λ`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (end of string)'],
  [[`Λ\\0008λ`, `Λ\\0121λ`, `Λ\\023aλ`, `Λ\\104Xλ`, `Λ\\115 λ`, `Λ\\126\\\nλ`, `Λ\\207\tλ`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (other character/high digit)'],
  [[`Λ\\0008λ`, `Λ\\0121λ`, `Λ\\023aλ`, `Λ\\104Xλ`, `Λ\\115 λ`, `Λ\\126\\\nλ`, `Λ\\207\tλ`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (other character/high digit)'],
  [[`Λ\\000`, `Λ\\012`, `Λ\\023`, `Λ\\104`, `Λ\\115`, `Λ\\126`, `Λ\\207`, `Λ\\210`, `Λ\\221`, `Λ\\302`, `Λ\\313`, `Λ\\324`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'ZeroToThreeOctalDigit OctalDigit OctalDigit (eol/eof)', 'suffixsp'],

  // hex digits
  [[`Λ\\x00λ`, `Λ\\x12λ`, `Λ\\x34λ`, `Λ\\x56λ`, `Λ\\x78λ`, `Λ\\x9aλ`, `Λ\\xAbλ`, `Λ\\xBcλ`, `Λ\\xCdλ`, `Λ\\xDeλ`, `Λ\\xEfλ`, `Λ\\xF0λ`], $STRING_SINGLE],
  [[`Λ\\x000λ`, `Λ\\x128λ`, `Λ\\x34aλ`, `Λ\\x56Xλ`, `Λ\\x78{λ`, `Λ\\x9a\\\nλ`, `Λ\\xAb\tλ`, `Λ\\xBc λ`, `Λ\\xCd#λ`, `Λ\\xDe\\x00λ`, `Λ\\xEfokλ`, `Λpre\\xF0λ`], $STRING_SINGLE, 'followed by something else'],
  [[`Λ\\x0λ`, `Λ\\x1λ`, `Λ\\x2λ`, `Λ\\x3λ`, `Λ\\x4λ`, `Λ\\x5λ`, `Λ\\x6λ`, `Λ\\x7λ`, `Λ\\x8λ`, `Λ\\x9λ`, `Λ\\xaλ`, `Λ\\xbλ`, `Λ\\xcλ`, `Λ\\xdλ`, `Λ\\xeλ`, `Λ\\xfλ`, `Λ\\xAλ`, `Λ\\xBλ`, `Λ\\xCλ`, `Λ\\xDλ`, `Λ\\xEλ`, `Λ\\xFλ`], $ERROR, 'incomplete hex at end of string'],
  [[`Λ\\x0`, `Λ\\x1`, `Λ\\x2`, `Λ\\x3`, `Λ\\x4`, `Λ\\x5`, `Λ\\x6`, `Λ\\x7`, `Λ\\x8`, `Λ\\x9`, `Λ\\xa`, `Λ\\xb`, `Λ\\xc`, `Λ\\xd`, `Λ\\xe`, `Λ\\xf`, `Λ\\xA`, `Λ\\xB`, `Λ\\xC`, `Λ\\xD`, `Λ\\xE`, `Λ\\xF`], $ERROR, 'incomplete hex at eol/eof', 'suffixsp'],
  [`Λ\\xλ`, $ERROR, 'incomplete hex escape at end of string'],
  [`Λ\\x`, $ERROR, 'incomplete hex escape at end of eol / eof', 'suffixsp'],
  [[`Λ\\xq0λ`, `Λ\\xq1λ`, `Λ\\xq2λ`, `Λ\\xq3λ`, `Λ\\xq4λ`, `Λ\\xq5λ`, `Λ\\xq6λ`, `Λ\\xq7λ`, `Λ\\xq8λ`, `Λ\\xq9λ`, `Λ\\xqaλ`, `Λ\\xqbλ`, `Λ\\xqcλ`, `Λ\\xqdλ`, `Λ\\xqeλ`, `Λ\\xqfλ`, `Λ\\xqAλ`, `Λ\\xqBλ`, `Λ\\xqCλ`, `Λ\\xqDλ`, `Λ\\xqEλ`, `Λ\\xqFλ`], $ERROR, 'incomplete hex character 1'],
  [[`Λ\\x0qλ`, `Λ\\x1qλ`, `Λ\\x2qλ`, `Λ\\x3qλ`, `Λ\\x4qλ`, `Λ\\x5qλ`, `Λ\\x6qλ`, `Λ\\x7qλ`, `Λ\\x8qλ`, `Λ\\x9qλ`, `Λ\\xaqλ`, `Λ\\xbqλ`, `Λ\\xcqλ`, `Λ\\xdqλ`, `Λ\\xeqλ`, `Λ\\xfqλ`, `Λ\\xAqλ`, `Λ\\xBqλ`, `Λ\\xCqλ`, `Λ\\xDqλ`, `Λ\\xEqλ`, `Λ\\xFqλ`], $ERROR, 'incomplete hex character 2'],

  // templates
  [[`Λ$λ`, `Λ aaa $λ`, `Λ$ bbb λ`, `Λ aaa $ bbb λ`], $STRING_SINGLE, 'dollar baiting for template strings'],
  [[`Λ$`, `Λ aaa $`, `Λ$ bbb `, `Λ aaa $ bbb `], $ERROR, 'dollar baiting eol/eof', 'suffixsp'],
  [[`Λ{λ`, `Λ aaa {λ`, `Λ{ bbb λ`, `Λ aaa { bbb λ`], $STRING_SINGLE, 'open curly baiting for template strings'],
  [[`Λ{`, `Λ aaa {`, `Λ{ bbb `, `Λ aaa { bbb `], $ERROR, 'open curly baiting eol/eof', 'suffixsp'],
  [[`Λ}λ`, `Λ aaa }λ`, `Λ} bbb λ`, `Λ aaa } bbb λ`], $STRING_SINGLE, 'closing curly baiting for template strings'],
  [[`Λ}`, `Λ aaa }`, `Λ} bbb `, `Λ aaa } bbb `], $ERROR, 'closing curly baiting eol/eof', 'suffixsp'],
];

//export default string_body;
module.exports = string_body;
