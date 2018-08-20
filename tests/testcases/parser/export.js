let {$ASI, $IDENT, $NUMBER_DEC, $PUNCTUATOR, $STRING_DOUBLE, $STRING_SINGLE} = require('../../../src/zetokenizer');

module.exports = (describe, test) =>
  describe('export declaration', _ => {
    test('re-export everything from another module (double string)', {
      code: 'export * from "foo"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [{type: 'ExportAllDeclaration', source: {type: 'Literal', value: '<TODO>', raw: '"foo"'}}],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
    });

    test('re-export everything from another module (single string)', {
      code: `export * from 'foo'`,
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [{type: 'ExportAllDeclaration', source: {type: 'Literal', value: '<TODO>', raw: "'foo'"}}],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $ASI],
    });

    test('empty export', {
      code: 'export {}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('export one key', {
      code: 'export {x}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [{type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}}],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('export one key aliased', {
      code: 'export {x as a}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [{type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}}],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('export one key, trailing comma', {
      code: 'export {x,}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [{type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}}],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('re-export one key', {
      code: 'export {x} from "foo"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [{type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}}],
            declaration: null,
            source: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
    });

    test('re-export one key aliased', {
      code: 'export {x as a} from "foo"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [{type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}}],
            declaration: null,
            source: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
    });

    test('re-export one key, trailing comma', {
      code: 'export {x,} from "foo"',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [{type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}}],
            declaration: null,
            source: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
    });

    test('export one key aliased, trailing comma', {
      code: 'export {x as a,}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [{type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}}],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('export two keys', {
      code: 'export {x, y}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'y'}},
            ],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('export two keys aliased', {
      code: 'export {x as a, y as b}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}},
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'b'}},
            ],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
    });

    test('export two keys, trailing comma', {
      code: 'export {x, y,}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'y'}},
            ],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('export two keys aliased, trailing comma', {
      code: 'export {x as a, y as b,}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}},
              {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'b'}},
            ],
            declaration: null,
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
    });

    test('export var statement, one var', {
      code: 'export var x',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null}],
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $ASI],
    });

    test('export var statement, two vars', {
      code: 'export var x, y',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: null},
              ],
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('export var statement, two vars, with init', {
      code: 'export var x = 10, y = 20',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: {type: 'Literal', value: '<TODO>', raw: '10'}},
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: {type: 'Literal', value: '<TODO>', raw: '20'}},
              ],
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
    });

    test('export let declaration, one var', {
      code: 'export let x',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [{type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null}],
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $ASI],
    });

    test('export let declaration, two vars', {
      code: 'export let x, y',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: null},
              ],
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
    });

    test('export let declaration, two vars, with init', {
      code: 'export let x = 10, y = 20',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: {type: 'Literal', value: '<TODO>', raw: '10'}},
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: {type: 'Literal', value: '<TODO>', raw: '20'}},
              ],
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
    });

    test('export const statement, one var', {
      code: 'export const x',
      SCRIPT: {throws: 'module goal'},
      throws: 'init',
    });

    test('export const statement, two vars', {
      code: 'export const x, y',
      SCRIPT: {throws: 'module goal'},
      throws: 'init',
    });

    test('export const statement, two vars, with init', {
      code: 'export const x = 10, y = 20',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: {type: 'Literal', value: '<TODO>', raw: '10'}},
                {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: {type: 'Literal', value: '<TODO>', raw: '20'}},
              ],
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
    });

    test('export a named function', {
      code: 'export function f(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('export a named async function', {
      code: 'export async function f(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'FunctionDeclaration',
              generator: false,
              async: true,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('non-default export of an anonymous async function is illegal', {
      code: 'export async function(){}',
      MODULE: {throws: 'missing required ident'},
      SCRIPT: {throws: 'module goal'},
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('legacy meaning of `async` cant save this export from failing in SCRIPT mode', {
      code: 'export async',
      SCRIPT: {throws: 'module goal'},
      MODULE: {throws: 'Can only export async functions'},
    });

    test('export a named generator function', {
      code: 'export function* f(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'FunctionDeclaration',
              generator: true,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export a named function', {
      code: 'export default function f(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export a named async function', {
      code: 'export default async function f(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              generator: false,
              async: true,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export a named generator function', {
      code: 'export default function* f(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              generator: true,
              async: false,
              expression: false,
              id: {type: 'Identifier', name: 'f'},
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export an anonymous function', {
      code: 'export default function(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              generator: false,
              async: false,
              expression: false,
              id: null,
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export an anonymous async function', {
      code: 'export default async function(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              generator: false,
              async: true,
              expression: false,
              id: null,
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export an anonymous generator function', {
      code: 'export default function*(){}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'FunctionDeclaration',
              generator: true,
              async: false,
              expression: false,
              id: null,
              params: [],
              body: {type: 'BlockStatement', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('export a class', {
      code: 'export class x {}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            declaration: {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {type: 'ClassBody', body: []},
            },
            source: null,
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export a named class', {
      code: 'export default class x {}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'ClassDeclaration',
              id: {type: 'Identifier', name: 'x'},
              superClass: null,
              body: {type: 'ClassBody', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    test('default export an anonymous class', {
      code: 'export default class {}',
      SCRIPT: {throws: 'module goal'},
      ast: {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'ClassDeclaration',
              id: null,
              superClass: null,
              body: {type: 'ClassBody', body: []},
            },
          },
        ],
      },
      tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR],
    });

    describe('rest', _ => {
      test('rest arr', {
        code: 'export let [...x] = y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {type: 'Identifier', name: 'x'},
                        },
                      ],
                    },
                    init: {type: 'Identifier', name: 'y'},
                  },
                ],
              },
              source: null,
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        SLOPPY_SCRIPT: {
          throws: 'module',
        },
      });

      test('var and rest arr', {
        code: 'export let a, [...x] = y',
        ast: {
          type: 'Program',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: 'a'},
                    init: null,
                  },
                  {
                    type: 'VariableDeclarator',
                    id: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {type: 'Identifier', name: 'x'},
                        },
                      ],
                    },
                    init: {type: 'Identifier', name: 'y'},
                  },
                ],
              },
              source: null,
            },
          ],
        },
        tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $ASI],
        SLOPPY_SCRIPT: {
          throws: true,
        },
      });

      test('rest obj', {
        code: 'export let {...x} = y',
        throws: true, // TODO
      });

      test('ummmm no', {
        code: 'export let ...x = y',
        throws: true,
      });

      test('just no', {
        code: 'export ...x = y',
        throws: true,
      });

      test('nope nope nope', {
        code: 'export default ...x = y',
        throws: true,
      });
    });

    describe('confirm when a semi is not needed', _ => {

      describe('non-default', _ => {


        test.pass('regular func', {
          code: 'export function f(){} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('async func', {
          code: 'export async function f(){} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('generator func', {
          code: 'export function *f(){} foo',
          SCRIPT: {throws: 'module'},
        });

        // test.pass('async generator func', {
        //   code: 'export async function *f(){} foo',
        // SCRIPT: {throws: 'module'},
        // });

        test.pass('regular class', {
          code: 'export class x {} foo',
          SCRIPT: {throws: 'module'},
        });

        test.fail('var', {
          code: 'export var foo = x foo',
          SCRIPT: {throws: 'module'},
        });

        test.fail('let', {
          code: 'export let foo = x foo',
          SCRIPT: {throws: 'module'},
        });

        test.fail('const', {
          code: 'export const foo = x foo',
          SCRIPT: {throws: 'module'},
        });

        test.fail('export clause own', {
          code: 'export {x, y} foo',
          SCRIPT: {throws: 'module'},
        });

        test.fail('export clause from', {
          code: 'export {x, y} from "x" foo',
          SCRIPT: {throws: 'module'},
        });

        test.fail('export star from', {
          code: 'export * from "x" foo',
          SCRIPT: {throws: 'module'},
        });

        test.fail('export namespaced star', {
          code: 'export * as x from "x" foo',
          SCRIPT: {throws: 'module'},
        });
      });

      describe('default', _ => {

        test.pass('regular func', {
          code: 'export default function f(){} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('regular anon func', {
          code: 'export default function(){} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('async func', {
          code: 'export default async function f(){} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('async anon func', {
          code: 'export default async function(){} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('generator func', {
          code: 'export default function *f(){} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('generator anon func', {
          code: 'export default function *(){} foo',
          SCRIPT: {throws: 'module'},
        });

        // test.pass('async generator func', {
        //   code: 'export default async function *f(){} foo',
        // SCRIPT: {throws: 'module'},
        // });

        // test.pass('async generator anon func', {
        //   code: 'export default async function *(){} foo',
        // SCRIPT: {throws: 'module'},
        // });

        test.pass('regular class', {
          code: 'export default class x {} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('regular anon class', {
          code: 'export default class {} foo',
          SCRIPT: {throws: 'module'},
        });

        test.pass('assignment expression', {
          code: 'export default () => x',
          SCRIPT: {throws: 'module'},
        });
      });
    });

    test('the `as` keyword cannot contain escape sequence', {
      code: 'export {a \\u0061s b} from "x";',
      SCRIPT: {throws: 'module'},
      throws: true,
    });

    test.pass('export null', {
      code: 'export default null;',
      SCRIPT: {throws: 'module'},
    });

    test.pass('lhs cannot be array literal', {
      code: 'export default [x] = y',
      desc: 'It is a Syntax Error if LeftHandSideExpression is either an ObjectLiteral or an ArrayLiteral and LeftHandSideExpression is not covering an AssignmentPattern.',
      SCRIPT: {throws: 'module'},
    });

    test.pass('lhs cannot be object literal', {
      code: 'export default {x, y} = x',
      desc: 'It is a Syntax Error if LeftHandSideExpression is either an ObjectLiteral or an ArrayLiteral and LeftHandSideExpression is not covering an AssignmentPattern.',
      SCRIPT: {throws: 'module'},
    });

    test.pass('edge case regarding `in`', {
      code: 'export default a in b',
      // always allowed by cfg
      SCRIPT: {throws: 'module'},
    });

    test.fail('edge case regarding `await`', {
      code: 'export default await',
      // always forbidden by cfg
      SCRIPT: {throws: 'module'},
    });

    test.fail('edge case regarding `await x`', {
      code: 'export default await x',
      // always forbidden by cfg
      SCRIPT: {throws: 'module'},
    });

    test.fail('edge case regarding `yield`', {
      code: 'export default yield',
      // always forbidden by cfg
      SCRIPT: {throws: 'module'},
    });

    test.fail('edge case regarding `yield x`', {
      code: 'export default yield x',
      // always forbidden by cfg
      SCRIPT: {throws: 'module'},
    });

    test('cannot export let', {
      code: 'export var let = x;',
      SCRIPT: {throws: 'module'},
      MODULE: {throws: 'let'},
    });

    describe('scoping', _ => {

      test('block', {
        code: '{export {x};}',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('function', {
        code: 'function f(){export {x};}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });

      test('arrow decl', {
        code: 'let x = () => {export {x};}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });

      test.fail('arrow expr', {
        code: 'let x = () => export {x}',
      });

      test('if statement', {
        code: 'if (x) export {x};',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('else statement', {
        code: 'if (x); else export {x};',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('while statement', {
        code: 'while (x) export {x};',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('do-while statement', {
        code: 'do export {x}; while (x);',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('for statement', {
        code: 'for (;;) export {x};',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test.fail('for statement', {
        code: 'switch (x) { export {x}; }',
      });

      test('case statement', {
        code: 'switch (x) { case x: export {x}; }',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('default statement', {
        code: 'switch (x) { default: export {x}; }',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('with statement', {
        code: 'with (x) export {x};',
        // with is illegal in module goal because it is strict by default, anyways
        SCRIPT: {throws: 'module'},
        throws: 'with',
      });

      test('try statement', {
        code: 'try { export {x}; } catch(e){}',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('catch statement', {
        code: 'try { } catch(e){ export {x}; }',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test('finally statement', {
        code: 'try { } finally { export {x}; }',
        SCRIPT: {throws: 'module'},
        throws: 'can not be nested',
      });

      test.fail('return statement', {
        code: 'function f(){ return export {x}; }',
      });

      test.fail('class decl', {
        code: 'class x { export {x}; }',
      });

      test('class constructor', {
        code: 'class x { constructor(){ export {x}; }}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });

      test('class method', {
        code: 'class x { foo(){ export {x}; }}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });

      test('obj method', {
        code: 'x = { foo(){ export {x}; }}',
        SCRIPT: {throws: 'module'},
        throws: 'top level',
      });
    })
  });
