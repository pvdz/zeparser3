# ZeParser parser test case

- Path: tests/testcases/super_keyword/call/weird_places/in_class_in_dynamic_property.md

> :: super keyword : call : weird places
>
> ::> in class in dynamic property
## PASS

## Input

`````js
class A extends B { constructor(){ return x[super()]; }}
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
  loc:{start:{line:1,column:0},end:{line:1,column:56},source:''},
  body: [
    {
      type: 'ClassDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:56},source:''},
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:6},end:{line:1,column:7},source:''},
        name: 'A'
      },
      superClass: {
        type: 'Identifier',
        loc:{start:{line:1,column:16},end:{line:1,column:17},source:''},
        name: 'B'
      },
      body: {
        type: 'ClassBody',
        loc:{start:{line:1,column:18},end:{line:1,column:56},source:''},
        body: [
          {
            type: 'MethodDefinition',
            loc:{start:{line:1,column:20},end:{line:1,column:55},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,column:20},end:{line:1,column:31},source:''},
              name: 'constructor'
            },
            static: false,
            computed: false,
            kind: 'constructor',
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,column:20},end:{line:1,column:55},source:''},
              generator: false,
              async: false,
              id: null,
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:33},end:{line:1,column:55},source:''},
                body: [
                  {
                    type: 'ReturnStatement',
                    loc:{start:{line:1,column:35},end:{line:1,column:53},source:''},
                    argument: {
                      type: 'MemberExpression',
                      loc:{start:{line:1,column:42},end:{line:1,column:52},source:''},
                      object: {
                        type: 'Identifier',
                        loc:{start:{line:1,column:42},end:{line:1,column:43},source:''},
                        name: 'x'
                      },
                      property: {
                        type: 'CallExpression',
                        loc:{start:{line:1,column:44},end:{line:1,column:51},source:''},
                        callee: {
                          type: 'Super',
                          loc:{start:{line:1,column:44},end:{line:1,column:49},source:''}
                        },
                        arguments: []
                      },
                      computed: true
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (20x):
       IDENT IDENT IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
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

## AST Printer

Printer output different from input [sloppy]:

````js
class A extends (B) {constructor(){return (x)[super()];};}
````

Produces same AST