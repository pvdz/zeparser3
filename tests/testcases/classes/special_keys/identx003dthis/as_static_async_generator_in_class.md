# ZeParser parser test case

- Path: tests/testcases/classes/special_keys/identx003dthis/as_static_async_generator_in_class.md

> :: classes : special keys : identx003dthis
>
> ::> as static async generator in class

## Input

`````js
class x {static async * this(){}}
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
  loc:{start:{line:1,column:0},end:{line:1,column:33},source:''},
  body: [
    {
      type: 'ClassDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:33},source:''},
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
        name: 'x'
      },
      superClass: null,
      body: {
        type: 'ClassBody',
        loc:{start:{line:1,column:8},end:{line:1,column:33},source:''},
        body: [
          {
            type: 'MethodDefinition',
            loc:{start:{line:1,column:9},end:{line:1,column:32},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,column:24},end:{line:1,column:28},source:''},
              name: 'this'
            },
            static: true,
            computed: false,
            kind: 'method',
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,column:9},end:{line:1,column:32},source:''},
              generator: true,
              async: true,
              id: null,
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:30},end:{line:1,column:32},source:''},
                body: []
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (13x):
       IDENT IDENT PUNCTUATOR IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR
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