// All constants in this file will be extrapolated and unconditionally inlined in a build without scope tracking
// (Make sure to only make primitives `const`, use `let` for anything else. Even if it's a constant value otherwise.)

import {
  ASSERT,
} from './utils.mjs';

// First LEAF_BITS bits are not flags (!), they are "leaf" token types (decimal number, template tail).
// Other bits are flags, used to augment for super groups (string, number, template)
// (If the number of leafs exceeds LEAF_BITS bits then it'll reduce the number of available bitwise flags)

const LEAF_BITS = 8;
let __$flag_leaf = 0; // This name is hardcoded in the build script...
let __$flag_group = LEAF_BITS - 1; // offset 0, this name is hardcoded in the build script... keep value in sync

// Groups get their own bit. This makes it easier to quickly check for a set of token types (string, string | number)
// Additionally, modifiers get their own bit. Like bigint suffix or bad escapes. Generally these should apply to more
// than one token, otherwise it can just go below as their own leaf type.

const $G_WHITE = (1 << ++__$flag_group);
const $G_NEWLINE = (1 << ++__$flag_group);
const $G_COMMENT = (1 << ++__$flag_group);
const $G_IDENT = (1 << ++__$flag_group);
const $G_NUMBER = (1 << ++__$flag_group);
const $G_NUMBER_BIG_INT = (1 << ++__$flag_group); // modifies certain number types, they end with `n`; https://tc39.es/proposal-bigint/#sec-grammar-change
const $G_PUNCTUATOR = (1 << ++__$flag_group);
const $G_STRING = (1 << ++__$flag_group);
const $G_REGEX = (1 << ++__$flag_group);
const $G_TICK = (1 << ++__$flag_group);
const $G_TICK_BAD_ESCAPE = (1 << ++__$flag_group);
const $G_OTHER = (1 << ++__$flag_group);
let ALL_GEES;
ASSERT(ALL_GEES = [$G_WHITE, $G_NEWLINE, $G_COMMENT, $G_IDENT, $G_NUMBER, $G_NUMBER_BIG_INT, $G_PUNCTUATOR, $G_STRING, $G_REGEX, $G_TICK, $G_TICK_BAD_ESCAPE]);
ASSERT(__$flag_group < 32, 'cannot use more than 32 flags but have ' + __$flag_group);

// Token types that are mutually exclusive can be encoded as as a unique id within a few bits of sequential space
// You can still have group bits to complement these but it's far more space efficient this way
// I don't think you should ever need the $L constants outside of defining the concrete token type constants below...
const $L_SPACE = ++__$flag_leaf;
const $L_TAB = ++__$flag_leaf;
const $L_NL_SINGLE = ++__$flag_leaf;
const $L_NL_CRLF = ++__$flag_leaf;
const $L_COMMENT_SINGLE = ++__$flag_leaf;
const $L_COMMENT_MULTI = ++__$flag_leaf;
const $L_COMMENT_HTML = ++__$flag_leaf;
const $L_IDENT = ++__$flag_leaf;
const $L_NUMBER_HEX = ++__$flag_leaf;
const $L_NUMBER_DEC = ++__$flag_leaf;
const $L_NUMBER_BIN = ++__$flag_leaf;
const $L_NUMBER_OCT = ++__$flag_leaf;
const $L_NUMBER_OLD = ++__$flag_leaf;
const $L_REGEXN = ++__$flag_leaf;
const $L_REGEXU = ++__$flag_leaf;
const $L_STRING_SINGLE = ++__$flag_leaf;
const $L_STRING_DOUBLE = ++__$flag_leaf;
const $L_TICK_HEAD = ++__$flag_leaf;
const $L_TICK_BODY = ++__$flag_leaf;
const $L_TICK_TAIL = ++__$flag_leaf;
const $L_TICK_PURE = ++__$flag_leaf;
const $L_EOF = ++__$flag_leaf;
const $L_ASI = ++__$flag_leaf;
const $L_ERROR = ++__$flag_leaf;

// Important Idents

const $L_ID_arguments = ++__$flag_leaf;
const $L_ID_as = ++__$flag_leaf;
const $L_ID_async = ++__$flag_leaf;
const $L_ID_await = ++__$flag_leaf;
const $L_ID_break = ++__$flag_leaf;
const $L_ID_case = ++__$flag_leaf;
const $L_ID_catch = ++__$flag_leaf;
const $L_ID_class = ++__$flag_leaf;
const $L_ID_const = ++__$flag_leaf;
const $L_ID_continue = ++__$flag_leaf;
const $L_ID_debugger = ++__$flag_leaf;
const $L_ID_default = ++__$flag_leaf;
const $L_ID_delete = ++__$flag_leaf;
const $L_ID_do = ++__$flag_leaf;
const $L_ID_else = ++__$flag_leaf;
const $L_ID_enum = ++__$flag_leaf;
const $L_ID_eval = ++__$flag_leaf;
const $L_ID_export = ++__$flag_leaf;
const $L_ID_extends = ++__$flag_leaf;
const $L_ID_false = ++__$flag_leaf;
const $L_ID_finally = ++__$flag_leaf;
const $L_ID_for = ++__$flag_leaf;
const $L_ID_from = ++__$flag_leaf;
const $L_ID_function = ++__$flag_leaf;
const $L_ID_get = ++__$flag_leaf;
const $L_ID_if = ++__$flag_leaf;
const $L_ID_implements = ++__$flag_leaf;
const $L_ID_import = ++__$flag_leaf;
const $L_ID_in = ++__$flag_leaf;
const $L_ID_instanceof = ++__$flag_leaf;
const $L_ID_interface = ++__$flag_leaf;
const $L_ID_let = ++__$flag_leaf;
const $L_ID_new = ++__$flag_leaf;
const $L_ID_null = ++__$flag_leaf;
const $L_ID_of = ++__$flag_leaf;
const $L_ID_package = ++__$flag_leaf;
const $L_ID_private = ++__$flag_leaf;
const $L_ID_protected = ++__$flag_leaf;
const $L_ID_public = ++__$flag_leaf;
const $L_ID_return = ++__$flag_leaf;
const $L_ID_set = ++__$flag_leaf;
const $L_ID_static = ++__$flag_leaf;
const $L_ID_super = ++__$flag_leaf;
const $L_ID_switch = ++__$flag_leaf;
const $L_ID_target = ++__$flag_leaf;
const $L_ID_this = ++__$flag_leaf;
const $L_ID_throw = ++__$flag_leaf;
const $L_ID_true = ++__$flag_leaf;
const $L_ID_try = ++__$flag_leaf;
const $L_ID_typeof = ++__$flag_leaf;
const $L_ID_var = ++__$flag_leaf;
const $L_ID_void = ++__$flag_leaf;
const $L_ID_while = ++__$flag_leaf;
const $L_ID_with = ++__$flag_leaf;
const $L_ID_yield = ++__$flag_leaf;

