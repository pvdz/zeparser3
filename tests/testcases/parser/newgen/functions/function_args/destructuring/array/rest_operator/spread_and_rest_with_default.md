# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/functions/function_args/destructuring/array/rest_operator/spread_and_rest_with_default.md

> :: functions : function args : destructuring : array : rest operator
>
> ::> spread and rest with default

## Input

`````js
function f( [a=[...b], ...c] = obj){}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 37 } },
  body: [
    {
      type: 'FunctionDeclaration',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 37 },
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
        name: 'f'
      },
      params: [
        {
          type: 'AssignmentPattern',
          loc: {
            start: { line: 1, col: 12 },
            end: { line: 1, col: 34 },
            source: ''
          },
          left: {
            type: 'ArrayPattern',
            loc: {
              start: { line: 1, col: 12 },
              end: { line: 1, col: 29 },
              source: ''
            },
            elements: [
              {
                type: 'AssignmentPattern',
                loc: {
                  start: { line: 1, col: 12 },
                  end: { line: 1, col: 21 },
                  source: ''
                },
                left: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 13 },
                    end: { line: 1, col: 14 },
                    source: ''
                  },
                  name: 'a'
                },
                right: {
                  type: 'ArrayExpression',
                  loc: {
                    start: { line: 1, col: 15 },
                    end: { line: 1, col: 21 },
                    source: ''
                  },
                  elements: [
                    {
                      type: 'SpreadElement',
                      loc: {
                        start: { line: 1, col: 16 },
                        end: { line: 1, col: 20 },
                        source: ''
                      },
                      argument: {
                        type: 'Identifier',
                        loc: {
                          start: { line: 1, col: 19 },
                          end: { line: 1, col: 20 },
                          source: ''
                        },
                        name: 'b'
                      }
                    }
                  ]
                }
              },
              {
                type: 'RestElement',
                loc: {
                  start: { line: 1, col: 23 },
                  end: { line: 1, col: 27 },
                  source: ''
                },
                argument: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 26 },
                    end: { line: 1, col: 27 },
                    source: ''
                  },
                  name: 'c'
                }
              }
            ]
          },
          right: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 31 },
              end: { line: 1, col: 34 },
              source: ''
            },
            name: 'obj'
          }
        }
      ],
      body: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 35 },
          end: { line: 1, col: 37 },
          source: ''
        },
        body: []
      }
    }
  ]
}

tokens (20x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
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