# ZeParser parser autogenerated test case

- From: tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/autogen.md
- Path: tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/obj_method_as_param_name_wx002fo_directive/private.md

> :: strict mode : header requirements for directive in body : func decl : gen : obj method as param name wx002fo directive
>
> ::> private

## Input


`````js
f = {
  c(private){ }
}
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
  loc:{start:{line:1,column:0},end:{line:3,column:1},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:3,column:1},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,column:0},end:{line:3,column:1},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,column:0},end:{line:1,column:1},source:''},
          name: 'f'
        },
        operator: '=',
        right: {
          type: 'ObjectExpression',
          loc:{start:{line:1,column:4},end:{line:3,column:1},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:2,column:2},end:{line:2,column:15},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:2,column:2},end:{line:2,column:3},source:''},
                name: 'c'
              },
              kind: 'init',
              method: true,
              computed: false,
              value: {
                type: 'FunctionExpression',
                loc:{start:{line:2,column:2},end:{line:2,column:15},source:''},
                generator: false,
                async: false,
                id: null,
                params: [
                  {
                    type: 'Identifier',
                    loc:{start:{line:2,column:4},end:{line:2,column:11},source:''},
                    name: 'private'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  loc:{start:{line:2,column:12},end:{line:2,column:15},source:''},
                  body: []
                }
              },
              shorthand: false
            }
          ]
        }
      }
    }
  ]
}

tokens (12x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use this name (private) as a variable name because: Cannot use this reserved word as a variable name in strict mode

f = {
  c(private){ }
    ^------- error

}
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._