# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/in_export_decl/destructuring/array/rest_operator/rest_on_a_nested_destruct.md

> :: const statement : binding generic : in export decl : destructuring : array : rest operator
>
> ::> rest on a nested destruct

## Input

`````js
export const [...[foo, bar]] = obj;
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The `export` keyword can only be used with the module goal

export const [...[foo, bar]] = obj;
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 35 } },
  body: [
    {
      type: 'ExportNamedDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 35 },
        source: ''
      },
      specifiers: [],
      declaration: {
        type: 'VariableDeclaration',
        loc: {
          start: { line: 1, col: 13 },
          end: { line: 1, col: 34 },
          source: ''
        },
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc: {
              start: { line: 1, col: 13 },
              end: { line: 1, col: 34 },
              source: ''
            },
            id: {
              type: 'ArrayPattern',
              loc: {
                start: { line: 1, col: 13 },
                end: { line: 1, col: 29 },
                source: ''
              },
              elements: [
                {
                  type: 'RestElement',
                  loc: {
                    start: { line: 1, col: 14 },
                    end: { line: 1, col: 27 },
                    source: ''
                  },
                  argument: {
                    type: 'ArrayPattern',
                    loc: {
                      start: { line: 1, col: 17 },
                      end: { line: 1, col: 27 },
                      source: ''
                    },
                    elements: [
                      {
                        type: 'Identifier',
                        loc: {
                          start: { line: 1, col: 18 },
                          end: { line: 1, col: 21 },
                          source: ''
                        },
                        name: 'foo'
                      },
                      {
                        type: 'Identifier',
                        loc: {
                          start: { line: 1, col: 23 },
                          end: { line: 1, col: 26 },
                          source: ''
                        },
                        name: 'bar'
                      }
                    ]
                  }
                }
              ]
            },
            init: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 31 },
                end: { line: 1, col: 34 },
                source: ''
              },
              name: 'obj'
            }
          }
        ]
      },
      source: null
    }
  ]
}

tokens (14x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._