// Punctuators

const $L_EXCL =  ++__$flag_leaf;
const $L_EXCL_EQ =  ++__$flag_leaf;
const $L_EXCL_EQ_EQ =  ++__$flag_leaf;
const $L_PERCENT =  ++__$flag_leaf;
const $L_PERCENT_EQ =  ++__$flag_leaf;
const $L_AND =  ++__$flag_leaf;
const $L_AND_AND =  ++__$flag_leaf;
const $L_AND_EQ =  ++__$flag_leaf;
const $L_PAREN_OPEN =  ++__$flag_leaf;
const $L_PAREN_CLOSE =  ++__$flag_leaf;
const $L_STAR =  ++__$flag_leaf;
const $L_STAR_STAR =  ++__$flag_leaf;
const $L_STAR_EQ =  ++__$flag_leaf;
const $L_STAR_STAR_EQ =  ++__$flag_leaf;
const $L_PLUS =  ++__$flag_leaf;
const $L_PLUS_PLUS =  ++__$flag_leaf;
const $L_PLUS_EQ =  ++__$flag_leaf;
const $L_COMMA =  ++__$flag_leaf;
const $L_MIN =  ++__$flag_leaf;
const $L_MIN_MIN =  ++__$flag_leaf;
const $L_MIN_EQ =  ++__$flag_leaf;
const $L_MIN_MIN_GT =  ++__$flag_leaf;
const $L_DOT =  ++__$flag_leaf;
const $L_DOT_DOT_DOT =  ++__$flag_leaf;
const $L_DIV =  ++__$flag_leaf;
const $L_DIV_EQ =  ++__$flag_leaf;
const $L_COLON =  ++__$flag_leaf;
const $L_SEMI =  ++__$flag_leaf;
const $L_LT =  ++__$flag_leaf;
const $L_LT_LT =  ++__$flag_leaf;
const $L_LT_EQ =  ++__$flag_leaf;
const $L_LT_LT_EQ =  ++__$flag_leaf;
const $L_LT_EXCL_MIN_MIN =  ++__$flag_leaf;
const $L_EQ =  ++__$flag_leaf;
const $L_EQ_EQ =  ++__$flag_leaf;
const $L_EQ_EQ_EQ =  ++__$flag_leaf;
const $L_EQ_GT =  ++__$flag_leaf;
const $L_GT =  ++__$flag_leaf;
const $L_GT_GT =  ++__$flag_leaf;
const $L_GT_GT_GT =  ++__$flag_leaf;
const $L_GT_EQ =  ++__$flag_leaf;
const $L_GT_GT_EQ =  ++__$flag_leaf;
const $L_GT_GT_GT_EQ =  ++__$flag_leaf;
const $L_QMARK =  ++__$flag_leaf;
const $L_BRACKET_OPEN =  ++__$flag_leaf;
const $L_BRACKET_CLOSE =  ++__$flag_leaf;
const $L_CARET =  ++__$flag_leaf;
const $L_CARET_EQ =  ++__$flag_leaf;
const $L_CURLY_OPEN =  ++__$flag_leaf;
const $L_OR =  ++__$flag_leaf;
const $L_OR_OR =  ++__$flag_leaf;
const $L_OR_EQ =  ++__$flag_leaf;
const $L_CURLY_CLOSE =  ++__$flag_leaf;
const $L_TILDE =  ++__$flag_leaf;

ASSERT(__$flag_leaf < (1<<LEAF_BITS), 'cannot use more than LEAF_BITS (' + LEAF_BITS + ') bits of space (' + (1<<LEAF_BITS) + ') but am requesting ' + __$flag_leaf);

