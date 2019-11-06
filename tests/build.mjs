// Test a build, relying only on build imports

import {
  ZeParser,
  ZeTokenizer,
  toktypeToString,

  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,

  GOAL_MODULE,
  GOAL_SCRIPT,

  WEB_COMPAT_OFF,
  WEB_COMPAT_ON,

  isWhiteToken,
  isNewlineToken,
  isCommentToken,
  isIdentToken,
  isNumberToken,
  isBigintToken,
  isStringToken,
  isPunctuatorToken,
  isRegexToken,
  isTickToken,
  isBadTickToken,
  isNumberStringToken,
  isNumberStringRegex,
} from '../build/build_w_ast.mjs';
// } from '../src/zeparser.mjs';

if (typeof ZeParser !== 'function') throw new Error('Bad ZeParser export');
if (typeof ZeTokenizer !== 'function') throw new Error('Bad ZeTokenizer export');
if (typeof toktypeToString !== 'function') throw new Error('Bad toktypeToString export');
if (typeof COLLECT_TOKENS_NONE === 'undefined') throw new Error('Bad COLLECT_TOKENS_NONE export');
if (typeof COLLECT_TOKENS_SOLID === 'undefined') throw new Error('Bad COLLECT_TOKENS_SOLID export');
if (typeof COLLECT_TOKENS_ALL === 'undefined') throw new Error('Bad COLLECT_TOKENS_ALL export');
if (typeof GOAL_MODULE === 'undefined') throw new Error('Bad COLLECT_TOKENS_NONE export');
if (typeof GOAL_SCRIPT === 'undefined') throw new Error('Bad COLLECT_TOKENS_NONE export');
if (typeof WEB_COMPAT_OFF === 'undefined') throw new Error('Bad COLLECT_TOKENS_NONE export');
if (typeof WEB_COMPAT_ON === 'undefined') throw new Error('Bad COLLECT_TOKENS_NONE export');

function pass(...args) {
  try {
    console.log('####');
    ZeParser(...args);
    return true;
  } catch {
    return false;
  }
}
function _pass(...args) {
  try {
    console.log('####');
    return ZeParser(...args);
  } catch {
    return false;
  }
}

// No args
if (!pass('foo')) throw new Error('Basic parse step with all defaults failed');

// Defaults
if (!pass('"\\04"')) throw new Error('Web compat should be enabled as default');
if (pass('import x from "y"')) throw new Error('Script goal should be used as default');
if (!pass('eval = x')) throw new Error('Sloppy mode should be used by default');

// Goals (needs two tests because there is no code that throws in non-strict or module, and does not throw in strict-script
if (!pass('import x from "y"', GOAL_MODULE, undefined, {strictMode: false, webCompat: false})) throw new Error('`import` should be supported by module goal');
if (pass('import x from "y"', GOAL_SCRIPT, undefined, {strictMode: false, webCompat: false})) throw new Error('`import` should not be supported by script goal, sloppy');
if (pass('import x from "y"', GOAL_SCRIPT, undefined, {strictMode: true, webCompat: false})) throw new Error('`import` should not be supported by script goal, strict');
if (!pass('let await = 1', GOAL_SCRIPT, undefined, {strictMode: false, webCompat: false})) throw new Error('`await` is only keyword in module goal');
if (!pass('let await = 1', GOAL_SCRIPT, undefined, {strictMode: false, webCompat: false})) throw new Error('`await` is only keyword in module goal');
if (pass('let await = 1', GOAL_MODULE, undefined, {strictMode: false, webCompat: false})) throw new Error('`await` is keyword in module goal');

// Strict
if (!pass('let arguments = 1', GOAL_SCRIPT, undefined, {strictMode: false, webCompat: false})) throw new Error('`arguments` only keyword in strict');
if (pass('let arguments = 1', GOAL_SCRIPT, undefined, {strictMode: true, webCompat: false})) throw new Error('`arguments` is keyword in strict');
if (pass('let arguments = 1', GOAL_MODULE, undefined, {strictMode: false, webCompat: false})) throw new Error('`arguments` is keyword in module, which enforces strict mode');

