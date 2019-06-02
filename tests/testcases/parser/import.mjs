import {$ASI, $IDENT, $PUNCTUATOR, $STRING_DOUBLE, $STRING_SINGLE} from '../../../src/zetokenizer.mjs';

export default (describe, test) =>
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
      tokens: [$IDENT, $IDENT, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $IDENT, $IDENT, $STRING_SINGLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
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
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
    });

    test('the `as` keyword cannot contain escape sequence', {
      code: 'export {a \\u0061s b} from "x";',
      SCRIPT: {
        throws: 'module',
      },
      throws: true,
    });

    describe('scoping', _ => {
      test('block', {
        code: '{import {x} from "y";}',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('function', {
        code: 'function f(){import {x} from "y";}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });

      test.fail('arrow decl', {
        code: 'let x = () => {import {x} from "y";}',
        SCRIPT: {throws: 'module'},
      });

      test.fail('arrow expr', {
        code: 'let x = () => import {x} from "y"',
      });

      test('if statement', {
        code: 'if (x) import {x} from "y";',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('else statement', {
        code: 'if (x); else import {x} from "y";',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('while statement', {
        code: 'while (x) import {x} from "y";',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('do-while statement', {
        code: 'do import {x} from "y"; while (x);',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('for statement', {
        code: 'for (;;) import {x} from "y";',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test.fail('for statement', {
        code: 'switch (x) { import {x} from "y"; }',
      });

      test.fail('case statement', {
        code: 'switch (x) { case x: import {x} from "y"; }',
        SCRIPT: {throws: 'module'},
      });

      test('default statement', {
        code: 'switch (x) { default: import {x} from "y"; }',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('with statement', {
        code: 'with (x) import {x} from "y";',
        // with is illegal in module goal because it is strict by default, anyways
        SCRIPT: {throws: 'module'},
        throws: 'with',
      });

      test('try statement', {
        code: 'try { import {x} from "y"; } catch(e){}',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('catch statement', {
        code: 'try { } catch(e){ import {x} from "y"; }',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('finally statement', {
        code: 'try { } finally { import {x} from "y"; }',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test.fail('return statement', {
        code: 'function f(){ return import {x} from "y"; }',
      });

      test.fail('class decl', {
        code: 'class x { import {x} from "y"; }',
      });

      test('class constructor', {
        code: 'class x { constructor(){ import {x} from "y"; }}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });

      test('class method', {
        code: 'class x { foo(){ import {x} from "y"; }}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });

      test('obj method', {
        code: 'x = { foo(){ import {x} from "y"; }}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });
    });
  });