// These are the token types and you should be able to do strict comparison against specific token types with
// `curtok` or `token.type`. Every constant maps to a single number which is a combination of a bitwise field and
// a range of numbers, all within a 32bit space (which is a hard limitation due to bitwise ops in JS being 32bit)
// TODO: A future expansion, space permitting, would mark certain tokens as a particular string, like `in` or `=>`.
// TODO: For this we can reserve more flags as continuous space. How much depends on how many groups we really need.
// TODO: These token value constants would need their own continuous space to still be able to treat them generically.
const $SPACE = $L_SPACE | $G_WHITE;
const $TAB = $L_TAB | $G_WHITE;
const $NL_SOLO = $L_NL_SINGLE | $G_WHITE | $G_NEWLINE; // Any specced line terminator that is not the combination of crlf
const $NL_CRLF = $L_NL_CRLF | $G_WHITE | $G_NEWLINE;
const $COMMENT_SINGLE = $L_COMMENT_SINGLE | $G_COMMENT | $G_WHITE;
const $COMMENT_MULTI = $L_COMMENT_MULTI | $G_COMMENT | $G_WHITE;
const $COMMENT_HTML = $L_COMMENT_HTML | $G_COMMENT | $G_WHITE;
const $IDENT = $L_IDENT | $G_IDENT;
const $ID_arguments = $L_ID_arguments | $G_IDENT;
const $ID_as = $L_ID_as | $G_IDENT;
const $ID_async = $L_ID_async | $G_IDENT;
const $ID_await = $L_ID_await | $G_IDENT;
const $ID_break = $L_ID_break | $G_IDENT;
const $ID_case = $L_ID_case | $G_IDENT;
const $ID_catch = $L_ID_catch | $G_IDENT;
const $ID_class = $L_ID_class | $G_IDENT;
const $ID_const = $L_ID_const | $G_IDENT;
const $ID_continue = $L_ID_continue | $G_IDENT;
const $ID_debugger = $L_ID_debugger | $G_IDENT;
const $ID_default = $L_ID_default | $G_IDENT;
const $ID_delete = $L_ID_delete | $G_IDENT;
const $ID_do = $L_ID_do | $G_IDENT;
const $ID_else = $L_ID_else | $G_IDENT;
const $ID_enum = $L_ID_enum | $G_IDENT;
const $ID_eval = $L_ID_eval | $G_IDENT;
const $ID_export = $L_ID_export | $G_IDENT;
const $ID_extends = $L_ID_extends | $G_IDENT;
const $ID_false = $L_ID_false | $G_IDENT;
const $ID_finally = $L_ID_finally | $G_IDENT;
const $ID_for = $L_ID_for | $G_IDENT;
const $ID_from = $L_ID_from | $G_IDENT;
const $ID_function = $L_ID_function | $G_IDENT;
const $ID_get = $L_ID_get | $G_IDENT;
const $ID_if = $L_ID_if | $G_IDENT;
const $ID_implements = $L_ID_implements | $G_IDENT;
const $ID_import = $L_ID_import | $G_IDENT;
const $ID_in = $L_ID_in | $G_IDENT;
const $ID_instanceof = $L_ID_instanceof | $G_IDENT;
const $ID_interface = $L_ID_interface | $G_IDENT;
const $ID_let = $L_ID_let | $G_IDENT;
const $ID_new = $L_ID_new | $G_IDENT;
const $ID_null = $L_ID_null | $G_IDENT;
const $ID_of = $L_ID_of | $G_IDENT;
const $ID_package = $L_ID_package | $G_IDENT;
const $ID_private = $L_ID_private | $G_IDENT;
const $ID_protected = $L_ID_protected | $G_IDENT;
const $ID_public = $L_ID_public | $G_IDENT;
const $ID_return = $L_ID_return | $G_IDENT;
const $ID_set = $L_ID_set | $G_IDENT;
const $ID_static = $L_ID_static | $G_IDENT;
const $ID_super = $L_ID_super | $G_IDENT;
const $ID_switch = $L_ID_switch | $G_IDENT;
const $ID_target = $L_ID_target | $G_IDENT;
const $ID_this = $L_ID_this | $G_IDENT;
const $ID_throw = $L_ID_throw | $G_IDENT;
const $ID_true = $L_ID_true | $G_IDENT;
const $ID_try = $L_ID_try | $G_IDENT;
const $ID_typeof = $L_ID_typeof | $G_IDENT;
const $ID_var = $L_ID_var | $G_IDENT;
const $ID_void = $L_ID_void | $G_IDENT;
const $ID_while = $L_ID_while | $G_IDENT;
const $ID_with = $L_ID_with | $G_IDENT;
const $ID_yield = $L_ID_yield | $G_IDENT;
const $NUMBER_HEX = $L_NUMBER_HEX | $G_NUMBER;
const $NUMBER_DEC = $L_NUMBER_DEC | $G_NUMBER;
const $NUMBER_BIN = $L_NUMBER_BIN | $G_NUMBER;
const $NUMBER_OCT = $L_NUMBER_OCT | $G_NUMBER;
const $NUMBER_OLD = $L_NUMBER_OLD | $G_NUMBER;
const $NUMBER_BIG_HEX = $L_NUMBER_HEX | $G_NUMBER | $G_NUMBER_BIG_INT;
const $NUMBER_BIG_DEC = $L_NUMBER_DEC | $G_NUMBER | $G_NUMBER_BIG_INT;
const $NUMBER_BIG_BIN = $L_NUMBER_BIN | $G_NUMBER | $G_NUMBER_BIG_INT;
const $NUMBER_BIG_OCT = $L_NUMBER_OCT | $G_NUMBER | $G_NUMBER_BIG_INT;
const $PUNC_EXCL = $L_EXCL | $G_PUNCTUATOR;
const $PUNC_EXCL_EQ = $L_EXCL_EQ | $G_PUNCTUATOR;
const $PUNC_EXCL_EQ_EQ = $L_EXCL_EQ_EQ | $G_PUNCTUATOR;
const $PUNC_PERCENT = $L_PERCENT | $G_PUNCTUATOR;
const $PUNC_PERCENT_EQ = $L_PERCENT_EQ | $G_PUNCTUATOR;
const $PUNC_AND = $L_AND | $G_PUNCTUATOR;
const $PUNC_AND_AND = $L_AND_AND | $G_PUNCTUATOR;
const $PUNC_AND_EQ = $L_AND_EQ | $G_PUNCTUATOR;
const $PUNC_PAREN_OPEN = $L_PAREN_OPEN | $G_PUNCTUATOR;
const $PUNC_PAREN_CLOSE = $L_PAREN_CLOSE | $G_PUNCTUATOR;
const $PUNC_STAR = $L_STAR | $G_PUNCTUATOR;
const $PUNC_STAR_STAR = $L_STAR_STAR | $G_PUNCTUATOR;
const $PUNC_STAR_EQ = $L_STAR_EQ | $G_PUNCTUATOR;
const $PUNC_STAR_STAR_EQ = $L_STAR_STAR_EQ | $G_PUNCTUATOR;
const $PUNC_PLUS = $L_PLUS | $G_PUNCTUATOR;
const $PUNC_PLUS_PLUS = $L_PLUS_PLUS | $G_PUNCTUATOR;
const $PUNC_PLUS_EQ = $L_PLUS_EQ | $G_PUNCTUATOR;
const $PUNC_COMMA = $L_COMMA | $G_PUNCTUATOR;
const $PUNC_MIN = $L_MIN | $G_PUNCTUATOR;
const $PUNC_MIN_MIN = $L_MIN_MIN | $G_PUNCTUATOR;
const $PUNC_MIN_EQ = $L_MIN_EQ | $G_PUNCTUATOR;
const $PUNC_MIN_MIN_GT = $L_MIN_MIN_GT | $G_PUNCTUATOR;
const $PUNC_DOT = $L_DOT | $G_PUNCTUATOR;
const $PUNC_DOT_DOT_DOT = $L_DOT_DOT_DOT | $G_PUNCTUATOR;
const $PUNC_DIV = $L_DIV | $G_PUNCTUATOR;
const $PUNC_DIV_EQ = $L_DIV_EQ | $G_PUNCTUATOR;
const $PUNC_COLON = $L_COLON | $G_PUNCTUATOR;
const $PUNC_SEMI = $L_SEMI | $G_PUNCTUATOR;
const $PUNC_LT = $L_LT | $G_PUNCTUATOR;
const $PUNC_LT_LT = $L_LT_LT | $G_PUNCTUATOR;
const $PUNC_LT_EQ = $L_LT_EQ | $G_PUNCTUATOR;
const $PUNC_LT_LT_EQ = $L_LT_LT_EQ | $G_PUNCTUATOR;
const $PUNC_LT_EXCL_MIN_MIN = $L_LT_EXCL_MIN_MIN | $G_PUNCTUATOR;
const $PUNC_EQ = $L_EQ | $G_PUNCTUATOR;
const $PUNC_EQ_EQ = $L_EQ_EQ | $G_PUNCTUATOR;
const $PUNC_EQ_EQ_EQ = $L_EQ_EQ_EQ | $G_PUNCTUATOR;
const $PUNC_EQ_GT = $L_EQ_GT | $G_PUNCTUATOR;
const $PUNC_GT = $L_GT | $G_PUNCTUATOR;
const $PUNC_GT_GT = $L_GT_GT | $G_PUNCTUATOR;
const $PUNC_GT_GT_GT = $L_GT_GT_GT | $G_PUNCTUATOR;
const $PUNC_GT_EQ = $L_GT_EQ | $G_PUNCTUATOR;
const $PUNC_GT_GT_EQ = $L_GT_GT_EQ | $G_PUNCTUATOR;
const $PUNC_GT_GT_GT_EQ = $L_GT_GT_GT_EQ | $G_PUNCTUATOR;
const $PUNC_QMARK = $L_QMARK | $G_PUNCTUATOR;
const $PUNC_BRACKET_OPEN = $L_BRACKET_OPEN | $G_PUNCTUATOR;
const $PUNC_BRACKET_CLOSE = $L_BRACKET_CLOSE | $G_PUNCTUATOR;
const $PUNC_CARET = $L_CARET | $G_PUNCTUATOR;
const $PUNC_CARET_EQ = $L_CARET_EQ | $G_PUNCTUATOR;
const $PUNC_CURLY_OPEN = $L_CURLY_OPEN | $G_PUNCTUATOR;
const $PUNC_OR = $L_OR | $G_PUNCTUATOR;
const $PUNC_OR_OR = $L_OR_OR | $G_PUNCTUATOR;
const $PUNC_OR_EQ = $L_OR_EQ | $G_PUNCTUATOR;
const $PUNC_CURLY_CLOSE = $L_CURLY_CLOSE | $G_PUNCTUATOR;
const $PUNC_TILDE = $L_TILDE | $G_PUNCTUATOR;
const $REGEXN = $L_REGEXN | $G_REGEX; // No u-flag
const $REGEXU = $L_REGEXU | $G_REGEX; // With u-flag ("strict mode" for regular expressions)
const $STRING_SINGLE = $L_STRING_SINGLE | $G_STRING;
const $STRING_DOUBLE = $L_STRING_DOUBLE | $G_STRING;
const $TICK_HEAD = $L_TICK_HEAD | $G_TICK;
const $TICK_BODY = $L_TICK_BODY | $G_TICK;
const $TICK_TAIL = $L_TICK_TAIL | $G_TICK;
const $TICK_PURE = $L_TICK_PURE | $G_TICK;
const $TICK_BAD_HEAD = $L_TICK_HEAD | $G_TICK | $G_TICK_BAD_ESCAPE;
const $TICK_BAD_BODY = $L_TICK_BODY | $G_TICK | $G_TICK_BAD_ESCAPE;
const $TICK_BAD_TAIL = $L_TICK_TAIL | $G_TICK | $G_TICK_BAD_ESCAPE;
const $TICK_BAD_PURE = $L_TICK_PURE | $G_TICK | $G_TICK_BAD_ESCAPE;
const $EOF = $L_EOF | $G_OTHER;
const $ASI = $L_ASI | $G_OTHER;
const $ERROR = $L_ERROR | $G_OTHER;

