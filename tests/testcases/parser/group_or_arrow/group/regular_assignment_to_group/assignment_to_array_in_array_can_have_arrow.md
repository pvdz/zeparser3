# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/parens/group/regular_assignment_to_group/assignment_to_array_in_array_can_have_arrow.md

> :: parens : group : regular assignment to group
>
> ::> assignment to array in array can have arrow
>
> the group is fine otherwise

## Input

`````js
([[x, y] = z]) => x;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 20 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 20 },
        source: ''
      },
      expression: {
        type: 'ArrowFunctionExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 19 },
          source: ''
        },
        params: [
          {
            type: 'ArrayPattern',
            loc: {
              start: { line: 1, col: 1 },
              end: { line: 1, col: 13 },
              source: ''
            },
            elements: [
              {
                type: 'AssignmentPattern',
                loc: {
                  start: { line: 1, col: 2 },
                  end: { line: 1, col: 12 },
                  source: ''
                },
                left: {
                  type: 'ArrayPattern',
                  loc: {
                    start: { line: 1, col: 2 },
                    end: { line: 1, col: 9 },
                    source: ''
                  },
                  elements: [
                    {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 3 },
                        end: { line: 1, col: 4 },
                        source: ''
                      },
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      loc: {
                        start: { line: 1, col: 6 },
                        end: { line: 1, col: 7 },
                        source: ''
                      },
                      name: 'y'
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 11 },
                    end: { line: 1, col: 12 },
                    source: ''
                  },
                  name: 'z'
                }
              }
            ]
          }
        ],
        id: null,
        generator: false,
        async: false,
        expression: true,
        body: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 18 },
            end: { line: 1, col: 19 },
            source: ''
          },
          name: 'x'
        }
      }
    }
  ]
}

tokens (15x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR
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