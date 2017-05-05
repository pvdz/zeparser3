#!/usr/bin/env node

// [input:str|str[], output:num|num[], [mode:flag|flags[]=0], [desc:str], [skipVersion:string|string[]='']
// (mode is a constant defined below, like script-type, regexDiv, strict mode, etc)
// if mode is not given, both sloppy and strict mode are tested
// desc is required when skipVersion is used
// if input is an array, all inputs should match the same output
// if output is an array, input should yield multiple (those) tokens

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
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

let PASS = true;
let FAIL = false;
let MODE_MODULE = 0;
let MODE_SCRIPT = 1;
let USE_SLOPPY_MODE = 0;
let USE_STRICT_MODE = 2;
let SLASH_DIV = 0;
let SLASH_REGEX = 3;

let whitespaces = [
  [' ', $SPACE],
  ['\t', $TAB],
  ['\xA0', $WHITE, 'non breaking space'],
  ['\uFEFF', $WHITE, 'BOM is a space'],
  ['\r', $NL],
  ['\n', $NL],
  ['\r\n', $CRLF, 'considered one for line reporting'],
  ['\u2028', $NL, 'line separator is a newline'],
  ['\u2029', $NL, 'paragraph separator is a newline'],
];
let comments = [
  ['//', $COMMENT_SINGLE, 'empty', 'suffixsp'],
  ['// foo', $COMMENT_SINGLE, 'simple comment', 'suffixsp'],
  ['// foo\n', [$COMMENT_SINGLE, $NL], 'comments usually end with newline', 'suffixsp'],
  ['// /', $COMMENT_SINGLE, 'slash in the comment', 'suffixsp'],
  ['// */ oh noes', $COMMENT_SINGLE, 'multi comment end should not end the single line', 'suffixsp'],
  ['// /* */ oh noes', $COMMENT_SINGLE, 'multi comment inside single line comment should not end the single line', 'suffixsp'],
  ['//\\n \\r \\x0a \\u000a still comment', $COMMENT_SINGLE, 'escaped newlines are ignored', 'suffixsp'],
  ['//\\unope \\u{nope} \\xno ', $COMMENT_SINGLE, 'malformed escape is ignored', 'suffixsp'],

  ['/**/', $COMMENT_MULTI],
  ['/* comment */', $COMMENT_MULTI],
  ['/* \n */', $COMMENT_MULTI, 'includes newline'],
  ['/* \n\n\n */', $COMMENT_MULTI, 'includes newlines'],
  ['/* \\n \\r \\x0a \\u000a */', $COMMENT_MULTI, 'ignores escaped newlines'],
  ['/* /* */', $COMMENT_MULTI, 'ignores anything until closer'],
  ['/* /* */ */', [$COMMENT_MULTI, $SPACE, $PUNCTUATOR, $PUNCTUATOR], SLASH_DIV, 'cant be nested (and the tokenizer doenst throw semantic errors)'],
  ['/* \\u{nope} \\unope \\xno */', $COMMENT_MULTI, 'dont check correctness of escapes'],
];
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
  ['!', $ERROR],
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
  ['/', $PUNCTUATOR, SLASH_DIV],
  ['/=', $PUNCTUATOR, SLASH_DIV],
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
let numbers = [
  // "The SourceCharacter immediately following a NumericLiteral must not be an IdentifierStart or DecimalDigit."

  [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], $NUMBER_DEC],
  [['10', '21', '32', '43', '54', '65', '76', '87', '98', '19'], $NUMBER_DEC],
  [['123', '456', '7890'], $NUMBER_DEC],
  ['1234567890', $NUMBER_DEC],

  [['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9'], $NUMBER_DEC],
  [['.10', '.21', '.32', '.43', '.54', '.65', '.76', '.87', '.98', '.19'], $NUMBER_DEC],
  [['.123', '.456', '.7890'], $NUMBER_DEC],
  ['.1234567890', $NUMBER_DEC],
  ['.0000', $NUMBER_DEC],

  [['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.'], $NUMBER_DEC],
  [['10.', '21.', '32.', '43.', '54.', '65.', '76.', '87.', '98.', '19.'], $NUMBER_DEC],
  [['123.', '456.', '7890.'], $NUMBER_DEC],
  ['1234567890.', $NUMBER_DEC],

  [['1.2', '2.3', '3.4', '4.5', '5.6', '6.7', '7.8', '8.9', '9.10'], $NUMBER_DEC],
  [['10.23', '21.45', '32.56', '43.78', '54.98', '65.91', '76.05', '87.04', '98.54', '19.37'], $NUMBER_DEC],
  [['123.012', '456.345', '7890.6789'], $NUMBER_DEC],
  ['1234567890.0987654321', $NUMBER_DEC],

  // with exponent

  [['0e1', '1e2', '2e3', '3e4', '4e5', '5e6', '6e7', '7e8', '8e9', '9e0'], $NUMBER_DEC],
  [['10e10', '21e21', '32e32', '43e43', '54e54', '65e65', '76e79', '87e87', '98e98', '19e19'], $NUMBER_DEC],
  [['123e123', '456e456', '7890e789'], $NUMBER_DEC],
  ['1234567890e1234567890', $NUMBER_DEC],

  [['.0E10', '.1E23', '.2E0', '.3E4', '.4E78', '.5E00', '.6E75', '.7E54', '.8E77', '.9E14'], $NUMBER_DEC],
  [['.10E1', '.21E2', '.32E3', '.43E4', '.54E5', '.65E6', '.76E7', '.87E8', '.98E9', '.19E0'], $NUMBER_DEC],

  [['0e-100', '1e-100'], $NUMBER_DEC],
  [['0E-100', '1E-100'], $NUMBER_DEC],
  [['0.e-100', '1.e-100'], $NUMBER_DEC],
  [['0.E-100', '1.E-100'], $NUMBER_DEC],
  [['0.1e-100', '1.1e-100'], $NUMBER_DEC],
  [['0.1E-100', '1.1E-100'], $NUMBER_DEC],
  [['.0e-100', '.1e-100'], $NUMBER_DEC],
  [['.0E-100', '.1E-100'], $NUMBER_DEC],

  [['0e+100', '1e+100'], $NUMBER_DEC],
  [['0E+100', '1E+100'], $NUMBER_DEC],
  [['0.e+100', '1.e+100'], $NUMBER_DEC],
  [['0.E+100', '1.E+100'], $NUMBER_DEC],
  [['0.1e+100', '1.1e+100'], $NUMBER_DEC],
  [['0.1E+100', '1.1E+100'], $NUMBER_DEC],
  [['.0e+100', '.1e+100'], $NUMBER_DEC],
  [['.0E+100', '.1E+100'], $NUMBER_DEC],

  // next: hex, new octal, new bin

  [['0x1234567890abcdefABCEF', '0X1234567890abcdefABCEF'], $NUMBER_HEX],
  [['0x0', '0x1', '0x2', '0x3', '0x4', '0x5', '0x6', '0x7', '0x8', '0x9', '0xa', '0xA', '0xb', '0xB', '0xc', '0xC', '0xd', '0xD', '0xe', '0xE', '0xf', '0xF'], $NUMBER_HEX],
  [['0x01', '0x12', '0x23', '0x34', '0x45', '0x56', '0x67', '0x78', '0x89', '0x9a', '0xab', '0xAc', '0xbd', '0xBe', '0xcf', '0xC0', '0xd1', '0xD2', '0xe3', '0xE4', '0xf5', '0xF6'], $NUMBER_HEX],
  [['0o12345670', '0O12345670'], $NUMBER_OCT],
  [['0o0', '0o1', '0o2', '0o3', '0o4', '0o5', '0o6', '0o7'], $NUMBER_OCT],
  [['0o01', '0o12', '0o23', '0o34', '0o45', '0o56', '0o67', '0o70'], $NUMBER_OCT],
  [['0b10', '0B10'], $NUMBER_BIN],
  [['0b0', '0b1', '0b00', '0b11', '0b01', '0b10'], $NUMBER_BIN],

  // legacy octal tests

  ['0123', $NUMBER_OLD, USE_SLOPPY_MODE, 'legacy octal representation, only okay without strict mode'],
  ['0123', $ERROR, USE_STRICT_MODE, 'legacy octal is error in strict mode'],

  [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'], $NUMBER_OLD, USE_SLOPPY_MODE, 'legacy decimal starting with zero, only okay without strict mode'],
  [['000', '010', '021', '032', '043', '054', '065', '076', '087', '098'], $NUMBER_OLD, USE_SLOPPY_MODE, 'legacy decimal starting with zero, only okay without strict mode'],
  [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'], $ERROR, USE_STRICT_MODE, 'legacy decimal starting with zero is error in strict mode'],
  [['000', '010', '021', '032', '043', '054', '065', '076', '087', '098'], $ERROR, USE_STRICT_MODE, 'legacy decimal starting with zero is error in strict mode'],
];
let strings_single = [
  // note: single and double quoted strings have identical tests, except quotes are mirrored. alwyas keep them in sync

  // simple single quoted strings
  [`''`, $STRING_SINGLE],
  [`'some content'`, $STRING_SINGLE],
  [`'var'`, $STRING_SINGLE, 'keyword'],
  [`'x / y'`, $STRING_SINGLE, 'forward slash'],
  [`'with quote " without end'`, $STRING_SINGLE],
  [`'with quote " and close " quote'`, $STRING_SINGLE],
  ["'with backtick ` without end'", $STRING_SINGLE],
  ["'with backtick ` and close ` tick'", $STRING_SINGLE],

  [[`'\\\n'`, `'pre\\\n'`, `'\\\npost'`, `'pre\\\npost'`], $STRING_SINGLE, 'line continuations are okay'],
  [[`'\\\r'`, `'pre\\\r'`, `'\\\rpost'`, `'pre\\\rpost'`], $STRING_SINGLE, 'line continuations are okay'],
  [[`'\\\r\n'`, `'pre\\\r\n'`, `'\\\r\npost'`, `'pre\\\r\npost'`], $STRING_SINGLE, 'line continuations are okay and crlf is considered one newline, not two, so it can be line-continuation-escaped like this'],

  // unfinished strings

  [`'`, $ERROR, 'unclosed empty string literal', 'suffixsp'],
  [`'foo`, $ERROR, 'unclosed string literal', 'suffixsp'],
  [`'\n'`, [$ERROR, $NL, $ERROR], 'newlines are never allowed in regular strings', 'suffixsp'],
  [`'\r'`, [$ERROR, $NL, $ERROR], 'newlines are never allowed in regular strings', 'suffixsp'],
  [`'\r\n'`, [$ERROR, $CRLF, $ERROR], 'newlines are never allowed in regular strings', 'suffixsp'],

  // escape tests

  [[`'\\''`, `'\\"'`, `'\\\\'`, `'\\b'`, `'\\f'`, `'\\n'`, `'\\r'`, `'\\t'`, `'\\v'`], $STRING_SINGLE],
  [[`'prefix \\''`, `'prefix\\"'`, `'prefix\\\\'`, `'prefix\\b'`, `'prefix\\f'`, `'prefix\\n'`, `'prefix\\r'`, `'prefix\\t'`, `'prefix\\v'`], $STRING_SINGLE],
  [[`'\\'suffix'`, `'\\"suffix'`, `'\\\\suffix'`, `'\\bsuffix'`, `'\\fsuffix'`, `'\\nsuffix'`, `'\\rsuffix'`, `'\\tsuffix'`, `'\\vsuffix'`], $STRING_SINGLE],
  [[`'\\P'`, `'prefix\\Q'`, `'\\Rsuffix'`], $STRING_SINGLE, 'not really an escape but valid nonetheless'],
  [[`'\\r\\n'`, `'prefix\\r\\n'`, `'\\r\\nsuffix'`, `'\\rinfix\\nsuffix'`], $STRING_SINGLE],

  [[`'\\u0123'`, `'\\u4567'`, `'\\u89ab'`, `'\\ucdef'`, `'\\uABCD'`, `'\\uDE00'`], $STRING_SINGLE],
  [`'prefix \\u0123'`, $STRING_SINGLE],
  [`'\\u0123 postfix'`, $STRING_SINGLE],
  [`'\\u0123\\u4567'`, $STRING_SINGLE],
  [[`'\\ufail'`, `'\\uafail'`, `'\\u0fail'`, `'\\uxxxx'`], $ERROR, 'unicode escapes with invalid content'],
  [[`'\\u'`, `'\\ua'`, `'\\uab'`, `'\\uabc'`], $ERROR, 'incomplete unicode escapes'],
  [[`'\\u`, `'\\ua`, `'\\uab`, `'\\uabc`], $ERROR, 'unclosed strings with incomplete unicode escapes', 'suffixsp'],

  [[`'\\u{0123}'`, `'\\u{4567}'`, `'\\u{89abc}'`, `'\\u{defAB}'`, `'\\u{CDEF}'`], $STRING_SINGLE],
  [`'prefix \\u{012345}'`, $STRING_SINGLE],
  [`'\\u{012345} postfix'`, $STRING_SINGLE],
  [`'\\u{012345}\\u{6789a}'`, $STRING_SINGLE],
  [[`'\\u{}'`, `'\\u{fail}'`, `'\\u{afail}'`, `'\\u{0fail}'`, `'\\u{xxxx}'`], $ERROR, 'long unicode escape bad contents'],
  [[`'\\u{'`, `'\\u{a'`, `'\\u{af'`, `'\\u{012'`, `'\\u{01234'`, `'\\u{012345'`], $ERROR, 'unclosed long unicode escapes'],
  [[`'\\u{1}'`, `'\\u{12}'`, `'\\u{123}'`, `'\\u{1234}'`, `'\\u{12345}'`, `'\\u{103456}'`], $STRING_SINGLE, 'incomplete long unicode escapes'],
  [[`'\\u{`, `'\\u{a`, `'\\u{af`, `'\\u{123`, `'\\u{1234`, `'\\u{12345`, `'\\u{103456`], $ERROR, 'incomplete long unicode escapes in unclosed string', 'suffixsp'],

  [`'\\u{10ffff}'`, $STRING_SINGLE, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`'\\u{110000}'`, $ERROR, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`'\\u{0000000000000000000010ffff}'`, $STRING_SINGLE, 'must take care that the hex may still have any number of leading zeroes'],
  [`'\\u{00000000000000000000110000}'`, $ERROR, 'must take care that the hex may still have any number of leading zeroes'],

  // legacy octal (can parse multiple octal digits but no more such that the sum exceeds 255)

  [`'\\0'`, $STRING_SINGLE, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'include a NUL byte (legal in both modes, the only exception)'],
  // single digit
  [[`'\\1'`, `'\\2'`, `'\\3'`, `'\\4'`, `'\\5'`, `'\\6'`, `'\\7'`], $ERROR, USE_STRICT_MODE, 'octal escape illegal in strict mode'],
  [[`'\\1'`, `'\\2'`, `'\\3'`, `'\\4'`, `'\\5'`, `'\\6'`, `'\\7'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'OctalDigit [lookahead ∉ OctalDigit]'],
  [[`'\\1a'`, `'\\2b'`, `'\\3c'`, `'\\48'`, `'\\5*'`, `'\\6 '`, `'\\7\\\n'`], $ERROR, USE_STRICT_MODE, 'octal escape with non octal'],
  [[`'\\1a'`, `'\\2b'`, `'\\3c'`, `'\\48'`, `'\\5*'`, `'\\6 '`, `'\\7\\\n'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'octal escape with non octal'],
  [[`'\\0`, `'\\1`, `'\\2`, `'\\3`, `'\\4`, `'\\5`, `'\\6`, `'\\7`, `'\\8`, `'\\9`], $ERROR, [USE_SLOPPY_MODE, USE_STRICT_MODE], 'octal escape unclosed string', 'suffixsp'],
  [[`'\\8'`, `'\\9'`, `'\\8`, `'\\9`, `'\\8a`, `'\\9b`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'non-octal-digit-escape is never legal', 'suffixsp'], // browsers and node do allow this... some even in strict mode.
  // double octal starting with 0 1 2 3 (parsed as up to three digits as long as they are all octal)
  [[`'\\00'`, `'\\01'`, `'\\02'`, `'\\10'`, `'\\11'`, `'\\12'`, `'\\20'`, `'\\21'`, `'\\22'`, `'\\30'`, `'\\31'`, `'\\32'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (end of string)'],
  [[`'\\00'`, `'\\01'`, `'\\02'`, `'\\10'`, `'\\11'`, `'\\12'`, `'\\20'`, `'\\21'`, `'\\22'`, `'\\30'`, `'\\31'`, `'\\32'`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (end of string)'],
  [[`'\\008'`, `'\\019'`, `'\\02a'`, `'\\10r'`, `'\\11t'`, `'\\12 '`, `'\\20\\n'`, `'\\21e'`, `'\\22f'`, `'\\30G'`, `'\\31\\\n'`, `'\\32/'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (other character/high digit)'],
  [[`'\\008'`, `'\\019'`, `'\\02a'`, `'\\10r'`, `'\\11t'`, `'\\12 '`, `'\\20\\n'`, `'\\21e'`, `'\\22f'`, `'\\30G'`, `'\\31\\\n'`, `'\\32/'`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (other character/high digit)'],
  [[`'\\00`, `'\\01`, `'\\02`, `'\\10`, `'\\11`, `'\\12`, `'\\20`, `'\\21`, `'\\22`, `'\\30`, `'\\31`, `'\\32`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (eol/eof)', 'suffixsp'],
  // double octal starting with 4 5 6 7 (never parsed as three digits)
  [[`'\\40'`, `'\\51'`, `'\\62'`, `'\\73'`, `'\\44'`, `'\\55'`, `'\\66'`, `'\\66'`, `'\\77'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'FourToSeven OctalDigit end of string'],
  [[`'\\40'`, `'\\51'`, `'\\62'`, `'\\73'`, `'\\44'`, `'\\55'`, `'\\66'`, `'\\66'`, `'\\77'`], $ERROR, USE_STRICT_MODE, 'FourToSeven OctalDigit end of string'],
  [[`'\\409'`, `'\\511'`, `'\\62a'`, `'\\73X'`, `'\\44\\\''`, `'\\55-'`, `'\\66*'`, `'\\66 '`, `'\\77\\\n'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'FourToSeven OctalDigit other char'],
  [[`'\\409'`, `'\\511'`, `'\\62a'`, `'\\73X'`, `'\\55-'`, `'\\66*'`, `'\\66 '`, `'\\77\\\n'`], $ERROR, USE_STRICT_MODE, 'FourToSeven OctalDigit other char'],
  [`'\\44\\'`, $ERROR, USE_STRICT_MODE, 'FourToSeven OctalDigit other char', 'suffixsp'],
  [[`'\\40`, `'\\51`, `'\\62`, `'\\73`, `'\\44`, `'\\55`, `'\\66`, `'\\67`, `'\\76`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'FourToSeven OctalDigit eol/eof', 'suffixsp'],
  // triple octals
  [[`'\\000'`, `'\\012'`, `'\\023'`, `'\\104'`, `'\\115'`, `'\\126'`, `'\\207'`, `'\\210'`, `'\\221'`, `'\\302'`, `'\\313'`, `'\\324'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (end of string)'],
  [[`'\\000'`, `'\\012'`, `'\\023'`, `'\\104'`, `'\\115'`, `'\\126'`, `'\\207'`, `'\\210'`, `'\\221'`, `'\\302'`, `'\\313'`, `'\\324'`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (end of string)'],
  [[`'\\0008'`, `'\\0121'`, `'\\023a'`, `'\\104X'`, `'\\115 '`, `'\\126\\\n'`, `'\\207\t'`], $STRING_SINGLE, USE_SLOPPY_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (other character/high digit)'],
  [[`'\\0008'`, `'\\0121'`, `'\\023a'`, `'\\104X'`, `'\\115 '`, `'\\126\\\n'`, `'\\207\t'`], $ERROR, USE_STRICT_MODE, 'ZeroToThreeOctalDigit OctalDigit OctalDigit (other character/high digit)'],
  [[`'\\000`, `'\\012`, `'\\023`, `'\\104`, `'\\115`, `'\\126`, `'\\207`, `'\\210`, `'\\221`, `'\\302`, `'\\313`, `'\\324`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], 'ZeroToThreeOctalDigit OctalDigit OctalDigit (eol/eof)', 'suffixsp'],

  // hex digits
  [[`'\\x00'`, `'\\x12'`, `'\\x34'`, `'\\x56'`, `'\\x78'`, `'\\x9a'`, `'\\xAb'`, `'\\xBc'`, `'\\xCd'`, `'\\xDe'`, `'\\xEf'`, `'\\xF0'`], $STRING_SINGLE],
  [[`'\\x000'`, `'\\x128'`, `'\\x34a'`, `'\\x56X'`, `'\\x78{'`, `'\\x9a\\\n'`, `'\\xAb\t'`, `'\\xBc '`, `'\\xCd#'`, `'\\xDe\\x00'`, `'\\xEfok'`, `'pre\\xF0'`], $STRING_SINGLE, 'followed by something else'],
  [[`'\\x0'`, `'\\x1'`, `'\\x2'`, `'\\x3'`, `'\\x4'`, `'\\x5'`, `'\\x6'`, `'\\x7'`, `'\\x8'`, `'\\x9'`, `'\\xa'`, `'\\xb'`, `'\\xc'`, `'\\xd'`, `'\\xe'`, `'\\xf'`, `'\\xA'`, `'\\xB'`, `'\\xC'`, `'\\xD'`, `'\\xE'`, `'\\xF'`], $ERROR, 'incomplete hex at end of string'],
  [[`'\\x0`, `'\\x1`, `'\\x2`, `'\\x3`, `'\\x4`, `'\\x5`, `'\\x6`, `'\\x7`, `'\\x8`, `'\\x9`, `'\\xa`, `'\\xb`, `'\\xc`, `'\\xd`, `'\\xe`, `'\\xf`, `'\\xA`, `'\\xB`, `'\\xC`, `'\\xD`, `'\\xE`, `'\\xF`], $ERROR, 'incomplete hex at eol/eof', 'suffixsp'],
  [`'\\x'`, $ERROR, 'incomplete hex escape at end of string'],
  [`'\\x`, $ERROR, 'incomplete hex escape at end of eol / eof', 'suffixsp'],
  [[`'\\xq0'`, `'\\xq1'`, `'\\xq2'`, `'\\xq3'`, `'\\xq4'`, `'\\xq5'`, `'\\xq6'`, `'\\xq7'`, `'\\xq8'`, `'\\xq9'`, `'\\xqa'`, `'\\xqb'`, `'\\xqc'`, `'\\xqd'`, `'\\xqe'`, `'\\xqf'`, `'\\xqA'`, `'\\xqB'`, `'\\xqC'`, `'\\xqD'`, `'\\xqE'`, `'\\xqF'`], $ERROR, 'incomplete hex character 1'],
  [[`'\\x0q'`, `'\\x1q'`, `'\\x2q'`, `'\\x3q'`, `'\\x4q'`, `'\\x5q'`, `'\\x6q'`, `'\\x7q'`, `'\\x8q'`, `'\\x9q'`, `'\\xaq'`, `'\\xbq'`, `'\\xcq'`, `'\\xdq'`, `'\\xeq'`, `'\\xfq'`, `'\\xAq'`, `'\\xBq'`, `'\\xCq'`, `'\\xDq'`, `'\\xEq'`, `'\\xFq'`], $ERROR, 'incomplete hex character 2'],
];
let strings_double = [
  // note: single and double quoted strings have identical tests, except quotes are mirrored. alwyas keep them in sync

  // simple double quoted strings
  [`""`, $STRING_DOUBLE],
  [`"some content"`, $STRING_DOUBLE],
  [`"var"`, $STRING_DOUBLE, "keyword"],
  [`"x / y"`, $STRING_DOUBLE, "forward slash"],
  [`"with quote ' without end"`, $STRING_DOUBLE],
  [`"with quote ' and close ' quote"`, $STRING_DOUBLE],
  ['"with backtick ` without end"', $STRING_DOUBLE],
  ['"with backtick ` and close ` tick"', $STRING_DOUBLE],

  [`"\\\n"`, $STRING_DOUBLE, "line continuations are okay"],
  [`"\\\r"`, $STRING_DOUBLE, "line continuations are okay"],
  [`"\\\r\n"`, $STRING_DOUBLE, "line continuations are okay and crlf is considered one newline, not two, so it can be line-continuation-escaped like this"],

  // unfinished strings

  [`"`, $ERROR, "unclosed empty string literal", "suffixsp"],
  [`"foo`, $ERROR, "unclosed string literal", "suffixsp"],
  [`"\n"`, [$ERROR, $NL, $ERROR], "newlines are never allowed in regular strings", "suffixsp"],
  [`"\r"`, [$ERROR, $NL, $ERROR], "newlines are never allowed in regular strings", "suffixsp"],
  [`"\r\n"`, [$ERROR, $CRLF, $ERROR], "newlines are never allowed in regular strings", "suffixsp"],

  // escape tests

  [[`"\\""`, `"\\'"`, `"\\\\"`, `"\\b"`, `"\\f"`, `"\\n"`, `"\\r"`, `"\\t"`, `"\\v"`], $STRING_DOUBLE],
  [[`"prefix \\""`, `"prefix\\'"`, `"prefix\\\\"`, `"prefix\\b"`, `"prefix\\f"`, `"prefix\\n"`, `"prefix\\r"`, `"prefix\\t"`, `"prefix\\v"`], $STRING_DOUBLE],
  [[`"\\"suffix"`, `"\\'suffix"`, `"\\\\suffix"`, `"\\bsuffix"`, `"\\fsuffix"`, `"\\nsuffix"`, `"\\rsuffix"`, `"\\tsuffix"`, `"\\vsuffix"`], $STRING_DOUBLE],
  [[`"\\P"`, `"prefix\\Q"`, `"\\Rsuffix"`], $STRING_DOUBLE, "not really an escape but valid nonetheless"],
  [[`"\\r\\n"`, `"prefix\\r\\n"`, `"\\r\\nsuffix"`, `"\\rinfix\\nsuffix"`], $STRING_DOUBLE],

  [[`"\\u0123"`, `"\\u4567"`, `"\\u89ab"`, `"\\ucdef"`, `"\\uABCD"`, `"\\uDE00"`], $STRING_DOUBLE],
  [`"prefix \\u0123"`, $STRING_DOUBLE],
  [`"\\u0123 postfix"`, $STRING_DOUBLE],
  [`"\\u0123\\u4567"`, $STRING_DOUBLE],
  [[`"\\ufail"`, `"\\uafail"`, `"\\u0fail"`, `"\\uxxxx"`], $ERROR, "unicode escapes with invalid content"],
  [[`"\\u"`, `"\\ua"`, `"\\uab"`, `"\\uabc"`], $ERROR, "incomplete unicode escapes"],
  [[`"\\u`, `"\\ua`, `"\\uab`, `"\\uabc`], $ERROR, "unclosed strings with incomplete unicode escapes", "suffixsp"],

  [[`"\\u{0123}"`, `"\\u{4567}"`, `"\\u{89abc}"`, `"\\u{defAB}"`, `"\\u{CDEF}"`], $STRING_DOUBLE],
  [`"prefix \\u{012345}"`, $STRING_DOUBLE],
  [`"\\u{012345} postfix"`, $STRING_DOUBLE],
  [`"\\u{012345}\\u{6789a}"`, $STRING_DOUBLE],
  [[`"\\u{}"`, `"\\u{fail}"`, `"\\u{afail}"`, `"\\u{0fail}"`, `"\\u{xxxx}"`], $ERROR, "long unicode escape bad contents"],
  [[`"\\u{"`, `"\\u{a"`, `"\\u{af"`, `"\\u{012"`, `"\\u{01234"`, `"\\u{012345"`], $ERROR, "unclosed long unicode escapes"],
  [[`"\\u{1}"`, `"\\u{12}"`, `"\\u{123}"`, `"\\u{1234}"`, `"\\u{12345}"`, `"\\u{103456}"`], $STRING_DOUBLE, "incomplete long unicode escapes"],
  [[`"\\u{`, `"\\u{a`, `"\\u{af`, `"\\u{123`, `"\\u{1234`, `"\\u{12345`, `"\\u{103456`], $ERROR, "incomplete long unicode escapes in unclosed string", "suffixsp"],

  [`"\\u{10ffff}"`, $STRING_DOUBLE, "It is a Syntax Error if the MV of HexDigits > 1114111."],
  [`"\\u{110000}"`, $ERROR, "It is a Syntax Error if the MV of HexDigits > 1114111."],
  [`"\\u{0000000000000000000010ffff}"`, $STRING_DOUBLE, 'must take care that the hex may still have any number of leading zeroes'],
  [`"\\u{00000000000000000000110000}"`, $ERROR, 'must take care that the hex may still have any number of leading zeroes'],

  // legacy octal (can parse multiple octal digits but no more such that the sum exceeds 255)

  [`"\\0"`, $STRING_DOUBLE, [USE_STRICT_MODE, USE_SLOPPY_MODE], "include a NUL byte (legal in both modes, the only exception)"],
  // single digit
  [[`"\\1"`, `"\\2"`, `"\\3"`, `"\\4"`, `"\\5"`, `"\\6"`, `"\\7"`], $ERROR, USE_STRICT_MODE, "octal escape illegal in strict mode"],
  [[`"\\1"`, `"\\2"`, `"\\3"`, `"\\4"`, `"\\5"`, `"\\6"`, `"\\7"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "OctalDigit [lookahead ∉ OctalDigit]"],
  [[`"\\1a"`, `"\\2b"`, `"\\3c"`, `"\\48"`, `"\\5*"`, `"\\6 "`, `"\\7\\\n"`], $ERROR, USE_STRICT_MODE, "octal escape with non octal"],
  [[`"\\1a"`, `"\\2b"`, `"\\3c"`, `"\\48"`, `"\\5*"`, `"\\6 "`, `"\\7\\\n"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "octal escape with non octal"],
  [[`"\\0`, `"\\1`, `"\\2`, `"\\3`, `"\\4`, `"\\5`, `"\\6`, `"\\7`, `"\\8`, `"\\9`], $ERROR, [USE_SLOPPY_MODE, USE_STRICT_MODE], "octal escape unclosed string", "suffixsp"],
  [[`"\\8"`, `"\\9"`, `"\\8`, `"\\9`, `"\\8a`, `"\\9b`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], "non-octal-digit-escape is never legal", "suffixsp"], // browsers and node do allow this... some even in strict mode.
  // double octal starting with 0 1 2 3 (parsed as up to three digits as long as they are all octal)
  [[`"\\00"`, `"\\01"`, `"\\02"`, `"\\10"`, `"\\11"`, `"\\12"`, `"\\20"`, `"\\21"`, `"\\22"`, `"\\30"`, `"\\31"`, `"\\32"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (end of string)"],
  [[`"\\00"`, `"\\01"`, `"\\02"`, `"\\10"`, `"\\11"`, `"\\12"`, `"\\20"`, `"\\21"`, `"\\22"`, `"\\30"`, `"\\31"`, `"\\32"`], $ERROR, USE_STRICT_MODE, "ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (end of string)"],
  [[`"\\008"`, `"\\019"`, `"\\02a"`, `"\\10r"`, `"\\11t"`, `"\\12 "`, `"\\20\\n"`, `"\\21e"`, `"\\22f"`, `"\\30G"`, `"\\31\\\n"`, `"\\32/"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (other character/high digit)"],
  [[`"\\008"`, `"\\019"`, `"\\02a"`, `"\\10r"`, `"\\11t"`, `"\\12 "`, `"\\20\\n"`, `"\\21e"`, `"\\22f"`, `"\\30G"`, `"\\31\\\n"`, `"\\32/"`], $ERROR, USE_STRICT_MODE, "ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (other character/high digit)"],
  [[`"\\00`, `"\\01`, `"\\02`, `"\\10`, `"\\11`, `"\\12`, `"\\20`, `"\\21`, `"\\22`, `"\\30`, `"\\31`, `"\\32`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], "ZeroToThreeOctalDigit [lookahead ∉ OctalDigit] (eol/eof)", "suffixsp"],
  // double octal starting with 4 5 6 7 (never parsed as three digits)
  [[`"\\40"`, `"\\51"`, `"\\62"`, `"\\73"`, `"\\44"`, `"\\55"`, `"\\66"`, `"\\66"`, `"\\77"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "FourToSeven OctalDigit end of string"],
  [[`"\\40"`, `"\\51"`, `"\\62"`, `"\\73"`, `"\\44"`, `"\\55"`, `"\\66"`, `"\\66"`, `"\\77"`], $ERROR, USE_STRICT_MODE, "FourToSeven OctalDigit end of string"],
  [[`"\\409"`, `"\\511"`, `"\\62a"`, `"\\73X"`, `"\\44\\\""`, `"\\55-"`, `"\\66*"`, `"\\66 "`, `"\\77\\\n"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "FourToSeven OctalDigit other char"],
  [[`"\\409"`, `"\\511"`, `"\\62a"`, `"\\73X"`, `"\\55-"`, `"\\66*"`, `"\\66 "`, `"\\77\\\n"`], $ERROR, USE_STRICT_MODE, "FourToSeven OctalDigit other char"],
  [`"\\44\\"`, $ERROR, USE_STRICT_MODE, "FourToSeven OctalDigit other char", "suffixsp"],
  [[`"\\40`, `"\\51`, `"\\62`, `"\\73`, `"\\44`, `"\\55`, `"\\66`, `"\\67`, `"\\76`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], "FourToSeven OctalDigit eol/eof", "suffixsp"],
  // triple octals
  [[`"\\000"`, `"\\012"`, `"\\023"`, `"\\104"`, `"\\115"`, `"\\126"`, `"\\207"`, `"\\210"`, `"\\221"`, `"\\302"`, `"\\313"`, `"\\324"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "ZeroToThreeOctalDigit OctalDigit OctalDigit (end of string)"],
  [[`"\\000"`, `"\\012"`, `"\\023"`, `"\\104"`, `"\\115"`, `"\\126"`, `"\\207"`, `"\\210"`, `"\\221"`, `"\\302"`, `"\\313"`, `"\\324"`], $ERROR, USE_STRICT_MODE, "ZeroToThreeOctalDigit OctalDigit OctalDigit (end of string)"],
  [[`"\\0008"`, `"\\0121"`, `"\\023a"`, `"\\104X"`, `"\\115 "`, `"\\126\\\n"`, `"\\207\t"`], $STRING_DOUBLE, USE_SLOPPY_MODE, "ZeroToThreeOctalDigit OctalDigit OctalDigit (other character/high digit)"],
  [[`"\\0008"`, `"\\0121"`, `"\\023a"`, `"\\104X"`, `"\\115 "`, `"\\126\\\n"`, `"\\207\t"`], $ERROR, USE_STRICT_MODE, "ZeroToThreeOctalDigit OctalDigit OctalDigit (other character/high digit)"],
  [[`"\\000`, `"\\012`, `"\\023`, `"\\104`, `"\\115`, `"\\126`, `"\\207`, `"\\210`, `"\\221`, `"\\302`, `"\\313`, `"\\324`], $ERROR, [USE_STRICT_MODE, USE_SLOPPY_MODE], "ZeroToThreeOctalDigit OctalDigit OctalDigit (eol/eof)", "suffixsp"],

  // hex digits
  [[`"\\x00"`, `"\\x12"`, `"\\x34"`, `"\\x56"`, `"\\x78"`, `"\\x9a"`, `"\\xAb"`, `"\\xBc"`, `"\\xCd"`, `"\\xDe"`, `"\\xEf"`, `"\\xF0"`], $STRING_DOUBLE],
  [[`"\\x000"`, `"\\x128"`, `"\\x34a"`, `"\\x56X"`, `"\\x78{"`, `"\\x9a\\\n"`, `"\\xAb\t"`, `"\\xBc "`, `"\\xCd#"`, `"\\xDe\\x00"`, `"\\xEfok"`, `"pre\\xF0"`], $STRING_DOUBLE, "followed by something else"],
  [[`"\\x0"`, `"\\x1"`, `"\\x2"`, `"\\x3"`, `"\\x4"`, `"\\x5"`, `"\\x6"`, `"\\x7"`, `"\\x8"`, `"\\x9"`, `"\\xa"`, `"\\xb"`, `"\\xc"`, `"\\xd"`, `"\\xe"`, `"\\xf"`, `"\\xA"`, `"\\xB"`, `"\\xC"`, `"\\xD"`, `"\\xE"`, `"\\xF"`], $ERROR, "incomplete hex at end of string"],
  [[`"\\x0`, `"\\x1`, `"\\x2`, `"\\x3`, `"\\x4`, `"\\x5`, `"\\x6`, `"\\x7`, `"\\x8`, `"\\x9`, `"\\xa`, `"\\xb`, `"\\xc`, `"\\xd`, `"\\xe`, `"\\xf`, `"\\xA`, `"\\xB`, `"\\xC`, `"\\xD`, `"\\xE`, `"\\xF`], $ERROR, "incomplete hex at eol/eof", "suffixsp"],
  [`"\\x"`, $ERROR, "incomplete hex escape at end of string"],
  [`"\\x`, $ERROR, "incomplete hex escape at end of eol / eof", "suffixsp"],
  [[`"\\xq0"`, `"\\xq1"`, `"\\xq2"`, `"\\xq3"`, `"\\xq4"`, `"\\xq5"`, `"\\xq6"`, `"\\xq7"`, `"\\xq8"`, `"\\xq9"`, `"\\xqa"`, `"\\xqb"`, `"\\xqc"`, `"\\xqd"`, `"\\xqe"`, `"\\xqf"`, `"\\xqA"`, `"\\xqB"`, `"\\xqC"`, `"\\xqD"`, `"\\xqE"`, `"\\xqF"`], $ERROR, "incomplete hex character 1"],
  [[`"\\x0q"`, `"\\x1q"`, `"\\x2q"`, `"\\x3q"`, `"\\x4q"`, `"\\x5q"`, `"\\x6q"`, `"\\x7q"`, `"\\x8q"`, `"\\x9q"`, `"\\xaq"`, `"\\xbq"`, `"\\xcq"`, `"\\xdq"`, `"\\xeq"`, `"\\xfq"`, `"\\xAq"`, `"\\xBq"`, `"\\xCq"`, `"\\xDq"`, `"\\xEq"`, `"\\xFq"`], $ERROR, "incomplete hex character 2"],
];
if (strings_single.length !== strings_double.length) console.error('Warning: Inconsistent! Make sure string tests are synced between single and double quoted strings!');
let identifiers = [
  [['foo', 'bar'], $IDENT],

  [['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], $IDENT],
  [['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'], $IDENT],
  ['$', $IDENT],
  ['_', $IDENT],

  [['aB','bC','cD','dE','eF','fz','gy','h0','i1','j2','k_','l$','m5','n6','o7','p8','q9','ra','sb','tc','ud','ve','wX','xY','yZ','zx'], $IDENT],
  [['AB','BC','CD','DE','EF','Fz','Gy','H0','I1','J2','K_','L$','M5','N6','O7','P8','Q9','Ra','Sb','Tc','Ud','Ve','WX','XY','YZ','Zx'], $IDENT],
  [['$a', '$b', '$c', '$d', '$e', '$f', '$g', '$h', '$i', '$j', '$k', '$l', '$m', '$n', '$o', '$p', '$q', '$r', '$s', '$t', '$u', '$v', '$w', '$x', '$y', '$z'], $IDENT],
  [['$A', '$B', '$C', '$D', '$E', '$F', '$G', '$H', '$I', '$J', '$K', '$L', '$M', '$N', '$O', '$P', '$Q', '$R', '$S', '$T', '$U', '$V', '$W', '$X', '$Y', '$Z'], $IDENT],
  [['_a', '_b', '_c', '_d', '_e', '_f', '_g', '_h', '_i', '_j', '_k', '_l', '_m', '_n', '_o', '_p', '_q', '_r', '_s', '_t', '_u', '_v', '_w', '_x', '_y', '_z'], $IDENT],
  [['_A', '_B', '_C', '_D', '_E', '_F', '_G', '_H', '_I', '_J', '_K', '_L', '_M', '_N', '_O', '_P', '_Q', '_R', '_S', '_T', '_U', '_V', '_W', '_X', '_Y', '_Z'], $IDENT],
  [['_', '__', '$', '$$', '$_', '_$'], $IDENT],

  // (TODO) unicode chars

  // unicode escape sequence crap

  // classic unicode escape
  [[`\\u0070bc`, `a\\u0071c`, `ab\\u0072`], $IDENT],
  [[`\\u007`, `\\u00`, `\\u0`, `\\u`, `\\`], $ERROR, 'idents that start with an invalid escape at eol/eof', 'suffixsp'],
  [[`\\u007Xvwxyz`, `\\u007Xvwxyz`, `\\u00Xvwxyz`, `\\u0Xvwxyz`, `\\uXvwxyz`, `\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape'],
  [[`abc\\u007`, `abc\\u00`, `abc\\u0`, `abc\\u`, `abc\\`], $ERROR, 'idents that have an invalid escape at eol/eof'],
  [[`abc\\u007Xvwxyz`, `abc\\u007Xvwxyz`, `abc\\u00Xvwxyz`, `abc\\u0Xvwxyz`, `abc\\uXvwxyz`, `abc\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape and have a tail'],
  // long unicode escape
  [[`\\u{70}bc`, `a\\u{71}c`, `ab\\u{72}`], $IDENT],
  [[`\\u{070}bc`, `a\\u{071}c`, `ab\\u{072}`], $IDENT],
  [[`\\u{0070}bc`, `a\\u{0071}c`, `ab\\u{0072}`], $IDENT],
  [[`\\u{00070}bc`, `a\\u{00071}c`, `ab\\u{00072}`], $IDENT],
  [[`\\u{000070}bc`, `a\\u{000071}c`, `ab\\u{000072}`], $IDENT],
  [[`\\u007`, `\\u00`, `\\u0`, `\\u`, `\\`], $ERROR, 'idents that start with an invalid escape at eol/eof', 'suffixsp'],
  [[`\\u007Xvwxyz`, `\\u007Xvwxyz`, `\\u00Xvwxyz`, `\\u0Xvwxyz`, `\\uXvwxyz`, `\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape'],
  [[`abc\\u007`, `abc\\u00`, `abc\\u0`, `abc\\u`, `abc\\`], $ERROR, 'idents that have an invalid escape at eol/eof'],
  [[`abc\\u007Xvwxyz`, `abc\\u007Xvwxyz`, `abc\\u00Xvwxyz`, `abc\\u0Xvwxyz`, `abc\\uXvwxyz`, `abc\\Xvwxyz`], $ERROR, 'idents that start with invalid chars in an escape and have a tail'],
  [[`\\u{000000000000000000070}bc`, `a\\u{0000000000000000000071}c`, `ab\\u{0000000000000000000072}`], $IDENT, 'leading zero padding'],
];

let testIndex = 0;
let all = [
  ...whitespaces,
  ...comments,
  ...punctuators,
  ...numbers,
  ...strings_single,
  ...strings_double,
  ...identifiers,
];
let fails = 0;
for (let [input, output, modi, desc, skip] of all) {
  if (typeof modi === 'string') {
    skip = desc;
    desc = modi;
    modi = [MODE_MODULE | USE_SLOPPY_MODE | SLASH_REGEX, MODE_MODULE | USE_STRICT_MODE | SLASH_REGEX]; // by default, check both strict and sloppy mode
  }
  if (!(input instanceof Array)) input = [input];
  if (!(output instanceof Array)) output = [output];
  if (!(skip instanceof Array)) skip = [skip];
  if (!(modi instanceof Array)) modi = [modi];

  for (let outerCode of input) {
    for (let mode of modi) {
      for (let testMode of ['original', '- prefixsp', '- suffixsp', '- prefixnl', '- suffixls', '- suffixcr', '- suffcrlf']) {
        ++testIndex;

        //if (testIndex !== 1541) continue;

        let code = outerCode;
        let outs = output.slice(0);
        switch (testMode) {
          case '- prefixnl':
            if (skip.indexOf('prefixnl') >= 0) {
              console.log('SKIP: ' + testIndex + ' (' + testMode + ')');
              continue;
            } else {
              code = '\u2028' + code; // use 2028 to prevent cr <> crlf problems. parser should be fine with this.
              outs.unshift($NL);
            }
            break;
          case '- suffixls':
            if (skip.indexOf('suffixls') >= 0) {
              console.log('SKIP: ' + testIndex + ' (' + testMode + ')');
              continue;
            } else {
              code = code + '\u2028';
              outs.push($NL);
            }
            break;
          case '- suffixcr':
            if (skip.indexOf('suffixcr') >= 0) {
              console.log('SKIP: ' + testIndex + ' (' + testMode + ')');
              continue;
            } else {
              code = code + '\r';
              outs.push($NL);
            }
            break;
          case '- suffcrlf':
            if (skip.indexOf('suffcrlf') >= 0) {
              console.log('SKIP: ' + testIndex + ' (' + testMode + ')');
              continue;
            } else {
              code = code + '\r\n';
              outs.push($CRLF);
            }
            break;
          case '- prefixsp':
            if (skip.indexOf('prefixsp') >= 0) {
              console.log('SKIP: ' + testIndex + ' (' + testMode + ')');
              continue;
            } else {
              code = ' ' + code;
              outs.unshift($SPACE);
            }
            break;
          case '- suffixsp':
            if (skip.indexOf('suffixsp') >= 0) {
              console.log('SKIP: ' + testIndex + ' (' + testMode + ')');
              continue;
            } else {
              code = code + ' ';
              outs.push($SPACE);
            }
            break;
        }

        outs.push($EOF);

        let collects = [];
        let divrex = (mode & SLASH_REGEX) ? REX : DIV;
        let strictness = (mode & USE_STRICT_MODE) ? STRICT_MODE : SLOPPY_MODE;

        try {
          let tok = ZeTokenizer(code, (mode & MODE_MODULE) ? GOAL_MODULE : GOAL_SCRIPT);

          let failed = false;
          let token;
          for (let exp of outs) {
            token = tok(divrex, strictness, true);
            collects.push(token.type);
            //console.log(token, '->', exp);
            if (token.type !== exp) console.log('(1) failed=', failed = true, 'because', debug_toktype(token.type), '!==', debug_toktype(exp));
            if (token.type === $EOF) break;
          }

          // keep parsing even if it failed. EOF must always be emitted, even if
          // an error occurred, and it must mean the pointer is beyond the input
          if (!failed && token.type !== $EOF) {
            console.log('(2) failed=', failed = true, 'because last token wasnt EOF');
            do {
              token = tok(divrex, strictness, true);
              collects.push(token.type);
            } while (token.type !== $EOF);
          }

          console.log((failed ? 'FAIL: ' : 'PASS: ') + testIndex + ' (' + (strictness === STRICT_MODE ? 'strict' : 'sloppy') + ')(' + testMode + '): `' + toPrint(code) + '`  -->  ' + outs.map(debug_toktype) + ', was; ' + collects.map(debug_toktype));
          if (failed) ++fails;
        } catch (rethrow) {
          console.log('ERROR: ' + testIndex + ' (' + (strictness === STRICT_MODE ? 'strict' : 'sloppy') + ')(' + testMode + '): `' + toPrint(code) + '`  -->  ' + outs.map(debug_toktype) + ', was so far; ' + collects.map(debug_toktype));
          throw rethrow;
        }
      }
    }
  }
}
console.log('###\nPassed', (testIndex - fails) + 1, '/', testIndex + 1, 'tests (', fails, 'failures )')

function toPrint(s) {
  return s
    .replace(/[^\u0000-\u00ff\u2028]/g, function (s) {
      return '\\u' + s.charCodeAt(0).toString(16).toUpperCase();
    })
    .replace(/[\xa0\x0b\x0c]/g, function (s) {
      return '\\x' + s.charCodeAt(0).toString(16).toUpperCase();
    })
    .replace(/\t/g, '\\t')
    .replace(/\u2028/g, '\u21a9')
    .replace(/\u000a/g, '\u21b5')
    .replace(/\u000d/g, '\\r');
}
