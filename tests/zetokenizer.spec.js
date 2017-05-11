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

  // "Two IdentiᲪierName that are canonically equivalent according to the Unicode standard are not equal unless, after replacement of each UnicodeEscapeSequence, they are represented by the exact same sequence of code points."
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
let regexes = [
  [`/abc/`, $REGEX, SLASH_REGEX],
  [`/abc`, $ERROR, SLASH_REGEX, 'eof before closed regex', 'suffixsp'],

  // or
  [`/a|b/`, $REGEX, SLASH_REGEX],
  [[`/|a/`, `/a|/`, `/|/`, '/a||/'], $ERROR, SLASH_REGEX, 'bad OR because no atoms'],
  [[`/|a`, `/a|`, `/|`, '/a||'], $ERROR, SLASH_REGEX, 'bad OR because eof/eol', 'suffixsp'],

  // simple atoms and quantifiers
  [[`/^abc/`, `/abc$/`, `/a.c/`], $REGEX, SLASH_REGEX, 'simple atoms'],
  [[`/^/`, `/ab^cd/`, `/abc^/`, `/abc^abc/`, `/$/`, `/$abc/`, `/abc$abc/`], $REGEX, SLASH_REGEX, 'simple atoms where you dont usually see them'],
  [[`/^`, `/abc$`, `/a.`], $ERROR, SLASH_REGEX, 'eol/eof after simple atoms', 'suffixsp'],
  [[`/a*/`, `/a?/`, `/a+/`], $REGEX, SLASH_REGEX, 'simple quantifiers'],
  [[`/a*b/`, `/a?b/`, `/a+b/`], $REGEX, SLASH_REGEX, 'simple quantifiers with suffix'],
  [[`/a*`, `/a?`, `/a+`], $ERROR, SLASH_REGEX, 'eol/eof after simple quantifiers', 'suffixsp'],
  [[`/a*?`, `/a?*`, `/a+?`], $ERROR, SLASH_REGEX, 'eol/eof after simple non-greedy quantifiers', 'suffixsp'],
  [[`/?/`, `/+/`, `/?a/`, `/+a/`, `/??/`, `/+?/`, `/|*/`, `/|?/`, `/|+/`], $ERROR, SLASH_REGEX, 'simple quantifiers in an invalid place'],
  [[`/*/`, `/*`, `/*a/`, `/*a`], $ERROR, SLASH_REGEX, 'actually a comment, still invalid at eof', ['suffixls','suffixcr','suffcrlf','suffixsp']],
  [[`/?`, `/+`, `/?a`, `/+a`, `/??`, `/+?`, `/|*`, `/|?`, `/|+`], $ERROR, SLASH_REGEX, 'simple quantifiers in an invalid place with eol/eof', 'suffixsp'],
  [[`/a**/`, `/a?+/`, `/a++/`], $ERROR, SLASH_REGEX, 'quantifing a quantifier'],
  [[`/a**`, `/a?*`, `/a++`], $ERROR, SLASH_REGEX, 'quantifing a quantifier at eol/eof', 'suffixsp'],
  [`/a??/`, $REGEX, SLASH_REGEX, 'quantifing a quantifier', 'suffixsp'],
  [`/a??`, $ERROR, SLASH_REGEX, 'quantifing a quantifier at eol/eof', 'suffixsp'],

  // most permutations with {d,d}
  [[`/a{0}/`, `/a{1}/`, `/a{2}/`, `/a{3}/`, `/a{4}/`, `/a{5}/`, `/a{6}/`, `/a{7}/`, `/a{8}/`, `/a{9}/`], $REGEX, SLASH_REGEX],
  [[`/a{01}/`, `/a{12}/`, `/a{23}/`, `/a{34}/`, `/a{45}/`, `/a{56}/`, `/a{67}/`, `/a{78}/`, `/a{89}/`, `/a{90}/`], $REGEX, SLASH_REGEX],
  [[`/a{0,}/`, `/a{1,}/`, `/a{2,}/`, `/a{3,}/`, `/a{4,}/`, `/a{5,}/`, `/a{6,}/`, `/a{7,}/`, `/a{8,}/`, `/a{9,}/`], $REGEX, SLASH_REGEX],
  [[`/a{01,}/`, `/a{12,}/`, `/a{23,}/`, `/a{34,}/`, `/a{45,}/`, `/a{56,}/`, `/a{67,}/`, `/a{78,}/`, `/a{89,}/`, `/a{90,}/`], $REGEX, SLASH_REGEX],
  [[`/a{0,0}/`, `/a{1,1}/`, `/a{2,2}/`, `/a{3,3}/`, `/a{4,4}/`, `/a{5,5}/`, `/a{6,6}/`, `/a{7,7}/`, `/a{8,8}/`, `/a{9,9}/`], $REGEX, SLASH_REGEX],
  [[`/a{01,0}/`, `/a{12,1}/`, `/a{23,2}/`, `/a{34,3}/`, `/a{45,4}/`, `/a{56,5}/`, `/a{67,6}/`, `/a{78,7}/`, `/a{89,8}/`, `/a{90,9}/`], $REGEX, SLASH_REGEX],
  [[`/a{0,05}/`, `/a{1,16}/`, `/a{2,27}/`, `/a{3,38}/`, `/a{4,49}/`, `/a{5,50}/`, `/a{6,61}/`, `/a{7,72}/`, `/a{8,83}/`, `/a{9,94}/`], $REGEX, SLASH_REGEX],
  [[`/a{01,05}/`, `/a{12,16}/`, `/a{23,27}/`, `/a{34,38}/`, `/a{45,49}/`, `/a{56,50}/`, `/a{67,61}/`, `/a{78,72}/`, `/a{89,83}/`, `/a{90,94}/`], $REGEX, SLASH_REGEX],
  [[`/a{,0}/`, `/a{,1}/`, `/a{,2}/`, `/a{,3}/`, `/a{,4}/`, `/a{,5}/`, `/a{,6}/`, `/a{,7}/`, `/a{,8}/`, `/a{,9}/`], $REGEX, SLASH_REGEX],
  [[`/a{,05}/`, `/a{,16}/`, `/a{,27}/`, `/a{,38}/`, `/a{,49}/`, `/a{,50}/`, `/a{,61}/`, `/a{,72}/`, `/a{,83}/`, `/a{,94}/`], $REGEX, SLASH_REGEX],
  [['/a{ 1}/', '/a{1 }/', '/a{1, 1}/', '/a{ 1, 1}/', '/a{1 ,1}/', '/a{ 1 , 1}/', '/a{1,1 }/', '/a{1, 1 }/', '/a{ 1, 1 }/', '/a{ 1 , 1 }/'], $ERROR, SLASH_REGEX, 'no spaces allowed in quantifier'],

  // flags
  [['/foo/g', '/foo/i', '/foo/m', '/foo/y'], $REGEX, SLASH_REGEX],
  [['/foo/gg', '/foo/ii', '/foo/mm', '/foo/yy'], $ERROR, SLASH_REGEX],
  [['/foo/ig', '/foo/mi', '/foo/gy'], $REGEX, SLASH_REGEX],
  [['/foo/gmi', '/foo/igy'], $REGEX, SLASH_REGEX],
  [['/foo/gmmi', '/foo/ggymi', '/foo/myiy', '/foo/igyi'], $ERROR, SLASH_REGEX],

  // escapes (only \f \n \r \t \v should work)
  [['/\\d/', '/\\D/', '/\\f/', '/\\n/', '/\\r/', '/\\s/', '/\\S/', '/\\t/', '/\\v/', '/\\w/', '/\\W/'], $REGEX, SLASH_REGEX, 'only escaping a single letter'],
  [['/abc\\d/', '/abc\\D/', '/abc\\f/', '/abc\\n/', '/abc\\r/', '/abc\\s/', '/abc\\S/', '/abc\\t/', '/abc\\v/', '/abc\\w/', '/abc\\W/'], $REGEX, SLASH_REGEX, 'escaping a prefixed single letter'],
  [['/\\fabcd/', '/\\dabcd/', '/\\Dabcd/', '/\\nabcd/', '/\\rabcd/', '/\\sabcd/', '/\\Sabcd/', '/\\tabcd/', '/\\vabcd/', '/\\wabcd/', '/\\Wabcd/'], $REGEX, SLASH_REGEX, 'escaping a suffixed single letter'],
  [['/abc\\fdeff/', '/abc\\ddeff/', '/abc\\Ddeff/', '/abc\\ndeff/', '/abc\\rdeff/', '/abc\\sdeff/', '/abc\\Sdeff/', '/abc\\tdeff/', '/abc\\vdeff/', '/abc\\wdeff/', '/abc\\Wdeff/'], $REGEX, SLASH_REGEX, 'escaping a single letter in the middle'],
  // the other char escapes are errors...
  [['/\\a/', '/\\e/', '/\\g/', '/\\h/', '/\\i/', '/\\j/', '/\\k/', '/\\l/', '/\\m/', '/\\o/', '/\\p/', '/\\q/', '/\\u/', '/\\x/', '/\\y/', '/\\z/'], $ERROR, SLASH_REGEX, 'only escaping a single lc letter'],
  [['/\\A/', '/\\E/', '/\\F/', '/\\G/', '/\\H/', '/\\I/', '/\\J/', '/\\K/', '/\\L/', '/\\M/', '/\\N/', '/\\O/', '/\\P/', '/\\Q/', '/\\R/', '/\\T/', '/\\U/', '/\\V/', '/\\X/', '/\\Y/', '/\\Z/'], $ERROR, SLASH_REGEX, 'only escaping a single uc letter'],
  [['/abc\\a/', '/abc\\e/', '/abc\\g/', '/abc\\h/', '/abc\\i/', '/abc\\j/', '/abc\\k/', '/abc\\l/', '/abc\\m/', '/abc\\o/', '/abc\\p/', '/abc\\q/', '/abc\\u/', '/abc\\x/', '/abc\\y/', '/abc\\z/'], $ERROR, SLASH_REGEX, 'escaping a prefixed single lc letter'],
  [['/abc\\A/', '/abc\\E/', '/abc\\F/', '/abc\\G/', '/abc\\H/', '/abc\\I/', '/abc\\J/', '/abc\\K/', '/abc\\L/', '/abc\\M/', '/abc\\N/', '/abc\\O/', '/abc\\P/', '/abc\\Q/', '/abc\\R/', '/abc\\T/', '/abc\\U/', '/abc\\V/', '/abc\\X/', '/abc\\Y/', '/abc\\Z/'], $ERROR, SLASH_REGEX, 'escaping a prefixed single uc letter'],
  [['/\\aabcd/', '/\\eabcd/', '/\\gabcd/', '/\\habcd/', '/\\iabcd/', '/\\jabcd/', '/\\kabcd/', '/\\labcd/', '/\\mabcd/', '/\\oabcd/', '/\\pabcd/', '/\\qabcd/', '/\\xabcd/', '/\\yabcd/', '/\\zabcd/'], $ERROR, SLASH_REGEX, 'escaping a suffixed single lc letter'],
  [['/\\Aabcd/', '/\\Cabcd/', '/\\Eabcd/', '/\\Fabcd/', '/\\Gabcd/', '/\\Habcd/', '/\\Iabcd/', '/\\Jabcd/', '/\\Kabcd/', '/\\Labcd/', '/\\Mabcd/', '/\\Nabcd/', '/\\Oabcd/', '/\\Pabcd/', '/\\Qabcd/', '/\\Rabcd/', '/\\Tabcd/', '/\\Uabcd/', '/\\Vabcd/', '/\\Xabcd/', '/\\Yabcd/', '/\\Zabcd/'], $ERROR, SLASH_REGEX, 'escaping a suffixed single uc letter'],
  [['/abc\\adeff/', '/abc\\gdeff/', '/abc\\hdeff/', '/abc\\ideff/', '/abc\\jdeff/', '/abc\\kdeff/', '/abc\\ldeff/', '/abc\\mdeff/', '/abc\\odeff/', '/abc\\pdeff/', '/abc\\qdeff/', '/abc\\xdeff/', '/abc\\ydeff/', '/abc\\zdeff/'], $ERROR, SLASH_REGEX, 'escaping a single lc letter in the middle'],
  [['/abc\\Adeff/', '/abc\\Cdeff/', '/abc\\Edeff/', '/abc\\Fdeff/', '/abc\\Gdeff/', '/abc\\Hdeff/', '/abc\\Ideff/', '/abc\\Jdeff/', '/abc\\Kdeff/', '/abc\\Ldeff/', '/abc\\Mdeff/', '/abc\\Ndeff/', '/abc\\Odeff/', '/abc\\Pdeff/', '/abc\\Qdeff/', '/abc\\Rdeff/', '/abc\\Tdeff/', '/abc\\Udeff/', '/abc\\Vdeff/', '/abc\\Xdeff/', '/abc\\Ydeff/', '/abc\\Zdeff/'], $ERROR, SLASH_REGEX, 'escaping a single uc letter in the middle'],
  [['/\\_/', '/abc\\_/', '/\\_abcd/', '/abc\\_abcd/'], $ERROR, SLASH_REGEX, '_ is not an escapable char'],
  [['/\\$/', '/abc\\$/', '/\\$abcd/', '/abc\\$abcd/'], $REGEX, SLASH_REGEX, '$ is a syntax char we can escape'],
  // escaping "syntax characters"
  [[`/\\^/`, `/\\$/`, `/\\\\/`, `/\\./`, `/\\*/`, `/\\+/`, `/\\?/`, `/\\(/`, `/\\)/`, `/\\[/`, `/\\]/`, `/\\{/`, `/\\}/`, `/\\|/`], $REGEX, SLASH_REGEX, 'syntax char escapes'],
  [[`/abc\\^/`, `/abc\\$/`, `/abc\\\\/`, `/abc\\./`, `/abc\\*/`, `/abc\\+/`, `/abc\\?/`, `/abc\\(/`, `/abc\\)/`, `/abc\\[/`, `/abc\\]/`, `/abc\\{/`, `/abc\\}/`, `/abc\\|/`], $REGEX, SLASH_REGEX, 'syntax char escapes with prefix'],
  [[`/\\^def/`, `/\\$def/`, `/\\\\def/`, `/\\.def/`, `/\\*def/`, `/\\+def/`, `/\\?def/`, `/\\(def/`, `/\\)def/`, `/\\[def/`, `/\\]def/`, `/\\{def/`, `/\\}def/`, `/\\|def/`], $REGEX, SLASH_REGEX, 'syntax char escapes with suffix'],
  [[`/\\^`, `/\\$`, `/\\\\`, `/\\.`, `/\\*`, `/\\+`, `/\\?`, `/\\(`, `/\\)`, `/\\[`, `/\\]`, `/\\{`, `/\\}`, `/\\|`], $ERROR, SLASH_REGEX, 'syntax char escapes with early eol/eof', 'suffixsp'],
  [[`/\\'/`, `/\\"/`, `/\\\`/`], $ERROR, SLASH_REGEX, 'typical string escapes dont work in regexes'],
  [['/^/', '/$/', '/./'], $REGEX, SLASH_REGEX, 'off to a good start'],
  [['/+/', '/?/', '/)/', '/]/', '/{/', '/}/', '/|/'], $ERROR, SLASH_REGEX, 'off to a bad start'],
  [['/a|*/', '/a|+/', '/a|?/', '/a|)/', '/a|]/', '/a|{/', '/a|}/', '/a||/'], $ERROR, SLASH_REGEX, 'and you started so well'],
  [['/\\/', '/a|\\/'], $ERROR, SLASH_REGEX, '(eol/eof case)', 'suffixsp'],
  // \c<x>
  [['/\\ca/', '/\\cb/', '/\\cd/', '/\\ce/', '/\\cf/', '/\\cg/', '/\\ch/', '/\\ci/', '/\\cj/', '/\\ck/', '/\\cl/', '/\\cm/', '/\\cn/', '/\\co/', '/\\cp/', '/\\cq/', '/\\cr/', '/\\cs/', '/\\ct/', '/\\cu/', '/\\cv/', '/\\cw/', '/\\cx/', '/\\cy/', '/\\cz/'], $REGEX, SLASH_REGEX, 'control character lc'],
  [['/\\cA/', '/\\cB/', '/\\cD/', '/\\cE/', '/\\cF/', '/\\cG/', '/\\cH/', '/\\cI/', '/\\cJ/', '/\\cK/', '/\\cL/', '/\\cM/', '/\\cN/', '/\\cO/', '/\\cP/', '/\\cQ/', '/\\cR/', '/\\cS/', '/\\cT/', '/\\cU/', '/\\cV/', '/\\cW/', '/\\cX/', '/\\cY/', '/\\cZ/'], $REGEX, SLASH_REGEX, 'control character uc'],
  [['/\\ca', '/\\cb', '/\\cc', '/\\cd', '/\\ce', '/\\cf', '/\\cg', '/\\ch', '/\\ci', '/\\cj', '/\\ck', '/\\cl', '/\\cm', '/\\cn', '/\\co', '/\\cp', '/\\cq', '/\\cr', '/\\cs', '/\\ct', '/\\cu', '/\\cv', '/\\cw', '/\\cx', '/\\cy', '/\\cz'], $ERROR, SLASH_REGEX, 'control character lc eol/eof', 'suffixsp'],
  [['/\\cA', '/\\cB', '/\\cC', '/\\cD', '/\\cE', '/\\cF', '/\\cG', '/\\cH', '/\\cI', '/\\cJ', '/\\cK', '/\\cL', '/\\cM', '/\\cN', '/\\cO', '/\\cP', '/\\cQ', '/\\cR', '/\\cS', '/\\cT', '/\\cU', '/\\cV', '/\\cW', '/\\cX', '/\\cY', '/\\cZ'], $ERROR, SLASH_REGEX, 'control character uc eol/eof', 'suffixsp'],
  // same escapes but early eol/eof/bad
  [['/\\a', '/\\b', '/\\d', '/\\e', '/\\f', '/\\g', '/\\h', '/\\i', '/\\j', '/\\k', '/\\l', '/\\m', '/\\n', '/\\o', '/\\p', '/\\q', '/\\r', '/\\s', '/\\t', '/\\u', '/\\v', '/\\w', '/\\x', '/\\y', '/\\z'], $ERROR, SLASH_REGEX, 'only escaping a single lc letter', 'suffixsp'],
  [['/\\A', '/\\B', '/\\D', '/\\E', '/\\F', '/\\G', '/\\H', '/\\I', '/\\J', '/\\K', '/\\L', '/\\M', '/\\N', '/\\O', '/\\P', '/\\Q', '/\\R', '/\\S', '/\\T', '/\\U', '/\\V', '/\\W', '/\\X', '/\\Y', '/\\Z'], $ERROR, SLASH_REGEX, 'only escaping a single uc letter', 'suffixsp'],
  [['/abc\\a', '/abc\\b', '/abc\\d', '/abc\\e', '/abc\\f', '/abc\\g', '/abc\\h', '/abc\\i', '/abc\\j', '/abc\\k', '/abc\\l', '/abc\\m', '/abc\\n', '/abc\\o', '/abc\\p', '/abc\\q', '/abc\\r', '/abc\\s', '/abc\\t', '/abc\\u', '/abc\\v', '/abc\\w', '/abc\\x', '/abc\\y', '/abc\\z'], $ERROR, SLASH_REGEX, 'escaping a prefixed single lc letter', 'suffixsp'],
  [['/abc\\A', '/abc\\B', '/abc\\D', '/abc\\E', '/abc\\F', '/abc\\G', '/abc\\H', '/abc\\I', '/abc\\J', '/abc\\K', '/abc\\L', '/abc\\M', '/abc\\N', '/abc\\O', '/abc\\P', '/abc\\Q', '/abc\\R', '/abc\\S', '/abc\\T', '/abc\\U', '/abc\\V', '/abc\\W', '/abc\\X', '/abc\\Y', '/abc\\Z'], $ERROR, SLASH_REGEX, 'escaping a prefixed single uc letter', 'suffixsp'],
  [['/\\aabcd', '/\\babcd', '/\\cabcd', '/\\dabcd', '/\\eabcd', '/\\fabcd', '/\\gabcd', '/\\habcd', '/\\iabcd', '/\\jabcd', '/\\kabcd', '/\\labcd', '/\\mabcd', '/\\nabcd', '/\\oabcd', '/\\pabcd', '/\\qabcd', '/\\rabcd', '/\\sabcd', '/\\tabcd', '/\\uabcd', '/\\vabcd', '/\\wabcd', '/\\xabcd', '/\\yabcd', '/\\zabcd'], $ERROR, SLASH_REGEX, 'escaping a suffixed single lc letter', 'suffixsp'],
  [['/\\Aabcd', '/\\Babcd', '/\\Cabcd', '/\\Dabcd', '/\\Eabcd', '/\\Fabcd', '/\\Gabcd', '/\\Habcd', '/\\Iabcd', '/\\Jabcd', '/\\Kabcd', '/\\Labcd', '/\\Mabcd', '/\\Nabcd', '/\\Oabcd', '/\\Pabcd', '/\\Qabcd', '/\\Rabcd', '/\\Sabcd', '/\\Tabcd', '/\\Uabcd', '/\\Vabcd', '/\\Wabcd', '/\\Xabcd', '/\\Yabcd', '/\\Zabcd'], $ERROR, SLASH_REGEX, 'escaping a suffixed single uc letter', 'suffixsp'],
  [['/abc\\adeff', '/abc\\bdeff', '/abc\\cdeff', '/abc\\ddeff', '/abc\\edeff', '/abc\\fdeff', '/abc\\gdeff', '/abc\\hdeff', '/abc\\ideff', '/abc\\jdeff', '/abc\\kdeff', '/abc\\ldeff', '/abc\\mdeff', '/abc\\ndeff', '/abc\\odeff', '/abc\\pdeff', '/abc\\qdeff', '/abc\\rdeff', '/abc\\sdeff', '/abc\\tdeff', '/abc\\udeff', '/abc\\vdeff', '/abc\\wdeff', '/abc\\xdeff', '/abc\\ydeff', '/abc\\zdeff'], $ERROR, SLASH_REGEX, 'escaping a single lc letter in the middle', 'suffixsp'],
  [['/abc\\Adeff', '/abc\\Bdeff', '/abc\\Cdeff', '/abc\\Ddeff', '/abc\\Edeff', '/abc\\Fdeff', '/abc\\Gdeff', '/abc\\Hdeff', '/abc\\Ideff', '/abc\\Jdeff', '/abc\\Kdeff', '/abc\\Ldeff', '/abc\\Mdeff', '/abc\\Ndeff', '/abc\\Odeff', '/abc\\Pdeff', '/abc\\Qdeff', '/abc\\Rdeff', '/abc\\Sdeff', '/abc\\Tdeff', '/abc\\Udeff', '/abc\\Vdeff', '/abc\\Wdeff', '/abc\\Xdeff', '/abc\\Ydeff', '/abc\\Zdeff'], $ERROR, SLASH_REGEX, 'escaping a single uc letter in the middle', 'suffixsp'],
  [['/\\$', '/abc\\$', '/\\$abcd', '/abc\\$abcd', '/\\_', '/abc\\_', '/\\_abcd', '/abc\\_abcd'], $ERROR, SLASH_REGEX, '$ and _', 'suffixsp'],
  // hex escapes
  [['/\\x01/', '/\\x12/', '/\\x23/', '/\\x34/', '/\\x45/', '/\\x56/', '/\\x67/', '/\\x78/', '/\\x89/', '/\\x90/'], $REGEX, SLASH_REGEX, 'valid hex escapes'],
  [['/\\x/', '/\\x0/', '/\\x1/', '/\\x2/', '/\\x3/', '/\\x4/', '/\\x5/', '/\\x6/', '/\\x7/', '/\\x8/', '/\\x9/'], $ERROR, SLASH_REGEX, 'invalid hex escape with one char'],
  [['/\\x', '/\\x0', '/\\x1', '/\\x2', '/\\x3', '/\\x4', '/\\x5', '/\\x6', '/\\x7', '/\\x8', '/\\x9'], $ERROR, SLASH_REGEX, 'invalid hex escape with one charat eol/eof', 'suffixsp'],
  [['/\\x01', '/\\x12', '/\\x23', '/\\x34', '/\\x45', '/\\x56', '/\\x67', '/\\x78', '/\\x89', '/\\x90'], $ERROR, SLASH_REGEX, 'hex escape at eof/eol', 'suffixsp'],
  // digit escape / backreferences
  [['/\\0/', '/a\\0/', '/\\0b/', '/a\\0b/', '/(a)\\0/', '/\\0(b)/', '/(\\0)/', '/(0\\0)/', '/(1\\0)/'], $REGEX, SLASH_REGEX, 'escaped zero is a NUL and not a back reference'],
  [['/\\01/', '/a\\02/', '/\\03b/', '/a\\04b/', '/(a)\\05/', '/\\06(b)/', '/(\\07)/', '/\\08/', '/\\09/', '/\\00/'], $ERROR, SLASH_REGEX, 'escaped zero can not be followed by another digit'],
  [['/\\0', '/a\\0', '/\\0b', '/a\\0b', '/(a)\\0', '/\\0(b)', '/(\\0)'], $ERROR, SLASH_REGEX, 'escaped zero at eol/eof', 'suffixsp'],
  [['/\\01', '/a\\02', '/\\03b', '/a\\04b', '/(a)\\05', '/\\06(b)', '/(\\07)', '/\\08', '/\\09', '/\\00'], $ERROR, SLASH_REGEX, 'escaped zero at eol/eof', 'suffixsp'],
  [['/\\1(a)/', '/(a)\\1/', '/(\\1)/', '/\\1x(a)/', '/(a)x\\1/', '/(a\\1b)/', '/0\\1(a)/', '/4\\1(a)/', '/(a)|\\1/', '/\\1|(a)/', '/(\\1|a)/', '/(a|\\1)/'], $REGEX, SLASH_REGEX, 'backreference anywhere with 1 capturing group'],
  [['/\\1(a)', '/(a)\\1', '/(\\1)', '/\\1x(a)', '/(a)x\\1', '/(a\\1b)', '/0\\1(a)', '/4\\1(a)', '/(a)|\\1', '/\\1|(a)', '/(\\1|a)', '/(a|\\1)'], $ERROR, SLASH_REGEX, 'backreference anywhere with eol/eof', 'suffixsp'],
  [['/\\2(a)/', '/(a)\\3/', '/(\\4)/', '/\\5x(a)/', '/(a)x\\6/', '/(a\\7b)/', '/0\\8(a)/', '/4\\9(a)/', '/(a)|\\10/', '/\\11|(a)/', '/(\\12|a)/', '/(a|\\13)/'], $ERROR, SLASH_REGEX, 'illegal backreference indexes'],
  [[
    '/\\0/', '/(a)\\0/',
    '/(a)\\1/', '/((a))\\1/',
    '/((a))\\2/', '/(((a)))\\2/',
    '/(((a)))\\3/', '/((((a))))\\3/',
    '/((((a))))\\4/', '/(((((a)))))\\4/',
    '/(((((a)))))\\5/', '/((((((a))))))\\5/',
    '/((((((a))))))\\6/', '/(((((((a)))))))\\6/',
    '/(((((((a)))))))\\7/', '/((((((((a))))))))\\7/',
    '/((((((((a))))))))\\8/', '/(((((((((a)))))))))\\8/',
    '/(((((((((a)))))))))\\9/', '/((((((((((a))))))))))\\9/',
    '/((((((((((a))))))))))\\10/', '/(((((((((((a)))))))))))\\10/',
    '/(((((((((((a)))))))))))\\11/', '/((((((((((((a))))))))))))\\11/',
    '/((((((((((((a))))))))))))\\12/', '/(((((((((((((a)))))))))))))\\12/',
    '/(((((((((((((a)))))))))))))\\13/', '/((((((((((((((a))))))))))))))\\13/',
    '/((((((((((((((a))))))))))))))\\14/', '/(((((((((((((((a)))))))))))))))\\14/',
    '/(((((((((((((((a)))))))))))))))\\15/', '/((((((((((((((((a))))))))))))))))\\15/',
    '/((((((((((((((((a))))))))))))))))\\16/', '/(((((((((((((((((a)))))))))))))))))\\16/',
    '/(((((((((((((((((a)))))))))))))))))\\17/', '/((((((((((((((((((a))))))))))))))))))\\17/',
    '/((((((((((((((((((a))))))))))))))))))\\18/', '/(((((((((((((((((((a)))))))))))))))))))\\18/',
    '/(((((((((((((((((((a)))))))))))))))))))\\19/', '/((((((((((((((((((((a))))))))))))))))))))\\19/',
    '/((((((((((((((((((((a))))))))))))))))))))\\20/', '/(((((((((((((((((((((a)))))))))))))))))))))\\20/',
  ], $REGEX, SLASH_REGEX, '0 to 20 matching groups with as many or as many plus 1 groups (tests all digits for escaping one or two digits)'],
  [[
    '/a\\1/',
    '/(a)\\2/',
    '/((a))\\3/',
    '/(((a)))\\4/',
    '/((((a))))\\5/',
    '/(((((a)))))\\6/',
    '/((((((a))))))\\7/',
    '/(((((((a)))))))\\8/',
    '/((((((((a))))))))\\9/',
    '/(((((((((a)))))))))\\10/',
    '/((((((((((a))))))))))\\11/',
    '/(((((((((((a)))))))))))\\12/',
    '/((((((((((((a))))))))))))\\13/',
    '/(((((((((((((a)))))))))))))\\14/',
    '/((((((((((((((a))))))))))))))\\15/',
    '/(((((((((((((((a)))))))))))))))\\16/',
    '/((((((((((((((((a))))))))))))))))\\17/',
    '/(((((((((((((((((a)))))))))))))))))\\18/',
    '/((((((((((((((((((a))))))))))))))))))\\19/',
    '/(((((((((((((((((((a)))))))))))))))))))\\20/',
    '/((((((((((((((((((((a))))))))))))))))))))\\21/',
  ], $ERROR, SLASH_REGEX, '1 to 21 matching groups with one too few groups'],
  // unicode quad escapes (more relevant for u-mode but still good to have in both). see also the class escapes
  [['/\\u1234/', '/x\\u0567/', '/\\uf89ay/', '/x\\ubcdey/'], $REGEX, SLASH_REGEX, 'non surrogate'],
  [['/\\u', '/\\u0', '/\\uf8', '/\\ubcd', '/\\ubcde'], $ERROR, SLASH_REGEX, 'incomplete unicode quad escape eol/eof', 'suffixsp'],
  [['/x\\u', '/x\\u0', '/x\\uf8', '/x\\ubcd', '/x\\ubcde'], $ERROR, SLASH_REGEX, 'incomplete unicode quad escape eol/eof', 'suffixsp'],
  //// surrogate stuff
  [['/\\ud800/', '/x\\ud810/', '/\\ud900y/', '/x\\udabcy/', '/x\\udabcy/g', '/x\\udabcy/m', '/x\\udabcy/iy'], $REGEX, SLASH_REGEX, 'lead surrogate'],
  [['/\\ud800\\ud800/', '/x\\ud810\\ud810/', '/\\ud900\\ud900y/', '/x\\udabc\\udabcy/'], $REGEX, SLASH_REGEX, 'lead + lead surrogate'],
  [['/\\udc00/', '/x\\udc10/', '/\\udd00y/', '/x\\udebcy/', '/x\\udebcy/g', '/x\\udebcy/im', '/x\\udebcy/y'], $REGEX, SLASH_REGEX, 'trail surrogate'],
  [['/\\udc00\\udc00/', '/x\\udc10\\udc10/', '/\\udd00\\udd00y/', '/x\\udebc\\udebcy/', '/x\\udebc\\udebcy/i'], $REGEX, SLASH_REGEX, 'trail + trail surrogate'],
  [['/\\ud800\\udc00/', '/x\\ud810\\udc10/', '/\\ud900\\udd00y/', '/x\\udabc\\udebcy/', '/x\\udabc\\udebcy/g'], $REGEX, SLASH_REGEX, 'lead + trail surrogate'],
  [['/\\u1234\\ud800/', '/x\\u0567\\ud810/', '/\\uf89a\\ud900y/', '/x\\ubcde\\udabcy/', '/x\\ubcde\\udabcy/m'], $REGEX, SLASH_REGEX, 'non + lead surrogate'],
  [['/\\u1234\\udc00/', '/x\\u0567\\udc10/', '/\\uf89a\\udd00y/', '/x\\ubcde\\udebcy/', '/x\\ubcde\\udebcy/y'], $REGEX, SLASH_REGEX, 'non + trail pair'],
  [['/\\u1234\\u1234\\udc00/', '/x\\u0567\\u0567\\udc10/', '/\\uf89a\\uf89a\\udd00y/', '/x\\ubcde\\ubcde\\udebcy/'], $REGEX, SLASH_REGEX, 'non + non + trail pair'],
  [['/\\u1234\\udc00\\udc00/', '/x\\u0567\\udc10\\udc10/', '/\\uf89a\\udd00\\udd00y/', '/x\\ubcde\\udebc\\udebcy/'], $REGEX, SLASH_REGEX, 'non + trail + trail pair'],
  [['/\\ud800\\ud800\\udc00/', '/x\\ud810\\ud810\\udc10/', '/\\ud900\\ud900\\udd00y/', '/x\\udabc\\udabc\\udebcy/'], $REGEX, SLASH_REGEX, 'lead + lead + trail surrogate'],
  [['/\\ud800\\udc00\\udc00/', '/x\\ud810\\udc10\\udc10/', '/\\ud900\\udd00\\udd00y/', '/x\\udabc\\udebc\\udebcy/'], $REGEX, SLASH_REGEX, 'lead + trail + trail surrogate'],
  [['/\\ud800\\udc00\\ud800/', '/x\\ud810\\udc10\\ud810/', '/\\ud900\\udd00\\ud900y/', '/x\\udabc\\udebc\\udabcy/'], $REGEX, SLASH_REGEX, 'lead + trail + lead surrogate'],
  //// unicode long escapes (all illegal without u flag)
  [[`/\\u{0123}/`, `/\\u{4567}/`, `/\\u{89abc}/`, `/\\u{defAB}/`, `/\\u{CDEF}/`], $ERROR, SLASH_REGEX],
  [`/prefix \\u{012345}/`, $ERROR, SLASH_REGEX],
  [`/\\u{012345} postfix/`, $ERROR, SLASH_REGEX],
  [`/\\u{012345}\\u{6789a}/`, $ERROR, SLASH_REGEX],
  [[`/\\u{}/`, `/\\u{fail}/`, `/\\u{afail}/`, `/\\u{0fail}/`, `/\\u{xxxx}/`], $ERROR, SLASH_REGEX, 'long unicode escape bad contents'],
  [[`/\\u{/`, `/\\u{a/`, `/\\u{af/`, `/\\u{012/`, `/\\u{01234/`, `/\\u{012345/`], $ERROR, SLASH_REGEX, 'unclosed long unicode escapes'],
  [[`/\\u{1}/`, `/\\u{12}/`, `/\\u{123}/`, `/\\u{1234}/`, `/\\u{12345}/`, `/\\u{103456}/`], $ERROR, SLASH_REGEX, 'incomplete long unicode escapes'],
  [[`/\\u{`, `/\\u{a`, `/\\u{af`, `/\\u{123`, `/\\u{1234`, `/\\u{12345`, `/\\u{103456`], $ERROR, SLASH_REGEX, 'incomplete long unicode escapes in unclosed string', 'suffixsp'],
  [`/\\u{10ffff}/`, $ERROR, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`/\\u{110000}/`, $ERROR, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`/\\u{0000000000000000000010ffff}/`, $ERROR, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  [`/\\u{00000000000000000000110000}/`, $ERROR, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  // character classes simple
  [[`/[]/`, `/a[]/`, `/[]b/`, `/a[]b/`], $REGEX, SLASH_REGEX, 'empty class is explicitly allowed'],
  [[`/[^]/`, `/a[^]/`, `/[^]b/`, `/a[^]b/`], $REGEX, SLASH_REGEX, 'empty inverted class is explicitly allowed'],
  [[`/[a]/`, `/[b]/`, `/[c]/`, `/[d]/`, `/[e]/`, `/[f]/`, `/[g]/`, `/[h]/`, `/[i]/`, `/[j]/`, `/[k]/`, `/[l]/`, `/[m]/`, `/[n]/`, `/[o]/`, `/[p]/`, `/[q]/`, `/[r]/`, `/[s]/`, `/[t]/`, `/[u]/`, `/[v]/`, `/[w]/`, `/[x]/`, `/[y]/`, `/[z]/`], $REGEX, SLASH_REGEX, 'simple char class with one char'],
  [[`/[A]/`, `/[B]/`, `/[C]/`, `/[D]/`, `/[E]/`, `/[F]/`, `/[G]/`, `/[H]/`, `/[I]/`, `/[J]/`, `/[K]/`, `/[L]/`, `/[M]/`, `/[N]/`, `/[O]/`, `/[P]/`, `/[Q]/`, `/[R]/`, `/[S]/`, `/[T]/`, `/[U]/`, `/[V]/`, `/[W]/`, `/[X]/`, `/[Y]/`, `/[Z]/`], $REGEX, SLASH_REGEX, 'simple char class with one char'],
  [[`/[rD]/`, `/[Kq]/`, `/[$%]/`], $REGEX, SLASH_REGEX, 'simple char class with two chars'],
  [`/[-]/`, $REGEX, SLASH_REGEX, 'the class with just a dash should be legal'],
  [[`/[-b]/`, `/[-bcd]/`], $REGEX, SLASH_REGEX, 'leading dash'],
  [[`/[a-]/`, `/[abc-]/`], $REGEX, SLASH_REGEX, 'trailing dash'],
  // character class escapes (pretty much a repeat of the previous wrapped in [] ...)
  [[`/[\\b]/`, `/[a\\bc]/`, `/[\\bc]/`, `/[a\\bb]/`], $REGEX, SLASH_REGEX, 'class escape b'],
  [[`/[\\-]/`, `/[a\\-c]/`, `/[\\-c]/`, `/[a\\-b]/`], $ERROR, SLASH_REGEX, 'class escape dash with valid ranges is still illegal without u flag'],
  [`/[b\\-a]/`, $ERROR, SLASH_REGEX, 'class escape dash with invalid ranges is illegal'],
  // back references in char class
  [['/[\\0]/', '/[a\\0]/', '/[\\0b]/', '/[a\\0b]/', '/[0\\0b]/', '/[1\\0b]/'], $REGEX, SLASH_REGEX, 'NUL escape is ok in char class'],
  [['/[\\1]/', '/[\\2]/', '/[\\3]/', '/[\\4]/', '/[\\5]/', '/[\\6]/', '/[\\7]/', '/[\\8]/', '/[\\9]/'], $ERROR, SLASH_REGEX, 'non-zero digit escapes are illegal in char class'],
  [['/[\\00]/', '/[\\01]/', '/[\\02]/', '/[\\03]/', '/[\\04]/', '/[\\05]/', '/[\\06]/', '/[\\07]/', '/[\\08]/', '/[\\09]/'], $ERROR, SLASH_REGEX, 'slash 0 can never be followed by another digit'],
  [['/[\\90]/', '/[\\12]/', '/[\\23]/', '/[\\34]/', '/[\\45]/', '/[\\56]/', '/[\\67]/', '/[\\78]/', '/[\\89]/', '/[\\91]/'], $ERROR, SLASH_REGEX, 'non-zero digit escapes are illegal in char class'],
  [['/[\\0', '/[\\1', '/[\\2', '/[\\3', '/[\\4', '/[\\5', '/[\\6', '/[\\7', '/[\\8', '/[\\9'], $ERROR, SLASH_REGEX, 'digit escapes at eol/eof', 'suffixsp'],
  // char escapes in char class
  [['/[\\d]/', '/[\\D]/', '/[\\f]/', '/[\\n]/', '/[\\r]/', '/[\\s]/', '/[\\S]/', '/[\\t]/', '/[\\v]/', '/[\\w]/', '/[\\W]/'], $REGEX, SLASH_REGEX, 'only escaping a single letter'],
  [['/[abc\\d]/', '/[abc\\D]/', '/[abc\\f]/', '/[abc\\n]/', '/[abc\\r]/', '/[abc\\s]/', '/[abc\\S]/', '/[abc\\t]/', '/[abc\\v]/', '/[abc\\w]/', '/[abc\\W]/'], $REGEX, SLASH_REGEX, 'escaping a prefixed single letter'],
  [['/[\\fabcd]/', '/[\\dabcd]/', '/[\\Dabcd]/', '/[\\nabcd]/', '/[\\rabcd]/', '/[\\sabcd]/', '/[\\Sabcd]/', '/[\\tabcd]/', '/[\\vabcd]/', '/[\\wabcd]/', '/[\\Wabcd]/'], $REGEX, SLASH_REGEX, 'escaping a suffixed single letter'],
  [['/[abc\\fdeff]/', '/[abc\\ddeff]/', '/[abc\\Ddeff]/', '/[abc\\ndeff]/', '/[abc\\rdeff]/', '/[abc\\sdeff]/', '/[abc\\Sdeff]/', '/[abc\\tdeff]/', '/[abc\\vdeff]/', '/[abc\\wdeff]/', '/[abc\\Wdeff]/'], $REGEX, SLASH_REGEX, 'escaping a single letter in the middle'],
  [['/[\\a]/', '/[\\e]/', '/[\\g]/', '/[\\h]/', '/[\\i]/', '/[\\j]/', '/[\\k]/', '/[\\l]/', '/[\\m]/', '/[\\o]/', '/[\\p]/', '/[\\q]/', '/[\\u]/', '/[\\x]/', '/[\\y]/', '/[\\z]/'], $ERROR, SLASH_REGEX, 'only escaping a single lc letter'],
  [['/[\\A]/', '/[\\E]/', '/[\\F]/', '/[\\G]/', '/[\\H]/', '/[\\I]/', '/[\\J]/', '/[\\K]/', '/[\\L]/', '/[\\M]/', '/[\\N]/', '/[\\O]/', '/[\\P]/', '/[\\Q]/', '/[\\R]/', '/[\\T]/', '/[\\U]/', '/[\\V]/', '/[\\X]/', '/[\\Y]/', '/[\\Z]/'], $ERROR, SLASH_REGEX, 'only escaping a single uc letter'],
  [['/[abc\\a]/', '/[abc\\e]/', '/[abc\\g]/', '/[abc\\h]/', '/[abc\\i]/', '/[abc\\j]/', '/[abc\\k]/', '/[abc\\l]/', '/[abc\\m]/', '/[abc\\o]/', '/[abc\\p]/', '/[abc\\q]/', '/[abc\\u]/', '/[abc\\x]/', '/[abc\\y]/', '/[abc\\z]/'], $ERROR, SLASH_REGEX, 'escaping a prefixed single lc letter'],
  [['/[abc\\A]/', '/[abc\\E]/', '/[abc\\F]/', '/[abc\\G]/', '/[abc\\H]/', '/[abc\\I]/', '/[abc\\J]/', '/[abc\\K]/', '/[abc\\L]/', '/[abc\\M]/', '/[abc\\N]/', '/[abc\\O]/', '/[abc\\P]/', '/[abc\\Q]/', '/[abc\\R]/', '/[abc\\T]/', '/[abc\\U]/', '/[abc\\V]/', '/[abc\\X]/', '/[abc\\Y]/', '/[abc\\Z]/'], $ERROR, SLASH_REGEX, 'escaping a prefixed single uc letter'],
  [['/[\\aabcd]/', '/[\\eabcd]/', '/[\\gabcd]/', '/[\\habcd]/', '/[\\iabcd]/', '/[\\jabcd]/', '/[\\kabcd]/', '/[\\labcd]/', '/[\\mabcd]/', '/[\\oabcd]/', '/[\\pabcd]/', '/[\\qabcd]/', '/[\\xabcd]/', '/[\\yabcd]/', '/[\\zabcd]/'], $ERROR, SLASH_REGEX, 'escaping a suffixed single lc letter'],
  [['/[\\Aabcd]/', '/[\\Cabcd]/', '/[\\Eabcd]/', '/[\\Fabcd]/', '/[\\Gabcd]/', '/[\\Habcd]/', '/[\\Iabcd]/', '/[\\Jabcd]/', '/[\\Kabcd]/', '/[\\Labcd]/', '/[\\Mabcd]/', '/[\\Nabcd]/', '/[\\Oabcd]/', '/[\\Pabcd]/', '/[\\Qabcd]/', '/[\\Rabcd]/', '/[\\Tabcd]/', '/[\\Uabcd]/', '/[\\Vabcd]/', '/[\\Xabcd]/', '/[\\Yabcd]/', '/[\\Zabcd]/'], $ERROR, SLASH_REGEX, 'escaping a suffixed single uc letter'],
  [['/[abc\\adeff]/', '/[abc\\gdeff]/', '/[abc\\hdeff]/', '/[abc\\ideff]/', '/[abc\\jdeff]/', '/[abc\\kdeff]/', '/[abc\\ldeff]/', '/[abc\\mdeff]/', '/[abc\\odeff]/', '/[abc\\pdeff]/', '/[abc\\qdeff]/', '/[abc\\xdeff]/', '/[abc\\ydeff]/', '/[abc\\zdeff]/'], $ERROR, SLASH_REGEX, 'escaping a single lc letter in the middle'],
  [['/[abc\\Adeff]/', '/[abc\\Cdeff]/', '/[abc\\Edeff]/', '/[abc\\Fdeff]/', '/[abc\\Gdeff]/', '/[abc\\Hdeff]/', '/[abc\\Ideff]/', '/[abc\\Jdeff]/', '/[abc\\Kdeff]/', '/[abc\\Ldeff]/', '/[abc\\Mdeff]/', '/[abc\\Ndeff]/', '/[abc\\Odeff]/', '/[abc\\Pdeff]/', '/[abc\\Qdeff]/', '/[abc\\Rdeff]/', '/[abc\\Tdeff]/', '/[abc\\Udeff]/', '/[abc\\Vdeff]/', '/[abc\\Xdeff]/', '/[abc\\Ydeff]/', '/[abc\\Zdeff]/'], $ERROR, SLASH_REGEX, 'escaping a single uc letter in the middle'],
  [['/[\\_]/', '/[abc\\_]/', '/[\\_abcd]/', '/[abc\\_abcd]/'], $ERROR, SLASH_REGEX, '_ is not an escapable char'],
  [['/[\\$]/', '/[abc\\$]/', '/[\\$abcd]/', '/[abc\\$abcd]/'], $REGEX, SLASH_REGEX, '$ is a syntax char we can escape'],
  [[`/[\\^]/`, `/[\\$]/`, `/[\\\\]/`, `/[\\.]/`, `/[\\*]/`, `/[\\+]/`, `/[\\?]/`, `/[\\(]/`, `/[\\)]/`, `/[\\[]/`, `/[\\]]/`, `/[\\{]/`, `/[\\}]/`, `/[\\|]/`], $REGEX, SLASH_REGEX, 'syntax char escapes'],
  [[`/[abc\\^]/`, `/[abc\\$]/`, `/[abc\\\\]/`, `/[abc\\.]/`, `/[abc\\*]/`, `/[abc\\+]/`, `/[abc\\?]/`, `/[abc\\(]/`, `/[abc\\)]/`, `/[abc\\[]/`, `/[abc\\]]/`, `/[abc\\{]/`, `/[abc\\}]/`, `/[abc\\|]/`], $REGEX, SLASH_REGEX, 'syntax char escapes with prefix'],
  [[`/[\\^def]/`, `/[\\$def]/`, `/[\\\\def]/`, `/[\\.def]/`, `/[\\*def]/`, `/[\\+def]/`, `/[\\?def]/`, `/[\\(def]/`, `/[\\)def]/`, `/[\\[def]/`, `/[\\]def]/`, `/[\\{def]/`, `/[\\}def]/`, `/[\\|def]/`], $REGEX, SLASH_REGEX, 'syntax char escapes with suffix'],
  [[`/[\\^`, `/[\\$`, `/[\\\\`, `/[\\.`, `/[\\*`, `/[\\+`, `/[\\?`, `/[\\(`, `/[\\)`, `/[\\]`, `/[\\]`, `/[\\{`, `/[\\}`, `/[\\|`], $ERROR, SLASH_REGEX, 'syntax char escapes with early eol/eof', 'suffixsp'],
  [[`/[\\']/`, `/[\\"]/`, `/[\\\`]/`], $ERROR, SLASH_REGEX, 'typical string escapes dont work in regexes'],
  [['/[\\ca]/', '/[\\cb]/', '/[\\cd]/', '/[\\ce]/', '/[\\cf]/', '/[\\cg]/', '/[\\ch]/', '/[\\ci]/', '/[\\cj]/', '/[\\ck]/', '/[\\cl]/', '/[\\cm]/', '/[\\cn]/', '/[\\co]/', '/[\\cp]/', '/[\\cq]/', '/[\\cr]/', '/[\\cs]/', '/[\\ct]/', '/[\\cu]/', '/[\\cv]/', '/[\\cw]/', '/[\\cx]/', '/[\\cy]/', '/[\\cz]/'], $REGEX, SLASH_REGEX, 'control character lc'],
  [['/[\\cA]/', '/[\\cB]/', '/[\\cD]/', '/[\\cE]/', '/[\\cF]/', '/[\\cG]/', '/[\\cH]/', '/[\\cI]/', '/[\\cJ]/', '/[\\cK]/', '/[\\cL]/', '/[\\cM]/', '/[\\cN]/', '/[\\cO]/', '/[\\cP]/', '/[\\cQ]/', '/[\\cR]/', '/[\\cS]/', '/[\\cT]/', '/[\\cU]/', '/[\\cV]/', '/[\\cW]/', '/[\\cX]/', '/[\\cY]/', '/[\\cZ]/'], $REGEX, SLASH_REGEX, 'control character uc'],
  [['/[\\ca', '/[\\cb', '/[\\cc', '/[\\cd', '/[\\ce', '/[\\cf', '/[\\cg', '/[\\ch', '/[\\ci', '/[\\cj', '/[\\ck', '/[\\cl', '/[\\cm', '/[\\cn', '/[\\co', '/[\\cp', '/[\\cq', '/[\\cr', '/[\\cs', '/[\\ct', '/[\\cu', '/[\\cv', '/[\\cw', '/[\\cx', '/[\\cy', '/[\\cz'], $ERROR, SLASH_REGEX, 'control character lc eol/eof', 'suffixsp'],
  [['/[\\cA', '/[\\cB', '/[\\cC', '/[\\cD', '/[\\cE', '/[\\cF', '/[\\cG', '/[\\cH', '/[\\cI', '/[\\cJ', '/[\\cK', '/[\\cL', '/[\\cM', '/[\\cN', '/[\\cO', '/[\\cP', '/[\\cQ', '/[\\cR', '/[\\cS', '/[\\cT', '/[\\cU', '/[\\cV', '/[\\cW', '/[\\cX', '/[\\cY', '/[\\cZ'], $ERROR, SLASH_REGEX, 'control character uc eol/eof', 'suffixsp'],
  [['/[\\a', '/[\\b', '/[\\d', '/[\\e', '/[\\f', '/[\\g', '/[\\h', '/[\\i', '/[\\j', '/[\\k', '/[\\l', '/[\\m', '/[\\n', '/[\\o', '/[\\p', '/[\\q', '/[\\r', '/[\\s', '/[\\t', '/[\\u', '/[\\v', '/[\\w', '/[\\x', '/[\\y', '/[\\z'], $ERROR, SLASH_REGEX, 'only escaping a single lc letter', 'suffixsp'],
  [['/[\\A', '/[\\B', '/[\\D', '/[\\E', '/[\\F', '/[\\G', '/[\\H', '/[\\I', '/[\\J', '/[\\K', '/[\\L', '/[\\M', '/[\\N', '/[\\O', '/[\\P', '/[\\Q', '/[\\R', '/[\\S', '/[\\T', '/[\\U', '/[\\V', '/[\\W', '/[\\X', '/[\\Y', '/[\\Z'], $ERROR, SLASH_REGEX, 'only escaping a single uc letter', 'suffixsp'],
  [['/[abc\\a', '/[abc\\b', '/[abc\\d', '/[abc\\e', '/[abc\\f', '/[abc\\g', '/[abc\\h', '/[abc\\i', '/[abc\\j', '/[abc\\k', '/[abc\\l', '/[abc\\m', '/[abc\\n', '/[abc\\o', '/[abc\\p', '/[abc\\q', '/[abc\\r', '/[abc\\s', '/[abc\\t', '/[abc\\u', '/[abc\\v', '/[abc\\w', '/[abc\\x', '/[abc\\y', '/[abc\\z'], $ERROR, SLASH_REGEX, 'escaping a prefixed single lc letter', 'suffixsp'],
  [['/[abc\\A', '/[abc\\B', '/[abc\\D', '/[abc\\E', '/[abc\\F', '/[abc\\G', '/[abc\\H', '/[abc\\I', '/[abc\\J', '/[abc\\K', '/[abc\\L', '/[abc\\M', '/[abc\\N', '/[abc\\O', '/[abc\\P', '/[abc\\Q', '/[abc\\R', '/[abc\\S', '/[abc\\T', '/[abc\\U', '/[abc\\V', '/[abc\\W', '/[abc\\X', '/[abc\\Y', '/[abc\\Z'], $ERROR, SLASH_REGEX, 'escaping a prefixed single uc letter', 'suffixsp'],
  [['/[\\aabcd', '/[\\babcd', '/[\\cabcd', '/[\\dabcd', '/[\\eabcd', '/[\\fabcd', '/[\\gabcd', '/[\\habcd', '/[\\iabcd', '/[\\jabcd', '/[\\kabcd', '/[\\labcd', '/[\\mabcd', '/[\\nabcd', '/[\\oabcd', '/[\\pabcd', '/[\\qabcd', '/[\\rabcd', '/[\\sabcd', '/[\\tabcd', '/[\\uabcd', '/[\\vabcd', '/[\\wabcd', '/[\\xabcd', '/[\\yabcd', '/[\\zabcd'], $ERROR, SLASH_REGEX, 'escaping a suffixed single lc letter', 'suffixsp'],
  [['/[\\Aabcd', '/[\\Babcd', '/[\\Cabcd', '/[\\Dabcd', '/[\\Eabcd', '/[\\Fabcd', '/[\\Gabcd', '/[\\Habcd', '/[\\Iabcd', '/[\\Jabcd', '/[\\Kabcd', '/[\\Labcd', '/[\\Mabcd', '/[\\Nabcd', '/[\\Oabcd', '/[\\Pabcd', '/[\\Qabcd', '/[\\Rabcd', '/[\\Sabcd', '/[\\Tabcd', '/[\\Uabcd', '/[\\Vabcd', '/[\\Wabcd', '/[\\Xabcd', '/[\\Yabcd', '/[\\Zabcd'], $ERROR, SLASH_REGEX, 'escaping a suffixed single uc letter', 'suffixsp'],
  [['/[abc\\adeff', '/[abc\\bdeff', '/[abc\\cdeff', '/[abc\\ddeff', '/[abc\\edeff', '/[abc\\fdeff', '/[abc\\gdeff', '/[abc\\hdeff', '/[abc\\ideff', '/[abc\\jdeff', '/[abc\\kdeff', '/[abc\\ldeff', '/[abc\\mdeff', '/[abc\\ndeff', '/[abc\\odeff', '/[abc\\pdeff', '/[abc\\qdeff', '/[abc\\rdeff', '/[abc\\sdeff', '/[abc\\tdeff', '/[abc\\udeff', '/[abc\\vdeff', '/[abc\\wdeff', '/[abc\\xdeff', '/[abc\\ydeff', '/[abc\\zdeff'], $ERROR, SLASH_REGEX, 'escaping a single lc letter in the middle', 'suffixsp'],
  [['/[abc\\Adeff', '/[abc\\Bdeff', '/[abc\\Cdeff', '/[abc\\Ddeff', '/[abc\\Edeff', '/[abc\\Fdeff', '/[abc\\Gdeff', '/[abc\\Hdeff', '/[abc\\Ideff', '/[abc\\Jdeff', '/[abc\\Kdeff', '/[abc\\Ldeff', '/[abc\\Mdeff', '/[abc\\Ndeff', '/[abc\\Odeff', '/[abc\\Pdeff', '/[abc\\Qdeff', '/[abc\\Rdeff', '/[abc\\Sdeff', '/[abc\\Tdeff', '/[abc\\Udeff', '/[abc\\Vdeff', '/[abc\\Wdeff', '/[abc\\Xdeff', '/[abc\\Ydeff', '/[abc\\Zdeff'], $ERROR, SLASH_REGEX, 'escaping a single uc letter in the middle', 'suffixsp'],
  [['/[\\$', '/[abc\\$', '/[\\$abcd', '/[abc\\$abcd', '/[\\_', '/[abc\\_', '/[\\_abcd', '/[abc\\_abcd'], $ERROR, SLASH_REGEX, '$ and _', 'suffixsp'],
  [['/[\\x01]/', '/[\\x12]/', '/[\\x23]/', '/[\\x34]/', '/[\\x45]/', '/[\\x56]/', '/[\\x67]/', '/[\\x78]/', '/[\\x89]/', '/[\\x90]/'], $REGEX, SLASH_REGEX, 'valid hex escapes'],
  [['/[\\x]/', '/[\\x0]/', '/[\\x1]/', '/[\\x2]/', '/[\\x3]/', '/[\\x4]/', '/[\\x5]/', '/[\\x6]/', '/[\\x7]/', '/[\\x8]/', '/[\\x9]/'], $ERROR, SLASH_REGEX, 'invalid hex escape with one char'],
  [['/[\\x', '/[\\x0', '/[\\x1', '/[\\x2', '/[\\x3', '/[\\x4', '/[\\x5', '/[\\x6', '/[\\x7', '/[\\x8', '/[\\x9'], $ERROR, SLASH_REGEX, 'invalid hex escape with one charat eol/eof', 'suffixsp'],
  [['/[\\x01', '/[\\x12', '/[\\x23', '/[\\x34', '/[\\x45', '/[\\x56', '/[\\x67', '/[\\x78', '/[\\x89', '/[\\x90'], $ERROR, SLASH_REGEX, 'hex escape at eof/eol', 'suffixsp'],
  [['/[\\u1234]/', '/[x\\u0567]/', '/[\\uf89ay]/', '/[x\\ubcdey]/'], $REGEX, SLASH_REGEX, 'non surrogate'],
  [['/[\\u', '/[\\u0', '/[\\uf8', '/[\\ubcd', '/[\\ubcde'], $ERROR, SLASH_REGEX, 'incomplete unicode quad escape eol/eof', 'suffixsp'],
  [['/[x\\u', '/[x\\u0', '/[x\\uf8', '/[x\\ubcd', '/[x\\ubcde'], $ERROR, SLASH_REGEX, 'incomplete unicode quad escape eol/eof', 'suffixsp'],
  [['/[\\ud800]/', '/[x\\ud810]/', '/[\\ud900y]/', '/[x\\udabcy]/', '/[x\\udabcy]/g', '/[x\\udabcy]/m', '/[x\\udabcy]/iy'], $REGEX, SLASH_REGEX, 'lead surrogate'],
  [['/[\\ud800\\ud800]/', '/[x\\ud810\\ud810]/', '/[\\ud900\\ud900y]/', '/[x\\udabc\\udabcy]/'], $REGEX, SLASH_REGEX, 'lead + lead surrogate'],
  [['/[\\udc00]/', '/[x\\udc10]/', '/[\\udd00y]/', '/[x\\udebcy]/', '/[x\\udebcy]/g', '/[x\\udebcy]/im', '/[x\\udebcy]/y'], $REGEX, SLASH_REGEX, 'trail surrogate'],
  [['/[\\udc00\\udc00]/', '/[x\\udc10\\udc10]/', '/[\\udd00\\udd00y]/', '/[x\\udebc\\udebcy]/', '/[x\\udebc\\udebcy]/i'], $REGEX, SLASH_REGEX, 'trail + trail surrogate'],
  [['/[\\ud800\\udc00]/', '/[x\\ud810\\udc10]/', '/[\\ud900\\udd00y]/', '/[x\\udabc\\udebcy]/', '/[x\\udabc\\udebcy]/g'], $REGEX, SLASH_REGEX, 'lead + trail surrogate'],
  [['/[\\u1234\\ud800]/', '/[x\\u0567\\ud810]/', '/[\\uf89a\\ud900y]/', '/[x\\ubcde\\udabcy]/', '/[x\\ubcde\\udabcy]/m'], $REGEX, SLASH_REGEX, 'non + lead surrogate'],
  [['/[\\u1234\\udc00]/', '/[x\\u0567\\udc10]/', '/[\\uf89a\\udd00y]/', '/[x\\ubcde\\udebcy]/', '/[x\\ubcde\\udebcy]/y'], $REGEX, SLASH_REGEX, 'non + trail pair'],
  [['/[\\u1234\\u1234\\udc00]/', '/[x\\u0567\\u0567\\udc10]/', '/[\\uf89a\\uf89a\\udd00y]/', '/[x\\ubcde\\ubcde\\udebcy]/'], $REGEX, SLASH_REGEX, 'non + non + trail pair'],
  [['/[\\u1234\\udc00\\udc00]/', '/[x\\u0567\\udc10\\udc10]/', '/[\\uf89a\\udd00\\udd00y]/', '/[x\\ubcde\\udebc\\udebcy]/'], $REGEX, SLASH_REGEX, 'non + trail + trail pair'],
  [['/[\\ud800\\ud800\\udc00]/', '/[x\\ud810\\ud810\\udc10]/', '/[\\ud900\\ud900\\udd00y]/', '/[x\\udabc\\udabc\\udebcy]/'], $REGEX, SLASH_REGEX, 'lead + lead + trail surrogate'],
  [['/[\\ud800\\udc00\\udc00]/', '/[x\\ud810\\udc10\\udc10]/', '/[\\ud900\\udd00\\udd00y]/', '/[x\\udabc\\udebc\\udebcy]/'], $REGEX, SLASH_REGEX, 'lead + trail + trail surrogate'],
  [['/[\\ud800\\udc00\\ud800]/', '/[x\\ud810\\udc10\\ud810]/', '/[\\ud900\\udd00\\ud900y]/', '/[x\\udabc\\udebc\\udabcy]/'], $REGEX, SLASH_REGEX, 'lead + trail + lead surrogate'],
  [[`/[\\u{0123}]/`, `/[\\u{4567}]/`, `/[\\u{89abc}]/`, `/[\\u{defAB}]/`, `/[\\u{CDEF}]/`], $ERROR, SLASH_REGEX],
  [`/[prefix \\u{012345}]/`, $ERROR, SLASH_REGEX],
  [`/[\\u{012345} postfix]/`, $ERROR, SLASH_REGEX],
  [`/[\\u{012345}\\u{6789a}]/`, $ERROR, SLASH_REGEX],
  [[`/[\\u{}]/`, `/[\\u{fail}]/`, `/[\\u{afail}]/`, `/[\\u{0fail}]/`, `/[\\u{xxxx}]/`], $ERROR, SLASH_REGEX, 'long unicode escape bad contents'],
  [[`/[\\u{]/`, `/[\\u{a]/`, `/[\\u{af]/`, `/[\\u{012]/`, `/[\\u{01234]/`, `/[\\u{012345]/`], $ERROR, SLASH_REGEX, 'unclosed long unicode escapes'],
  [[`/[\\u{1}]/`, `/[\\u{12}]/`, `/[\\u{123}]/`, `/[\\u{1234}]/`, `/[\\u{12345}]/`, `/[\\u{103456}]/`], $ERROR, SLASH_REGEX, 'incomplete long unicode escapes'],
  [[`/[\\u{`, `/[\\u{a`, `/[\\u{af`, `/[\\u{123`, `/[\\u{1234`, `/[\\u{12345`, `/[\\u{103456`], $ERROR, SLASH_REGEX, 'incomplete long unicode escapes in unclosed string', 'suffixsp'],
  [`/[\\u{10ffff}]/`, $ERROR, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [[`/[\\u{110000}]/`, `/[\\u{120000}]/`, `/[\\u{900000}]/`, `/[\\u{123456789}]/`, `/[\\u{ffffffffffffffff}]/`], $ERROR, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`/[\\u{10000000000000000}]/`, $ERROR, SLASH_REGEX, 'regex value that would exceed 32bits'],
  [`/[\\u{fffffffffffffffffffff}]/`, $ERROR, SLASH_REGEX, 'regex value that would exceed 32bits'],
  [`/[\\u{0000000000000000000010ffff}]/`, $ERROR, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  [[`/[\\u{00000000000000000000110000}]/`, `/[\\u{00000000000000000000120000}]/`, `/[\\u{0000000000123456789}]/`, `/[\\u{000000ffffffffffffffff}]/`], $ERROR, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  [['/[\\da-z]/', '/[\\DA-Z]/', '/[\\sa-z]/', '/[\\SA-S]/', '/[\\wa-z]/', '/[\\WA-Z]/'], $REGEX, SLASH_REGEX, 'class escapes are also valid in char classes that contain ranges'],
  [['/[\\d-z]/', '/[\\D-Z]/', '/[\\s-z]/', '/[\\S-S]/', '/[\\w-z]/', '/[\\W-Z]/'], $ERROR, SLASH_REGEX, 'class escapes are never valid when part of a range'],
  [['/[x\\da-z]/', '/[x\\DA-Z]/', '/[x\\sa-z]/', '/[x\\SA-S]/', '/[x\\wa-z]/', '/[x\\WA-Z]/'], $REGEX, SLASH_REGEX, 'with prefix class escapes are also valid in char classes that contain ranges'],
  [['/[x\\d-z]/', '/[x\\D-Z]/', '/[x\\s-z]/', '/[x\\S-S]/', '/[x\\w-z]/', '/[x\\W-Z]/'], $ERROR, SLASH_REGEX, 'with prefix class escapes are never valid when part of a range'],
  [['/[a-z\\d]/', '/[A-Z\\D]/', '/[a-z\\s]/', '/[A-S\\S]/', '/[a-z\\w]/', '/[A-Z\\W]/'], $REGEX, SLASH_REGEX, 'class escapes are also valid in char classes that contain ranges'],
  [['/[a-\\d]/', '/[A-\\D]/', '/[a-\\s]/', '/[A-\\S]/', '/[a-\\w]/', '/[A-\\W]/'], $ERROR, SLASH_REGEX, 'class escapes are never valid when part of a range'],
  [['/[a-z\\dx]/', '/[A-Z\\Dx]/', '/[a-z\\sx]/', '/[A-S\\Sx]/', '/[a-z\\wx]/', '/[A-Z\\Wx]/'], $REGEX, SLASH_REGEX, 'with suffix class escapes are also valid in char classes that contain ranges'],
  [['/[a-\\dx]/', '/[A-\\Dx]/', '/[a-\\sx]/', '/[A-\\Sx]/', '/[a-\\wx]/', '/[A-\\Wx]/'], $ERROR, SLASH_REGEX, 'with suffix class escapes are never valid when part of a range'],
  ['/\\2(x)/', $ERROR, SLASH_REGEX, 'it is an error if a digital non-zero escape evaluates to a number bigger than the number of groups'],
  // surrogate pairs revisited
  ['/[1-9]/', $REGEX, SLASH_REGEX, 'char class ranges should be lo-hi'],
  ['/[9-1]/', $ERROR, SLASH_REGEX, 'char class ranges should be lo-hi and it is a syntax error otherwise'],
  ['/[\\u5000-\\u6000]/', $REGEX, SLASH_REGEX, 'escapes are no problem for ranges'],
  ['/[\\u6000-\\u5000]/', $ERROR, SLASH_REGEX, 'escapes are also bound by the lo-hi rule'],
  ['/[\\uD83D\\uDCA9]/', $REGEX, SLASH_REGEX, 'Unicode Character PILE OF POO (U+1F4A9) surrogate pair base test case. sans u-flag this matches two individual chars'],
  ['/[\\uD83D\\uDCAB]/', $REGEX, SLASH_REGEX, 'Unicode Character DIZZY SYMBOL (U+1F4AB) surrogate pair base test case. sans u-flag this matches two individual chars'],
  [['/[\\uD83D\\uDCA9-\\uD83D\\uDCAB]/', '/[\uD83D\\uDCA9-\\uD83D\\uDCAB]/', '/[\\uD83D\uDCA9-\\uD83D\\uDCAB]/', '/[\\uD83D\\uDCA9-\uD83D\\uDCAB]/', '/[\\uD83D\\uDCA9-\\uD83D\uDCAB]/', '/[\uD83D\uDCA9-\\uD83D\\uDCAB]/', '/[\uD83D\\uDCA9-\uD83D\\uDCAB]/', '/[\uD83D\\uDCA9-\\uD83D\uDCAB]/', '/[\\uD83D\uDCA9-\uD83D\\uDCAB]/', '/[\\uD83D\uDCA9-\\uD83D\uDCAB]/', '/[\\uD83D\\uDCA9-\uD83D\uDCAB]/', '/[\uD83D\uDCA9-\uD83D\\uDCAB]/', '/[\uD83D\uDCA9-\\uD83D\uDCAB]/', '/[\\uD83D\uDCA9-\uD83D\uDCAB]/', '/[\uD83D\uDCA9-\uD83D\uDCAB]/'], $ERROR, SLASH_REGEX, 'range poo to dizzy some are escapes and some are literal but surrogates should still work (and error without u flag)'],
  [['/[\\x01-\\x17]/', '/[\\u0001-\\x17]/', '/[\\x01-\\u0007]/', '/[\\x01-\\x17]/', '/[A-\\cH]/', '/[\\cH-Z]/'], $REGEX, SLASH_REGEX, 'ranges using various escapes'],
  [['/[\\u{5}-1]/', '/[\\x01-\\u{347}]/'], $ERROR, SLASH_REGEX, 'ranges using various escapes and long unicode escapes'],
  [['/[1-\\u{500}]/', '/\\u{01}-\\x07/'], $ERROR, SLASH_REGEX, 'various ranges using escapes but using long unicodes'],
  [['/[--0]/', '/[+--]/'], $REGEX, SLASH_REGEX, 'dash is also a dash at the start or end of a range'],
  [['/[-+]/', '/[+-]/', '/[---+]/', '/[---0]/'], $REGEX, SLASH_REGEX, 'positive dash edge cases'],
  ['/[-]/', $REGEX, SLASH_REGEX, 'a dash'],
  ['/[--]/', $REGEX, SLASH_REGEX, 'no range, just twice the dash'],
  ['/[---]/', $REGEX, SLASH_REGEX, 'a range that starts and ends with a dash'],
  ['/[----]/', $REGEX, SLASH_REGEX, 'a range that starts and ends with a dash and then followed by a single character that is also a dash'],
  ['/[-----]/', $REGEX, SLASH_REGEX, 'a range that starts and ends with a dash and then followed by a single character that is also a dash and ends with a dash because they cant make another range'],
  ['/[------]/', $REGEX, SLASH_REGEX, 'twice the range that starts and ends with a dash can i stop now?'],
  ['/[-------]/', $REGEX, SLASH_REGEX, 'certainly we can proof by induction now'],
  ['/[--------]/', $REGEX, SLASH_REGEX, 'yeah'],
  ['/[---------]/', $REGEX, SLASH_REGEX, 'this is n+2 so qed'],
  [['/[--+]/', '/[0--]/', '/[x---]/', '/[0---]/'], $ERROR, SLASH_REGEX, 'negative dash edge cases'],
  ['/[x-\\uD83D\\uDE07--+]/', $ERROR, SLASH_REGEX, 'range with a surrogate on the right; with u flag causing two valid ranges (x-D83DDE07 and --+), without u flag causing a valid range (x-D83D) and an invalid range (DE07--)'],
  ['/[x-\\uD83D\\uDE07--x-\\uD83D\\uDE07--]/', $ERROR, SLASH_REGEX, 'more silliness'],
  // capturing group
  [['/(b)/', '/a(b)/', '/(b)c/', '/a(b)c/'], $REGEX, SLASH_REGEX],
  [['/(b)', '/a(b)', '/(b)c', '/a(b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(', $ERROR, SLASH_REGEX, 'eol/eof in a group', 'suffixsp'],
  ['/)/', $ERROR, SLASH_REGEX, 'closing paren without opener must be escaped'],
  ['/)', $ERROR, SLASH_REGEX, 'closing paren without opener must be escaped at eol/eof', 'suffixsp'],
  [['/((b))/', '/(a(b))/', '/a(a(b))/', '/(a(b))c/', '/a(a(b))c/', '/((b)c)/', '/a((b)c)/', '/((b)c)c/', '/a((b)c)c/', '/(a(b)c)/', '/a(a(b)c)/', '/(a(b)c)c/', '/a(a(b)c)c/'], $REGEX, SLASH_REGEX],
  [['/((b', '/((b)', '/((b))', '/(a(b', '/(a(b)', '/(a(b))', '/a(a(b', '/a(a(b)', '/a(a(b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?x)/', $ERROR, SLASH_REGEX, 'qmark is invalid without proper next char'],
  ['/(?', $ERROR, SLASH_REGEX, 'qmark is invalid without proper next char at eol/eof', 'suffixsp'],
  ['/()/', $REGEX, SLASH_REGEX, 'capturing group can be empty'],
  // non-capturing group
  [['/(?:b)/', '/a(?:b)/', '/(?:b)c/', '/a(?:b)c/'], $REGEX, SLASH_REGEX],
  [['/(?:b)', '/a(?:b)', '/(?:b)c', '/a(?:b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  [['/(?:(?:b))/', '/(?:a(?:b))/', '/a(?:a(?:b))/', '/(?:a(?:b))c/', '/a(?:a(?:b))c/', '/(?:(?:b)c)/', '/a(?:(?:b)c)/', '/(?:(?:b)c)c/', '/a(?:(?:b)c)c/', '/(?:a(?:b)c)/', '/a(?:a(?:b)c)/', '/(?:a(?:b)c)c/', '/a(?:a(?:b)c)c/'], $REGEX, SLASH_REGEX],
  [['/(?:(?:b', '/(?:(?:b)', '/(?:(?:b))', '/(?:a(?:b', '/(?:a(?:b)', '/(?:a(?:b))', '/a(?:a(?:b', '/a(?:a(?:b)', '/a(?:a(?:b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?:)/', $REGEX, SLASH_REGEX, 'non capturing group can be empty'],
  // lookahead
  [['/(?=b)/', '/a(?=b)/', '/(?=b)c/', '/a(?=b)c/'], $REGEX, SLASH_REGEX],
  [['/(?=b)', '/a(?=b)', '/(?=b)c', '/a(?=b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  [['/(?=(?=b))/', '/(?=a(?=b))/', '/a(?=a(?=b))/', '/(?=a(?=b))c/', '/a(?=a(?=b))c/', '/(?=(?=b)c)/', '/a(?=(?=b)c)/', '/(?=(?=b)c)c/', '/a(?=(?=b)c)c/', '/(?=a(?=b)c)/', '/a(?=a(?=b)c)/', '/(?=a(?=b)c)c/', '/a(?=a(?=b)c)c/'], $REGEX, SLASH_REGEX],
  [['/(?=(?=b', '/(?=(?=b)', '/(?=(?=b))', '/(?=a(?=b', '/(?=a(?=b)', '/(?=a(?=b))', '/a(?=a(?=b', '/a(?=a(?=b)', '/a(?=a(?=b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?=)/', $REGEX, SLASH_REGEX, 'lookahead can be empty'],
  // negative capturing group
  [['/(?!b)/', '/a(?!b)/', '/(?!b)c/', '/a(?!b)c/'], $REGEX, SLASH_REGEX],
  [['/(?!b)', '/a(?!b)', '/(?!b)c', '/a(?!b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  [['/(?!(?!b))/', '/(?!a(?!b))/', '/a(?!a(?!b))/', '/(?!a(?!b))c/', '/a(?!a(?!b))c/', '/(?!(?!b)c)/', '/a(?!(?!b)c)/', '/(?!(?!b)c)c/', '/a(?!(?!b)c)c/', '/(?!a(?!b)c)/', '/a(?!a(?!b)c)/', '/(?!a(?!b)c)c/', '/a(?!a(?!b)c)c/'], $REGEX, SLASH_REGEX],
  [['/(?!(?!b', '/(?!(?!b)', '/(?!(?!b))', '/(?!a(?!b', '/(?!a(?!b)', '/(?!a(?!b))', '/a(?!a(?!b', '/a(?!a(?!b)', '/a(?!a(?!b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?!)/', $REGEX, SLASH_REGEX, 'inverted lookahead can be empty'],
  // mixed group types
  [[
    '/a(b(c)d)e/',
    '/a(b(?:c)d)e/',
    '/a(b(?=c)d)e/',
    '/a(b(?!c)d)e/',
    '/a(?:b(c)d)e/',
    '/a(?:b(?:c)d)e/',
    '/a(?:b(?=c)d)e/',
    '/a(?:b(?!c)d)e/',
    '/a(?=b(c)d)e/',
    '/a(?=b(?:c)d)e/',
    '/a(?=b(?=c)d)e/',
    '/a(?=b(?!c)d)e/',
    '/a(?!b(c)d)e/',
    '/a(?!b(?:c)d)e/',
    '/a(?!b(?=c)d)e/',
    '/a(?!b(?!c)d)e/',
  ], $REGEX, SLASH_REGEX],
  // unclosed groups
  [[
    '/a(bcde/',
    '/a(b(cde/',
    '/a(b(?:cd)e/',
    '/a(b(?:cde/',
    '/a(b(?=cd)e/',
    '/a(b(?=cde/',
    '/a(b(?!cd)e/',
    '/a(b(?!cde/',
    '/a(?:b(cd)e/',
    '/a(?:b(cde/',
    '/a(?:b(?:cd)e/',
    '/a(?:b(?:cde/',
    '/a(?:b(?=cd)e/',
    '/a(?:b(?=cde/',
    '/a(?:b(?!cd)e/',
    '/a(?:b(?!cde/',
    '/a(?=b(cd)e/',
    '/a(?=b(cde/',
    '/a(?=b(?:cd)e/',
    '/a(?=b(?:cde/',
    '/a(?=b(?=cd)e/',
    '/a(?=b(?=cde/',
    '/a(?=b(?!cd)e/',
    '/a(?=b(?!cde/',
    '/a(?!b(c)de/',
    '/a(?!b(cde/',
    '/a(?!b(?:cd)e/',
    '/a(?!b(?:cde/',
    '/a(?!b(?=cd)e/',
    '/a(?!b(?=cde/',
    '/a(?!b(?!cd)e/',
    '/a(?!b(?!cde/',
  ], $ERROR, SLASH_REGEX],
];
// exhaustive set of lead/tail/non surrogate combos, with one to three chars on each side of the dash (so (4**4)*(3**2)=2304 tests with a few dupes due to the empty case)
['', 'B', 'L', 'T'].forEach(a => ['', 'B', 'L', 'T'].forEach(b => ['B', 'L', 'T'].forEach(c => ['B', 'L', 'T'].forEach(d => ['', 'B', 'L', 'T'].forEach(e => ['', 'B', 'L', 'T'].forEach(f => {
  regexes.push([`/[${a}${b}${c}-${d}${e}${f}]/`.replace(/B/g, 'x').replace(/L/g, '\\uD83D').replace(/T/g, '\\uDCA9'), c<=d?$REGEX:$ERROR, SLASH_REGEX, 'generated case '+ a+b+c+d+e+f]);
}))))));

// u specific flags
let regexesu = [
  [`/abc/u`, $REGEXU, SLASH_REGEX],

  // or
  [`/a|b/u`, $REGEXU, SLASH_REGEX],
  [[`/|a/u`, `/a|/u`, `/|/u`, '/a||/u'], $ERROR, SLASH_REGEX, 'bad OR because no atoms'],

  // simple atoms and quantifiers
  [[`/^abc/u`, `/abc$/u`, `/a.c/u`], $REGEXU, SLASH_REGEX, 'simple atoms'],
  [[`/^/u`, `/ab^cd/u`, `/abc^/u`, `/abc^abc/u`, `/$/u`, `/$abc/u`, `/abc$abc/u`], $REGEXU, SLASH_REGEX, 'simple atoms where you dont usually see them'],
  [[`/a*/u`, `/a?/u`, `/a+/u`], $REGEXU, SLASH_REGEX, 'simple quantifiers'],
  [[`/a*b/u`, `/a?b/u`, `/a+b/u`], $REGEXU, SLASH_REGEX, 'simple quantifiers with suffix'],
  [[`/?/u`, `/+/u`, `/?a/u`, `/+a/u`, `/??/u`, `/+?/u`, `/|*/u`, `/|?/u`, `/|+/u`], $ERROR, SLASH_REGEX, 'simple quantifiers in an invalid place'],
  [[`/a**/u`, `/a?+/u`, `/a++/u`], $ERROR, SLASH_REGEX, 'quantifing a quantifier'],
  [`/a??/u`, $REGEXU, SLASH_REGEX, 'quantifing a quantifier', 'suffixsp'],

  // most permutations with {d,d}
  [[`/a{0}/u`, `/a{1}/u`, `/a{2}/u`, `/a{3}/u`, `/a{4}/u`, `/a{5}/u`, `/a{6}/u`, `/a{7}/u`, `/a{8}/u`, `/a{9}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{01}/u`, `/a{12}/u`, `/a{23}/u`, `/a{34}/u`, `/a{45}/u`, `/a{56}/u`, `/a{67}/u`, `/a{78}/u`, `/a{89}/u`, `/a{90}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{0,}/u`, `/a{1,}/u`, `/a{2,}/u`, `/a{3,}/u`, `/a{4,}/u`, `/a{5,}/u`, `/a{6,}/u`, `/a{7,}/u`, `/a{8,}/u`, `/a{9,}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{01,}/u`, `/a{12,}/u`, `/a{23,}/u`, `/a{34,}/u`, `/a{45,}/u`, `/a{56,}/u`, `/a{67,}/u`, `/a{78,}/u`, `/a{89,}/u`, `/a{90,}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{0,0}/u`, `/a{1,1}/u`, `/a{2,2}/u`, `/a{3,3}/u`, `/a{4,4}/u`, `/a{5,5}/u`, `/a{6,6}/u`, `/a{7,7}/u`, `/a{8,8}/u`, `/a{9,9}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{01,0}/u`, `/a{12,1}/u`, `/a{23,2}/u`, `/a{34,3}/u`, `/a{45,4}/u`, `/a{56,5}/u`, `/a{67,6}/u`, `/a{78,7}/u`, `/a{89,8}/u`, `/a{90,9}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{0,05}/u`, `/a{1,16}/u`, `/a{2,27}/u`, `/a{3,38}/u`, `/a{4,49}/u`, `/a{5,50}/u`, `/a{6,61}/u`, `/a{7,72}/u`, `/a{8,83}/u`, `/a{9,94}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{01,05}/u`, `/a{12,16}/u`, `/a{23,27}/u`, `/a{34,38}/u`, `/a{45,49}/u`, `/a{56,50}/u`, `/a{67,61}/u`, `/a{78,72}/u`, `/a{89,83}/u`, `/a{90,94}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{,0}/u`, `/a{,1}/u`, `/a{,2}/u`, `/a{,3}/u`, `/a{,4}/u`, `/a{,5}/u`, `/a{,6}/u`, `/a{,7}/u`, `/a{,8}/u`, `/a{,9}/u`], $REGEXU, SLASH_REGEX],
  [[`/a{,05}/u`, `/a{,16}/u`, `/a{,27}/u`, `/a{,38}/u`, `/a{,49}/u`, `/a{,50}/u`, `/a{,61}/u`, `/a{,72}/u`, `/a{,83}/u`, `/a{,94}/u`], $REGEXU, SLASH_REGEX],
  [['/a{ 1}/u', '/a{1 }/u', '/a{1, 1}/u', '/a{ 1, 1}/u', '/a{1 ,1}/u', '/a{ 1 , 1}/u', '/a{1,1 }/u', '/a{1, 1 }/u', '/a{ 1, 1 }/u', '/a{ 1 , 1 }/u'], $ERROR, SLASH_REGEX, 'no spaces allowed in quantifier'],

  [['/foo/u'], $REGEXU, SLASH_REGEX],
  [['/foo/uu'], $ERROR, SLASH_REGEX],
  [['/foo/um', '/foo/ui', '/foo/ug', '/foo/uy'], $REGEXU, SLASH_REGEX],
  [['/foo/mu', '/foo/iu', '/foo/gu', '/foo/yu'], $REGEXU, SLASH_REGEX],
  [['/foo/uig', '/foo/gui', '/foo/ium', '/foo/myu', '/foo/ugy'], $REGEXU, SLASH_REGEX],
  [['/foo/uiug', '/foo/gmumi', '/foo/ggumi', '/foo/myuy', '/foo/iugyi'], $ERROR, SLASH_REGEX],

  // escapes (only \f \n \r \t \v should work)
  [['/\\d/u', '/\\D/u', '/\\f/u', '/\\n/u', '/\\r/u', '/\\s/u', '/\\S/u', '/\\t/u', '/\\v/u', '/\\w/u', '/\\W/u'], $REGEXU, SLASH_REGEX, 'only escaping a single letter'],
  [['/abc\\d/u', '/abc\\D/u', '/abc\\f/u', '/abc\\n/u', '/abc\\r/u', '/abc\\s/u', '/abc\\S/u', '/abc\\t/u', '/abc\\v/u', '/abc\\w/u', '/abc\\W/u'], $REGEXU, SLASH_REGEX, 'escaping a prefixed single letter'],
  [['/\\fabcd/u', '/\\dabcd/u', '/\\Dabcd/u', '/\\nabcd/u', '/\\rabcd/u', '/\\sabcd/u', '/\\Sabcd/u', '/\\tabcd/u', '/\\vabcd/u', '/\\wabcd/u', '/\\Wabcd/u'], $REGEXU, SLASH_REGEX, 'escaping a suffixed single letter'],
  [['/abc\\fdeff/u', '/abc\\ddeff/u', '/abc\\Ddeff/u', '/abc\\ndeff/u', '/abc\\rdeff/u', '/abc\\sdeff/u', '/abc\\Sdeff/u', '/abc\\tdeff/u', '/abc\\vdeff/u', '/abc\\wdeff/u', '/abc\\Wdeff/u'], $REGEXU, SLASH_REGEX, 'escaping a single letter in the middle'],
  // the other char escapes are errors...
  [['/\\a/u', '/\\e/u', '/\\g/u', '/\\h/u', '/\\i/u', '/\\j/u', '/\\k/u', '/\\l/u', '/\\m/u', '/\\o/u', '/\\p/u', '/\\q/u', '/\\u/u', '/\\x/u', '/\\y/u', '/\\z/u'], $ERROR, SLASH_REGEX, 'only escaping a single lc letter'],
  [['/\\A/u', '/\\E/u', '/\\F/u', '/\\G/u', '/\\H/u', '/\\I/u', '/\\J/u', '/\\K/u', '/\\L/u', '/\\M/u', '/\\N/u', '/\\O/u', '/\\P/u', '/\\Q/u', '/\\R/u', '/\\T/u', '/\\U/u', '/\\V/u', '/\\X/u', '/\\Y/u', '/\\Z/u'], $ERROR, SLASH_REGEX, 'only escaping a single uc letter'],
  [['/abc\\a/u', '/abc\\e/u', '/abc\\g/u', '/abc\\h/u', '/abc\\i/u', '/abc\\j/u', '/abc\\k/u', '/abc\\l/u', '/abc\\m/u', '/abc\\o/u', '/abc\\p/u', '/abc\\q/u', '/abc\\u/u', '/abc\\x/u', '/abc\\y/u', '/abc\\z/u'], $ERROR, SLASH_REGEX, 'escaping a prefixed single lc letter'],
  [['/abc\\A/u', '/abc\\E/u', '/abc\\F/u', '/abc\\G/u', '/abc\\H/u', '/abc\\I/u', '/abc\\J/u', '/abc\\K/u', '/abc\\L/u', '/abc\\M/u', '/abc\\N/u', '/abc\\O/u', '/abc\\P/u', '/abc\\Q/u', '/abc\\R/u', '/abc\\T/u', '/abc\\U/u', '/abc\\V/u', '/abc\\X/u', '/abc\\Y/u', '/abc\\Z/u'], $ERROR, SLASH_REGEX, 'escaping a prefixed single uc letter'],
  [['/\\aabcd/u', '/\\eabcd/u', '/\\gabcd/u', '/\\habcd/u', '/\\iabcd/u', '/\\jabcd/u', '/\\kabcd/u', '/\\labcd/u', '/\\mabcd/u', '/\\oabcd/u', '/\\pabcd/u', '/\\qabcd/u', '/\\xabcd/u', '/\\yabcd/u', '/\\zabcd/u'], $ERROR, SLASH_REGEX, 'escaping a suffixed single lc letter'],
  [['/\\Aabcd/u', '/\\Cabcd/u', '/\\Eabcd/u', '/\\Fabcd/u', '/\\Gabcd/u', '/\\Habcd/u', '/\\Iabcd/u', '/\\Jabcd/u', '/\\Kabcd/u', '/\\Labcd/u', '/\\Mabcd/u', '/\\Nabcd/u', '/\\Oabcd/u', '/\\Pabcd/u', '/\\Qabcd/u', '/\\Rabcd/u', '/\\Tabcd/u', '/\\Uabcd/u', '/\\Vabcd/u', '/\\Xabcd/u', '/\\Yabcd/u', '/\\Zabcd/u'], $ERROR, SLASH_REGEX, 'escaping a suffixed single uc letter'],
  [['/abc\\adeff/u', '/abc\\gdeff/u', '/abc\\hdeff/u', '/abc\\ideff/u', '/abc\\jdeff/u', '/abc\\kdeff/u', '/abc\\ldeff/u', '/abc\\mdeff/u', '/abc\\odeff/u', '/abc\\pdeff/u', '/abc\\qdeff/u', '/abc\\xdeff/u', '/abc\\ydeff/u', '/abc\\zdeff/u'], $ERROR, SLASH_REGEX, 'escaping a single lc letter in the middle'],
  [['/abc\\Adeff/u', '/abc\\Cdeff/u', '/abc\\Edeff/u', '/abc\\Fdeff/u', '/abc\\Gdeff/u', '/abc\\Hdeff/u', '/abc\\Ideff/u', '/abc\\Jdeff/u', '/abc\\Kdeff/u', '/abc\\Ldeff/u', '/abc\\Mdeff/u', '/abc\\Ndeff/u', '/abc\\Odeff/u', '/abc\\Pdeff/u', '/abc\\Qdeff/u', '/abc\\Rdeff/u', '/abc\\Tdeff/u', '/abc\\Udeff/u', '/abc\\Vdeff/u', '/abc\\Xdeff/u', '/abc\\Ydeff/u', '/abc\\Zdeff/u'], $ERROR, SLASH_REGEX, 'escaping a single uc letter in the middle'],
  [['/\\_/u', '/abc\\_/u', '/\\_abcd/u', '/abc\\_abcd/u'], $ERROR, SLASH_REGEX, '_ is not an escapable char'],
  [['/\\$/u', '/abc\\$/u', '/\\$abcd/u', '/abc\\$abcd/u'], $REGEXU, SLASH_REGEX, '$ is a syntax char we can escape'],
  // escaping "syntax characters"
  [[`/\\^/u`, `/\\$/u`, `/\\\\/u`, `/\\./u`, `/\\*/u`, `/\\+/u`, `/\\?/u`, `/\\(/u`, `/\\)/u`, `/\\[/u`, `/\\]/u`, `/\\{/u`, `/\\}/u`, `/\\|/u`], $REGEXU, SLASH_REGEX, 'syntax char escapes'],
  [[`/abc\\^/u`, `/abc\\$/u`, `/abc\\\\/u`, `/abc\\./u`, `/abc\\*/u`, `/abc\\+/u`, `/abc\\?/u`, `/abc\\(/u`, `/abc\\)/u`, `/abc\\[/u`, `/abc\\]/u`, `/abc\\{/u`, `/abc\\}/u`, `/abc\\|/u`], $REGEXU, SLASH_REGEX, 'syntax char escapes with prefix'],
  [[`/\\^def/u`, `/\\$def/u`, `/\\\\def/u`, `/\\.def/u`, `/\\*def/u`, `/\\+def/u`, `/\\?def/u`, `/\\(def/u`, `/\\)def/u`, `/\\[def/u`, `/\\]def/u`, `/\\{def/u`, `/\\}def/u`, `/\\|def/u`], $REGEXU, SLASH_REGEX, 'syntax char escapes with suffix'],
  [[`/\\'/u`, `/\\"/u`, `/\\\`/u`], $ERROR, SLASH_REGEX, 'typical string escapes dont work in regexes'],
  [['/^/u', '/$/u', '/./u'], $REGEXU, SLASH_REGEX, 'off to a good start'],
  [['/+/u', '/?/u', '/)/u', '/]/u', '/{/u', '/}/u', '/|/u'], $ERROR, SLASH_REGEX, 'off to a bad start'],
  [['/a|*/u', '/a|+/u', '/a|?/u', '/a|)/u', '/a|]/u', '/a|{/u', '/a|}/u', '/a||/u'], $ERROR, SLASH_REGEX, 'and you started so well'],
  [['/\\/u', '/a|\\/u'], $ERROR, SLASH_REGEX, '(eol/eof case)', 'suffixsp'],
  // \c<x>
  [['/\\ca/u', '/\\cb/u', '/\\cd/u', '/\\ce/u', '/\\cf/u', '/\\cg/u', '/\\ch/u', '/\\ci/u', '/\\cj/u', '/\\ck/u', '/\\cl/u', '/\\cm/u', '/\\cn/u', '/\\co/u', '/\\cp/u', '/\\cq/u', '/\\cr/u', '/\\cs/u', '/\\ct/u', '/\\cu/u', '/\\cv/u', '/\\cw/u', '/\\cx/u', '/\\cy/u', '/\\cz/u'], $REGEXU, SLASH_REGEX, 'control character lc'],
  [['/\\cA/u', '/\\cB/u', '/\\cD/u', '/\\cE/u', '/\\cF/u', '/\\cG/u', '/\\cH/u', '/\\cI/u', '/\\cJ/u', '/\\cK/u', '/\\cL/u', '/\\cM/u', '/\\cN/u', '/\\cO/u', '/\\cP/u', '/\\cQ/u', '/\\cR/u', '/\\cS/u', '/\\cT/u', '/\\cU/u', '/\\cV/u', '/\\cW/u', '/\\cX/u', '/\\cY/u', '/\\cZ/u'], $REGEXU, SLASH_REGEX, 'control character uc'],
  // hex escapes
  [['/\\x01/u', '/\\x12/u', '/\\x23/u', '/\\x34/u', '/\\x45/u', '/\\x56/u', '/\\x67/u', '/\\x78/u', '/\\x89/u', '/\\x90/u'], $REGEXU, SLASH_REGEX, 'valid hex escapes'],
  [['/\\x/u', '/\\x0/u', '/\\x1/u', '/\\x2/u', '/\\x3/u', '/\\x4/u', '/\\x5/u', '/\\x6/u', '/\\x7/u', '/\\x8/u', '/\\x9/u'], $ERROR, SLASH_REGEX, 'invalid hex escape with one char'],
  // digit escape
  // digit escape / backreferences
  [['/\\0/u', '/a\\0/u', '/\\0b/u', '/a\\0b/u', '/(a)\\0/u', '/\\0(b)/u', '/(\\0)/u', '/(0\\0)/u', '/(1\\0)/u'], $REGEXU, SLASH_REGEX, 'escaped zero is a NUL and not a back reference'],
  [['/\\01/u', '/a\\02/u', '/\\03b/u', '/a\\04b/u', '/(a)\\05/u', '/\\06(b)/u', '/(\\07)/u', '/\\08/u', '/\\09/u', '/\\00/u'], $ERROR, SLASH_REGEX, 'escaped zero can not be followed by another digit'],
  [['/\\0', '/a\\0', '/\\0b', '/a\\0b', '/(a)\\0', '/\\0(b)', '/(\\0)'], $ERROR, SLASH_REGEX, 'escaped zero at eol/eof', 'suffixsp'],
  [['/\\01', '/a\\02', '/\\03b', '/a\\04b', '/(a)\\05', '/\\06(b)', '/(\\07)', '/\\08', '/\\09', '/\\00'], $ERROR, SLASH_REGEX, 'escaped zero at eol/eof', 'suffixsp'],
  [['/\\1(a)/u', '/(a)\\1/u', '/(\\1)/u', '/\\1x(a)/u', '/(a)x\\1/u', '/(a\\1b)/u', '/0\\1(a)/u', '/4\\1(a)/u', '/(a)|\\1/u', '/\\1|(a)/u', '/(\\1|a)/u', '/(a|\\1)/u'], $REGEXU, SLASH_REGEX, 'backreference anywhere with 1 capturing group'],
  [['/\\1(a)', '/(a)\\1', '/(\\1)', '/\\1x(a)', '/(a)x\\1', '/(a\\1b)', '/0\\1(a)', '/4\\1(a)', '/(a)|\\1', '/\\1|(a)', '/(\\1|a)', '/(a|\\1)'], $ERROR, SLASH_REGEX, 'backreference anywhere with eol/eof', 'suffixsp'],
  [['/\\2(a)/u', '/(a)\\3/u', '/(\\4)/u', '/\\5x(a)/u', '/(a)x\\6/u', '/(a\\7b)/u', '/0\\8(a)/u', '/4\\9(a)/u', '/(a)|\\10/u', '/\\11|(a)/u', '/(\\12|a)/u', '/(a|\\13)/u'], $ERROR, SLASH_REGEX, 'illegal backreference indexes'],
  [[
    '/\\0/u', '/(a)\\0/u',
    '/(a)\\1/u', '/((a))\\1/u',
    '/((a))\\2/u', '/(((a)))\\2/u',
    '/(((a)))\\3/u', '/((((a))))\\3/u',
    '/((((a))))\\4/u', '/(((((a)))))\\4/u',
    '/(((((a)))))\\5/u', '/((((((a))))))\\5/u',
    '/((((((a))))))\\6/u', '/(((((((a)))))))\\6/u',
    '/(((((((a)))))))\\7/u', '/((((((((a))))))))\\7/u',
    '/((((((((a))))))))\\8/u', '/(((((((((a)))))))))\\8/u',
    '/(((((((((a)))))))))\\9/u', '/((((((((((a))))))))))\\9/u',
    '/((((((((((a))))))))))\\10/u', '/(((((((((((a)))))))))))\\10/u',
    '/(((((((((((a)))))))))))\\11/u', '/((((((((((((a))))))))))))\\11/u',
    '/((((((((((((a))))))))))))\\12/u', '/(((((((((((((a)))))))))))))\\12/u',
    '/(((((((((((((a)))))))))))))\\13/u', '/((((((((((((((a))))))))))))))\\13/u',
    '/((((((((((((((a))))))))))))))\\14/u', '/(((((((((((((((a)))))))))))))))\\14/u',
    '/(((((((((((((((a)))))))))))))))\\15/u', '/((((((((((((((((a))))))))))))))))\\15/u',
    '/((((((((((((((((a))))))))))))))))\\16/u', '/(((((((((((((((((a)))))))))))))))))\\16/u',
    '/(((((((((((((((((a)))))))))))))))))\\17/u', '/((((((((((((((((((a))))))))))))))))))\\17/u',
    '/((((((((((((((((((a))))))))))))))))))\\18/u', '/(((((((((((((((((((a)))))))))))))))))))\\18/u',
    '/(((((((((((((((((((a)))))))))))))))))))\\19/u', '/((((((((((((((((((((a))))))))))))))))))))\\19/u',
    '/((((((((((((((((((((a))))))))))))))))))))\\20/u', '/(((((((((((((((((((((a)))))))))))))))))))))\\20/u',
  ], $REGEXU, SLASH_REGEX, '0 to 20 matching groups with as many or as many plus 1 groups (tests all digits for escaping one or two digits)'],
  [[
    '/a\\1/u',
    '/(a)\\2/u',
    '/((a))\\3/u',
    '/(((a)))\\4/u',
    '/((((a))))\\5/u',
    '/(((((a)))))\\6/u',
    '/((((((a))))))\\7/u',
    '/(((((((a)))))))\\8/u',
    '/((((((((a))))))))\\9/u',
    '/(((((((((a)))))))))\\10/u',
    '/((((((((((a))))))))))\\11/u',
    '/(((((((((((a)))))))))))\\12/u',
    '/((((((((((((a))))))))))))\\13/u',
    '/(((((((((((((a)))))))))))))\\14/u',
    '/((((((((((((((a))))))))))))))\\15/u',
    '/(((((((((((((((a)))))))))))))))\\16/u',
    '/((((((((((((((((a))))))))))))))))\\17/u',
    '/(((((((((((((((((a)))))))))))))))))\\18/u',
    '/((((((((((((((((((a))))))))))))))))))\\19/u',
    '/(((((((((((((((((((a)))))))))))))))))))\\20/u',
    '/((((((((((((((((((((a))))))))))))))))))))\\21/u',
  ], $ERROR, SLASH_REGEX, '1 to 21 matching groups with one too few groups'],
  // unicode quad escapes (more relevant for u-mode but still good to have in both). see also the class escapes
  [['/\\u1234/u', '/x\\u0567/u', '/\\uf89ay/u', '/x\\ubcdey/u'], $REGEXU, SLASH_REGEX, 'non surrogate'],
  //// surrogate stuff
  [['/\\ud800/u', '/x\\ud810/u', '/\\ud900y/u', '/x\\udabcy/u', '/x\\udabcy/ug', '/x\\udabcy/um', '/x\\udabcy/iuy'], $REGEXU, SLASH_REGEX, 'lead surrogate'],
  [['/\\ud800\\ud800/u', '/x\\ud810\\ud810/u', '/\\ud900\\ud900y/u', '/x\\udabc\\udabcy/u'], $REGEXU, SLASH_REGEX, 'lead + lead surrogate'],
  [['/\\udc00/u', '/x\\udc10/u', '/\\udd00y/u', '/x\\udebcy/u', '/x\\udebcy/gu', '/x\\udebcy/ium', '/x\\udebcy/uy'], $REGEXU, SLASH_REGEX, 'trail surrogate'],
  [['/\\udc00\\udc00/u', '/x\\udc10\\udc10/u', '/\\udd00\\udd00y/u', '/x\\udebc\\udebcy/u', '/x\\udebc\\udebcy/iu'], $REGEXU, SLASH_REGEX, 'trail + trail surrogate'],
  [['/\\ud800\\udc00/u', '/x\\ud810\\udc10/u', '/\\ud900\\udd00y/u', '/x\\udabc\\udebcy/u', '/x\\udabc\\udebcy/ug'], $REGEXU, SLASH_REGEX, 'lead + trail surrogate'],
  [['/\\u1234\\ud800/u', '/x\\u0567\\ud810/u', '/\\uf89a\\ud900y/u', '/x\\ubcde\\udabcy/u', '/x\\ubcde\\udabcy/mu'], $REGEXU, SLASH_REGEX, 'non + lead surrogate'],
  [['/\\u1234\\udc00/u', '/x\\u0567\\udc10/u', '/\\uf89a\\udd00y/u', '/x\\ubcde\\udebcy/u', '/x\\ubcde\\udebcy/uy'], $REGEXU, SLASH_REGEX, 'non + trail pair'],
  [['/\\u1234\\u1234\\udc00/u', '/x\\u0567\\u0567\\udc10/u', '/\\uf89a\\uf89a\\udd00y/u', '/x\\ubcde\\ubcde\\udebcy/u'], $REGEXU, SLASH_REGEX, 'non + non + trail pair'],
  [['/\\u1234\\udc00\\udc00/u', '/x\\u0567\\udc10\\udc10/u', '/\\uf89a\\udd00\\udd00y/u', '/x\\ubcde\\udebc\\udebcy/u'], $REGEXU, SLASH_REGEX, 'non + trail + trail pair'],
  [['/\\ud800\\ud800\\udc00/u', '/x\\ud810\\ud810\\udc10/u', '/\\ud900\\ud900\\udd00y/u', '/x\\udabc\\udabc\\udebcy/u'], $REGEXU, SLASH_REGEX, 'lead + lead + trail surrogate'],
  [['/\\ud800\\udc00\\udc00/u', '/x\\ud810\\udc10\\udc10/u', '/\\ud900\\udd00\\udd00y/u', '/x\\udabc\\udebc\\udebcy/u'], $REGEXU, SLASH_REGEX, 'lead + trail + trail surrogate'],
  [['/\\ud800\\udc00\\ud800/u', '/x\\ud810\\udc10\\ud810/u', '/\\ud900\\udd00\\ud900y/u', '/x\\udabc\\udebc\\udabcy/u'], $REGEXU, SLASH_REGEX, 'lead + trail + lead surrogate'],
  //// unicode long escapes (all illegal without u flag)
  [[`/\\u{0123}/u`, `/\\u{4567}/u`, `/\\u{89abc}/u`, `/\\u{defAB}/u`, `/\\u{CDEF}/u`], $REGEXU, SLASH_REGEX],
  [`/prefix \\u{012345}/u`, $REGEXU, SLASH_REGEX],
  [`/\\u{012345} postfix/u`, $REGEXU, SLASH_REGEX],
  [`/\\u{012345}\\u{6789a}/u`, $REGEXU, SLASH_REGEX],
  [[`/\\u{}/u`, `/\\u{fail}/u`, `/\\u{afail}/u`, `/\\u{0fail}/u`, `/\\u{xxxx}/u`], $ERROR, SLASH_REGEX, 'long unicode escape bad contents'],
  [[`/\\u{/u`, `/\\u{a/u`, `/\\u{af/u`, `/\\u{012/u`, `/\\u{01234/u`, `/\\u{012345/u`], $ERROR, SLASH_REGEX, 'unclosed long unicode escapes'],
  [[`/\\u{1}/u`, `/\\u{12}/u`, `/\\u{123}/u`, `/\\u{1234}/u`, `/\\u{12345}/u`, `/\\u{103456}/u`], $REGEXU, SLASH_REGEX, 'long unicode escapes'],
  [`/\\u{10ffff}/u`, $REGEXU, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`/\\u{110000}/u`, $ERROR, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`/\\u{0000000000000000000010ffff}/u`, $REGEXU, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  [`/\\u{00000000000000000000110000}/u`, $ERROR, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  // character classes simple
  [[`/[]/u`, `/a[]/u`, `/[]b/u`, `/a[]b/u`], $REGEXU, SLASH_REGEX, 'empty class is explicitly allowed'],
  [[`/[^]/u`, `/a[^]/u`, `/[^]b/u`, `/a[^]b/u`], $REGEXU, SLASH_REGEX, 'empty inverted class is explicitly allowed'],
  [[`/[a]/u`, `/[b]/u`, `/[c]/u`, `/[d]/u`, `/[e]/u`, `/[f]/u`, `/[g]/u`, `/[h]/u`, `/[i]/u`, `/[j]/u`, `/[k]/u`, `/[l]/u`, `/[m]/u`, `/[n]/u`, `/[o]/u`, `/[p]/u`, `/[q]/u`, `/[r]/u`, `/[s]/u`, `/[t]/u`, `/[u]/u`, `/[v]/u`, `/[w]/u`, `/[x]/u`, `/[y]/u`, `/[z]/u`], $REGEXU, SLASH_REGEX, 'simple char class with one char'],
  [[`/[A]/u`, `/[B]/u`, `/[C]/u`, `/[D]/u`, `/[E]/u`, `/[F]/u`, `/[G]/u`, `/[H]/u`, `/[I]/u`, `/[J]/u`, `/[K]/u`, `/[L]/u`, `/[M]/u`, `/[N]/u`, `/[O]/u`, `/[P]/u`, `/[Q]/u`, `/[R]/u`, `/[S]/u`, `/[T]/u`, `/[U]/u`, `/[V]/u`, `/[W]/u`, `/[X]/u`, `/[Y]/u`, `/[Z]/u`], $REGEXU, SLASH_REGEX, 'simple char class with one char'],
  [[`/[rD]/u`, `/[Kq]/u`, `/[$%]/u`], $REGEXU, SLASH_REGEX, 'simple char class with two chars'],
  [`/[-]/u`, $REGEXU, SLASH_REGEX, 'the class with just a dash should be legal'],
  [[`/[-b]/u`, `/[-bcd]/u`], $REGEXU, SLASH_REGEX, 'leading dash'],
  [[`/[a-]/u`, `/[abc-]/u`], $REGEXU, SLASH_REGEX, 'trailing dash'],
  // character class escapes (pretty much a repeat of the previous wrapped in [] ...)
  [[`/[\\b]/u`, `/[a\\bc]/u`, `/[\\bc]/u`, `/[a\\bb]/u`], $REGEXU, SLASH_REGEX, 'class escape b'],
  [[`/[\\-]/u`, `/[a\\-c]/u`, `/[\\-c]/u`, `/[a\\-b]/u`], $REGEXU, SLASH_REGEX, 'class escape dash with valid ranges is still illegal without u flag'],
  [`/[b\\-a]/u`, $ERROR, SLASH_REGEX, 'class escape dash with invalid ranges is illegal'],
  // back references in char class
  [['/[\\0]/u', '/[a\\0]/u', '/[\\0b]/u', '/[a\\0b]/u', '/[0\\0b]/u', '/[1\\0b]/u'], $REGEXU, SLASH_REGEX, 'NUL escape is ok in char class'],
  [['/[\\1]/u', '/[\\2]/u', '/[\\3]/u', '/[\\4]/u', '/[\\5]/u', '/[\\6]/u', '/[\\7]/u', '/[\\8]/u', '/[\\9]/u'], $ERROR, SLASH_REGEX, 'non-zero digit escapes are illegal in char class'],
  [['/[\\00]/u', '/[\\01]/u', '/[\\02]/u', '/[\\03]/u', '/[\\04]/u', '/[\\05]/u', '/[\\06]/u', '/[\\07]/u', '/[\\08]/u', '/[\\09]/u'], $ERROR, SLASH_REGEX, 'slash 0 can never be followed by another digit'],
  [['/[\\90]/u', '/[\\12]/u', '/[\\23]/u', '/[\\34]/u', '/[\\45]/u', '/[\\56]/u', '/[\\67]/u', '/[\\78]/u', '/[\\89]/u', '/[\\91]/u'], $ERROR, SLASH_REGEX, 'non-zero digit escapes are illegal in char class'],
  [['/[\\0', '/[\\1', '/[\\2', '/[\\3', '/[\\4', '/[\\5', '/[\\6', '/[\\7', '/[\\8', '/[\\9'], $ERROR, SLASH_REGEX, 'digit escapes at eol/eof', 'suffixsp'],
  // char escapes in char class
  [['/[\\d]/u', '/[\\D]/u', '/[\\f]/u', '/[\\n]/u', '/[\\r]/u', '/[\\s]/u', '/[\\S]/u', '/[\\t]/u', '/[\\v]/u', '/[\\w]/u', '/[\\W]/u'], $REGEXU, SLASH_REGEX, 'only escaping a single letter'],
  [['/[abc\\d]/u', '/[abc\\D]/u', '/[abc\\f]/u', '/[abc\\n]/u', '/[abc\\r]/u', '/[abc\\s]/u', '/[abc\\S]/u', '/[abc\\t]/u', '/[abc\\v]/u', '/[abc\\w]/u', '/[abc\\W]/u'], $REGEXU, SLASH_REGEX, 'escaping a prefixed single letter'],
  [['/[\\fabcd]/u', '/[\\dabcd]/u', '/[\\Dabcd]/u', '/[\\nabcd]/u', '/[\\rabcd]/u', '/[\\sabcd]/u', '/[\\Sabcd]/u', '/[\\tabcd]/u', '/[\\vabcd]/u', '/[\\wabcd]/u', '/[\\Wabcd]/u'], $REGEXU, SLASH_REGEX, 'escaping a suffixed single letter'],
  [['/[abc\\fdeff]/u', '/[abc\\ddeff]/u', '/[abc\\Ddeff]/u', '/[abc\\ndeff]/u', '/[abc\\rdeff]/u', '/[abc\\sdeff]/u', '/[abc\\Sdeff]/u', '/[abc\\tdeff]/u', '/[abc\\vdeff]/u', '/[abc\\wdeff]/u', '/[abc\\Wdeff]/u'], $REGEXU, SLASH_REGEX, 'escaping a single letter in the middle'],
  [['/[\\a]/u', '/[\\e]/u', '/[\\g]/u', '/[\\h]/u', '/[\\i]/u', '/[\\j]/u', '/[\\k]/u', '/[\\l]/u', '/[\\m]/u', '/[\\o]/u', '/[\\p]/u', '/[\\q]/u', '/[\\u]/u', '/[\\x]/u', '/[\\y]/u', '/[\\z]/u'], $ERROR, SLASH_REGEX, 'only escaping a single lc letter'],
  [['/[\\A]/u', '/[\\E]/u', '/[\\F]/u', '/[\\G]/u', '/[\\H]/u', '/[\\I]/u', '/[\\J]/u', '/[\\K]/u', '/[\\L]/u', '/[\\M]/u', '/[\\N]/u', '/[\\O]/u', '/[\\P]/u', '/[\\Q]/u', '/[\\R]/u', '/[\\T]/u', '/[\\U]/u', '/[\\V]/u', '/[\\X]/u', '/[\\Y]/u', '/[\\Z]/u'], $ERROR, SLASH_REGEX, 'only escaping a single uc letter'],
  [['/[abc\\a]/u', '/[abc\\e]/u', '/[abc\\g]/u', '/[abc\\h]/u', '/[abc\\i]/u', '/[abc\\j]/u', '/[abc\\k]/u', '/[abc\\l]/u', '/[abc\\m]/u', '/[abc\\o]/u', '/[abc\\p]/u', '/[abc\\q]/u', '/[abc\\u]/u', '/[abc\\x]/u', '/[abc\\y]/u', '/[abc\\z]/u'], $ERROR, SLASH_REGEX, 'escaping a prefixed single lc letter'],
  [['/[abc\\A]/u', '/[abc\\E]/u', '/[abc\\F]/u', '/[abc\\G]/u', '/[abc\\H]/u', '/[abc\\I]/u', '/[abc\\J]/u', '/[abc\\K]/u', '/[abc\\L]/u', '/[abc\\M]/u', '/[abc\\N]/u', '/[abc\\O]/u', '/[abc\\P]/u', '/[abc\\Q]/u', '/[abc\\R]/u', '/[abc\\T]/u', '/[abc\\U]/u', '/[abc\\V]/u', '/[abc\\X]/u', '/[abc\\Y]/u', '/[abc\\Z]/u'], $ERROR, SLASH_REGEX, 'escaping a prefixed single uc letter'],
  [['/[\\aabcd]/u', '/[\\eabcd]/u', '/[\\gabcd]/u', '/[\\habcd]/u', '/[\\iabcd]/u', '/[\\jabcd]/u', '/[\\kabcd]/u', '/[\\labcd]/u', '/[\\mabcd]/u', '/[\\oabcd]/u', '/[\\pabcd]/u', '/[\\qabcd]/u', '/[\\xabcd]/u', '/[\\yabcd]/u', '/[\\zabcd]/u'], $ERROR, SLASH_REGEX, 'escaping a suffixed single lc letter'],
  [['/[\\Aabcd]/u', '/[\\Cabcd]/u', '/[\\Eabcd]/u', '/[\\Fabcd]/u', '/[\\Gabcd]/u', '/[\\Habcd]/u', '/[\\Iabcd]/u', '/[\\Jabcd]/u', '/[\\Kabcd]/u', '/[\\Labcd]/u', '/[\\Mabcd]/u', '/[\\Nabcd]/u', '/[\\Oabcd]/u', '/[\\Pabcd]/u', '/[\\Qabcd]/u', '/[\\Rabcd]/u', '/[\\Tabcd]/u', '/[\\Uabcd]/u', '/[\\Vabcd]/u', '/[\\Xabcd]/u', '/[\\Yabcd]/u', '/[\\Zabcd]/u'], $ERROR, SLASH_REGEX, 'escaping a suffixed single uc letter'],
  [['/[abc\\adeff]/u', '/[abc\\gdeff]/u', '/[abc\\hdeff]/u', '/[abc\\ideff]/u', '/[abc\\jdeff]/u', '/[abc\\kdeff]/u', '/[abc\\ldeff]/u', '/[abc\\mdeff]/u', '/[abc\\odeff]/u', '/[abc\\pdeff]/u', '/[abc\\qdeff]/u', '/[abc\\xdeff]/u', '/[abc\\ydeff]/u', '/[abc\\zdeff]/u'], $ERROR, SLASH_REGEX, 'escaping a single lc letter in the middle'],
  [['/[abc\\Adeff]/u', '/[abc\\Cdeff]/u', '/[abc\\Edeff]/u', '/[abc\\Fdeff]/u', '/[abc\\Gdeff]/u', '/[abc\\Hdeff]/u', '/[abc\\Ideff]/u', '/[abc\\Jdeff]/u', '/[abc\\Kdeff]/u', '/[abc\\Ldeff]/u', '/[abc\\Mdeff]/u', '/[abc\\Ndeff]/u', '/[abc\\Odeff]/u', '/[abc\\Pdeff]/u', '/[abc\\Qdeff]/u', '/[abc\\Rdeff]/u', '/[abc\\Tdeff]/u', '/[abc\\Udeff]/u', '/[abc\\Vdeff]/u', '/[abc\\Xdeff]/u', '/[abc\\Ydeff]/u', '/[abc\\Zdeff]/u'], $ERROR, SLASH_REGEX, 'escaping a single uc letter in the middle'],
  [['/[\\_]/u', '/[abc\\_]/u', '/[\\_abcd]/u', '/[abc\\_abcd]/u'], $ERROR, SLASH_REGEX, '_ is not an escapable char'],
  [['/[\\$]/u', '/[abc\\$]/u', '/[\\$abcd]/u', '/[abc\\$abcd]/u'], $REGEXU, SLASH_REGEX, '$ is a syntax char we can escape'],
  [[`/[\\^]/u`, `/[\\$]/u`, `/[\\\\]/u`, `/[\\.]/u`, `/[\\*]/u`, `/[\\+]/u`, `/[\\?]/u`, `/[\\(]/u`, `/[\\)]/u`, `/[\\[]/u`, `/[\\]]/u`, `/[\\{]/u`, `/[\\}]/u`, `/[\\|]/u`], $REGEXU, SLASH_REGEX, 'syntax char escapes'],
  [[`/[abc\\^]/u`, `/[abc\\$]/u`, `/[abc\\\\]/u`, `/[abc\\.]/u`, `/[abc\\*]/u`, `/[abc\\+]/u`, `/[abc\\?]/u`, `/[abc\\(]/u`, `/[abc\\)]/u`, `/[abc\\[]/u`, `/[abc\\]]/u`, `/[abc\\{]/u`, `/[abc\\}]/u`, `/[abc\\|]/u`], $REGEXU, SLASH_REGEX, 'syntax char escapes with prefix'],
  [[`/[\\^def]/u`, `/[\\$def]/u`, `/[\\\\def]/u`, `/[\\.def]/u`, `/[\\*def]/u`, `/[\\+def]/u`, `/[\\?def]/u`, `/[\\(def]/u`, `/[\\)def]/u`, `/[\\[def]/u`, `/[\\]def]/u`, `/[\\{def]/u`, `/[\\}def]/u`, `/[\\|def]/u`], $REGEXU, SLASH_REGEX, 'syntax char escapes with suffix'],
  [[`/[\\^`, `/[\\$`, `/[\\\\`, `/[\\.`, `/[\\*`, `/[\\+`, `/[\\?`, `/[\\(`, `/[\\)`, `/[\\]`, `/[\\]`, `/[\\{`, `/[\\}`, `/[\\|`], $ERROR, SLASH_REGEX, 'syntax char escapes with early eol/eof', 'suffixsp'],
  [[`/[\\']/u`, `/[\\"]/u`, `/[\\\`]/u`], $ERROR, SLASH_REGEX, 'typical string escapes dont work in regexes'],
  [['/[\\ca]/u', '/[\\cb]/u', '/[\\cd]/u', '/[\\ce]/u', '/[\\cf]/u', '/[\\cg]/u', '/[\\ch]/u', '/[\\ci]/u', '/[\\cj]/u', '/[\\ck]/u', '/[\\cl]/u', '/[\\cm]/u', '/[\\cn]/u', '/[\\co]/u', '/[\\cp]/u', '/[\\cq]/u', '/[\\cr]/u', '/[\\cs]/u', '/[\\ct]/u', '/[\\cu]/u', '/[\\cv]/u', '/[\\cw]/u', '/[\\cx]/u', '/[\\cy]/u', '/[\\cz]/u'], $REGEXU, SLASH_REGEX, 'control character lc'],
  [['/[\\cA]/u', '/[\\cB]/u', '/[\\cD]/u', '/[\\cE]/u', '/[\\cF]/u', '/[\\cG]/u', '/[\\cH]/u', '/[\\cI]/u', '/[\\cJ]/u', '/[\\cK]/u', '/[\\cL]/u', '/[\\cM]/u', '/[\\cN]/u', '/[\\cO]/u', '/[\\cP]/u', '/[\\cQ]/u', '/[\\cR]/u', '/[\\cS]/u', '/[\\cT]/u', '/[\\cU]/u', '/[\\cV]/u', '/[\\cW]/u', '/[\\cX]/u', '/[\\cY]/u', '/[\\cZ]/u'], $REGEXU, SLASH_REGEX, 'control character uc'],
  [['/[\\x01]/u', '/[\\x12]/u', '/[\\x23]/u', '/[\\x34]/u', '/[\\x45]/u', '/[\\x56]/u', '/[\\x67]/u', '/[\\x78]/u', '/[\\x89]/u', '/[\\x90]/u'], $REGEXU, SLASH_REGEX, 'valid hex escapes'],
  [['/[\\x]/u', '/[\\x0]/u', '/[\\x1]/u', '/[\\x2]/u', '/[\\x3]/u', '/[\\x4]/u', '/[\\x5]/u', '/[\\x6]/u', '/[\\x7]/u', '/[\\x8]/u', '/[\\x9]/u'], $ERROR, SLASH_REGEX, 'invalid hex escape with one char'],
  [['/[\\u1234]/u', '/[x\\u0567]/u', '/[\\uf89ay]/u', '/[x\\ubcdey]/u'], $REGEXU, SLASH_REGEX, 'non surrogate'],
  [['/[\\ud800]/u', '/[x\\ud810]/u', '/[\\ud900y]/u', '/[x\\udabcy]/u', '/[x\\udabcy]/ug', '/[x\\udabcy]/um', '/[x\\udabcy]/iuy'], $REGEXU, SLASH_REGEX, 'lead surrogate'],
  [['/[\\ud800\\ud800]/u', '/[x\\ud810\\ud810]/u', '/[\\ud900\\ud900y]/u', '/[x\\udabc\\udabcy]/u'], $REGEXU, SLASH_REGEX, 'lead + lead surrogate'],
  [['/[\\udc00]/u', '/[x\\udc10]/u', '/[\\udd00y]/u', '/[x\\udebcy]/u', '/[x\\udebcy]/gu', '/[x\\udebcy]/imu', '/[x\\udebcy]/uy'], $REGEXU, SLASH_REGEX, 'trail surrogate'],
  [['/[\\udc00\\udc00]/u', '/[x\\udc10\\udc10]/u', '/[\\udd00\\udd00y]/u', '/[x\\udebc\\udebcy]/u', '/[x\\udebc\\udebcy]/ui'], $REGEXU, SLASH_REGEX, 'trail + trail surrogate'],
  [['/[\\ud800\\udc00]/u', '/[x\\ud810\\udc10]/u', '/[\\ud900\\udd00y]/u', '/[x\\udabc\\udebcy]/u', '/[x\\udabc\\udebcy]/ug'], $REGEXU, SLASH_REGEX, 'lead + trail surrogate'],
  [['/[\\u1234\\ud800]/u', '/[x\\u0567\\ud810]/u', '/[\\uf89a\\ud900y]/u', '/[x\\ubcde\\udabcy]/u', '/[x\\ubcde\\udabcy]/mu'], $REGEXU, SLASH_REGEX, 'non + lead surrogate'],
  [['/[\\u1234\\udc00]/u', '/[x\\u0567\\udc10]/u', '/[\\uf89a\\udd00y]/u', '/[x\\ubcde\\udebcy]/u', '/[x\\ubcde\\udebcy]/yu'], $REGEXU, SLASH_REGEX, 'non + trail pair'],
  [['/[\\u1234\\u1234\\udc00]/u', '/[x\\u0567\\u0567\\udc10]/u', '/[\\uf89a\\uf89a\\udd00y]/u', '/[x\\ubcde\\ubcde\\udebcy]/u'], $REGEXU, SLASH_REGEX, 'non + non + trail pair'],
  [['/[\\u1234\\udc00\\udc00]/u', '/[x\\u0567\\udc10\\udc10]/u', '/[\\uf89a\\udd00\\udd00y]/u', '/[x\\ubcde\\udebc\\udebcy]/u'], $REGEXU, SLASH_REGEX, 'non + trail + trail pair'],
  [['/[\\ud800\\ud800\\udc00]/u', '/[x\\ud810\\ud810\\udc10]/u', '/[\\ud900\\ud900\\udd00y]/u', '/[x\\udabc\\udabc\\udebcy]/u'], $REGEXU, SLASH_REGEX, 'lead + lead + trail surrogate'],
  [['/[\\ud800\\udc00\\udc00]/u', '/[x\\ud810\\udc10\\udc10]/u', '/[\\ud900\\udd00\\udd00y]/u', '/[x\\udabc\\udebc\\udebcy]/u'], $REGEXU, SLASH_REGEX, 'lead + trail + trail surrogate'],
  [['/[\\ud800\\udc00\\ud800]/u', '/[x\\ud810\\udc10\\ud810]/u', '/[\\ud900\\udd00\\ud900y]/u', '/[x\\udabc\\udebc\\udabcy]/u'], $REGEXU, SLASH_REGEX, 'lead + trail + lead surrogate'],
  [[`/[\\u{0123}]/u`, `/[\\u{4567}]/u`, `/[\\u{89abc}]/u`, `/[\\u{defAB}]/u`, `/[\\u{CDEF}]/u`], $REGEXU, SLASH_REGEX],
  [`/[prefix \\u{012345}]/u`, $REGEXU, SLASH_REGEX],
  [`/[\\u{012345} postfix]/u`, $REGEXU, SLASH_REGEX],
  [`/[\\u{012345}\\u{6789a}]/u`, $REGEXU, SLASH_REGEX],
  [[`/[\\u{}]/u`, `/[\\u{fail}]/u`, `/[\\u{afail}]/u`, `/[\\u{0fail}]/u`, `/[\\u{xxxx}]/u`], $ERROR, SLASH_REGEX, 'long unicode escape bad contents'],
  [[`/[\\u{]/u`, `/[\\u{a]/u`, `/[\\u{af]/u`, `/[\\u{012]/u`, `/[\\u{01234]/u`, `/[\\u{012345]/u`], $ERROR, SLASH_REGEX, 'unclosed long unicode escapes'],
  [[`/[\\u{1}]/u`, `/[\\u{12}]/u`, `/[\\u{123}]/u`, `/[\\u{1234}]/u`, `/[\\u{12345}]/u`, `/[\\u{103456}]/u`], $REGEXU, SLASH_REGEX, 'long unicode escapes'],
  [[`/[\\u{`, `/[\\u{a`, `/[\\u{af`, `/[\\u{123`, `/[\\u{1234`, `/[\\u{12345`, `/[\\u{103456`], $ERROR, SLASH_REGEX, 'incomplete long unicode escapes in unclosed string', 'suffixsp'],
  [`/[\\u{10ffff}]/u`, $REGEXU, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [[`/[\\u{110000}]/u`, `/[\\u{120000}]/u`, `/[\\u{900000}]/u`, `/[\\u{123456789}]/u`, `/[\\u{ffffffffffffffff}]/u`], $ERROR, SLASH_REGEX, 'It is a Syntax Error if the MV of HexDigits > 1114111.'],
  [`/[\\u{10000000000000000}]/u`, $ERROR, SLASH_REGEX, 'regex value that would exceed 32bits'],
  [`/[\\u{fffffffffffffffffffff}]/u`, $ERROR, SLASH_REGEX, 'regex value that would exceed 32bits'],
  [`/[\\u{0000000000000000000010ffff}]/u`, $REGEXU, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  [[`/[\\u{00000000000000000000110000}]/u`, `/[\\u{00000000000000000000120000}]/u`, `/[\\u{0000000000123456789}]/u`, `/[\\u{000000ffffffffffffffff}]/u`], $ERROR, SLASH_REGEX, 'must take care that the hex may still have any number of leading zeroes'],
  [['/[\\da-z]/u', '/[\\DA-Z]/u', '/[\\sa-z]/u', '/[\\SA-S]/u', '/[\\wa-z]/u', '/[\\WA-Z]/u'], $REGEXU, SLASH_REGEX, 'class escapes are also valid in char classes that contain ranges'],
  [['/[\\d-z]/u', '/[\\D-Z]/u', '/[\\s-z]/u', '/[\\S-S]/u', '/[\\w-z]/u', '/[\\W-Z]/u'], $ERROR, SLASH_REGEX, 'class escapes are never valid when part of a range'],
  [['/[x\\da-z]/u', '/[x\\DA-Z]/u', '/[x\\sa-z]/u', '/[x\\SA-S]/u', '/[x\\wa-z]/u', '/[x\\WA-Z]/u'], $REGEXU, SLASH_REGEX, 'with prefix class escapes are also valid in char classes that contain ranges'],
  [['/[x\\d-z]/u', '/[x\\D-Z]/u', '/[x\\s-z]/u', '/[x\\S-S]/u', '/[x\\w-z]/u', '/[x\\W-Z]/u'], $ERROR, SLASH_REGEX, 'with prefix class escapes are never valid when part of a range'],
  [['/[a-z\\d]/u', '/[A-Z\\D]/u', '/[a-z\\s]/u', '/[A-S\\S]/u', '/[a-z\\w]/u', '/[A-Z\\W]/u'], $REGEXU, SLASH_REGEX, 'class escapes are also valid in char classes that contain ranges'],
  [['/[a-\\d]/u', '/[A-\\D]/u', '/[a-\\s]/u', '/[A-\\S]/u', '/[a-\\w]/u', '/[A-\\W]/u'], $ERROR, SLASH_REGEX, 'class escapes are never valid when part of a range'],
  [['/[a-z\\dx]/u', '/[A-Z\\Dx]/u', '/[a-z\\sx]/u', '/[A-S\\Sx]/u', '/[a-z\\wx]/u', '/[A-Z\\Wx]/u'], $REGEXU, SLASH_REGEX, 'with suffix class escapes are also valid in char classes that contain ranges'],
  [['/[a-\\dx]/u', '/[A-\\Dx]/u', '/[a-\\sx]/u', '/[A-\\Sx]/u', '/[a-\\wx]/u', '/[A-\\Wx]/u'], $ERROR, SLASH_REGEX, 'with suffix class escapes are never valid when part of a range'],
  ['/\\2(x)/u', $ERROR, SLASH_REGEX, 'it is an error if a digital non-zero escape evaluates to a number bigger than the number of groups'],
  // surrogate pairs revisited
  ['/[1-9]/u', $REGEXU, SLASH_REGEX, 'char class ranges should be lo-hi'],
  ['/[9-1]/u', $ERROR, SLASH_REGEX, 'char class ranges should be lo-hi and it is a syntax error otherwise'],
  ['/[\\u5000-\\u6000]/u', $REGEXU, SLASH_REGEX, 'escapes are no problem for ranges'],
  ['/[\\u6000-\\u5000]/u', $ERROR, SLASH_REGEX, 'escapes are also bound by the lo-hi rule'],
  ['/[\\uD83D\\uDCA9]/u', $REGEXU, SLASH_REGEX, 'Unicode Character PILE OF POO (U+1F4A9) surrogate pair base test case. sans u-flag this matches two individual chars'],
  ['/[\\uD83D\\uDCAB]/u', $REGEXU, SLASH_REGEX, 'Unicode Character DIZZY SYMBOL (U+1F4AB) surrogate pair base test case. sans u-flag this matches two individual chars'],
  [['/[\\uD83D\\uDCA9-\\uD83D\\uDCAB]/u', '/[\uD83D\\uDCA9-\\uD83D\\uDCAB]/u', '/[\\uD83D\uDCA9-\\uD83D\\uDCAB]/u', '/[\\uD83D\\uDCA9-\uD83D\\uDCAB]/u', '/[\\uD83D\\uDCA9-\\uD83D\uDCAB]/u', '/[\uD83D\uDCA9-\\uD83D\\uDCAB]/u', '/[\uD83D\\uDCA9-\uD83D\\uDCAB]/u', '/[\uD83D\\uDCA9-\\uD83D\uDCAB]/u', '/[\\uD83D\uDCA9-\uD83D\\uDCAB]/u', '/[\\uD83D\uDCA9-\\uD83D\uDCAB]/u', '/[\\uD83D\\uDCA9-\uD83D\uDCAB]/u', '/[\uD83D\uDCA9-\uD83D\\uDCAB]/u', '/[\uD83D\uDCA9-\\uD83D\uDCAB]/u', '/[\\uD83D\uDCA9-\uD83D\uDCAB]/u', '/[\uD83D\uDCA9-\uD83D\uDCAB]/u'], $REGEXU, SLASH_REGEX, 'range poo to dizzy some are escapes and some are literal but surrogates should still work (and error without u flag)'],
  [['/[\\x01-\\x17]/u', '/[\\u0001-\\x17]/u', '/[\\x01-\\u0007]/u', '/[\\x01-\\x17]/u', '/[A-\\cH]/u', '/[\\cH-Z]/u'], $REGEXU, SLASH_REGEX, 'ranges using various escapes'],
  [['/[\\u{5}-1]/u', '/[\\x01-\\u{347}]/u'], $REGEXU, SLASH_REGEX, 'ranges using various escapes and long unicode escapes'],
  [['/[1-\\u{500}]/u', '/\\u{01}-\\x07/u'], $REGEXU, SLASH_REGEX, 'various ranges using escapes but using long unicodes'],
  [['/[--0]/u', '/[+--]/u'], $REGEXU, SLASH_REGEX, 'dash is also a dash at the start or end of a range'],
  [['/[-+]/u', '/[+-]/u', '/[---+]/u', '/[---0]/u'], $REGEXU, SLASH_REGEX, 'positive dash edge cases'],
  ['/[-]/u', $REGEXU, SLASH_REGEX, 'a dash'],
  ['/[--]/u', $REGEXU, SLASH_REGEX, 'no range, just twice the dash'],
  ['/[---]/u', $REGEXU, SLASH_REGEX, 'a range that starts and ends with a dash'],
  ['/[----]/u', $REGEXU, SLASH_REGEX, 'a range that starts and ends with a dash and then followed by a single character that is also a dash'],
  ['/[-----]/u', $REGEXU, SLASH_REGEX, 'a range that starts and ends with a dash and then followed by a single character that is also a dash and ends with a dash because they cant make another range'],
  ['/[------]/u', $REGEXU, SLASH_REGEX, 'twice the range that starts and ends with a dash can i stop now?'],
  ['/[-------]/u', $REGEXU, SLASH_REGEX, 'certainly we can proof by induction now'],
  ['/[--------]/u', $REGEXU, SLASH_REGEX, 'yeah'],
  ['/[---------]/u', $REGEXU, SLASH_REGEX, 'this is n+2 so qed'],
  [['/[--+]/u', '/[0--]/u', '/[x---]/u', '/[0---]/u'], $ERROR, SLASH_REGEX, 'negative dash edge cases'],
  ['/[x-\\uD83D\\uDE07--+]/u', $ERROR, SLASH_REGEX, 'range with a surrogate on the right; with u flag causing two valid ranges (x-D83DDE07 and --+), without u flag causing a valid range (x-D83D) and an invalid range (DE07--)'],
  ['/[x-\\uD83D\\uDE07--x-\\uD83D\\uDE07--]/u', $ERROR, SLASH_REGEX, 'more silliness'],
  // capturing group
  [['/(b)/u', '/a(b)/u', '/(b)c/u', '/a(b)c/u'], $REGEXU, SLASH_REGEX],
  [['/(b)', '/a(b)', '/(b)c', '/a(b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(', $ERROR, SLASH_REGEX, 'eol/eof in a group', 'suffixsp'],
  ['/)/u', $ERROR, SLASH_REGEX, 'closing paren without opener must be escaped'],
  ['/)', $ERROR, SLASH_REGEX, 'closing paren without opener must be escaped at eol/eof', 'suffixsp'],
  [['/((b))/u', '/(a(b))/u', '/a(a(b))/u', '/(a(b))c/u', '/a(a(b))c/u', '/((b)c)/u', '/a((b)c)/u', '/((b)c)c/u', '/a((b)c)c/u', '/(a(b)c)/u', '/a(a(b)c)/u', '/(a(b)c)c/u', '/a(a(b)c)c/u'], $REGEXU, SLASH_REGEX],
  [['/((b', '/((b)', '/((b))', '/(a(b', '/(a(b)', '/(a(b))', '/a(a(b', '/a(a(b)', '/a(a(b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?x)/u', $ERROR, SLASH_REGEX, 'qmark is invalid without proper next char'],
  ['/(?', $ERROR, SLASH_REGEX, 'qmark is invalid without proper next char at eol/eof', 'suffixsp'],
  ['/()/u', $REGEXU, SLASH_REGEX, 'capturing group can be empty'],
  // non-capturing group
  [['/(?:b)/u', '/a(?:b)/u', '/(?:b)c/u', '/a(?:b)c/u'], $REGEXU, SLASH_REGEX],
  [['/(?:b)', '/a(?:b)', '/(?:b)c', '/a(?:b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  [['/(?:(?:b))/u', '/(?:a(?:b))/u', '/a(?:a(?:b))/u', '/(?:a(?:b))c/u', '/a(?:a(?:b))c/u', '/(?:(?:b)c)/u', '/a(?:(?:b)c)/u', '/(?:(?:b)c)c/u', '/a(?:(?:b)c)c/u', '/(?:a(?:b)c)/u', '/a(?:a(?:b)c)/u', '/(?:a(?:b)c)c/u', '/a(?:a(?:b)c)c/u'], $REGEXU, SLASH_REGEX],
  [['/(?:(?:b', '/(?:(?:b)', '/(?:(?:b))', '/(?:a(?:b', '/(?:a(?:b)', '/(?:a(?:b))', '/a(?:a(?:b', '/a(?:a(?:b)', '/a(?:a(?:b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?:)/u', $REGEXU, SLASH_REGEX, 'non capturing group can be empty'],
  // lookahead
  [['/(?=b)/u', '/a(?=b)/u', '/(?=b)c/u', '/a(?=b)c/u'], $REGEXU, SLASH_REGEX],
  [['/(?=b)', '/a(?=b)', '/(?=b)c', '/a(?=b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  [['/(?=(?=b))/u', '/(?=a(?=b))/u', '/a(?=a(?=b))/u', '/(?=a(?=b))c/u', '/a(?=a(?=b))c/u', '/(?=(?=b)c)/u', '/a(?=(?=b)c)/u', '/(?=(?=b)c)c/u', '/a(?=(?=b)c)c/u', '/(?=a(?=b)c)/u', '/a(?=a(?=b)c)/u', '/(?=a(?=b)c)c/u', '/a(?=a(?=b)c)c/u'], $REGEXU, SLASH_REGEX],
  [['/(?=(?=b', '/(?=(?=b)', '/(?=(?=b))', '/(?=a(?=b', '/(?=a(?=b)', '/(?=a(?=b))', '/a(?=a(?=b', '/a(?=a(?=b)', '/a(?=a(?=b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?=)/u', $REGEXU, SLASH_REGEX, 'lookahead can be empty'],
  // negative capturing group
  [['/(?!b)/u', '/a(?!b)/u', '/(?!b)c/u', '/a(?!b)c/u'], $REGEXU, SLASH_REGEX],
  [['/(?!b)', '/a(?!b)', '/(?!b)c', '/a(?!b)c'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  [['/(?!(?!b))/u', '/(?!a(?!b))/u', '/a(?!a(?!b))/u', '/(?!a(?!b))c/u', '/a(?!a(?!b))c/u', '/(?!(?!b)c)/u', '/a(?!(?!b)c)/u', '/(?!(?!b)c)c/u', '/a(?!(?!b)c)c/u', '/(?!a(?!b)c)/u', '/a(?!a(?!b)c)/u', '/(?!a(?!b)c)c/u', '/a(?!a(?!b)c)c/u'], $REGEXU, SLASH_REGEX],
  [['/(?!(?!b', '/(?!(?!b)', '/(?!(?!b))', '/(?!a(?!b', '/(?!a(?!b)', '/(?!a(?!b))', '/a(?!a(?!b', '/a(?!a(?!b)', '/a(?!a(?!b))'], $ERROR, SLASH_REGEX, 'unclosed regex', 'suffixsp'],
  ['/(?!)/u', $REGEXU, SLASH_REGEX, 'inverted lookahead can be empty'],
  // mixed group types
  [[
    '/a(b(c)d)e/u',
    '/a(b(?:c)d)e/u',
    '/a(b(?=c)d)e/u',
    '/a(b(?!c)d)e/u',
    '/a(?:b(c)d)e/u',
    '/a(?:b(?:c)d)e/u',
    '/a(?:b(?=c)d)e/u',
    '/a(?:b(?!c)d)e/u',
    '/a(?=b(c)d)e/u',
    '/a(?=b(?:c)d)e/u',
    '/a(?=b(?=c)d)e/u',
    '/a(?=b(?!c)d)e/u',
    '/a(?!b(c)d)e/u',
    '/a(?!b(?:c)d)e/u',
    '/a(?!b(?=c)d)e/u',
    '/a(?!b(?!c)d)e/u',
  ], $REGEXU, SLASH_REGEX],
  // unclosed groups
  [[
    '/a(bcde/u',
    '/a(b(cde/u',
    '/a(b(?:cd)e/u',
    '/a(b(?:cde/u',
    '/a(b(?=cd)e/u',
    '/a(b(?=cde/u',
    '/a(b(?!cd)e/u',
    '/a(b(?!cde/u',
    '/a(?:b(cd)e/u',
    '/a(?:b(cde/u',
    '/a(?:b(?:cd)e/u',
    '/a(?:b(?:cde/u',
    '/a(?:b(?=cd)e/u',
    '/a(?:b(?=cde/u',
    '/a(?:b(?!cd)e/u',
    '/a(?:b(?!cde/u',
    '/a(?=b(cd)e/u',
    '/a(?=b(cde/u',
    '/a(?=b(?:cd)e/u',
    '/a(?=b(?:cde/u',
    '/a(?=b(?=cd)e/u',
    '/a(?=b(?=cde/u',
    '/a(?=b(?!cd)e/u',
    '/a(?=b(?!cde/u',
    '/a(?!b(c)de/u',
    '/a(?!b(cde/u',
    '/a(?!b(?:cd)e/u',
    '/a(?!b(?:cde/u',
    '/a(?!b(?=cd)e/u',
    '/a(?!b(?=cde/u',
    '/a(?!b(?!cd)e/u',
    '/a(?!b(?!cde/u',
  ], $ERROR, SLASH_REGEX],
];
// exhaustive set of lead/tail/non surrogate combos, with one to three chars on each side of the dash (so (4**4)*(3**2)=2304 tests with a few dupes due to the empty case)
['', 'B', 'L', 'T'].forEach(a => ['', 'B', 'L', 'T'].forEach(b => ['B', 'L', 'T'].forEach(c => ['B', 'L', 'T'].forEach(d => ['', 'B', 'L', 'T'].forEach(e => ['', 'B', 'L', 'T'].forEach(f => {
  let p = `${a}${b}${c}-${d}${e}${f}`;
  let r = `/S[${p}]/u`;
  let rr = r
    .replace(/B/g, 'x')
    .replace(/L/g, '\\uD83D')
    .replace(/T/g, '\\uDCA9')
    .replace(/S/g, p);

  let t1 = '(?:B-)'; // B<=*
  let t2 = '(?:L-L)'; // L<=L L<=LT
  let t3 = '(?:L-T)'; // L<=T
  let t4 = '(?:T-LT)'; // T<=LT LT<=LT (but T>L)
  let t5 = '(?:(?:B|T|^)T-T)'; // T<=T (but LT > T)
  let test = new RegExp(`${t1}|${t2}|${t3}|${t4}|${t5}`);
  let out = (test.test(p)) ? $REGEXU : $ERROR;
  regexesu.push([rr, out, SLASH_REGEX, 'generated case '+ p]);
}))))));

let testIndex = 0;
let all = [
  ...whitespaces,
  ...comments,
  ...punctuators,
  ...numbers,
  ...strings_single,
  ...strings_double,
  ...identifiers,
  ...regexes,
  ...regexesu,
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
      let orifailed = false;
      for (let testMode of ['original', '- prefixsp', '- suffixsp', '- prefixnl', '- suffixls', '- suffixcr', '- suffcrlf']) {
        ++testIndex;
        if (orifailed) {
          console.log('SKIP: ' + testIndex + ' (original failed)');
          continue;
        }

        //if (testIndex !== 17034) continue;

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

          if (failed) console.log((failed ? 'FAIL: ' : 'PASS: ') + testIndex + ' (' + (strictness === STRICT_MODE ? 'strict' : 'sloppy') + ')(' + testMode + '): `' + toPrint(code) + '`  -->  ' + outs.map(debug_toktype) + ', was; ' + collects.map(debug_toktype));
          if (failed) {
            ++fails;
            if (testMode === 'original') orifailed = true;
          }
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
