# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/parens/group/regular_assignment_to_group/assignment_to_a_wrapped_this_property_silly_but_valid_2.md

> :: parens : group : regular assignment to group
>
> ::> assignment to a wrapped this property, silly but valid 2

## Input

`````js
(this[b]) = 1;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 14 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 14 },
        source: ''
      },
      expression: {
        type: 'AssignmentExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 13 },
          source: ''
        },
        left: {
          type: 'MemberExpression',
          loc: {
            start: { line: 1, col: 1 },
            end: { line: 1, col: 8 },
            source: ''
          },
          object: {
            type: 'ThisExpression',
            loc: {
              start: { line: 1, col: 1 },
              end: { line: 1, col: 5 },
              source: ''
            }
          },
          property: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 6 },
              end: { line: 1, col: 7 },
              source: ''
            },
            name: 'b'
          },
          computed: true
        },
        operator: '=',
        right: {
          type: 'Literal',
          loc: {
            start: { line: 1, col: 12 },
            end: { line: 1, col: 12 },
            source: ''
          },
          value: 1,
          raw: '1'
        }
      }
    }
  ]
}

tokens (10x):
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR NUMBER_DEC PUNCTUATOR
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