# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/break_statement/in_a_loop/break_without_label_inside_a_for-of.md

> :: break statement : in a loop
>
> ::> break without label inside a for-of

## Input

`````js
for (x of y) break
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 18 } },
  body: [
    {
      type: 'ForOfStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 18 },
        source: ''
      },
      left: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 5 },
          end: { line: 1, col: 7 },
          source: ''
        },
        name: 'x'
      },
      right: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 10 },
          end: { line: 1, col: 11 },
          source: ''
        },
        name: 'y'
      },
      await: false,
      body: {
        type: 'BreakStatement',
        loc: {
          start: { line: 1, col: 13 },
          end: { line: 1, col: 18 },
          source: ''
        },
        label: null
      }
    }
  ]
}

tokens (9x):
       IDENT PUNCTUATOR IDENT IDENT IDENT PUNCTUATOR IDENT ASI
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