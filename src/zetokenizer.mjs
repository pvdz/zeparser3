import {
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

  $$NULL_00,
  $$BACKSPACE_08,
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
} from './utils.mjs';

// First 5 bits are not flags (!), they are "leaf" token types (decimal number, template tail).
// Other bits are flags, used to augment for super groups (string, number, template)
// (If the number of leafs exceeds 5 bits then it'll be 6 bits which reduces the number of avaliable flags)
let __$leaf = 0;
let __$group = 4;

// Groups get their own bit. This makes it easier to quickly check for a set of token types (string, string | number)
// Additionally, modifiers get their own bit. Like bigint suffix or bad escapes. Generally these should apply to more
// than one token, otherwise it can just go below as their own leaf type.

const $G_WHITE = (1 << ++__$group);
const $G_NEWLINE = (1 << ++__$group);
const $G_COMMENT = (1 << ++__$group);
const $G_IDENT = (1 << ++__$group);
const $G_NUMBER = (1 << ++__$group);
const $G_NUMBER_BIG_INT = (1 << ++__$group); // modifies certain number types, they end with `n`; https://tc39.es/proposal-bigint/#sec-grammar-change
const $G_PUNCTUATOR = (1 << ++__$group);
const $G_STRING = (1 << ++__$group);
const $G_REGEX = (1 << ++__$group);
const $G_TICK = (1 << ++__$group);
const $G_TICK_BAD_ESCAPE = (1 << ++__$group);
ASSERT(__$group < 32, 'cannot use more than 32 flags but have ' + __$group);

// Token types that are mutually exclusive can be encoded as as a unique id within a few bits of sequential space
// You can still have group bits to complement these but it's far more space efficient this way
// I don't think you should ever need the $L constants outside of defining the concrete token type constants below...
const $L_SPACE = ++__$leaf;
const $L_TAB = ++__$leaf;
const $L_NL_SINGLE = ++__$leaf;
const $L_NL_CRLF = ++__$leaf;
const $L_COMMENT_SINGLE = ++__$leaf;
const $L_COMMENT_MULTI = ++__$leaf;
const $L_COMMENT_HTML = ++__$leaf;
const $L_IDENT = ++__$leaf;
const $L_NUMBER_HEX = ++__$leaf;
const $L_NUMBER_DEC = ++__$leaf;
const $L_NUMBER_BIN = ++__$leaf;
const $L_NUMBER_OCT = ++__$leaf;
const $L_NUMBER_OLD = ++__$leaf;
const $L_PUNCTUATOR = ++__$leaf;
const $L_REGEXN = ++__$leaf;
const $L_REGEXU = ++__$leaf;
const $L_STRING_SINGLE = ++__$leaf;
const $L_STRING_DOUBLE = ++__$leaf;
const $L_TICK_HEAD = ++__$leaf;
const $L_TICK_BODY = ++__$leaf;
const $L_TICK_TAIL = ++__$leaf;
const $L_TICK_PURE = ++__$leaf;
const $L_EOF = ++__$leaf;
const $L_ASI = ++__$leaf;
const $L_ERROR = ++__$leaf;
ASSERT(__$leaf < 32, 'cannot use more than 32 leafs but have ' + __$leaf);

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
const $COMMENT_SINGLE = $L_COMMENT_SINGLE | $G_COMMENT;
const $COMMENT_MULTI = $L_COMMENT_MULTI | $G_COMMENT;
const $COMMENT_HTML = $L_COMMENT_HTML | $G_COMMENT;
const $IDENT = $L_IDENT | $G_IDENT;
const $NUMBER_HEX = $L_NUMBER_HEX | $G_NUMBER;
const $NUMBER_DEC = $L_NUMBER_DEC | $G_NUMBER;
const $NUMBER_BIN = $L_NUMBER_BIN | $G_NUMBER;
const $NUMBER_OCT = $L_NUMBER_OCT | $G_NUMBER;
const $NUMBER_OLD = $L_NUMBER_OLD | $G_NUMBER;
const $NUMBER_BIG_HEX = $L_NUMBER_HEX | $G_NUMBER | $G_NUMBER_BIG_INT;
const $NUMBER_BIG_DEC = $L_NUMBER_DEC | $G_NUMBER | $G_NUMBER_BIG_INT;
const $NUMBER_BIG_BIN = $L_NUMBER_BIN | $G_NUMBER | $G_NUMBER_BIG_INT;
const $NUMBER_BIG_OCT = $L_NUMBER_OCT | $G_NUMBER | $G_NUMBER_BIG_INT;
const $PUNCTUATOR = $L_PUNCTUATOR | $G_PUNCTUATOR;
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
const $EOF = $L_EOF;
const $ASI = $L_ASI;
const $ERROR = $L_ERROR;

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
  return type === $IDENT;
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
  return type === $PUNCTUATOR;
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

// At runtime, any value of token.type / curtype should be in this set
const ALL_TOKEN_GROUPS = [
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
];
const ALL_TOKEN_TYPES = [
  $SPACE,
  $TAB,
  $NL_SOLO,
  $NL_CRLF,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $COMMENT_HTML,
  $IDENT,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $NUMBER_BIG_HEX,
  $NUMBER_BIG_DEC,
  $NUMBER_BIG_BIN,
  $NUMBER_BIG_OCT,
  $PUNCTUATOR,
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
];

let __$lf_flag = 0;
const LF_NO_FLAGS = 0;
const LF_CAN_NEW_DOT_TARGET = 1 << ++__$lf_flag; // current scope is inside at least one regular (non-arrow) function
const LF_FOR_REGEX = 1 << ++__$lf_flag;
const LF_IN_ASYNC = 1 << ++__$lf_flag;
const LF_IN_CONSTRUCTOR = 1 << ++__$lf_flag; // inside a class constructor (not a regular function) that is not static
const LF_IN_FOR_LHS = 1 << ++__$lf_flag; // inside the initial part of a for-header, prevents `in` being parsed as an operator, hint for checks when destructuring pattern as lhs
const LF_IN_FUNC_ARGS = 1 << ++__$lf_flag; // throws for await expression
const LF_IN_GENERATOR = 1 << ++__$lf_flag;
const LF_IN_GLOBAL = 1 << ++__$lf_flag; // unset whenever you go into any kind of function (for return)
const LF_IN_ITERATION = 1 << ++__$lf_flag; // inside a loop (tells you whether break/continue is valid)
const LF_IN_SWITCH = 1 << ++__$lf_flag; // inside a switch (tells you whether break is valid)
const LF_IN_TEMPLATE = 1 << ++__$lf_flag;
const LF_NO_ASI = 1 << ++__$lf_flag; // can you asi if you must? used for async. LF_IN_TEMPLATE also implies this flag!
const LF_STRICT_MODE = 1 << ++__$lf_flag;
const LF_SUPER_CALL = 1 << ++__$lf_flag; // can call `super()`
const LF_SUPER_PROP = 1 << ++__$lf_flag; // can read `super.foo` (there are cases where you can doo this but not `super()`)
ASSERT(__$lf_flag < 32, 'cannot use more than 32 flags');
// start of the first statement without knowing strict mode status:
// - div means regular expression
// - closing curly means closing curly (not template body/tail)
// - sloppy mode until proven otherwise
const INITIAL_LEXER_FLAGS = LF_FOR_REGEX | LF_IN_GLOBAL; // not sure about global, that may change depending on options{$?

const DNF = -1; // did not find

// https://tc39.es/ecma262/#table-nonbinary-unicode-properties
// (manually copied from spec)
const TABLE54 = ',General_Category,gc,Script,sc,Script_Extensions,scx,';
const TABLE55 = ',ASCII,ASCII_Hex_Digit,AHex,Alphabetic,Alpha,Any,Assigned,Bidi_Control,Bidi_C,Bidi_Mirrored,Bidi_M,Case_Ignorable,CI,Cased,Changes_When_Casefolded,CWCF,Changes_When_Casemapped,CWCM,Changes_When_Lowercased,CWL,Changes_When_NFKC_Casefolded,CWKCF,Changes_When_Titlecased,CWT,Changes_When_Uppercased,CWU,Dash,Default_Ignorable_Code_Point,DI,Deprecated,Dep,Diacritic,Dia,Emoji,Emoji_Component,Emoji_Modifier,Emoji_Modifier_Base,Emoji_Presentation,Extended_Pictographic,Extender,Ext,Grapheme_Base,Gr_Base,Grapheme_Extend,Gr_Ext,Hex_Digit,Hex,IDS_Binary_Operator,IDSB,IDS_Trinary_Operator,IDST,ID_Continue,IDC,ID_Start,IDS,Ideographic,Ideo,Join_Control,Join_C,Logical_Order_Exception,LOE,Lowercase,Lower,Math,Noncharacter_Code_Point,NChar,Pattern_Syntax,Pat_Syn,Pattern_White_Space,Pat_WS,Quotation_Mark,QMark,Radical,Regional_Indicator,RI,Sentence_Terminal,STerm,Soft_Dotted,SD,Terminal_Punctuation,Term,Unified_Ideograph,UIdeo,Uppercase,Upper,Variation_Selector,VS,White_Space,space,XID_Continue,XIDC,XID_Start,XIDS,';
const TABLE56 = ',Cased_Letter,LC,Close_Punctuation,Pe,Connector_Punctuation,Pc,Control,Cc,cntrl,Currency_Symbol,Sc,Dash_Punctuation,Pd,Decimal_Number,Nd,digit,Enclosing_Mark,Me,Final_Punctuation,Pf,Format,Cf,Initial_Punctuation,Pi,Letter,L,Letter_Number,Nl,Line_Separator,Zl,Lowercase_Letter,Ll,Mark,M,Combining_Mark,Math_Symbol,Sm,Modifier_Letter,Lm,Modifier_Symbol,Sk,Nonspacing_Mark,Mn,Number,N,Open_Punctuation,Ps,Other,C,Other_Letter,Lo,Other_Number,No,Other_Punctuation,Po,Other_Symbol,So,Paragraph_Separator,Zp,Private_Use,Co,Punctuation,P,punct,Separator,Z,Space_Separator,Zs,Spacing_Mark,Mc,Surrogate,Cs,Symbol,S,Titlecase_Letter,Lt,Unassigned,Cn,Uppercase_Letter,Lu,';
// Note: Added Elym instead of a duplicate Elymaic to table 57 because I think that's a typo in the spec
const TABLE57 = ',Adlam,Adlm,Ahom,Anatolian_Hieroglyphs,Hluw,Arabic,Arab,Armenian,Armn,Avestan,Avst,Balinese,Bali,Bamum,Bamu,Bassa_Vah,Bass,Batak,Batk,Bengali,Beng,Bhaiksuki,Bhks,Bopomofo,Bopo,Brahmi,Brah,Braille,Brai,Buginese,Bugi,Buhid,Buhd,Canadian_Aboriginal,Cans,Carian,Cari,Caucasian_Albanian,Aghb,Chakma,Cakm,Cham,Cherokee,Cher,Common,Zyyy,Coptic,Copt,Qaac,Cuneiform,Xsux,Cypriot,Cprt,Cyrillic,Cyrl,Deseret,Dsrt,Devanagari,Deva,Dogra,Dogr,Duployan,Dupl,Egyptian_Hieroglyphs,Egyp,Elbasan,Elba,Elymaic,Elym,Ethiopic,Ethi,Georgian,Geor,Glagolitic,Glag,Gothic,Goth,Grantha,Gran,Greek,Grek,Gujarati,Gujr,Gunjala_Gondi,Gong,Gurmukhi,Guru,Han,Hani,Hangul,Hang,Hanifi_Rohingya,Rohg,Hanunoo,Hano,Hatran,Hatr,Hebrew,Hebr,Hiragana,Hira,Imperial_Aramaic,Armi,Inherited,Zinh,Qaai,Inscriptional_Pahlavi,Phli,Inscriptional_Parthian,Prti,Javanese,Java,Kaithi,Kthi,Kannada,Knda,Katakana,Kana,Kayah_Li,Kali,Kharoshthi,Khar,Khmer,Khmr,Khojki,Khoj,Khudawadi,Sind,Lao,Laoo,Latin,Latn,Lepcha,Lepc,Limbu,Limb,Linear_A,Lina,Linear_B,Linb,Lisu,Lycian,Lyci,Lydian,Lydi,Mahajani,Mahj,Makasar,Maka,Malayalam,Mlym,Mandaic,Mand,Manichaean,Mani,Marchen,Marc,Medefaidrin,Medf,Masaram_Gondi,Gonm,Meetei_Mayek,Mtei,Mende_Kikakui,Mend,Meroitic_Cursive,Merc,Meroitic_Hieroglyphs,Mero,Miao,Plrd,Modi,Mongolian,Mong,Mro,Mroo,Multani,Mult,Myanmar,Mymr,Nabataean,Nbat,Nandinagari,Nand,New_Tai_Lue,Talu,Newa,Nko,Nkoo,Nushu,Nshu,Nyiakeng_Puachue_Hmong,Hmnp,Ogham,Ogam,Ol_Chiki,Olck,Old_Hungarian,Hung,Old_Italic,Ital,Old_North_Arabian,Narb,Old_Permic,Perm,Old_Persian,Xpeo,Old_Sogdian,Sogo,Old_South_Arabian,Sarb,Old_Turkic,Orkh,Oriya,Orya,Osage,Osge,Osmanya,Osma,Pahawh_Hmong,Hmng,Palmyrene,Palm,Pau_Cin_Hau,Pauc,Phags_Pa,Phag,Phoenician,Phnx,Psalter_Pahlavi,Phlp,Rejang,Rjng,Runic,Runr,Samaritan,Samr,Saurashtra,Saur,Sharada,Shrd,Shavian,Shaw,Siddham,Sidd,SignWriting,Sgnw,Sinhala,Sinh,Sogdian,Sogd,Sora_Sompeng,Sora,Soyombo,Soyo,Sundanese,Sund,Syloti_Nagri,Sylo,Syriac,Syrc,Tagalog,Tglg,Tagbanwa,Tagb,Tai_Le,Tale,Tai_Tham,Lana,Tai_Viet,Tavt,Takri,Takr,Tamil,Taml,Tangut,Tang,Telugu,Telu,Thaana,Thaa,Thai,Tibetan,Tibt,Tifinagh,Tfng,Tirhuta,Tirh,Ugaritic,Ugar,Vai,Vaii,Wancho,Wcho,Warang_Citi,Wara,Yi,Yiii,Zanabazar_Square,Zanb,';

function L(flags) {
  let bak = flags;
  let s = [];
  if (!flags) {
    s.push('LF_NO_FLAGS');
  }
  if (flags & LF_STRICT_MODE) {
    flags ^= LF_STRICT_MODE;
    s.push('LF_STRICT_MODE');
  }
  if (flags & LF_FOR_REGEX) {
    flags ^= LF_FOR_REGEX;
    s.push('LF_FOR_REGEX');
  }
  if (flags & LF_IN_TEMPLATE) {
    flags ^= LF_IN_TEMPLATE;
    s.push('LF_IN_TEMPLATE');
  }
  if (flags & LF_IN_ASYNC) {
    flags ^= LF_IN_ASYNC;
    s.push('LF_IN_ASYNC');
  }
  if (flags & LF_IN_GENERATOR) {
    flags ^= LF_IN_GENERATOR;
    s.push('LF_IN_GENERATOR');
  }
  if (flags & LF_IN_CONSTRUCTOR) {
    flags ^= LF_IN_CONSTRUCTOR;
    s.push('LF_IN_CONSTRUCTOR');
  }
  if (flags & LF_IN_FUNC_ARGS) {
    flags ^= LF_IN_FUNC_ARGS;
    s.push('LF_IN_FUNC_ARGS');
  }
  if (flags & LF_IN_GLOBAL) {
    flags ^= LF_IN_GLOBAL;
    s.push('LF_IN_GLOBAL');
  }
  if (flags & LF_IN_ITERATION) {
    flags ^= LF_IN_ITERATION;
    s.push('LF_IN_ITERATION');
  }
  if (flags & LF_IN_SWITCH) {
    flags ^= LF_IN_SWITCH;
    s.push('LF_IN_SWITCH');
  }
  if (flags & LF_CAN_NEW_DOT_TARGET) {
    flags ^= LF_CAN_NEW_DOT_TARGET;
    s.push('LF_CAN_NEW_DOT_TARGET');
  }
  if (flags & LF_IN_FOR_LHS) {
    flags ^= LF_IN_FOR_LHS;
    s.push('LF_IN_FOR_LHS');
  }
  if (flags & LF_NO_ASI) {
    flags ^= LF_NO_ASI;
    s.push('LF_NO_ASI');
  }
  if (flags & LF_SUPER_CALL) {
    flags ^= LF_SUPER_CALL;
    s.push('LF_SUPER_CALL');
  }
  if (flags & LF_SUPER_PROP) {
    flags ^= LF_SUPER_PROP;
    s.push('LF_SUPER_PROP');
  }
  if (flags) {
    throw new Error('UNKNOWN_FLAGS: ' + flags.toString(2) + ' (was: ' + bak.toString(2) + '), so far: [' + s.join('|') + ']');
  }
  return 'L:' + s.join('|');
}

const BAD_ESCAPE = true;
const GOOD_ESCAPE = false;

const GOAL_MODULE = true;
const GOAL_SCRIPT = false;

const REGEX_ALWAYS_GOOD = 0;
const REGEX_GOOD_WITH_U_FLAG = 1;
const REGEX_GOOD_SANS_U_FLAG = 2;
const REGEX_ALWAYS_BAD = 4;

const FIRST_CHAR = true;
const NON_START = false;

const REGEX_CHARCLASS_BAD = 0x110000; // Note: max valid unicode value is <0x110000 so we can use high flags as side channels!
const REGEX_CHARCLASS_ESCAPED_UC_B = 0x110001;
const REGEX_CHARCLASS_ESCAPED_C = 0x110002;
const REGEX_CHARCLASS_BAD_SANS_U_FLAG = 1<<23;
const REGEX_CHARCLASS_BAD_WITH_U_FLAG = 1<<24;
const REGEX_CHARCLASS_CLASS_ESCAPE = 1<<25; // \d \w \s etc, for webcompat checks in ranges
const REGEX_CHARCLASS_DOUBLE_QUAD = 1<<26; // The returned code point was a double quad (matters for ranges and u-flag disambiguation)

const COLLECT_TOKENS_NONE = 0;
const COLLECT_TOKENS_SOLID = 1; // non-whitespace
const COLLECT_TOKENS_ALL = 2;

const WEB_COMPAT_OFF = false;
const WEB_COMPAT_ON = true;

const RETURN_ANY_TOKENS = 1;
const RETURN_COMMENT_TOKENS = 2;
const RETURN_SOLID_TOKENS = 3;

const WHITESPACE_TOKEN = true;
const SOLID_TOKEN = false;

const PARSING_FROM_TICK = true;
const PARSING_SANS_TICK = false;

const FAIL_GRACEFULLY = true;
const FAIL_HARD = false;

const FOR_TEMPLATE = true; // templates are never not allowed to have octal escapes except when tagged
const NOT_TEMPLATE = false;

const CODEPOINT_FROM_ESCAPE = -1;

// These error codes must be negative as not to be ambiguous with decoded escape values
const INVALID_IDENT_CHAR = -1;
const VALID_SINGLE_CHAR = -2;
const VALID_DOUBLE_CHAR = -3;

// TODO: instantiate these lazily; most inputs won't need them so we can skip on the startup overhead and init in a slow path
const ID_START_REGEX = (function(){
  try {
    return new RegExp('^\\p{ID_Start}$','u');
  } catch(e) {
    console.warn('ZeParser: Unable to create regexes with unicode property escapes; unicode support disabled (' + e.message + ')');
    return /|/;
  }
})();
const ID_CONTINUE_REGEX = (function(){
  try {
    return new RegExp('^\\p{ID_Continue}$','u');
  } catch(e) {
    console.warn('ZeParser: Unable to create regexes with unicode property escapes; unicode support disabled (' + e.message + ')');
    return /|/;
  }
})();

let disableCanonPoison = [false]; // reversed stack; always check disableCanonPoison[0] for the current state
function ASSERT_pushCanonPoison(disabled) {
  disableCanonPoison.unshift(disabled);
  console.log('pushed', disabled, disableCanonPoison)
}
function ASSERT_popCanonPoison() {
  disableCanonPoison.shift();
  console.log('popped', disableCanonPoison)
}
ASSERT(!void (typeof window !== 'undefined' && ASSERT_pushCanonPoison(window.disableCanonPoison)), '(suppress this warning in web env and known cases)');

