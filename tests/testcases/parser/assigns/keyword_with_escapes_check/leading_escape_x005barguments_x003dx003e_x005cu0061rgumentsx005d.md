# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/assigns/keyword_with_escapes_check/leading_escape_x005barguments_x003dx003e_x005cu0061rgumentsx005d.md

> :: assigns : keyword with escapes check
>
> ::> leading escape [arguments => \u0061rguments]

## Input

`````js
(\u0061rguments = "sentinal 432432")
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
  loc:{start:{line:1,col:0},end:{line:1,col:36},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:36},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:1},end:{line:1,col:35},source:''},
        left: {
          type: 'Identifier',
          loc:{start:{line:1,col:1},end:{line:1,col:16},source:''},
          name: 'arguments'
        },
        operator: '=',
        right: {
          type: 'Literal',
          loc:{start:{line:1,col:18},end:{line:1,col:18},source:''},
          value: 'sentinal 432432',
          raw: '"sentinal 432432"'
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

`````
throws: Parser error!
  Cannot use this name (\u0061rguments) as a variable name because: Cannot create a binding named `arguments` in strict mode

(\u0061rguments = "sentinal 432432")
                ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._