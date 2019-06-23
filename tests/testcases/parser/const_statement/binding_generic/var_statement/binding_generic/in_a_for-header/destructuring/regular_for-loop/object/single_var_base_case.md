# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/var_statement/binding_generic/in_a_for-header/destructuring/regular_for-loop/object/single_var_base_case.md

> :: const statement : binding generic : var statement : binding generic : in a for-header : destructuring : regular for-loop : object
>
> ::> single var base case

## Input

`````js
for (var {x} = obj;;);
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 22 } },
  body: [
    {
      type: 'ForStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 22 },
        source: ''
      },
      init: {
        type: 'VariableDeclaration',
        loc: {
          start: { line: 1, col: 9 },
          end: { line: 1, col: 18 },
          source: ''
        },
        kind: 'var',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc: {
              start: { line: 1, col: 9 },
              end: { line: 1, col: 18 },
              source: ''
            },
            id: {
              type: 'ObjectPattern',
              loc: {
                start: { line: 1, col: 9 },
                end: { line: 1, col: 13 },
                source: ''
              },
              properties: [
                {
                  type: 'Property',
                  loc: {
                    start: { line: 1, col: 10 },
                    end: { line: 1, col: 11 },
                    source: ''
                  },
                  key: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 10 },
                      end: { line: 1, col: 11 },
                      source: ''
                    },
                    name: 'x'
                  },
                  kind: 'init',
                  method: false,
                  computed: false,
                  value: {
                    type: 'Identifier',
                    loc: {
                      start: { line: 1, col: 10 },
                      end: { line: 1, col: 11 },
                      source: ''
                    },
                    name: 'x'
                  },
                  shorthand: true
                }
              ]
            },
            init: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 15 },
                end: { line: 1, col: 18 },
                source: ''
              },
              name: 'obj'
            }
          }
        ]
      },
      test: null,
      update: null,
      body: {
        type: 'EmptyStatement',
        loc: {
          start: { line: 1, col: 21 },
          end: { line: 1, col: 22 },
          source: ''
        }
      }
    }
  ]
}

tokens (13x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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