function ZeTokenizer(
  input,
  targetEsVersion = 6,
  moduleGoal = GOAL_MODULE,
  collectTokens = COLLECT_TOKENS_NONE,
  webCompat = WEB_COMPAT_ON,
  gracefulErrors = FAIL_HARD,
  tokenStorage = [],
  // You can override the logging functions
  $log = console.log,
  $warn = console.warn,
  $error = console.error
) {
  ASSERT(typeof input === 'string', 'input string should be string; ' + typeof input);
  ASSERT(targetEsVersion !== undefined, 'undefined should become default', targetEsVersion);
  ASSERT(typeof targetEsVersion === 'number', 'targetEsVersion should be a number', typeof targetEsVersion);
  ASSERT((targetEsVersion >= 6 && targetEsVersion <= 11) || targetEsVersion === Infinity, 'only support v6~11 right now [' + targetEsVersion + ','+(typeof targetEsVersion)+']');

  const supportRegexPropertyEscapes = targetEsVersion >= 9 || targetEsVersion === Infinity;
  const supportRegexLookbehinds = targetEsVersion >= 9 || targetEsVersion === Infinity;
  const supportRegexDotallFlag = targetEsVersion >= 9 || targetEsVersion === Infinity;
  const supportRegexNamedGroups = targetEsVersion >= 9 || targetEsVersion === Infinity;
  const supportBigInt = targetEsVersion === 11 || targetEsVersion === Infinity;

  let pointer = 0;
  let len = input.length;

  let wasWhite = false;
  let wasComment = false; // for Babel, I guess...
  let consumedNewlinesThisToken = 0; // whitespace newline token or string token that contained newline or multiline comment
  let consumedCommentSincePrevSolid = false; // needed to confirm requirement to parse --> closing html comment
  let finished = false; // generated an $EOF?
  let lastParsedIdent = ''; // updated after parsing an ident. used to canonicalize escaped identifiers (a\u{65}b -> aab). this var will NOT contain escapes
  let lastCanonizedString = ''; // updated while parsing a string token. escapes will be unescaped. Used for .value in AST.
  let lastRegexUnicodeEscapeOrd = 0; // need this to validate unicode escapes in named group identifiers :/
  let lastPotentialRegexError = ''; // If regex scanner is an error then this is the message. Many errors require flag validation at the end.
  let lastReportableTokenizerError = ''; // Set whenever an $error is or will be returned

  let currentLine = 1; // the number of newlines, crlf sensitive (the pair is considered 1 line)
  let currentColOffset = 0; // position in the input code of the first character after the last newline

  let prevTokenEndColumn = 0;
  let prevTokenEndLine = 0;
  let prevTokenSolid = true;

  let stale = false; // do NOT read from `cache` when `stale` is true. This is a dev-only assertion based safeguard...
  let cache = input.charCodeAt(0);

  let tokens = null;
  let anyTokenCount = 0;
  let solidTokenCount = 0;
  if (collectTokens !== COLLECT_TOKENS_NONE) {
    tokens = tokenStorage;
  }

  function peek() {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'peek is not expecting args');
    ASSERT(cache === input.charCodeAt(pointer), 'cache should be up to date');

    return _readCache();
  }
  function ASSERT_peekUncached() {
    // You can use this even if stale=true
    return input.charCodeAt(pointer);
  }
  function _readCache() {
    // _ALL_ reads for `cache` must go through this function. This way we can assert that it is not read when stale.
    ASSERT(stale === false, 'do NOT read from cache while it is stale ... (meaning the pointer got changed without updating the cache)');
    return cache;
  }
  function peekd(delta) {
    ASSERT(delta, 'jump should be at least something otehrwise use peek()');
    ASSERT(pointer + delta >= 0 && pointer + delta < len, 'pointer not oob');
    ASSERT(arguments.length === 1, 'one args');

    return input.charCodeAt(pointer + delta);
  }
  function peeky(ord) {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(arguments.length === 1, 'one args');

    return peek() === ord;
  }

  function slice(from, to) {
    ASSERT(typeof from === 'number' && from >= 0 && from <= len, 'from shoud be valid index');
    ASSERT(typeof to === 'number' && to >= 0 && to <= len, 'to shoud be valid index');
    ASSERT(arguments.length === 2, 'two args');

    return input.slice(from, to);
  }

  function peekSkip() {
    //ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');
    ASSERT(neof(), 'lexer input pointer not oob');

    let t = _readCache();
    cache = skipPeek();
    return t;
  }
  function ASSERT_skipPeek(c) {
    ASSERT(ASSERT_skipPeek.length === arguments.length, 'arg count');
    ASSERT(stale ? ASSERT_peekUncached() === c : peek() === c, 'expecting to skip a particular char', c, stale ? ASSERT_peekUncached() : peek());
    return skipPeek();
  }
  function skipPeek() {
    ASSERT(!arguments.length, 'no args');
    // ASSERT(neofd(1), 'new lexer input pointer not oob');

    return cache = input.charCodeAt(++pointer); // TODO: not unicode aware... should confirm this with unicode strings. and what about unicode identifiers?
  }

  function skip() {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');

    cache = input.charCodeAt(++pointer);
    ASSERT(!(stale = false), '(marking cache fresh so in devmode it wont throw when read)');
  }
  function skipFastWithoutUpdatingCache() {
    // Use ASSERT_peekUncached() for peeking in dev assertions
    ASSERT(stale = true, '(marking the cache unsafe, any reads should throw in dev mode while stale)');
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

  // <SCRUB ASSERTS>
  function ASSERT_skip(chr) { // these calls are replaced with skip() in a build step
    // note: consider this `skip()` in prod
    ASSERT(neof(), 'should not be oob before the skip');
    ASSERT(arguments.length === 1, 'require explicit char');
    ASSERT(peeky(chr), 'skip expecting different char', chr, peek());

    skip();
  }
  // </SCRUB ASSERTS>

  let startForError = 0;
  function nextTokenWithLexer(lexer, lexerFlags = INITIAL_LEXER_FLAGS, _returnAny=RETURN_SOLID_TOKENS) {
    ASSERT(arguments.length >= 1 && arguments.length <= 3, 'arg count 1~2');
    ASSERT(!finished, 'should not next() after eof token');
    ASSERT(typeof lexer === 'function', 'The lexer should be passed on and is something like lexerForSlowFallback or something more specific');

    // https://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
    let token;



    // TODO: in many cases the next token is known. In certain cases it is known whether whitespace must follow,
    // like after the class keyword or after a number token. How do we optimize the hottest loop for these cases.




    if (prevTokenSolid) {
      // Do this at the start because otherwise something like `a \n b` would reset this when forward parsing `b` and
      // would cause `a` to be set to the wrong column data.
      prevTokenEndColumn = pointer - currentColOffset;
      prevTokenEndLine = currentLine;
      prevTokenSolid = false;
    }

    lastPotentialRegexError = ''; // reset at start of a new token
    lastReportableTokenizerError = ''; // reset at start of a new token
    lastCanonizedString = ''; // also used by templates

    // These vars are relevant for between anything that gets location data in the AST
    do {
      ++anyTokenCount;
      let startCol = pointer - currentColOffset;
      let startRow = currentLine;
      if (neof()) {
        let cstart = _readCache();
        let start = startForError = pointer; // TODO: see if startForError makes a dent at all
        wasWhite = false;
        wasComment = false;
        let nlwas = consumedNewlinesThisToken; // Do not include the newlines for the token itself unless whitespace (ex: `` throw `\n` ``)
        let consumedTokenType = lexer(lexerFlags);
        ASSERT(consumedTokenType !== DNF, 'the DNF should not be returned');
        ASSERT((consumedTokenType>>>0) > 0, 'enum does not have zero', consumedTokenType);
        token = createToken(consumedTokenType, start, pointer, startCol, startRow, nlwas, wasWhite, cstart);
        if (collectTokens === COLLECT_TOKENS_ALL) tokens.push(token);
      } else {
        token = createToken($EOF, pointer, pointer, startCol, startRow, consumedNewlinesThisToken, WHITESPACE_TOKEN, 0);
        finished = true;
        wasWhite = false;
        break;
      }

      if (wasWhite) {
        if (_returnAny === RETURN_ANY_TOKENS) {
          break;
        }
        if (wasComment) {
          if (_returnAny === RETURN_COMMENT_TOKENS) {
            break;
          }
        }
      }
      else {
        // Any solid should be returned so break
        break;
      }

    } while (true);
    ++solidTokenCount;
    if (!wasWhite) {
      if (collectTokens === COLLECT_TOKENS_SOLID) tokens.push(token);
      consumedNewlinesThisToken = 0;
      consumedCommentSincePrevSolid = false;
      prevTokenSolid = true;
    }

    return token;
  }

  function lexerWithFallback(lexer, lexerFlags) {
    let type = lexer(lexerFlags);
    // There are certain whitespace cases that could be validly caught here so don't
    if (type === DNF) {
      type = lexerForSlowFallback(lexerFlags);
    }
    ASSERT(type !== DNF, 'the generic lexer should not return DNFs');
    return type;
  }
  function lexerForSlowFallback(lexerFlags) {
    ASSERT(lexerForSlowFallback.length === arguments.length, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags bit flags', lexerFlags);

    // This creates one token of any kind that is valid in JS. It's often the fallback for specific parsers is optimized
    // to expect a specific kind of token next. This parser will parse a token as long as it could be valid for JS.

    let c = peekSkip();

    if (isAsciiLetter(c)) return parseIdentifierRest(String.fromCharCode(c));

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
        return parseNewlineSolo();
      case $$COMMA_2C:
        return $PUNCTUATOR;
      case $$TAB_09:
        wasWhite = true;
        return $TAB;
      case $$DQUOTE_22:
        return parseDoubleString(lexerFlags);
      case $$PLUS_2B:
        return parseSameOrCompound(c); // + ++ +=
      case $$TICK_60:
        return parseTemplateString(lexerFlags, PARSING_FROM_TICK);
      case $$0_30:
        return parseLeadingZero(lexerFlags);
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
        return parseFwdSlash(lexerFlags); // / /= //.. /*..*/
      case $$EXCL_21:
        return parseExcl(); // != !==
      case $$AND_26:
        return parseSameOrCompound(c); // & && &=
      case $$DASH_2D:
        // https://tc39.github.io/ecma262/#sec-html-like-comments
        // The syntax and semantics of 11.4 is extended as follows except that this extension is not allowed when parsing source code using the goal symbol Module:
        // TODO: and properly parse this, not like the duplicate hack it is now
        if (moduleGoal === GOAL_SCRIPT && webCompat === WEB_COMPAT_ON && !eofd(1) && peeky($$DASH_2D) && peekd(1) === $$GT_3E) {
          if (consumedNewlinesThisToken > 0 || consumedCommentSincePrevSolid) {
            return parseCommentHtmlClose();
          } else {
            // Note that the `-->` is not picked up as a comment since that requires a newline to precede it.
            // TODO: do we report this anywhere? This isn't an error but most likely end up being one
          }
        }
        return parseSameOrCompound(c); // - -- -=
      case $$SQUOTE_27:
        return parseSingleString(lexerFlags);
      case $$STAR_2A:
        return parseStar(); // * *= ** **=
      case $$$_24:
        return parseIdentifierRest('$');
      case $$PERCENT_25:
        return parseCompoundAssignment(); // % %=
      case $$FF_0C:
        wasWhite = true;
        return $SPACE;
      case $$VTAB_0B:
        wasWhite = true;
        return $SPACE;
      case $$SEMI_3B:
        return $PUNCTUATOR;
      case $$IS_3D:
        return parseEqual(); // = == === =>
      case $$CURLY_L_7B:
        return $PUNCTUATOR;
      case $$CURLY_R_7D:
        if ((lexerFlags & LF_IN_TEMPLATE) === LF_IN_TEMPLATE) return parseTemplateString(lexerFlags, PARSING_SANS_TICK);
        return $PUNCTUATOR;
      case $$SQUARE_L_5B:
        return $PUNCTUATOR;
      case $$SQUARE_R_5D:
        return $PUNCTUATOR;
      case $$COLON_3A:
        return $PUNCTUATOR;
      case $$LODASH_5F:
        return parseIdentifierRest('_');
      case $$OR_7C:
        return parseSameOrCompound(c); // | || |=
      case $$QMARK_3F:
        return $PUNCTUATOR;
      case $$LT_3C:
        if (moduleGoal === GOAL_SCRIPT && webCompat === WEB_COMPAT_ON && !eofd(3) && peek() === $$EXCL_21 && peekd(1) === $$DASH_2D && peekd(2) === $$DASH_2D) {
          return parseCommentHtmlOpen();
        }
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
        wasWhite = true;
        return $SPACE;
      default:
        return parseOtherUnicode(c);
    }
  }

  function nextTokenGeneric(lexerFlags, returnAny) {
    return nextTokenWithLexer(lexerForSlowFallback, lexerFlags, returnAny);
  }

  function _lexerWhitespaceCommon(c, lexerFlags) {
    switch (c) {
      case $$SPACE_20: // note: many spaces are caught by immediate newline checks (see parseCR and parseVerifiedNewline)
        skip();
        wasWhite = true;
        return $SPACE;
      case $$CR_0D:
        skip();
        return parseCR(); // cr crlf
      case $$LF_0A:
        skip();
        return parseNewlineSolo();
      case $$TAB_09:
        skip();
        wasWhite = true;
        return $TAB;
      case $$FWDSLASH_2F:
        // Most likely a comment, but perhaps a regex
        skip();
        return parseFwdSlash(lexerFlags); // / /= //.. /*..*/
    }

    return DNF;
  }

  function nextTokenToParenOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToParenOpen, lexerFlags, returnAny);
  }
  function _nextTokenToParenOpen(lexerFlags) {
    return lexerWithFallback(_lexerForParenOpen, lexerFlags);
  }
  function _lexerForParenOpen(lexerFlags) {
    ASSERT(arguments.length === 1);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags bit flags', lexerFlags);

    let c = peek();

    if (c === $$PAREN_L_28) {
      skip();
      return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToCurlyOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToCurlyOpen, lexerFlags, returnAny);
  }
  function _nextTokenToCurlyOpen(lexerFlags) {
    return lexerWithFallback(_lexerForCurlyOpen, lexerFlags);
  }
  function _lexerForCurlyOpen(lexerFlags) {
    ASSERT(_lexerForCurlyOpen.length === arguments.length);

    // This function will consume whitespace, line terminators, comments, and curlies
    // Otherwise it signals not having found anything (after which the generic `next()` lexer will take over)
    // and in that case the parser will probably emit an error.


    // Start with the most likely; space, tab, newline, curly. Then check the more exotic spaces. Then bail.
    // TODO: considering to not cover the more exotic whitespace cases here and let the fallback deal with them
    // Note: in the specific case of a curly, I expect a regular space is to be by far the most likely whitespace ...

    let c = peek();

    if (c === $$CURLY_L_7B) {
      skip();
      return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToParenOpenCurlyOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToParenOpenCurlyOpen, lexerFlags, returnAny);
  }
  function _nextTokenToParenOpenCurlyOpen(lexerFlags) {
    return lexerWithFallback(_lexerForParenOpenCurlyOpen, lexerFlags);
  }
  function _lexerForParenOpenCurlyOpen(lexerFlags) {
    ASSERT(_lexerForParenOpenCurlyOpen.length === arguments.length);

    let c = peek();

    if (c === $$PAREN_L_28 || c === $$CURLY_L_7B) {
      skip();
      return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToFrom(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToFrom, lexerFlags, returnAny);
  }
  function _nextTokenToFrom(lexerFlags) {
    return lexerWithFallback(_lexerForFrom, lexerFlags);
  }
  function _lexerForFrom(lexerFlags) {
    let c = peek();

    if (c === $$F_66) {
      skip();
      return parseIdentifierRest('f');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToString(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToString, lexerFlags, returnAny);
  }
  function _nextTokenToString(lexerFlags) {
    return lexerWithFallback(_lexerForString, lexerFlags);
  }
  function _lexerForString(lexerFlags) {
    let c = peek();

    if (c === $$SQUOTE_27) {
      skip();
      return parseSingleString(lexerFlags);
    }
    if (c === $$DQUOTE_22) {
      skip();
      return parseDoubleString(lexerFlags);
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdent(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdent, lexerFlags, returnAny);
  }
  function _nextTokenToIdent(lexerFlags) {
    return lexerWithFallback(_lexerForIdent, lexerFlags);
  }
  function _lexerForIdent(lexerFlags) {
    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }
    if (c === $$$_24) {
      skip();
      return parseIdentifierRest('$');
    }
    if (c === $$LODASH_5F) {
      skip();
      return parseIdentifierRest('_');
    }

    let w = _lexerWhitespaceCommon(c, lexerFlags);
    if (w !== DNF) return w;

    // Since this function is called when the next token must be ident, we should now first do the expensive unicode
    // check before returning to the fallback, since that is very very likely to be a syntax error anyways.

    let cu = input.codePointAt(pointer);
    let wide = isIdentStart(cu, pointer);
    if (wide !== INVALID_IDENT_CHAR) {
      skip();
      if (wide === VALID_DOUBLE_CHAR) skip();
      return parseIdentifierRest(String.fromCodePoint(cu));
    }

    return DNF;
  }
  function nextTokenToArrow(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToArrow, lexerFlags, returnAny);
  }
  function _nextTokenToArrow(lexerFlags) {
    return lexerWithFallback(_lexerForArrow, lexerFlags);
  }
  function _lexerForArrow(lexerFlags) {
    let c = peek();

    if (c === $$IS_3D) {
      skip();
      return parseEqual(); // = == === =>
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToAs(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToAs, lexerFlags, returnAny);
  }
  function _nextTokenToAs(lexerFlags) {
    return lexerWithFallback(_lexerForAs, lexerFlags);
  }
  function _lexerForAs(lexerFlags) {
    let c = peek();

    if (c === $$A_61) {
      skip();
      return parseIdentifierRest('a');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToAsCommaCurlyClose(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToAsCommaCurlyClose, lexerFlags, returnAny);
  }
  function _nextTokenToAsCommaCurlyClose(lexerFlags) {
    return lexerWithFallback(_lexerForAsCommaCurlyClose, lexerFlags);
  }
  function _lexerForAsCommaCurlyClose(lexerFlags) {
    let c = peek();

    switch (c) {
      case $$A_61:
        // Only `as` would be valid here (we can always improve this but let's leave it generic for now)
        skip();
        return parseIdentifierRest('a');

      case $$CURLY_R_7D:
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called for import/export)');
        // fall-through
      case $$COMMA_2C:
        skip();
        return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToAsCommaFrom(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToAsCommaFrom, lexerFlags, returnAny);
  }
  function _nextTokenToAsCommaFrom(lexerFlags) {
    return lexerWithFallback(_lexerForAsCommaFrom, lexerFlags);
  }
  function _lexerForAsCommaFrom(lexerFlags) {
    let c = peek();

    switch (c) {
      case $$A_61: // `as`
        skip();
        return parseIdentifierRest('a');
      case $$F_66: // `from`
        skip();
        return parseIdentifierRest('f');
      case $$COMMA_2C:
        skip();
        return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToColon(lexerFlags, returnAny) {
    // - `:`  (for `default`)
    return nextTokenWithLexer(_nextTokenToColon, lexerFlags, returnAny);
  }
  function _nextTokenToColon(lexerFlags) {
    return lexerWithFallback(_lexerForColon, lexerFlags);
  }
  function _lexerForColon(lexerFlags) {
    let c = peek();

    if (c === $$COLON_3A) {
      skip();
      return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToTarget(lexerFlags, returnAny) {
    // - `target`  (for `new.target`)
    return nextTokenWithLexer(_nextTokenToTarget, lexerFlags, returnAny);
  }
  function _nextTokenToTarget(lexerFlags) {
    return lexerWithFallback(_lexerForTarget, lexerFlags);
  }
  function _lexerForTarget(lexerFlags) {
    let c = peek();

    if (c === $$T_74) {
      skip();
      return parseIdentifierRest('t');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToStatementStart(lexerFlags, returnAny) {
    // When the next token must be the start of a new statement, or the end of some sort of block (`}`)
    return nextTokenWithLexer(_nextTokenToStatementStart, lexerFlags, returnAny);
  }
  function _nextTokenToStatementStart(lexerFlags) {
    return lexerWithFallback(_lexerForStatementStart, lexerFlags);
  }
  function _lexerForStatementStart(lexerFlags) {

    // This is more of an optimization since we can't "quickly" verify whether or not we parsed a valid token, nor
    // do we care since that will be picked up by the next attempt to consume a body part, if that were the case.
    // Note that this assumes a forward slash is a regex (this is not necessarily the case for an asi-continuation!)

    // Things that we optimize for;
    // - almost any expression start (and some things just overlap, like objlit vs block)
      // - identifier (more than likely as many statements start with a keyword)
      // - `(` (some scripts may have many of these for iife's)
      // - string (esp directives)
      // - number (meh)
      // - `[` (meh)
      // - `{` (block)
      // - `+` (meh, most likely a `++`?)
      // - `-` (meh, most likely a `--`?)
      // - `~` (meh)
      // - `~` (meh)
      // - `\` (meh, idents)
      // - `/` (likely due to comments, perhaps regex)
    // - `}` (will happen a few times in most scripts)
    // - `;` (meh)
    // - ?

    // First check for expr. This also takes care of any statement keywords and block statement. Whitespace stuff too.
    let exprstuff = _lexerForExpressionStart(lexerFlags);
    if (exprstuff !== DNF) return exprstuff;

    // Now there are a few things commonly left for statements that won't appear as expr starts:

    let c = peek();

    // If not space or tab then I deem ident the mots likely. Above comments

    if (c === $$CURLY_R_7D || c === $$SEMI_3B) {
      ASSERT(c === $$SEMI_3B || (lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called for statement start)');
      skip();
      return $PUNCTUATOR;
    }

    return DNF;
  }
  function nextTokenToExpressionStart(lexerFlags, returnAny) {
    // When the next token must be the start of a new expression
    return nextTokenWithLexer(_nextTokenToExpressionStart, lexerFlags, returnAny);
  }
  function _nextTokenToExpressionStart(lexerFlags) {
    return lexerWithFallback(_lexerForExpressionStart, lexerFlags);
  }
  function _lexerForExpressionStart(lexerFlags) {
    let c = peek();

    // This is more of an optimization since we can't "quickly" verify whether or not we parsed a valid token, nor
    // do we care since that will be picked up by the next attempt to consume the token, if that were the case.

    // Things that we optimize for;
    // - identifier (more than likely)
    // - string (more than likely)
    // - number (more than likely)
    // - `!` (likely)
    // - `[` (likely)
    // - `{` (likely)
    // - space (maybe)
    // - tab (maybe, for multi-line expressions, the next line would be indented)
    // - cr / lf (multi-line expressions, like call args)
    // - `(` (maybe, for disambiguation purposes)
    // - `/` (comment (more likely for multi-line) or regular expression)
    // - `+` (maybe, most likely a `++`?)
    // - `-` (maybe, most likely a `--`? but used as a negative var also happens (`-x`))
    // - `~` (meh)
    // - `\` (meh, it's possible)
    // - `...` (spread)
    // - ?

    // If not space or tab then I deem ident the mots likely. Above comments
    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
      case $$SQUOTE_27:
        skip();
        return parseSingleString(lexerFlags);
      case $$DQUOTE_22:
        skip();
        return parseDoubleString(lexerFlags);
      case $$EXCL_21:
      case $$SQUARE_L_5B:
      case $$CURLY_L_7B:
        skip();
        return $PUNCTUATOR;
      case $$DOT_2E: // . ... .25
        skip();
        return parseLeadingDot();
    }

    return _lexerWhitespaceCommon(c, lexerFlags | LF_FOR_REGEX);
  }
  function nextTokenToExpressionStartGrouped(lexerFlags, returnAny) {
    // When the next token must be the start of a new expression or end of a group (`)`)
    return nextTokenWithLexer(_nextTokenToExpressionStartGrouped, lexerFlags, returnAny);
  }
  function _nextTokenToExpressionStartGrouped(lexerFlags) {
    return lexerWithFallback(_lexerForExpressionStartGrouped, lexerFlags);
  }
  function _lexerForExpressionStartGrouped(lexerFlags) {
    // Same as nextTokenToExpressionStart except it also checks `)`

    let exprstuff = _lexerForExpressionStart(lexerFlags);
    if (exprstuff !== DNF) return exprstuff;
    if (peeky($$PAREN_R_29)) {
      skip();
      return $PUNCTUATOR;
    }
    return DNF;
  }
  function nextTokenToExpressionStartSemi(lexerFlags, returnAny) {
    // When the next token must be the start of a new expression or the semi in a `for` header
    return nextTokenWithLexer(_nextTokenToExpressionStartSemi, lexerFlags, returnAny);
  }
  function _nextTokenToExpressionStartSemi(lexerFlags) {
    return lexerWithFallback(_lexerForExpressionStartSemi, lexerFlags);
  }
  function _lexerForExpressionStartSemi(lexerFlags) {
    // Same as nextTokenToExpressionStart except it also checks `;`

    let exprstuff = _lexerForExpressionStart(lexerFlags);
    if (exprstuff !== DNF) return exprstuff;
    if (peeky($$SEMI_3B)) {
      skip();
      return $PUNCTUATOR;
    }
    return DNF;
  }
  function nextTokenToExpressionStartSquareCloseComma(lexerFlags, returnAny) {
    // When the next token must be the start of a new expression or `]` or a `,` in an array literal
    return nextTokenWithLexer(_nextTokenToExpressionStartSquareCloseComma, lexerFlags, returnAny);
  }
  function _nextTokenToExpressionStartSquareCloseComma(lexerFlags) {
    return lexerWithFallback(_lexerForExpressionStartSquareCloseComma, lexerFlags);
  }
  function _lexerForExpressionStartSquareCloseComma(lexerFlags) {
    // Same as nextTokenToExpressionStart except it also checks `]` and `,`

    let exprstuff = _lexerForExpressionStart(lexerFlags);
    if (exprstuff !== DNF) return exprstuff;
    let c = peek();
    if (c === $$SQUARE_R_5D || c === $$COMMA_2C) {
      skip();
      return $PUNCTUATOR;
    }
    return DNF;
  }
  function nextTokenToObjectMemberStart(lexerFlags, returnAny) {
    // First token of an object member (property or method).
    // - `{foo: bar}`
    //     ^^^
    // - `{foo(){}}`
    //     ^^^
    // - `{get foo(){}}`
    //     ^^^
    return nextTokenWithLexer(_nextTokenToObjectMemberStart, lexerFlags, returnAny);
  }
  function _nextTokenToObjectMemberStart(lexerFlags) {
    return lexerWithFallback(_lexerForObjectMemberStart, lexerFlags);
  }
  function _lexerForObjectMemberStart(lexerFlags) {
    let c = peek();

    // Anything that is valid as the start of an object member (so after the `{` or comma in an objlit)
    // Will have to investigate what the proper order is in terms of odds. Hard to say.
    // - ident
    // - string
    // - number
    // - `}` (empty obj)
    // - `[` (computed method)
    // - `*` (generator method)
    // - ?

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$STAR_2A:
        skip();
        return parseStar(); // * *= ** **=

      case $$CURLY_R_7D:
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called for objkey start, must close object before closing the quasi)');
        // fall-through
      case $$SQUARE_L_5B:
        skip();
        return $PUNCTUATOR;

      case $$IS_3D:
        skip();
        return parseEqual(); // = == === =>
      case $$SQUOTE_27:
        skip();
        return parseSingleString(lexerFlags);
      case $$DQUOTE_22:
        skip();
        return parseDoubleString(lexerFlags);
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
      case $$0_30:
        skip();
        return parseLeadingZero(lexerFlags);
    }

    if (isAsciiNumber(c)) {
      // non-zero start
      skip();
      return parseDecimal();
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToObjectMemberRest(lexerFlags, returnAny) {
    // The next token after the first token of an object member (property or method).
    // - `{foo: bar}`
    //        ^
    // - `{foo(){}}`
    //        ^
    // - `{get foo(){}}`
    //         ^^^
    // - `{get "ok"(){}}`
    //         ^^^^
    return nextTokenWithLexer(_nextTokenToObjectMemberRest, lexerFlags, returnAny);
  }
  function _nextTokenToObjectMemberRest(lexerFlags) {
    return lexerWithFallback(_lexerForObjectMemberRest, lexerFlags);
  }
  function _lexerForObjectMemberRest(lexerFlags) {
    let c = peek();

    // Anything that is valid after parsing the first token of a member of an object literal
    // Will have to investigate what the proper order is in terms of odds. Hard to say.
    // I think whitespace is actually less likely, except if this was a modifier. Newlines are very unlikely, regardless
    // - `:` (property)
    // - `(` (method)
    // - ident, string, number (like when the first token is a modifier)
    // - `,` (shorthand)
    // - `}` (shorthand)
    // - `=` (shorthand init)
    // - `[` (computed method name with modifier)
    // - `*` (static/async generator method)
    // - ?

    // TODO: this has an interesting additional property where if there is whitespace it is much more likely to be ident

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$CURLY_R_7D:
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called for objkey rest, must close object before closing the quasi)');
        // fall-through
      case $$COMMA_2C:
        skip();
        return $PUNCTUATOR;

      case $$STAR_2A:
        skip();
        return parseStar(); // * *= ** **=
      case $$SQUARE_L_5B:
        skip();
        return $PUNCTUATOR;
      case $$IS_3D:
        skip();
        return parseEqual(); // = == === =>
      case $$SQUOTE_27:
        skip();
        return parseSingleString(lexerFlags);
      case $$DQUOTE_22:
        skip();
        return parseDoubleString(lexerFlags);
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToClassMemberStart(lexerFlags, returnAny) {
    // The first token of a class method
    // - `class x {foo(){}}`
    //             ^
    // - `class x {get foo(){}}`
    //             ^^^
    // - `class x {get "ok"(){}}`
    //             ^^^
    return nextTokenWithLexer(_nextTokenToClassMemberStart, lexerFlags, returnAny);
  }
  function _nextTokenToClassMemberStart(lexerFlags) {
    return lexerWithFallback(_lexerForClassMemberStart, lexerFlags);
  }
  function _lexerForClassMemberStart(lexerFlags) {
    let c = peek();

    // Anything that is valid as the start of a class member (so after the `{` or semi-colon in a class)
    // Will have to investigate what the proper order is in terms of odds. Hard to say.
    // - ident
    // - string
    // - number
    // - `}` (empty class body)
    // - `[` (computed method)
    // - `*` (generator method)
    // - `;` (can have multiple succeeding semi-colons)
    // - ?

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$STAR_2A:
        skip();
        return parseStar(); // * *= ** **=

      case $$CURLY_R_7D:
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called for class member start, must close object before closing the quasi)');
        // fall-through
      case $$SQUARE_L_5B:
      case $$SEMI_3B:
        skip();
        return $PUNCTUATOR;
      case $$IS_3D:
        skip();
        return parseEqual(); // = == === =>
      case $$SQUOTE_27:
        skip();
        return parseSingleString(lexerFlags);
      case $$DQUOTE_22:
        skip();
        return parseDoubleString(lexerFlags);
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
      case $$0_30:
        skip();
        return parseLeadingZero(lexerFlags);
    }

    if (isAsciiNumber(c)) {
      // non-zero start
      skip();
      return parseDecimal();
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToClassMemberRest(lexerFlags, returnAny) {
    // The next token after the first token of an object member (property or method).
    // - `{foo: bar}`
    //        ^
    // - `{foo(){}}`
    //        ^
    // - `{get foo(){}}`
    //         ^^^
    // - `{get "ok"(){}}`
    //         ^^^^
    return nextTokenWithLexer(_nextTokenToClassMemberRest, lexerFlags, returnAny);
  }
  function _nextTokenToClassMemberRest(lexerFlags) {
    return lexerWithFallback(_lexerForClassMemberRest, lexerFlags);
  }
  function _lexerForClassMemberRest(lexerFlags) {
    let c = peek();

    // Anything that is valid after parsing the first token of a member of a class body
    // Will have to investigate what the proper order is in terms of odds. Hard to say.
    // - `(` (method)
    // - ident, string, number (like when the first token is a modifier)
    // - `[` (computed method name with modifier)
    // - `*` (static/async generator method)
    // - ?

    // TODO: this has an interesting additional property where if there is whitespace it is much more likely to be ident

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$STAR_2A:
        skip();
        return parseStar(); // * *= ** **=
      case $$SQUARE_L_5B:
        skip();
        return $PUNCTUATOR;
      case $$SQUOTE_27:
        skip();
        return parseSingleString(lexerFlags);
      case $$DQUOTE_22:
        skip();
        return parseDoubleString(lexerFlags);
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
      case $$0_30:
        skip();
        return parseLeadingZero(lexerFlags);
    }

    if (isAsciiNumber(c)) {
      // non-zero start
      skip();
      return parseDecimal();
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenSwitchBody(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenSwitchBody, lexerFlags, returnAny);
  }
  function _nextTokenSwitchBody(lexerFlags) {
    return lexerWithFallback(_lexerForSwitchBody, lexerFlags);
  }
  function _lexerForSwitchBody(lexerFlags) {
    // A switch must start with a case or default, or be empty. So not that many valid options here.

    let c = peek();

    switch (c) {
      case $$C_63: // `case`
        skip();
        return parseIdentifierRest('c');

      case $$D_64: // `default`
        skip();
        return parseIdentifierRest('d');

      case $$CURLY_R_7D: // `switch (x) {}`
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only inside switch, must close switch before closing the quasi)');
        skip();
        return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToBindingStart(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToBindingStart, lexerFlags, returnAny);
  }
  function _nextTokenToBindingStart(lexerFlags) {
    return lexerWithFallback(_lexerForBindingStart, lexerFlags);
  }
  function _lexerForBindingStart(lexerFlags) {
    // The start of a binding, generally after a `var`, `let`, or `const` (but also a `for`-header) is rather restricted
    // - identifier
    // - pattern; `[`, `{`
    // - `...`
    // ?
    // (It is not optional so there are no closing curlies, comma, semi, etc to check)
    // Some whitespace is mandatory, except in a `for`-header.

    let c = peek();

    // I expect this the most likely
    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');

      case $$SQUARE_L_5B: // `let [x] = y`
      case $$CURLY_R_7D: // `var {x} = y`
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (cant declare vars inside a quasi)');
        skip();
        return $PUNCTUATOR;
      case $$DOT_2E: // . ... .25    }
        skip();
        return parseLeadingDot();
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToBindingStartGrouped(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToBindingStartGrouped, lexerFlags, returnAny);
  }
  function _nextTokenToBindingStartGrouped(lexerFlags) {
    return lexerWithFallback(_lexerForBindingStartGrouped, lexerFlags);
  }
  function _lexerForBindingStartGrouped(lexerFlags) {
    // The start of a binding, generally after a `var`, `let`, or `const` (but also a `for`-header) is rather restricted
    // This is the case of params, where the next token may also be a paren (unlike var decls which can not have parens)
    // - identifier
    // - pattern; `[`, `{`
    // - `...`
    // - end of header; `)`
    // ?
    // (It is optional in this context so we must check `)` as well)

    let c = peek();

    // I expect this the most likely
    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');

      case $$CURLY_R_7D: // `var {x} = y`
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (if declaring vars here we are in a param header, which must be closed before closing the template)');
        // fall-through
      case $$PAREN_R_29: // `function x(){}` but also after comma: `function x(a,){}`
      case $$SQUARE_L_5B: // `let [x] = y`
        skip();
        return $PUNCTUATOR;
      case $$DOT_2E: // . ... .25
        skip();
        return parseLeadingDot();
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToColonOrParenOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToColonOrParenOpen, lexerFlags, returnAny);
  }
  function _nextTokenToColonOrParenOpen(lexerFlags) {
    return lexerWithFallback(_lexerForColonOrParenOpen, lexerFlags);
  }
  function _lexerForColonOrParenOpen(lexerFlags) {
    // This is after an object literal property, where the first token was a number, string, star, or computed property
    // In that case the next token must be a colon or a curly, there are no other options. Except for whitespace.

    let c = peek();

    if (c === $$COLON_3A || c === $$PAREN_L_28) {
      skip();
      return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdentOrParenOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdentOrParenOpen, lexerFlags, returnAny);
  }
  function _nextTokenToIdentOrParenOpen(lexerFlags) {
    return lexerWithFallback(_lexerForIdentOrParenOpen, lexerFlags);
  }
  function _lexerForIdentOrParenOpen(lexerFlags) {
    // After a function star or async function star (expression), the next token must be an ident or a paren

    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$PAREN_L_28:
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdentStarParenOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdentStarParenOpen, lexerFlags, returnAny);
  }
  function _nextTokenToIdentStarParenOpen(lexerFlags) {
    return lexerWithFallback(_lexerForIdentStarParenOpen, lexerFlags);
  }
  function _lexerForIdentStarParenOpen(lexerFlags) {
    // After a function keyword, the next token must be an ident, star, or an opening paren

    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$STAR_2A:
        skip();
        return parseStar(); // * *= ** **=
      case $$PAREN_L_28:
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdentStarCurlyOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdentStarCurlyOpen, lexerFlags, returnAny);
  }
  function _nextTokenToIdentStarCurlyOpen(lexerFlags) {
    return lexerWithFallback(_lexerForIdentStarCurlyOpen, lexerFlags);
  }
  function _lexerForIdentStarCurlyOpen(lexerFlags) {
    // The next token after the `export` keyword;
    // - `export * from 'x'`
    // - `export {}`
    // - `export foo`
    // - `export default ...`
    // - `export var ...`
    // - `export let ...`
    // - `export const ...`
    // - `export class ...`
    // - `export function ...`
    // - `export async function ...`
    // So for us this means star, curly open, and ident.
    // And while `default` and `function` are more likely idents than the others, right now the lexer just returns
    // the $IDENT flag so we may as well do two range checks and call it a day. For now.

    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$STAR_2A:
        skip();
        return parseStar(); // * *= ** **=
      case $$CURLY_L_7B:
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToCommaCurlyClose(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToCommaCurlyClose, lexerFlags, returnAny);
  }
  function _nextTokenToCommaCurlyClose(lexerFlags) {
    return lexerWithFallback(_lexerForCommaCurlyClose, lexerFlags);
  }
  function _lexerForCommaCurlyClose(lexerFlags) {
    // Inside the object for export after as-ident the next token is either a comma or a closing curly

    let c = peek();

    if (c === $$CURLY_R_7D || c === $$COMMA_2C) {
      ASSERT(c === $$COMMA_2C || (lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called in export obj)');
      skip();
      return $PUNCTUATOR;
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdentCurlyOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdentCurlyOpen, lexerFlags, returnAny);
  }
  function _nextTokenToIdentCurlyOpen(lexerFlags) {
    return lexerWithFallback(_lexerForIdentCurlyOpen, lexerFlags);
  }
  function _lexerForIdentCurlyOpen(lexerFlags) {
    // After `class` keyword, the next is the id (an ident), `extends` (an ident), or an opening curly (anon class expr)

    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$CURLY_L_7B:
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdentCurlyClose(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdentCurlyClose, lexerFlags, returnAny);
  }
  function _nextTokenToIdentCurlyClose(lexerFlags) {
    return lexerWithFallback(_lexerForIdentCurlyClose, lexerFlags);
  }
  function _lexerForIdentCurlyClose(lexerFlags) {
    // Inside the object for export after a comma the next token is either an ident or a closing curly

    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$CURLY_R_7D:
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called export object)');
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdentStarCurlyOpenParenOpenString(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdentStarCurlyOpenParenOpenString, lexerFlags, returnAny);
  }
  function _nextTokenToIdentStarCurlyOpenParenOpenString(lexerFlags) {
    return lexerWithFallback(_lexerForIdentStarCurlyOpenParenOpenString, lexerFlags);
  }
  function _lexerForIdentStarCurlyOpenParenOpenString(lexerFlags) {
    // The next token after the `import` keyword;
    // - `import * as x from 'x'`
    // - `import {} ...`
    // - `import foo from ...`
    // - `import();`                // (dynamic import)
    // - `import 'foo';`            // this is valid, too
    // The ident can be anything

    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$STAR_2A:
        skip();
        return parseStar(); // * *= ** **=
      case $$CURLY_L_7B:
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
      case $$SQUOTE_27:
        skip();
        return parseSingleString(lexerFlags);
      case $$DQUOTE_22:
        skip();
        return parseDoubleString(lexerFlags);
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToAwaitParenOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToAwaitParenOpen, lexerFlags, returnAny);
  }
  function _nextTokenToAwaitParenOpen(lexerFlags) {
    return lexerWithFallback(_lexerForAwaitParenOpen, lexerFlags);
  }
  function _lexerForAwaitParenOpen(lexerFlags) {
    // After a function star or async function star (expression), the next token must be an ident or a paren

    let c = peek();

    switch (c) {
      case $$PAREN_L_28: // Most likely for the `for` case ...
        skip();
        return $PUNCTUATOR;
      case $$A_61:
        // `for await (...`
        skip();
        return parseIdentifierRest('a');
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToIdentStringNumberSquareOpen(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToIdentStringNumberSquareOpen, lexerFlags, returnAny);
  }
  function _nextTokenToIdentStringNumberSquareOpen(lexerFlags) {
    return lexerWithFallback(_lexerForIdentStringNumberSquareOpen, lexerFlags);
  }
  function _lexerForIdentStringNumberSquareOpen(lexerFlags) {
    // The next token after a star inside an object method or class member
    // - `x = {*x(){}}`
    //         ^
    // - `class x {*x(){}}`
    //             ^

    // Next must be the id, so number, string, ident, or `[`


    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$SQUARE_L_5B:
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
      case $$SQUOTE_27:
        skip();
        return parseSingleString(lexerFlags);
      case $$DQUOTE_22:
        skip();
        return parseDoubleString(lexerFlags);
      case $$0_30:
        skip();
        return parseLeadingZero(lexerFlags);
    }

    if (isAsciiNumber(c)) {
      // non-zero start
      skip();
      return parseDecimal();
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }
  function nextTokenToParamStart(lexerFlags, returnAny) {
    return nextTokenWithLexer(_nextTokenToParamStart, lexerFlags, returnAny);
  }
  function _nextTokenToParamStart(lexerFlags) {
    return lexerWithFallback(_lexerForParamStart, lexerFlags);
  }
  function _lexerForParamStart(lexerFlags) {
    // The next token that is the start of a func param
    // - `function f(){}`
    //               ^
    // - `function f(x){}`
    //               ^
    // - `function f([x]]){}`
    // - `function f({x}){}`
    // - `function f(...x){}`

    let c = peek();

    if (isAsciiLetter(c)) {
      skip();
      return parseIdentifierRest(String.fromCharCode(c));
    }

    switch (c) {
      case $$SQUARE_L_5B:
        skip();
        return $PUNCTUATOR;
      case $$CURLY_R_7D:
        ASSERT((lexerFlags & LF_IN_TEMPLATE) !== LF_IN_TEMPLATE, 'should not be possible to be inside template (only called export object)');
        skip();
        return $PUNCTUATOR;
      case $$$_24:
        skip();
        return parseIdentifierRest('$');
      case $$LODASH_5F:
        skip();
        return parseIdentifierRest('_');
      case $$DOT_2E: // . ... .25
        skip();
        return parseLeadingDot();
    }

    return _lexerWhitespaceCommon(c, lexerFlags);
  }

  function incrementLine() {
    // Call this function AFTER consuming the newline(s) that triggered it
    ASSERT(input.charCodeAt(pointer-1) === $$CR_0D || isLfPsLs(input.charCodeAt(pointer-1)), 'should have just consumed a newline');

    ++consumedNewlinesThisToken;
    ++currentLine;
    currentColOffset = pointer;
  }

  function addAsi() {
    let token = createToken($ASI, pointer, pointer, pointer - currentColOffset, currentLine, consumedNewlinesThisToken, SOLID_TOKEN, $$SEMI_3B);
    // are asi's whitespace? i dunno. they're kinda special so maybe.
    // put it _before_ the current token (that should be the "offending" token)
    if (collectTokens !== COLLECT_TOKENS_NONE) {
      tokens.push(token, tokens.pop());
    }
    ++anyTokenCount;
    ++solidTokenCount; // eh... i guess.
    prevTokenSolid = true;
  }

  function createToken(type, start, stop, column, line, nl, ws, c) {
    ASSERT(createToken.length === arguments.length);
    ASSERT(
      ALL_TOKEN_TYPES.includes(type) || console.log('####\n' + getErrorContext())
      , 'the set of generated token types is fixed. New ones combinations should be part of this set', type.toString(2));
    ASSERT(typeof c === 'number' && c >= 0 && c <= 0x10ffff, 'valid c', c);

    let str = slice(start, stop);

    let canon = '';
    if (type === $IDENT) canon = lastParsedIdent;
    else if (isStringToken(type)) {
      canon = str[0] + lastCanonizedString + str[0];
    }
    else if (isTickToken(type)) {
      // Mostly necessary for AST output.
      // There are some `constructor` and `__proto__` checks that use it
      if (type === $TICK_PURE) {
        canon = '`' + lastCanonizedString + '`';
      } else if (type === $TICK_HEAD) {
        canon = '`' + lastCanonizedString + '${';
      } else if (type === $TICK_BODY) {
        canon = '}' + lastCanonizedString + '${';
      } else if (type === $TICK_TAIL) {
        canon = '}' + lastCanonizedString + '`';
      } else if (type === $TICK_BAD_PURE) {
        canon = '`' + lastCanonizedString + '`';
      } else if (type === $TICK_BAD_HEAD) {
        canon = '`' + lastCanonizedString + '${';
      } else if (type === $TICK_BAD_BODY) {
        canon = '}' + lastCanonizedString + '${';
      } else if (type === $TICK_BAD_TAIL) {
        canon = '}' + lastCanonizedString + '`';
      } else {
        ASSERT(false, 'tick should be enum');
      }
    }

    let token = {
      // <SCRUB DEV>
      _t: toktypeToString(type),
      // </SCRUB DEV>
      type,
      ws, // is this token considered whitespace? (space, tab, newline, comment)
      nl, // how many newlines between the start of the previous relevant token and the start of this one?
      start,
      stop, // start of next token
      column, // of first char of token
      line, // of first char of token
      c,
      str,
      // :'( https://tc39.github.io/ecma262/#prod-EscapeSequence
      // The ReservedWord definitions are specified as literal sequences of specific SourceCharacter elements.
      // A code point in a ReservedWord cannot be expressed by a \ UnicodeEscapeSequence.
      canon, // will NOT contain escapes, only for idents, strings, and templates // TODO: should perf check this, perhaps we need to take this slowpath differently

      // <SCRUB DEV>
      toString() {
        return `{# ${toktypeToString(type)} : nl=${nl?'Y':'N'} ws=${ws?'Y':'N'} pos=${start}:${stop} loc=${column}:${line} curc=${c} \`${str}\`${canon&&canon!==str?' (canonical=`' + canon + '`)':''}#}`;
      },
      // </SCRUB DEV>
    };
    ASSERT(
      disableCanonPoison[0] ||
      type === $IDENT ||
      isStringToken(type) ||
      isTickToken(type) ||
      !void Object.defineProperty(
        token,
        'canon',
        {
          get: () => disableCanonPoison[0] || ASSERT(false, 'do not read .canon on non-ident tokens'),
          set: () => disableCanonPoison[0] || ASSERT(false, 'do not write to .canon on non-ident tokens')
        }
      ),
      '(debugging)'
    );
    return token;
  }

  function parseLeadingDot() {
    if (eof()) return $PUNCTUATOR; // will lead to an error in the parser

    let c = peek();

    if (c === $$DOT_2E) {
      return parseTripleDot();
    }

    if (isAsciiNumber(c)) {
      return parseNumberFromDot(c);
    }

    return $PUNCTUATOR;
  }
  function parseTripleDot() {
    // we just parsed a dot
    if (peekd(1) === $$DOT_2E) {
      ASSERT_skip($$DOT_2E);
      ASSERT_skip($$DOT_2E);
    } // the else will ultimately lead to an error in the parser
    return $PUNCTUATOR;
  }
  function parseNumberFromDot(c) {
    ASSERT_skip(c);
    if (neof()) {
      let d = skipDigits();
      parseExponentMaybe(d);
    }
    verifyCharAfterNumber();
    return $NUMBER_DEC;
  }

  function parseCR() {
    wasWhite = true;
    if (neof() && peeky($$LF_0A)) {
      ASSERT_skip($$LF_0A);
      incrementLine();
      return $NL_CRLF;
    }
    incrementLine();
    return $NL_SOLO;
  }

  function parseSingleString(lexerFlags) {
    ASSERT(arguments.length === 1, 'need 1 arg');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    return parseAnyString($$SQUOTE_27, $STRING_SINGLE, lexerFlags);
  }
  function parseDoubleString(lexerFlags) {
    ASSERT(arguments.length === 1, 'need 1 arg');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    return parseAnyString($$DQUOTE_22, $STRING_DOUBLE, lexerFlags);
  }
  function parseAnyString(marker, tokenType, lexerFlags) {
    ASSERT(arguments.length === 3, 'need 3 args');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    let badEscape = false;
    let hadNewline = false;
    let c;
    while (neof()) {
      // while we will want to consume at least one more byte for proper strings,
      // there could be a malformed string and we wouldnt want to consume the newline
      c = peek();

      /*
        There are a handful of chars that we must verify for strings;
          - $$LF_0A                       1010    newline
          - $$CR_0D                       1101    newline
          - $$DQUOTE_22                 100010    end of double quoted strings
          - $$SQUOTE_27                 100111    end of single quoted strings
          - $$BACKSLASH_5C             1011100    starts an escape
          - $$PS_2028           10000000101000    special edge case for locations
          - $$LS_2029           10000000101001    special edge case for locations
       */

      // Break on the marker (we only need to check one of the quotes and the marker tells us which quote)
      if (c <= marker) {
        // This can catch characters; space, !, ", #, $, %, &, ' (and a bunch of non-printables)
        // This range needs to (only) check for the marker (matches once) and the newlines \r and \n (matches never)

        if (c === marker) {
          ASSERT_skip(marker);

          if (badEscape) {
            if (!lastReportableTokenizerError) lastReportableTokenizerError = 'String had an illegal escape';
            return $ERROR;
          }

          // Note: LF and PS are newlines that are _explicitly_ allowed in a string, so only check for LF and CR here
          if (hadNewline) {
            if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Encountered newline in string which is not allowed';
            return $ERROR;
          }

          return tokenType;
        }

        hadNewline = hadNewline || c === $$LF_0A || c === $$CR_0D;

        // lastCanonizedString += String.fromCharCode(c);
        lastCanonizedString += input[pointer];
        ASSERT_skip(c);
      } else if (c <= 0x7e) {
        // This catches all the other ascii characters
        // This range only needs to check the backslash, which unfortunately occurs in the middle of the range

        if (c === $$BACKSLASH_5C) { // This seems to hit quite frequently, relative to this function
          badEscape = parseStringEscape(lexerFlags, NOT_TEMPLATE) === BAD_ESCAPE || badEscape;
          // TODO: shouldn't this add to the canonized value??
        } else {
          lastCanonizedString += input[pointer];
          // lastCanonizedString += String.fromCharCode(c);
          ASSERT_skip(c);
        }
      } else {
        // This is anything non-ascii
        // This range (which is fairly uncommon at time of writing) needs to check the 2028 and 2029 "newlines"

        lastCanonizedString += input[pointer];
        // lastCanonizedString += String.fromCharCode(c);
        ASSERT_skip(c);
        if (isPsLs(c)) {
          // This is a bit of a weird case for strings.
          // (Increment after consumption as that's what incrementLine expects and asserts)
          incrementLine();
        }
      }
    }
    ASSERT(eof(), 'this is only reachable in the early EOF case');
    if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Unclosed string at EOF';
    return $ERROR;
  }
  function parseStringEscape(lexerFlags, forTemplate) {
    ASSERT(arguments.length === parseStringEscape.length, 'need args');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    ASSERT_skip($$BACKSLASH_5C);
    if (eof()) {
      // You cant escape eof ;)
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Backslash at end of input';
      return BAD_ESCAPE;
    }

    // read() because we need to consume at least one char here
    let c = peekSkip();
    // note: the parser only really cares about \u and \x. it needs no extra work for \t \n etc
    // note: it _does_ need to take care of escaped digits
    switch(c) {
      case $$U_75:
        return parseIdentOrStringEscapeUnicode();

      case $$X_78:
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
        return parseStringEscapeOctalOrDigit(c, forTemplate, lexerFlags);

      case $$T_74:
        lastCanonizedString += '\t';
        return GOOD_ESCAPE;
      case $$N_6E:
        lastCanonizedString += '\n';
        return GOOD_ESCAPE;
      case $$R_72:
        lastCanonizedString += '\r';
        return GOOD_ESCAPE;
      case $$B_62:
        lastCanonizedString += '\b';
        return GOOD_ESCAPE;
      case $$F_66:
        lastCanonizedString += '\f';
        return GOOD_ESCAPE;
      case $$V_76:
        lastCanonizedString += '\v';
        return GOOD_ESCAPE;
      case $$SQUOTE_27:
        lastCanonizedString += '\'';
        return GOOD_ESCAPE;
      case $$DQUOTE_22:
        lastCanonizedString += '"';
        return GOOD_ESCAPE;
      case $$BACKSLASH_5C:
        lastCanonizedString += '\\';
        return GOOD_ESCAPE;

      case $$LF_0A:
      case $$PS_2028:
      case $$LS_2029:
        incrementLine();
        return GOOD_ESCAPE;
      case $$CR_0D:
        // Does not add anything to `lastCanonizedString`
        // Edge case: `\crlf` is a valid line continuation
        if (neof() && peeky($$LF_0A)) ASSERT_skip($$LF_0A);
        incrementLine();
        return GOOD_ESCAPE;

      default:
        lastCanonizedString += String.fromCharCode(c);
    }


    // we can ignore this escape. treat it as a single char escape.
    return GOOD_ESCAPE;
  }
  function parseIdentOrStringEscapeUnicode() {
    // this is _after_ `\u` have been consumed already!
    if (eof()) return GOOD_ESCAPE; // Leads to EOF error, later
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
    if (eofd(3)) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Not enough characters left for a proper unicode escape';
      return BAD_ESCAPE;
    }
    let b = peekd(1);
    let c = peekd(2);
    let d = peekd(3);

    // if this is a bad escape then dont consume the chars. one of them could be a closing quote
    if (isHex(a) && isHex(b) && isHex(c) && isHex(d)) {
      // okay, _now_ consume them
      ASSERT(ASSERT_peekUncached() === a);
      skipFastWithoutUpdatingCache();
      ASSERT(ASSERT_peekUncached() === b);
      skipFastWithoutUpdatingCache();
      ASSERT(ASSERT_peekUncached() === c);
      skipFastWithoutUpdatingCache();
      ASSERT(ASSERT_peekUncached() === d);
      skip();
      lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b, c, d), 16));
      return GOOD_ESCAPE;
    } else {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'At least one character of the unicode escape was not a valid hex (0-9a-f) character';
      return BAD_ESCAPE;
    }
  }
  function parseStringEscapeUnicodeVary() {
    // "It is a Syntax Error if the MV of HexDigits > 1114111."
    // this means the actual hex value cannot exceed 6 chars (0x10ffff). however,
    // it can have any number of leading zeroes so we still need to loop
    // must at least parse one hex digit (but it may be invalid so we can't read())
    if (eof()) return GOOD_ESCAPE; // Trigger EOF error elsewhere
    let a = peek();
    if (!isHex(a)) {
      // Must have at least one character between the curlies
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'The variable unicode escape had no valid hex characters (0-9a-f)';
      return BAD_ESCAPE;
    }
    ASSERT_skip(a);
    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return GOOD_ESCAPE; // Trigger EOF error elsewhere
      a = skipZeroes();
      // Note: we already asserted a zero. We _can_ find a curly close now
      if (!isHex(a)) {
        if (a === $$CURLY_R_7D) {
          lastCanonizedString += '\0';
          ASSERT_skip($$CURLY_R_7D);
          return GOOD_ESCAPE;
        }
        if (!lastReportableTokenizerError) lastReportableTokenizerError = 'The variable unicode escape contained non-hex character `' + String.fromCodePoint(a) + '`';
        return BAD_ESCAPE;
      }
      ASSERT_skip(a);
    }
    if (eof()) return GOOD_ESCAPE; // Trigger EOF error elsewhere
    let b = peek();
    if (!isHex(b)) {
      if (b === $$CURLY_R_7D) {
        lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a), 16));
        ASSERT_skip($$CURLY_R_7D);
        return GOOD_ESCAPE;
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Long unicode escape contained non-hex character `' + String.fromCodePoint(b) + '`';
      return BAD_ESCAPE;
    }
    ASSERT_skip(b);
    if (eof()) return GOOD_ESCAPE;
    let c = peek();
    if (!isHex(c)) {
      if (c === $$CURLY_R_7D) {
        lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b), 16));
        ASSERT_skip($$CURLY_R_7D);
        return GOOD_ESCAPE;
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Long unicode escape contained non-hex character `' + String.fromCodePoint(c) + '`';
      return BAD_ESCAPE;
    }
    ASSERT_skip(c);
    if (eof()) return GOOD_ESCAPE; // Trigger EOF error elsewhere
    let d = peek();
    if (!isHex(d)) {
      if (d === $$CURLY_R_7D) {
        lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b, c), 16));
        ASSERT_skip($$CURLY_R_7D);
        return GOOD_ESCAPE;
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Long unicode escape contained non-hex character `' + String.fromCodePoint(d) + '`';
      return BAD_ESCAPE;
    }
    ASSERT_skip(d);
    if (eof()) return GOOD_ESCAPE; // Trigger EOF error elsewhere
    let e = peek();
    if (!isHex(e)) {
      if (e === $$CURLY_R_7D) {
        lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b, c, d), 16));
        ASSERT_skip($$CURLY_R_7D);
        return GOOD_ESCAPE;
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Long unicode escape contained non-hex character `' + String.fromCodePoint(e) + '`';
      return BAD_ESCAPE;
    }
    ASSERT_skip(e);
    if (eof()) return GOOD_ESCAPE; // Trigger EOF error elsewhere
    let f = peek();
    if (!isHex(f)) {
      if (f === $$CURLY_R_7D) {
        lastCanonizedString += String.fromCodePoint(parseInt(String.fromCharCode(a, b, c, d, e), 16));
        ASSERT_skip($$CURLY_R_7D);
        return GOOD_ESCAPE;
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Long unicode escape contained non-hex character `' + String.fromCodePoint(f) + '`';
      return BAD_ESCAPE;
    }
    ASSERT_skip(f);
    // we've parsed 6 hexdigits now. the biggest number allowed is 0x10ffff but first we _must_ find a curly next
    if (eof()) return GOOD_ESCAPE; // Trigger EOF error elsewhere
    if (!peeky($$CURLY_R_7D)) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Must find `}` after 6 digits of a long unicode escape';
      return BAD_ESCAPE;
    }

    // the total may not exceed 0x10ffff which means that at six digits we only have to validate the first two
    if (a === $$0_30 || (a === $$1_31 && b === $$0_30)) {
      lastCanonizedString += String.fromCodePoint(parseInt(String.fromCharCode(a, b, c, d, e, f), 16));
      ASSERT_skip($$CURLY_R_7D);
      return GOOD_ESCAPE;
    }

    // the number represented by the digits MUST exceed the explicitly allowed max of 0x10ffff so reject
    if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Total of long unicode escape would exceed 0x10ffff, which is not allowed';
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
    if (eofd(1)) {
      if (eof()) return GOOD_ESCAPE; // Let it error somewhere else
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Not enough of input left to create valid hex escape';
      return BAD_ESCAPE;
    }
    let a = peek();
    let b = peekd(1);
    // confirm they are both hex digits
    if (isHex(a) && isHex(b)) {
      // okay, _now_ consume them
      ASSERT_skip(a);
      ASSERT_skip(b);
      lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b), 16));
      return GOOD_ESCAPE;
    } else {
      // '\xz' should have 'xz' as canonized value
      lastCanonizedString += 'x';
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'At least one of the two hex characters were not hex character (0-9a-f)';
      return BAD_ESCAPE;
    }
  }
  function parseStringEscapeOctalOrDigit(a, forTemplate, lexerFlags) {
    ASSERT(arguments.length === parseStringEscapeOctalOrDigit.length, 'need args');
    ASSERT(typeof a === 'number', 'first digit ord');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    if (eof()) return GOOD_ESCAPE; // Will error somewhere else
    let b = peek();

    // Octals are only supported in web compat, sloppy mode, and only in strings
    // In web compat, \1 ~ \7 are considered start of an octal escape. Otherwise they are just a single digit escaped.
    // Otherwise, \1~\9 are illegal through CharacterEscapeSequence -> NonEscapeCharacter -> "SourceCharacter but not
    // one of EscapeCharacter or LineTerminator" -> EscapeCharacter -> DecimalDigit

    // There is a nasty edge case regarding nul (zero byte); In sloppy webcompat mode the nul escape may be followed by
    // an 8 or 9 and still be a valid nul. In other modes and templates, `\08` and `\09` are considered syntax errors.

    // Strings: octal escapes are only supported in sloppy mode with web compat enabled
    // Template literals: explicitly do never support octal escapes so trigger a syntax error in the parser
    // Tagged templates: are allowed to have bad escapes although they will cause `.value` to be `null` in the AST
    // (Note that we do not know here whether the template will be tagged or just a literal, so just return BAD_ESCAPE)

    if (webCompat === WEB_COMPAT_OFF || forTemplate || (lexerFlags & LF_STRICT_MODE) === LF_STRICT_MODE) {
      // If octals are invalid, then the nul escape can not be followed by 8 or 9 either
      // Note: in templates, octals are never valid escapes so `\08` is always a bad escape regardless of mode
      if (a === $$0_30 && (b < $$0_30 || b > $$9_39)) {
        // [v]: `"\0"`
        // [v]: `"\0x"`
        // \0 is not an octal escape, it's a nul, but whatever
        lastCanonizedString += '\0';
        return GOOD_ESCAPE;
      }

      // [v]: `"\07"`
      // [v]: `"\08"`
      // [v]: `"\09"`

      if (forTemplate) {
        if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Illegal legacy octal escape in template, where octal escapes are never allowed';
      } else if ((lexerFlags & LF_STRICT_MODE) === LF_STRICT_MODE) {
        if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Illegal legacy octal escape in strict mode';
      } else {
        ASSERT(webCompat === WEB_COMPAT_OFF);
        if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Octal escapes are only allowed in sloppy mode with web compat enabled';
      }
      return BAD_ESCAPE;
    } else {
      // If octals are allowed then the nul escape may be followed by 8 or 9
      if (a === $$0_30 && (b < $$0_30 || b > $$7_37)) {
        // [v]: `"\0"`
        // [v]: `"\0x"`
        // [v]: `"\07"`
        // [v]: `"\08"`
        // [v]: `"\09"`
        // \0 is not an octal escape, it's a nul, but whatever
        // In web compat mode the following char can be 8 and 9 according to the extended syntax
        lastCanonizedString += '\0';
        return GOOD_ESCAPE;
      } else if (a === $$8_38) {
        lastCanonizedString += '8';
        return GOOD_ESCAPE;
      } else if (a === $$9_39) {
        lastCanonizedString += '9';
        return GOOD_ESCAPE;
      }
    }

    if (b < $$0_30 || b > $$7_37) {
      // Max valid octal escape is 0377 so if a >= 4 then it's max 2 digits so we can return now
      lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a), 8));
      return GOOD_ESCAPE;
    }

    ASSERT_skip(b);
    if (eof()) return GOOD_ESCAPE; // Will error somewhere else
    if (a > $$3_33) {
      // Max valid octal escape is 0377 so if a >= 4 then it's max 2 digits so we can return now
      lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b), 8));
      return GOOD_ESCAPE;
    }
    let c = peek();
    if (c < $$0_30 || c > $$7_37) {
      lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b), 8));
      return GOOD_ESCAPE;
    }

    ASSERT_skip(c);
    lastCanonizedString += String.fromCharCode(parseInt(String.fromCharCode(a, b, c), 8));
    return GOOD_ESCAPE;
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

  function parseTemplateString(lexerFlags, fromTick) {
    // parseTick
    ASSERT(arguments.length === 2, 'need 2 args');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    // https://tc39.github.io/ecma262/#prod-CodePoint
    // "A conforming implementation must not use the extended definition of EscapeSequence described in B.1.2 when parsing a TemplateCharacter."

    // Since ES9 a _tagged_ tick literal can contain illegal escapes. Regular template strings must still conform.
    // The $G_TICK_BAD_ESCAPE type bit is set for template tokens that have such a bad escape (`isBadTickToken(type)`)

    // - `...`                         // "pure", no expression components
    // - `...${expr}...`               // tick_head and tick_tail, no body
    // - `...${expr}...${expr}...`     // tick_head, tick_body (the middle part), and tick_tail

    let badEscapes = false;
    let c;
    while (neof()) {
      // while we will want to consume at least one more byte for proper strings,
      // there could be a malformed string and we wouldnt want to consume the newline
      c = peek();

      // do ${ first, that way we can just use the peeked char in case it's a dud, without revisiting
      while (c === $$$_24) {
        ASSERT_skip($$$_24);
        if (eof()) {
          if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Unclosed template string';
          return $ERROR;
        }
        c = peek();

        if (c === $$CURLY_L_7B) {
          ASSERT_skip($$CURLY_L_7B);
          return badEscapes ? (fromTick ? $TICK_BAD_HEAD : $TICK_BAD_BODY) : (fromTick ? $TICK_HEAD : $TICK_BODY);
        }

        lastCanonizedString += '$';
      }

      if (c === $$TICK_60) {
        ASSERT_skip($$TICK_60);
        return badEscapes ? (fromTick ? $TICK_BAD_PURE : $TICK_BAD_TAIL) : (fromTick ? $TICK_PURE : $TICK_TAIL);
      }

      if (c === $$CR_0D) {
        ASSERT_skip($$CR_0D);
        lastCanonizedString += '\r';
        // crlf is considered one line for the sake of reporting line-numbers
        if (neof() && peeky($$LF_0A)) {
          lastCanonizedString += '\n';
          ASSERT_skip($$LF_0A);
        }
        incrementLine();
      } else if (isLfPsLs(c)) {
        ASSERT_skip(c);
        lastCanonizedString += String.fromCharCode(c);
        incrementLine();
      } else if (c === $$BACKSLASH_5C) {
        badEscapes = parseStringEscape(lexerFlags, FOR_TEMPLATE) || badEscapes;
      } else {
        lastCanonizedString += String.fromCharCode(c);
        ASSERT_skip(c);
      }
    }

    if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Unclosed template literal';
    return $ERROR;
  }

  function verifyCharAfterNumber() {
    // Must verify that the character immediately following this number
    // https://tc39.es/ecma262/#sec-literals-numeric-literals
    // (See foot note)
    // > The SourceCharacter immediately following a NumericLiteral must not be an IdentifierStart or DecimalDigit.
    // So `3in x` is an explicit example that should be considered a syntax error.
    if (eof()) return;
    let c = peek();
    if (
      // I think some heuristics could make this check easier to grok?
      // c !== $$SPACE_20 && c!== $$SEMI_3B &&
      (
        isIdentStart(c, 0) !== INVALID_IDENT_CHAR || // IdentifierStart, `3in`, `5instanceof` `0x33in`
        (c >= $$0_30 && c <= $$9_39)                        // DecimalDigit, not even sure about an example
      )
    ) {
      THROW('Found `' + String.fromCharCode(c) + '`. It is not legal for an ident or number token to start after a number token without some form of separation');
    }
  }

  function parseLeadingZero(lexerFlags) {
    let r = _parseLeadingZero(lexerFlags);
    if (r !== $ERROR) verifyCharAfterNumber();
    return r;
  }
  function _parseLeadingZero(lexerFlags) {
    // 0 0. 0.<digits> 0<digits> 0x<hex> 0b<bin> 0o<octal>

    if (eof()) return $NUMBER_DEC;

    // peek here. the next character can easily not be part of this token
    let c = peek();

    if (isAsciiNumber(c)) {
      skip();
      if (neof()) skipDigits();
      if ((lexerFlags & LF_STRICT_MODE) === LF_STRICT_MODE) {
        if (!lastReportableTokenizerError) lastReportableTokenizerError = '"Illegal" octal escape in strict mode';
        return $ERROR;
      }
      if (neof()) {
        let e = peek();
        if (e === $$E_UC_45 || e === $$E_65) {
          if (!lastReportableTokenizerError) lastReportableTokenizerError = 'An exponent is not allowed after a legacy octal number and an ident after number must be separated by some whitespace so this is an error';
          return $ERROR;
        }
        if (e === $$N_6E) {
          if (!supportBigInt) {
            THROW('BigInt suffix is not supported on legacy octals; use the `0o` prefix notation for that');
          }
        }
        // The dot may still lead to valid (though obscure) code: `01.foo` is the same as `1..foo`
        // if (e === $$DOT_2E) {
        //   if (!lastReportableTokenizerError) lastReportableTokenizerError = 'A dot fraction is not allowed after a legacy number octal';
        //   return $ERROR;
        // }
      }
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
    } else if (c === $$N_6E) {
      // [v] `0n`
      if (!supportBigInt) {
        THROW('The BigInt syntax is supported in ES11+ / ES2020 (currently parsing ES' + targetEsVersion + ')');
      }
      ASSERT_skip($$N_6E);
      return $NUMBER_BIG_DEC;
    }

    return $NUMBER_DEC;
  }
  function parseDecimal() {
    // Start parsing from 1-9 (so cannot have started with a dot or zero)
    if (neof()) {
      // optionally skip digits now. we dont care if that actually happens (we already know there was at least one)
      let c = skipDigits();
      if (eof()) return $NUMBER_DEC;

      // optional fraction
      if (c === $$DOT_2E) {
        parseFromFractionDot();
      } else if (c === $$N_6E) {
        // BigInt (ES2020 / ES11)
        // [v] `5464354354353n`
        if (!supportBigInt) {
          THROW('The BigInt syntax is supported in ES11+ / ES2020 (currently parsing ES' + targetEsVersion + ')');
        }
        ASSERT_skip($$N_6E);
        verifyCharAfterNumber();
        return $NUMBER_BIG_DEC;
      } else {
        parseExponentMaybe(c);
      }
    }
    verifyCharAfterNumber();
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
        skipFastWithoutUpdatingCache();
        if (d === $$DASH_2D || d === $$PLUS_2B) {
          ASSERT(ASSERT_peekUncached() === $$DASH_2D || ASSERT_peekUncached() === $$PLUS_2B, 'should skip + or -', ASSERT_peekUncached());
          skipFastWithoutUpdatingCache();
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
    if (eof()) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = '`0x` is illegal without a digit';
      return $ERROR;
    }

    // at least one digit is required
    let c = peek();
    if (!isHex(c)) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = '`0x` is illegal without a digit';
      return $ERROR;
    }
    ASSERT_skip(c);

    do {
      if (eof()) return $NUMBER_HEX;
      c = peek();
      if (!isHex(c)) break;
      ASSERT_skip(c);
    } while (true);

    if (c === $$N_6E) {
      // BigInt (ES2020 / ES11)
      // [v] `0x54a643D54354353n`
      if (!supportBigInt) {
        THROW('The BigInt syntax is supported in ES11+ / ES2020 (currently parsing ES' + targetEsVersion + ')');
      }
      ASSERT_skip($$N_6E);
      return $NUMBER_BIG_HEX;
    }

    return $NUMBER_HEX;
  }
  function isHex(ord) {
    if (isAsciiNumber(ord)) return true;
    let x = ord | 32; // if ord was an upper case letter, it is now a lower case letter
    if (x >= $$A_61 && x <= $$F_66) return true;
    return false;
  }
  function parseOctal() {
    if (eof()) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = '`0o` is illegal without a digit';
      return $ERROR;
    }

    // at least one digit is required
    let c = peek();
    if (!isOctal(c)) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = '`0o` is illegal without a digit';
      return $ERROR;
    }
    ASSERT_skip(c);

    do {
      if (eof()) return $NUMBER_OCT;
      c = peek();
      if (!isOctal(c)) break;
      ASSERT_skip(c);
    } while (true);

    if (c === $$N_6E) {
      // BigInt (ES2020 / ES11)
      // [v] `0o0043175346024n`
      if (!supportBigInt) {
        THROW('The BigInt syntax is supported in ES11+ / ES2020 (currently parsing ES' + targetEsVersion + ')');
      }
      ASSERT_skip($$N_6E);
      return $NUMBER_BIG_OCT;
    }

    return $NUMBER_OCT;
  }
  function parseBinary() {
    if (eof()) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = '`0b` is illegal without a digit';
      return $ERROR;
    }

    // at least one digit is required
    let c = peek();
    if (!isBinary(c)) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = '`0b` is illegal without a digit';
      return $ERROR;
    }
    ASSERT_skip(c);

    do {
      if (eof()) return $NUMBER_BIN;
      c = peek();
      if (!isBinary(c)) break;
      ASSERT_skip(c);
    } while (true);

    if (c === $$N_6E) {
      // BigInt (ES2020 / ES11)
      // [v] `0b10100110101011010101001010110100001101n`
      if (!supportBigInt) {
        THROW('The BigInt syntax is supported in ES11+ / ES2020 (currently parsing ES' + targetEsVersion + ')');
      }
      ASSERT_skip($$N_6E);
      return $NUMBER_BIG_DEC;
    }

    return $NUMBER_BIN;
  }
  function isBinary(ord) {
    return ord === $$0_30 || ord === $$1_31;
  }

  function parseExcl() {
    // != !==

    if (eof()) return $PUNCTUATOR;

    if (peeky($$IS_3D)) {
      ASSERT_skip($$IS_3D); // !=
      if (neof() && peeky($$IS_3D)) {
        ASSERT_skip($$IS_3D); // !==
      }
      return $PUNCTUATOR;
    }

    return $PUNCTUATOR;
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

  function parseIdentifierRest(prevStr) {
    // Returns a token type (!). See parseRegexIdentifierRest for regexes...
    ASSERT(parseIdentifierRest.length === arguments.length, 'arg count');
    ASSERT(typeof prevStr === 'string', 'prev should be string so far or empty');
    if (neof()) {
      let c = peek();
      do {
        if (c === $$BACKSLASH_5C) {
          // this ident is part of an identifier. if the backslash is invalid or the escaped codepoint not valid for the
          // identifier then an $ERROR token should be yielded since the backslash cannot be valid in any other way here
          if (eofd(1)) {
            if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Encountered a backslash at end of input';
            return $ERROR;
          }
          if (peekd(1) === $$U_75) {
            ASSERT_skip($$BACKSLASH_5C);
            ASSERT_skip($$U_75);
            let errbak = lastPotentialRegexError;
            c = parseRegexCharClassUnicodeEscape();
            let wasDoubleQuad = c & REGEX_CHARCLASS_DOUBLE_QUAD;
            if (wasDoubleQuad) c ^= REGEX_CHARCLASS_DOUBLE_QUAD;
            ASSERT(c !== INVALID_IDENT_CHAR, 'dont think this can happen');
            if (c === REGEX_CHARCLASS_BAD) {
              regexSyntaxError('Found invalid quad unicode escape, the escape must be part of the ident so the ident is an error');
              return $ERROR;
            }
            if ((c & REGEX_CHARCLASS_BAD_SANS_U_FLAG) === REGEX_CHARCLASS_BAD_SANS_U_FLAG) {
              // There is no condition for es6 unicode escapes or double quad surrogate pairs for plain identifiers
              c = c ^ REGEX_CHARCLASS_BAD_SANS_U_FLAG;
              lastPotentialRegexError = errbak;
            }
            let wide = isIdentRestChr(c, CODEPOINT_FROM_ESCAPE);
            if (wide === INVALID_IDENT_CHAR) {
              regexSyntaxError('An escape that might be part of an identifier cannot be anything else so if it is invalid it must be an error');
              return $ERROR;
            }
            if (wide === VALID_SINGLE_CHAR) {
              ASSERT(!wasDoubleQuad, 'The first quad of a valid surrogate pair cannot yield a valid single ident character');
              prevStr += String.fromCharCode(c);
            } else {
              ASSERT(!wasDoubleQuad || (isIdentRestChr(codePointToSurrogateHead(c), CODEPOINT_FROM_ESCAPE) === INVALID_IDENT_CHAR && isIdentRestChr(codePointToSurrogateTail(c), CODEPOINT_FROM_ESCAPE) === INVALID_IDENT_CHAR), 'The first quad of a surrogate pair cannot yield a valid single ident rest character')
              prevStr += String.fromCodePoint(c);
            }
          } else {
            regexSyntaxError('Only unicode escapes are legal in identifier names');
            return $ERROR;
          }
        }
        else {
          let wide = isIdentRestChr(c, pointer);
          if (wide === INVALID_IDENT_CHAR) break;
          if (wide === VALID_DOUBLE_CHAR) {
            prevStr += input.slice(pointer, pointer + 2); // we could try to get the ord and fromCodePoint for perf
            skipFastWithoutUpdatingCache();
            skip();
          } else {
            ASSERT(wide === VALID_SINGLE_CHAR, 'enum');
            ASSERT_skip(c);
            prevStr += String.fromCharCode(c); // TODO: if this affects perf we can try a slice after the loop
          }
        }
        if (eof()) break;
        c = peek();
      } while (true);
      // slow path, dont test this inside the super hot loop above
      if (c === $$BACKSLASH_5C) {
        ASSERT_skip($$BACKSLASH_5C);
        return parseIdentFromUnicodeEscape(NON_START, prevStr);
      }
    }
    lastParsedIdent = prevStr;
    return $IDENT;
  }
  function parseIdentFromUnicodeEscape(fromStart, prev) {
    ASSERT(typeof prev === 'string', 'prev should be string so far or empty');
    if (eof()) {
      lastParsedIdent = prev;
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Encountered a backslash at end of input';
      return $ERROR;
    }
    if (peeky($$U_75)) {
      // \u0065xx
      ASSERT_skip($$U_75);
    } else {
      // any other escape is not supported in identifiers
      THROW('Only unicode escapes are supported in identifier escapes');
    }

    // Note: this is a slow path. and a super edge case.
    let start = pointer;
    if (parseIdentOrStringEscapeUnicode() === BAD_ESCAPE) {
      parseIdentifierRest(prev); // keep on parsing the identifier but we will make it an error token
      lastParsedIdent = prev;
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Only _unicode_ escapes are supported in identifiers';
      return $ERROR;
    }
    if (eof()) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Reached end of input before closing the current ident escape';
      return $ERROR;
    }

    let data = input.charCodeAt(start) === $$CURLY_L_7B ? slice(start + 1, pointer - 1) : slice(start, pointer);
    ASSERT(data.length > 0, 'a valid escape should contain at least one digit');
    ASSERT(data.charCodeAt(0) !== $$CURLY_L_7B && isHex(data.charCodeAt(0)), 'if wrapped, the opener should be removed');
    ASSERT(data.charCodeAt(data.length - 1) !== $$CURLY_R_7D && isHex(data.charCodeAt(data.length - 1)), 'if wrapped, the closer should not be consumed yet');

    let ord = parseInt(data, 16);
    if (ord > 0xffff) prev += String.fromCodePoint(ord); // there's a test... but if ord is >0xffff then fromCharCode can't properly deal with it
    else prev += String.fromCharCode(ord);
    // the escaped char must still be a valid identifier character. then and only
    // then can we proceed to parse an identifier. otherwise we'll still parse
    // into an error token.
    if (fromStart === FIRST_CHAR && isIdentStart(ord, CODEPOINT_FROM_ESCAPE) !== INVALID_IDENT_CHAR) {
      return parseIdentifierRest(prev);
    } else if (fromStart === NON_START && isIdentRestChr(ord, CODEPOINT_FROM_ESCAPE) !== INVALID_IDENT_CHAR) {
      return parseIdentifierRest(prev);
    } else {
      lastParsedIdent = prev;
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Identifier escape did not yield a valid identifier character';
      return $ERROR;
    }
  }
  function parseRegexIdentifierRest(prevStr, uflagStatus) {
    // Returns a uflagStatus enum. See parseIdentifierRest for non-regex idents.
    ASSERT(parseRegexIdentifierRest.length === arguments.length, 'arg count');
    ASSERT(typeof prevStr === 'string', 'prev should be string so far or empty', prevStr);

    if (neof()) {
      let c = peek();
      do {
        if (c === $$BACKSLASH_5C) {
          // This ident is part of a regex. If the backslash is invalid or the escaped codepoint not valid for the
          // identifier then the ALWAYS_BAD flag should be returned. If the escape is "es6 unicode escape" then the
          // flag must be set to require the uflag. Note that the escape is evaluated as the canonical value in any
          // case (including surrogate pairs), so `a\u0062c` equals `abc`.
          if (eofd(1)) return regexSyntaxError('Early EOF while parsing escape inside group name identifier');
          if (peekd(1) === $$U_75) {
            ASSERT_skip($$BACKSLASH_5C);
            ASSERT_skip($$U_75);
            c = parseRegexCharClassUnicodeEscape();
            let wasDoubleQuad = c & REGEX_CHARCLASS_DOUBLE_QUAD;
            if (wasDoubleQuad) c ^= REGEX_CHARCLASS_DOUBLE_QUAD;
            if (c === INVALID_IDENT_CHAR || c === REGEX_CHARCLASS_BAD) {
              return regexSyntaxError('Found invalid quad unicode escape in regex ident, the escape must be part of the ident so the ident is an error');
            }
            if ((c & REGEX_CHARCLASS_BAD_SANS_U_FLAG) === REGEX_CHARCLASS_BAD_SANS_U_FLAG) {
              uflagStatus = updateRegexUflagIsMandatory(uflagStatus, 'Found "es6" unicode escape (`\\u{..}`) or surrogate pair quads (`\\uxxxx\\uxxxx`) in regex ident, which is only valid with u-flag in regex');
              c = c ^ REGEX_CHARCLASS_BAD_SANS_U_FLAG;
            }
            ASSERT(!(c & REGEX_CHARCLASS_BAD_WITH_U_FLAG), 'regex idents cant be bad with u-flag? I think', c, uflagStatus);
            let wide = isIdentRestChr(c, CODEPOINT_FROM_ESCAPE);
            if (wide === INVALID_IDENT_CHAR) {
              return regexSyntaxError('An escape that might be part of an identifier cannot be anything else so if it is invalid it must be an error');
            }
            if (wide === VALID_SINGLE_CHAR) {
              ASSERT(!wasDoubleQuad, 'The first quad of a valid surrogate pair cannot yield a valid single ident character');
              prevStr += String.fromCharCode(c);
            } else {
              ASSERT(!wasDoubleQuad || (isIdentRestChr(codePointToSurrogateHead(c), CODEPOINT_FROM_ESCAPE) === INVALID_IDENT_CHAR && isIdentRestChr(codePointToSurrogateTail(c), CODEPOINT_FROM_ESCAPE) === INVALID_IDENT_CHAR), 'The first quad of a surrogate pair cannot yield a valid single rest ident rest character')
              prevStr += String.fromCodePoint(c);
              if (wasDoubleQuad) {
                uflagStatus = updateRegexUflagIsMandatory(uflagStatus, 'Found a quad that was a surrogate pair which created a valid identifier character and that will only work with u-flag');
              }
            }
          } else {
            return regexSyntaxError('Only unicode escapes are legal in identifier names');
          }
        }
        else {
          let wide = isIdentRestChr(c, pointer);
          if (wide === INVALID_IDENT_CHAR) break;
          if (wide === VALID_DOUBLE_CHAR) {
            uflagStatus = updateRegexUflagIsMandatory(uflagStatus, 'name contained a character that is only a valid identifier with u-flag');
            prevStr += input.slice(pointer, pointer + 2); // we could try to get the ord and fromCodePoint for perf
            skipFastWithoutUpdatingCache();
            skip();
          }
          else {
            ASSERT(wide === VALID_SINGLE_CHAR, 'enum');
            ASSERT_skip(c);
            prevStr += String.fromCharCode(c); // TODO: if this affects perf we can try a slice after the loop
          }
        }
        if (eof()) break;
        c = peek();
      } while (true);
    }
    lastParsedIdent = prevStr;
    return uflagStatus;
  }
  function parseRegexIdentFromUnicodeEscape(fromStart, prev, uflagStatus) {
    ASSERT(parseRegexIdentFromUnicodeEscape.length === arguments.length, 'arg count');
    ASSERT(typeof prev === 'string', 'prev should be string so far or empty');
    if (eof()) {
      lastParsedIdent = prev;
      return regexSyntaxError('Encountered a backslash at end of input');
    }
    if (peeky($$U_75)) {
      // \u0065xx
      ASSERT_skip($$U_75);
    } else {
      // any other escape is not supported in identifiers
      return regexSyntaxError('Only unicode escapes are supported in identifier escapes');
    }

    // Note: this is a slow path. and a super edge case.
    let start = pointer;
    if (parseIdentOrStringEscapeUnicode() === BAD_ESCAPE) {
      parseRegexIdentifierRest(prev, uflagStatus); // keep on parsing the identifier but we will make it an error token
      lastParsedIdent = prev;
      return regexSyntaxError('Only _unicode_ escapes are supported in identifiers');
    }

    ASSERT(neof(), 'would have been a BAD_ESCAPE if it was an EOF here');
    let data = input.charCodeAt(start) === $$CURLY_L_7B ? slice(start + 1, pointer - 1) : slice(start, pointer);
    ASSERT(data.length > 0, 'a valid escape should contain at least one digit');
    ASSERT(data.charCodeAt(0) !== $$CURLY_L_7B && isHex(data.charCodeAt(0)), 'if wrapped, the opener should be removed');
    ASSERT(data.charCodeAt(data.length - 1) !== $$CURLY_R_7D && isHex(data.charCodeAt(data.length - 1)), 'if wrapped, the closer should not be consumed yet');

    let ord = parseInt(data, 16);
    if (ord > 0xffff) prev += String.fromCodePoint(ord); // there's a test... but if ord is >0xffff then fromCharCode can't properly deal with it
    else prev += String.fromCharCode(ord);
    // the escaped char must still be a valid identifier character. then and only
    // then can we proceed to parse an identifier. otherwise we'll still parse
    // into an error token.
    if (fromStart === FIRST_CHAR && isIdentStart(ord, CODEPOINT_FROM_ESCAPE) !== INVALID_IDENT_CHAR) {
      return parseRegexIdentifierRest(prev, uflagStatus);
    } else if (fromStart === NON_START && isIdentRestChr(ord, CODEPOINT_FROM_ESCAPE) !== INVALID_IDENT_CHAR) {
      return parseRegexIdentifierRest(prev, uflagStatus);
    } else {
      lastParsedIdent = prev;
      return regexSyntaxError('Identifier escape did not yield a valid identifier character');
    }
  }

  function readNextCodepointAsStringExpensive(c, offset, forError) {
    ASSERT(readNextCodepointAsStringExpensive.length === arguments.length, 'arg count');
    ASSERT(typeof c === 'number', 'cnum', c);
    // 0xDC00–0xDFFF is the surrogate pair range and means the next character is required to form the full unicode
    // character (hence, "pair"). In that case we defer to more expensive codePointAt/fromCodePoint calls.
    if (offset === CODEPOINT_FROM_ESCAPE) {
      return String.fromCodePoint(c);
    }
    if (c <= 0xD7FF || (c >= 0xE000 && c <= 0xFFFF)) {
      ASSERT(String.fromCodePoint(input.codePointAt(offset)) === input[offset], 'single char should still yield the same result in slow path');
      return input[offset];
    }
    ASSERT(c <= 0xffff, 'I think the surrogate pair chars 0xD800~0xDFFF should not validate to reach this point, not even escaped', offset, c);
    return String.fromCodePoint(input.codePointAt(offset));
  }

  function codepointLen(c, offsetOfC) {
    if (c < 127) return 1;
    // now we have to do an expensive... but proper unicode check
    return codepointLenExpensive(c, offsetOfC);
  }
  function codepointLenExpensive(c, offsetOfC) {
    ASSERT(codepointLenExpensive.length === arguments.length, 'arg count');
    // offset is skipped for escapes. we can assert `c` is correct in those cases.
    if (offsetOfC !== CODEPOINT_FROM_ESCAPE) {
      // this is a slow path that only validates if unicode chars are used in an identifier
      // since that is pretty uncommon I don't mind doing an extra codepoint lookup here
      c = input.codePointAt(offsetOfC);
    }
    let s = String.fromCodePoint(c);
    ASSERT(s.length === 1 || s.length === 2, 'up to four bytes...'); // js strings are 16bit
    return s.length;
  }
  function isIdentStart(c, offsetOfC){
    ASSERT(isIdentStart.length === arguments.length, 'all args');
    if (isAsciiLetter(c) || c === $$$_24 || c === $$LODASH_5F) return VALID_SINGLE_CHAR;
    if (c > 127) {
      // now we have to do an expensive... but proper unicode check
      return veryExpensiveUnicodeCheck(c, offsetOfC, ID_START_REGEX);
    }
    return INVALID_IDENT_CHAR;
  }
  function isIdentRestChr(c, offsetOfC){
    ASSERT(isIdentRestChr.length === arguments.length, 'all args');
    if (isAsciiLetter(c)) return VALID_SINGLE_CHAR;
    if (isAsciiNumber(c)) return VALID_SINGLE_CHAR;
    if (c === $$$_24 || c === $$LODASH_5F) return VALID_SINGLE_CHAR;
    if (c > 127) {
      // https://tc39.github.io/ecma262/#sec-unicode-format-control-characters
      // U+200C (ZERO WIDTH NON-JOINER) and U+200D (ZERO WIDTH JOINER) are format-control characters that are used to
      // make necessary distinctions when forming words or phrases in certain languages. In ECMAScript source text
      // these code points may also be used in an IdentifierName after the first character.
      if (c === $$ZWNJ_200C || c === $$ZWJ_200D) return VALID_SINGLE_CHAR;

      // now we have to do an expensive... but proper unicode check
      return veryExpensiveUnicodeCheck(c, offsetOfC, ID_CONTINUE_REGEX);
    }
    return INVALID_IDENT_CHAR;
  }
  function veryExpensiveUnicodeCheck(c, offset, regexScanner) {
    ASSERT(veryExpensiveUnicodeCheck.length === arguments.length, 'arg count');
    // offset is skipped for escapes. we can assert `c` is correct in those cases.
    if (offset !== CODEPOINT_FROM_ESCAPE) {
      // this is a slow path that only validates if unicode chars are used in an identifier
      // since that is pretty uncommon I don't mind doing an extra codepoint lookup here
      c = input.codePointAt(offset);
    }
    let s = String.fromCodePoint(c);
    ASSERT(s.length === 1 || s.length === 2, 'up to four bytes...'); // js strings are 16bit
    if (regexScanner.test(s)) {
      return s.length === 1 ? VALID_SINGLE_CHAR : VALID_DOUBLE_CHAR;
    }
    return INVALID_IDENT_CHAR;
  }
  function isAsciiLetter(c) {
    // make upper and lower case the same value (for the sake of the isletter check).
    // only difference between a lower and upper case ascii letter is the 6th bit (=1<<5=32)
    let d = c | 32;
    return d >= $$A_61 && d <= $$Z_7A;
  }
  function isAsciiNumber(c) {
    // isDigit isNumber
    return c >= $$0_30 && c <= $$9_39;
  }

  function parseCompoundAssignment() {
    // % %= ^ ^=

    if (neof() && peeky($$IS_3D)) {
      ASSERT_skip($$IS_3D); // @=
    }
    return $PUNCTUATOR;
  }

  function parseFwdSlash(lexerFlags) {
    if (eof()) {
      // I don't think there's any way this can lead to a valid parse... but let the parser deal with that.
      return $PUNCTUATOR;
    }

    let c = peek();
    if (c === $$FWDSLASH_2F) {
      // must be single comment
      ASSERT_skip($$FWDSLASH_2F); // `//`
      wasWhite = true;
      return parseCommentSingle();
    } else if (c === $$STAR_2A) {
      // must be multi comment
      ASSERT_skip($$STAR_2A); // `/*`
      return parseCommentMulti();
    } else {
      return parseSingleFwdSlash(lexerFlags, c);
    }
  }
  function parseSingleFwdSlash(lexerFlags, c) {
    if ((lexerFlags & LF_FOR_REGEX) === LF_FOR_REGEX) {
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
  function parseCommentSingle() {
    consumedCommentSincePrevSolid = true;
    wasComment = true;
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
  function parseCommentMulti() {
    consumedCommentSincePrevSolid = true;
    wasComment = true;
    let c;
    while (neof()) {
      c = peekSkip();
      while (c === $$STAR_2A) {
        if (eof()) {
          if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Unclosed multi line comment, early eof after star';
          return $ERROR;
        }
        c = peekSkip();
        if (c === $$FWDSLASH_2F) {
          wasWhite = true;
          return $COMMENT_MULTI;
        }
      }
      if (c === $$CR_0D) {
        // crlf is considered one line for the sake of reporting line-numbers
        if (neof() && peeky($$LF_0A)) skip();
        incrementLine();
      } else if (isLfPsLs(c)) {
        incrementLine();
      }
    }
    if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Unclosed multi line comment, early eof';
    return $ERROR;
  }
  function parseCommentHtmlOpen() {
    // parseHtmlComment
    // This is the starting html comment `<!--`
    // the spec defines it as the start of a single line JS comment
    parseCommentSingle();
    wasWhite = true;
    return $COMMENT_HTML;
  }
  function parseCommentHtmlClose() {
    // parseHtmlComment
    // This is the closing html comment, `-->`
    // Note: parseCommentSingle will just skip the - - > because they are not newlines.
    parseCommentSingle();
    wasWhite = true;
    return $COMMENT_HTML;
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

  function parseNewlineSolo() {
    // One character, not crlf
    incrementLine();
    wasWhite = true;
    return $NL_SOLO;
  }

  function parseBackslash() {
    return parseIdentFromUnicodeEscape(FIRST_CHAR, '');
  }

  function regexSyntaxError(desc, ...rest) {
    ASSERT(typeof desc === 'string', 'desc should be a string');
    ASSERT(desc, 'desc should be non-empty');

    if (lastReportableTokenizerError) {
      // Don't clobber. Report first error (Only? We could concat...).
      return REGEX_ALWAYS_BAD;
    }

    updateRegexPotentialError(desc + (rest.length ? ': [' + rest.join(', ') + ']' : ''));
    lastReportableTokenizerError = 'Regex: ' + lastPotentialRegexError;

    return REGEX_ALWAYS_BAD;
  }

  function updateRegexPotentialError(msg) {
    if (!lastPotentialRegexError.includes(msg)) {
      if (lastPotentialRegexError) lastPotentialRegexError += '; ';
      lastPotentialRegexError += msg;
    }
  }

  function updateRegexUflagIsIllegal(state, reason) {
    ASSERT(updateRegexUflagIsIllegal.length === arguments.length, 'arg count');

    // Found something that is potentially only valid in a regular expression without u-flag (like `\k<4>` in webcompat)
    return updateRegexUflagState(state, REGEX_GOOD_SANS_U_FLAG, reason);
  }
  function updateRegexUflagIsMandatory(state, reason) {
    ASSERT(updateRegexUflagIsMandatory.length === arguments.length, 'arg count');

    // Found something that is only valid in a regular expression with u-flag (like `\u${...}`)
    return updateRegexUflagState(state, REGEX_GOOD_WITH_U_FLAG, reason);
  }

  function updateRegexUflagState(currentState, newState, error) {
    ASSERT(newState === REGEX_GOOD_WITH_U_FLAG || newState === REGEX_GOOD_SANS_U_FLAG, 'should not be used for all good or bad');

    if (lastReportableTokenizerError) return REGEX_ALWAYS_BAD;

    if (currentState === (newState === REGEX_GOOD_WITH_U_FLAG ? REGEX_GOOD_SANS_U_FLAG : REGEX_GOOD_WITH_U_FLAG)) {
      return regexSyntaxError(error);
    }
    if (currentState === REGEX_ALWAYS_GOOD) {
      updateRegexPotentialError(error);
      currentState = newState;
    }
    else {
      ASSERT(currentState === REGEX_ALWAYS_BAD || currentState === newState, 'enum');
      ASSERT(currentState === REGEX_ALWAYS_BAD || lastPotentialRegexError, 'should not clobber a potential error message which should already have been set here');
    }
    return currentState;
  }

  let nCapturingParens = 0;
  let largestBackReference = 0;
  let declGroupName = ','; // List of comma concatenated declared group names (plain idents). If it occurs then consider +N in the grammar, meaning they must all have it
  let refGroupName = ','; // List of comma concatenated referenced group names (plain idents). If it occurs then consider +N in the grammar, meaning they must all have it
  let kCharClassEscaped = false; // If one was missing but there was at least one group name then it's always an error
  let foundValidGroupName = false; // used for +N post-regex check
  let foundInvalidGroupName = false; // used for +N post-regex check
  function parseRegex(c) {
    nCapturingParens = 0;
    largestBackReference = 0;
    lastPotentialRegexError = '';
    declGroupName = ',';
    refGroupName = ',';
    kCharClassEscaped = false;
    foundValidGroupName = false;
    foundInvalidGroupName = false;
    let ustatusBody = parseRegexBody(c);
    if (ustatusBody === REGEX_ALWAYS_BAD) {
      ASSERT(lastReportableTokenizerError, 'last error should be set', lastReportableTokenizerError, lastPotentialRegexError);
      return $ERROR;
    } else if (ustatusBody !== REGEX_ALWAYS_GOOD) {
      ASSERT(lastPotentialRegexError, 'last potential error should be set', lastReportableTokenizerError, lastPotentialRegexError);
    }
    if (nCapturingParens < largestBackReference) {
      let errmsg = 'Largest back reference index exceeded the number of capturing groups (only valid without u-flag in webcompat mode)';
      if (webCompat === WEB_COMPAT_ON) {
        // skip this check
        ustatusBody = updateRegexUflagIsIllegal(ustatusBody, errmsg);
      } else {
        ustatusBody = regexSyntaxError(errmsg);
      }
    }

    if (foundInvalidGroupName && foundValidGroupName) {
      ustatusBody = regexSyntaxError('Found at least one invalid group name but also at least one valid group name, so this activates +N and triggers this error');
    }

    let ustatusFlags = parseRegexFlags();

    if (kCharClassEscaped) {
      if (declGroupName !== ',') {
        ustatusBody = regexSyntaxError('Found `\\k` in a char class but the regex also had a group name so this is illegal');
        return $ERROR;
      } else if (webCompat === WEB_COMPAT_OFF || ustatusFlags === REGEX_GOOD_WITH_U_FLAG) {
        ustatusBody = regexSyntaxError('Found `\\k` in a char class but this is only allowed in webcompat mode and without u-flag');
      }
    }
    if (refGroupName !== ',') {
      // Other than above we don't care about whether group names were declared (by named capturing groups). We do need
      // to validate the referenced group names with `\k` atom escapes.
      // This is a fairly unused functionality so I'm going to do this in a slow path for now.
      refGroupName.split(',').filter(Boolean).forEach(name => {
        if (!declGroupName.includes(',' + name + ',')) {
          // Not even webcompat will save you now. This would only be valid if there were no names but by definition,
          // this is a name so that exception has already been voided.
          // edit: except that a test262 case thinks otherwise
          // test262/test/annexB/built-ins/RegExp/named-groups/non-unicode-malformed.js
          if (webCompat === WEB_COMPAT_OFF) {
            ustatusBody = regexSyntaxError('Found a `\\k` that referenced `' + name + '` but no capturing group had this name');
          }
        }
      });
    }

    if (ustatusBody === REGEX_ALWAYS_BAD) {
      if (!lastReportableTokenizerError) regexSyntaxError('Regex body had an illegal escape sequence');
      return $ERROR;
    }
    if (ustatusFlags === REGEX_ALWAYS_BAD) {
      if (!lastReportableTokenizerError) regexSyntaxError('Regex body had an illegal escape sequence or a regex flag occurred twice (should already have called THROW for this)');
      return $ERROR;
    }

    if (ustatusBody === REGEX_GOOD_WITH_U_FLAG) {
      // body had an escape that is only valid with an u flag
      if (ustatusFlags === REGEX_GOOD_WITH_U_FLAG) return $REGEXU;
      if (!lastReportableTokenizerError) regexSyntaxError('Regex body had an escape that is only valid with an u-flag, but it had no u-flag');
      regexSyntaxError('Regex had syntax that is only valid with the u-flag and u-flag was in fact not present');
      return $ERROR;
    }

    if (ustatusBody === REGEX_GOOD_SANS_U_FLAG) {
      // body had an escape or char class range that is invalid with a u flag
      if (ustatusFlags !== REGEX_GOOD_WITH_U_FLAG) return $REGEXN;
      // in this case the body had syntax that's invalid with a u flag and the flag was present anyways
      if (!lastReportableTokenizerError) regexSyntaxError('Regex body had an escape or char class range that is invalid with a u-flag, but it did have a u-flag');
      regexSyntaxError('Regex had syntax that is invalid with u-flag and u-flag was in fact present');
      return $ERROR;
    }
    ASSERT(ustatusBody === REGEX_ALWAYS_GOOD, 'u-flag-status is enum and we checked all options here', ustatusBody);
    if (ustatusFlags === REGEX_GOOD_WITH_U_FLAG) return $REGEXU;
    return $REGEXN;
  }
  function parseRegexBody(c) {
    ASSERT(c !== $$STAR_2A && c !== $$FWDSLASH_2F, 'earlier checks should already have peeked for a comment token');
    return _parseRegexBody(c, 0, REGEX_ALWAYS_GOOD);
  }
  function cannotBeQuantifier(c, uflagStatus, webcompatException, msg) {
    let badStart = c === $$STAR_2A || c === $$PLUS_2B || c === $$QMARK_3F || c === $$CURLY_L_7B;
    if (badStart) {
      msg += ' (by a `' + String.fromCharCode(c) + '`)';
      if (webcompatException && webCompat === WEB_COMPAT_ON) {
        uflagStatus = updateRegexUflagIsIllegal(uflagStatus, msg);
      } else {
        uflagStatus = regexSyntaxError(msg);
      }
    }
    return uflagStatus;
  }
  function _parseRegexBody(c, groupLevel, uflagStatus) {
    //ASSERT(typeof c === 'number', 'c is an ord');
    ASSERT(typeof groupLevel === 'number' && groupLevel >= 0, 'valid group level');
    ASSERT(typeof uflagStatus === 'number' && uflagStatus >= 0, 'valid flag');
    // - there are two grammars; a simple (RegularExpressionLiteral) and a more granular grammar (Pattern). Pattern governs. The first cannot be extended/changed, the second may be.
    //   - the spec describes such an extension in (B.1.4) we may need to use that as our end goal
    // - there are two parsing modes; unicode and without unicode. the unicode is slightly more strict
    //   - reflects on surrogate pairs, long unicode escapes, and valid char class ranges

    let afterAtom = false;

    // dont start with a quantifier
    uflagStatus = cannotBeQuantifier(c, uflagStatus, c === $$CURLY_L_7B, 'Started with a quantifier but that is not allowed');

    let groupNames = {};
    let namedBackRefs = [];

    do {
      switch (c) {
        case $$FWDSLASH_2F:
          // end of regex body

          if (groupLevel !== 0) {
            // all groups must be closed before the floor is closed
            // dont consume the forward slash. let only the root caller do this
            return regexSyntaxError('Unclosed group');
          }

          // Tests imply that the existence rule does not need to apply in web compat mode. TBD.
          if (webCompat === WEB_COMPAT_OFF) {
            for (let i=0,l=namedBackRefs.length;i<l;++i) {
              if (groupNames['#' + namedBackRefs[i]] === undefined) {
                THROW('Named back reference \\k<' + namedBackRefs[i] +'> was not defined in this regex: ' + JSON.stringify(groupNames).replace(/"/g,''));
              }
            }
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
          afterAtom = false; // this Assertion can never have a Quantifier
          break;

        case $$DOT_2E:
          // atom; match one character
          ASSERT_skip($$DOT_2E);
          afterAtom = true;
          break;

        case $$$_24:
          // atom; match the end of a file/line
          ASSERT_skip($$$_24);
          if (neof()) {
            c = peek();
            uflagStatus = cannotBeQuantifier(c, uflagStatus, c === $$CURLY_L_7B, 'Regex `A-ssertion` "atoms" can not be quantified but this `$` was quantified anyways');
          }
          afterAtom = false; // this Assertion can never have a Quantifier
          break;

        case $$BACKSLASH_5C:
          // atom escape is different from charclass escape
          ASSERT_skip($$BACKSLASH_5C);
          afterAtom = true; // except in certain cases...

          if (eof()) {
            uflagStatus = regexSyntaxError('Early EOF');
          } else {
            let d = peek();
            // \b \B cannot have quantifiers
            if (d === $$B_62 || d === $$B_UC_42) {
              ASSERT_skip(d);
              afterAtom = false; // this Assertion can never have a Quantifier
            } else {
              let escapeStatus = parseRegexAtomEscape(d, namedBackRefs);
              ASSERT(escapeStatus === REGEX_ALWAYS_GOOD || lastPotentialRegexError || lastReportableTokenizerError, 'if not good then error should be set');
              if (escapeStatus === REGEX_ALWAYS_BAD) {
                uflagStatus = REGEX_ALWAYS_BAD;
              } else if (escapeStatus === REGEX_GOOD_SANS_U_FLAG) {
                uflagStatus = updateRegexUflagIsIllegal(uflagStatus, lastPotentialRegexError);
              } else if (escapeStatus === REGEX_GOOD_WITH_U_FLAG) {
                uflagStatus = updateRegexUflagIsMandatory(uflagStatus, lastPotentialRegexError);
              }
            }
          }
          break;

        case $$PAREN_L_28:
          // Assertions `(?=` and `(?!` can not have quantifiers (`?`,`*`,etc) except without u-flag and in web-compat mode
          // Since this can also be a non-capturing group `(?:` we need to track that bit.
          let wasFixableAssertion = false;
          // lookbehind `(?<=` and `(?<!` can not get quantified even under webcompat flag (too new)
          let wasUnfixableAssertion = false;

          // parse group (?: (!: (
          ASSERT_skip($$PAREN_L_28);
          afterAtom = false; // useless. just in case
          if (eof()) {
            uflagStatus = regexSyntaxError('Encountered early EOF');
            break;
          }
          c = peek();
          if (c === $$QMARK_3F) {
            // (?
            ASSERT_skip($$QMARK_3F);
            if (eof()) {
              uflagStatus = regexSyntaxError('Encountered early EOF');
              break;
            }
            c = peek();
            if (c === $$COLON_3A || c === $$IS_3D || c === $$EXCL_21 || c === $$LT_3C) {
              // non capturing group or named capturing group
              // (?: (?= (?! (?<= (?<! (?<abc>
              if (c === $$LT_3C) {
                // (?<
                ASSERT_skip($$LT_3C);

                if (eof()) {
                  uflagStatus = regexSyntaxError('Encountered early EOF');
                  break;
                }
                c = peek();
                if (c === $$IS_3D || c === $$EXCL_21) {
                  if (!supportRegexLookbehinds) {
                    THROW('Lookbehinds in regular expressions are not supported in the currently targeted language version');
                  }
                  // (?<= (?<!
                  ASSERT_skip(c);
                  wasUnfixableAssertion = true;
                } else if (!supportRegexNamedGroups) {
                  ASSERT_skip(c);
                  uflagStatus = regexSyntaxError('The lookbehind group `(?<` must be followed by `=` or `!` but wasnt [ord=' + c + ']');
                  break;
                } else {
                  // parseRegexNamedGroup, parseNamedCapturingGroup
                  // [v]: `/(?<name>content)/`
                  // [v]: `/(?<\u0065bc>content)/`

                  const FOR_NAMED_GROUP = true;
                  uflagStatus = parseRegexGroupName(c, uflagStatus, FOR_NAMED_GROUP);

                  let name = lastParsedIdent;
                  if (groupNames['#' + name]) {
                    uflagStatus = regexSyntaxError('Each group name can only be declared once: `' + name + '`');
                    return uflagStatus;
                  }
                  groupNames['#' + name] = true;

                  // named capturing group
                  ++nCapturingParens;
                }
              } else if (c === $$IS_3D || c === $$EXCL_21) {
                // (?= (?!
                ASSERT_skip(c);
                wasFixableAssertion = true; // lookahead assertion might only be quantified without u-flag and in webcompat mode
              }

              if (eof()) {
                uflagStatus = regexSyntaxError('Encountered early EOF');
                break;
              }
              c = peek();
            } else {
              uflagStatus = regexSyntaxError('Illegal character after pseudo group marker `(?` [ord=' + c + ']');
            }
          } else {
            // anonymous capturing group
            ++nCapturingParens;
          }

          let subbad = _parseRegexBody(c, groupLevel + 1, REGEX_ALWAYS_GOOD);

          if (eof()) {
            uflagStatus = regexSyntaxError('Encountered early EOF');
            break;
          }

          c = peek();

          if (wasFixableAssertion || wasUnfixableAssertion) {
            // Only `(?=` and `(?!` can be legal in web compat mode and without the u-flag. Anything else is always bad.
            uflagStatus = cannotBeQuantifier(c, uflagStatus, !wasUnfixableAssertion, 'Regex A-ssertion "atoms" can not be quantified (so things like `^`, `$`, and `(?=` can not have `*`, `+`, `?`, or `{` following it)');
          }

          afterAtom = true;
          if (subbad === REGEX_ALWAYS_BAD) {
            uflagStatus = REGEX_ALWAYS_BAD; // should already have THROWn for this
          } else if (subbad === REGEX_GOOD_SANS_U_FLAG) {
            uflagStatus = updateRegexUflagIsIllegal(uflagStatus, lastPotentialRegexError);
          } else if (subbad === REGEX_GOOD_WITH_U_FLAG) {
            uflagStatus = updateRegexUflagIsMandatory(uflagStatus, lastPotentialRegexError);
          }

          break;
        case $$PAREN_R_29:
          // a paren might be found in a sub-parse. the outer parse may be recursively parsing a group
          ASSERT_skip($$PAREN_R_29);
          if (groupLevel > 0) return uflagStatus;
          uflagStatus = regexSyntaxError('Found unescaped closing paren `)` without a group being open');
          afterAtom = true; // meh
          break;

        case $$SQUARE_L_5B:
          // CharacterClass
          let charClassEscapeStatus = parseRegexCharClass();
          if (charClassEscapeStatus === REGEX_ALWAYS_BAD) {
            uflagStatus = REGEX_ALWAYS_BAD; // should already have THROWn for this
          } else if (charClassEscapeStatus === REGEX_GOOD_SANS_U_FLAG) {
            uflagStatus = updateRegexUflagIsIllegal(uflagStatus, lastPotentialRegexError);
          } else if (charClassEscapeStatus === REGEX_GOOD_WITH_U_FLAG) {
            uflagStatus = updateRegexUflagIsMandatory(uflagStatus, lastPotentialRegexError);
          }
          afterAtom = true;
          break;
        case $$SQUARE_R_5D: {
          ASSERT_skip($$SQUARE_R_5D);
          let reason = 'Encountered unescaped closing square bracket `]` while not parsing a character class, which is only valid without u-flag';
          if (webCompat === WEB_COMPAT_ON) {
            uflagStatus = updateRegexUflagIsIllegal(uflagStatus, reason);
          } else {
            uflagStatus = regexSyntaxError(reason);
          }
          afterAtom = true;
          break;
        }

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
            uflagStatus = regexSyntaxError('Encountered unescaped quantifier (ord=' + c + ') without a value to quantify');
          }
          break;

        case $$CURLY_L_7B:
          // explicit quantifier
          // This is valid if we just parsed an atom, or in webcompat mode without the u-flag
          ASSERT_skip($$CURLY_L_7B);
          if (afterAtom) {
            if (eof()) {
              return regexSyntaxError('Early EOF at the start of a regex quantifier');
            }
            else {
              let c = peek();
              if (!isAsciiNumber(c)) {
                if (webCompat === WEB_COMPAT_OFF) {
                  if (peeky($$COMMA_2C)) {
                    uflagStatus = regexSyntaxError('The first digit of a regex curly quantifier is mandatory');
                  }
                  else if (peeky($$CURLY_R_7D)) {
                    uflagStatus = regexSyntaxError('A regex curly quantifier had no content');
                  }
                  else {
                    uflagStatus = regexSyntaxError('Found invalid regex curly quantifier');
                  }
                } else {
                  afterAtom = true; // in webcompat the InvalidBracedQuantifier is an atom
                  if (peeky($$COMMA_2C)) {
                    uflagStatus = updateRegexUflagIsIllegal(uflagStatus, 'The first digit of a regex curly quantifier is mandatory');
                  }
                  else if (peeky($$CURLY_R_7D)) {
                    uflagStatus = updateRegexUflagIsIllegal(uflagStatus, 'A regex curly quantifier had no content');
                  }
                  else {
                    uflagStatus = updateRegexUflagIsIllegal(uflagStatus, 'Found invalid regex curly quantifier');
                  }
                }
              }
              else if (!parseRegexCurlyQuantifier(c)) {
                let reason = 'Encountered unescaped closing curly `}` while not parsing a quantifier';
                if (webCompat === WEB_COMPAT_OFF) {
                  uflagStatus = regexSyntaxError(reason);
                } else {
                  uflagStatus = updateRegexUflagIsIllegal(uflagStatus, reason);
                }
              }
            }
            if (neof() && peeky($$QMARK_3F)) {
              ASSERT_skip($$QMARK_3F);
            }
            afterAtom = false;
          } else {
            let reason = 'Encountered illegal curly quantifier without anything to quantify. This is `InvalidBracedQuantifier` and explicitly a syntax error';
            if (webCompat === WEB_COMPAT_ON) {
              // web compat only:
              // [v]: `/f{/`
              // [x]: `/f{1}/`
              // [x]: `/f{1}?/`
              // [v]: `/f{?/`
              // [v]: `/f{/`
              // [v]: `/f{?/`
              // [v]: `/f{/`u
              // [v]: `/f{?/u`
              // [v]: `/f{/u`
              // [v]: `/f{?/u`
              // IF we can parse a curly quantifier, THEN we throw a syntax error. Otherwise we just parse a `{`
              if (eof()) {
                uflagStatus = regexSyntaxError('Early EOF at the start of a regex quantifier');
              }
              else {
                let c = peek();
                if (!isAsciiNumber(c)) {
                  if (webCompat === WEB_COMPAT_OFF) {
                    if (peeky($$COMMA_2C)) {
                      uflagStatus = regexSyntaxError('The first digit of a regex curly quantifier is mandatory');
                    }
                    else if (peeky($$CURLY_R_7D)) {
                      uflagStatus = regexSyntaxError('A regex curly quantifier had no content');
                    }
                    else {
                      uflagStatus = regexSyntaxError('Found invalid regex curly quantifier');
                    }
                  } else {
                    afterAtom = true; // in webcompat the InvalidBracedQuantifier is an atom
                    if (peeky($$COMMA_2C)) {
                      uflagStatus = updateRegexUflagIsIllegal(uflagStatus, 'The first digit of a regex curly quantifier is mandatory');
                    }
                    else if (peeky($$CURLY_R_7D)) {
                      uflagStatus = updateRegexUflagIsIllegal(uflagStatus, 'A regex curly quantifier had no content');
                    }
                    else {
                      uflagStatus = updateRegexUflagIsIllegal(uflagStatus, 'Found invalid regex curly quantifier');
                    }
                  }
                }
                else if (parseRegexCurlyQuantifier(c)) {
                  uflagStatus = regexSyntaxError(reason);
                }
                else {
                  // This in webcompat is `{` as `ExtendedAtom` is a `ExtendedPatternCharacter`, which does not disallow the curly
                  uflagStatus = updateRegexUflagIsIllegal(uflagStatus, reason);
                  // in web compat mode this case is treated as an extended atom
                  afterAtom = true;
                }
              }
            } else {
              uflagStatus = regexSyntaxError('Encountered unescaped opening curly `{` and the previous character was not part of something quantifiable');
            }
          }
          break;
        case $$CURLY_R_7D: {
          ASSERT_skip($$CURLY_R_7D);
          let reason = 'Encountered unescaped closing curly `}` while not parsing a quantifier';
          if (webCompat === WEB_COMPAT_OFF) {
            // this is always bad since we have a quantifier parser that consumes valid curly pairs
            uflagStatus = regexSyntaxError(reason);
            afterAtom = false;
          } else {
            // in web compat mode you're allowed to have an unescaped curly as atom
            uflagStatus = updateRegexUflagIsIllegal(uflagStatus, reason);
            // in web compat mode this case is treated as an extended atom
            afterAtom = true;
          }
          break;
        }

        case $$CR_0D:
        case $$LF_0A:
        case $$PS_2028:
        case $$LS_2029:
          return regexSyntaxError('Encountered early EOF'); // same as end of input

        default:
          ASSERT_skip(c); // this ought to be a valid regex source character
          afterAtom = true;
      }
      //ASSERT(afterAtom !== 1, 'making sure afterAtom is set everywhere (will break tests but shouldnt throw at all)'); //[' + c + ', x' + c.toString(16) + ')]');

      if (eof()) break;
      c = peek();
    } while (true);

    // this is a fail because we didnt got to the end of input before the closing /
    return regexSyntaxError('Found EOF before regex was closed');
  }
  function parseRegexGroupName(c, uflagStatus, forGroup) {
    ASSERT(parseRegexGroupName.length === arguments.length, 'arg count');

    let r = _parseRegexGroupName(c, uflagStatus, forGroup);

    ASSERT(r === REGEX_ALWAYS_BAD || foundInvalidGroupName || lastParsedIdent !== '', 'a valid parse should always yield an ident, otherwise double check namedBackRefs.push', r);

    if (uflagStatus !== REGEX_ALWAYS_BAD && r === REGEX_ALWAYS_BAD) {
      let reason = 'An illegal group name composition is only valid without u-flag and in webcompat mode';
      if (webCompat === WEB_COMPAT_ON) {
        return updateRegexUflagIsIllegal(uflagStatus, reason);
      } else {
        return regexSyntaxError(reason);
      }
    }

    return r;
  }
  function _parseRegexGroupName(c, uflagStatus, forGroup) {
    ASSERT(parseRegexGroupName.length === arguments.length, 'arg count');

    // Note: you are first supposed to parse the generic regex payload with either ~U,~N or +U,+N, depending on
    // the u-flag. Without the flag, and in web compat mode, you would parse `\k<abc>` first as just an
    // IdentityEscape --> SourceCharacterIdentityEscape --> `[~N] SourceCharacter but not c`
    // The GroupName is just parsed as non-special pattern characters. However, this is what the spec calls
    // https://tc39.es/ecma262/#sec-regexpinitialize
    // >  If the result of parsing contains a GroupName
    // This is rather implicit, since according to the grammar you are not parsing a GroupName (TODO: report this)
    // but since all signs point towards that being the intent;
    // After the first pass, if the `\k` is found with a proper `GroupName` then parse it with `+N` and act
    // normal. Otherwise, for any partial or full absence of the `GroupName`, just don't treat the `<` and `>`
    // as special.
    // We use a global (for now) for this. Set `foundValidGroupName` or `foundInvalidGroupName` and confirm afterwards
    // whether invalid names were found and, if so, no valid names were found. Throw accordingly. (TODO: juggle this)

    let thisNameInvalid = false;

    // [v]: `(?<\u0065ame>xyz)/``
    //          ^
    // [x]: `/(?<x>foo)met\k<\u0065>/`
    //                       ^
    if (c === $$BACKSLASH_5C) {
      // Note: can't backtrack from here. Invalid ident or missing `>` is a syntax error now, in any mode/flag
      // [x]: `/(?<x>foo)met\k<\u0065>/`
      //                       ^
      // [x]: `/(?<x>foo)met\k<\ud87e\udddf>/`
      // [x]: `/(?<x>foo)met\k<\u{2F9DF}>/`

      ASSERT_skip($$BACKSLASH_5C);
      if (eof()) return regexSyntaxError('Found EOF at start of a group name identifier');
      if (!peeky($$U_75)) return regexSyntaxError('Found invalid escape character at the start of a group name identifier');
      ASSERT_skip($$U_75);

      // We need to parse a unicode escape here that can be a quad, a double quad, or a variable length escape
      // However, we also need to know the size of the code point (one or two characters or invalid)
      // Without u-flag, the variable length and non-bmp code points are not considered and will cause an error here.

      c = parseRegexCharClassUnicodeEscape(); // will check EOF first, consume a valid unicode escape, else bail
      let wasDoubleQuad = c & REGEX_CHARCLASS_DOUBLE_QUAD;
      if (wasDoubleQuad) c ^= REGEX_CHARCLASS_DOUBLE_QUAD;
      if (c === INVALID_IDENT_CHAR || c === REGEX_CHARCLASS_BAD) {
        return regexSyntaxError('Found invalid quad unicode escape');
      }
      if ((c & REGEX_CHARCLASS_BAD_SANS_U_FLAG) === REGEX_CHARCLASS_BAD_SANS_U_FLAG) {
        uflagStatus = updateRegexUflagIsMandatory(uflagStatus, 'Encountered extended unicode escape (`\\u{}`) or surrogate pair unicode quads (`\\uxxxx\\uxxxx`) which is only valid with u-flag');
        c = c ^ REGEX_CHARCLASS_BAD_SANS_U_FLAG;
      }

      let wide = isIdentStart(c, CODEPOINT_FROM_ESCAPE);
      // Note: if wide or if the escape was of the `\u{}` form then the uflag will have been updated here so skip that
      if (wide === VALID_SINGLE_CHAR) {
        ASSERT(!wasDoubleQuad, 'The first quad of a valid surrogate pair cannot yield a valid single ident character');
        // [v]: `/(?<\u0041>.)/`
        // Fine with and without u-flag
      }
      else if (wide === VALID_DOUBLE_CHAR) {
        ASSERT(!wasDoubleQuad || (isIdentRestChr(codePointToSurrogateHead(c), CODEPOINT_FROM_ESCAPE) === INVALID_IDENT_CHAR && isIdentRestChr(codePointToSurrogateTail(c), CODEPOINT_FROM_ESCAPE) === INVALID_IDENT_CHAR), 'The first quad of a surrogate pair cannot yield a valid single ident rest character for regex')
        // [x]: `/(?<\ud87e\udddfrest>foo)/`
        // [v]: `/(?<\ud87e\udddfrest>foo)/u`
        // The first character is a valid ident start, however, it only is as a code point, which is only the case
        // when u-flag is present. So this is an error without u-flag, since surrogate pair heads are not valid here.
        if (wasDoubleQuad) {
          uflagStatus = updateRegexUflagIsMandatory(uflagStatus, 'Found a quad that was a surrogate pair which created a valid identifier character and that will only work with u-flag');
        }
      }
      else {
        ASSERT(wide === INVALID_IDENT_CHAR, 'enum');
        // [x]: `/(?<\uD835\uDFD0rest>foo)/`
        //                       ^
        // [x]: `/(?<\u0020ame>xyz)/``
        //                 ^
        // [x]: `/(?<x>foo)\k<\u0020ame>xyz/``
        //                          ^
        return regexSyntaxError('Named capturing group named contained an invalid unicode escaped char', '`' + readNextCodepointAsStringExpensive(c, CODEPOINT_FROM_ESCAPE, true) + '`', c);
      }

      let firstCharStr = readNextCodepointAsStringExpensive(c, CODEPOINT_FROM_ESCAPE, false);
      ASSERT(typeof firstCharStr === 'string', 'readNextCodepointAsStringExpensive should return a string', firstCharStr, c, CODEPOINT_FROM_ESCAPE, false);

      if (peeky($$GT_3E)) {
        // name is one character
        lastParsedIdent = firstCharStr;
      } else {
        uflagStatus = parseRegexIdentifierRest(firstCharStr, uflagStatus); // updates lastParsedIdent
      }
      foundValidGroupName = true;
    } else {
      // [v]: `/(?<name>x)*/`
      //           ^
      // [v]: `/(?<name>x)*/u`
      // [v]: `/(?<輸rest>foo)/u`
      //           ^
      let wide = isIdentStart(c, pointer);
      if (wide === VALID_SINGLE_CHAR) {
        // [v]: `/(?<name>x)*/`
        //           ^
        // [v]: `/(?<name>x)*/u`
        // Fine with and without u-flag
        ASSERT_skip(c);
        foundValidGroupName = true;
      }
      else if (wide === VALID_DOUBLE_CHAR) {
        // [v]: `/(?<輸rest>foo)/u`
        //           ^
        // The first character is a valid ident start, however, it only is as a code point, which is only the case
        // when u-flag is present. So this is an error without u-flag, since surrogate pair heads are not valid here.
        uflagStatus = updateRegexUflagIsMandatory(uflagStatus, 'The start of an group name had a surrogate pair and is therefor only valid with u-flag');
        ASSERT(peeky(c));
        skipFastWithoutUpdatingCache();
        skip();
        foundValidGroupName = true;
      }
      else {
        ASSERT(wide === INVALID_IDENT_CHAR, 'enum');
        // [x]: `/(?<>a)/`
        //           ^
        // [x]: `/(?<4>a)/`
        //           ^
        // [v]: `/(?<𝟐rest>fxoo)/`
        //           ^
        // [x]: `/(?<輸>foo)met\k<�>/u`
        //                        ^
        if (webCompat === WEB_COMPAT_ON) {
          // Ignore this error
          foundInvalidGroupName = true;
          thisNameInvalid = true;
          // Figure out how many chars to skip (slow path)
          let len = codepointLen(c, pointer);
          ASSERT(len === 1 || len === 2, 'codepoints are 1 or 2?', [len, c, pointer]);
          if (len === 1) {
            // [x]: `/(?<>a)/`
            //           ^
            wide = VALID_SINGLE_CHAR;
            ASSERT_skip(c);
          } else {
            // [v]: `/(?<𝟐rest>fxoo)/`
            //           ^
            // Do we need to throw without u-flag? Is it relevant to only skip one character without u-flag? I don't think so because I don't think a valid surrogate tail can lead to a significant syntax character
            wide = VALID_DOUBLE_CHAR;
            ASSERT(peeky(c));
            skipFastWithoutUpdatingCache();
            skip();
          }
        }
        else {
          // (The name must be valid ident so non-ident chars will end the parse prematurely)
          // if (webCompat === WEB_COMPAT_OFF) {
          // [x]: `/(?<x>foo)met\k<#/`
          //                       ^
          // [x]: `/(?<x>foo)met\k<abc#/`
          //                          ^
          // [x]: `/(?<x>foo)met\k<5/`
          //                       ^
          return regexSyntaxError('Wanted to parse an unescaped group name specifier but it had a bad start', '`' + String.fromCharCode(c) + '`', c);
        }
      }

      let firstCharStr = (wide === VALID_DOUBLE_CHAR) ? input.slice(pointer - 2, pointer) : String.fromCharCode(c);

      if (peeky($$GT_3E)) {
        // name is one character
        lastParsedIdent = firstCharStr;
      }
      else {
        uflagStatus = parseRegexIdentifierRest(firstCharStr, uflagStatus); // updates lastParsedIdent
        if (uflagStatus === REGEX_ALWAYS_BAD) return REGEX_ALWAYS_BAD;
      }

      if (thisNameInvalid) {
        // Prevent backreference errors. If the group name is allowed to be an invalid ident then it won't matter
        // and otherwise the presence of a valid group name will trigger this error.
        lastParsedIdent = '';
      }
    }

    if (eof()) {
      return regexSyntaxError('Missing closing angle bracket of name of capturing group', eof() || ('`' + readNextCodepointAsStringExpensive(peek(), pointer, true) + '`'), eof() || peek());
    }
    if (!peeky($$GT_3E)) {
      // I think this error should not be recoverable in web compat mode but tests seem to disagree
      let reason = 'Missing closing angle bracket of name of capturing group';
      if (webCompat === WEB_COMPAT_OFF) {
        return regexSyntaxError(reason);
      } else {
        return updateRegexUflagIsIllegal(uflagStatus, reason);
      }
    }

    ASSERT_skip($$GT_3E);

    if (lastParsedIdent) {
      // This enables +N mode, meaning `\k` is now disallowed in char classes in webcompat mode too
      if (forGroup) {
        declGroupName += lastParsedIdent + ',';
      } else {
        // We can only verify existence after completing the body
        refGroupName += lastParsedIdent + ',';
      }
    }

    return uflagStatus;
  }
  function parseRegexAtomEscape(c, namedBackRefs) {
    // backslash already parsed, c is peeked
    // return REGEX_*** enum

    // -- u flag is important
    // -- u flag can affect range (surrogate pairs in es5 vs es6)
    // -- char class range _must_ be low-hi unless dash is the first or last char
    // -- \u{...} only allowed with u flag
    // -- unicode, digit, char, hex escapes

    switch (c) {
      case $$U_75:
        ASSERT_skip($$U_75);
        return parseRegexAtomUnicodeEscape();

      // hex
      case $$X_78:
        ASSERT_skip(c);
        if (eof()) return regexSyntaxError('Encountered early EOF while parsing hex escape (1)');
        let a = peek();
        if (!isHex(a)) {
          let reason = 'First char of hex escape not a valid digit';
          if (webCompat === WEB_COMPAT_ON) {
            return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
          } else {
            return regexSyntaxError(reason);
          }
        }
        ASSERT_skip(a);
        if (eof()) return regexSyntaxError('Encountered early EOF while parsing hex escape (2)');
        let b = peek();
        if (!isHex(b)) {
          let reason = 'Second char of hex escape not a valid digit';
          if (webCompat === WEB_COMPAT_ON) {
            return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
          } else {
            return regexSyntaxError(reason);
          }
        }
        ASSERT_skip(b);
        return REGEX_ALWAYS_GOOD;

      // char escapes
      case $$C_63:
        ASSERT_skip($$C_63);
        if (eof()) return regexSyntaxError('Encountered early EOF while parsing char escape');
        let d = peek();
        if (isAsciiLetter(d)) {
          ASSERT_skip(d);
          return REGEX_ALWAYS_GOOD;
        }
        let reason = 'Illegal char escape char (ord=' + d + ')';
        if (webCompat === WEB_COMPAT_ON) {
          // this is now an `IdentityEscape` and just parses the `c` itself
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
        } else {
          return regexSyntaxError(reason);
        }

      // control escapes
      case $$F_66:
        ASSERT_skip(c);
        return REGEX_ALWAYS_GOOD;

      case $$N_6E:
      case $$R_72:
      case $$T_74:
      case $$V_76:

      // char class escapes
      case $$D_64:
      case $$D_UC_44:
      case $$S_73:
      case $$S_UC_53:
      case $$W_77:
      case $$W_UC_57:
        // "an error occurs if either ClassAtom does not represent a single character (for example, if one is \w)"
        ASSERT_skip(c);
        return REGEX_ALWAYS_GOOD;

      // Unicode property escapes \p{<?...?>} \P{<?...?>}
      case $$P_70:
      case $$P_UC_50:
        const NOT_FROM_CHAR_CLASS = false;
        let regexPropState = parseRegexPropertyEscape(c, NOT_FROM_CHAR_CLASS);
        if (regexPropState === REGEX_ALWAYS_BAD) {
          ASSERT(regexPropState !== REGEX_ALWAYS_BAD || lastReportableTokenizerError, 'if not good then error should be set');
          return REGEX_ALWAYS_BAD;
        } else if (regexPropState === REGEX_GOOD_SANS_U_FLAG) {
          ASSERT(lastPotentialRegexError, 'potential error should have been processed by now');
          // semantically ignored without u-flag, syntactically only okay in web-compat / Annex B mode
          if (webCompat === WEB_COMPAT_ON) return regexPropState;
          return regexSyntaxError('(assertion fail)');
        } else if (regexPropState !== REGEX_ALWAYS_GOOD) {
          ASSERT(regexPropState === REGEX_GOOD_WITH_U_FLAG, 'enum');
          if (webCompat === WEB_COMPAT_ON) return TODO,REGEX_ALWAYS_GOOD; // confirm when a with-uflag is overturned by webcompat
          return REGEX_GOOD_WITH_U_FLAG;
        } else {
          return REGEX_ALWAYS_GOOD;
        }

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
        return REGEX_ALWAYS_GOOD;

      // digits
      case $$0_30:
        ASSERT_skip($$0_30);
        // cannot be followed by another digit unless webcompat
        if (eof()) return REGEX_ALWAYS_GOOD; // let error happen elsewhere
        if (isAsciiNumber(peek())) {
          let reason = 'Back references can not have more two or more consecutive numbers';
          if (webCompat === WEB_COMPAT_ON) {
            return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
          } else {
            return regexSyntaxError(reason);
          }
        }
        return REGEX_ALWAYS_GOOD;

      case $$1_31:
      case $$2_32:
      case $$3_33:
      case $$4_34:
      case $$5_35:
      case $$6_36:
      case $$7_37:
      case $$8_38:
      case $$9_39:
        return parseRegexDecimalEscape(c);

      case $$K_6B: {
        // named backreference

        let uflagStatus = REGEX_ALWAYS_GOOD;

        ASSERT_skip($$K_6B);
        if (eof()) return regexSyntaxError('Early EOF while parsing `\\k` escape in regex character class');
        c = peek();
        if (c !== $$LT_3C) {
          let reason = 'Named back reference \\k; missing group name';
          if (webCompat === WEB_COMPAT_OFF) {
            return regexSyntaxError(reason, c);
          }
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
        }
        ASSERT_skip($$LT_3C);
        if (eof()) return regexSyntaxError('Early EOF while parsing `\\k` escape in regex character class');
        c = peek();

        const FOR_K_ESCAPE = false;
        uflagStatus = parseRegexGroupName(c, uflagStatus, FOR_K_ESCAPE);
        if (lastParsedIdent !== '') namedBackRefs.push(lastParsedIdent); // we can only validate ths after completely parsing the regex body

        // If the group name contained a `\u{..}` escape then the u-flag must be valid for this regex to be valid
        return uflagStatus;
      }

      case $$FWDSLASH_2F:
        // explicitly allowed
        ASSERT_skip($$FWDSLASH_2F);
        return REGEX_ALWAYS_GOOD;

      case $$CR_0D:
      case $$LF_0A:
      case $$PS_2028:
      case $$LS_2029:
        // Line continuation is not supported in regex and the escape is explicitly disallowed
        // https://tc39.es/ecma262/#prod-RegularExpressionNonTerminator
        ASSERT_skip(c);
        return regexSyntaxError('Regular expressions do not support line continuations (escaped newline)');

      default:
        // this is, probably;
        //
        // IdentityEscape [U] ::
        //   [+U] SyntaxCharacter
        //   [+U] /
        //   [~U] SourceCharacter but not UnicodeIDContinue
        //
        // Note: SyntaxCharacter and `/` is already checked in the switch above, so we focus on the ~U step

        let wide = isIdentRestChr(c, pointer);
        if (wide === VALID_DOUBLE_CHAR) {
          // The regex is already invalid with u-flag but (still?) valid without u-flag because the code _point_ is a
          // id_continue while the code _unit_ is just a surrogate head, which by itself is not an id_continue. So it
          // does not violate the syntax.

          c = input.codePointAt(pointer);
          skipFastWithoutUpdatingCache();
          skip();
        } else if (wide === VALID_SINGLE_CHAR) {
          // backslash is parsed, c is peeked
          // This means the code unit is a valid unicode continue character, which is not legal with or without u-flag
          // In webcompat mode it is still legal as long as it isn't a `c` or, with +N, a `k`.

          ASSERT_skip(c);
          if (webCompat === WEB_COMPAT_OFF) {
            return regexSyntaxError('Cannot escape this regular identifier character [ord=' + c + '][' + String.fromCharCode(c) + ']');
          }
        } else {
          ASSERT(wide === INVALID_IDENT_CHAR, 'enum');
          // Illegal ident chars are fine to escape, apparently.
          ASSERT_skip(c);
        }

        // Ok, atom escape was acceptable but only without u-flag
        return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'Atom escape can only escape certain syntax chars with u-flag');
    }
    THROW('dis be dead code');
  }
  function parseRegexDecimalEscape(c) {
    // parseBackReference

    // https://tc39.github.io/ecma262/#prod-DecimalEscape
    //   DecimalEscape :: NonZeroDigit DecimalDigits opt [lookahead ∉ DecimalDigit

    // https://tc39.github.io/ecma262/#sec-decimalescape
    //   If \ is followed by a decimal number n whose first digit is not 0, then the escape sequence is considered to
    //   be a backreference. It is an error if n is greater than the total number of left-capturing parentheses in
    //   the entire regular expression.
    // In web compat mode this extra condition is dropped

    ASSERT(c >= $$1_31 && c <= $$9_39, 'should be digit 1~9');
    ASSERT_skip(c);

    if (eof()) return regexSyntaxError('Early EOF while parsing decimal escape in regex');
    let d = peek();
    if (d >= $$0_30 && d <= $$9_39) {
      ASSERT_skip(d);
      let e = peek();
      if (e >= $$0_30 && e <= $$9_39) {
        let reason = 'Parsed too many digits';
        if (webCompat === WEB_COMPAT_ON) {
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
        } else {
          return regexSyntaxError(reason);
        }
      } else {
        largestBackReference = Math.max(((c - $$0_30) * 10) + (d - $$0_30))
      }
    } else {
      largestBackReference = Math.max(largestBackReference, c - $$0_30)
    }

    return REGEX_ALWAYS_GOOD;
  }
  function parseRegexAtomUnicodeEscape() {
    // Return REGEX_*** enum

    // if unicode flag
    // - surrogate pairs may matter
    // - class char status matters
    // - long unicode escape is allowed

    // we dont know whether u-mode is enabled until after we've parsed the flags
    // so we must parse as loose as possible and keep track of parsing specific u-flag or non-u-flag stuff
    // then after flag parsing confirm that the flag presence conforms to expectations

    lastRegexUnicodeEscapeOrd = 0;

    if (eofd(3)) { // We are after the `\u` and now we parse either 4 hex digits or, at least, `{}` and one hex digit
      return regexSyntaxError('Early EOF while trying to parse unicode escape');
    }
    let c = peek(); // dont read. we dont want to consume a bad \n here
    if (c === $$CURLY_L_7B) {
      ASSERT_skip($$CURLY_L_7B);
      let r = parseRegexAtomUnicodeEscapeVary();
      if (r === GOOD_ESCAPE) {
        if (eof()) return regexSyntaxError('Early EOF after parsing variable unicode escape in regex');
        ASSERT_skip($$CURLY_R_7D);
        return updateRegexUflagIsMandatory(REGEX_ALWAYS_GOOD, 'The es6 unicode escape `\\u{...}` is only valid in regex with a u-flag');
      }
      return regexSyntaxError('Error while trying to parse new unicode escape');
    } else {
      return parseRegexAtomUnicodeEscapeQuad(c);
    }
  }
  function parseRegexAtomUnicodeEscapeQuad(a) {
    // we've already consumed a. we must consume 3 more chars for this quad unicode escape
    if (eofd(3)) {
      let reason = 'Encountered early EOF while parsing a unicode escape quad';
      if (webCompat === WEB_COMPAT_ON) {
        // can still be `/\u/` so let EOF be checked elsewhere...
        return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
      } else {
        return regexSyntaxError(reason);
      }
    }
    let b = peekd(1);
    let c = peekd(2);
    let d = peekd(3);

    // if this is a bad escape then dont consume the chars. one of them could be a closing quote
    if (isHex(a) && isHex(b) && isHex(c) && isHex(d)) {
      // okay, _now_ consume them
      ASSERT(ASSERT_peekUncached() === a);
      skipFastWithoutUpdatingCache();
      ASSERT(ASSERT_peekUncached() === b);
      skipFastWithoutUpdatingCache();
      ASSERT(ASSERT_peekUncached() === c);
      skipFastWithoutUpdatingCache();
      ASSERT(ASSERT_peekUncached() === d);
      skip();
      let firstPart = hexToNum(a) << 12 | hexToNum(b) << 8 | hexToNum(c) << 4 | hexToNum(d);

      // Is this a surrogate high byte? then we'll try another one
      if (firstPart >= 0xD800 && firstPart <= 0xDBFF) {
        // pretty slow path but we're constructing a low+hi surrogate pair together here
        if (!eofd(5) && peek() === $$BACKSLASH_5C && peekd(1) === $$U_75 && isHex(peekd(2)) && isHex(peekd(3)) && isHex(peekd(4)) && isHex(peekd(5))) {
          let a = peekd(2);
          let b = peekd(3);
          let c = peekd(4);
          let d = peekd(5);
          let secondPart = hexToNum(a) << 12 | hexToNum(b) << 8 | hexToNum(c) << 4 | hexToNum(d);

          if (secondPart >= 0xDC00 && secondPart <= 0xDFFF) {
            /*
              https://en.wikipedia.org/wiki/UTF-16
              To decode U+10437 (𐐷) from UTF-16:
              Take the high surrogate (0xD801) and subtract 0xD800, then multiply by 0x400, resulting in 0x0001 * 0x400 = 0x0400.
              Take the low surrogate (0xDC37) and subtract 0xDC00, resulting in 0x37.
              Add these two results together (0x0437), and finally add 0x10000 to get the final decoded UTF-32 code point, 0x10437.
             */
            // firstPart = 0xD801;
            // secondPart = 0xDC37;
            // let expected = 0x10437;

            // now skip `\uxxxx` (6)
            ASSERT(ASSERT_peekUncached() === $$BACKSLASH_5C);
            skipFastWithoutUpdatingCache();
            ASSERT(ASSERT_peekUncached() === $$U_75);
            skipFastWithoutUpdatingCache();
            ASSERT(ASSERT_peekUncached() === a);
            skipFastWithoutUpdatingCache();
            ASSERT(ASSERT_peekUncached() === b);
            skipFastWithoutUpdatingCache();
            ASSERT(ASSERT_peekUncached() === c);
            skipFastWithoutUpdatingCache();
            ASSERT(ASSERT_peekUncached() === d);
            skip();

            // we have a matching low+hi, combine them
            lastRegexUnicodeEscapeOrd = surrogateToCodepoint(firstPart, secondPart);
            return REGEX_ALWAYS_GOOD; // Without u-flag it won't matter for atom escapes and can't lead to syntax errors
          }
        }
      }

      lastRegexUnicodeEscapeOrd = firstPart;
      return REGEX_ALWAYS_GOOD; // outside char classes we can ignore surrogates
    } else {
      let reason = 'Encountered bad character while trying to parse a unicode escape quad';
      if (webCompat === WEB_COMPAT_ON) {
        lastRegexUnicodeEscapeOrd = parseInt(a+b+c+d, 16); // *shrug*
        return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
      } else {
        return regexSyntaxError(reason);
      }
    }
  }
  function parseRegexAtomUnicodeEscapeVary() {
    // "It is a Syntax Error if the MV of HexDigits > 1114111."
    // this means the actual hex value cannot exceed 6 chars (0x10ffff). however,
    // it can have any number of leading zeroes so we still need to loop

    // must at least parse one hex digit (but it may be invalid so we can't read())
    if (eof()) return GOOD_ESCAPE;  // first one is mandatory
    let a = peek();
    if (!isHex(a)) {
      // First one is mandatory
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape started with non-hex character (0-9a-f)';
      return BAD_ESCAPE;
    }
    ASSERT_skip(a);

    return _parseRegexUnicodeEscapeVary(a);
  }
  function _parseRegexUnicodeEscapeVary(a) {
    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return GOOD_ESCAPE;
      a = skipZeroes();
      if (!isHex(a)) {
        // note: we already asserted a zero
        if (a === $$CURLY_R_7D) {
          lastRegexUnicodeEscapeOrd = 0;
          return GOOD_ESCAPE
        }
        if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape contained at least one non-hex character (0-9a-f)';
        return BAD_ESCAPE;
      }
      ASSERT_skip(a);
    }
    return ___parseRegexUnicodeEscapeVary(a);
  }
  function ___parseRegexUnicodeEscapeVary(a) {
    if (eof()) return GOOD_ESCAPE;
    let b = peek();
    if (!isHex(b)) {
      if (b === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a);
        return GOOD_ESCAPE
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape contained at least one non-hex character (0-9a-f)';
      return BAD_ESCAPE;
    }
    ASSERT_skip(b);
    return ____parseRegexUnicodeEscapeVary(a, b);
  }
  function ____parseRegexUnicodeEscapeVary(a, b) {
    if (eof()) return GOOD_ESCAPE;
    let c = peek();
    if (!isHex(c)) {
      if (c === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 4 | hexToNum(b);
        return GOOD_ESCAPE
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape contained at least one non-hex character (0-9a-f)';
      return BAD_ESCAPE;
    }
    ASSERT_skip(c);
    return _____parseRegexUnicodeEscapeVary(a, b, c);
  }
  function _____parseRegexUnicodeEscapeVary(a, b, c) {
    if (eof()) return GOOD_ESCAPE;
    let d = peek();
    if (!isHex(d)) {
      if (d === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 8 | hexToNum(b) << 4 | hexToNum(c);
        return GOOD_ESCAPE
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape contained at least one non-hex character (0-9a-f)';
      return BAD_ESCAPE;
    }
    ASSERT_skip(d);
    return ______parseRegexUnicodeEscapeVary(a, b, c, d);
  }
  function ______parseRegexUnicodeEscapeVary(a, b, c, d) {
    if (eof()) return GOOD_ESCAPE;
    let e = peek();
    if (!isHex(e)) {
      if (e === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 12 | hexToNum(b) << 8 | hexToNum(c) << 4 | hexToNum(d);
        return GOOD_ESCAPE
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape contained at least one non-hex character (0-9a-f)';
      return BAD_ESCAPE;
    }
    ASSERT_skip(e);
    return _______parseRegexUnicodeEscapeVary(a, b, c, d, e);
  }
  function _______parseRegexUnicodeEscapeVary(a, b, c, d, e) {
    if (eof()) return GOOD_ESCAPE;
    let f = peek();
    if (!isHex(f)) {
      if (f === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 16 | hexToNum(b) << 12 | hexToNum(c) << 8 | hexToNum(d) << 4 | hexToNum(e);
        return GOOD_ESCAPE
      }
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape contained at least one non-hex character (0-9a-f)';
      return BAD_ESCAPE;
    }
    ASSERT_skip(f);
    return ________parseRegexUnicodeEscapeVary(a, b, c, d, e, f);
  }
  function ________parseRegexUnicodeEscapeVary(a, b, c, d, e, f) {
    let codePoint = hexToNum(a) << 20 | hexToNum(b) << 16 | hexToNum(c) << 12 | hexToNum(d) << 8 | hexToNum(e) << 4 | hexToNum(f);
    // the total may not exceed 0x10ffff
    if (codePoint > 0x10ffff) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape escaped a code point that was out of bounds (>0x10ffff)';
      return BAD_ESCAPE;
    }
    if (eof()) return GOOD_ESCAPE;
    if (!peeky($$CURLY_R_7D)) {
      if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Variable unicode escape was not closed after finding the max allowed hex digits';
      return BAD_ESCAPE;
    }
    lastRegexUnicodeEscapeOrd = codePoint;
    return GOOD_ESCAPE;
  }

  function parseRegexCharClass() {
    // Parse a character class (a set of chars by which to match one character)
    // The problem is a combination of;
    // - ranges
    // - u-flag enabling surrogate pairs
    // - surrogate heads and tails can appear without the other without error
    // - flags only known after the body is parsed
    // This leads to situations where the same dash may mean a range with the u-flag and it may mean an actual dash
    // without the u-flag and vice versa. You can even run into situations where the range is different with and without
    // u-flag. In some cases these ranges are both valid, in some cases both invalid, and in some cases only one of the
    // two ranges is valid. Bonkers. And you wont know until you parsed the flags whether which case to enforce!

    // Since we want to parse the regex before knowing the flag and do not want to backtrack, we have to track these
    // ranges and its progress in two separate ways while progressing the pointer of the same lexer. Fun!

    // Note that surrogate pairs (only supported with u-flag) can only appear as a pair as literal characters, or as
    // the variable unicode escape (`\u{...}`), or as a double quad escape (`\uxxxx\uxxxx`). Other escapes or a mix of
    // these methods will not lead to a pair, which can be important for validating ranges with and without u-flag.

    ASSERT_skip($$SQUARE_L_5B);

    let prev = 0;
    let surrogate = 0; // current surrogate if prev is a head and c is a tail
    let isSurrogate = false;
    let isSurrogateHead = false;
    let wasSurrogate = true; // start at surrogate boundary
    let wasSurrogateHead = false; // there was no prev char
    let urangeOpen = false; // we have not yet seen a range dash in umode
    let urangeLeft = -1; // track codepoint of left of range
    let nrangeOpen = false; // we have not yet seen a range dash in no-umode
    let nrangeLeft = -1; // track codeunit of left of range

    let flagState = REGEX_ALWAYS_GOOD;

    if (eof()) return regexSyntaxError('Encountered early EOF while parsing char class (1)');
    let c = peek();
    if (c === $$XOR_5E) { // the separate inverting caret check is important for surrogate range checks in super edge cases (there's a test)
      ASSERT_skip($$XOR_5E);
      if (eof()) return regexSyntaxError('Encountered early EOF while parsing char class (2)');
      c = peek();
    }

    // With u-flag, a surrogate pair encoded as double unicode escaped quads must be consumed as one char. Without
    // u-flag, each quad must be consumed individually but we must still forward the scanner when finding it (for
    // u-flag support). So we'll cache the second quad, which must be a valid surrogate tail in such case (so no
    // worries about that stuff) so that we can process it separately
    // Keep in mind; no mixing of surrogate pair encoding. Either both literal, one variable unicode, or double quads.

    while (c !== $$SQUARE_R_5D) {
      // There is no single escape that can be combined with an existing character here as a surrogate pair.
      // Variable escapes can yield codepoints > 0xffff, and double quad unicode escapes can. Only other way is literal.
      let wasEscape = false;
      let wasDoubleQuad = false;
      if (c === $$BACKSLASH_5C) {
        ASSERT_skip($$BACKSLASH_5C);
        wasEscape = true;
        // `c` may be >0xffff by variable unicode escape or double quad unicode escape (only...)
        c = parseRegexCharClassEscape();
        // It matters explicitly for this function due to unicode range ambiguity. For double quad the second quad may
        // be part of a new range which may be relevant in case there is no u-flag.
        wasDoubleQuad = c & REGEX_CHARCLASS_DOUBLE_QUAD;
        if (wasDoubleQuad) c ^= REGEX_CHARCLASS_DOUBLE_QUAD;
        if (c === REGEX_CHARCLASS_BAD) {
          // `/[\N]/`
          ASSERT(lastPotentialRegexError, 'error should be set');
          flagState = regexSyntaxError(lastPotentialRegexError);
        } else if (c === (REGEX_CHARCLASS_BAD | REGEX_CHARCLASS_CLASS_ESCAPE)) {
          // (Currently) only happens for property escapes that are illegal
          // `/[\p{x}]/`
          ASSERT(lastPotentialRegexError, 'error should be set');
          flagState = regexSyntaxError(lastPotentialRegexError);
          c = REGEX_CHARCLASS_CLASS_ESCAPE;
        } else if (c === REGEX_CHARCLASS_CLASS_ESCAPE) {
          // For example: escaped dash

        } else if (c === INVALID_IDENT_CHAR) {
          ASSERT(lastPotentialRegexError, 'error should be set');
          flagState = regexSyntaxError(lastPotentialRegexError);
        } else if (c === REGEX_CHARCLASS_ESCAPED_UC_B) {
          ASSERT(lastPotentialRegexError, 'error should be set');
          flagState = updateRegexUflagIsIllegal(flagState, lastPotentialRegexError);
          // In webcompat this is an identity escape, which get the ord of the char being escaped
          // But this is only necessary for range checks, at which point this would be an error anyways.
        } else if (c === REGEX_CHARCLASS_ESCAPED_C) {
          ASSERT(webCompat === WEB_COMPAT_ON, 'only appears with web compat');
          ASSERT(lastPotentialRegexError, 'error should be set');
          flagState = updateRegexUflagIsIllegal(flagState, lastPotentialRegexError);
          c = $$BACKSLASH_5C; // yes... NOT `c`
        } else {
          if (c & REGEX_CHARCLASS_BAD_WITH_U_FLAG) {
            c = c ^ REGEX_CHARCLASS_BAD_WITH_U_FLAG; // remove the CHARCLASS_BAD_WITH_U_FLAG flag (dont use ^= because that deopts... atm; https://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean )
            ASSERT(lastPotentialRegexError, 'error should be set');
            flagState = updateRegexUflagIsIllegal(flagState, lastPotentialRegexError);
            ASSERT(flagState === REGEX_GOOD_SANS_U_FLAG || flagState === REGEX_ALWAYS_BAD, 'either way, the flag state should now reflect "bad with u-flag", or worse');
          }
          if (c & REGEX_CHARCLASS_BAD_SANS_U_FLAG) {
            c = c ^ REGEX_CHARCLASS_BAD_SANS_U_FLAG; // remove the REGEX_CHARCLASS_BAD_SANS_U_FLAG flag (dont use ^= because that deopts... atm; https://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean )
            ASSERT(lastPotentialRegexError, 'error should be set');
            flagState = updateRegexUflagIsMandatory(flagState, lastPotentialRegexError);
            ASSERT(flagState === REGEX_GOOD_WITH_U_FLAG || flagState === REGEX_ALWAYS_BAD, 'either way, the flag state should now reflect "bad with u-flag", or worse');
          }
        }
        ASSERT(c === REGEX_CHARCLASS_CLASS_ESCAPE || c === REGEX_CHARCLASS_ESCAPED_UC_B || c <= 0x110000, 'c should now be valid unicode range or 0x110000 for error', c, (REGEX_CHARCLASS_BAD | REGEX_CHARCLASS_CLASS_ESCAPE), REGEX_CHARCLASS_BAD_SANS_U_FLAG, REGEX_CHARCLASS_BAD_WITH_U_FLAG, REGEX_CHARCLASS_ESCAPED_UC_B);
        // else char class is good :)
      } else if (urangeOpen && c === $$SQUARE_R_5D) {
        flagState = regexSyntaxError('Encountered early end of charclass while parsing character class range');
      } else if (c === $$CR_0D || c === $$LF_0A || c === $$PS_2028 || c === $$LS_2029) {
        return regexSyntaxError('Encountered newline'); // same as end of input
      } else {
        ASSERT_skip(c);
      }

      if (wasEscape) {
        // Even if `c` is a surrogate tail, this won't lead to a pair with a previous code unit
        // But if the current codepoint is >0xffff then we still mark it as such
        // Also stops escaped dashes from being interpreted as ranges
        isSurrogate = c > 0xffff;
        ASSERT(!isSurrogate || c === REGEX_CHARCLASS_CLASS_ESCAPE || (c & 0x1fffff) === c, 'non-bmp ranges should be explicitly bounded when they come from escapes', c, isSurrogate, (c & 0x1fffff) === c, c.toString(16), (c & 0x1fffff));
        if (isSurrogate) surrogate = c;
        isSurrogateHead = false;
      } else if (c === REGEX_CHARCLASS_CLASS_ESCAPE || c === REGEX_CHARCLASS_ESCAPED_UC_B) {
        isSurrogate = false;
        isSurrogateHead = false;
      } else if (wasSurrogateHead && isSurrogateTail(c)) {
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

      // For the case where there IS a u-flag:
      if (urangeOpen) {
        // if c is a head we must check the next char for being a tail before we can determine the code _point_
        // otoh, if c is a tail or a non-surrogate then we can now safely do range checks since the codepoint wont change
        // if this is a head and the previous was too then the previous was the rhs on its own and we check `prev` instead
        let urangeRight = isSurrogate ? surrogate : wasSurrogateHead ? prev : c;
        if (
          urangeLeft === REGEX_CHARCLASS_CLASS_ESCAPE ||
          urangeRight === REGEX_CHARCLASS_CLASS_ESCAPE
        ) {
          // Class escapes are illegal for ranges
          let reason = 'Character class escapes `\\d \\D \\s \\S \\w \\W \\p \\P` are only ok as a range with webcompat, without uflag';
          flagState = updateRegexUflagIsIllegal(flagState, reason);
        } else if (
          urangeLeft === REGEX_CHARCLASS_ESCAPED_UC_B ||
          urangeRight === REGEX_CHARCLASS_ESCAPED_UC_B
        ) {
          // Class escapes are illegal for ranges
          let reason = 'Character class escapes `\\B` is never legal with u-flag';
          flagState = updateRegexUflagIsIllegal(flagState, reason);
        } else if (!isSurrogateHead || wasSurrogateHead) {
          urangeOpen = false;
          ASSERT(urangeLeft !== REGEX_CHARCLASS_ESCAPED_UC_B || lastPotentialRegexError, 'error should have been set when flag was returned');
          ASSERT(urangeRight !== REGEX_CHARCLASS_ESCAPED_UC_B || lastPotentialRegexError, 'error should have been set when flag was returned');
          if (urangeLeft > urangeRight) {
            flagState = updateRegexUflagIsIllegal(flagState, 'Encountered incorrect range (left>right) which is illegal with u-flag');
          }
          urangeLeft = -1;
        } else {
          // range remains open because this was a surrogate head and the next character may still be part of the range
        }
      } else if (c === $$DASH_2D && !wasEscape && urangeLeft !== -1) {
        ASSERT(urangeLeft !== -1, 'U: if we are opening a range here then we should have parsed and set the left codepoint value by now');
        // If the dash was escaped, it should not cause a range
        urangeOpen = true;
      } else {
        ASSERT(urangeOpen === false, 'U: we should only be updating left codepoint if we are not inside a range');
        urangeLeft = isSurrogate ? surrogate : c;
      }

      // https://tc39.es/ecma262/#sec-patterns-static-semantics-early-errors
      // > NonemptyClassRanges :: ClassAtom `-` ClassAtomClassRanges
      // > It is a Syntax Error if IsCharacterClass of the first ClassAtom is true or IsCharacterClass of the second ClassAtom is true.
      // > It is a Syntax Error if IsCharacterClass of the first ClassAtom is false and IsCharacterClass of the second ClassAtom is false and the CharacterValue of the first ClassAtom is larger than the CharacterValue of the second ClassAtom.
      // > NonemptyClassRangesNoDash :: ClassAtomNoDash `-` ClassAtomClassRanges
      // > It is a Syntax Error if IsCharacterClass of ClassAtomNoDash is true or IsCharacterClass of ClassAtom is true.
      // > It is a Syntax Error if IsCharacterClass of ClassAtomNoDash is false and IsCharacterClass of ClassAtom is false and the CharacterValue of ClassAtomNoDash is larger than the CharacterValue of ClassAtom.
      // So a>b is bad regardles of uflag
      // Webcompat does not change this, it only affects isCharacterClass checks
      // https://tc39.es/ecma262/#sec-patterns-static-semantics-early-errors-annexb

      // For the case where there is NO u-flag:
      let cTmp = c;
      let cTail = c; // If double quad, this will hold the second quad ("low surrogate") while the first is processed
      let stillDataLeft = true;
      while (stillDataLeft) {
        // Deal with the "surrogate pair encoded as double quads are ignored without u-flag" case first
        if (wasDoubleQuad) {
          // - `/[\uD800\uDC00-\uFFFF]/`
          //                  ^
          // `c` contains the ord for the surrogate pair encoded by a quad. The quad _must_ be surrogate head + tail here.
          ASSERT(cTmp > 0xffff, 'a double quad is only consumed if it is a valid surrogate pair, which in turn must be >0xffff');
          // Without u-flag we can only consume the head part here so buffer the tail for next loop iteration
          wasDoubleQuad = false;

          cTail = codePointToSurrogateTail(cTmp);
          cTmp = codePointToSurrogateHead(cTmp);
          ASSERT(cTail >= 0xDC00 && cTail <= 0xDFFF, 'must be surrogate tail');
          ASSERT(cTmp >= 0xD800 && cTmp <= 0xDBFF, 'must be surrogate head');
        } else {
          // Processing the surrogate tail of a double unicode encoded quad now
          stillDataLeft = false;
          cTmp = cTail; // Note: cTail can still be >0xffff if it's the first iteration. But that's a syntax error -u
          ASSERT(cTail <= 0xffff || cTail > 0x10ffff || lastPotentialRegexError, 'either ctail is <=0xffff, a high end flag, or a sans flag error is prepared', cTail, c);
        }

        if (nrangeOpen) {
          const nrangeRight = cTmp; // without u-flag it's always just one char
          if (
            nrangeLeft === REGEX_CHARCLASS_CLASS_ESCAPE ||
            nrangeRight === REGEX_CHARCLASS_CLASS_ESCAPE
          ) {
            // Class escapes are illegal for ranges, however, they are allowed and ignored in webcompat mode
            // The webcompat checks have happened before (because \d \D \s \S \w \W are treated differently from \p \P)
            let reason = 'Character class escapes `\\d \\D \\s \\S \\w \\W \\p \\P` are only ok as a range with webcompat, without uflag';
            if (webCompat === WEB_COMPAT_ON) {
              // return REGEX_CHARCLASS_BAD_SANS_U_FLAG;
            } else {
              // when not in webcompat mode, it may also be the case that a range lhs or rhs is a class escape (\s \d \w etc)
              flagState = updateRegexUflagIsMandatory(flagState, reason);
            }
          } else if (
            nrangeLeft === REGEX_CHARCLASS_ESCAPED_UC_B ||
            nrangeRight === REGEX_CHARCLASS_ESCAPED_UC_B
          ) {
            // Class escapes are illegal for ranges
            let reason = 'Character class escapes `\\B` is never legal as part of a char class range';
            flagState = updateRegexUflagIsIllegal(flagState, reason);
          } else {
            ASSERT(nrangeLeft !== REGEX_CHARCLASS_ESCAPED_UC_B || lastPotentialRegexError, 'error should have been set when flag was returned');
            ASSERT(nrangeRight !== REGEX_CHARCLASS_ESCAPED_UC_B || lastPotentialRegexError, 'error should have been set when flag was returned');
            if (nrangeLeft > nrangeRight) {
              flagState = updateRegexUflagIsMandatory(flagState, 'Encountered incorrect range (left>right) when parsing as if without u-flag');
            } else if (isSurrogateHead) {

              flagState = updateRegexUflagIsMandatory(flagState, 'Class had a range with right side being surrogate pair which is only recognized as a single codepoint with uflag but uflag was missing');
            }
          }
          nrangeLeft = -1;
          nrangeOpen = false;
        } else if (cTmp === $$DASH_2D && !wasEscape && nrangeLeft !== -1) {
          ASSERT(nrangeLeft !== -1, 'N if we are opening a range here then we should have parsed and set the left codepoint value by now');
          // If the dash was escaped, it should not cause a range
          nrangeOpen = true;
        } else {
          // ASSERT(nrangeLeft === -1, 'N apparently we werent in a range so this should be the start of a left side of a codepoint and the var should be cleared');
          ASSERT(nrangeOpen === false, 'N we should only be updating left codepoint if we are not inside a range');
          nrangeLeft = cTmp;
        }
      }

      wasSurrogate = isSurrogate;
      wasSurrogateHead = isSurrogateHead;
      prev = c;

      if (eof()) {
        return regexSyntaxError('Unexpected early EOF while parsing character class'); // no end
      }
      c = peek();
    }
    return parseRegexCharClassEnd(urangeOpen, wasSurrogateHead, urangeLeft, prev, flagState);
  }

  ASSERT(surrogateToCodepoint(0xD801, 0xDC37) === 0x10437);
  ASSERT(codePointToSurrogateHead(0x10437) === 0xD801);
  ASSERT(codePointToSurrogateTail(0x10437) === 0xDC37);
  ASSERT(surrogateToCodepoint(codePointToSurrogateHead(0x10437), codePointToSurrogateTail(0x10437)) === 0x10437);

  function surrogateToCodepoint(head, tail) {
    /*
      https://en.wikipedia.org/wiki/UTF-16
      To decode U+10437 (𐐷) from UTF-16:
      Take the high surrogate (0xD801) and subtract 0xD800, then multiply by 0x400, resulting in 0x0001 * 0x400 = 0x0400.
      Take the low surrogate (0xDC37) and subtract 0xDC00, resulting in 0x37.
      Add these two results together (0x0437), and finally add 0x10000 to get the final decoded UTF-32 code point, 0x10437.

      We have to reverse this process... :/ Above, we applied the following:
      codepoint = ((((firstPart & 0x3ff) << 10) | (secondPart & 0x3ff)) + 0x10000);

      The reverse:
      Tail: ((result-0x10000) >> 10) + 0xD800
      Head: ((result-0x10000) & 0b1111111111) + 0xDC00
    */
    return ((((head & 0x3ff) << 10) | (tail & 0x3ff)) + 0x10000);
  }
  function codePointToSurrogateTail(codepoint) {
    /*
      https://en.wikipedia.org/wiki/UTF-16
      To decode U+10437 (𐐷) from UTF-16:
      Take the high surrogate (0xD801) and subtract 0xD800, then multiply by 0x400, resulting in 0x0001 * 0x400 = 0x0400.
      Take the low surrogate (0xDC37) and subtract 0xDC00, resulting in 0x37.
      Add these two results together (0x0437), and finally add 0x10000 to get the final decoded UTF-32 code point, 0x10437.

      We have to reverse this process... :/ Above, we applied the following:
      codepoint = ((((firstPart & 0x3ff) << 10) | (secondPart & 0x3ff)) + 0x10000);

      The reverse:
      Tail: ((result-0x10000) >> 10) + 0xD800
      Head: ((result-0x10000) & 0b1111111111) + 0xDC00
     */
    return ((codepoint - 0x10000) & 0b1111111111) + 0xDC00
  }
  function codePointToSurrogateHead(codepoint) {
    /*
      https://en.wikipedia.org/wiki/UTF-16
      To decode U+10437 (𐐷) from UTF-16:
      Take the high surrogate (0xD801) and subtract 0xD800, then multiply by 0x400, resulting in 0x0001 * 0x400 = 0x0400.
      Take the low surrogate (0xDC37) and subtract 0xDC00, resulting in 0x37.
      Add these two results together (0x0437), and finally add 0x10000 to get the final decoded UTF-32 code point, 0x10437.

      We have to reverse this process... :/ Above, we applied the following:
      codepoint = ((((firstPart & 0x3ff) << 10) | (secondPart & 0x3ff)) + 0x10000);

      The reverse:
      Tail: ((result-0x10000) >> 10) + 0xD800
      Head: ((result-0x10000) & 0b1111111111) + 0xDC00
     */
    return ((codepoint - 0x10000) >> 10) + 0xD800
  }

  function parseRegexCharClassEscape() {
    // atom escape is slightly different from charclass escape

    // https://www.ecma-international.org/ecma-262/7.0/#sec-classescape

    if (eof()) {
      regexSyntaxError('Early EOF after backslash in char class');
      return REGEX_CHARCLASS_BAD;
    }
    let c = peek();

    switch (c) {
      // \u<????> and \u{<?..?>}
      case $$U_75:
        ASSERT_skip($$U_75);
        return parseRegexCharClassUnicodeEscape();

      // \x<??>
      case $$X_78:
        ASSERT_skip($$X_78);
        if (eofd(1)) {
          regexSyntaxError('First character of hex escape was EOF');
          return REGEX_CHARCLASS_BAD;
        }
        let a = peek();
        if (!isHex(a)) {
          let reason = 'First character of hex escape was invalid';
          // I think the \x should be accepted as SourceCharacterIdentityEscape now...?
          if (webCompat === WEB_COMPAT_ON) {
            updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
            // TODO: what's the code point value?
            return REGEX_CHARCLASS_BAD_WITH_U_FLAG;
          } else {
            regexSyntaxError(reason);
            return REGEX_CHARCLASS_BAD;
          }
        }
        ASSERT_skip(a);
        let b = peek();
        if (!isHex(b)) {
          regexSyntaxError('Second character of hex escape was invalid');
          return REGEX_CHARCLASS_BAD;
        }
        ASSERT_skip(b);
        return (hexToNum(a) << 4) | hexToNum(b);

      // char escapes \c<?>
      case $$C_63: {
        ASSERT_skip($$C_63);

        if (eof()) {
          regexSyntaxError('Early EOF while parsing `\\c` in a character class');
          return REGEX_CHARCLASS_BAD;
        }

        let d = peek();
        if (isAsciiLetter(d)) {
          ASSERT_skip(d);

          // https://tc39.es/ecma262/#sec-patterns-static-semantics-character-value
          // > CharacterEscape :: `c` ControlLetter
          //   > Let ch be the code point matched by ControlLetter.
          //   > Let i be ch's code point value.
          //   > Return the remainder of dividing i by 32.
          // Basically \c is a way to encode the first 26 ascii characters safely, A=1, Z=26, a=1, z=26
          return d % 32;
        }
        let reason = 'The `\\c` escape is only legal in a char class without uflag and in webcompat mode';
        if (webCompat === WEB_COMPAT_ON) {
          updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
          // This is now an `IdentityEscape` and just parses the `c` itself
          // The "character value" will be the backslash (!), NOT the value of `c`
          // This is relevant for tests like `/[a-\c]/` (bad) vs `/[A-\c]/` (good)
          return REGEX_CHARCLASS_ESCAPED_C;
        }
        regexSyntaxError(reason);
        return REGEX_CHARCLASS_BAD;
      }

      // \b and \B
      case $$B_62:
        ASSERT_skip($$B_62);
        // https://tc39.github.io/ecma262/#sec-patterns-static-semantics-character-value
        // ClassEscape :: b
        //   Return the code point value of U+0008 (BACKSPACE).
        return $$BACKSPACE_08;
      case $$B_UC_42: {
        // "A ClassAtom can use any of the escape sequences that are allowed in the rest of the regular expression
        // except for \b, \B, and backreferences. Inside a CharacterClass, \b means the backspace character, while
        // \B and backreferences raise errors. Using a backreference inside a ClassAtom causes an error."
        let reason = 'Char class can not contain `\\B` with u-flag or without webcompat';
        if (webCompat === WEB_COMPAT_ON) {
          updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
        } else {
          regexSyntaxError(reason);
        }
        ASSERT_skip($$B_UC_42);
        return REGEX_CHARCLASS_ESCAPED_UC_B;
      }

      // control escapes \f \n \r \t \v
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

      // char class escapes \d \D \s \S \w \W
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

        // https://tc39.es/ecma262/#sec-patterns-static-semantics-early-errors
        // > NonemptyClassRangesNoDash :: ClassAtomNoDash `-` ClassAtomClassRanges
        // > It is a Syntax Error if IsCharacterClass of ClassAtomNoDash is true or IsCharacterClass of ClassAtom is true.
        //
        // https://tc39.es/ecma262/#sec-patterns-static-semantics-early-errors-annexb
        // This says that under webcompat mode, this rule only applies with u-flag

        return REGEX_CHARCLASS_CLASS_ESCAPE;

      // Unicode property escapes \p{<?...?>} \P{<?...?>}
      case $$P_70:
      case $$P_UC_50:
        // With uflag, the \p is a unicode property escape and must look like \p{x} or \p{x=y} with x and y whitelisted
        // Without uflag, the \p it leads to IdentityEscape where it fails for any value that is in ID_CONTINUE, inc p
        // In webcompat mode, without uflag, it leads to SourceCharacterIdentityEscape and passes without "body"
        const FROM_CHARCLASS = true;
        let regexPropState = parseRegexPropertyEscape(c, FROM_CHARCLASS);
        if (regexPropState === REGEX_ALWAYS_BAD) {
          ASSERT(lastPotentialRegexError, 'should be set');
          ASSERT(lastReportableTokenizerError, 'should be set');
          return REGEX_CHARCLASS_CLASS_ESCAPE | REGEX_CHARCLASS_BAD;
        } else if (regexPropState === REGEX_GOOD_SANS_U_FLAG) {
          ASSERT(lastPotentialRegexError, 'should be set');
          // semantically ignored without u-flag, syntactically only okay in web-compat / Annex B mode
          if (webCompat === WEB_COMPAT_ON) {
            ASSERT(lastPotentialRegexError, 'should be set');
            return REGEX_CHARCLASS_CLASS_ESCAPE | REGEX_CHARCLASS_BAD_WITH_U_FLAG;
          } else {
            ASSERT(lastReportableTokenizerError, 'should be set');
            return REGEX_CHARCLASS_CLASS_ESCAPE | REGEX_CHARCLASS_BAD;
          }
        } else if (regexPropState === REGEX_GOOD_WITH_U_FLAG) {
          ASSERT(lastPotentialRegexError, 'should be set');
          // webcompat mode has no effect to the u-flag...
          // if (webCompat === WEB_COMPAT_ON) {
          //   return REGEX_CHARCLASS_CLASS_ESCAPE;
          // } else {
            return REGEX_CHARCLASS_CLASS_ESCAPE | REGEX_CHARCLASS_BAD_SANS_U_FLAG;
          // }
        } else {
          ASSERT(regexPropState === REGEX_ALWAYS_GOOD, 'parseRegexPropertyEscape should return enum');
          ASSERT(webCompat === WEB_COMPAT_ON, 'can only be always good in webcompat?');
          // https://tc39.es/ecma262/#sec-patterns-static-semantics-character-value
          return REGEX_CHARCLASS_CLASS_ESCAPE;
        }
        return ASSERT(false, 'unreachable');

      // digits
      // https://tc39.github.io/ecma262/#prod-CharacterClass
      // https://tc39.github.io/ecma262/#prod-ClassRanges
      // https://tc39.github.io/ecma262/#prod-NonemptyClassRanges
      // https://tc39.github.io/ecma262/#prod-ClassAtom
      // https://tc39.github.io/ecma262/#prod-ClassAtomNoDash
      // https://tc39.github.io/ecma262/#prod-ClassEscape
      // https://tc39.github.io/ecma262/#prod-CharacterEscape
      //   the last two are LegacyOctalEscapeSequence (but only ~U) and then IdentityEscape (any other)
      // - https://tc39.github.io/ecma262/#prod-annexB-LegacyOctalEscapeSequence
      // - https://tc39.github.io/ecma262/#prod-IdentityEscape
      //     SourceCharacter but not UnicodeIDContinue
      //     but;
      //     https://tc39.github.io/ecma262/#prod-annexB-IdentityEscape
      //     https://tc39.github.io/ecma262/#prod-annexB-SourceCharacterIdentityEscape
      //     SourceCharacter but not one of c or k
      // so; try to parse an octal first. this should work unless it starts with 8 or 8, in that case parse IdentityEscape
      case $$0_30: {
        ASSERT_skip(c);
        // cannot be followed by another digit
        if (neof() && isAsciiNumber(peek())) {
          let reason = 'An escaped zero cannot be followed by another number because that would be an octal escape';
          if (webCompat === WEB_COMPAT_ON) {
            updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
            return parseOctalFromSecondDigit(c) | REGEX_CHARCLASS_BAD_WITH_U_FLAG;
          }
          regexSyntaxError(reason);
          return REGEX_CHARCLASS_BAD;
        }
        return $$NULL_00;
      }
      case $$1_31:
      case $$2_32:
      case $$3_33:
      case $$4_34:
      case $$5_35:
      case $$6_36:
      case $$7_37: {
        ASSERT_skip(c);
        let reason = 'Back reference is only one digit and cannot be followed by another digit';
        // Without web compat this is a back reference which is illegal in character classes
        if (webCompat === WEB_COMPAT_ON) {
          updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
          return parseOctalFromSecondDigit(c) | REGEX_CHARCLASS_BAD_WITH_U_FLAG;
        } else {
          regexSyntaxError(reason);
          return REGEX_CHARCLASS_BAD;
        }
      }
      case $$8_38:
      case $$9_39:
        ASSERT_skip(c);
        return parseDecimalEscape(c);

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

      case $$DASH_2D: {
        ASSERT_skip($$DASH_2D);
        if (webCompat === WEB_COMPAT_ON) {
          return $$DASH_2D;
        } else {
          // only valid with u-flag!
          updateRegexUflagIsMandatory(REGEX_ALWAYS_GOOD, 'Escaping a dash in a char class is not allowed');
          return $$DASH_2D | REGEX_CHARCLASS_BAD_SANS_U_FLAG;
        }
      }

      case $$CR_0D:
      case $$LF_0A:
      case $$PS_2028:
      case $$LS_2029:
        // Line continuation is not supported in regex char class and the escape is explicitly disallowed
        // https://tc39.es/ecma262/#prod-RegularExpressionNonTerminator
        ASSERT_skip(c);
        regexSyntaxError('Regular expressions do not support line continuations (escaped newline)');
        return REGEX_CHARCLASS_BAD;

      default:
        // IdentityEscape
        // with u-flag: forward slash or syntax character (`^$\.*+?()[]{}|`) and these cases are already caught above
        // without-u-flag: SourceCharacter but not UnicodeIDContinue
        // without-u-flag in webcompat: SourceCharacter but not `c`, and not `k` iif there is a regex groupname
        ASSERT(![$$BACKSLASH_5C, $$XOR_5E, $$$_24, $$DOT_2E, $$STAR_2A, $$PLUS_2B, $$QMARK_3F, $$PAREN_L_28, $$PAREN_R_29, $$SQUARE_L_5B, $$SQUARE_R_5D, $$CURLY_L_7B, $$CURLY_R_7D, $$OR_7C].includes(c), 'all these u-flag chars should be checked above');
        if (webCompat === WEB_COMPAT_ON) {
          // https://tc39.es/ecma262/#prod-annexB-IdentityEscape
          if (c === $$C_63) {
            regexSyntaxError('Cannot have `\\c` in a char class')
            return REGEX_CHARCLASS_BAD;
          } else if (c === $$K_6B) {
            // A character class is not allowed to have `\k` back references.
            // In webcompat mode without uflag, you can have `\k` appear as long as it has no `<name>` following it and
            // as long as there is not an actual usage of named capturing groups in the same regex.
            // We use globals to track that state because it applies retroactively for the whole regex.
            let reason = 'Can only have `\\k` in a char class without uflag and in webcompat mode';
            if (webCompat === WEB_COMPAT_ON) {
              kCharClassEscaped = true;
              updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
              // Note: identity escapes have the escaped char as their "character value", so return `k`
              return $$K_6B | REGEX_CHARCLASS_BAD_WITH_U_FLAG;
            } else {
              regexSyntaxError(reason);
              return REGEX_CHARCLASS_BAD;
            }
          } else {
            ASSERT_skip(c);
            updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'Cannot escape ord=' + c + ' in a char class with uflag');
            return c | REGEX_CHARCLASS_BAD_WITH_U_FLAG;
          }
        }

        // so we can already not be valid for u flag, we just need to check here whether we can be valid without u-flag
        // (any unicode continue char would be a problem)
        let wide = isIdentRestChr(c, pointer); // c is peeked
        if (wide === INVALID_IDENT_CHAR) {
          // c is not unicode continue char
          ASSERT_skip(c);
          updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'Char class contained a "wide" codepoint that was not unicode ID_CONTINUE');
          return c | REGEX_CHARCLASS_BAD_WITH_U_FLAG;
        }
        // else return bad char class because the escape is bad
        regexSyntaxError('the char class had an escape that would not be valid with and without u-flag (ord=' + wide +')');
        if (wide === VALID_SINGLE_CHAR) {
          // bad escapes
          ASSERT_skip(c);
        } else if (wide === VALID_DOUBLE_CHAR) {
          ASSERT(peeky(c));
          skipFastWithoutUpdatingCache();
          skip();
        }
        return REGEX_CHARCLASS_BAD;
    }

    ASSERT(false, 'unreachable');
  }
  function parseRegexPropertyEscape(c, fromCharClass) {
    ASSERT(parseRegexPropertyEscape.length === arguments.length, 'arg count');
    ASSERT(c === $$P_70 || c === $$P_UC_50, 'this should be \\p or \\P', c);
    ASSERT(peek() === c, 'not yet consumed');

    // introduced in ES9 / ES2018; https://github.com/tc39/proposal-regexp-unicode-property-escapes
    if (!supportRegexPropertyEscapes) {
      let reason = 'Property escapes are not supported by the currently targeted language version';
      if (webCompat === WEB_COMPAT_ON) return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
      return regexSyntaxError(reason);
    }

    // https://tc39.github.io/ecma262/#prod-CharacterClassEscape
    // Note: the `\p` is illegal in non-u-flag regexes because `p` and `P` are not part of CharacterClassEscape
    // Additionally, the parser would trip over the curlies that ought to follow it since it'd be an invalid range.
    // It would be fine in web-compat because neither is a problem in the escape bit (see the IdentityEscape in
    // https://tc39.github.io/ecma262/#prod-annexB-CharacterEscape) nor for the braces (see ExtendedPatternCharacter in
    // https://tc39.github.io/ecma262/#prod-annexB-ExtendedAtom). And since the syntax of `\p` is tightly controlled
    // this should only change semantics without causing potential syntax errors by ignoring the `\p` escape.

    // With uflag, the \p is a unicode property escape and must look like \p{x} or \p{x=y} with x and y whitelisted
    // Without uflag, the \p it leads to IdentityEscape where it fails for any value that is in ID_CONTINUE, inc p
    // In webcompat mode, without uflag, it leads to SourceCharacterIdentityEscape and passes without "body"
    // (Note that `\p{1}` in webcompat mode is parsed as an atom with a quantifier. Not sure about runtime semantics.)

    // skip the p and assert it is immediately followed by a curly
    if (ASSERT_skipPeek(c === $$P_70 ? $$P_70 : $$P_UC_50) !== $$CURLY_L_7B) {
      let reason = 'Property escape \\p must be followed by a curly bracket (and would be illegal without u-flag)';
      if (webCompat === WEB_COMPAT_ON) return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
      return regexSyntaxError(reason);
    }

    if (eof()) return regexSyntaxError('Early EOF while parsing regex property escape');

    c = ASSERT_skipPeek($$CURLY_L_7B);

    // While there is particular syntax for parsing the name, the name must ultimately pass a hardcoded whitelist
    // and so we don't have to parse with much care. Just consume alphanumeric chars into the name and value until
    // the next is not alnum, then act accordingly. The whitelist will fix everything. Let the error path be slow.

    let name = '';
    let notQuantifier = false;
    let sawCommas = 0;
    let hasEq = false;
    let value = '';
    let scanning = true;

    do {
      if (isAsciiLetter(c) || c === $$LODASH_5F) {
        // The whitelist only contains a-zA-Z and _
        notQuantifier = true;
        if (hasEq) value += String.fromCharCode(c);
        else name += String.fromCharCode(c);
      } else if (isAsciiNumber(c)) {
        // Note: numbers and commas are never legit with u-flag (superseded by the whitelist check) but we have to track
        // them because we have to validate that webcompat mode is not allowing `\p{1}`, anyways. Just easier this way.
        if (hasEq) value += String.fromCharCode(c);
        else name += String.fromCharCode(c);
      } else if (c === $$COMMA_2C) {
        // Note: numbers and commas are never legit with u-flag (superseded by the whitelist check) but we have to track
        // them because we have to validate that webcompat mode is not allowing `\p{1}`, anyways. Just easier this way.
        ++sawCommas;
        if (hasEq) value += String.fromCharCode(c);
        else name += String.fromCharCode(c);
      } else if (c === $$CURLY_R_7D) {
        scanning = false;
      } else if (fromCharClass === false && c === $$FWDSLASH_2F) {
        // TODO: c could also be an escaped slash and this case should only apply to a literal `/` char :(
        // Stop scanning because it won't lead to a valid char with u-flag but might still be valid for webcompat
        if (webCompat === WEB_COMPAT_ON) {
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'Escaped property name/value contained illegal characters');
        } else {
          return regexSyntaxError('Escaped property name/value contained illegal characters');
        }
      } else if (fromCharClass === true && c === $$SQUARE_R_5D) {
        // TODO: c could also be an escaped bracket and this case should only apply to a literal `]` char :(
        // Stop scanning because it won't lead to a valid char with u-flag but might still be valid for webcompat
        if (webCompat === WEB_COMPAT_ON) {
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'Escaped charclass property name/value contained illegal characters');
        } else {
          return regexSyntaxError('Escaped charclass property name/value contained illegal characters');
        }
      } else if (c === $$IS_3D) {
        if (hasEq) {
          // Property escape "args" can not contain double `=`
          if (webCompat === WEB_COMPAT_ON) {
            // If there is no u-flag then this is still valid in web compat mode. The presence of `=` means we can
            // return now without having to scan up to a `}`
            return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'An escaped property can only contain one eq sign (`=`) but found a second one');
          } else {
            return regexSyntaxError('This is bad with u-flag because a property escape name is whitelisted and bad with-out u-flag because only webcompat mode would allow `\\p`');
          }
        }
        hasEq = true;
      } else {
        // Any other character means end of this property escape. It might still be valid in webcompat without uflag...
        if (webCompat === WEB_COMPAT_ON) {
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'Escaped property name/value contained illegal characters');
        } else {
          return regexSyntaxError('Escaped property name/value contained illegal characters');
        }
      }

      c = ASSERT_skipPeek(c);
      if (eof()) {
        // - `/\p{1=1234/;`        // This would still be valid in web compat mode...
        // - `/\p{1=1234/u;`       // This is always an error
        if (webCompat === WEB_COMPAT_ON) {
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'Encountered early EOF while parsing property escape');
        } else {
          return regexSyntaxError('Encountered early EOF while parsing property escape');
        }
      }
    } while (scanning);

    // The name and value must end up composing a name that is part of an explicitly, albeit large, defined set
    // It should be a syntax error if the names do not appear on their list.

    // Two cases now; Either this property is a single ident or it's a name=value pair
    // https://tc39.es/ecma262/#sec-patterns-static-semantics-early-errors
    // UnicodePropertyValueExpression :: UnicodePropertyName = UnicodePropertyValue
    // > It is a Syntax Error if the List of Unicode code points that is SourceText of UnicodePropertyName is not identical to a List of Unicode code points that is a Unicode property name or property alias listed in the “Property name and aliases” column of Table 54.
    // > It is a Syntax Error if the List of Unicode code points that is SourceText of UnicodePropertyValue is not identical to a List of Unicode code points that is a value or value alias for the Unicode property or property alias given by SourceText of UnicodePropertyName listed in the “Property value and aliases” column of the corresponding tables Table 56 or Table 57.
    // UnicodePropertyValueExpression :: LoneUnicodePropertyNameOrValue
    // > It is a Syntax Error if the List of Unicode code points that is SourceText of LoneUnicodePropertyNameOrValue is not identical to a List of Unicode code points that is a Unicode general category or general category alias listed in the “Property value and aliases” column of Table 56, nor a binary property or binary property alias listed in the “Property name and aliases” column of Table 55.

    // https://tc39.es/ecma262/#table-nonbinary-unicode-properties
    let nc = ',' + name + ',';
    if (hasEq) {
      // No need to post-validate webcompat without u-flag (due to the `=`)
      // Validate name against table 54
      if (!TABLE54.includes(nc)) {
        if (webCompat === WEB_COMPAT_ON) {
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'The escaped binary property name `' + name + '` is not valid (does not appear in "table 54")');
        } else {
          return regexSyntaxError('The escaped binary property name `' + name + '` is not valid (does not appear in "table 54") with u-flag, and `\\p` is not valid without u-flag and without webcompat');
        }
      }
      // Validate value against table 56 or 57
      let vc = ',' + value + ',';
      if (!TABLE56.includes(vc) && !TABLE57.includes(vc)) {
        if (webCompat === WEB_COMPAT_ON) {
          return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'The escaped property value `' + value + '` is not valid (does not appear in "table 56" nor "table 57")')
        } else {
          return regexSyntaxError('The escaped property value `' + value + '` is not valid (does not appear in "table 56" nor "table 57") with u-flag, and `\\p` is not valid without u-flag and without webcompat')
        }
      }
    } else {
      // Validate value against table 55 or 56
      // If invalid, double check to make sure it does not match the quantifier pattern
      if (!TABLE55.includes(nc) && !TABLE56.includes(nc)) {
        if (webCompat === WEB_COMPAT_ON) {
          // This is such an edge case that I'm just taking the easy path here
          // Note that we only accepted alnums here, so comma can not appear in the name. So just check if they
          // are all digits or not. If all digits, then it's a InvalidBracedQuantifier in webcompat non-uflag mode.
          // This exception does not apply inside a character class, since there the tail is just part of the class.
          if (name !== '' && !notQuantifier && sawCommas <= 1 && fromCharClass === false) {
            // [x]: `/\p{123}/`         (webcompat, illegal quantifier over `\p`)
            // [x]: `/\p{123}/u`        (whitelists do not contain only numbers)
            return regexSyntaxError('Encountered a property escape which could be a quantifier. Without u-flag it fails in webcompat mode. With u-flag it fails because the name is not in the whitelist.');
          } else {
            return updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, 'The escaped lone property name `' + name + '` is not valid (does not appear in "table 55" nor "table 56")');
          }
        } else {
          return regexSyntaxError('The escaped lone property name `' + name + '` is not valid (does not appear in "table 55" nor "table 56") with u-flag, and `\\p` is not valid without u-flag and without webcompat');
        }
      }
    }

    // With u-flag, this is valid.
    // Without u-flag, this is valid only in webcompat mode. The tail (which we also just parsed) of `{name}` or of
    // `{name=value}` is fine as non-important ExtendedPatternCharacter atoms in webcompat mode. The exception is if
    // it was `{name}` or `{name, name2}` where the names were only digits. Those are checked above. Since there are no
    // such valid names on the list, we can skip that check here. Hurrah.
    if (webCompat === WEB_COMPAT_ON) {
      return REGEX_ALWAYS_GOOD;
    } else {
      return updateRegexUflagIsMandatory(REGEX_ALWAYS_GOOD, 'The `\\p` property escape is only legal with a u-flag, or as a webcompat edge case');
    }
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
    let s = 0;
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
        case $$S_73:
          if (!supportRegexDotallFlag) THROW('The dotall flag `s` is not supported in the currently targeted language version');
          ++s; // dotall flag was added in es9 / es2018
          break;
        case $$BACKSLASH_5C:
          break; // see below
        default:
          if (isAsciiLetter(c)) {
            ++bad; // unknown flags are considered syntax errors by the semantics
            regexSyntaxError('Unknown regex flag [ord=' + c + ', `' + String.fromCodePoint(c) + '`)]');
          } else if (bad) {
            return REGEX_ALWAYS_BAD; // already THROWn for this
          } else if ((g|i|m|u|y|s) > 1) {
            return regexSyntaxError('Encountered at least one regex flag twice');
          } else {
            return u > 0 ? REGEX_GOOD_WITH_U_FLAG : REGEX_GOOD_SANS_U_FLAG;
          }
      }
      ASSERT_skip(c);

      // escaped flags (rare path that we must invalidate)
      if (c === $$BACKSLASH_5C) {
        // while syntactically a unicode escaped flag could be valid, the semantics explicitly disallow it
        // just gracefully parse a unicode escape and return an error token
        // (note: this is already the "slow" path because we know it's an error)
        if (eof()) return regexSyntaxError('Encountered early EOF while trying to parse a regex flag that is escaped (the backslash is the very last char which is illegal)');
        if (peeky($$U_75)) {
          ASSERT_skip($$U_75);
          parseRegexAtomUnicodeEscape();
          regexSyntaxError('Regex flags can not be escaped in any form');
        } else {
          regexSyntaxError('Unknown regex flag [ord=' + c + ']');
        }
        ++bad;
      }
    }
    // the error is the (slightly and very theoretical) slow path because it leads to an error anyways
    // if any flags occurred more than once, the or below will result in >1
    if (bad) {
      return REGEX_ALWAYS_BAD; // already THROWn for this
    } else if ((g|i|m|u|y|s) > 1) {
      return regexSyntaxError('Encountered at least one regex flag twice');
    } else {
      return u > 0 ? REGEX_GOOD_WITH_U_FLAG : REGEX_GOOD_SANS_U_FLAG;
    }
  }
  function parseRegexCurlyQuantifier(c) {
    ASSERT(neof(), 'call site will have verified neof()');
    ASSERT(c === peek(), 'c should be current peek()');
    ASSERT(isAsciiNumber(c), 'call site will have asserted that the first next char is a digit');
    // Parsed the curly, verified first next char is a digit
    // Verify the range is not {hi,lo}

    // next should be a digit
    let hasHi = false;
    let max = 0;
    let badNumber = false;

    let a = c;
    let min = a - $$0_30; // ascii for 0x30 is digit `0`
    ASSERT_skip(c);
    if (eof()) return false;
    c = peek();

    if (a === $$0_30) {
      // - `/x{0}/`
      //       ^
      if (isAsciiNumber(c)) {
        // - `/x{01}/`
        //        ^
        badNumber = true;
      }
    }
    while (isAsciiNumber(c)) {
      min = (min * 10) + (c - $$0_30);
      ASSERT_skip(c);
      if (eof()) return false;
      c = peek();
    }

    if (c === $$COMMA_2C) {
      ASSERT_skip($$COMMA_2C);
      if (eof()) return false;
      c = peek();

      if (isAsciiNumber(c)) {
        hasHi = true;
        let b = c;
        max = b - $$0_30; // ascii for 0x30 is digit `0`
        ASSERT_skip(b);
        if (eof()) return false;
        c = peek();

        if (b === $$0_30) {
          // - `/x{0,0}/`
          //         ^
          if (isAsciiNumber(c)) {
            // - `/x{01}/`
            //        ^
            badNumber = true;
          }
        }
        while (isAsciiNumber(c)) {
          max = (max * 10) + (c - $$0_30);
          ASSERT_skip(c);
          if (eof()) return false;
          c = peek();
        }
      }
    }
    if (c === $$CURLY_R_7D) {
      ASSERT_skip($$CURLY_R_7D);
      return !badNumber && (!hasHi || min <= max);
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
  function parseRegexCharClassEnd(urangeOpen, wasSurrogateHead, urangeLeft, prev, flagState) {
    ASSERT_skip($$SQUARE_R_5D);

    // code point range may be open if the rhs was a surrogate head.
    // that's the only range case that needs to be checked here.
    if (urangeOpen && wasSurrogateHead && (urangeLeft === REGEX_CHARCLASS_ESCAPED_UC_B || prev === REGEX_CHARCLASS_ESCAPED_UC_B || urangeLeft > prev)) {
      if (flagState === REGEX_GOOD_WITH_U_FLAG) return regexSyntaxError('Unknown reason that is only an error without u-flag');
      if (flagState === REGEX_ALWAYS_BAD) return REGEX_ALWAYS_BAD; // should already have THROWn for this
      return REGEX_GOOD_SANS_U_FLAG;
    }
    return flagState;
  }
  function parseDecimalEscape(c) {
    let reason = 'Cannot escape \\8 or \\9 in a regex char class with u-flag';
    if (webCompat === WEB_COMPAT_ON) {
      // https://tc39.es/ecma262/#prod-annexB-IdentityEscape
      updateRegexUflagIsIllegal(REGEX_ALWAYS_GOOD, reason);
      return c | REGEX_CHARCLASS_BAD_WITH_U_FLAG;
    } else {
      // https://tc39.es/ecma262/#prod-IdentityEscape
      regexSyntaxError(reason);
      return REGEX_CHARCLASS_BAD;
    }
  }
  function parseOctalFromSecondDigit(firstChar) {

    // https://tc39.github.io/ecma262/#prod-annexB-LegacyOctalEscapeSequence
    //   OctalDigit [lookahead ∉ OctalDigit]
    //   ZeroToThree OctalDigit [lookahead ∉ OctalDigit]
    //   FourToSeven OctalDigit
    //   ZeroToThree OctalDigit OctalDigit
    // 0  ~ 377 (octal -> 0 ~ 255 dec)

    // I'm pretty sure this should be disallowed in
    // if ((lexerFlags & LF_STRICT_MODE) === LF_STRICT_MODE) {
    //   return CHARCLASS_BAD
    // }

    if (eof()) return firstChar - $$0_30;
    let secondChar = peek();
    if (isLowerOctal(firstChar)) {
      // third char may be any octal
      if (isOctal(secondChar)) {
        ASSERT_skip(secondChar);
        if (eof()) return ((firstChar - $$0_30) * 8) + (secondChar - $$0_30);
        let thirdChar = peek();
        if (isOctal(thirdChar)) {
          ASSERT_skip(thirdChar);
          return ((firstChar - $$0_30) * 8 * 8) + ((secondChar - $$0_30) * 8) + (thirdChar - $$0_30);
        } else {
          return ((firstChar - $$0_30) * 8) + (secondChar - $$0_30);
        }
      } else {
        return firstChar - $$0_30;
      }
    } else {
      ASSERT(isUpperOctal(firstChar));
      // third char may only be the lower octals
      if (isOctal(secondChar)) {
        ASSERT_skip(secondChar);
        if (eof()) return ((firstChar - $$0_30) * 8) + (secondChar - $$0_30);
        let thirdChar = peek();
        if (isLowerOctal(thirdChar)) {
          ASSERT_skip(thirdChar);
          return ((firstChar - $$0_30) * 8 * 8) + ((secondChar - $$0_30) * 8) + (thirdChar - $$0_30);
        } else {
          return ((firstChar - $$0_30) * 8) + (secondChar - $$0_30);
        }
      } else {
        return firstChar - $$0_30;
      }
    }
  }
  function isOctal(c) {
    return c >= $$0_30 && c <= $$7_37;
  }
  function isLowerOctal(c) {
    return c >= $$0_30 && c <= $$3_33;
  }
  function isUpperOctal(c) {
    return c >= $$4_34 && c <= $$7_37;
  }

  function parseRegexCharClassUnicodeEscape() {
    // This returns the code point, if valid, possibly together with REGEX_CHARCLASS_BAD_SANS_U_FLAG
    // May also return REGEX_CHARCLASS_BAD

    // `\u{...}`
    //    ^
    // `\uxxxx`
    //    ^
    // `\uxxxx\uxxxx`         (only if the first quad is a surrogate head and second quad a surrogate tail!)
    //    ^

    // if unicode flag
    // - surrogate pairs may matter
    // - class char status matters
    // - long unicode escape is allowed

    // we dont know whether u-mode is enabled until after we've parsed the flags
    // so we must parse as loose as possible and keep track of parsing specific u-flag or non-u-flag stuff
    // then after flag parsing confirm that the flag presence conforms to expectations

    if (eofd(3)) {
      // Either this is a quad, then we need 4 chars `xxxx`, or a dynamic escape, then at least 3 `{x}`
      regexSyntaxError('Early EOF while parsing character class escape');
      return REGEX_CHARCLASS_BAD;
    }
    let c = peek(); // dont read. we dont want to consume a bad \n here
    if (c === $$CURLY_L_7B) {
      ASSERT_skip($$CURLY_L_7B);
      let r = parseRegexCharClassUnicodeEscapeVary();
      if (r === REGEX_CHARCLASS_BAD) {
        regexSyntaxError('Missing curly of unicode long escape in a regex');
        return REGEX_CHARCLASS_BAD;
      }
      if (eof()) {
        regexSyntaxError('Early EOF while parsing variable unicode escape in regex character class');
        return REGEX_CHARCLASS_BAD;
      }
      if (!peeky($$CURLY_R_7D)) {
        regexSyntaxError('Missing curly of unicode long escape in a regex');
        return REGEX_CHARCLASS_BAD;
      }
      ASSERT_skip($$CURLY_R_7D);
      updateRegexPotentialError('The es6 long unicode escape is only valid with u-flag');
      return r | REGEX_CHARCLASS_BAD_SANS_U_FLAG; // `\u{}` in regexes is restricted to +u flag
    } else {
      return parseRegexCharClassUnicodeEscapeQuad(c);
    }
  }
  function parseRegexCharClassUnicodeEscapeQuad(a) {
    // This returns the code point, if valid, possibly together with REGEX_CHARCLASS_BAD_SANS_U_FLAG
    // We've already consumed a char in `a`. we must consume 3 more chars for this quad unicode escape

    // `\uxxxx`
    //    ^
    // `\uxxxx\uxxxx`         (only if the first quad is a surrogate head and second quad a surrogate tail!)
    //    ^

    if (eofd(3)) {
      updateRegexPotentialError('Unexpected EOF while parsing unicode escape');
      return REGEX_CHARCLASS_BAD;
    }
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

      let firstPart = (hexToNum(a) << 12) | (hexToNum(b) << 8) | (hexToNum(c) << 4) | hexToNum(d);

      // Is this a surrogate high byte? then we'll try another one
      if (firstPart >= 0xD800 && firstPart <= 0xDBFF) {
        // `\uxxxx\uxxxx`         (we've verified the first quad is a valid surrogate head)
        //        ^

        // pretty slow path but we're constructing a low+hi surrogate pair together here
        if (
          !eofd(5) &&
          peek() === $$BACKSLASH_5C &&
          peekd(1) === $$U_75 &&
          isHex(peekd(2)) &&
          isHex(peekd(3)) &&
          isHex(peekd(4)) &&
          isHex(peekd(5))
        ) {
          let a = peekd(2);
          let b = peekd(3);
          let c = peekd(4);
          let d = peekd(5);
          let secondPart = hexToNum(a) << 12 | hexToNum(b) << 8 | hexToNum(c) << 4 | hexToNum(d);

          if (secondPart >= 0xDC00 && secondPart <= 0xDFFF) {
            /*
              https://en.wikipedia.org/wiki/UTF-16
              To decode U+10437 (𐐷) from UTF-16:
              Take the high surrogate (0xD801) and subtract 0xD800, then multiply by 0x400, resulting in 0x0001 * 0x400 = 0x0400.
              Take the low surrogate (0xDC37) and subtract 0xDC00, resulting in 0x37.
              Add these two results together (0x0437), and finally add 0x10000 to get the final decoded UTF-32 code point, 0x10437.
             */
            // firstPart = 0xD801;
            // secondPart = 0xDC37;
            // let expected = 0x10437;

            // now skip `\uxxxx` (6)
            ASSERT_skip($$BACKSLASH_5C);
            ASSERT_skip($$U_75);
            ASSERT_skip(a);
            ASSERT_skip(b);
            ASSERT_skip(c);
            ASSERT_skip(d);

            let codepoint = surrogateToCodepoint(firstPart, secondPart);

            updateRegexPotentialError('A double unicode quad escape that represents a surrogate pair in char class or group name is only valid with u-flag');

            // We have a matching low+hi, combine them
            // Without u-flag the surrogate tail is just a separate character
            return codepoint | REGEX_CHARCLASS_DOUBLE_QUAD;
          }
        }
      }
      return firstPart;
    } else {
      updateRegexPotentialError('Attempted to parse a unicode quad escape but at least one digit was not a hex');
      return REGEX_CHARCLASS_BAD;
    }
  }
  function parseRegexCharClassUnicodeEscapeVary() {
    // "It is a Syntax Error if the MV of HexDigits > 1114111."
    // this means the actual hex value cannot exceed 6 chars (0x10ffff). however,
    // it can have any number of leading zeroes so we still need to loop

    // must at least parse one hex digit (but it may be invalid so we can't read())
    if (eof()) return REGEX_CHARCLASS_BAD;  // first one is mandatory
    let a = peek();
    if (!isHex(a)) return REGEX_CHARCLASS_BAD; // first one is mandatory
    ASSERT_skip(a);

    let c = _parseRegexUnicodeEscapeVary2(a);
    if (c === REGEX_CHARCLASS_BAD) {
      updateRegexPotentialError('Encountered early EOF while parsing a unicode long escape in a regex');
      return REGEX_CHARCLASS_BAD;
    }
    return c;
  }
  function _parseRegexUnicodeEscapeVary2(a) {
    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return REGEX_CHARCLASS_BAD;
      a = skipZeroes();
      if (!isHex(a)) {
        // note: we already asserted a zero
        return 0;
      }
      ASSERT_skip(a);
    }

    return __parseRegexUnicodeEscapeVary2(a);
  }
  function __parseRegexUnicodeEscapeVary2(a) {
    if (eof()) return REGEX_CHARCLASS_BAD;
    let b = peek();
    if (!isHex(b)) {
      return hexToNum(a);
    }
    ASSERT_skip(b);

    return ___parseRegexUnicodeEscapeVary2(a, b);
  }
  function ___parseRegexUnicodeEscapeVary2(a, b) {
    if (eof()) return REGEX_CHARCLASS_BAD;
    let c = peek();
    if (!isHex(c)) {
      return (hexToNum(a) << 4) | hexToNum(b);
    }
    ASSERT_skip(c);

    return ____parseRegexUnicodeEscapeVary2(a, b, c);
  }
  function ____parseRegexUnicodeEscapeVary2(a, b, c) {
    if (eof()) return REGEX_CHARCLASS_BAD;
    let d = peek();
    if (!isHex(d)) {
      return (hexToNum(a) << 8) | (hexToNum(b) << 4) | hexToNum(c);
    }
    ASSERT_skip(d);

    return _____parseRegexUnicodeEscapeVary2(a, b, c, d);
  }
  function _____parseRegexUnicodeEscapeVary2(a, b, c, d) {
    if (eof()) return REGEX_CHARCLASS_BAD;
    let e = peek();
    if (!isHex(e)) {
      return (hexToNum(a) << 12) | (hexToNum(b) << 8) | (hexToNum(c) << 4) | hexToNum(d);
    }
    ASSERT_skip(e);

    return ______parseRegexUnicodeEscapeVary2(a, b, c, d, e);
  }
  function ______parseRegexUnicodeEscapeVary2(a, b, c, d, e) {
    if (eof()) return REGEX_CHARCLASS_BAD;
    let f = peek();
    if (!isHex(f)) {
      return (hexToNum(a) << 16) | (hexToNum(b) << 12) | (hexToNum(c) << 8) | (hexToNum(d) << 4) | hexToNum(e);
    }
    ASSERT_skip(f);

    let r = (hexToNum(a) << 20) | (hexToNum(b) << 16) | (hexToNum(c) << 12) | (hexToNum(d) << 8) | (hexToNum(e) << 4) | hexToNum(f);
    return Math.min(0x110000, r);
  }

  function parseOtherUnicode(c) {
    switch (c) {
      case $$BOM_FEFF:
        return $SPACE;
      case $$PS_2028:
        return parseNewlineSolo();
      case $$LS_2029:
        return parseNewlineSolo();

      default:

        // assert identifiers starting with >ascii unicode chars
        // > any Unicode code point with the Unicode property “ID_Start”
        // since we have to take multi-byte characters into account here (and consider this the slow path, anyways), we
        // apply a regex on the input string with a sticky flag and the ES9-released \p flag. This requires cutting
        // edge JS engines, but it beats the alternative of having to manually compile and ship these unicode ranges.

        let cu = input.codePointAt(pointer - 1);
        let wide = isIdentStart(cu, pointer - 1);
        if (wide !== INVALID_IDENT_CHAR) {
          if (wide === VALID_DOUBLE_CHAR) skip(); // c was skipped but cu was two (16bit) positions
          return parseIdentifierRest(String.fromCodePoint(cu));
        }

        // https://tc39.github.io/ecma262/#sec-unicode-format-control-characters
        // >  In ECMAScript source text <ZWNBSP> code points are treated as white space characters (see 11.2).
        if (c === $$BOM_FEFF) {
          return $SPACE;
        }

        if (!lastReportableTokenizerError) lastReportableTokenizerError = 'Unexpected unicode character: ' + c + ' (' + String.fromCharCode(c) + ')';
        return $ERROR;
    }
  }

  function THROW(str, token = null) {
    $error('Throwing this error:', str);
    _THROW('Tokenizer error! ' + str, token, str);
  }
  function _THROW(str, token = null, msg = '', fullErrorContext = false) {
    $log('\n');
    let ectxt = getErrorContext(token, msg, fullErrorContext);
    $log('Error at:\n```\n' + ectxt + (ectxt[ectxt.length-1] === '\n' ? '' : '\n') + '```\n');
    if (gracefulErrors === FAIL_HARD) throw new Error(str);
    else $error(str);
  }
  function DEBUG(msg) {
    return 'Tokenizer at:\n' + getErrorContext(undefined, 'DEBUG('+msg+')');
  }
  function getErrorContext(token, msg, fullErrorContext = false) {
    let offset = token ? token.start : startForError;
    let inputOffset = fullErrorContext || offset <= 100 ? 0 : offset - 100;
    if (inputOffset) offset -= inputOffset;
    let usedInput = input.slice(inputOffset, fullErrorContext ? input.length : inputOffset + 200);

    let nl1 = offset && (usedInput.lastIndexOf('\n', offset) + 1);
    let nl2 = usedInput.indexOf('\n', nl1);
    if (nl2 < 0) nl2 = usedInput.length;
    let arrows = Math.max(1, token ? token.str.length : 1);

    let indent = offset - (nl1);

    return (
      usedInput.slice(0, nl2) + '\n' +
      ' '.repeat(Math.max(0, indent)) +
      '^'.repeat(Math.max(0, arrows)) +
      '------- error'+(msg?': '+msg:offset>=usedInput.length?' at EOF':'') + '\n' +
      usedInput.slice(nl2) +
      ''
    );

    // if (input.length < 100) return '```\n' + slice(0, pointer) + sep + slice(pointer, input.length) + '\n```';
    // return '```\n' + slice(Math.max(0, pointer - 20), pointer) + sep + slice(pointer, Math.min(len, pointer + 20)) + '\n```';
  }

  return {
    tokens: tokens,

    nextTokenGeneric: nextTokenGeneric,
    asi: addAsi,
    throw: _THROW,
    lexError: function() {
      ASSERT(lastReportableTokenizerError, 'lexError should only be called if a lexer error was actually detected');
      THROW(lastReportableTokenizerError);
    },
    //deopt: () => funcs.forEach(([f,n]) => printStatus(f,n)),
    getTokenCountAny: function(){ return anyTokenCount; },
    getTokenCountSolid: function(){ return solidTokenCount; },
    DEBUG: DEBUG,
    getErrorContext: getErrorContext,
    regexerror: function(){ return lastPotentialRegexError; },
    prevEndColumn: function(){ return prevTokenEndColumn; },
    prevEndLine: function(){ return prevTokenEndLine; },
    currColumn: function(){ return pointer - currentColOffset; },
    currLine: function(){ return currentLine; },
    nextTokenToParenOpen: nextTokenToParenOpen,
    nextTokenToCurlyOpen: nextTokenToCurlyOpen,
    nextTokenToParenOpenCurlyOpen: nextTokenToParenOpenCurlyOpen,
    nextTokenToFrom: nextTokenToFrom,
    nextTokenToString: nextTokenToString,
    nextTokenToIdent: nextTokenToIdent,
    nextTokenToArrow: nextTokenToArrow,
    nextTokenToAs: nextTokenToAs,
    nextTokenToAsCommaCurlyClose: nextTokenToAsCommaCurlyClose,
    nextTokenToAsCommaFrom: nextTokenToAsCommaFrom,
    nextTokenToColon: nextTokenToColon,
    nextTokenToTarget: nextTokenToTarget,
    nextTokenToStatementStart: nextTokenToStatementStart,
    nextTokenToExpressionStart: nextTokenToExpressionStart,
    nextTokenToExpressionStartGrouped: nextTokenToExpressionStartGrouped,
    nextTokenToExpressionStartSemi: nextTokenToExpressionStartSemi,
    nextTokenToExpressionStartSquareCloseComma: nextTokenToExpressionStartSquareCloseComma,
    nextTokenToObjectMemberStart: nextTokenToObjectMemberStart,
    nextTokenToObjectMemberRest: nextTokenToObjectMemberRest,
    nextTokenToClassMemberStart: nextTokenToClassMemberStart,
    nextTokenToClassMemberRest: nextTokenToClassMemberRest,
    nextTokenSwitchBody: nextTokenSwitchBody,
    nextTokenToBindingStart: nextTokenToBindingStart,
    nextTokenToBindingStartGrouped: nextTokenToBindingStartGrouped,
    nextTokenToColonOrParenOpen: nextTokenToColonOrParenOpen,
    nextTokenToIdentOrParenOpen: nextTokenToIdentOrParenOpen,
    nextTokenToIdentStarParenOpen: nextTokenToIdentStarParenOpen,
    nextTokenToIdentStarCurlyOpen: nextTokenToIdentStarCurlyOpen,
    nextTokenToCommaCurlyClose: nextTokenToCommaCurlyClose,
    nextTokenToIdentCurlyClose: nextTokenToIdentCurlyClose,
    nextTokenToIdentCurlyOpen: nextTokenToIdentCurlyOpen,
    nextTokenToIdentStarCurlyOpenParenOpenString: nextTokenToIdentStarCurlyOpenParenOpenString,
    nextTokenToAwaitParenOpen: nextTokenToAwaitParenOpen,
    nextTokenToIdentStringNumberSquareOpen: nextTokenToIdentStringNumberSquareOpen,
    nextTokenToParamStart: nextTokenToParamStart,
  };
}

