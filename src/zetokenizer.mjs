// relevant: https://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-lexical-grammar
// https://tc39.github.io/ecma262/

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

// <BODY>

// note: cannot use more than 32 flags...

// TODO: collapse the dynamic initializations to static numbers
// flags for token types
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
const $COMMENT_HTML = (1 << ++$flag) | $WHITE | $COMMENT;
const $NUMBER = 1 << ++$flag;
const $NUMBER_HEX = (1 << ++$flag) | $NUMBER;
const $NUMBER_DEC = (1 << ++$flag) | $NUMBER;
const $NUMBER_BIN = (1 << ++$flag) | $NUMBER;
const $NUMBER_OCT = (1 << ++$flag) | $NUMBER;
const $NUMBER_OLD = (1 << ++$flag) | $NUMBER;
const $STRING = 1 << ++$flag;
const $STRING_SINGLE = (1 << ++$flag) | $STRING;
const $STRING_DOUBLE = (1 << ++$flag) | $STRING;
const $IDENT = 1 << ++$flag;
const $PUNCTUATOR = 1 << ++$flag;
const $REGEX = 1 << ++$flag;
const $REGEXU = (1 << ++$flag) | $REGEX; // with /u flag
const $TICK = 1 << ++$flag;
const $TICK_HEAD = (1 << ++$flag) | $TICK;
const $TICK_BODY = (1 << ++$flag) | $TICK;
const $TICK_TAIL = (1 << ++$flag) | $TICK;
const $TICK_PURE = (1 << ++$flag) | $TICK;
const $TICK_BAD_ESCAPE = 1 << ++$flag; // these are only valid in tagged templates from es9 onward...
const $ASI = 1 << ++$flag;
const $EOF = 1 << ++$flag;
ASSERT($flag < 32, 'cannot use more than 32 flags');

// flags for operators/punctuators
//let $_flag = 0;
//const $_PARENL = 1 << ++$_flag;
////const $_PARENR = 1 << ++$_flag;
//const $_CURLYL = 1 << ++$_flag;
////const $_CURLYR = 1 << ++$_flag;
//const $_SQUAREL = 1 << ++$_flag;
////const $_SQUARER = 1 << ++$_flag;
//const $_DOT = 1 << ++$_flag;
//const $_INC = 1 << ++$_flag; // ++
//const $_DEC = 1 << ++$_flag; // --
//const $_EXCL = 1 << ++$_flag;
//const $_TILDE = 1 << ++$_flag;
//const $_PLUS = 1 << ++$_flag;
//const $_MIN = 1 << ++$_flag;
//const $_MUL = 1 << ++$_flag;
//const $_POW = 1 << ++$_flag;
//const $_DIV = 1 << ++$_flag;
//const $_MOD = 1 << ++$_flag;
//const $_SHL = 1 << ++$_flag;
//const $_SHR = 1 << ++$_flag;
//const $_USHR = 1 << ++$_flag;
//const $_LT = 1 << ++$_flag;
//const $_LTE = 1 << ++$_flag;
//const $_GT = 1 << ++$_flag;
//const $_GTE = 1 << ++$_flag;
//const $_AND = 1 << ++$_flag;
//const $_XOR = 1 << ++$_flag;
//const $_OR = 1 << ++$_flag;
//const $_EQEQ = 1 << ++$_flag;
//const $_EQEQEQ = 1 << ++$_flag;
//const $_NEQ = 1 << ++$_flag;
//const $_NEQEQ = 1 << ++$_flag;
//const $_ANDAND = 1 << ++$_flag;
//const $_OROR = 1 << ++$_flag;
//const $_QMARK = 1 << ++$_flag;
//const $_SEMI = 1 << ++$_flag;
//const $_COLON = 1 << ++$_flag;
//const $_COMMA = 1 << ++$_flag;
//// assignment ops
//const $_EQ = 1 << ++$_flag;
//const $_EQPLUS = $_EQ | $_PLUS;
//const $_EQMIN = $_EQ | $_MIN;
//const $_EQPOW = $_EQ | $_POW;
//const $_EQMUL = $_EQ | $_MUL;
//const $_EQDIV = $_EQ | $_DIV;
//const $_EQMOD = $_EQ | $_MOD;
//const $_EQSHL = $_EQ | $_SHL;
//const $_EQSHR = $_EQ | $_SHR;
//const $_EQUSHR = $_EQ | $_USHR;
//const $_EQAND = $_EQ | $_AND;
//const $_EQXOR = $_EQ | $_XOR;
//const $_EQOR = $_EQ | $_OR;
//ASSERT($_flag < 32, 'cannot use more than 32 flags');

// flags for identifiers
//let __flag = 0;
//const __IF = 1 << ++__flag;
//... etc
//ASSERT(__flag < 32, 'cannot use more than 32 flags');

$flag = 0;
const LF_NO_FLAGS = 0;
const LF_CAN_NEW_DOT_TARGET = 1 << ++$flag; // current scope is inside at least one regular (non-arrow) function
const LF_FOR_REGEX = 1 << ++$flag;
const LF_IN_ASYNC = 1 << ++$flag;
const LF_IN_CONSTRUCTOR = 1 << ++$flag; // inside a class constructor (not a regular function) that is not static
const LF_IN_FOR_LHS = 1 << ++$flag; // inside the initial part of a for-header, prevents `in` being parsed as an operator, hint for checks when destructuring pattern as lhs
const LF_IN_FUNC_ARGS = 1 << ++$flag; // throws for await expression
const LF_IN_GENERATOR = 1 << ++$flag;
const LF_IN_GLOBAL = 1 << ++$flag; // unset whenever you go into any kind of function (for return)
const LF_IN_ITERATION = 1 << ++$flag; // inside a loop (tells you whether break/continue is valid)
const LF_IN_SWITCH = 1 << ++$flag; // inside a switch (tells you whether break is valid)
const LF_IN_TEMPLATE = 1 << ++$flag;
const LF_NO_ASI = 1 << ++$flag; // can you asi if you must? used for async. LF_IN_TEMPLATE also implies this flag!
const LF_STRICT_MODE = 1 << ++$flag;
const LF_SUPER_CALL = 1 << ++$flag; // can call `super()`
const LF_SUPER_PROP = 1 << ++$flag; // can read `super.foo` (there are cases where you can doo this but not `super()`)
ASSERT($flag < 32, 'cannot use more than 32 flags');
// start of the first statement without knowing strict mode status:
// - div means regular expression
// - closing curly means closing curly (not template body/tail)
// - sloppy mode until proven otherwise
const INITIAL_LEXER_FLAGS = LF_FOR_REGEX | LF_IN_GLOBAL; // not sure about global, that may change depending on options{$?

// https://tc39.es/ecma262/#table-nonbinary-unicode-properties
// (manually copied from spec)
const TABLE54 = ',General_Category,gc,Script,sc,Script_Extensions,scx,';
const TABLE55 = ',ASCII,ASCII_Hex_Digit,AHex,Alphabetic,Alpha,Any,Assigned,Bidi_Control,Bidi_C,Bidi_Mirrored,Bidi_M,Case_Ignorable,CI,Cased,Changes_When_Casefolded,CWCF,Changes_When_Casemapped,CWCM,Changes_When_Lowercased,CWL,Changes_When_NFKC_Casefolded,CWKCF,Changes_When_Titlecased,CWT,Changes_When_Uppercased,CWU,Dash,Default_Ignorable_Code_Point,DI,Deprecated,Dep,Diacritic,Dia,Emoji,Emoji_Component,Emoji_Modifier,Emoji_Modifier_Base,Emoji_Presentation,Extended_Pictographic,Extender,Ext,Grapheme_Base,Gr_Base,Grapheme_Extend,Gr_Ext,Hex_Digit,Hex,IDS_Binary_Operator,IDSB,IDS_Trinary_Operator,IDST,ID_Continue,IDC,ID_Start,IDS,Ideographic,Ideo,Join_Control,Join_C,Logical_Order_Exception,LOE,Lowercase,Lower,Math,Noncharacter_Code_Point,NChar,Pattern_Syntax,Pat_Syn,Pattern_White_Space,Pat_WS,Quotation_Mark,QMark,Radical,Regional_Indicator,RI,Sentence_Terminal,STerm,Soft_Dotted,SD,Terminal_Punctuation,Term,Unified_Ideograph,UIdeo,Uppercase,Upper,Variation_Selector,VS,White_Space,space,XID_Continue,XIDC,XID_Start,XIDS,';
const TABLE56 = ',Cased_Letter,LC,Close_Punctuation,Pe,Connector_Punctuation,Pc,Control,Cc,cntrl,Currency_Symbol,Sc,Dash_Punctuation,Pd,Decimal_Number,Nd,digit,Enclosing_Mark,Me,Final_Punctuation,Pf,Format,Cf,Initial_Punctuation,Pi,Letter,L,Letter_Number,Nl,Line_Separator,Zl,Lowercase_Letter,Ll,Mark,M,Combining_Mark,Math_Symbol,Sm,Modifier_Letter,Lm,Modifier_Symbol,Sk,Nonspacing_Mark,Mn,Number,N,Open_Punctuation,Ps,Other,C,Other_Letter,Lo,Other_Number,No,Other_Punctuation,Po,Other_Symbol,So,Paragraph_Separator,Zp,Private_Use,Co,Punctuation,P,punct,Separator,Z,Space_Separator,Zs,Spacing_Mark,Mc,Surrogate,Cs,Symbol,S,Titlecase_Letter,Lt,Unassigned,Cn,Uppercase_Letter,Lu,';
// Note: Added Elym instead of a duplicate Elymaic to table 57 because I think that's a typo in the spec
const TABLE57 = ',Adlam,Adlm,Ahom,Anatolian_Hieroglyphs,Hluw,Arabic,Arab,Armenian,Armn,Avestan,Avst,Balinese,Bali,Bamum,Bamu,Bassa_Vah,Bass,Batak,Batk,Bengali,Beng,Bhaiksuki,Bhks,Bopomofo,Bopo,Brahmi,Brah,Braille,Brai,Buginese,Bugi,Buhid,Buhd,Canadian_Aboriginal,Cans,Carian,Cari,Caucasian_Albanian,Aghb,Chakma,Cakm,Cham,Cherokee,Cher,Common,Zyyy,Coptic,Copt,Qaac,Cuneiform,Xsux,Cypriot,Cprt,Cyrillic,Cyrl,Deseret,Dsrt,Devanagari,Deva,Dogra,Dogr,Duployan,Dupl,Egyptian_Hieroglyphs,Egyp,Elbasan,Elba,Elymaic,Elym,Ethiopic,Ethi,Georgian,Geor,Glagolitic,Glag,Gothic,Goth,Grantha,Gran,Greek,Grek,Gujarati,Gujr,Gunjala_Gondi,Gong,Gurmukhi,Guru,Han,Hani,Hangul,Hang,Hanifi_Rohingya,Rohg,Hanunoo,Hano,Hatran,Hatr,Hebrew,Hebr,Hiragana,Hira,Imperial_Aramaic,Armi,Inherited,Zinh,Qaai,Inscriptional_Pahlavi,Phli,Inscriptional_Parthian,Prti,Javanese,Java,Kaithi,Kthi,Kannada,Knda,Katakana,Kana,Kayah_Li,Kali,Kharoshthi,Khar,Khmer,Khmr,Khojki,Khoj,Khudawadi,Sind,Lao,Laoo,Latin,Latn,Lepcha,Lepc,Limbu,Limb,Linear_A,Lina,Linear_B,Linb,Lisu,Lycian,Lyci,Lydian,Lydi,Mahajani,Mahj,Makasar,Maka,Malayalam,Mlym,Mandaic,Mand,Manichaean,Mani,Marchen,Marc,Medefaidrin,Medf,Masaram_Gondi,Gonm,Meetei_Mayek,Mtei,Mende_Kikakui,Mend,Meroitic_Cursive,Merc,Meroitic_Hieroglyphs,Mero,Miao,Plrd,Modi,Mongolian,Mong,Mro,Mroo,Multani,Mult,Myanmar,Mymr,Nabataean,Nbat,Nandinagari,Nand,New_Tai_Lue,Talu,Newa,Nko,Nkoo,Nushu,Nshu,Nyiakeng_Puachue_Hmong,Hmnp,Ogham,Ogam,Ol_Chiki,Olck,Old_Hungarian,Hung,Old_Italic,Ital,Old_North_Arabian,Narb,Old_Permic,Perm,Old_Persian,Xpeo,Old_Sogdian,Sogo,Old_South_Arabian,Sarb,Old_Turkic,Orkh,Oriya,Orya,Osage,Osge,Osmanya,Osma,Pahawh_Hmong,Hmng,Palmyrene,Palm,Pau_Cin_Hau,Pauc,Phags_Pa,Phag,Phoenician,Phnx,Psalter_Pahlavi,Phlp,Rejang,Rjng,Runic,Runr,Samaritan,Samr,Saurashtra,Saur,Sharada,Shrd,Shavian,Shaw,Siddham,Sidd,SignWriting,Sgnw,Sinhala,Sinh,Sogdian,Sogd,Sora_Sompeng,Sora,Soyombo,Soyo,Sundanese,Sund,Syloti_Nagri,Sylo,Syriac,Syrc,Tagalog,Tglg,Tagbanwa,Tagb,Tai_Le,Tale,Tai_Tham,Lana,Tai_Viet,Tavt,Takri,Takr,Tamil,Taml,Tangut,Tang,Telugu,Telu,Thaana,Thaa,Thai,Tibetan,Tibt,Tifinagh,Tfng,Tirhuta,Tirh,Ugaritic,Ugar,Vai,Vaii,Wancho,Wcho,Warang_Citi,Wara,Yi,Yiii,Zanabazar_Square,Zanb,';