let KEYWORD_TRIE = { 0:
    { 17:
        { 6:
            { 20:
                { 12: { 4: { 13: { 19: { 18: { hit: $ID_arguments } } } } } } } },
      18: { 24: { 13: { 2: { hit: $ID_async } } }, hit: $ID_as },
      22: { 0: { 8: { 19: { hit: $ID_await } } } } },
  1: { 17: { 4: { 0: { 10: { hit: $ID_break } } } } },
  2:
    { 0:
        { 18: { 4: { hit: $ID_case } },
          19: { 2: { 7: { hit: $ID_catch } } } },
      11: { 0: { 18: { 18: { hit: $ID_class } } } },
      14:
        { 13:
            { 18: { 19: { hit: $ID_const } },
              19: { 8: { 13: { 20: { 4: { hit: $ID_continue } } } } } } } },
  3:
    { 4:
        { 1:
            { 20: { 6: { 6: { 4: { 17: { hit: $ID_debugger } } } } } },
          5: { 0: { 20: { 11: { 19: { hit: $ID_default } } } } },
          11: { 4: { 19: { 4: { hit: $ID_delete } } } } },
      14: { hit: $ID_do } },
  4:
    { 11: { 18: { 4: { hit: $ID_else } } },
      13: { 20: { 12: { hit: $ID_enum } } },
      21: { 0: { 11: { hit: $ID_eval } } },
      23:
        { 15: { 14: { 17: { 19: { hit: $ID_export } } } },
          19: { 4: { 13: { 3: { 18: { hit: $ID_extends } } } } } } },
  5:
    { 0: { 11: { 18: { 4: { hit: $ID_false } } } },
      8:
        { 13: { 0: { 11: { 11: { 24: { hit: $ID_finally } } } } } },
      14: { 17: { hit: $ID_for } },
      17: { 14: { 12: { hit: $ID_from } } },
      20:
        { 13:
            { 2: { 19: { 8: { 14: { 13: { hit: $ID_function } } } } } } } },
  6: { 4: { 19: { hit: $ID_get } } },
  8:
    { 5: { hit: $ID_if },
      12:
        { 15:
            { 11:
                { 4:
                    { 12: { 4: { 13: { 19: { 18: { hit: $ID_implements } } } } } } },
              14: { 17: { 19: { hit: $ID_import } } } } },
      13:
        { 18:
            { 19:
                { 0:
                    { 13: { 2: { 4: { 14: { 5: { hit: $ID_instanceof } } } } } } } },
          19:
            { 4:
                { 17: { 5: { 0: { 2: { 4: { hit: $ID_interface } } } } } } },
          hit: $ID_in } },
  11: { 4: { 19: { hit: $ID_let } } },
  13:
    { 4: { 22: { hit: $ID_new } },
      20: { 11: { 11: { hit: $ID_null } } } },
  14: { 5: { hit: $ID_of } },
  15:
    { 0:
        { 2: { 10: { 0: { 6: { 4: { hit: $ID_package } } } } } },
      17:
        { 8: { 21: { 0: { 19: { 4: { hit: $ID_private } } } } },
          14:
            { 19:
                { 4: { 2: { 19: { 4: { 3: { hit: $ID_protected } } } } } } } },
      20: { 1: { 11: { 8: { 2: { hit: $ID_public } } } } } },
  17:
    { 4: { 19: { 20: { 17: { 13: { hit: $ID_return } } } } } },
  18:
    { 4: { 19: { hit: $ID_set } },
      19: { 0: { 19: { 8: { 2: { hit: $ID_static } } } } },
      20: { 15: { 4: { 17: { hit: $ID_super } } } },
      22: { 8: { 19: { 2: { 7: { hit: $ID_switch } } } } } },
  19:
    { 0: { 17: { 6: { 4: { 19: { hit: $ID_target } } } } },
      7:
        { 8: { 18: { hit: $ID_this } },
          17: { 14: { 22: { hit: $ID_throw } } } },
      17: { 20: { 4: { hit: $ID_true } }, 24: { hit: $ID_try } },
      24: { 15: { 4: { 14: { 5: { hit: $ID_typeof } } } } } },
  21:
    { 0: { 17: { hit: $ID_var } },
      14: { 8: { 3: { hit: $ID_void } } } },
  22:
    { 7: { 8: { 11: { 4: { hit: $ID_while } } } },
      8: { 19: { 7: { hit: $ID_with } } } },
  24: { 8: { 4: { 11: { 3: { hit: $ID_yield } } } } } };

