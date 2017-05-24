// relevant: https://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-lexical-grammar
// https://tc39.github.io/ecma262/

//import {
let {
  $$A_61,
  $$A_UC_41,
  $$B_62,
  $$B_UC_42,
  $$C_63,
  $$C_UC_43,
  $$D_64,
  $$D_UC_44,
  $$E_65,
  $$E_UC_45,
  $$F_66,
  $$F_UC_46,
  $$G_67,
  $$G_UC_47,
  $$H_68,
  $$H_UC_48,
  $$I_69,
  $$I_UC_49,
  $$J_6A,
  $$J_UC_4A,
  $$K_6B,
  $$K_UC_4B,
  $$L_6C,
  $$L_UC_4C,
  $$M_6D,
  $$M_UC_4D,
  $$N_6E,
  $$N_UC_4E,
  $$O_6F,
  $$O_UC_4F,
  $$P_70,
  $$P_UC_50,
  $$Q_71,
  $$Q_UC_51,
  $$R_72,
  $$R_UC_52,
  $$S_73,
  $$S_UC_53,
  $$T_74,
  $$T_UC_54,
  $$U_75,
  $$U_UC_55,
  $$V_76,
  $$V_UC_56,
  $$W_77,
  $$W_UC_57,
  $$X_78,
  $$X_UC_58,
  $$Y_79,
  $$Y_UC_59,
  $$Z_7A,
  $$Z_UC_5A,
  $$0_30,
  $$1_31,
  $$2_32,
  $$3_33,
  $$4_34,
  $$5_35,
  $$6_36,
  $$7_37,
  $$8_38,
  $$9_39,

  $$TAB_09,
  $$LF_0A,
  $$VTAB_0B,
  $$FF_0C,
  $$CR_0D,
  $$SPACE_20,
  $$EXCL_21,
  $$DQUOTE_22,
  $$HASH_23,
  $$$_24,
  $$PERCENT_25,
  $$AND_26,
  $$SQUOTE_27,
  $$PAREN_L_28,
  $$PAREN_R_29,
  $$STAR_2A,
  $$PLUS_2B,
  $$COMMA_2C,
  $$DASH_2D,
  $$DOT_2E,
  $$FWDSLASH_2F,
  $$COLON_3A,
  $$SEMI_3B,
  $$LT_3C,
  $$IS_3D,
  $$GT_3E,
  $$QMARK_3F,
  $$SQUARE_L_5B,
  $$BACKSLASH_5C,
  $$SQUARE_R_5D,
  $$XOR_5E,
  $$LODASH_5F,
  $$TICK_60,
  $$CURLY_L_7B,
  $$CURLY_R_7D,
  $$TILDE_7E,
  $$OR_7C,
  $$NBSP_A0,
  $$ZWS_200B,
  $$ZWNJ_200C,
  $$ZWJ_200D,
  $$LS_2029,
  $$PS_2028,
  $$BOM_FEFF,

  ASSERT,
} = require('./utils'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from 'utils';

// note: cannot use more than 32 flags...
// TODO: collapse the dynamic initializations to static numbers
let $flag = 0;
const $ERROR = 0;
const $WHITE = 1 << ++$flag;
const $SPACE = (1 << ++$flag) | $WHITE;
const $TAB = (1 << ++$flag) | $WHITE;
const $NL = (1 << ++$flag) | $WHITE;
const $CRLF = (1 << ++$flag) | $WHITE | $NL;
const $COMMENT = (1 << ++$flag) | $WHITE;
const $COMMENT_SINGLE = (1 << ++$flag) | $WHITE | $COMMENT;
const $COMMENT_MULTI = (1 << ++$flag) | $WHITE | $COMMENT;
const $NUMBER = 1 << ++$flag;
const $NUMBER_HEX = (1 << ++$flag) | $NUMBER;
const $NUMBER_DEC = (1 << ++$flag) | $NUMBER;
const $NUMBER_BIN = (1 << ++$flag) | $NUMBER;
const $NUMBER_OCT = (1 << ++$flag) | $NUMBER;
const $NUMBER_OLD = (1 << ++$flag) | $NUMBER;
const $STRING = 1 << ++$flag;
const $STRING_SINGLE = 1 << ++$flag;
const $STRING_DOUBLE = 1 << ++$flag;
const $IDENT = 1 << ++$flag;
const $PUNCTUATOR = 1 << ++$flag;
const $REGEX = 1 << ++$flag;
const $REGEXU = (1 << ++$flag) | $REGEX; // with /u flag
const $TICK = 1 << ++$flag;
const $TICK_HEAD = (1 << ++$flag) | $TICK;
const $TICK_BODY = (1 << ++$flag) | $TICK;
const $TICK_TAIL = (1 << ++$flag) | $TICK;
const $TICK_PURE = $TICK_HEAD | $TICK_TAIL;
const $ASI = 1 << ++$flag;
const $EOF = 1 << ++$flag;
ASSERT($flag < 32, 'cannot use more than 32 flags');

const GOAL_MODULE = true;
const GOAL_SCRIPT = false;

const STRICT_MODE = true;
const SLOPPY_MODE = false;

const DIV = true;
const REX = false;

const BAD_ESCAPE = true;
const GOOD_ESCAPE = false;

const ALWAYS_GOOD = 0;
const GOOD_WITH_U_FLAG = 1;
const GOOD_SANS_U_FLAG = 2;
const ALWAYS_BAD = 4;

const FIRST_CHAR = true;
const NON_START = false;

const CHARCLASS_BAD = 0x110000;
const CHARCLASS_BAD_RANGE = 0x110001;
const CHARCLASS_BADU = 1<<23;
const CHARCLASS_BADN = 1<<24;

function ZeTokenizer(input, goal) {
  ASSERT(typeof input === 'string', 'input string should be string; ' + typeof input);
  ASSERT(typeof goal === 'boolean', 'goal boolean');

  let pointer = 0;
  let len = input.length;

  let wasWhite = false;
  let consumedNewline = false; // whitespace newline token or string token that contained newline or multiline comment
  let finished = false; // generated an $EOF?

  function peek() {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    return input.charCodeAt(pointer);
  }
  function peekd(delta) {
    ASSERT(pointer + delta >= 0 && pointer + delta < len, 'pointer not oob');
    ASSERT(arguments.length === 1, 'one args');

    return input.charCodeAt(pointer + delta);
  }
  function peeky(ord) {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(arguments.length === 1, 'one args');

    return peek() === ord;
  }
  function peekyd(d, ord) {
    ASSERT(neofd(d), 'pointer not oob [' + d + '][' + pointer + ']');
    ASSERT(typeof ord === 'number', 'ord shoud be number');
    ASSERT(arguments.length === 2, 'two args');

    return peekd(d) === ord;
  }

  function slice(from, to) {
    ASSERT(typeof from === 'number' && from >= 0 && from <= len, 'from shoud be valid index');
    ASSERT(typeof to === 'number' && to >= 0 && to <= len, 'to shoud be valid index');
    ASSERT(arguments.length === 2, 'two args');

    return input.slice(from, to);
  }

  function peekSkip() {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    return input.charCodeAt(pointer++); // TODO: not unicode aware... should confirm this with unicode strings. and what about unicode identifiers?
  }
  function skipPeek() {
    ASSERT(neofd(1), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    return input.charCodeAt(++pointer); // TODO: not unicode aware... should confirm this with unicode strings. and what about unicode identifiers?
  }

  function skip() {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    ++pointer;
  }

  function eof() {
    return pointer >= len;
  }
  function eofd(d) {
    return pointer >= len - d;
  }
  function neof() {
    return pointer < len;
  }
  function neofd(d) {
    return pointer < len - d;
  }

  function ASSERT_skip(chr) { // these calls are replaced with skip() in a build step
    // note: consider this `skip()` in prod
    ASSERT(neof(), 'should not be oob before the skip');
    ASSERT(arguments.length === 1, 'require explicit char');
    ASSERT(peeky(chr), 'skip expecting different char');

    ++pointer;
  }

  function nextDiv() {
    // bias towards stuff that may follow an expression (binary operators, postfix, semi, parens, brackets, in, instanceof, etc)
    // in particular; if the next token starts with a `/` and isn't a comment, consider it a division

    return nextToken(DIV);
  }

  function nextRex() {
    // bias towards stuff could be the start of a statement or an expression (identifiers, numbers)
    // in particular; if the next token starts with a `/` and isn't a comment, consider it a regular expression

    return nextToken(REX)
  }

  function nextTick() {
    // expect `}` and parse continue to parse a tick body

    // templates cant parse legacy octal or weird cases
    return parseTickBody();
  }

  function nextToken(slashState, strictModeState=SLOPPY_MODE, fromTemplateBody=false, _returnAny) {
    ASSERT(arguments.length >= 1 && arguments.length <= 4, 'arg count 1~4');
    ASSERT(typeof slashState === 'boolean', 'slashstate bool');
    ASSERT(typeof strictModeState === 'boolean', 'strictModeState bool');
    ASSERT(typeof fromTemplateBody === 'boolean', 'fromTemplateBody bool');
    ASSERT(!finished, 'should not next() after eof token');

    if (goal === GOAL_MODULE) strictModeState = true;
    consumedNewline = false;

    let token;
    do {
      if (neof()) {
        let start = pointer;
        wasWhite = false;
        let consumedTokenType = next(slashState, strictModeState, fromTemplateBody);
        token = createToken(consumedTokenType, start, pointer, consumedNewline, wasWhite);
      } else {
        token = createToken($EOF, pointer, pointer, consumedNewline, true);
        finished = true;
        break;
      }
    } while (wasWhite && !_returnAny);

    return token;
  }

  function createToken(type, start, stop, nl, ws) {
    return {
      type,
      _t: debug_toktype(type),
      ws, // is this token considered whitespace? (space, tab, newline, comment)
      nl, // was there a newline between the start of the previous relevant token and this one?
      start,
      stop, // start of next token
      str: slice(start, stop),
    };
  }

  function next(slashState, strictness, fromTemplate) {
    ASSERT(arguments.length === 3);
    ASSERT(typeof slashState === 'boolean', 'slashState bool');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');
    ASSERT(typeof fromTemplate === 'boolean', 'fromTemplate bool');

    let c = peekSkip();

    if (isAsciiLetter(c)) return parseIdentifierRest(c);

    // https://www.ecma-international.org/ecma-262/7.0/#sec-punctuators
    switch (c) {
      case $$SPACE_20: // note: many spaces are caught by immediate newline checks (see parseCR and parseVerifiedNewline)
        wasWhite = true;
        return $SPACE;
      case $$DOT_2E:
        return parseLeadingDot(); // . ... .25
      case $$PAREN_L_28:
        return $PUNCTUATOR;
      case $$PAREN_R_29:
        return $PUNCTUATOR;
      case $$CR_0D:
        return parseCR(); // cr crlf
      case $$LF_0A:
        return parseNewline();
      case $$COMMA_2C:
        return $PUNCTUATOR;
      case $$TAB_09:
        wasWhite = true;
        return $TAB;
      case $$DQUOTE_22:
        return parseDoubleString(strictness);
      case $$PLUS_2B:
        return parseSameOrCompound(c); // + ++ +=
      case $$TICK_60:
        return parseTemplateString(strictness, true);
      case $$0_30:
        return parseLeadingZero(strictness);
      case $$1_31:
      case $$2_32:
      case $$3_33:
      case $$4_34:
      case $$5_35:
      case $$6_36:
      case $$7_37:
      case $$8_38:
      case $$9_39:
        return parseDecimal();
      case $$FWDSLASH_2F:
        return parseFwdSlash(slashState); // / /= //.. /*..*/
      case $$EXCL_21:
        return parseExcl(); // != !==
      case $$AND_26:
        return parseSameOrCompound(c); // & && &=
      case $$DASH_2D:
        return parseSameOrCompound(c); // - -- -=
      case $$SQUOTE_27:
        return parseSingleString(strictness);
      case $$STAR_2A:
        return parseStar(); // * *= ** **=
      case $$$_24:
        return parseIdentifierRest(c);
      case $$PERCENT_25:
        return parseCompoundAssignment(); // % %=
      case $$FF_0C:
        return $WHITE;
      case $$VTAB_0B:
        return $WHITE;
      case $$SEMI_3B:
        return $PUNCTUATOR;
      case $$IS_3D:
        return parseEqual(); // = == === =>
      case $$CURLY_L_7B:
        return $PUNCTUATOR;
      case $$CURLY_R_7D:
        if (fromTemplate) return parseTemplateString(strictness, false);
        return $PUNCTUATOR;
      case $$SQUARE_L_5B:
        return $PUNCTUATOR;
      case $$SQUARE_R_5D:
        return $PUNCTUATOR;
      case $$COLON_3A:
        return $PUNCTUATOR;
      case $$LODASH_5F:
        return parseIdentifierRest(c);
      case $$OR_7C:
        return parseSameOrCompound(c); // | || |=
      case $$QMARK_3F:
        return $PUNCTUATOR;
      case $$LT_3C:
        return parseLtPunctuator(); // < << <= <<=
      case $$GT_3E:
        return parseGtPunctuator(); // > >> >>> >= >>= >>>=
      case $$XOR_5E:
        return parseCompoundAssignment(); // ^ ^=
      case $$TILDE_7E:
        return $PUNCTUATOR;
      case $$BACKSLASH_5C:
        return parseBackslash();
      case $$NBSP_A0:
        return $WHITE;
      default:
        return parseOtherUnicode(c);
    }
  }

  function parseLeadingDot() {
    if (eof()) return $PUNCTUATOR; // will lead to an error in the parser

    let c = peek();
    if (c === $$DOT_2E) {
      if (peekd(1) === $$DOT_2E) {
        ASSERT_skip($$DOT_2E);
        ASSERT_skip($$DOT_2E);
      } // the else will ultimately lead to an error in the parser
      return $PUNCTUATOR;
    }

    if (isAsciiNumber(c)) {
      ASSERT_skip(c);
      if (neof()) {
        c = skipDigits();
        parseExponentMaybe(c);
      }
      return $NUMBER_DEC;
    }

    return $PUNCTUATOR;
  }

  function parseCR() {
    if (neof() && peeky($$LF_0A)) {
      ASSERT_skip($$LF_0A);
      return $CRLF;
    }
    return $NL;
  }

  function parseSingleString(strictness) {
    ASSERT(arguments.length === 1, 'need 1 arg');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');

    return parseAnyString($$SQUOTE_27, $STRING_SINGLE, strictness);
  }
  function parseDoubleString(strictness) {
    ASSERT(arguments.length === 1, 'need 1 arg');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');

    return parseAnyString($$DQUOTE_22, $STRING_DOUBLE, strictness);
  }
  function parseAnyString(marker, tokenType, strictness) {
    ASSERT(arguments.length === 3, 'need 3 args');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');

    let bad = false;
    let c;
    while (neof()) {
      // while we will want to consume at least one more byte for proper strings,
      // there could be a malformed string and we wouldnt want to consume the newline
      c = peek();
      if (c === marker) {
        ASSERT_skip(marker);
        break;
      }

      if (isLfPsLs(c)) {
        bad = true;
        break;
      }

      if (c === $$CR_0D) {
        // this peeky is already on a slow error path so no need to "optimize" it to prevent double parsing that byte
        if (neof() && peeky($$LF_0A)) ASSERT_skip($$LF_0A); // handle crlf properly in terms of token generation
        bad = true;
        break;
      }

      ASSERT_skip(c);

      if (c === $$BACKSLASH_5C) {
        bad = parseStringEscape(strictness) === BAD_ESCAPE || bad;
      }
    }

    if (bad || c !== marker) return $ERROR; // unclosed string or illegal escape
    return tokenType;
  }
  function parseStringEscape(strictness) {
    ASSERT(arguments.length === 1, 'need 1 arg');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');

    if (eof()) return BAD_ESCAPE; // you cant escape eof ;)

    // read() because we need to consume at least one char here
    let c = peekSkip();
    // note: the parser only really cares about \u and \x. it needs no extra work for \t \n etc
    // note: it _does_ need to take care of escaped digits
    switch(c) {
      case $$U_75:
      case $$U_UC_55:
        return parseIdentOrStringEscapeUnicode();

      case $$X_78:
      case $$X_UC_58:
        return parseStringEscapeHex();

      case $$0_30:
      case $$1_31:
      case $$2_32:
      case $$3_33:
      case $$4_34:
      case $$5_35:
      case $$6_36:
      case $$7_37:
      case $$8_38:
      case $$9_39:
        // need to determine what to do with \8 and \9 in strict mode
        return parseStringEscapeOctal(c, strictness);

      case $$CR_0D:
        // edge case: `\crlf` is a valid line continuation
        if (neof() && peeky($$LF_0A)) ASSERT_skip($$LF_0A);
        break;
    }

    // we can ignore this escape. treat it as a single char escape.
    return GOOD_ESCAPE;
  }
  function parseIdentOrStringEscapeUnicode() {
    // this is _after_ `\u` have been consumed already!
    if (eof()) return BAD_ESCAPE;
    // we could read() here because we want to consume two more chars (at least)
    // however, if the escape is bad we would also consume the closing quote so we peek()
    let c = peek();
    if (c === $$CURLY_L_7B) {
      ASSERT_skip($$CURLY_L_7B);
      return parseStringEscapeUnicodeVary();
    } else {
      return parseStringEscapeUnicodeQuad(c);
    }
  }
  function parseStringEscapeUnicodeQuad(a) {
    // we've already consumed a. we must consume 3 more chars for this quad unicode escape
    if (eofd(3)) return BAD_ESCAPE;
    let b = peekd(1);
    let c = peekd(2);
    let d = peekd(3);

    // if this is a bad escape then dont consume the chars. one of them could be a closing quote
    if (isHex(a) && isHex(b) && isHex(c) && isHex(d)) {
      // okay, _now_ consume them
      ASSERT_skip(a);
      ASSERT_skip(b);
      ASSERT_skip(c);
      ASSERT_skip(d);
      return GOOD_ESCAPE;
    } else {
      return BAD_ESCAPE;
    }
  }
  function parseStringEscapeUnicodeVary() {
    // "It is a Syntax Error if the MV of HexDigits > 1114111."
    // this means the actual hex value cannot exceed 6 chars (0x10ffff). however,
    // it can have any number of leading zeroes so we still need to loop
    // must at least parse one hex digit (but it may be invalid so we can't read())
    if (eof()) return BAD_ESCAPE;
    let a = peek();
    if (!isHex(a)) return BAD_ESCAPE; // first one is mandatory
    ASSERT_skip(a);
    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return BAD_ESCAPE;
      a = skipZeroes();
      if (!isHex(a)) return a === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE; // note: we already asserted a zero. we can find a curly close now
      ASSERT_skip(a);
    }
    if (eof()) return BAD_ESCAPE;
    let b = peek();
    if (!isHex(b)) return b === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(b);
    if (eof()) return BAD_ESCAPE;
    let c = peek();
    if (!isHex(c)) return c === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(c);
    if (eof()) return BAD_ESCAPE;
    let d = peek();
    if (!isHex(d)) return d === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(d);
    if (eof()) return BAD_ESCAPE;
    let e = peek();
    if (!isHex(e)) return e === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(e);
    if (eof()) return BAD_ESCAPE;
    let f = peek();
    if (!isHex(f)) return f === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(f);
    // we've parsed 6 hexdigits now. the biggest number allowed is 0x10ffff but first we _must_ find a curly next
    if (eof()) return BAD_ESCAPE;
    if (peek() !== $$CURLY_R_7D) return BAD_ESCAPE;
    ASSERT_skip($$CURLY_R_7D);

    // the total may not exceed 0x10ffff which means that at six digits we only have to validate the first two
    if (a === $$0_30) return GOOD_ESCAPE;
    if (a === $$1_31 && b === $$0_30) return GOOD_ESCAPE;

    // the number represented by the digits MUST exceed the explicitly allowed max of 0x10ffff so reject
    return BAD_ESCAPE;
  }
  function skipZeroes() {
    ASSERT(neof(), 'should already been checked');

    let c = peek();
    while (c === $$0_30) {
      ASSERT_skip($$0_30);
      if (eof()) return 0;
      c = peek();
    }
    return c;
  }
  function parseStringEscapeHex() {
    if (eofd(1)) return BAD_ESCAPE;
    let a = peek();
    let b = peekd(1);
    // confirm they are both hex digits
    if (isHex(a) && isHex(b)) {
      // okay, _now_ consume them
      ASSERT_skip(a);
      ASSERT_skip(b);
      return GOOD_ESCAPE;
    } else {
      return BAD_ESCAPE;
    }
  }
  function parseStringEscapeOctal(a, strictness) {
    ASSERT(arguments.length === 2, 'need 2 args');
    ASSERT(typeof a === 'number', 'first digit ord');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');

    if (strictness === STRICT_MODE) {
      if (a === $$0_30) {
        if (eof()) return GOOD_ESCAPE; // will still lead to an error later for the next token
        let b = peek();
        if (b < $$0_30 || b > $$9_39) return GOOD_ESCAPE; // `\0` without digit following is ok in strict
      }
      return BAD_ESCAPE; // early error
    }
    // TODO: what to do with \8 and \9? (a=9
    if (a === $$8_38 || a === $$9_39) return BAD_ESCAPE; // i guess.

    // the cfg is a little awkward but the point is that the octal escape will
    // consume as many digits as there octal digits follow AND for as long as
    // the total will not exceed 255. in practice that means \* \** \[0123]**

    // tbh we dont really need to parse any further. it's irrelevant to the parser whether
    // 1 2 or 3 digits are consumed here as those digits can not lead to other problems
    // and we've already consumed one character at callsite

    return GOOD_ESCAPE;

    //if (eof()) return GOOD_ESCAPE;
    //let b = peek();
    //if (!isOctal(b)) return GOOD_ESCAPE;
    //ASSERT_skip(b);
    //
    //if (a >= $$0_30 && a <= $$3_33) {
    //  if (eof()) return GOOD_ESCAPE;
    //  let c = peek();
    //  if (!isOctal(c)) return GOOD_ESCAPE;
    //  ASSERT_skip(c);
    //}
  }

  function parseSameOrCompound(c) {
    // (c is an op like + - & |)
    // c cc c=

    if (neof()) {
      let d = peek();
      if (d === c) {
        ASSERT_skip(c); // @@
      } else if (d === $$IS_3D) {
        ASSERT_skip($$IS_3D); // @=
      }
    }
    return $PUNCTUATOR;
  }

  function parseTemplateString(strictness, fromTick) {
    ASSERT(arguments.length === 2, 'need 2 args');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');

    // `...`
    // `...${expr}...`
    // `...${expr}...${expr}...`

    let bad = false;
    let c;
    while (neof()) {
      // while we will want to consume at least one more byte for proper strings,
      // there could be a malformed string and we wouldnt want to consume the newline
      c = peek();

      // do ${ first, that way we can just use the peeked char in case it's a dud, without revisiting
      while (c === $$$_24) {
        ASSERT_skip($$$_24);
        if (eof()) {
          bad = true;
          return $ERROR;
        }

        c = peek();
        if (c === $$CURLY_L_7B) {
          ASSERT_skip($$CURLY_L_7B);
          return bad ? $ERROR : fromTick ? $TICK_HEAD : $TICK_BODY;
        }
      }

      if (c === $$TICK_60) {
        ASSERT_skip($$TICK_60);
        return bad ? $ERROR : fromTick ? $TICK_PURE : $TICK_TAIL;
      }

      //if (isLfPsLs(c)) {
      //  newline stuff
      //}
      //if (c === $$CR_0D) {
      //  if (neof() && peeky($$LF_0A)) ASSERT_skip($$LF_0A); // handle crlf properly in terms of token generation
      //  newline stuff
      //}

      ASSERT_skip(c);

      if (c === $$BACKSLASH_5C) {
        bad = parseStringEscape(strictness) === BAD_ESCAPE || bad;
      }
    }

    return $ERROR; // unclosed string or illegal escape
  }

  function parseLeadingZero(strictModeState) {
    // 0 0. 0.<digits> 0<digits> 0x<hex> 0b<bin> 0o<octal>

    if (eof()) return $NUMBER_DEC;

    // peek here. the next character can easily not be part of this token
    let c = peek();

    if (isAsciiNumber(c)) {
      skip();
      if (neof()) skipDigits();
      // this is an "illegal" octal escape in strict mode
      if (strictModeState === STRICT_MODE) return $ERROR;
      return $NUMBER_OLD;
    } else if (c === $$DOT_2E) {
      parseFromFractionDot();
    } else if (c === $$X_78 || c === $$X_UC_58) {
      ASSERT_skip(c);
      return parseHex();
    } else if (c === $$O_6F || c === $$O_UC_4F) {
      ASSERT_skip(c);
      return parseOctal();
    } else if (c === $$B_62 || c === $$B_UC_42) {
      ASSERT_skip(c);
      return parseBinary();
    } else if (c === $$E_65|| c === $$E_UC_45) {
      parseExponentMaybe(c);
    }

    return $NUMBER_DEC;
  }
  function parseDecimal() {
    if (neof()) {
      // optionally skip digits now. we dont care if that actually happens (we already know there was at least one)
      let c = skipDigits();
      if (eof()) return $NUMBER_DEC;

      // optional fraction
      if (c === $$DOT_2E) parseFromFractionDot();
      else parseExponentMaybe(c);
    }
    return $NUMBER_DEC;
  }
  function skipDigits() {
    let c = peek();
    while (isAsciiNumber(c)) {
      ASSERT_skip(c);
      if (eof()) return 0; // monomorphism but meh. caller should check EOF state before using return value
      c = peek();
    }
    return c;
  }
  function parseExponentMaybe(c) {
    // this part is a little tricky. if an `e` follows, an optional +- may follow but at least one digit must follow regardless
    // note that if we parse anything at all, it will be at least two bytes (hence the len-1 part)
    if (neofd(1) && c === $$E_65 || c === $$E_UC_45) {
      let d = peekd(1);
      let e = d;
      if (d === $$DASH_2D || d === $$PLUS_2B) {
        if (eofd(2)) {
          // we cant parse an exponent. the parser will deal with the inevitable error
          return;
        }
        e = peekd(2);
      }

      if (isAsciiNumber(e)) {
        // ok, we've confirmed the exponent part is legit. consume the peeks.
        ASSERT(peek() === $$E_65 || peek() === $$E_UC_45, 'should skip an e');
        skip();
        if (d === $$DASH_2D || d === $$PLUS_2B) {
          ASSERT(peek() === $$DASH_2D || peek() === $$PLUS_2B, 'should skip + or -');
          skip();
        }
        ASSERT(isAsciiNumber(e), 'should be digit');
        skip();
        if (neof()) skipDigits();
      }
    }
  }
  function parseFromFractionDot() {
    ASSERT_skip($$DOT_2E);
    // optionally skip digits now. we dont care if that actually happens. trailing dot is allowed on decimals
    if (neof()) {
      let c = skipDigits();
      parseExponentMaybe(c);
    }
  }
  function parseHex() {
    if (eof()) return $ERROR; // 0x is illegal without a digit

    // at least one digit is required
    if (!isHex(peek())) return $ERROR; // 0x is illegal without a digit

    while (neof() && isHex(peek())) skip();

    return $NUMBER_HEX;
  }
  function isHex(ord) {
    if (isAsciiNumber(ord)) return true;
    let x = ord | 32; // if ord was an upper case letter, it is now a lower case letter
    if (x >= $$A_61 && x <= $$F_66) return true;
    return false;
  }
  function parseOctal() {
    if (eof()) return $ERROR; // 0o is illegal without a digit

    // at least one digit is required
    if (!isOctal(peek())) return $ERROR; // 0o is illegal without a digit

    while (neof() && isOctal(peek())) skip();

    return $NUMBER_OCT;
  }
  function isOctal(ord) {
    return ord >= $$0_30 && ord <= $$7_37;
  }
  function parseBinary() {
    if (eof()) return $ERROR; // 0b is illegal without a digit

    // at least one digit is required
    if (!isOctal(peek())) return $ERROR; // 0b is illegal without a digit

    while (neof() && isOctal(peek())) skip();

    return $NUMBER_BIN;
  }

  function parseExcl() {
    // != !==

    if (eof()) return $ERROR; // there is no punctuator with just `!`

    if (peeky($$IS_3D)) {
      ASSERT_skip($$IS_3D); // !=
      if (neof() && peeky($$IS_3D)) {
        ASSERT_skip($$IS_3D); // !==
      }
      return $PUNCTUATOR;
    }

    return $ERROR; // there is no punctuator with just `!`
  }

  function parseStar() {
    // * *= ** **=

    if (neof()) {
      let c = peek();
      if (c === $$STAR_2A) {
        ASSERT_skip($$STAR_2A); // **
        if (neof() && peeky($$IS_3D)) {
          ASSERT_skip($$IS_3D); // **=
        }
      } else if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // *=
      }
    }
    return $PUNCTUATOR;
  }

  function parseIdentifierRest(c) {
    ASSERT(typeof c === 'number', 'should get the parsed ident start');
    ASSERT(isIdentStart(c), 'ident start should already have been confirmed');
    return _parseIdentifierRest();
  }
  function _parseIdentifierRest() {
    if (neof()) {
      let c = peek();
      while (isIdentRestChr(c)) { // super hot
        ASSERT_skip(c);
        if (eof()) break;
        c = peek();
      }
      // slow path, dont test this inside the super hot loop above
      if (c === $$BACKSLASH_5C) {
        ASSERT_skip($$BACKSLASH_5C);
        return parseIdentFromUnicodeEscape(NON_START);
      }
    }

    return $IDENT;
  }
  function parseIdentFromUnicodeEscape(fromStart) {
    if (eof()) return $ERROR;
    if (peeky($$U_75)) ASSERT_skip($$U_75);

    // Note: this is a slow path. and a super edge case.
    let start = pointer;
    if (parseIdentOrStringEscapeUnicode() === GOOD_ESCAPE) {
      let data;
      if (peekyd(start - pointer, $$CURLY_L_7B)) {
        data = slice(start + 1, pointer);
        if (eof()) return $ERROR;
        if (peeky($$CURLY_R_7D)) ASSERT_skip($$CURLY_R_7D);
        else return $ERROR;
      } else {
        data = slice(start , pointer);
      }
      ASSERT(data.length > 0, 'a valid escape should contain at least one digit');
      ASSERT(data.charCodeAt(0) !== $$CURLY_L_7B && isHex(data.charCodeAt(0)), 'if wrapped, the opener should be removed');
      ASSERT(data.charCodeAt(data.length - 1) !== $$CURLY_R_7D && isHex(data.charCodeAt(data.length - 1)), 'if wrapped, the closer should not be consumed yet');

      let ord = parseInt(data, 16);
      //ASSERT(parseInt(data, 16).toString(16) === data, 'data should only contain ascii chars...'); // this can fail if there were leading zeroes in the escaped hex...

      // the escaped char must still be a valid identifier character. then and only
      // then can we proceed to parse an identifier. otherwise we'll still parse
      // into an error token.
      if (fromStart === FIRST_CHAR && isIdentStart(ord)) {
        return _parseIdentifierRest();
      } else if (fromStart === NON_START && isIdentRestChr(ord)) {
        return _parseIdentifierRest();
      } else {
        return $ERROR;
      }
    }
    _parseIdentifierRest(); // keep on parsing the identifier but we will make it an error token
    return $ERROR;
  }

  function isIdentStart(c){
    if (isAsciiLetter(c)) return true;
    if (c === $$$_24 || c === $$LODASH_5F) return true;
    // todo: unicode escape
    return false;
  }
  function isIdentRestChr(c){
    if (isAsciiLetter(c)) return true;
    if (isAsciiNumber(c)) return true;
    if (c === $$$_24 || c === $$LODASH_5F) return true;
    return false;
  }
  function isAsciiLetter(c) {
    // make upper and lower case the same value (for the sake of the isletter check).
    // only difference between a lower and upper case ascii letter is the 6th bit (=1<<5=32)
    let d = c | 32;
    return d >= $$A_61 && d <= $$Z_7A;
  }
  function isAsciiNumber(c) {
    return c >= $$0_30 && c <= $$9_39;
  }

  function parseCompoundAssignment() {
    // % %= ^ ^=

    if (neof() && peeky($$IS_3D)) {
      ASSERT_skip($$IS_3D); // @=
    }
    return $PUNCTUATOR;
  }

  function parseFwdSlash(slashState) {
    if (eof()) {
      // I don't think there's any way this can lead to a valid parse... but let the parser deal with that.
      return $PUNCTUATOR;
    }

    let c = peek();
    if (c === $$FWDSLASH_2F) {
      // must be single comment
      ASSERT_skip($$FWDSLASH_2F); // //
      return parseSingleComment();
    } else if (c === $$STAR_2A) {
      // must be multi comment
      ASSERT_skip($$STAR_2A); // /*
      return parseMultiComment();
    } else {
      return parseSingleFwdSlash(slashState, c);
    }
  }
  function parseSingleFwdSlash(slashState, c) {
    if (slashState === REX) {
      // parse a regex. use the c
      return parseRegex(c);
    } else {
      // div
      if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // /=
      }
      return $PUNCTUATOR;
    }
  }
  function parseSingleComment() {
    while (neof()) {
      let c = peek();
      if (c === $$CR_0D || isLfPsLs(c)) {
        // TODO: should check whether we can optimize the next token parse since we already know it to be a newline. may not be very relevant in the grand scheme of things tho. (the overhead to confirm may more expensive)
        break;
      }
      skip(); // anything except those four newline chars
    }
    return $COMMENT_SINGLE;
  }
  function parseMultiComment() {
    let c;
    while (neof()) {
      c = peekSkip();
      while (c === $$STAR_2A) {
        if (eof()) return $ERROR;
        c = peekSkip();
        if (c === $$FWDSLASH_2F) return $COMMENT_MULTI;
      }
      if (c === $$CR_0D || isLfPsLs(c)) {
        // if we implement line numbers, make sure to count crlf as one here
        consumedNewline = true;
      }
    }
    return $ERROR;
  }

  function parseEqual() {
    // = == === =>
    if (neof()) {
      let c = peek();
      if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // ==
        if (neof() && peeky($$IS_3D)) {
          ASSERT_skip($$IS_3D); // ===
        }
      } else if (c === $$GT_3E) {
        ASSERT_skip($$GT_3E); // =>
      }
    }
    return $PUNCTUATOR;
  }

  function parseLtPunctuator() {
    // < << <= <<=
    if (neof()) {
      let c = peek();
      if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // >=
      } else if (c === $$LT_3C) {
        ASSERT_skip($$LT_3C); // >>
        if (neof() && peeky($$IS_3D)) {
          ASSERT_skip($$IS_3D); // >>=
        }
      }
    }
    return $PUNCTUATOR;
  }

  function parseGtPunctuator() {
    // > >> >>> >= >>= >>>=
    if (neof()) {
      let c = peek();
      if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // >=
      } else if (c === $$GT_3E) {
        ASSERT_skip($$GT_3E); // >>
        if (neof()) {
          c = peek();
          if (c === $$IS_3D) {
            ASSERT_skip($$IS_3D); // >>=
          } else if (c === $$GT_3E) {
            ASSERT_skip($$GT_3E); // >>>
            if (neof() && peeky($$IS_3D)) {
              ASSERT_skip($$IS_3D); // >>>=
            }
          }
        }
      }
    }
    return $PUNCTUATOR;
  }

  function parseNewline() {
    consumedNewline = true;
    return $NL;
  }

  function parseBackslash() {
    return parseIdentFromUnicodeEscape(FIRST_CHAR);
  }

  let nCapturingParens = 0;
  let largestBackReference = 0;
  function parseRegex(c) {
    nCapturingParens = 0;
    largestBackReference = 0;
    let ustatusBody = parseRegexBody(c);
    if (nCapturingParens < largestBackReference) ustatusBody = ALWAYS_BAD;
    let ustatusFlags = parseRegexFlags();
    if (ustatusBody === ALWAYS_BAD || ustatusFlags === ALWAYS_BAD) {
      // body had bad escape or flags occurred twice
      return $ERROR;
    }

    if (ustatusBody === GOOD_WITH_U_FLAG) {
      // body had an escape that is only valid with an u flag
      if (ustatusFlags === GOOD_WITH_U_FLAG) return $REGEXU;
      // in this case the body had syntax that's only valid with a u flag and the flag was not present
      return $ERROR;
    }

    if (ustatusBody === GOOD_SANS_U_FLAG) {
      // body had an escape or char class range that is invalid with a u flag
      if (ustatusFlags !== GOOD_WITH_U_FLAG) return $REGEX;
      // in this case the body had syntax that's invalid with a u flag and the flag was present anyways
      return $ERROR;
    }
    ASSERT(ustatusBody === ALWAYS_GOOD, 'the body had no syntax depending on a u flag so is always good');
    if (ustatusFlags === GOOD_WITH_U_FLAG) return $REGEXU;
    return $REGEX;
  }
  function parseRegexBody(c) {
    ASSERT(c !== $$STAR_2A && c !== $$FWDSLASH_2F, 'earlier checks should already have peeked for a comment token');
    return _parseRegexBody(c, 0, ALWAYS_GOOD);
  }
  function _parseRegexBody(c, groupLevel, uflagStatus) {
//console.log('_parseRegexBody', uflagStatus, groupLevel, '0x' + c.toString(16))
    //ASSERT(typeof c === 'number', 'c is an ord');
    ASSERT(typeof groupLevel === 'number' && groupLevel >= 0, 'valid group level');
    ASSERT(typeof uflagStatus === 'number' && uflagStatus >= 0, 'valid flag');
    // - there are two grammars; a simple (RegularExpressionLiteral) and a more granular grammar (Pattern). Pattern governs. The first cannot be extended/changed, the second may be.
    //   - the spec describes such an extension in (B.1.4) we may need to use that as our end goal
    // - there are two parsing modes; unicode and without unicode. the unicode is slightly more strict
    //   - reflects on surrogate pairs, long unicode escapes, and valid char class ranges

    let afterAtom = false;

    // dont start with a quantifier
    let badStart = c === $$STAR_2A || c === $$PLUS_2B || c === $$QMARK_3F || c === $$CURLY_L_7B;
    if (badStart) uflagStatus = ALWAYS_BAD;

    do {
//console.log('_parseRegexBody loop:', c, 'x' + c.toString(16), '[' + String.fromCharCode(c)+']', uflagStatus)
      //ASSERT(afterAtom = 1, 'making sure afterAtom is set everywhere (will break tests but shouldnt throw at all)');
      switch (c) {
        case $$FWDSLASH_2F:
          // end of regex body

          if (groupLevel !== 0) {
            // all groups must be closed before the floor is closed
            // dont consume the forward slash. let only the root caller do this
            return ALWAYS_BAD;
          }

          ASSERT_skip($$FWDSLASH_2F);
          return uflagStatus;

        case $$OR_7C:
          // left and/or right side of the pipe can be empty. weird but syntactically valid
          ASSERT_skip($$OR_7C);
          afterAtom = false;
          break;

        case $$XOR_5E:
          // atom; match start of a line/file
          ASSERT_skip($$XOR_5E);
          afterAtom = true;
          break;

        case $$DOT_2E:
          // atom; match one character
          ASSERT_skip($$DOT_2E);
          afterAtom = true;
          break;

        case $$$_24:
          // atom; match the end of a file/line
          ASSERT_skip($$$_24);
          afterAtom = true;
          break;

        case $$BACKSLASH_5C:
          // atom escape is different from charclass escape
          ASSERT_skip($$BACKSLASH_5C);
          afterAtom = true; // except in certain cases...

          if (eof()) {
            uflagStatus = ALWAYS_BAD;
          } else {
            let d = peek();
            // \b \B cannot have quantifiers
            if (d === $$B_62 || d === $$B_UC_42) {
              ASSERT_skip(d);
              afterAtom = false;
            } else {
              let escapeStatus = parseRegexAtomEscape(d);
              if (escapeStatus === ALWAYS_BAD) {
                uflagStatus = ALWAYS_BAD;
              } else if (escapeStatus === GOOD_SANS_U_FLAG) {
                if (uflagStatus === ALWAYS_GOOD) uflagStatus = GOOD_SANS_U_FLAG;
                else if (uflagStatus === GOOD_WITH_U_FLAG) uflagStatus = ALWAYS_BAD;
              } else if (escapeStatus === GOOD_WITH_U_FLAG) {
                if (uflagStatus === ALWAYS_GOOD) uflagStatus = GOOD_WITH_U_FLAG;
                else if (uflagStatus === GOOD_SANS_U_FLAG) uflagStatus = ALWAYS_BAD;
              }
            }
          }
          break;

        case $$PAREN_L_28:
          // parse group (?: (!: (
          ASSERT_skip($$PAREN_L_28);
          afterAtom = false; // useless. just in case

          if (eof()) {
            uflagStatus = ALWAYS_BAD;
            break;
          }
          c = peek();
          if (c === $$QMARK_3F) {
            ASSERT_skip($$QMARK_3F);
            if (eof()) {
              uflagStatus = ALWAYS_BAD;
              break;
            }
            c = peek();
            if (c === $$COLON_3A || c === $$IS_3D || c === $$EXCL_21) {
              ASSERT_skip(c);
              // non capturing group
              if (eof()) {
                uflagStatus = ALWAYS_BAD;
                break;
              }
              c = peek();
            } else {
              uflagStatus = ALWAYS_BAD;
            }
          } else {
            // capturing group
            ++nCapturingParens;
          }

          let subbad = _parseRegexBody(c, groupLevel + 1, ALWAYS_GOOD);
          afterAtom = true;
          if (subbad === ALWAYS_BAD) {
            uflagStatus = ALWAYS_BAD;
          } else if (subbad === GOOD_SANS_U_FLAG) {
            if (uflagStatus === ALWAYS_GOOD) uflagStatus = GOOD_SANS_U_FLAG;
            else if (uflagStatus === GOOD_WITH_U_FLAG) uflagStatus = ALWAYS_BAD;
          } else if (subbad === GOOD_WITH_U_FLAG) {
            if (uflagStatus === ALWAYS_GOOD) uflagStatus = GOOD_WITH_U_FLAG;
            else if (uflagStatus === GOOD_SANS_U_FLAG) uflagStatus = ALWAYS_BAD;
          }

          break;
        case $$PAREN_R_29:
          // a paren might be found in a sub-parse. the outer parse may be recursively parsing a group
          ASSERT_skip($$PAREN_R_29);
          if (groupLevel > 0) return uflagStatus;
          uflagStatus = ALWAYS_BAD;
          afterAtom = true; // meh
          break;

        case $$SQUARE_L_5B:
          // CharacterClass
          ASSERT_skip($$SQUARE_L_5B);

          let charClassEscapeStatus = parseRegexCharClass();
          if (charClassEscapeStatus === ALWAYS_BAD) {
            uflagStatus = ALWAYS_BAD;
          } else if (charClassEscapeStatus === GOOD_SANS_U_FLAG) {
            if (uflagStatus === ALWAYS_GOOD) uflagStatus = GOOD_SANS_U_FLAG;
            else if (uflagStatus === GOOD_WITH_U_FLAG) uflagStatus = ALWAYS_BAD;
          } else if (charClassEscapeStatus === GOOD_WITH_U_FLAG) {
            if (uflagStatus === ALWAYS_GOOD) uflagStatus = GOOD_WITH_U_FLAG;
            else if (uflagStatus === GOOD_SANS_U_FLAG) uflagStatus = ALWAYS_BAD;
          }
          afterAtom = true;
          break;
        case $$SQUARE_R_5D:
          // this is always bad since we have a quantifier parser that consumes valid curlies
          ASSERT_skip($$SQUARE_R_5D);
          uflagStatus = ALWAYS_BAD;
          afterAtom = true; // meh
          break;

        case $$STAR_2A:
        case $$PLUS_2B:
        case $$QMARK_3F:
          // doesnt matter to us which quantifier we find here
          ASSERT_skip(c);
          if (afterAtom) {
            afterAtom = false;
            if (neof()) {
              if (peeky($$QMARK_3F)) {
                ASSERT_skip($$QMARK_3F);
              }
            }
          } else {
            uflagStatus = ALWAYS_BAD;
          }
          break;

        case $$CURLY_L_7B:
          // explicit quantifier
          ASSERT_skip($$CURLY_L_7B);
          if (afterAtom) {
            if (!parseRegexCurlyQuantifier()) uflagStatus = ALWAYS_BAD;
            if (neof()) {
              if (peeky($$QMARK_3F)) {
                ASSERT_skip($$QMARK_3F);
              }
            }
            afterAtom = false;
          } else {
            uflagStatus = ALWAYS_BAD;
          }
          break;
        case $$CURLY_R_7D:
          // this is always bad since we have a quantifier parser that consumes valid curlies
          ASSERT_skip($$CURLY_R_7D);
          uflagStatus = ALWAYS_BAD;
          afterAtom = false;
          break;

        case $$CR_0D:
        case $$LF_0A:
        case $$PS_2028:
        case $$LS_2029:
          return ALWAYS_BAD; // same as end of input

        default:
          ASSERT_skip(c); // this ought to be a valid regex source character
          afterAtom = true;
      }
      //ASSERT(afterAtom !== 1, 'making sure afterAtom is set everywhere (will break tests but shouldnt throw at all)'); //[' + c + ', x' + c.toString(16) + ')]');

      if (eof()) break;
      c = peek();
    } while (true);

    // this is a fail because we didnt got to the end of input before the closing /
    return ALWAYS_BAD;
  }
  function parseRegexAtomEscape(c) {
    // backslash already parsed

    // -- u flag is important
    // -- u flag can affect range (surrogate pairs in es5 vs es6)
    // -- char class range _must_ be low-hi unless dash is the first or last char
    // -- \u{...} only allowed with u flag
    // -- unicode, digit, char, hex escapes


    switch (c) {
      case $$U_75:
        ASSERT_skip($$U_75);
        return parseRegexUnicodeEscape();

      case $$X_78:
        ASSERT_skip($$X_78);
        if (eof()) return ALWAYS_BAD;
        let a = peek();
        if (!isAsciiNumber(a)) return ALWAYS_BAD;
        ASSERT_skip(a);
        if (eof()) return ALWAYS_BAD;
        let b = peek();
        if (!isAsciiNumber(b)) return ALWAYS_BAD;
        ASSERT_skip(b);
        return ALWAYS_GOOD;

      // char escapes
      case $$C_63:
        ASSERT_skip($$C_63);
        if (eof()) return ALWAYS_BAD;
        let d = peek();
        if (isAsciiLetter(d)) {
          ASSERT_skip(d);
          return ALWAYS_GOOD;
        }
        return ALWAYS_BAD;

      // control escapes
      case $$F_66:
        ASSERT_skip(c);
        return ALWAYS_GOOD;

      case $$N_6E:
      case $$R_72:
      case $$T_74:
      case $$V_76:

      // char class escpes
      case $$D_64:
      case $$D_UC_44:
      case $$S_73:
      case $$S_UC_53:
      case $$W_77:
      case $$W_UC_57:
        // "an error occurs if either ClassAtom does not represent a single character (for example, if one is \w)
        ASSERT_skip(c);
        return ALWAYS_GOOD;

      // syntax chars
      case $$XOR_5E:
      case $$$_24:
      case $$BACKSLASH_5C:
      case $$DOT_2E:
      case $$STAR_2A:
      case $$PLUS_2B:
      case $$QMARK_3F:
      case $$PAREN_L_28:
      case $$PAREN_R_29:
      case $$SQUARE_L_5B:
      case $$SQUARE_R_5D:
      case $$CURLY_L_7B:
      case $$CURLY_R_7D:
      case $$OR_7C:
        ASSERT_skip(c);
        return ALWAYS_GOOD;

      // digits
      case $$0_30:
        ASSERT_skip($$0_30);
        // cannot be followed by another digit
        if (eof()) return ALWAYS_GOOD; // let error happen elsewhere
        if (isAsciiNumber(peek())) return ALWAYS_BAD;
        return ALWAYS_GOOD;
      case $$1_31:
      case $$2_32:
      case $$3_33:
      case $$4_34:
      case $$5_35:
      case $$6_36:
      case $$7_37:
      case $$8_38:
      case $$9_39:
        return parseBackReference(c);

      case $$FWDSLASH_2F:
        // explicitly allowed
        ASSERT_skip($$FWDSLASH_2F);
        return ALWAYS_GOOD;

      case $$CR_0D:
      case $$LF_0A:
      case $$PS_2028:
      case $$LS_2029:
        ASSERT_skip(c);
        return ALWAYS_BAD; // regex has no line continuation

      default:
        // this is, probably;
        //
        // IdentityEscape [U] ::
        //   [+U] SyntaxCharacter
        //   [+U] /
        //   [~U] SourceCharacter but not UnicodeIDContinue

        ASSERT_skip(c);
        // unicodeidcontinue is;
        // (idstart=) uppercase letters, lowercase letters, titlecase letters, modifier letters, other letters, letter numbers, other_id_start without white_space
        // or; [[:L:][:Ni:][:Other_ID_Start:]--[:Pattern_Syntax:]--[:Patter_White_Space:]]
        // plus: nonspacing marks, spacing combining marks, decimal number, connector punctuation, other_id_continue sans white_space and syntax
        // or; [[:ID_Start:][:Mn:][:Mc:][:Nd:][:Pc:][:Other_ID_Continue:]--[:Pattern_Syntax:]--[:Pattern_White_Space:]]
        // in ascii, unicode continue is all the ascii letters :(
        if (isIdentRestChr(c)) return ALWAYS_BAD;
        return GOOD_SANS_U_FLAG; // TODO: verify that UnicodeIDContinue thing for other characters within ascii range and add specific tests for them
    }
    ASSERT(false, 'dis be dead code');
  }
  function parseBackReference(c) {
    // https://www.ecma-international.org/ecma-262/7.0/#sec-decimalescape :
    // If \ is followed by a decimal number n whose first digit is not 0, then the escape sequence
    // is considered to be a backreference. It is an error if n is greater than the total number
    // of left capturing parentheses in the entire regular expression. \0 represents the <NUL>
    // character and cannot be followed by a decimal digit.
    // ... crap.
    // https://www.ecma-international.org/ecma-262/7.0/#sec-regular-expression-patterns-semantics
    // The production `ClassEscape::DecimalEscape but only if` evaluates as follows:
    //  Evaluate DecimalEscape to obtain an EscapeValue E.
    // ... double crap.
    // so let's make it an option not to throw when the exception happens.

    ASSERT(c >= $$1_31 && c <= $$9_39, 'should be digit 1~9');
    ASSERT_skip(c);

    let refindex = c - $$0_30;
    while (neof()) {
      c = peek();
      if (!isAsciiNumber(c)) break;
      refindex = refindex * 10 + (c - $$0_30);
      ASSERT_skip(c);
    }

    largestBackReference = refindex; // can only validate this after completing body parse
    return ALWAYS_GOOD;
  }
  function parseRegexUnicodeEscape() {
    // only if unicode flag
    // - surrogate pairs may matter
    // - class char status matters
    // - long unicode escape is allowed

    // we dont know whether u-mode is enabled until after we've parsed the flags
    // so we must parse as loose as possible and keep track of parsing specific u-flag or non-u-flag stuff
    // then after flag parsing confirm that the flag presence conforms to expectations

    if (eof()) return BAD_ESCAPE;
    let c = peek(); // dont read. we dont want to consume a bad \n here
    if (c === $$CURLY_L_7B) {
      ASSERT_skip($$CURLY_L_7B);
      let r = parseRegexUnicodeEscapeVary();
      if (r === GOOD_ESCAPE) {
        ASSERT_skip($$CURLY_R_7D);
        return GOOD_WITH_U_FLAG;
      }
      return ALWAYS_BAD;
    } else {
      return parseRegexUnicodeEscapeQuad(c);
    }
  }
  function parseRegexUnicodeEscapeQuad(a) {
    // we've already consumed a. we must consume 3 more chars for this quad unicode escape
    if (eofd(3)) return ALWAYS_BAD;
    let b = peekd(1);
    let c = peekd(2);
    let d = peekd(3);

    // if this is a bad escape then dont consume the chars. one of them could be a closing quote
    if (isHex(a) && isHex(b) && isHex(c) && isHex(d)) {
      // okay, _now_ consume them
      ASSERT_skip(a);
      ASSERT_skip(b);
      ASSERT_skip(c);
      ASSERT_skip(d);
      return ALWAYS_GOOD; // outside char classes we can ignore surrogates
    } else {
      return ALWAYS_BAD;
    }
  }
  function parseRegexUnicodeEscapeVary() {
    // "It is a Syntax Error if the MV of HexDigits > 1114111."
    // this means the actual hex value cannot exceed 6 chars (0x10ffff). however,
    // it can have any number of leading zeroes so we still need to loop

    // must at least parse one hex digit (but it may be invalid so we can't read())
    if (eof()) return BAD_ESCAPE;  // first one is mandatory
    let a = peek();
    if (!isHex(a)) return BAD_ESCAPE; // first one is mandatory
    ASSERT_skip(a);

    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return BAD_ESCAPE;
      a = skipZeroes();
      if (!isHex(a)) {
        // note: we already asserted a zero
        return a === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
      }
      ASSERT_skip(a);
    }

    if (eof()) return BAD_ESCAPE;
    let b = peek();
    if (!isHex(b)) {
      return b === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    }
    ASSERT_skip(b);

    if (eof()) return BAD_ESCAPE;
    let c = peek();
    if (!isHex(c)) {
      return c === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    }
    ASSERT_skip(c);

    if (eof()) return BAD_ESCAPE;
    let d = peek();
    if (!isHex(d)) {
      return d === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    }
    ASSERT_skip(d);

    if (eof()) return BAD_ESCAPE;
    let e = peek();
    if (!isHex(e)) {
      return e === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    }
    ASSERT_skip(e);

    if (eof()) return BAD_ESCAPE;
    let f = peek();
    if (!isHex(f)) {
      return f === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    }
    ASSERT_skip(f);

    let codePoint = hexToNum(a) << 20 | hexToNum(b) << 16 | hexToNum(c) << 12 | hexToNum(d) << 8 | hexToNum(e) << 4 | hexToNum(f);
    // the total may not exceed 0x10ffff
    if (codePoint > 0x10ffff) return BAD_ESCAPE;
    if (eof()) return BAD_ESCAPE;
    if (peek() !== $$CURLY_R_7D) return BAD_ESCAPE;
    return GOOD_ESCAPE;
  }

  function parseRegexCharClass() {
    // parse a character class
    // the problem is a combination of;
    // - ranges
    // - u-flag enabling surrogate pairs
    // - surrogate heads and tails can appear without the other without error
    // - flags only known after the body is parsed
    // this leads to situations where the same dash may mean a range with
    // the u-flag and it may mean an actual dash without the u-flag and
    // vice versa. and you wont know until you parsed the flags whether
    // which case to enforce.
    // the other problem is that surrogates cause you to need the next
    // character for u-mode before confirming ranges but not needing this
    // without u-mode.

    let prev = 0;
    let surrogate = 0; // current surrogate if prev is a head and c is a tail
    let isSurrogate = false;
    let isSurrogateHead = false;
    let wasSurrogate = true; // start at surrogate boundary
    let wasSurrogateHead = false; // there was no prev char
    let urangeOpen = false; // we have not yet seen a range dash in umode
    let urangeLeft = 0; // track codepoint of left of range
    let nrangeOpen = false; // we have not yet seen a range dash in no-umode
    let nrangeLeft = 0; // track codeunit of left of range

    let flagState = ALWAYS_GOOD;

    if (eof()) return ALWAYS_BAD;
    let c = peek();
    if (c === $$XOR_5E) {
      ASSERT_skip($$XOR_5E);
      if (eof()) return ALWAYS_BAD;
      c = peek();
    }

    let n = 0;
    while (true) {
//console.log(n, 'pointer=',pointer,': c=',c, 'x=', c.toString(16), ' [' + String.fromCharCode(c) + '], flag:',flagState)
      switch (c) {
        case $$SQUARE_R_5D:
          ASSERT_skip($$SQUARE_R_5D);

          // code point range may be open if the rhs was a surrogate head.
          // that's the only range case that needs to be checked here.
          if (urangeOpen && wasSurrogateHead && (urangeLeft === CHARCLASS_BAD_RANGE || prev === CHARCLASS_BAD_RANGE || urangeLeft > prev)) {
            if (flagState === GOOD_WITH_U_FLAG) return ALWAYS_BAD;
            if (flagState === ALWAYS_BAD) return ALWAYS_BAD;
            return GOOD_SANS_U_FLAG;
          }

          return flagState;

        case $$BACKSLASH_5C:
          ASSERT_skip($$BACKSLASH_5C);
          c = parseClassCharEscape(); // note: this may lead to c being >0xffff !!

          if (c === CHARCLASS_BAD) {
            flagState = ALWAYS_BAD;
          } else if (c & CHARCLASS_BADN) {
            c ^= CHARCLASS_BADN; // remove the badn flag
            ASSERT(c <= 0x110000, 'c should now be valid unicode range or one above for error');
            if (c === CHARCLASS_BAD) flagState = ALWAYS_BAD;
            else if (flagState === ALWAYS_GOOD) flagState = GOOD_WITH_U_FLAG;
            else if (flagState === GOOD_SANS_U_FLAG) flagState = ALWAYS_BAD;
          //} else if (c === CHARCLASS_BAD_RANGE) { // check at range time
          //  console.log('got a class escape that is only bad in range')
          }
//console.log(' - escaped; c=',c, ', flagState=',flagState)
          break;

        case $$CR_0D:
        case $$LF_0A:
        case $$PS_2028:
        case $$LS_2029:
          return ALWAYS_BAD; // same as end of input

        default:
          ASSERT_skip(c);
      }

      if (wasSurrogateHead && isSurrogateTail(c)) {
        isSurrogate = true;
        isSurrogateHead = false;
        surrogate = getSurrogate(prev, c);
      } else if (!wasSurrogate && !wasSurrogateHead && (c & 0x1fffff) > 0xffff) { // long unicode escape
        isSurrogate = true;
        isSurrogateHead = false;
        surrogate = c;
      } else {
        isSurrogate = false;
        isSurrogateHead = isSurrogateLead(c);
      }

//console.log(' - result before; c=', c, '(0x' + c.toString(16), '), is surrogate?', isSurrogate, ', was surrogate?', wasSurrogate, ', surrogate:', surrogate, ', isSurrogateHead?', isSurrogateHead, ', wasSurrogateHead?', wasSurrogateHead, ', urangeOpen:',urangeOpen,', nrangeOpen:',nrangeOpen, ', urangeLeft=', urangeLeft, ', nrangeLeft=', nrangeLeft)

      if (urangeOpen) {
//console.log(' - urange is open, check surrogate cases:', isSurrogateHead, wasSurrogateHead);
        // if c is a head we must check the next char for being a tail before we can determine the code _point_
        // otoh, if c is a tail or a non-surrogate then we can now safely do range checks since the codepoint wont change
        // if this is a head and the previous was too then the previous was the rhs on its own and we check `prev` instead
        let urangeRight = isSurrogate ? surrogate : wasSurrogateHead ? prev : c;
        if (!isSurrogateHead || wasSurrogateHead) {
//console.log(' - c is code point boundary;', urangeLeft, '>', (isSurrogate ? surrogate : wasSurrogateHead?prev:c), urangeLeft > (isSurrogate ? surrogate : wasSurrogateHead?prev:c))
          urangeOpen = false;
          if (urangeLeft === CHARCLASS_BAD_RANGE || urangeRight === CHARCLASS_BAD_RANGE || urangeLeft > urangeRight) {
            if (flagState === GOOD_WITH_U_FLAG) flagState = ALWAYS_BAD;
            else if (flagState === ALWAYS_BAD) flagState = ALWAYS_BAD;
            else flagState = GOOD_SANS_U_FLAG;
          }
        }
      } else if (c === $$DASH_2D && n > 0) {
        urangeOpen = true;
      } else {
        urangeLeft = isSurrogate ? surrogate : c;
      }

      if (nrangeOpen) {
        nrangeOpen = false;
//console.log(' - nrange is open');
        if (nrangeLeft === CHARCLASS_BAD_RANGE || c === CHARCLASS_BAD_RANGE || nrangeLeft > c) {
          if (flagState === GOOD_SANS_U_FLAG) flagState = ALWAYS_BAD;
          else if (flagState === ALWAYS_BAD) flagState = ALWAYS_BAD;
          else flagState = GOOD_WITH_U_FLAG;
        }
      } else if (c === $$DASH_2D && n > 0) {
        nrangeOpen = true;
      } else {
        nrangeLeft = c;
//console.log(n,': nrangeLeft now', nrangeLeft);
      }

//console.log(' - result before; c=', c, '(0x' + c.toString(16), '), is surrogate?', isSurrogate, ', was surrogate?', wasSurrogate, ', surrogate:', surrogate, ', isSurrogateHead?', isSurrogateHead, ', wasSurrogateHead?', wasSurrogateHead, ', urangeOpen:',urangeOpen,', nrangeOpen:',nrangeOpen, ', urangeLeft=', urangeLeft, ', nrangeLeft=', nrangeLeft)

      wasSurrogate = isSurrogate;
      wasSurrogateHead = isSurrogateHead;
      prev = c;

      ++n;
      if (eof()) return ALWAYS_BAD;
      c = peek();
    }
    return ALWAYS_BAD; // no end
  }
  function parseClassCharEscape() {
    // atom escape is slightly different from charclass escape

    // https://www.ecma-international.org/ecma-262/7.0/#sec-classescape

    if (eof()) return -1;
    let c = peek();

    switch (c) {
      case $$U_75:
        ASSERT_skip($$U_75);
        return parseRegexUnicodeEscape2();

      case $$X_78:
        ASSERT_skip($$X_78);
        if (eofd(1)) return CHARCLASS_BAD;
        let a = peek();
        if (!isHex(a)) return CHARCLASS_BAD;
        ASSERT_skip(a);
        let b = peek();
        if (!isHex(b)) return CHARCLASS_BAD;
        ASSERT_skip(b);
        return (hexToNum(a) << 4) | hexToNum(b);

      // char escapes
      case $$C_63:
        ASSERT_skip($$C_63);
        if (neof()) {
          let d = peek();
          if (isAsciiLetter(d)) {
            ASSERT_skip(d);
            return d;
          }
        }
        return CHARCLASS_BAD;

      // "A ClassAtom can use any of the escape sequences that are allowed in the rest of the regular expression except for \b, \B, and backreferences. Inside a CharacterClass, \b means the backspace character, while \B and backreferences raise errors. Using a backreference inside a ClassAtom causes an error."
      case $$B_62: // "Return the CharSet containing the single character <BS> U+0008 (BACKSPACE)."
        ASSERT_skip($$B_62);
        return 0x0008;
      case $$B_UC_42:
        return CHARCLASS_BAD_RANGE;

      // control escapes
      case $$F_66:
        ASSERT_skip($$F_66);
        return 0x000C;
      case $$N_6E:
        ASSERT_skip($$N_6E);
        return 0x000A;
      case $$R_72:
        ASSERT_skip($$R_72);
        return 0x000D;
      case $$T_74:
        ASSERT_skip($$T_74);
        return 0x0009;
      case $$V_76:
        ASSERT_skip($$V_76);
        return 0x000B;

      // char class escapes
      case $$D_64:
      case $$D_UC_44:
      case $$S_73:
      case $$S_UC_53:
      case $$W_77:
      case $$W_UC_57:
        // "an error occurs if either ClassAtom does not represent a single character (for example, if one is \w)
        // but this only applies to ranges... so we need to create a special token for this to make the distinction
        // because we dont know right now whether c is part of a range or not. in fact it may only be part of a
        // range with or without u flag but not the other. so difficult.
        ASSERT_skip(c);
        return CHARCLASS_BAD_RANGE;

      // digits
      case $$0_30:
        ASSERT_skip(c);
        // cannot be followed by another digit
        if (neof() && isAsciiNumber(peek())) return CHARCLASS_BAD;
        return 0;
      case $$1_31:
      case $$2_32:
      case $$3_33:
      case $$4_34:
      case $$5_35:
      case $$6_36:
      case $$7_37:
      case $$8_38:
      case $$9_39:
        ASSERT_skip(c);
        // always illegal in a char class
        return CHARCLASS_BAD;

      // syntax chars
      case $$XOR_5E:
      case $$$_24:
      case $$BACKSLASH_5C:
      case $$DOT_2E:
      case $$STAR_2A:
      case $$PLUS_2B:
      case $$QMARK_3F:
      case $$PAREN_L_28:
      case $$PAREN_R_29:
      case $$SQUARE_L_5B:
      case $$SQUARE_R_5D:
      case $$CURLY_L_7B:
      case $$CURLY_R_7D:
      case $$OR_7C:
        ASSERT_skip(c);
        return c;

      case $$FWDSLASH_2F:
        // explicitly allowed
        ASSERT_skip($$FWDSLASH_2F);
        return $$FWDSLASH_2F;

      case $$DASH_2D:
        ASSERT_skip($$DASH_2D);
        // only valid with u-flag!
        return $$DASH_2D | CHARCLASS_BADN;
    }

    // bad escapes
    ASSERT_skip(c);
    return CHARCLASS_BAD;
  }
  function hexToNum(c) {
    ASSERT(isHex(c), 'hexToNum c should be verified hex');
    if (c <= $$9_39) return c - $$0_30;
    if (c <= $$Z_UC_5A) return (c - $$A_UC_41) + 10;
    return (c - $$A_61) + 10;
  }
  function parseRegexFlags() {
    // there are 5 valid flags and in unicode mode each flag may only occur once
    // 12.2.8.1: "It is a Syntax Error if FlagText of RegularExpressionLiteral contains any code points other than "g", "i", "m", "u", or"y", or if it contains the same code point more than once."

    // TODO: dotall flag "s" : https://tc39.github.io/proposal-regexp-dotall-flag/

    let g = 0;
    let i = 0;
    let m = 0;
    let u = 0;
    let y = 0;
    let bad = 0;
    while (neof()) {
      let c = peek();
      switch (c) {
        case $$G_67:
          ++g;
          break;
        case $$I_69:
          ++i;
          break;
        case $$M_6D:
          ++m;
          break;
        case $$U_75:
          ++u; // \\u{...} is only supported with this flag and an early error otherwise
          break;
        case $$Y_79:
          ++y;
          break;
        case $$BACKSLASH_5C:
          break; // see below
        default:
          if (isAsciiLetter(c)) ++bad; // unknown flags are considered syntax errors by the semantics
          else return bad ? ALWAYS_BAD : (g|i|m|u|y) > 1 ? ALWAYS_BAD : u > 0 ? GOOD_WITH_U_FLAG : GOOD_SANS_U_FLAG;
      }
      ASSERT_skip(c);

      // escaped flags (rare path that we must invalidate)
      if (c === $$BACKSLASH_5C) {
        // while syntactically a unicode escaped flag could be valid, the semantics explicitly disallow it
        // just gracefully parse a unicode escape and return an error token
        // (note: this is already the "slow" path because we know it's an error)
        if (eof()) return ALWAYS_BAD;
        if (peeky($$U_75)) {
          ASSERT_skip($$U_75);
          parseRegexUnicodeEscape();
        }
        ++bad;
      }
    }
    // the error is the (slightly and very theoretical) slow path because it leads to an error anyways
    // if any flags occurred more than once, the or below will result in >1
    return bad ? ALWAYS_BAD : (g|i|m|u|y) > 1 ? ALWAYS_BAD : u > 0 ? GOOD_WITH_U_FLAG : GOOD_SANS_U_FLAG;
  }
  function parseRegexCurlyQuantifier() {
    // parsed the curly, verify the range is not {hi,lo}

    // next should be either a comma or a digit
    if (eof()) return false;
    let hasLow = false;
    let hasHi = false;
    let min = 0;
    let max = 0;
    let c;
    let start = true;
    let badNumber = false;
    do {
      c = peek();
      if (!isAsciiNumber(c)) break;
      ASSERT_skip(c);
      hasLow = true;
      if (start) {
        start = false;
        if (c === $$0_30) {
          if (eof()) return false;
          c = peek();
          if (!isAsciiNumber(c)) break;
          badNumber = true;
          ASSERT_skip(c);
        }
      }
      min = (min * 10) + (c - $$0_30);
    } while (neof());
    if (c === $$COMMA_2C) {
      ASSERT_skip($$COMMA_2C);
      start = true;
      if (eof()) return false;
      do {
        c = peek();
        if (!isAsciiNumber(c)) break;
        ASSERT_skip(c);
        hasHi = true;
        if (start) {
          start = false;
          if (c === $$0_30) {
            if (eof()) return false;
            c = peek();
            if (!isAsciiNumber(c)) break;
            badNumber = true;
            ASSERT_skip(c);
          }
        }
        max = (max * 10) + (c - $$0_30);
      } while (neof());
    }
    if (c === $$CURLY_R_7D) {
      ASSERT_skip($$CURLY_R_7D);
      //return (hasLow && (min <= max || !hasHi)) || (!hasLow && hasHi);
      return !badNumber && (hasLow !== hasHi || (hasLow && hasHi && min <= max));
    }
    return false;
  }
  function isSurrogateLead(c) {
    // "A sequence of two code units, where the first code unit c1 is in the range 0xD800 to 0xDBFF and the second code unit c2 is in the range 0xDC00 to 0xDFFF, is a surrogate pair and is interpreted as a code point with the value (c1 - 0xD800) × 0x400 + (c2 - 0xDC00) + 0x10000. (See 10.1.2)
    return c >= 0xD800 && c <= 0xDBFF;
  }
  function isSurrogateTail(c) {
    // "A sequence of two code units, where the first code unit c1 is in the range 0xD800 to 0xDBFF and the second code unit c2 is in the range 0xDC00 to 0xDFFF, is a surrogate pair and is interpreted as a code point with the value (c1 - 0xD800) × 0x400 + (c2 - 0xDC00) + 0x10000. (See 10.1.2)
    return c >= 0xDC00 && c <= 0xDFFF;
  }
  function getSurrogate(c1, c2) {
    // "A sequence of two code units, where the first code unit c1 is in the range 0xD800 to 0xDBFF and the second code unit c2 is in the range 0xDC00 to 0xDFFF, is a surrogate pair and is interpreted as a code point with the value (c1 - 0xD800) × 0x400 + (c2 - 0xDC00) + 0x10000. (See 10.1.2)
    return (c1 - 0xD800) * 0x400 + (c2 - 0xDC00) + 0x10000;
  }

  function parseRegexUnicodeEscape2() {
    // only if unicode flag
    // - surrogate pairs may matter
    // - class char status matters
    // - long unicode escape is allowed

    // we dont know whether u-mode is enabled until after we've parsed the flags
    // so we must parse as loose as possible and keep track of parsing specific u-flag or non-u-flag stuff
    // then after flag parsing confirm that the flag presence conforms to expectations

    if (eof()) return CHARCLASS_BAD;
    let c = peek(); // dont read. we dont want to consume a bad \n here
    if (c === $$CURLY_L_7B) {
      ASSERT_skip($$CURLY_L_7B);
      let r = parseRegexUnicodeEscapeVary2();
      if (r !== CHARCLASS_BAD || (neof() && peeky($$CURLY_R_7D))) ASSERT_skip($$CURLY_R_7D);
      return r;
    } else {
      return parseRegexUnicodeEscapeQuad2(c);
    }
  }
  function parseRegexUnicodeEscapeQuad2(a) {
    // we've already consumed a char in `a`. we must consume 3 more chars for this quad unicode escape
    if (eofd(3)) return CHARCLASS_BAD;
    let b = peekd(1);
    let c = peekd(2);
    let d = peekd(3);

    // if this is a bad escape then dont consume the chars. one of them could be a closing quote
    if (isHex(a) && isHex(b) && isHex(c) && isHex(d)) {
      // okay, _now_ consume them
      ASSERT_skip(a);
      ASSERT_skip(b);
      ASSERT_skip(c);
      ASSERT_skip(d);

      let r = (hexToNum(a) << 12) | (hexToNum(b) << 8) | (hexToNum(c) << 4) | hexToNum(d);
      //console.log(r, hexToNum(a).toString(16) + hexToNum(b).toString(16) + hexToNum(c).toString(16) + hexToNum(d).toString(16),'->', r.toString(16))
      return r;
    } else {
      return CHARCLASS_BAD;
    }
  }
  function parseRegexUnicodeEscapeVary2() {
    // "It is a Syntax Error if the MV of HexDigits > 1114111."
    // this means the actual hex value cannot exceed 6 chars (0x10ffff). however,
    // it can have any number of leading zeroes so we still need to loop

    // must at least parse one hex digit (but it may be invalid so we can't read())
    if (eof()) return CHARCLASS_BAD;  // first one is mandatory
    let a = peek();
    if (!isHex(a)) return CHARCLASS_BAD; // first one is mandatory
    ASSERT_skip(a);

    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return CHARCLASS_BAD;
      a = skipZeroes();
      if (!isHex(a)) {
        // note: we already asserted a zero
        return a === $$CURLY_R_7D ? 0 | CHARCLASS_BADN : CHARCLASS_BAD;
      }
      ASSERT_skip(a);
    }

    if (eof()) return CHARCLASS_BAD;
    let b = peek();
    if (!isHex(b)) {
      if (b === $$CURLY_R_7D) return hexToNum(a) | CHARCLASS_BADN;
      return CHARCLASS_BAD;
    }
    ASSERT_skip(b);

    if (eof()) return CHARCLASS_BAD;
    let c = peek();
    if (!isHex(c)) {
      if (c === $$CURLY_R_7D) return (hexToNum(a) << 4) | hexToNum(b) | CHARCLASS_BADN;
      return CHARCLASS_BAD;
    }
    ASSERT_skip(c);

    if (eof()) return CHARCLASS_BAD;
    let d = peek();
    if (!isHex(d)) {
      if (d === $$CURLY_R_7D) return (hexToNum(a) << 8) | (hexToNum(b) << 4) | hexToNum(c) | CHARCLASS_BADN;
      return CHARCLASS_BAD;
    }
    ASSERT_skip(d);

    if (eof()) return CHARCLASS_BAD;
    let e = peek();
    if (!isHex(e)) {
      if (e === $$CURLY_R_7D) return (hexToNum(a) << 12) | (hexToNum(b) << 8) | (hexToNum(c) << 4) | hexToNum(d) | CHARCLASS_BADN;
      return CHARCLASS_BAD;
    }
    ASSERT_skip(e);

    if (eof()) return CHARCLASS_BAD;
    let f = peek();
    if (!isHex(f)) {
      if (f === $$CURLY_R_7D) return (hexToNum(a) << 16) | (hexToNum(b) << 12) | (hexToNum(c) << 8) | (hexToNum(d) << 4) | hexToNum(e) | CHARCLASS_BADN;
      return CHARCLASS_BAD;
    }
    ASSERT_skip(f);

    if (eof()) return CHARCLASS_BAD;
    if (peek() !== $$CURLY_R_7D) return CHARCLASS_BAD;

    let r = (hexToNum(a) << 20) | (hexToNum(b) << 16) | (hexToNum(c) << 12) | (hexToNum(d) << 8) | (hexToNum(e) << 4) | hexToNum(f);
    return Math.min(0x110000, r) | CHARCLASS_BADN;
  }

  function parseOtherUnicode(c) {
    switch (c) {
      case $$BOM_FEFF:
        return $WHITE;
      case $$PS_2028:
        return parseNewline();
      case $$LS_2029:
        return parseNewline();

      default:
        return $ERROR;
        --pointer;
        THROW('fixme, c=0x'+ c.toString(16));
    }
  }

  function THROW(str) {
    console.log('Tokenizer error at #|# ```');
    console.log(slice(Math.max(0, pointer - 20), pointer) + '#|#' + slice(pointer, pointer + 20));
    console.log('```');
    throw new Error(str);
  }

  return nextToken;
}


  function isLfPsLs(c) {
    return (c === $$LF_0A || c === $$PS_2028 || c === $$LS_2029);
  }

