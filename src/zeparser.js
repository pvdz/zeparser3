
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
  SLOPPY_MODE,

  DIV,
  REX,

  debug_toktype,
} = require('../src/zetokenizer'); // nodejs doesnt support import and wont for a while, it seems (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
//} from '../src/zetokenizer';

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
      ASSERT(false, 'bad tree? node[prop] should be undefined but wasnt', 'child=', node, 'prop=', prop, 'type=', type, 'node[prop]=', node[prop]);
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
  function DECONSTRUCT(prop) {
    ASSERT(arguments.length === 1, 'one arg now');
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
    ASSERT(node.type === 'ArrayExpression' || node.type === 'ObjectExpression', 'should start at an object or array literal');

    _DESTRUCT(node);
    if (traceast) {
      console.log('- tree after destruct:', require('util').inspect(_tree, false, null))
    }
  }
  function _DESTRUCT(node) {
    if (traceast) {
      console.log('_DESTRUCT', node);
    }

    if (node.type === 'ArrayExpression') {
      node.type = 'ArrayPattern';
      for (let i = 0, n = node.elements.length; i < n; ++i) {
        _DESTRUCT(node.elements[i]);
      }
    } else if (node.type === 'ObjectExpression') {
      node.type = 'ObjectPattern';
      for (let i = 0, n = node.properties.length; i < n; ++i) {
        let property = node.properties[i];
        _DESTRUCT(property.value);
      }
    } else if (node.type === 'AssignmentExpression') {
      // walk the left of the assignment only
      _DESTRUCT(node.left);
    }
  }

  function init() {
    do {
      skip();
    } while (curtype === $ERROR);
  }

  function skip() {
    curtok = tok(REX, SLOPPY_MODE, false, false);
    curtype = curtok.type;
    curc = curtok.c;
    ASSERT(typeof curc === 'number' && curc >= 0 && curc <= 0x10ffff, 'valid c', JSON.stringify(curtok));
  }

  function ASSERT_skip(what, str) {
    if (typeof what === 'string') ASSERT(curtok.str === what, 'expecting to skip token with certain value', 'expect:', what, 'actual:', curtok.str);
    else ASSERT(curtype === what, 'expecting to skip token with certain type', 'expect:', debug_toktype(what), 'actual:', debug_toktype(curtype));
    ASSERT(str === undefined || curtok.str === str, 'expecting str to match fully');
    skip();
  }

  function skipOrDie(chr, str) {
    if (curc !== chr || str !== curtok.str) ERROR;
    else skip();
  }
  function skipOrDieSingleChar(chr) {
    if (curc !== chr) ERROR;
    else {
      ASSERT(curtok.str.length === 1, 'should be len=1');
      skip();
    }
  }

  function skipIf(what) {
    if (typeof what === 'string') {
      if (curtok.str === what) {
        skip();
        return true;
      }
      return false;
    }
    ASSERT(typeof what === 'number');
    if (curtype === what) {
      skip();
      return true;
    }
    return false;
  }

  function parseTopLevels() {
    parseBodyParts();
  }

  function parseBodyParts() {
    SET('body', []);
    _parseBodyParts('body');
  }

  function _parseBodyParts(astProp) {
    while (curtype !== $EOF && curc !== $$CURLY_R_7D) parseBodyPart(astProp);
  }

  function parseStatementHeader(headProp) {
    skipOrDieSingleChar($$PAREN_L_28);
    parseExpression(headProp);
    skipOrDieSingleChar($$PAREN_R_29);
  }

  function parseSemiOrAsi() {
    if (curc === $$SEMI_3B) {
      ASSERT_skip($PUNCTUATOR, ';');
    } else if (curc === $$CURLY_R_7D || curtok.nl || curtype === $EOF) {
      tok.asi();
    } else {
      console.log('parse error at curc', curc, String.fromCharCode(curc), curtok.str);
      ERROR();
    }
  }

  function parseBodyPart(astProp) {
    ASSERT(!(curtype & ($ERROR | $EOF)), 'should not have error or eof at this point');
    switch (getGenericTokenType(curtype)) { // TODO: convert to flag index to have perfect hash in the switch
      case $IDENT:
        parseIdentStatement(astProp);
        break;
      case $PUNCTUATOR:
        parsePunctuatorStatement(astProp);
        break;
      case $NUMBER:
        parseNumberStatement(astProp);
        break;
      case $STRING:
        parseStringStatement(astProp);
        break;
      case $TICK:
        parseTickStatement(astProp);
        break;
      case $REGEX:
        parseRegexStatement(astProp);
        break;
      default:
        THROW('unexpected token', curtok);
    }
  }

  // ### functions

  function parseAsyncFunction(astProp) {
    ASSERT_skip('async');
    return parseFunction(true, true, astProp);
  }
  function parseFunction(funcDecl, isAsync, astProp) {
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
    ASSERT_skip('function');
    let isGenerator = false;
    if (!isAsync && skipIf('*')) {
      isGenerator = true;
    }
    _parseFunction(funcDecl, isGenerator, isAsync, astProp);
  }
  function _parseFunction(funcDecl, isGenerator, isAsync, astProp) {
    OPEN(astProp, funcDecl ? 'FunctionDeclaration' : 'FunctionExpression')

    SET('generator', isGenerator);
    SET('async', isAsync);
    SET('expression', false);

    if (curtype === $IDENT) {
      // TODO: verify identifier
      OPEN('id', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skip($IDENT);
      CLOSE();
    } else if (funcDecl) {
      ERROR;
    } else {
      SET('id', null);
    }

    parseFunctionFromParams(funcDecl, isAsync, isGenerator, astProp);
    CLOSE();
  }
  function parseFunctionFromParams(funcDecl, isAsync, isGenerator, astProp) {
    SET('params', []);
    skipOrDieSingleChar($$PAREN_L_28);
    if (curc !== $$PAREN_R_29) {
      while (true) {
        parseFuncArgument('params');
        if (curc !== $$COMMA_2C) break;
        ASSERT_skip(',');
      }

      skipOrDieSingleChar($$PAREN_R_29);
    } else {
      ASSERT_skip(')');
    }
    parseBlockStatement('body');
  }
  function parseFuncArgument(astProp) {
    if (curtype === $IDENT) {
      OPEN(astProp, 'Identifier');
      SET('name', curtok.str);
      ASSERT_skip($IDENT);
      CLOSE();
    } else { // destructuring
      TODO
    }

    // default value
    if (skipIf('=')) {
      TODO
      parseExpression();
    }
  }

  // ### statements

  function parseIdentStatement(astProp) {
    // all statement starting keywords;

    // break, class, const, continue, debugger, do, export, for, function, if, import, let, loop, return, switch, throw, try, var, while, with, yield,

    switch (curtok.str) {
      case 'async':
        parseAsyncFunction(astProp);
        break;

      case 'break':
        parseBreakStatement(astProp);
        break;

      case 'class':
        parseClassDeclaration(astProp);
        break;

      case 'const':
        parseConstStatement(astProp);
        break;

      case 'continue':
        parseContinueStatement(astProp);
        break;

      case 'debugger':
        parseDebuggerStatement(astProp);
        break;

      case 'do':
        parseDoStatement(astProp);
        break;

      case 'export':
        parseExportStatement(astProp);
        break;

      case 'for':
        parseForStatement(astProp);
        break;

      case 'function':
        parseFunction(true, false, astProp);
        break;

      case 'if':
        parseIfStatement(astProp);
        break;

      case 'import':
        parseImportDeclaration(astProp);
        break;

      case 'let':
        parseLetStatement(astProp);
        break;

      case 'return':
        parseReturnStatement(astProp);
        break;

      case 'switch':
        parseSwitchStatement(astProp);
        break;

      case 'throw':
        parseThrowStatement(astProp);
        break;

      case 'try':
        parseTryStatement(astProp);
        break;

      case 'var':
        parseVarStatement(astProp);
        break;

      case 'while':
        parseWhileStatement(astProp);
        break;

      case 'with':
        parseWithStatement(astProp);
        break;

      case 'yield':
        parseYieldStatement(astProp);
        break;

      default:
        parseIdentLabelOrExpressionStatement(astProp);

    }
  }

  function parseBlockStatement(astProp) {
    OPEN(astProp, 'BlockStatement');
    SET('body', []);
    ASSERT_skip('{');
    _parseBodyParts('body');
    skipOrDieSingleChar($$CURLY_R_7D);
    CLOSE();
  }

  function parseBreakStatement(astProp) {
    OPEN(astProp, 'BreakStatement');
    // break is only valid inside a breakable, fenced by functions
    ASSERT_skip('break');
    // a break may be followed by another identifier which must then be a valid label.
    // otherwise it's just a break to the nearest breakable (most likely).

    if (curtype === $IDENT && !curtok.nl) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)
      OPEN('label', 'Identifier');
      SET('name', curtok.str);
      CLOSE();

      ASSERT_skip($IDENT);
    } else {
      SET('label', null);
    }

    parseSemiOrAsi();
    CLOSE();
  }

  function parseConstStatement(astProp) {
    _parseAnyVarStatement('const', astProp);
  }

  function parseContinueStatement(astProp) {
    OPEN(astProp, 'ContinueStatement');
    // continue is only valid inside a loop, fenced by functions
    ASSERT_skip('continue');
    // a continue may be followed by another identifier which must then be a valid label.
    // otherwise it's just a continue to the nearest loop (most likely).

    if (curtype === $IDENT && !curtok.nl) {
      // TODO: validate ident; must be declared label (we can skip reserved name checks assuming that happens at the label declaration)
      OPEN('label', 'Identifier');
      SET('name', curtok.str);
      CLOSE();

      ASSERT_skip($IDENT);
    } else {
      SET('label', null);
    }

    parseSemiOrAsi();
    CLOSE();
  }

  function parseDebuggerStatement(astProp) {
    OPEN(astProp, 'DebuggerStatement');
    CLOSE();
    ASSERT_skip('debugger');
    parseSemiOrAsi();
  }

  function parseDoStatement(astProp) {
    OPEN(astProp, 'DoWhileStatement');
    ASSERT_skip('do');
    parseBodyPart('body');
    skipOrDie($$W_77, 'while');
    parseStatementHeader('test');
    parseSemiOrAsi();
    CLOSE();
  }

  function parseForStatement(astProp) {
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

    ASSERT_skip('for');
    skipOrDieSingleChar($$PAREN_L_28);
    parseForHeader(astProp);
    skipOrDieSingleChar($$PAREN_R_29);
    parseBodyPart('body');
    CLOSE();
  }
  function parseForHeader(astProp) {
    // first parse a simple expression and check whether it's assignable (var or prop)
    let assignable = false;
    let wasNotDecl = false;
    let emptyInit = false;
    if (curtype === $IDENT) {
      switch (curtok.str) {
        case 'var':
        case 'let':
        case 'const':
          _parseAnyVarDecls(curtok.str, astProp);
          assignable = true; // i think.
          break;

        default:
          let identToken = curtok;
          ASSERT_skip($IDENT);
          assignable = parseValueFromIdent(identToken, astProp);
          wasNotDecl = true;
      }
    } else if (curc === $$SEMI_3B) {
      emptyInit = true;
    } else {
      assignable = parseValue(astProp);
    }

    // in all cases either; parse a var, let, const, or assignment expression
    // there can be multiple vars and inits
    // for-in and for-of can only have one var without inits (invalidate after)

    if (curtype === $IDENT) {
      if (curtok.str === 'in') {
        WRAP_CLOSED(astProp, 'ForInStatement', 'left');
        if (!assignable) ERROR;
        ASSERT_skip('in');
        parseExpression('right');
        return;
      }
      if (curtok.str === 'of') {
        WRAP_CLOSED(astProp, 'ForOfStatement', 'left');
        if (!assignable) ERROR;
        ASSERT_skip('of');
        parseExpression('right');
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
      if (wasNotDecl) _parseExpression(assignable, 'init');
    }
    skipOrDieSingleChar($$SEMI_3B);
    if (curc === $$SEMI_3B) {
      SET('test', null);
    } else {
      parseExpression('test');
    }
    skipOrDieSingleChar($$SEMI_3B);
    if (curc === $$PAREN_R_29) {
      SET('update', null);
    } else {
      parseExpression('update');
    }
  }

  function parseIfStatement(astProp) {
    OPEN(astProp, 'IfStatement');
    ASSERT_skip('if');
    parseStatementHeader('test');
    parseBodyPart('consequent');
    if (curtype === $IDENT && curtok.str === 'else') {
      ASSERT_skip('else');
      parseBodyPart('alternate');
    } else {
      SET('alternate', null);
    }
    CLOSE();
  }

  function parseLetStatement(astProp) {
    _parseAnyVarStatement('let', astProp);
  }

  function parseReturnStatement(astProp) {
    OPEN(astProp, 'ReturnStatement');
    ASSERT_skip('return');

    if (!curtok.nl && curtype !== $EOF && curc !== $$SEMI_3B) {
      parseExpression('argument');
    } else {
      SET('argument', null);
    }

    parseSemiOrAsi();

    CLOSE();
  }

  function parseSwitchStatement(astProp) {
    OPEN(astProp, 'SwitchStatement');
    ASSERT_skip('switch');
    parseStatementHeader('discriminant');
    skipOrDieSingleChar($$CURLY_L_7B);
    SET('cases', []);
    let hadDefault = false;
    while (true) {
      if (curtok.str === 'case') {
        OPEN('cases', 'SwitchCase');
        ASSERT_skip('case');
        parseExpression('test');
        SET('consequent', []);
        if (curc !== $$COLON_3A) ERROR;
        ASSERT_skip(':');
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) parseBodyPart('consequent');

        CLOSE();
      } else if (curtok.str === 'default') {
        if (hadDefault) ERROR;
        OPEN('cases', 'SwitchCase');
        ASSERT_skip('default');
        if (curc !== $$COLON_3A) ERROR;
        ASSERT_skip(':');
        SET('test', null);
        SET('consequent', []);
        while (curtype !== $EOF && curc !== $$CURLY_R_7D && (curtype !== $IDENT || (curtok.str !== 'case' && curtok.str !== 'default'))) parseBodyPart('consequent');
        CLOSE();
      } else {
        break;
      }
    }
    skipOrDieSingleChar($$CURLY_R_7D);
    CLOSE();
  }

  function parseThrowStatement(astProp) {
    OPEN(astProp, 'ThrowStatement');
    ASSERT_skip('throw');
    parseExpression('argument');
    parseSemiOrAsi();
    CLOSE();
  }

  function parseTryStatement(astProp) {
    OPEN(astProp, 'TryStatement');

    let hasEither = false;

    ASSERT_skip('try');
    parseBlockStatement('block');

    if (curc === $$C_63 && curtok.str === 'catch') {
      hasEither = true;
      OPEN('handler', 'CatchClause');
      ASSERT_skip('catch');
      skipOrDieSingleChar($$PAREN_L_28);
      if (curtype === $IDENT) {
        OPEN('param', 'Identifier');
        SET('name', curtok.str);
        ASSERT_skip($IDENT);
        CLOSE();
      } else if (curc === $$PAREN_L_28 || curc === $$SQUARE_L_5B) {
        TODO
      } else {
        ERROR('unknown catch clause');
      }
      skipOrDieSingleChar($$PAREN_R_29);
      parseBlockStatement('body');
      CLOSE(); // CatchClause
    } else {
      SET('handler', null);
    }

    if (curc === $$F_66 && curtok.str === 'finally') {
      hasEither = true;
      ASSERT_skip('finally');
      parseBlockStatement('finalizer');
    } else {
      SET('finalizer', null);
    }

    CLOSE();

    if (!hasEither) ERROR('must have one');
  }

  function parseVarStatement(astProp) {
    _parseAnyVarStatement('var', astProp);
  }

  function parseWhileStatement(astProp) {
    OPEN(astProp, 'WhileStatement');
    ASSERT_skip('while');
    parseStatementHeader('test');
    parseBodyPart('body');
    CLOSE();
  }

  function parseIdentLabelOrExpressionStatement(astProp) {
    let identToken = curtok;
    ASSERT_skip($IDENT);
    if (curc === $$COLON_3A) {
      OPEN(astProp, 'LabeledStatement');
      OPEN('label', 'Identifier');
      SET('name', identToken.str);
      CLOSE();
      ASSERT_skip(':');
      parseBodyPart('body');
      CLOSE();
    } else {
      OPEN(astProp, 'ExpressionStatement');
      parseValueFromIdent(identToken, 'expression'); // TODO: could do the ident manually, skips some checks.
      CLOSE();
      parseSemiOrAsi();
    }
  }

  function parsePunctuatorStatement(astProp) {
    switch (curc) {
      case $$CURLY_L_7B:
        parseBlockStatement(astProp);
        break;
      case $$SEMI_3B:
        parseEmptyStatement(astProp);
        break;
      default:
        OPEN(astProp, 'ExpressionStatement');
        parseExpression('expression');
        CLOSE();
        parseSemiOrAsi();
    }
  }

  function parseEmptyStatement(astProp) {
    OPEN(astProp, 'EmptyStatement');
    ASSERT_skip(';');
    CLOSE();
  }

  function parseWithStatement(astProp) {
    OPEN(astProp, 'WithStatement');
    ASSERT_skip('with');
    parseStatementHeader('object');
    parseBodyPart('body');
    CLOSE();
  }

  function _parseAnyVarStatement(kind, astProp) {
    _parseAnyVarDecls(kind, astProp);
    parseSemiOrAsi();
  }
  function _parseAnyVarDecls(kind, astProp) {
    // var, let, const. apply additional checks for let/const.
    OPEN(astProp, 'VariableDeclaration');
    SET('kind', kind);
    SET('declarations', []);

    // continue is only valid inside a loop, fenced by functions
    ASSERT_skip(kind);

    parseBindingPatterns('declarations');

    CLOSE();
  }
  function parseBindingPatterns(astProp) {
    do {
      parseElisions(astProp);
      parseBindingPattern(astProp);
      if (curc !== $$COMMA_2C) break;
      ASSERT_skip($PUNCTUATOR, ',');
    } while (true);
    parseElisions(astProp);
  }
  function parseElisions(astProp) {
    while(curc === $$COMMA_2C) {
      ADD(astProp, null);
      ASSERT_skip($PUNCTUATOR, ',');
    }
  }
  function parseBindingPattern(astProp) {
    OPEN(astProp, 'VariableDeclarator');

    if (curtype === $IDENT) {
      // normal
      // TODO: verify ident is valid here

      OPEN('id', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skip($IDENT);
      CLOSE();
    } else if (curc === $$CURLY_L_7B) {
      // destructure object
      TODO
    } else if (curc === $$SQUARE_L_5B) {
      // destructure array
      // keep parsing binding patterns separated by at least one comma
      OPEN('id', 'ArrayPattern');
      skipOrDieSingleChar($$SQUARE_L_5B);
      SET('elements', []);
      parseBindingPatternsNested('elements');
      skipOrDieSingleChar($$SQUARE_R_5D);
      CLOSE();
    } else {
      ERROR
    }

    if (curc === $$IS_3D && curtok.str === '=') {
      ASSERT_skip($PUNCTUATOR);
      parseExpression('init');
    } else {
      SET('init', null);
    }
    CLOSE();
  }
  function parseBindingPatternsNested(astProp) {
    do {
      parseElisions(astProp);
      parseBindingPatternNested(astProp);
      if (curc !== $$COMMA_2C) break;
      ASSERT_skip($PUNCTUATOR, ',');
    } while (true);
    parseElisions(astProp);
  }
  function parseBindingPatternNested(astProp) {
    if (curtype === $IDENT) {
      // normal
      // TODO: verify ident is valid here

      OPEN(astProp, 'Identifier');
      SET('name', curtok.str);
      ASSERT_skip($IDENT);
      CLOSE();
    } else if (curc === $$CURLY_L_7B) {
      // destructure object
      TODO
    } else if (curc === $$SQUARE_L_5B) {
      // destructure array
      // keep parsing binding patterns separated by at least one comma
      OPEN(astProp, 'ArrayPattern');
      skipOrDieSingleChar($$SQUARE_L_5B);
      SET('elements', []);
      parseBindingPatternsNested('elements');
      skipOrDieSingleChar($$SQUARE_R_5D);
      CLOSE();
    } else {
      ERROR
    }

    if (curc === $$IS_3D && curtok.str === '=') {
      WRAP_CLOSED(astProp, 'AssignmentPattern', 'left');
      ASSERT_skip($PUNCTUATOR);
      parseExpression('right');
      CLOSE();
    }
  }

  // ### expressions

  function parseExpression(astProp) {
    /*
    if (curc === $$PLUS_2B) {
      ASSERT_skip('+');
      parseExpression();
    }
    */

    let assignable = parseValue(astProp);
    return _parseExpression(assignable, astProp);
  }
  function _parseExpression(assignable, astProp) {
    while (assignable && isAssignBinOp()) {
      WRAP_CLOSED(astProp, 'AssignmentExpression', 'left');
      SET('operator', curtok.str);
      skip();
      assignable = parseValue('right');
      CLOSE();
    }
    while (isNonAssignBinOp()) {
      WRAP_CLOSED(astProp, 'BinaryExpression', 'left');
      SET('operator', curtok.str);
      skip();
      parseValue('right');
      CLOSE();
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

  function parseValue(astProp) {
    let assignable = parseValueHeadBody(astProp);
    return parseValueTail(assignable, astProp);
  }
  function parseValueFromIdent(identToken, astProp) {
    let assignable = parseValueHeadBodyIdent(identToken, astProp);
    return parseValueTail(assignable, astProp);
  }
  function parseValueHeadBody(astProp) {
    // - ident (a var, true, false, null, super, new <value>, new.target, this, class, function, async func, generator func)
    // - literal (number, string, regex, object, array, template)
    // - arrow or group

    // do not include the suffix (property, call, etc)

    // return a boolean whether the value is assignable (only for regular var names)

    if (curtype === $IDENT) {
      let identToken = curtok;
      ASSERT_skip($IDENT);
      return parseValueHeadBodyIdent(identToken, astProp);
    } else if (curtype & ($NUMBER|$STRING|$REGEX)) {
      OPEN(astProp, 'Literal');
      SET('value', '<TODO>');
      SET('raw', curtok.str);
      skip();
      CLOSE();
      return false;
    } else if (curtype & $TICK) {
      parseTick(astProp);
      return false;
    } else if (curtype === $PUNCTUATOR) {
      if (curc === $$CURLY_L_7B) {
        parseObjectLitOrDestruc(astProp);
        return false;
      } else if (curc === $$SQUARE_L_5B) {
        parseArrayLitOrDestruc(astProp);
        return false;
      } else if (curc === $$PAREN_L_28) {
        return parseGroupOrArrow(astProp);
      } else if (curtok.str === '++' || curtok.str === '--') {
        OPEN(astProp, 'UpdateExpression');
        SET('operator', curtok.str);
        ASSERT_skip($PUNCTUATOR);
        SET('prefix', true);
        parseValueHeadBody('argument');
        CLOSE();
        return false;
      } else if (curtok.str === '+' || curtok.str === '-' || curtok.str === '!' || curtok.str === '~') {
        OPEN(astProp, 'UnaryExpression');
        SET('operator', curtok.str);
        ASSERT_skip($PUNCTUATOR);
        SET('prefix', true);
        parseValueHeadBody('argument');
        CLOSE();
        return false;
      } else if (curc === $$DOT_2E && curtok.str === '...') {
        OPEN(astProp, 'SpreadElement');
        ASSERT_skip($PUNCTUATOR);
        parseValue('argument');
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
  function parseValueHeadBodyIdent(identToken, astProp) {
    let identName = identToken.str;
    switch (identName) {
      case 'true':
        OPEN(astProp, 'Literal');
        SET('value', true);
        SET('raw', 'true');
        CLOSE();
        return false;
      case' false':
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
        parseValue('expression');
        CLOSE();
        return false;
      case 'this':
        OPEN(astProp, 'ThisExpression');
        CLOSE();
        return false;
      case 'class':
        parseClass();
        return false;
      case 'function':
        parseFunctionExpression();
        return false;
      case 'async':
        parseAsyncFunctionExpression();
        return false;
      case 'delete':
      case 'typeof':
      case 'void':
        OPEN(astProp, 'UnaryExpression');
        SET('operator', identName);
        SET('prefix', true);
        parseValue('argument');
        CLOSE();
        return false;
      case 'yield':
        OPEN(astProp, 'YieldExpression');
        SET('delegate', false); // TODO ??
        parseValue('argument');
        CLOSE();
        return false;
      default:
        // TODO: verify identifier (note: can be value keywords)
        OPEN(astProp, 'Identifier');
        SET('name', identName);
        CLOSE();
        return true;
    }
  }

  function parseObjectLitOrDestruc(astProp) {
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
    ASSERT_skip('{');
    do {
      parseObjLitProperty('properties'); // also consumes comma
      if (curc === $$COMMA_2C) ASSERT_skip(',');
      else break;
    } while(curc !== $$CURLY_R_7D && curtype !== $EOF);
    skipOrDieSingleChar($$CURLY_R_7D);
    CLOSE();

    if (curc === $$IS_3D) {
      if (curtok.str !== '=') ERROR;

      DECONSTRUCT(astProp);

      WRAP_CLOSED(astProp, 'AssignmentExpression', 'left');
      SET('operator', '=');
      ASSERT_skip('=');
      parseExpression('right');
      CLOSE();
    }
  }
  function parseObjLitProperty(astProp) {
    // shorthand, classic, classic with assign, dynamic, dynamic with assign,
    // quoted, quoted with assign, getter, setter, method, async, generator

    if (curtype === $IDENT) {
      // property name, shorthand, getter, setter, method, async
      // note that `async`, `get`, and `set` are valid prop names as well as method modifiers (=> prefixes)
      let identToken = curtok;

      if (identToken.str === 'get') {
        ASSERT_skip('get');
        if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
          parseObjLitGetter(astProp);
          return;
        }
      } else if (identToken.str === 'set') {
        ASSERT_skip('set');
        if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
          parseObjLitSetter(astProp);
          return;
        }
      } else if (identToken.str === 'async') {
        ASSERT_skip('async');
        if (curtype === $IDENT || curc === $$SQUARE_L_5B) {
          parseObjLitAsync(astProp);
          return;
        }
      } else {
        ASSERT_skip($IDENT);
      }
      // this call includes cases where the property name is get, set, or async.
      parseObjLitPropertyFromIdentKey(identToken, astProp);
    } else if (curc === $$STAR_2A) {
      // generator
      ASSERT_skip('*');
      parseObjLitGenerator(astProp);
    } else if (curtype & $STRING) {
      parseObjLitQuotedProperty(astProp);
    } else if (curc === $$SQUARE_L_5B) {
      parseObjLitComputedProperty(astProp);
    } else if (curc !== $$CURLY_R_7D) {
      ERROR
    }
  }
  function parseObjLitIdentOrComputedKey() {
    if (curtype === $IDENT) {
      parseObjLitIdentKey();
    } else if (curc === $$SQUARE_L_5B) {
      parseObjLitComputedKey();
    } else {
      ERROR
    }
  }
  function parseObjLitIdentKey() {
    // get, set, and async are valid key names here but not considered special
    SET('computed', false);
    OPEN('key', 'Identifier');
    SET('name', curtok.str);
    ASSERT_skip($IDENT);
    CLOSE();
  }
  function parseObjLitKeyFromIdent(identToken, astProp) {
    // get, set, and async are valid key names here but not considered special
    OPEN(astProp, 'Identifier');
    SET('name', identToken.str);
    CLOSE();
  }
  function parseObjLitComputedKey() {
    // computed property name
    SET('computed', true);
    ASSERT_skip('[');
    parseExpression('key');
    skipOrDieSingleChar($$SQUARE_R_5D);
  }
  function parseObjLitGetter(astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'get');
    SET('method', false);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey();
    _parseFunction(false, false, false, 'value');
    CLOSE();
  }
  function parseObjLitSetter(astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'set');
    SET('method', false);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey();
    _parseFunction(false, false, false, 'value');
    CLOSE();
  }
  function parseObjLitAsync(astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init'); // only getters/setters get special value here
    SET('method', true);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey();
    _parseFunction(false, false, true, 'value');
    CLOSE();
  }
  function parseObjLitGenerator(astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init'); // only getters/setters get special value here
    SET('method', true);
    SET('shorthand', false); // yes but always no.
    parseObjLitIdentOrComputedKey();
    _parseFunction(false, true, false, 'value');
    CLOSE();
  }
  function parseObjLitPropertyFromIdentKey(identToken, astProp) {
    if (curc === $$PAREN_L_28) {
      parseObjLitRegularMethod(identToken, astProp);
    } else {
      parseObjLitIdentPair(identToken, astProp);
    }
  }
  function parseObjLitRegularMethod(identToken, astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init'); // only getters/setters get special value here
    SET('method', true);
    SET('shorthand', false); // yes but always no.
    SET('computed', false);
    parseObjLitKeyFromIdent(identToken, 'key');
    _parseFunction(false, false, false, 'value');
    CLOSE();
  }
  function parseObjLitIdentPair(identToken, astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init'); // methods are "init" too
    SET('method', false);
    SET('shorthand', curc !== $$COLON_3A);
    SET('computed', false);

    parseObjLitKeyFromIdent(identToken, 'key');
    if (curc === $$COLON_3A) {
      ASSERT_skip(':');
      parseExpression('value');
    } else {
      // shorthand uses key as value as well
      parseObjLitKeyFromIdent(identToken, 'value');

      // if there is an assignment here this "object" is _only_ valid when destructuring
      if (curc === $$IS_3D && curtok.str === '=') {
        ASSERT_skip('=');
        WRAP_CLOSED('value', 'AssignmentExpression', 'left');
        SET('operator', '=');
        parseExpression('right');
        CLOSE();
      }
    }

    CLOSE();
  }
  function parseObjLitQuotedProperty(astProp) {
    OPEN(astProp, 'Property');
    SET('kind', 'init');
    SET('method', false);
    SET('shorthand', false);
    SET('computed', false);
    OPEN('key', 'Literal');
    SET('value', '<TODO>');
    SET('raw', curtok.str);
    ASSERT(curtype & $STRING);
    skip();
    CLOSE();
    skipOrDieSingleChar($$COLON_3A);
    parseExpression('value');
    CLOSE();
  }
  function parseObjLitComputedProperty(astProp) {
    ASSERT_skip('[');
    parseExpression(astProp);
    skipOrDieSingleChar($$SQUARE_R_5D);

    // note: the wraps will cause the `key` property to "appear" earlier than in other parses. annoying but can only be helped by more code complexity. which is not worth it.
    // one path we could decide on is to put `key` first in all cases. maybe.
    if (curc === $$PAREN_L_28) {
      WRAP_CLOSED(astProp, 'Property', 'key');
      SET('kind', 'init'); // only getters/setters get special value here
      SET('method', true);
      SET('shorthand', false); // yes but always no.
      SET('computed', true);
      _parseFunction(false, false, false, 'value');
      CLOSE();
    } else {
      WRAP_CLOSED(astProp, 'Property', 'key');
      SET('kind', 'init');
      SET('method', false);
      SET('shorthand', false);
      SET('computed', true);
      skipOrDieSingleChar($$COLON_3A);
      parseExpression('value');
      CLOSE();
    }
  }

  function parseArrayLitOrDestruc(astProp) {
    // [a]       -> array literal
    // [a] = b   -> array destructuring

    OPEN(astProp, 'ArrayExpression');
    ASSERT_skip('['); // note: should be verified by caller
    SET('elements', []);
    if (curc === $$SQUARE_R_5D) {
      ASSERT_skip(']');
    } else {
      while (true) {
        parseElisions('elements');
        parseExpression('elements');
        if (curc !== $$COMMA_2C) break;
        ASSERT_skip(',');
      }
      skipOrDieSingleChar($$SQUARE_R_5D);
    }
    CLOSE();

    // now the tricky part; there could be an assignment here. this would throw everything up-side-down

    if (curc === $$IS_3D) {
      if (curtok.str !== '=') ERROR;

      DECONSTRUCT(astProp);

      WRAP_CLOSED(astProp, 'AssignmentExpression', 'left');
      SET('operator', '=');
      ASSERT_skip('=');
      parseExpression('right');
      CLOSE();
    }
  }

  function parseValueTail(assignable, astProp) {
    if (curc === $$DOT_2E && curtok.str === '.') {
      ASSERT_skip('.');
      if (curtype !== $IDENT) ERROR;
      WRAP_CLOSED(astProp, 'MemberExpression', 'object');
      OPEN('property', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skip($IDENT);
      CLOSE();
      SET('computed', false);
      CLOSE();
      assignable = parseValueTail(true, astProp);
    } else if (curc === $$SQUARE_L_5B) {
      WRAP_CLOSED(astProp, 'MemberExpression', 'object');
      ASSERT_skip('[');
      parseExpression('property');
      skipOrDieSingleChar($$SQUARE_R_5D);
      SET('computed', true);
      CLOSE();
      assignable = parseValueTail(true, astProp);
    } else if (curc === $$PAREN_L_28) {
      ASSERT(curtype === $PUNCTUATOR && curtok.str === '(');
      ASSERT_skip('(');
      WRAP_CLOSED(astProp, 'CallExpression', 'callee');
      SET('arguments', []);
      parseCallArgs('arguments');
      CLOSE();
      assignable = parseValueTail(false, astProp);
    } else if (curc === $$TICK_60) { TODO
      ASSERT((curtype & $TICK) === $TICK);
      WRAP_OPENED(astProp, 'MemberExpression', 'object');
      OPEN('property', 'Identifier');
      SET('name', curtok.str);
      ASSERT_skip($IDENT);
      CLOSE();
      assignable = parseValueTail(false, astProp);
    } else if (curc === $$PLUS_2B && curtok === '++') { TODO
      ASSERT(curtype === $PUNCTUATOR);
      WRAP_OPENED(astProp, 'UnaryExpression', 'argument');
      SET('operator', curtok.str);
      SET('prefix', false);
      parseValueHeadBody('argument');
      CLOSE();
      assignable = parseValueTail(false, astProp);
    } else if (curc === $$DASH_2D && curtok === '--') { TODO
      ASSERT(curtype === $PUNCTUATOR);
      WRAP_OPENED(astProp, 'UnaryExpression', 'argument');
      SET('operator', curtok.str);
      SET('prefix', false);
      parseValueHeadBody('argument');
      CLOSE();
      assignable = parseValueTail(false, astProp);
    }
    return assignable;
  }
  function parseCallArgs(astProp) {
    if (curc === $$PAREN_R_29) {
      ASSERT_skip(')');
    } else {
      do {
        parseExpression(astProp);
        if (curc !== $$COMMA_2C) break;
        ASSERT_skip(',');
      } while (true);
      skipOrDieSingleChar($$PAREN_R_29);
    }
  }

  function parseGroupOrArrow(astProp) {
    // this function parses an arrow function or a grouped expression
    // in many cases we won't know what we're actually parsing until
    // we encounter the first token after the closing parenthesis
    // (`=>` leads to function, `=` leads to obscure assignment, other leads to group)

    ASSERT_skip('(');

    // note: only a group-wrapped solo identifier or a value that results in a property
    // can be assignable (and more restrictions may apply for eval/arguments)
    let assignable = parseExpression(astProp);

    if (curc === $$COMMA_2C) {
      WRAP_CLOSED_ARRAY(astProp, 'SequenceExpression', 'expressions');
      astProp = 'expressions';
      ASSERT_skip(',');
      assignable = false; // in all cases
      do {
        parseExpression(astProp);
        if (curc !== $$COMMA_2C) break;
        ASSERT_skip(',');
      } while (true);
      CLOSE();
    }

    skipOrDieSingleChar($$PAREN_R_29);

    if (curc === $$IS_3D && curtok.str === '=>') {
      // arrow function. if that's possible.
      WRAP_CLOSED('expression', 'ArrowFunctionExpression', 'params');

      let node = _path[_path.length-1];
      if (node.params.type === 'SequenceExpression') node.params = node.params.expressions;
      else if (!Array.isArray(node.params)) node.params = [node.params];
      ASSERT_skip('=>');
      SET('id', null);
      SET('generator', false);
      SET('expression', true);
      parseExpression('body');
      CLOSE();
    }

    return assignable;
  }

  init();
  parseTopLevels();

  return {
    ast: _tree,
    tokens: tok.tokens,
  }
}

function getGenericTokenType(type) {
  // the token type is a bitwise flag which allows us to be specific
  // sometimes we just want to quickly know whether the token is a
  // string and not care about it being a single or double quoted string.

  let redundantFlags = $NUMBER_HEX | $NUMBER_DEC | $NUMBER_BIN | $NUMBER_OCT | $NUMBER_OLD | $REGEXU | $STRING_DOUBLE | $STRING_SINGLE | $TICK | $TICK_BODY | $TICK_HEAD | $TICK_PURE | $TICK_TAIL;
  // (x|y)^y : the or will first make sure the bits are set (regardless) and the xor then unsets them
  let flag = (type | redundantFlags) ^ redundantFlags;
  //ASSERT((1 << Math.clz(flag)) === flag, 'should only have one bit set');
  return flag;
}


//export default ZeParser;
//export {
require['__./zeparser'] = module.exports = { default: ZeParser,
  // this is a re-export but prevents external scripts from also needing to require zetokenizer
  // (okay and in the build it all falls apart, anyways)
  COLLECT_TOKENS_NONE,
  COLLECT_TOKENS_SOLID,
  COLLECT_TOKENS_ALL,
};