function LF_DEBUG(flags) {
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

const ALWAYS_GOOD = 0;
const GOOD_WITH_U_FLAG = 1;
const GOOD_SANS_U_FLAG = 2;
const ALWAYS_BAD = 4;

const FIRST_CHAR = true;
const NON_START = false;

const CHARCLASS_BAD = 0x110000;
const CHARCLASS_BAD_RANGE = 0x110001;
const CHARCLASS_BAD_SANS_U_FLAG = 1<<23;
const CHARCLASS_BAD_WITH_U_FLAG = 1<<24;
const CHARCLASS_CLASS_ESCAPE = 1<<25; // \d \w \s etc, for webcompat checks in ranges

const EOF_SYMBOL = 0x10000; // well. it's better than undefined. (todo: write blog post and refer to that)

const COLLECT_TOKENS_NONE = 0;
const COLLECT_TOKENS_SOLID = 1; // non-whitespace
const COLLECT_TOKENS_ALL = 2;

const WEB_COMPAT_OFF = false;
const WEB_COMPAT_ON = true;

const RETURN_ANY_TOKENS = true;
const RETURN_SOLID_TOKENS = false;

const WHITESPACE_TOKEN = true;
const SOLID_TOKEN = false;

const PARSING_FROM_TICK = true;
const PARSING_SANS_TICK = false;

const FAIL_GRACEFULLY = true;
const FAIL_HARD = false;

const FOR_TEMPLATE = true; // templates are never not allowed to have octal escapes except when tagged
const NOT_TEMPLATE = false;

let NOT_A_REGEX_ERROR = '';
let CODEPOINT_FROM_ESCAPE = -1;

// These error codes must be negative as not to be ambiguous with decoded escape values
let INVALID_IDENT_CHAR = -1;
let VALID_SINGLE_CHAR = -2;
let VALID_DOUBLE_CHAR = -3;

let ID_START_REGEX = /|/;
let ID_CONTINUE_REGEX = /|/;
(function(){
  try {
    ID_START_REGEX = new RegExp('^\\p{ID_Start}$','u');
    ID_CONTINUE_REGEX = new RegExp('^\\p{ID_Continue}$','u');
  } catch(e) {
    console.warn('ZeParser: Unable to create regexes with unicode property escapes; unicode support disabled (' + e.message + ')');
  }
})();

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

  const supportRegexPropertyEscapes = targetEsVersion === 9 || targetEsVersion === Infinity;
  const supportRegexLookbehinds = targetEsVersion === 9 || targetEsVersion === Infinity;
  const supportRegexDotallFlag = targetEsVersion === 9 || targetEsVersion === Infinity;
  const supportRegexNamedGroups = targetEsVersion === 9 || targetEsVersion === Infinity;

  let pointer = 0;
  let len = input.length;

  let wasWhite = false;
  let consumedNewlinesThisToken = 0; // whitespace newline token or string token that contained newline or multiline comment
  let consumedComment = false; // needed to confirm requirement to parse --> closing html comment
  let finished = false; // generated an $EOF?
  let lastParsedIdent = ''; // updated after parsing an ident. used to canonicalize escaped identifiers (a\u{65}b -> aab). this var will NOT contain escapes
  let lastRegexUnicodeEscapeOrd = 0; // need this to validate unicode escapes in named group identifiers :/
  let lastPotentialRegexError = '';
  let lastReportableTokenizerError = ''; // set whenever an $error is returned

  let currentLine = 1; // the number of newlines, crlf sensitive (the pair is considered 1 line)
  let currentColOffset = 0; // position in the input code of the first character after the last newline

  let cache = input.charCodeAt(0);

  let webModeWarnings = []; // when parsing anything that is only accepted because of annex B in the spec <token, desc>

  let tokens = null;
  let anyTokenCount = 0;
  let solidTokenCount = 0;
  if (collectTokens !== COLLECT_TOKENS_NONE) {
    tokens = tokenStorage;
    nextToken.tokens = tokens; // probably will want to find a better way..
  }

  function peek() {
    ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'peek is not expecting args');
    ASSERT(cache === input.charCodeAt(pointer), 'cache should be up to date');

    return cache;
  }
  function peekUnicode() {
    // returns codePointAt if and only if charCodeAt returned >127 (UNCACHED!)
    ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');
    ASSERT(cache === input.charCodeAt(pointer), 'cache should be up to date');

    if (cache > 127) return input.codePointAt(pointer);
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
    //ASSERT(neof(), 'pointer not oob');
    ASSERT(!arguments.length, 'no args');
    ASSERT(neof(), 'lexer input pointer not oob');

    let t = cache;
    cache = skipPeek();
    return t;
  }
  function ASSERT_skipPeek(c) {
    ASSERT(ASSERT_skipPeek.length === arguments.length, 'arg count');
    ASSERT(cache === c, 'expecting to skip a particular char', c, cache);
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
  function nextToken(lexerFlags = INITIAL_LEXER_FLAGS, _returnAny=RETURN_SOLID_TOKENS) {
    ASSERT(arguments.length >= 1 && arguments.length <= 4, 'arg count 1~4');
    ASSERT(!finished, 'should not next() after eof token');
    // https://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean

    let token;
    do {
      ++anyTokenCount;
      let startCol = pointer - currentColOffset;
      let startRow = currentLine;
      if (neof()) {
        let cstart = cache;
        let start = startForError = pointer; // TODO: see if startForError makes a dent at all
        wasWhite = false;
        let nlwas = consumedNewlinesThisToken; // Do not include the newlines for the token itself unless whitespace (ex: `` throw `\n` ``)
        let consumedTokenType = next(lexerFlags);
        token = createToken(consumedTokenType, start, pointer, startCol, startRow, nlwas, wasWhite, cstart);
        if (collectTokens === COLLECT_TOKENS_ALL) tokens.push(token);
      } else {
        token = createToken($EOF, pointer, pointer, startCol, startRow, consumedNewlinesThisToken, WHITESPACE_TOKEN, 0);
        finished = true;
        break;
      }
    } while (wasWhite && _returnAny === RETURN_SOLID_TOKENS);
    ++solidTokenCount;
    if (collectTokens === COLLECT_TOKENS_SOLID) tokens.push(token);
    if (!wasWhite) {
      consumedNewlinesThisToken = 0;
      consumedComment = false;
    }

    return token;
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
    if (collectTokens !== COLLECT_TOKENS_NONE) tokens.push(token, tokens.pop());
    ++anyTokenCount;
    ++solidTokenCount; // eh... i guess.
  }

  function createToken(type, start, stop, col, line, nl, ws, c) {
    ASSERT(createToken.length === arguments.length);
//ASSERT(cache === input.charCodeAt(start), 'c should not be skipped yet');

    ASSERT(typeof c === 'number' && c >= 0 && c <= 0x10ffff, 'valid c', c);

    let str = slice(start, stop);
    let canon = type === $IDENT ? lastParsedIdent : str;
    return {
      // <SCRUB DEV>
      _t: debug_toktype(type),
      // </SCRUB DEV>
      type,
      ws, // is this token considered whitespace? (space, tab, newline, comment)
      nl, // how many newlines between the start of the previous relevant token and the start of this one?
      start,
      stop, // start of next token
      col, // of first char of token
      line, // of first char of token
      c,
      str,
      // :'( https://tc39.github.io/ecma262/#prod-EscapeSequence
      // The ReservedWord definitions are specified as literal sequences of specific SourceCharacter elements.
      // A code point in a ReservedWord cannot be expressed by a \ UnicodeEscapeSequence.
      canon, // will NOT contain escapes // TODO: should perf check this, perhaps we need to take this slowpath differently

      // <SCRUB DEV>
      toString() {
        return `{# ${debug_toktype(type)} : nl=${nl?'Y':'N'} ws=${ws?'Y':'N'} ${start}:${stop} curc=${c} \`${str}\`${canon!==str?' (canonical=`' + canon + '`)':''}#}`;
      },
      // </SCRUB DEV>
    };
  }

  function next(lexerFlags) {
    ASSERT(arguments.length === 1);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags bit flags');

    let c = peekSkip();

    if (isAsciiLetter(c)) return parseIdentifierRest(c, String.fromCharCode(c));

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
        // TODO: only support this under the webcompat flag
        // TODO: and properly parse this, not like the duplicate hack it is now
        if (!eofd(1) && moduleGoal === GOAL_SCRIPT && peek() === $$DASH_2D && peekd(1) === $$GT_3E) {
          if (consumedNewlinesThisToken > 0 || consumedComment) {
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
        return parseIdentifierRest(c, '$');
      case $$PERCENT_25:
        return parseCompoundAssignment(); // % %=
      case $$FF_0C:
        wasWhite = true;
        return $WHITE;
      case $$VTAB_0B:
        wasWhite = true;
        return $WHITE;
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
        return parseIdentifierRest(c, '_');
      case $$OR_7C:
        return parseSameOrCompound(c); // | || |=
      case $$QMARK_3F:
        return $PUNCTUATOR;
      case $$LT_3C:
        if (!eofd(3) && moduleGoal === GOAL_SCRIPT && peek() === $$EXCL_21 && peekd(1) === $$DASH_2D && peekd(2) === $$DASH_2D) {
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
        return $WHITE;
      default:
        return parseOtherUnicode(c);
    }
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
      return $CRLF;
    }
    incrementLine();
    return $NL;
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
        bad = parseStringEscape(lexerFlags, NOT_TEMPLATE) === BAD_ESCAPE || bad;
      }
    }

    if (bad || c !== marker) {
      lastReportableTokenizerError = 'Unclosed string or string had an illegal escape';
      return $ERROR;
    }
    return tokenType;
  }
  function parseStringEscape(lexerFlags, forTemplate) {
    ASSERT(arguments.length === parseStringEscape.length, 'need args');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    if (eof()) return BAD_ESCAPE; // you cant escape eof ;)

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
        // need to determine what to do with \8 and \9 in strict mode
        return parseStringEscapeOctal(c, forTemplate, lexerFlags);

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
    if (!peeky($$CURLY_R_7D)) return BAD_ESCAPE;
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
  function parseStringEscapeOctal(a, forTemplate, lexerFlags) {
    ASSERT(arguments.length === parseStringEscapeOctal.length, 'need args');
    ASSERT(typeof a === 'number', 'first digit ord');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    if ((lexerFlags & LF_STRICT_MODE) === LF_STRICT_MODE || forTemplate === FOR_TEMPLATE) {
      if (a === $$0_30) {
        if (eof()) return GOOD_ESCAPE; // will still lead to an eof error later for the next token
        let b = peek();
        if (b < $$0_30 || b > $$9_39) return GOOD_ESCAPE; // `\0` without digit following is ok in strict/tpl
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

  function parseTemplateString(lexerFlags, fromTick) {
    // parseTick
    ASSERT(arguments.length === 2, 'need 2 args');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    // https://tc39.github.io/ecma262/#prod-CodePoint
    // "A conforming implementation must not use the extended definition of EscapeSequence described in B.1.2 when parsing a TemplateCharacter."

    // Since ES9 a _tagged_ tick literal can contain illegal escapes. Regular template strings must still conform. So
    // we just add the $TICK_BAD_ESCAPE flag in the token type indicating whether or not the token contains a bad escape.

    // `...`
    // `...${expr}...`
    // `...${expr}...${expr}...`

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
          lastReportableTokenizerError = 'Unclosed template string';
          return $ERROR;
        }
        c = peek();

        if (c === $$CURLY_L_7B) {
          ASSERT_skip($$CURLY_L_7B);
          return (fromTick ? $TICK_HEAD : $TICK_BODY) | (badEscapes ? $TICK_BAD_ESCAPE : 0);
        }
      }

      if (c === $$TICK_60) {
        ASSERT_skip($$TICK_60);
        return (fromTick ? $TICK_PURE : $TICK_TAIL) | (badEscapes ? $TICK_BAD_ESCAPE : 0);
      }

      if (c === $$CR_0D) {
        ASSERT_skip($$CR_0D);
        // crlf is considered one line for the sake of reporting line-numbers
        if (neof() && peeky($$LF_0A)) ASSERT_skip($$LF_0A);
        incrementLine();
      } else if (isLfPsLs(c)) {
        ASSERT_skip(c);
        incrementLine();
      } else if (c === $$BACKSLASH_5C) {
        // TODO: isnt a string escape in a template always considered a strict mode escape?
        ASSERT_skip($$BACKSLASH_5C);
        badEscapes = parseStringEscape(lexerFlags, FOR_TEMPLATE) || badEscapes;
      } else {
        ASSERT_skip(c);
      }
    }

    lastReportableTokenizerError = 'Unclosed template literal';
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
        lastReportableTokenizerError = '"Illegal" octal escape in strict mode';
        return $ERROR;
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
    if (eof()) {
      lastReportableTokenizerError = '`0x` is illegal without a digit';
      return $ERROR;
    }

    // at least one digit is required
    if (!isHex(peek())) {
      lastReportableTokenizerError = '`0x` is illegal without a digit';
      return $ERROR;
    }

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
    if (eof()) {
      lastReportableTokenizerError = '`0o` is illegal without a digit';
      return $ERROR;
    }

    // at least one digit is required
    if (!isOctal(peek())) {
      lastReportableTokenizerError = '`0o` is illegal without a digit';
      return $ERROR;
    }

    while (neof() && isOctal(peek())) skip();

    return $NUMBER_OCT;
  }
  function isOctal(ord) {
    return ord >= $$0_30 && ord <= $$7_37;
  }
  function parseBinary() {
    if (eof()) {
      lastReportableTokenizerError = '`0b` is illegal without a digit';
      return $ERROR;
    }

    // at least one digit is required
    if (!isBinary(peek())) {
      lastReportableTokenizerError = '`0b` is illegal without a digit';
      return $ERROR;
    }

    while (neof() && isBinary(peek())) skip();

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

  function parseIdentifierRest(cLeading, prev) {
    ASSERT(typeof cLeading === 'number', 'should get the parsed ident start');
    ASSERT(isIdentStart(cLeading, CODEPOINT_FROM_ESCAPE) !== INVALID_IDENT_CHAR, 'ident start should already have been confirmed');
    ASSERT(typeof prev === 'string', 'prev should be string so far or empty');
    return _parseIdentifierRest(cLeading, prev);
  }
  function _parseIdentifierRest(c, prev) {
    ASSERT(typeof c === 'number', 'c is an ord');
    ASSERT(typeof prev === 'string', 'prev should be string so far or empty');
    if (neof()) {
      let c = peek();
      do {
        if (c === $$BACKSLASH_5C) {
          // this ident is part of an identifier. if the backslash is invalid or the escaped codepoint not valid for the
          // identifier then an $ERROR token should be yielded since the backslash cannot be valid in any other way here
          if (peekd(1) === $$U_75) {
            ASSERT_skip($$BACKSLASH_5C);
            ASSERT_skip($$U_75);
            c = parseRegexUnicodeEscape2();
            if (c === INVALID_IDENT_CHAR || c === CHARCLASS_BAD) {
              regexSyntaxError('Found invalid quad unicode escape, the escape must be part of the ident so the ident is an error');
              return $ERROR;
            }
            if ((c & CHARCLASS_BAD_SANS_U_FLAG) === CHARCLASS_BAD_SANS_U_FLAG) {
              c = c ^ CHARCLASS_BAD_SANS_U_FLAG;
            }
            let wide = isIdentRestChr(c, CODEPOINT_FROM_ESCAPE);
            if (wide === INVALID_IDENT_CHAR) {
              regexSyntaxError('An escape that might be part of an identifier cannot be anything else so if it is invalid it must be an error');
              return $ERROR;
            }
            if (wide === VALID_SINGLE_CHAR) prev += String.fromCharCode(c);
            else prev += String.fromCodePoint(c);
          } else {
            regexSyntaxError('Only unicode escapes are legal in identifier names');
            return $ERROR;
          }
        }
        else {
          let wide = isIdentRestChr(c, pointer);
          if (wide === INVALID_IDENT_CHAR) break;
          if (wide === VALID_DOUBLE_CHAR) {
            prev += input.slice(pointer, pointer + 2); // we could try to get the ord and fromCodePoint for perf
            skip();
            skip();
          } else {
            ASSERT(wide === VALID_SINGLE_CHAR, 'enum');
            ASSERT_skip(c);
            prev += String.fromCharCode(c); // TODO: if this affects perf we can try a slice after the loop
          }
        }
        if (eof()) break;
        c = peek();
      } while (true);
      // slow path, dont test this inside the super hot loop above
      if (c === $$BACKSLASH_5C) {
        ASSERT_skip($$BACKSLASH_5C);
        return parseIdentFromUnicodeEscape(NON_START, prev);
      }
    }
    lastParsedIdent = prev;
    return $IDENT;
  }
  function parseIdentFromUnicodeEscape(fromStart, prev) {
    ASSERT(typeof prev === 'string', 'prev should be string so far or empty');
    if (eof()) {
      lastParsedIdent = prev;
      lastReportableTokenizerError = 'Encountered a backslash at end of input';
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
    if (parseIdentOrStringEscapeUnicode() === GOOD_ESCAPE) {
      let data;
      if (peekyd(start - pointer, $$CURLY_L_7B)) {
        data = slice(start + 1, pointer);
        if (eof()) {
          lastParsedIdent = prev;
          lastReportableTokenizerError = 'Identifier contained dynamic unicode escape that was not closed';
          return $ERROR;
        }
        if (peeky($$CURLY_R_7D)) {
          ASSERT_skip($$CURLY_R_7D);
        } else {
          lastParsedIdent = prev;
          lastReportableTokenizerError = 'Identifier contained dynamic unicode escape that was not closed';
          return $ERROR;
        }
      } else {
        data = slice(start , pointer);
      }
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
        return _parseIdentifierRest(ord, prev);
      } else if (fromStart === NON_START && isIdentRestChr(ord, CODEPOINT_FROM_ESCAPE) !== INVALID_IDENT_CHAR) {
        return _parseIdentifierRest(ord, prev);
      } else {
        lastParsedIdent = prev;
        lastReportableTokenizerError = 'Identifier escape did not yield a valid identifier character';
        return $ERROR;
      }
    }
    _parseIdentifierRest(0, prev); // keep on parsing the identifier but we will make it an error token
    lastParsedIdent = prev;
    lastReportableTokenizerError = 'Only _unicode_ escapes are supported in identifiers';
    return $ERROR;
  }

  function isIdentStart(c, offset){
    ASSERT(isIdentStart.length === arguments.length, 'all args');
    if (isAsciiLetter(c)) return VALID_SINGLE_CHAR;
    if (c === $$$_24 || c === $$LODASH_5F) return VALID_SINGLE_CHAR;
    if (c > 127) {
      // now we have to do an expensive... but proper unicode check
      return veryExpensiveUnicodeCheck(c, offset, ID_START_REGEX);
    }
    return INVALID_IDENT_CHAR;
  }
  function isIdentRestChr(c, offset){
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
      return veryExpensiveUnicodeCheck(c, offset, ID_CONTINUE_REGEX);
    }
    return INVALID_IDENT_CHAR;
  }
  function veryExpensiveUnicodeCheck(c, offset, regexScanner) {
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
      ASSERT_skip($$FWDSLASH_2F); // //
      wasWhite = true;
      return parseCommentSingle();
    } else if (c === $$STAR_2A) {
      // must be multi comment
      ASSERT_skip($$STAR_2A); // /*
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
    consumedComment = true;
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
    consumedComment = true;
    let c;
    while (neof()) {
      c = peekSkip();
      while (c === $$STAR_2A) {
        if (eof()) {
          lastReportableTokenizerError = 'Unclosed multi line comment, early eof after star';
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
    lastReportableTokenizerError = 'Unclosed multi line comment, early eof';
    return $ERROR;
  }
  function parseCommentHtmlOpen() {
    // parseHtmlComment
    // This is the starting html comment <!--
    // the spec defines it as the start of a single line JS comment
    // TODO: hide this under the web compat flag
    // TODO: and clean the check up already
    parseCommentSingle();
    wasWhite = true;
    return $COMMENT_HTML;
  }
  function parseCommentHtmlClose() {
    // parseHtmlComment
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

  function parseNewline() {
    incrementLine();
    wasWhite = true;
    return $NL;
  }

  function parseBackslash() {
    return parseIdentFromUnicodeEscape(FIRST_CHAR, '');
  }

  let lastRegexState = NOT_A_REGEX_ERROR; // syntax errors are reported here. empty string means no error. yupyup
  function regexSyntaxError(desc, ...rest) {
    lastRegexState = desc + (rest.length ? ': [' + rest.join(', ') + ']' : '');
    lastReportableTokenizerError = lastPotentialRegexError = lastRegexState;
    return ALWAYS_BAD;
  }

  let nCapturingParens = 0;
  let largestBackReference = 0;
  function parseRegex(c) {
    nCapturingParens = 0;
    largestBackReference = 0;
    lastPotentialRegexError = '';
    lastRegexState = NOT_A_REGEX_ERROR; // we can use a "global" because regexes don't nest
    let ustatusBody = parseRegexBody(c);
    let ustatusFlags = parseRegexFlags();
    if (nCapturingParens < largestBackReference) {
      if (webCompat === WEB_COMPAT_ON) {
        // skip this check
        ustatusBody = updateRegexUflagState(ustatusBody, GOOD_SANS_U_FLAG, 'Regex was bad with and without u-flag');
      } else {
        ustatusBody = regexSyntaxError('Largest back reference index exceeded the number of capturing groups');
      }
    }
    if (lastRegexState !== NOT_A_REGEX_ERROR) {
      lastReportableTokenizerError = lastRegexState;
      return $ERROR;
    }
    if (ustatusBody === ALWAYS_BAD) {
      lastReportableTokenizerError = 'Regex body had an illegal escape sequence';
      return $ERROR;
    }
    if (ustatusFlags === ALWAYS_BAD) {
      lastReportableTokenizerError = 'Regex body had an illegal escape sequence or a regex flag occurred twice (should already have called THROW for this)';
      return $ERROR;
    }

    if (ustatusBody === GOOD_WITH_U_FLAG) {
      // body had an escape that is only valid with an u flag
      if (ustatusFlags === GOOD_WITH_U_FLAG) return $REGEXU;
      lastReportableTokenizerError = 'Regex body had an escape that is only valid with an u-flag, but it had no u-flag';
      regexSyntaxError('Regex had syntax that is only valid with the u-flag and u-flag was in fact not present');
      return $ERROR;
    }

    if (ustatusBody === GOOD_SANS_U_FLAG) {
      // body had an escape or char class range that is invalid with a u flag
      if (ustatusFlags !== GOOD_WITH_U_FLAG) return $REGEX;
      // in this case the body had syntax that's invalid with a u flag and the flag was present anyways
      lastReportableTokenizerError = 'Regex body had an escape or char class range that is invalid with a u-flag, but it did have a u-flag';
      regexSyntaxError('Regex had syntax that is invalid with u-flag and u-flag was in fact present');
      return $ERROR;
    }
    ASSERT(ustatusBody === ALWAYS_GOOD, 'the body had no syntax depending on a u-flag so is always good');
    if (ustatusFlags === GOOD_WITH_U_FLAG) return $REGEXU;
    return $REGEX;
  }
  function parseRegexBody(c) {
    ASSERT(c !== $$STAR_2A && c !== $$FWDSLASH_2F, 'earlier checks should already have peeked for a comment token');
    return _parseRegexBody(c, 0, ALWAYS_GOOD);
  }
  function cannotBeQuantifier(c, uflagStatus, webcompatException, msg) {
    let badStart = c === $$STAR_2A || c === $$PLUS_2B || c === $$QMARK_3F || c === $$CURLY_L_7B;
    if (badStart) {
      if (webcompatException && webCompat === WEB_COMPAT_ON) {
        uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, msg);
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
            uflagStatus = cannotBeQuantifier(c, uflagStatus, c === $$CURLY_L_7B, 'Regex Assertion "atoms" can not be quantified but this `$` was quantified anyways');
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
              if (escapeStatus === ALWAYS_BAD) {
                uflagStatus = ALWAYS_BAD;
              } else if (escapeStatus === GOOD_SANS_U_FLAG) {
                uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, 'Unknown reason that is only an error with u-flag');
              } else if (escapeStatus === GOOD_WITH_U_FLAG) {
                uflagStatus = updateRegexUflagState(uflagStatus, GOOD_WITH_U_FLAG, 'Unknown reason that is only an error without u-flag');
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
                } else if (c === $$BACKSLASH_5C) {
                  // parseRegexNamedGroup
                  // - `(?<\u0065ame>xyz)/``
                  //       ^
                  ASSERT_skip($$BACKSLASH_5C);
                  if (eof()) TODO; // pretty sure I need to check eof in between...
                  ASSERT_skip($$U_75);

                  c = parseRegexUnicodeEscape2(); // will check EOF first, consume a valid unicode escape, else bail
                  if (c === INVALID_IDENT_CHAR || c === CHARCLASS_BAD) {
                    uflagStatus = regexSyntaxError('Found invalid quad unicode escape');
                    break;
                  }
                  let wasExtendedEscape = false;
                  if ((c & CHARCLASS_BAD_SANS_U_FLAG) === CHARCLASS_BAD_SANS_U_FLAG) {
                    uflagStatus = updateRegexUflagStateCharClass(uflagStatus, CHARCLASS_BAD_SANS_U_FLAG, 'Encountered extended unicode escape `\\u{}` which is only valid with u-flag but this regex is invalid with u-flag');
                    c = c ^ CHARCLASS_BAD_SANS_U_FLAG;
                    wasExtendedEscape = true;
                  }

                  let wide = isIdentStart(c, CODEPOINT_FROM_ESCAPE);
                  if (wide === INVALID_IDENT_CHAR) {
                    uflagStatus = regexSyntaxError('Named capturing group named contained an invalid unicode escaped char');
                    break;
                  }
                  let result = parseRegexCapturingGroupNameRemainder(c, groupNames); // EOF is checked inside
                  if (result !== ALWAYS_GOOD) {
                    uflagStatus = result;
                    break;
                  }

                  c = $$GT_3E; // TODO: dont think this does anything
                } else {
                  // - `(?<name>xyz)/``
                  //       ^
                  let wide = isIdentStart(c, pointer);

                  if (wide === VALID_DOUBLE_CHAR) {
                    ASSERT_skip(c);
                    skip();
                  } else {
                    ASSERT(wide === VALID_SINGLE_CHAR || wide === INVALID_IDENT_CHAR, 'enum');
                    ASSERT_skip(c);
                  }

                  if (wide === INVALID_IDENT_CHAR) {
                    if (webCompat === WEB_COMPAT_OFF) {
                      uflagStatus = regexSyntaxError('Could not parse `(?<` as a named capturing group and it was not an assertion; bailing', c);
                    }
                    break;
                  }

                  // Do NOT update c yet. We pass on the first char after consuming it. EOF is checked inside, too.
                  let result = parseRegexCapturingGroupNameRemainder(c, groupNames);
                  if (result !== ALWAYS_GOOD) {
                    uflagStatus = result;
                    break;
                  }

                  c = $$GT_3E; // TODO: unnecessary (even bad?) because the first statement after this will c=peek()
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

          let subbad = _parseRegexBody(c, groupLevel + 1, ALWAYS_GOOD);

          if (eof()) {
            uflagStatus = regexSyntaxError('Encountered early EOF');
            break;
          }

          c = peek();

          if (wasFixableAssertion || wasUnfixableAssertion) {
            // Only `(?=` and `(?!` can be legal in web compat mode and without the u-flag. Anything else is always bad.
            uflagStatus = cannotBeQuantifier(c, uflagStatus, !wasUnfixableAssertion, 'Regex Assertion "atoms" can not be quantified (so things like `^`, `$`, and `(?=` can not have `*`, `+`, `?`, or `{` following it)');
          }

          afterAtom = true;
          if (subbad === ALWAYS_BAD) {
            uflagStatus = ALWAYS_BAD; // should already have THROWn for this
          } else if (subbad === GOOD_SANS_U_FLAG) {
            uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, 'Unknown reason that is only an error with u-flag');
          } else if (subbad === GOOD_WITH_U_FLAG) {
            uflagStatus = updateRegexUflagState(uflagStatus, GOOD_WITH_U_FLAG, 'Unknown reason that is only an error without u-flag');
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
          ASSERT_skip($$SQUARE_L_5B);

          let charClassEscapeStatus = parseRegexCharClass();
          if (charClassEscapeStatus === ALWAYS_BAD) {
            uflagStatus = ALWAYS_BAD; // should already have THROWn for this
          } else if (charClassEscapeStatus === GOOD_SANS_U_FLAG) {
            uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, 'Unknown reason that is only an error with u-flag');
          } else if (charClassEscapeStatus === GOOD_WITH_U_FLAG) {
            uflagStatus = updateRegexUflagState(uflagStatus, GOOD_WITH_U_FLAG, 'Unknown reason that is only an error without u-flag');
          }
          afterAtom = true;
          break;
        case $$SQUARE_R_5D:
          // this is always bad since we have a quantifier parser that consumes valid curlies
          ASSERT_skip($$SQUARE_R_5D);
          if (webCompat === WEB_COMPAT_ON) {
            uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, 'Regex was bad with and without u-flag');
          } else {
            uflagStatus = regexSyntaxError('Encountered unescaped closing square bracket `]` while not parsing a character class');
          }
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
            uflagStatus = regexSyntaxError('Encountered unescaped quantifier (ord=' + c + ') without a value to quantify');
          }
          break;

        case $$CURLY_L_7B:
          // explicit quantifier
          // This is valid if we just parsed an atom, or in webcompat mode without the u-flag
          ASSERT_skip($$CURLY_L_7B);
          if (afterAtom) {
            if (!parseRegexCurlyQuantifier()) {
              if (webCompat === WEB_COMPAT_OFF) {
                uflagStatus = regexSyntaxError('Encountered unescaped closing curly `}` while not parsing a quantifier');
              } else {
                uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, 'Regex was bad with and without u-flag');
              }
            }
            if (neof() && peeky($$QMARK_3F)) {
              ASSERT_skip($$QMARK_3F);
            }
            afterAtom = false;
          } else {
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
              if (parseRegexCurlyQuantifier()) {
                uflagStatus = regexSyntaxError('Encountered illegal curly quantifier without anything to quantify. This is `InvalidBracedQuantifier` and explicitly a syntax error');
              } else {
                // This in webcompat is `{` as `ExtendedAtom` is a `ExtendedPatternCharacter`, which does not disallow the curly
                uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, 'Regex was bad with and without u-flag');
                // in web compat mode this case is treated as an extended atom
                afterAtom = true;
              }
            } else {
              uflagStatus = regexSyntaxError('Encountered unescaped opening curly `{` and the previous character was not part of something quantifiable');
            }
          }
          break;
        case $$CURLY_R_7D:
          ASSERT_skip($$CURLY_R_7D);
          if (webCompat === WEB_COMPAT_OFF) {
            // this is always bad since we have a quantifier parser that consumes valid curly pairs
            uflagStatus = regexSyntaxError('Encountered unescaped closing curly `}` while not parsing a quantifier');
            afterAtom = false;
          } else {
            // in web compat mode you're allowed to have an unescaped curly as atom
            uflagStatus = updateRegexUflagState(uflagStatus, GOOD_SANS_U_FLAG, 'Found a rhs curly as an Atom, only valid without u-flag and with web compat mode, but already found something that invalidates not having the u-flag so cant validate this regex');
            // in web compat mode this case is treated as an extended atom
            afterAtom = true;
          }
          break;

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
  function parseRegexCapturingGroupNameRemainder(firstCharOrd, groupNames) {
    // pointer should be up to date
    // the first char of the group name should have been confirmed and parsed

    if (eof()) {
      return regexSyntaxError('Encountered early EOF');
    }

    if (peeky($$GT_3E)) {
      // name is one character (BUT NOT NECESSARILY ONE BYTE)
      lastParsedIdent = String.fromCodePoint(firstCharOrd);
    } else {
      parseIdentifierRest(firstCharOrd, '');
    }

    let name = lastParsedIdent;
    if (groupNames['#' + name]) {
      return regexSyntaxError('Each group name can only be declared once: `' + name + '`');
    }
    groupNames['#' + name] = true;

    // named capturing group
    ++nCapturingParens;

    if (!peeky($$GT_3E)) {
      if (webCompat === WEB_COMPAT_OFF) {
        return regexSyntaxError('Missing closing angle bracket of name of group');
      }
    }

    ASSERT(webCompat === WEB_COMPAT_ON || input[pointer] === '>', 'should not have parsed the closing `>` (so this must be a bad token)');
    return ALWAYS_GOOD;
  }
  function parseRegexAtomEscape(c, namedBackRefs) {
    // backslash already parsed, c is peeked

    // -- u flag is important
    // -- u flag can affect range (surrogate pairs in es5 vs es6)
    // -- char class range _must_ be low-hi unless dash is the first or last char
    // -- \u{...} only allowed with u flag
    // -- unicode, digit, char, hex escapes


    switch (c) {
      case $$U_75:
        ASSERT_skip($$U_75);
        return parseRegexUnicodeEscape();

      // hex
      case $$X_78:
        ASSERT_skip(c);
        if (eof()) return regexSyntaxError('Encountered early EOF while parsing hex escape (1)');
        let a = peek();
        if (!isHex(a))
          if (webCompat === WEB_COMPAT_ON) {
            return GOOD_SANS_U_FLAG;
          } else {
            return regexSyntaxError('First char of hex escape not a valid digit');
          }
        ASSERT_skip(a);
        if (eof()) return regexSyntaxError('Encountered early EOF while parsing hex escape (2)');
        let b = peek();
        if (!isHex(b)) {
          if (webCompat === WEB_COMPAT_ON) {
            return GOOD_SANS_U_FLAG;
          } else {
            return regexSyntaxError('Second char of hex escape not a valid digit');
          }
        }
        ASSERT_skip(b);
        return ALWAYS_GOOD;

      // char escapes
      case $$C_63:
        ASSERT_skip($$C_63);
        if (eof()) return regexSyntaxError('Encountered early EOF while parsing char escape');
        let d = peek();
        if (isAsciiLetter(d)) {
          ASSERT_skip(d);
          return ALWAYS_GOOD;
        }
        if (webCompat === WEB_COMPAT_ON) {
          // this is now an `IdentityEscape` and just parses the `c` itself
          return GOOD_SANS_U_FLAG;
        } else {
          return regexSyntaxError('Illegal char escape char (ord=' + d);
        }

      // control escapes
      case $$F_66:
        ASSERT_skip(c);
        return ALWAYS_GOOD;

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
        return ALWAYS_GOOD;

      // Unicode property escapes \p{<?...?>} \P{<?...?>}
      case $$P_70:
      case $$P_UC_50:
        let regexPropState = parseRegexPropertyEscape(c);
        if (regexPropState === ALWAYS_BAD) {
          return ALWAYS_BAD;
        } else if (regexPropState === GOOD_SANS_U_FLAG) {
          // semantically ignored without u-flag, syntactically only okay in web-compat / Annex B mode
          if (webCompat === WEB_COMPAT_ON) return GOOD_SANS_U_FLAG;
          return ALWAYS_BAD;
        } else {
          ASSERT(regexPropState === GOOD_WITH_U_FLAG, 'parseRegexPropertyEscape should not return ALWAYS_GOOD and this is an enum');
          if (webCompat === WEB_COMPAT_ON) return ALWAYS_GOOD;
          return GOOD_WITH_U_FLAG;
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
        return ALWAYS_GOOD;

      // digits
      case $$0_30:
        ASSERT_skip($$0_30);
        // cannot be followed by another digit unless webcompat
        if (eof()) return ALWAYS_GOOD; // let error happen elsewhere
        if (isAsciiNumber(peek())) {
          if (webCompat === WEB_COMPAT_ON) {
            return GOOD_SANS_U_FLAG;
          } else {
            return regexSyntaxError('Back references can not have more two or more consecutive numbers');
          }
        }
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
        return parseRegexDecimalEscape(c);

      case $$K_6B:
        // named backreference


        ASSERT_skip($$K_6B);
        c = peek();
        if (c !== $$LT_3C) {
          if (webCompat === WEB_COMPAT_OFF) {
            return regexSyntaxError('Named back reference \\k; missing group name', c);
          }
          return GOOD_SANS_U_FLAG;
        }
        ASSERT_skip($$LT_3C);
        c = peek();

        let wider = isIdentStart(c, pointer);

        if (wider === VALID_DOUBLE_CHAR) {
          skip();
          skip();
        } else {
          ASSERT(wider === VALID_SINGLE_CHAR || wider === INVALID_IDENT_CHAR, 'enum');
          ASSERT_skip(c);
        }

        if (wider === INVALID_IDENT_CHAR) {
          if (webCompat === WEB_COMPAT_OFF) {
            return regexSyntaxError('Could not parse `\\k<` as a named back reference; bailing', c);
          } else {
            return GOOD_SANS_U_FLAG;
          }
        }

        if (peeky($$GT_3E)) {
          // name is one character
          if (wider === VALID_DOUBLE_CHAR) {
            lastParsedIdent = input.slice(pointer - 2, pointer);
          } else {
            lastParsedIdent = String.fromCharCode(c);
          }
        } else {
          parseIdentifierRest(c, '');
        }

        namedBackRefs.push(lastParsedIdent); // we can only validate ths after completely parsing the regex body

        if (!peeky($$GT_3E)) {
          if (webCompat === WEB_COMPAT_OFF) {
            return regexSyntaxError('Missing closing angle bracket of name of group', c);
          }
          return GOOD_SANS_U_FLAG;
        }
        ASSERT_skip($$GT_3E);
        return ALWAYS_GOOD;

      case $$FWDSLASH_2F:
        // explicitly allowed
        ASSERT_skip($$FWDSLASH_2F);
        return ALWAYS_GOOD;

      case $$CR_0D:
      case $$LF_0A:
      case $$PS_2028:
      case $$LS_2029:
        ASSERT_skip(c);
        return regexSyntaxError('Regexes can not have newlines'); // regex has no line continuation

      default:
        // this is, probably;
        //
        // IdentityEscape [U] ::
        //   [+U] SyntaxCharacter
        //   [+U] /
        //   [~U] SourceCharacter but not UnicodeIDContinue

        let wide = isIdentRestChr(c, pointer);
        if (wide !== INVALID_IDENT_CHAR) { // backslash is parsed, c is peeked
          if (webCompat === WEB_COMPAT_OFF) {
            return regexSyntaxError('Cannot escape this regular identifier character [ord=' + c + '][' + String.fromCharCode(c) + ']');
          }
        }

        if (wide === VALID_DOUBLE_CHAR) {
          c = input.codePointAt(pointer);
          skip();
          skip();
        } else {
          if (wide === INVALID_IDENT_CHAR) lastPotentialRegexError = 'Tokenizer potential $ERROR: was invalid ident but accepting anyways';
          ASSERT_skip(c);
        }

        // ok unicode escape was acceptable
        return GOOD_SANS_U_FLAG;
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

    let d = peek();
    if (d >= $$0_30 && d <= $$9_39) {
      ASSERT_skip(d);
      let e = peek();
      if (e >= $$0_30 && e <= $$9_39) {
        if (webCompat === WEB_COMPAT_ON) {
          return GOOD_SANS_U_FLAG;
        } else {
          return regexSyntaxError('Parsed too many digits');
        }
      } else {
        largestBackReference = Math.max(((c - $$0_30) * 10) + (d - $$0_30))
      }
    } else {
      largestBackReference = Math.max(largestBackReference, c - $$0_30)
    }

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

    lastRegexUnicodeEscapeOrd = 0;

    if (eof()) return BAD_ESCAPE;
    let c = peek(); // dont read. we dont want to consume a bad \n here
    if (c === $$CURLY_L_7B) {
      ASSERT_skip($$CURLY_L_7B);
      let r = parseRegexUnicodeEscapeVary();
      if (r === GOOD_ESCAPE) {
        ASSERT_skip($$CURLY_R_7D);
        return GOOD_WITH_U_FLAG;
      }
      return regexSyntaxError('Error while trying to parse new unicode escape');
    } else {
      return parseRegexUnicodeEscapeQuad(c);
    }
  }
  function parseRegexUnicodeEscapeQuad(a) {
    // we've already consumed a. we must consume 3 more chars for this quad unicode escape
    if (eofd(3)) {
      if (webCompat === WEB_COMPAT_ON) {
        // can still be `/\u/` so let EOF be checked elsewhere...
        return GOOD_SANS_U_FLAG;
      } else {
        return regexSyntaxError('Encountered early EOF while parsing a unicode escape quad');
      }
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
      let firstPart = hexToNum(a) << 12 | hexToNum(b) << 8 | hexToNum(c) << 4 | hexToNum(d);

      // Is this a surrogate high byte? then we'll try another one; https://en.wikipedia.org/wiki/UTF-16
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
            ASSERT_skip($$BACKSLASH_5C);
            ASSERT_skip($$U_75);
            skip();
            skip();
            skip();
            skip();

            // we have a matching low+hi, combine them
            lastRegexUnicodeEscapeOrd = (((firstPart & 0x3ff) << 10) | (secondPart & 0x3ff)) + 0x10000;
            return ALWAYS_GOOD; // even without u-flag? how does that work...?
          }
          return regexSyntaxError('Second quad did not yield a valid surrogate pair value');
        }
        return regexSyntaxError('Encountered illegal quad escaped surrogate pair; the second part of the pair did not meet the requirements');
      }

      lastRegexUnicodeEscapeOrd = firstPart;
      return ALWAYS_GOOD; // outside char classes we can ignore surrogates
    } else {
      if (webCompat === WEB_COMPAT_ON) {
        lastRegexUnicodeEscapeOrd = parseInt(a+b+c+d, 16); // *shrug*
        return GOOD_SANS_U_FLAG;
      } else {
        return regexSyntaxError('Encountered bad character while trying to parse a unicode escape quad [ords: ' + a + ', ' + b + ', ' + c + ', ' + d + '] -> is hex? ' + [isHex(a) , isHex(b) , isHex(c) , isHex(d)] +' hex=' + String.fromCharCode(a,b,c,d));
      }
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

    return _parseRegexUnicodeEscapeVary(a);
  }
  function _parseRegexUnicodeEscapeVary(a) {
    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return BAD_ESCAPE;
      a = skipZeroes();
      if (!isHex(a)) {
        // note: we already asserted a zero
        if (a === $$CURLY_R_7D) {
          lastRegexUnicodeEscapeOrd = 0;
          return GOOD_ESCAPE
        }
        return BAD_ESCAPE;
      }
      ASSERT_skip(a);
    }
    return ___parseRegexUnicodeEscapeVary(a);
  }
  function ___parseRegexUnicodeEscapeVary(a) {
    if (eof()) return BAD_ESCAPE;
    let b = peek();
    if (!isHex(b)) {
      if (b === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a);
        return GOOD_ESCAPE
      }
      return BAD_ESCAPE;
    }
    ASSERT_skip(b);
    return ____parseRegexUnicodeEscapeVary(a, b);
  }
  function ____parseRegexUnicodeEscapeVary(a, b) {
    if (eof()) return BAD_ESCAPE;
    let c = peek();
    if (!isHex(c)) {
      if (c === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 4 | hexToNum(b);
        return GOOD_ESCAPE
      }
      return BAD_ESCAPE;
    }
    ASSERT_skip(c);
    return _____parseRegexUnicodeEscapeVary(a, b, c);
  }
  function _____parseRegexUnicodeEscapeVary(a, b, c) {
    if (eof()) return BAD_ESCAPE;
    let d = peek();
    if (!isHex(d)) {
      if (d === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 8 | hexToNum(b) << 4 | hexToNum(c);
        return GOOD_ESCAPE
      }
      return BAD_ESCAPE;
    }
    ASSERT_skip(d);
    return ______parseRegexUnicodeEscapeVary(a, b, c, d);
  }
  function ______parseRegexUnicodeEscapeVary(a, b, c, d) {
    if (eof()) return BAD_ESCAPE;
    let e = peek();
    if (!isHex(e)) {
      if (e === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 12 | hexToNum(b) << 8 | hexToNum(c) << 4 | hexToNum(d);
        return GOOD_ESCAPE
      }
      return BAD_ESCAPE;
    }
    ASSERT_skip(e);
    return _______parseRegexUnicodeEscapeVary(a, b, c, d, e);
  }
  function _______parseRegexUnicodeEscapeVary(a, b, c, d, e) {
    if (eof()) return BAD_ESCAPE;
    let f = peek();
    if (!isHex(f)) {
      if (f === $$CURLY_R_7D) {
        lastRegexUnicodeEscapeOrd = hexToNum(a) << 16 | hexToNum(b) << 12 | hexToNum(c) << 8 | hexToNum(d) << 4 | hexToNum(e);
        return GOOD_ESCAPE
      }
      return BAD_ESCAPE;
    }
    ASSERT_skip(f);
    return ________parseRegexUnicodeEscapeVary(a, b, c, d, e, f);
  }
  function ________parseRegexUnicodeEscapeVary(a, b, c, d, e, f) {
    let codePoint = hexToNum(a) << 20 | hexToNum(b) << 16 | hexToNum(c) << 12 | hexToNum(d) << 8 | hexToNum(e) << 4 | hexToNum(f);
    // the total may not exceed 0x10ffff
    if (codePoint > 0x10ffff) return BAD_ESCAPE;
    if (eof()) return BAD_ESCAPE;
    if (!peeky($$CURLY_R_7D)) return BAD_ESCAPE;
    lastRegexUnicodeEscapeOrd = codePoint;
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

    if (eof()) return regexSyntaxError('Encountered early EOF while parsing char class (1)');
    let c = peek();
    if (c === $$XOR_5E) { // the separate inverting caret check is important for surrogate range checks in super edge cases (there's a test)
      ASSERT_skip($$XOR_5E);
      if (eof()) return regexSyntaxError('Encountered early EOF while parsing char class (2)');
      c = peek();
    }

    let n = 0;
    while (true) {

      if (c === $$SQUARE_R_5D) {
        return parseRegexCharClassEnd(urangeOpen, wasSurrogateHead, urangeLeft, prev, flagState);
      } else if (c === $$BACKSLASH_5C) {
        ASSERT_skip($$BACKSLASH_5C);
        c = parseRegexClassCharEscape(); // note: this may lead to c being >0xffff !! can also be 0 for certain escapes
        if (c === INVALID_IDENT_CHAR || c === CHARCLASS_BAD) {
          flagState = regexSyntaxError('Encountered early EOF while parsing char class (3)');
        } else if (c === INVALID_IDENT_CHAR) {
          flagState = regexSyntaxError('Encountered unicode escape that did not represent a proper character');
        } else if (c & CHARCLASS_BAD_WITH_U_FLAG) {
          c = c ^ CHARCLASS_BAD_WITH_U_FLAG; // remove the CHARCLASS_BAD_WITH_U_FLAG flag (dont use ^= because that deopts... atm; https://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean )
          ASSERT(c <= 0x110000, 'c should now be valid unicode range or one above for error');
          if (c === CHARCLASS_BAD) flagState = regexSyntaxError('Bad character class body');
          else flagState = updateRegexUflagState(flagState, GOOD_SANS_U_FLAG, 'Unknown reason that is only an error with u-flag while parsing a character class');
          ASSERT(flagState === GOOD_SANS_U_FLAG || flagState === ALWAYS_BAD, 'either way, the flag state should now reflect "bad with u-flag", or worse');
        } else  if (c & CHARCLASS_BAD_SANS_U_FLAG) {
          // this condition is currently only met when a bad property escape was found
          flagState = updateRegexUflagState(flagState, GOOD_WITH_U_FLAG, 'Unknown reason that is only an error with u-flag while parsing a character class');
        }
        // else char class is good :)
      } else if (c === $$CR_0D || c === $$LF_0A || c === $$PS_2028 || c === $$LS_2029) {
        return regexSyntaxError('Encountered newline'); // same as end of input
      } else {
        ASSERT_skip(c);
      }

      if (c === CHARCLASS_CLASS_ESCAPE) {
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

      // there are a bunch of test cases regarding ranges and the u-flag
      if (urangeOpen) {
        // if c is a head we must check the next char for being a tail before we can determine the code _point_
        // otoh, if c is a tail or a non-surrogate then we can now safely do range checks since the codepoint wont change
        // if this is a head and the previous was too then the previous was the rhs on its own and we check `prev` instead
        let urangeRight = isSurrogate ? surrogate : wasSurrogateHead ? prev : c;
        if (!isSurrogateHead || wasSurrogateHead) {
          urangeOpen = false;
          if (urangeLeft === CHARCLASS_BAD_RANGE || urangeRight === CHARCLASS_BAD_RANGE || urangeLeft > urangeRight) {
            flagState = updateRegexUflagState(flagState, GOOD_SANS_U_FLAG, 'Encountered incorrect range (bad left, bad right, or left>right) which is illegal with u-flag and for unknown reasons it was also illegal without u-flag');
          }
        }
      } else if (c === $$DASH_2D && n > 0) {
        urangeOpen = true;
      } else {
        urangeLeft = isSurrogate ? surrogate : c;
      }

      if (nrangeOpen) {
        nrangeOpen = false;
        if (nrangeLeft === CHARCLASS_CLASS_ESCAPE || c === CHARCLASS_CLASS_ESCAPE) {
          // class escapes are illegal for ranges, however, they are allowed and ignored in webcompat mode (TODO: this can be refined further)
          if (webCompat === WEB_COMPAT_OFF) {
            // this is the case where you do `/[b-a]/` where the lhs of the range is higher than the rhs
            // when not in webcompat mode, it may also be the case that a range lhs or rhs is a class escape (\s \d \w etc)
            flagState = regexSyntaxError('Range error with u-flag and unknown reason why regex is invalid without u-flag so it cannot be a valid regex');
          } else {
            // in webcompat mode, sans u-flag, we can allow character class escales (\w \d \s etc) in ranges
            flagState = updateRegexUflagState(flagState, GOOD_SANS_U_FLAG, 'Range error with u-flag and unknown reason why regex is invalid without u-flag so it cannot be a valid regex');
          }
        } else if (nrangeLeft === CHARCLASS_BAD_RANGE || c === CHARCLASS_BAD_RANGE || nrangeLeft > c) {
          flagState = updateRegexUflagState(flagState, GOOD_WITH_U_FLAG, 'Unknown reason that is an error with u-flag while parsing a character class');
        }
      } else if (c === $$DASH_2D && n > 0) {
        nrangeOpen = true;
      } else {
        nrangeLeft = c;
      }

      wasSurrogate = isSurrogate;
      wasSurrogateHead = isSurrogateHead;
      prev = c;

      ++n;
      if (eof()) break;
      c = peek();
    }
    return regexSyntaxError('Unexpected early EOF while parsing character class'); // no end
  }

  function updateRegexUflagState(currentState, newState, error) {
    ASSERT(newState === GOOD_WITH_U_FLAG || newState === GOOD_SANS_U_FLAG, 'should not be used for all good or bad');
    if (currentState === (newState === GOOD_WITH_U_FLAG ? GOOD_SANS_U_FLAG : GOOD_WITH_U_FLAG)) currentState = regexSyntaxError(error);
    else if (currentState === ALWAYS_GOOD) currentState = newState;
    else {
      ASSERT(currentState === newState || currentState === ALWAYS_BAD, 'enum');
    }
    return currentState;
  }

  function updateRegexUflagStateCharClass(currentState, newState, error) {
    ASSERT(newState === CHARCLASS_BAD || newState === CHARCLASS_BAD_WITH_U_FLAG || newState === CHARCLASS_BAD_SANS_U_FLAG, 'charclass state enum');

    if (newState === CHARCLASS_BAD_WITH_U_FLAG) return updateRegexUflagState(currentState, GOOD_SANS_U_FLAG, error)
    if (newState === CHARCLASS_BAD_SANS_U_FLAG) return updateRegexUflagState(currentState, GOOD_WITH_U_FLAG, error)
    if (newState === CHARCLASS_BAD) return updateRegexUflagState(currentState, ALWAYS_BAD, error)
    ASSERT(newState === 0, 'I guess?');
    return currentState;
  }

  function parseRegexClassCharEscape() {
    // atom escape is slightly different from charclass escape

    // https://www.ecma-international.org/ecma-262/7.0/#sec-classescape

    if (eof()) return -1;
    let c = peek();

    switch (c) {
      // \u<????> and \u{<?..?>}
      case $$U_75:
        ASSERT_skip($$U_75);
        return parseRegexUnicodeEscape2();

      // \x<??>
      case $$X_78:
        ASSERT_skip($$X_78);
        if (eofd(1)) {
          regexSyntaxError('First character of hex escape was EOF');
          return CHARCLASS_BAD;
        }
        let a = peek();
        if (!isHex(a)) {
          regexSyntaxError('First character of hex escape was invalid');
          return CHARCLASS_BAD;
        }
        ASSERT_skip(a);
        let b = peek();
        if (!isHex(b)) {
          regexSyntaxError('Second character of hex escape was invalid');
          return CHARCLASS_BAD;
        }
        ASSERT_skip(b);
        return (hexToNum(a) << 4) | hexToNum(b);

      // char escapes \c<?>
      case $$C_63:
        ASSERT_skip($$C_63);
        if (neof()) {
          let d = peek();
          if (isAsciiLetter(d)) {
            ASSERT_skip(d);
            return d;
          }
          if (webCompat === WEB_COMPAT_ON) {
            // this is now an `IdentityEscape` and just parses the `c` itself
            return CHARCLASS_BAD_WITH_U_FLAG;
          }
        }
        return CHARCLASS_BAD;

      // \b and \B
      case $$B_62:
        ASSERT_skip($$B_62);
        // https://tc39.github.io/ecma262/#sec-patterns-static-semantics-character-value
        // ClassEscape :: b
        //   Return the code point value of U+0008 (BACKSPACE).
        return $$BACKSPACE_08;
      case $$B_UC_42:
        // "A ClassAtom can use any of the escape sequences that are allowed in the rest of the regular expression
        // except for \b, \B, and backreferences. Inside a CharacterClass, \b means the backspace character, while
        // \B and backreferences raise errors. Using a backreference inside a ClassAtom causes an error."
        return CHARCLASS_BAD_RANGE;

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
        // We must ignore the above rule in webcompat mode and so we must signal that the current ClassAtom was such.
        // Only for d,D,s,S,w,W because p and P are only valid with u-flag, anyways, and where webcompat is ignored.
        return CHARCLASS_CLASS_ESCAPE;

      // Unicode property escapes \p{<?...?>} \P{<?...?>}
      case $$P_70:
      case $$P_UC_50:
        let regexPropState = parseRegexPropertyEscape(c);
        if (regexPropState === ALWAYS_BAD) {
          return CHARCLASS_BAD;
        } else if (regexPropState === GOOD_SANS_U_FLAG) {
          // semantically ignored without u-flag, syntactically only okay in web-compat / Annex B mode
          if (webCompat === WEB_COMPAT_ON) return CHARCLASS_BAD_WITH_U_FLAG;
          return CHARCLASS_BAD;
        } else {
          ASSERT(regexPropState === GOOD_WITH_U_FLAG, 'parseRegexPropertyEscape should not return ALWAYS_GOOD and this is an enum');
          if (webCompat === WEB_COMPAT_ON) return CHARCLASS_CLASS_ESCAPE; // ok, no flags
          return CHARCLASS_BAD_SANS_U_FLAG;
        }

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
      case $$0_30:
        ASSERT_skip(c);
        // cannot be followed by another digit
        if (webCompat === WEB_COMPAT_ON) {
          return parseOctalFromSecondDigit(c) | CHARCLASS_BAD_WITH_U_FLAG;
        }
        if (neof() && isAsciiNumber(peek())) return CHARCLASS_BAD;
        return $$NULL_00;
      case $$1_31:
      case $$2_32:
      case $$3_33:
      case $$4_34:
      case $$5_35:
      case $$6_36:
      case $$7_37:
        ASSERT_skip(c);
        if (webCompat === WEB_COMPAT_ON) {
          return parseOctalFromSecondDigit(c) | CHARCLASS_BAD_WITH_U_FLAG;
        }
        // without web compat this is a back reference which is illegal in character classes
        return CHARCLASS_BAD;
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

      case $$DASH_2D:
        ASSERT_skip($$DASH_2D);
        if (webCompat === WEB_COMPAT_ON) {
          webModeWarnings.push([pointer, 'Escaping dash in char class']);
          return $$DASH_2D;
        } else {
          // only valid with u-flag!
          return $$DASH_2D | CHARCLASS_BAD_SANS_U_FLAG;
        }

      default:
        // IdentityEscape
        // with u-flag: forward slash or syntax character (`^$\.*+?()[]{}|`) and these cases are already caught above
        // without-u-flag: SourceCharacter but not UnicodeIDContinue
        ASSERT(![$$BACKSLASH_5C, $$XOR_5E, $$$_24, $$DOT_2E, $$STAR_2A, $$PLUS_2B, $$QMARK_3F, $$PAREN_L_28, $$PAREN_R_29, $$SQUARE_L_5B, $$SQUARE_R_5D, $$CURLY_L_7B, $$CURLY_R_7D, $$OR_7C].includes(c), 'all these u-flag chars should be checked above');

        // so we can already not be valid for u flag, we just need to check here whether we can be valid without u-flag
        // (any unicode continue char would be a problem)
        let wide = isIdentRestChr(c, pointer); // c is peeked
        if (wide === INVALID_IDENT_CHAR) {
          // c is not unicode continue char
          ASSERT_skip(c);
          return c | CHARCLASS_BAD_WITH_U_FLAG;
        }
        // else return bad char class because the escape is bad
        lastPotentialRegexError = 'the char class had an escape that would not be valid with and without u-flag';
        if (wide === VALID_DOUBLE_CHAR) {
          skip();
          skip();
          return CHARCLASS_BAD;
        }
        if (wide === VALID_SINGLE_CHAR) {
          // bad escapes
          ASSERT_skip(c);
          return CHARCLASS_BAD;
        }
    }

    // bad escapes
    ASSERT_skip(c);
    return CHARCLASS_BAD;
  }
  function parseRegexPropertyEscape(c) {
    ASSERT(c === $$P_70 || c === $$P_UC_50, 'this should be \\p or \\P', c);
    ASSERT(peek() === c, 'not yet consumed');

    // introduced in ES9 / ES2018; https://github.com/tc39/proposal-regexp-unicode-property-escapes
    if (!supportRegexPropertyEscapes) {
      if (webCompat === WEB_COMPAT_ON) return GOOD_SANS_U_FLAG;
      return regexSyntaxError('Property escapes are not supported by the currently targeted language version  ');
    }

    // https://tc39.github.io/ecma262/#prod-CharacterClassEscape
    // Note: the `\p` is illegal in non-u-flag regexes because `p` and `P` are not part of CharacterClassEscape
    // Additionally, the parser would trip over the curlies that ought to follow it since it'd be an invalid range.
    // It would be fine in web-compat because neither is a problem in the escape bit (see the IdentityEscape in
    // https://tc39.github.io/ecma262/#prod-annexB-CharacterEscape) nor for the braces (see ExtendedPatternCharacter in
    // https://tc39.github.io/ecma262/#prod-annexB-ExtendedAtom). And since the syntax of `\p` is tightly controlled
    // this should only change semantics without causing potential syntax errors by ignoring the `\p` escape.

    // skip the p and assert it is immediately followed by a curly
    if (ASSERT_skipPeek(c === $$P_70 ? $$P_70 : $$P_UC_50) !== $$CURLY_L_7B) {
      if (webCompat === WEB_COMPAT_ON) return GOOD_SANS_U_FLAG;
      return regexSyntaxError('Property escape \\p must be followed by a curly bracket (and would be illegal without u-flag)');
    }

    if (eof()) return regexSyntaxError('Early EOF while parsing regex property escape');

    c = ASSERT_skipPeek($$CURLY_L_7B);
    if (c === $$CURLY_R_7D) {
      // TODO: would this be okay in sloppy?
      return regexSyntaxError('Cannot have empty property name brackets (and would be illegal without u-flag too)');
    }

    // https://tc39.es/ecma262/#prod-UnicodePropertyValueExpression
    // UnicodePropertyValueExpression
    //  - UnicodePropertyName = UnicodePropertyValue
    //  - LoneUnicodePropertyNameOrValue
    // UnicodePropertyName
    // - a-zA-Z
    // - `_`
    // UnicodePropertyValue
    // - UnicodePropertyValueCharacters
    // - a-zA-Z
    // - 0-9
    // - `_`

    // The name and value must end up composing a name that is part of an explicitly, albeit large, defined set
    // It should be a syntax error if the names do not appear on their list.

    // now skip the Unicode Property name until the first closing curly
    let name = '';
    let hasEq = false;
    let value = '';
    let scanning = true;

    // TODO: since we must validate the name against a fixed table, anyways, we don't actually need to take too much care in parsing the content, just seek for `=` and `}` ..?
    do {
      switch (c) {
        case $$CURLY_R_7D:
          scanning = false;
          break;

        case $$IS_3D:
          if (hasEq) {
            return regexSyntaxError('An escaped property can only contain one eq sign (`=`) but found a second one');
          }
          hasEq = true;
          break;

        case $$A_61:
        case $$B_62:
        case $$C_63:
        case $$D_64:
        case $$E_65:
        case $$F_66:
        case $$G_67:
        case $$H_68:
        case $$I_69:
        case $$J_6A:
        case $$K_6B:
        case $$L_6C:
        case $$M_6D:
        case $$N_6E:
        case $$O_6F:
        case $$P_70:
        case $$Q_71:
        case $$R_72:
        case $$S_73:
        case $$T_74:
        case $$U_75:
        case $$V_76:
        case $$W_77:
        case $$X_78:
        case $$Y_79:
        case $$Z_7A:

        case $$A_UC_41:
        case $$B_UC_42:
        case $$C_UC_43:
        case $$D_UC_44:
        case $$E_UC_45:
        case $$F_UC_46:
        case $$G_UC_47:
        case $$H_UC_48:
        case $$I_UC_49:
        case $$J_UC_4A:
        case $$K_UC_4B:
        case $$L_UC_4C:
        case $$M_UC_4D:
        case $$N_UC_4E:
        case $$O_UC_4F:
        case $$P_UC_50:
        case $$Q_UC_51:
        case $$R_UC_52:
        case $$S_UC_53:
        case $$T_UC_54:
        case $$U_UC_55:
        case $$V_UC_56:
        case $$W_UC_57:
        case $$X_UC_58:
        case $$Y_UC_59:
        case $$Z_UC_5A:

        case $$LODASH_5F:
          if (hasEq) value += String.fromCharCode(c);
          else name += String.fromCharCode(c);
          break;

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
          if (hasEq) {
            value += String.fromCharCode(c);
          } else {
            return regexSyntaxError('The escaped property name can only contain a-z, but a digit (`' + String.fromCharCode(c) + '`) was found');
          }
          break;

        default:
          if (hasEq) {
            return regexSyntaxError('The escaped property value can only contain a-z0-9 or `_`, but encountered `' + String.fromCharCode(c) + '` (' + c + ') and do not know how to proceed');
          } else {
            return regexSyntaxError('The escaped property name can only contain a-z or `_`, but encountered `' + String.fromCharCode(c) + '` (' + c + ') and do not know how to proceed');
          }
      }

      c = ASSERT_skipPeek(c);
      if (eof()) return regexSyntaxError('Early EOF while parsing inside regex property escape');
    } while (scanning);

    // Two cases now; Either this property is a single ident or it's a name=value pair
    // https://tc39.es/ecma262/#sec-patterns-static-semantics-early-errors
    // UnicodePropertyValueExpression :: UnicodePropertyName = UnicodePropertyValue
    // > It is a Syntax Error if the List of Unicode code points that is SourceText of UnicodePropertyName is not identical to a List of Unicode code points that is a Unicode property name or property alias listed in the “Property name and aliases” column of Table 54.
    // > It is a Syntax Error if the List of Unicode code points that is SourceText of UnicodePropertyValue is not identical to a List of Unicode code points that is a value or value alias for the Unicode property or property alias given by SourceText of UnicodePropertyName listed in the “Property value and aliases” column of the corresponding tables Table 56 or Table 57.
    // UnicodePropertyValueExpression :: LoneUnicodePropertyNameOrValue
    // > It is a Syntax Error if the List of Unicode code points that is SourceText of LoneUnicodePropertyNameOrValue is not identical to a List of Unicode code points that is a Unicode general category or general category alias listed in the “Property value and aliases” column of Table 56, nor a binary property or binary property alias listed in the “Property name and aliases” column of Table 55.

    // https://tc39.es/ecma262/#table-nonbinary-unicode-properties
    if (hasEq) {
      // Validate name against table 54
      if (!TABLE54.includes(',' + name + ',')) {
        THROW('The escaped binary property name `' + name + '` is not valid (does not appear in "table 54")')
      }
      // Validate value against table 56 or 57
      let vc = ',' + value + ',';
      if (!TABLE56.includes(vc) && !TABLE57.includes(vc)) {
        THROW('The escaped property value `' + value + '` is not valid (does not appear in "table 56" nor "table 57")')
      }
    } else {
      // Validate value against table 55 or 56
      let nc = ',' + name + ',';
      if (!TABLE55.includes(nc) && !TABLE56.includes(nc)) {
        THROW('The escaped lone property name `' + name + '` is not valid (does not appear in "table 55" nor "table 56")')
      }
    }

    return GOOD_WITH_U_FLAG;
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
            regexSyntaxError('Unknown regex flag [ord=' + c + ']');
          } else if (bad) {
            return ALWAYS_BAD; // already THROWn for this
          } else if ((g|i|m|u|y|s) > 1) {
            return regexSyntaxError('Encountered at least one regex flag twice');
          } else {
            return u > 0 ? GOOD_WITH_U_FLAG : GOOD_SANS_U_FLAG;
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
          parseRegexUnicodeEscape();
        }
        ++bad;
        regexSyntaxError('Unknown regex flag [ord=' + c + ']');
      }
    }
    // the error is the (slightly and very theoretical) slow path because it leads to an error anyways
    // if any flags occurred more than once, the or below will result in >1
    if (bad) {
      return ALWAYS_BAD; // already THROWn for this
    } else if ((g|i|m|u|y|s) > 1) {
      return regexSyntaxError('Encountered at least one regex flag twice');
    } else {
      return u > 0 ? GOOD_WITH_U_FLAG : GOOD_SANS_U_FLAG;
    }
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
  function parseRegexCharClassEnd(urangeOpen, wasSurrogateHead, urangeLeft, prev, flagState) {
    ASSERT_skip($$SQUARE_R_5D);

    // code point range may be open if the rhs was a surrogate head.
    // that's the only range case that needs to be checked here.
    if (urangeOpen && wasSurrogateHead && (urangeLeft === CHARCLASS_BAD_RANGE || prev === CHARCLASS_BAD_RANGE || urangeLeft > prev)) {
      if (flagState === GOOD_WITH_U_FLAG) return regexSyntaxError('Unknown reason that is only an error without u-flag');
      if (flagState === ALWAYS_BAD) return ALWAYS_BAD; // should already have THROWn for this
      return GOOD_SANS_U_FLAG;
    }
    return flagState;
  }
  function parseDecimalEscape(c) {
    if (c === $$C_63 || c === $$K_6B) return BAD_ESCAPE;
    return c | CHARCLASS_BAD_WITH_U_FLAG;
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

    if (isLowerOctal(firstChar)) {
      // third char may be any octal
      let secondChar = peek();
      if (isOctal(secondChar)) {
        ASSERT_skip(secondChar);

        let thirdChar = peek();
        if (isOctal(thirdChar)) {
          ASSERT_skip(thirdChar);
          return ((firstChar - $$0_30) * 8 * 8) + ((secondChar - $$0_30) * 8) + (thirdChar - $$0_30);
        } else {
          return ((firstChar - $$0_30) * 8) + (thirdChar - $$0_30);
        }
      } else {
        return firstChar - $$0_30;
      }
    } else {
      ASSERT(isUpperOctal(firstChar));
      // third char may only be the lower octals
      let secondChar = peek();
      if (isOctal(secondChar)) {
        ASSERT_skip(secondChar);

        let thirdChar = peek();
        if (isLowerOctal(thirdChar)) {
          ASSERT_skip(thirdChar);
          return ((firstChar - $$0_30) * 8 * 8) + ((secondChar - $$0_30) * 8) + (thirdChar - $$0_30);
        } else {
          return ((firstChar - $$0_30) * 8) + (thirdChar - $$0_30);
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
      if (r === CHARCLASS_BAD || eof()) return CHARCLASS_BAD;
      let x = peek();
      if (x !== $$CURLY_R_7D) return CHARCLASS_BAD;
      ASSERT_skip($$CURLY_R_7D);
      return r | CHARCLASS_BAD_SANS_U_FLAG; // `\u{}` in regexes is restricted to +u flag
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

      let firstPart = (hexToNum(a) << 12) | (hexToNum(b) << 8) | (hexToNum(c) << 4) | hexToNum(d);

      // Is this a surrogate high byte? then we'll try another one; https://en.wikipedia.org/wiki/UTF-16
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
            ASSERT_skip($$BACKSLASH_5C);
            ASSERT_skip($$U_75);
            skip();
            skip();
            skip();
            skip();

            // we have a matching low+hi, combine them
            return (((firstPart & 0x3ff) << 10) | (secondPart & 0x3ff)) + 0x10000;
          }
          regexSyntaxError('Second quad did not yield a valid surrogate pair value');
        }
        regexSyntaxError('Encountered illegal quad escaped surrogate pair; the second part of the pair did not meet the requirements');
        return CHARCLASS_BAD;
      }
      return firstPart;
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

    return _parseRegexUnicodeEscapeVary2(a);
  }
  function _parseRegexUnicodeEscapeVary2(a) {
    // skip leading zeroes if there are any
    if (a === $$0_30) {
      if (eof()) return CHARCLASS_BAD;
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
    if (eof()) return CHARCLASS_BAD;
    let b = peek();
    if (!isHex(b)) {
      return hexToNum(a);
    }
    ASSERT_skip(b);

    return ___parseRegexUnicodeEscapeVary2(a, b);
  }
  function ___parseRegexUnicodeEscapeVary2(a, b) {
    if (eof()) return CHARCLASS_BAD;
    let c = peek();
    if (!isHex(c)) {
      return (hexToNum(a) << 4) | hexToNum(b);
    }
    ASSERT_skip(c);

    return ____parseRegexUnicodeEscapeVary2(a, b, c);
  }
  function ____parseRegexUnicodeEscapeVary2(a, b, c) {
    if (eof()) return CHARCLASS_BAD;
    let d = peek();
    if (!isHex(d)) {
      return (hexToNum(a) << 8) | (hexToNum(b) << 4) | hexToNum(c);
    }
    ASSERT_skip(d);

    return _____parseRegexUnicodeEscapeVary2(a, b, c, d);
  }
  function _____parseRegexUnicodeEscapeVary2(a, b, c, d) {
    if (eof()) return CHARCLASS_BAD;
    let e = peek();
    if (!isHex(e)) {
      return (hexToNum(a) << 12) | (hexToNum(b) << 8) | (hexToNum(c) << 4) | hexToNum(d);
    }
    ASSERT_skip(e);

    return ______parseRegexUnicodeEscapeVary2(a, b, c, d, e);
  }
  function ______parseRegexUnicodeEscapeVary2(a, b, c, d, e) {
    if (eof()) return CHARCLASS_BAD;
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
        return $WHITE;
      case $$PS_2028:
        return parseNewline();
      case $$LS_2029:
        return parseNewline();

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
          return parseIdentifierRest(cu, String.fromCodePoint(cu));
        }

        // https://tc39.github.io/ecma262/#sec-unicode-format-control-characters
        // >  In ECMAScript source text <ZWNBSP> code points are treated as white space characters (see 11.2).
        if (c === $$BOM_FEFF) {
          return $WHITE;
        }

        lastReportableTokenizerError = 'Unexpected unicode character: ' + c + ' (' + String.fromCharCode(c) + ')';
        return $ERROR;
        // --pointer;
        // THROW('fixme, c=0x'+ c.toString(16));
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

  nextToken.asi = addAsi;
  nextToken.throw = _THROW;
  nextToken.lexError = function() {
    ASSERT(lastReportableTokenizerError, 'lexError should only be called if a lexer error was actually detected');
    THROW(lastReportableTokenizerError);
  };
  //nextToken.deopt = () => funcs.forEach(([f,n]) => printStatus(f,n));
  nextToken.getTokenCountAny = () => anyTokenCount;
  nextToken.getTokenCountSolid = () => solidTokenCount;
  nextToken.DEBUG = DEBUG;
  nextToken.getErrorContext = getErrorContext;
  nextToken.regexerror = () => lastRegexState;

  return nextToken;
}

