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
  THROW,
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
const $TICK_HEAD = 1 << ++$flag;
const $TICK_BODY = 1 << ++$flag;
const $TICK_TAIL = 1 << ++$flag;
const $TICK_PURE = $TICK_HEAD | $TICK_TAIL
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

const FIRST_CHAR = true;
const NON_START = false;

function ZeTokenizer(input, goal) {
  ASSERT(typeof input === 'string', 'input string');
  ASSERT(typeof goal === 'boolean', 'goal boolean');

  let pointer = 0;
  let len = input.length;

  let wasWhite = false;
  let consumedNewline = false; // whitespace newline token or string token that contained newline or multiline comment
  let finished = false; // generated an $EOF?

  function peek() {
    ASSERT(pointer >= 0 && pointer < len, 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    return input.charCodeAt(pointer);
  }

  function peeky(ord) {
    ASSERT(pointer >= 0 && pointer < len, 'pointer not oob');
    ASSERT(arguments.length === 1, 'one args');

    return peek() === ord;
  }

  function peekd(delta) {
    ASSERT(pointer + delta >= 0 && pointer + delta < len, 'pointer not oob');
    ASSERT(arguments.length === 1, 'one args');

    return input.charCodeAt(pointer + delta);
  }

  function read() {
    ASSERT(pointer >= 0 && pointer < len, 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    return input.charCodeAt(pointer++); // TODO: not unicode aware... should confirm this with unicode strings. and what about unicode identifiers?
  }

  function skip() {
    ASSERT(pointer >= 0 && pointer < len, 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    ++pointer;
  }

  function skipA(chr) {
    ASSERT(pointer >= 0 && pointer < len, 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    if (input.charCodeAt(pointer++) !== chr) THROW('Expected ' + chr + ' have ' + input.charCodeAt(pointer - 1));
  }

  function ASSERT_skip(chr) { // these calls are replaced with skip() in a build step
    // note: consider this `skip()` in prod
    ASSERT(pointer >= 0 && pointer < len);
    ASSERT(arguments.length === 1);
    ASSERT(input.charCodeAt(pointer) === chr, 'skip expecting different char');
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

  function nextToken(slashState, strictModeState=SLOPPY_MODE, _returnAny) {
    ASSERT(arguments.length >= 1 && arguments.length <= 3, 'arg count 1~3');
    ASSERT(typeof slashState === 'boolean', 'slashstate bool');
    ASSERT(typeof strictModeState === 'boolean', 'strictModeState bool');
    ASSERT(!finished, 'should not next() after eof token');

    consumedNewline = false;

    let token;
    do {
      if (pointer < len) {
        let start = pointer;
        wasWhite = false;
        let consumedTokenType = next(slashState, strictModeState);
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
      str: input.slice(start, stop),
    };
  }

  function next(slashState, strictness) {
    ASSERT(arguments.length === 2);
    ASSERT(typeof slashState === 'boolean', 'slashState bool');
    ASSERT(typeof strictness === 'boolean', 'strictness bool');

    let c = read();

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
        return parseTemplateString(c);
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
    if (pointer >= len) return $PUNCTUATOR; // will lead to an error in the parser

    let c = peek();
    if (c === $$DOT_2E) {
      if (peekd(1) === $$DOT_2E) {
        skip();
        skip();
      } // the else will ultimately lead to an error in the parser
      return $PUNCTUATOR;
    }

    if (isAsciiNumber(c)) {
      ASSERT_skip(c);
      if (pointer < len) {
        c = skipDigits();
        parseExponentMaybe(c);
      }
      return $NUMBER_DEC;
    }

    return $PUNCTUATOR;
  }

  function parseCR() {
    if (pointer < len && peeky($$LF_0A)) {
      skip();
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
    while (pointer < len) {
      // while we will want to consume at least one more byte for proper strings,
      // there could be a malformed string and we wouldnt want to consume the newline
      c = peek();
      if (c === marker) {
        ASSERT_skip(marker);
        break;
      }

      if (c === $$LF_0A || c === $$PS_2028 || c === $$LS_2029) {
        bad = true;
        break;
      }

      if (c === $$CR_0D) {
        if (pointer < len && peeky($$LF_0A)) ASSERT_skip($$LF_0A); // handle crlf properly in terms of token generation
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

    if (pointer >= len) return BAD_ESCAPE; // you cant escape eof ;)

    // read() because we need to consume at least one char here
    let c = read();
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
        if (pointer < len && peeky($$LF_0A)) ASSERT_skip($$LF_0A);
        break;
    }

    // we can ignore this escape. treat it as a single char escape.
    return GOOD_ESCAPE;
  }
  function parseIdentOrStringEscapeUnicode() {
    // this is _after_ `\u` have been consumed already!
    if (pointer >= len) return BAD_ESCAPE;
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
    if (pointer >= len-3) return BAD_ESCAPE;
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
    if (pointer >= len) return BAD_ESCAPE;
    let a = peek();
    if (!isHex(a)) return BAD_ESCAPE; // first one is mandatory
    ASSERT_skip(a);

    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (pointer >= len) return BAD_ESCAPE;
      a = skipZeroes();
      if (!isHex(a)) return a === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE; // note: we already asserted a zero. we can find a curly close now
      ASSERT_skip(a);
    }

    if (pointer >= len) return BAD_ESCAPE;
    let b = peek();
    if (!isHex(b)) return b === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(b);

    if (pointer >= len) return BAD_ESCAPE;
    let c = peek();
    if (!isHex(c)) return c === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(c);

    if (pointer >= len) return BAD_ESCAPE;
    let d = peek();
    if (!isHex(d)) return d === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(d);

    if (pointer >= len) return BAD_ESCAPE;
    let e = peek();
    if (!isHex(e)) return e === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(e);

    if (pointer >= len) return BAD_ESCAPE;
    let f = peek();
    if (!isHex(f)) return f === $$CURLY_R_7D ? GOOD_ESCAPE : BAD_ESCAPE;
    ASSERT_skip(f);

    // we've parsed 6 hexdigits now. the biggest number allowed is 0x10ffff but first we _must_ find a curly next
    if (pointer >= len) return BAD_ESCAPE;
    if (peek() !== $$CURLY_R_7D) return BAD_ESCAPE;
    ASSERT_skip($$CURLY_R_7D);

    // the total may not exceed 0x10ffff which means that at six digits we only have to validate the first two
    if (a === $$0_30) return GOOD_ESCAPE;
    if (a === $$1_31 && b === $$0_30) return GOOD_ESCAPE;

    // the number represented by the digits MUST exceed the explicitly allowed max of 0x10ffff so reject
    return BAD_ESCAPE;
  }
  function skipZeroes() {
    ASSERT(pointer < len, 'should already been checked');

    let c = peek();
    while (c === $$0_30) {
      ASSERT_skip($$0_30);
      if (pointer >= len) return 0;
      c = peek();
    }
    return c;
  }
  function parseStringEscapeHex() {
    if (pointer >= len-1) return BAD_ESCAPE;
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
        if (pointer >= len) return GOOD_ESCAPE; // will still lead to an error later for the next token
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

    //if (pointer >= len) return GOOD_ESCAPE;
    //let b = peek();
    //if (!isOctal(b)) return GOOD_ESCAPE;
    //ASSERT_skip(b);
    //
    //if (a >= $$0_30 && a <= $$3_33) {
    //  if (pointer >= len) return GOOD_ESCAPE;
    //  let c = peek();
    //  if (!isOctal(c)) return GOOD_ESCAPE;
    //  ASSERT_skip(c);
    //}
  }

  function parseSameOrCompound(c) {
    // (c is an op like + - & |)
    // c cc c=

    if (pointer < len) {
      let d = peek();
      if (d === c) {
        ASSERT_skip(c); // @@
      } else if (d === $$IS_3D) {
        ASSERT_skip($$IS_3D); // @=
      }
    }
    return $PUNCTUATOR;
  }

  function parseTemplateString() {
    THROW('fixme');
  }

  function parseLeadingZero(strictModeState) {
    // 0 0. 0.<digits> 0<digits> 0x<hex> 0b<bin> 0o<octal>

    if (pointer >= len) return $NUMBER_DEC;

    // peek here. the next character can easily not be part of this token
    let c = peek();

    if (isAsciiNumber(c)) {
      skip();
      if (pointer < len) skipDigits();
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
    if (pointer < len) {
      // optionally skip digits now. we dont care if that actually happens (we already know there was at least one)
      let c = skipDigits();
      if (pointer >= len) return $NUMBER_DEC;

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
      if (pointer >= len) return 0; // monomorphism but meh. caller should check EOF state before using return value
      c = peek();
    }
    return c;
  }
  function parseExponentMaybe(c) {
    // this part is a little tricky. if an `e` follows, an optional +- may follow but at least one digit must follow regardless
    // note that if we parse anything at all, it will be at least two bytes (hence the len-1 part)
    if (pointer < len - 1 && c === $$E_65 || c === $$E_UC_45) {
      let d = peekd(1);
      let e = d;
      if (d === $$DASH_2D || d === $$PLUS_2B) {
        if (pointer >= len - 2) {
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
        if (pointer < len) skipDigits();
      }
    }
  }
  function parseFromFractionDot() {
    ASSERT_skip($$DOT_2E);
    // optionally skip digits now. we dont care if that actually happens. trailing dot is allowed on decimals
    if (pointer < len) {
      let c = skipDigits();
      parseExponentMaybe(c);
    }
  }
  function parseHex() {
    if (pointer >= len) return $ERROR; // 0x is illegal without a digit

    // at least one digit is required
    if (!isHex(peek())) return $ERROR; // 0x is illegal without a digit

    while (pointer < len && isHex(peek())) skip();

    return $NUMBER_HEX;
  }
  function isHex(ord) {
    if (isAsciiNumber(ord)) return true;
    let x = ord | 32; // if ord was an upper case letter, it is now a lower case letter
    if (x >= $$A_61 && x <= $$F_66) return true;
    return false;
  }
  function parseOctal() {
    if (pointer >= len) return $ERROR; // 0o is illegal without a digit

    // at least one digit is required
    if (!isOctal(peek())) return $ERROR; // 0o is illegal without a digit

    while (pointer < len && isOctal(peek())) skip();

    return $NUMBER_OCT;
  }
  function isOctal(ord) {
    return ord >= $$0_30 && ord <= $$7_37;
  }
  function parseBinary() {
    if (pointer >= len) return $ERROR; // 0b is illegal without a digit

    // at least one digit is required
    if (!isOctal(peek())) return $ERROR; // 0b is illegal without a digit

    while (pointer < len && isOctal(peek())) skip();

    return $NUMBER_BIN;
  }

  function parseExcl() {
    // != !==

    if (pointer >= len) return $ERROR; // there is no punctuator with just `!`

    if (peeky($$IS_3D)) {
      ASSERT_skip($$IS_3D); // !=
      if (pointer < len && peeky($$IS_3D)) {
        ASSERT_skip($$IS_3D); // !==
      }
      return $PUNCTUATOR;
    }

    return $ERROR; // there is no punctuator with just `!`
  }

  function parseStar() {
    // * *= ** **=

    if (pointer < len) {
      let c = peek();
      if (c === $$STAR_2A) {
        ASSERT_skip($$STAR_2A); // **
        if (pointer < len && peeky($$IS_3D)) {
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
    if (pointer < len) {
      let c = peek();
      while (isIdentRestChr(c)) { // super hot
        ASSERT_skip(c);
        if (pointer >= len) break;
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
    if (pointer >= len) return $ERROR;
    if (peeky($$U_75)) ASSERT_skip($$U_75);

    // Note: this is a slow path. and a super edge case.
    let start = pointer;
    if (parseIdentOrStringEscapeUnicode() === GOOD_ESCAPE) {
      let data;
      if (input.charCodeAt(start) === $$CURLY_L_7B) {
        data = input.slice(start + 1, pointer);
        if (pointer > len) return $ERROR;
        if (peeky($$CURLY_R_7D)) ASSERT_skip($$CURLY_R_7D);
        else return $ERROR;
      } else {
        data = input.slice(start , pointer);
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

    if (pointer < len && peeky($$IS_3D)) {
      ASSERT_skip($$IS_3D); // @=
    }
    return $PUNCTUATOR;
  }

  function parseFwdSlash(slashState) {
    if (pointer >= len) {
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
    while (pointer < len) {
      let c = peek();
      if (c === $$LF_0A || c === $$CR_0D || c === $$PS_2028 || c === $$LS_2029) {
        // TODO: should check whether we can optimize the next token parse since we already know it to be a newline. may not be very relevant in the grand scheme of things tho. (the overhead to confirm may more expensive)
        break;
      }
      skip(); // anything except those four newline chars
    }
    return $COMMENT_SINGLE;
  }
  function parseMultiComment() {
    let len1 = len-1; // we need to be able to still parse two chars; */
    let c;
    do {
      if (pointer >= len1) {
        return $ERROR;
      }

      c = read();
      if (c === $$LF_0A || c === $$CR_0D || c === $$PS_2028 || c === $$LS_2029) {
        // if we implement line numbers, make sure to count crlf as one here
        consumedNewline = true;
      }
    } while (c !== $$STAR_2A || !peeky($$FWDSLASH_2F));
    ASSERT_skip($$FWDSLASH_2F); // */
    return $COMMENT_MULTI;
  }

  function parseEqual() {
    // = == === =>
    if (pointer < len) {
      let c = peek();
      if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // ==
        if (pointer < len && peeky($$IS_3D)) {
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
    if (pointer < len) {
      let c = peek();
      if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // >=
      } else if (c === $$LT_3C) {
        ASSERT_skip($$LT_3C); // >>
        if (pointer < len && peeky($$IS_3D)) {
          ASSERT_skip($$IS_3D); // >>=
        }
      }
    }
    return $PUNCTUATOR;
  }

  function parseGtPunctuator() {
    // > >> >>> >= >>= >>>=
    if (pointer < len) {
      let c = peek();
      if (c === $$IS_3D) {
        ASSERT_skip($$IS_3D); // >=
      } else if (c === $$GT_3E) {
        ASSERT_skip($$GT_3E); // >>
        if (pointer < len) {
          c = peek();
          if (c === $$IS_3D) {
            ASSERT_skip($$IS_3D); // >>=
          } else if (c === $$GT_3E) {
            ASSERT_skip($$GT_3E); // >>>
            if (pointer < len && peeky($$IS_3D)) {
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

  function parseOtherUnicode(c) {
    switch (c) {
      case $$BOM_FEFF:
        return $WHITE;
      case $$PS_2028:
        return parseNewline();
      case $$LS_2029:
        return parseNewline();

      default:
        THROW('fixme');
    }
  }

  return nextToken;
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
    case $SPACE: return 'SPACE';
    case $STRING: return 'STRING';
    case $STRING_DOUBLE: return 'STRING_DOUBLE';
    case $STRING_SINGLE: return 'STRING_SINGLE';
    case $TAB: return 'TAB';
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
module.exports = { ZeTokenizer,
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
