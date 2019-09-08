# ZeParser parser test case

- Path: tests/testcases/parens/group/destructuring_obj_rest_property_for_assignments/regression_x002313_destructuring_with_arrx002fobj_literal_with_property/arr_pattern_with_dynamic_property.md

> :: parens : group : destructuring obj rest property for assignments : regression x002313 destructuring with arrx002fobj literal with property
>
> ::> arr pattern with dynamic property

## Input

`````js
({...[0][x]} = {});
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
  loc:{start:{line:1,column:0},end:{line:1,column:19},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:19},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:1},end:{line:1,column:17},source:''},
        left: {
          type: 'ObjectPattern',
          loc:{start:{line:1,column:1},end:{line:1,column:12},source:''},
          properties: [
            {
              type: 'RestElement',
              loc:{start:{line:1,column:2},end:{line:1,column:11},source:''},
              argument: {
                type: 'MemberExpression',
                loc:{start:{line:1,column:5},end:{line:1,column:11},source:''},
                object: {
                  type: 'ArrayExpression',
                  loc:{start:{line:1,column:5},end:{line:1,column:8},source:''},
                  elements: [
                    {
                      type: 'Literal',
                      loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
                      value: 0,
                      raw: '0'
                    }
                  ]
                },
                property: {
                  type: 'Identifier',
                  loc:{start:{line:1,column:9},end:{line:1,column:10},source:''},
                  name: 'x'
                },
                computed: true
              }
            }
          ]
        },
        operator: '=',
        right: {
          type: 'ObjectExpression',
          loc:{start:{line:1,column:15},end:{line:1,column:17},source:''},
          properties: []
        }
      }
    }
  ]
}

tokens (16x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR NUMBER_DEC
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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