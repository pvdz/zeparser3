console.log('verdergaan met asi dingesen. was ook bezig om expressions in eigen bestand te zetten enzo')

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
  THROW: _THROW,
} = require('./utils'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from 'utils';

//import ZeTokenizer, {
let { default: ZeTokenizer,
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
  $TICK_BODY,
  $TICK_HEAD,
  $TICK_PURE,
  $TICK_TAIL,

  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,

  GOAL_MODULE,
  GOAL_SCRIPT,

  LF_CAN_NEW_TARGET,
  LF_STRICT_MODE,
  LF_FOR_REGEX,
  LF_IN_TEMPLATE,
  LF_IN_ASYNC,
  LF_IN_GENERATOR,
  LF_IN_FUNC_ARGS,
  LF_NO_FUNC_DECL,
  LF_NO_YIELD,
  INITIAL_LEXER_FLAGS,
  LF_DEBUG,

  RETURN_ANY_TOKENS,
  RETURN_SOLID_TOKENS,

  WEB_COMPAT_OFF,
  WEB_COMPAT_ON,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

// <BODY>

const LHS_NOT_PAREN_START = false;
const INSIDE_PARAM_DECL = true;
const NOT_DESTRUCTURING = false;
const WAS_GET = true;
const NOT_GET = false;
const WAS_SET = true;
const NOT_SET = false;
const WAS_ASYNC = true;
const NOT_ASYNC = false;
const WAS_GENERATOR = true;
const NOT_GENERATOR = false;
const WAS_COMPUTED = true;
const NOT_COMPUTED = false;
const CALLED_FROM_WRAPPER = true;
const CONVERT_ASSIGNMENTS_TOO = true;
const DONT_CONVERT_ASSIGNMENTS = false;
const IS_FUNC_DECL = true;
const NOT_FUNC_DECL = false;
const IDENT_OPTIONAL = true;
const IDENT_REQUIRED = false;
const BODY_IS_EXPR = true;
const BODY_IS_BLOCK = false;
const NOT_FUNCEXPR = false;
const IS_ASSIGNABLE = true;
const NOT_ASSIGNABLE = false;
const HAS_STATIC_MODIFIER = true;
const NO_STATIC_MODIFIER = false;
const PARSE_VALUE_MAYBE = true;
const PARSE_VALUE_MUST = false;
const YIELD_WITHOUT_VALUE = 0;
const WITH_ASSIGNABLE = 1;
const WITH_NON_ASSIGNABLE = 2;
const NOT_NEW_TARGET = false;
const CHECK_NEW_TARGET = true;
const IS_ARROW = true;
const NOT_ARROW = false;

function ZeParser(code, goalMode = GOAL_SCRIPT, collectTokens = COLLECT_TOKENS_NONE, options = {}) {
  let {
    webCompat: options_webCompat = WEB_COMPAT_ON,
    strictMode: options_strictMode = false,
  } = options;

  let tok = ZeTokenizer(code, false, collectTokens, options_webCompat);

  let prevtok = null;
  let curtok = null;
  let curtype = 0;
  let curc = 0;

  let webModeWarnings = []; // when parsing anything that is only accepted because of annex B in the spec <token, desc>

  let traceast = false;

  function THROW(desc) {
    console.log('\n');
    console.log('Error in parser:', desc);
    console.log('Error token:', curtok);
    tok.throw('Parser error! ' + desc);
  }

  // https://github.com/estree/estree
  // https://github.com/estree/estree/blob/master/es5.md
  // https://github.com/estree/estree/blob/master/es2015.md
  // https://astexplorer.net/
  let _tree = {
    type: 'Program',
  };
  let _path = [_tree];
  let _pnames = [];
  function AST_open(prop, type, fromWrap = false) {
    if (traceast) {
      console.log('AST_open; write type='+type+' to prop=' + prop, fromWrap);
      console.log('- path (before):', _path.map(o => o.type).join(' - '));
      console.log('- AST:', require('util').inspect(_tree, false, null))
    }
    ASSERT(arguments.length === 2 || arguments.length === 3, '2 args');
    let node = _path[_path.length - 1];
    let newnode = {type};
    if (Array.isArray(node[prop])) {
      node[prop].push(newnode);
    } else if (node[prop] === undefined || fromWrap) {
      node[prop] = newnode;
    } else {
      THROW('bad tree? node[prop] (prop='+prop+') should be undefined but wasnt (child=' + node + ', prop='+ prop+ ', type='+ type+ ', node[prop]='+ node[prop]+')');
    }
    _path.push(newnode);
    _pnames.push(prop);
  }
  function AST_close() {
    if (traceast) {
      console.log('AST_close');
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- AST:', require('util').inspect(_tree, false, null))
    }
    _path.pop();
    _pnames.pop();
  }
  function AST_set(prop, value) {
    if (traceast) {
      console.log('AST_set', prop, value);
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- AST:', require('util').inspect(_tree, false, null))
    }
    ASSERT(_path[_path.length - 1][prop] === undefined, 'dont clobber, prop=' + prop + ', val=' + value);// + ',was=' + JSON.stringify(_path[_path.length - 1]));
    _path[_path.length - 1][prop] = value;
  }
  function AST_setIdent(astProp, token) {
    ASSERT(typeof astProp === 'string', 'prop is string');
    ASSERT(typeof token === 'object', 'token is obj');

    AST_open(astProp, 'Identifier');
    AST_set('name', token.str);
    AST_close();
  }
  function AST_setLiteral(astProp, token) {
    ASSERT(typeof astProp === 'string', 'prop is string');
    ASSERT(typeof token === 'object', 'token is obj');

    AST_open(astProp, 'Literal');
    AST_set('value', '<TODO>');
    AST_set('raw', token.str);
    AST_close();
  }
  function AST_add(prop, value) {
    if (traceast) {
      console.log('ADD', prop, value);
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- AST:', require('util').inspect(_tree, false, null))
    }
    ASSERT(Array.isArray(_path[_path.length - 1][prop]), 'expecting to add to an existing array');
    _path[_path.length - 1][prop].push(value);
  }
  function AST_wrapOpened(prop, newNodeType, newProp) {
    if (traceast) {
      console.log('AST_wrapOpened', prop, newNodeType, newProp)
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before:', require('util').inspect(_tree, false, null))
    }
    // wrap the "current" node (last of _tree) with an extra node
    // so the parent of node becomes the parent of a new node and
    // the old node becomes a child of the new node
    // a(x:b) -> a(x:c(y:b))

    let node = _path.pop();
    _pnames.pop();
    let parent = _path[_path.length-1];

    if (traceast) console.log(' - node to wrap:', node, ', prop:', prop, ', parent:', parent);

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
      console.log('- tree after:', require('util').inspect(_tree, false, null))
    }
  }
  function AST_wrapClosed(prop, newNodeType, newProp) {
    if (traceast) {
      console.log('AST_wrapClosed', prop, newNodeType, newProp)
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before:', require('util').inspect(_tree, false, null))
    }
    // wrap the "current" node (last of _tree) with an extra node
    // so the parent of node becomes the parent of a new node and
    // the old node becomes a child of the new node
    // a(x:b) -> a(x:c(y:b))

    let parent = _path[_path.length-1];
    let child = null;
    if (traceast) console.log(' - prop:', prop, ', parent:', parent);

    if (Array.isArray(parent[prop])) {
      child = parent[prop].pop();
    } else {
      child = parent[prop];
    }
    if (traceast) console.log(' - child:', child);
    ASSERT(child, 'should exist, bad tree?', 'child=', child, 'prop=', prop, 'newProp=', newProp, 'parent[prop]=', parent[prop]);

    AST_open(prop, newNodeType, CALLED_FROM_WRAPPER);
    // set it as child of new node
    // TODO: what if array?
    AST_set(newProp, child);
    if (traceast) {
      console.log('- tree after:', require('util').inspect(_tree, false, null))
    }
  }
  function AST_replaceParent(newNodeType, oldNodeType) {
    if (traceast) {
      console.log('AST_replaceParent', prop, newNodeType, newNodeType)
      console.log('- path:', _pnames.join(' - '));
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before:', require('util').inspect(_tree, false, null))
    }

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
      console.log('- tree after:', require('util').inspect(_tree, false, null))
    }

    return oldNode;
  }
  function AST_wrapClosedArray(prop, value, newProp) {
    if (traceast) {
      console.log('AST_wrapClosed', prop, value, newProp)
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before:', require('util').inspect(_tree, false, null))
    }
    // same as AST_wrapClosed except the node is put in an array

    let parent = _path[_path.length-1];
    let child = null;
    if (traceast) console.log(' - prop:', prop, ', parent:', parent);

    if (Array.isArray(parent[prop])) {
      child = parent[prop].pop();
    } else {
      child = parent[prop];
    }
    if (traceast) console.log(' - child:', child);
    ASSERT(child, 'should exist, bad tree?', 'child=', child, 'prop=', prop, 'newProp=', newProp, 'parent[prop]=', parent[prop]);

    AST_open(prop, value, CALLED_FROM_WRAPPER);
    // set the node as the first child of the property as an array
    AST_set(newProp, [child]);
    if (traceast) {
      console.log('- tree after:', require('util').inspect(_tree, false, null))
    }
  }
  function AST_destruct(prop, assignmentsToo) {
    ASSERT(arguments.length === 2, 'arg count');
    // rename object and array literal nodes to patterns to match the AST spec
    // this happens when either literal type was parsed (possibly nested) and
    // then a destructuring assignment was encountered

    // recursively walk the tree from the prop in open node and visit
    // any array and object expression as well as the left side of assignments
    // for now dont bother with other nodes until we find a reason to

    // note: this function is usually called after a few nodes have closed (the literal struct).

    if (traceast) {
      console.log('AST_destruct', prop)
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before destruct:', require('util').inspect(_tree, false, null))
    }

    let node = _path[_path.length-1][prop];
    if (Array.isArray(node)) node = node[node.length-1];

    ASSERT(node, 'should have this node');
    ASSERT(assignmentsToo || node.type === 'ArrayExpression' || node.type === 'ObjectExpression', 'should start at an object or array literal');

    AST__destruct(node, CONVERT_ASSIGNMENTS_TOO); // TODO: remove the arg.
    if (traceast) {
      console.log('- tree after destruct:', require('util').inspect(_tree, false, null))
    }
  }
  function AST__destruct(node, assignmentsToo) {
    if (traceast) {
      console.log('AST__destruct', node);
    }

    if (node.type === 'ArrayExpression') {
      node.type = 'ArrayPattern';
      for (let i = 0, n = node.elements.length; i < n; ++i) {
        AST__destruct(node.elements[i], assignmentsToo);
      }
    } else if (node.type === 'ObjectExpression') {
      node.type = 'ObjectPattern';
      for (let i = 0, n = node.properties.length; i < n; ++i) {
        let property = node.properties[i];
        AST__destruct(property.value, assignmentsToo);
      }
    } else if (node.type === 'AssignmentExpression') {
      if (assignmentsToo) {
        node.type = 'AssignmentPattern';
        if (node.operator !== '=') THROW('The destruturing assignment should be a regular assignment');
        delete node.operator;
      }
      // walk the left of the assignment only
      AST__destruct(node.left, DONT_CONVERT_ASSIGNMENTS);
    }
  }

  function sansFlag(flags, flag) {
    return (flags | flag) ^ flag;
  }

  function init() {
    do {
      skipRex(sansFlag(INITIAL_LEXER_FLAGS, LF_FOR_REGEX));
      if (curtype === $ERROR) softError(curtok);
    } while (curtype === $ERROR);
  }

  function softError() {

  }

  function skipRex(lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 1, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT((lexerFlags & LF_FOR_REGEX) === 0, 'regex flag should not be set anywhere');

    updateToken(tok(lexerFlags | LF_FOR_REGEX, RETURN_SOLID_TOKENS));

    ASSERT(typeof curtype === 'number' && curtype >= 0);
    ASSERT(typeof curc === 'number' && curc >= 0 && curc <= 0x10ffff, 'valid c', JSON.stringify(curtok));
  }
  function skipDiv(lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 1, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT((lexerFlags & LF_FOR_REGEX) === 0, 'regex flag should not be set anywhere');

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
  }

  // <SCRUB ASSERTS>
  function ASSERT_skipRex(what, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 2, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(typeof what === 'number' || typeof what === 'string', 'what number/string');
    if (typeof what === 'string') {
      ASSERT(curtok.str === what, 'expecting to skip token with certain value', 'expect:', what, 'actual:', curtok.str);
    } else {
      ASSERT((curtype & what) === what, 'expecting to skip token with certain type', 'expect:'
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
      ASSERT(curtok.str === what, 'expecting to skip token with certain value', 'expect:', what, 'actual:', curtok.str);
    } else {
      ASSERT((curtype & what) === what, 'expecting to skip token with certain type', 'expect:'
        // <SCRUB DEV>
        , debug_toktype(what), 'actual:', debug_toktype(curtype)
        // </SCRUB DEV>
      );
    }
    skipDiv(lexerFlags);
  }
  function ASSERT_skipAny(what, lexerFlags) {
    // next token cannot validly start with a forward slash (may be optimizable)
    ASSERT_skipDiv(what, lexerFlags);
  }
  // </SCRUB ASSERTS>

  function skipRexOrDie(chr, str, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 3, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== chr || str !== curtok.str) {
      THROW('Next char should be [' + str + '] but was [' + curtok.str + ']');
    } else {
      skipRex(lexerFlags);
    }
  }
  function skipAnyOrDie(chr, str, lexerFlags) {
    // next token cannot start with forward slash (may be optimizable)
    skipRexOrDie(chr, str, lexerFlags);
  }
  function skipRexOrDieSingleChar(chr, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 2, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== chr || curtok.str.length !== 1) {
      THROW('Next ord should be ' + chr + ' (' + String.fromCharCode(chr) + ') but was ' + curc + ' (curc: `' + String.fromCharCode(curc) + '`, token: `'+curtok.str+'`)');
    } else {
      ASSERT(curtok.str.length === 1, 'should be len=1');
      skipRex(lexerFlags);
    }
  }
  function skipDivOrDieSingleChar(chr, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 2, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== chr || curtok.str.length !== 1) {
      THROW('Next ord should be ' + chr + ' (' + String.fromCharCode(chr) + ') but was ' + curc + ' (curc: `' + String.fromCharCode(curc) + '`, token: `'+curtok.str+'`)');
    } else {
      ASSERT(curtok.str.length === 1, 'should be len=1');
      skipDiv(lexerFlags);
    }
  }
  function skipAnyOrDieSingleChar(chr, lexerFlags) {
    // next token cant start with forward slash (may be optimizable)
    skipRexOrDieSingleChar(chr, lexerFlags);
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
    return skipRexIf(str, lexerFlags);
  }

  function isStatementLineEnd() {
    // this is for restricted productions where newlines are significant (return, throw, continue, etc)
    // note: must check eof/semi as well otherwise the value would be mandatory and parser would throw

    // this is basically the ASI rule + newline check
    return curtok.nl || curtype === $EOF || curc === $$SEMI || curc === $$CURLY_R_7D;
  }

  function parseTopLevels(lexerFlags) {
    // <SCRUB AST>
    let len = _path.length;
    // </SCRUB AST>
    parseBodyParts(lexerFlags);
    // <SCRUB AST>
    ASSERT(_path.length === len, 'should close all that was opened: ' + JSON.stringify(_path));
    // </SCRUB AST>
  }

  function parseBodyParts(lexerFlags) {
    AST_set('body', []);
    _parseBodyParts(lexerFlags, 'body');
  }

  function _parseBodyParts(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    while (curtype !== $EOF && curc !== $$CURLY_R_7D) parseBodyPart(lexerFlags, astProp);
  }

  function parseStatementHeader(lexerFlags, headProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerflags number');
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags);
    parseExpressions(lexerFlags, headProp);
    skipRexOrDieSingleChar($$PAREN_R_29, lexerFlags);
  }

  function parseSemiOrAsi(lexerFlags) {
    if (curc === $$SEMI_3B) {
      ASSERT_skipRex(';', lexerFlags);
      // note: must check eof/semi as well otherwise the value would be mandatory and parser would throw
    } else if (curc === $$CURLY_R_7D || curtok.nl || curtype === $EOF) {
      tok.asi();
    } else {
      console.log('parse error at curc', curc, String.fromCharCode(curc), curtok.str);
      console.log('current token:', curtok);
      THROW('Unable to ASI' + (((lexerFlags & LF_NO_YIELD) === LF_NO_YIELD) ? ' (note: yield is probably considered a var name here!' : ''));
    }
  }

  function parseNestedBodyPart(lexerFlags, astProp) {
    // nested statements like that of if, while, for, try, etc
    return parseBodyPart(lexerFlags | LF_NO_FUNC_DECL, astProp);
  }

  function parseBodyPart(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(!(curtype & ($ERROR | $EOF)), 'should not have error or eof at this point');
    switch (getGenericTokenType(curtype)) { // TODO: convert to flag index to have perfect hash in the switch
      case $IDENT:
        parseIdentStatement(lexerFlags, astProp);
        break;
      case $PUNCTUATOR:
        parsePunctuatorStatement(lexerFlags, astProp);
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
      default:
        THROW('unexpected token', curtok
          // <SCRUB DEV>
          ,debug_toktype(curtype), debug_toktype(getGenericTokenType(curtype))
          // </SCRUB DEV>
        );
    }
  }

  // ### functions

  function parseFunction(lexerFlags, funcDecl, isAsync, optionalIdent, astProp) {
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
    if (!isAsync && skipAnyIf('*', lexerFlags)) {
      isGenerator = true;
    }
    parseFunctionAfterKeyword(lexerFlags, funcDecl, NOT_FUNCEXPR, isGenerator, isAsync, optionalIdent, astProp);
  }
  function parseFunctionExpression(lexerFlags, isAsync, astProp) {
    let isGenerator = false;
    if (!isAsync && skipAnyIf('*', lexerFlags)) {
      isGenerator = true;
    }
    parseFunctionAfterKeyword(lexerFlags, NOT_FUNC_DECL, BODY_IS_BLOCK, isGenerator, isAsync, IDENT_REQUIRED, astProp);
  }
  function parseFunctionAfterKeyword(lexerFlags, isFuncDecl, bodyIsExpr, isGenerator, isAsync, isIdentOptional, astProp) {
    ASSERT(arguments.length === 7, 'arg count');

    AST_open(astProp, isFuncDecl ? 'FunctionDeclaration' : 'FunctionExpression')

    AST_set('generator', isGenerator);
    AST_set('async', isAsync);
    AST_set('expression', bodyIsExpr);

    if (curtype === $IDENT) {
      // TODO: verify identifier
      // TODO: there are cases where an identifier cannot exist here (like methods)
      AST_setIdent('id', curtok);
      ASSERT_skipAny($IDENT, lexerFlags);
    } else if (isFuncDecl && !isIdentOptional) {
      THROW('Function decl missing required ident');
    } else {
      AST_set('id', null);
    }

    // reset the async and generator lexer flags. they don't cross function boundaries
    // make sure the LF_CAN_NEW_TARGET flag is set from here on out, this enables new.target (is allowed in arg default)
    // note: we dont reset the template lexer flag here. instead we do it at any place where we parse curly pairs
    //       this fixes the problem of parsing arrow functions where we can't tell whether the next token is part
    //       of the arrow expression until after parsing and processing that token. that needs curly pair checks.
    lexerFlags = resetLexerFlagsForFunction(lexerFlags, isAsync, isGenerator, NOT_ARROW);

    parseFunctionFromParams(lexerFlags);
    AST_close();
  }
  function resetLexerFlagsForFunction(lexerFlags, isAsync, isGenerator, funcType) {
    ASSERT(!isGenerator || !isAsync, 'cant be both generator and async'); // should this be a THROW? don't think so...
    // reset lexer flag states that dont carry accross function boundary
    lexerFlags = sansFlag(lexerFlags, LF_IN_GENERATOR);
    lexerFlags = sansFlag(lexerFlags, LF_IN_ASYNC);
    lexerFlags = sansFlag(lexerFlags, LF_IN_FUNC_ARGS); // not likely to be useful but the right thing to do (tm)
    // dont remove the template flag here! let curly pair structures deal with this individually (fixes arrows)
    if (isGenerator) lexerFlags = lexerFlags | LF_IN_GENERATOR;
    if (isAsync) lexerFlags = lexerFlags | LF_IN_ASYNC;
    if (funcType === NOT_ARROW) lexerFlags = lexerFlags | LF_CAN_NEW_TARGET;
    return lexerFlags;
  }
  function parseFunctionFromParams(lexerFlags) {
    parseFuncArguments(lexerFlags);
    parseBlockStatement(lexerFlags, 'body');
  }
  function parseFuncArguments(lexerFlags) {
    // TODO: await expression inside the params (like default param) of an async function are illegal
    lexerFlags = lexerFlags | LF_IN_FUNC_ARGS; // prevents await expression as default arg
    AST_set('params', []);
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags);
    if (curc !== $$PAREN_R_29) {
      while (true) {
        parseFuncArgument(lexerFlags, 'params');
        if (curc !== $$COMMA_2C) break;
        ASSERT_skipRex(',', lexerFlags);
      }

      // TODO: optimize; next must be curly_R or otherwise it is an error

      skipAnyOrDieSingleChar($$PAREN_R_29, lexerFlags);
    } else {
      ASSERT_skipRex(')', lexerFlags);
    }
  }
  function parseFuncArgument(lexerFlags, astProp) {
    if (curtype === $IDENT) {
      // TODO: proper keyword checks
      if (curtok.str === 'await') {
        if (goalMode === GOAL_MODULE) THROW('Await is illegal outside of async body');
        if ((lexerFlags & LF_IN_ASYNC) === LF_IN_ASYNC) THROW('Await not allowed here');
      }

      AST_setIdent(astProp, curtok);
      ASSERT_skipAny($IDENT, lexerFlags);
    } else if (curtype === $PUNCTUATOR) {
      if (curc === $$CURLY_L_7B) parseObjectLitOrDestruc(lexerFlags, INSIDE_PARAM_DECL, astProp);
      else if (curc === $$SQUARE_L_5B) parseArrayLitOrDestruc(lexerFlags, INSIDE_PARAM_DECL, astProp);
      else TODO;
    } else { // ?
      TODO
    }

    AST_destruct(astProp, true);

    // default value
    if (skipRexIf('=', lexerFlags)) {
      parseArgDefault(lexerFlags, astProp)
    }
  }

  function parseArgDefault(lexerFlags, astProp) {
    AST_wrapClosed(astProp, 'AssignmentPattern', 'left');
    parseExpression(lexerFlags, 'right');
    AST_close();
  }

  // ### statements

  function parseIdentStatement(lexerFlags, astProp) {
    // all statement starting keywords;

    // (async), break, class, const, continue, debugger, do, export, for, function, if, import, let, loop, return, switch, throw, try, var, while, with

    switch (curtok.str) {
      case 'await':
        parseAwaitStatement(lexerFlags, astProp);
        break;

      case 'break':
        parseBreakStatement(lexerFlags, astProp);
        break;

      case 'class':
        parseClass(lexerFlags, IDENT_REQUIRED, astProp);
        break;

      case 'const':
        parseConstStatement(lexerFlags, astProp);
        break;

      case 'continue':
        parseContinueStatement(lexerFlags, astProp);
        break;

      case 'debugger':
        parseDebuggerStatement(lexerFlags, astProp);
        break;

      case 'do':
        parseDoStatement(lexerFlags, astProp);
        break;

      case 'export':
        parseExportStatement(lexerFlags, astProp);
        break;

      case 'for':
        parseForStatement(lexerFlags, astProp);
        break;

      case 'function':
        if ((lexerFlags & (LF_NO_FUNC_DECL|LF_STRICT_MODE)) === (LF_NO_FUNC_DECL|LF_STRICT_MODE)) THROW('Function statement is illegal in strict mode');
        parseFunction(lexerFlags, IS_FUNC_DECL, NOT_ASYNC, IDENT_REQUIRED, astProp);
        break;

      case 'if':
        parseIfStatement(lexerFlags, astProp);
        break;

      case 'import':
        parseImportDeclaration(lexerFlags, astProp);
        break;

      case 'let':
        parseLetStatement(lexerFlags, astProp);
        break;

      case 'return':
        parseReturnStatement(lexerFlags, astProp);
        break;

      case 'switch':
        parseSwitchStatement(lexerFlags, astProp);
        break;

      case 'throw':
        parseThrowStatement(lexerFlags, astProp);
        break;

      case 'try':
        parseTryStatement(lexerFlags, astProp);
        break;

      case 'var':
        parseVarStatement(lexerFlags, astProp);
        break;

      case 'while':
        parseWhileStatement(lexerFlags, astProp);
        break;

      case 'with':
        parseWithStatement(lexerFlags, astProp);
        break;

      default:
        parseIdentLabelOrExpressionStatement(lexerFlags, astProp);

    }
  }

  function parseFromLiteralStatement(lexerFlags, astProp) {
    AST_open(astProp, 'ExpressionStatement');
    AST_setLiteral('expression', curtok);
    skipDiv(lexerFlags);
    parseExpressionAfterLiteral(lexerFlags, 'expression');
    AST_close();
    parseSemiOrAsi(lexerFlags);
  }

  function parseTickStatement(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    AST_open(astProp, 'ExpressionStatement');
    parseTickExpression(lexerFlags, 'expression');
    parseExpressionAfterLiteral(lexerFlags, 'expression');
    AST_close();
    parseSemiOrAsi(lexerFlags);
  }

  function parseBlockStatement(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE | LF_NO_FUNC_DECL);

    AST_open(astProp, 'BlockStatement');
    AST_set('body', []);
    ASSERT_skipRex('{', lexerFlagsNoTemplate);
    _parseBodyParts(lexerFlagsNoTemplate, 'body');
    skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    AST_close();
  }

  function parseAsyncStatement(lexerFlags, identToken, astProp) {
    // an async statement is almost the same as an expression but it needs to know whether it was in fact
    // an expression or not so it knows how to apply the statement semi/asi.
    // at this point already verified not to be a label.

    // parsed the `async` keyword (-> identToken), next must be;

    // - async function f(...    (must have name)
    // - async (...) => bar
    // - async foo => bar
    // - async ...            (any use as regular var name)
    //   - note: this will throw a syntax error in MODULE mode
    //   - note: `async()` could not be followed by `=>`
    //   - note: `async in x` is not an async arrow
    //   - note: `async instanceof x` is not an async arrow

    // only the `async function ...` form does NOT require a semi. all other forms do.

    if (curtok.nl) {
      if (goalMode === GOAL_MODULE) {
        THROW('The `async` keyword cannot be followed by a newline');
      }
      AST_open(astProp, 'ExpressionStatement');
      parseExpressionAfterAsyncAsVarName(lexerFlags, identToken, 'expression');
      AST_close(); // ExpressionStatement
      parseSemiOrAsi(lexerFlags);
      return;
    }

    if (curtype === $EOF) {
      if (goalMode === GOAL_MODULE) {
        THROW('The `async` keyword must be followed by a function');
      }
      AST_open(astProp, 'ExpressionStatement');
      AST_setIdent('expression', identToken);
      AST_close(); // ExpressionStatement
      parseSemiOrAsi(lexerFlags);
      return;
    }

    if (curtype === $IDENT) {
      // _probably_ an arrow or function, but must check edge cases
      if (curc === $$F_66 && curtok.str === 'function') {
        parseFunction(lexerFlags, IS_FUNC_DECL, WAS_ASYNC, IDENT_REQUIRED, astProp);
        return NOT_ASSIGNABLE;
      }

      AST_open(astProp, 'ExpressionStatement');
      if (curc === $$I_69 && (curtok.str === 'instanceof' || curtok.str === 'in')) {
        if (goalMode === GOAL_MODULE) {
          THROW('The `async` keyword cannot be followed by `in` or `instanceof`');
        }
        parseExpressionAfterAsyncAsVarName(lexerFlags, identToken, 'expression');
      } else {
        AST_open('expression', 'ArrowFunctionExpression');
        AST_set('params', []);
        AST_setIdent('params', curtok);
        ASSERT_skipAny($IDENT, lexerFlags);
        parseArrowFromPunc(lexerFlags, WAS_ASYNC);
        AST_close(); // ArrowFunctionExpression
      }
      AST_close(); // ExpressionStatement
      parseSemiOrAsi(lexerFlags);
      return NOT_ASSIGNABLE;
    }

    if (curc === $$PAREN_L_28) {
      // `async () => x`
      // `async ()`          (not followed by `=>`)

      // (this function also deals with errors for async-as-varname-in-module-mode)
      AST_open(astProp, 'ExpressionStatement');
      parseGroupOrArrow(lexerFlags, identToken, 'expression');
      AST_close(); // ExpressionStatement
      parseSemiOrAsi(lexerFlags);
      return;
    }

    // no function is following `async` so parse it as a regular var name
    if (goalMode === GOAL_MODULE) {
      THROW('The `async` keyword must be followed by a function');
    }
    // async as a var name
    AST_open(astProp, 'ExpressionStatement');
    parseExpressionAfterAsyncAsVarName(lexerFlags, identToken, 'expression');
    AST_close(); // ExpressionStatement
    parseSemiOrAsi(lexerFlags);
  }
  function parseAsyncExpression(lexerFlags, identToken, considerFunctionDeclaration, astProp) {
    // parsed the `async` keyword (-> identToken), next must be;

    // - async function...
    // - async (...) => bar
    // - async foo => bar
    // - async ...            (any use as regular var name)
    //   - note: this will throw a syntax error in MODULE mode
    //   - note: `async()` could not be followed by `=>`
    //   - note: `async in x` is not an async arrow
    //   - note: `async instanceof x` is not an async arrow

    // if this was part of a default export declaration the function should be considered a declaration, not expression
    // however, arrows in a default export declaration are still considered expressions, *shrug*

    // TODO: do we properly disallow async+generator modifier combo?

    if (curtok.nl) {
      if (goalMode === GOAL_MODULE) {
        THROW('The `async` keyword cannot be followed by a newline');
      }
      // the whole thing _cant_ be an async arrow function now, but it may still be valid
      return parseExpressionAfterAsyncAsVarName2(lexerFlags, identToken, astProp);
    }

    if (curtype === $EOF) {
      if (goalMode === GOAL_MODULE) {
        THROW('The `async` keyword must be followed by a function');
      }
      return parseExpressionAfterAsyncAsVarName2(lexerFlags, identToken, astProp);
    }

    if (curtype === $IDENT) {
      // _probably_ an arrow or function, but must check edge cases
      if (curc === $$F_66 && curtok.str === 'function') {
        parseFunction(lexerFlags, considerFunctionDeclaration ? IS_FUNC_DECL : NOT_FUNC_DECL, WAS_ASYNC, IDENT_OPTIONAL, astProp);
      } else if (curc === $$I_69 && (curtok.str === 'instanceof' || curtok.str === 'in')) {
        if (goalMode === GOAL_MODULE) {
          THROW('The `async` keyword cannot be followed by `in` or `instanceof`');
        }
        return parseExpressionAfterAsyncAsVarName2(lexerFlags, identToken, astProp);
      } else {
        AST_open(astProp, 'ArrowFunctionExpression');
        AST_set('params', []);
        AST_setIdent('params', curtok);
        ASSERT_skipAny($IDENT, lexerFlags);
        parseArrowFromPunc(lexerFlags, WAS_ASYNC);
        AST_close(); // ArrowFunctionExpression
      }
      return NOT_ASSIGNABLE;
    }

    if (curc === $$PAREN_L_28) {
      // `async () => x`
      // `async ()`          (not followed by `=>`)

      // (this function also deals with errors for async-as-varname-in-module-mode)
      return parseGroupOrArrow(lexerFlags, identToken, astProp)
    }

    // no function is following `async` so parse it as a regular var name
    if (goalMode === GOAL_MODULE) {
      THROW('The `async` keyword must be followed by a function');
    }
    // async as a var name (already added to the AST)
    return parseExpressionAfterAsyncAsVarName2(lexerFlags, identToken, astProp);
  }

  function parseAwaitStatement(lexerFlags, astProp) {
    let identToken = curtok;

    AST_open(astProp, 'ExpressionStatement');

    if ((lexerFlags & LF_IN_ASYNC) === LF_IN_ASYNC) {
      ASSERT_skipRex('await', lexerFlags);
      // TODO: support cases of await as a var name in SCRIPT mode
      parseAwaitExpression(lexerFlags, identToken, 'expression');
    } else {
      if (goalMode === GOAL_MODULE) {
        THROW('Cannot use `await` outside of `async` functions');
      }
      ASSERT_skipRex('await', lexerFlags);
      // await as a var name
      parseExpressionAfterAsyncAsVarName(lexerFlags, identToken, 'expression');
    }

    AST_close(); // ExpressionStatement
    parseSemiOrAsi(lexerFlags);
  }

  function parseAwaitExpression(lexerFlags, asyncIdentToken, astProp) {
    // in an awaitable context this must always be considered a keyword. outside of it it should never be considered a keyword

    // TODO: lexerFlags should tell us whether we are currently in an async body. goalMode tells us how to handle "no".
    // TODO: if lexerFlags indicate this is generator code, await is an error
    // TODO: it is an error if goal is Module and await is an identifierreference, bindingidentifier, or labelidentifier

    if ((lexerFlags & LF_IN_ASYNC) === LF_IN_ASYNC) {
      if ((lexerFlags & LF_IN_FUNC_ARGS) === LF_IN_FUNC_ARGS) THROW('Await is illegal as default arg value');
      AST_open(astProp, 'AwaitExpression');
      parseExpression(lexerFlags, 'argument'); // never optional inside async func
      AST_close(); // AwaitExpression
      return false; // an await should gobble all assignments so this is not assignable
    } else if ((lexerFlags & LF_IN_GENERATOR) === LF_IN_GENERATOR) {
      THROW('Cannot use `await` in a generator');
    } else if (goalMode === GOAL_SCRIPT) {
      // consider `await` a regular var name, not a keyword
      // should throw an error if used as an await anyways
      return parseAfterVarName(lexerFlags, asyncIdentToken, astProp);
    } else {
      THROW('Cannot use `await` outside of `async` functions');
    }
  }

  function parseBreakStatement(lexerFlags, astProp) {
    AST_open(astProp, 'BreakStatement');
    // break is only valid inside a breakable, fenced by functions
    ASSERT_skipRex('break', lexerFlags);
    // a break may be followed by another identifier which must then be a valid label.
    // otherwise it's just a break to the nearest breakable (most likely).

    // note: must check eof/semi as well otherwise the value would be mandatory and parser would throw
    if (curtype === $IDENT && !(curtok.nl || curtype === $EOF || curtok.value === ';')) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)
      AST_setIdent('label', curtok);

      ASSERT_skipRex($IDENT, lexerFlags);
    } else {
      AST_set('label', null);
    }

    parseSemiOrAsi(lexerFlags);
    AST_close();
  }

  function parseClass(lexerFlags, optionalIdent, astProp) {
    // Note: all class code is always strict mode implicitly
    // class x {}
    // class x extends <lhs expr> {}
    // class x {;}
    // class x {[static] <method>[]}

    let outsideLexerFlags = lexerFlags; // could already have strict mode flag set and we need to know this for the last skip of this function
    lexerFlags = lexerFlags | LF_STRICT_MODE;

    AST_open(astProp, 'ClassDeclaration');
    ASSERT_skipAny('class', lexerFlags);

    // note: default exports has optional ident but should still not skip `extends` here
    // but it is not a valid class name anyways (which is superseded by a generic keyword check)
    if (curtype === $IDENT && curtok.str !== 'extends') {
    // TODO: verify keyword
      AST_setIdent('id', curtok);
      ASSERT_skipAny($IDENT, lexerFlags);
    } else if (!optionalIdent) {
      THROW('Class decl missing required ident');
    } else {
      AST_set('id', null);
    }

    if (curtype === $IDENT && curtok.str === 'extends') {
      ASSERT_skipRex('extends', lexerFlags);
      parseValue(lexerFlags, 'superClass');
    } else {
      AST_set('superClass', null);
    }

    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
    skipRexOrDieSingleChar($$CURLY_L_7B, lexerFlagsNoTemplate);

    // parse method, static method, or emptystatement

    AST_open('body', 'ClassBody');
    AST_set('body', []);
    while (parseClassMethod(lexerFlagsNoTemplate, 'body') === true);
    AST_close(); // ClassBody

    skipRexOrDie($$CURLY_R_7D, '}', outsideLexerFlags);
    AST_close(); // ClassDeclaration
  }

  function parseClassMethod(lexerFlags) {
    // everything from objlit that is a method optionally prefixed by `static`, and an empty statement
    return _parseClassMethod(lexerFlags, NO_STATIC_MODIFIER);
  }
  function _parseClassMethod(lexerFlags, isStatic) {
    ASSERT(arguments.length === _parseClassMethod.length, 'arg count');

    if (curtype === $IDENT) {
      let identToken = curtok;
      ASSERT_skipAny($IDENT, lexerFlags);
      // getter, setter, async, or ident method
      switch (identToken.str) {
        case 'static':
          if (!isStatic && curc !== $$PAREN_L_28) {
            //class x{static(){}}
            //class x{static static(){}}
            //class x{async static(){}}
            //class x{async static static(){}}
            //class x{*static(){}}
            //class x{static *static(){}}
            return _parseClassMethod(lexerFlags, HAS_STATIC_MODIFIER);
          }
          break; // this is a method named `static` which seems to be okay.
        case 'async':
          if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
            // async method / static async member
            parseMethod(lexerFlags, WAS_ASYNC, NOT_GET, NOT_SET, NOT_GENERATOR, isStatic);
            return true;
          }
          // method named "async"
          break;
        case 'get':
          if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
            // getter function
            parseMethod(lexerFlags, NOT_ASYNC, WAS_GET, NOT_SET, NOT_GENERATOR, isStatic);
            return true;
          }
          // method named "get"
          break;
        case 'set':
          if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
            // setter function
            parseMethod(lexerFlags, NOT_ASYNC, NOT_GET, WAS_SET, NOT_GENERATOR, isStatic);
            return true;
          }
          // method named "set"
          break;
        default:
      }
      parseMethodIdent(lexerFlags, NOT_ASYNC, NOT_GET, NOT_SET, NOT_GENERATOR, isStatic, identToken);
    } else if (curc === $$SQUARE_L_5B) {
      // dynamic property
      parseMethodDynamic(lexerFlags, NOT_ASYNC, NOT_SET, NOT_GET, NOT_GENERATOR, isStatic);
    } else if (curc === $$STAR_2A) {
      // generator method
      ASSERT_skipAny('*', lexerFlags);
      parseMethod(lexerFlags, NOT_ASYNC, NOT_GET, NOT_SET, WAS_GENERATOR, isStatic);
    } else if (curc === $$SEMI_3B) {
      // this empty statement is not part of the AST
      ASSERT_skipAny(';', lexerFlags);
    } else {
      return false;
    }
    return true;
  }

  function parseMethod(lexerFlags, isAsync, isGetter, isSetter, isGenerator, isStatic) {
    ASSERT(arguments.length === parseMethod.length, 'arg count');

    if (curtype === $IDENT) {
      let identToken = curtok;
      ASSERT_skipAny($IDENT, lexerFlags);
      parseMethodIdent(lexerFlags, isAsync, isGetter, isSetter, isGenerator, isStatic, identToken);
    } else if (curc === $$SQUARE_L_5B) {
      parseMethodDynamic(lexerFlags, isAsync, isGetter, isSetter, isGenerator, isStatic)
    } else {
      THROW('Method must have an ident or dynamic name');
    }
  }
  function parseMethodIdent(lexerFlags, isAsync, isGetter, isSetter, isGenerator, isStatic, identToken) {
    ASSERT(arguments.length === parseMethodIdent.length, 'arg count');

    // TODO: validate given ident token value
    AST_open('body', 'MethodDefinition');
    AST_set('static', isStatic);
    AST_set('computed', false);
    AST_set('kind', (!isStatic && identToken.str === 'constructor') ? 'constructor' : isGetter ? 'get' : isSetter ? 'set' : 'method');

    AST_setIdent('key', identToken);

    if (curc !== $$PAREN_L_28) THROW('Missing method arg parens'); // must explicitly check here
    parseFunctionAfterKeyword(lexerFlags, NOT_FUNC_DECL, NOT_FUNCEXPR, isGenerator, isAsync, IDENT_OPTIONAL, 'value');
    AST_close(); // MethodDefinition
  }
  function parseMethodDynamic(lexerFlags, isAsync, isGetter, isSetter, isGenerator, isStatic) {
    ASSERT(arguments.length === parseMethodDynamic.length, 'arg count');

    AST_open('body', 'MethodDefinition');
    AST_set('static', isStatic);
    AST_set('computed', true);
    AST_set('kind', isGetter ? 'get' : isSetter ? 'set' : 'method');
    ASSERT_skipRex('[', lexerFlags);
    parseExpression(lexerFlags, 'key');
    skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags);
    if (curc !== $$PAREN_L_28) THROW('Missing method arg parens'); // must explicitly check here
    parseFunctionAfterKeyword(lexerFlags, NOT_FUNC_DECL, NOT_FUNCEXPR, isGenerator, isAsync, IDENT_OPTIONAL, 'value');
    AST_close(); // MethodDefinition
  }

  function parseConstStatement(lexerFlags, astProp) {
    _parseAnyVarStatement(lexerFlags, 'const', astProp);
  }

  function parseContinueStatement(lexerFlags, astProp) {
    AST_open(astProp, 'ContinueStatement');
    // continue is only valid inside a loop, fenced by functions
    ASSERT_skipRex('continue', lexerFlags);
    // a continue may be followed by another identifier which must then be a valid label.
    // otherwise it's just a continue to the nearest loop (most likely).

    // note: must check eof/semi as well otherwise the value would be mandatory and parser would throw
    if (curtype === $IDENT && !(curtok.nl || curtype === $EOF || curtok.value === ';')) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)

      AST_setIdent('label', curtok);

      ASSERT_skipRex($IDENT, lexerFlags);
    } else {
      AST_set('label', null);
    }

    parseSemiOrAsi(lexerFlags);
    AST_close();
  }

  function parseDebuggerStatement(lexerFlags, astProp) {
    AST_open(astProp, 'DebuggerStatement');
    AST_close();
    ASSERT_skipRex('debugger', lexerFlags);
    parseSemiOrAsi(lexerFlags);
  }

  function parseDoStatement(lexerFlags, astProp) {
    AST_open(astProp, 'DoWhileStatement');
    ASSERT_skipRex('do', lexerFlags);
    parseNestedBodyPart(lexerFlags, 'body');
    skipAnyOrDie($$W_77, 'while', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseSemiOrAsi(lexerFlags);
    AST_close();
  }

  function parseExportStatement(lexerFlags, astProp) {
    // export * FromClause;
    // export ExportClause FromClause;
    // export ExportClause;
    // export VariableStatement
    // export Declaration
    // export default HoistableDeclaration
    // export default ClassDeclaration
    // export default AssignmentExpression

    // export sans default can do; var, let, const, function, async function, function *, class
    // export with default can do: function, async function, function *, class, and any assignment expression
    // note: the regular function, async function, and class may have no name only with `default`


    ASSERT_skipAny('export', lexerFlags);

    if (curc === $$D_64 && curtok.str === 'default') {
      AST_open(astProp, 'ExportDefaultDeclaration');
      ASSERT_skipRex('default', lexerFlags);

      if (curtok.str === 'class') {
        // export class ...
        parseClass(lexerFlags, IDENT_OPTIONAL, 'declaration');
      } else if (curc === $$F_66 && curtok.str === 'function') {
        // export default function f(){}
        // export default function* f(){}
        // export default function(){}
        // export default function* (){}
        parseFunction(lexerFlags, IS_FUNC_DECL, NOT_ASYNC, IDENT_OPTIONAL, 'declaration');
      } else if (curc === $$A_61 && curtok.str === 'async') {
        // export default async function f(){}
        // export default async function(){}
        // export default async () => y
        // export default async (x) => y
        // export default async x => y
        let identToken = curtok;
        ASSERT_skipRex('async', lexerFlags);
        // note: can be any expression, function or legacy. default export doesnt care as much
        parseAsyncExpression(lexerFlags, identToken, true, 'declaration');
      } else {
        // any expression is exported as is (but is not a live binding)
        parseExpression(lexerFlags, 'declaration');
      }
      AST_close(); // ExportDefaultDeclaration
    } else if (curc === $$STAR_2A) {
      // export * from "x"
      AST_open(astProp, 'ExportAllDeclaration');
      ASSERT_skipAny('*', lexerFlags);
      skipAnyOrDie($$F_66, 'from', lexerFlags);
      AST_setLiteral('source', curtok);
      skipRex(lexerFlags);
      AST_close(); // ExportAllDeclaration
    } else {
      AST_open(astProp, 'ExportNamedDeclaration');
      AST_set('specifiers', []);
      if (curc === $$CURLY_L_7B) {
        AST_set('declaration', null);
        // export {}
        // export {} from "x"
        parseExportObject(lexerFlags);
        if (skipAnyIf('from', lexerFlags)) {
          if ((curtype & $STRING) !== $STRING) THROW('Export source must be a string');
          AST_setLiteral('source', curtok);
          skipRex(lexerFlags);
        } else {
          AST_set('source', null);
        }
      } else if (curc === $$V_76 && curtok.str === 'var') {
        // export var <bindings>
        _parseAnyVarDecls(lexerFlags, 'var', 'declaration');
        AST_set('source', null);
      } else if (curc === $$L_6C && curtok.str === 'let') {
        // export let <bindings>
        _parseAnyVarDecls(lexerFlags, 'let', 'declaration');
        AST_set('source', null);
      } else if (curc === $$C_63) {
        if (curtok.str === 'const') {
          // export const <bindings>
          _parseAnyVarDecls(lexerFlags, 'const', 'declaration');
        } else if (curtok.str === 'class') {
          // export class ...
          parseClass(lexerFlags, IDENT_REQUIRED, 'declaration');
        } else {
          THROW('Unknown export type [' + curtok.str +  ']');
        }
        AST_set('source', null);
      } else if (curc === $$F_66 && curtok.str === 'function') {
        // export function f(){}
        // export function* f(){}
        // (anonymous should not be allowed but parsers seem to do it anyways)
        parseFunction(lexerFlags, IS_FUNC_DECL, NOT_ASYNC, IDENT_REQUIRED, 'declaration');
        AST_set('source', null);
      } else if (curc === $$A_61 && curtok.str === 'async') {
        // export async function f(){}
        // (note: no arrows here because we require a name)
        let identToken = curtok;
        ASSERT_skipAny('async', lexerFlags);

        if (curtok.str !== 'function') {
          THROW('Can only export async functions (not arrows), did not find a function');
        }

        parseFunction(lexerFlags, IS_FUNC_DECL, WAS_ASYNC, IDENT_REQUIRED, 'declaration');
        AST_set('source', null);
      } else {
        THROW('Unknown export type [' + curtok.str +  ']');
      }
      AST_close(); // ExportNamedDeclaration
    }

    parseSemiOrAsi(lexerFlags);
  }
  function parseExportObject(lexerFlags) {
    // import {...} from 'x'
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
    ASSERT_skipAny('{', lexerFlagsNoTemplate);
    while (curtype === $IDENT) {
      AST_open('specifiers', 'ExportSpecifier');
      let nameToken = curtok;

      AST_setIdent('local', nameToken);
      skipAny(lexerFlagsNoTemplate);
      if (curtok.str === 'as') {
        ASSERT_skipAny('as', lexerFlagsNoTemplate);
        if (curtype !== $IDENT) THROW('Can only use ident to indicate alias');
        AST_setIdent('exported', curtok);
        skipAny(lexerFlagsNoTemplate);
      } else {
        AST_setIdent('exported', nameToken);
      }
      if (curc === $$COMMA_2C) skipAny(lexerFlagsNoTemplate);
      AST_close(); // specifiers
    }
    skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlags);
  }

  function parseForStatement(lexerFlags, astProp) {
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
    // - of at operator time (-> for-of)
    // - in at operator time (-> for-in)
    // - var initializer (-> normal for)
    // - more than one var declared (-> normal for)
    // - expression that cannot be a LeftHandSideExpression (-> normal for)

    // basically, parse for a LeftHandSideExpression. then the next token should
    // either be a binary (or even unary) operator (in, of, or anything else) or
    // a semi. we can then proceed parsing down that particular path.

    ASSERT_skipAny('for', lexerFlags); // TODO: optimize; next must be (
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags);
    parseForHeader(lexerFlags, astProp);
    skipRexOrDieSingleChar($$PAREN_R_29, lexerFlags);
    parseNestedBodyPart(lexerFlags, 'body');
    AST_close();
  }
  function parseForHeader(lexerFlags, astProp) {
    // first parse a simple expression and check whether it's assignable (var or prop)
    let assignable = false;
    let wasNotDecl = false;
    let emptyInit = false;
    let startedWithParen = false;
    if (curtype === $IDENT) {
      switch (curtok.str) {
        case 'var':
        case 'let':
        case 'const':
          _parseAnyVarDecls(lexerFlags, curtok.str, astProp);
          assignable = true; // i think.
          break;

        default:
          let identToken = curtok;
          ASSERT_skipDiv($IDENT, lexerFlags);
          assignable = parseValueFromIdent(lexerFlags, identToken, astProp);
          wasNotDecl = true;
      }
    } else if (curc === $$SEMI_3B) {
      emptyInit = true;
    } else {
      startedWithParen = curc === $$PAREN_L_28;
      assignable = parseValue(lexerFlags, astProp);
      wasNotDecl = true;
    }

    // in all cases either; parse a var, let, const, or assignment expression
    // there can be multiple vars and inits
    // for-in and for-of can only have one var without inits (invalidate after)

    if (curtype === $IDENT) {
      if (curtok.str === 'in') {
        AST_wrapClosed(astProp, 'ForInStatement', 'left');
        if (!assignable) THROW('Left part of for-in must be assignable');
        ASSERT_skipRex('in', lexerFlags);
        parseExpressions(lexerFlags, 'right');
        return;
      }
      if (curtok.str === 'of') {
        AST_wrapClosed(astProp, 'ForOfStatement', 'left');
        if (!assignable) THROW('Left part of for-of must be assignable');
        ASSERT_skipRex('of', lexerFlags);
        parseExpressions(lexerFlags, 'right');
        return;
      }
      ASSERT(curtok.str === 'instanceof', 'the only other valid identifier here is the instanceof op'); // very unlikely case tho
    }

    if (emptyInit) {
      AST_open(astProp, 'ForStatement');
      AST_set('init', null);
    } else {
      AST_wrapClosed(astProp, 'ForStatement', 'init');
      // we are still in the `init` part of a classic for. keep parsing from the current expression value.
      if (wasNotDecl) parseExpressionFromOp(lexerFlags, assignable, startedWithParen, 'init');
    }

    let hadComma = curc === $$COMMA_2C;
    if (hadComma) _parseExpressions(lexerFlags, 'init');
    if (curc !== $$SEMI_3B) {
      // note: `x in y` is valid so `for(a,x in y)` will parse up to the `)`. since `of` is not an op it stops at `of`.
      if (hadComma && (curtok.str === 'of' || ')')) THROW('Comma not allowed in left side of `for-in`/`for-of` header');
      // not a comma error; this will throw as we asserted
      skipRexOrDieSingleChar($$SEMI_3B, lexerFlags);
    }
    ASSERT_skipRex(';', lexerFlags);

    if (curc === $$SEMI_3B) {
      AST_set('test', null);
    } else {
      parseExpressions(lexerFlags, 'test');
    }
    skipRexOrDieSingleChar($$SEMI_3B, lexerFlags);
    if (curc === $$PAREN_R_29) {
      AST_set('update', null);
    } else {
      parseExpressions(lexerFlags, 'update');
    }
  }

  function parseIfStatement(lexerFlags, astProp) {
    AST_open(astProp, 'IfStatement');
    ASSERT_skipAny('if', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseNestedBodyPart(lexerFlags, 'consequent');
    if (curtype === $IDENT && curtok.str === 'else') {
      ASSERT_skipRex('else', lexerFlags);
      parseNestedBodyPart(lexerFlags, 'alternate');
    } else {
      AST_set('alternate', null);
    }
    AST_close();
  }

  function parseImportDeclaration(lexerFlags, astProp) {
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
    // (cannot create a var named `yield` or `await` this way)

    ASSERT_skipAny('import', lexerFlags);

    AST_open(astProp, 'ImportDeclaration');
    AST_set('specifiers', []);

    if (curtype === $IDENT) {
      parseImportDefault(lexerFlags);
      if (curc === $$COMMA_2C) {
        ASSERT_skipAny(',', lexerFlags);
        if (curc === $$STAR_2A) {
          parseImportNamespace(lexerFlags);
        } else if (curc === $$CURLY_L_7B) {
          parseImportObject(lexerFlags);
        } else {
          THROW('Can only import star or object after default');
        }
      } else {
        if (curtok.str !== 'from') THROW('Missing export source');
        ASSERT_skipAny('from', lexerFlags);
      }
    } else if (curc === $$STAR_2A) {
      parseImportNamespace(lexerFlags);
    } else if (curc === $$CURLY_L_7B) {
      parseImportObject(lexerFlags);
    }

    // `import 'foo'` is valid but otherwise this is an error
    if ((curtype & $STRING) !== $STRING) THROW('Export source must be string');

    AST_setLiteral('source', curtok);
    skipRex(lexerFlags);

    AST_close(); // import
  }
  function parseImportDefault(lexerFlags) {
    // import x[ as y][, * as m | , {...}] from 'z'
    AST_open('specifiers', 'ImportDefaultSpecifier');
    AST_setIdent('local', curtok);
    ASSERT_skipAny($IDENT, lexerFlags); // next must be `as` comma or `from`
    AST_close(); // specifiers
  }
  function parseImportObject(lexerFlags) {
    // import {...} from 'x'
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
    ASSERT_skipAny('{', lexerFlagsNoTemplate);
    while (curtype === $IDENT) {
      AST_open('specifiers', 'ImportSpecifier');

      let nameToken = curtok;
      AST_setIdent('imported', nameToken);
      skipAny(lexerFlagsNoTemplate);

      if (curtok.str === 'as') {
        ASSERT_skipAny('as', lexerFlagsNoTemplate);
        if (curtype !== $IDENT) THROW('Alias must be an ident');

        AST_setIdent('local', curtok);
        skipAny(lexerFlagsNoTemplate);
      } else {
        AST_setIdent('local', nameToken);
      }

      if (curc === $$COMMA_2C) skipAny(lexerFlagsNoTemplate);
      AST_close(); // specifiers
    }
    skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlagsNoTemplate);

    if (curtok.str !== 'from') THROW('Missing export source');
    ASSERT_skipAny('from', lexerFlags);
  }
  function parseImportNamespace(lexerFlags) {
    // import * as x from 'y'
    ASSERT_skipAny('*', lexerFlags);
    skipAnyOrDie($$A_61, 'as', lexerFlags);

    AST_open('specifiers', 'ImportNamespaceSpecifier');
    AST_setIdent('local', curtok);
    ASSERT_skipAny($IDENT, lexerFlags); // next must be `as` comma or `from`
    AST_close(); // specifiers

    if (curtok.str !== 'from') THROW('Missing export source');
    ASSERT_skipAny('from', lexerFlags);
  }

  function parseLetStatement(lexerFlags, astProp) {
    _parseAnyVarStatement(lexerFlags, 'let', astProp);
  }

  function parseReturnStatement(lexerFlags, astProp) {
    AST_open(astProp, 'ReturnStatement');
    ASSERT_skipRex('return', lexerFlags);

    if (!curtok.nl && curtype !== $EOF && curc !== $$SEMI_3B && curc !== $$CURLY_R_7D) {
      parseExpressions(lexerFlags, 'argument');
    } else {
      AST_set('argument', null);
    }

    parseSemiOrAsi(lexerFlags);

    AST_close();
  }

  function parseSwitchStatement(lexerFlags, astProp) {
    AST_open(astProp, 'SwitchStatement');
    ASSERT_skipAny('switch', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'discriminant');
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
    skipAnyOrDieSingleChar($$CURLY_L_7B, lexerFlagsNoTemplate); // TODO: optimize; next must be `case` or `default` or `}`
    AST_set('cases', []);
    let hadDefault = false;
    while (true) {
      if (curtok.str === 'case') {
        AST_open('cases', 'SwitchCase');
        ASSERT_skipRex('case', lexerFlagsNoTemplate);
        parseExpressions(lexerFlagsNoTemplate, 'test');
        AST_set('consequent', []);
        if (curc !== $$COLON_3A) THROW('Missing colon after case expr');
        ASSERT_skipRex(':', lexerFlagsNoTemplate);
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) {
          parseNestedBodyPart(lexerFlagsNoTemplate, 'consequent');
        }

        AST_close();
      } else if (curtok.str === 'default') {
        if (hadDefault) THROW('Found second default in same switch');
        AST_open('cases', 'SwitchCase');
        ASSERT_skipAny('default', lexerFlagsNoTemplate); // TODO: optimize; next must be :
        if (curc !== $$COLON_3A) THROW('Missing colon after default');
        ASSERT_skipRex(':', lexerFlagsNoTemplate);
        AST_set('test', null);
        AST_set('consequent', []);
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) parseNestedBodyPart(lexerFlagsNoTemplate, 'consequent');
        AST_close();
      } else {
        break;
      }
    }
    skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    AST_close();
  }

  function parseThrowStatement(lexerFlags, astProp) {
    AST_open(astProp, 'ThrowStatement');
    ASSERT_skipRex('throw', lexerFlags);
    if (curtok.nl) THROW('Premature newline');
    parseExpressions(lexerFlags, 'argument'); // mandatory1
    parseSemiOrAsi(lexerFlags);
    AST_close();
  }

  function parseTryStatement(lexerFlags, astProp) {
    AST_open(astProp, 'TryStatement');

    let hasEither = false;

    ASSERT_skipAny('try', lexerFlags); // TODO: optimize; next must be {
    parseBlockStatement(lexerFlags, 'block');

    if (curc === $$C_63 && curtok.str === 'catch') {
      hasEither = true;
      AST_open('handler', 'CatchClause');
      ASSERT_skipAny('catch', lexerFlags); // TODO: optimize; next must be (
      skipAnyOrDieSingleChar($$PAREN_L_28, lexerFlags); // TODO: optimize; next must be ident (maybe destructuring?)
      if (curtype === $IDENT) {
        AST_setIdent('param', curtok);
        ASSERT_skipAny($IDENT, lexerFlags); // TODO: optimize; next must be ) and maybe comma or ident
      } else if (curc === $$PAREN_L_28 || curc === $$SQUARE_L_5B) {
        TODO // destructuring is valid here
      } else {
        THROW('Missing catch var');
      }
      skipAnyOrDieSingleChar($$PAREN_R_29, lexerFlags); // TODO: optimize; next must be {
      parseBlockStatement(lexerFlags, 'body');
      AST_close(); // CatchClause
    } else {
      AST_set('handler', null);
    }

    if (curc === $$F_66 && curtok.str === 'finally') {
      hasEither = true;
      ASSERT_skipAny('finally', lexerFlags); // TODO: optimize; next must be {
      parseBlockStatement(lexerFlags, 'finalizer');
    } else {
      AST_set('finalizer', null);
    }

    AST_close();

    if (!hasEither) THROW('Try must have catch or finally');
  }

  function parseVarStatement(lexerFlags, astProp) {
    _parseAnyVarStatement(lexerFlags, 'var', astProp);
  }

  function parseWhileStatement(lexerFlags, astProp) {
    AST_open(astProp, 'WhileStatement');
    ASSERT_skipAny('while', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseNestedBodyPart(lexerFlags, 'body');
    AST_close();
  }

  function parseIdentLabelOrExpressionStatement(lexerFlags, astProp) {
    let identToken = curtok;
    ASSERT_skipDiv($IDENT, lexerFlags);

    if (curc === $$COLON_3A) {
      if (identToken.str === 'async' && goalMode === GOAL_MODULE) {
        THROW('The `async` keyword cannot be used as a label');
      }
      if (identToken.str === 'yield' && ((lexerFlags & LF_IN_GENERATOR) === LF_IN_GENERATOR || (lexerFlags & LF_STRICT_MODE) === LF_STRICT_MODE)) {
        THROW('The `yield` keyword cannot be used as a label in strict mode or in a generator');
      }
      AST_open(astProp, 'LabeledStatement');
      AST_setIdent('label', identToken);
      ASSERT_skipRex(':', lexerFlags);
      parseNestedBodyPart(lexerFlags, 'body');
      AST_close();
    } else if (identToken.str === 'async') {
      parseAsyncStatement(lexerFlags, identToken, astProp);
    } else {
      AST_open(astProp, 'ExpressionStatement');
      parseExpressionAfterIdentifier(lexerFlags, identToken, 'expression');
      if (curc === $$COMMA_2C) {
        _parseExpressions(lexerFlags, 'expression');
      }
      AST_close();
      parseSemiOrAsi(lexerFlags);
    }
  }

  function parsePunctuatorStatement(lexerFlags, astProp) {
    switch (curc) {
      case $$CURLY_L_7B:
        parseBlockStatement(lexerFlags, astProp);
        break;
      case $$SEMI_3B:
        parseEmptyStatement(lexerFlags, astProp);
        break;
      default:
        AST_open(astProp, 'ExpressionStatement');
        parseExpression(lexerFlags, 'expression');
        AST_close();
        parseSemiOrAsi(lexerFlags);
    }
  }

  function parseEmptyStatement(lexerFlags, astProp) {
    AST_open(astProp, 'EmptyStatement');
    ASSERT_skipRex(';', lexerFlags);
    AST_close();
  }

  function parseWithStatement(lexerFlags, astProp) {
    AST_open(astProp, 'WithStatement');
    ASSERT_skipAny('with', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'object');
    parseNestedBodyPart(lexerFlags, 'body');
    AST_close();
  }

  function _parseAnyVarStatement(lexerFlags, kind, astProp) {
    _parseAnyVarDecls(lexerFlags, kind, astProp);
    parseSemiOrAsi(lexerFlags);
  }
  function _parseAnyVarDecls(lexerFlags, kind, astProp) {
    // var, let, const. apply additional checks for let/const.
    AST_open(astProp, 'VariableDeclaration');
    AST_set('kind', kind);
    AST_set('declarations', []);

    ASSERT_skipAny(kind, lexerFlags); // TODO: optimize; next must be ident or destructuring

    parseBindingPatterns(lexerFlags, 'declarations');

    AST_close();
  }
  function parseBindingPatterns(lexerFlags, astProp) {
    do {
      parseElisions(lexerFlags, astProp);
      parseBindingPattern(lexerFlags, astProp);
      if (curc !== $$COMMA_2C) break;
      ASSERT_skipRex(',', lexerFlags); // TODO: optimize; next must be destructuringly-valid
    } while (true);
    parseElisions(lexerFlags, astProp);
  }
  function parseElisions(lexerFlags, astProp) {
    while(curc === $$COMMA_2C) {
      AST_add(astProp, null);
      ASSERT_skipRex(',', lexerFlags);
    }
  }
  function parseBindingPattern(lexerFlags, astProp) {
    // note: a "binding pattern" means a var/let/const var declaration with name or destructuring pattern
    AST_open(astProp, 'VariableDeclarator');

    if (curtype === $IDENT) {
      // normal
      // TODO: verify ident is valid here

      AST_setIdent('id', curtok);
      ASSERT_skipRex($IDENT, lexerFlags); // note: if this is the end of the var decl and there is no semi the next line can start with a regex
    } else if (curc === $$CURLY_L_7B) {
      // destructure object
      // keep parsing binding patterns separated by at least one comma
      AST_open('id', 'ObjectPattern');
      let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
      skipRexOrDieSingleChar($$CURLY_L_7B, lexerFlagsNoTemplate); // (note: circumvent template body/tail) TODO: optimize; dont think this can ever start with a forward slash
      AST_set('properties', []);
      parseBindingPatternsNested(lexerFlagsNoTemplate, 'properties');
      skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      AST_close();
    } else if (curc === $$SQUARE_L_5B) {
      // destructure array
      // keep parsing binding patterns separated by at least one comma
      AST_open('id', 'ArrayPattern');
      skipRexOrDieSingleChar($$SQUARE_L_5B, lexerFlags); // TODO: optimize; dont think this can ever start with a forward slash
      AST_set('elements', []);
      parseBindingPatternsNested(lexerFlags, 'elements');
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      AST_close();
    } else {
      THROW('Expecting ident or destructuring pattern');
    }

    if (curc === $$IS_3D && curtok.str === '=') {
      ASSERT_skipRex($PUNCTUATOR, lexerFlags);
      parseExpression(lexerFlags, 'init');
    } else {
      AST_set('init', null);
    }
    AST_close();
  }
  function parseBindingPatternsNested(lexerFlags, astProp) {
    parseElisions(lexerFlags, astProp);
    do {
      parseBindingPatternNested(lexerFlags, astProp);
      if (curc !== $$COMMA_2C) break;
      ASSERT_skipRex(',', lexerFlags); // TODO: can next be fwd slash?
      parseElisions(lexerFlags, astProp);
    } while (true);
  }
  function parseBindingPatternNested(lexerFlags, astProp) {
    if (curtype === $IDENT) {
      // normal
      // TODO: verify ident is valid here

      AST_setIdent(astProp, curtok);
      ASSERT_skipRex($IDENT, lexerFlags); // note: if end of decl, next line can start with regex
    } else if (curc === $$CURLY_L_7B) {
      // destructure object
      // keep parsing binding patterns separated by at least one comma
      AST_open(astProp, 'ObjectPattern');
      let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
      skipRexOrDieSingleChar($$CURLY_L_7B, lexerFlagsNoTemplate); // (note: circumvent template body/tail) TODO: optimize; dont think this can ever start with a forward slash
      AST_set('properties', []);
      parseBindingPatternsNested(lexerFlagsNoTemplate, 'properties');
      skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      AST_close();
    } else if (curc === $$SQUARE_L_5B) {
      // destructure array
      // keep parsing binding patterns separated by at least one comma
      AST_open(astProp, 'ArrayPattern');
      skipRexOrDieSingleChar($$SQUARE_L_5B, lexerFlags); // TODO: dont think next line can start with fwd slash
      AST_set('elements', []);
      parseBindingPatternsNested(lexerFlags, 'elements');
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      AST_close();
    } else if (curc !== $$SQUARE_R_5D && curc !== $$CURLY_R_7D) {
      THROW('Expecting nested ident or destructuring pattern');
    }

    if (curc === $$IS_3D && curtok.str === '=') {
      AST_wrapClosed(astProp, 'AssignmentPattern', 'left');
      ASSERT_skipRex($PUNCTUATOR, lexerFlags);
      parseExpression(lexerFlags, 'right');
      AST_close();
    }
  }

  // ### expressions (functions below should not call functions above)

  function parseExpression(lexerFlags, astProp) {
    ASSERT(arguments.length === 2, 'args count', arguments);

    let wasParen = curc === $$PAREN_L_28;
    let assignable = parseValue(lexerFlags, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, wasParen, astProp);
  }
  function parseExpressionAfterLiteral(lexerFlags, astProp) {
    // assume we just parsed and skipped a literal (string/number/regex)
    let assignable = parseValueTail(lexerFlags, NOT_ASSIGNABLE, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, LHS_NOT_PAREN_START, astProp);
  }
  function parseExpressionAfterIdentifier(lexerFlags, identToken, astProp) {
    // identToken is a parsed, skipped, and validated value identifier (including the valueless `null`)
    let assignable = parseValueHeadBodyIdent(lexerFlags, identToken, astProp);
    assignable = parseValueTail(lexerFlags, assignable, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, LHS_NOT_PAREN_START, astProp);
  }
  function parseExpressionAfterAsyncAsVarName(lexerFlags, identToken, astProp) {
    // identToken is 'async', is validated to be a regular var name and not a keyword, but not yet added to AST
    let assignable = parseAfterVarName(lexerFlags, identToken, astProp);
    assignable = parseValueTail(lexerFlags, assignable, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, LHS_NOT_PAREN_START, astProp);
  }
  function parseExpressionAfterAsyncAsVarName2(lexerFlags, identToken, astProp) {
    // identToken is 'async', is validated to be a regular var name and not a keyword, but not yet added to AST
    return parseAfterVarName(lexerFlags, identToken, astProp);
  }
  function parseExpressionFromOp(lexerFlags, assignable, lhsWasParenStart, astProp) {
    ASSERT(arguments.length === 4, 'arg count');

    if (assignable && isAssignBinOp()) {
      // <SCRUB AST>
      if (curc === $$IS_3D && curtok.str === '=') {
        let node = _path[_path.length - 1][astProp];
        if (Array.isArray(node)) node = node[node.length - 1];
        if (node.type === 'ArrayExpression' || node.type === 'ObjectExpression') {
          AST_destruct(astProp, false);
        }
      }
      // </SCRUB AST>

      AST_wrapClosed(astProp, 'AssignmentExpression', 'left');
      AST_set('operator', curtok.str);
      skipRex(lexerFlags);
      assignable = parseExpression(lexerFlags, 'right');
      AST_close();
    } else {
      let initialAstProp = astProp;
      while (isNonAssignBinOp() || curc === $$QMARK_3F) {
        // <SCRUB AST>
        // to maintain operator precedent we need to take special care of the AST here if the
        // current op is stronger than the previous op _currently_ at the top of the path
        let prev = _path[_path.length-1][astProp];
        let swapped = false;
        if (prev && lhsWasParenStart === LHS_NOT_PAREN_START && (prev.type === 'BinaryExpression' || prev.type === 'LogicalExpression')) {
          let sl = getStrength(curtok.str);
          let sr = getStrength(prev.operator);
          swapped =  sl > sr || (sl === sr && curtok.str === '**'); // `**` is the right-associative exception here
          if (swapped) {
            _path.push(prev);
            astProp = 'right';
          }
        }
        // </SCRUB AST>

        if (curc === $$QMARK_3F) {
          AST_wrapClosed(astProp, 'ConditionalExpression', 'test');
          ASSERT_skipRex('?', lexerFlags);
          parseExpression(lexerFlags, 'consequent');
          if (curc !== $$COLON_3A) {
            if (curc === $$COMMA_2C) THROW('Can not use comma inside ternary expressions');
            THROW('Unexpected character inside ternary');
          }
          ASSERT_skipRex(':', lexerFlags);
          parseExpression(lexerFlags, 'alternate');
          AST_close();
        } else {
          AST_wrapClosed(astProp, (curtok.str === '&&' || curtok.str === '||') ? 'LogicalExpression' : 'BinaryExpression', 'left');
          AST_set('operator', curtok.str);
          skipRex(lexerFlags);
          lhsWasParenStart = curc === $$PAREN_L_28; // heuristic for determining groups
          parseValue(lexerFlags | LF_NO_YIELD, 'right');
          AST_close();
        }

        // note: this is for `5+5=10`
        if (curc === $$IS_3D && curtok.str === '=') {
          THROW('Cannot assign a value to non-assignable value');
        }

        // <SCRUB AST>
        if (swapped) { // restore swap
          _path.pop(prev);
          astProp = initialAstProp;
        }
        // </SCRUB AST>
        lhsWasParenStart = curc === $$PAREN_L_28; // heuristic for determining groups
        assignable = false; // not sure where this is still relevant but it is
      }
    }

    return assignable;
  }
  function parseExpressions(lexerFlags, astProp) {
    parseExpression(lexerFlags, astProp);
    if (curc === $$COMMA_2C) _parseExpressions(lexerFlags, astProp);
  }
  function _parseExpressions(lexerFlags, astProp) {
    ASSERT(curc === $$COMMA_2C, 'confirm at callsite');
    AST_wrapClosedArray(astProp, 'SequenceExpression', 'expressions');
    do {
      ASSERT_skipRex(',', lexerFlags);
      parseExpression(lexerFlags, 'expressions');
    } while (curc === $$COMMA_2C);
    AST_close(); // SequenceExpression
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
  function isNonAssignBinOp() {
    switch (curtok.str) {
      case '&&':
      case '||':
      case '+':
      case '-':
      case '*':
      case '**':
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
      case 'in':
      case 'instanceof':
        return true;
    }
    return false;
  }

  function getStrength(str) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
    // the spec is super implicit about operator precedent. you can only discover it by tracing the grammar.
    // note: this function doesnt contain all things that have precedent. most of them are also implicitly
    // determined by parsing mechanisms. stuff here is mostly about disambiguating binary ops.
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
      default: THROW('Unknown operator'); // other ops should not be handled by this function. dont think this should be possible in prod (it means tokenizer allowed a new op)
    }
  }

  function parseValue(lexerFlags, astProp) {
    let assignable = parseValueHeadBody(lexerFlags, PARSE_VALUE_MUST, NOT_NEW_TARGET, astProp);
    return parseValueTail(lexerFlags, assignable, astProp);
  }
  function parseValueFromNew(lexerFlags, astProp) {
    let assignable = parseValueHeadBody(lexerFlags, PARSE_VALUE_MUST, CHECK_NEW_TARGET, astProp);
    return parseValueTail(lexerFlags, assignable, astProp);
  }
  function parseYieldValueMaybe(lexerFlags, astProp) {
    // TODO: how to properly solve this when there are no tokens? can we even do that?
    let startok = curtok;
    let assignable = parseValueHeadBody(lexerFlags, PARSE_VALUE_MAYBE, NOT_NEW_TARGET, astProp);
    if (curtok === startok) return YIELD_WITHOUT_VALUE;
    assignable = parseValueTail(lexerFlags, assignable, astProp);
    if (assignable) return WITH_ASSIGNABLE;
    return WITH_NON_ASSIGNABLE;
  }
  function parseValueFromIdent(lexerFlags, identToken, astProp) {
    let assignable = parseValueHeadBodyIdent(lexerFlags, identToken, astProp);
    return parseValueTail(lexerFlags, assignable, astProp);
  }
  function parseValueHeadBody(lexerFlags, maybe, checkNewTarget, astProp) {
    // - ident (a var, true, false, null, super, new <value>, new.target, this, class, function, async func, generator func)
    // - literal (number, string, regex, object, array, template)
    // - arrow or group
    // - await expression (TODO: is await an expression or statement keyword?)

    // do not include the suffix (property, call, etc)

    // return a boolean whether the value is assignable (only for regular var names)

    if (curtype === $IDENT) {
      let identToken = curtok;
      ASSERT_skipDiv($IDENT, lexerFlags);
      return parseValueHeadBodyIdent(lexerFlags, identToken, astProp);
    } else if (curtype & ($NUMBER|$STRING|$REGEX)) {
      AST_setLiteral(astProp, curtok);
      skipDiv(lexerFlags);
      return NOT_ASSIGNABLE;
    } else if (curtype & $TICK) {
      parseTickExpression(lexerFlags, astProp);
      return NOT_ASSIGNABLE;
    } else if (curtype === $PUNCTUATOR) {
      if (curc === $$CURLY_L_7B) {
        return parseObjectLitOrDestruc(lexerFlags, NOT_DESTRUCTURING, astProp); // TODO: is that true? is this never a destructuring context?
      } else if (curc === $$SQUARE_L_5B) {
        return parseArrayLitOrDestruc(lexerFlags, NOT_DESTRUCTURING, astProp);
      } else if (curc === $$PAREN_L_28) {
        return parseGroupOrArrow(lexerFlags, false, astProp);
      } else if (curtok.str === '++' || curtok.str === '--') {
        AST_open(astProp, 'UpdateExpression');
        AST_set('operator', curtok.str);
        ASSERT_skipAny($PUNCTUATOR, lexerFlags); // TODO: optimize; next token can not start with a fwd slash
        AST_set('prefix', true);
        let assignable = parseValueHeadBody(lexerFlags, PARSE_VALUE_MUST, NOT_NEW_TARGET, 'argument');
        if (assignable === NOT_ASSIGNABLE) THROW('Cannot inc/dec a non-assignable value');
        AST_close();
        return NOT_ASSIGNABLE;
      } else if (curtok.str === '+' || curtok.str === '-' || curtok.str === '!' || curtok.str === '~') {
        AST_open(astProp, 'UnaryExpression');
        AST_set('operator', curtok.str);
        ASSERT_skipRex($PUNCTUATOR, lexerFlags);
        AST_set('prefix', true);
        parseValueHeadBody(lexerFlags, PARSE_VALUE_MUST, NOT_NEW_TARGET, 'argument');
        AST_close();
        return NOT_ASSIGNABLE;
      } else if (curc === $$DOT_2E) {
        if (curtok.str === '...') {
          AST_open(astProp, 'SpreadElement');
          ASSERT_skipAny($PUNCTUATOR, lexerFlags); // TODO: optimize; next token can not start with a fwd slash
          parseValue(lexerFlags, 'argument');
          AST_close();
          return NOT_ASSIGNABLE;
        } else {
          // TODO: (random but kind of relevant here): add tests that put `.5` in any place here a leading-dot-token is expected
          if (checkNewTarget === CHECK_NEW_TARGET && curtok.str === '.') {
            // new.target
            // only valid if at least one scope in the scope tree is a regular function
            if ((lexerFlags & LF_CAN_NEW_TARGET) !== LF_CAN_NEW_TARGET) THROW('Must be inside/nested a regular function to use `new.target`');

            // top should currently be this node:
            // {type: 'NewExpression', arguments: [], callee: WE_ARE_HERE}
            // we will want it to completely replace this with:
            // {type: 'MetaProperty', meta: {type: 'Identifier', name: 'new'}, property: {type: 'Identifier', name: 'target'}}
            AST_replaceParent('MetaProperty', 'NewExpression')

            ASSERT_skipAny('.', lexerFlags); // must be dot
            if (curtok.str !== 'target') THROW('Can only read `new.target`, no other "properties" from `new`');
            AST_open('meta', 'Identifier');
            AST_set('name', 'new');
            AST_close(); // Identifier
            AST_open('property', 'Identifier');
            AST_set('name', 'target');
            AST_close(); // Identifier
            ASSERT_skipDiv('target', lexerFlags);

            // note: this is some minor "sugar" for `new.target=10`, not further checking for compound ops...
            if (curc === $$IS_3D && curtok.str === '=') {
              THROW('Cannot assign a value to non-assignable value');
            }

            return NOT_ASSIGNABLE;
          }
        }
      }
    }

    if (!maybe) THROW('Expected to parse a value');
    // currently all callsites that have mayb=true will ignore the return value
    return true;
  }
  function parseValueHeadBodyIdent(lexerFlags, identToken, astProp) {
    // note: ident token has been skipped prior to this call. curtok is the one after identToken.
    let identName = identToken.str;
    switch (identName) {
      case 'true':
        AST_open(astProp, 'Literal');
        AST_set('value', true);
        AST_set('raw', 'true');
        AST_close();
        return false;
      case 'false':
        AST_open(astProp, 'Literal');
        AST_set('value', false);
        AST_set('raw', 'false');
        AST_close();
        return false;
      case 'null':
        AST_open(astProp, 'Literal');
        AST_set('value', null);
        AST_set('raw', 'null');
        AST_close();
        return false;
      case 'super':
        AST_open(astProp, 'Super');
        AST_close();
        return false;
      case 'new':
        AST_open(astProp, 'NewExpression');
        AST_set('arguments', []);
        parseValueFromNew(lexerFlags, 'callee');
        AST_close(); // NewExpression
        return false;
      case 'this':
        AST_open(astProp, 'ThisExpression');
        AST_close();
        return false;
      case 'class':
        parseClass(lexerFlags, IDENT_OPTIONAL, astProp);
        return false;
      case 'function':
        parseFunctionExpression(lexerFlags, NOT_ASYNC, astProp);
        return false;
      case 'async':
        return parseAsyncExpression(lexerFlags, identToken, false, astProp);
      case 'delete':
      case 'typeof':
      case 'void':
        AST_open(astProp, 'UnaryExpression');
        AST_set('operator', identName);
        AST_set('prefix', true);
        parseExpression(lexerFlags, 'argument');
        AST_close();
        return false;
      case 'await':
        // in module: only if lexerFlags allow await (inside async code)
        // in script: same as module but also as regular var names (only) outside of async code
        // (await when not a keyword is assignable)
        return parseAwaitExpression(lexerFlags, identToken, astProp);
      case 'yield':
        if ((lexerFlags & LF_STRICT_MODE) === LF_STRICT_MODE) {
          if ((lexerFlags & LF_IN_GENERATOR) !== LF_IN_GENERATOR) {
            THROW('Cannot use `yield` outside of generator functions when in strict mode');
          }
          if ((lexerFlags & LF_NO_YIELD) === LF_NO_YIELD) {
            THROW('Using `yield` after non-operator makes it a var name (illegal in strict mode)');
          }
        } else if ((lexerFlags & LF_NO_YIELD) === LF_NO_YIELD) {
          // considering `yield` a regular var name here. That's okay in sloppy mode.
          parseAfterVarName(lexerFlags, identToken, astProp);
          return true;
        }
        AST_open(astProp, 'YieldExpression');
        AST_set('delegate', false); // TODO ??
        parseYieldArgument(lexerFlags, 'argument');
        AST_close();
        return false;
      default:
        // TODO: verify identifier (note: can be value keywords depending on next token being an arrow)
        parseAfterVarName(lexerFlags, identToken, astProp);
        return true;
    }
  }
  function parseAfterVarName(lexerFlags, identToken, astProp) {
    // assume an identifier has just been parsed and that it should be considered a regular var name
    // (in the case of `await`, consider it a regular var)
    if (curc === $$IS_3D && curtok.str === '=>') {
      // arrow with single param
      AST_open(astProp, 'ArrowFunctionExpression');
      AST_set('params', []);
      AST_setIdent('params', identToken);
      parseArrowFromPunc(lexerFlags, NOT_ASYNC);
      AST_close();
      return false; // non-assignable
    } else {
      AST_setIdent(astProp, identToken);
      return true; // assignable
    }
  }
  function parseYieldArgument(lexerFlags, astProp) {
    let wasParen = curc === $$PAREN_L_28;
    let hadValue = parseYieldValueMaybe(lexerFlags, astProp);
    if (hadValue === YIELD_WITHOUT_VALUE) {
      AST_set(astProp, null);
    } else {
      parseExpressionFromOp(lexerFlags, hadValue === WITH_ASSIGNABLE, wasParen, astProp);
    }
    if (curc === $$COMMA_2C) {
      _parseExpressions(lexerFlags, astProp);
    }
  }

  function parseTickExpression(lexerFlags, astProp) {
    // basically; parse tick. if head, keep parsing body until parsing tail

    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT((lexerFlags & LF_IN_TEMPLATE) === 0 || (curtype & $TICK_HEAD), 'if in template this function can only be called by the head of a nested template');

    AST_open(astProp, 'TemplateLiteral');
    AST_set('expressions', []);
    AST_set('quasis', []);

    if (curtype === $TICK_PURE) {
      parseQuasiPart(lexerFlags, true, astProp);
    } else if (curtype === $TICK_HEAD) {
      parseQuasiPart(lexerFlags | LF_IN_TEMPLATE, false, astProp);

      // keep parsing expression+tick until tick-tail
      do {
        parseExpressions(lexerFlags | LF_IN_TEMPLATE, 'expressions');

        AST_open('quasis', 'TemplateElement');
        AST_set('tail', curtype === $TICK_TAIL);
        AST_set('value', {raw: curtok.str, cooked: '<TODO>'});
        AST_close();
        if (curtype === $TICK_BODY) {
          ASSERT_skipRex(curtok.str, lexerFlags | LF_IN_TEMPLATE); // first token in template expression can be regex
        } else  if (curtype === $TICK_TAIL) {
          ASSERT_skipDiv(curtok.str, lexerFlags); // first token after template expression can be div
          break;
        } else {
          THROW('Unclosed template');
        }
      } while (true);
    } else {
      THROW('Template should start as head or pure');
    }

    AST_close(); // TemplateLiteral

    // assume we just parsed and skipped a literal (string/number/regex)
    let assignable = parseValueTail(lexerFlags, NOT_ASSIGNABLE, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, LHS_NOT_PAREN_START, astProp);
  }

  function parseQuasiPart(lexerFlags, tail, astProp) {
    AST_open('quasis', 'TemplateElement');
    AST_set('tail', tail);
    AST_set('value', {raw: curtok.str, cooked: '<TODO>'});
    if (curtype === $TICK_PURE) {
      ASSERT_skipDiv(curtok.str, lexerFlags);
    } else {
      ASSERT(curtype === $TICK_HEAD, 'not used for other ticks');
      ASSERT_skipRex(curtok.str, lexerFlags); // note: dont set IN_TEMPLATE here because a pure template wont want it
    }
    AST_close();
  }

  function parseObjectLitOrDestruc(lexerFlags, fromParam, astProp) {
    // (only a trailing comma is allowed, no elisions)

    // {a}
    // {a:b}
    // {a:b=x}
    // {[a]:b}
    // {[a]:b=x}
    // {'a':b}
    // {'a':b=x}
    // {"a":b}
    // {"a":b=x}
    // {10:b}
    // {10:b=x}
    // {get a(){}}
    // {get 'a'(){}}
    // {get "a"(){}}
    // {get 10(){}}
    // {get [a](){}}
    // {set a(x){}}
    // {set 'a'(x){}}
    // {set "a"(x){}}
    // {set 10(x){}}
    // {set [a](x){}}
    // {a(){}}
    // {'a'(){}}
    // {"a"(){}}
    // {10(){}}
    // {[a](){}}
    // {async a(){}}
    // {async 'a'(){}}
    // {async "a"(){}}
    // {async 10(){}}
    // {async [a](){}}
    // {*a(){}}
    // {*'a'(){}}
    // {*"a"(){}}
    // {*10(){}}
    // {*[a](){}}

    // only syntactical restriction for destructuring is; no methods, only idents can be shorthand
    //({
    //  a,
    //  a:b,
    //  a:b=x,
    //  [a]:b,
    //  [a]:b=x,
    //  'a':b,
    //  'a':b=x,
    //  "a":b,
    //  "a":b=x,
    //  10:b,
    //  10:b=x,
    //}=arr);

    AST_open(astProp, 'ObjectExpression');
    AST_set('properties', []);
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, LF_IN_TEMPLATE);
    ASSERT_skipAny('{', lexerFlagsNoTemplate); // TODO: optimize; next token cannot start with fwd slash
    while(curc !== $$CURLY_R_7D && curtype !== $EOF) {
      parseObjLitProperty(lexerFlagsNoTemplate, 'properties'); // also consumes comma
      if (curc === $$COMMA_2C) ASSERT_skipRex(',', lexerFlagsNoTemplate); // TODO: optimize; next token cannot start with fwd slash
      else break;
    }
    skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    AST_close();

    return true; // TODO: properly reflect whether this array can be a destructuring pattern
  }
  function parseObjLitProperty(lexerFlags, astProp) {
    // shorthand, classic, dynamic, quoted, numbered, any of those with assign
    // method, getter, setter, async, generator

    ASSERT(curc !== $$CURLY_R_7D, 'Caller should prevent } here');

    AST_open(astProp, 'Property');
    astProp = 'Property';

    let startToken = curtok;
    let startType = curtype;
    let startC = curc;
    skipAny(lexerFlags); // TODO: optimize; next token must be ident, number, string, comma, }, (, [

    if (startType === $IDENT) {
      // property name, shorthand, getter, setter, method, async
      // note that `async`, `get`, and `set` are valid prop names as well as method modifiers (=> prefixes)

      if (startToken.str === 'get') {
        parseObjLitMethodAfterModifier(lexerFlags, startToken, WAS_GET, NOT_SET, NOT_ASYNC, astProp);
      } else if (startToken.str === 'set') {
        parseObjLitMethodAfterModifier(lexerFlags, startToken, NOT_GET, WAS_SET, NOT_ASYNC, astProp);
      } else if (startToken.str === 'async') {
        parseObjLitMethodAfterModifier(lexerFlags, startToken, NOT_GET, NOT_SET, WAS_ASYNC, astProp);
      } else if (curc === $$CURLY_R_7D || curc === $$COMMA_2C) {
        parseObjLitValueAfterIdentShorthand(lexerFlags, startToken, astProp);
      } else if (curc === $$IS_3D && curtok.str === '=') {
        // TODO: only valid in destructuring context
        parseObjLitValueAfterIdentShorthand(lexerFlags, startToken, astProp);
      } else {
        // TODO: what about `true`, `false`, and `null`? are they idents or literals in the ast? (looks like idents...)
        AST_setIdent('key', startToken);
        parseObjLitAnyFromLitKey(lexerFlags, NOT_COMPUTED, astProp);
      }
    } else if (startC === $$STAR_2A) {
      // generator
      parseObjLitGenerator(lexerFlags, astProp);
    } else if ((startType & $STRING) === $STRING || (startType & $NUMBER) === $NUMBER) {
      AST_setLiteral('key', startToken);
      parseObjLitAnyFromLitKey(lexerFlags, NOT_COMPUTED, astProp);
    } else if (startC === $$SQUARE_L_5B) {
      parseExpression(lexerFlags, 'key');
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags);
      parseObjLitAnyFromLitKey(lexerFlags, WAS_COMPUTED, astProp);
    } else {
      console.log('Next error:', startToken);
      THROW('Unknown property name declaration in previous token'); // position will be slightly off :(
    }

    AST_close(); // Property
  }

  function parseObjLitMethodAfterModifier(lexerFlags, token, wasGet, wasSet, wasAsync, astProp) {
    ASSERT(wasGet || wasSet || wasAsync, 'should be called for one of the ident modifiers');
    if (curc === $$PAREN_L_28) {
      AST_setIdent('key', token);
      parseObjLitMethodAfterKey(lexerFlags, NOT_COMPUTED, NOT_GET, NOT_SET, NOT_ASYNC, NOT_GENERATOR, astProp);
    } else if (curc === $$COLON_3A) {
      AST_setIdent('key', token);
      ASSERT_skipRex(':', lexerFlags);
      parseObjLitValueAfterKeyColon(lexerFlags, NOT_COMPUTED, astProp);
    } else if (curc === $$CURLY_R_7D || curc === $$COMMA_2C) {
      // rare edge case:  x={get}  x={set}  x={async}
      parseObjLitValueAfterIdentShorthand(lexerFlags, token, astProp);
    } else if (curc === $$SQUARE_L_5B) {
      ASSERT_skipRex('[', lexerFlags);
      parseExpression(lexerFlags, 'key');
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags);
      parseObjLitMethodAfterKey(lexerFlags, WAS_COMPUTED, wasGet, wasSet, wasAsync, NOT_GENERATOR, astProp);
    } else if (curtype === $IDENT) {
      AST_setIdent('key', curtok);
      ASSERT_skipAny($IDENT, lexerFlags); // should find (
      parseObjLitMethodAfterKey(lexerFlags, NOT_COMPUTED, wasGet, wasSet, wasAsync, NOT_GENERATOR, astProp);
    } else if ((curtype & $STRING) === $STRING || (curtype & $NUMBER) === $NUMBER) {
      AST_setLiteral('key', curtok);
      skipAny(lexerFlags); // should find (
      parseObjLitMethodAfterKey(lexerFlags, NOT_COMPUTED, wasGet, wasSet, wasAsync, NOT_GENERATOR, astProp);
    } else {
      THROW('Bad objlit property');
    }
  }
  function parseObjLitGenerator(lexerFlags, astProp) {
    let isComputed = false;
    if (curtype === $IDENT) {
      AST_setIdent('key', curtok);
      ASSERT_skipAny($IDENT, lexerFlags); // should find (
    } else if ((curtype & $STRING) === $STRING || (curtype & $NUMBER) === $NUMBER) {
      AST_setLiteral('key', curtok);
      skipAny(lexerFlags); // should find (
    } else if (curc === $$SQUARE_L_5B) {
      isComputed = true;
      ASSERT_skipRex('[', lexerFlags);
      parseExpression(lexerFlags, 'key');
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // should find (
    } else {
      THROW('Generator method missing name')
    }
    ASSERT(curc === $$PAREN_L_28, 'should be at the start of the params');
    parseObjLitMethodAfterKey(lexerFlags, isComputed, NOT_GET, NOT_SET, NOT_ASYNC, WAS_GENERATOR, astProp);
  }
  function parseObjLitAnyFromLitKey(lexerFlags, isComputed, astProp) {
    if (curc === $$PAREN_L_28) {
      parseObjLitMethodAfterKey(lexerFlags, isComputed, NOT_GET, NOT_SET, NOT_ASYNC, NOT_GENERATOR, astProp);
    } else if (curc === $$COLON_3A) {
      ASSERT_skipRex(':', lexerFlags);
      parseObjLitValueAfterKeyColon(lexerFlags, isComputed, astProp);
    } else {
      THROW('Invalid object property key');
    }
  }

  function parseObjLitValueAfterKeyColon(lexerFlags, isComputed, astProp) {
    AST_set('kind', 'init'); // only getters/setters get special value here
    AST_set('method', false);
    AST_set('shorthand', false);
    AST_set('computed', isComputed);
    parseExpression(lexerFlags, 'value');
  }
  function parseObjLitValueAfterIdentShorthand(lexerFlags, identToken, astProp) {
    AST_setIdent('key', identToken);
    AST_set('kind', 'init'); // only getters/setters get special value here
    AST_set('method', false);
    AST_set('shorthand', true);
    AST_set('computed', false);

    // if there is an assignment here this "object" is _only_ valid when destructuring
    AST_setIdent('value', identToken);
    if (curc === $$IS_3D && curtok.str === '=') {
      ASSERT_skipRex('=', lexerFlags);
      AST_wrapClosed('value', 'AssignmentExpression', 'left');
      AST_set('operator', '=');
      parseExpression(lexerFlags, 'right');
      AST_close(); // AssignmentExpression
    }
  }
  function parseObjLitMethodAfterKey(lexerFlags, isComputed, wasGet, wasSet, isAsync, isGenerator, astProp) {
    ASSERT(curc === $$PAREN_L_28, 'should be at the start of the params');

    AST_set('kind', wasGet ? 'get' : wasSet ? 'set' : 'init'); // only getters/setters get special value here
    AST_set('method', wasGet || wasSet ? false : true); // getters and setters arent methods...
    AST_set('shorthand', false); // yes but always no.
    AST_set('computed', isComputed);

    parseFunctionAfterKeyword(lexerFlags, NOT_FUNC_DECL, NOT_FUNCEXPR, isGenerator, isAsync, IDENT_OPTIONAL, 'value');
  }

  function parseArrayLitOrDestruc(lexerFlags, canDestruct, astProp) {
    // [a]       -> array literal
    // [a] = b   -> array destructuring

    AST_open(astProp, 'ArrayExpression');
    ASSERT_skipRex('[', lexerFlags); // note: should be verified by caller
    AST_set('elements', []);
    if (curc === $$SQUARE_R_5D) {
      ASSERT_skipDiv(']', lexerFlags); // note: `[]\n/x` is a division and `[]\n/x/` is illegal
    } else {
      while (true) {
        parseElisions(lexerFlags, 'elements');
        if (curc === $$SQUARE_R_5D) {
          // `[]` and `[expr,]` and `[expr,,,,,]`
          break;
        }
        if (canDestruct) {
          // prevent parsing further assignments
          let wasParen = curc === $$PAREN_L_28;
          parseValue(lexerFlags, 'elements');
          parseExpressionFromOp(lexerFlags, NOT_ASSIGNABLE, wasParen, 'elements');
          if (curc === $$IS_3D && curtok.str === '=') {
            ASSERT_skipRex('=', lexerFlags);
            parseArgDefault(lexerFlags, 'elements');
          }
        } else {
          parseExpression(lexerFlags, 'elements');
        }
        if (curc !== $$COMMA_2C) break;
        ASSERT_skipRex(',', lexerFlags);
      }
      skipDivOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // slash would be division
    }
    AST_close(); // ArrayExpression

    return true; // TODO: properly validate whether this is a valid destructuring pattern
  }

  function parseValueTail(lexerFlags, assignable, astProp) {
    if (curc === $$DOT_2E && curtok.str === '.') {
      ASSERT_skipAny('.', lexerFlags); // TODO: optimize; next must be identifier
      if (curtype !== $IDENT) THROW('Dot property must be an identifier');
      AST_wrapClosed(astProp, 'MemberExpression', 'object');
      AST_setIdent('property', curtok);
      ASSERT_skipDiv($IDENT, lexerFlags); // x.y / z is division
      AST_set('computed', false);
      AST_close(); // MemberExpression
      assignable = parseValueTail(lexerFlags, IS_ASSIGNABLE, astProp);
    } else if (curc === $$SQUARE_L_5B) {
      AST_wrapClosed(astProp, 'MemberExpression', 'object');
      ASSERT_skipRex('[', lexerFlags);
      parseExpression(lexerFlags, 'property');
      skipDivOrDieSingleChar($$SQUARE_R_5D, lexerFlags);
      AST_set('computed', true);
      AST_close(); // MemberExpression
      assignable = parseValueTail(lexerFlags, IS_ASSIGNABLE, astProp);
    } else if (curc === $$PAREN_L_28) {
      ASSERT(curtype === $PUNCTUATOR && curtok.str === '(');
      ASSERT_skipRex('(', lexerFlags);
      if (astProp === 'callee') { // exception for `new`
        parseCallArgs(lexerFlags, 'arguments');
      } else {
        AST_wrapClosed(astProp, 'CallExpression', 'callee');
        AST_set('arguments', []);
        parseCallArgs(lexerFlags, 'arguments');
        AST_close(); // CallExpression
      }
      assignable = parseValueTail(lexerFlags, NOT_ASSIGNABLE, astProp);
    } else if (curc === $$TICK_60) {
      // tagged template is like a call but slightly special (and a very particular AST)
      ASSERT((curtype & $TICK) === $TICK);
      AST_wrapClosed(astProp, 'TaggedTemplateExpression', 'tag');

      AST_open('quasi', 'TemplateLiteral');
      AST_set('expressions', []);
      AST_set('quasis', []);

      AST_open('quasis', 'TemplateElement');
      AST_set('value', {raw: curtok.str.slice(1, (curtype === $TICK_PURE) ? -1 : -2), cooked: '<TODO>'});
      AST_set('tail', curtype === $TICK_PURE);
      // curtok skipped in loop or afterwards if loop is skipped
      AST_close(); // TemplateElement

      if (curtype === $TICK_HEAD) {
        let lfbak = lexerFlags;
        lexerFlags = lexerFlags | LF_IN_TEMPLATE; // tell tokenizer to interpret `}` as template
        do {
          ASSERT_skipRex($TICK, lexerFlags); // f`x${/foo/}y`
          parseExpression(lexerFlags, 'expressions');

          AST_open('quasis', 'TemplateElement');
          AST_set('value', {raw: curtok.str.slice(1, (curtype === $TICK_TAIL) ? -1 : -2), cooked: '<TODO>'});
          AST_set('tail', curtype === $TICK_TAIL);
          AST_close(); // TemplateElement
          if (curtype === $TICK_TAIL) lexerFlags = lfbak; // should happen only once and always
        } while (curtype !== $TICK_TAIL); // also fixes $EOF check so no infi loop
      }
      ASSERT_skipRex($TICK, lexerFlags); // f`x`\n/foo/
      AST_close(); // TemplateLiteral
      AST_close(); // TaggedTemplateExpression

      assignable = parseValueTail(lexerFlags, NOT_ASSIGNABLE, astProp);
    } else if ((curc === $$PLUS_2B && curtok.str === '++') || (curc === $$DASH_2D && curtok.str === '--')) {
      ASSERT(curtype === $PUNCTUATOR);
      AST_wrapClosed(astProp, 'UpdateExpression', 'argument');
      AST_set('operator', curtok.str);
      AST_set('prefix', false);
      ASSERT_skipDiv(curtok.str, lexerFlags);
      AST_close(); // UpdateExpression
    }
    return assignable;
  }
  function parseCallArgs(lexerFlags, astProp) {
    if (curc === $$PAREN_R_29) {
      ASSERT_skipDiv(')', lexerFlags);
    } else {
      do {
        parseExpression(lexerFlags, astProp);
        if (curc !== $$COMMA_2C) break;
        ASSERT_skipRex(',', lexerFlags);
      } while (true);
      skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags);
    }
  }

  function parseGroupOrArrow(lexerFlags, asyncKeywordPrefixed, astProp) {
    // returns whether the expression is assignable (ie, `(x)=5` is valid)

    // this function parses an arrow function or a grouped expression
    // in many cases we won't know what we're actually parsing until
    // we encounter the first token after the closing parenthesis
    // (`=>` leads to function, `=` leads to obscure assignment, other leads to group)

    ASSERT_skipRex('(', lexerFlags);

    let asyncness = asyncKeywordPrefixed ? WAS_ASYNC : NOT_ASYNC;

    if (curc === $$PAREN_R_29) {
      // (the only place where `()` is valid is an arrow header or call parens)

      ASSERT_skipAny(')', lexerFlags); // TODO: optimize; must be =>
      if (curtok.str === '=>') {
        AST_open(astProp, 'ArrowFunctionExpression');
        AST_set('params', []);
        parseArrowFromPunc(lexerFlags, asyncness);
        AST_close();
      } else if (asyncKeywordPrefixed) {
        // `async()` without arrow
        if (goalMode === GOAL_MODULE) {
          THROW('The `async` identifier is a keyword and must be followed by a function');
        }
        AST_setIdent(astProp, asyncKeywordPrefixed);
        AST_wrapClosed(astProp, 'CallExpression', 'callee');
        AST_set('arguments', []);
        AST_close(); // callexpression
      } else {
        THROW('Empty group must indicate an arrow');
      }

      return NOT_ASSIGNABLE;
    }

    // note: only a group-wrapped solo identifier or a value that results in a property
    // can be assignable (and more restrictions may apply for eval/arguments)
    let assignable = parseExpression(lexerFlags, astProp);

    if (curc === $$COMMA_2C) {
      // NOTE! this can become an ARROW HEADER! (in fact, this is most likely the case)
      _parseExpressions(lexerFlags, astProp);
      assignable = NOT_ASSIGNABLE; // in all cases
    }

    skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags);

    if (curc === $$IS_3D && curtok.str === '=>') { // note: the single ident param version is parsed elsewhere
      // arrow function. if that's possible.
      AST_wrapClosed(astProp, 'ArrowFunctionExpression', 'params');

      // <SCRUB AST>
      let node = _path[_path.length-1];
      if (node.params.type === 'SequenceExpression') node.params = node.params.expressions;
      else if (!Array.isArray(node.params)) node.params = [node.params];
      // </SCRUB AST>

      parseArrowFromPunc(lexerFlags, asyncness);

      AST_close();
    } else if (asyncKeywordPrefixed && goalMode === GOAL_MODULE) {
      THROW('The `async` identifier is a keyword and must be followed by a function');
    }

    return assignable;
  }
  function parseArrowFromPunc(lexerFlags, isAsync) {
    ASSERT_skipRex('=>', lexerFlags);
    AST_set('id', null);
    AST_set('generator', false);
    AST_set('async', isAsync);
    lexerFlags = resetLexerFlagsForFunction(lexerFlags, isAsync, NOT_GENERATOR, IS_ARROW);
    if (curc === $$CURLY_L_7B) {
      AST_set('expression', BODY_IS_BLOCK); // "body of arrow is block"
      parseBlockStatement(lexerFlags, 'body');
    } else {
      AST_set('expression', BODY_IS_EXPR); // "body of arrow is expr"
      parseExpression(lexerFlags, 'body'); // TODO: what about curlyLexerFlags here?
    }
  }

  // <SCRUB AST>
  function logPath() {
    console.log('Path: ' + _path.map(o=>o.type).join(' '))
  }
  function logTree() {
    console.log('Tree: ' + require('util').inspect(_tree, false, null))
  }
  // </SCRUB AST>

  init();
  parseTopLevels(sansFlag(INITIAL_LEXER_FLAGS | (options_strictMode ? LF_STRICT_MODE : 0), LF_FOR_REGEX));

  //tok.deopt();

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
    (($TICK_BODY | $TICK_HEAD | $TICK_PURE | $TICK_TAIL | $TICK) ^ $TICK);
  // (x|y)^y : the or will first make sure the bits are set (regardless) and the xor then unsets them
  let flag = (type | redundantFlags) ^ redundantFlags;
  //ASSERT((1 << Math.clz(flag)) === flag, 'should only have one bit set');
  return flag;
}

// </BODY>

//export default ZeParser;
//export {
require['__./zeparser'] = module.exports = { default: ZeParser,
  // this is a re-export but prevents external scripts from also needing to require zetokenizer
  // (okay and in the build it all falls apart, anyways)
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,
};
