# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/unary_ops/generic_unary_tests_x0028GENERATEDx0029/batch_for_x0060typeofx0060/async_args/async_func.md

> :: unary ops : generic unary tests (GENERATED) : batch for `typeof` : async args
>
> ::> async func

## Input

`````js
typeof async function(){}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 25 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 25 },
        source: ''
      },
      expression: {
        type: 'UnaryExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 25 },
          source: ''
        },
        operator: 'typeof',
        prefix: true,
        argument: {
          type: 'FunctionExpression',
          loc: {
            start: { line: 1, col: 13 },
            end: { line: 1, col: 25 },
            source: ''
          },
          generator: false,
          async: true,
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            loc: {
              start: { line: 1, col: 23 },
              end: { line: 1, col: 25 },
              source: ''
            },
            body: []
          }
        }
      }
    }
  ]
}

tokens (9x):
       IDENT IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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