let {$IDENT, $PUNCTUATOR, $STRING_DOUBLE, $STRING_SINGLE} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('import declarations', _ => {
    test('simple import of a default with double string', {
      code: 'import x from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {type: 'Identifier', name: 'x'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with single string', {
      code: "import x from 'y'",
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {type: 'Identifier', name: 'x'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: "'y'",
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $STRING_SINGLE],
    });

    test('simple import of an aliased default', {
      code: 'import * as a from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportNamespaceSpecifier',
                local: {type: 'Identifier', name: 'a'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of an aliased default', {
      code: 'import x, * as a from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {type: 'Identifier', name: 'x'},
              },
              {
                type: 'ImportNamespaceSpecifier',
                local: {type: 'Identifier', name: 'a'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'x'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x,} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'x'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x as z} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'z'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x as z,} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'z'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x, z} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'x'},
              },
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'z'},
                local: {type: 'Identifier', name: 'z'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x, z,} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'x'},
              },
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'z'},
                local: {type: 'Identifier', name: 'z'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x as a, z} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'a'},
              },
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'z'},
                local: {type: 'Identifier', name: 'z'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x, z as b} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'x'},
              },
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'z'},
                local: {type: 'Identifier', name: 'b'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x as a, z as b} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'a'},
              },
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'z'},
                local: {type: 'Identifier', name: 'b'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });

    test('simple import of a default with double string', {
      code: 'import {x as a, z as b,} from "y"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'x'},
                local: {type: 'Identifier', name: 'a'},
              },
              {
                type: 'ImportSpecifier',
                imported: {type: 'Identifier', name: 'z'},
                local: {type: 'Identifier', name: 'b'},
              },
            ],
            source: {
              type: 'Literal',
              value: '<TODO>',
              raw: '"y"',
            },
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE],
    });
  });
