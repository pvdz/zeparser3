# ZeParser parser test case

- Path: tests/testcases/classes/static_as_a_name/method_named_static.md

> :: classes : static as a name
>
> ::> method named static

## Input

`````js
class x{   static(){}   }
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
  loc:{start:{line:1,column:0},end:{line:1,column:25},source:''},
  body: [
    {
      type: 'ClassDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:25},source:''},
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
        name: 'x'
      },
      superClass: null,
      body: {
        type: 'ClassBody',
        loc:{start:{line:1,column:7},end:{line:1,column:25},source:''},
        body: [
          {
            type: 'MethodDefinition',
            loc:{start:{line:1,column:11},end:{line:1,column:21},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,column:11},end:{line:1,column:17},source:''},
              name: 'static'
            },
            static: false,
            computed: false,
            kind: 'method',
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,column:11},end:{line:1,column:21},source:''},
              generator: false,
              async: false,
              id: null,
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:19},end:{line:1,column:21},source:''},
                body: []
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (10x):
       IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR
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