# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/assigns/assigning_to_keyword/assignment_to_x005bfoox005d.md

> :: assigns : assigning to keyword
>
> ::> assignment to [foo]

## Input

`````js
(foo = "sentinal 453188")
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
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 1 },
          end: { line: 1, col: 24 },
          source: ''
        },
        left: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 1 },
            end: { line: 1, col: 5 },
            source: ''
          },
          name: 'foo'
        },
        operator: '=',
        right: {
          type: 'Literal',
          loc: {
            start: { line: 1, col: 7 },
            end: { line: 1, col: 7 },
            source: ''
          },
          value: 'sentinal 453188',
          raw: '"sentinal 453188"'
        }
      }
    }
  ]
}

tokens (7x):
       PUNCTUATOR IDENT PUNCTUATOR STRING_DOUBLE PUNCTUATOR ASI
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