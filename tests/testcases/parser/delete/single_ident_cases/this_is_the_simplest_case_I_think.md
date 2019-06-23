# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/delete/single_ident_cases/this_is_the_simplest_case_I_think.md

> :: delete : single ident cases
>
> ::> this is the simplest case, I think

## Input

`````js
delete x
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 8 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 8 },
        source: ''
      },
      expression: {
        type: 'UnaryExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 8 },
          source: ''
        },
        operator: 'delete',
        prefix: true,
        argument: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 7 },
            end: { line: 1, col: 8 },
            source: ''
          },
          name: 'x'
        }
      }
    }
  ]
}

tokens (4x):
       IDENT IDENT ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot delete an identifier without tail, in strict mode

delete x
       ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._