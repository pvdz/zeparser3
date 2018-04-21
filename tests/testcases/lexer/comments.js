let {
  PARSE_MODE_DIV,
} = require('../../utils');

let {
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $COMMENT_HTML,
  $ERROR,
  $IDENT,
  $NL,
  $SPACE,
  $PUNCTUATOR,
} = require('../../../src/zetokenizer');

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
  ['/* /* */ */', [$COMMENT_MULTI, $SPACE, $PUNCTUATOR, $PUNCTUATOR], PARSE_MODE_DIV, 'cant be nested (and the tokenizer doenst throw semantic errors)'],
  ['/* \\u{nope} \\unope \\xno */', $COMMENT_MULTI, 'dont check correctness of escapes'],

  ['/*CHECK#1/', $ERROR, 'regression; unclosed multi-line', ['suffixls', 'suffixcr', 'suffcrlf', 'suffixsp']],
  ['\n--' + '>', [$NL, $COMMENT_HTML], 'if a script has -- > then support it as if it were `//` (in web mode; TODO)',['prefixnl', 'prefixsp', 'suffixls', 'suffixcr', 'suffcrlf', 'suffixsp']],
  [';--' + '>', [$PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR], 'the -- > must start at if a script has -- > then support it as if it were `//` (in web mode; TODO)',['prefixnl', 'prefixsp', 'suffixls', 'suffixcr', 'suffcrlf', 'suffixsp']],
  ['--' + '>', [$PUNCTUATOR, $PUNCTUATOR], 'start of a file is not a newline so do not parse a html comment here',['prefixnl', 'prefixsp', 'suffixls', 'suffixcr', 'suffcrlf', 'suffixsp']],
  ['\n--' + '> foo bar', [$NL, $COMMENT_HTML], 'text after the html comment should be ignored like single line comments',['prefixnl', 'prefixsp', 'suffixls', 'suffixcr', 'suffcrlf', 'suffixsp']],
  ['\n--' + '> foo bar\nx;', [$NL, $COMMENT_HTML, $NL, $IDENT, $PUNCTUATOR], 'html comments are single line only',['prefixnl', 'prefixsp', 'suffixls', 'suffixcr', 'suffcrlf', 'suffixsp']],
];

module.exports = comments;
