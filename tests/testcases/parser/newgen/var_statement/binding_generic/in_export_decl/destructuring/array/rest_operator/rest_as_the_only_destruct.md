# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/var_statement/binding_generic/in_export_decl/destructuring/array/rest_operator/rest_as_the_only_destruct.md

> :: var statement : binding generic : in export decl : destructuring : array : rest operator
>
> ::> rest as the only destruct

## Input

`````js
export var [...foo] = obj;
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

export var [...foo] = obj;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 26 } },
  body: [
    {
      type: 'ExportNamedDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 26 },
        source: ''
      },
      specifiers: [],
      declaration: {
        type: 'VariableDeclaration',
        loc: {
          start: { line: 1, col: 11 },
          end: { line: 1, col: 25 },
          source: ''
        },
        kind: 'var',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc: {
              start: { line: 1, col: 11 },
              end: { line: 1, col: 25 },
              source: ''
            },
            id: {
              type: 'ArrayPattern',
              loc: {
                start: { line: 1, col: 11 },
                end: { line: 1, col: 20 },
                source: ''
              },
              elements: [
                {
                  type: 'RestElement',
                  loc: {
                    start: { line: 1, col: 12 },
                    end: { line: 1, col: 18 },
                    source: ''
                  },
                  argument: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 15 },
                      end: { line: 1, col: 18 },
                      source: ''
                    },
                    name: 'foo'
                  }
                }
              ]
            },
            init: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 22 },
                end: { line: 1, col: 25 },
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

tokens (10x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._