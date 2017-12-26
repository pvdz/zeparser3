let {
  $ASI,
  $IDENT,
  $NUMBER_DEC,
  $PUNCTUATOR,
  $STRING_DOUBLE,
  $STRING_SINGLE,
} = require('../../../src/zetokenizer');


module.exports = (describe, test) => describe('export declaration', _ => {

  test('re-export everything from another module (double string)',{
    code: 'export * from "foo"',
    ast: {type: 'Program', body: [
      {type: 'ExportAllDeclaration', source: {type: 'Literal', value: '<TODO>', raw: '"foo"'}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
  });
  
  test('re-export everything from another module (single string)',{
    code: `export * from 'foo'`,
    ast: {type: 'Program', body: [
      {type: 'ExportAllDeclaration', source: {type: 'Literal', value: '<TODO>', raw: '\'foo\''}},
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $STRING_SINGLE, $ASI],
  });
  
  test('empty export',{
    code: 'export {}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('export one key',{
    code: 'export {x}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });
  
  test('export one key aliased',{
    code: 'export {x as a}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
  });
  
  test('export one key, trailing comma',{
    code: 'export {x,}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('re-export one key',{
    code: 'export {x} from "foo"',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
        ],
        declaration: null,
        source: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
  });
  
  test('re-export one key aliased',{
    code: 'export {x as a} from "foo"',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}},
        ],
        declaration: null,
        source: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
  });
  
  test('re-export one key, trailing comma',{
    code: 'export {x,} from "foo"',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
        ],
        declaration: null,
        source: {type: 'Literal', value: '<TODO>', raw: '"foo"'},
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $IDENT, $STRING_DOUBLE, $ASI],
  });
  
  test('export one key aliased, trailing comma',{
    code: 'export {x as a,}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('export two keys',{
    code: 'export {x, y}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'y'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $ASI],
  });
  
  test('export two keys aliased',{
    code: 'export {x as a, y as b}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}},
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'b'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $ASI],
  });
  
  test('export two keys, trailing comma',{
    code: 'export {x, y,}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'x'}},
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'y'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('export two keys aliased, trailing comma',{
    code: 'export {x as a, y as b,}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'x'}, exported: {type: 'Identifier', name: 'a'}},
          {type: 'ExportSpecifier', local: {type: 'Identifier', name: 'y'}, exported: {type: 'Identifier', name: 'b'}},
        ],
        declaration: null,
        source: null,
      },
    ]},
    tokens: [$IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('export var statement, one var',{
    code: 'export var x',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'var',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $ASI],
  });
  
  test('export var statement, two vars',{
    code: 'export var x, y',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'var',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: null},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('export var statement, two vars, with init',{
    code: 'export var x = 10, y = 20',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'var',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: {type: 'Literal', value: '<TODO>', raw: '10'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: {type: 'Literal', value: '<TODO>', raw: '20'}},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
  });
  
  test('export let statement, one var',{
    code: 'export let x',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'let',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $ASI],
  });
  
  test('export let statement, two vars',{
    code: 'export let x, y',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'let',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: null},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('export let statement, two vars, with init',{
    code: 'export let x = 10, y = 20',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'let',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: {type: 'Literal', value: '<TODO>', raw: '10'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: {type: 'Literal', value: '<TODO>', raw: '20'}},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
  });
  
  test('export const statement, one var',{
    code: 'export const x',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'const',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $ASI],
  });
  
  test('export const statement, two vars',{
    code: 'export const x, y',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'const',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: null},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: null},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $ASI],
  });
  
  test('export const statement, two vars, with init',{
    code: 'export const x = 10, y = 20',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'VariableDeclaration',
          kind: 'const',
          declarations: [
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'x'}, init: {type: 'Literal', value: '<TODO>', raw: '10'}},
            {type: 'VariableDeclarator', id: {type: 'Identifier', name: 'y'}, init: {type: 'Literal', value: '<TODO>', raw: '20'}},
          ],
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $NUMBER_DEC, $ASI],
  });
  
  test('export a named function',{
    code: 'export function f(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('export a named async function',{
    code: 'export async function f(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'FunctionDeclaration',
          generator: false,
          async: true,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('non-default export of an anonymous async function is illegal',{
    code: 'export async function(){}',
    MODULE: {
      throws: 'missing required ident',
    },
    SCRIPT: {
      throws: 'missing required ident',
    },
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('legacy meaning of `async` cant save this export from failing in SCRIPT mode',{
    code: 'export async',
    throws: 'Can only export async functions',
    tokens: [$IDENT, $IDENT, $ASI],
  });
  
  test('export a named generator function',{
    code: 'export function* f(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
        source: null,
      },
    ]},
    tokens: [$IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('default export a named function',{
    code: 'export default function f(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportDefaultDeclaration',
        declaration: {type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('default export a named async function',{
    code: 'export default async function f(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportDefaultDeclaration',
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
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('default export a named generator function',{
    code: 'export default function* f(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportDefaultDeclaration',
        declaration: {type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: {type: 'Identifier', name: 'f'},
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('default export an anonymous function',{
    code: 'export default function(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportDefaultDeclaration',
        declaration: {type: 'FunctionDeclaration',
          generator: false,
          async: false,
          expression: false,
          id: null,
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
  
  test('default export an anonymous async function',{
    code: 'export default async function(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportDefaultDeclaration',
        declaration: {type: 'FunctionDeclaration',
          generator: false,
          async: true,
          expression: false,
          id: null,
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('default export an anonymous generator function',{
    code: 'export default function*(){}',
    ast: {type: 'Program', body: [
      {type: 'ExportDefaultDeclaration',
        declaration: {type: 'FunctionDeclaration',
          generator: true,
          async: false,
          expression: false,
          id: null,
          params: [],
          body: {type: 'BlockStatement', body: []},
        },
      },
    ]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('export a class',{
    code: 'export class x {}',
    ast: {type: 'Program', body: [{
      type: 'ExportNamedDeclaration',
      specifiers: [],
      declaration: {
        type: 'ClassDeclaration',
        id: {type: 'Identifier', name: 'x'},
        superClass: null,
        body: {type: 'ClassBody', body: []},
      },
      source: null,
    }]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('default export a named class',{
    code: 'export default class x {}',
    ast: {type: 'Program', body: [{
      type: 'ExportDefaultDeclaration',
      declaration: {
        type: 'ClassDeclaration',
        id: {type: 'Identifier', name: 'x'},
        superClass: null,
        body: {type: 'ClassBody', body: []},
      },
    }]},
    tokens: [$IDENT, $IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });

  test('default export an anonymous class',{
    code: 'export default class {}',
    ast: {type: 'Program', body: [{
      type: 'ExportDefaultDeclaration',
      declaration: {
        type: 'ClassDeclaration',
        id: null,
        superClass: null,
        body: {type: 'ClassBody', body: []},
      },
    }]},
    tokens: [$IDENT, $IDENT, $IDENT, $PUNCTUATOR, $PUNCTUATOR, $ASI],
  });
});

// cannot import/export a var named `let` (since module code is strict by default and import/export is module-code-only)

