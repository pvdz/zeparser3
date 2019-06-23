# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/while_statement/func_expr_can_be_followed_by_x0060x003dx0060_sign_as_long_as_it_is_not_an_assignment.md

> :: while statement
>
> ::> func expr can be followed by `=` sign as long as it is not an assignment
>
> regression, was just checking for the next char to be = instead of whole token

## Input

`````js
while (function* () {} === x);
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 30 } },
  body: [
    {
      type: 'WhileStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 30 },
        source: ''
      },
      test: {
        type: 'BinaryExpression',
        loc: {
          start: { line: 1, col: 7 },
          end: { line: 1, col: 28 },
          source: ''
        },
        left: {
          type: 'FunctionExpression',
          loc: {
            start: { line: 1, col: 7 },
            end: { line: 1, col: 23 },
            source: ''
          },
          generator: true,
          async: false,
          id: null,
          params: [],
          body: {
            type: 'BlockStatement',
            loc: {
              start: { line: 1, col: 20 },
              end: { line: 1, col: 23 },
              source: ''
            },
            body: []
          }
        },
        operator: '===',
        right: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 27 },
            end: { line: 1, col: 28 },
            source: ''
          },
          name: 'x'
        }
      },
      body: {
        type: 'EmptyStatement',
        loc: {
          start: { line: 1, col: 29 },
          end: { line: 1, col: 30 },
          source: ''
        }
      }
    }
  ]
}

tokens (13x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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