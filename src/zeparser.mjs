
// in all cases either; parse a var, let, const, or assignment expression
// there can be multiple vars and inits
// for-in and for-of can only have one var without inits (invalidate after)

/*
if script mode, these should all work:
- `(yield)`
- `(yield = x)`
- `(x = yield)`
- `(x = yield = x)`
- `yield`
- `yield = x`
- `([yield])`
- `(x = a + yield)`
- `([x = yield])`
- `([x, {y: [yield]}] = z)`
- `([x, {y: [yield]}])`
And these should all fail:
- `(yield) => x`
- `(yield = x) => x`
- `(x = yield) => x`
- `(x = yield = x) => x`
- `yield => x`
- `([yield]) => x`
- `([x = yield]) => x`
- `([x = yield y]) => x`
- `([x, {y: [yield]}]) => x`
*/

import {
  inspect,

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
  THROW as _THROW,
} from './utils.mjs';

import ZeTokenizer, {
  $ASI,
  $EOF,
  $ERROR,
  $IDENT,
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

  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,

  FAIL_HARD,

  GOAL_MODULE,
  GOAL_SCRIPT,

  LF_CAN_FUNC_STMT,
  LF_CAN_NEW_DOT_TARGET,
  LF_DO_WHILE_ASI,
  LF_FOR_REGEX,
  LF_IN_ASYNC,
  LF_IN_CONSTRUCTOR,
  LF_IN_FOR_LHS,
  LF_IN_FUNC_ARGS,
  LF_IN_GENERATOR,
  LF_IN_GLOBAL,
  LF_IN_ITERATION,
  LF_IN_SCOPE_ROOT,
  LF_IN_SWITCH,
  LF_IN_TEMPLATE,
  LF_NO_ASI,
  LF_NO_FLAGS,
  LF_STRICT_MODE,
  LF_SUPER_CALL,
  LF_SUPER_PROP,
  INITIAL_LEXER_FLAGS,
  LF_DEBUG as L,

  RETURN_ANY_TOKENS,
  RETURN_SOLID_TOKENS,

  WEB_COMPAT_OFF,
  WEB_COMPAT_ON,

  debug_toktype,
} from '../src/zetokenizer.mjs';

// <BODY>

const VERSION_EXPONENTIATION = 7;
const VERSION_ASYNC = 8;
const VERSION_TRAILING_FUNC_COMMAS = 8;
const VERSION_ASYNC_GEN = 9;
const VERSION_OBJECTSPREAD = 9;
const VERSION_TAGGED_TEMPLATE_BAD_ESCAPES = 9;
const VERSION_WHATEVER = Infinity;

const WAS_ASYNC = true;
const NOT_ASYNC = false;
const IS_ASYNC_PREFIXED = {};
const NOT_ASYNC_PREFIXED = {};
const UNDEF_ASYNC = undefined;
const WAS_GENERATOR = true;
const IS_GENERATOR = true;
const NOT_GENERATOR = false;
const CALLED_FROM_WRAPPER = true;
const IS_FUNC_DECL = true;
const NOT_FUNC_DECL = false;
const IS_FUNC_EXPR = true;
const NOT_FUNC_EXPR = false;
const IDENT_OPTIONAL = true;
const IDENT_REQUIRED = false;
const PARSE_VALUE_MAYBE = true;
const PARSE_VALUE_MUST = false;
const YIELD_WITHOUT_VALUE = 0;
const WITH_ASSIGNABLE = 1;
const WITH_NON_ASSIGNABLE = 2;
const IS_ARROW = true;
const NOT_ARROW = false;
const FROM_STATEMENT_START = 1;
const FROM_FOR_HEADER = 2;
const FROM_EXPORT_DECL = 3;
const FROM_CATCH = 4;
const FROM_ASYNC_ARG = 5;
const FROM_OTHER_FUNC_ARG = 6;
const BINDING_TYPE_NONE = 0;
const BINDING_TYPE_ARG = 1;
const BINDING_TYPE_VAR = 2;
const BINDING_TYPE_LET = 3;
const BINDING_TYPE_CONST = 4;
const BINDING_TYPE_CLASS = 5;
const ASSIGNMENT_IS_INIT = true; // var foo = bar;  (not to be parsed by parseBinding
const ASSIGNMENT_IS_DEFAULT = false; // (foo = bar) => foo  (parsed by parseBinding)
const IS_EXPRESSION = {};
const IS_STATEMENT = {};
const IS_NEW_ARG = 3;
const NOT_NEW_ARG = 4;
const PARSE_DIRECTIVES = true;
const IGNORE_DIRECTIVES = false;
const MIGHT_DESTRUCT = 0; // any kind of destructuring or lack thereof is okay
const CANT_DESTRUCT = 1 << 0; // it is impossible to destructure this
const DESTRUCT_ASSIGN_ONLY = 1 << 1; // the only way this can destruct is by assignment
const MUST_DESTRUCT = 1 << 2; // something that is an error if it doesnt lead to destructurig like `({a=b})`
const ASSIGNABLE_UNDETERMINED = 1 << 3;
const NOT_ASSIGNABLE = 1 << 4;
const IS_ASSIGNABLE = 1 << 5;
const IS_SINGLE_IDENT_WRAP_A = 1 << 6;   // "assignable"
const IS_SINGLE_IDENT_WRAP_NA = 1 << 7;  // "not assignable"
const NOT_SINGLE_IDENT_WRAP_A = 1 << 8;  // "assignable"
const NOT_SINGLE_IDENT_WRAP_NA = 1 << 9; // "not assignable"
const PIGGY_BACK_SAW_AWAIT_VARNAME = 1 << 10; // parsed an expression containing `await` as a regular var name
const PIGGY_BACK_SAW_AWAIT_KEYWORD = 1 << 11; // parsed an expression containing an AwaitExpression
const PIGGY_BACK_SAW_YIELD_VARNAME = 1 << 12; // parsed an expression containing `yield` as a regular var name
const PIGGY_BACK_SAW_YIELD_KEYWORD = 1 << 13  ; // parsed an expression containing a YieldExpression
const PIGGY_BACK_WAS_CONSTRUCTOR = 1 << 14; // signal having found a constructor (special case)
const PIGGY_BACK_WAS_PROTO = 1 << 15; // signal that a `__proto__: x` was parsed (do detect double occurrence)
const NO_SPREAD = 0;
const LAST_SPREAD = 1;
const MID_SPREAD = 2;
const PARSE_INIT = {_:'PARSE_INIT'};
const SKIP_INIT = {_:'SKIP_INIT'};
const IS_GROUP_TOPLEVEL = true;
const NOT_GROUP_TOPLEVEL = false;
const IS_CLASS_METHOD = true;
const NOT_CLASS_METHOD = false;
const IS_EXPORT = true;
const NOT_EXPORT = false;
const IS_DyNAMIC_PROPERTY = true;
const NOT_DyNAMIC_PROPERTY = false;
const IS_QUASI_TAIL = true;
const NOT_QUASI_TAIL = false;
const ARG_NEITHER_SIMPLE_NOR_INIT = 0;
const ARG_WAS_SIMPLE = 1;
const ARG_HAD_INIT = 2;
const ARGS_SIMPLE = true;
const ARGS_COMPLEX = false;
const IS_CONSTRUCTOR = true;
const NOT_CONSTRUCTOR = false;
const IS_METHOD = true;
const NOT_METHOD = false;
const ASSIGN_EXPR_IS_OK = {_:'ASSIGN_EXPR_IS_OK'}; // fine to parse assignments, arrows, yield, ternary
const ASSIGN_EXPR_IS_ERROR = {_:'ASSIGN_EXPR_IS_ERROR'}; // throw on actual assignments, but also arrows, yield, ternary
const NOT_GETSET = 0;
const IS_GETTER = 1;
const IS_SETTER = 2;
const NOT_EVAL_OR_ARGS = undefined;
const IS_DELETE_ARG = true;
const NOT_DELETE_ARG = false;
const INC_DECL = true;
const EXC_DECL = false;
const FROM_CONTINUE = true;
const FROM_BREAK = false;
const FOR_SCOPE = 1;
const BLOCK_SCOPE = 2;
const ARG_SCOPE = 3; // "scope", this a group of args parsed in func header or destructuring (may have to rename it)
const CATCH_SCOPE = 4;
const SWITCH_SCOPE = 5;
const DO_NOT_BIND = null;
const SKIP_DUPE_CHECKS = true;
const CHECK_DUPE_BINDS = false;
const ORIGIN_IS_VAR_DECL = true;
const ORIGIN_NOT_VAR_DECL = false;
const NOT_FUNCTION_STATEMENT = false;
const UNDEF_EXPORTS = undefined;
const CHECK_TO_READ = true;
const CHECK_TO_BIND = false;

function ASSERT_ASSIGN_EXPR(allowAssignment) {
  ASSERT(allowAssignment === ASSIGN_EXPR_IS_OK || allowAssignment === ASSIGN_EXPR_IS_ERROR, 'allowAssignment is enum', allowAssignment);
}

const PIGGIES = (0
  | PIGGY_BACK_SAW_AWAIT_VARNAME
  | PIGGY_BACK_SAW_AWAIT_KEYWORD
  | PIGGY_BACK_SAW_YIELD_VARNAME
  | PIGGY_BACK_SAW_YIELD_KEYWORD
  | PIGGY_BACK_WAS_CONSTRUCTOR
  | PIGGY_BACK_WAS_PROTO
);
function copyPiggies(output, input) {
  return output | (input & PIGGIES);
}

function ZeParser(code, goalMode = GOAL_SCRIPT, collectTokens = COLLECT_TOKENS_NONE, options = {}) {
  let {
    webCompat: options_webCompat = WEB_COMPAT_ON,
    strictMode: options_strictMode = false,
    astRoot: options_astRoot = null,
    tokenStorage: options_tokenStorage = [],
    getTokenizer,
    allowGlobalReturn = false, // you may need this to parse arbitrary code or eval code for example
    targetEsVersion = VERSION_WHATEVER, // 6, 7, 8, 9, Infinity
    exposeScopes = false, // put scopes in the AST under `$scope` property?
    astUids = false, // add an incremental uid to all ast nodes for debugging
    fullErrorContext = false, // do not trunc the input when throwing an error?

    // You can override the logging functions
    $log = console.log,
    $warn = console.warn,
    $error = console.error,

    // ast compatibility stuff?

    // Should we parse directives as their own AST nodes? (Other parsers do not, they just use ExpressionStatement)
    // I'm super confused since I read https://github.com/estree/estree/pull/99 as that directives get their own node
    // and in https://github.com/estree/estree/issues/6 many authors indicate to have adopted this PR, yet none of the
    // parsers use Directive nodes. So I'm clearly overlooking something silly. *shrug*
    /* (This comment prevents the buildscript from detecting the ast prefix) */AST_directiveNodes = false,
  } = options;

  let tok = ZeTokenizer(code, targetEsVersion, goalMode, collectTokens, options_webCompat, FAIL_HARD, options_tokenStorage, $log, $warn, $error);

  ASSERT((targetEsVersion >= 6 && targetEsVersion <= 9) || targetEsVersion === VERSION_WHATEVER, 'version should be 6 7 8 9 or infin');

  let allowTrailingFunctionComma = targetEsVersion >= VERSION_TRAILING_FUNC_COMMAS || targetEsVersion === VERSION_WHATEVER;
  let allowAsyncFunctions = targetEsVersion >= VERSION_ASYNC || targetEsVersion === VERSION_WHATEVER;
  let allowAsyncGenerators = targetEsVersion >= VERSION_ASYNC_GEN || targetEsVersion === VERSION_WHATEVER;
  let allowBadEscapesInTaggedTemplates = targetEsVersion >= VERSION_TAGGED_TEMPLATE_BAD_ESCAPES || targetEsVersion === VERSION_WHATEVER;

  if (getTokenizer) getTokenizer(tok);

  let prevtok = null;
  let curtok = null;
  let curtype = 0;
  let curc = 0;

  let catchforofhack = false;

  let traceast = false;

  function THROW(desc, ...args) {
    THROW_TOKEN(desc, curtok, ...args)
  }
  function THROW_TOKEN(desc, token, ...args) {
    if (desc.indexOf('Unexpected token') >= 0) console.log(new Error().stack)
    $log('\n');
    $log('Error in parser:', desc, 'remaining throw args;', args);
    $log('Error token: ' + token);
    tok.throw('Parser error! ' + desc, token, undefined, fullErrorContext);
  }

  function sansFlag(flags, flag) {
    ASSERT(typeof flag === 'number', 'sansFlag flag 1 should be number', flag, flags);
    ASSERT(typeof flags === 'number', 'sansFlag flag 2 should be number', flag, flags);
    return (flags | flag) ^ flag;
  }
  function hasAllFlags(flags1, flags2) {
    ASSERT(typeof flags1 === 'number', 'hasAllFlags flag 1 should be number', flags1, flags2);
    ASSERT(typeof flags2 === 'number', 'hasAllFlags flag 2 should be number', flags1, flags2);
    return (flags1 & flags2) === flags2;
  }
  function hasAnyFlag(flags1, flags2) {
    ASSERT(typeof flags1 === 'number', 'hasAnyFlag flag 1 should be number', flags1, flags2);
    ASSERT(typeof flags2 === 'number', 'hasAnyFlag flag 2 should be number', flags1, flags2);
    return (flags1 & flags2) !== 0;
  }
  function hasNoFlag(flags, flag) {
    ASSERT(typeof flag === 'number', 'hasNoFlag flag 1 should be number', flag, flags);
    ASSERT(typeof flags === 'number', 'hasNoFlag flag 2 should be number', flag, flags);
    return (flags & flag) === 0;
  }

  let uid_counter = 0;

  // https://github.com/estree/estree
  // https://github.com/estree/estree/blob/master/es5.md
  // https://github.com/estree/estree/blob/master/es2015.md
  // https://astexplorer.net/
  let _tree = {
    type: 'Program',
  };
  let _path = [_tree];
  let _pnames = ['ROOT'];
  if (options_astRoot) {
    options_astRoot.root = _tree;
    options_astRoot.path = _path;
    options_astRoot.pathNames = _pnames;
  }
  function AST_open(prop, type, explictlyOverwrite = false) {
    if (traceast) {
      $log('AST_open; write type='+type+' to prop=' + prop, explictlyOverwrite);
      $log('- path (before):', _path.map(o => o.type).join(' - '));
      $log('- AST:', inspect(_tree, false, null))
    }
    ASSERT(arguments.length === 2 || arguments.length === 3, '2 args');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');
    ASSERT(typeof prop === 'string' && prop !== 'undefined', 'prop should be string');
    ASSERT(typeof type === 'string' && type !== 'undefined', 'type should be string');

    let node = _path[_path.length - 1];
    let newnode = { // all ast nodes are created here
      type,
    };
    if (astUids) newnode.$uid = uid_counter++;
    if (Array.isArray(node[prop])) {
      node[prop].push(newnode);
    }
    else if (node[prop] === undefined || explictlyOverwrite) {
      node[prop] = newnode;
    }
    else {
      THROW(`AST_open(${prop}, ${type}, ${explictlyOverwrite}); bad tree? node[${prop}] should be \`undefined\` but wasnt (child=${node}, prop=${prop}, type=${type}, node[prop]=${node[prop]})`);
    }
    _path.push(newnode);
    _pnames.push(prop);
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');
  }
  function AST_close(names) {
    if (traceast) {
      $log('AST_close(' + names +'), closing', _path[_path.length-1].type);
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- AST:', inspect(_tree, false, null))
    }
    ASSERT(arguments.length === 1, 'expecting one arg');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');

    let was = _path.pop();
    _pnames.pop();
    ASSERT(!names || (typeof names === 'string' && names === was.type) || (names instanceof Array && names.indexOf(was.type) >= 0), 'Expecting to close a node with given name(s), expected: ' + names + ' but closed: ' + was.type)
  }
  function AST_set(prop, value, clobber = false) {
    if (traceast) {
      $log('AST_set', prop, value);
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- AST:', inspect(_tree, false, null))
    }
    ASSERT(typeof prop === 'string', 'prop should be string');
    ASSERT(arguments.length === 2 || arguments.length === 3, 'expecting two args');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');
    ASSERT(clobber !== (_path[_path.length - 1][prop] === undefined), 'dont clobber, prop=' + prop + ', val=' + value);// + ',was=' + JSON.stringify(_path[_path.length - 1]));

    _path[_path.length - 1][prop] = value;
  }
  function AST_setIdent(astProp, token, overwrite = false) {
    ASSERT(typeof astProp === 'string', 'prop should be an string');
    ASSERT(typeof token === 'object', 'token should be an obj');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');
    ASSERT(token.type === $IDENT, 'token must be ident');

    AST_open(astProp, 'Identifier', overwrite);
    AST_set('name', token.canon); // doesn't seem to be specced in estree but it makes sense to use the canonical name here
    AST_close('Identifier');
  }
  function AST_setLiteral(astProp, token) {
    ASSERT(typeof astProp === 'string', 'prop is string');
    ASSERT(typeof token === 'object', 'token is obj');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');
    ASSERT(hasAnyFlag(token.type,  $NUMBER | $STRING | $REGEX), 'should be number or string');

    AST_open(astProp, 'Literal');
    AST_set('value', '<TODO>');
    AST_set('raw', token.str);
    AST_close('Literal');
  }
  function AST_add(prop, value) {
    if (traceast) {
      $log('ADD', prop, value);
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- AST:', inspect(_tree, false, null))
    }
    ASSERT(typeof prop === 'string', 'prop should be string');
    ASSERT(arguments.length === 2, 'expecting two args');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');
    ASSERT(Array.isArray(_path[_path.length - 1][prop]), 'expecting to add to an existing array');

    _path[_path.length - 1][prop].push(value);
  }
  function AST_wrapOpened(prop, newNodeType, newProp) {
    if (traceast) {
      $log('AST_wrapOpened', prop, newNodeType, newProp);
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- tree before:', inspect(_tree, false, null))
    }
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');

    // wrap the "current" node (last of _tree) with an extra node
    // so the parent of node becomes the parent of a new node and
    // the old node becomes a child of the new node
    // a(x:b) -> a(x:c(y:b))

    let node = _path.pop();
    _pnames.pop();
    let parent = _path[_path.length-1];

    if (traceast) $log(' - node to wrap:', node, ', prop:', prop, ', parent:', parent);

    if (Array.isArray(parent[prop])) {
      ASSERT(node === parent[prop][parent[prop].length - 1], 'top should be last element of parent[prop]');
      parent[prop].pop();
    } else {
      ASSERT(node === parent[prop], 'top should be parent[prop]');
    }

    AST_open(prop, newNodeType, CALLED_FROM_WRAPPER);
    // set it as child of new node
    AST_set(newProp, node);
    _path.push(node);
    _pnames.push(newProp);
    if (traceast) {
      $log('- tree after:', inspect(_tree, false, null))
    }
  }
  function AST_wrapClosed(prop, newNodeType, newProp) {
    if (traceast) {
      $log('AST_wrapClosed', prop, newNodeType, newProp);
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- tree before:', inspect(_tree, false, null))
    }
    ASSERT(AST_wrapClosed.length === arguments.length, 'arg count');
    ASSERT(typeof prop === 'string', 'should be string');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths', 'pnames='+_pnames+', path=' + _path.map(p => p.type));

    // wrap the "current" node (last of _tree) with an extra node
    // so the parent of node becomes the parent of a new node and
    // the old node becomes a child of the new node
    // a(x:b) -> a(x:c(y:b))

    let parent = _path[_path.length-1];
    let child = null;
    if (traceast) $log(' - prop:', prop, ', parent:', parent);

    if (Array.isArray(parent[prop])) {
      child = parent[prop].pop();
    } else {
      child = parent[prop];
    }
    if (traceast) $log(' - child:', child);
    ASSERT(child, 'AST_wrapClosed('+prop+', '+newNodeType+','+newProp+'); node prop `'+prop+'` should exist, bad tree?', 'child=', child, 'prop=', prop, 'newProp=', newProp, 'parent[prop]=', parent[prop]);

    AST_open(prop, newNodeType, CALLED_FROM_WRAPPER);
    // set it as child of new node
    // TODO: what if array?
    AST_set(newProp, child);
    if (traceast) {
      $log('- tree after:', inspect(_tree, false, null))
    }
  }
  function AST_replaceOpened(newNodeType, oldNodeType) {
    if (traceast) {
      $log('AST_replaceOpened', oldNodeType, '->', newNodeType);
      $log('- path:', _pnames.join(' - '));
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- tree before:', inspect(_tree, false, null))
    }
    ASSERT(arguments.length === 2, 'expecting 2 args');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');

    // this is used to replace the current open node with a new node
    // for example: when parsing an ident at the start of a label it may turn out to be a label rather than
    // an expression statement.

    let oldNode = _path.pop(); // "NewExpression", the current leaf node to fully replace
    let parentNode = _path[_path.length - 1];
    let prevProp = _pnames.pop(); // name where oldNode was stored in parentNode (parentNode[prevProp]===oldNode)

    ASSERT(oldNode.type === oldNodeType, 'expecting to replace a certain node (expected=' + oldNodeType + ', found=' + oldNode.type + ')');
    ASSERT((Array.isArray(parentNode[prevProp]) ? parentNode[prevProp][parentNode[prevProp].length-1] : parentNode[prevProp]) === oldNode, 'should be the target node');
    if (Array.isArray(parentNode[prevProp])) parentNode[prevProp].pop(); // the OPEN below will only append if array
    AST_open(prevProp, newNodeType, CALLED_FROM_WRAPPER);

    if (traceast) {
      $log('- tree after:', inspect(_tree, false, null))
    }

    return oldNode;
  }
  function AST_replaceClosed(prop, newNodeType, oldNodeType) {
    if (traceast) {
      $log('AST_replaceClosed;', prop, ':', oldNodeType, '->', newNodeType);
      $log('- path:', _pnames.join(' - '));
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- tree before:', inspect(_tree, false, null))
    }
    ASSERT(arguments.length === 3, 'expecting 3 args');
    ASSERT(typeof prop === 'string', 'prop=string');
    ASSERT(typeof newNodeType === 'string', 'pronewNodeTypep=string');
    ASSERT(typeof oldNodeType === 'string', 'oldNodeType=string');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');

    // this is used to replace the current open node with a new node
    // for example: when parsing an ident at the start of a label it may turn out to be a label rather than
    // an expression statement.

    let parentNode = _path[_path.length - 1];
    let oldNode = parentNode[prop]; // the node to fully replace
    if (oldNode instanceof Array) oldNode = oldNode.pop();

    ASSERT(oldNode, 'Expected a node on property of top', prop);
    ASSERT(!(oldNode instanceof Array), 'node should not be an array');
    ASSERT(oldNode.type !== undefined, 'Nodes should have a type');
    ASSERT(oldNode.type === oldNodeType, 'expecting to replace a certain node (expected=' + oldNodeType + ', found=' + oldNode.type + ') ' + JSON.stringify(oldNode));
    AST_open(prop, newNodeType, CALLED_FROM_WRAPPER);

    if (traceast) {
      $log('- tree after:', inspect(_tree, false, null))
    }

    return oldNode;
  }
  function AST_replaceParent(newNodeType, oldNodeType) {
    if (traceast) {
      $log('AST_replaceParent', prop, newNodeType, newNodeType);
      $log('- path:', _pnames.join(' - '));
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- tree before:', inspect(_tree, false, null))
    }
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');

    // this is used to replace the parent node with a new node
    // for example: when parsing `new` a `NewExpression` is pushed but when parsing its `callee` when it encounters
    // `.target` it must replace the whole `NewExpression` with a `MetaProperty` node. That's what this does.

    let oldNode = _path.pop(); // "NewExpression", the current leaf node to fully replace
    let parentNode = _path[_path.length - 1];
    let prevProp = _pnames.pop(); // name where oldNode was stored in parentNode (parentNode[prevProp]===oldNode)

    ASSERT(oldNode.type === oldNodeType, 'expecting to replace a certain node');
    ASSERT((Array.isArray(parentNode[prevProp]) ? parentNode[prevProp][parentNode[prevProp].length-1] : parentNode[prevProp]) === oldNode, 'should be the target node');
    if (Array.isArray(parentNode[prevProp])) parentNode[prevProp].pop(); // the OPEN below will only append if array
    AST_open(prevProp, newNodeType, CALLED_FROM_WRAPPER);

    if (traceast) {
      $log('- tree after:', inspect(_tree, false, null))
    }

    return oldNode;
  }
  function AST_wrapClosedIntoArray(prop, value, newProp, skipArrCheck) {
    if (traceast) {
      $log('AST_wrapClosedIntoArray', prop, value, newProp);
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- tree before:', inspect(_tree, false, null))
    }
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');

    // same as AST_wrapClosed except the node is put in an array

    let parent = _path[_path.length-1];
    let child = null;
    if (traceast) $log(' - prop:', prop, ', parent:', parent);

    if (!skipArrCheck && Array.isArray(parent[prop])) {
      child = parent[prop].pop();
    } else {
      child = parent[prop];
    }
    if (traceast) $log(' - child:', child);
    ASSERT(child, 'should exist, bad tree?', 'child=', child, 'prop=', prop, 'newProp=', newProp, 'parent[prop]=', parent[prop]);

    AST_open(prop, value, CALLED_FROM_WRAPPER);
    // set the node as the first child of the property as an array
    AST_set(newProp, [child]);
    if (traceast) {
      $log('- tree after:', inspect(_tree, false, null))
    }
  }
  function AST_destruct(prop) {
    // rename object and array literal nodes to patterns to match the AST spec
    // this happens when arr/obj literal was parsed (possibly nested) and
    // then a destructuring assignment was encountered
    // this is also called for function args and any other destructuring (like catch binding)

    // recursively walk the tree from the prop in open node and visit
    // any array and object expression as well as the left side of assignments
    // for now dont bother with other nodes until we find a reason to

    // note: this function is usually called after a few nodes have closed (the literal struct).

    if (traceast) {
      $log('AST_destruct', prop);
      $log('- path:', _path.map(o => o.type).join(' - '));
      $log('- tree before destruct:', inspect(_tree, false, null))
    }
    ASSERT(arguments.length === 1, 'arg count');
    ASSERT(_path.length > 0, 'path shouldnt be empty');
    ASSERT(_pnames.length === _path.length, 'pnames should have as many names as paths');

    let node = _path[_path.length-1][prop];
    ASSERT(node, 'top[' + prop + '] should be a node');
    if (Array.isArray(node)) node = node[node.length-1]; // the destruct applies to the node just closed, so last in list

    AST__destruct(node);
    if (traceast) {
      $log('- tree after destruct:', inspect(_tree, false, null))
    }
  }
  function AST__destruct(node) {
    if (traceast) {
      $log('AST__destruct', node);
    }

    ASSERT(arguments.length === 1, 'arg count');

    switch (node.type) {
      case 'ArrayExpression':
        node.type = 'ArrayPattern';
        let elements = node.elements;
        for (let i = 0, n = elements.length; i < n; ++i) {
          let element = elements[i];
          // note: children can be null (elided array destruct) but not undefined
          if (element) AST__destruct(element);
        }
        break;
      case 'ObjectExpression':
        node.type = 'ObjectPattern';
        let properties = node.properties;
        for (let i = 0, n = properties.length; i < n; ++i) {
          if (properties[i].type === 'Property') {
            ASSERT(properties[i].value, 'each property should have a value');
          } else {
            ASSERT(properties[i].type === 'SpreadElement', 'expecting only properties, spreads, and assignments here');
            ASSERT(properties[i].argument, 'each property should have a value');
          }
          AST__destruct(properties[i]);
        }
        break;
      case 'AssignmentExpression':
        node.type = 'AssignmentPattern';
        if (node.operator !== '=') THROW('The destruturing assignment should be a regular assignment');
        delete node.operator; // TODO: find a better way, this action probably causes a perf DEOPT
        // walk the left of the assignment only

        AST__destruct(node.left);
        break;
      case 'Property':
        AST__destruct(node.value);
        break;
      case 'SpreadElement':
        // `([...x]);` vs `([...x]) => x`
        // `({...x});` vs `({...x}) => x`
        node.type = 'RestElement';

        AST__destruct(node.argument);
        break;
    }
  }

  function init(lexerFlags) {
    do {
      skipRex(lexerFlags);
      if (curtype === $ERROR) softError();
    } while (curtype === $ERROR);
  }

  function softError() {
    THROW_TOKEN('Tokenizer soft error: ' + (tok.regexerror() ? 'Regex: ' +tok.regexerror() : '(but not regex)'), curtok);
  }

  function skipRex(lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 1, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(hasNoFlag(lexerFlags, LF_FOR_REGEX), 'regex flag should not be set anywhere');

    updateToken(tok(lexerFlags | LF_FOR_REGEX, RETURN_SOLID_TOKENS));

    ASSERT(typeof curtype === 'number' && curtype >= 0);
    ASSERT(typeof curc === 'number' && curc >= 0 && curc <= 0x10ffff, 'valid c', JSON.stringify(curtok));
  }
  function skipDiv(lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 1, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(hasNoFlag(lexerFlags, LF_FOR_REGEX), 'regex flag should not be set anywhere');

    updateToken(tok(lexerFlags, RETURN_SOLID_TOKENS));

    ASSERT(typeof curtype === 'number' && curtype >= 0);
    ASSERT(typeof curc === 'number' && curc >= 0 && curc <= 0x10ffff, 'valid c', JSON.stringify(curtok));
  }
  function updateToken(token) {
    prevtok = curtok;
    curtok = token;
    curtype = curtok.type;
    curc = curtok.c;
  }
  function skipAny(lexerFlags) {
    skipRex(lexerFlags); // TODO: optimize; in this case the next token is very restricted but at least no slash
    ASSERT(curc !== $$FWDSLASH_2F, 'skip any should not be called when the next char can be fwd slash');
  }

  // <SCRUB ASSERTS>
  function ASSERT_skipRex(what, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 2, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(typeof what === 'number' || typeof what === 'string', 'what number/string');
    if (typeof what === 'string') {
      ASSERT(curtok.str === what, 'expecting to skip token with certain value', 'expect:', what, 'actual:', debug_toktype(curtok.type), curtok.str);
    } else {
      ASSERT(hasAllFlags(curtype, what), 'expecting to skip token with certain type', 'expect:'
        // <SCRUB DEV>
        , debug_toktype(what), 'actual:', debug_toktype(curtype)
        // </SCRUB DEV>
      );
    }
    skipRex(lexerFlags);
  }
  function ASSERT_skipDiv(what, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 2, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(typeof what === 'number' || typeof what === 'string', 'what number/string');
    if (typeof what === 'string') {
      ASSERT(curtok.str === what, 'expecting to skip token with certain value', 'expect:', what, 'actual:', debug_toktype(curtok.type), curtok.str);
    } else {
      ASSERT(hasAllFlags(curtype, what), 'expecting to skip token with certain type', 'expect:'
        // <SCRUB DEV>
        , debug_toktype(what, true), 'actual:', debug_toktype(curtype, true)
        // </SCRUB DEV>
      );
    }
    skipDiv(lexerFlags);
  }
  function ASSERT_skipAny(what, lexerFlags) {
    // next token cannot validly start with a forward slash (may be optimizable)
    ASSERT_skipDiv(what, lexerFlags);
    ASSERT(curc !== $$FWDSLASH_2F, 'skip any should not be called when the next char can be fwd slash');
  }
  // </SCRUB ASSERTS>

  function skipRexOrDie(ord, str, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 3, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== ord || str !== curtok.str) {
      THROW('Next char should be [' + str + '] but was [' + curtok.str + ']');
    } else {
      skipRex(lexerFlags);
    }
  }
  function skipAnyOrDie(ord, str, lexerFlags) {
    // next token cannot start with forward slash (may be optimizable)
    skipRexOrDie(ord, str, lexerFlags);
    ASSERT(curc !== $$FWDSLASH_2F, 'skip any should not be called when the next char can be fwd slash');
  }
  function skipRexOrDieSingleChar(ord, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 2, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== ord || curtok.str.length !== 1) {
      THROW('Next ord should be ' + ord + ' (`' + String.fromCharCode(ord) + '`) but was ' + curc + ' (curc: `' + String.fromCharCode(curc) + '`, token: `'+curtok.str+'`)');
    } else {
      ASSERT(curtok.str.length === 1, 'should be len=1');
      skipRex(lexerFlags);
    }
  }
  function skipDivOrDieSingleChar(ord, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 2, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== ord) {
      THROW('Next ord should be ' + ord + ' (`' + String.fromCharCode(ord) + '`) but was ' + curc + ' (curc: `' + String.fromCharCode(curc) + '`, token: `'+curtok.str+'`)');
    } else if (curtok.str.length !== 1) {
      THROW('Next token should be the single char `' + String.fromCharCode(ord) + '` but was `' + curtok.str + '`');
    } else {
      ASSERT(curtok.str.length === 1, 'should be len=1');
      skipDiv(lexerFlags);
    }
  }
  function skipAnyOrDieSingleChar(ord, lexerFlags) {
    // next token cant start with forward slash (may be optimizable)
    skipRexOrDieSingleChar(ord, lexerFlags);
    ASSERT(curc !== $$FWDSLASH_2F, 'skip any should not be called when the next char can be fwd slash');
  }
  function skipRexIf(str, lexerFlags) {
    // if current token matches str, skip to next token
    // in that case if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(typeof str === 'string', 'string matches, for now');

    if (curtok.str === str) {
      skipRex(lexerFlags);
      return true;
    }
    return false;
  }
  function skipAnyIf(str, lexerFlags) {
    let x = skipRexIf(str, lexerFlags);
    ASSERT(!x  || curc !== $$FWDSLASH_2F, 'skip any should not be called when the next char can be fwd slash');
    return x;
  }
  function skipIdentSafeSlowAndExpensive(lexerFlags) {
    // skip an IDENT that may be a keyword
    // this can be done efficiently but in destructuring there are too many signals and so this needs to be done before
    // processing the ident for special cases that normally determine whether the next token is a div, regex, or any
    // this check is relatively slow but there's a plan to make these enums, which would improve things
    switch (curtok.str) {
      case 'delete':
      case 'new':
      case 'typeof':
      case 'void':
        // these are the only keywords that wrap expressions which start with regexes
        ASSERT_skipRex($IDENT, lexerFlags);
        break;
      case 'await':
        if (goalMode === GOAL_MODULE || hasAnyFlag(lexerFlags, LF_IN_ASYNC)) {
          ASSERT_skipRex($IDENT, lexerFlags);
        } else {
          ASSERT_skipDiv($IDENT, lexerFlags);
        }
        break;
      case 'yield':
        if (hasAnyFlag(lexerFlags, LF_IN_GENERATOR | LF_STRICT_MODE)) {
          ASSERT_skipRex($IDENT, lexerFlags);
        } else {
          ASSERT_skipDiv($IDENT, lexerFlags);
        }
        break;
      default:
        ASSERT_skipDiv($IDENT, lexerFlags);
    }
  }

  function parseTopLevels(lexerFlags) {
    let scoop = SCOPE_create('_parseTopLevels');
    if (exposeScopes) AST_set('$scope', scoop);
    ASSERT(scoop._ = 'root scope'); // debug
    let exportedNames = {}; // how other modules refer to something
    ASSERT(exportedNames._ = 'exported names');
    let exportedBindings = {}; // which binding an exported name refers to
    ASSERT(exportedBindings._ = 'exported bindings');
    // <SCRUB AST>
    let len = _path.length;
    let bak = _path.slice(0);
    // </SCRUB AST>
    AST_set('body', []);
    let labelSet = {_: 'labelSet'};
    _parseBodyPartsWithDirectives(lexerFlags, scoop, labelSet, exportedNames, exportedBindings, ARGS_SIMPLE, NOT_EVAL_OR_ARGS, 'body');
    // <SCRUB AST>
    ASSERT(_path.length === len, 'should close all that was opened. Open before: ' + JSON.stringify(bak.map(o=>o.type).join(' > ')) + ', open after: ' + JSON.stringify(_path.map(o=>o.type).join(' > ')));
    // </SCRUB AST>
    if (goalMode === GOAL_MODULE) {
      // assert that all exported symbols were in fact recorded
      for (let key in exportedBindings) {
        if (key[0] === '#' && key !== '#default' && (scoop.var[key] === undefined && scoop.lex[key] === undefined)) {
          THROW('Exporting a name that was not bound in global: `' + key.slice(1) + '`');
        }
      }
      ASSERT((function(){for (let key in exportedBindings) ASSERT(key[0] !== '#' || exportedBindings[key] === 1, 'key should be 1', exportedBindings[key]); return true})(), 'all bindings should exist exactly one, or have thrown an error');
    }
  }

  function SCOPE_create(desc) {
    // while this comment probably gets lost, the name is `scoop` for greppability since `scope` is too generic
    let scoop = {
      var: {}, // copied from parent unless this is main scope for function or global
      lexvar: {}, // track the lexical scope in which a `var` was defined. need this to do proper lexical checks.
      lex: {
        '#': undefined, // parent
        // this will be function or global, but that's not very relevant
        type: BLOCK_SCOPE,
        // for https://tc39.github.io/ecma262/#sec-block-duplicates-allowed-static-semantics
        // TODO: optimize creating this obj conditionally under webcompat flag
        // Every name added to the lexical scope is marked here as being a function decl name or not
        // Then when a dupe clash happens, check this list to assert that the name was only used by func names
        funcs: {},
      },
    };
    ASSERT(scoop._ = 'scope', 'just debugging');
    if (astUids) scoop.$uid = uid_counter++;
    ASSERT(scoop._ = desc); // debug
    ASSERT(scoop.lex._ = desc); // debug
    return scoop;
  }
  function SCOPE_addLexTo(scoop, scopeType, desc) {
    let scoop2 = {
      var: scoop.var,
      lexvar: {
        '#': scoop.lexvar,
      },
      lex: {
        '#': scoop.lex,
        type: scopeType,
        funcs: [],
      },
    };
    ASSERT(scoop2._ = desc + '.scope');
    ASSERT(scoop2._ = scoop._ + ':lex', 'just debugging');
    ASSERT(scoop2.lex._ = desc + '.lex');
    return scoop2;
  }
  function SCOPE_addBindingAndDedupe(lexerFlags, scoop, name, bindingType, originIsVarDecl) {
    ASSERT(SCOPE_addBindingAndDedupe.length === arguments.length, 'arg count');
    SCOPE_addBinding(lexerFlags, scoop, name, bindingType, CHECK_DUPE_BINDS, originIsVarDecl);
    if (scoop === DO_NOT_BIND) return; // example: class expr. TODO: should this be checked at call sites instead?
    if (options_webCompat === WEB_COMPAT_ON) {
      scoop.lex.funcs['#' + name] = false; // mark var name as "not only func decls"
    }
  }
  function SCOPE_addFuncDeclName(lexerFlags, scoop, name, bindingType, originIsVarDecl) {
    ASSERT(SCOPE_addBindingAndDedupe.length === arguments.length, 'arg count');
    SCOPE_addBinding(lexerFlags, scoop, name, bindingType, CHECK_DUPE_BINDS, originIsVarDecl);
    ASSERT(scoop !== DO_NOT_BIND, 'find me a case first');
    if (options_webCompat === WEB_COMPAT_ON) {
      if (!scoop.lex.funcs['#' + name]) scoop.lex.funcs['#' + name] = true;
    }
  }
  function SCOPE_addBinding(lexerFlags, scoop, name, bindingType, dupeChecks, originIsVarDecl) {
    ASSERT(SCOPE_addBinding.length === arguments.length, 'arg count');

    if (scoop === DO_NOT_BIND) return; // for example: toplevel array, function expression, class expression

    let hashed = '#' + name; // prevent special keys like __proto__ from causing problems
    if (bindingType === BINDING_TYPE_VAR) {
      // https://tc39.github.io/ecma262/#sec-for-statement-static-semantics-early-errors
      // > It is a Syntax Error if any element of the BoundNames of LexicalDeclaration also occurs in the
      //   VarDeclaredNames of Statement.
      // and,
      // https://tc39.github.io/ecma262/#sec-try-statement-static-semantics-early-errors
      // > It is a Syntax Error if any element of the BoundNames of CatchParameter also occurs in the VarDeclaredNames of Block.

      // All block, or block-esque (like switch), statements have a restriction that a `var` can not be defined if the
      // current lexical scope or any of its parents already contain a lexical (`let`/`const`) binding for that name.
      let lex = scoop.lex;
      do {
        let type = lex.type;
        if (lex[hashed] !== undefined) {
          if (type === CATCH_SCOPE) {
            if (originIsVarDecl && options_webCompat === WEB_COMPAT_ON) {
              catchforofhack = true;
            } else {
              THROW('Can not redefine the catch-var as same binding');
            }
          } else if (type === FOR_SCOPE) {
            // if (SCOPE_isDupeLexBindingError(scoop, hashed, lexerFlags) === true) {
            THROW('Tried to define a var which was already bound as a let/const inside a for-header, which is explicitly illegal');
            // }
          } else if (type !== ARG_SCOPE) { // args are really just kind of vars
            if (SCOPE_isDupeLexBindingError(scoop, hashed, lexerFlags) === true) {
              THROW('Tried to define a var which was already bound as a lexical binding');
            }
          }
          // can get here for `try {} catch(e) { var e; }` with webcompat mode on, and for `function f(a){ var a }` etc
        }
        lex = lex['#'];
      } while (lex);

      let x = scoop.var[hashed];
      if (x === undefined) x = 1;
      else ++x;
      scoop.var[hashed] = x;

      // mark var as defined in all lexvars in the chain. this way a lexical binding can check the current lexvar to
      // determine whether it was added anywhere up, for example `{{var x}} let x` should be an error and is impossible otherwise.
      let lexvar = scoop.lexvar;
      do {
        lexvar[hashed] = true;
        lexvar = lexvar['#'];
      } while (lexvar);
    }
    else {
      ASSERT(bindingType === BINDING_TYPE_ARG || bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_CONST || bindingType === BINDING_TYPE_NONE, 'only use this for arg, var, let, and const', bindingType);
      // Scan the lexical records for any `catch` header record, have to scan all the way up to scope-root (func/glob)
      // for any such lexical records, confirm the current name does not appear in it, or throw. :'(
      let lex = scoop.lex;

      if (dupeChecks === CHECK_DUPE_BINDS) {
        SCOPE_lexParentDupeCheck(lexerFlags, scoop, hashed);

        if (lex[hashed] !== undefined) {
          if (SCOPE_isDupeLexBindingError(scoop, hashed, lexerFlags) === true) {
            THROW('Cannot create lexical binding when the name was already bound');
          }
        }
      }

      let x = lex[hashed];
      if (x === undefined) x = 1;
      else if (dupeChecks === CHECK_DUPE_BINDS) {
        ASSERT(x >= 1, 'x is undefined or at least 1');
        if (SCOPE_isDupeLexBindingError(scoop, hashed, lexerFlags) === true) {
          THROW('Encountered lexical binding `' + hashed.slice(1) + '` that was bound multiple times (let/const/class/etc)');
        }
      }
      else ++x;

      lex[hashed] = x;
    }
  }
  function SCOPE_verifyLexical(lexerFlags, scoop, skipParent) {
    let lex = scoop.lex;
    for (let key in lex) {
      if (key[0] === '#' && key.length > 1) {
        if (lex[key] > 1) {
          return true;
        }
        if (!skipParent) SCOPE_lexParentDupeCheck(lexerFlags, scoop, key);
      }
    }
    return false;
  }
  function SCOPE_lexParentDupeCheck(lexerFlags, scoop, hashed) {
    ASSERT(SCOPE_lexParentDupeCheck.length === arguments.length, 'arg count');

    // confirm that given hashed name is not already defined in parent pseudo-lexical scopes of certain kinds (like args)

    let lex = scoop.lex;

    let lexParent = lex['#'];
    if (lexParent !== undefined) {
      if (lexParent.type === ARG_SCOPE && lexParent[hashed] !== undefined) {
        THROW('Cannot use `let` or `const` with the same name as bound to a parameter');
      }

      if (lexParent.type === CATCH_SCOPE && lexParent[hashed] !== undefined) {
        THROW('Double declaration of the same binding name in a `catch` var');
      }
    }

    // only check inner scopes. var recording also has to check upper lex scopes (`let x; {var x}`)
    if (scoop.lexvar[hashed] !== undefined) {
      if (SCOPE_isDupeLexBindingError(scoop, hashed, lexerFlags) === true) {
        THROW('Cannot create lexical binding when the name was already `var` bound');
      }
    }
  }
  function SCOPE_verifyArgs(scoop, wereSimpleArgs) {
    let lex = scoop.lex['#'];
    ASSERT(lex, 'should be in the body of a function/scope where the args have just been parsed into another layer');
    _SCOPE_verifyArgs(lex, wereSimpleArgs);
  }
  function _SCOPE_verifyArgs(lex, wereSimpleArgs) {
    for (let key in lex) {
      if (key[0] === '#' && key.length > 1 && lex[key] > 1) {
        if (wereSimpleArgs === ARGS_COMPLEX) {
          THROW('Same param name was bound twice and the args are not simple, this is not allowed');
        } else {
          THROW('Same param name `' + key.slice(1) + '` was bound twice, this is not allowed in strict mode');
        }
      }
    }
  }
  function SCOPE_isDupeLexBindingError(scoop, hashed, lexerFlags) {
    if (options_webCompat === WEB_COMPAT_OFF) return true;
    if (SCOPE_isFuncDeclOnly(scoop, hashed) === false) return true;
    if (hasAnyFlag(lexerFlags, LF_STRICT_MODE)) return true;
    return false;
  }
  function SCOPE_isFuncDeclOnly(scoop, hashed) {
    ASSERT(options_webCompat === WEB_COMPAT_ON, 'this is only for webcompat');
    ASSERT(scoop.lex && scoop.lex.funcs, 'obj should be there');
    ASSERT(hashed[0] === '#' && hashed !== '#', 'name should be hashed');
    return scoop.lex.funcs[hashed] === true;
  }

  function parseDirectivePrologues(lexerFlags, astProp) {
    ASSERT(arguments.length === parseDirectivePrologues.length, 'arg count');
    // note: there may be multiple (bogus or valid) directives...
    while (hasAllFlags(curtype, $STRING)) {
      // we must first parse as usual to confirm this is an isolated string and not
      // something like `''.foo` or `'' + x`. We can't easily scan forward in this
      // case since asi is only applied when the next token would cause a syntax
      // error. There many tokens to check. However this is a fairly cold path since
      // this will almost never happen outside of "use strict" so perhaps a pervasive
      // scan here is not so bad... And let's face it; trivial cases are quickly found.

      let stringToken = curtok;
      ASSERT_skipDiv($STRING, lexerFlags); // statement start means div

      // Remember; this is always the case of a statement that starts with a string and
      // we are checking the next token after that

      if (isDirective()) {
        lexerFlags = parseDirectivePrologue(lexerFlags, stringToken, astProp);
      } else {
        // not ideal but this almost never happens
        _parseFromLiteralStatement(lexerFlags, stringToken, astProp)
      }
    }
    return lexerFlags;
  }
  function parseDirectivePrologue(lexerFlags, stringToken, astProp) {
    ASSERT(arguments.length === parseDirectivePrologue.length, 'arg count');

    let dir = stringToken.str.slice(1, -1);
    if (dir === 'use strict') lexerFlags = lexerFlags | LF_STRICT_MODE;

    if (AST_directiveNodes) {
      AST_open(astProp, 'Directive');
      AST_set('directive', dir);
      AST_close('Directive');
    } else {
      AST_open(astProp, 'ExpressionStatement');
      AST_setLiteral('expression', stringToken);
      AST_set('directive', dir);
      AST_close('ExpressionStatement');
    }

    parseSemiOrAsi(lexerFlags);

    return lexerFlags;
  }

  function isDirective() {
    // scan for simple cases first
    if (curc === $$SEMI_3B || curc === $$CURLY_R_7D) return true;
    if (!curtok.nl) {
      if (curtype === $EOF) return true; // meh. useless in global, leads to an error in any other case. but okay!
      return false; // no chance to ASI
    }
    if (curtok.str === '++' || curtok.str === '--') return true; // "foo" \n ++bar
    if (curtype !== $PUNCTUATOR) {
      if (curtok.str === 'in' || curtok.str === 'instanceof') {
        return false;
      }
      // considering the current token is a string;
      // only certain punctuators and in/instanceof would be valid
      // tokens next and we checked those so the newline causes ASI
      return true;
    }
    // so there is a newline and the next token is a punctuation.
    // we confirmed the edge cases so just consider ASI not allowed here.
    // TODO: puncs that are invalid here should lead to ASI (and then fail later). How valuable is that level of correctness?
    return false;
  }

  function _parseBodyPartsWithDirectives(lexerFlags, scoop, labelSet, exportedNames, exportedBindings, wasSimple, functionNameTokenToVerify, astProp) {
    ASSERT(arguments.length === _parseBodyPartsWithDirectives.length, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    let wasStrict = hasAllFlags(lexerFlags, LF_STRICT_MODE); // unique param check

    let addedLexerFlags = parseDirectivePrologues(LF_NO_FLAGS, 'body');

    if (hasAnyFlag(addedLexerFlags, LF_STRICT_MODE)) {
      if (wasSimple === ARGS_COMPLEX) {
        // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-early-errors
        // "It is a Syntax Error if ContainsUseStrict of FunctionBody is true and IsSimpleParameterList of FormalParameters is false."
        // and IsSimpleParameterList is only true the params are "es5" (no destructuring, no defaults, just idents)
        THROW('Can only declare use strict if func params are "simple"');
      }
      if (functionNameTokenToVerify) {
        // the binding type is not used in conjunction with strict mode
        fatalBindingIdentCheck(functionNameTokenToVerify, BINDING_TYPE_VAR, lexerFlags | LF_STRICT_MODE);
      }
    }

    if (!wasStrict && hasAnyFlag(addedLexerFlags, LF_STRICT_MODE) && hasNoFlag(lexerFlags, LF_IN_GLOBAL)) {
      SCOPE_verifyArgs(scoop, wasSimple);
    }

    lexerFlags |= addedLexerFlags;
    while (curtype !== $EOF && curc !== $$CURLY_R_7D) parseBodyPart(lexerFlags, scoop, {'#': labelSet}, exportedNames, exportedBindings, INC_DECL, astProp);
  }

  function _parseBodyPartsSansDirectives(lexerFlags, scoop, labelSet, includeDeclarations, astProp) {
    ASSERT(arguments.length === _parseBodyPartsSansDirectives.length, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    while (curtype !== $EOF && curc !== $$CURLY_R_7D) parseNestedBodyPart(lexerFlags, scoop, {'#':labelSet}, includeDeclarations, astProp);
  }

  function parseStatementHeader(lexerFlags, headProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerflags number');
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags);
    parseExpressions(lexerFlags | LF_NO_ASI, ASSIGN_EXPR_IS_OK, headProp);
    skipRexOrDieSingleChar($$PAREN_R_29, lexerFlags);
  }

  function parseSemiOrAsi(lexerFlags) {
    // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion
    // do if:
    // - unable to parse next token and there was a newline between that and the previous token
    // - at eof and the current script is not (yet) valid
    // - when a closing } is encountered
    // - when ++ or -- is encountered and a newline preceded it
    // - when a newline (and no semi) follows a "restricted production" (continue, break, return, throw, yield
    //   (only with assignment). note that throw is always illegal in that case and continue/break may be.)
    // unless (don't if):
    // - the semi would be empty
    // - the next line starts with forward slash
    // - the semi would be part of a for-header
    // TODO: should check whether the next token would be "an error"; especially the newline case makes no such effort :(
    if (curc === $$FWDSLASH_2F) {
      ASSERT(false, 'Tried to apply ASI but next token starts with forward slash. This could be a legit error. Confirm and make sure parser path is properly setting regex/div flag.', ''+curtok);
      THROW('Cannot apply ASI when next token starts with forward slash (this could very well be a bug in the parser...)');
    }
    if (curc === $$SEMI_3B) {
      ASSERT_skipRex(';', lexerFlags);
    } else if (hasAllFlags(lexerFlags, LF_DO_WHILE_ASI)) {
      if (curtok.nl) tok.asi();
      else THROW('Unable to ASI inside a do-while statement without a newline');
    } else {
      ASSERT(hasNoFlag(lexerFlags, LF_NO_ASI), 'this case should have been caught sooner');
      // note: must check eof/semi as well otherwise the value would be mandatory and parser would throw
      if (curc === $$CURLY_R_7D || curtok.nl || curtype === $EOF) {
        tok.asi();
      } else {
        $log('parse error at curc', curc, String.fromCharCode(curc), curtok.str);
        $log('current token:', curtok);
        THROW('Unable to ASI, token: ' + curtok);
      }
    }
  }

  function parseNestedBodyPart(lexerFlags, scoop, labelSet, includeDeclarations, astProp) {
    ASSERT(arguments.length === parseNestedBodyPart.length, 'arg count');
    // nested statements like that of if, while, for, try, etc
    return parseBodyPart(sansFlag(lexerFlags, LF_IN_SCOPE_ROOT), scoop, labelSet, UNDEF_EXPORTS, UNDEF_EXPORTS, includeDeclarations, astProp);
  }

  function parseBodyPart(lexerFlags, scoop, labelSet, exportedNames, exportedBindings, includeDeclarations, astProp) {
    ASSERT(arguments.length === parseBodyPart.length, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(hasNoFlag(curtype, $ERROR | $EOF), 'should not have error or eof at this point');

    switch (getGenericTokenType(curtype)) { // TODO: convert to flag index to have perfect hash in the switch
      case $IDENT:
        parseIdentStatement(lexerFlags, scoop, labelSet, exportedNames, exportedBindings, includeDeclarations, astProp);
        break;
      case $PUNCTUATOR:
        parsePunctuatorStatement(lexerFlags, scoop, labelSet, astProp);
        break;
      case $NUMBER:
        parseFromLiteralStatement(lexerFlags, astProp);
        break;
      case $STRING:
        parseFromLiteralStatement(lexerFlags, astProp);
        break;
      case $TICK:
        parseTickStatement(lexerFlags, astProp);
        break;
      case $REGEX:
        parseFromLiteralStatement(lexerFlags, astProp);
        break;
      case $ERROR:
        THROW_TOKEN('Tokenizer error: ' + (tok.regexerror() ? 'Regex: ' + tok.regexerror() : '(not regex?)'), curtok );

      default:
        THROW_TOKEN('Unexpected token'
          // <SCRUB DEV>
          + ': ' + debug_toktype(curtype), debug_toktype(getGenericTokenType(curtype))
          // </SCRUB DEV>
          , curtok
          , tok.regexerror()
        );
    }
  }

  // ### functions

  function parseFunction(lexerFlags, scoop, isFuncDecl, isRealFuncExpr, isAsync, optionalIdent, isFunctionStatement, astProp) {
    ASSERT(parseFunction.length === arguments.length, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerflags number');

    /*
     function f() {}
     x=function f() {}
     y=function() {}
     o={foo(){}}

     function* f() {}
     x=function* f() {}
     y=function*() {}
     o={*foo(){}}

     async function g(){}
     x=async function g(){}
     x=async function(){}
     o={async foo(){}}
     */
    ASSERT_skipAny('function', lexerFlags);
    let isGenerator = false;
    if (skipAnyIf('*', lexerFlags)) {
      if (isAsync && !allowAsyncGenerators) {
        THROW('Async generators are not supported by the current targeted language version, they were introduced in ES9/ES2018');
      }
      isGenerator = true;
    }
    return parseFunctionAfterKeyword(lexerFlags, scoop, isFuncDecl, isRealFuncExpr, isGenerator, isAsync, optionalIdent, NOT_CONSTRUCTOR, NOT_METHOD, NOT_GETSET, isFunctionStatement, astProp);
  }
  function parseFunctionExpression(lexerFlags, isAsync, astProp) {
    ASSERT(typeof isAsync === 'boolean', 'enum');
    let isGenerator = NOT_GENERATOR;
    if (skipAnyIf('*', lexerFlags)) {
      if (isAsync && !allowAsyncGenerators) {
        THROW('Async generators are not supported by the current targeted language version, they were introduced in ES9/ES2018');
      }
      isGenerator = IS_GENERATOR;
    }
    parseFunctionAfterKeyword(lexerFlags, DO_NOT_BIND, NOT_FUNC_DECL, IS_FUNC_EXPR, isGenerator, isAsync, IDENT_REQUIRED, NOT_CONSTRUCTOR, NOT_METHOD, NOT_GETSET, NOT_FUNCTION_STATEMENT, astProp);
  }
  function parseAsyncFunctionDecl(lexerFlags, fromStmtOrExpr, includeDeclarations, scoop, isExport, exportedBindings, astProp) {
    ASSERT(parseAsyncFunctionDecl.length === arguments.length, 'arg count');
    ASSERT(curtok.str === 'function', 'already checked, not yet consumed');

    // `async function ...`
    if (fromStmtOrExpr === IS_STATEMENT && includeDeclarations === EXC_DECL) {
      THROW('Cannot parse a async function declaration here, only expecting statements here');
    }

    let name = parseFunction(
      lexerFlags,
      scoop,
      fromStmtOrExpr === IS_EXPRESSION ? NOT_FUNC_DECL : IS_FUNC_DECL,
      fromStmtOrExpr === IS_EXPRESSION ? IS_FUNC_EXPR : NOT_FUNC_EXPR,
      WAS_ASYNC,
      (isExport === IS_EXPORT || fromStmtOrExpr === IS_EXPRESSION) ? IDENT_OPTIONAL : IDENT_REQUIRED,
      NOT_FUNCTION_STATEMENT,
      astProp
    );

    if (isExport) {
      // - `export async function x(){}`
      // - `export default async function x(){}`
      // - `export default function x(){}`
      // the "default" and "*default*" cases are handled in the export parser
      // if this func has a name, record it by reference because return values are already used by something else
      addBindingToExports(exportedBindings, name);
    }

    return NOT_ASSIGNABLE;
  }
  function parseFunctionAfterKeyword(lexerFlags, outerScoop, isFuncDecl, isRealFuncExpr, isGenerator, isAsync, isIdentOptional, isClassConstructor, isMethod, isGetSet, isFunctionStatement, astProp) {
    ASSERT(arguments.length === parseFunctionAfterKeyword.length, 'arg count must match');
    ASSERT(isGenerator === IS_GENERATOR || isGenerator === NOT_GENERATOR, 'gen enum');
    ASSERT(typeof isAsync === 'boolean', 'enum');
    ASSERT(!!isFuncDecl === (outerScoop !== DO_NOT_BIND), 'outerScoop is only used for func decl ids and required there', !!isFuncDecl, outerScoop !== DO_NOT_BIND);

    /*
    These are the cfg productions for func decls and exprs with various modifiers and how they are inherited.

    FunctionDeclaration:                           function  BindingIdentifier[?Yield, ?Await](FormalParameters[~Yield, ~Await]){FunctionBody[~Yield, ~Await]}
    GeneratorDeclaration[Yield, Await]:            function *BindingIdentifier[?Yield, ?Await](FormalParameters[+Yield, ~Await]){FunctionBody[+Yield, ~Await]}
    AsyncFunctionDeclaration[Yield, Await]:  async function  BindingIdentifier[?Yield, ?Await](FormalParameters[~Yield, +Await]){FunctionBody[~Yield, +Await]}
    AsyncGeneratorDeclaration[Yield, Await]: async function *BindingIdentifier[?Yield, ?Await](FormalParameters[+Yield, +Await]){FunctionBody[+Yield, +Await]}
    // Names of declarations inherit from enclosing scope

    FunctionExpression:                            function  BindingIdentifier[~Yield, ~Await](FormalParameters[~Yield, ~Await]){FunctionBody[~Yield, ~Await]}
    GeneratorExpression:                           function *BindingIdentifier[+Yield, ~Await](FormalParameters[+Yield, ~Await]){FunctionBody[+Yield, ~Await]}
    AsyncFunctionExpression:                 async function  BindingIdentifier[~Yield, +Await](FormalParameters[~Yield, +Await]){FunctionBody[~Yield, +Await]}
    AsyncGeneratorExpression:                async function *BindingIdentifier[+Yield, +Await](FormalParameters[+Yield, +Await]){FunctionBody[+Yield, +Await]}
    // Names of expressions inherit from current function

    Regardless of state, yield is automatically considered a keyword in strict mode and await is automatically a keyword
    with the module goal.
    Function decls can be named await in script mode when their enclosing scope is not async. They can be called yield
    in sloppy mode when their enclosing scope is not a generator.
    For expressions the current function is checked rather than the enclosing scope.
    */

    AST_open(astProp, isFuncDecl === IS_FUNC_DECL ? 'FunctionDeclaration' : 'FunctionExpression');

    ASSERT(!isAsync || allowAsyncFunctions, 'async = es8');
    ASSERT(!isAsync || !isGenerator || allowAsyncGenerators, 'async generators = es9');

    AST_set('generator', isGenerator);
    AST_set('async', isAsync);

    let innerScoop = SCOPE_create('parseFunctionAfterKeyword_main_func_scope');
    ASSERT(innerScoop._ = 'func scope');

    // need to track whether the name was eval/args because if the func body is strict mode then it should still throw
    // retroactively for having that name. a bit annoying.
    let functionNameTokenToVerify = NOT_EVAL_OR_ARGS;

    let name = '';
    if (curtype === $IDENT) {
      // properly inherit the async/gen state from the outer scope (func decls) or current function (func expr)
      let bindingFlags = (
        sansFlag(lexerFlags, LF_IN_GENERATOR | LF_IN_ASYNC)
        |
        getFuncIdentAsyncGenState(isRealFuncExpr, lexerFlags, isGenerator, isAsync)
      );

      // functions decls are lexical bound, except in script-goal (!) global root and in any function scope root;
      // https://tc39.github.io/ecma262/#sec-block-static-semantics-toplevellexicallydeclarednames
      // > At the top level of a function, or script, function declarations are treated like var declarations
      //   rather than like lexical declarations.
      // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-lexicallydeclarednames
      // this shows how func decls dont end up in the lex scope (TopLevelLexicallyDeclaredNames...)
      // explicitly expressed in https://tc39.github.io/ecma262/#sec-block-static-semantics-toplevellexicallydeclarednames
      // > At the top level of a function, or script, function declarations are treated like var declarations rather than like lexical declarations.
      // However, in module goal this is not entirely the case: https://tc39.github.io/ecma262/#sec-module-semantics-static-semantics-lexicallydeclarednames
      // > At the top level of a Module, function declarations are treated like lexical declarations rather than like var declarations.

      // The above comes down to the following; a func decl is a `var` if it's directly in a scope and if that is
      // either a function scope or the goal is script. Otherwise it is to be considered a lexical (let) binding.
      let nameBindingType = (isFuncDecl === IS_FUNC_DECL && ((hasNoFlag(lexerFlags, LF_IN_GLOBAL) || goalMode === GOAL_SCRIPT) && hasAllFlags(lexerFlags, LF_IN_SCOPE_ROOT))) ? BINDING_TYPE_VAR : BINDING_TYPE_LET;

      // TODO: this func could return another state: "valid in sloppy mode, invalid in strict mode"
      //       that would be better because currently the checks have to run twice in infrequent the worst case
      fatalBindingIdentCheck(curtok, nameBindingType, bindingFlags);
      name = curtok.str;
      if (isFunctionStatement) {
        outerScoop = SCOPE_addLexTo(outerScoop, BLOCK_SCOPE, 'special function statement');
      }
      // declarations bind in outer scope, expressions bind in inner scope, methods bind ...  ehh?
      if (isFuncDecl === IS_FUNC_DECL) {
        SCOPE_addFuncDeclName(lexerFlags, outerScoop, name, nameBindingType, ORIGIN_IS_VAR_DECL);
      } else if (isFuncDecl === IS_FUNC_EXPR && isRealFuncExpr) {
        // FIXME: this approach may work but means the exposed scope cannot be used to find func expr names (probably same for other similar cases like class exprs)
        SCOPE_addBindingAndDedupe(lexerFlags, innerScoop, name, nameBindingType, ORIGIN_IS_VAR_DECL);
      }
      // create new lexical binding to "hide" the function name.
      // this way it wont cause problems when doing `x=function f(){ let f; }`
      innerScoop = SCOPE_addLexTo(innerScoop, BLOCK_SCOPE, 'parseFunctionAfterKeyword_hide_func_name');
      ASSERT(innerScoop._ = 'func scope');

      functionNameTokenToVerify = curtok; // if not strict mode yet but this func has a directive, check it again
      AST_setIdent('id', curtok);
      ASSERT_skipAny($IDENT, lexerFlags);
    } else if (isFuncDecl === IS_FUNC_DECL && !isIdentOptional) {
      THROW('Function decl missing required ident');
    } else {
      AST_set('id', null);
    }

    // reset the async lexer flags. some don't cross function boundaries
    // make sure the LF_CAN_NEW_DOT_TARGET flag is set from here on out, this enables new.target (is allowed in arg default)
    // note: we dont reset the template lexer flag here. instead we do it at any place where we parse curly pairs
    //       this fixes the problem of parsing arrow functions where we can't tell whether the next token is part
    //       of the arrow expression until after parsing and processing that token. that needs curly pair checks.
    lexerFlags = resetLexerFlagsForFuncAndArrow(lexerFlags, isGenerator, isAsync, NOT_ARROW);

    // super() is allowed in constructor param defaults so deal with the flag now...
    // these flags dont reset in arrows so only do it here
    if (isClassConstructor === IS_CONSTRUCTOR) {
      ASSERT(isAsync === NOT_ASYNC, 'class constructors are not async');
      ASSERT(isGenerator === NOT_GENERATOR, 'class constructors are not generators');
      ASSERT(isMethod === IS_METHOD, 'class constructors are methods');
      // you can use `super()` in arg defaults so set it up now
      lexerFlags |= LF_IN_CONSTRUCTOR;
    } else {
      // since methods cant nest without another class (which resets this flag) or object (which cant have this flag)
      // we should reset the flag now
      // Examples of bad case:s
      // - `class x extends y { constructor(){ ({ constructor(x=super()){} }); } }`
      // - `class x extends y { constructor(){ class z { constructor(x=super()){} }; } }`
      lexerFlags = sansFlag(lexerFlags, LF_IN_CONSTRUCTOR | LF_SUPER_CALL);
    }

    // regular functions cannot use `super` at all (and arrows are not parsed here)
    // methods can use super props as soon as their arg defaults
    if (isMethod === IS_METHOD) lexerFlags |= LF_SUPER_PROP;
    else lexerFlags = sansFlag(lexerFlags, LF_SUPER_PROP);
    ASSERT(typeof lexerFlags === 'number');

    parseFunctionFromParams(
      lexerFlags,
      innerScoop,
      isAsync ? FROM_ASYNC_ARG : FROM_OTHER_FUNC_ARG,
      isFuncDecl === IS_FUNC_DECL ? IS_STATEMENT : IS_EXPRESSION,
      isGenerator,
      isClassConstructor,
      isGetSet,
      functionNameTokenToVerify,
      isMethod
    );
    AST_close(isFuncDecl === IS_FUNC_DECL ? 'FunctionDeclaration' : 'FunctionExpression');

    return name;
  }
  function getFuncIdentGeneratorState(isFuncExpr, enclosingScopeFlags, currentScopeIsGenerator) {
    // function idents can never be `yield` with the module goal
    if (hasAllFlags(enclosingScopeFlags, LF_STRICT_MODE)) return LF_IN_GENERATOR;

    if (isFuncExpr) return currentScopeIsGenerator ? LF_IN_GENERATOR : 0;
    return hasAnyFlag(enclosingScopeFlags, LF_IN_GENERATOR) ? LF_IN_GENERATOR : 0;
  }
  function getFuncIdentAsyncState(isFuncExpr, enclosingScopeFlags, currentScopeIsGenerator) {
    // function idents can never be `await` with the module goal
    if (goalMode === GOAL_MODULE) return LF_IN_ASYNC;

    if (isFuncExpr) return currentScopeIsGenerator ? LF_IN_ASYNC : 0;
    return hasAnyFlag(enclosingScopeFlags, LF_IN_ASYNC) ? LF_IN_ASYNC : 0;
  }
  function getFuncIdentAsyncGenState(isFuncExpr, enclosingScopeFlags, currentScopeGenerator, currentScopeAsync) {
    return getFuncIdentGeneratorState(isFuncExpr, enclosingScopeFlags, currentScopeGenerator) |
      getFuncIdentAsyncState(isFuncExpr, enclosingScopeFlags, currentScopeAsync)
  }
  function resetLexerFlagsForFuncAndArrow(lexerFlags, isGenerator, isAsync, funcType) {
    ASSERT(arguments.length === resetLexerFlagsForFuncAndArrow.length, 'arg count');

    // this resets lexerflags for parsing a function from the arguments onwards or for the body of an arrow
    lexerFlags = sansFlag(lexerFlags,
      LF_IN_ASYNC |
      LF_IN_GENERATOR |
      LF_IN_FUNC_ARGS
    );

    // the function name can inherit this state from the enclosing scope but all other parts of a function will
    // be parsed according to the state of hte currently defined function
    if (isAsync) {
      lexerFlags |= LF_IN_ASYNC;
    }
    if (isGenerator) {
      lexerFlags |= LF_IN_GENERATOR;
    }

    // dont remove the template flag here! let curly pair structures deal with this individually (fixes arrows)
    if (funcType === NOT_ARROW) lexerFlags = lexerFlags | LF_CAN_NEW_DOT_TARGET;

    return lexerFlags;
  }
  function parseFunctionFromParams(lexerFlags, scoop, bindingFrom, expressionState, isGenerator, isClassConstructor, isGetSet, functionNameTokenToVerify, isMethod) {
    ASSERT(parseFunctionFromParams.length === arguments.length, 'arg count should match');
    let paramScoop = SCOPE_addLexTo(scoop, ARG_SCOPE, 'parseFunctionFromParams(arg)');
    // `yield` can certainly NOT be a var name if either parent or current function was a generator, so track it
    let wasSimple = parseFuncArguments(lexerFlags | LF_NO_ASI, paramScoop, bindingFrom, isGetSet, isGenerator, isMethod);
    ASSERT(typeof lexerFlags === 'number');

    let finalFuncScope = SCOPE_addLexTo(paramScoop, BLOCK_SCOPE, 'parseFunctionFromParams(body)');
    if (exposeScopes) AST_set('$scope', finalFuncScope);
    _parseBlockStatement(
      sansFlag(lexerFlags | LF_IN_SCOPE_ROOT, LF_IN_GLOBAL | LF_IN_SWITCH | LF_IN_ITERATION),
      finalFuncScope,
      {},
      expressionState,
      PARSE_DIRECTIVES,
      wasSimple,
      functionNameTokenToVerify,
      INC_DECL,
      'body'
    );
  }
  function parseFuncArguments(lexerFlags, scoop, bindingFrom, isGetSet, isGenerator, isMethod) {
    // parseArguments
    ASSERT(arguments.length === parseFuncArguments.length, 'arg count');
    ASSERT(isGetSet === IS_GETTER || isGetSet === IS_SETTER || isGetSet === NOT_GETSET, 'enum');
    // TODO: await expression inside the params (like default param) of an async function are illegal
    lexerFlags = lexerFlags | LF_IN_FUNC_ARGS; // prevents await expression as default arg
    AST_set('params', []);

    let wasSimple = true;

    if (curc !== $$PAREN_L_28) THROW('Must have func arguments next but did not find `(`');
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags);
    if (curc === $$PAREN_R_29) {
      if (isGetSet === IS_SETTER) {
        THROW('Setters must have exactly one parameter');
      }
      ASSERT_skipRex(')', lexerFlags);
    }
    else if (isGetSet === IS_GETTER) {
      THROW('Getters can not have any parameters');
    }
    else {
      wasSimple = parseBindings(lexerFlags, scoop, BINDING_TYPE_ARG, bindingFrom, ASSIGNMENT_IS_DEFAULT, isGetSet, SKIP_DUPE_CHECKS, UNDEF_EXPORTS, UNDEF_EXPORTS, 'params');
      AST_destruct('params');
      ASSERT(curc !== $$COMMA_2C, 'the trailing func comma case should already be caught by now');
      skipAnyOrDieSingleChar($$PAREN_R_29, lexerFlags);
    }

    if (isMethod === IS_METHOD || !wasSimple || hasAnyFlag(lexerFlags, LF_STRICT_MODE)) {
      _SCOPE_verifyArgs(scoop.lex, wasSimple)
    }

    return wasSimple;
  }

  // ### statements

  function parseIdentStatement(lexerFlags, scoop, labelSet, exportedNames, exportedBindings, includeDeclarations, astProp) {
    ASSERT(parseIdentStatement.length === arguments.length, 'arg count');
    // all statement starting keywords;

    // (async), break, class, const, continue, debugger, do, export, for, function, if, import, let, loop, return, switch, throw, try, var, while, with

    let identToken = curtok;
    switch (curtok.str) {
      case 'async':
        // we deal with async here because it can be a valid label in sloppy mode
        ASSERT_skipAny('async', lexerFlags); // TODO: async can only be followed by `function`, `(`, `:`, or an ident (arrow)
        if (curc === $$COLON_3A) return parseLabeledStatementInstead(lexerFlags, scoop, labelSet, identToken, astProp);
        parseAsyncStatement(lexerFlags, scoop, identToken, NOT_EXPORT, includeDeclarations, UNDEF_EXPORTS, astProp);
        return;

      case 'break':
        parseBreakStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'class':
        if (includeDeclarations === EXC_DECL) THROW('Cannot parse a class declaration here, only excpecting statements here');
        parseClassDeclaration(lexerFlags, scoop, IDENT_REQUIRED, astProp);
        return;

      case 'const':
        if (includeDeclarations === EXC_DECL) THROW('Cannot parse a const declaration here, only excpecting statements here');
        parseConstStatement(lexerFlags, scoop, astProp);
        return;

      case 'continue':
        parseContinueStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'debugger':
        parseDebuggerStatement(lexerFlags, astProp);
        return;

      case 'do':
        parseDoStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'export':
        parseExportStatement(lexerFlags, scoop, exportedNames, exportedBindings, astProp);
        return;

      case 'for':
        parseForStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'function':
        // TODO: only ES5 explicitly disallowed function statements, we may want to look into detecting them
        // TODO: consider it a declaration in if/else and statement (requiring semi) in all other statement places
        let isFunctionStatement = false;
        if (includeDeclarations === EXC_DECL) {
          isFunctionStatement = true;
          // in web compat mode func statements are only allowed inside `if` and `else` statements in sloppy mode
          if (options_webCompat === WEB_COMPAT_OFF || hasNoFlag(lexerFlags, LF_CAN_FUNC_STMT) || hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
            THROW('Cannot parse a function declaration here, only excpecting statements here');
          }
        }
        ASSERT(scoop, 'should have a scoop at this point');
        parseFunction(lexerFlags, scoop, IS_FUNC_DECL, NOT_FUNC_EXPR, NOT_ASYNC, IDENT_REQUIRED, isFunctionStatement, astProp);
        return;

      case 'if':
        parseIfStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'import':
        parseImportDeclaration(lexerFlags, scoop, astProp);
        return;

      case 'let':
        // When parsed as declaration (so directly inside a global, function, or block scope) the parsing goal is first a
        // let declaration and in particular can not be a let variable when the next token is an identifier, array, or object.
        // However, when parsed as a sub-statement it will always parse a `let` as variable and only in the case where it is
        // followed by an array literal an ASI is forced ("restricted production").
        // Additionally, in strict mode `let` can not be the name of a variable regardless parsing a declaration or statement.
        if (includeDeclarations === INC_DECL) {
          parseLetDeclaration(lexerFlags, scoop, labelSet, astProp);
        } else {
          ASSERT(includeDeclarations === EXC_DECL, 'enum');
          parseLetExpressionStatement(lexerFlags, scoop, labelSet, astProp);
        }
        return;

      case 'return':
        parseReturnStatement(lexerFlags, astProp);
        return;

      case 'switch':
        parseSwitchStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'throw':
        parseThrowStatement(lexerFlags, astProp);
        return;

      case 'try':
        parseTryStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'var':
        parseVarStatement(lexerFlags, scoop, astProp);
        return;

      case 'while':
        parseWhileStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      case 'with':
        parseWithStatement(lexerFlags, scoop, labelSet, astProp);
        return;

      default:
        parseIdentLabelOrExpressionStatement(lexerFlags, scoop, labelSet, astProp);
        return;
    }

    THROW('Unexpected identifier case');
  }

  function parseFromLiteralStatement(lexerFlags, astProp) {
    let stringToken = curtok;
    skipDiv(lexerFlags); // note: this can be any literal
    _parseFromLiteralStatement(lexerFlags, stringToken, astProp);
  }
  function _parseFromLiteralStatement(lexerFlags, stringToken, astProp) {
    AST_open(astProp, 'ExpressionStatement');
    AST_setLiteral('expression', stringToken);
    parseExpressionAfterLiteral(lexerFlags, 'expression');
    if (curc === $$COMMA_2C) {
      _parseExpressions(lexerFlags, initNotAssignable(), 'expression');
    }
    AST_close('ExpressionStatement');
    parseSemiOrAsi(lexerFlags);
  }

  function parseTickStatement(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    if (hasAllFlags(curtype, $TICK_BAD_ESCAPE)) {
      THROW('Template contained an illegal escape', debug_toktype(curtype), ''+curtok);
    }
    AST_open(astProp, 'ExpressionStatement');
    parseTickExpression(lexerFlags, 'expression');
    parseExpressionAfterLiteral(lexerFlags, 'expression');
    if (curc === $$COMMA_2C) {
      _parseExpressions(lexerFlags, initNotAssignable(), 'expression');
    }
    AST_close('ExpressionStatement');
    parseSemiOrAsi(lexerFlags);
  }

  function parseAsyncStatement(lexerFlags, scoop, asyncIdentToken, isExport, includeDeclarations, exportedBindings, astProp) {
    ASSERT(parseAsyncStatement.length === arguments.length, 'arg count');
    // an async statement is almost the same as an expression but it needs to know whether it was in fact
    // an expression or not so it knows how to apply the statement semi/asi.
    // at this point already verified not to be a label.
    // only the `async function ...` form does NOT require a semi as a statement. all other forms do.
    // A statement needs to pass on the scoop because the async func decl needs to record its id in that outer scope
    _parseAsync(lexerFlags, scoop, IS_STATEMENT, asyncIdentToken, NOT_NEW_ARG, isExport, ASSIGN_EXPR_IS_OK, includeDeclarations, exportedBindings, astProp);
  }
  function parseAsyncExpression(lexerFlags, asyncIdentToken, isNewArg, isExport, allowAssignment, astProp) {
    ASSERT(parseAsyncExpression.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    // parsed the `async` keyword (-> identToasyncIdentTokenken)
    return _parseAsync(lexerFlags, DO_NOT_BIND, IS_EXPRESSION, asyncIdentToken, isNewArg, isExport, allowAssignment, EXC_DECL, UNDEF_EXPORTS, astProp);
  }
  function _parseAsync(lexerFlags, scoop, fromStmtOrExpr, asyncIdentToken, isNewArg, isExport, allowAssignment, includeDeclarations, exportedBindings, astProp) {
    ASSERT(_parseAsync.length === arguments.length, 'arg count');
    ASSERT(typeof astProp === 'string', 'astprop = string', astProp);
    ASSERT(asyncIdentToken.str === 'async', 'pass on the async keyword');
    ASSERT(curtok !== asyncIdentToken, 'should have consumed the async keyword');
    ASSERT(scoop === DO_NOT_BIND || scoop, 'potentially need scoop, for async func decls (only)');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    // this function will parse tail but NOT parse op and rhs.

    // consider these;
    // - `async x => x`
    // - `async x => {} * x`      (error)
    // - `async[x] * y`           (not error)
    // - `f(async x => x)`
    // - `f(async x => {} * x)`   (NOT error)
    // - `f(async[x] * y)`
    // but also
    // - `async + c`              (async + c)
    // - `async + c + d`          ((async + c) + d)
    // - `a + async + c + d`      (((a + async) + c) + d)
    // - `a + b + async + c + d`  ((((a + b) + async) + c) + d)
    // this last example shows `async` parser shouldn't just parse the op immediately but the statement that
    // is not a function should not just ASI after the async bit (that yields ((a+b)+(async+d)), so it needs more info.
    // - `new async()`
    // - `new async() => x`
    // - `new async() \n => x`
    // - `new async \n ();`

    // https://tc39.github.io/ecma262/#prod-AsyncArrowFunction
    // AsyncArrowFunction [In, Yield, Await]:
    //   async [no LineTerminator here] AsyncArrowBindingIdentifier [?Yield] [no LineTerminator here] => AsyncConciseBody [?In]
    //   CoverCallExpressionAndAsyncArrowHead [?Yield, ?Await] [no LineTerminator here] => AsyncConciseBody [?In]
    // CoverCallExpressionAndAsyncArrowHead [Yield, Await]:
    //   MemberExpression[?Yield, ?Await] Arguments[?Yield, ?Await]
    //
    // Supplemental Syntax
    //   The interpretation of CoverCallExpressionAndAsyncArrowHead is refined using:
    //     AsyncArrowHead:
    //       async [no LineTerminator here] ArrowFormalParameters [~Yield, +Await]
    //
    // Early Errors:
    //   It is a Syntax Error if CoverCallExpressionAndAsyncArrowHead is not covering an AsyncArrowHead.
    //
    //
    // In human language there are two cases when parsing an async arrow; the arrow without parens and the arrow with.
    // When there is no paren, the newline immediately causes ASI and that's that. So `async \n x => y` is fine.
    // When there is a paren, the initial grammar has no newline condition. If the input matches the grammar, with or
    // without a newline after `async` (but definitely without a newline before the arrow!) then a mandatory extra
    // condition applies that there cannot be a newline after `async` and to treat it a syntax error if there is one.
    // However, note that there are contextual cases where an arrow would not be allowed in the first place, like unary
    // operators (you can't do `void () => x` or `void async () => x`). In those cases you would just parse async as a
    // call regardless. An arrow would be a syntax error by default but we can ignore the async-newline (again, either
    // way because it would be fine for the call). The tricky part is the case where an arrow is allowed but simply
    // not present. `let x = async \n (y);` is fine and not a syntax error. Only when the arrow is present we can
    // and should immediately throw an error when there was a newline after async. So this means we must parse through
    // to the arrow. At least it also means we won't have to "fix up" the AST retroactively.

    // parser decision tree based on tokens:
    // - `in`: this is `async in y` and is "okay" regardless of newlines
    // - `instanceof`: this is `async instanceof y` and is "okay" regardless of newlines
    // - eof: ASI after `async`
    // - newline
    //   - `function`: ASI after `async` (the function, if valid, will not be considered to be async)
    //   - ident: ASI after `async`
    //   - paren open, parse group
    //     - newline: this is `async(..)` and the newline is ignored
    //     - eof: this is `async(..)` and the newline is ignored
    //     - `=>`: no ASI, this is an error (see comment block above) because the cover grammar can't be applied
    //     - else: this is `async(..)` and the newline is ignored
    //   - else: `ASI after `async`
    // - `function`: must be async function
    // - ident
    //   - newline: error (because ASI must occur and `async foo;` is illegal)
    //   - eof: error (because ASI must occur and `async foo;` is illegal)
    //   - `=>`: arrow function without parenthesis
    //   - else: error (because `async foo;` is illegal)
    // - paren open, parsed group
    //   - newline: this is `async(..)`, if the arrow shows up after this group then that's an error
    //   - arrow: async arrow
    //   - else: `async(..)`
    // - else: `async` as a var name

    if (curtype === $EOF || !allowAsyncFunctions) {
      return parseExpressionAfterAsyncAsVarName(lexerFlags, fromStmtOrExpr, asyncIdentToken, isNewArg, allowAssignment, astProp);
    }

    let newlineAfterAsync = curtok.nl;

    if (curtype === $IDENT) {
      // - `async foo ...`
      //          ^
      // - `async eval => {}`
      // - `async eval => { "use strict"; }`
      // - `async function f(){}`
      // - `async in x`
      // - `async in obj`
      // - `async \n function f(){}`
      //             ^

      if (newlineAfterAsync) {
        // This _MUST_ mean async is a regular var name so just parse an expression now.
        // - `async \n ident`
        //             ^
        // - `async \n foo;`
        // - `async \n in x`
        // - `async \n in obj`
        // - `async \n instanceof obj`
        // - `async \n function f(){}`
        return parseExpressionAfterAsyncAsVarName(lexerFlags, fromStmtOrExpr, asyncIdentToken, isNewArg, allowAssignment, astProp);
      }

      if (curtok.str === 'function') {
        // - `async function f(){}`
        return parseAsyncFunctionDecl(lexerFlags, fromStmtOrExpr, includeDeclarations, scoop, isExport, exportedBindings, astProp);
      }

      if (curtok.str === 'in' || curtok.str === 'instanceof') {
        // - `async in x`
        // - `async instanceof x`

        return parseExpressionAfterAsyncAsVarName(lexerFlags, fromStmtOrExpr, asyncIdentToken, isNewArg, allowAssignment, astProp);
      }

      // - `async foo => ..`                        ok
      //          ^
      // - `async foo \n ..`                        error
      // - `async \n foo => ..`                     ok
      // - `async \n foo \n ..`                     error
      // - `export default async foo => ..`         ok (but only as default)

      if (isNewArg === IS_NEW_ARG) {
        // - `new async x => x`
        //              ^
        THROW('Cannot apply `new` to an (async) arrow');
      }
      parseParenlessArrowAfterAsync(lexerFlags, fromStmtOrExpr, allowAssignment, astProp);
      return NOT_ASSIGNABLE;
    }

    if (curc === $$PAREN_L_28) {
      // - `async (y);`
      //          ^
      // - `async (x) => x`
      // - `async \n (foo);`                   --> `async(foo)`
      //             ^
      // - `async \n (foo) => foo`             --> error, cannot apply cover grammar
      // - `(async \n (foo);`                  --> `(async(foo))`
      // - `(async \n (foo) => foo)`           --> error, cannot apply cover grammar
      // - `let x = async \n (foo);`           --> `let x = async(foo);`
      // - `let x = async \n (foo) => foo`     --> error, cannot apply cover grammar

      if (isNewArg === IS_NEW_ARG) {
        // - `new async()`
        //             ^
        // - `new async();`
        // - `new async() =>x`                   --> error, arrow not allowed as new arg
        // Do not parse the paren because it belongs to the `new` op
        AST_setIdent('callee', asyncIdentToken);
        return IS_ASSIGNABLE; // I mean ...
      }

      if (fromStmtOrExpr === IS_STATEMENT) {
        AST_open(astProp, 'ExpressionStatement');
        astProp = 'expression'
      }

      if (isNewArg === IS_NEW_ARG) {
        // - `new async();`
        // - `new async() => x`     (error because arrow is an AssignmentExpression and new does not accept that)
        // Note that if it turns out to be an arrow, the parser will throw when seeing `=>` unexpectedly
        return parseExpressionAfterAsyncAsVarName(lexerFlags, fromStmtOrExpr, asyncIdentToken, isNewArg, allowAssignment, astProp);
      }

      let r = parseGroupToplevels(lexerFlags, fromStmtOrExpr, allowAssignment, asyncIdentToken, newlineAfterAsync ? IS_ASYNC_PREFIXED : NOT_ASYNC_PREFIXED, astProp);

      if (fromStmtOrExpr === IS_STATEMENT) {
        AST_close('ExpressionStatement');
      }

      return r;
    }

    // async as a var name (if statement it may also be a label!)
    // - `async \n x => y`
    // - `async \n function f(){}`
    // - `x = async \n a => b`
    // - `x = async \n function f(){}`
    // - `async \n [x]`
    // - `(async \n [x])`
    // - `new async;`
    return parseExpressionAfterAsyncAsVarName(lexerFlags, fromStmtOrExpr, asyncIdentToken, isNewArg, allowAssignment, astProp);
  }

  function isAssignable(state) {
    return (state & IS_ASSIGNABLE) === IS_ASSIGNABLE;
  }
  function notAssignable(state) {
    return (state & NOT_ASSIGNABLE) === NOT_ASSIGNABLE;
  }
  function initAssignable(previous) {
    ASSERT(arguments.length === 0 || previous === 0, 'if the previous value was set it should still be 0');
    return IS_ASSIGNABLE;
  }
  function initNotAssignable(previous) {
    ASSERT(arguments.length === 0 || previous === 0, 'if the previous value was set it should still be 0');
    return NOT_ASSIGNABLE;
  }
  function setAssignable(state) {
    // set both flags then unset the one we dont want
    return (state | IS_ASSIGNABLE | NOT_ASSIGNABLE) ^ NOT_ASSIGNABLE;
  }
  function setNotAssignable(state) {
    // set both flags then unset the one we dont want
    return (state | IS_ASSIGNABLE | NOT_ASSIGNABLE) ^ IS_ASSIGNABLE;
  }
  function mergeAssignable(override, state) {
    return override | ((state | NOT_ASSIGNABLE | IS_ASSIGNABLE) ^ (NOT_ASSIGNABLE | IS_ASSIGNABLE));
  }

  function parseAwait(lexerFlags, awaitIdentToken, isNewArg, allowAssignment, astProp) {
    ASSERT(parseAwait.length === arguments.length, 'arg count');
    ASSERT(awaitIdentToken.str === 'await', 'await token');
    ASSERT(awaitIdentToken !== curtok, 'await should have been skipped');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // in module: only if lexerFlags allow await (inside async code)
    // in script: must be considered an await-expression when inside async, must be considered a var name otherwise
    // (`await` when not a keyword _is_ assignable)

    if (hasAnyFlag(lexerFlags, LF_IN_ASYNC)) {
      return parseAwaitKeyword(lexerFlags, isNewArg, astProp);
    }
    else if (goalMode === GOAL_SCRIPT) {
      return parseAwaitVar(lexerFlags, awaitIdentToken, isNewArg, allowAssignment, astProp)
    }
    else {
      THROW('Cannot use `await` as var when goal=module but found `await` outside an async function');
    }
  }
  function parseAwaitKeyword(lexerFlags, isNewArg, astProp) {
    if (isNewArg === IS_NEW_ARG) {
      // - `async function f(){ new await x; }`
      // - `async function f(){ [new await foo] }`
      // - `async function f(){ (new await foo) }`
      // - `function f(){ "use strict"; new await; }`
      // - `function *f(){ "use strict"; new await; }`
      // - `async function *f(){ new await; }`
      THROW('Cannot `await` as the arg of `new`');
    }

    if (hasAllFlags(lexerFlags, LF_IN_FUNC_ARGS)) {
      // Illegal without arg (would already fail for that reason alone)
      // - `function f(x = await){}`
      // - `function *f(x = await){}`
      // - `async function f(x = await){}`
      // - `async function *f(x = await){}`
      // Illegal with arg
      // - `function f(x = await y){}`
      // - `function *f(x = await y){}`
      // - `async function f(x = await y){}`
      // - `async function *f(x = await y){}`
      // Illegal as arg name
      // - `function f(await){}`
      // - `function *f(await){}`
      // - `async function f(await){}`
      // - `async function *f(await){}`
      THROW('Await is illegal as default arg value');
    }

    // - `async function f(){ new await; }`
    // - `async function *f(){ new await; }`

    AST_open(astProp, 'AwaitExpression');

    // - `await ()=>x` is an error (arrows are assignable)
    parseValue(lexerFlags, ASSIGN_EXPR_IS_ERROR, NOT_NEW_ARG, 'argument'); // await expr arg is never optional

    if (curtok.str === '**') {
      THROW('The lhs of ** can not be this kind of unary expression (syntactically not allowed, you have to wrap something)');
    }

    AST_close('AwaitExpression');

    // An await-expression is not assignable and cannot appear inside;
    // - arrow function parameters
    // - async generator function/method parameters
    // - async function/method parameters
    // - async arrow parameters

    return NOT_ASSIGNABLE | PIGGY_BACK_SAW_AWAIT_KEYWORD;
  }
  function parseAwaitVar(lexerFlags, awaitIdentToken, isNewArg, allowAssignment, astProp) {
    ASSERT(parseAwaitVar.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    // Consider `await` a regular var name, not a keyword
    // Should throw an error if used as an await anyways

    // - `await;`
    // - `await.x;`
    // - `new await;`
    // - `typeof await;`

    let assignable = parseIdentOrParenlessArrow(lexerFlags, awaitIdentToken, IS_ASSIGNABLE, allowAssignment, astProp);
    assignable = parseValueTail(lexerFlags, assignable, isNewArg, astProp);

    // For module goal see: https://tc39.github.io/ecma262/#prod-AwaitExpression
    // For script mode see: https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
    // - IdentifierReference
    // - BindingIdentifier
    // - LabelIdentifier
    // - Identifier: IdentifierName but not ReservedWord
    //   - inside something async (+Await) and canon is await: error
    //   - goal module and canon is await: error

    // However, something like `function f(x = 5 + await){}` should probably not be a syntax error in script goal..?
    return assignable | PIGGY_BACK_SAW_AWAIT_VARNAME;
  }

  function parseBlockStatement(lexerFlags, scoop, labelSet, blockType, parseDirectives, wasSimple, includeDeclarations, astProp) {
    return _parseBlockStatement(lexerFlags, scoop, labelSet, blockType, parseDirectives, wasSimple, NOT_EVAL_OR_ARGS, includeDeclarations, astProp);
  }
  function _parseBlockStatement(lexerFlags, scoop, labelSet, blockType, parseDirectives, wasSimple, functionNameTokenToVerify, includeDeclarations, astProp) {
    ASSERT(_parseBlockStatement.length === arguments.length, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(typeof lexerFlags === 'number');
    ASSERT(typeof labelSet === 'object');

    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE | LF_NO_ASI | LF_DO_WHILE_ASI);

    AST_open(astProp, 'BlockStatement');
    if (exposeScopes) AST_set('$scope', scoop);
    AST_set('body', []);
    skipRexOrDieSingleChar($$CURLY_L_7B, lexerFlagsNoTemplate); // [v]: `(x)=>{/x/}`
    if (parseDirectives === PARSE_DIRECTIVES) {
      _parseBodyPartsWithDirectives(lexerFlagsNoTemplate, scoop, labelSet, UNDEF_EXPORTS, UNDEF_EXPORTS, wasSimple, functionNameTokenToVerify, 'body');
    } else {
      ASSERT(parseDirectives === IGNORE_DIRECTIVES, 'should be boolean');
      _parseBodyPartsSansDirectives(lexerFlagsNoTemplate, scoop, labelSet, includeDeclarations, 'body');
    }
    if (blockType === IS_EXPRESSION) {
      skipDivOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    } else {
      ASSERT(blockType === IS_STATEMENT, 'either expression or not');
      skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    }
    AST_close('BlockStatement');

    if (curc === $$IS_3D) THROW('A statement can not start with object destructuring assignment (because block)');
  }

  function parseBreakStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseBreakStatement.length, 'arg count');

    // TODO: report incorrect reason for failure of test test262/test/language/statements/break/S12.8_A1_T2.js (fails because the label does not appear in the labelSet, since a break with label _can_ be valid)

    AST_open(astProp, 'BreakStatement');
    ASSERT_skipRex('break', lexerFlags);
    // a break may be followed by another identifier which must then be a valid label.
    // otherwise it's just a break to the nearest breakable (most likely).

    // break without label is only valid inside an iteration or switch statement, fenced by functions
    // break with label is only valid if the label exists in the current statement tree

    // note: must check eof/semi as well otherwise the value would be mandatory and parser would throw
    if (curtype === $IDENT && !curtok.nl) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)
      AST_setIdent('label', curtok);

      if (!findLabel(labelSet, curtok.str, FROM_BREAK)) THROW('The label for this `break` was not defined in the current label set, which is illegal');

      ASSERT_skipRex($IDENT, lexerFlags);
    } else {
      AST_set('label', null);

      if (hasNoFlag(lexerFlags, LF_IN_ITERATION | LF_IN_SWITCH)) THROW('Can only `break` inside a `switch` or loop');
    }

    parseSemiOrAsi(lexerFlags);
    AST_close('BreakStatement');
  }
  function findLabel(labelSet, label, checkIteration) {
    let id = '#' + label;

    // for `continue` we can only accept labels defined _before_ the inner-most iteration statement that wraps it
    // this is basically caused by https://tc39.github.io/ecma262/#sec-labelled-statements-static-semantics-containsundefinedcontinuetarget
    let failIfFound = checkIteration === FROM_CONTINUE;
    do {
      if (labelSet[id]) {
        if (failIfFound) {
          THROW('Cannot `continue` to this label because it was defined inside the current inner-most loop');
        }
        return true;
      }
      if (failIfFound && labelSet['##']) failIfFound = false;
      labelSet = labelSet['#'];
    } while (labelSet);

    return false;
  }

  function parseClassDeclaration(lexerFlags, scoop, optionalIdent, astProp) {
    ASSERT(arguments.length === parseClassDeclaration.length, 'expecting all args');
    // class x {}
    // class x extends <lhs expr> {}
    // class x {;}
    // class x {[static] <method>[]}
    // export class x {}
    // export class {}

    lexerFlags = sansFlag(lexerFlags | LF_STRICT_MODE, LF_IN_CONSTRUCTOR);

    ASSERT_skipAny('class', lexerFlags); // TODO: valid varname, `extends`, or `{`
    AST_open(astProp, 'ClassDeclaration');

    let name = parseClassId(lexerFlags, optionalIdent, scoop);

    // TODO: I'm prety sure scoop should be DO_NOT_BIND here (and can be folded inward)
    _parseClass(lexerFlags, scoop, IS_STATEMENT);

    AST_close('ClassDeclaration');

    return name; // used if export
  }
  function parseClassExpression(lexerFlags, astProp) {
    ASSERT(arguments.length === parseClassExpression.length, 'expecting all args');
    // x = class x {}
    // x = class x extends <lhs expr> {}
    // x = class x {;}
    // x = class x {[static] <method>[]}

    lexerFlags = sansFlag(lexerFlags | LF_STRICT_MODE, LF_IN_CONSTRUCTOR);

    AST_open(astProp, 'ClassExpression');

    parseClassId(lexerFlags, IDENT_OPTIONAL, DO_NOT_BIND);

    let assignable = _parseClass(lexerFlags, DO_NOT_BIND, IS_EXPRESSION);
    AST_close('ClassExpression');

    // The `await/yield` flags only describe the `extends` part. Additionally the class as a whole is not assignable.
    return setNotAssignable(assignable);
  }
  function parseClassId(lexerFlags, optionalIdent, scoop) {
    ASSERT(parseClassId.length === arguments.length, 'arg count');
    ASSERT(hasAllFlags(lexerFlags, LF_STRICT_MODE) && hasNoFlag(lexerFlags, LF_IN_CONSTRUCTOR), 'should be set by caller');

    let bindingName = '';
    // note: default exports has optional ident but should still not skip `extends` here
    // but it is not a valid class name anyways (which is superseded by a generic keyword check)
    if (curtype === $IDENT && curtok.str !== 'extends') {
      // The class name is to be considered a `const` inside the class, but a `let` outside of the class
      // https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation
      // > If hasNameProperty is false, perform SetFunctionName(value, className).
      // https://tc39.github.io/ecma262/#sec-initializeboundname
      // > Perform ? InitializeBoundName(className, value, env).
      // > Perform env.InitializeBinding(name, value).
      // https://tc39.github.io/ecma262/#table-15
      // > InitializeBinding(N, V) : Set the value of an already existing but uninitialized binding in an Environment
      //   Record. The String value N is the text of the bound name. V is the value for the binding and is a value of
      //   any ECMAScript language type.
      // eg: it is a `let` binding in outer scope and a `const` binding in inner scope...
      fatalBindingIdentCheck(curtok, BINDING_TYPE_CLASS, lexerFlags);
      bindingName = curtok.str;
      SCOPE_addBindingAndDedupe(lexerFlags, scoop, bindingName, BINDING_TYPE_LET, ORIGIN_NOT_VAR_DECL);
      AST_setIdent('id', curtok);
      ASSERT_skipAny($IDENT, lexerFlags);
    } else if (!optionalIdent) {
      //  '`export class extends x {}` is the only valid class decl without name');
      THROW('Class decl missing required ident, `extends` is not a valid variable name');
    } else {
      // expression           (`x = class {}`)
      // default exports      (`export default class {}`)
      AST_set('id', null);
    }
    return bindingName;
  }
  function _parseClass(lexerFlags, scoop, isExpression) {
    ASSERT(arguments.length === _parseClass.length, 'expecting all args');
    ASSERT(hasAllFlags(lexerFlags, LF_STRICT_MODE) && hasNoFlag(lexerFlags, LF_IN_CONSTRUCTOR), 'should be set by caller');
    // Note: all class code is always strict mode implicitly
    // Note: methods inside classes can access super properties
    // Note: `super()` is only valid in the constructor a class that uses `extends` (resets when nesting but after `extends`)

    let assignable = 0; // only relevant to propagate the `extends` expression

    if (curtype === $IDENT && curtok.str === 'extends') {
      ASSERT_skipRex('extends', lexerFlags);
      // - `class x extends {} {}`             is valid so we can't just scan for `{` and throw a nice error
      // - `async function f(fail = class y extends (await f) {}){}`  (should be an error...?)
      // - `class x extends ()=>{} {}`         error because the extends cannot be an arrow
      // - `class x extends ()=>{} 1`          error because the extends cannot be an arrow
      assignable = parseValue(lexerFlags | LF_NO_ASI, ASSIGN_EXPR_IS_ERROR, NOT_NEW_ARG, 'superClass');
      // don't set LF_SUPER_CALL before parsing the extending value
      lexerFlags |= LF_SUPER_CALL; // can do `super()` because this class extends another class
    } else {
      AST_set('superClass', null);
      lexerFlags = sansFlag(lexerFlags, LF_SUPER_CALL);
    }

    // TODO: div/regex for class decl/expr, and asi.

    // _now_ enable super props, super call is already set up correctly
    lexerFlags |= LF_SUPER_PROP;
    // note: generator and async state is not reset because computed method names still use the outer state
    // Note: this `assignable` is relevant for passing back await/yield flags
    assignable |= parseClassbody(lexerFlags, scoop, BINDING_TYPE_NONE, isExpression, 'body');

    return assignable;
  }

  function parseConstStatement(lexerFlags, scoop, astProp) {
    ASSERT_skipAny('const', lexerFlags); // next is ident, [, or {
    parseAnyVarDecls(lexerFlags, scoop, BINDING_TYPE_CONST, FROM_STATEMENT_START, SKIP_DUPE_CHECKS, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
    if (SCOPE_verifyLexical(lexerFlags, scoop)) THROW('Const binding attempted to get at least one name bound more than once');
    parseSemiOrAsi(lexerFlags);
  }

  function parseContinueStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseContinueStatement.length, 'arg count');

    AST_open(astProp, 'ContinueStatement');
    // continue is only valid inside a loop, fenced by functions
    if (hasNoFlag(lexerFlags, LF_IN_ITERATION)) THROW('Can only `continue` inside a loop');
    ASSERT_skipRex('continue', lexerFlags);
    // a continue may be followed by another identifier which must then be a valid label.
    // otherwise it's just a continue to the nearest loop (most likely).

    // note: must check eof/semi as well otherwise the value would be mandatory and parser would throw
    if (curtype === $IDENT && !(curtok.nl || curtype === $EOF || curtok.value === ';')) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)

      AST_setIdent('label', curtok);
      if (!findLabel(labelSet, curtok.str, FROM_CONTINUE)) THROW('The label for this `continue` was not defined in the current label set, which is illegal');

      ASSERT_skipRex($IDENT, lexerFlags);
    } else {
      AST_set('label', null);
    }

    parseSemiOrAsi(lexerFlags);
    AST_close('ContinueStatement');
  }

  function parseDebuggerStatement(lexerFlags, astProp) {
    AST_open(astProp, 'DebuggerStatement');
    AST_close('DebuggerStatement');
    ASSERT_skipRex('debugger', lexerFlags);
    parseSemiOrAsi(lexerFlags);
  }

  function parseDoStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseDoStatement.length, 'arg count');

    AST_open(astProp, 'DoWhileStatement');
    ASSERT_skipRex('do', lexerFlags);
    // if the next part does not start with `{` then it is not a block and ASI can not happen. otherwise dont care here
    // note that functions and classes DO get ASI
    parseNestedBodyPart((curc !== $$CURLY_L_7B ? lexerFlags | LF_DO_WHILE_ASI : lexerFlags) | LF_IN_ITERATION, scoop, {'##': 'dowhile', '#': labelSet}, EXC_DECL, 'body');
    skipAnyOrDie($$W_77, 'while', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    // > 11.9.1: In ECMAScript 2015, Automatic Semicolon Insertion adds a semicolon at the end of a do-while statement if the
    // > semicolon is missing. This change aligns the specification with the actual behaviour of most existing implementations.
    parseSemiOrAsi(lexerFlags);
    AST_close('DoWhileStatement');
  }

  function parseExportStatement(lexerFlags, scoop, exportedNames, exportedBindings, astProp) {
    ASSERT(parseExportStatement.length === arguments.length, 'arg count');
    // export * FromClause ;
    // export ExportClause FromClause ;
    // export ExportClause ;
    // export VariableStatement ;
    // export let ;
    // export const ;
    // export class
    // export function
    // export async function
    // export generator function
    // export async generator function
    // export default class
    // export default function
    // export default async function
    // export default generator function
    // export default async generator function
    // export default assignment ;

    // https://tc39.github.io/ecma262/#sec-module-semantics-static-semantics-early-errors
    // > It is a Syntax Error if the ExportedNames of ModuleItemList contains any duplicate entries.
    //   > The duplicate ExportedNames rule implies that multiple export default ExportDeclaration items within a ModuleBody is a Syntax Error.
    // > It is a Syntax Error if any element of the ExportedBindings of ModuleItemList does not also occur in either
    //   the VarDeclaredNames of ModuleItemList, or the LexicallyDeclaredNames of ModuleItemList.
    // https://tc39.github.io/ecma262/#sec-exports-static-semantics-exportednames
    // ExportedNames is a list of any symbol that's exported by name (most importantly `x` in `export {x}` since that's
    // the only export that doesn't end up in the scope). All exports must also be a global binding of some sort.

    // export sans default can do; var, let, const, function, async function, function *, class
    // export with default can do: function, async function, function *, class, and any assignment expression
    // regarding asi; classes and function decls dont get asi, anything else does. `default` does not change this.
    // note: the regular function, async function, and class may have no name only with `default`
    if (goalMode !== GOAL_MODULE) THROW('The `export` keyword can only be used with the module goal');
    if (hasNoFlag(lexerFlags, LF_IN_GLOBAL)) THROW('The `export` keyword is only supported at the top level');
    if (hasNoFlag(lexerFlags, LF_IN_SCOPE_ROOT)) THROW('The `export` keyword can not be nested in another statement'); // TODO: import()

    ASSERT_skipAny('export', lexerFlags);

    let needsSemi = true; // only classes and function decls don't get this

    if (curc === $$D_64 && curtok.str === 'default') {
      AST_open(astProp, 'ExportDefaultDeclaration');
      ASSERT_skipRex('default', lexerFlags);

      // https://tc39.github.io/ecma262/#sec-exports-static-semantics-exportednames
      // https://tc39.github.io/ecma262/#sec-exports-static-semantics-exportedbindings

      if (curtok.str === 'class') {
        // `export default class {}`
        // `export default class x{}`

        let exportedName = parseClassDeclaration(lexerFlags, scoop, IDENT_OPTIONAL, 'declaration');

        // bound names: class name and "*default*"
        // exported binding: class name and "*default*"
        // exported names: "default"
        SCOPE_addBindingAndDedupe(lexerFlags, scoop, '*default*', BLOCK_SCOPE, ORIGIN_NOT_VAR_DECL);
        addNameToExports(exportedNames, 'default');
        addBindingToExports(exportedBindings, '*default*');
        addBindingToExports(exportedBindings, exportedName);

        needsSemi = false;
      } else if (curc === $$F_66 && curtok.str === 'function') {
        // `export default function f(){}`
        // `export default function* f(){}`
        // `export default function(){}`
        // `export default function* (){}`

        let exportedName = parseFunction(lexerFlags, scoop, IS_FUNC_DECL, NOT_FUNC_EXPR, NOT_ASYNC, IDENT_OPTIONAL, NOT_FUNCTION_STATEMENT, 'declaration');

        // bound names: func name and "*default*"
        // exported binding: func name and "*default*"
        // exported names: "default"
        SCOPE_addBindingAndDedupe(lexerFlags, scoop, '*default*', BLOCK_SCOPE, ORIGIN_NOT_VAR_DECL);
        addNameToExports(exportedNames, 'default');
        addBindingToExports(exportedBindings, '*default*');
        addBindingToExports(exportedBindings, exportedName);

        needsSemi = false;
      } else if (curc === $$A_61 && curtok.str === 'async') {
        // `export default async function f(){}`
        // `export default async function(){}`
        // `export default async () => y`
        // `export default async (x) => y`
        // `export default async x => y`

        let identToken = curtok;
        ASSERT_skipRex('async', lexerFlags);
        // note: can be any expression, function or legacy. default export doesnt care as much
        if (curtok.str === 'function') {
          // `export default async function f(){}`
          // `export default async function(){}`

          parseAsyncStatement(lexerFlags, scoop, identToken, IS_EXPORT, INC_DECL, exportedBindings, 'declaration');

          // bound names: func name and "*default*"
          // exported binding: func name (already recorded if present) and "*default*"
          // exported names: "default"
          SCOPE_addBindingAndDedupe(lexerFlags, scoop, '*default*', BLOCK_SCOPE, ORIGIN_NOT_VAR_DECL);
          addNameToExports(exportedNames, 'default');
          addBindingToExports(exportedBindings, '*default*');

          needsSemi = false;
        } else {
          // `export default async () => y`
          // `export default async (x) => y`
          // `export default async x => y`

          // https://tc39.github.io/ecma262/#prod-ExportDeclaration
          // > export default [lookahead ∉ { function, async [no LineTerminator here] function, class }] AssignmentExpression [+In, ~Yield, ~Await] ;
          // > AssignmentExpression[In, Yield, Await] : AsyncArrowFunction [?In, ?Yield, ?Await]
          // so `export default async () => {};` should be fine
          parseAsyncExpression(lexerFlags, identToken, NOT_NEW_ARG, IS_EXPORT, ASSIGN_EXPR_IS_OK, 'declaration');

          // (this won't have any other name than "default")
          // bound names: "*default*"
          // exported binding: "*default*"
          // exported names: "default"
          SCOPE_addBindingAndDedupe(lexerFlags, scoop, '*default*', BLOCK_SCOPE, ORIGIN_NOT_VAR_DECL);
          addNameToExports(exportedNames, 'default');
          addBindingToExports(exportedBindings, '*default*');
        }
      } else {
        // `export default 15`

        // any expression is exported as is (but is not a live binding)
        parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'declaration');

        // bound names: "*default*"
        // exported binding: "*default*"
        // exported names: "default"
        SCOPE_addBindingAndDedupe(lexerFlags, scoop, '*default*', BLOCK_SCOPE, ORIGIN_NOT_VAR_DECL);
        addNameToExports(exportedNames, 'default');
        addBindingToExports(exportedBindings, '*default*');
      }

      AST_close('ExportDefaultDeclaration');
    }
    else if (curc === $$STAR_2A) {
      // export * from "x"
      AST_open(astProp, 'ExportAllDeclaration');
      ASSERT_skipAny('*', lexerFlags);
      skipAnyOrDie($$F_66, 'from', lexerFlags);
      AST_setLiteral('source', curtok);
      skipRex(lexerFlags);
      AST_close('ExportAllDeclaration');
    } else {
      AST_open(astProp, 'ExportNamedDeclaration');
      AST_set('specifiers', []);
      if (curc === $$CURLY_L_7B) {
        AST_set('declaration', null);
        // export {}
        // export {} from "x"

        // We don't know whether we need to use the names for exportBindings/exportNames until we see the token after
        // the closing curly. If that's "from" then we don't use the list, otherwise we do. So collect the names in
        // arrays :'( and act accordingly after the fact.
        let tmpExportedNames = [];
        let tmpExportedBindings = [];
        parseExportObject(lexerFlags, tmpExportedNames, tmpExportedBindings);

        if (skipAnyIf('from', lexerFlags)) {
          // drop the tmp lists
          // TODO: what happens to dupe exported bindings or exported names here?
          if (hasNoFlag(curtype, $STRING)) THROW('Export source must be a string');
          AST_setLiteral('source', curtok);
          skipRex(lexerFlags);
        } else {
          AST_set('source', null);
          // pump the names in now
          for (let i=0,l=tmpExportedNames.length; i<l; ++i) addNameToExports(exportedNames, tmpExportedNames[i]);
          for (let i=0,l=tmpExportedBindings.length; i<l; ++i) addBindingToExports(exportedBindings, tmpExportedBindings[i]);
        }
      } else if (curc === $$V_76 && curtok.str === 'var') {
        // export var <bindings>
        ASSERT_skipAny('var' , lexerFlags); // TODO: optimize; next must be ident or destructuring [{ (even when keyword=let)
        parseAnyVarDecls(lexerFlags, scoop, BINDING_TYPE_VAR, FROM_EXPORT_DECL, SKIP_DUPE_CHECKS, exportedNames, exportedBindings, 'declaration');
        AST_set('source', null);
      } else if (curc === $$L_6C && curtok.str === 'let') {
        // export let <bindings>
        ASSERT_skipAny('let' , lexerFlags); // TODO: optimize; next must be ident or destructuring [{ (even when keyword=let)
        parseAnyVarDecls(lexerFlags, scoop, BINDING_TYPE_LET, FROM_EXPORT_DECL, SKIP_DUPE_CHECKS, exportedNames, exportedBindings, 'declaration');
        if (SCOPE_verifyLexical(lexerFlags, scoop)) THROW('Let export binding attempted to get at least one name bound twice or more');
        AST_set('source', null);
      } else if (curc === $$C_63) {
        if (curtok.str === 'const') {
          // export const <bindings>
          ASSERT_skipAny('const' , lexerFlags); // TODO: optimize; next must be ident or destructuring [{ (even when keyword=let)
          parseAnyVarDecls(lexerFlags, scoop, BINDING_TYPE_CONST, FROM_EXPORT_DECL, SKIP_DUPE_CHECKS, exportedNames, exportedBindings, 'declaration');
          if (SCOPE_verifyLexical(lexerFlags, scoop)) THROW('Const export binding attempted to get at least one name bound twice or more');
        } else if (curtok.str === 'class') {
          // export class ...
          let exportedName = parseClassDeclaration(lexerFlags, scoop, IDENT_REQUIRED, 'declaration');
          addNameToExports(exportedNames, exportedName);
          addBindingToExports(exportedBindings, exportedName);
          needsSemi = false;
        } else {
          THROW('Unknown export type [' + curtok.str +  '] (note: you can only export individual vars through `export {foo};)');
        }
        AST_set('source', null);
      } else if (curc === $$F_66 && curtok.str === 'function') {
        // export function f(){}
        // export function* f(){}
        // (anonymous should not be allowed but parsers seem to do it anyways)
        let exportedName = parseFunction(lexerFlags, scoop, IS_FUNC_DECL, NOT_FUNC_EXPR, NOT_ASYNC, IDENT_REQUIRED, NOT_FUNCTION_STATEMENT, 'declaration');
        addNameToExports(exportedNames, exportedName);
        addBindingToExports(exportedBindings, exportedName);
        AST_set('source', null);
        needsSemi = false;
      }
      else if (curc === $$A_61 && curtok.str === 'async') {
        // export async function f(){}
        // (note: no arrows here because we require a name)
        ASSERT_skipAny('async', lexerFlags);

        if (curtok.str !== 'function') {
          // `export async \n a => b`
          THROW('Can only export async functions (not arrows), did not find a function');
        }
        if (curtok.nl) {
          // `export async \n function(){}`
          THROW('Async can not be followed by a newline as it results in `export async;`, which is not valid (and probably not what you wanted)');
        }

        let exportedName = parseFunction(lexerFlags, scoop, IS_FUNC_DECL, NOT_FUNC_EXPR, WAS_ASYNC, IDENT_REQUIRED, NOT_FUNCTION_STATEMENT, 'declaration');
        addNameToExports(exportedNames, exportedName);
        addBindingToExports(exportedBindings, exportedName);
        AST_set('source', null);
        needsSemi = false;
      }
      else {
        // `export foo;`
        THROW('Unknown export type [' + curtok.str +  '] (note: you can only export individual vars through `export {'+curtok.str+'};`)');
      }
      AST_close('ExportNamedDeclaration');
    }

    if (needsSemi) {
      // function decls and classes do not need asi
      parseSemiOrAsi(lexerFlags);
    }
  }
  function addNameToExports(exportList, exportedName) {
    ASSERT(exportList !== DO_NOT_BIND, 'use UNDEF_EXPORTS not DO_NOT_BIND');
    if (exportList !== undefined && exportedName !== '') {
      let hashed = '#' + exportedName;
      if (exportList[hashed]) THROW('Tried to export the name `' + exportedName + '` twice');
      exportList[hashed] = 1;
    }
  }
  function addBindingToExports(exportList, exportedName) {
    ASSERT(exportList !== DO_NOT_BIND, 'use UNDEF_EXPORTS not DO_NOT_BIND');
    if (exportList !== undefined && exportedName !== '') {
      let hashed = '#' + exportedName;
      exportList[hashed] = 1;
    }
  }
  function parseExportObject(lexerFlags, tmpExportedNames, tmpExportedBindings) {
    ASSERT(parseExportObject.length === arguments.length, 'arg count');
    // import {...} from 'x'
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
    ASSERT_skipAny('{', lexerFlagsNoTemplate);
    while (curtype === $IDENT) {
      AST_open('specifiers', 'ExportSpecifier');
      let nameToken = curtok;
      // while the `nameToken` should be a valid non-keyword identifier, it also has to be bound and as such we
      // don't have to check it here since we already apply bind checks anyways and binding would apply this check
      AST_setIdent('local', nameToken);
      skipAny(lexerFlagsNoTemplate);
      if (curtype === $IDENT && curtok.str === 'as') { // `export {x as y}` NOT `export {x:y}`
        ASSERT_skipAny('as', lexerFlagsNoTemplate);
        if (curtype !== $IDENT) THROW('Can only use ident to indicate alias');
        // note: the exported _name_ can be any identifier, keywords included
        AST_setIdent('exported', curtok);
        tmpExportedNames.push(curtok.str);
        tmpExportedBindings.push(nameToken.str);
        skipAny(lexerFlagsNoTemplate);
      } else {
        AST_setIdent('exported', nameToken);
        tmpExportedNames.push(nameToken.str);
        tmpExportedBindings.push(nameToken.str);
      }
      if (curc === $$COMMA_2C) skipAny(lexerFlagsNoTemplate);
      else if (curc !== $$CURLY_R_7D) THROW('Unexpected token while parsing export object');
      AST_close('ExportSpecifier');
    }
    if (curtok.str !== '}') {
      $log('Error: Invalid export token: ' + curtok);
      if (curtok.str === '...') THROW('Export object cannot have spread');
      if (curtok.str === ':') THROW('Export object uses `as` to alias (`{a as y}`), not colon (`{a: y}`)');
      THROW('Export object can only have "shorthand" `{x}` or "as" `{x as y}');
    }
    skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlags);
  }

  function parseForStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseForStatement.length, 'arg count');

    /*
     for(Expression ; Expression ; Expression) Statement
     for(var VariableDeclarationList [=init] ; Expression ; Expression) Statement
     for(let VariableDeclarationList [=init] ; Expression ; Expression) Statement
     for(const VariableDeclarationList [=init] ; Expression ; Expression) Statement

     for(LeftHandSideExpression in Expression) Statement
     for(var identOrPattern in Expression) Statement
     for(let identOrPattern in Expression) Statement
     for(const identOrPattern in Expression) Statement

     for(LeftHandSideExpression of AssignmentExpression) Statement
     for(var identOrPattern of Expression) Statement
     for(let identOrPattern of Expression) Statement
     for(const identOrPattern of Expression) Statement
    */
    // we won't know what the for-type is until we get past a semi or `in` or `of`
    // we need to parse for a pseudo-regular expression (without `in` operator)
    // while searching for the marker (in, for, ;) to clarify the for-type.

    // what we can expect
    // - arbitrary expression(s)
    // - var, let, const declaration, possibly multiple, possibly with initializer

    // markers;
    // - semi (-> normal for)
    // - `of` at operator time (-> for-of)
    // - `in` at operator time (-> for-in)
    // - var initializer (-> normal for)
    // - more than one var declared (-> normal for)
    // - expression that cannot be a LeftHandSideExpression (-> normal for)

    // basically, parse for a LeftHandSideExpression. then the next token should
    // either be a binary (or even unary) operator (in, of, or anything else) or
    // a semi. we can then proceed parsing down that particular path.

    // the for-header adds a special lex scope because there are special let/const/var rules in place we need to verify
    scoop = SCOPE_addLexTo(scoop, FOR_SCOPE, 'parseForStatement(header)');

    ASSERT_skipAny('for', lexerFlags); // TODO: optimize; next must be `(` or `await`
    let awaitable = curtype === $IDENT && curtok.str === 'await';
    if (awaitable) {
      if (!allowAsyncGenerators) THROW('The `for await` syntax is not supported by the currently targeted language version');
      if (hasNoFlag(lexerFlags, LF_IN_ASYNC)) THROW('Can only use `for-await` inside an async function');
      ASSERT_skipAny('await', lexerFlags); // TODO: optimize; next must be `(`
    }
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags);
    parseForHeader(lexerFlags | LF_NO_ASI, scoop, awaitable, astProp);
    skipRexOrDieSingleChar($$PAREN_R_29, lexerFlags);
    parseNestedBodyPart(lexerFlags | LF_IN_ITERATION, scoop, {'##': 'for', '#': labelSet}, EXC_DECL, 'body');
    AST_close(['ForStatement', 'ForInStatement', 'ForOfStatement']);
  }
  function parseForHeader(lexerFlags, scoop, awaitable, astProp) {
    ASSERT(arguments.length === parseForHeader.length, 'arg count');

    // TODO: confirm we do this;
    // > It is a Syntax Error if IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
    // And https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-assignmenttargettype
    // clearly states the regular assignment itself is not a valid (so not a simple one either) assignment target
    // (This doesn't prevent a=b=c because assignments are right-associative)

    // first parse a simple expression and check whether it's assignable (var or prop)
    let assignable = 0;
    let destructible = MIGHT_DESTRUCT;
    let wasNotDecl = false;
    let emptyInit = false;
    let hadAssign = false;
    let mustBePlainLoop = false;
    catchforofhack = false;

    if (curtype === $IDENT) {
      // - `for (;;);`
      //         ^
      // - `for (x in y);`
      //         ^
      // - `for (x of y);`
      //         ^
      switch (curtok.str) {
        case 'var':
          // - `for (var x of y);`
          //         ^
          // - `for (var x;;);`
          ASSERT_skipAny('var' , lexerFlags); // TODO: optimize; next must be ident or destructuring [{
          parseAnyVarDecls(lexerFlags | LF_IN_FOR_LHS, scoop, BINDING_TYPE_VAR, FROM_FOR_HEADER, SKIP_DUPE_CHECKS, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
          // No need to dupe-check scope here
          assignable = initAssignable(assignable); // var decls are assignable
          break;

        case 'let':
          // - `for (let x of y);`
          //         ^
          // - `for (let x;;);`
          let letIdentToken = curtok;
          ASSERT_skipDiv('let', lexerFlags); // div; if let is varname then next token can be next line statement start and if that starts with forward slash it's a div

          // [v]: `for (let x of y);`
          //                ^
          if (curtype === $IDENT || curc === $$SQUARE_L_5B || curc === $$CURLY_L_7B) {
            // [v]: `for (let x of y);`
            //                ^
            // [v]: `for (let [x] in y);`
            //                ^
            // [v]: `for (let {x} of y);`
            //                ^
            // [x]: `for (let x of y);`
            // [x]: `for (let [x] in y);`
            // [x]: `for (let {x} of y);`
            // [v]: `for (let x;;);`
            // [v]: `for (let [x] = x;;);`
            // [v]: `for (let {x} = x;;);`
            if (curtok.str === 'in') {
              // Edge case makes `let` to be parsed as a var name in sloppy mode
              // [v]: `for (let in x)`
              if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
                // Except in strict mode...
                // [x]: `for (let in x)`
                THROW('Let binding missing binding names as `let` cannot be a var name in strict mode');
              }
              AST_setIdent(astProp, curtok);
              wasNotDecl = true;
            } else {
              // [v]: `for (let x of y);`
              //                ^
              parseAnyVarDecls(lexerFlags | LF_IN_FOR_LHS, scoop, BINDING_TYPE_LET, FROM_FOR_HEADER, CHECK_DUPE_BINDS, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
              if (SCOPE_verifyLexical(lexerFlags, scoop)) {
                // [x]: `for (let [x, x] of y);`
                THROW('Let for-binding attempted to get at least one name bound more than once');
              }
            }
            assignable = initAssignable(assignable); // decls are assignable (`let` as a var name should be as well)
          } else if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
            // In strict mode, `let` must be a keyword, and since we did not see a valid binding token, this is an error
            // [x]: `for (let.x in y);`
            //               ^
            // [x]: `for (let() of y);`
            //               ^
            // [x]: `for (let + of y);`
            THROW('Let binding missing binding names');
          } else {
            // In sloppy mode, `let` must now be a regular var name.
            wasNotDecl = true;
            // - The next token cannot be `[`, as that case has been taken care of above
            // - If is an error if this is a `for-of` as that case completely forbids `let` as var name
            // [v]: `for (let.x in y);`
            //               ^
            // [x]: `for (let() of y);`
            //               ^
            // [x]: `for (let[x] in y);`
            // [x]: `for (let[x] of y);`
            // [x]: `for (let[x];;);`
            // [x]: `for (let of y);`
            // [v]: `for (let;;);`
            // [x]: `for (let.x in y);`
            // [x]: `for (let.x of y);`
            // [v]: `for (let.x;;);`
            // [x]: `for (let + in y);`
            // [x]: `for (let + of y);`
            // [v]: `for (let + x;;);`
            // [x]: `for (let() in y);`
            // [x]: `for (let() of y);`
            // [v]: `for (let();;);`

            ASSERT(curtok.str !== '[', 'case handled above');
            ASSERT(curtok.str !== 'in', 'case handled above');

            if (curtok.str === 'of') {
              // [x]: `for (let of y);`
              THROW('A `for (let of ...)` is always illegal');
            } else if (curc === $$COMMA_2C) {
              // [x]: `for (let , x;;);`
              //                ^
              mustBePlainLoop = true;
              // Note: we are inside a for-header so we don't care about assignable or the await/yield flags here
              AST_setIdent(astProp, letIdentToken);
              _parseExpressions(lexerFlags, initNotAssignable(), astProp);
              assignable = NOT_ASSIGNABLE;
            } else if (curc !== $$SEMI_3B) {
              // [x]: `for(let.a of 0);`
              // [v]: `for (let.foo in x);`
              // [x]: `for (let() in x);`
              // [v]: `for (let().foo in x);`
              // [x]: `for (let.foo of x);`
              // [x]: `for (let() of x);`
              // [x]: `for (let().foo of x);`
              // [x]: `for (let=10;;);`
              // [v]: `for (let.foo;;);`
              // [v]: `for (let();;);`
              assignable = parseValueAfterIdent(lexerFlags, letIdentToken, BINDING_TYPE_NONE, ASSIGN_EXPR_IS_OK, astProp);
              if (curtok.str === 'of') {
                // [x]: `for (let.a of x);`
                THROW('Cannot use `let` as a var name on the left side in a `for-of` header');
              }
              if (notAssignable(assignable)) {
                // [v]: `for (let();;);`
                mustBePlainLoop = true;
              }
            } else {
              // [v]: `for (let;;);`
              //               ^
              AST_setIdent(astProp, letIdentToken);
              assignable = NOT_ASSIGNABLE;
            }
          }
          break;

        case 'const':
          // - `for (const x of y);`
          //         ^
          // - `for (const x;;);`
          ASSERT_skipAny('const' , lexerFlags); // TODO: optimize; next must be ident or destructuring [{
          parseAnyVarDecls(lexerFlags | LF_IN_FOR_LHS, scoop, BINDING_TYPE_CONST, FROM_FOR_HEADER, SKIP_DUPE_CHECKS, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
          if (SCOPE_verifyLexical(lexerFlags, scoop)) THROW('Const for-binding attempted to get at least one name bound more than once');
          assignable = initAssignable(assignable); // const decl is assignable
          break;

        default:
          ASSERT(curtype === $IDENT, 'should be ident');
          // TODO: ASSIGN_EXPR_IS_OK might have to be error
          // - `for (b↵++c;;);`
          // - `for (a=>b;;);`
          // - `for (a=>b in c);`    // error
          // - `for (a=>b in c);`    // error
          // TODO: we can do parseValue here. the hadAssign is never true because these funcs dont parse ops. (not even for patterns?)
          assignable = parseValueHeadBodyIdent(lexerFlags | LF_IN_FOR_LHS, NOT_NEW_ARG, BINDING_TYPE_NONE, ASSIGN_EXPR_IS_OK, astProp);
          hadAssign = curc === $$IS_3D && curtok.str === '=';
          assignable = parseValueTail(lexerFlags | LF_IN_FOR_LHS, assignable, NOT_NEW_ARG, astProp);
          wasNotDecl = true;
      }
    }
    else if (curc === $$SEMI_3B) {
      // - `for (;;);`
      if (awaitable) {
        // - `for await (;;);`
        THROW('for await only accepts the `for-of` type');
      }
      emptyInit = true;
      wasNotDecl = true;
      ASSERT(assignable = initAssignable(assignable)); // prevent assertion error, otherwise irrelevant
    }
    else if (curc === $$CURLY_L_7B) {
      // for-in, for-of, for-await
      // - `for ({}.x in y);`
      // - `for ({}.x);`                 // bad
      // - `for ({} in y);`
      // - `for ({} = y in y);`
      // - `for ({x} = y in z);`
      // - `for ({x} = y of z);`
      // - `for ({x} = y);`              // bad
      // - `for ({x} = y;;);`
      // - `for ({x};;);`
      // - `for ({x}.y in z);`

      wasNotDecl = true;

      destructible = parseObjectOuter(lexerFlags | LF_IN_FOR_LHS, scoop, BINDING_TYPE_NONE, SKIP_INIT, NOT_CLASS_METHOD, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
      assignable = parsePatternTailInForHeader(lexerFlags, assignable, destructible, awaitable, astProp);
    }
    else if (curc === $$SQUARE_L_5B) {
      // for-in, for-of, for-await
      // - `for ([].x in y);`
      // - `for ([].x);`                 // bad
      // - `for ([] in y);`
      // - `for ([] = y in y);`
      // - `for ([x] = y in z);`
      // - `for ([x] = y of z);`
      // - `for ([x] = y);`              // bad
      // - `for ([x] = y;;);`
      // - `for ([x];;);`
      // - `for ([x].y in z);`

      wasNotDecl = true;

      destructible = parseArrayOuter(lexerFlags | LF_IN_FOR_LHS, scoop, BINDING_TYPE_NONE, SKIP_INIT, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
      assignable = parsePatternTailInForHeader(lexerFlags, assignable, destructible, awaitable, astProp);
    }
    else {
      // If the LHS is an object or array then it must cover an AssignmentPattern. In this case it may have an
      // initializer for any of its part or the lhs as a while (so `for ([]=1 in x);` is valid). There are tests.
      // The lhs of a `for-in` or `for-of` must be an obj/array assignment pattern, or otherwise a simple assignment
      // target (meaning it must end with a property, which may be a dynamic prop). For regular `for-loop` anything ok.

      // for-in, for-of, for-await
      // - `for (1`
      // - `for ("foo"`
      // - `for (/foo/`
      // - `for ("foo";;);`
      // - `for ("foo" in y);`            // bad
      // - `for ("foo".x in y);`
      // - `for ("foo".x = z in y);`      // bad
      // - `for (()=>x in y);`            // bad (`in` becomes part of the arrow)
      // - `for (()=>(x) in y);`          // bad
      // - `for ((()=>x) in y);`          // bad (?)

      assignable = parseValue(lexerFlags | LF_IN_FOR_LHS, ASSIGN_EXPR_IS_OK, NOT_NEW_ARG, astProp);
      hadAssign = curc === $$IS_3D && curtok.str === '=';
      wasNotDecl = true;
    }

    ASSERT(assignable !== 0, 'every branch should update assignable');

    // in all cases either; parse a var, let, const, or assignment expression
    // there can be multiple vars and inits
    // for-in and for-of can only have one var without inits (invalidate after)

    // - `for (x of y);`
    //           ^
    // - `for (x in y);`
    //           ^
    // - `for (x;;);`
    //          ^

    if (curtype === $IDENT) {
      if (curtok.str === 'of') {
        if (catchforofhack) THROW('Encountered `var` declaration for a name used in catch binding which in web compat mode is still not allowed in a `for-of`');
        if (hadAssign) THROW('The lhs of a `for-of` cannot have an assignment');
        if (mustBePlainLoop) THROW('The lhs contained something that is not allowed with `for-of` loops');
        AST_wrapClosed(astProp, 'ForOfStatement', 'left');
        if (notAssignable(assignable)) THROW('Left part of for-of must be assignable');
        ASSERT_skipRex('of', lexerFlags);
        // `for (a of b=c) ..`
        // Note that this rhs is an AssignmentExpression, _not_ a SequenceExpression
        parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
        AST_set('await', !!awaitable); // as per https://github.com/estree/estree/pull/138
        return;
      }
      if (awaitable) THROW('`for await` only accepts the `for-of` type');
      if (curtok.str === 'in') {
        if (hadAssign) THROW('The lhs of a `for-in` cannot have an assignment');
        if (mustBePlainLoop) THROW('The lhs contained something that is not allowed with `for-in` loops');
        AST_wrapClosed(astProp, 'ForInStatement', 'left');
        if (notAssignable(assignable)) {
          // certain cases were possible in legacy mode
          // if (options_webCompat === WEB_COMPAT_ON && hasNoFlag(lexerFlags, LF_STRICT_MODE)) {
          //   // TODO: do we need to verify these patterns first...? or is any assignment okay here
          // } else {
            THROW('Left part of for-in must be assignable');
          // }
        }
        ASSERT_skipRex('in', lexerFlags);
        // `for (a in b=c) ..`
        parseExpressions(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
        return;
      }

      // [x]: `for (let of x) y`
      //                   ^
      // [x]: `function *f(){ for (yield of obj); }`
      //                                    ^
      THROW('Unexpected input while parsing the left side of a for-header');
    } else if (awaitable) {
      THROW('for await only accepts the `for-of` type');
    } else {
      // [v]: `for (;;);`
    }

    if (emptyInit) {
      AST_open(astProp, 'ForStatement');
      AST_set('init', null);
    } else {
      AST_wrapClosed(astProp, 'ForStatement', 'init');
      // we are still in the `init` part of a classic for. keep parsing _with_ LF_IN_FOR_LHS from the current expression value.
      if (wasNotDecl) {
        // [v]: `for (a+b;;) c;`
        //             ^
        // [x]: `for (a+b in c) d;`
        // [x]: `for (a+b of c) d;`
        parseExpressionFromOp(lexerFlags | LF_IN_FOR_LHS, assignable, 'init');
      }
    }

    let hadComma = curc === $$COMMA_2C;
    if (hadComma) {
      // - `for (a, b;;);`
      //          ^
      // - `for (a, b in c);`
      // - `for (a, b of c);`
      _parseExpressions(lexerFlags | LF_IN_FOR_LHS, initNotAssignable(), 'init');
    }

    if (curc !== $$SEMI_3B && hadComma && (curtok.str === 'of' || curtok.str === 'in')) {
      // note: `x in y` is valid so `for(a,x in y)` will parse up to the `)`. since `of` is not an op it stops at `of`.
      // [x]: `for (a,b of c) d;`
      THROW('Comma not allowed in left side of `for-in`/`for-of` header');
    }

    if (hasAllFlags(destructible, MUST_DESTRUCT)) {
      // - `for ({a=b};;);`
      THROW('Cannot use lhs as regular for-loop because it must destruct');
    }

    skipRexOrDieSingleChar($$SEMI_3B, lexerFlags);

    if (curc === $$SEMI_3B) {
      AST_set('test', null);
    } else {
      parseExpressions(lexerFlags, ASSIGN_EXPR_IS_OK, 'test');
    }

    skipRexOrDieSingleChar($$SEMI_3B, lexerFlags);

    if (curc === $$PAREN_R_29) {
      AST_set('update', null);
    } else {
      parseExpressions(lexerFlags, ASSIGN_EXPR_IS_OK, 'update');
    }
  }
  function parsePatternTailInForHeader(lexerFlags, assignable, destructible, awaitable, astProp) {
    ASSERT(parsePatternTailInForHeader.length == arguments.length, 'arg count');

    assignable = hasAnyFlag(destructible, CANT_DESTRUCT) ? NOT_ASSIGNABLE : IS_ASSIGNABLE;

    // - `for ({}`
    //           ^
    // - `for ([]`
    //           ^
    // - `for ([].foo in`
    //           ^
    // - `for ([] in x`
    //            ^
    // Unnecessary overhead most of the time but it makes certain edge cases just easier to deal with
    assignable = parseValueTail(lexerFlags | LF_IN_FOR_LHS, assignable, NOT_NEW_ARG, astProp);

    // - `for ([].foo in x);`
    //                ^
    // - `for ([] in x);`
    //            ^
    // - `for ([] = x in x);`
    //            ^
    // - `for ([] of x);`
    // - `for ([] ;;);`

    if (curc === $$SEMI_3B) {
      // - `for ({a};;);`
      // - `for ([a];;);`
      if (awaitable) {
        // - `for await ({a};;);`
        // - `for await ([a];;);`
        THROW('Can not use `for-await` with a regular `for` loop, only `for-of`');
      }
    }
    else if (curtok.str === 'in') {
      // - `for ({} in y);`
      // - `for ({} = y in y);`
      // - `for ({x} = y in z);`
      // - `for ({x} = y of z);`
      // - `for ([] in y);`
      // - `for ([] = y in y);`
      // - `for ([x] = y in z);`
      // - `for ([x] = y of z);`

      if (awaitable) THROW('Can not use `for-await` with a `for-in`, only `for-of`');

      // TODO: are yield/await relevant here?
      if (notAssignable(assignable)) THROW('The for-header lhs binding pattern is not destructible');
      AST_destruct(astProp);
    }
    else if (curtok.str === 'of') {
      // - `for ({} on y);`
      // - `for ({} = y on y);`
      // - `for ({x} = y on z);`
      // - `for ({x} = y of z);`
      // - `for await ({} on y);`
      // - `for await ({} = y on y);`
      // - `for await ({x} = y on z);`
      // - `for await ({x} = y of z);`
      // - `for ([] in y);`
      // - `for ([] = y in y);`
      // - `for ([x] = y in z);`
      // - `for ([x] = y of z);`

      // TODO: are yield/await relevant here?
      if (notAssignable(assignable)) THROW('The for-header lhs binding pattern is not destructible');
      AST_destruct(astProp);
    } else if (curtok.str === '=') {
      // This can be fine if inside a regular `for-loop`. Only if we see `in` or `of` before the `;` are we in trouble.
      parseExpressionFromOp(lexerFlags| LF_IN_FOR_LHS, assignable, astProp);
      if (curc === $$SEMI_3B) {
        // This is fiiiine
        // - `for ([] = x ;;);`
        // - `for ({} = x ;;);`
      } else if (curtok.str === 'in' || curtok.str === 'of') {
        // - `for ([] = x in y);`
        // - `for ({} = x of y);`
        // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements-static-semantics-early-errors
        // > It is a Syntax Error if LeftHandSideExpression is either an ObjectLiteral or an ArrayLiteral and if LeftHandSideExpression is not covering an AssignmentPattern.
        // This means, IF the lhs is an object, THEN it must also cover a Pattern. It does not say the lhs can be any
        // Pattern. The important distinction is that if it could be any Pattern, then it could have a "top level"
        // initialiser. But as the wording stands, it may be a Pattern if and only if it would match an object or array
        // literal as a whole. And `[] = x` would be an assignment, not an obj/arr literal. So it is an error.
        THROW('The left side of a `for-of` and `for-in` can not be an assignment, even if it is a BindingPattern');
      } else {
        // End of the expression before finding `in`, `of`, or a semi colon.
        // - `for ([] = x);`
        THROW('Unknown input followed the left side of a for loop header after assignment: ' + curtok);
      }
    }
    else {
      // - `for ({});`
      // - `for ([]);`
      THROW('Unknown input followed the left side of a for loop header: ' + curtok);
    }

    return assignable;
  }

  function parseIfStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseIfStatement.length, 'arg count');

    AST_open(astProp, 'IfStatement');

    // TODO: > "It is a Syntax Error if IsLabelledFunction(Statement) is true."
    // TODO: > "It is only necessary to apply this rule if the extension specified in B.3.2 is implemented."

    // TODO: > "Each else for which the choice of associated if is ambiguous shall be associated with the
    // TODO:    nearest possible if that would otherwise have no corresponding else."

    ASSERT_skipAny('if', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseNestedBodyPart(lexerFlags | LF_CAN_FUNC_STMT, scoop, {'#':labelSet}, EXC_DECL, 'consequent');
    if (curtype === $IDENT && curtok.str === 'else') {
      ASSERT_skipRex('else', lexerFlags);
      parseNestedBodyPart(lexerFlags | LF_CAN_FUNC_STMT, scoop, {'#':labelSet}, EXC_DECL, 'alternate');
    } else {
      AST_set('alternate', null);
    }
    AST_close('IfStatement');
  }

  function parseImportDeclaration(lexerFlags, scoop, astProp) {
    ASSERT(parseImportDeclaration.length === arguments.length, 'arg count');
    // https://tc39.github.io/ecma262/#sec-imports
    // import 'x'
    // import * as y from 'x'
    // import x from 'x'
    // import x, * as z from 'x'
    // import {} from 'x'
    // import {a} from 'x'
    // import {a as b} from 'x'
    // import {a,b} from 'x'
    // import {a as c,b} from 'x'
    // import {a,b,} from 'x'
    // import x, {...} from 'x'
    // (cannot create a var named `yield` or `await` or `let` this way)

    if (goalMode !== GOAL_MODULE) THROW('The `import` keyword can only be used with the module goal');
    if (hasNoFlag(lexerFlags, LF_IN_GLOBAL)) THROW('The `import` keyword is only supported at the top level'); // TODO: import()
    if (hasNoFlag(lexerFlags, LF_IN_SCOPE_ROOT)) THROW('The `import` keyword can not be nested in another statement'); // TODO: import()

    ASSERT_skipAny('import', lexerFlags);

    AST_open(astProp, 'ImportDeclaration');
    AST_set('specifiers', []);

    if (curtype === $IDENT) {
      // import x from 'x'
      // import x, * as z from 'x'
      // import x, {...} from 'x'
      parseImportDefault(lexerFlags, scoop);
      if (curc === $$COMMA_2C) {
        // import x, * as z from 'x'
        // import x, {...} from 'x'
        ASSERT_skipAny(',', lexerFlags);
        if (curc === $$STAR_2A) {
          // import x, * as z from 'x'
          parseImportNamespace(lexerFlags, scoop);
        } else if (curc === $$CURLY_L_7B) {
          // import x, {...} from 'x'
          parseImportObject(lexerFlags, scoop);
        } else {
          THROW('Can only import star or object after default');
        }
      } else if (curtok.str !== 'from') {
        THROW('Missing export source');
      } else {
        // import x from 'x'
        ASSERT_skipAny('from', lexerFlags);
      }
    } else if (curc === $$STAR_2A) {
      // import * as y from 'x'
      parseImportNamespace(lexerFlags, scoop);
    } else if (curc === $$CURLY_L_7B) {
      // import {} from 'x'
      // import {a} from 'x'
      // import {a as b} from 'x'
      // import {a,b} from 'x'
      // import {a as c,b} from 'x'
      // import {a,b,} from 'x'
      parseImportObject(lexerFlags, scoop);
    }

    // `import 'foo'` is valid but otherwise this is an error
    if (hasNoFlag(curtype, $STRING)) THROW('Export source must be string');

    AST_setLiteral('source', curtok);
    skipRex(lexerFlags);

    AST_close('ImportDeclaration');

    parseSemiOrAsi(lexerFlags);
  }
  function parseImportDefault(lexerFlags, scoop) {
    ASSERT(parseImportDefault.length === arguments.length, 'arg count');

    // this is the `x` in;
    // `import x[ as y][, * as m | , {...}] from 'z'`
    AST_open('specifiers', 'ImportDefaultSpecifier');
    AST_setIdent('local', curtok);
    fatalBindingIdentCheck(curtok, BINDING_TYPE_CONST, lexerFlags);
    SCOPE_addBindingAndDedupe(lexerFlags, scoop, curtok.str, BINDING_TYPE_CONST, ORIGIN_NOT_VAR_DECL);
    ASSERT_skipAny($IDENT, lexerFlags); // next must be `as` comma or `from`
    AST_close('ImportDefaultSpecifier');
  }
  function parseImportObject(lexerFlags, scoop) {
    ASSERT(parseImportObject.length === arguments.length, 'arg count');

    // import {...} from 'x'
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
    ASSERT_skipAny('{', lexerFlagsNoTemplate);
    while (curtype === $IDENT) {
      AST_open('specifiers', 'ImportSpecifier');

      let nameToken = curtok;
      AST_setIdent('imported', nameToken);
      skipAny(lexerFlagsNoTemplate);

      // https://tc39.github.io/ecma262/#sec-createimportbinding
      // The concrete Environment Record method CreateImportBinding for module Environment Records creates a new initialized
      // immutable indirect binding for the name N. A binding must not already exist in this Environment Record for N.

      if (curtok.str === 'as') {
        ASSERT_skipAny('as', lexerFlagsNoTemplate);
        if (curtype !== $IDENT) THROW('Alias must be an ident');
        AST_setIdent('local', curtok);
        fatalBindingIdentCheck(curtok, BINDING_TYPE_CONST, lexerFlags);
        SCOPE_addBindingAndDedupe(lexerFlagsNoTemplate, scoop, curtok.str, BINDING_TYPE_CONST, ORIGIN_NOT_VAR_DECL);
        skipAny(lexerFlagsNoTemplate);
      } else {
        fatalBindingIdentCheck(nameToken, BINDING_TYPE_CONST, lexerFlags);
        SCOPE_addBindingAndDedupe(lexerFlagsNoTemplate, scoop, nameToken.str, BINDING_TYPE_CONST, ORIGIN_NOT_VAR_DECL);
        AST_setIdent('local', nameToken);
      }

      if (curc === $$COMMA_2C) ASSERT_skipAny(',', lexerFlagsNoTemplate);
      else if (curc !== $$CURLY_R_7D) THROW('Unexpected character while parsing export object');
      AST_close('ImportSpecifier');
    }
    skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlagsNoTemplate);

    if (curtok.str !== 'from') THROW('Missing export source');
    ASSERT_skipAny('from', lexerFlags);
  }
  function parseImportNamespace(lexerFlags, scoop) {
    ASSERT(parseImportNamespace.length === arguments.length, 'arg count');

    // import * as x from 'y'
    ASSERT_skipAny('*', lexerFlags);
    skipAnyOrDie($$A_61, 'as', lexerFlags);

    AST_open('specifiers', 'ImportNamespaceSpecifier');

    AST_setIdent('local', curtok);
    fatalBindingIdentCheck(curtok, BINDING_TYPE_CONST, lexerFlags);
    SCOPE_addBindingAndDedupe(lexerFlags, scoop, curtok.str, BINDING_TYPE_CONST, ORIGIN_NOT_VAR_DECL);
    ASSERT_skipAny($IDENT, lexerFlags); // next must be `as` comma or `from`
    AST_close('ImportNamespaceSpecifier');

    if (curtok.str !== 'from') THROW('Missing export source');
    ASSERT_skipAny('from', lexerFlags);
  }

  function parseLetDeclaration(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseLetDeclaration.length, 'arg count');

    let identToken = curtok;
    ASSERT(identToken.str === 'let', 'should pass on the let token');

    // next token is ident, {, or [ in most cases. In sloppy mode it can also be any valid value tail, operator, and ASI-able.
    ASSERT_skipDiv('let', lexerFlags); // in `let/foo/g` the `/` is always a division, so parse div

    // parsing `let` as a declaration if the next token is an ident, `[`, or `{`
    if (curtype === $IDENT || curc === $$SQUARE_L_5B || curc === $$CURLY_L_7B) {
      // let declaration

      parseAnyVarDecls(lexerFlags, scoop, BINDING_TYPE_LET, FROM_STATEMENT_START, SKIP_DUPE_CHECKS, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
      if (SCOPE_verifyLexical(lexerFlags, scoop)) THROW('Let binding attempted to get at least one name bound more than once');
      parseSemiOrAsi(lexerFlags);
    } else if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
      THROW('Let declaration missing binding names and `let` cannot be a regular var name in strict mode');
    } else {
      // let expression statement
      _parseLetAsPlainVarNameExpressionStatement(lexerFlags, scoop, labelSet, identToken, astProp);
    }
  }
  function parseLetExpressionStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseLetExpressionStatement.length, 'arg count');

    let identToken = curtok;
    ASSERT(identToken.str === 'let', 'should pass on the let token');

    // next token is ident, {, or [ in most cases. In sloppy mode it can also be any valid value tail, operator, and ASI-able.
    ASSERT_skipDiv('let', lexerFlags); // in `let/foo/g` the `/` is always a division, so parse div

    // parsing `let` as an expression
    if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
      THROW('`let` declaration not allowed here and `let` cannot be a regular var name in strict mode');
    } else if (curc === $$SQUARE_L_5B && curtok.nl) {
      // `let \n [` is a restricted production at the start of a statement (and only then)
      // This means that `let [` can not be the start of an ExpressionStatement (which is what we'd be parsing here)
      THROW('Must parse expression statement here but that is not allowed to start with `let [` which we just parsed');
    } else {
      // let expression statement
      _parseLetAsPlainVarNameExpressionStatement(lexerFlags, scoop, labelSet, identToken, astProp);
    }
  }
  function _parseLetAsPlainVarNameExpressionStatement(lexerFlags, scoop, labelSet, identToken, astProp) {
    ASSERT(_parseLetAsPlainVarNameExpressionStatement.length === arguments.length, 'arg count');
    ASSERT(identToken.str === 'let', 'should pass on the let token');
    ASSERT(identToken !== curtok, 'the `let` token should have been skipped');
    ASSERT(hasNoFlag(lexerFlags, LF_STRICT_MODE), 'sloppy mode should be asserted at call site');
    if (curtype === $EOF) {
      AST_open(astProp, 'ExpressionStatement');
      AST_setIdent('expression', identToken);
      AST_close('ExpressionStatement');
    } else {
      if (curc === $$COLON_3A) return parseLabeledStatementInstead(lexerFlags, scoop, labelSet, identToken, astProp);

      AST_open(astProp, 'ExpressionStatement');
      parseExpressionAfterPlainVarName(lexerFlags, identToken, ASSIGN_EXPR_IS_OK, 'expression');
      if (curc === $$COMMA_2C) {
        // Don't care about assignable await/yield flags
        _parseExpressions(lexerFlags, initNotAssignable(), 'expression');
      }
      AST_close('ExpressionStatement');
    }
    parseSemiOrAsi(lexerFlags);
  }

  function parseReturnStatement(lexerFlags, astProp) {
    if (!allowGlobalReturn && hasAllFlags(lexerFlags, LF_IN_GLOBAL)) THROW('Not configured to parse `return` statement in global, bailing');

    AST_open(astProp, 'ReturnStatement');
    ASSERT_skipRex('return', lexerFlags);

    if (!curtok.nl && curtype !== $EOF && curc !== $$SEMI_3B && curc !== $$CURLY_R_7D) {
      parseExpressions(lexerFlags, ASSIGN_EXPR_IS_OK, 'argument');
    } else {
      AST_set('argument', null);
    }

    parseSemiOrAsi(lexerFlags);

    AST_close('ReturnStatement');
  }

  function parseSwitchStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseSwitchStatement.length, 'arg count');

    AST_open(astProp, 'SwitchStatement');
    ASSERT_skipAny('switch', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'discriminant');
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE); // TODO: in what valid case is this relevant? switch cant appear directly in a template
    skipAnyOrDieSingleChar($$CURLY_L_7B, lexerFlagsNoTemplate); // TODO: optimize; next must be `case` or `default` or `}`
    AST_set('cases', []);

    parseSwitchCases(lexerFlagsNoTemplate | LF_IN_SWITCH, SCOPE_addLexTo(scoop, SWITCH_SCOPE, 'parseSwitchStatement'), labelSet, 'cases');

    skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    AST_close('SwitchStatement');
  }
  function parseSwitchCases(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseSwitchCases.length, 'arg count');

    let hadDefault = false;
    while (true) {
      if (curtok.str === 'case') {
        AST_open(astProp, 'SwitchCase');
        ASSERT_skipRex('case', lexerFlags);
        parseExpressions(lexerFlags, ASSIGN_EXPR_IS_OK, 'test');
        AST_set('consequent', []);
        if (curc !== $$COLON_3A) THROW('Missing colon after case expr');
        ASSERT_skipRex(':', lexerFlags);
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) {
          parseNestedBodyPart(lexerFlags, scoop, {'#':labelSet}, INC_DECL, 'consequent');
        }
        AST_close('SwitchCase');
      } else if (curtok.str === 'default') {
        if (hadDefault) THROW('Found second `default` in same switch');
        hadDefault = true;
        AST_open(astProp, 'SwitchCase');
        ASSERT_skipAny('default', lexerFlags); // TODO: optimize; next must be :
        if (curc !== $$COLON_3A) THROW('Missing colon after default');
        ASSERT_skipRex(':', lexerFlags);
        AST_set('test', null);
        AST_set('consequent', []);
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) {
          parseNestedBodyPart(lexerFlags, scoop, {'#': labelSet}, INC_DECL, 'consequent');
        }
        AST_close('SwitchCase');
      } else {
        break;
      }
    }
  }

  function parseThrowStatement(lexerFlags, astProp) {
    AST_open(astProp, 'ThrowStatement');
    ASSERT_skipRex('throw', lexerFlags);
    if (curtok.nl) THROW('Premature newline');
    parseExpressions(lexerFlags, ASSIGN_EXPR_IS_OK, 'argument'); // mandatory1
    parseSemiOrAsi(lexerFlags);
    AST_close('ThrowStatement');
  }

  function parseTryStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseTryStatement.length, 'arg count');

    AST_open(astProp, 'TryStatement');

    let hasEither = false;

    ASSERT_skipAny('try', lexerFlags); // TODO: optimize; next must be {
    parseBlockStatement(lexerFlags, SCOPE_addLexTo(scoop, BLOCK_SCOPE, 'parseTryStatement(try)'), {'#':labelSet}, IS_STATEMENT, IGNORE_DIRECTIVES, IGNORE_DIRECTIVES, INC_DECL, 'block');

    if (curc === $$C_63 && curtok.str === 'catch') {
      // parseCatch
      hasEither = true;
      AST_open('handler', 'CatchClause');
      ASSERT_skipAny('catch', lexerFlags); // TODO: optimize; next must be (
      skipAnyOrDieSingleChar($$PAREN_L_28, lexerFlags); // TODO: optimize; next MUST be one arg (ident/destructuring)

      // record the catch var in its own scope record, we'll then move the args record to be a lexical scope level (hackish)
      let catchHeadScoop = SCOPE_addLexTo(scoop, CATCH_SCOPE, 'parseTryStatement(catch-var)');

      if (curc === $$PAREN_R_29) THROW('Missing catch clause parameter');
      // catch clause cannot have a default
      // catch clause can be written to, cannot already be declared, so it's like a `let` binding
      // there's an explicit rule disallowing lexical bindings with same name as catch var so just record it as lex
      parseBinding(lexerFlags | LF_NO_ASI, catchHeadScoop, BINDING_TYPE_ARG, FROM_CATCH, ASSIGNMENT_IS_DEFAULT, SKIP_DUPE_CHECKS, UNDEF_EXPORTS, UNDEF_EXPORTS, 'param');

      // destructuring requires manual checks so do this now for the catch var
      if (SCOPE_verifyLexical(lexerFlags, catchHeadScoop, true)) THROW('Catch binding had at least one duplicate name bound');

      // create a scope for the catch body. this way var decls can search for the catch scope to assert new vars
      let catchBodyScoop = SCOPE_addLexTo(catchHeadScoop, BLOCK_SCOPE, 'parseTryStatement(catch-body)');

      if (curc === $$COMMA_2C) THROW('Catch clause requires exactly one parameter, not more (and no trailing comma)');
      if (curc === $$IS_3D && curtok.str === '=') THROW('Catch clause parameter does not support default values');
      skipAnyOrDieSingleChar($$PAREN_R_29, lexerFlags); // TODO: optimize; next must be {
      parseBlockStatement(lexerFlags, catchBodyScoop, {'#':labelSet}, IS_STATEMENT, IGNORE_DIRECTIVES, IGNORE_DIRECTIVES, INC_DECL, 'body');
      AST_close('CatchClause');
    } else {
      AST_set('handler', null);
    }

    if (curc === $$F_66 && curtok.str === 'finally') {
      // parseFinally
      hasEither = true;
      ASSERT_skipAny('finally', lexerFlags); // TODO: optimize; next must be {
      parseBlockStatement(lexerFlags, SCOPE_addLexTo(scoop, BLOCK_SCOPE, 'parseTryStatement(finally)'), {'#':labelSet}, IS_STATEMENT, IGNORE_DIRECTIVES, IGNORE_DIRECTIVES, INC_DECL, 'finalizer');
    } else {
      AST_set('finalizer', null);
    }

    AST_close('TryStatement');

    if (!hasEither) THROW('Try must have catch or finally');
  }

  function parseVarStatement(lexerFlags, scoop, astProp) {
    ASSERT_skipAny('var', lexerFlags); // next is ident, [, or {
    parseAnyVarDecls(lexerFlags, scoop, BINDING_TYPE_VAR, FROM_STATEMENT_START, SKIP_DUPE_CHECKS, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
    parseSemiOrAsi(lexerFlags);
  }

  function parseWhileStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseWhileStatement.length, 'arg count');

    AST_open(astProp, 'WhileStatement');
    ASSERT_skipAny('while', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseNestedBodyPart(lexerFlags | LF_IN_ITERATION, scoop, {'##': 'while', '#': labelSet}, EXC_DECL, 'body');
    AST_close('WhileStatement');
  }

  function parseIdentLabelOrExpressionStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(parseIdentLabelOrExpressionStatement.length === arguments.length, 'arg count');
    ASSERT(curtype === $IDENT, 'should not have consumed the ident yet', debug_toktype(curtype));
    ASSERT(typeof astProp === 'string', 'should be string');
    // ok we get a statement
    // the statement starts with an identifier that is not a statement
    // the identifier could potentially be a label (even if that's a sloppy mode only thing we still need to be able to support it)
    // the actual identifier is the deciding factor in what to do when the next character is a forward slash; division or regular expression:
    //  - new: regex
    //  - await/yield: regex
    //  - delete/typeof/void: regex
    //  - class/function/async: error
    //  - true/false/null/this/super: division
    //  - idents determined to be regular var names: division
    //  - (anything else should be added to this list)
    // however, we also need to get the next token to check for the colon to determine the label path

    // note: this node may be replaced by a label node but we can't know that here without backtracking
    let identToken = curtok;

    // TODO: in most of the cases below where it leads to a label an error "keyword label" should be thrown immediately

    ASSERT(curtok.str !== 'function', 'function ident is already checked before this func');

    // For the sake of simplicity, and because this function should not hit very frequently, we'll take the slow path
    skipIdentSafeSlowAndExpensive(lexerFlags);

    if (curc === $$COLON_3A) {
      // Ident to be verified not to be reserved in the label parser
      return parseLabeledStatementInstead(lexerFlags, scoop, labelSet, identToken, astProp);
    }

    AST_open(astProp, 'ExpressionStatement');
    parseExpressionsAfterIdent(lexerFlags, identToken, ASSIGN_EXPR_IS_OK, 'expression');
    AST_close('ExpressionStatement');
    parseSemiOrAsi(lexerFlags);
  }
  function parseDeleteExpression(lexerFlags, inputAssignable, astProp) {
    AST_open(astProp, 'UnaryExpression');
    AST_set('operator', 'delete');
    AST_set('prefix', true);
    let assignable = 0;
    if (curtype === $IDENT) {
      assignable = parseDeleteIdent(lexerFlags, astProp);
    } else if (curc === $$PAREN_L_28) {
      // This case has to be confirmed not to just wrap an ident in parens
      // `delete (foo)`
      // `delete ((foo).x)`
      // `delete ((((foo))).x)`
      // `delete (a, b).c`
      assignable = parseDeleteParenSpecialCase(lexerFlags, 'argument');
    } else {
      // - `delete "x".y`
      // - `delete [].x`
      // - `delete yield x`     // error; arg must be "unaryexpression", which does not subset assignmentexpression
      // - `delete await x`     // ok? not sure if early error actually (TODO)
      assignable = parseValue(lexerFlags, ASSIGN_EXPR_IS_ERROR, NOT_NEW_ARG, 'argument');
    }
    AST_close('UnaryExpression');
    if (curtok.str === '**') {
      THROW('The lhs of ** can not be this kind of unary expression (syntactically not allowed, you have to wrap something)');
    }
    ASSERT(assignable !== 0, 'every branch should update this');
    // Make sure to propagate the input- and found await/yield flags
    return setNotAssignable(assignable | inputAssignable);
  }
  function parseDeleteParenSpecialCase(lexerFlags, astProp){
    // This parser has to confirm whether or not the `delete` is only on an ident wrapped with any number of parens.
    // While still properly parsing the whole thing, of course.

    // some cases to consider;
    // - `delete (foo)`
    // - `delete ((foo).x)`
    // - `delete ((((foo))).x)`
    // - `delete (a, b).c`
    // - `delete ((a)=>b)`
    // - `delete (((a)=>b).x)`
    // - `delete (((a)=b).x)`
    // - `delete ((true)=x)`               -- assignability of the ident is relevant
    // - `delete ((((true)))=x)`           -- consider that it may be a few recursive calls down
    // - `delete true.__proto__.foo`       -- and technically it could work so we can't just throw
    // - `delete (a[await x])`
    // - `delete ((((a)))[await x])`

    ASSERT(curc === $$PAREN_L_28, 'this is why we are here');

    let parens = 0;
    lexerFlags |= LF_NO_ASI; // cannot asi inside `delete (...)`
    do {
      ++parens;
      ASSERT_skipRex('(', lexerFlags); // `delete (/x/.y)`, for bonus points
    } while (curc === $$PAREN_L_28);
    // Now parse a group and pass it a special flag that changes the semantics of the return value
    // It's an ugly hack :( all caused by `delete ((((a, b) => c).d))` being hard to custom parse

    let assignableOrJustIdent = _parseGroupToplevels(
      lexerFlags,
      IS_EXPRESSION,
      parens === 1 ? ASSIGN_EXPR_IS_ERROR : ASSIGN_EXPR_IS_OK,
      IS_DELETE_ARG,
      UNDEF_ASYNC,
      NOT_ASYNC_PREFIXED,
      astProp
    );

    // "decode" the return value back into an assignable
    let assignable = hasAnyFlag(assignableOrJustIdent, IS_SINGLE_IDENT_WRAP_A | NOT_SINGLE_IDENT_WRAP_A) ? initAssignable(): initNotAssignable();
    assignable = copyPiggies(assignable, assignableOrJustIdent);

    // the group parser parses one rhs paren so there may not be any parens left to consume here
    let canBeErrorCase = hasAnyFlag(assignableOrJustIdent, IS_SINGLE_IDENT_WRAP_A | IS_SINGLE_IDENT_WRAP_NA);
    while (--parens > 0) { // this only passes for inner parens
      // `delete ((foo).bar)`, parse a tail then continue parsing parens
      if (curc !== $$PAREN_R_29) {
        // (this is never toplevel)
        // `delete ((foo).bar)`      -- parse a tail then continue parsing parens
        // `delete ((foo)++)`
        // `delete ((true)++)`       -- (note that this is not `assignable`)
        // `delete ((await x))`      -- runtime error, exception: syntax error in func arg default
        let nowAssignable = parseValueTail(lexerFlags, assignable, NOT_NEW_ARG, astProp);
        assignable = mergeAssignable(nowAssignable, assignable);
        assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
        if (curc === $$COMMA_2C) assignable = _parseExpressions(lexerFlags, assignable, astProp);
        canBeErrorCase = false;
      }
      // at least one rhs paren must appear now
      skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags);
      if (curtok.str === '=>') {
        // This means the code is deleting an arrow that is wrapped in parentheses
        // The case for deleting an unwrapped arrow is handled elsewhere
        // `delete ((a)) => b)`
        // `delete (((x)) => x)`
        THROW('Arrow is illegal here');
      }
    }
    ASSERT(hasAllFlags(lexerFlags, LF_NO_ASI), 'should not be allowed to parse asi inside a group');
    lexerFlags = sansFlag(lexerFlags, LF_NO_ASI); // TODO: `(delete (((x))) \n x)` can still not ASI

    ASSERT(curtok.str !== '=>', 'we checked this in the loop');

    // this is after the outer most rhs paren. we still have to check whether we can parse a tail (but no op)
    // - `delete (foo).foo`
    // - `delete (foo)++`        -- wait is this even legal?
    let prevtok = curtok;

    parseValueTail(lexerFlags, assignable, NOT_NEW_ARG, astProp);
    if (curtok === prevtok && canBeErrorCase && hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
      // https://tc39.github.io/ecma262/#sec-delete-operator-static-semantics-early-errors
      // strict mode only
      // `delete foo`
      // `delete (((foo)))`
      THROW('Bad delete case, can not delete an ident wrapped in parens');
    }

    return assignable;
  }
  function parseDeleteIdent(lexerFlags) {
    // `delete foo.bar`
    // `delete foo[bar]`
    // `delete x`
    // `delete foo[await x]`
    // `delete foo[yield x]`

    let identToken = curtok;
    ASSERT_skipDiv($IDENT, lexerFlags); // this is the `delete` _arg_. could lead to `delete arg / x` (but definitely not a regex)

    let afterIdentToken = curtok; // store to assert whether anything after the ident was parsed

    // Note: assignable is relevant if it somehow contained an await or yield; TODO: citation needed
    let assignable = parseValueAfterIdent(lexerFlags, identToken, BINDING_TYPE_NONE, ASSIGN_EXPR_IS_ERROR, 'argument');

    if (identToken.type === $IDENT) {
      if (curtok === afterIdentToken && hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
        // https://tc39.github.io/ecma262/#sec-delete-operator-static-semantics-early-errors
        // - It is a Syntax Error if the UnaryExpression is contained in strict mode code and the derived UnaryExpression is PrimaryExpression:IdentifierReference .
        // - It is a Syntax Error if the derived UnaryExpression is PrimaryExpression: CoverParenthesizedExpressionAndArrowParameterList and CoverParenthesizedExpressionAndArrowParameterList ultimately derives a phrase that, if used in place of UnaryExpression, would produce a Syntax Error according to these rules. This rule is recursively applied.
        // (So in strict mode you can't do `delete foo;` and `delete (foo);` and `delete (((foo)));` etc)

        // Due to ASI this is a tad difficult to do without AST or even token stream but we can just confirm whether
        // the object reference to curtok remains the same. In that case only identToken was parsed as the value.

        THROW('Cannot delete an identifier without tail, in strict mode');
      } else if (afterIdentToken.nl && afterIdentToken.str === '(' && identToken.str === 'async' && curtok.str === '=>' && hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
        // - `delete async \n (...) => x`
        // which is effectively `delete async; () => x;`, which is still an error
        THROW('Cannot delete an identifier without tail, in strict mode');
      }
    }

    return assignable;
  }
  function parseLabeledStatementInstead(lexerFlags, scoop, labelSet, identToken, astProp) {
    ASSERT(arguments.length === parseLabeledStatementInstead.length, 'arg count');

    // This is an exception to the general case where eval and arguments are okay to use as label name. Thanks, spec.
    if (identToken.str !== 'eval' && identToken.str !== 'arguments') {
      fatalBindingIdentCheck(identToken, BINDING_TYPE_NONE, lexerFlags);
    }

    AST_open(astProp, 'LabeledStatement');
    AST_setIdent('label', identToken);
    let set = labelSet;
    do {
      if (set['#' + identToken.str]) THROW('Saw the same label twice which is not allowed');
      set = set['#'];
    } while (set);
    labelSet['#' + identToken.str] = true;
    ASSERT_skipRex(':', lexerFlags);
    parseNestedBodyPart(lexerFlags | LF_CAN_FUNC_STMT, scoop, labelSet, EXC_DECL, 'body');
    AST_close('LabeledStatement');
  }

  function parsePunctuatorStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parsePunctuatorStatement.length, 'arg count');
    switch (curc) {
      case $$CURLY_L_7B:
        parseBlockStatement(lexerFlags, SCOPE_addLexTo(scoop, BLOCK_SCOPE, 'parsePunctuatorStatement'), labelSet, IS_STATEMENT, IGNORE_DIRECTIVES, IGNORE_DIRECTIVES, INC_DECL, astProp);
        break;
      case $$SEMI_3B:
        parseEmptyStatement(lexerFlags, astProp);
        break;
      default:
        AST_open(astProp, 'ExpressionStatement');
        // Note: an arrow would create a new scope and there is no other way to introduce a new binding from here on out
        parseExpressions(lexerFlags, ASSIGN_EXPR_IS_OK, 'expression');
        AST_close('ExpressionStatement');
        parseSemiOrAsi(lexerFlags);
    }
  }

  function parseEmptyStatement(lexerFlags, astProp) {
    AST_open(astProp, 'EmptyStatement');
    ASSERT_skipRex(';', lexerFlags);
    AST_close('EmptyStatement');
  }

  function parseWithStatement(lexerFlags, scoop, labelSet, astProp) {
    ASSERT(arguments.length === parseWithStatement.length, 'arg count');

    if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) THROW('The `with` statement is not allowed in strict mode');

    AST_open(astProp, 'WithStatement');
    ASSERT_skipAny('with', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'object');
    parseNestedBodyPart(lexerFlags, scoop, labelSet, EXC_DECL, 'body');
    AST_close('WithStatement');
  }

  function parseAnyVarDecls(lexerFlags, scoop, bindingType, bindingOrigin, doDupeBindingCheck, exportedNames, exportedBindings, astProp) {
    ASSERT(parseAnyVarDecls.length === arguments.length, 'arg count');
    if (curtype !== $IDENT && curc !== $$SQUARE_L_5B && curc !== $$CURLY_L_7B) THROW('Expected identifier, or array/object destructuring, next token is: ' + curtok);
    ASSERT(bindingType === BINDING_TYPE_VAR || bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_CONST, 'only three kinds here');
    let keyword = bindingType === BINDING_TYPE_VAR ? 'var' : bindingType === BINDING_TYPE_LET ? 'let' : 'const';

    AST_open(astProp, 'VariableDeclaration');
    AST_set('kind', keyword);
    AST_set('declarations', []);

    parseBindings(lexerFlags, scoop, bindingType, bindingOrigin, ASSIGNMENT_IS_INIT, NOT_GETSET, doDupeBindingCheck, exportedNames, exportedBindings, 'declarations');
    AST_close(['VariableDeclaration', 'ExpressionStatement']); //  expr in case of `let` in sloppy
  }

  function parseBindings(lexerFlags, scoop, bindingType, bindingOrigin, defaultOptions, isGetSet, skipDoubleBindCheck, exportedNames, exportedBindings, astProp) {
    ASSERT(parseBindings.length === arguments.length, 'expecting all args');
    ASSERT(typeof bindingType === 'number', 'bindingType should be enum');
    ASSERT(typeof bindingOrigin === 'number', 'bindingOrigin should be enum');
    ASSERT(isGetSet !== IS_GETTER, 'getters should not call this');
    // TODO: if bindingType=let then also consider it could be a var name
    let many = 0;
    let inited = false;
    let startWasObjectOrArray = curc === $$SQUARE_L_5B || curc === $$CURLY_L_7B;
    let wasSimple = ARGS_SIMPLE;
    do {
      ++many;
      let wasRest = curc === $$DOT_2E && curtok.str === '...';
      // ident or destructuring of object/array or rest arg
      let bindingMeta = parseBinding(lexerFlags, scoop, bindingType, bindingOrigin, defaultOptions, skipDoubleBindCheck, exportedNames, exportedBindings, astProp);
      if (bindingMeta === ARG_HAD_INIT) inited = true;
      if (bindingMeta !== ARG_WAS_SIMPLE) {
        ASSERT(typeof bindingMeta === 'number', 'should be number');
        ASSERT(bindingMeta >= 0 && bindingMeta <= 2, 'bindingMeta should be enum');
        wasSimple = ARGS_COMPLEX;
      }
      if (wasRest) {
        ASSERT(curc === $$PAREN_R_29, 'the "rest is last and no init" check should happen elsewhere and before this point');
        break;
      }
      if (curc !== $$COMMA_2C) break;
      ASSERT_skipAny(',', lexerFlags); // TODO: next must be ident or comma or [ or { or .
      if (curc === $$PAREN_R_29) {
        // `function f(a,)`
        // (arrows do not go through here)
        if (bindingType === BINDING_TYPE_ARG) {
          if (allowTrailingFunctionComma) {
            // https://tc39.github.io/ecma262/#sec-function-definitions-static-semantics-issimpleparameterlist
            // The [empty] is the case of `FormalParameters : FormalParameterList ,` which is actually the prod
            // `FormalParameters : FormalParameterList , [empty]`. So a trailing comma does not change simple state.
            return wasSimple;
          }
          THROW('Targeted language version does not support trailing function arg comma');
        }
      }
    } while (true);
    if (many !== 1 && isGetSet === IS_SETTER) {
      THROW('Setters require exactly one parameter');
    }
    if (bindingOrigin === FROM_FOR_HEADER && (curtok.str === 'in' || curtok.str === 'of')) {
      if (many !== 1) {
        THROW('For-in and for-of can only have one binding, found ' + many);
      }

      // https://tc39.github.io/ecma262/#sec-initializers-in-forin-statement-heads
      // binding inits are ONLY okay when;
      // - sloppy mode
      // - web-compat mode
      // - regular var names
      // - for-in statements
      // - `var` binding
      if (inited && (
        startWasObjectOrArray ||
        options_webCompat === WEB_COMPAT_OFF ||
        bindingType !== BINDING_TYPE_VAR ||
        curtok.str === 'of' ||
        hasAllFlags(lexerFlags, LF_STRICT_MODE))
      ) {
        THROW('For-in and for-of binding can not have an init');
      }
    }
    return wasSimple;
  }
  function parseBinding(lexerFlags, scoop, bindingType, bindingOrigin, defaultsOption, dupeChecks, exportedNames, exportedBindings, astProp) {
    // returns whether a binding had an init (necessary to validate for-header bindings)
    ASSERT(arguments.length === parseBinding.length, 'expecting args');
    // note: a "binding pattern" means a var/let/const var declaration with name or destructuring pattern

    // TODO: legacy `let` as a var name support

    let mustHaveInit = false;
    let wasSimple = ARG_NEITHER_SIMPLE_NOR_INIT; // simple if "valid in es5" (list of idents, no inits)

    if (curtype === $IDENT) {
      // normal
      let bindingTok = curtok;
      fatalBindingIdentCheck(bindingTok, bindingType, lexerFlags);
      SCOPE_addBinding(
        lexerFlags,
        scoop,
        curtok.str,
        bindingType,
        dupeChecks,
        (bindingOrigin === FROM_STATEMENT_START || bindingOrigin === FROM_FOR_HEADER || bindingOrigin === FROM_EXPORT_DECL) && bindingType === BINDING_TYPE_VAR ? ORIGIN_IS_VAR_DECL : ORIGIN_NOT_VAR_DECL
      );
      addNameToExports(exportedNames, curtok.str);
      addBindingToExports(exportedBindings, curtok.str);
      let identToken = curtok;
      AST_setIdent(astProp, curtok);
      ASSERT_skipRex($IDENT, lexerFlags); // note: if this is the end of the var decl and there is no semi the next line can start with a regex

      if (
        hasNoFlag(lexerFlags, LF_STRICT_MODE) &&
        !isAssignable(nonFatalBindingAssignableIdentCheck(bindingTok, bindingType, lexerFlags | LF_STRICT_MODE))
      ) {
        // In this case we are in sloppy mode but the name would fail in strict mode. It is still possible for this
        // function to become strict mode if it turns out it has the "use strict" flag. So check for that, and throw an
        // error when we discover the function to be strict after all.

        // - `function foo(eval) { "use strict"; }`
        // - `function foo(package) { "use strict"; }`
      } else {
        wasSimple = ARG_WAS_SIMPLE; // could still be complex if init
      }
    }
    else if (curc === $$CURLY_L_7B) {
      ASSERT(bindingType !== BINDING_TYPE_NONE, 'must bind as something');
      let destructible = parseObjectOuter(lexerFlags, scoop, bindingType, SKIP_INIT, NOT_CLASS_METHOD, exportedNames, exportedBindings, astProp);
      verifyDestructibleForBinding(destructible, bindingType);
      AST_destruct(astProp);
      // note: throw for `const {};` and `for (const {};;);` but not `for (const {} in obj);`
      if (
        (bindingOrigin !== FROM_CATCH) &&
        (bindingOrigin !== FROM_FOR_HEADER || (curtok.str !== 'in' && curtok.str !== 'of')) &&
        (bindingType === BINDING_TYPE_CONST || bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_VAR)
      ) {
        mustHaveInit = true;
      }
    }
    else if (curc === $$SQUARE_L_5B) {
      let destructible = parseArrayOuter(lexerFlags, scoop, bindingType, SKIP_INIT, exportedNames, exportedBindings, astProp);
      verifyDestructibleForBinding(destructible, bindingType);
      AST_destruct(astProp);
      // note: throw for `const {};` and `for (const {};;);` but not `for (const {} in obj);`
      if (
        (bindingOrigin !== FROM_CATCH) &&
        (bindingOrigin !== FROM_FOR_HEADER || (curtok.str !== 'in' && curtok.str !== 'of')) &&
        (bindingType === BINDING_TYPE_CONST || bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_VAR)
      ) {
        mustHaveInit = true;
      }
    }
    else if (curc === $$DOT_2E && curtok.str === '...') {
      ASSERT(bindingType === BINDING_TYPE_ARG, 'other binding types should catch this sooner?');
      let subDestruct = parseArrowableSpreadOrRest(lexerFlags, scoop, $$PAREN_R_29, bindingType, IS_GROUP_TOPLEVEL, UNDEF_ASYNC, exportedNames, exportedBindings, astProp);
      verifyDestructibleForBinding(subDestruct, bindingType);
    }
    else if (curc !== $$PAREN_R_29) {
      THROW('Expected to parse a(nother) binding but none was found');
    }

    if (curc === $$IS_3D && curtok.str === '=') {
      ASSERT_skipRex('=', lexerFlags); // x(foo=/bar/){}
      wasSimple = ARG_HAD_INIT; // if this is an arg the arg is not "simple"
      if (defaultsOption === ASSIGNMENT_IS_DEFAULT) {
        if (wasSimple === ARG_WAS_SIMPLE && bindingOrigin === FROM_CATCH) THROW('The catch clause cannot have a default');
        // - `try {} catch (a) {}`
        // - `try {} catch ([a]) {}`
        // - `try {} catch ([a] = b) {}`
        AST_wrapClosed(astProp, 'AssignmentPattern', 'left');
        parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
        AST_close('AssignmentPattern');
      } else {
        ASSERT(bindingOrigin !== FROM_CATCH, 'catch is default');
        ASSERT(defaultsOption === ASSIGNMENT_IS_INIT, 'two options');
        AST_wrapClosed('declarations', 'VariableDeclarator', 'id');
        parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'init');
        AST_close('VariableDeclarator');
      }
    }
    else if (mustHaveInit) {
      THROW('Declaration destructuring must have init');
    }
    else if (bindingType === BINDING_TYPE_CONST && (bindingOrigin !== FROM_FOR_HEADER || (curc === $$SEMI_3B || curc === $$COMMA_2C))) {
      // only exception is a for-header where the next token is `in` or `of` instead of `=`
      THROW('Constants must be initialized');
    }
    else if (defaultsOption === ASSIGNMENT_IS_INIT) {
      AST_wrapClosed('declarations', 'VariableDeclarator', 'id');
      AST_set('init', null);
      AST_close('VariableDeclarator');
    } else {
      ASSERT(defaultsOption === ASSIGNMENT_IS_DEFAULT, 'two options');
      // - `async x => delete (((((foo(await x)))))).bar`
      // ?
    }

    ASSERT(typeof wasSimple === 'number', 'wassimple should be enum');
    return wasSimple;
  }

  function fatalBindingIdentCheck(identToken, bindingType, lexerFlags) {
    ASSERT(fatalBindingIdentCheck.length === arguments.length, 'arg count');
    ASSERT(identToken.type === $IDENT, 'ident check on ident tokens ok', identToken);
    let str = nonFatalBindingIdentCheck(identToken, bindingType, lexerFlags);
    if (str !== '') THROW_TOKEN(`Cannot use this name (${identToken.str}) as a variable name because: ${str}`, identToken);
  }
  function nonFatalBindingIdentCheck(identToken, bindingType, lexerFlags) {
    ASSERT(nonFatalBindingIdentCheck.length === arguments.length, 'expecting all args');
    ASSERT(typeof bindingType === 'number', 'the binding should be an enum', bindingType);

    // TODO: this check can be drastically improved.
    // note that any match here is usually an error (but not always, like strict mode or context specific stuff), but usually anyways
    switch (identToken.canon) {
      // keywords
      case 'break':
      case 'case':
      case 'catch':
      case 'class':
      case 'const':
      case 'continue':
      case 'debugger':
      case 'default':
      case 'delete':
      case 'do':
      case 'else':
      case 'export':
      case 'extends':
      case 'finally':
      case 'for':
      case 'function':
      case 'if':
      case 'import':
      case 'in':
      case 'instanceof':
      case 'new':
      case 'return':
      case 'super':
      case 'switch':
      case 'this':
      case 'throw':
      case 'try':
      case 'typeof':
      case 'var':
      case 'void':
      case 'while':
      case 'with':
      // null / boolean
      case 'null':
      case 'true':
      case 'false':
      // future reserved keyword:
      case 'enum':
        if (identToken.str !== identToken.canon) return 'Keywords may not have escapes in their name';
        return 'Cannot never use this reserved word as a variable name';

      // strict mode keywords
      case 'let':
        if (bindingType === BINDING_TYPE_CLASS) return 'Can not use `let` as a class name';
        if (bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_CONST) {
          return 'Can not use `let` when binding through `let` or `const`';
        }

        // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
        //   Identifier: IdentifierName but not ReservedWord
        //     It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is: ... "let" ...
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) return 'Can not use `let` as variable name in strict mode';
        break;
      case 'static':
        // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
        //   Identifier: IdentifierName but not ReservedWord
        //     It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is: ... "static" ...
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          if (identToken.str !== identToken.canon) return 'Keywords may not have escapes in their name';
          return '`static` is a reserved word in strict mode';
        }
        break;

      // `eval` and `arguments` edge case paths
      case 'eval':
      case 'arguments':
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          return 'Cannot create a binding named `'+ identToken.canon +'` in strict mode';
        }
        break;

      // strict mode only future reserved keyword:
      case 'implements':
      case 'package':
      case 'protected':
      case 'interface':
      case 'private':
      case 'public':
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          // slow path
          if (identToken.str !== identToken.canon) {
            return 'Keywords may not have escapes in their name';
          }
          return 'Cannot use this reserved word as a variable name in strict mode';
        }
        break;

      // conditional keywords (strict mode or context)
      case 'await':
        // await wasnt a keyword before es8, when async was introduced
        if (allowAsyncFunctions) {
          // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
          // > IdentifierReference: await
          // > BindingIdentifier: await
          // > LabelIdentifier: await
          // > It is a Syntax Error if the goal symbol of the syntactic grammar is Module.
          // (Additionally productions are restricted by the `await` parameter... parser/lexerflags should take care of that)
          if (goalMode === GOAL_MODULE) {
            return 'Await is illegal outside of async body with module goal';
          } else {
            // in sloppy mode you cant use it inside an async function (and inside params defaults of arrows)
            if (hasAnyFlag(lexerFlags, LF_IN_ASYNC)) return 'Await not allowed here';
          }
        }
        break;
      case 'yield':
        // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
        // > It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is: ... "yield".
        // (Additionally productions are restricted by the `await` parameter... parser/lexerflags should take care of that)
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          return 'Cannot use this reserved word as a variable name in strict mode';
          // in sloppy mode you cant use it inside a generator function (and inside params defaults?)
        } else if (hasAnyFlag(lexerFlags, LF_IN_GENERATOR)) {
          return 'Cannot use this reserved word as a variable name inside a generator';
        }
        break;
    }

    // valid binding name
    return '';
  }
  function fatalBindingAssignableIdentCheck(identToken, bindingType, lexerFlags) {
    ASSERT(fatalBindingAssignableIdentCheck.length === arguments.length, 'arg count');
    ASSERT(identToken.type === $IDENT, 'ident check on ident tokens ok');
    let str = nonFatalBindingAssignableIdentCheck(identToken, bindingType, lexerFlags);
    if (str & IS_ASSIGNABLE || str & NOT_ASSIGNABLE) return str;
    ASSERT(typeof str === 'string' && str !== '', 'either returns assignable or an error string', str);
    if (str !== '') THROW(`Cannot assign to this name (${identToken.str}) as a variable name because: ${str}`);
  }
  function nonFatalBindingAssignableIdentCheck(identToken, bindingType, lexerFlags) {
    ASSERT(arguments.length === nonFatalBindingAssignableIdentCheck.length, 'expecting arg count');
    ASSERT(typeof identToken === 'object', 'token, not name');
    // TODO: a few cases that still use fatalBindingIdentCheck should use this function instead. fix with tests

    // this function is called to validate an ident that is the head of a value as an assignable target.
    // this means `foo` is yes, `true` is no, `typeof` is no (and requires a tail), and `instanceof` should just throw.

    switch (identToken.canon) {
      // keywords
      case 'break':
      case 'case':
      case 'catch':
      case 'const':
      case 'continue':
      case 'debugger':
      case 'default':
      case 'delete':
      case 'do':
      case 'else':
      case 'export':
      case 'extends':
      case 'finally':
      case 'for':
      case 'function':
      case 'if':
      case 'import':
      case 'in':
      case 'instanceof':
      case 'return':
      case 'switch':
      case 'throw':
      case 'try':
      case 'var':
      case 'while':
      case 'with':
      // future reserved keyword:
      case 'enum':
        return 'Unexpected keyword: `' + identToken.canon + '`';
        if (identToken.str !== identToken.canon) return 'Keywords may not have escapes in their name';
        return NOT_ASSIGNABLE;

      // value keywords
      case 'class':
      case 'new':
      case 'super':
      case 'this':
      case 'typeof':
      case 'void':
      case 'null':
      case 'true':
      case 'false':
        if (identToken.str !== identToken.canon) return 'Keywords may not have escapes in their name';
        return NOT_ASSIGNABLE;

      // strict mode keywords
      case 'let':
        // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
        //   Identifier: IdentifierName but not ReservedWord
        //     It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is: ... "let" ...
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          return 'Unexpected keyword in strict mode: `' + identToken.canon + '`';
        }
        if (bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_CONST) return NOT_ASSIGNABLE;
        break;
      case 'static':
        // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
        //   Identifier: IdentifierName but not ReservedWord
        //     It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is: ... "static" ...
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          if (identToken.str !== identToken.canon) return 'Keywords may not have escapes in their name';
          return NOT_ASSIGNABLE;
        }
        break;

      // `eval` and `arguments` edge case paths
      case 'eval':
      case 'arguments':
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) return NOT_ASSIGNABLE;
        break;

      // strict mode only future reserved keyword:
      case 'implements':
      case 'package':
      case 'protected':
      case 'interface':
      case 'private':
      case 'public':
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          if (identToken.str !== identToken.canon) THROW('Keywords may not have escapes in their name');
          return 'Unexpected keyword: `' + identToken.canon + '`';
        }
        break;

      // conditional keywords
      case 'await':
        // await wasn't a keyword before es8, when async was introduced
        if (allowAsyncFunctions) {
          // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
          // > IdentifierReference: await
          // > BindingIdentifier: await
          // > LabelIdentifier: await
          // > It is a Syntax Error if the goal symbol of the syntactic grammar is Module.
          // (Additionally productions are restricted by the `await` parameter... parser/lexerflags should take care of that)
          if (goalMode === GOAL_MODULE) {
            return 'Await is illegal outside of async body with module goal';
          } else {
            // in sloppy mode you cant use it inside an async function (and inside params defaults of arrows)
            if (hasAnyFlag(lexerFlags, LF_IN_ASYNC)) return 'Await not allowed as ident here';
          }
        }
        return IS_ASSIGNABLE | PIGGY_BACK_SAW_AWAIT_VARNAME;
      case 'yield':
        // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
        // > It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is: ... "yield".
        // (Additionally productions are restricted by the `await` parameter... parser/lexerflags should take care of that)
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          return 'Cannot use this reserved word as a variable name in strict mode';
          // in sloppy mode you cant use it inside a generator function (and inside params defaults?)
        } else if (hasAnyFlag(lexerFlags, LF_IN_GENERATOR | LF_IN_ASYNC)) {
          return 'Cannot use this reserved word as a variable name inside a generator';
        }
        return IS_ASSIGNABLE | PIGGY_BACK_SAW_YIELD_VARNAME;
    }

    // valid binding name
    return IS_ASSIGNABLE;
  }
  function checkIdentReadable(lexerFlags, bindingType, identToken) {
    // isBindingIdentifier
    // Can we currently read a value from this identifier?
    // Some identifiers are always keywords, `this`, `new`, for them the answer is always "no"
    // Some identifiers are only considered a keyword in certain contexts (`yield` in strict, `await` in module goal, etc)
    // If an ident is considered keyword and it has an escape whose canon!=ident it will throw. `arguments` and `eval` are never keywords.
    // Notable is that `yield` and `await` may return true in some cases.
    // Things like `true`, `this`, `eval` and `arguments` should always be fine here.
    return isUsableKeyword(lexerFlags, bindingType, CHECK_TO_READ, identToken)
  }
  function isUsableKeyword(lexerFlags, bindingType, checkBindOrRead, identToken) {
    ASSERT(isUsableKeyword.length === arguments.length, 'expecting arg count');
    // "is given ident a valid source of value on its own?", are these valid: `log(foo)` `log(break)` `log(true)`

    switch (identToken.canon) {
      // there are only a handful of keywords that are value
      case 'super':
      case 'this':
      case 'null':
      case 'true':
      case 'false':
        if (identToken.str !== identToken.canon) THROW('Keywords may not have escapes in their name');
        return checkBindOrRead === CHECK_TO_READ; // true if reading, false if binding

      case 'eval':
      case 'arguments':
        // do not check the canon as `eval` and `arguments` are not considered keywords
        if (checkBindOrRead === CHECK_TO_BIND) {
          if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
            return checkBindOrRead === CHECK_TO_READ; // true if reading, false if binding
          }
        }
        return true; // can always read and bind with this identifier

      case 'break':
      case 'case':
      case 'catch':
      case 'const':
      case 'continue':
      case 'debugger':
      case 'default':
      case 'delete':
      case 'do':
      case 'else':
      case 'export':
      case 'extends':
      case 'finally':
      case 'for':
      case 'function':
      case 'if':
      case 'import':
      case 'in':
      case 'instanceof':
      case 'return':
      case 'switch':
      case 'throw':
      case 'try':
      case 'var':
      case 'while':
      case 'with':
      case 'enum':
      case 'class':
      case 'new':
      case 'typeof':
      case 'void':
        break;

      case 'let':
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          break;
        }
        if (bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_CONST) {
          break;
        }
        return true; // can read and write with this binding
      case 'static':
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          break;
        }
        return true; // can read and write with this binding

      case 'implements':
      case 'package':
      case 'protected':
      case 'interface':
      case 'private':
      case 'public':
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          break;
        }
        return true; // can read and write with this binding

      // conditional keywords
      case 'await':
        if (allowAsyncFunctions) {
          if (goalMode === GOAL_MODULE || hasAnyFlag(lexerFlags, LF_IN_ASYNC)) {
            break;
          }
        }
        return true; // can read and write with this binding
      case 'yield':
        if (hasAnyFlag(lexerFlags, LF_STRICT_MODE | LF_IN_GENERATOR | LF_IN_ASYNC)) {
          break;
        }
        return true; // can read and write with this binding
      default:
        // plain var names, not keywords
        return true; // can read and write with this binding
    }

    // if code reaches here it is to be considered a non-value keyword
    if (identToken.str !== identToken.canon) {
      THROW('Keywords may not have escapes in their name (canon=`' + identToken.canon + '`, keyword=`' + identToken.str + '`');
    }
    return false; // can neither read nor write with this binding
  }


  // ### expressions (functions below should not call functions above)


  function parseExpression(lexerFlags, allowAssignment, astProp) {
    ASSERT(arguments.length === parseExpression.length, 'expecting all args');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    let assignable = parseValue(lexerFlags, allowAssignment, NOT_NEW_ARG, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, astProp);
  }
  function parseExpressionAfterLiteral(lexerFlags, astProp) {
    // assume we just parsed and skipped a literal (string/number/regex/array/object)
    let assignable = parseValueTail(lexerFlags, NOT_ASSIGNABLE, NOT_NEW_ARG, astProp);
    parseExpressionFromOp(lexerFlags, assignable, astProp);
  }
  function parseExpressionAfterIdent(lexerFlags, identToken, bindingType, allowAssignment, astProp) {
    ASSERT(parseExpressionAfterIdent.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    let assignable = parseValueAfterIdent(lexerFlags, identToken, bindingType, allowAssignment, astProp);
    ASSERT(typeof assignable === 'number', 'assignanum', assignable);
    assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
    ASSERT(typeof assignable === 'number', 'assignanum', assignable);
    return assignable;
  }
  function parseExpressionAfterPlainVarName(lexerFlags, identToken, allowAssignment, astProp) {
    ASSERT(parseExpressionAfterPlainVarName.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    // similar to parseExpressionAfterIdentifier except it shortcuts the ident check (assumes
    // special paths from call sites where the var name must be a plain var name)
    // TODO: assert the varname is not special (dev only)
    ASSERT(identToken.str === 'let', 'currently only used for let, update is_assignable flag if this changes');
    let assignable = parseIdentOrParenlessArrow(lexerFlags, identToken, IS_ASSIGNABLE, allowAssignment, astProp);
    assignable = parseValueTail(lexerFlags, assignable, NOT_NEW_ARG, astProp);
    if (allowAssignment === ASSIGN_EXPR_IS_ERROR) {
      TODO // this is wrong
      assignable = setNotAssignable(assignable);
    }
    return parseExpressionFromOp(lexerFlags, assignable, astProp);
  }
  function parseExpressionAfterAsyncAsVarName(lexerFlags, stmtOrExpr, asyncToken, isNewArg, allowAssignment, astProp) {
    ASSERT(arguments.length === parseExpressionAfterAsyncAsVarName.length, 'arg count');
    ASSERT(asyncToken.str === 'async');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    if (stmtOrExpr === IS_STATEMENT) {
      AST_open(astProp, 'ExpressionStatement');
      astProp = 'expression'
    }
    // asyncToken is not yet added to AST
    let assignable = parseIdentOrParenlessArrow(lexerFlags, asyncToken, IS_ASSIGNABLE, allowAssignment, astProp);
    assignable = parseValueTail(lexerFlags, assignable, isNewArg, astProp);

    ASSERT((isNewArg !== IS_NEW_ARG) || (stmtOrExpr !== IS_STATEMENT), 'this can not be a new arg if it is a statement');
    if (stmtOrExpr === IS_STATEMENT) {
      // in expressions operator precedence is handled elsewhere. in statements this is the start,
      assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);

      AST_close('ExpressionStatement');
      parseSemiOrAsi(lexerFlags);
    }
    return assignable;
  }
  function parseParenlessArrowAfterAsync(lexerFlags, fromStmtOrExpr, allowAssignment, astProp) {
    ASSERT(parseParenlessArrowAfterAsync.length === arguments.length, 'arg count');
    ASSERT(curtok.str !== 'function', '(Function and newline have already been asserted)');
    ASSERT(!curtok.nl, '(Function and newline have already been asserted)');
    ASSERT(curtype === $IDENT, 'dont have to skip the ident to assert it having to be an arrow');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // We must parse an async arrow without parens now. We still have to validate the arg name too.
    // - `async foo => foo`
    //          ^
    // - `async foo => { }`
    // - `async foo \n => foo`
    // - `async foo \n => { }`
    // - `async eval => {}`
    // - `async eval => { "use strict"; }`

    if (fromStmtOrExpr === IS_STATEMENT) {
      AST_open(astProp, 'ExpressionStatement');
      astProp = 'expression'
    }

    if (curtok.str === 'await') {
      // - `async await => {}`
      THROW('Cannot use `await` as an arg name with async arrows');
    }

    let identToken = curtok;
    let isSimple = ARGS_SIMPLE;
    if (identToken.str === 'eval' || identToken.str === 'arguments') {
      if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
        // - `"use strict"; eval => {}`
        // - `"use strict"; async eval => {}`
        THROW('Cannot use `eval` or `arguments` as param of an arrow in strict mode');
      }
      // - `eval => {}`
      // - `async eval => {}`
      isSimple = ARGS_COMPLEX;
    }
    skipAny(lexerFlags); // this was `async <curtok>` and curtok is not a keyword; next must be `=>`
    parseArrowParenlessFromPunc(lexerFlags, identToken, allowAssignment, isSimple, WAS_ASYNC, astProp);

    if (fromStmtOrExpr === IS_STATEMENT) {
      AST_close('ExpressionStatement');
      parseSemiOrAsi(lexerFlags); // this is not a func decl!
    }
  }
  function parseExpressionFromOp(lexerFlags, assignable, astProp) {
    ASSERT(parseExpressionFromOp.length === arguments.length, 'arg count');
    ASSERT(typeof assignable === 'number', 'assignable num');

    if (isAssignBinOp()) {
      if (notAssignable(assignable)) {
        THROW('Cannot assign to lhs because it is not a valid assignment target');
      }
      assignable = parseExpressionFromAssignmentOp(lexerFlags, assignable, astProp);
    } else {
      let first = true;
      while (isNonAssignBinOp(lexerFlags) || curc === $$QMARK_3F) {
        if (curc === $$QMARK_3F) {
          let nowAssignable = parseExpressionFromTernaryOp(lexerFlags, astProp);
          assignable = setNotAssignable(nowAssignable | assignable);
        } else {
          let nowAssignable = parseExpressionFromBinaryOp(lexerFlags, astProp);
          assignable = setNotAssignable(nowAssignable | assignable);
        }

        // note: this is a nice error message for `5+5=10`
        if (curc === $$IS_3D && curtok.str === '=') {
          THROW('Cannot assign a value to non-assignable value');
        }

        first = false;
      }
    }

    return assignable;
  }
  function parseExpressionFromAssignmentOp(lexerFlags, lhsAssignable, astProp) {
    // <SCRUB AST>
    // Conditionally convert the lhs in the AST to a Pattern
    if (curc === $$IS_3D && curtok.str === '=') {
      let node = _path[_path.length - 1][astProp];
      if (Array.isArray(node)) node = node[node.length - 1];
      if (node.type === 'ArrayExpression' || node.type === 'ObjectExpression') {
        AST_destruct(astProp);
      }
    }
    // </SCRUB AST>

    // Note: assignment to object/array is caught elsewhere
    AST_wrapClosed(astProp, 'AssignmentExpression', 'left');
    AST_set('operator', curtok.str);
    skipRex(lexerFlags);

    let rhsAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
    AST_close('AssignmentExpression');


    // - `a.b = x`
    // - `a = x`
    // - `a = b = x`
    // Reset assignability because further assignments should be parsed immediately and since this will now never
    // become a "simple assignment target", for all further intentions and purposes this won't be assigned to.
    ASSERT(curtok.str !== '=');
    return setNotAssignable(mergeAssignable(rhsAssignable, lhsAssignable));
  }
  function parseExpressionFromBinaryOp(lexerFlags, astProp) {
    // parseBinary
    // Now parsing the rhs (b) after an operator
    // - `a + b`
    // - `a instanceof b`
    // - `a ** b`

    let curop = curtok.str;
    let AST_nodeName = (curop === '&&' || curop === '||') ? 'LogicalExpression' : 'BinaryExpression';
    AST_wrapClosed(astProp, AST_nodeName, 'left');
    AST_set('operator', curop);
    skipRex(lexerFlags);
    let assignable = parseValue(lexerFlags, ASSIGN_EXPR_IS_ERROR, NOT_NEW_ARG, 'right');

    // If the next op is stronger than this one go deeper now. Only the `**` non-assign binary op also does this
    // for if the previous op was also `**` (and we don't need other checks because it is the strongest binary op).
    // TODO: dedupe the op check which now happens here and at the higher level again
    while ((isNonAssignBinOp(lexerFlags) && getStrength(curtok.str) > getStrength(curop)) || curtok.str === '**') {
      let nowAssignable = parseExpressionFromBinaryOp(lexerFlags, 'right');
      assignable = mergeAssignable(nowAssignable, assignable);
    }

    AST_close(AST_nodeName);

    return assignable;
  }
  function parseExpressionFromTernaryOp(lexerFlags, astProp) {
    // parseTernary
    // > LogicalORExpression ? AssignmentExpression[+In] : AssignmentExpression
    // - `a ? b : c`
    //      ^
    // - `a ? await x : c`
    // - `a ? b : await c`
    // - `a ? b = d : c`
    // - `a ? b : c = d`
    // - `a ? b : yield c`
    AST_wrapClosed(astProp, 'ConditionalExpression', 'test');
    ASSERT_skipRex('?', lexerFlags);
    // you can have an assignment between `?` and `:` but not after `:`
    // the `in` is allowed between as well because there can be no ambiguity
    // TODO: add testcase where NO_ASI is necessary. Not sure it is but can't determine that it is not. Go fuzzer?
    let midAssignable = parseExpression(sansFlag(lexerFlags, LF_IN_FOR_LHS) | LF_NO_ASI, ASSIGN_EXPR_IS_OK, 'consequent');
    if (curc !== $$COLON_3A) {
      if (curc === $$COMMA_2C) THROW('Can not use comma inside ternary expressions');
      THROW('Unexpected character inside ternary');
    }
    ASSERT_skipRex(':', lexerFlags);
    let rhsAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'alternate');
    AST_close('ConditionalExpression');

    return setNotAssignable(midAssignable | rhsAssignable);
  }

  function parseExpressionsAfterIdent(lexerFlags, identToken, allowAssignment, astProp) {
    ASSERT(parseExpressionsAfterIdent.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    let assignable = parseExpressionAfterIdent(lexerFlags, identToken, BINDING_TYPE_NONE, allowAssignment, astProp)
    if (curc === $$COMMA_2C) assignable = _parseExpressions(lexerFlags, assignable, astProp);
    return assignable;
  }
  function parseExpressions(lexerFlags, allowAssignment, astProp) {
    ASSERT(arguments.length === parseExpressions.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    let assignable = parseExpression(lexerFlags, allowAssignment, astProp);
    if (curc === $$COMMA_2C) assignable = _parseExpressions(lexerFlags, assignable, astProp);
    return assignable;
  }
  function _parseExpressions(lexerFlags, assignable, astProp) {
    ASSERT(arguments.length === _parseExpressions.length, 'arg count');
    ASSERT(curc === $$COMMA_2C, 'confirm at callsite');
    AST_wrapClosedIntoArray(astProp, 'SequenceExpression', 'expressions');
    assignable = __parseExpressions(lexerFlags, assignable, 'expressions');
    AST_close('SequenceExpression');
    return assignable; // since we asserted a comma, we can be certain about this
  }
  function __parseExpressions(lexerFlags, assignable, astProp) {
    ASSERT(__parseExpressions.length === arguments.length, 'arg count');
    // current node should already be a SequenceExpression here. it wont be closed here either
    do {
      ASSERT_skipRex(',', lexerFlags);
      let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, astProp);
      assignable |= nowAssignable; // make sure to propagate the await/yield flags
    } while (curc === $$COMMA_2C);
    return setNotAssignable(assignable);
  }

  function isAssignBinOp() {
    let str = curtok.str;
    if (curc === $$IS_3D) {
      return str === '=';
    }
    if (str.charCodeAt(str.length-1) !== $$IS_3D) return false;
    // find compound ops but ignore comparison ops
    switch (str) {
      case '*=':
      case '/=':
      case '%=':
      case '+=':
      case '-=':
      case '<<=':
      case '>>=':
      case '>>>=':
      case '&=':
      case '^=':
      case '|=':
      case '**=':
        return true;
    }
    return false;
  }
  function isCompoundAssignment(str) {
    let len = str.length;
    if (len === 1) return false;
    if (str.charCodeAt(len-1) !== $$IS_3D) return false;
    // find compound ops but ignore comparison ops
    switch (str) {
      case '*=':
      case '/=':
      case '%=':
      case '+=':
      case '-=':
      case '<<=':
      case '>>=':
      case '>>>=':
      case '&=':
      case '^=':
      case '|=':
        return true;
      case '**=':
        if (targetEsVersion < VERSION_EXPONENTIATION && targetEsVersion !== VERSION_WHATEVER) {
          // TODO: test case
          THROW('`**` is not supported in ES' + targetEsVersion);
        }
        return true;
    }
    return false;
  }
  function isNonAssignBinOp(lexerFlags) {
    ASSERT(isNonAssignBinOp.length === arguments.length, 'arg count');

    switch (curtok.str) {
      case '&&':
      case '||':
      case '+':
      case '-':
      case '*':
      case '/':
      case '&':
      case '|':
      case '^':
      case '==':
      case '!=':
      case '===':
      case '!==':
      case '<':
      case '<=':
      case '>':
      case '>=':
      case '<<':
      case '>>':
      case '>>>':
      case '%':
      case 'instanceof':
        return true;
      case 'in':
        return hasNoFlag(lexerFlags, LF_IN_FOR_LHS);
      case '**':
        if (targetEsVersion < VERSION_EXPONENTIATION && targetEsVersion !== VERSION_WHATEVER) {
          THROW('`**` is not supported in ES' + targetEsVersion);
        }
        return true;
    }
    return false;
  }

  function getStrength(str) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
    // the spec is super implicit about operator precedent. you can only discover it by tracing the grammar.
    // note: this function doesnt contain all things that have precedent. most of them are also implicitly
    // determined by parsing mechanisms. stuff here is mostly about disambiguating binary ops.
    // (note that unary ops simply don't consume further binary ops AST-wise so they dont appear in this table)
    switch (str) {
      case '**': return 15;
      case '*': return 14;
      case '/': return 14;
      case '%': return 14;
      case '+': return 13;
      case '-': return 13;
      case '<<': return 12;
      case '>>': return 12;
      case '>>>': return 12;
      case '<': return 11;
      case '<=': return 11;
      case '>': return 11;
      case '>=': return 11;
      case 'in': return 11;
      case 'of': return 11;
      case 'instanceof': return 11;
      case '==': return 10;
      case '!=': return 10;
      case '===': return 10;
      case '!==': return 10;
      case '&': return 9;
      case '^': return 8;
      case '|': return 7;
      case '&&': return 6;
      case '||': return 5;
      case '?': return 4;
      default: THROW('Unknown operator ['+str+']'); // other ops should not be handled by this function. dont think this should be possible in prod (it means tokenizer allowed a new op)
    }
  }

  function parseValue(lexerFlags, allowAssignment, isNewArg, astProp) {
    ASSERT(arguments.length === parseValue.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    let assignable = parseValueHeadBody(lexerFlags, PARSE_VALUE_MUST, isNewArg, allowAssignment, astProp);
    // isNewArg is relevant for tail because call parens should be parsed by the new-parser, not call-parser
    // eg. `new foo()` should NOT be `new (foo())` / `(new foo)()` but we do allow `new foo.bar()`
    return parseValueTail(lexerFlags, assignable, isNewArg, astProp);
  }
  function parseValueAfterIdent(lexerFlags, identToken, bindingType, allowAssignment, astProp) {
    ASSERT(parseValueAfterIdent.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // only parses head+body+tail but STOPS at ops
    let assignable = parseValueHeadBodyAfterIdent(lexerFlags, identToken, bindingType, NOT_NEW_ARG, allowAssignment, astProp);
    return parseValueTail(lexerFlags, assignable, NOT_NEW_ARG, astProp);
  }
  function parseYieldValueMaybe(lexerFlags, allowAssignment, astProp) {
    ASSERT(parseYieldValueMaybe.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    let startok = curtok;
    let assignable = parseValueHeadBody(lexerFlags, PARSE_VALUE_MAYBE, NOT_NEW_ARG, allowAssignment, astProp);
    // TODO: how to properly solve this when there are no tokens? can we even do that? (-> lexer head)
    if (curtok === startok) return YIELD_WITHOUT_VALUE;
    assignable = parseValueTail(lexerFlags, assignable, NOT_NEW_ARG, astProp);
    // I dont think we need to propagate the await/yield state of the arg of a yield expression, do we?
    if (isAssignable(assignable)) return WITH_ASSIGNABLE;
    return WITH_NON_ASSIGNABLE;
  }
  function parseValueHeadBody(lexerFlags, maybe, isNewArg, allowAssignment, astProp) {
    ASSERT(arguments.length === parseValueHeadBody.length, 'argcount');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    // - ident (a var, true, false, null, super, new <value>, new.target, this, class, function, async func, generator func)
    // - literal (number, string, regex, object, array, template)
    // - arrow or group (special return flag)
    // - await expression

    // do not include the suffix (property, call, etc)

    // return whether the value is assignable (only for regular var names)
    if (curtype === $IDENT) {
      return parseValueHeadBodyIdent(lexerFlags, isNewArg, BINDING_TYPE_NONE, allowAssignment, astProp);
    }
    else if (hasAnyFlag(curtype, $NUMBER | $STRING | $REGEX)) {
      AST_setLiteral(astProp, curtok);
      skipDiv(lexerFlags);
      return NOT_ASSIGNABLE;
    }
    else if (isTemplateStart(curtype)) {
      parseTickExpression(lexerFlags, astProp);
      return NOT_ASSIGNABLE;
    }
    else if (curtype === $PUNCTUATOR) {
      if (curc === $$CURLY_L_7B) {
        let wasDestruct = parseObjectOuter(lexerFlags, DO_NOT_BIND, BINDING_TYPE_NONE, allowAssignment ? PARSE_INIT : SKIP_INIT, NOT_CLASS_METHOD, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
        return _parseValueHeadBodyAfterObjArr(wasDestruct);
      }
      else if (curc === $$SQUARE_L_5B) {
        let wasDestruct = parseArrayOuter(lexerFlags, DO_NOT_BIND, BINDING_TYPE_NONE, allowAssignment ? PARSE_INIT : SKIP_INIT, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
        return _parseValueHeadBodyAfterObjArr(wasDestruct);
      }
      else if (curc === $$PAREN_L_28) {
        // do not parse arrow/group tail, regardless
        return parseGroupToplevels(lexerFlags, IS_STATEMENT, allowAssignment, UNDEF_ASYNC, NOT_ASYNC_PREFIXED, astProp);
      }
      else if (curtok.str === '++' || curtok.str === '--') {
        return parseUpdatePrefix(lexerFlags, isNewArg, astProp);
      }
      else if (curtok.str === '+' || curtok.str === '-' || curtok.str === '!' || curtok.str === '~') {
        return parseUnary(lexerFlags, isNewArg, astProp);
      }
      else if (curc === $$DOT_2E) {
        // basically an expression that starts with a leading (single) dot, only legal case is `new`
        // TODO: (random but kind of relevant here): add tests that put `.5` and `...` in any place here a leading-dot-token is expected
        // Note that certain cases should not reach this point:
        // `(.2)`
        // `new.target`
        // `new.fail`
        // `(.fail)`
        ASSERT(!hasAllFlags(curtype, $NUMBER_DEC), 'should be checked elsewhere');

        // the ... should be confirmed at any and only point where that might be legal
        if (curtok.str === '...') {
          // Can't be something like `foo(...x)` since that is caught elsewhere
          // - `let x = ...y;`
          // - `foo[...x];`
          THROW('Unexpected spread/rest dots');
        } else {
          // - `foo[.bar]`    or something silly like that...?
          THROW('Unexpected dot');
        }
      }
    }

    if (!maybe) THROW('Expected to parse a value');
    // currently all callsites that have maybe=true will ignore the return value
    return 'FAIL (remove me)';
  }
  function _parseValueHeadBodyAfterObjArr(wasDestruct) {
    ASSERT(_parseValueHeadBodyAfterObjArr.length === arguments.length, 'argcount');

    if (hasAllFlags(wasDestruct, MUST_DESTRUCT)) {
      // [x]: `x = {x=y};`
      // [x]: `for ({x=y} ;;) b;`
      // [x]: `[{a = b}];`
      // [x]: `[{x = y}] in z`
      THROW('Found a struct that must be destructured but was not');
    }

    if (options_webCompat === WEB_COMPAT_ON) {
      if (hasAllFlags(wasDestruct, PIGGY_BACK_WAS_PROTO)) {
        // [x]: `x = {__proto__: 1, __proto__: 2}`
        // [x]: `x = {'__proto__': 1, "__proto__": 2}`
        // [x]: `x = [{__proto__: 1, __proto__: 2}]`
        // [x]: `x = [{'__proto__': 1, "__proto__": 2}]`
        THROW('Found an object with double `__proto__` which is not allowed');
      }
    }

    // Note: immediate tail assignments are parsed at this point and `({x})=y` is illegal
    // Note: however, this may still be the lhs inside a `for` header so we still need to propagate it...
    // To make sure we don't accidentally over accept we can check the next token to clamp down abuse

    let assignable = copyPiggies(0, wasDestruct);
    if (hasNoFlag(wasDestruct, CANT_DESTRUCT)) {
      // Prevent cases like `for (([x])=y in z);`, though they could be handled differently as well...
      // - `var {[a]: [b]} = c`  // fail
      // - `var {[a]: b} = c`    // pass
      // - `var {a: [b]} = c`    // pass
      return setAssignable(assignable);
    }
    return setNotAssignable(assignable);
  }
  function parseValueHeadBodyIdent(lexerFlags, isNewArg, bindingType, allowAssignment, astProp) {
    ASSERT(arguments.length === parseValueHeadBodyIdent.length, 'arg count');
    ASSERT(curtype === $IDENT, 'token should not yet have been consumed because the next token depends on its value and so you cant consume this ahead of time...');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    let identToken = curtok;
    skipIdentSafeSlowAndExpensive(lexerFlags);

    return parseValueHeadBodyAfterIdent(lexerFlags, identToken, bindingType, isNewArg, allowAssignment, astProp);
  }
  function parseValueHeadBodyAfterIdent(lexerFlags, identToken, bindingType, isNewArg, allowAssignment, astProp) {
    ASSERT(parseValueHeadBodyAfterIdent.length === arguments.length, 'expecting args');
    ASSERT(identToken.type === $IDENT, 'should have consumed token. make sure you checked whether the token after can be div or regex...');
    ASSERT(identToken !== curtok, 'should have consumed this');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    ASSERT(isNewArg === NOT_NEW_ARG || allowAssignment === ASSIGN_EXPR_IS_ERROR, 'new arg does not allow assignments');
    // for `new` only a subset is accepted;
    // - `super`
    // - metaproperty (`new.meta`)
    // - `this`
    // - non-reserved ident (inc `yield`, `await`, if possible)
    // - literals (num,str,`null`,`true`,`false`,rex,template)
    // - array / object
    // - function / arrow / async / generator
    // - class

    // for new only a subset is accepted;
    // - super
    // - metaproprety
    // - this
    // - non-reserved ident (inc yield, await, if possible)
    // - literals (num,str,null,true,false,rex,template)
    // - array / object
    // - function / arrow / async / generator
    // - class
    let assignable = 0;
    // note: curtok token has been skipped prior to this call.
    let identName = identToken.str;
    switch (identName) {
      case 'arguments':
        assignable = verifyEvalArgumentsVar(lexerFlags);
        if (curtok.str === '=>') {
          if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
            THROW('Can not use `arguments` as arg name in strict mode');
          }
          parseArrowParenlessFromPunc(lexerFlags, identToken, ASSIGN_EXPR_IS_OK, ARGS_COMPLEX, NOT_ASYNC, astProp);
          return NOT_ASSIGNABLE;
        }
        AST_setIdent(astProp, identToken);
        return assignable;
      case 'async':
        return parseAsyncExpression(lexerFlags, identToken, isNewArg, NOT_EXPORT, allowAssignment, astProp);
      case 'await':
        return parseAwait(lexerFlags, identToken, isNewArg, allowAssignment, astProp);
      case 'class':
        // - `(class x {})`
        // - `(class x {}.foo)`
        // - `(class x {}.foo())`
        // - `(class x {}())`
        // - `async function f(){   (fail = class extends (await x) {}) => {}   }`
        return parseClassExpression(lexerFlags, astProp);
      case 'delete':
        if (isNewArg === IS_NEW_ARG) THROW('Cannot delete inside `new`');
        return parseDeleteExpression(lexerFlags, assignable, astProp);
      case 'eval':
        assignable = verifyEvalArgumentsVar(lexerFlags);
        if (curtok.str === '=>') {
          if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
            THROW('Can not use `eval` as arg name in strict mode');
          }
          parseArrowParenlessFromPunc(lexerFlags, identToken, ASSIGN_EXPR_IS_OK, ARGS_COMPLEX, NOT_ASYNC, astProp);
          return NOT_ASSIGNABLE;
        }
        AST_setIdent(astProp, identToken);
        return assignable;
      case 'false':
        return parseFalseKeyword(astProp);
      case 'function':
        parseFunctionExpression(lexerFlags, NOT_ASYNC, astProp);
        return NOT_ASSIGNABLE;
      case 'let':
        if (bindingType === BINDING_TYPE_CLASS) {
          THROW('Can not use `let` as a class name');
        }
        if (bindingType === BINDING_TYPE_LET || bindingType === BINDING_TYPE_CONST) {
          THROW('Can not use `let` when binding through `let` or `const`');
        }
        // https://tc39.github.io/ecma262/#sec-identifiers-static-semantics-early-errors
        //   Identifier: IdentifierName but not ReservedWord
        //     It is a Syntax Error if this phrase is contained in strict mode code and the StringValue of IdentifierName is: ... "let" ...
        if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
          THROW('Can not use `let` as variable name in strict mode');
        }

        assignable = initAssignable(assignable);
        break;
      case 'new':
        // - `new x`
        // - `new x()`
        // - `new.target`
        // - `async function f(){   (fail = new x(await x)) => {}   }`
        // - `async function f(){   (fail = new (await x)) => {}   }`
        // - `async function f(){   (fail = new f[await x]) => {}   }`
        let newAssignable = parseNewKeyword(lexerFlags, astProp);
        return setNotAssignable(newAssignable); // note: property in `new x().y` is not parsed yet. new expr is never assignable
      case 'null':
        return parseNullKeyword(astProp);
      case 'super':
        return parseSuperKeyword(lexerFlags, astProp);
      case 'true':
        return parseTrueKeyword(astProp);
      case 'this':
        return parseThisKeyword(astProp);
      case 'typeof':
      case 'void':
        // [v]: `delete typeof true`
        // [x]: `(typeof 3 ** 2)`
        // [x]: `async function f(){   function h({x: typeof await x}) {}   }`
        // [x]: `async function f(){   function h({x: typeof await x}) { "use strict"; }   }`
        // [v]: `async function f(){   function g(x = typeof await x) {}  }`
        // [x]: `async function f(){   function g(x = typeof await x) { "use strict"; }  }`
        // [x]: `[typeof x] = x;`
        // [v]: `[typeof x]`
        // [x]: `([typeof x]) => x;`
        // [x]: `[void x] = x;`
        // [v]: `[void x]`
        // [v]: `x + typeof y.x`
        if (isNewArg === IS_NEW_ARG) THROW('Cannot '+identName+' inside `new`');
        return _parseUnary(lexerFlags, identName, astProp);
      case 'yield':
        // - `x + yield`
        // - `delete yield`
        // - `class x extends yield {}`
        // - `5 + yield => {}`
        // - `function *f{ (x = x + yield); }`
        // - `new yield`
        // - `function *f(){ new yield }`
        // - `x = x + yield`
        return parseYield(lexerFlags, identToken, allowAssignment, astProp);
      default:
        if (!checkIdentReadable(lexerFlags, bindingType, identToken)) THROW('Illegal keyword encountered; is not a value [' + identToken.str + ']');
        // - `x` but not `true`
        // - `[x, y, ...z = arr]`
        // TODO: is this check redundant with the binding ident check below? I think that supersedes it?
        if (!checkIdentReadable(lexerFlags, bindingType, identToken)) {
          THROW('Illegal keyword encountered; is not a value [' + identToken.str + ']');
        }
        fatalBindingIdentCheck(identToken, bindingType, lexerFlags);
        assignable = initAssignable(assignable);
    }
    ASSERT(assignable !== 0, 'everything that breaks should update this');

    return parseIdentOrParenlessArrow(lexerFlags, identToken, assignable, allowAssignment, astProp);
  }

  function verifyEvalArgumentsVar(lexerFlags) {
    if (hasNoFlag(lexerFlags, LF_STRICT_MODE)) return IS_ASSIGNABLE;

    if (isAssignBinOp()) {
      THROW('Cannot assign to `eval` and `arguments` in strict mode');
    }

    switch (curtok.str) {
      case '++':
      case '--':
        THROW('Cannot assign to `eval` and `arguments` in strict mode');
    }

    return NOT_ASSIGNABLE;
  }

  function parseTrueKeyword(astProp) {
    AST_open(astProp, 'Literal');
    AST_set('value', true);
    AST_set('raw', 'true');
    AST_close('Literal');
    return NOT_ASSIGNABLE;
  }
  function parseFalseKeyword(astProp) {
    AST_open(astProp, 'Literal');
    AST_set('value', false);
    AST_set('raw', 'false');
    AST_close('Literal');
    return NOT_ASSIGNABLE;
  }
  function parseNullKeyword(astProp) {
    AST_open(astProp, 'Literal');
    AST_set('value', null);
    AST_set('raw', 'null');
    AST_close('Literal');
    return NOT_ASSIGNABLE;
  }
  function parseSuperKeyword(lexerFlags, astProp) {
    // https://tc39.github.io/ecma262/#table-17
    // > GetSuperBase()	Return the object that is the base for super property accesses bound in this Environment Record.
    // > The object is derived from this Environment Record's [[HomeObject]] field. The value undefined indicates that
    // > super property accesses will produce runtime errors.
    // This implies super() must be called before access to the base. But that's a _runtime_ error.

    // The key is in ConstructorKind. In https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation
    // this ConstructorKind is set to "derived" if extending. Otherwise this value is "base".
    // When calling GetThisBinding an error is thrown if ThisBindingStatus is "uninitialized".
    // When calling NewFunctionEnvironment it will set ThisBindingStatus to "lexical" if ThisMode is lexical. Otherwise to uninitialized.
    // FunctionInitialize will set ThisMode to "lexical" if an arrow, "strict" if strict mode, and "global" otherwise.

    // `super` can only ever appear as `super()` or member expression `super.foo`
    // super member expressions (`super.foo`) can appear in class constructors and class/object methods
    // both can appear in arrows when the arrow is nested in the required construct

    // super.foo is "simple assignment target" (so `(super.foo) = x` is fine)

    // super properties never destruct and super cant be used on its own (so super cannot appear in arrows/args/bindings/etc)
    // super.foo ok in assignment pattern except for `rest` (https://tc39.github.io/ecma262/#sec-destructuring-assignment-static-semantics-early-errors)

    // args/body of `function` keyworded functions of any type cannot contain either form of `super` (search for "Contains SuperProperty")
    // `super()` is illegal inside (search for "HasDirectSuper"):
    // - toplevels
    // - anything that is not a class constructor (except nested arrows, which inherit these rules)
    // - anything that is static, a generator, or async
    // - constructors when its class does not use `extends` (same for nested arrows)
    // this makes `super()` legal in;
    // - constructors of classes that extend anything and are not static, async, or generator
    // - any arrow (including arg init) that is inside such constructors
    // - any arrow directly nested in such arrow

    // while deleting a super property is illegal, it is a runtime error

    // there seems to be no syntactical rule to throw an error if `this` is used before `super()`, which is a runtime
    // error. not even when you could statically determine the error. So let's not because tracking this is a PITA :)
    // the absence of `super()` with and without constructor of an extended class also seems not to be a syntax error.

    AST_open(astProp, 'Super');
    AST_close('Super');

    // now confirm the tail
    // TODO: should we just parse the tail now? I don't think so ... also don't think it's important to do now

    if (curc === $$PAREN_L_28) {
      // super()
      // super(..)
      if (hasNoFlag(lexerFlags, LF_SUPER_CALL)) THROW('Can only use `super()` in constructors of classes that extend another class');
      // the call expression isn't and we did not parse the tail anyways and `super` is not assignable...
      return NOT_ASSIGNABLE;
    }

    if (curc === $$SQUARE_L_5B || curtok.str === '.') {
      // super.foo
      // super[foo]
      if (hasNoFlag(lexerFlags, LF_SUPER_PROP)) {
        if (curc === $$SQUARE_L_5B)  {
          THROW('Can only use `super[foo]` in class or object methods or in arrows nested in those methods/arrows');
        } else {
          THROW('Can only use `super.foo` in class or object methods or in arrows nested in those methods/arrows');
        }
      }
      // the member expression might be but we did not parse the tail and `super` is not assignable...
      return NOT_ASSIGNABLE;
    }

    THROW('The `super` keyword can only be used as call or member expression');
  }
  function parseNewKeyword(lexerFlags, astProp) {
    // Just parsed the `new` keyword at the start of an expression, should already have
    // been consumed (but `new new x` is a valid expression so we can't assert it)

    // - `new foo()`
    // - `new foo;`
    // - `new.target`       (+ restrictions)
    // - `new.target[await x]`
    // - `new (foo);`
    // - `new (foo)();`
    // - `new foo()();`
    // - `new await foo;`   (illegal)
    // - `new (await foo);`
    // - `new x(await foo);`

    if (curtok.str === '.') return parseNewDotTarget(lexerFlags, astProp);
    return parseNewExpression(lexerFlags, astProp);
  }
  function parseNewDotTarget(lexerFlags, astProp) {
    // - `new.target`
    // - `new.foo`

    if (hasNoFlag(lexerFlags, LF_CAN_NEW_DOT_TARGET)) {
      // only valid if there is at least one scope in the scope tree that is not an arrow scope
      // - `() => new.target`
      // - TODO: `function f(x=() => new.target) {}`
      THROW('Must be inside/nested a regular function to use `new.target`');
    }

    ASSERT_skipAny('.', lexerFlags); // already asserted the dot, next token must be `target`
    if (curtok.str !== 'target') THROW('Can only read `new.target`, no other "properties" from `new`');
    AST_open(astProp, 'MetaProperty');
    AST_open('meta', 'Identifier');
    AST_set('name', 'new');
    AST_close('Identifier');
    AST_open('property', 'Identifier');
    AST_set('name', 'target');
    AST_close('Identifier');
    ASSERT_skipDiv('target', lexerFlags); // new.target / foo
    AST_close('MetaProperty');

    return NOT_ASSIGNABLE;
  }
  function parseNewExpression(lexerFlags, astProp) {
    AST_open(astProp, 'NewExpression');
    AST_set('arguments', []);

    // new can parse a MemberExpression (https://tc39.github.io/ecma262/#prod-MemberExpression)
    // member expressions are quite limited;
    // - a.b             (where a is recursively a memberexpression)
    // - a[b]            (where a is recursively a memberexpression)
    // - a`b`            (where a is recursively a memberexpression)
    // - super.b
    // - new.target      (already checked so cannot be here)
    // - another new
    // - primary;
    //   - this
    //   - identifier ref
    //   - literal
    //   - array
    //   - object
    //   - function expr
    //   - class expr
    //   - generator
    //   - async func
    //   - regex
    //   - template
    //   - group (but not arrow as per the Supplemental Syntax)
    // the `new await` legacy cases are handled in the await-parser
    // - `new await`
    // - `new await x`
    // - `new await()`
    // - `new await()()`
    // - `new await x()`
    // - `new await x()()`
    // - `new b↵++c;`

    // Note: the `isNewArg` state will make sure the `parseValueTail` function properly deals with the first call arg
    parseValue(lexerFlags, ASSIGN_EXPR_IS_ERROR, IS_NEW_ARG, 'callee');
    AST_close('NewExpression');
    return NOT_ASSIGNABLE;
  }
  function parseThisKeyword(astProp) {
    AST_open(astProp, 'ThisExpression');
    AST_close('ThisExpression');
    return NOT_ASSIGNABLE;
  }
  function parseUnary(lexerFlags, isNewArg, astProp) {
    ASSERT(parseUnary.length === arguments.length, 'arg count');

    let identName = curtok.str;
    skipRex(lexerFlags); // next can be regex (+/x/.y), though it's very unlikely

    if (isNewArg === IS_NEW_ARG) THROW('Cannot '+identName+' inside `new`');

    return _parseUnary(lexerFlags, identName, astProp);
  }
  function _parseUnary(lexerFlags, identName, astProp) {
    ASSERT(_parseUnary.length === arguments.length, 'arg count');
    ASSERT(['+', '-', '~', '!', 'void', 'typeof'].includes(identName), '++, --, delete, new, yield, and await have special parsers', identName);

    // - `!x`
    // - `~yield`                        // ok outside strict & generator
    // - `function *f(){ ~yield }`       // error
    // - `+await x`                      // ok, await state needs to propagate back down for strict mode arg check case

    AST_open(astProp, 'UnaryExpression');
    AST_set('operator', identName);
    AST_set('prefix', true);
    // dont parse just any standard expression. instead stop when you find any infix operator
    let assignable = parseValue(lexerFlags, ASSIGN_EXPR_IS_ERROR, NOT_NEW_ARG, 'argument');
    AST_close('UnaryExpression');

    if (curtok.str === '**') {
      // [x]: `~3 ** 2;`
      // [x]: `typeof 3 ** 2;`
      THROW('The lhs of ** can not be this kind of unary expression (syntactically not allowed, you have to wrap something)');
    }
    return setNotAssignable(assignable);
  }
  function parseUpdatePrefix(lexerFlags, isNewArg, astProp) {
    ASSERT(parseUpdatePrefix.length === arguments.length, 'arg count');
    // note: this is ++/-- PREFIX. This version does NOT have newline restrictions!
    if (isNewArg === IS_NEW_ARG) {
      // [x]: `new ++x`
      // [x]: `new ++x.y`
      // [x]: `new ++x().y`
      THROW('Cannot `new` on an inc/dec expr');
    }

    AST_open(astProp, 'UpdateExpression');
    AST_set('operator', curtok.str);
    AST_set('prefix', true);
    ASSERT_skipRex($PUNCTUATOR, lexerFlags); // next can be regex (++/x/.y), though it's very unlikely
    let assignable = parseValue(lexerFlags, ASSIGN_EXPR_IS_ERROR, NOT_NEW_ARG, 'argument');

    // <SCRUB AST>
    // Using the AST for this because in the current propagation system we can only tell whether the parsed part
    // is assignable or not, and in this reading something that can be destructured can be assigned to.
    let argNode = _path[_path.length - 1] && _path[_path.length - 1].argument;
    if (!argNode || (argNode.type !== 'Identifier' && argNode.type !== 'MemberExpression')) {
      // - `++[]`
      // - `--f()`
      // - `++this`
      THROW('Can only pre-increment or pre-decrement an identifier or member expression');
    }
    // </SCRUB AST>

    AST_close('UpdateExpression');

    if (notAssignable(assignable)) THROW('Cannot inc/dec a non-assignable value as prefix');
    return setNotAssignable(assignable);
  }

  function parseYield(lexerFlags, yieldIdentToken, allowAssignment, astProp) {
    ASSERT(arguments.length === parseYield.length, 'arg count');
    ASSERT(yieldIdentToken !== curtok, 'should have consumed the ident already');
    ASSERT(yieldIdentToken.str === 'yield', 'should receive the yield keyword token that was already consumed');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // Parse an async arrow as a plain call to `async` first, inheriting the async/generator state. Then when you
    // see the arrow apply the cover grammar which disallows yield to be parsed as a yield-expression, triggering a
    // syntax error. So that means we can parse it as whatever the state while considering a YieldExpression to be
    // not arrowable. That way if it turns out to be an arrow we don't first have to run a check for YieldExpressions
    // and correct to account for [~Yield] if we see the arrow. It just fails.

    if (hasAnyFlag(lexerFlags, LF_IN_GENERATOR)) {
      return parseYieldKeyword(lexerFlags, allowAssignment, astProp);
    }
    return parseYieldVarname(lexerFlags, yieldIdentToken, allowAssignment, astProp);
  }
  function parseYieldKeyword(lexerFlags, allowAssignment, astProp) {
    ASSERT(parseYieldKeyword.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    if (hasAllFlags(lexerFlags, LF_IN_FUNC_ARGS)) {
      // Could still be arrow header, but we won't know that until much later. However, this causes destructible=false.
      // - `function *f(){ return function(x = yield y){}; }`
      THROW('The `yield` keyword in arg default must be a var name but that is not allowed inside a generator');
    }

    if (curc === $$FWDSLASH_2F && curtok.nl) {
      // [x]: `function* f(){ yield↵/foo }`
      // [x]: `function* f(){ yield↵/foo/ }`
      // [x]: `function* f(){ yield↵/foo/g }`
      THROW('Yield keyword can not be followed by a regular expression on the next line');
    }

    if (allowAssignment === ASSIGN_EXPR_IS_ERROR) {
      // note: yield is a recursive AssignmentExpression (its optional argument can be an assignment or another yield)
      // Since `yield` is an AssignmentExpression it cannot appear after a non-assignment operator. (`5+yield x` fails)

      // This basically prevents the `5 + yield x` kinds of cases
      // - `function *f(){ return 5 + yield x; }`

      THROW('Did not expect to parse an AssignmentExpression but found `yield`');
    }

    AST_open(astProp, 'YieldExpression');
    AST_set('delegate', false); // TODO ??
    parseYieldArgument(lexerFlags, 'argument'); // takes care of newline check
    AST_close('YieldExpression');

    if (curc === $$QMARK_3F) {
      ASSERT(curtok.str === '?', 'just in case more tokens can start with `?`');
      THROW('Can not have a `yield` expression on the left side of a ternary');
    }
    return NOT_ASSIGNABLE | PIGGY_BACK_SAW_YIELD_KEYWORD;
  }
  function parseYieldVarname(lexerFlags, identToken, allowAssignment, astProp) {
    ASSERT(parseYieldVarname.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // `yield` _must_ be a treated as a regular var binding now

    if (hasAllFlags(lexerFlags, LF_STRICT_MODE)) {
      THROW('Cannot use `yield` outside of generator functions when in strict mode');
    }

    // `yield` is a var name in sloppy mode:
    parseIdentOrParenlessArrow(lexerFlags, identToken, IS_ASSIGNABLE, allowAssignment, astProp);
    return IS_ASSIGNABLE | PIGGY_BACK_SAW_YIELD_VARNAME;
  }
  function parseYieldArgument(lexerFlags, astProp) {
    // there can be no newline between keyword `yield` and its argument (restricted production)
    let hadValue = curtok.nl ? false : parseYieldValueMaybe(lexerFlags, ASSIGN_EXPR_IS_OK, astProp);
    if (hadValue === YIELD_WITHOUT_VALUE) {
      AST_set(astProp, null);
    } else {
      // Since this is parsing a yield expression it won't matter whether it also parsed an `await` or `yield`
      // inside the `yield` (like `yield (await foo)`) since it's invalid in args regardless.
      parseExpressionFromOp(lexerFlags, hadValue === WITH_ASSIGNABLE ? IS_ASSIGNABLE : NOT_ASSIGNABLE, astProp);
    }
  }

  function parseIdentOrParenlessArrow(lexerFlags, identToken, assignable, allowAssignment, astProp) {
    ASSERT(parseIdentOrParenlessArrow.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // assume an identifier has just been parsed and that it should be considered a regular var name
    // (in the case of `await`, consider it a regular var)
    if (curc === $$IS_3D && curtok.str === '=>') {
      ASSERT(isAssignable(assignable), 'not sure whether an arrow can be valid if the arg is marked as non-assignable');
      parseArrowParenlessFromPunc(lexerFlags, identToken, allowAssignment, ARGS_SIMPLE, NOT_ASYNC, astProp);
      return NOT_ASSIGNABLE;
    } else {
      AST_setIdent(astProp, identToken);
      return assignable;
    }
  }

  function parseArrowParenlessFromPunc(lexerFlags, identToken, allowAssignment, wasSimple, isAsync, astProp) {
    ASSERT(parseArrowParenlessFromPunc.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    if (curtok.str !== '=>') {
      // [x]: `function *g() { async yield = {}; }`
      THROW('An `async` followed by an identifier should lead to an arrow function, found something unexpected');
    }
    if (hasAllFlags(lexerFlags, LF_IN_GENERATOR) && identToken.str === 'yield') {
      // [x]: `function *g() { async yield => {}; }`
      THROW('Arrows cannot be generators and parenless `yield` param in a generator would be parsing a yield expression and fail at the arrow');
    }

    // - `x => x`
    //      ^
    // - `async x => x`
    //            ^
    // - `eval => x`
    // - `async eval => x`

    if (curtok.nl) {
      // - `async x \n => x`
      THROW('The arrow is a restricted production an there can not be a newline before `=>` token');
    }
    ASSERT((identToken.str === 'eval' || identToken.str === 'argument') ? wasSimple === ARGS_COMPLEX : true, 'eval and arguments must pass on complex so they throw if the body contains use strict');
    ASSERT(!((identToken.str === 'eval' || identToken.str === 'argument') && hasAllFlags(lexerFlags, LF_STRICT_MODE)), 'caller should throw for eval/argument already in strict mode');
    if (hasAnyFlag(lexerFlags, LF_STRICT_MODE) && identToken.str === 'yield') {
      TODO//: can it hit here at all? `yield => {}` doesn't seem to reach here
      THROW('Yield in generator or strict mode is keyword');
    }

    // arrow with single param
    AST_open(astProp, 'ArrowFunctionExpression');
    AST_set('params', []);

    let arrowScoop = SCOPE_create('parseArrowParenlessFromPunc');
    let paramScoop = SCOPE_addLexTo(arrowScoop, ARG_SCOPE, 'parseArrowParenlessFromPunc(arg)');
    if (exposeScopes) AST_set('$scope', paramScoop);
    ASSERT(paramScoop._ = 'parenless arrow scope');
    SCOPE_addBindingAndDedupe(lexerFlags, paramScoop, identToken.str, BINDING_TYPE_ARG, ORIGIN_NOT_VAR_DECL);

    if (identToken.str === 'await' && hasAnyFlag(lexerFlags, LF_IN_ASYNC)) {
      // - `async function f(){ return await => {}; }`
      THROW('Cannot use `await` as an arrow parameter name inside another async function');
    }

    AST_setIdent('params', identToken);

    parseArrowFromPunc(lexerFlags, paramScoop, isAsync, allowAssignment, wasSimple);
    AST_close('ArrowFunctionExpression');
  }

  function parseTickExpression(lexerFlags, astProp) {
    // basically; parse tick. if head, keep parsing body until parsing tail
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(hasNoFlag(lexerFlags, LF_IN_TEMPLATE) || isTemplateStart(curtype), 'if in template this function can only be called by the head of a nested template', debug_toktype(curtype));

    AST_open(astProp, 'TemplateLiteral');
    AST_set('expressions', []);
    AST_set('quasis', []);

    let awaitYieldFlagsFromAssignable = 0;

    if (hasAllFlags(curtype, $TICK_PURE)) {
      parseQuasiPart(lexerFlags, IS_QUASI_TAIL);
    } else if (hasAllFlags(curtype, $TICK_HEAD)) {
      parseQuasiPart(lexerFlags | LF_IN_TEMPLATE, NOT_QUASI_TAIL);

      // keep parsing expression+tick until tick-tail
      do {
        awaitYieldFlagsFromAssignable |= parseExpressions(lexerFlags | LF_IN_TEMPLATE, ASSIGN_EXPR_IS_OK, 'expressions');

        AST_open('quasis', 'TemplateElement');
        AST_set('tail', hasAllFlags(curtype, $TICK_TAIL));
        AST_set('value', {raw: curtok.str, cooked: '<TODO>'});
        AST_close('TemplateElement');
        if (hasAllFlags(curtype, $TICK_BAD_ESCAPE)) {
          THROW('Template contained an illegal escape, these are only allowed in _tagged_ templates');
        }
        if (!hasAllFlags(curtype, $TICK_BODY) && !hasAllFlags(curtype, $TICK_TAIL)) {
          THROW('The first token after the template expression should be a continuation of the template');
        }
        if (hasAllFlags(curtype, $TICK_BODY)) {
          ASSERT_skipRex(curtok.str, lexerFlags | LF_IN_TEMPLATE); // first token in template expression can be regex
        }
        else if (hasAllFlags(curtype, $TICK_TAIL)) {
          ASSERT_skipDiv(curtok.str, lexerFlags); // first token after template expression can be div
          break;
        }
        else {
          THROW('Unclosed template');
        }
      } while (true);
    } else {
      if (hasAllFlags(curtype, $TICK_BAD_ESCAPE)) THROW('Template containd bad escape');
      THROW('Template should start as head or pure');
    }

    AST_close('TemplateLiteral');

    // - `x${await x}y`
    return awaitYieldFlagsFromAssignable;
  }

  function parseQuasiPart(lexerFlags, tail) {
    ASSERT(arguments.length === parseQuasiPart.length, 'arg count');
    AST_open('quasis', 'TemplateElement');
    AST_set('tail', tail);
    AST_set('value', {raw: curtok.str, cooked: '<TODO>'});

    if (hasAllFlags(curtype, $TICK_BAD_ESCAPE)) {
      THROW('Template contained an illegal escape', debug_toktype(curtype), ''+curtok, curtype, $TICK_BAD_ESCAPE);
    }
    if (hasAllFlags(curtype, $TICK_PURE)) {
      ASSERT_skipDiv(curtok.str, lexerFlags);
    } else {
      ASSERT(hasAllFlags(curtype, $TICK_HEAD), 'not used for other ticks');
      ASSERT_skipRex(curtok.str, lexerFlags); // note: dont set IN_TEMPLATE here because a pure template wont want it
    }
    AST_close('TemplateElement');
  }

  function parseValueTail(lexerFlags, assignable, isNewArg, astProp) {
    ASSERT(parseValueTail.length === arguments.length, 'arg coung');
    ASSERT(isNewArg === IS_NEW_ARG || isNewArg === NOT_NEW_ARG, 'enum');
    ASSERT(typeof assignable === 'number', 'assignablenum', assignable);
    ASSERT(typeof astProp === 'string', 'should be string');

    // <SCRUB AST>
    // Unfortunately there's no trivial way of doing this check without a lot
    // more unmaintainable spaghetti return code. Maybe later. For now the arrow
    // tail checks can only be done with AST enabled.
    if (
      _path[_path.length - 1] && (
        (_path[_path.length - 1].type === 'ArrowFunctionExpression' && _path[_path.length - 1].expression === false) ||
        (_path[_path.length - 1][astProp] && _path[_path.length - 1][astProp].type === 'ArrowFunctionExpression' && _path[_path.length - 1][astProp].expression === false)
      )
    ) {
      // - `()=>{}.foo`
      // - `()=>{}[foo]`
      // - `()=>{}(foo)`
      // - `()=>{}`foo``
      // - `()=>{}++`
      // - `()=>{}--`
      return NOT_ASSIGNABLE;
    }
    // </SCRUB AST>

    if (curc === $$DOT_2E && curtok.str === '.') {
      ASSERT_skipAny('.', lexerFlags); // TODO: optimize; next must be identifier
      if (curtype !== $IDENT) THROW('Dot property must be an identifier');
      AST_wrapClosed(astProp, 'MemberExpression', 'object');
      AST_setIdent('property', curtok);
      ASSERT_skipDiv($IDENT, lexerFlags); // x.y / z is division
      AST_set('computed', false); // x[y] vs x.y
      AST_close('MemberExpression');
      assignable = parseValueTail(lexerFlags, setAssignable(assignable), isNewArg, astProp);
    }
    else if (curc === $$SQUARE_L_5B) {
      AST_wrapClosed(astProp, 'MemberExpression', 'object');
      ASSERT_skipRex('[', lexerFlags);
      let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'property'); // no comma (!)
      // - `foo[await bar]`
      assignable = mergeAssignable(nowAssignable, assignable);
      skipDivOrDieSingleChar($$SQUARE_R_5D, lexerFlags);
      AST_set('computed', true); // x[y] vs x.y
      AST_close('MemberExpression');
      assignable = parseValueTail(lexerFlags, setAssignable(assignable), isNewArg, astProp);
    }
    else if (curc === $$PAREN_L_28) {
      ASSERT(curtype === $PUNCTUATOR && curtok.str === '(');
      if (isNewArg === IS_NEW_ARG) { // exception for `new`
        let nowAssignable = parseCallArgs(lexerFlags, 'arguments');
        if (curtok.str === '=>') {
          THROW('The `new` keyword can not be applied to an arrow');
        }
        // new stops parsing the rhs after the first call args
        assignable = mergeAssignable(nowAssignable, assignable);
        assignable = setNotAssignable(assignable);
      } else {
        // Not `new`, parses tail, does not throw on `new async () =>`
        ASSERT(typeof astProp === 'string', 'should be string');
        AST_wrapClosed(astProp, 'CallExpression', 'callee');
        AST_set('arguments', []);
        let nowAssignable = parseCallArgs(lexerFlags, 'arguments');
        assignable = mergeAssignable(nowAssignable, assignable);
        AST_close('CallExpression');
        assignable = parseValueTail(lexerFlags, setNotAssignable(assignable), isNewArg, astProp);
      }
    }
    else if (curc === $$TICK_60 && isTemplateStart(curtype)) {
      // parseTaggedTemplate
      // note: in es9+ (only) it is legal for _tagged_ templates to contain illegal escapes ($TICK_BAD_ESCAPE)

      // tagged template is like a call but slightly special (and a very particular AST)
      AST_wrapClosed(astProp, 'TaggedTemplateExpression', 'tag');

      AST_open('quasi', 'TemplateLiteral');
      AST_set('expressions', []);
      AST_set('quasis', []);

      AST_open('quasis', 'TemplateElement');
      AST_set('value', {raw: curtok.str.slice(1, hasAllFlags(curtype, $TICK_PURE) ? -1 : -2), cooked: '<TODO>'});
      AST_set('tail', hasAllFlags(curtype, $TICK_PURE));
      // curtok skipped in loop or afterwards if loop is skipped
      AST_close('TemplateElement');

      if (!allowBadEscapesInTaggedTemplates && hasAllFlags(curtype, $TICK_BAD_ESCAPE)) {
        THROW('Template contained an illegal escape', debug_toktype(curtype), ''+curtok);
      }

      if (hasAllFlags(curtype, $TICK_HEAD)) {
        let lfbak = lexerFlags;
        lexerFlags = lexerFlags | LF_IN_TEMPLATE; // tell tokenizer to interpret `}` as template
        do {
          ASSERT_skipRex($TICK, lexerFlags); // f`x${/foo/}y`
          // - `a${b=c}d`           is valid
          // - `a${await foo}d`     should propagate await/yield state
          let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'expressions');
          assignable = mergeAssignable(nowAssignable, assignable);

          if ((targetEsVersion >= 6 && targetEsVersion < 9) && hasAllFlags(curtype, $TICK_BAD_ESCAPE)) {
            THROW('Template contained an illegal escape', debug_toktype(curtype), ''+curtok);
          }
          if (!hasAllFlags(curtype, $TICK_BODY) && !hasAllFlags(curtype, $TICK_TAIL)) {
            THROW('The first token after the tagged template expression should be a continuation of the template');
          }

          AST_open('quasis', 'TemplateElement');
          AST_set('value', {raw: curtok.str.slice(1, hasAllFlags(curtype, $TICK_TAIL) ? -1 : -2), cooked: '<TODO>'});
          AST_set('tail', hasAllFlags(curtype, $TICK_TAIL));
          AST_close('TemplateElement');
          if (hasAllFlags(curtype, $TICK_TAIL)) lexerFlags = lfbak; // should happen only once and always
        } while (!hasAllFlags(curtype, $TICK_TAIL)); // also fixes $EOF check so no infi loop
      } else {
        ASSERT(hasAllFlags(curtype, $TICK_PURE), 'isTemplateStart should have asserted that the type was either tick pure or head');
      }

      ASSERT_skipRex($TICK, lexerFlags); // f`x`\n/foo/
      AST_close('TemplateLiteral');
      AST_close('TaggedTemplateExpression');

      assignable = parseValueTail(lexerFlags, setNotAssignable(assignable), isNewArg, astProp);
    }
    else if (isNewArg === IS_NEW_ARG) {
      // new rhs only parses a subset of tails
      assignable = setNotAssignable(assignable);
    }
    else if ((curc === $$PLUS_2B && curtok.str === '++') || (curc === $$DASH_2D && curtok.str === '--')) {
      assignable = parseUpdateExpressionSuffix(lexerFlags, assignable, astProp);
    }
    return assignable;
  }
  function parseUpdateExpressionSuffix(lexerFlags, assignable, astProp) {
    ASSERT(curtok.str === '++' || curtok.str === '--', 'only for update unaries');
    // if there is a newline between the previous value and UpdateExpression (++ or --) then it is not postfix
    // https://tc39.github.io/ecma262/#sec-rules-of-automatic-semicolon-insertion
    // https://tc39.github.io/ecma262/#prod-UpdateExpression
    // ASI should be attempted... this may be very invalid here, though. so we need to validate that somehow.
    // examples;
    // - `foo\n++bar` -> `foo;++bar;`
    // - `foo\n++\nbar` -> `foo;++bar;`
    // - `++\nfoo;` -> `++foo;`
    // - `foo\n++` -> `foo;++` -> error
    // - `if (foo\n++);` -> error

    // ok when inside a: expression statement, return statement, throw statement, var/let/const decl, export (?)

    if (curtok.nl) {
      // note: this is ++/-- SUFFIX. This version DOES have newline restrictions!
      // a restricted production has no tail
      // do nothing. nothing further gets parsed. and since next token is ++ or -- there is no risk of "overaccepting" here
      // caller can return assignability though it won't matter as there's no scenario where the next token causes assignment
      if (hasAllFlags(lexerFlags, LF_NO_ASI)) {
        THROW('The postfix ++/-- is a restricted production so ASI must apply but that is not valid in this context');
      }
      return assignable;
    }

    // check for this _after_ the newline check, for cases like
    if (notAssignable(assignable)) {
      // - `"foo"\n++bar`
      THROW('Cannot inc/dec a non-assignable value as postfix');
    }

    // <SCRUB AST>
    // Using the AST for this because in the current propagation system we can only tell whether the parsed part
    // is assignable or not, and in this reading something that can be destructured can be assigned to.
    let prev = _path[_path.length - 1] && _path[_path.length - 1][astProp];
    // Note: the for-case is nasty because when parsing the lhs the AST is not yet populated with a `for` statement
    // because that particular node type depends on `in`, `of`, or a semi. So the AST could be an array (block body)
    if (
      !prev ||
      (
        prev instanceof Array ?
          // - `for (x--;;);`
          !prev.length || (prev[prev.length - 1].type !== 'Identifier' && prev[prev.length - 1].type !== 'MemberExpression') :
          // - `[]++`
          (prev.type !== 'Identifier' && prev.type !== 'MemberExpression')
      )
    ) {
      // - `[]++`
      // - `f()--`
      // - `this++`
      THROW('Can only post-increment or post-decrement an identifier or member expression');
    }
    // </SCRUB AST>

    AST_wrapClosed(astProp, 'UpdateExpression', 'argument');
    AST_set('operator', curtok.str);
    AST_set('prefix', false);
    ASSERT_skipDiv($PUNCTUATOR, lexerFlags);
    AST_close('UpdateExpression');
    return NOT_ASSIGNABLE;
  }
  function parseCallArgs(lexerFlags, astProp) {
    ASSERT_skipRex('(', lexerFlags);
    lexerFlags |= LF_NO_ASI;
    let assignable = 0;
    if (curc === $$PAREN_R_29) {
      ASSERT_skipDiv(')', lexerFlags);
    } else {
      do {
        if (curc === $$DOT_2E && curtok.str === '...') {
          AST_open(astProp, 'SpreadElement');
          ASSERT_skipRex($PUNCTUATOR, lexerFlags); // next token is expression start
          let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'argument');
          assignable = mergeAssignable(nowAssignable, assignable);
          AST_close('SpreadElement');
        } else {
          let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, astProp);
          assignable = mergeAssignable(nowAssignable, assignable);
        }
        if (curc !== $$COMMA_2C) break;
        ASSERT_skipRex(',', lexerFlags);
        if (curc === $$PAREN_R_29) {
          // `x(a,b,)`
          if (allowTrailingFunctionComma) break;
          THROW('Targeted language version does not support trailing call arg comma');
        }
      } while (true);
      skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags);
    }
    return assignable;
  }

  function parseArrowFromPunc(lexerFlags, paramScoop, isAsync, allowAssignment, wasSimple) {
    ASSERT(arguments.length === parseArrowFromPunc.length, 'arg count');
    ASSERT(isAsync === NOT_ASYNC || isAsync === WAS_ASYNC, 'isasync bool');
    ASSERT_skipRex('=>', lexerFlags); // `{` or any expression
    ASSERT_ASSIGN_EXPR(allowAssignment);

    ASSERT(_path[_path.length - 1] && _path[_path.length - 1].params, 'params should be wrapped in arrow node now');
    ASSERT(!isAsync || allowAsyncFunctions, 'async = es8');

    ASSERT(paramScoop && paramScoop.lex && paramScoop.lex.type === ARG_SCOPE, 'this func should receive a param scoop', paramScoop);

    if (allowAssignment === ASSIGN_EXPR_IS_ERROR) {
      // - `delete foo => bar`
      // - `new foo => bar`
      // - `await foo => bar`
      // - `delete async (x) => y`
      // - `delete (foo) => x;`
      // - `delete (foo) => bar`
      // - `++(x) => b`
      // - `new (x) => {}`
      THROW('Was parsing a value that could not be AssignmentExpression but found an arrow');
    }

    if (exposeScopes) AST_set('$scope', paramScoop);
    AST_set('id', null);
    AST_set('generator', false);
    AST_set('async', isAsync === WAS_ASYNC);

    lexerFlags = resetLexerFlagsForFuncAndArrow(lexerFlags, NOT_GENERATOR, isAsync, IS_ARROW);
    if (curc === $$CURLY_L_7B) {
      lexerFlags = sansFlag(lexerFlags, LF_IN_FOR_LHS); // this state _is_ reset for block-body arrows, albeit futile
      AST_set('expression', false); // "body of arrow is block"
      let arrowScoop = SCOPE_addLexTo(paramScoop, BLOCK_SCOPE, 'parseArrowFromPunc');
      parseBlockStatement(
        sansFlag(lexerFlags | LF_IN_SCOPE_ROOT, LF_IN_GLOBAL | LF_IN_SWITCH | LF_IN_ITERATION),
        arrowScoop,
        {_: 'arrow labels'},
        IS_EXPRESSION,
        PARSE_DIRECTIVES,
        wasSimple,
        INC_DECL,
        'body'
      );
    } else {
      // Note: you cannot await in a regular arrow, so this is illegal:
      // - `async function f(fail = () => await x){}`
      // And for async the propagation of await/yield is irrelevant because the `await` won't count as being a default:
      // - `async function f(fail = async () => await x){}`
      // This is somewhat similar to a regular function, which may be more intuitive:
      // - `async function f(fail = async function(){await x}){}`
      // (Spec wise; the code in the function does not run immediately so there is no race condition to protect)
      // Note: in `for-in` headers, the LF_IN_FOR_LHS flag is NOT reset for expr-body arrows (doesn't matter much, both error)
      AST_set('expression', true); // "body of arrow is expr"
      parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'body');
    }

    // TODO: this may be superseded by assign-expr checks
    if (hasAllFlags(lexerFlags, LF_IN_FOR_LHS) && curtok.str === 'in') {
      THROW('Arrows cannot be lhs to for-in');
    }
    // Arrows cannot have tails. Most expressions will consume them, but not `x++` for example. So do after either path.
    if (curtok.str === '.') {
      THROW('Block body arrows can not be immediately accessed without a group');
    }
    if (curc === $$PAREN_L_28) {
      THROW('Block body arrows can not be immediately invoked without a group');
    }
    if (curc === $$SQUARE_L_5B) {
      THROW('Block body arrows can not be immediately accessed without a group');
    }
    if (curc === $$TICK_60) {
      THROW('Block body arrows can not be immediately tagged without a group');
    }
    if ((isAssignBinOp() || isNonAssignBinOp(lexerFlags)) && (!curtok.nl || curc === $$FWDSLASH_2F)) {
      // - `()=>{}+a'
      THROW('An arrow function can not be part of an operator to the right');
    }
    if ((curtok.str === '++' || curtok.str === '--') && !curtok.nl) {
      // - `()=>{}++'
      // - `()=>{}--'
      // - `()=>{}\n++x'
      // - `()=>{}\n--x'
      THROW('An arrow function can not have a postfix update operator');
    }
  }
  function parseGroupToplevels(lexerFlags, asyncStmtOrExpr, allowAssignment, asyncToken, newlineAfterAsync, astProp) {
    ASSERT(parseGroupToplevels.length === arguments.length, 'expecting args');
    ASSERT_ASSIGN_EXPR(allowAssignment);
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags); // `(/x/);`
    return _parseGroupToplevels(lexerFlags, asyncStmtOrExpr, allowAssignment, NOT_DELETE_ARG, asyncToken, newlineAfterAsync, astProp);
  }
  function _parseGroupToplevels(lexerFlagsBeforeParen, asyncStmtOrExpr, allowAssignmentForGroupToBeArrow, isDeleteArg, asyncToken, newlineAfterAsync, astProp) {
    ASSERT(arguments.length === _parseGroupToplevels.length, 'arg count');
    ASSERT(newlineAfterAsync === NOT_ASYNC_PREFIXED || newlineAfterAsync === IS_ASYNC_PREFIXED);
    ASSERT(typeof astProp === 'string');
    ASSERT_ASSIGN_EXPR(allowAssignmentForGroupToBeArrow);
    // = parseGroup(), = parseArrow()
    // will parse `=>` tail if it exists (except in async edge cases)
    // must return IS_ASSIGNABLE or NOT_ASSIGNABLE
    // returns whether the parsed expression is assignable
    // If this was `async` prefixed then the callsite will deal with the tail, arrow or not. This is because
    // it needs to take care of the `async \n (x) => z` case and clean up the AST properly.

    // notable remarks;
    // - empty group `()` is the only one that must be followed by an arrow (`=>`) unless async
    // - if a group has a top level assignable it is only ever assignable if the group does not have a comma
    // - the `(x)` case is the only case to be compoundable (so `(x.y)+=z` is not valid)
    // - if rest-pattern occurs anywhere as part of the group then the group _must_ be an arrow
    // - objects and arrows in a group are never assignable (you can only destructure by <arr/obj, `=`, init>, no group)

    // this function assumes you've just skipped the paren and are now in the first token of a group/arrow/async-call
    // this is either the arg of a delete, or any other group opener that may or may not have been prefixed with async
    let lexerFlags = sansFlag(lexerFlagsBeforeParen | LF_NO_ASI, LF_IN_FOR_LHS);

    // parse the group as if it were a group (also for the sake of AST)
    // while doing so keep track of the next three states. At the end
    // act accordingly.

    let arrowScoop = SCOPE_create('_parseGroupToplevels');
    let paramScoop = SCOPE_addLexTo(arrowScoop, ARG_SCOPE, '_parseGroupToplevels(arg)');
    if (exposeScopes) AST_set('$scope', paramScoop);
    ASSERT(paramScoop._ = 'arrow scope');

    if (curc === $$PAREN_R_29) {
      // special case; the `()` here must be the arrow header or (possibly) an `async()` function call

      if (asyncToken !== UNDEF_ASYNC) {
        skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags); // can be `async() / x`
        // all async prefixed cases are handled by special async call site
        // - `async ();`
        // - `async () => x`
        // - `async \n ();`
        // - `async \n () => x`
        // - `async () \n => x`
        // - `(async ());`
        // - `(async () => x)`
        // - `(async \n ());`
        // - `(async \n () => x)`
        // - `(async () \n => x)`

        return parseAfterAsyncGroup(
          lexerFlagsBeforeParen,
          paramScoop,
          asyncStmtOrExpr,
          allowAssignmentForGroupToBeArrow,
          ARGS_SIMPLE,
          false,
          newlineAfterAsync,
          MIGHT_DESTRUCT,
          true,
          asyncToken,
          ASSIGNABLE_UNDETERMINED,
          astProp
        );
      }

      skipAnyOrDieSingleChar($$PAREN_R_29, lexerFlags); // next must be `=>`

      if (curtok.str !== '=>') {
        THROW('Empty group must indicate an arrow, async(), or call()');
      }

      lexerFlags = lexerFlagsBeforeParen; // reset no_asi state to before the group

      if (curtok.nl) {
        // arrows with newlines are always an error
        // - `() \n => x`
        THROW('The arrow token `=>` is a restricted production and cannot have a newline preceding it');
      }

      // - `() => x`
      // - `( () => x )`
      // - `return () => x`

      AST_open(astProp, 'ArrowFunctionExpression');
      AST_set('params', []);
      parseArrowFromPunc(lexerFlags, paramScoop, NOT_ASYNC, allowAssignmentForGroupToBeArrow, ARGS_SIMPLE);
      AST_close('ArrowFunctionExpression');

      if (isDeleteArg === IS_DELETE_ARG) return NOT_SINGLE_IDENT_WRAP_NA;
      return NOT_ASSIGNABLE;
    }

    let foundSingleIdentWrap = false; // did we find `(foo)` ?
    let rootAstProp = astProp; // astprop changes after the first comma when the group becomes a SequenceExpression
    let destructible = MIGHT_DESTRUCT; // this function checks so many things :(
    let assignable = 0; // true iif first expr is assignable, always false if the group has a comma
    let toplevelComma = false;
    let wasSimple = ARGS_SIMPLE; // true if only idents and without assignment (so es5 valid)
    let mustBeArrow = false; // special case; a `...` must mean arrow, and a trailing comma must mean arrow as well

    while (curc !== $$PAREN_R_29) { // top-level group loop, list of ident, array, object, rest, and other expressions
      if (curtype === $IDENT) {
        // - (x)
        // - (x = y)
        // - (x, y)
        // - (x.foo)
        // - (x + foo)
        // - (x.foo = y)
        // - (true)
        // - (typeof x)
        // - (new x)

        // first scan next token to see what potential checks we need to apply
        const identToken = curtok;
        skipIdentSafeSlowAndExpensive(lexerFlags); // because `(x/y)` and `(typeof /x/)` need different next token states

        let wasAssignment = curtok.str === '=';
        let wasCommaOrEnd = curc === $$COMMA_2C || curc === $$PAREN_R_29;

        ASSERT(toplevelComma || curc !== $$PAREN_R_29 || assignable === 0, 'for group with one simple element, delete edge case');

        let exprAssignable = parseExpressionAfterIdent(lexerFlags, identToken, BINDING_TYPE_NONE, ASSIGN_EXPR_IS_OK, astProp);
        assignable = mergeAssignable(exprAssignable, assignable);
        SCOPE_addBinding(lexerFlags, paramScoop, identToken.str, BINDING_TYPE_ARG, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);

        if (wasAssignment) {
          // [v]: `(foo = x) => {}`
          //            ^
          // [x]: `(true = x) => {}`
          // [x]: `([dupe, a], dupe=x) => {}`
          // [v]: `delete (x=await)`
          wasSimple = ARGS_COMPLEX;
        }
        else if (wasCommaOrEnd) {
          // [v]: `(foo) => {}`
          //           ^
          // [x]: `(true) => {}`
          // group has multiple exprs, this ident is just an ident
          // - (x, ...);
          // - (x, ...) => ...
          // or this is the end of a group
          // - (x)
          // - (..., x)
          // or this is the delete edge case
          // - delete (foo)
          // - delete ((foo) => foo)
          // - delete ((foo).bar)

          if (!toplevelComma && curc === $$PAREN_R_29) {
            ASSERT(destructible === MIGHT_DESTRUCT, 'should not have parsed anything yet so destructible is still default');
            // ASSERT(assignable === 0, 'should still be the default');
            ASSERT(wasSimple === ARGS_SIMPLE, 'should still be the default');
            // this must be the case where the group consists entirely of one ident, `(foo)`
            // there may still be an arrow trailing, which this function should deal with too
            foundSingleIdentWrap = true; // move on to the arrow
          }

          // if curc is a comma then the group is not assignable but that will fail through the toplevelComma flag
          // if the group is just an identifier then it can be assigned to: `(a) = b`. There's a test. Or two.
          // If the group is not assignable then it can't become an arrow and we can skip a few related cases
          // If the arg name is eval or arguments and sloppy mode, then its assignable but not "simple"
          // SCOPE_addBinding(lexerFlags, paramScoop, identToken.str, BINDING_TYPE_ARG, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);
          if (notAssignable(assignable)) {
            // [x]: `(true) => {}`
            // [x]: `(eval) => {}`
            // [x]: `(arguments) => {}`
            destructible |= CANT_DESTRUCT;
            wasSimple = ARGS_COMPLEX; // if we can't assign to it then the name is a keyword of sorts
          } else if (
            // TODO: make this part more efficient :( Should check for keywords that are only keywords in strict mode
            identToken.str === 'eval' ||
            identToken.str === 'arguments' ||
            identToken.str === 'implements' ||
            identToken.str === 'package' ||
            identToken.str === 'protected' ||
            identToken.str === 'interface' ||
            identToken.str === 'private' ||
            identToken.str === 'public' ||
            identToken.str === 'yield' ||
            identToken.str === 'let'
          ) {
            // Mark the args as non-simple such that if the body contains a "use strict" directive, it will still throw
            // If already in strict mode then make an arrow illegal immediately.
            wasSimple = ARGS_COMPLEX;
            if (hasAllFlags(lexerFlags, LF_STRICT_MODE) ) {
              // [x]: `"use strict"; (eval) => { }`
              // [x]: `"use strict"; (arguments) => { }`
              destructible |= CANT_DESTRUCT;
            } else {
              // [x]: `(eval) => { "use strict"; }`
              // [x]: `(arguments) => { "use strict"; }`
            }
          } else {
            // The arg was not special under strict mode
            // [x]: `f = (foo) => { "use strict"; }`
            // [x]: `f = (async) => { "use strict"; }`
          }
        }
        else {
          // the token following this ident is not one valid in a destructuring assignment (unlike array/object)
          // parse a regular ident expression here
          // - `(typeof x)`
          destructible |= CANT_DESTRUCT;
          wasSimple = ARGS_COMPLEX;
        }
      }
      else if (curc === $$CURLY_L_7B) {
        // note: grouped object/array literals are _never_ assignable
        // - ({})
        // - ({..})
        // - ({..} = x)
        // - ({..}, x)
        // - ({..}.foo)
        // - ({..}.foo = x)
        // - ({..} + foo)
        destructible |= parseObjectOuter(lexerFlags, paramScoop, BINDING_TYPE_NONE, PARSE_INIT, NOT_CLASS_METHOD, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
        if (curc !== $$COMMA_2C && curc !== $$PAREN_R_29) {
          // Note: this is NOT destructible because we're in a group toplevel so an assignment would just be an
          // assignment, not a destructuring. And any tail would not lead to any kind of pattern. And destructuring
          // can not happen to groups, so `({x=y})=z` is not valid because of the parens. So cant destructure this.
          // Fixes `async ({} + 1) => x;`
          destructible |= CANT_DESTRUCT;
        }
        assignable = parseAfterPatternInGroup(lexerFlags, assignable, destructible, astProp);
        wasSimple = ARGS_COMPLEX;
      }
      else if (curc === $$SQUARE_L_5B) {
        // note: grouped object/array literals are _never_ assignable
        // - ([])
        // - ([..])
        // - ([..] = x)
        // - ([..], x)
        // - ([..].foo)
        // - ([..].foo = x)
        // - ([..] + foo)
        destructible |= parseArrayOuter(lexerFlags, paramScoop, BINDING_TYPE_NONE, PARSE_INIT, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
        if (curc !== $$COMMA_2C && curc !== $$PAREN_R_29) {
          // Note: this is NOT destructible because we're in a group toplevel so an assignment would just be an
          // assignment, not a destructuring. And any tail would not lead to any kind of pattern. And destructuring
          // can not happen to groups, so `({x=y})=z` is not valid because of the parens. So cant destructure this.
          // Fixes `async ({} + 1) => x;`
          destructible |= CANT_DESTRUCT;
        }
        assignable = parseAfterPatternInGroup(lexerFlags, assignable, destructible, astProp);
        wasSimple = ARGS_COMPLEX;
      }
      else if (curc === $$DOT_2E && curtok.str === '...') {
        // top level group dots kinda have to be rest but there is an `async` edge case where it could be spread
        wasSimple = ARGS_COMPLEX;
        destructible |= parseArrowableTopRest(lexerFlags, paramScoop, asyncToken !== UNDEF_ASYNC, astProp);
        if (asyncToken !== UNDEF_ASYNC) {
          // - `async(...x);`
          // - `async(...x,)`
          // - `async(...x,b)`
          // - `async(...x) => x`
          if (curc !== $$PAREN_R_29) {
            // These cases are not valid as arrows so the header cannot destruct.
            // - `async (...x,)`
            // - `async (...x,b)`
            destructible |= CANT_DESTRUCT; // Now the dots in async toplevel must mean spread/call
          } else {
            // These cases are valid both as a call to `async` as well as an async arrow, so do nothing
            // - `async(...x);`
            // - `async(...x) => x`
          }
        } else {
          // Note: `...` in toplevel of group can only mean rest, meaning an arrow must follow the group
          // This must also be the last element of the arrow header (can not have trailing comma)
          // - `(...x);`
          // - `(...x) => x`
          // - `(...x,) => x`

          mustBeArrow = true;
          break;
        }
      }
      else {
        // arbitrary expression that is not destructible at the toplevel of a group
        destructible |= CANT_DESTRUCT;

        let exprAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, astProp);
        // - `((a)) = b;`
        assignable = mergeAssignable(exprAssignable, assignable);
        if (curc === $$COMMA_2C) {
          if (!toplevelComma) {
            toplevelComma = true;
            AST_wrapClosedIntoArray(rootAstProp, 'SequenceExpression', 'expressions');
            astProp = 'expressions';
          }
          assignable = __parseExpressions(lexerFlags, assignable, astProp);
        }
        if (toplevelComma) {
          AST_close('SequenceExpression');
          assignable = setNotAssignable(assignable);
        }
        skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags);

        if (asyncToken !== UNDEF_ASYNC) {
          // the next token can not start something that appears in an arrow head so must be an async call
          // - `async("foo".bar);`
          //                    ^
          // - `async("foo".bar) => x`
          //                     ^
          // TODO: move this out because worst case you'll still have to do this down below so we shouldnt add repetitive complexity for this edge case
          return parseAfterAsyncGroup(lexerFlagsBeforeParen, paramScoop, asyncStmtOrExpr, allowAssignmentForGroupToBeArrow, wasSimple, toplevelComma, newlineAfterAsync, CANT_DESTRUCT, false, asyncToken, assignable, rootAstProp);
        }

        if (isDeleteArg === IS_DELETE_ARG) {
          // We need to propagate the await/yield state as well so prepare that first
          // - `delete ("x"[(yield)])`
          // - `delete ("x"[(await)])`
          // - `async x => delete ("x"[(await x)])`
          // - `function *f(){ delete ("x"[(yield)]) }`
          return copyPiggies(isAssignable(assignable) ? NOT_SINGLE_IDENT_WRAP_A : NOT_SINGLE_IDENT_WRAP_NA, assignable);
        }
        // - `((a)) = b;`
        return assignable;
      }

      if (curc !== $$COMMA_2C) break;

      ASSERT_skipRex(',', lexerFlags); // `(x, /y/);`

      if (curc === $$PAREN_R_29) {
        // [x]: `(a,)`
        //          ^
        // [v]: `async (a,);`
        //                ^
        // [v]: `async (a,) => x`
        // [x]: `(a,b,)`
        // [x]: `(a = b,)`
        // [x]: `([x],)`
        // [x]: `({a},)`
        // [x]: `([x] = y,)`
        // [x]: `({a} = b,)`
        // [x]: `(a,) = x`
        // [x]: `(a,b,) = x`
        // [x]: `(a = b,) = x`
        // [x]: `([x],) = x`
        // [x]: `({a},) = x`
        // [x]: `([x] = y,) = x`
        // [x]: `({a} = b,) = x`
        // [v]: `(a,) => {}`
        // [v]: `(a,b,) => {}`
        // [v]: `(a = b,) => {}`
        // [v]: `([x],) => {}`
        // [v]: `({a},) => {}`
        // [v]: `([x] = y,) => {}`
        // [v]: `({a} = b,) => {}`
        // [v]: `async(x,)`
        // [v]: `async(x,) => x`

        if (asyncToken === UNDEF_ASYNC) {
          if (allowTrailingFunctionComma) {
            // [v]: `(a,) => a`
            // This may only be valid in ES8+ and as an arrow. Any other case fails here.
            mustBeArrow = true;
            // trailing function commas do not affect the AST (so don't wrap in sequence)
            break;
          } else {
            // [x]: `(a,);`
            // [x]: `(a,) = x;`
            THROW('Encountered trailing comma in the toplevel of a group, this could be valid in arrows but not with the currently targeted language version');
          }
        } else {
          // [v]: `async(x,)`
          // [v]: `async(x,) => x`
        }
      }
      if (!toplevelComma) {
        toplevelComma = true;
        // only do this once
        AST_wrapClosedIntoArray(rootAstProp, 'SequenceExpression', 'expressions');
        astProp = 'expressions';
      }
    }

    if (toplevelComma) {
      assignable = setNotAssignable(assignable);
      AST_close('SequenceExpression');
    }

    // pick up the flags from assignable and put them in destructible
    // - `function *f() { (yield x ** y) }`
    // - `async(await);`
    // - `async function f(){ async(await x); }`
    // - `{ (x = yield) = {}; }`

    destructible = copyPiggies(destructible, assignable);
    // assignable = copyPiggies(assignable, destructible); // TODO: come up with a case where this is relevant. `(x=(yield)=y)=>z` ?

    skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags);

    lexerFlags = lexerFlagsBeforeParen; // ASI can happen again
    verifyDestructible(destructible);

    let isArrow = curtok.str === '=>';

    // First deal with arrow-error cases. But don't parse as async just yet (this is to dedupe the error checks)
    if (isArrow) {
      // These are some errors for async and plain arrows

      if (curtok.nl) {
        // we can safely throw here because there's no way that the `=>` token is valid without an arrow header
        THROW('Arrow is restricted production; cannot have newline before the arrow token');
      }
      if (hasAllFlags(destructible, CANT_DESTRUCT)) {
        // - `([...{a = b} = c]) => d;`
        THROW('The left hand side of the arrow is not destructible so arrow is illegal');
      }
      if (hasAllFlags(destructible, DESTRUCT_ASSIGN_ONLY)) {
        // - `([[].length]) => x;`
        THROW('The left hand side of the arrow can only be destructed through assignment so arrow is illegal');
      }
      if (hasAllFlags(destructible, PIGGY_BACK_SAW_AWAIT_KEYWORD)) {
        // - `async function a(){     (foo = await bar) => {}     }`
        THROW('The arguments of an arrow cannot contain an await expression in their defaults');
      }
      if (hasAllFlags(destructible, PIGGY_BACK_SAW_YIELD_KEYWORD)) {
        // = `async function f(){    (fail = class A {[await foo](){}; "x"(){}}) => {}    }`
        THROW('The arguments of an arrow cannot contain a yield expression in their defaults');
      }
      // The param name/default containing await/yield checks are done elsewhere...
      ASSERT(!(hasAllFlags(destructible, PIGGY_BACK_SAW_AWAIT_VARNAME) && (hasAllFlags(lexerFlags, LF_IN_ASYNC) || goalMode === GOAL_MODULE)), 'async arrows dont reach this place and nested in an async arrow triggers somewhere else so I dont think this case can occur');
      ASSERT(!(hasAllFlags(destructible, PIGGY_BACK_SAW_YIELD_VARNAME) && hasAnyFlag(lexerFlags, LF_IN_GENERATOR | LF_STRICT_MODE)), 'these checks occur elsewhere and I cant come up with a covering test case');
    } else if (hasAllFlags(destructible, MUST_DESTRUCT) || mustBeArrow) {
      // [x]: `(...x);`
      // [x]: `(a,)`
      // [x]: `(a,b,)`
      // [x]: `(a = b,)`
      // [x]: `({a = b})`
      THROW('Group contained a value that must destruct but this was not an arrow so it is invalid');
    }

    if (asyncToken !== UNDEF_ASYNC) {
      // `async(a);`
      // `async(a = await x);`
      // `async(a) => x`
      // `async(a = await x) => x`
      return parseAfterAsyncGroup(lexerFlags, paramScoop, asyncStmtOrExpr, allowAssignmentForGroupToBeArrow, wasSimple, toplevelComma, newlineAfterAsync, destructible, false, asyncToken, assignable, rootAstProp);
    }

    if (isArrow) {
      // arrow function
      // `(a) => {}`

      parseArrowAfterGroup(lexerFlags, paramScoop, wasSimple, toplevelComma, asyncToken, allowAssignmentForGroupToBeArrow, rootAstProp);
      // we just parsed an arrow. Whatever the state of await/yield was we can ignore that here.
      if (isDeleteArg === IS_DELETE_ARG) return NOT_SINGLE_IDENT_WRAP_NA;
      return NOT_ASSIGNABLE; // assignability resets after the arrow
    }

    // The remaining cases should be handled by caller
    // Note: the assignment is not parsed here.
    // - `(x) = (y) = z`
    // - `(x) = (1) = z`   // bad
    // - `(x) = (y) += z`
    // - `(x) = (1) += z`  // bad
    // - `(x) += (y) = z`  // bad
    // - `(x) += (1) = z`  // bad
    // - `(foo.x)`
    // - `(foo[x])`
    // - `(foo) += 3`
    // - `async (x = (x) = await f) => {}`
    // - `async (x = (x) += await f) => {}`
    // - `({a:(b) = c} = 1)`
    // - `(x = delete ((await) = f)) => {}`
    // - `(x = delete ((yield) = f)) => {}`
    // - `async (x = (await) = f) => {}`

    if (isDeleteArg === IS_DELETE_ARG) {
      // TODO: this is a non-bool value making the func poly :'( this case will never hit for the real
      //       world where perf matters, though. So it's mostly compiler inference that crap out

      // We need to propagate the await/yield state as well so prepare that first
      // - `async function a(){     async ([y] = delete ((foo[await x]))) => {};     }`
      // - `delete (((((foo(await)))))).bar`
      // - `delete (((((foo(yield)))))).bar`
      // - `function *f(){ delete (((((foo(yield)))))).bar }`
      let extraFlags = copyPiggies(0, assignable);

      if (foundSingleIdentWrap) {
        ASSERT(!toplevelComma, 'sanity check; the main loop should break after this state was found');
        if (isAssignable(assignable)) return IS_SINGLE_IDENT_WRAP_A | extraFlags;
        return IS_SINGLE_IDENT_WRAP_NA | extraFlags;
      }
      else {
        if (isAssignable(assignable)) return NOT_SINGLE_IDENT_WRAP_A | extraFlags;
        return NOT_SINGLE_IDENT_WRAP_NA | extraFlags;
      }
    }
    // a group. those still exist?
    // - `((a)) = b;`
    return assignable;
  }
  function parseAfterPatternInGroup(lexerFlags, assignable, destructible, astProp) {
    ASSERT(curtok.str !== '=', 'destruct assignments should be parsed at this point');
    if (curc !== $$COMMA_2C && curc !== $$PAREN_R_29) {
      // This is top level group so member expressions can not be destructured, however `(x.y)=z` should be valid
      // - ({}.x)
      //      ^
      // [v]: `[({a: 1}.c)] = [];`
      // [x]: `async ({x} = await bar);`
      // [x]: `async ({} + 1) => x;`
      // [v]: `({}.length);`
      // [x]: `({x: y}.length) => x;`
      // [x]: `({x = y}.z) => obj`
      // [x]: `({a: {x = y}}.z) => obj`
      // - `([x]++)`
      // - `([x].foo)`                    pass
      // - `([x].foo) = x`                pass
      // - `([x].foo) => x`               fail

      if (hasAllFlags(destructible, MUST_DESTRUCT)) {
        // if the object had to be a pattern then it can not have a tail because patterns aren't values.
        // - ({a=b}.x) => x
        //         ^
        // - ({a=b}[x]) => x
        // - ({a=b}(x)) => x
        // - ([{a=b}].x) => x
        //          ^
        // - ([{a=b}][x]) => x
        // - ([{a=b}](x)) => x

        // - Note: this cannot be `(PATTERN = x)` because there's an assertion above saying so. This must be an error.
        THROW('Pattern can not have a tail but did not find a comma or closing paren of the arrow header');
      }

      // - ({}.x)
      //      ^
      // - ([].x)
      //      ^
      let exprAssignable = parseValueTail(lexerFlags, NOT_ASSIGNABLE, NOT_NEW_ARG, astProp);
      assignable = mergeAssignable(exprAssignable, assignable);

      // If still not end of element of the group then parse a binary expression of some sort
      if (curc !== $$COMMA_2C && curc !== $$PAREN_R_29) {
        // [v]: `({} + 1);`
        //           ^
        // [x]: `({x} = await bar) => {}`
        //            ^
        // [x]: `async ({x} = await bar) => {}`
        //                  ^
        // [x]: `let z = async ({x} = await bar) => {}`
        // [x]: `async ({x} = await bar);`
        // [v]: `async ({} + 1);`
        // [x]: `async ({} + 1) => x;`
        // [v]: `([] + 1);`
        //           ^
        // [x]: `([x] = await bar) => {}`
        //            ^
        // [x]: `async ([x] = await bar) => {}`
        //                  ^
        // [x]: `let z = async ([x] = await bar) => {}`
        // [x]: `async ([x] = await bar);`
        // [v]: `async ([] + 1);`
        // [x]: `async ([] + 1) => x;`
        assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
      }
    } else {
      // Never assignable since destructuring assignments have to assign directly to the object `{x}=y` / array `[x]=y`
      // and we asserted to have parsed an assignment if there was any. Note: might still be destructible.
      // - `({x})`
      // - `({x}) => x`
      // - `([x])`
      // - `([x]) => x`
      assignable = setNotAssignable(assignable);
    }

    return assignable;
  }
  function parseAfterAsyncGroup(lexerFlags, paramScoop, fromStmtOrExpr, allowAssignment, wasSimple, toplevelComma, newlineAfterAsync, groupDestructible, zeroArgs, asyncToken, assignable, astProp) {
    ASSERT(parseAfterAsyncGroup.length === arguments.length, 'arg count');
    ASSERT(typeof groupDestructible === 'number', 'destructible num')
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // this is called after parsing a group that followed an `async` when it might be an async arrow
    if (curtok.str === '=>') {
      if (curtok.nl) {
        THROW('The arrow is a restricted production an there can not be a newline before `=>` token');
      }
      else if (newlineAfterAsync === IS_ASYNC_PREFIXED) {
        // - `async \n () => x`
        // - `async \n (x) => x`
        if (allowAsyncFunctions) {
          // see parseAsync for details on this error
          THROW('A newline after async is always a syntax error if the rhs turns to be an arrow function');
        } else {
          // In <=ES7 the parser would force to parse a call, not knowing that a newline after `async` might trigger
          // ASI. As such this case is still an error but for different reasons; It's parsed as `async(); => x`.
          THROW('Encountered unexpected arrow; <=ES7 the `async \\n (x) => x` case was always parsed as `async(x); => x`');
        }
      }
      else if (hasAnyFlag(groupDestructible, CANT_DESTRUCT | DESTRUCT_ASSIGN_ONLY)) {
        // - `async (...x, y) => x`            (rest must be last element and spread cannot be in arrow head)
        // - `async ({x=z}, y) => x;`          (shorthand default only valid as assign, never valid here)
        if (curtok.str === '=>') {
          // - `async (a, ...b=fail) => a;`
          THROW('The group was not destructible and yet the next token is an arrow');
        }
        TODO
      }
      else if (zeroArgs) {
        // - `async () => foo`
        parseArrowAfterAsyncNoArgGroup(lexerFlags, paramScoop, toplevelComma, asyncToken, allowAssignment, astProp);
      }
      else if (
        // - `async (foo = await x) => foo`            (fail)
        // have to check both assignable and destructible for the state flags
        hasAnyFlag(assignable, PIGGY_BACK_SAW_AWAIT_VARNAME | PIGGY_BACK_SAW_AWAIT_KEYWORD) ||
        hasAnyFlag(groupDestructible, PIGGY_BACK_SAW_AWAIT_VARNAME | PIGGY_BACK_SAW_AWAIT_KEYWORD)
      ) {
        if (hasAnyFlag(assignable, PIGGY_BACK_SAW_AWAIT_KEYWORD) || hasAnyFlag(groupDestructible, PIGGY_BACK_SAW_AWAIT_KEYWORD)) {
          THROW('Async arrow arg defaults can not contain `await` expressions');
        }
        // - `async await => foo`            (fail)
        THROW('Async arrows can not have arg bindings named `await` because it is considered a keyword');
      }
      else if (
        // Note: in strict mode all below cases fail since `yield` is then always a YieldExpression
        // - `async (foo = yield) => foo`                               (pass in sloppy)
        // - `async (foo = yield x) => foo`                             (fail)
        // - `async (foo = yield)`                                      (pass in sloppy)
        // - `async (foo = yield x)`                                    (fail)
        // - `function *f(){ async (foo = yield) => foo }`              (fail)
        // - `function *f(){ async (foo = yield x) => foo }`            (fail)
        // - `function *f(){ async (foo = yield) }`                     (pass)
        // - `function *f(){ async (foo = yield x) }`                   (pass)
        // have to check both assignable and destructible for the state flags, for now. hopefully I can merge them asap.
        (
          hasAnyFlag(lexerFlags, LF_IN_GENERATOR | LF_STRICT_MODE) &&
          (
            hasAnyFlag(assignable, PIGGY_BACK_SAW_YIELD_VARNAME) ||
            hasAnyFlag(groupDestructible, PIGGY_BACK_SAW_YIELD_VARNAME)
          )
        ) ||
        hasAnyFlag(assignable, PIGGY_BACK_SAW_YIELD_KEYWORD) ||
        hasAnyFlag(groupDestructible, PIGGY_BACK_SAW_YIELD_KEYWORD)
      ) {
        TODO
        if (hasAnyFlag(assignable, PIGGY_BACK_SAW_YIELD_KEYWORD) || hasAnyFlag(groupDestructible, PIGGY_BACK_SAW_YIELD_KEYWORD)) {
          // - `async (foo = await x) => foo`                             (fail)
          THROW('Async arrow arg defaults can not contain `yield` expressions');
        }
        // - `async yield => foo`                                 (pass in sloppy)
        // - `async (yield) => foo`                               (pass in sloppy)
        // - `function *f(){  async yield => foo  }`              (pass in sloppy)
        // - `function *f(){  async (yield) => foo  }`            (pass in sloppy)
        THROW('This async arrow can not have arg bindings named `yield` because it is contained in a generator or strict mode');
      }
      else {
        // - `async (foo) => foo`
        parseArrowAfterGroup(lexerFlags, paramScoop, wasSimple, toplevelComma, asyncToken, allowAssignment, astProp);
      }
    }
    else {

      if (zeroArgs) {
        // - `async ();`
        // - `async \n ();`

        AST_open(astProp, 'CallExpression');
        AST_setIdent('callee', asyncToken);
        AST_set('arguments', []);
        AST_close('CallExpression');
      }
      else {
        // - `async (a, b, c);`
        // - `async \n (a, b, c);`

        // <SCRUB AST>
        let node = _path[_path.length - 1];
        let args = node[astProp];
        if (args instanceof Array) args = args[0];
        ASSERT(args, 'should have parsed someting v1');
        if (args.type === 'SequenceExpression') args = args.expressions;
        else args = [args];
        ASSERT(args, 'should have parsed someting v2');
        if (node[astProp] instanceof Array) node[astProp] = [];
        else node[astProp] = undefined;

        // TODO: verify the args

        AST_open(astProp, 'CallExpression', true);
        AST_setIdent('callee', asyncToken);
        AST_set('arguments', args);
        AST_close('CallExpression');
        // </SCRUB AST>
      }

      let assignable = parseValueTail(lexerFlags, NOT_ASSIGNABLE, NOT_NEW_ARG, astProp);
      if (fromStmtOrExpr === IS_STATEMENT) {
        // in expressions operator precedence is handled elsewhere. in statements this is the start,
        assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
        parseSemiOrAsi(lexerFlags);
      }

      return assignable;
    }

    // we just parsed an arrow, nothing else.

    if (fromStmtOrExpr === IS_STATEMENT) {
      // if this is an async arrow at the statement start then we should allow to parse a sequence here
      if (curc === $$COMMA_2C) {
        // Note: since we're parsing expressions inside on the statement level we don't care about the assignable flags
        _parseExpressions(lexerFlags, initNotAssignable(), astProp);
      }
      parseSemiOrAsi(lexerFlags);
    }

    // an async prefixed group is never assignable:
    // - `async(x) = y`
    // - `async \n (x) = y` -> `async(x) = y`
    // - `async(x) => y`
    // - `async \n (x) => y` -> `async; (x) => y`
    // - `async () => {}, await foo
    return NOT_ASSIGNABLE; // dont care about await/yield flags here
  }
  function parseArrowAfterAsyncNoArgGroup(lexerFlags, paramScoop, toplevelComma, asyncToken, allowAssignment, astProp) {
    ASSERT(parseArrowAfterAsyncNoArgGroup.length === arguments.length, 'arg count');

    // The ast should look something like this now:
    // {
    //   type: 'ExpressionStatement',
    //     expression: {type: 'ArrayExpression', elements: []},
    // },
    // The `async` has not yet been consumed and we don't really need to do anything to fix it. Just parse an arrow
    // that has no arguments and move on.

    AST_open(astProp, 'ArrowFunctionExpression');
    AST_set('params', []);
    parseArrowFromPunc(lexerFlags, paramScoop, WAS_ASYNC, allowAssignment, ARG_WAS_SIMPLE);
    AST_close('ArrowFunctionExpression');
  }
  function parseArrowAfterGroup(lexerFlags, paramScoop, wasSimple, toplevelComma, asyncToken, allowAssignment, astProp) {
    ASSERT(parseArrowAfterGroup.length === arguments.length, 'arg count');
    ASSERT_ASSIGN_EXPR(allowAssignment);

    // <SCRUB AST>
    AST_wrapClosedIntoArray(astProp, 'ArrowFunctionExpression', 'params');

    let top = _path[_path.length - 1];
    if (toplevelComma) {
      ASSERT(top.params instanceof Array, 'these params should be an array');
      let params = top.params[top.params.length - 1];
      ASSERT(params.type === 'SequenceExpression', 'if toplevelComma then this is a sequence', astProp, params);
      ASSERT(params.expressions instanceof Array, 'if toplevelComma then node is a sequence and .expressions should be an array');
      top.params = params.expressions;
    }
    ASSERT(Array.isArray(top.params), 'params should now be an array in any case');
    let params = top.params;
    for (let i=0; i<params.length; ++i) {
      AST__destruct(params[i]);
    }
    // </SCRUB AST>

    // must assert unique parameters now
    if (SCOPE_verifyLexical(lexerFlags, paramScoop, true)) THROW('Arrow had at least one duplicate parameter name bound');

    parseArrowFromPunc(lexerFlags, paramScoop, !!asyncToken, allowAssignment, wasSimple);

    AST_close('ArrowFunctionExpression');
  }
  function parseArrowableTopIdentAssign(lexerFlags, scoop, identToken, assignable, astProp) {
    ASSERT(parseArrowableTopIdentAssign.length === arguments.length, 'arg count');

    // assignment / default init
    // - (x = y);
    // - (x = y) => z
    // - (x = y) = z;         error
    // must be valid bindable var name
    fatalBindingIdentCheck(identToken, BINDING_TYPE_NONE, lexerFlags);
    SCOPE_addBinding(lexerFlags, scoop, identToken.str, BINDING_TYPE_ARG, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);

    AST_setIdent(astProp, identToken);

    AST_wrapClosed(astProp, 'AssignmentExpression', 'left');
    AST_set('operator', '=');
    ASSERT_skipRex('=', lexerFlags);
    // The arg default can not contain an await- or yield-expression in any way. But that's only relevant if arrow...
    let rhsAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');

    AST_close('AssignmentExpression');

    // https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-assignmenttargettype
    // an assignment is NOT assignable (it's right associative which makes `x=x=x` work but not `(x=x)=x`)
    return setNotAssignable(mergeAssignable(assignable, rhsAssignable));
  }
  function parseArrowableTopRest(lexerFlags, scoop, asyncKeywordPrefixed, astProp) {
    // rest (can not be spread)
    // a `...` at the top-level of a group means this has to be an arrow header unless async'ed
    // a `...[x+y]` at the toplevel is an error

    // - (...x) => x
    // - (...[destruct]) => x
    // - (...{destruct}) => x
    // - async(...ident) => x
    // - async(...[destruct]) => x
    // - async(...{destruct}) => x
    // - async(...<expr>);            // :(

    let subDestruct = parseArrowableSpreadOrRest(lexerFlags, scoop, $$PAREN_R_29, BINDING_TYPE_ARG, IS_GROUP_TOPLEVEL, asyncKeywordPrefixed, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
    if (!asyncKeywordPrefixed) {
      if (hasAllFlags(subDestruct, CANT_DESTRUCT) || curc === $$COMMA_2C) {
        THROW('The ... argument must be destructible in an arrow header, found something that was not destructible');
      }
      if (curc === $$IS_3D && curtok.str === '=') THROW('Cannot set a default on a rest value');
      if (curc === $$COMMA_2C) THROW('Rest arg cannot have a trailing comma');
      if (curc !== $$PAREN_R_29) THROW('Rest arg must be last but did not find closing paren');
    }
    // have to return it to invalidate stuff like `(...x=y)=>x`
    return subDestruct;
  }

  function parseArrayOuter(lexerFlagsBeforeParen, scoop, bindingType, skipInit, exportedNames, exportedBindings, _astProp) {
    ASSERT(parseArrayOuter.length === arguments.length, 'arg count');

    // This function serves to throw in case the array was found to must be a Pattern but used as a value anyways
    // For example: `[{a = b} = x]` vs `[{a = b}.c]`

    return parseArrayLiteralPattern(lexerFlagsBeforeParen, scoop, bindingType, skipInit, exportedNames, exportedBindings, _astProp);
  }
  function parseObjectOuter(lexerFlags, scoop, bindingType, skipInit, isClassMethod, exportedNames, exportedBindings, _astProp) {
    ASSERT(parseObjectOuter.length === arguments.length, 'arg count');

    // This function serves to throw in case the object was found to must be a Pattern but used as a value anyways
    // For example: `({a = b} = x)` vs `({a = b}.c)`

    let destructible = parseObjectLiteralPatternAndAssign(lexerFlags, scoop, bindingType, skipInit, isClassMethod, exportedNames, exportedBindings, _astProp);

    return destructible;
  }

  function parseArrayLiteralPattern(lexerFlagsBeforeParen, scoop, bindingType, skipInit, exportedNames, exportedBindings, _astProp) {
    // token offsetS:
    // - ( [
    // - ( <x> , [
    ASSERT(parseArrayLiteralPattern.length === arguments.length, 'arg count');
    ASSERT(typeof bindingType === 'number', 'enum');
    ASSERT(skipInit === SKIP_INIT || skipInit === PARSE_INIT, 'skipInit is enum', skipInit);

    // const [a] = b;
    // const ([a] = b) = c;
    // function ([a]){};
    // function ([a] = b){};
    // ([a]) => b;
    // ([a] = b) => c;
    // [a] = b;
    // For non-bindings a member expression is _also_ valid:
    // [a.b] = c;
    // ([a.b] = c) = d;
    // [a.b=[c.d]=e] = f;
    // ([a=[b.c]=d]) => e;
    // nested:
    // [{x: y.z}]
    // [{x: y.z}] = a
    // ([{x: y.z}]) => b
    // ([{x: y.z}] = a) => b
    // ([{x: y.z} = a]) => b

    // either the bracket starts an array destructuring or literal. they have a similar-but-not-the-same structure
    // - ([]
    // - ([ident,]
    // - ([ident = expr]
    // - ([<array destruct> = expr,]
    // - ([<object destruct> = expr,]
    // - ([...<ident, arr>]
    // - in all above cases destructible
    // - in all other cases this is a regular array and not destructible

    // we can parse `in` inside an array literal/destruct
    let lexerFlags = sansFlag(lexerFlagsBeforeParen, LF_IN_FOR_LHS);

    AST_open(_astProp, 'ArrayExpression');
    ASSERT_skipRex('[', lexerFlags); // `x = ([/foo/]);` is a valid albeit little weird group
    AST_set('elements', []);

    let astProp = 'elements';

    let destructible = MIGHT_DESTRUCT;

    // skip leading commas
    while (curc === $$COMMA_2C) {
      ASSERT_skipRex(',', lexerFlags); // forward slash after comma has to be a regex
      AST_add(astProp, null);
    }

    let spreadStage = NO_SPREAD;
    let assignableYieldAwaitState = 0; // this is ONLY used to track await/yield state flags so we can propagate them back up

    while(curc !== $$SQUARE_R_5D) {
      if (curtype === $IDENT) {
        // - `[x]`
        //     ^
        // - `[x, y]`
        // - `[x = y]`
        // - `[x.y]`
        // - `[x.y = z]`
        // - `[x + y]`
        // - `[this]`
        // - `[this=x]`
        // - `[this]=x`

        // binding check wise;
        // - if assignable/compoundable then the ident must do a binding check
        // - in all other cases the binding must be a valid value ident (including true, false, typeof, etc)
        //   - some valid idents can not be assigned (`true`, `typeof`, etc) and are not destructible, not assignable
        // first scan next token to see what potential checks we need to apply (wrt the above comments)
        const identToken = curtok;
        skipIdentSafeSlowAndExpensive(lexerFlags); // will properly deal with div/rex cases

        let nextIsAssignment = curtok.str === '=';
        let nextIsCommaOrEnd = curc === $$COMMA_2C || curc === $$SQUARE_R_5D;

        // ASSIGN_EXPR_IS_OK because this might just be an array element, where something like an arrow is legit
        // [v]: `[async ()=>x]`      // requires ASSIGN_EXPR_IS_OK
        let leftAssignable = parseValueHeadBodyAfterIdent(lexerFlags, identToken, bindingType, NOT_NEW_ARG, ASSIGN_EXPR_IS_OK, astProp);
        assignableYieldAwaitState |= leftAssignable;

        // - `[x = y]`
        //       ^
        if (nextIsAssignment) {
          // - `[x = y]`
          //         ^
          // - `[x = y, z]`
          // - `[true = x]`
          // - `[await = x]`
          // - `[x = true]`        // still destructible, the lhs should inherit the rhs CANT_DESTRUCT state

          if (notAssignable(leftAssignable)) {
            // [x]: `[true = x] = x`
            // [x]: `[true = x]`
            THROW('Cannot assign or destruct to keyword [' + identToken.str + ']');
          }

          // [v]: `let [x = a, y = b] = o`
          // [x]: `let [x = y, x = z] = a`
          // [x]: `for (const [x = 1, x = 2] in {}) {}`
          SCOPE_addBinding(lexerFlags, scoop, identToken.str, bindingType, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);
          addNameToExports(exportedNames, identToken.str);
          addBindingToExports(exportedBindings, identToken.str);

          // We should have just added an Identifier to the AST, so wrap that as left now
          AST_wrapClosed(astProp, 'AssignmentExpression', 'left');
          AST_set('operator', '=');
          ASSERT_skipRex('=', lexerFlags); // next is expression
          // The rhs of the assignment is irrelevant beyond yield/await flags
          let rightAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
          AST_close('AssignmentExpression');

          assignableYieldAwaitState |= rightAssignable;
        }
        else if (nextIsCommaOrEnd) {
          // - [x]
          //     ^
          // - [x, z]
          //     ^
          // - [this]      note: must have ThisExpression in ast

          if (notAssignable(leftAssignable)) {
            destructible |= CANT_DESTRUCT;
          }
          else {
            // [x]: `for (const [x, x] in {}) {}`
            SCOPE_addBinding(lexerFlags, scoop, identToken.str, bindingType, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);
            addNameToExports(exportedNames, identToken.str);
            addBindingToExports(exportedBindings, identToken.str);
          }
        }
        else {
          // if this is any kind of binding then it is now not destructible
          // if this is not a binding then it depends on whether the tail ends with a member expression
          // `let [(x)] = x`         - yes (noop-group edge case)
          // `let [x()] = x`         - no
          // `let [x().foo] = x`     - no
          // `let [(x().foo)] = x`   - no (noop-group edge case)
          // `[x()] = x`             - no
          // `[x().foo] = x`         - yes
          // `[(x().foo)] = x`       - yes (noop-group edge case)
          // `([x()]) => x`          - no
          // `([x().foo]) => x`      - no
          // `([(x)]) => x`          - no? (noop-group edge case)
          // `([(x().foo)]) => x`    - no (noop-group edge case)

          if (bindingType !== BINDING_TYPE_NONE) {
            destructible |= CANT_DESTRUCT;
          }

          // This value is not destructible on its own as there is no ident+more value body that is destructible
          // The optional tail may change this if it is a member expression
          let nowDestruct = parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, leftAssignable, CANT_DESTRUCT, $$SQUARE_R_5D, astProp);
          // We can ignore assignability here because the await/yield flags from the last call will be inside the destruct
          destructible |= nowDestruct;
        }
      }
      else if (curc === $$CURLY_L_7B) {
        // - [{}]
        // - [{..}]
        // - [{..}, x]
        // - [{..}.x]
        // - [{..}=x]
        // - [{}.foo] = x
        // - [{}[foo]] = x
        // - [{a}] = x
        // - [{a:b}] = x
        // - [{a:1}.foo] = x
        // - `[{}.foo] = x`
        let objDestructible = parseObjectLiteralPatternAndAssign(lexerFlags, scoop, bindingType, PARSE_INIT, NOT_CLASS_METHOD, exportedNames, exportedBindings, astProp);
        destructible |= parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, hasAllFlags(objDestructible, CANT_DESTRUCT) ? NOT_ASSIGNABLE : IS_ASSIGNABLE, objDestructible, $$SQUARE_R_5D, astProp);
      }
      else if (curc === $$SQUARE_L_5B) {
        // - [[]]
        // - [[..]]
        // - [[..], x]
        // - [[..].x]
        // - [[..]=x]
        // - [[..].foo] = x
        // - [[..][foo]] = x
        // - `[[foo].food()] = x`               -- error
        // - `[[foo].length] = x`               -- ok
        // - `[[foo].food() = x] = x`           -- error
        // - `[[foo].length = x] = x`           -- ok
        // note: grouped object/array literals are never assignable
        let arrDestructible = parseArrayLiteralPattern(lexerFlags, scoop, bindingType, PARSE_INIT, exportedNames, exportedBindings, astProp);
        destructible |= parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, hasAllFlags(arrDestructible, CANT_DESTRUCT) ? NOT_ASSIGNABLE : IS_ASSIGNABLE, arrDestructible, $$SQUARE_R_5D, astProp);
      }
      else if (curc === $$DOT_2E && curtok.str === '...') {
        // TODO: > It is a Syntax Error if DestructuringAssignmentTarget is an ArrayLiteral or an ObjectLiteral.
        // TODO:   https://tc39.github.io/ecma262/#sec-destructuring-assignment-static-semantics-early-errors
        // TODO:   (I think this means `[...[x]] = x` is illegal)

        // rest/spread.
        // if it isn't the last in the array then the array is not destructible
        // if binding, if spread arg is not array/object/ident then it is not destructible
        // if not binding, it is also destructible if arg is member expression
        // - ([...x]);       (this is valid)
        // - ([...x=y]);     (spread wraps the assignment (!))
        // - ([...x+=y]);    (spread wraps the assignment (!))
        // - ([...x+y]);     (spread wraps any expression)
        // - ([...x, y]);    (spread does not need to be last)
        // - ([...x, ...y]); (spread can appear more than once)
        // - ([...x]) => x
        // - ([x, ...y]) => x
        // - ([...x.y] = z)             (ok)
        // - ([...x.y]) => z            (bad)
        // - ([...x.y] = z) => z        (bad)
        // - (z = [...x.y]) => z        (ok)
        // - (z = [...x.y] = z) => z    (ok)


        let subDestruct = parseArrowableSpreadOrRest(lexerFlags, scoop, $$SQUARE_R_5D, bindingType, NOT_GROUP_TOPLEVEL, UNDEF_ASYNC, exportedNames, exportedBindings, astProp);
        destructible |= subDestruct;
        if (curc !== $$COMMA_2C && curc !== $$SQUARE_R_5D) THROW('Encountered unexpected token after parsing spread/rest argument ');
        ASSERT(curc !== $$COMMA_2C || hasAllFlags(subDestruct, CANT_DESTRUCT), 'if comma then cannot destruct, should be dealt with in function');
        // if there are any other elements after this then this cannot be a destructible since that demands rest as last
        if (spreadStage === NO_SPREAD) spreadStage = LAST_SPREAD;
      }
      else {
        // only destructible as assignment destructuring if "simple assignment"
        //     ^
        // - `[5[foo]] = x`
        // - `["x".foo] = x`
        // - `[`x`.foo] = x`
        // - `[(a)] = x`           // simple assignment wrapped in parens is still simple, good for assignment destructuring
        // - `[(a) = x] = x`       // still fine
        // - `[(a = x)] = x`       // an assignment is not a simple assignment so this is bad

        // We have a problem;
        // Destructuring assignments allow any "simple assignment targets" as valid patterns
        // However, in this parser an assignable is anything that is a simple assignment OR an assignment operator
        // but: https://tc39.github.io/ecma262/#sec-assignment-operators-static-semantics-assignmenttargettype
        // This seems to be the only case where this distinction is relevant.



        // This is tricky. We need to know whether this is destructible assignable. The edge case is grouping.
        // However, in our system we only return whether or not the expression is assignable, not whether it is
        // a "simple assignment target", which is what we explicitly need here. So to get this information we
        // parse the first part of the expression, which tells us the simple assignment target (at least until new
        // syntax is introduced that violates this invariant). If that's assignment then it is a simple assignment. If
        // there is anything more to parse for the expression then the expression is not a simple assignment target.
        // Unfortunately this means a lot of manual parsing, but so be it. And we can probably abstract it.
        let wasParen = curc === $$PAREN_L_28;
        let assignable = parseValue(lexerFlags, ASSIGN_EXPR_IS_OK, NOT_NEW_ARG, astProp);
        // This will stop after the tail of the expression. If there was an operator, it will now be
        // the current token. And in that case the expression is NOT destructible in any way. Otherwise it could
        // be an destructuring assignment if it was assignable in the first place.
        if (curc !== $$COMMA_2C && curc !== $$SQUARE_R_5D) {
          assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
          assignable = setNotAssignable(assignable);
          destructible |= CANT_DESTRUCT;
        }
        else if (wasParen && isAssignable(assignable) && bindingType === BINDING_TYPE_NONE) {
          // - `[(x)] = obj`
          destructible |=  DESTRUCT_ASSIGN_ONLY;
        }
        else if (wasParen || notAssignable(assignable)) {
          // - `let [(x)] = obj`
          //            ^
          // - `[x()] = obj`
          //        ^
          // - `[(x())] = obj`
          //          ^
          destructible |= CANT_DESTRUCT;
        }
        else {
          // [v]: `[5..length] = x`
          // [v]: `["X".length] = x`
          // [v]: `[`x`.length] = x`
          // [v]: `[`a${5}b`.length] = x`
          // [v]: `[/foo/.length] = x`
          // [v]: `[/x/g.length] = x`
          // [v]: `[50..foo] = x`
          // [v]: `["foo".foo] = x`
        }
      }

      if (curc !== $$COMMA_2C) break; // end of the array
      // skip one because a trailing comma does not add a `null` to the ast
      ASSERT_skipRex(',', lexerFlags); // forward slash after comma has to be a regex

      if (spreadStage === LAST_SPREAD) {
        spreadStage = MID_SPREAD;
        // cannot destruct if spread appeared as non-last element
        destructible |= CANT_DESTRUCT;
      }

      while (curc === $$COMMA_2C) {
        ASSERT_skipRex(',', lexerFlags); // forward slash after comma has to be a regex
        AST_add(astProp, null);
      }
    }
    lexerFlags = lexerFlagsBeforeParen;

    skipDivOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // a forward slash after ] has to be a division
    AST_close('ArrayExpression');
    if (skipInit === PARSE_INIT) {
      destructible = parsePatternAssign(lexerFlags, destructible, _astProp);
    }

    // pick up the flags from assignable and put them in destructible
    // - `([x] = await bar) => {}`
    // - `async function a(){     ([v] = await bar) => {}     }`
    // - `function *g(){ (x = [yield]) }`
    // - `{ (x = [yield]) }`
    return copyPiggies(destructible, assignableYieldAwaitState);
  }

  function parseObjectLiteralPatternAndAssign(lexerFlags, scoop, bindingType, skipInit, isClassMethod, exportedNames, exportedBindings, astProp) {
    // returns whether this object is destructible
    ASSERT(parseObjectLiteralPatternAndAssign.length === arguments.length, 'expecting all args');
    ASSERT(skipInit === SKIP_INIT || skipInit === PARSE_INIT, 'skipInit is enum', skipInit);

    // parse an object literal or pattern
    // - {}
    // - {x}
    // - {x, y}
    // - {x: y}
    // - {x: y, z}
    // - {x: [..]}
    // - {x: {..}}
    // - {x = y}
    // - {x: y = z}
    // - {x: [..] = y}
    // - {x: {..} = y}
    // - {...x}
    // - {...x, y}
    // - {...x = y, y}
    // - {...x.x, y}
    // - {...x.x = y, y}

    AST_open(astProp, 'ObjectExpression');
    AST_set('properties', []);
    let destructible = parseObjectLikePatternSansAssign(lexerFlags | LF_NO_ASI, scoop, bindingType, isClassMethod, IS_EXPRESSION, exportedNames, exportedBindings, 'properties');
    AST_close('ObjectExpression');
    // this is immediately after the top-level object literal closed that we started parsing
    if (skipInit === PARSE_INIT) {
      destructible = parsePatternAssign(lexerFlags, destructible, astProp);
    }

    return destructible;
  }
  function parseClassbody(lexerFlags, scoop, bindingType, isExpression, astProp) {
    ASSERT(parseClassbody.length === arguments.length, 'expecting all args');

    AST_open(astProp, 'ClassBody');
    AST_set('body', []);
    let assignable = parseObjectLikePatternSansAssign(lexerFlags, scoop, bindingType, IS_CLASS_METHOD, isExpression, UNDEF_EXPORTS, UNDEF_EXPORTS, 'body');
    AST_close('ClassBody');
    // Note: returning `assignable` is relevant for passing back await/yield flags
    return assignable;
  }
  function parseObjectLikePatternSansAssign(_lexerFlags, scoop, bindingType, isClassMethod, isExpression, exportedNames, exportedBindings, astProp) {
    ASSERT(parseObjectLikePatternSansAssign.length === arguments.length, 'arg count');
    // parse the body of something that looks like an object literal (obj lit, class body)

    let lexerFlags = _lexerFlags;
    if (hasAllFlags(lexerFlags, LF_IN_FOR_LHS)) lexerFlags = lexerFlags ^ LF_IN_FOR_LHS;
    if (hasAllFlags(lexerFlags, LF_IN_TEMPLATE)) lexerFlags = lexerFlags ^ LF_IN_TEMPLATE;

    skipAnyOrDieSingleChar($$CURLY_L_7B, lexerFlags); // TODO: next must be propname (ident, string, number, square bracket) or } or *

    let destructible = MIGHT_DESTRUCT; // innocent until proven guilty? may or may not destruct

    if (isClassMethod === IS_CLASS_METHOD) {
      while (curc === $$SEMI_3B) ASSERT_skipAny(';', lexerFlags);
    }

    // > 12.2.6.1: In ECMAScript 2015, it is no longer an early error to have duplicate property names in Object
    // Initializers. So we don't have to track all properties of object literals to check for dupes, however, we still
    // need to confirm this for the constructor of a class.

    let constructors = 0; // must throw if more than one plain constructor was found
    let doubleDunderProto = 0;
    while (curc !== $$CURLY_R_7D) {
      if (curc === $$COMMA_2C) {
        // ({,
        THROW('Objects cant have comma without something preceding it');
      }

      let currentDestruct = parseObjectLikePart(lexerFlags, scoop, bindingType, isClassMethod, undefined, exportedNames, exportedBindings, astProp);
      if (hasAnyFlag(currentDestruct, PIGGY_BACK_WAS_PROTO)) {
        // https://tc39.github.io/ecma262/#sec-__proto__-property-names-in-object-initializers
        // When ObjectLiteral appears in a context where ObjectAssignmentPattern is required the Early Error rule is not applied.
        // In addition, it is not applied when initially parsing a CoverParenthesizedExpressionAndArrowParameterList or a CoverCallExpressionAndAsyncArrowHead.
        // so; the __proto__ dupe check does not apply when inside a group or when the object is a destructuring assignment
        ++doubleDunderProto;
      }
      destructible |= currentDestruct;

      if (isClassMethod === IS_CLASS_METHOD) {
        if (hasAnyFlag(currentDestruct, PIGGY_BACK_WAS_CONSTRUCTOR)) {
          ++constructors;
        }

        while (curc === $$SEMI_3B) ASSERT_skipAny(';', lexerFlags);
      } else {
        if (curc !== $$COMMA_2C) break;
        ASSERT_skipAny(',', lexerFlags); // TODO: ident, }, [, number, string
      }
    }

    if (constructors > 1) {
      THROW('Classes may only have one constructor');
    } else if (constructors > 0) {
      destructible = sansFlag(destructible, PIGGY_BACK_WAS_CONSTRUCTOR);
    }

    // restore in/template flags (`x${+{}}` would fail if you didn't do this before parsing the closing curly)
    lexerFlags = _lexerFlags;

    if (isExpression === IS_EXPRESSION) {
      skipDivOrDieSingleChar($$CURLY_R_7D, lexerFlags); // ({...} / foo)
    } else {
      skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags); // class x{} /foo/
    }

    if (doubleDunderProto === 1) return sansFlag(destructible, PIGGY_BACK_WAS_PROTO);
    ASSERT(hasAnyFlag(destructible, PIGGY_BACK_WAS_PROTO) === doubleDunderProto > 1, 'either dunder was not found and the piggy is not there or proto was found multiple times and the piggy is still in the destructible field');
    return destructible;
  }
  function parseObjectLikePart(lexerFlags, scoop, bindingType, isClassMethod, staticToken, exportedNames, exportedBindings, astProp) {
    // parseProperty parseMethod
    ASSERT(parseObjectLikePart.length === arguments.length, 'arg count');
    ASSERT(typeof astProp === 'string', 'astprop string');
    ASSERT(staticToken === undefined || staticToken.str === 'static', 'token or undefined');
    let destructible = bindingType === BINDING_TYPE_NONE ? MIGHT_DESTRUCT : MUST_DESTRUCT;
    let assignable = 0; // propagate the await/yield state flags, if any (because `(x={a:await f})=>x` should be an error)

    // an objlit property has quite a few (though limited) valid goals
    // - `({},`
    // - `({ident,`
    // - `({ident:ident`
    // - `({ident:expr`
    // - `({ident:()=>x)`
    // - `({ident(){}`
    // - `({get ident(){}`    (or set/async)
    // - `({get *ident(){}`   (or set, and I think by now async too?)
    // - `({get 'x'(){}`      (or double quotes)
    // - `({get *'x'(){}`     (or double quotes)
    // - `({get 10(){}`       (could also be .5)
    // - `({get *10(){}`      (could also be .5)
    // - `({get [expr](){}`   (or set/async)
    // - `({get *[expr](){}`  (or set, and I think by now async too?)
    // - `({'foo':expr`       (or double quotes)
    // - `({'foo'(){}`        (or double quotes)
    // - `({200:expr`         (could also be .5)
    // - `({200(){}`          (could also be .5)
    // - `({...ident`
    // - `({*ident(){}`
    // - `({*'x'(){}`         (or double quotes)
    // - `({*20(){}`          (could also be .5)
    // - `({*[expr](){}`
    // - `({[expr]:expr`      (destructible!)
    // - `({[expr]:[x]`       (destructible!)
    // - `({[expr](){}`

    if (curtype === $IDENT) {
      if (curtok.str === 'static' && staticToken === undefined) {
        // - `{static x(){}`
        // - `{static *x(){}`
        // - `{static async x(){}`
        // - `{static get x(){}`
        // - `{static set x(y){}`
        // - `{static [x](){}`
        // - `{static async [x](){}`
        // - `{static get [x](){}`
        // - `{static set [x](y){}`
        // - `{static *[x](){}`
        // - `{static *async [x](){}`
        // - `{static *get [x](){}`
        // - `{static *set [x](y){}`
        // - `{static 8(){}`
        // - `{static async 8(){}`
        // - `{static get 8(){}`
        // - `{static set 8(y){}`
        // - `{static *8(){}`
        // - `{static *async 8(){}`
        // - `{static *get 8(){}`
        // - `{static *set 8(y){}`
        // - `{static "x"(){}`
        // - `{static async "x"(){}`
        // - `{static get "x"(){}`
        // - `{static set "x"(y){}`
        // - `{static *"x"(){}`
        // - `{static *async "x"(){}`
        // - `{static *get "x"(){}`
        // - `{static *set "x"(y){}`

        let currentStaticToken = curtok;
        ASSERT_skipAny('static', lexerFlags); // this is `{static` and the next cannot validly be slash...

        if (curc === $$COMMA_2C || curc === $$CURLY_R_7D || curc === $$COLON_3A || curc === $$PAREN_L_28) {
          // - `({static: x})`
          // - `({static: x}) => x`
          // - `({static}=x)`     // valid in sloppy mode since static is not a proper reserved word
          // - `({static, y}=x)`
          // - `({static(){}})`
          destructible = parseObjectLikePartFromIdent(lexerFlags, scoop, bindingType, isClassMethod, NOT_CONSTRUCTOR, undefined, currentStaticToken, exportedNames, exportedBindings, astProp);
        }
        else {
          destructible = parseObjectLikePart(lexerFlags, scoop, bindingType, isClassMethod, currentStaticToken, exportedNames, exportedBindings, astProp);
        }
      }
      else {
        // (if prefixed by static then that's already consumed above)
        // this is the only case that can be a shorthand. only valid syntaxes:
        // - `({ident,`
        // - `({ident:ident`
        // - `({ident:expr`
        // - `({ident(){}`
        // - `({get ident(){}`    (or set/async)
        // - `({get *ident(){}`   (or set, and I think by now async too?)
        // - `({get [expr](){}`   (or set/async)
        // - `({get *[expr](){}`  (or set, and I think by now async too?)
        // - `({static static(){}`
        // - `let {x:o.f=1}=a`
        // - since this is an object curly, it _must_ be a syntax error when not a valid property starter

        let identToken = curtok;
        ASSERT_skipAny($IDENT, lexerFlags); // TODO: set of allowed characters is wide but limited

        if (allowAsyncFunctions) {
          if (curc !== $$PAREN_L_28 && curtok.nl && identToken.str === 'async') {
            // this is `{async \n ..(){}}` which is always an error due to async being a restricted production
            THROW('Async methods are a restricted production and cannot have a newline following it');
          }
        }

        let wasConstructor = isClassMethod === IS_CLASS_METHOD && staticToken === undefined && curc === $$PAREN_L_28 && identToken.canon === 'constructor';

        ASSERT(typeof wasConstructor === 'boolean', 'enum');

        destructible = parseObjectLikePartFromIdent(lexerFlags, scoop, bindingType, isClassMethod, wasConstructor, staticToken, identToken, exportedNames, exportedBindings, astProp);

        if (wasConstructor) {
          // this is a constructor method. we need to signal the caller that we parsed one to dedupe them
          // to signal the caller we piggy back on the destructible which is already a bit-field
          destructible |= PIGGY_BACK_WAS_CONSTRUCTOR;
        }
      }
    }
    else if (hasAllFlags(curtype, $NUMBER) || hasAllFlags(curtype, $STRING)) {
      // property names can also be strings and numbers but these cannot be shorthanded
      // number/string keys can still destructure just fine (`({"foo": x} = y)`)
      // - `({"a b c": bar});`
      // - `({"a b c"(){}});`
      // - `({"a b c": bar}) => x`
      // - `({15: bar});`
      // - `({15(){}});`
      // - `({15: bar}) => x`
      let litToken = curtok;
      ASSERT_skipRex(litToken.str, lexerFlags); // next is expression

      if (curc === $$COLON_3A) {
        if (isClassMethod) THROW('Class members have to be methods, for now');
        // property value or label, some are destructible:
        // - ({ident: ident,}
        // - ({ident: <array destruct>,}
        // - ({ident: <object destruct>,}
        // - ({ident: ident = expr}
        // - ({ident: <array destruct> = expr,}
        // - ({ident: <object destruct> = expr,}
        // anything else as value is non-destructible
        ASSERT_skipRex(':', lexerFlags); // next is expression

        // `{"__proto__": 1, __proto__: 2}` is still an error
        if (litToken.str.slice(1, -1) === '__proto__') destructible |= PIGGY_BACK_WAS_PROTO;

        destructible |= parseObjectPropertyValueAfterColon(lexerFlags, litToken, isClassMethod, bindingType, assignable, destructible, scoop,exportedNames, exportedBindings, astProp);
        ASSERT(curc !== $$IS_3D, 'assignments should be parsed as part of the rhs expression');
      }
      else if (curc === $$PAREN_L_28) {
        // method shorthand
        // - ({5(){}})
        // - ({'foo'(){}})
        AST_setLiteral(astProp, litToken);

        let wasConstructor =
          isClassMethod === IS_CLASS_METHOD &&
          staticToken === undefined &&
          hasAllFlags(litToken.type, $STRING) && // technically not really necessary as numbers would never be able to contain "constructor" :)
          litToken.str.slice(1, -1) === 'constructor';

        ASSERT(typeof wasConstructor === 'boolean', 'enum');

        let nowDestructible = parseObjectLikeMethodAfterKey(lexerFlags, staticToken, undefined, undefined, litToken, isClassMethod, wasConstructor, NOT_DyNAMIC_PROPERTY, NOT_GETSET, astProp);
        destructible = nowDestructible | CANT_DESTRUCT;
        if (wasConstructor) {
          // this is a constructor method. we need to signal the caller that we parsed one to dedupe them
          // to signal the caller we piggy back on the destructible which is already a bit-field
          destructible |= PIGGY_BACK_WAS_CONSTRUCTOR;
        }
      } else {
        THROW('Object literal keys that are strings or numbers must be a method or have a colon: ' + curtok);
      }

      ASSERT(curc !== $$IS_3D, 'assignments should be parsed as part of the expression');
    }
    else if (curtok.str === '...') {
      if (targetEsVersion < VERSION_OBJECTSPREAD && targetEsVersion !== VERSION_WHATEVER) {
        THROW('Object spread/rest requires the requested version to be ES9+');
      }
      // rest/spread (supported in objects since es9)
      // unlike arrays it can appear in any property index in an object
      // note that an object spread, if the last element, CAN have a trailing comma
      // if binding, if spread arg is not array/object/ident then it is not destructible
      // if not binding, it is also destructible if arg is member expression
      // - ({...x});                  (this is valid)
      // - ({...x=y});                (spread wraps the assignment (!))
      // - ({...x+=y});               (spread wraps the assignment (!))
      // - ({...x+y});                (spread wraps any expression)
      // - ({...x, y});               (spread does not need to be last)
      // - ({...x, ...y});            (spread can appear more than once)
      // - ({...x}) => x
      // - ({x, ...y}) => x
      // - ({...x.y} = z)             (ok)
      // - ({...x.y}) => z            (bad)
      // - ({...x.y} = z) => z        (bad)
      // - (z = {...x.y}) => z        (ok)
      // - (z = {...x.y} = z) => z    (ok)
      let subDestruct = parseArrowableSpreadOrRest(lexerFlags, scoop, $$CURLY_R_7D, bindingType, NOT_GROUP_TOPLEVEL, undefined, exportedNames, exportedBindings, astProp);
      ASSERT(typeof subDestruct === 'number', 'should be number');
      destructible |= subDestruct;
      ASSERT(curc !== $$COMMA_2C || hasAllFlags(subDestruct, CANT_DESTRUCT), 'if comma then cannot destruct, should be dealt with in function');
      ASSERT(curc === $$COMMA_2C || curc === $$CURLY_R_7D, 'abstraction should parse whole rest/spread goal; ' + curtok);
    }
    else if (curc === $$SQUARE_L_5B) {
      // computed property (is valid in destructuring assignment!
      // - `({[foo]: x} = y)`
      // - `({[foo]() {}} = y)`            fail
      // - `const {[x]: y} = z;`
      // - `({[x]: y}) => z;`
      // - `function f({[x]: {y = z}}) {}`

      // skip computed key part first because we need to figure out whether we're parsing a method
      ASSERT_skipRex('[', lexerFlags); // next is expression
      let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, astProp);
      // pass yield/await flags here (note that the assignability itself is irrelevant for this expr)
      // TODO: find a testcase where the setNotAssignable state fails...
      assignable = setNotAssignable(nowAssignable | assignable);
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // next is : or (
      if (curc === $$COLON_3A) {
        // - `({[foo]: bar} = baz)`
        // - `({[foo]: bar()} = baz)`
        // - `({[foo]: a + b} = baz)`
        // - `({[foo]: bar}) => baz`
        // - `({[foo]: bar()}) => baz`
        // - `({[foo]: a + b}) => baz`
        // - `let {[foo]: bar} = baz`
        // - `let {[foo]: bar()} = baz`
        // - `let {[foo]: a + b} = baz`
        // - `let {[foo]: [bar]} = baz`
        // - `[a, {[b]:d}, c] = obj`
        // - `function f({[x]: {y = z}}) {}`
        ASSERT_skipRex(':', lexerFlags);

        if (isClassMethod === IS_CLASS_METHOD) TODO,THROW('fail');

        AST_wrapClosed(astProp, 'Property', 'key');
        AST_set('kind', 'init'); // only getters/setters get special value here
        AST_set('method', curc === $$PAREN_L_28);
        AST_set('computed', true);
        destructible = _parseObjectPropertyValueAfterColon(lexerFlags, null, isClassMethod, bindingType, IS_ASSIGNABLE, destructible, scoop, UNDEF_EXPORTS, UNDEF_EXPORTS, astProp);
        AST_set('shorthand', false);
        AST_close('Property');
      } else if (curc !== $$PAREN_L_28) {
        // - `{[foo] * 5}`
        THROW('A computed property name must be followed by a colon or paren');
      } else {
        // - `{[foo](){}}`
        // - `class {[foo](){}}`
        parseObjectLikeMethodAfterKey(
          lexerFlags,
          staticToken,
          UNDEF_ASYNC,
          UNDEF_ASYNC,
          undefined,
          isClassMethod,
          NOT_CONSTRUCTOR,
          IS_DyNAMIC_PROPERTY,
          NOT_GETSET,
          astProp
        );
        destructible |= CANT_DESTRUCT;
      }
    }
    else if (curc === $$STAR_2A) {
      // generator shorthand (invalid for bindings)
      // - `{*ident(){}} = x`
      // - `{*"str"(){}} = x`
      // - `{*15(){}} = x`
      // - `{*[expr](){}} = x`

      destructible |= CANT_DESTRUCT;

      let starToken = curtok;
      ASSERT_skipAny('*', lexerFlags); // TODO: next must be ident, number, string, `[`

      if (curtype === $IDENT) {
        // - `({*ident(){}})`
        let identToken = curtok;
        ASSERT_skipAny($IDENT, lexerFlags); // TODO: next must be `(`

        if (curc === $$PAREN_L_28) {
          // - `({*ident(){}})`
          // - `({*get(){}})`
          // - `({*set(){}})`
          // - `({*async(){}})`     // NOT an async generator! it's a generatr
          if (identToken.str === 'prototype') THROW('Class methods can not be called `prototype`');
          AST_setIdent(astProp, identToken);
          parseObjectLikeMethodAfterKey(lexerFlags, staticToken, starToken, undefined, identToken, isClassMethod, NOT_CONSTRUCTOR, NOT_DyNAMIC_PROPERTY, NOT_GETSET, astProp);
        } else {
          if (allowAsyncFunctions) {
            if (curtok.str === 'async') {
              // - `({*async x(){}})`     // NOT an async generator! just an error
              THROW('Found `* async x(){}` but this should be `async * x(){}`'); // provided it's supported at all...
            }
          }
          if (curtok.str === 'get' || curtok.str === 'set') {
            // - `({*get x(){}})`
            // - `({*set x(){}})`
            THROW('Getters and setters can not be generators'); // (and you would put the get/set before the *, anyways)
          }
          if (curc === $$COLON_3A) {
            // - `({*ident: x})`
            THROW('Generators must be method shorthands');
          }
          // - `({*ident x(){}})`
          THROW('Unexpected token can not be generator method');
        }
      }
      else if (hasAnyFlag(curtype, $NUMBER | $STRING)) {
        // - `({*"str"(){}})`
        // - `({*15(){}})`
        let litToken = curtok;
        ASSERT_skipAny(litToken.str, lexerFlags); // TODO: next must be `(`

        destructible |= CANT_DESTRUCT;

        AST_setLiteral(astProp, litToken);
        parseObjectLikeMethodAfterKey(lexerFlags, staticToken, starToken, undefined, litToken, isClassMethod, NOT_CONSTRUCTOR, NOT_DyNAMIC_PROPERTY, NOT_GETSET, astProp);
      }
      else if (curc === $$SQUARE_L_5B) {
        // - `{*[expr](){}} = x`

        destructible |= CANT_DESTRUCT;

        let nowAssignable = parseComputedModifierMethod(lexerFlags, isClassMethod, staticToken, starToken, undefined, astProp);
        assignable = mergeAssignable(nowAssignable, assignable);
      }
      else {
        THROW('Invalid objlit key character after generator star');
      }
      ASSERT(curc !== $$IS_3D, 'this struct can not have an init');
    }
    else if (curc === $$SEMI_3B) {
      if (isClassMethod === NOT_CLASS_METHOD) {
        // - `({;})`
        THROW('Semi is not a valid character in object literals');
      }
      // - `class x {;}`
      // these semi's dont contribute anything to the AST (lossy)
      ASSERT_skipAny(';', lexerFlags); // any property start or }
    }
    else {
      // ({<?>
      THROW('Unexpected token, wanted to parse a start of a property in an object literal/pattern');
    }

    // pick up the flags from assignable and put them in destructible
    // - `async function f(){    (fail = class A {[await foo](){}; "x"(){}}) => {}    }`
    // - `function *g(){ (x = {[yield]: 1}) }`
    // - `{ (x = {[yield]: 1}) }`
    // - `s = {"foo": await = x} = x`
    return copyPiggies(destructible, assignable);
  }

  function parsePatternAssign(lexerFlags, destructible, astProp) {
    if (curc === $$IS_3D && curtok.str === '=') {
      // Note: this might be something like `([x]=await y)=>z` which is illegal so we must propagate await/yield flags
      // - `[x]=y`
      // - `[x=y]=z`
      // - `[x=await y]=z`
      // - `[x=y]=await z`
      // - `[...{a = b} = c] = x`
      // - `{x} = y`

      verifyDestructible(destructible);
      if (hasAllFlags(destructible, CANT_DESTRUCT)) {
        // - `({a:(b) = c} = 1)`
        THROW('Tried to destructure something that is not destructible');
      }

      // for example; `({a = b})` must destruct because of the shorthand. `[...a=b]` can't destruct because rest is only
      // legal on a simple identifier. So combining them you get `[...{a = b} = c]` where the inside must destruct and
      // the outside cannot. (there's a test)

      // If the object or array had MUST_DESTRUCT set, we have to reset this to MIGHT_DESTRUCT
      // For example, `({a = b})` and `[{a = b}]` have to be destructured because of the init, which
      // is not allowed for objlits (`let x = {y=z}` and `let x = {y=z} => d` are errors while
      // `let x = {y=z} = d` and `let x = ({y=z}) => d` and `let x = ({y=z}=e) => d` are valid)
      // but make sure the assign flag is retained (`([x.y]=z) => z` is an error!)

      // This is an assignment, so if the lhs was a MUST_DESTRUCT pattern then we can drop that flag now
      // Also remove the piggy because the proto rule does not apply for destructuring assignments
      // [v]: `result = [...{ x = await }] = y;`
      // [v]: `async r => result = [...{ x = await x }] = y;`
      // [v]: `result = [...{ x = yield }] = y;`
      // [v]: `function* g() {   [...{ x = yield }] = y   }`
      // [v]: `([{x = y}] = z)`
      // [v]: `[{x = y}] = z`
      // [v]: `foo({c=3} = {})`
      // [v]: `async({c=3} = {})`
      // [v]: `yield({c=3} = {})`
      // [v]: `log({foo: [bar]} = obj);`
      // [v]: `({a:(b) = c} = 1)`
      // [v]: `for ({x} = z;;);`
      // [v]: `({...[].x} = x);`
      destructible = sansFlag(destructible, MUST_DESTRUCT | PIGGY_BACK_WAS_PROTO);

      // the array MUST now be a pattern. Does not need to be an arrow.
      // the outer-most assignment is an expression, the inner assignments become patterns too.
      AST_destruct(astProp);
      AST_wrapClosed(astProp, 'AssignmentExpression', 'left');
      AST_set('operator', '=');
      ASSERT_skipRex('=', lexerFlags); // a forward slash after = has to be a division
      // pick up the flags from assignable and put them in destructible
      // - `({x} = await bar) => {}`
      // - `async function a(){     ({r} = await bar) => {}     }`
      // - `({x} = yield) => {}`
      // - `function *f(){ ({x} = yield) => {} }`
      destructible |= parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
      AST_close('AssignmentExpression');
    } else if (isCompoundAssignment(curtok.str)) {
      // - `[x] += y`
      // - `{x} += y`
      THROW('Cannot compound-assign to an array literal');
    }
    return destructible;
  }

  function parseObjectPropertyValueAfterColon(lexerFlags, keyToken, isClassMethod, bindingType, assignableOnlyForYieldAwaitFlags, destructible, scoop,exportedNames, exportedBindings, astProp) {
    ASSERT(parseObjectPropertyValueAfterColon.length === arguments.length, 'arg count');
    // property value or label, some are destructible:
    // - ({ident: ident,}
    // - ({35: ident,}
    // - ({"aye": ident,}
    // - ({key: <array destruct>,}
    // - ({key: <object destruct>,}
    // - ({key: ident = expr}
    // - ({key: <array destruct> = expr,}
    // - ({key: <object destruct> = expr,}
    // anything else as value is non-destructible
    // - `(x={y: await z}) => t`                    (propagate await/yield to invalidate this case)
    // - `({x: b = await c}) => d`                  (propagate await/yield to invalidate this case)

    AST_open(astProp, 'Property');
    if (keyToken.type === $IDENT) {
      AST_setIdent('key', keyToken);
    } else {
      AST_setLiteral('key', keyToken);
    }
    AST_set('kind', 'init'); // only getters/setters get special value here
    AST_set('method', false); // only the {x(){}} shorthand gets true here, this is {x}
    AST_set('computed', false);

    destructible = _parseObjectPropertyValueAfterColon(lexerFlags, keyToken, isClassMethod, bindingType, assignableOnlyForYieldAwaitFlags, destructible, scoop,exportedNames, exportedBindings, astProp);

    AST_set('shorthand', false);
    AST_close('Property');

    return destructible;
  }

  function _parseObjectPropertyValueAfterColon(lexerFlags, keyToken, isClassMethod, bindingType, assignableOnlyForYieldAwaitFlags, destructible, scoop, exportedNames, exportedBindings, astProp) {
    ASSERT(_parseObjectPropertyValueAfterColon.length === arguments.length, 'arg count');
    if (isClassMethod) THROW('Class members have to be methods, for now');
    if (curtype === $IDENT) {
      // - `{ident: ident}`
      //            ^
      // - `{12: ident ...`
      // - `{"foo": ident ...`
      // - `{key: ident,...}`
      // - `{key: ident.ident} = x`
      // - `{key: ident = ...}`
      // - `{key: ident + rest`        // not destructible, so confirm token after ident
      // - `{key: yield}`
      // - `{key: yield foo}`
      // - `{key: new}`                // error
      // - `{key: new foo}`            // not destructible
      // - `{key: true}`
      // - `{key: yield / bar}
      // - `{key: await foo}

      // use the rhs of the colon as identToken now
      let identToken = curtok;

      // `[...{a: function=x} = c]`
      // let identAssignableOrErrMsg = nonFatalBindingAssignableIdentCheck(identToken, bindingType, lexerFlags);
      // if (typeof identAssignableOrErrMsg === 'string') TODO

      // - `{key: bar}`
      //          ^
      // - `{key: bar/x`
      // - `{key: delete a.b`
      // - `{key: await /foo}`
      // - `{key: await /foo/}`
      // - `{key: await /foo/g}`
      skipIdentSafeSlowAndExpensive(lexerFlags); // will properly deal with div/rex cases

      // - `{key: bar = x}`
      // - `{key: bar + x}`
      // - `{key: bar.foo = x}`
      // - `{key: bar.foo + x}`
      let wasAssign = curtok.str === '=';
      // - `{key: bar}`
      // - `{key: bar, koo: baa}`
      // - `{[key]: bar}`
      let commaOrEnd = curc === $$COMMA_2C || curc === $$CURLY_R_7D;
      let valueAssignable = parseValueAfterIdent(lexerFlags, identToken, bindingType, ASSIGN_EXPR_IS_OK, 'value');
      assignableOnlyForYieldAwaitFlags |= valueAssignable;

      if (curc === $$COMMA_2C || curc === $$CURLY_R_7D) {
        if (wasAssign || commaOrEnd) { // "did this have no tail?"
          // - `({a: b} = d)`
          //          ^
          // - `({[a]: b} = d)`
          //            ^
          // - `({a: b = d})`
          // - `({a: b, c: d})`
          if (notAssignable(valueAssignable)) {
            // - `({[a]: true} = d)`
            //               ^
            // - `[...{a: true} = c]`
            // - `({ *g1() {   return {x: yield}  }})`
            // - `({x:function(){"use strict";}})`
            destructible |= CANT_DESTRUCT;
          } else if (keyToken && keyToken.type === $IDENT) {
            // "valid exports"
            // - `[a, {b:d}, c] = obj`
            // If this isn't an export of some kind then the exportedNames and bindings are null so don't worry :)
            SCOPE_addBinding(lexerFlags, scoop, identToken.str, bindingType, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);
            addNameToExports(exportedNames, identToken.str);
            addBindingToExports(exportedBindings, identToken.str);
          } else {
            // non-ident prop with a single ident as value, assignable, destructible. but cant be part of an export decl
            // - `({"a": b})`
            //            ^
            // - `({[a]: b})`
            //            ^
            // - `({15: b})`
          }
        }
        else {
          // - `({a: b.c} = d)`
          //            ^
          // - `({[a]: b()} = d)`
          //              ^
          // So something that had a tail but no ops. Assign destructible if it is assignable.
          if (isAssignable(valueAssignable)) {
            // - `({[a]: a.b} = d)`
            //              ^
            // - `[a, {15: d[x]}, c] = obj`
            //              ^
            // - `[...{a: b.b} = c]`
            //               ^
            destructible |= DESTRUCT_ASSIGN_ONLY;
          } else {
            // - `({[a]: a()} = d)`
            //              ^
            destructible |= CANT_DESTRUCT;
          }
        }
      }
      else if (curtok.str === '=') {
        if (notAssignable(valueAssignable)) {
          // A value that is not assignable cannot be destructed
          // - `let {x: true = 1} = z`
          //                 ^
          // - `let {x: f() = 1} = z`
          //                ^
          destructible |= CANT_DESTRUCT;
        } else if (!wasAssign) {
          // There was a tail between the ident and the assign, this is not bindable destructible, but assignable
          // - `let {x: a.b = 1} = z`
          //                ^
          destructible |= DESTRUCT_ASSIGN_ONLY;
        } else {
          // This is fine. There was no tail between ident and `=`. This is still perhaps binding destructible
          // - `let {x: o = 1} = z`
          //              ^
          // - `({[a]: b = c} = d)`
          //             ^
        }

        // The assignment itself cannot affect destructibility so just parse the rest
        let rhsAssignable = parseExpressionFromOp(lexerFlags, valueAssignable, 'value');
        assignableOnlyForYieldAwaitFlags |= rhsAssignable;
      }
      else {
        // - `({[a]: b + c} = d)`
        //             ^
        // - `({a: b * c} = d)`
        //           ^
        // - `({a: x.y / c} = d)`
        //             ^
        // - `({x: y; a: b})`
        //          ^
        destructible |= CANT_DESTRUCT;
        let rhsAssignable = parseExpressionFromOp(lexerFlags, valueAssignable, 'value');
        assignableOnlyForYieldAwaitFlags |= rhsAssignable;
      }
    }
    else if (curc === $$SQUARE_L_5B) {
      // - `({ident: []}`
      //             ^
      // - `({ident: <array destruct>`
      // - `({500: <array destruct>`
      // - `({"str": <array destruct>`
      // - `({key: [foo, bar].join('')} = x)`        -- error
      // - `({key: [foo].length} = x)`               -- ok
      // - `({key: [foo, bar].join('') = x} = x)`    -- error
      // - `({key: [foo].length = x} = x)`           -- ok
      // - `({key: [x].foo})`
      // - `({key: [x].foo})`
      let nowDestruct = parseArrayLiteralPattern(lexerFlags, scoop, bindingType, PARSE_INIT, exportedNames, exportedBindings, 'value');
      destructible |= parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, hasAllFlags(nowDestruct, CANT_DESTRUCT) ? NOT_ASSIGNABLE : IS_ASSIGNABLE, nowDestruct, $$CURLY_R_7D, 'value');
    }
    else if (curc === $$CURLY_L_7B) {
      // - `({ident: {})`
      //             ^
      // - `({ident: <object destruct>`
      // - `({500: <object destruct>`
      // - `({"str": <object destruct>`
      // - `({key: {} += x})`                 -- error
      // - `({key: {}.food()} = x)`           -- error
      // - `({key: {}.length} = x)`           -- ok
      // - `({key: {}.food() + x} = x)`       -- error
      // - `({key: {}.length = x} = x)`       -- ok
      // - `({key: {x}.foo})`
      // - `({key: {x}.foo})`
      let nowDestruct = parseObjectLiteralPatternAndAssign(lexerFlags, scoop, bindingType, PARSE_INIT, NOT_CLASS_METHOD, exportedNames, exportedBindings, 'value');
      destructible |= parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, hasAllFlags(nowDestruct, CANT_DESTRUCT) ? NOT_ASSIGNABLE : IS_ASSIGNABLE, nowDestruct, $$CURLY_R_7D, 'value');
    }
    else {
      // - `{x: 15}`
      //        ^
      // - `{"str": 15}`
      // - `{key: "foo"}`
      // - `{key: /foo/ }`
      // - `{key: 15..foo}=x`
      // - `{key: 15..foo()}=x`
      // - `((x={15: (await foo)}) => x`
      // - `{x: 15.foo}=x`
      // - `{x: 15.foo()}=x`

      let nowAssignable = parseValue(lexerFlags, ASSIGN_EXPR_IS_OK, NOT_NEW_ARG, 'value');

      let nowDestruct = isAssignable(nowAssignable) ? MIGHT_DESTRUCT : CANT_DESTRUCT; // fixes `[(a)] = x`
      assignableOnlyForYieldAwaitFlags |= nowAssignable;
      if (isAssignable(nowAssignable)) {
        destructible |= DESTRUCT_ASSIGN_ONLY;
      } else {
        destructible |= CANT_DESTRUCT;
      }
      destructible |= parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, nowAssignable, nowDestruct, $$CURLY_R_7D, 'value');
    }

    ASSERT(curc !== $$IS_3D, 'assignments should be parsed as part of the rhs expression');

    // There are tests that will catch these
    // - `async function a(){     (foo = [{m: 5 + t(await bar)}]) => {}     }`
    // - `function *f({x: x}) { function f({x: yield}) {} }`
    // - `({ *g1() {   return {x: yield}  }})`
    // - `({xxxx:await}) => null`
    return copyPiggies(destructible, assignableOnlyForYieldAwaitFlags);
  }

  function parseObjectLikePartFromIdent(lexerFlags, scoop, bindingType, isClassMethod, isConstructor, isStatic, identToken, exportedNames, exportedBindings, astProp) {
    ASSERT(parseObjectLikePartFromIdent.length === arguments.length, 'arg count');
    ASSERT(identToken.type === $IDENT, 'should get ident token: ' + identToken);
    ASSERT(typeof astProp === 'string', 'astprop string');
    ASSERT(isStatic === undefined || isStatic.str === 'static', 'keyword or undefined');
    ASSERT(typeof isConstructor === 'boolean', 'enum');

    // note: if this part started with `static` then identToken will always be the NEXT token and isstatic=true
    // - `{ident,`
    // - `{ident:ident`
    // - `{ident:expr`
    // - `{ident(){}`         as follows;
    //   - `{x(){}`
    //   - `{async x(){}`
    //   - `{get x(){}`
    //   - `{set x(y){}`
    //   - `{async [x](){}`
    //   - `{get [x](){}`
    //   - `{set [x](y){}`
    //   - `{async 8(){}`
    //   - `{get 8(){}`
    //   - `{set 8(y){}`
    //   - `{async "x"(){}`
    //   - `{get "x"(){}`
    //   - `{set "x"(y){}`
    //   - `{static x(){}`
    //   - `{static async x(){}`
    //   - `{static get x(){}`
    //   - `{static set x(y){}`
    //   - `{static async [x](){}`
    //   - `{static get [x](){}`
    //   - `{static set [x](y){}`
    //   - `{static async 8(){}`
    //   - `{static get 8(){}`
    //   - `{static set 8(y){}`
    //   - `{static async "x"(){}`
    //   - `{static get "x"(){}`
    //   - `{static set "x"(y){}`

    let destructible = MIGHT_DESTRUCT;
    let assignable = 0; // Propagate await/yield state flags to caller

    if (curc === $$COMMA_2C || curc === $$CURLY_R_7D || curtok.str === '=') {
      // property shorthand; `{ident}=x` is valid, x={y} is also valid
      // - `{ident}`
      // - `{ident = expr}`
      // - `{true}`           illegal
      // - `{eval}`           ok as it is not a "reserved word"
      // - `{await}`          "depends"

      if (isClassMethod) {
        if (curc === $$COMMA_2C) THROW('Classes do not use commas');
        THROW('Class members have to be methods, for now');
      }

      // https://tc39.github.io/ecma262/#prod-ObjectLiteral
      // https://tc39.github.io/ecma262/#prod-PropertyDefinitionList
      // https://tc39.github.io/ecma262/#prod-PropertyDefinition
      // https://tc39.github.io/ecma262/#prod-IdentifierReference
      // https://tc39.github.io/ecma262/#prod-Identifier
      // Identifier : IdentifierName but not ReservedWord
      if (identToken.str === 'eval' || identToken.str === 'arguments') {
        // ({eval});         // ok
        // ({eval} = x);     // bad in strict mode
        // {{eval}) => x;    // bad in strict mode
        if (hasAnyFlag(lexerFlags, LF_STRICT_MODE)) {
          destructible |= CANT_DESTRUCT;
        }
      } else {
        // must throw for reserved words but binding check also checks for `eval`
        // and `arguments` which are not reserved and which would be allowed here
        // Since this is an assignment the `yield` and `await` checks are implicitly done when doing binding name checks
        fatalBindingIdentCheck(identToken, bindingType, lexerFlags);
      }
      SCOPE_addBinding(lexerFlags, scoop, identToken.str, bindingType, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);
      addNameToExports(exportedNames, identToken.str);
      addBindingToExports(exportedBindings, identToken.str);

      AST_open(astProp, 'Property');
      AST_setIdent('key', identToken);
      AST_set('kind', 'init'); // only getters/setters get special value here
      AST_set('method', false); // only the {x(){}} shorthand gets true here, this is {x}
      AST_set('computed', false);
      AST_setIdent('value', identToken);
      if (curc === $$IS_3D && curtok.str === '=') {
        // - `({foo = 10})`
        // the shorthand only forces MUST_DESTRUCT when an initializer follows it immediately
        // (consider `({foo = 10})` vs `({foo: bar = 10})`)
        destructible |= MUST_DESTRUCT; // shorthand + _init_ is only allowed in Pattern

        AST_wrapClosed('value', 'AssignmentExpression', 'left');
        AST_set('operator',  '=');
        ASSERT_skipRex('=', lexerFlags); // a forward slash after = has to be a regex
        let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
        assignable = mergeAssignable(nowAssignable, assignable);
        AST_close('AssignmentExpression');
      }
      AST_set('shorthand', true);
      AST_close('Property');

      ASSERT(curc !== $$IS_3D, 'further assignments should be parsed as part of the rhs expression');
    }
    else if (curc === $$COLON_3A) {
      if (isClassMethod) THROW('Class members have to be methods, for now');
      // property value or label, some are destructible:
      // - ({ident: ident,}
      // - ({ident: (ident)}
      // - ({ident: a.b}
      // - ({ident: a[b]}
      // - ({ident: a(b)}
      // - ({ident: a`b`}
      // - ({ident: <array destruct>,}
      // - ({ident: <object destruct>,}
      // - ({ident: ident = expr}
      // - ({ident: (ident) = expr}
      // - ({ident: a.b = expr}
      // - ({ident: a[b] = expr}
      // - ({ident: a(b) = expr}
      // - ({ident: a`b` = expr}
      // - ({ident: <array destruct> = expr,}
      // - ({ident: <object destruct> = expr,}
      // anything else as value is non-destructible
      ASSERT_skipRex(':', lexerFlags); // next is expression
      if (identToken.str === '__proto__') destructible |= PIGGY_BACK_WAS_PROTO;

      destructible |= parseObjectPropertyValueAfterColon(lexerFlags, identToken, isClassMethod, bindingType, assignable, destructible, scoop,exportedNames, exportedBindings, astProp);
      ASSERT(curc !== $$IS_3D, 'assignments should be parsed as part of the rhs expression');
    }
    else if (curc === $$SQUARE_L_5B) {
      // (this is the part after the first ident of the part (or two if there is a "static" prefix)
      // - ({static [expr](){}
      // - ({get [expr](){}
      // - ({set [expr](ident){}
      // - ({async [expr](){}
      // - ({static get [expr](){}
      // - ({static set [expr](ident){}
      // - ({static async [expr](){}

      destructible |= CANT_DESTRUCT;

      let nowAssignable = parseComputedModifierMethod(lexerFlags, isClassMethod, isStatic, undefined, identToken, astProp);
      assignable = mergeAssignable(nowAssignable, assignable);
    }
    else if (curc === $$PAREN_L_28) {
      // method shorthand
      // - ({ident(){}})

      destructible |= CANT_DESTRUCT;

      AST_setIdent(astProp, identToken);
      if (identToken.str === 'prototype') THROW('Class methods can not be called `prototype`');
      ASSERT(!!(identToken.canon === 'constructor' && !isStatic && isClassMethod) == isConstructor, 'if the ident is constructor then isconstructor should be set');
      parseObjectLikeMethodAfterKey(lexerFlags, isStatic, undefined, undefined, identToken, isClassMethod, isConstructor, NOT_DyNAMIC_PROPERTY, NOT_GETSET, astProp);

      ASSERT(curc !== $$IS_3D, 'this struct does not allow init/defaults');
    }
    else if (curtype === $IDENT) {
      // getter/setter/async shorthand method
      // - ({async ident(){}})
      // - ({get ident(){}})
      // - ({set ident(ident){}})
      destructible |= CANT_DESTRUCT;

      let kind = NOT_GETSET;
      if (identToken.str === 'get') {
        kind = IS_GETTER;
      } else if (identToken.str === 'set') {
        kind = IS_SETTER;
      } else if (!allowAsyncFunctions || identToken.str !== 'async') {
        if (!isClassMethod || identToken.str !== 'static') {
          THROW('Did not expect another identifier while parsing an object literal property');
        }
      }
      let identToken2 = curtok;
      if (identToken2.str === 'prototype') THROW('Class methods can not be called `prototype`');
      ASSERT_skipAny($IDENT, lexerFlags); // TODO: set of allowed characters is wide but limited

      if (curc !== $$PAREN_L_28) THROW('Must have left paren now, got: ' + curtok);
      AST_setIdent(astProp, identToken2);
      parseObjectLikeMethodAfterKey(lexerFlags, isStatic, undefined, identToken, identToken2, isClassMethod, NOT_CONSTRUCTOR, NOT_DyNAMIC_PROPERTY, kind, astProp);

      ASSERT(curc !== $$IS_3D, 'this struct does not allow init/defaults');
    }
    else if (curc === $$STAR_2A) {
      // getter/setter/async with generator
      // note that only async can actually be a generator, getters/setters cannot
      // if the `static` modifier was used then it is passed on as the`isStatic` arg
      // - ({get *ident(){}})
      // - ({set *ident(ident){}})
      // - ({async *ident(){}})
      // - ({get *5(){}})
      // - ({set *5(ident){}})
      // - ({async *5(){}})
      // - ({get *'x'(){}})
      // - ({set *'x'(ident){}})
      // - ({async *'x'(){}})
      // - ({get *[x](){}})
      // - ({set *[x](ident){}})
      // - ({async *[x](){}})
      // - ({static get *ident(){}})
      // - ({static set *ident(ident){}})
      // - ({static async *ident(){}})
      // - ({static get *5(){}})
      // - ({static set *5(ident){}})
      // - ({static async *5(){}})
      // - ({static get *'x'(){}})
      // - ({static set *'x'(ident){}})
      // - ({static async *'x'(){}})
      // - ({static get *[x](){}})
      // - ({static set *[x](ident){}})
      // - ({static async *[x](){}})

      destructible |= CANT_DESTRUCT;

      let starToken = curtok;
      ASSERT_skipAny('*', lexerFlags); // TODO: next must be ident or [

      if (identToken.str === 'get') THROW('A getter cannot be a generator');
      if (identToken.str === 'set') THROW('A setter cannot be a generator');
      ASSERT(identToken.str !== 'static', 'this case is caught elsewhere');
      if (identToken.str !== 'async') THROW('the only method modifier allowed to have a generator is `async` (since es9)');
      if (!allowAsyncFunctions) THROW('Async functions are not supported by the current targeted language version');
      if (!allowAsyncGenerators) THROW('Async generators are not supported by the current targeted language version');

      if (curtype === $IDENT) {
        // `class x{   async *foo(a){}   }`
        // `class x{   async *prototype(a){}   }`
        if (curtok.str === 'prototype') THROW('Class async generator methods can not be called `prototype`');
        let nameToken = curtok;
        AST_setIdent(astProp, curtok);
        ASSERT_skipAny($IDENT, lexerFlags);
        parseObjectLikeMethodAfterKey(lexerFlags, isStatic, starToken, identToken, nameToken, isClassMethod, NOT_CONSTRUCTOR, NOT_DyNAMIC_PROPERTY, NOT_GETSET, astProp);
      } else if ((curtype & $STRING) === $STRING || (curtype & $NUMBER) === $NUMBER) {
        let litToken = curtok;
        AST_setLiteral(astProp, litToken);
        ASSERT_skipAny(litToken.str, lexerFlags); // TODO: next must be `(`
        parseObjectLikeMethodAfterKey(lexerFlags, isStatic, starToken, identToken, litToken, isClassMethod, NOT_CONSTRUCTOR, NOT_DyNAMIC_PROPERTY, NOT_GETSET, astProp);
      } else if (curc === $$SQUARE_L_5B) {
        // - `class x {    async *[y](){}    }`
        // - `x = { async *[y](){} }`
        let nowAssignable = parseComputedModifierMethod(lexerFlags, isClassMethod, isStatic, starToken, identToken, astProp);
        assignable = mergeAssignable(nowAssignable, assignable);
      } else {
        THROW('Invalid key token');
      }

      ASSERT(curc !== $$IS_3D, 'this struct does not allow init/defaults');
    }
    else if (hasAnyFlag(curtype, $NUMBER | $STRING)) {
      // property names can also be strings and numbers but these cannot be shorthanded
      // number/string keys can still destructure just fine (`({"foo": x} = y)`)
      // - `({async "a b c"(){}});`
      // - `({async 15(){}});`
      // - `({get "a b c"(){}});`
      // - `({get 15(){}});`
      // - `({set "a b c"(x){}});`
      // - `({set 15(x){}});`

      destructible |= CANT_DESTRUCT;

      let kind = NOT_GETSET;
      if (identToken.str === 'get') {
        kind = IS_GETTER;
      } else if (identToken.str === 'set') {
        kind = IS_SETTER;
      }

      let litToken = curtok;
      ASSERT_skipRex(litToken.str, lexerFlags); // next is `(`

      AST_setLiteral(astProp, litToken);
      parseObjectLikeMethodAfterKey(lexerFlags, isStatic, undefined, identToken, litToken, isClassMethod, NOT_CONSTRUCTOR, NOT_DyNAMIC_PROPERTY, kind, astProp);
      ASSERT(curc !== $$IS_3D, 'this struct does not allow init/defaults');
    }
    else {
      if (isClassMethod) THROW('Class members have to be methods, for now');
      // this is most likely an error
      // - `({x+=y})`
      THROW('Unexpected character after object literal property name ' + curtok);
    }

    // pick up the flags from assignable and put them in destructible
    // - `result = [...{ x = yield }] = y;`
    // - `function* g() {   [...{ x = yield }] = y   }`
    // - `result = [...{ x = await }] = y;`
    // - `async r => result = [...{ x = await x }] = y;`
    return copyPiggies(destructible, assignable);
  }
  function parseComputedModifierMethod(lexerFlags, isClassMethod, isStatic, isGenerator, modifierIdentToken, astProp) {
    ASSERT(parseComputedModifierMethod.length === arguments.length, 'arg count');

    // skip dynamic part first because we need to assert that we're parsing a method
    ASSERT_skipRex('[', lexerFlags); // next is expression
    let assignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, astProp);
    skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // next is ( or :

    _parseComputedModifierMethod(lexerFlags, isClassMethod, isStatic, isGenerator, modifierIdentToken, astProp);

    // note: we only care about the dynamic part as the rest being parsed here is part of the method itself. So in
    // the next example, the outer function only cares about the expression for the dynamic name:
    // - `async (fail = ({static *[await oops](){}})) => {}`
    return assignable;
  }
  function _parseComputedModifierMethod(lexerFlags, isClassMethod, isStatic, isGenerator, modifierIdentToken, astProp) {
    ASSERT(_parseComputedModifierMethod.length === arguments.length, 'arg count');
    let modifier = modifierIdentToken ? modifierIdentToken.str : '';

    let generatorState = (isGenerator && isGenerator.str === '*') ? WAS_GENERATOR : NOT_GENERATOR;
    let asyncState = NOT_ASYNC;

    let kind = NOT_GETSET;
    let kindValue = '';
    if (modifier === 'get') {
      kind = IS_GETTER;
      kindValue = 'get';
    } else if (modifier === 'set') {
      kind = IS_SETTER;
      kindValue = 'set';
    } else if (modifier === 'async') {
      if (!allowAsyncFunctions) {
        THROW('Async functions are not supported in the currently targeted language version');
      } else if (generatorState === WAS_GENERATOR && !allowAsyncGenerators) {
        THROW('Async generators are not supported in the currently targeted language version');
      } else {
        asyncState = WAS_ASYNC;
        kindValue = isClassMethod === IS_CLASS_METHOD ? 'method' : 'init';
      }
    } else {
      kindValue = isClassMethod === IS_CLASS_METHOD ? 'method' : 'init';
    }

    if (isClassMethod === IS_CLASS_METHOD) {
      AST_wrapClosed(astProp, 'MethodDefinition', 'key');
      AST_set('static', !!isStatic);
      AST_set('computed', true);
      AST_set('kind', kindValue); // only getters/setters get special value here
      parseFunctionAfterKeyword(lexerFlags, DO_NOT_BIND, NOT_FUNC_DECL, NOT_FUNC_EXPR, generatorState, asyncState, IDENT_OPTIONAL, NOT_CONSTRUCTOR, IS_METHOD, kind, NOT_FUNCTION_STATEMENT, 'value');

      AST_close('MethodDefinition');
    } else {
      AST_wrapClosed(astProp, 'Property', 'key');
      AST_set('kind', kindValue); // only getters/setters get special value here
      AST_set('method', kind === NOT_GETSET);
      AST_set('computed', true);
      parseFunctionAfterKeyword(lexerFlags, DO_NOT_BIND, NOT_FUNC_DECL, NOT_FUNC_EXPR, generatorState, asyncState, IDENT_OPTIONAL, NOT_CONSTRUCTOR, IS_METHOD, kind, NOT_FUNCTION_STATEMENT, 'value');
      AST_set('shorthand', false);
      AST_close('Property');
      ASSERT(curc !== $$IS_3D, 'this struct does not allow init/defaults');
    }
  }
  function verifyDestructible(destructible) {
    // ASSERT(destructible >= 0 && destructible < (1<<16), 'bit-wise field range check');

    if (hasAllFlags(destructible, CANT_DESTRUCT) && hasAllFlags(destructible, MUST_DESTRUCT)) {
      THROW('Found a part that cant destruct and a part that must destruct so it is not destructible');
    }
  }
  function verifyDestructibleForBinding(destructible, bindingType) {
    if (hasAnyFlag(destructible, CANT_DESTRUCT)) {
      THROW('The binding pattern is not destructible');
    }
    if (bindingType !== BINDING_TYPE_NONE && hasAnyFlag(destructible, DESTRUCT_ASSIGN_ONLY)) {
      THROW('This binding can not be used in function parameters because it is not destructible');
    }
  }
  function parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, assignable, destructible, closingCharOrd, astProp) {
    ASSERT(arguments.length === parseOptionalDestructibleRestOfExpression.length, 'arg count');

    if (curc === $$COMMA_2C || curc === closingCharOrd) {
      // this means that the value itself had no tail and is destructible as long as it is assignable
      if (notAssignable(assignable)) {
        destructible |= CANT_DESTRUCT;
      }
    } else if (hasAllFlags(destructible, MUST_DESTRUCT)) {
      // [x]: `([{a=b}.x]) => x`
      // [x]: `({a: {a=b}.x}) => x`
      THROW('Found something that had to be a Pattern but had to parse more, which is an error');
    } else {
      assignable = parseValueTail(lexerFlags, assignable, NOT_NEW_ARG, astProp);
      // (If there is no tail the input assignable is returned...)
      if (isAssignable(assignable)) {
        // The destructibility of the whole expression solely depends on the tail
        // For example, `foo`, `foo.bar`, `foo().bar`, `{...x}[y]`, are all assignable and therefor assign-destructible
        destructible = sansFlag(destructible, CANT_DESTRUCT | DESTRUCT_ASSIGN_ONLY | MUST_DESTRUCT);
      } else {
        // This couldn't cause a valid pattern like `[a]` to become invalid just because it had no tail because
        // if there is no tail the input assignable is returned. So `[a+b]` remains non-assignable.
        destructible |= CANT_DESTRUCT;
      }

      let firstOpNotAssign = curtok.str !== '=';
      if (curc !== $$COMMA_2C && curc !== closingCharOrd) {
// if (firstOpNotAssign && notAssignable(assignable)) TODO, destructible |= CANT_DESTRUCT; // TODO I think this is redundant
        // From here on out `assignable` is only used to track yield/await state for fringe cases
        assignable |= parseExpressionFromOp(lexerFlags, assignable, astProp);
        if (firstOpNotAssign) {
          // If there was an op it won't be a (regular) assignment and it can't be destructible in any of those cases
          // - `x, [foo + y, bar] = doo;`
          destructible |= CANT_DESTRUCT;
        } else {
          // - `[x.y = a] = z`
        }
      } else if (firstOpNotAssign) {
        if (bindingType !== BINDING_TYPE_NONE || notAssignable(assignable)) {

          // [v]: `[...[x].map(y, z)];`
          // [x]: `[...[x].map(y, z)] = a;`
          // [x]: `({ident: {x}.join("")}) => x`
          // [v]: `({"x": [y].slice(0)})`
          // [x]: `({"x": [y].slice(0)} = x)`
          // [x]: `({"x": [y].slice(0)}) => x`

          // this is a binding with binary operator that is not just `=`
          // - if destructuring a binding, current path is not destructible
          // - if not assignable, also not destructible
          // - if next token is not the end then also not destructible (but assign is okay)
          destructible |= CANT_DESTRUCT;
        } else {
          // [v]: `[...{a: b.b}.d] = c`
          // [v]: `[...{a: b}.c] = []`
          // [v]: `[...[{a: b}.c]] = [];`
          // [v]: `[...[{prop: 1}.prop]] = []`
          destructible |= DESTRUCT_ASSIGN_ONLY;
        }
      }
    }

    // - `{ (x = [await x]) }`
    // - `async g => (x = [await y])`
    // - `function *g(){ (x = [yield y]) }`
    // - `{ (x = [yield y]) }`
    return copyPiggies(destructible, assignable);
  }
  function parseArrowableSpreadOrRest(lexerFlags, scoop, closingCharOrd, bindingType, groupTopLevel, asyncIdent, exportedNames, exportedBindings, astProp) {
    // parseArrowableRest
    ASSERT(parseArrowableSpreadOrRest.length === arguments.length, 'want all args');
    ASSERT_skipRex('...', lexerFlags); // next is an expression so rex
    if (curc === $$DOT_2E && curtok.str === '...') THROW('Can not rest twice');
    AST_open(astProp, 'SpreadElement');
    let destructible = _parseArrowableSpreadOrRest(lexerFlags, scoop, closingCharOrd, bindingType, groupTopLevel, asyncIdent, exportedNames, exportedBindings, 'argument');
    AST_close('SpreadElement');
    return destructible;
  }
  function _parseArrowableSpreadOrRest(lexerFlags, scoop, closingCharOrd, bindingType, groupTopLevel, asyncIdent, exportedNames, exportedBindings, astProp) {
    ASSERT(_parseArrowableSpreadOrRest.length === arguments.length, 'arg count');
    ASSERT(typeof bindingType === 'number', 'enum');
    // returns CANT_DESTRUCT if the arg is not only an ident

    // Arrays:
    // https://tc39.github.io/ecma262/#prod-SpreadElement
    // can be any pattern

    // Objects:
    // https://tc39.github.io/ecma262/#prod-BindingRestProperty
    // can only be idents if bindingType is not NONE (same as array in assignment)

    // Bindings, Args, Destructurings: in no production is rest allowing an init:
    // var
    // https://tc39.github.io/ecma262/#prod-VariableStatement
    // https://tc39.github.io/ecma262/#prod-VariableDeclaration
    // https://tc39.github.io/ecma262/#prod-BindingPattern ->
    // let/const
    // https://tc39.github.io/ecma262/#prod-LexicalDeclaration
    // https://tc39.github.io/ecma262/#prod-LexicalBinding
    // https://tc39.github.io/ecma262/#prod-BindingPattern ->
    // binding destructuring:
    // https://tc39.github.io/ecma262/#prod-ArrayAssignmentPattern ->
    // https://tc39.github.io/ecma262/#prod-BindingRestElement
    // https://tc39.github.io/ecma262/#prod-BindingPattern ->
    // this is okay in functions:
    // https://tc39.github.io/ecma262/#prod-FunctionDeclaration
    // https://tc39.github.io/ecma262/#prod-FunctionRestParameter
    // https://tc39.github.io/ecma262/#prod-BindingRestElement
    // https://tc39.github.io/ecma262/#prod-BindingPattern ->
    // -> binding pattern:
    // https://tc39.github.io/ecma262/#prod-BindingPattern
    // this is either [] array or {} object wrapped with no further outer assignments (or anything)

    let destructible = MIGHT_DESTRUCT;
    let assignable = initAssignable(); // required for parsing the tail of the arg
    if (curtype === $IDENT) {
      // - `[...x];`
      // - `[...x/y];`
      // - `[...x, y];`       // cant destruct (array rest must be last)
      // - `[...this, y];`    // cant destruct (array rest must be last)
      // - `{...x};`
      // - `{...x/y};`
      // - `{...x, y};`       // cant destruct (obj rest must be last)
      // - `{...this, y};`    // cant destruct (obj rest must be last)

      // - `async(...x/y);`   // async call

      // basically three ways this can be followed up (not, arrow, assign)
      // - `[...x];`          // ok
      // - `{...x};`          // ok
      // - `([...x]) => y;`   // ok
      // - `({...x}) => y;`   // ok
      // - `[...x] = y;`      // ok ("destructuring assignment")
      // - `{...x} = y;`      // ok ("destructuring assignment")
      // - `[...this];`       // ok
      // - `{...this};`       // ok
      // - `[...this] = x;`   // bad
      // - `{...this} = x;`   // bad
      // - `([...this]) => x;`  // bad
      // - `({...this}) => x;`  // bad

      // - `[...new x];`      // ok, cannot destruct
      // - `{...new x};`      // ok, cannot destruct
      // - `[...new];`        // bad
      // - `{...new};`        // bad
      // - `[...(x)];`        // ok, not arrowable
      // - `{...(x)};`        // ok, not arrowable
      // - `[...(x,y)];`      // ok (!)
      // - `{...(x,y)};`      // ok, cannot destruct
      // - `[...x = x];`      // (valid but never destructible)
      // - `{...x = x};`      // (valid but never destructible)

      // rest can be a property with assignment destructuring (invalid for arrows/bindings)
      // - `({...a.x} = x);`
      // - `([...a.x] = x);`
      // - `({...a[x]} = x);`
      // - `([...a[x]] = x);`

      // don't update destructible here. assignment is handled at the end of this function (!)

      let identToken = curtok;
      let assignableOrErrorMsg = nonFatalBindingAssignableIdentCheck(identToken, bindingType, lexerFlags);
      skipIdentSafeSlowAndExpensive(lexerFlags); // will properly deal with div/rex cases
      let assignBefore = curtok.str === '=';
      let willBeSimple = curc === closingCharOrd || curc === $$COMMA_2C || assignBefore;
      if (willBeSimple && !isAssignable(assignableOrErrorMsg)) {
        // - `[...await] = obj`
        // - `[...this];`
        destructible |= CANT_DESTRUCT;
      }
      if (!willBeSimple && closingCharOrd === $$CURLY_R_7D && bindingType !== BINDING_TYPE_NONE) {
        // - `function f({...a.b}){}`
        THROW('The rest argument of an object binding pattern must always be a simple ident');
      }
      assignable = parseValueAfterIdent(lexerFlags, identToken, bindingType, ASSIGN_EXPR_IS_OK, astProp);
      ASSERT(!assignBefore || curtok.str === '=', 'parseValueAfterIdent should not consume the assignment');
      let assignAfter = curtok.str === '=';
      if (curc !== $$COMMA_2C && curc !== closingCharOrd) {
        if (assignAfter) {
          // - `async (a, ...b=fail) => a;`
          // - `[x, y, ...z = arr]`
          if (notAssignable(assignable)) {
            // - `async (a, ...true=fail) => a;`
            THROW('Tried to assign to a value that was not assignable in arr/obj lit/patt');
          }
        }
        // this will parse the assignment too
        // note: rest cannot have an initializer so any suffix invalidates destructuring
        destructible |= CANT_DESTRUCT;
        assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
      }
      if (notAssignable(assignable)) {
        // `[...a+b]`
        destructible |= CANT_DESTRUCT;
      } else if (willBeSimple) {
        SCOPE_addBinding(lexerFlags, scoop, identToken.str, bindingType, SKIP_DUPE_CHECKS, ORIGIN_NOT_VAR_DECL);
        // `[...foo] = bar`                (scoop&exports will be empty)
        // `let [...foo] = bar`            (exports will be empty)
        // `export let [...foo] = bar`     (will have scoop & exports)
        // `[...(foo)] = bar`              (noop-group edge case)
        // (if this isn't part of an exports declaration then the exportNames/Bindings array is null)
        addNameToExports(exportedNames, identToken.str);
        addBindingToExports(exportedBindings, identToken.str);
      } else {
        // `[...a.b]=c`
        // `let [...a.b]=c`
        // `for ([...a.b] in c) d`
        // `for (let [...a.b] in c) d`
        // `try {} catch ([...a.b]) {}`
        // `[...a.b] = c`
        // `([...a.b] = c)`
        // `([...a.b]) => c`
        destructible |= DESTRUCT_ASSIGN_ONLY;
      }
    }
    else if (curc === $$SQUARE_L_5B) {
      // - `(...[x]) => x`
      // - `[...[x]]`
      // - `[...[x]] = y`
      // - `([...[x]]) => x`
      // - `[...[x]/y]`
      // - `[...[x].foo] = x`
      // - `[...[x]=y]`             - yes (spread can be assignment, the assignment isn't default/init)
      // - `[...[x]=y] = z`         - no (rest cannot have default)
      // Note: rest param can be on arr/obj
      // - `(...[x,y]) => {}`
      // - `([...[x,y]]) => {}`
      // rest can be a property with assignment destructuring (invalid for arrows/bindings)
      // - `({...[]} = x);`        // bad (rest arg must be simple)
      // - `({...[].x} = x);`
      // - `([...[].x] = x);`
      // - `({...[][x]} = x);`
      // - `([...[][x]] = x);`
      let nowDestruct = parseArrayLiteralPattern(lexerFlags, scoop, bindingType, SKIP_INIT, exportedNames, exportedBindings, astProp);
      ASSERT(curtok.str !== '=' || (nowDestruct|CANT_DESTRUCT), 'rest can never have default so if there was an assignment dont let it be destructible');
      if (curtok.str !== '=' && curc !== closingCharOrd && curc !== $$COMMA_2C) {
        // - `({...[].x} = x);`
        destructible = parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, assignable, nowDestruct, closingCharOrd, astProp);
      } else {
        // The rest arg of an _object_ pattern can only be a simple assignment target. The rest of an array pattern
        // has more freedom. If there is no tail for obj rest then this not destructible.
        // - `({ ...[x] }) => {}`
        // - `{...[] = c}`
        // - `[...[] = c]`
        if (closingCharOrd === $$CURLY_R_7D && curtok.str !== '=') {
          destructible |= nowDestruct | CANT_DESTRUCT;
        } else {
          destructible |= nowDestruct;
        }
      }
      assignable = hasAllFlags(destructible, CANT_DESTRUCT) ? NOT_ASSIGNABLE : IS_ASSIGNABLE; // this is valid: `[...[x]=y];`

      // A param object pattern can only have a rest with ident, this was not just an ident, so assignment pattern only
      // (The object rest in any binding pattern can only be a simple ident)
      if (closingCharOrd === $$CURLY_R_7D && bindingType !== BINDING_TYPE_NONE) {
        // - `function f({...[a, b]}){}`
        THROW('The rest argument of an object binding pattern must always be a simple ident and not an object pattern');
      }
    }
    else if (curc === $$CURLY_L_7B) {
      // - `(...{x}) => x`
      // - `[...{x}]`
      // - `[...{x}] = y`
      // - `([...{x}]) => x`
      // - `[...{x}/y]`
      // - `[...{x}.foo] = x`
      // Note: rest param can be on arr/obj
      // - `(...{x:y}) => {}`
      // - `([...{x:y}]) => {}`
      // (and object)
      // rest can be a property with assignment destructuring (invalid for arrows/bindings)
      // - `({...{}} = x);`       // bad (rest arg must be simple)
      // - `({...{}.x} = x);`
      // - `([...{}.x] = x);`
      // - `({...{}[x]} = x);`
      // - `([...{}[x]] = x);`
      let nowDestruct = parseObjectLiteralPatternAndAssign(lexerFlags, scoop, bindingType, SKIP_INIT, NOT_CLASS_METHOD, exportedNames, exportedBindings, astProp);
      ASSERT(curtok.str !== '=' || (nowDestruct|CANT_DESTRUCT), 'rest can never have default so if there was an assignment dont let it be destructible');
      if (curtok.str !== '=' && curc !== closingCharOrd && curc !== $$COMMA_2C) {
        // - `({ ...{}.x } = x);`
        destructible = parseOptionalDestructibleRestOfExpression(lexerFlags, bindingType, assignable, nowDestruct, closingCharOrd, astProp);
      } else {
        // The rest arg of an _object_ pattern can only be a simple assignment target. The rest of an array pattern
        // has more freedom. If there is no tail for obj rest then this not destructible.
        // - `({ ...{x} }) => {}`
        // - `{...{} = c}`
        // - `[...{} = c]`
        // - `{...{}}`
        // - `[...{}]`                 // TODO: parse or runtime error? or potentially valid? What if the object is an iterable?
        destructible |= nowDestruct;
        if (closingCharOrd === $$CURLY_R_7D && curtok.str !== '=') {
          destructible |= CANT_DESTRUCT;
        }
      }
      assignable = hasAllFlags(destructible, CANT_DESTRUCT) ? NOT_ASSIGNABLE : IS_ASSIGNABLE; // this is valid: `[...{x}=y];`
      // A param object pattern can only have a rest with ident, this was not just an ident, so assignment pattern only
      // (The object rest in any binding pattern can only be a simple ident)
      if (closingCharOrd === $$CURLY_R_7D && bindingType !== BINDING_TYPE_NONE) {
        // - `let {...{a,b}} = foo`
        THROW('The rest argument of an object binding pattern must always be a simple ident and not an array pattern');
      }
    }
    else if (curc === closingCharOrd) {
      // `[...]`
      // `(...)`
      THROW('The rest/spread operator is missing an argument');
    }
    else {
      // - `(...<expr>) => x`
      // - `function f(... <expr>) {}`
      // - `const [x] = y`
      // - `const [...,] = x`
      // - `let [..."foo"] = x`

      if (bindingType !== BINDING_TYPE_NONE) {
        // - `const {...[a]} = x`
        // - `const {...{a}} = x`
        // - `const {...a=b} = x`
        // - `const {...a+b} = x`
        THROW('The rest arg was not destructible as it can only apply to an identifier or array/object pattern arg');
      }

      // - `[.../x//y]`
      // - `[.../x/g/y]`
      // - `[...50]`
      // Note that for assignments a literal here could be destructible as long as it ends up being a member expression
      // - `[..."foo".bar]`
      // - `[...a=b]`
      // - `[...(x)]`
      // - `[...(x,y)]`
      // - `[.../x/+y]`

      // Note: already asserted that the head is not an ident, array, object, or rest, so it's not assignable on its own.
      // However, if the value is assignable as a whole (like `"foo".bar`) then we can still assign-destruct it.

      let nowAssignable = parseValue(lexerFlags, ASSIGN_EXPR_IS_OK, NOT_NEW_ARG, astProp);
      assignable = mergeAssignable(nowAssignable, assignable);

      if (curtok.str === '=' && curc !== closingCharOrd && curc !== $$COMMA_2C) {
        if (notAssignable(assignable)) {
          // - `[..."x"=b]`
          THROW('Cannot assign to lhs, not destructible with this initializer');
        }

        // - `[..."x".foo = b]`
        // - `[..."x".foo = b] = x`    (fail)
        assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
        destructible |= CANT_DESTRUCT; // assignments are not assignment destructible
      }
      else {
        // - `[..."foo"]`
        // - `[..."foo".bar]`
        // - `[...50]`
        // - `[...50..bar]`
        // - `[.../x//y]`
        // - `[.../x/g/y]`
        // - `[...(x)]`
        // - `[...(x,y)]`
        // - `[.../x/+y]`

        if (curc !== $$COMMA_2C && curc !== closingCharOrd) {
          // - `[.../x//y]`
          // - `[.../x/g/y]`
          // - `[..."foo".bar]`
          // - `[...(x)]`
          // - `[...(x,y)]`
          // - `[.../x/+y]`
          assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
        }
        else {
          // rest arg was a value without op
          // - `[..."f".toString()]`
          // - `[.../x/]`
          // - `[.../x/g]`
          // - `[...50]`
          // - `[..."foo"]`
        }

        if (isAssignable(assignable)) {
          // - `[..."x".y]`
          destructible |= DESTRUCT_ASSIGN_ONLY;
        } else {
          // - `[..."x" + y]`
          destructible |= CANT_DESTRUCT;
        }
      }

      // A param object pattern can only have a rest with ident, this was not just an ident, cant destruct to a rest
      if (closingCharOrd === $$CURLY_R_7D && !isAssignable(assignable)) destructible |= CANT_DESTRUCT;

      // TODO: come up with test cases that cover these checks
      if (hasAllFlags(assignable, PIGGY_BACK_SAW_AWAIT_KEYWORD)) TODO;
      if (hasAllFlags(assignable, PIGGY_BACK_SAW_AWAIT_VARNAME)) TODO;
      if (hasAllFlags(assignable, PIGGY_BACK_SAW_YIELD_KEYWORD)) TODO;
      // if (hasAllFlags(assignable, PIGGY_BACK_SAW_YIELD_VARNAME)) TODO; // `[.../x//yield]` (superseded by another check elsewhere)

      return copyPiggies(destructible, assignable);
    }

    if (curc !== closingCharOrd) {
      if (bindingType === BINDING_TYPE_ARG) {
        if (asyncIdent) {
          destructible |= CANT_DESTRUCT;
        } else {
          $log('rest crashed, closingCharOrd='+String.fromCharCode(closingCharOrd)+', token: ' + curtok);
          if (curtok.str === '=') THROW('The rest argument can not have an initializer');
          else if (curtok.str === ',') THROW('The rest argument was not destructible as it must be last and can not have a trailing comma');
          else THROW('The rest argument must the be last parameter');
        }
      }
      if (curc === $$IS_3D && curtok.str === '=') {
        verifyDestructible(destructible | MUST_DESTRUCT); // this is to assert the above _can_ be destructed
        // - `[...a = b] = c`
        // - `{a = b} = c`
        // - `[...{a = b}] = c`
        // - `[...{a = b} = c]`
        // this assignment resets the destructible state
        // for example;
        //   `({a = b})` must destruct because of the shorthand.
        //   `[...a=b]` can't destruct because rest is only legal on a simple identifier.
        // So combining them you get `[...{a = b} = c]` where the inside must destruct and the outside cannot. (there's a test)
        destructible = CANT_DESTRUCT;

        // the array MUST now be a pattern. Does not need to be an arrow.
        // the outer-most assignment is an expression, the inner assignments become patterns too.
        AST_destruct(astProp);
        AST_wrapClosed(astProp, 'AssignmentExpression', 'left');
        AST_set('operator', '=');
        ASSERT_skipRex('=', lexerFlags); // a forward slash after = has to be a division
        let nowAssignable = parseExpression(lexerFlags, ASSIGN_EXPR_IS_OK, 'right');
        assignable = mergeAssignable(nowAssignable, assignable);
        AST_close('AssignmentExpression');
        // at this point the end should be reached or another point in the code will throw an error on it
        // TODO: should we assert that here and (can we) throw a nicer contextual error?
      } else {
        // TODO: is there a case where destructible = MUST?
        assignable = parseValueTail(lexerFlags, assignable, NOT_NEW_ARG, astProp);
        assignable = parseExpressionFromOp(lexerFlags, assignable, astProp);
      }
      // - `[...{a = b} = c];`
      // - `[...{a: b.b} = c]`
      destructible |= CANT_DESTRUCT; // a spread with non-ident arg is not restable so not destructible
    }

    // - `async x => [...await x]`
    // - `function *g() { [...yield]; }`
    // - `[...await]`
    // - `[...yield]`
    // destructible because the `...` is at the end of the structure and its arg is an ident/array/object and has no tail
    return copyPiggies(destructible, assignable);
  }
  function parseObjectLikeMethodAfterKey(lexerFlags, isStatic, isGenerator, asyncgetsetToken, keyToken, isClassMethod, isConstructor, isDynamic, isGetSet, astProp) {
    ASSERT(arguments.length === parseObjectLikeMethodAfterKey.length, 'want args');
    ASSERT(asyncgetsetToken === undefined || (asyncgetsetToken.str === 'get' || asyncgetsetToken.str === 'set' || asyncgetsetToken.str === 'async'), 'either pass on token or undefined');
    ASSERT(isStatic === undefined || isStatic.type === $IDENT, 'isStatic should be token or undefined');
    ASSERT(isGenerator === undefined || isGenerator.type === $PUNCTUATOR, 'isGenerator should be * token or undefined');
    ASSERT(keyToken === undefined || keyToken.str, 'keyToken is a token');
    ASSERT(keyToken === undefined || (keyToken.type === $IDENT || hasAnyFlag(keyToken.type, $STRING | $NUMBER)), 'keyToken is a string or ident', ''+keyToken);
    ASSERT(typeof isClassMethod === 'boolean', 'isClassMethod is a bool');
    ASSERT(typeof isDynamic === 'boolean', 'isDynamic is a bool');

    let modifier = asyncgetsetToken ? asyncgetsetToken.str : '';
    let asyncState = NOT_ASYNC;
    let generatorState = isGenerator ? WAS_GENERATOR : NOT_GENERATOR;

    if (modifier === 'async') {
      if (!allowAsyncFunctions) {
        THROW('Async functions are not supported in the currently targeted language version');
      } else if (isGenerator && !allowAsyncGenerators) {
        THROW('Async generators are not supported in the currently targeted language version');
      } else {
        asyncState = WAS_ASYNC;
      }
    }

    if (isClassMethod) {
      AST_wrapClosed(astProp, 'MethodDefinition', 'key');
      AST_set('static', !!isStatic);
      AST_set('computed', !!isDynamic);

      // constructor cant have get/set/*/async but can be static
      // https://tc39.github.io/ecma262/#sec-object-initializer-static-semantics-propname
      // > LiteralPropertyName:StringLiteral
      // >   Return the String value whose code units are the SV of the StringLiteral.
      // In other words; `class x{"constructor"(){}}` is also a proper constructor
      if (isConstructor) {
        // https://tc39.github.io/ecma262/#sec-class-definitions-static-semantics-early-errors
        // > It is a Syntax Error if PropName of MethodDefinition is "constructor" and SpecialMethod of MethodDefinition is true.
        // (generator, async, async gen, get, set)
        if (isGetSet === IS_GETTER || isGetSet === IS_SETTER || isGenerator || asyncState === WAS_ASYNC) {
          TODO // does that even reach here?
          THROW('The constructor can not be a getter, setter, async, or generator');
        }
        AST_set('kind', 'constructor');
      } else if (isGetSet === IS_GETTER) {
        AST_set('kind', 'get'); // only getters/setters get special value here

        if (keyToken && !isStatic && (
          (keyToken.type === $IDENT && keyToken.canon === 'constructor') ||
          (hasAllFlags(keyToken.type, $STRING) && keyToken.str.slice(1, -1) === 'constructor')
        )) THROW('Constructors cannot be get/set/async/generators');
      } else if (isGetSet === IS_SETTER) {
        AST_set('kind', 'set'); // only getters/setters get special value here

        if (keyToken && !isStatic && (
          (keyToken.type === $IDENT && keyToken.canon === 'constructor') ||
          (hasAllFlags(keyToken.type, $STRING) && keyToken.str.slice(1, -1) === 'constructor')
        )) THROW('Constructors cannot be get/set/async/generators');
      } else {
        ASSERT(isGetSet === NOT_GETSET, 'enum');
        AST_set('kind', 'method'); // only getters/setters get special value here

        if ((isGenerator || asyncState === WAS_ASYNC) && keyToken && !isStatic && (
          (keyToken.type === $IDENT && keyToken.canon === 'constructor') ||
          (hasAllFlags(keyToken.type, $STRING) && keyToken.str.slice(1, -1) === 'constructor')
        )) THROW('Constructors cannot be get/set/async/generators');
      }

      ASSERT(curc === $$PAREN_L_28, 'should have parsed everything before the method args now');
      parseFunctionAfterKeyword(lexerFlags, DO_NOT_BIND, NOT_FUNC_DECL, NOT_FUNC_EXPR, generatorState, asyncState, IDENT_OPTIONAL, isConstructor, IS_METHOD, isGetSet, NOT_FUNCTION_STATEMENT, 'value');

      AST_close('MethodDefinition');
    } else {
      if (isStatic) THROW('Only class methods can be `static`');
      ASSERT(isConstructor === NOT_CONSTRUCTOR, 'should not have constructor for object');
      AST_wrapClosed(astProp, 'Property', 'key');

      if (isGetSet === IS_GETTER) {
        AST_set('kind', 'get'); // only getters/setters get special value here
      } else if (isGetSet === IS_SETTER) {
        AST_set('kind', 'set'); // only getters/setters get special value here
      } else {
        AST_set('kind', 'init'); // classes get methods, objects get init
      }
      AST_set('method', isGetSet === NOT_GETSET); // getters and setters are not considered methods here
      AST_set('computed', !!isDynamic);

      if (curc !== $$PAREN_L_28) {
        // [x]: `wrap({get 123: x});`
        THROW('Expected to parse a paren of the method now but found something else');
      }
      parseFunctionAfterKeyword(lexerFlags, DO_NOT_BIND, NOT_FUNC_DECL, NOT_FUNC_EXPR, generatorState, asyncState, IDENT_OPTIONAL, NOT_CONSTRUCTOR, IS_METHOD, isGetSet, NOT_FUNCTION_STATEMENT, 'value');

      AST_set('shorthand', false);
      AST_close('Property');
    }
  }

  // <SCRUB AST>
  function logPath() {
    $log('logPath: ' + _path.map(o=>o.type).join(' '))
  }
  function logTree() {
    $log('logTree: ' + inspect(_tree, false, null))
  }
  // </SCRUB AST>

  let initialLexerFlags = sansFlag(INITIAL_LEXER_FLAGS | ((options_strictMode || goalMode === GOAL_MODULE) ? LF_STRICT_MODE : 0), LF_FOR_REGEX);
  init(initialLexerFlags);
  parseTopLevels(initialLexerFlags);

  return {
    ast:
    // <SCRUB AST>
    _tree
    // </SCRUB AST>
    ,
    tokens: tok.tokens,
    tokenCountSolid: tok.getTokenCountAny(),
    tokenCountAny: tok.getTokenCountSolid(),
  }
}

function getGenericTokenType(type) {
  // the token type is a bitwise flag which allows us to be specific
  // sometimes we just want to quickly know whether the token is a
  // string and not care about it being a single or double quoted string.

  let redundantFlags =
    (($NUMBER_HEX | $NUMBER_DEC | $NUMBER_BIN | $NUMBER_OCT | $NUMBER_OLD | $NUMBER) ^ $NUMBER) |
    (($REGEXU | $REGEX) ^ $REGEX) |
    (($STRING_DOUBLE | $STRING_SINGLE | $STRING) ^ $STRING) |
    (($TICK_BODY | $TICK_HEAD | $TICK_PURE | $TICK_TAIL | $TICK_BAD_ESCAPE | $TICK) ^ $TICK);
  // (x|y)^y : the or will first make sure the bits are set (regardless) and the xor then unsets them
  //ASSERT((1 << Math.clz((type | redundantFlags) ^ redundantFlags)) === ((type | redundantFlags) ^ redundantFlags), 'should only have one bit set');
  return (type | redundantFlags) ^ redundantFlags;
}

function isTemplateStart(curtype) {
  return (curtype & $TICK_PURE) === $TICK_PURE || (curtype & $TICK_HEAD) === $TICK_HEAD;
}

function D(d) {
  if (d === 0) {
    return 'D=MIGHT_DESTRUCT';
  }

  let arr = [];
  if (d & CANT_DESTRUCT) {
    arr.push('CANT_DESTRUCT');
    d ^= CANT_DESTRUCT;
  }
  if (d & MUST_DESTRUCT) {
    arr.push('MUST_DESTRUCT');
    d ^= MUST_DESTRUCT;
  }
  if (d & DESTRUCT_ASSIGN_ONLY) {
    arr.push('DESTRUCT_ASSIGN_ONLY');
    d ^= DESTRUCT_ASSIGN_ONLY;
  }
  if (d & PIGGY_BACK_WAS_CONSTRUCTOR) {
    arr.push('PIGGY_BACK_WAS_CONSTRUCTOR');
    d ^= PIGGY_BACK_WAS_CONSTRUCTOR;
  }
  if (d & PIGGY_BACK_WAS_PROTO) {
    arr.push('PIGGY_BACK_WAS_PROTO');
    d ^= PIGGY_BACK_WAS_PROTO;
  }
  if (d & PIGGY_BACK_SAW_AWAIT_KEYWORD) {
    arr.push('PIGGY_BACK_SAW_AWAIT_KEYWORD');
    d ^= PIGGY_BACK_SAW_AWAIT_KEYWORD;
  }
  if (d & PIGGY_BACK_SAW_AWAIT_VARNAME) {
    arr.push('PIGGY_BACK_SAW_AWAIT_VARNAME');
    d ^= PIGGY_BACK_SAW_AWAIT_VARNAME;
  }
  if (d & PIGGY_BACK_SAW_YIELD_KEYWORD) {
    arr.push('PIGGY_BACK_SAW_YIELD_KEYWORD');
    d ^= PIGGY_BACK_SAW_YIELD_KEYWORD;
  }
  if (d & PIGGY_BACK_SAW_YIELD_VARNAME) {
    arr.push('PIGGY_BACK_SAW_YIELD_VARNAME');
    d ^= PIGGY_BACK_SAW_YIELD_VARNAME;
  }

  if (d !== 0) {
    $log('Gathered flags so far:', arr.join(', '))
    _THROW('D: unknown flags left:', d.toString(2));
  }

  return 'D='+arr.join(', ');
}
function A(a) {
  if (a === 0) {
    return 'A=ASSIGNABLE_UNDETERMINED';
  }

  let arr = [];
  if (a & NOT_ASSIGNABLE) {
    arr.push('NOT_ASSIGNABLE');
    a ^= NOT_ASSIGNABLE;
  }
  if (a & IS_ASSIGNABLE) {
    arr.push('IS_ASSIGNABLE');
    a ^= IS_ASSIGNABLE;
  }
  if (a & PIGGY_BACK_SAW_AWAIT_VARNAME) {
    arr.push('PIGGY_BACK_SAW_AWAIT_VARNAME');
    a ^= PIGGY_BACK_SAW_AWAIT_VARNAME;
  }
  if (a & PIGGY_BACK_SAW_AWAIT_KEYWORD) {
    arr.push('PIGGY_BACK_SAW_AWAIT_KEYWORD');
    a ^= PIGGY_BACK_SAW_AWAIT_KEYWORD;
  }
  if (a & PIGGY_BACK_SAW_YIELD_VARNAME) {
    arr.push('PIGGY_BACK_SAW_YIELD_VARNAME');
    a ^= PIGGY_BACK_SAW_YIELD_VARNAME;
  }
  if (a & PIGGY_BACK_SAW_YIELD_KEYWORD) {
    arr.push('PIGGY_BACK_SAW_YIELD_KEYWORD');
    a ^= PIGGY_BACK_SAW_YIELD_KEYWORD;
  }

  if (a !== 0) {
    $log('Gathered flags so far:', arr.join(', '))
    _THROW('A: unknown flags left:', a.toString(2));
  }

  return 'A='+arr.join(', ');
}

// </BODY>

export default ZeParser;
export {
  // this is a re-export but prevents external scripts from also needing to require zetokenizer
  // (okay and in the build it all falls apart, anyways)
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,

  GOAL_MODULE,
  GOAL_SCRIPT,

  FOR_SCOPE,
  BLOCK_SCOPE,
  ARG_SCOPE,
  CATCH_SCOPE,
  SWITCH_SCOPE,

  VERSION_EXPONENTIATION,
  VERSION_WHATEVER,
};
