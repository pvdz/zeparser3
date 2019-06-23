# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/break_statement/in_a_switch/break_without_label_inside_a_default.md

> :: break statement : in a switch
>
> ::> break without label inside a default

## Input

`````js
switch (x) { default: break; }
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
      type: 'SwitchStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 30 },
        source: ''
      },
      discriminant: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 8 },
          end: { line: 1, col: 9 },
          source: ''
        },
        name: 'x'
      },
      cases: [
        {
          type: 'SwitchCase',
          loc: {
            start: { line: 1, col: 13 },
            end: { line: 1, col: 29 },
            source: ''
          },
          test: null,
          consequent: [
            {
              type: 'BreakStatement',
              loc: {
                start: { line: 1, col: 22 },
                end: { line: 1, col: 29 },
                source: ''
              },
              label: null
            }
          ]
        }
      ]
    }
  ]
}

tokens (11x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR
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