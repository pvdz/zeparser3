# ZeParser parser test case

- Path: tests/testcases/parens/group/invalid_arrow_header_things_that_are_valid_in_a_group/x005byieldx005d_in_group.md

> :: parens : group : invalid arrow header things that are valid in a group
>
> ::> x005byieldx005d in group

## Input

`````js
(yield);
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
  loc:{start:{line:1,column:0},end:{line:1,column:8},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:8},source:''},
      expression: {
        type: 'Identifier',
        loc:{start:{line:1,column:1},end:{line:1,column:6},source:''},
        name: 'yield'
      }
    }
  ]
}

tokens (5x):
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use `yield` outside of generator functions when in strict mode

(yield);
      ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._