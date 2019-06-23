# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/async_keyword/async_function_decl_names_are_lexical_bindings_in_block_scope.md

> :: async keyword
>
> ::> async function decl names are lexical bindings in block scope

## Input

`````js
{ async function f() {} var f; }
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Tried to define a var which was already bound as a lexical binding

{ async function f() {} var f; }
                            ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 32 } },
  body: [
    {
      type: 'BlockStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 32 },
        source: ''
      },
      body: [
        {
          type: 'FunctionDeclaration',
          loc: {
            start: { line: 1, col: 8 },
            end: { line: 1, col: 24 },
            source: ''
          },
          generator: false,
          async: true,
          id: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 17 },
              end: { line: 1, col: 17 },
              source: ''
            },
            name: 'f'
          },
          params: [],
          body: {
            type: 'BlockStatement',
            loc: {
              start: { line: 1, col: 21 },
              end: { line: 1, col: 24 },
              source: ''
            },
            body: []
          }
        },
        {
          type: 'VariableDeclaration',
          loc: {
            start: { line: 1, col: 28 },
            end: { line: 1, col: 29 },
            source: ''
          },
          kind: 'var',
          declarations: [
            {
              type: 'VariableDeclarator',
              loc: {
                start: { line: 1, col: 28 },
                end: { line: 1, col: 29 },
                source: ''
              },
              id: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 28 },
                  end: { line: 1, col: 28 },
                  source: ''
                },
                name: 'f'
              },
              init: null
            }
          ]
        }
      ]
    }
  ]
}

tokens (13x):
       PUNCTUATOR IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT IDENT PUNCTUATOR PUNCTUATOR
`````