function isLfPsLs(c) {
  return c === $$LF_0A || isPsLs(c);
}
function isPsLs(c) {
  return c === $$PS_2028 || c === $$LS_2029;
}

function toktypeToString(type, _, ignoreUnknown) {
  ASSERT(ALL_TOKEN_TYPES.includes(type), 'should be known type', type, ALL_TOKEN_TYPES);

  switch (type) {
    case $SPACE: return 'SPACE';
    case $TAB: return 'TAB';
    case $NL_SOLO: return 'NL_SOLO';
    case $NL_CRLF: return 'NL_CRLF';
    case $COMMENT_SINGLE: return 'COMMENT_SINGLE';
    case $COMMENT_MULTI: return 'COMMENT_MULTI';
    case $COMMENT_HTML: return 'COMMENT_HTML';
    case $IDENT: return 'IDENT';
    case $NUMBER_HEX: return 'NUMBER_HEX';
    case $NUMBER_DEC: return 'NUMBER_DEC';
    case $NUMBER_BIN: return 'NUMBER_BIN';
    case $NUMBER_OCT: return 'NUMBER_OCT';
    case $NUMBER_OLD: return 'NUMBER_OLD';
    case $NUMBER_BIG_HEX: return 'NUMBER_BIG_HEX';
    case $NUMBER_BIG_DEC: return 'NUMBER_BIG_DEC';
    case $NUMBER_BIG_BIN: return 'NUMBER_BIG_BIN';
    case $NUMBER_BIG_OCT: return 'NUMBER_BIG_OCT';
    case $PUNCTUATOR: return 'PUNCTUATOR';
    case $REGEXN: return 'REGEXN';
    case $REGEXU: return 'REGEXU';
    case $STRING_SINGLE: return 'STRING_SINGLE';
    case $STRING_DOUBLE: return 'STRING_DOUBLE';
    case $TICK_HEAD: return 'TICK_HEAD';
    case $TICK_BODY: return 'TICK_BODY';
    case $TICK_TAIL: return 'TICK_TAIL';
    case $TICK_PURE: return 'TICK_PURE';
    case $TICK_BAD_HEAD: return 'TICK_BAD_HEAD';
    case $TICK_BAD_BODY: return 'TICK_BAD_BODY';
    case $TICK_BAD_TAIL: return 'TICK_BAD_TAIL';
    case $TICK_BAD_PURE: return 'TICK_BAD_PURE';
    case $EOF: return 'EOF';
    case $ASI: return 'ASI';
    case $ERROR: return 'ERROR';
  }

  if (ignoreUnknown) return 'UNKNOWN[' + type + ']';
  throw new Error('toktypeToString: UNKNOWN[' + JSON.stringify(type) + ']')
}

