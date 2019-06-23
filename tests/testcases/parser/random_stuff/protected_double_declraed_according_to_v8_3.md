# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/random_stuff/protected_double_declraed_according_to_v8.md

> :: random stuff
>
> ::> protected double declraed according to v8

## Input

`````js
function protected(){for(;;)switch(x){default:}}const protected=x
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Cannot create lexical binding when the name was already `var` bound

function protected(){for(;;)switch(x){default:}}const protected=x
                                                                ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use this name (protected) as a variable name because: Cannot use this reserved word as a variable name in strict mode

function protected(){for(;;)switch(x){default:}}const protected=x
         ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 65 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 48 },
        source: ''
      },
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 9 },
          end: { line: 1, col: 9 },
          source: ''
        },
        name: 'protected'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 20 },
          end: { line: 1, col: 48 },
          source: ''
        },
        body: [
          {
            type: 'ForStatement',
            loc: {
              start: { line: 1, col: 21 },
              end: { line: 1, col: 47 },
              source: ''
            },
            init: null,
            test: null,
            update: null,
            body: {
              type: 'SwitchStatement',
              loc: {
                start: { line: 1, col: 28 },
                end: { line: 1, col: 47 },
                source: ''
              },
              discriminant: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 35 },
                  end: { line: 1, col: 36 },
                  source: ''
                },
                name: 'x'
              },
              cases: [
                {
                  type: 'SwitchCase',
                  loc: {
                    start: { line: 1, col: 38 },
                    end: { line: 1, col: 46 },
                    source: ''
                  },
                  test: null,
                  consequent: []
                }
              ]
            }
          }
        ]
      }
    },
    {
      type: 'VariableDeclaration',
      loc: {
        start: { line: 1, col: 54 },
        end: { line: 1, col: 65 },
        source: ''
      },
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc: {
            start: { line: 1, col: 54 },
            end: { line: 1, col: 65 },
            source: ''
          },
          id: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 54 },
              end: { line: 1, col: 54 },
              source: ''
            },
            name: 'protected'
          },
          init: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 64 },
              end: { line: 1, col: 65 },
              source: ''
            },
            name: 'x'
          }
        }
      ]
    }
  ]
}

tokens (25x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       IDENT IDENT PUNCTUATOR IDENT ASI
`````