function isLfPsLs(c) {
  return (c === $$LF_0A || c === $$PS_2028 || c === $$LS_2029);
}

function debug_toktype(type, ignoreUnknown) {
  ASSERT(typeof type === 'number', 'expecting valid type', type, ignoreUnknown);
  if (type & $TICK_BAD_ESCAPE) return debug_toktype(type ^ $TICK_BAD_ESCAPE, ignoreUnknown) + '+$TICK_BAD_ESCAPE';
  switch (type) {
    case $ASI: return 'ASI';
    case $COMMENT: return 'COMMENT';
    case $COMMENT_SINGLE: return 'COMMENT_SINGLE';
    case $COMMENT_MULTI: return 'COMMENT_MULTI';
    case $COMMENT_HTML: return 'COMMENT_HTML';
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
    case $TICK_BAD_ESCAPE: return 'TICK_BAD_ESCAPE';
    case $WHITE: return 'WHITE';
    default:
      if (ignoreUnknown) return 'UNKNOWN[' + type + ']';
      throw new Error('debug_toktype: UNKNOWN[' + JSON.stringify(type) + ']')
  }
}

// </BODY>

export default ZeTokenizer;
export {
  $ASI,
  $COMMENT,
  $COMMENT_HTML,
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
  $TICK,
  $TICK_BAD_ESCAPE,
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,
  $WHITE,

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
  LF_DEBUG,

  RETURN_ANY_TOKENS,
  RETURN_SOLID_TOKENS,

  WEB_COMPAT_OFF,
  WEB_COMPAT_ON,

  debug_toktype,
};
