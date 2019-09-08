# ZeParser parser test case

- Path: tests/testcases/continue_statement/nesting/do-while/arrow/plain.md

> :: continue statement : nesting : do-while : arrow
>
> ::> plain

## Input

`````js
() => { do        continue    ; while(true);}
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
  loc:{start:{line:1,column:0},end:{line:1,column:45},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:45},source:''},
      expression: {
        type: 'ArrowFunctionExpression',
        loc:{start:{line:1,column:0},end:{line:1,column:45},source:''},
        params: [],
        id: null,
        generator: false,
        async: false,
        expression: false,
        body: {
          type: 'BlockStatement',
          loc:{start:{line:1,column:6},end:{line:1,column:45},source:''},
          body: [
            {
              type: 'DoWhileStatement',
              loc:{start:{line:1,column:8},end:{line:1,column:44},source:''},
              body: {
                type: 'ContinueStatement',
                loc:{start:{line:1,column:18},end:{line:1,column:31},source:''},
                label: null
              },
              test: {
                type: 'Literal',
                loc:{start:{line:1,column:38},end:{line:1,column:42},source:''},
                value: true,
                raw: 'true'
              }
            }
          ]
        }
      }
    }
  ]
}

tokens (15x):
       PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT IDENT
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR ASI
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