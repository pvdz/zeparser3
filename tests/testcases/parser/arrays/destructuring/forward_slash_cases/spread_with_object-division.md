# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/arrays/destructuring/forward_slash_cases/spread_with_object-division.md

> :: arrays : destructuring : forward slash cases
>
> ::> spread with object-division

## Input

`````js
[...{x:y}/y]
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 12 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 12 },
        source: ''
      },
      expression: {
        type: 'ArrayExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 12 },
          source: ''
        },
        elements: [
          {
            type: 'SpreadElement',
            loc: {
              start: { line: 1, col: 1 },
              end: { line: 1, col: 11 },
              source: ''
            },
            argument: {
              type: 'BinaryExpression',
              loc: {
                start: { line: 1, col: 4 },
                end: { line: 1, col: 11 },
                source: ''
              },
              left: {
                type: 'ObjectExpression',
                loc: {
                  start: { line: 1, col: 4 },
                  end: { line: 1, col: 9 },
                  source: ''
                },
                properties: [
                  {
                    type: 'Property',
                    loc: {
                      start: { line: 1, col: 5 },
                      end: { line: 1, col: 8 },
                      source: ''
                    },
                    key: {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 5 },
                        end: { line: 1, col: 7 },
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
                        start: { line: 1, col: 7 },
                        end: { line: 1, col: 8 },
                        source: ''
                      },
                      name: 'y'
                    },
                    shorthand: false
                  }
                ]
              },
              operator: '/',
              right: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 10 },
                  end: { line: 1, col: 11 },
                  source: ''
                },
                name: 'y'
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (12x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR ASI
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