function isWhiteToken(type) {
  return (type & $G_WHITE) === $G_WHITE;
}
function isNewlineToken(type) {
  return (type & $G_NEWLINE) === $G_NEWLINE;
}
function isCommentToken(type) {
  return (type & $G_COMMENT) === $G_COMMENT;
}
function isIdentToken(type) {
  return (type & $G_IDENT) === $G_IDENT;
}
function isNumberToken(type) {
  return (type & $G_NUMBER) === $G_NUMBER;
}
function isBigintToken(type) {
  return (type & $G_NUMBER_BIG_INT) === $G_NUMBER_BIG_INT;
}
function isStringToken(type) {
  return (type & $G_STRING) === $G_STRING;
}
function isPunctuatorToken(type) {
  return (type & $G_PUNCTUATOR) === $G_PUNCTUATOR;
}
function isRegexToken(type) {
  return (type & $G_REGEX) === $G_REGEX;
}
function isTickToken(type) {
  return (type & $G_TICK) === $G_TICK;
}
function isBadTickToken(type) {
  return (type & $G_TICK_BAD_ESCAPE) === $G_TICK_BAD_ESCAPE;
}
function isNumberStringToken(type) {
  return (type & ($G_NUMBER | $G_STRING)) !== 0;
}
function isNumberStringRegex(type) {
  return (type & ($G_NUMBER | $G_STRING | $G_REGEX)) !== 0;
}

