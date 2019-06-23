# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/in_a_for-header/destructuring/for-in/array/rest_operator/second_param_rest_on_a_nested_destruct.md

> :: const statement : binding generic : in a for-header : destructuring : for-in : array : rest operator
>
> ::> second param rest on a nested destruct

## Input

`````js
for (const [x, ...[foo, bar]] in obj);
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 38 } },
  body: [
    {
      type: 'ForInStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 38 },
        source: ''
      },
      left: {
        type: 'VariableDeclaration',
        loc: {
          start: { line: 1, col: 11 },
          end: { line: 1, col: 30 },
          source: ''
        },
        kind: 'const',
        declarations: [
          {
            type: 'VariableDeclarator',
            loc: {
              start: { line: 1, col: 11 },
              end: { line: 1, col: 30 },
              source: ''
            },
            id: {
              type: 'ArrayPattern',
              loc: {
                start: { line: 1, col: 11 },
                end: { line: 1, col: 30 },
                source: ''
              },
              elements: [
                {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 12 },
                    end: { line: 1, col: 13 },
                    source: ''
                  },
                  name: 'x'
                },
                {
                  type: 'RestElement',
                  loc: {
                    start: { line: 1, col: 15 },
                    end: { line: 1, col: 28 },
                    source: ''
                  },
                  argument: {
                    type: 'ArrayPattern',
                    loc: {
                      start: { line: 1, col: 18 },
                      end: { line: 1, col: 28 },
                      source: ''
                    },
                    elements: [
                      {
                        type: 'Identifier',
                        loc: {
                          start: { line: 1, col: 19 },
                          end: { line: 1, col: 22 },
                          source: ''
                        },
                        name: 'foo'
                      },
                      {
                        type: 'Identifier',
                        loc: {
                          start: { line: 1, col: 24 },
                          end: { line: 1, col: 27 },
                          source: ''
                        },
                        name: 'bar'
                      }
                    ]
                  }
                }
              ]
            },
            init: null
          }
        ]
      },
      right: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 33 },
          end: { line: 1, col: 36 },
          source: ''
        },
        name: 'obj'
      },
      body: {
        type: 'EmptyStatement',
        loc: {
          start: { line: 1, col: 37 },
          end: { line: 1, col: 38 },
          source: ''
        }
      }
    }
  ]
}

tokens (18x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       IDENT PUNCTUATOR PUNCTUATOR
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