// Web
if (pass('"\\04"', GOAL_SCRIPT, undefined, {strictMode: false, webCompat: false})) throw new Error('octal escapes only legal in web compat mode, not just sloppy-script');
if (pass('"\\04"', GOAL_SCRIPT, undefined, {strictMode: true, webCompat: false})) throw new Error('octal escapes only legal in web compat mode, not just strict-script');
if (pass('"\\04"', GOAL_MODULE, undefined, {strictMode: false, webCompat: false})) throw new Error('octal escapes only legal in web compat mode, not module');
if (!pass('"\\04"', GOAL_SCRIPT, undefined, {strictMode: false, webCompat: true})) throw new Error('octal escapes are legal in web compat mode');
if (pass('"\\04"', GOAL_SCRIPT, undefined, {strictMode: true, webCompat: true})) throw new Error('octal escapes only legal in non-strict web compat mode');

// Tokens
if (_pass('a // c\nd;', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens.length === 6) throw new Error('When collecting all tokens it should collect the spaces and single-comments too');
if (_pass('a /* c */.d;', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens.length === 6) throw new Error('When collecting all tokens it should collect the spaces and multi-comments too');
if (_pass('a. // c\nd /* xyz */;', GOAL_SCRIPT, COLLECT_TOKENS_SOLID).tokens.length === 4) throw new Error('When collecting solid tokens it should ignore whitespace');
if (_pass('a. // c\nd /* xyz */;', GOAL_SCRIPT, COLLECT_TOKENS_NONE).tokens !== undefined) throw new Error('When collecting no tokens it should not return anything');

// Token types
if (typeof isWhiteToken !== 'function') throw new Error('isWhiteToken should be a function');
if (typeof isNewlineToken !== 'function') throw new Error('isNewlineToken should be a function');
if (typeof isCommentToken !== 'function') throw new Error('isCommentToken should be a function');
if (typeof isIdentToken !== 'function') throw new Error('isIdentToken should be a function');
if (typeof isNumberToken !== 'function') throw new Error('isNumberToken should be a function');
if (typeof isBigintToken !== 'function') throw new Error('isBigintToken should be a function');
if (typeof isStringToken !== 'function') throw new Error('isStringToken should be a function');
if (typeof isPunctuatorToken !== 'function') throw new Error('isPunctuatorToken should be a function');
if (typeof isRegexToken !== 'function') throw new Error('isRegexToken should be a function');
if (typeof isTickToken !== 'function') throw new Error('isTickToken should be a function');
if (typeof isBadTickToken !== 'function') throw new Error('isBadTickToken should be a function');
if (typeof isNumberStringToken !== 'function') throw new Error('isNumberStringToken should be a function');
if (typeof isNumberStringRegex !== 'function') throw new Error('isNumberStringRegex should be a function');
// Confirm tokens are passing as they ought to
if (!isWhiteToken(_pass(' ', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Space should be a whitespace token');
if (!isNewlineToken(_pass('\n', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Newline should be a newline token');
if (!isWhiteToken(_pass('\n', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Newline should be a whitespace token');
if (!isCommentToken(_pass('// foo', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Single line comment should be a comment token');
if (!isWhiteToken(_pass('// foo', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Single line comment should be a whitespace token');
if (!isCommentToken(_pass('/* foo */', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Multi line comment should be a comment token');
if (!isWhiteToken(_pass('/* foo */', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Multi line comment should be a whitespace token');
if (!isIdentToken(_pass('foo', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('`foo` should be an ident token');
if (!isNumberToken(_pass('200', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('200 should be a number token');
if (!isBigintToken(_pass('200n', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('200n should be a bigint token');
if (isBigintToken(_pass('200', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('200 should not be a bigint token');
if (!isStringToken(_pass('"foo"', GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Double string should be a string token');
if (!isStringToken(_pass("'foo'", GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('Single string should be a string token');
if (!isPunctuatorToken(_pass("+1", GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('`+` should be a punctuator token');
if (!isRegexToken(_pass("/x/", GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('`/x/` should be a punctuator token');
if (!isTickToken(_pass("`x`", GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('`x` should be a punctuator token');
if (!isTickToken(_pass("`x${a}`", GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[0].type)) throw new Error('`x${ should be a punctuator token');
if (!isBadTickToken(_pass("x`\\03`", GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[1].type)) throw new Error('Tagged template with octal escape should be a bad template token');
if (!isTickToken(_pass("x`\\03`", GOAL_SCRIPT, COLLECT_TOKENS_ALL).tokens[1].type)) throw new Error('Tagged template with octal escape should be a template token');


console.log('Finished tests');
