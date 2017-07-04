//import ZeTokenizer, {
let {
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
} = require('../../../src/zetokenizer');
//} from '../../../src/zetokenizer';

let tests = [
  'import',
  {
    code: 'import x from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportDefaultSpecifier',
          local: {type: 'Identifier', name: 'x'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $IDENT, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import x from \'y\'',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportDefaultSpecifier',
          local: {type: 'Identifier', name: 'x'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '\'y\'',
      },
    }]},
    desc: 'simple import of a default with single string',
    tokens: [$IDENT, $IDENT, $IDENT, $STRING_SINGLE],
  },
  {
    code: 'import * as a from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportNamespaceSpecifier',
          local: {type: 'Identifier', name: 'a'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of an aliased default',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import x, * as a from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportDefaultSpecifier',
          local: {type: 'Identifier', name: 'x'},
        },
        {type: 'ImportNamespaceSpecifier',
          local: {type: 'Identifier', name: 'a'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of an aliased default',
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'x'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x,} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'x'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x as z} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'z'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x as z,} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'z'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x, z} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'x'},
        },
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'z'},
          local: {type: 'Identifier', name: 'z'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x, z,} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'x'},
        },
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'z'},
          local: {type: 'Identifier', name: 'z'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x as a, z} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'a'},
        },
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'z'},
          local: {type: 'Identifier', name: 'z'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x, z as b} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'x'},
        },
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'z'},
          local: {type: 'Identifier', name: 'b'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x as a, z as b} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'a'},
        },
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'z'},
          local: {type: 'Identifier', name: 'b'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
  {
    code: 'import {x as a, z as b,} from "y"',
    ast: {type: 'Program', body: [{
      type: 'ImportDeclaration',
      specifiers: [
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'x'},
          local: {type: 'Identifier', name: 'a'},
        },
        {type: 'ImportSpecifier',
          imported: {type: 'Identifier', name: 'z'},
          local: {type: 'Identifier', name: 'b'},
        },
      ],
      source: {
        type: 'Literal',
        value: '<TODO>',
        raw: '"y"',
      },
    }]},
    desc: 'simple import of a default with double string',
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
  },
];

//export default tests;
module.exports = tests;
