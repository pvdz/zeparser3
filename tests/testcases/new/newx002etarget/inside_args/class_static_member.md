# ZeParser parser test case

- Path: tests/testcases/new/newx002etarget/inside_args/class_static_member.md

> :: new : newx002etarget : inside args
>
> ::> class static member

## Input

`````js
class A {static a(x=new.target){}}
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
  loc:{start:{line:1,column:0},end:{line:1,column:34},source:''},
  body: [
    {
      type: 'ClassDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:34},source:''},
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
        name: 'A'
      },
      superClass: null,
      body: {
        type: 'ClassBody',
        loc:{start:{line:1,column:8},end:{line:1,column:34},source:''},
        body: [
          {
            type: 'MethodDefinition',
            loc:{start:{line:1,column:9},end:{line:1,column:33},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,column:16},end:{line:1,column:17},source:''},
              name: 'a'
            },
            static: true,
            computed: false,
            kind: 'method',
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,column:9},end:{line:1,column:33},source:''},
              generator: false,
              async: false,
              id: null,
              params: [
                {
                  type: 'AssignmentPattern',
                  loc:{start:{line:1,column:18},end:{line:1,column:30},source:''},
                  left: {
                    type: 'Identifier',
                    loc:{start:{line:1,column:18},end:{line:1,column:19},source:''},
                    name: 'x'
                  },
                  right: {
                    type: 'MetaProperty',
                    loc:{start:{line:1,column:20},end:{line:1,column:30},source:''},
                    meta: {
                      type: 'Identifier',
                      loc:{start:{line:1,column:20},end:{line:1,column:23},source:''},
                      name: 'new'
                    },
                    property: {
                      type: 'Identifier',
                      loc:{start:{line:1,column:24},end:{line:1,column:30},source:''},
                      name: 'target'
                    }
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:31},end:{line:1,column:33},source:''},
                body: []
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (16x):
       IDENT IDENT PUNCTUATOR IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR
       PUNCTUATOR
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