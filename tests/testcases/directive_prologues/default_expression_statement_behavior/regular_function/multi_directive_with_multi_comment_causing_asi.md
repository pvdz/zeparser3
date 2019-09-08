# ZeParser parser test case

- Path: tests/testcases/directive_prologues/default_expression_statement_behavior/regular_function/multi_directive_with_multi_comment_causing_asi.md

> :: directive prologues : default expression statement behavior : regular function
>
> ::> multi directive with multi comment causing asi

## Input

`````js
function f(){
"foo"/*abc
xyz*/"bar";
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
  loc:{start:{line:1,column:0},end:{line:4,column:1},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,column:0},end:{line:4,column:1},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:9},end:{line:1,column:10},source:''},
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,column:12},end:{line:4,column:1},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:2,column:0},end:{line:2,column:5},source:''},
            expression: {
              type: 'Literal',
              loc:{start:{line:2,column:0},end:{line:2,column:5},source:''},
              value: 'foo',
              raw: '"foo"'
            },
            directive: 'foo'
          },
          {
            type: 'ExpressionStatement',
            loc:{start:{line:3,column:5},end:{line:3,column:11},source:''},
            expression: {
              type: 'Literal',
              loc:{start:{line:3,column:5},end:{line:3,column:10},source:''},
              value: 'bar',
              raw: '"bar"'
            },
            directive: 'bar'
          }
        ]
      }
    }
  ]
}

tokens (11x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR STRING_DOUBLE ASI
       STRING_DOUBLE PUNCTUATOR PUNCTUATOR
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