function T(type) {
  ASSERT(typeof type === 'number', 'expecting valid type', type);
  ASSERT(type !== 0, 'token type is an enum that is not zero');

  return 'T<' + toktypeToString(type) + '>';
}

export default ZeTokenizer;
export {
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
  isNumberStringRegex,
  isNumberStringToken,

  $SPACE,
  $TAB,
  $NL_SOLO,
  $NL_CRLF,
  $COMMENT_SINGLE,
  $COMMENT_MULTI,
  $COMMENT_HTML,
  $IDENT,
  $NUMBER_HEX,
  $NUMBER_DEC,
  $NUMBER_BIN,
  $NUMBER_OCT,
  $NUMBER_OLD,
  $NUMBER_BIG_HEX,
  $NUMBER_BIG_DEC,
  $NUMBER_BIG_BIN,
  $NUMBER_BIG_OCT,
  $PUNCTUATOR,
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
  ALL_TOKEN_GROUPS,
  ALL_TOKEN_TYPES,

  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,

  FAIL_GRACEFULLY,
  FAIL_HARD,

  GOAL_MODULE,
  GOAL_SCRIPT,

  LF_CAN_NEW_DOT_TARGET,
  LF_FOR_REGEX,
  LF_IN_ASYNC,
  LF_IN_CONSTRUCTOR,
  LF_IN_FOR_LHS,
  LF_IN_FUNC_ARGS,
  LF_IN_GENERATOR,
  LF_IN_GLOBAL,
  LF_IN_ITERATION,
  LF_IN_SWITCH,
  LF_IN_TEMPLATE,
  LF_NO_ASI,
  LF_NO_FLAGS,
  LF_STRICT_MODE,
  LF_SUPER_CALL,
  LF_SUPER_PROP,
  INITIAL_LEXER_FLAGS,
  L,

  RETURN_ANY_TOKENS,
  RETURN_COMMENT_TOKENS,
  RETURN_SOLID_TOKENS,

  WEB_COMPAT_OFF,
  WEB_COMPAT_ON,

  toktypeToString,
  T,
  ASSERT_pushCanonPoison,
  ASSERT_popCanonPoison,
};