// <SCRUB ASSERTS TO COMMENT>
// At runtime, any value of token.type / curtype should be in this set
let ALL_TOKEN_GROUPS;
ASSERT(ALL_TOKEN_GROUPS = [
  $G_WHITE,
  $G_NEWLINE,
  $G_COMMENT,
  $G_IDENT,
  $G_NUMBER,
  $G_NUMBER_BIG_INT,
  $G_PUNCTUATOR,
  $G_STRING,
  $G_REGEX,
  $G_TICK,
  $G_TICK_BAD_ESCAPE,
]);
let ALL_TOKEN_TYPES;
ASSERT(ALL_TOKEN_TYPES = [
  $SPACE,
  $TAB,
  $NL_SOLO,
  $NL_CRLF,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $COMMENT_HTML,
  $IDENT,
  $ID_arguments,
  $ID_as,
  $ID_async,
  $ID_await,
  $ID_break,
  $ID_case,
  $ID_catch,
  $ID_class,
  $ID_const,
  $ID_continue,
  $ID_debugger,
  $ID_default,
  $ID_delete,
  $ID_do,
  $ID_else,
  $ID_enum,
  $ID_eval,
  $ID_export,
  $ID_extends,
  $ID_false,
  $ID_finally,
  $ID_for,
  $ID_from,
  $ID_function,
  $ID_get,
  $ID_if,
  $ID_implements,
  $ID_import,
  $ID_in,
  $ID_instanceof,
  $ID_interface,
  $ID_let,
  $ID_new,
  $ID_null,
  $ID_of,
  $ID_package,
  $ID_private,
  $ID_protected,
  $ID_public,
  $ID_return,
  $ID_set,
  $ID_static,
  $ID_super,
  $ID_switch,
  $ID_target,
  $ID_this,
  $ID_throw,
  $ID_true,
  $ID_try,
  $ID_typeof,
  $ID_var,
  $ID_void,
  $ID_while,
  $ID_with,
  $ID_yield,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $NUMBER_BIG_HEX,
  $NUMBER_BIG_DEC,
  $NUMBER_BIG_BIN,
  $NUMBER_BIG_OCT,
  $PUNC_EXCL,
  $PUNC_EXCL_EQ,
  $PUNC_EXCL_EQ_EQ,
  $PUNC_PERCENT,
  $PUNC_PERCENT_EQ,
  $PUNC_AND,
  $PUNC_AND_AND,
  $PUNC_AND_EQ,
  $PUNC_PAREN_OPEN,
  $PUNC_PAREN_CLOSE,
  $PUNC_STAR,
  $PUNC_STAR_STAR,
  $PUNC_STAR_EQ,
  $PUNC_STAR_STAR_EQ,
  $PUNC_PLUS,
  $PUNC_PLUS_PLUS,
  $PUNC_PLUS_EQ,
  $PUNC_COMMA,
  $PUNC_MIN,
  $PUNC_MIN_MIN,
  $PUNC_MIN_EQ,
  $PUNC_MIN_MIN_GT,
  $PUNC_DOT,
  $PUNC_DOT_DOT_DOT,
  $PUNC_DIV,
  $PUNC_DIV_EQ,
  $PUNC_COLON,
  $PUNC_SEMI,
  $PUNC_LT,
  $PUNC_LT_LT,
  $PUNC_LT_EQ,
  $PUNC_LT_LT_EQ,
  $PUNC_LT_EXCL_MIN_MIN,
  $PUNC_EQ,
  $PUNC_EQ_EQ,
  $PUNC_EQ_EQ_EQ,
  $PUNC_EQ_GT,
  $PUNC_GT,
  $PUNC_GT_GT,
  $PUNC_GT_GT_GT,
  $PUNC_GT_EQ,
  $PUNC_GT_GT_EQ,
  $PUNC_GT_GT_GT_EQ,
  $PUNC_QMARK,
  $PUNC_BRACKET_OPEN,
  $PUNC_BRACKET_CLOSE,
  $PUNC_CARET,
  $PUNC_CARET_EQ,
  $PUNC_CURLY_OPEN,
  $PUNC_OR,
  $PUNC_OR_OR,
  $PUNC_OR_EQ,
  $PUNC_CURLY_CLOSE,
  $PUNC_TILDE,
  $REGEXN,
  $REGEXU,
  $STRING_SINGLE,
  $STRING_DOUBLE,
  $TICK_HEAD,
  $TICK_BODY,
  $TICK_TAIL,
  $TICK_PURE,
  $TICK_BAD_HEAD,
  $TICK_BAD_BODY,
  $TICK_BAD_TAIL,
  $TICK_BAD_PURE,
  $EOF,
  $ASI,
  $ERROR,
]);
// </SCRUB ASSERTS TO COMMENT>

let MAX_START_VALUE = 26; // For quick check difference START or token type
let __$flag_start = 0; // This name is hardcoded in the build script...
const START_SPACE = __$flag_start++;
const START_ID = __$flag_start++;
const START_KEY = __$flag_start++; // Any lower case (even the ones that can't start a keyword). Used to scan for keywords.
const START_NL_SOLO = __$flag_start++;
const START_CR = __$flag_start++;
const START_STRING = __$flag_start++;
const START_DECIMAL = __$flag_start++;
const START_DOT = __$flag_start++;
const START_CURLY_CLOSE = __$flag_start++;
const START_EQ = __$flag_start++;
const START_DIV = __$flag_start++;
const START_PLUS = __$flag_start++;
const START_MIN = __$flag_start++;
const START_ZERO = __$flag_start++;
const START_TEMPLATE = __$flag_start++;
const START_EXCL = __$flag_start++;
const START_PERCENT = __$flag_start++;
const START_AND = __$flag_start++;
const START_STAR = __$flag_start++;
const START_CARET = __$flag_start++;
const START_LT = __$flag_start++;
const START_GT = __$flag_start++;
const START_OR = __$flag_start++;
const START_UNICODE = __$flag_start++;
const START_BSLASH = __$flag_start++;
const START_ERROR = __$flag_start++;
// <SCRUB ASSERTS TO COMMENT>
ASSERT(__$flag_start === MAX_START_VALUE, 'keep in sync');
ASSERT(ALL_GEES.every(type => type > __$flag_start), 'the G start at bit 7 or whatever so should all be larger because this is how we distinct a single-char-token hit from a start-needs-refinement result');
ASSERT(ALL_TOKEN_TYPES.every(type => type > __$flag_start), 'all tokens must be higher than the start numbers because they are all combinations with at least one G. this is important so we can distinguish them when reading the token start');
// </SCRUB ASSERTS TO COMMENT>

