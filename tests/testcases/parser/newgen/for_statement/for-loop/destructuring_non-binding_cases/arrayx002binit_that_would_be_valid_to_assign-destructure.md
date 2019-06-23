# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/for_statement/for-loop/destructuring_non-binding_cases/arrayx002binit_that_would_be_valid_to_assign-destructure.md

> :: for statement : for-loop : destructuring non-binding cases
>
> ::> array+init that would be valid to assign-destructure

## Input

`````js
for ([x.y] = z;;);
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
      type: 'ForStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 18 },
        source: ''
      },
      init: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 5 },
          end: { line: 1, col: 14 },
          source: ''
        },
        left: {
          type: 'ArrayPattern',
          loc: {
            start: { line: 1, col: 5 },
            end: { line: 1, col: 11 },
            source: ''
          },
          elements: [
            {
              type: 'MemberExpression',
              loc: {
                start: { line: 1, col: 5 },
                end: { line: 1, col: 9 },
                source: ''
              },
              object: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 6 },
                  end: { line: 1, col: 7 },
                  source: ''
                },
                name: 'x'
              },
              property: {
                type: 'Identifier',
                loc: {
                  start: { line: 1, col: 8 },
                  end: { line: 1, col: 8 },
                  source: ''
                },
                name: 'y'
              },
              computed: false
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 13 },
            end: { line: 1, col: 14 },
            source: ''
          },
          name: 'z'
        }
      },
      test: null,
      update: null,
      body: {
        type: 'EmptyStatement',
        loc: {
          start: { line: 1, col: 17 },
          end: { line: 1, col: 18 },
          source: ''
        }
      }
    }
  ]
}

tokens (14x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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