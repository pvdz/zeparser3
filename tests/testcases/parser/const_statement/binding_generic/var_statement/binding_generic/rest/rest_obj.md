# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/var_statement/binding_generic/rest/rest_obj.md

> :: const statement : binding generic : var statement : binding generic : rest
>
> ::> rest obj

## Input

`````js
var {...x} = y
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 14 } },
  body: [
    {
      type: 'VariableDeclaration',
      loc: {
        start: { line: 1, col: 4 },
        end: { line: 1, col: 14 },
        source: ''
      },
      kind: 'var',
      declarations: [
        {
          type: 'VariableDeclarator',
          loc: {
            start: { line: 1, col: 4 },
            end: { line: 1, col: 14 },
            source: ''
          },
          id: {
            type: 'ObjectPattern',
            loc: {
              start: { line: 1, col: 4 },
              end: { line: 1, col: 11 },
              source: ''
            },
            properties: [
              {
                type: 'RestElement',
                loc: {
                  start: { line: 1, col: 5 },
                  end: { line: 1, col: 9 },
                  source: ''
                },
                argument: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 8 },
                    end: { line: 1, col: 9 },
                    source: ''
                  },
                  name: 'x'
                }
              }
            ]
          },
          init: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 13 },
              end: { line: 1, col: 14 },
              source: ''
            },
            name: 'y'
          }
        }
      ]
    }
  ]
}

tokens (9x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._