// Inspired by https://twitter.com/Ghost1240145716/status/1186595972232564736 / https://gist.github.com/KFlash/c53a2f0adb25e88ab7cdc3d77d295635
let tokenStartJumpTable = [
  // val                     hex    end   desc
  START_ERROR,            // 0x00   yes   NUL
  START_ERROR,            // 0x01   yes   SOH
  START_ERROR,            // 0x02   yes   STX
  START_ERROR,            // 0x03   yes   ETX
  START_ERROR,            // 0x04   yes   EOT
  START_ERROR,            // 0x05   yes   ENQ
  START_ERROR,            // 0x06   yes   ACK
  START_ERROR,            // 0x07   yes   BEL
  START_ERROR,            // 0x08   yes   BS
  START_SPACE,            // 0x09   yes   HT
  START_NL_SOLO,          // 0x0A   yes   LF
  START_SPACE,            // 0x0B   yes   VT
  START_SPACE,            // 0x0C   yes   FF
  START_CR,               // 0x0D   no2   CR :: CR CRLF
  START_ERROR,            // 0x0E   yes   SO
  START_ERROR,            // 0x0F   yes   SI
  START_ERROR,            // 0x10   yes   DLE
  START_ERROR,            // 0x11   yes   DC1
  START_ERROR,            // 0x12   yes   DC2
  START_ERROR,            // 0x13   yes   DC3
  START_ERROR,            // 0x14   yes   DC4
  START_ERROR,            // 0x15   yes   NAK
  START_ERROR,            // 0x16   yes   SYN
  START_ERROR,            // 0x17   yes   ETB
  START_ERROR,            // 0x18   yes   CAN
  START_ERROR,            // 0x19   yes   EM
  START_ERROR,            // 0x1A   yes   SUB
  START_ERROR,            // 0x1B   yes   ESC
  START_ERROR,            // 0x1C   yes   FS
  START_ERROR,            // 0x1D   yes   GS
  START_ERROR,            // 0x1E   yes   RS
  START_ERROR,            // 0x1F   yes   US
  START_SPACE,            // 0x20   yes   space
  START_EXCL,             // 0x21   no3   ! :: ! != !==
  START_STRING,           // 0x22   no*   "
  START_ERROR,            // 0x23   yes   #
  START_ID,               // 0x24   no*   $
  START_PERCENT,          // 0x25   no2   % :: % %=
  START_AND,              // 0x26   no3   & :: & && &=
  START_STRING,           // 0x27   no*   '
  $PUNC_PAREN_OPEN,       // 0x28   yes   (
  $PUNC_PAREN_CLOSE,      // 0x29   yes   )
  START_STAR,             // 0x2A   no4   * :: * ** *= **=
  START_PLUS,             // 0x2B   no3   + :: + ++ +=
  $PUNC_COMMA,            // 0x2C   yes   ,
  START_MIN,              // 0x2D   no4   - :: - -- -= -->
  START_DOT,              // 0x2E   no3   . :: . ... number
  START_DIV,              // 0x2F   no*   / :: / regex
  START_ZERO,             // 0x30   no*   0
  START_DECIMAL,          // 0x31   no*   1
  START_DECIMAL,          // 0x32   no*   2
  START_DECIMAL,          // 0x33   no*   3
  START_DECIMAL,          // 0x34   no*   4
  START_DECIMAL,          // 0x35   no*   5
  START_DECIMAL,          // 0x36   no*   6
  START_DECIMAL,          // 0x37   no*   7
  START_DECIMAL,          // 0x38   no*   8
  START_DECIMAL,          // 0x39   no*   9
  $PUNC_COLON,            // 0x3A   yes   :
  $PUNC_SEMI,             // 0x3B   yes   ;
  START_LT,               // 0x3C   no4   < :: < << <= <<= <!--
  START_EQ,               // 0x3D   no4   = :: = == === =>
  START_GT,               // 0x3E   no7   > :: > >= >> >>= >>> >>>=
  $PUNC_QMARK,            // 0x3F   yes   ?
  START_ERROR,            // 0x40   yes   @
  START_ID,               // 0x41   no*   A
  START_ID,               // 0x42   no*   B
  START_ID,               // 0x43   no*   C
  START_ID,               // 0x44   no*   D
  START_ID,               // 0x45   no*   E
  START_ID,               // 0x46   no*   F
  START_ID,               // 0x47   no*   G
  START_ID,               // 0x48   no*   H
  START_ID,               // 0x49   no*   I
  START_ID,               // 0x4A   no*   J
  START_ID,               // 0x4B   no*   K
  START_ID,               // 0x4C   no*   L
  START_ID,               // 0x4D   no*   M
  START_ID,               // 0x4E   no*   N
  START_ID,               // 0x4F   no*   O
  START_ID,               // 0x50   no*   P
  START_ID,               // 0x51   no*   Q
  START_ID,               // 0x52   no*   R
  START_ID,               // 0x53   no*   S
  START_ID,               // 0x54   no*   T
  START_ID,               // 0x55   no*   U
  START_ID,               // 0x56   no*   V
  START_ID,               // 0x57   no*   W
  START_ID,               // 0x58   no*   X
  START_ID,               // 0x59   no*   Y
  START_ID,               // 0x5A   no*   Z
  $PUNC_BRACKET_OPEN,     // 0x5B   yes   [
  START_BSLASH,           // 0x5C   no2   \ :: \uHHHH \u{H*}
  $PUNC_BRACKET_CLOSE,    // 0x5D   yes   ]
  START_CARET,            // 0x5E   no2   ^ :: ^ ^=
  START_ID,               // 0x5F   no*   _ (lodash)
  START_TEMPLATE,         // 0x60   no*   ` :: `...${ `...`
  START_KEY,               // 0x61   no*   a
  START_KEY,               // 0x62   no*   b
  START_KEY,               // 0x63   no*   c
  START_KEY,               // 0x64   no*   d
  START_KEY,               // 0x65   no*   e
  START_KEY,               // 0x66   no*   f
  START_KEY,               // 0x67   no*   g
  START_KEY,               // 0x68   no*   h
  START_KEY,               // 0x69   no*   i
  START_KEY,               // 0x6A   no*   j
  START_KEY,               // 0x6B   no*   k
  START_KEY,               // 0x6C   no*   l
  START_KEY,               // 0x6D   no*   m
  START_KEY,               // 0x6E   no*   n
  START_KEY,               // 0x6F   no*   o
  START_KEY,               // 0x70   no*   p
  START_KEY,               // 0x71   no*   q
  START_KEY,               // 0x72   no*   r
  START_KEY,               // 0x73   no*   s
  START_KEY,               // 0x74   no*   t
  START_KEY,               // 0x75   no*   u
  START_KEY,               // 0x76   no*   v
  START_KEY,               // 0x77   no*   w
  START_KEY,               // 0x78   no*   x
  START_KEY,               // 0x79   no*   y
  START_KEY,               // 0x7A   no*   z
  $PUNC_CURLY_OPEN,       // 0x7B   yes   {
  START_OR,               // 0x7C   no3   | :: | || |=
  START_CURLY_CLOSE,      // 0x7D   no3   } :: } }...` }...${
  $PUNC_TILDE,            // 0x7E   yes   ~
  // TODO: is it more efficient to fill the table with 0x7f to align it with a power of 2? It's unlikely to prevent a miss so that's not a reason but I recall po2 to be a reason
  // START_ERROR,            // 0x7F   yes   DEL
];

// <SCRUB ASSERTS TO COMMENT>
let ALL_START_TYPES;
ASSERT(ALL_START_TYPES = [START_SPACE, START_NL_SOLO, START_CR, START_EXCL, START_STRING, START_ZERO, START_DECIMAL, START_TEMPLATE, START_ID, START_KEY, START_PERCENT, START_AND, START_STAR, START_PLUS, START_MIN, START_DOT, START_DIV, START_CARET, START_LT, START_EQ, START_GT, START_BSLASH, START_OR, START_CURLY_CLOSE, START_UNICODE, START_ERROR]);
// </SCRUB ASSERTS TO COMMENT>

