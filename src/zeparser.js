
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

  STRICT_MODE,
  FOR_REGEX,
  IN_TEMPLATE,
  INITIAL_LEXER_FLAGS,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

// <BODY>

function ZeParser(code, mode, collectTokens = COLLECT_TOKENS_NONE) {
  let tok = ZeTokenizer(code, false, collectTokens);

  let curtok = null;
  let curtype = 0;
  let curc = 0;

  let traceast = false;

  // https://github.com/estree/estree
  // https://github.com/estree/estree/blob/master/es5.md
  // https://github.com/estree/estree/blob/master/es2015.md
  // https://astexplorer.net/
  let _tree = {
    type: 'Program',
  };
  let _path = [_tree];
  function OPEN(prop, type, fromWrap = false) {
    if (traceast) {
      console.log('OPEN', prop, type, fromWrap);
      console.log('- path (before):', _path.map(o => o.type).join(' - '));
    }
    ASSERT(arguments.length === 2 || arguments.length === 3, '2 args');
    let node = _path[_path.length - 1];
    let newnode = {type};
    if (Array.isArray(node[prop])) {
      node[prop].push(newnode);
    } else if (node[prop] === undefined || fromWrap) {
      node[prop] = newnode;
    } else {
      THROW('bad tree? node[prop] should be undefined but wasnt', 'child=', node, 'prop=', prop, 'type=', type, 'node[prop]=', node[prop]);
    }
    _path.push(newnode);
  }
  function CLOSE() {
    if (traceast) {
      console.log('CLOSE')
      console.log('- path:', _path.map(o => o.type).join(' - '));
    }
    _path.pop();
  }
  function SET(prop, value) {
    if (traceast) {
      console.log('SET', prop, value);
      console.log('- path:', _path.map(o => o.type).join(' - '));
    }
    ASSERT(_path[_path.length - 1][prop] === undefined, 'dont clobber');
    _path[_path.length - 1][prop] = value;
  }
  function ADD(prop, value) {
    if (traceast) {
      console.log('ADD', prop, value);
      console.log('- path:', _path.map(o => o.type).join(' - '));
    }
    ASSERT(Array.isArray(_path[_path.length - 1][prop]), 'expecting to add to an existing array');
    _path[_path.length - 1][prop].push(value);
  }
  function WRAP_OPENED(prop, value, newProp) {
    if (traceast) {
      console.log('WRAP_OPENED', prop, value, newProp)
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before:', require('util').inspect(_tree, false, null))
    }
    // wrap the "current" node (last of _tree) with an extra node
    // so the parent of node becomes the parent of a new node and
    // the old node becomes a child of the new node
    // a(x:b) -> a(x:c(y:b))

    let node = _path.pop();
    let parent = _path[_path.length-1];

    if (traceast) console.log(' - node to wrap:', node, ', prop:', prop, ', parent:', parent);

    if (Array.isArray(parent[prop])) {
      ASSERT(node === parent[prop][parent[prop].length - 1], 'top should be last element of parent[prop]');
      parent[prop].pop();
    } else {
      ASSERT(node === parent[prop], 'top should be parent[prop]');
    }

    OPEN(prop, value, true);
    // set it as child of new node
    SET(newProp, node);
    _path.push(node);
    if (traceast) {
      console.log('- tree after:', require('util').inspect(_tree, false, null))
    }
  }
  function WRAP_CLOSED(prop, value, newProp) {
    if (traceast) {
      console.log('WRAP_CLOSED', prop, value, newProp)
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

    OPEN(prop, value, true);
    // set it as child of new node
    // TODO: what if array?
    SET(newProp, child);
    if (traceast) {
      console.log('- tree after:', require('util').inspect(_tree, false, null))
    }
  }
  function WRAP_CLOSED_ARRAY(prop, value, newProp) {
    if (traceast) {
      console.log('WRAP_CLOSED', prop, value, newProp)
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before:', require('util').inspect(_tree, false, null))
    }
    // same as WRAP_CLOSED except the node is put in an array

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

    OPEN(prop, value, true);
    // set the node as the first child of the property as an array
    SET(newProp, [child]);
    if (traceast) {
      console.log('- tree after:', require('util').inspect(_tree, false, null))
    }
  }
  function DECONSTRUCT(prop, assignmentsToo) {
    ASSERT(arguments.length === 2, 'arg count');
    // rename object and array literal nodes to patterns to match the AST spec
    // this happens when either literal type was parsed (possibly nested) and
    // then a destructuring assignment was encountered

    // recursively walk the tree from the prop in open node and visit
    // any array and object expression as well as the left side of assignments
    // for now dont bother with other nodes until we find a reason to

    // note: this function is usually called after a few nodes have closed (the literal struct).

    if (traceast) {
      console.log('DECONSTRUCT', prop)
      console.log('- path:', _path.map(o => o.type).join(' - '));
      console.log('- tree before destruct:', require('util').inspect(_tree, false, null))
    }

    let node = _path[_path.length-1][prop];
    if (Array.isArray(node)) node = node[node.length-1];

    ASSERT(node, 'should have this node');
    ASSERT(assignmentsToo || node.type === 'ArrayExpression' || node.type === 'ObjectExpression', 'should start at an object or array literal');

    _DESTRUCT(node, true); // TODO: remove the arg.
    if (traceast) {
      console.log('- tree after destruct:', require('util').inspect(_tree, false, null))
    }
  }
  function _DESTRUCT(node, assignmentsToo) {
    if (traceast) {
      console.log('_DESTRUCT', node);
    }

    if (node.type === 'ArrayExpression') {
      node.type = 'ArrayPattern';
      for (let i = 0, n = node.elements.length; i < n; ++i) {
        _DESTRUCT(node.elements[i], assignmentsToo);
      }
    } else if (node.type === 'ObjectExpression') {
      node.type = 'ObjectPattern';
      for (let i = 0, n = node.properties.length; i < n; ++i) {
        let property = node.properties[i];
        _DESTRUCT(property.value, assignmentsToo);
      }
    } else if (node.type === 'AssignmentExpression') {
      if (assignmentsToo) node.type = 'AssignmentPattern';
      // walk the left of the assignment only
      _DESTRUCT(node.left, false);
    }
  }

  function sansFlag(flags, flag) {
    return (flags | flag) ^ flag;
  }

  function init() {
    do {
      skipRex(sansFlag(INITIAL_LEXER_FLAGS, FOR_REGEX));
      if (curtype === $ERROR) ERROR;
    } while (curtype === $ERROR);
  }

  function skipRex(lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 1, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT((lexerFlags & FOR_REGEX) === 0, 'regex flag should not be set anywhere');

    curtok = tok(lexerFlags | FOR_REGEX, false);
    curtype = curtok.type;
    curc = curtok.c;

    ASSERT(typeof curtype === 'number' && curtype >= 0);
    ASSERT(typeof curc === 'number' && curc >= 0 && curc <= 0x10ffff, 'valid c', JSON.stringify(curtok));
  }
  function skipDiv(lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 1, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT((lexerFlags & FOR_REGEX) === 0, 'regex flag should not be set anywhere');

    curtok = tok(lexerFlags, false);
    curtype = curtok.type;
    curc = curtok.c;

    ASSERT(typeof curtype === 'number' && curtype >= 0);
    ASSERT(typeof curc === 'number' && curc >= 0 && curc <= 0x10ffff, 'valid c', JSON.stringify(curtok));
  }
  function skipAny(lexerFlags) {
    skipRex(lexerFlags); // TODO: optimize; in this case the next token is very restricted but at least no slash
  }

  function ASSERT_skipRex(what, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 2, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(typeof what === 'number' || typeof what === 'string', 'what number/string');
    if (typeof what === 'string') ASSERT(curtok.str === what, 'expecting to skip token with certain value', 'expect:', what, 'actual:', curtok.str);
    else ASSERT(curtype === what, 'expecting to skip token with certain type', 'expect:', debug_toktype(what), 'actual:', debug_toktype(curtype));
    skipRex(lexerFlags);
  }
  function ASSERT_skipDiv(what, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 2, 'should get all params', arguments);
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT(typeof what === 'number' || typeof what === 'string', 'what number/string');
    if (typeof what === 'string') ASSERT(curtok.str === what, 'expecting to skip token with certain value', 'expect:', what, 'actual:', curtok.str);
    else ASSERT(curtype === what, 'expecting to skip token with certain type', 'expect:', debug_toktype(what), 'actual:', debug_toktype(curtype));
    skipDiv(lexerFlags);
  }
  function ASSERT_skipAny(what, lexerFlags) {
    // next token cannot validly start with a forward slash (may be optimizable)
    ASSERT_skipDiv(what, lexerFlags);
  }

  function skipRexOrDie(chr, str, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 3, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== chr || str !== curtok.str) ERROR;
    else skipRex(lexerFlags);
  }
  function skipAnyOrDie(chr, str, lexerFlags) {
    // next token cannot start with forward slash (may be optimizable)
    skipRexOrDie(chr, str, lexerFlags);
  }
  function skipRexOrDieSingleChar(chr, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(arguments.length === 2, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== chr) {
      console.log('error token:', curtok);
      ERROR;
    } else {
      ASSERT(curtok.str.length === 1, 'should be len=1');
      skipRex(lexerFlags);
    }
  }
  function skipDivOrDieSingleChar(chr, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a division punctuator
    ASSERT(arguments.length === 2, 'arg count');
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    if (curc !== chr) {
      console.log('error token:', curtok);
      ERROR;
    } else {
      ASSERT(curtok.str.length === 1, 'should be len=1');
      skipDiv(lexerFlags);
    }
  }
  function skipAnyOrDieSingleChar(chr, lexerFlags) {
    // next token cant start with forward slash (may be optimizable)
    skipRexOrDieSingleChar(chr, lexerFlags);
  }
  function skipRexIf(what, lexerFlags) {
    // skip a token and if the next token starts with a forward slash, search for a regular expression literal
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    if (typeof what === 'string') {
      if (curtok.str === what) {
        skipRex(lexerFlags);
        return true;
      }
      return false;
    }
    ASSERT(typeof what === 'number');
    if (curtype === what) {
      skipRex(lexerFlags);
      return true;
    }
    return false;
  }
  function skipAnyIf(what, lexerFlags) {
    // the next token cant start with a forward slash (can be optimized)
    return skipRexIf(what, lexerFlags);
  }

  function parseTopLevels(lexerFlags) {
    let len = _path.length;
    parseBodyParts(lexerFlags);
    ASSERT(_path.length === len, 'should close all that was opened');
  }

  function parseBodyParts(lexerFlags) {
    SET('body', []);
    _parseBodyParts(lexerFlags, 'body');
  }

  function _parseBodyParts(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    while (curtype !== $EOF && curc !== $$CURLY_R_7D) parseBodyPart(lexerFlags, astProp);
  }

  function parseStatementHeader(lexerFlags, headProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerflags number');
    skipRexOrDieSingleChar($$PAREN_L_28, lexerFlags);
    parseExpression(lexerFlags, headProp);
    skipRexOrDieSingleChar($$PAREN_R_29, lexerFlags);
  }

  function parseSemiOrAsi(lexerFlags) {
    if (curc === $$SEMI_3B) {
      ASSERT_skipRex(';', lexerFlags);
    } else if (curc === $$CURLY_R_7D || curtok.nl || curtype === $EOF) {
      tok.asi();
    } else {
      console.log('parse error at curc', curc, String.fromCharCode(curc), curtok.str);
      console.log('current token:', curtok);
      ERROR();
    }
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
        THROW('unexpected token', curtok, debug_toktype(curtype), debug_toktype(getGenericTokenType(curtype)));
    }
  }

  // ### functions

  function parseAsyncFunction(lexerFlags, optionalIdent, astProp) {
    ASSERT_skipAny('async', lexerFlags);
    return parseFunction(lexerFlags, true, true, optionalIdent, astProp);
  }
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
    parseFunctionFromIdent(lexerFlags, funcDecl, false, isGenerator, isAsync, optionalIdent, astProp);
  }
  function parseFunctionExpression(lexerFlags, isAsync, astProp) {
    let isGenerator = false;
    if (!isAsync && skipAnyIf('*', lexerFlags)) {
      isGenerator = true;
    }
    parseFunctionFromIdent(lexerFlags, false, true, isGenerator, isAsync, false, astProp);
  }
  function parseFunctionFromIdent(lexerFlags, isFuncDecl, isRealExpr, isGenerator, isAsync, isIdentOptional, astProp) {
    ASSERT(arguments.length === 7, 'arg count');

    OPEN(astProp, isFuncDecl ? 'FunctionDeclaration' : 'FunctionExpression')

    SET('generator', isGenerator);
    SET('async', isAsync);
    SET('expression', isRealExpr);

    if (curtype === $IDENT) {
      // TODO: verify identifier
      OPEN('id', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skipAny($IDENT, lexerFlags);
      CLOSE();
    } else if (isFuncDecl && !isIdentOptional) {
      ERROR;
    } else {
      SET('id', null);
    }

    parseFunctionFromParams(lexerFlags, isFuncDecl, isAsync, isGenerator, astProp);
    CLOSE();
  }
  function parseFunctionFromParams(lexerFlags, funcDecl, isAsync, isGenerator, astProp) {
    SET('params', []);
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
    parseBlockStatement(lexerFlags, 'body');
  }
  function parseFuncArgument(lexerFlags, astProp) {
    if (curtype === $IDENT) {
      OPEN(astProp, 'Identifier');
      SET('name', curtok.str);
      ASSERT_skipAny($IDENT, lexerFlags);
      CLOSE();
    } else if (curtype === $PUNCTUATOR) {
      if (curc === $$CURLY_L_7B) parseObjectLitOrDestruc(lexerFlags, true, astProp);
      else if (curc === $$SQUARE_L_5B) parseArrayLitOrDestruc(lexerFlags, true, astProp);
      else TODO;
    } else { // ?
      TODO
    }

    DECONSTRUCT(astProp, true);

    // default value
    if (skipRexIf('=', lexerFlags)) {
      parseArgDefault(lexerFlags, astProp)
    }
  }

  function parseArgDefault(lexerFlags, astProp) {
    WRAP_CLOSED(astProp, 'AssignmentPattern', 'left');
    parseExpression(lexerFlags, 'right');
    CLOSE();
  }

  // ### statements

  function parseIdentStatement(lexerFlags, astProp) {
    // all statement starting keywords;

    // break, class, const, continue, debugger, do, export, for, function, if, import, let, loop, return, switch, throw, try, var, while, with, yield,

    switch (curtok.str) {
      case 'async':
        parseAsyncFunction(lexerFlags, false, astProp);
        break;

      case 'break':
        parseBreakStatement(lexerFlags, astProp);
        break;

      case 'class':
        parseClass(lexerFlags, false, astProp);
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
        parseFunction(lexerFlags, true, false, false, astProp);
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

      case 'yield':
        parseYieldStatement(lexerFlags, astProp);
        break;

      default:
        parseIdentLabelOrExpressionStatement(lexerFlags, astProp);

    }
  }

  function parseFromLiteralStatement(lexerFlags, astProp) {
    OPEN(astProp, 'ExpressionStatement');
    OPEN('expression', 'Literal');
    SET('value', '<TODO>');
    SET('raw', curtok.str);
    skipDiv(lexerFlags);
    CLOSE();
    parseExpressionAfterLiteral(lexerFlags, 'expression');
    CLOSE();
    parseSemiOrAsi(lexerFlags);
  }

  function parseTickStatement(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    OPEN(astProp, 'ExpressionStatement');
    parseTickExpression(lexerFlags, 'expression');
    parseExpressionAfterLiteral(lexerFlags, 'expression');
    CLOSE();
    parseSemiOrAsi(lexerFlags);
  }

  function parseBlockStatement(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    let sans = sansFlag(lexerFlags, IN_TEMPLATE);

    OPEN(astProp, 'BlockStatement');
    SET('body', []);
    ASSERT_skipRex('{', sans);
    _parseBodyParts(sansFlag(sans, IN_TEMPLATE), 'body');
    skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    CLOSE();
  }

  function parseBreakStatement(lexerFlags, astProp) {
    OPEN(astProp, 'BreakStatement');
    // break is only valid inside a breakable, fenced by functions
    ASSERT_skipRex('break', lexerFlags);
    // a break may be followed by another identifier which must then be a valid label.
    // otherwise it's just a break to the nearest breakable (most likely).

    if (curtype === $IDENT && !curtok.nl) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)
      OPEN('label', 'Identifier');
      SET('name', curtok.str);
      CLOSE();

      ASSERT_skipRex($IDENT, lexerFlags);
    } else {
      SET('label', null);
    }

    parseSemiOrAsi(lexerFlags);
    CLOSE();
  }

  function parseClass(lexerFlags, optionalIdent, astProp) {
    // Note: all class code is always strict mode implicitly
    // class x {}
    // class x extends <lhs expr> {}
    // class x {;}
    // class x {[static] <method>[]}

    let oflags = lexerFlags; // could already have strict mode flag set and we need to know this for the last skip of this function
    lexerFlags |= STRICT_MODE;

    OPEN(astProp, 'ClassDeclaration');
    ASSERT_skipAny('class', lexerFlags);

    // note: default exports has optional ident but should still not skip `extends` here
    // but it is not a valid class name anyways (which is superseded by a generic keyword check)
    if (curtype === $IDENT && curtok.str !== 'extends') {
    // TODO: verify keyword
      OPEN('id', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skipAny($IDENT, lexerFlags);
      CLOSE();
    } else if (!optionalIdent) {
      ERROR
    } else {
      SET('id', null);
    }

    if (curtype === $IDENT && curtok.str === 'extends') {
      ASSERT_skipRex('extends', lexerFlags);
      parseValue(lexerFlags, 'superClass');
    } else {
      SET('superClass', null);
    }

    skipRexOrDieSingleChar($$CURLY_L_7B, lexerFlags);

    // parse method, static method, or emptystatement

    OPEN('body', 'ClassBody');
    SET('body', []);
    while (parseClassMethod(lexerFlags, 'body') === true);
    CLOSE(); // ClassBody

    skipRexOrDie($$CURLY_R_7D, '}', oflags);
    CLOSE(); // ClassDeclaration
  }

  function parseClassMethod(lexerFlags) {
    // everything from objlit that is a method optionally prefixed by `static`, and an empty statement
    return _parseClassMethod(lexerFlags, false);
  }
  function _parseClassMethod(lexerFlags, isStatic) {
    ASSERT(arguments.length === _parseClassMethod.length, 'arg count');

    if (curtype === $IDENT) {
      let identToken = curtok;
      ASSERT_skipAny($IDENT, lexerFlags);
      // getter, setter, async, or ident method
      switch (identToken.str) {
        case 'static':
          if (isStatic) {
            return TODO // this is a regular method named `static` which seems to be okay.
          } else {
            return _parseClassMethod(lexerFlags, true);
          }
        case 'async':
          if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
            // async function
            parseMethod(lexerFlags, true, false, false, false, isStatic);
            return true;
          }
          // method named "async"
          break;
        case 'get':
          if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
            // getter function
            parseMethod(lexerFlags, false, true, false, false, isStatic);
            return true;
          }
          // method named "get"
          break;
        case 'set':
          if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
            // setter function
            parseMethod(lexerFlags, false, false, true, false, isStatic);
            return true;
          }
          // method named "set"
          break;
        default:
      }
      parseMethodIdent(lexerFlags, false, false, false, false, isStatic, identToken);
    } else if (curc === $$SQUARE_L_5B) {
      // dynamic property
      parseMethodDynamic(lexerFlags, false, false, false, false, isStatic);
    } else if (curc === $$STAR_2A) {
      // generator method
      ASSERT_skipAny('*', lexerFlags);
      parseMethod(lexerFlags, false, false, false, true, isStatic);
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
      console.log('error token:', curtok)
      ERROR
    }
  }
  function parseMethodIdent(lexerFlags, isAsync, isGetter, isSetter, isGenerator, isStatic, identToken) {
    ASSERT(arguments.length === parseMethodIdent.length, 'arg count');

    // TODO: validate given ident token value
    OPEN('body', 'MethodDefinition');
    SET('static', isStatic);
    SET('computed', false);
    SET('kind', (!isStatic && identToken.str === 'constructor') ? 'constructor' : isGetter ? 'get' : isSetter ? 'set' : 'method');
    OPEN('key', 'Identifier');
    SET('name', identToken.str);
    CLOSE();
    if (curc !== $$PAREN_L_28) ERROR; // must explicitly check here
    parseFunctionFromIdent(lexerFlags, false, false, isGenerator, isAsync, true, 'value');
    CLOSE(); // MethodDefinition
  }
  function parseMethodDynamic(lexerFlags, isAsync, isGetter, isSetter, isGenerator, isStatic) {
    ASSERT(arguments.length === parseMethodDynamic.length, 'arg count');

    OPEN('body', 'MethodDefinition');
    SET('static', isStatic);
    SET('computed', true);
    SET('kind', isGetter ? 'get' : isSetter ? 'set' : 'method');
    ASSERT_skipRex('[', lexerFlags);
    parseExpression(lexerFlags, 'key');
    skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags);
    if (curc !== $$PAREN_L_28) ERROR; // must explicitly check here
    parseFunctionFromIdent(lexerFlags, false, false, isGenerator, isAsync, true, 'value');
    CLOSE(); // MethodDefinition
  }

  function parseConstStatement(lexerFlags, astProp) {
    _parseAnyVarStatement(lexerFlags, 'const', astProp);
  }

  function parseContinueStatement(lexerFlags, astProp) {
    OPEN(astProp, 'ContinueStatement');
    // continue is only valid inside a loop, fenced by functions
    ASSERT_skipRex('continue', lexerFlags);
    // a continue may be followed by another identifier which must then be a valid label.
    // otherwise it's just a continue to the nearest loop (most likely).

    if (curtype === $IDENT && !curtok.nl) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)
      OPEN('label', 'Identifier');
      SET('name', curtok.str);
      CLOSE();

      ASSERT_skipRex($IDENT, lexerFlags);
    } else {
      SET('label', null);
    }

    parseSemiOrAsi(lexerFlags);
    CLOSE();
  }

  function parseDebuggerStatement(lexerFlags, astProp) {
    OPEN(astProp, 'DebuggerStatement');
    CLOSE();
    ASSERT_skipRex('debugger', lexerFlags);
    parseSemiOrAsi(lexerFlags);
  }

  function parseDoStatement(lexerFlags, astProp) {
    OPEN(astProp, 'DoWhileStatement');
    ASSERT_skipRex('do', lexerFlags);
    parseBodyPart(lexerFlags, 'body');
    skipAnyOrDie($$W_77, 'while', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseSemiOrAsi(lexerFlags);
    CLOSE();
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
      OPEN(astProp, 'ExportDefaultDeclaration')
      ASSERT_skipRex('default', lexerFlags);

      if (curtok.str === 'class') {
        // export class ...
        parseClass(lexerFlags, true, 'declaration');
      } else if (curc === $$F_66 && curtok.str === 'function') {
        // export default function f(){}
        // export default function* f(){}
        // export default function(){}
        // export default function* (){}
        parseFunction(lexerFlags, true, false, true, 'declaration');
      } else if (curc === $$A_61 && curtok.str === 'async') {
        // export async function f(){}
        // export async function(){}
        parseAsyncFunction(lexerFlags, true, 'declaration');
      } else {
        // any expression is exported as is (but is not a live binding)
        parseExpression(lexerFlags, 'declaration');
      }
      CLOSE(); // ExportDefaultDeclaration
    } else if (curc === $$STAR_2A) {
      // export * from "x"
      OPEN(astProp, 'ExportAllDeclaration');
      ASSERT_skipAny('*', lexerFlags);
      skipAnyOrDie($$F_66, 'from', lexerFlags);
      OPEN('source', 'Literal');
      SET('value', '<TODO>');
      SET('raw', curtok.str);
      skipRex(lexerFlags);
      CLOSE(); // source
      CLOSE(); // ExportAllDeclaration
    } else {
      OPEN(astProp, 'ExportNamedDeclaration');
      SET('specifiers', []);
      if (curc === $$CURLY_L_7B) {
        SET('declaration', null);
        // export {}
        // export {} from "x"
        parseExportObject(lexerFlags);
        if (skipAnyIf('from', lexerFlags)) {
          if ((curtype & $STRING) !== $STRING) ERROR;
          OPEN('source', 'Literal');
          SET('value', '<TODO>');
          SET('raw', curtok.str);
          skipRex(lexerFlags);
          CLOSE();
        } else {
          SET('source', null);
        }
      } else if (curc === $$V_76 && curtok.str === 'var') {
        // export var <bindings>
        _parseAnyVarDecls(lexerFlags, 'var', 'declaration');
        SET('source', null);
      } else if (curc === $$L_6C && curtok.str === 'let') {
        // export let <bindings>
        _parseAnyVarDecls(lexerFlags, 'let', 'declaration');
        SET('source', null);
      } else if (curc === $$C_63) {
        if (curtok.str === 'const') {
          // export const <bindings>
          _parseAnyVarDecls(lexerFlags, 'const', 'declaration');
        } else if (curtok.str === 'class') {
          // export class ...
          parseClass(lexerFlags, false, 'declaration');
        } else {
          ERROR
        }
        SET('source', null);
      } else if (curc === $$F_66 && curtok.str === 'function') {
        // export function f(){}
        // export function* f(){}
        // (anonymous should not be allowed but parsers seem to do it anyways)
        parseFunction(lexerFlags, true, false, false, 'declaration');
        SET('source', null);
      } else if (curc === $$A_61 && curtok.str === 'async') {
        // export async function f(){}
        parseAsyncFunction(lexerFlags, false, 'declaration');
        SET('source', null);
      } else {
        ERROR
      }
      CLOSE(); // ExportNamedDeclaration
    }

    parseSemiOrAsi(lexerFlags);
  }
  function parseExportObject(lexerFlags) {
    // import {...} from 'x'
    ASSERT_skipAny('{', lexerFlags);
    while (curtype === $IDENT) {
      OPEN('specifiers', 'ExportSpecifier');
      let name = curtok.str;
      OPEN('local', 'Identifier');
      SET('name', name);
      skipAny(lexerFlags);
      CLOSE(); // local
      OPEN('exported', 'Identifier');
      if (curtok.str === 'as') {
        ASSERT_skipAny('as', lexerFlags);
        if (curtype !== $IDENT) ERROR;
        SET('name', curtok.str);
        skipAny(lexerFlags);
      } else {
        SET('name', name);
      }
      CLOSE(); // exported
      if (curc === $$COMMA_2C) skipAny(lexerFlags);
      CLOSE(); // specifiers
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
    parseBodyPart(lexerFlags, 'body');
    CLOSE();
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
        WRAP_CLOSED(astProp, 'ForInStatement', 'left');
        if (!assignable) ERROR;
        ASSERT_skipRex('in', lexerFlags);
        parseExpression(lexerFlags, 'right');
        return;
      }
      if (curtok.str === 'of') {
        WRAP_CLOSED(astProp, 'ForOfStatement', 'left');
        if (!assignable) ERROR;
        ASSERT_skipRex('of', lexerFlags);
        parseExpression(lexerFlags, 'right');
        return;
      }
      ASSERT(curtok.str === 'instanceof', 'the only other valid identifier here is the instanceof op'); // very unlikely case tho
    }

    if (emptyInit) {
      OPEN(astProp, 'ForStatement');
      SET('init', null);
    } else {
      WRAP_CLOSED(astProp, 'ForStatement', 'init');
      // we are still in the `init` part of a classic for. keep parsing from the current expression value.
      if (wasNotDecl) parseExpressionFromOp(lexerFlags, assignable, startedWithParen, 'init');
    }

    skipRexOrDieSingleChar($$SEMI_3B, lexerFlags);
    if (curc === $$SEMI_3B) {
      SET('test', null);
    } else {
      parseExpression(lexerFlags, 'test');
    }
    skipRexOrDieSingleChar($$SEMI_3B, lexerFlags);
    if (curc === $$PAREN_R_29) {
      SET('update', null);
    } else {
      parseExpression(lexerFlags, 'update');
    }
  }

  function parseIfStatement(lexerFlags, astProp) {
    OPEN(astProp, 'IfStatement');
    ASSERT_skipAny('if', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseBodyPart(lexerFlags, 'consequent');
    if (curtype === $IDENT && curtok.str === 'else') {
      ASSERT_skipRex('else', lexerFlags);
      parseBodyPart(lexerFlags, 'alternate');
    } else {
      SET('alternate', null);
    }
    CLOSE();
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
    // (cannot created a var named `yield` or `await` this way)

    ASSERT_skipAny('import', lexerFlags);

    OPEN(astProp, 'ImportDeclaration');
    SET('specifiers', []);

    if (curtype === $IDENT) {
      parseImportDefault(lexerFlags);
      if (curc === $$COMMA_2C) {
        ASSERT_skipAny(',', lexerFlags);
        if (curc === $$STAR_2A) {
          parseImportNamespace(lexerFlags);
        } else if (curc === $$CURLY_L_7B) {
          parseImportObject(lexerFlags);
        } else {
          ERROR
        }
      } else {
        if (curtok.str !== 'from') ERROR
        ASSERT_skipAny('from', lexerFlags);
      }
    } else if (curc === $$STAR_2A) {
      parseImportNamespace(lexerFlags);
    } else if (curc === $$CURLY_L_7B) {
      parseImportObject(lexerFlags);
    }

    // `import 'foo'` is valid but otherwise this is an error
    if ((curtype & $STRING) !== $STRING) ERROR

    OPEN('source', 'Literal');
    SET('value', '<TODO>');
    SET('raw', curtok.str);
    skipRex(lexerFlags);
    CLOSE(); // source

    CLOSE(); // import
  }
  function parseImportDefault(lexerFlags) {
    // import x[ as y][, * as m | , {...}] from 'z'
    OPEN('specifiers', 'ImportDefaultSpecifier');
    OPEN('local', 'Identifier');
    SET('name', curtok.str);
    ASSERT_skipAny($IDENT, lexerFlags); // next must be `as` comma or `from`
    CLOSE(); // local
    CLOSE(); // specifiers
  }
  function parseImportObject(lexerFlags) {
    // import {...} from 'x'
    ASSERT_skipAny('{', lexerFlags);
    while (curtype === $IDENT) {
      OPEN('specifiers', 'ImportSpecifier');
      let name = curtok.str;
      OPEN('imported', 'Identifier');
      SET('name', name);
      skipAny(lexerFlags);
      CLOSE(); // imported
      OPEN('local', 'Identifier');
      if (curtok.str === 'as') {
        ASSERT_skipAny('as', lexerFlags);
        if (curtype !== $IDENT) ERROR;
        SET('name', curtok.str);
        skipAny(lexerFlags);
      } else {
        SET('name', name);
      }
      CLOSE(); // local
      if (curc === $$COMMA_2C) skipAny(lexerFlags);
      CLOSE(); // specifiers
    }
    skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlags);

    if (curtok.str !== 'from') ERROR;
    ASSERT_skipAny('from', lexerFlags);
  }
  function parseImportNamespace(lexerFlags) {
    // import * as x from 'y'
    ASSERT_skipAny('*', lexerFlags);
    skipAnyOrDie($$A_61, 'as', lexerFlags);

    OPEN('specifiers', 'ImportNamespaceSpecifier');
    OPEN('local', 'Identifier');
    SET('name', curtok.str);
    ASSERT_skipAny($IDENT, lexerFlags); // next must be `as` comma or `from`
    CLOSE(); // local
    CLOSE(); // specifiers

    if (curtok.str !== 'from') ERROR;
    ASSERT_skipAny('from', lexerFlags);
  }

  function parseLetStatement(lexerFlags, astProp) {
    _parseAnyVarStatement(lexerFlags, 'let', astProp);
  }

  function parseReturnStatement(lexerFlags, astProp) {
    OPEN(astProp, 'ReturnStatement');
    ASSERT_skipRex('return', lexerFlags);

    if (!curtok.nl && curtype !== $EOF && curc !== $$SEMI_3B) {
      parseExpression(lexerFlags, 'argument');
    } else {
      SET('argument', null);
    }

    parseSemiOrAsi(lexerFlags);

    CLOSE();
  }

  function parseSwitchStatement(lexerFlags, astProp) {
    OPEN(astProp, 'SwitchStatement');
    ASSERT_skipAny('switch', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'discriminant');
    skipAnyOrDieSingleChar($$CURLY_L_7B, lexerFlags); // TODO: optimize; next must be `case` or `default` or `}`
    SET('cases', []);
    let hadDefault = false;
    while (true) {
      if (curtok.str === 'case') {
        OPEN('cases', 'SwitchCase');
        ASSERT_skipRex('case', lexerFlags);
        parseExpression(lexerFlags, 'test');
        SET('consequent', []);
        if (curc !== $$COLON_3A) ERROR;
        ASSERT_skipRex(':', lexerFlags);
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) {
          parseBodyPart(lexerFlags, 'consequent');
        }

        CLOSE();
      } else if (curtok.str === 'default') {
        if (hadDefault) ERROR;
        OPEN('cases', 'SwitchCase');
        ASSERT_skipAny('default', lexerFlags); // TODO: optimize; next must be :
        if (curc !== $$COLON_3A) ERROR;
        ASSERT_skipRex(':', lexerFlags);
        SET('test', null);
        SET('consequent', []);
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) parseBodyPart(lexerFlags, 'consequent');
        CLOSE();
      } else {
        break;
      }
    }
    skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    CLOSE();
  }

  function parseThrowStatement(lexerFlags, astProp) {
    OPEN(astProp, 'ThrowStatement');
    ASSERT_skipRex('throw', lexerFlags);
    parseExpression(lexerFlags, 'argument');
    parseSemiOrAsi(lexerFlags);
    CLOSE();
  }

  function parseTryStatement(lexerFlags, astProp) {
    OPEN(astProp, 'TryStatement');

    let hasEither = false;

    ASSERT_skipAny('try', lexerFlags); // TODO: optimize; next must be {
    parseBlockStatement(lexerFlags, 'block');

    if (curc === $$C_63 && curtok.str === 'catch') {
      hasEither = true;
      OPEN('handler', 'CatchClause');
      ASSERT_skipAny('catch', lexerFlags); // TODO: optimize; next must be (
      skipAnyOrDieSingleChar($$PAREN_L_28, lexerFlags); // TODO: optimize; next must be ident (maybe destructuring?)
      if (curtype === $IDENT) {
        OPEN('param', 'Identifier');
        SET('name', curtok.str);
        ASSERT_skipAny($IDENT, lexerFlags); // TODO: optimize; next must be ) and maybe comma or ident
        CLOSE();
      } else if (curc === $$PAREN_L_28 || curc === $$SQUARE_L_5B) {
        TODO
      } else {
        ERROR('unknown catch clause');
      }
      skipAnyOrDieSingleChar($$PAREN_R_29, lexerFlags); // TODO: optimize; next must be {
      parseBlockStatement(lexerFlags, 'body');
      CLOSE(); // CatchClause
    } else {
      SET('handler', null);
    }

    if (curc === $$F_66 && curtok.str === 'finally') {
      hasEither = true;
      ASSERT_skipAny('finally', lexerFlags); // TODO: optimize; next must be {
      parseBlockStatement(lexerFlags, 'finalizer');
    } else {
      SET('finalizer', null);
    }

    CLOSE();

    if (!hasEither) ERROR('must have one');
  }

  function parseVarStatement(lexerFlags, astProp) {
    _parseAnyVarStatement(lexerFlags, 'var', astProp);
  }

  function parseWhileStatement(lexerFlags, astProp) {
    OPEN(astProp, 'WhileStatement');
    ASSERT_skipAny('while', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'test');
    parseBodyPart(lexerFlags, 'body');
    CLOSE();
  }

  function parseIdentLabelOrExpressionStatement(lexerFlags, astProp) {
    let identToken = curtok;
    ASSERT_skipDiv($IDENT, lexerFlags);
    if (curc === $$COLON_3A) {
      OPEN(astProp, 'LabeledStatement');
      OPEN('label', 'Identifier');
      SET('name', identToken.str);
      CLOSE();
      ASSERT_skipRex(':', lexerFlags);
      parseBodyPart(lexerFlags, 'body');
      CLOSE();
    } else {
      OPEN(astProp, 'ExpressionStatement');
      parseExpressionAfterIdentifier(lexerFlags, identToken, 'expression');
      CLOSE();
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
        OPEN(astProp, 'ExpressionStatement');
        parseExpression(lexerFlags, 'expression');
        CLOSE();
        parseSemiOrAsi(lexerFlags);
    }
  }

  function parseEmptyStatement(lexerFlags, astProp) {
    OPEN(astProp, 'EmptyStatement');
    ASSERT_skipRex(';', lexerFlags);
    CLOSE();
  }

  function parseWithStatement(lexerFlags, astProp) {
    OPEN(astProp, 'WithStatement');
    ASSERT_skipAny('with', lexerFlags); // TODO: optimize; next must be (
    parseStatementHeader(lexerFlags, 'object');
    parseBodyPart(lexerFlags, 'body');
    CLOSE();
  }

  function _parseAnyVarStatement(lexerFlags, kind, astProp) {
    _parseAnyVarDecls(lexerFlags, kind, astProp);
    parseSemiOrAsi(lexerFlags);
  }
  function _parseAnyVarDecls(lexerFlags, kind, astProp) {
    // var, let, const. apply additional checks for let/const.
    OPEN(astProp, 'VariableDeclaration');
    SET('kind', kind);
    SET('declarations', []);

    ASSERT_skipAny(kind, lexerFlags); // TODO: optimize; next must be ident or destructuring

    parseBindingPatterns(lexerFlags, 'declarations');

    CLOSE();
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
      ADD(astProp, null);
      ASSERT_skipRex(',', lexerFlags);
    }
  }
  function parseBindingPattern(lexerFlags, astProp) {
    // note: a "binding pattern" means a var/let/const var declaration with name or destructuring pattern
    OPEN(astProp, 'VariableDeclarator');

    if (curtype === $IDENT) {
      // normal
      // TODO: verify ident is valid here

      OPEN('id', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skipRex($IDENT, lexerFlags); // note: if this is the end of the var decl and there is no semi the next line can start with a regex
      CLOSE();
    } else if (curc === $$CURLY_L_7B) {
      // destructure object
      // keep parsing binding patterns separated by at least one comma
      OPEN('id', 'ObjectPattern');
      skipRexOrDieSingleChar($$CURLY_L_7B, lexerFlags); // (note: circumvent template body/tail) TODO: optimize; dont think this can ever start with a forward slash
      SET('properties', []);
      parseBindingPatternsNested(lexerFlags, 'properties');
      skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      CLOSE();
    } else if (curc === $$SQUARE_L_5B) {
      // destructure array
      // keep parsing binding patterns separated by at least one comma
      OPEN('id', 'ArrayPattern');
      skipRexOrDieSingleChar($$SQUARE_L_5B, lexerFlags); // TODO: optimize; dont think this can ever start with a forward slash
      SET('elements', []);
      parseBindingPatternsNested(lexerFlags, 'elements');
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      CLOSE();
    } else {
      ERROR
    }

    if (curc === $$IS_3D && curtok.str === '=') {
      ASSERT_skipRex($PUNCTUATOR, lexerFlags);
      parseExpression(lexerFlags, 'init');
    } else {
      SET('init', null);
    }
    CLOSE();
  }
  function parseBindingPatternsNested(lexerFlags, astProp) {
    do {
      parseElisions(lexerFlags, astProp);
      parseBindingPatternNested(lexerFlags, astProp);
      if (curc !== $$COMMA_2C) break;
      ASSERT_skipRex(',', lexerFlags); // TODO: can next be fwd slash?
    } while (true);
    parseElisions(lexerFlags, astProp);
  }
  function parseBindingPatternNested(lexerFlags, astProp) {
    if (curtype === $IDENT) {
      // normal
      // TODO: verify ident is valid here

      OPEN(astProp, 'Identifier');
      SET('name', curtok.str);
      ASSERT_skipRex($IDENT, lexerFlags); // note: if end of decl, next line can start with regex
      CLOSE();
    } else if (curc === $$CURLY_L_7B) {
      // destructure object
      // keep parsing binding patterns separated by at least one comma
      OPEN(astProp, 'ObjectPattern');
      skipRexOrDieSingleChar($$CURLY_L_7B, lexerFlags); // (note: circumvent template body/tail) TODO: optimize; dont think this can ever start with a forward slash
      SET('properties', []);
      parseBindingPatternsNested(lexerFlags, 'properties');
      skipAnyOrDieSingleChar($$CURLY_R_7D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      CLOSE();
    } else if (curc === $$SQUARE_L_5B) {
      // destructure array
      // keep parsing binding patterns separated by at least one comma
      OPEN(astProp, 'ArrayPattern');
      skipRexOrDieSingleChar($$SQUARE_L_5B, lexerFlags); // TODO: dont think next line can start with fwd slash
      SET('elements', []);
      parseBindingPatternsNested(lexerFlags, 'elements');
      skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // TODO: the end is followed by a punctuator but not a div
      CLOSE();
    } else if (curc !== $$SQUARE_R_5D && curc !== $$CURLY_R_7D) {
      console.log('error token:', curtok)
      ERROR
    }

    if (curc === $$IS_3D && curtok.str === '=') {
      WRAP_CLOSED(astProp, 'AssignmentPattern', 'left');
      ASSERT_skipRex($PUNCTUATOR, lexerFlags);
      parseExpression(lexerFlags, 'right');
      CLOSE();
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
    let assignable = parseValueTail(lexerFlags, false, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, false, astProp);
  }
  function parseExpressionAfterIdentifier(lexerFlags, identToken, astProp) {
    // identToken is a parsed, skipped, and validated value identifier (including the valueless `null`)
    let assignable = parseValueHeadBodyIdent(lexerFlags, identToken, astProp);
    assignable = parseValueTail(lexerFlags, assignable, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, false, astProp);
  }
  function parseExpressionFromOp(lexerFlags, assignable, lhsWasParenStart, astProp) {
    ASSERT(arguments.length === 4, 'arg count');

    if (assignable && isAssignBinOp()) {
      if (curc === $$IS_3D && curtok.str === '=') {
        let node = _path[_path.length - 1][astProp];
        if (Array.isArray(node)) node = node[node.length - 1];
        if (node.type === 'ArrayExpression' || node.type === 'ObjectExpression') {
          DECONSTRUCT(astProp, false);
        }
      }

      WRAP_CLOSED(astProp, 'AssignmentExpression', 'left');
      SET('operator', curtok.str);
      skipRex(lexerFlags);
      assignable = parseExpression(lexerFlags, 'right');
      CLOSE();
    } else {
      let initialAstProp = astProp;
      while (isNonAssignBinOp() || curc === $$QMARK_3F) {
        // to maintain operator precedent we need to take special care of the AST here if the
        // current op is stronger than the previous op _currently_ at the top of the path
        let prev = _path[_path.length-1][astProp];
        let swapped = false;
        if (prev && !lhsWasParenStart && (prev.type === 'BinaryExpression' || prev.type === 'LogicalExpression')) {
          let sl = getStrenght(curtok.str);
          let sr = getStrenght(prev.operator);
          swapped =  sl > sr || (sl === sr && curtok.str === '**'); // `**` is the right-associative exception here
          if (swapped) {
            _path.push(prev);
            astProp = 'right';
          }
        }

        if (curc === $$QMARK_3F) {
          WRAP_CLOSED(astProp, 'ConditionalExpression', 'test');
          ASSERT_skipRex('?', lexerFlags);
          parseExpression(lexerFlags, 'consequent');
          skipRexOrDieSingleChar($$COLON_3A, lexerFlags);
          parseExpression(lexerFlags, 'alternate');
          CLOSE();
        } else {
          WRAP_CLOSED(astProp, (curtok.str === '&&' || curtok.str === '||') ? 'LogicalExpression' : 'BinaryExpression', 'left');
          SET('operator', curtok.str);
          skipRex(lexerFlags);
          lhsWasParenStart = curc === $$PAREN_L_28; // heuristic for determining groups
          parseValue(lexerFlags, 'right');
          CLOSE();
        }

        if (swapped) { // restore swap
          _path.pop(prev);
          astProp = initialAstProp;
        }
        lhsWasParenStart = curc === $$PAREN_L_28; // heuristic for determining groups
      }
    }

    return assignable;
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

  function getStrenght(str) {
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
      default: ERROR; // other ops should not be handled by this function
    }
  }

  function parseValue(lexerFlags, astProp) {
    let assignable = parseValueHeadBody(lexerFlags, astProp);
    return parseValueTail(lexerFlags, assignable, astProp);
  }
  function parseValueFromIdent(lexerFlags, identToken, astProp) {
    let assignable = parseValueHeadBodyIdent(lexerFlags, identToken, astProp);
    return parseValueTail(lexerFlags, assignable, astProp);
  }
  function parseValueHeadBody(lexerFlags, astProp) {
    // - ident (a var, true, false, null, super, new <value>, new.target, this, class, function, async func, generator func)
    // - literal (number, string, regex, object, array, template)
    // - arrow or group

    // do not include the suffix (property, call, etc)

    // return a boolean whether the value is assignable (only for regular var names)

    if (curtype === $IDENT) {
      let identToken = curtok;
      ASSERT_skipDiv($IDENT, lexerFlags);
      return parseValueHeadBodyIdent(lexerFlags, identToken, astProp);
    } else if (curtype & ($NUMBER|$STRING|$REGEX)) {
      OPEN(astProp, 'Literal');
      SET('value', '<TODO>');
      SET('raw', curtok.str);
      skipDiv(lexerFlags);
      CLOSE();
      return false;
    } else if (curtype & $TICK) {
      parseTickExpression(lexerFlags, astProp);
      return false;
    } else if (curtype === $PUNCTUATOR) {
      if (curc === $$CURLY_L_7B) {
        return parseObjectLitOrDestruc(lexerFlags, false, astProp);
      } else if (curc === $$SQUARE_L_5B) {
        return parseArrayLitOrDestruc(lexerFlags, false, astProp);
      } else if (curc === $$PAREN_L_28) {
        return parseGroupOrArrow(lexerFlags, astProp);
      } else if (curtok.str === '++' || curtok.str === '--') {
        OPEN(astProp, 'UpdateExpression');
        SET('operator', curtok.str);
        ASSERT_skipAny($PUNCTUATOR, lexerFlags); // TODO: optimize; next token can not start with a fwd slash
        SET('prefix', true);
        parseValueHeadBody(lexerFlags, 'argument');
        CLOSE();
        return false;
      } else if (curtok.str === '+' || curtok.str === '-' || curtok.str === '!' || curtok.str === '~') {
        OPEN(astProp, 'UnaryExpression');
        SET('operator', curtok.str);
        ASSERT_skipRex($PUNCTUATOR, lexerFlags);
        SET('prefix', true);
        parseValueHeadBody(lexerFlags, 'argument');
        CLOSE();
        return false;
      } else if (curc === $$DOT_2E && curtok.str === '...') {
        OPEN(astProp, 'SpreadElement');
        ASSERT_skipAny($PUNCTUATOR, lexerFlags); // TODO: optimize; next token can not start with a fwd slash
        parseValue(lexerFlags, 'argument');
        CLOSE();
        return false;
      } else {
        console.log(curtok)
        ERROR
      }
    } else {
      ERROR
    }

    TODO

  }
  function parseValueHeadBodyIdent(lexerFlags, identToken, astProp) {
    // note: ident token has been skipped prior to this call. curtok is the one after identToken.
    let identName = identToken.str;
    switch (identName) {
      case 'true':
        OPEN(astProp, 'Literal');
        SET('value', true);
        SET('raw', 'true');
        CLOSE();
        return false;
      case 'false':
        OPEN(astProp, 'Literal');
        SET('value', false);
        SET('raw', 'false');
        CLOSE();
        return false;
      case 'null':
        OPEN(astProp, 'Literal');
        SET('value', null);
        SET('raw', 'null');
        CLOSE();
        return false;
      case 'super':
        OPEN(astProp, 'Super');
        CLOSE();
        return false;
      case 'new':
        OPEN(astProp, 'NewExpression');
        SET('arguments', []);
        parseValue(lexerFlags, 'callee');
        CLOSE();
        return false;
      case 'this':
        OPEN(astProp, 'ThisExpression');
        CLOSE();
        return false;
      case 'class':
        parseClass(lexerFlags, true, astProp);
        return false;
      case 'function':
        parseFunctionExpression(lexerFlags, false, astProp);
        return false;
      case 'async':
        // either function call (so `async();`), async function expression, or async arrow
        if (curc === $$PAREN_L_28) {
          TODO
        } else if (curtok.str === 'function') {
          ASSERT_skipAny('function', lexerFlags); // TODO: optimize; next must be * or ( or IDENT
          parseFunctionExpression(lexerFlags, true, astProp);
        } else {
          // TODO: reject in cases where async is considered a keyword
          OPEN(astProp, 'Identifier');
          SET('name', 'async');
          CLOSE();
        }
        return false;
      case 'delete':
      case 'typeof':
      case 'void':
        OPEN(astProp, 'UnaryExpression');
        SET('operator', identName);
        SET('prefix', true);
        parseValue(lexerFlags, 'argument');
        CLOSE();
        return false;
      case 'yield':
        TODO
        OPEN(astProp, 'YieldExpression');
        SET('delegate', false); // TODO ??
        parseValue(lexerFlags, 'argument');
        CLOSE();
        return false;
      default:

        if (curc === $$IS_3D && curtok.str === '=>') {
          // arrow with single param

          OPEN(astProp, 'ArrowFunctionExpression');
          SET('params', []);
          OPEN('params', 'Identifier');
          SET('name', identToken.str);
          CLOSE();
          ASSERT_skipRex('=>', lexerFlags);
          SET('id', null);
          SET('generator', false);
          SET('expression', true);
          parseExpression(lexerFlags, 'body');
          CLOSE();
        } else {
          // TODO: verify identifier (note: can be value keywords)
          OPEN(astProp, 'Identifier');
          SET('name', identName);
          CLOSE();
        }

        return true;
    }
  }

  function parseTickExpression(lexerFlags, astProp) {
    // basically; parse tick. if head, keep parsing body until parsing tail

    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');
    ASSERT((lexerFlags & IN_TEMPLATE) === 0 || (curtype & $TICK_HEAD), 'if in template this function can only be called by the head of a nested template');

    OPEN(astProp, 'TemplateLiteral');
    SET('expressions', []);
    SET('quasis', []);

    if (curtype === $TICK_PURE) {
      parseQuasiPart(lexerFlags, true, astProp);
    } else if (curtype === $TICK_HEAD) {
      parseQuasiPart(lexerFlags | IN_TEMPLATE, false, astProp);

      // keep parsing expression+tick until tick-tail
      do {
        parseExpression(lexerFlags | IN_TEMPLATE, 'expressions');

        OPEN('quasis', 'TemplateElement');
        SET('tail', curtype === $TICK_TAIL);
        SET('value', {raw: curtok.str, cooked: '<TODO>'});
        CLOSE();
        if (curtype === $TICK_BODY) {
          ASSERT_skipRex(curtok.str, lexerFlags | IN_TEMPLATE); // first token in template expression can be regex
        } else  if (curtype === $TICK_TAIL) {
          ASSERT_skipDiv(curtok.str, lexerFlags); // first token after template expression can be div
          break;
        } else {
          ERROR
        }
      } while (true);
    } else {
      ERROR
    }

    CLOSE(); // TemplateLiteral

    // assume we just parsed and skipped a literal (string/number/regex)
    let assignable = parseValueTail(lexerFlags, true, astProp);
    return parseExpressionFromOp(lexerFlags, assignable, false, astProp);
  }

  function parseQuasiPart(lexerFlags, tail, astProp) {
    OPEN('quasis', 'TemplateElement');
    SET('tail', tail);
    SET('value', {raw: curtok.str, cooked: '<TODO>'});
    if (curtype === $TICK_PURE) {
      ASSERT_skipDiv(curtok.str, lexerFlags);
    } else {
      ASSERT(curtype === $TICK_HEAD, 'not used for other ticks');
      ASSERT_skipRex(curtok.str, lexerFlags); // note: dont set IN_TEMPLATE here because a pure template wont want it
    }
    CLOSE();
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
    // {get a(){}}
    // {get [a](){}}
    // {set a(x){}}
    // {set [a](x){}}
    // {a(){}}
    // {[a](){}}
    // {async a(){}}
    // {async [a](){}}
    // {*a(){}}
    // {*[a](){}}

    // only syntactical restriction for destructuring is; no methods
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
    //}=arr);

    OPEN(astProp, 'ObjectExpression');
    SET('properties', []);
    let lexerFlagsNoTemplate = sansFlag(lexerFlags, IN_TEMPLATE);
    ASSERT_skipAny('{', lexerFlagsNoTemplate); // TODO: optimize; next token cannot start with fwd slash
    do {
      parseObjLitProperty(lexerFlagsNoTemplate, 'properties'); // also consumes comma
      if (curc === $$COMMA_2C) ASSERT_skipRex(',', lexerFlagsNoTemplate); // TODO: optimize; next token cannot start with fwd slash
      else break;
    } while(curc !== $$CURLY_R_7D && curtype !== $EOF);
    skipRexOrDieSingleChar($$CURLY_R_7D, lexerFlags);
    CLOSE();

    return true; // TODO: properly reflect whether this array can be a destructuring pattern
  }
  function parseObjLitProperty(lexerFlags, astProp) {
    // shorthand, classic, classic with assign, dynamic, dynamic with assign,
    // quoted, quoted with assign, getter, setter, method, async, generator

    if (curtype === $IDENT) {
      // property name, shorthand, getter, setter, method, async
      // note that `async`, `get`, and `set` are valid prop names as well as method modifiers (=> prefixes)
      let identToken = curtok;

      if (identToken.str === 'get') {
        ASSERT_skipAny('get', lexerFlags); // TODO: optimize; next token must be ident, (, or :
        if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
          parseObjLitGetter(lexerFlags, astProp);
          return;
        }
      } else if (identToken.str === 'set') {
        ASSERT_skipAny('set', lexerFlags); // TODO: optimize; next token must be ident, (, or :
        if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
          parseObjLitSetter(lexerFlags, astProp);
          return;
        }
      } else if (identToken.str === 'async') {
        ASSERT_skipAny('async', lexerFlags); // TODO: optimize; next token must be ident, (, or :
        if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
          parseObjLitAsync(lexerFlags, astProp);
          return;
        }
      } else {
        ASSERT_skipAny($IDENT, lexerFlags); // TODO: optimize; next token must be (, or :
      }
      // this call includes cases where the property name is get, set, or async.
      parseObjLitPropertyFromIdentKey(lexerFlags, identToken, astProp);
    } else if (curc === $$STAR_2A) {
      // generator
      ASSERT_skipAny('*', lexerFlags); // TODO: optimize; next token must be ident
      parseObjLitGenerator(lexerFlags, astProp);
    } else if (curtype & $STRING) {
      parseObjLitQuotedProperty(lexerFlags, astProp);
    } else if (curc === $$SQUARE_L_5B) {
      parseObjLitComputedProperty(lexerFlags, astProp);
    } else if (curc !== $$CURLY_R_7D) {
      ERROR
    }
  }
  function parseObjLitIdentOrComputedKey(lexerFlags) {
    if (curtype === $IDENT) {
      parseObjLitIdentKey(lexerFlags);
    } else if (curc === $$SQUARE_L_5B) {
      parseObjLitComputedKey(lexerFlags);
    } else {
      ERROR
    }
  }
  function parseObjLitIdentKey(lexerFlags) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    // get, set, and async are valid key names here but not considered special
    SET('computed', false);
    OPEN('key', 'Identifier');
    SET('name', curtok.str);
    ASSERT_skipAny($IDENT, lexerFlags); // TODO: optimize; next token must be :
    CLOSE();
  }
  function parseObjLitKeyFromIdent(lexerFlags, identToken, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    // get, set, and async are valid key names here but not considered special
    OPEN(astProp, 'Identifier');
    SET('name', identToken.str);
    CLOSE();
  }
  function parseObjLitComputedKey(lexerFlags) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    // computed property name
    SET('computed', true);
    ASSERT_skipRex('[', lexerFlags);
    parseExpression(lexerFlags, 'key');
    skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // TODO: optimize; next token must be (, or :
  }
  function parseObjLitGetter(lexerFlags, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    OPEN(astProp, 'Property');
    SET('kind', 'get');
    SET('method', false);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey(lexerFlags);
    parseFunctionFromIdent(lexerFlags, false, false, false, false, false, 'value');
    CLOSE();
  }
  function parseObjLitSetter(lexerFlags, astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'set');
    SET('method', false);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey(lexerFlags);
    parseFunctionFromIdent(lexerFlags, false, false, false, false, false, 'value');
    CLOSE();
  }
  function parseObjLitAsync(lexerFlags, astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init'); // only getters/setters get special value here
    SET('method', true);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey(lexerFlags);
    parseFunctionFromIdent(lexerFlags, false, false, false, true, false, 'value');
    CLOSE();
  }
  function parseObjLitGenerator(lexerFlags, astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init'); // only getters/setters get special value here
    SET('method', true);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey(lexerFlags);
    parseFunctionFromIdent(lexerFlags, false, false, true, false, false, 'value');
    CLOSE();
  }
  function parseObjLitPropertyFromIdentKey(lexerFlags, identToken, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    if (curc === $$PAREN_L_28) {
      parseObjLitRegularMethod(lexerFlags, identToken, astProp);
    } else {
      parseObjLitIdentPair(lexerFlags, identToken, astProp);
    }
  }
  function parseObjLitRegularMethod(lexerFlags, identToken, astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init'); // only getters/setters get special value here
    SET('method', true);
    SET('shorthand', false); // yes but always no.
    SET('computed', false);
    parseObjLitKeyFromIdent(lexerFlags, identToken, 'key');
    parseFunctionFromIdent(lexerFlags, false, false, false, false, false, 'value');
    CLOSE();
  }
  function parseObjLitIdentPair(lexerFlags, identToken, astProp) {
    ASSERT(typeof lexerFlags === 'number', 'lexerFlags number');

    OPEN(astProp, 'Property');
    SET('kind', 'init'); // methods are "init" too
    SET('method', false);
    SET('shorthand', curc !== $$COLON_3A);
    SET('computed', false);

    parseObjLitKeyFromIdent(lexerFlags, identToken, 'key');
    if (curc === $$COLON_3A) {
      ASSERT_skipRex(':', lexerFlags);
      parseExpression(lexerFlags, 'value');
    } else {
      // shorthand uses key as value as well
      parseObjLitKeyFromIdent(lexerFlags, identToken, 'value');

      // if there is an assignment here this "object" is _only_ valid when destructuring
      if (curc === $$IS_3D && curtok.str === '=') {
        ASSERT_skipRex('=', lexerFlags);
        WRAP_CLOSED('value', 'AssignmentExpression', 'left');
        SET('operator', '=');
        parseExpression(lexerFlags, 'right');
        CLOSE();
      }
    }

    CLOSE();
  }
  function parseObjLitQuotedProperty(lexerFlags, astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init');
    SET('method', false);
    SET('shorthand', false);
    SET('computed', false);
    OPEN('key', 'Literal');
    SET('value', '<TODO>');
    SET('raw', curtok.str);
    ASSERT(curtype & $STRING);
    skipAny(lexerFlags); // TODO: optimize; next token must be :
    CLOSE();
    skipRexOrDieSingleChar($$COLON_3A, lexerFlags);
    parseExpression(lexerFlags, 'value');
    CLOSE();
  }
  function parseObjLitComputedProperty(lexerFlags, astProp) {
    ASSERT_skipRex('[', lexerFlags);
    parseExpression(lexerFlags, astProp);
    skipAnyOrDieSingleChar($$SQUARE_R_5D, lexerFlags); // TODO: optimize; next token must be (, or :

    // note: the wraps will cause the `key` property to "appear" earlier than in other parses. annoying but can only be helped by more code complexity. which is not worth it.
    // one path we could decide on is to put `key` first in all cases. maybe.
    if (curc === $$PAREN_L_28) {
      WRAP_CLOSED(astProp, 'Property', 'key');
      SET('kind', 'init'); // only getters/setters get special value here
      SET('method', true);
      SET('shorthand', false); // yes but always no.
      SET('computed', true);
      parseFunctionFromIdent(lexerFlags, false, false, false, false, false, 'value');
      CLOSE();
    } else {
      WRAP_CLOSED(astProp, 'Property', 'key');
      SET('kind', 'init');
      SET('method', false);
      SET('shorthand', false);
      SET('computed', true);
      skipRexOrDieSingleChar($$COLON_3A, lexerFlags);
      parseExpression(lexerFlags, 'value');
      CLOSE();
    }
  }

  function parseArrayLitOrDestruc(lexerFlags, fromParam, astProp) {
    // [a]       -> array literal
    // [a] = b   -> array destructuring

    OPEN(astProp, 'ArrayExpression');
    ASSERT_skipRex('[', lexerFlags); // note: should be verified by caller
    SET('elements', []);
    if (curc === $$SQUARE_R_5D) {
      ASSERT_skipDiv(']', lexerFlags); // note: `[]\n/x` is a division and `[]\n/x/` is illegal
    } else {
      while (true) {
        parseElisions(lexerFlags, 'elements');
        if (fromParam) {
          // prevent parsing further assignments
          let wasParen = curc === $$PAREN_L_28;
          parseValue(lexerFlags, 'elements');
          parseExpressionFromOp(lexerFlags, false, wasParen, 'elements');
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
    CLOSE();

    return true; // TODO: properly validate whether this is a valid destructuring pattern
  }

  function parseValueTail(lexerFlags, assignable, astProp) {
    if (curc === $$DOT_2E && curtok.str === '.') {
      ASSERT_skipAny('.', lexerFlags); // TODO: optimize; next must be identifier
      if (curtype !== $IDENT) ERROR;
      WRAP_CLOSED(astProp, 'MemberExpression', 'object');
      OPEN('property', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skipDiv($IDENT, lexerFlags); // x.y / z is division
      CLOSE();
      SET('computed', false);
      CLOSE();
      assignable = parseValueTail(lexerFlags, true, astProp);
    } else if (curc === $$SQUARE_L_5B) {
      WRAP_CLOSED(astProp, 'MemberExpression', 'object');
      ASSERT_skipRex('[', lexerFlags);
      parseExpression(lexerFlags, 'property');
      skipDivOrDieSingleChar($$SQUARE_R_5D, lexerFlags);
      SET('computed', true);
      CLOSE();
      assignable = parseValueTail(lexerFlags, true, astProp);
    } else if (curc === $$PAREN_L_28) {
      ASSERT(curtype === $PUNCTUATOR && curtok.str === '(');
      ASSERT_skipRex('(', lexerFlags);
      if (astProp === 'callee') { // exception for `new`
        parseCallArgs(lexerFlags, 'arguments');
      } else {
        WRAP_CLOSED(astProp, 'CallExpression', 'callee');
        SET('arguments', []);
        parseCallArgs(lexerFlags, 'arguments');
        CLOSE();
      }
      assignable = parseValueTail(lexerFlags, false, astProp);
    } else if (curc === $$TICK_60) { TODO
      // tagged template is like a call but slightly special
      ASSERT((curtype & $TICK) === $TICK);
      WRAP_CLOSED(astProp, 'MemberExpression', 'object');
      OPEN('property', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skipDiv($TICK, lexerFlags);
      CLOSE();
      assignable = parseValueTail(lexerFlags, false, astProp);
    } else if ((curc === $$PLUS_2B && curtok.str === '++') || (curc === $$DASH_2D && curtok.str === '--')) {
      ASSERT(curtype === $PUNCTUATOR);
      WRAP_CLOSED(astProp, 'UpdateExpression', 'argument');
      SET('operator', curtok.str);
      SET('prefix', false);
      ASSERT_skipDiv(curtok.str, lexerFlags);
      CLOSE();
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

  function parseGroupOrArrow(lexerFlags, astProp) {
    // this function parses an arrow function or a grouped expression
    // in many cases we won't know what we're actually parsing until
    // we encounter the first token after the closing parenthesis
    // (`=>` leads to function, `=` leads to obscure assignment, other leads to group)

    ASSERT_skipRex('(', lexerFlags);

    if (curc === $$PAREN_R_29) {
      // the _only_ place where `()` is valid is an arrow header, so;

      ASSERT_skipAny(')', lexerFlags); // TODO: optimize; must be =>
      if (curtok.str !== '=>') ERROR;

      OPEN(astProp, 'ArrowFunctionExpression');
      SET('params', []);
      parseArrowFromPunc(lexerFlags);
      CLOSE();
      return false;
    }

    // note: only a group-wrapped solo identifier or a value that results in a property
    // can be assignable (and more restrictions may apply for eval/arguments)
    let assignable = parseExpression(lexerFlags, astProp);

    if (curc === $$COMMA_2C) {
      WRAP_CLOSED_ARRAY(astProp, 'SequenceExpression', 'expressions');
      ASSERT_skipRex(',', lexerFlags);
      assignable = false; // in all cases
      do {
        parseExpression(lexerFlags, 'expressions');
        if (curc !== $$COMMA_2C) break;
        ASSERT_skipRex(',', lexerFlags);
      } while (true);
      CLOSE();
    }

    skipDivOrDieSingleChar($$PAREN_R_29, lexerFlags);

    if (curc === $$IS_3D && curtok.str === '=>') { // note: the single ident param version is parsed elsewhere
      // arrow function. if that's possible.
      WRAP_CLOSED(astProp, 'ArrowFunctionExpression', 'params');

      let node = _path[_path.length-1];
      if (node.params.type === 'SequenceExpression') node.params = node.params.expressions;
      else if (!Array.isArray(node.params)) node.params = [node.params];

      parseArrowFromPunc(lexerFlags);

      CLOSE();
    }

    return assignable;
  }
  function parseArrowFromPunc(lexerFlags) {
    ASSERT_skipRex('=>', lexerFlags);
    SET('id', null);
    SET('generator', false);
    if (curc === $$CURLY_L_7B) {
      SET('expression', false);
      parseBlockStatement(lexerFlags, 'body');
    } else {
      SET('expression', true);
      parseExpression(lexerFlags, 'body');
    }
  }

  function logPath() {
    console.log('Path: ' + _path.map(o=>o.type).join(' '))
  }
  function logTree() {
    console.log('Tree: ' + require('util').inspect(_tree, false, null))
  }

  init();
  parseTopLevels(sansFlag(INITIAL_LEXER_FLAGS, FOR_REGEX));

  //tok.deopt();

  return {
    ast: _tree,
    tokens: tok.tokens,
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
