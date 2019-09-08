# ZeParser parser test case

- Path: tests/testcases/group_or_arrow/group/regular_assignment_to_group/assignment_to_array_grouped_is_destructuring.md

> :: group or arrow : group : regular assignment to group
>
> ::> assignment to array grouped is destructuring
>
> the group is fine otherwise

## Input

`````js
([x, y] = z);
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
  loc:{start:{line:1,column:0},end:{line:1,column:13},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:13},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:1},end:{line:1,column:11},source:''},
        left: {
          type: 'ArrayPattern',
          loc:{start:{line:1,column:1},end:{line:1,column:7},source:''},
          elements: [
            {
              type: 'Identifier',
              loc:{start:{line:1,column:2},end:{line:1,column:3},source:''},
              name: 'x'
            },
            {
              type: 'Identifier',
              loc:{start:{line:1,column:5},end:{line:1,column:6},source:''},
              name: 'y'
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Identifier',
          loc:{start:{line:1,column:10},end:{line:1,column:11},source:''},
          name: 'z'
        }
      }
    }
  ]
}

tokens (11x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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