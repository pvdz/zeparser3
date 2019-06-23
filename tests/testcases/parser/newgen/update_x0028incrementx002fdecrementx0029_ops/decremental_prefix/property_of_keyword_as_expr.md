# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/update_x0028incrementx002fdecrementx0029_ops/decremental_prefix/property_of_keyword_as_expr.md

> :: update (increment/decrement) ops : decremental prefix
>
> ::> property of keyword as expr

## Input

`````js
(--this.x)
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 10 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 10 },
        source: ''
      },
      expression: {
        type: 'UpdateExpression',
        loc: {
          start: { line: 1, col: 1 },
          end: { line: 1, col: 9 },
          source: ''
        },
        operator: '--',
        prefix: true,
        argument: {
          type: 'MemberExpression',
          loc: {
            start: { line: 1, col: 3 },
            end: { line: 1, col: 9 },
            source: ''
          },
          object: {
            type: 'ThisExpression',
            loc: {
              start: { line: 1, col: 3 },
              end: { line: 1, col: 7 },
              source: ''
            }
          },
          property: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 8 },
              end: { line: 1, col: 8 },
              source: ''
            },
            name: 'x'
          },
          computed: false
        }
      }
    }
  ]
}

tokens (8x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR ASI
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