function debug_toktype(type) {
  switch (type) {
    case $ASI: return 'ASI';
    case $COMMENT: return 'COMMENT';
    case $COMMENT_SINGLE: return 'COMMENT_SINGLE';
    case $COMMENT_MULTI: return 'COMMENT_MULTI';
    case $CRLF: return 'CRLF';
    case $EOF: return 'EOF';
    case $ERROR: return 'ERROR';
    case $IDENT: return 'IDENT';
    case $NL: return 'NL';
    case $NUMBER: return 'NUMBER';
    case $NUMBER_DEC: return 'NUMBER_DEC';
    case $NUMBER_HEX: return 'NUMBER_HEX';
    case $NUMBER_OCT: return 'NUMBER_OCT';
    case $NUMBER_BIN: return 'NUMBER_BIN';
    case $NUMBER_OLD: return 'NUMBER_OLD';
    case $PUNCTUATOR: return 'PUNCTUATOR';
    case $REGEX: return 'REGEX';
    case $REGEXU: return 'REGEXU';
    case $SPACE: return 'SPACE';
    case $STRING: return 'STRING';
    case $STRING_DOUBLE: return 'STRING_DOUBLE';
    case $STRING_SINGLE: return 'STRING_SINGLE';
    case $TAB: return 'TAB';
    case $TICK: return 'TICK';
    case $TICK_BODY: return 'TICK_BODY';
    case $TICK_HEAD: return 'TICK_HEAD';
    case $TICK_PURE: return 'TICK_PURE';
    case $TICK_TAIL: return 'TICK_TAIL';
    case $WHITE: return 'WHITE';
    default: return 'UNKNOWN[' + type + ']';
  }
}

//export default ZeTokenizer;
//export {
require['__./zetokenizer'] = module.exports = { default: ZeTokenizer,
  $ASI,
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
};