function getTokenStart(c) {
  ASSERT(getTokenStart.length === arguments.length, 'arg count');
  ASSERT(c >= 0, 'nothing generates negatives for chars');
  ASSERT(Number.isInteger(c), 'all numbers should be ints, and not NaN or Infinite (subsumed)');
  if (c > 0x7e) return START_UNICODE;
  let s = tokenStartJumpTable[c];
  ASSERT(s <= __$flag_start ? ALL_START_TYPES.includes(s) : ALL_TOKEN_TYPES.includes(s), 'confirm the jump table is returning correct values');
  ASSERT(ALL_START_TYPES.includes(s) !== ALL_TOKEN_TYPES.includes(s), 'confirm the jump table returns either a start type or a token type (and that it cant be both nor neither)');
  return s;
}

export {
  getTokenStart,
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

  KEYWORD_TRIE,
  MAX_START_VALUE,

  $G_WHITE,
  $G_NEWLINE,
  $G_COMMENT,
  $G_IDENT,
  $G_NUMBER,
  $G_NUMBER_BIG_INT,
  $G_PUNCTUATOR,
  $G_STRING,
  $G_REGEX,
  $G_TICK,
  $G_TICK_BAD_ESCAPE,
  $G_OTHER,

  $SPACE,
  $TAB,
  $NL_SOLO,
  $NL_CRLF,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $COMMENT_HTML,
  $IDENT,
  $ID_arguments,
  $ID_as,
  $ID_async,
  $ID_await,
  $ID_break,
  $ID_case,
  $ID_catch,
  $ID_class,
  $ID_const,
  $ID_continue,
  $ID_debugger,
  $ID_default,
  $ID_delete,
  $ID_do,
  $ID_else,
  $ID_enum,
  $ID_eval,
  $ID_export,
  $ID_extends,
  $ID_false,
  $ID_finally,
  $ID_for,
  $ID_from,
  $ID_function,
  $ID_get,
  $ID_if,
  $ID_implements,
  $ID_import,
  $ID_in,
  $ID_instanceof,
  $ID_interface,
  $ID_let,
  $ID_new,
  $ID_null,
  $ID_of,
  $ID_package,
  $ID_private,
  $ID_protected,
  $ID_public,
  $ID_return,
  $ID_set,
  $ID_static,
  $ID_super,
  $ID_switch,
  $ID_target,
  $ID_this,
  $ID_throw,
  $ID_true,
  $ID_try,
  $ID_typeof,
  $ID_var,
  $ID_void,
  $ID_while,
  $ID_with,
  $ID_yield,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $NUMBER_BIG_HEX,
  $NUMBER_BIG_DEC,
  $NUMBER_BIG_BIN,
  $NUMBER_BIG_OCT,
  $PUNC_EXCL,
  $PUNC_EXCL_EQ,
  $PUNC_EXCL_EQ_EQ,
  $PUNC_PERCENT,
  $PUNC_PERCENT_EQ,
  $PUNC_AND,
  $PUNC_AND_AND,
  $PUNC_AND_EQ,
  $PUNC_PAREN_OPEN,
  $PUNC_PAREN_CLOSE,
  $PUNC_STAR,
  $PUNC_STAR_STAR,
  $PUNC_STAR_EQ,
  $PUNC_STAR_STAR_EQ,
  $PUNC_PLUS,
  $PUNC_PLUS_PLUS,
  $PUNC_PLUS_EQ,
  $PUNC_COMMA,
  $PUNC_MIN,
  $PUNC_MIN_MIN,
  $PUNC_MIN_EQ,
  $PUNC_MIN_MIN_GT,
  $PUNC_DOT,
  $PUNC_DOT_DOT_DOT,
  $PUNC_DIV,
  $PUNC_DIV_EQ,
  $PUNC_COLON,
  $PUNC_SEMI,
  $PUNC_LT,
  $PUNC_LT_LT,
  $PUNC_LT_EQ,
  $PUNC_LT_LT_EQ,
  $PUNC_LT_EXCL_MIN_MIN,
  $PUNC_EQ,
  $PUNC_EQ_EQ,
  $PUNC_EQ_EQ_EQ,
  $PUNC_EQ_GT,
  $PUNC_GT,
  $PUNC_GT_GT,
  $PUNC_GT_GT_GT,
  $PUNC_GT_EQ,
  $PUNC_GT_GT_EQ,
  $PUNC_GT_GT_GT_EQ,
  $PUNC_QMARK,
  $PUNC_BRACKET_OPEN,
  $PUNC_BRACKET_CLOSE,
  $PUNC_CARET,
  $PUNC_CARET_EQ,
  $PUNC_CURLY_OPEN,
  $PUNC_OR,
  $PUNC_OR_OR,
  $PUNC_OR_EQ,
  $PUNC_CURLY_CLOSE,
  $PUNC_TILDE,
  $REGEXN,
  $REGEXU,
  $STRING_SINGLE,
  $STRING_DOUBLE,
  $TICK_HEAD,
  $TICK_BODY,
  $TICK_TAIL,
  $TICK_PURE,
  $TICK_BAD_HEAD,
  $TICK_BAD_BODY,
  $TICK_BAD_TAIL,
  $TICK_BAD_PURE,
  $EOF,
  $ASI,
  $ERROR,

  START_SPACE,
  START_ID,
  START_KEY,
  START_NL_SOLO,
  START_CR,
  START_STRING,
  START_DECIMAL,
  START_DOT,
  START_CURLY_CLOSE,
  START_EQ,
  START_DIV,
  START_PLUS,
  START_MIN,
  START_ZERO,
  START_TEMPLATE,
  START_EXCL,
  START_PERCENT,
  START_AND,
  START_STAR,
  START_CARET,
  START_LT,
  START_GT,
  START_OR,
  START_UNICODE,
  START_BSLASH,
  START_ERROR,

  // <SCRUB ASSERTS TO COMMENT>
  ALL_START_TYPES,
  ALL_GEES,
  ALL_TOKEN_GROUPS,
  ALL_TOKEN_TYPES,
  // </SCRUB ASSERTS TO COMMENT>
};
