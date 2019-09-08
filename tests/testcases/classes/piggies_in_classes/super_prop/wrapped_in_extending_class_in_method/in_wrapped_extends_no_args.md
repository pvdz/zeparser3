# ZeParser parser test case

- Path: tests/testcases/classes/piggies_in_classes/super_prop/wrapped_in_extending_class_in_method/in_wrapped_extends_no_args.md

> :: classes : piggies in classes : super prop : wrapped in extending class in method
>
> ::> in wrapped extends no args

## Input

`````js
class outer extends S { meh(){  class x extends feh(super.foo) { }  }}
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
  loc:{start:{line:1,column:0},end:{line:1,column:70},source:''},
  body: [
    {
      type: 'ClassDeclaration',
      loc:{start:{line:1,column:0},end:{line:1,column:70},source:''},
      id: {
        type: 'Identifier',
        loc:{start:{line:1,column:6},end:{line:1,column:11},source:''},
        name: 'outer'
      },
      superClass: {
        type: 'Identifier',
        loc:{start:{line:1,column:20},end:{line:1,column:21},source:''},
        name: 'S'
      },
      body: {
        type: 'ClassBody',
        loc:{start:{line:1,column:22},end:{line:1,column:70},source:''},
        body: [
          {
            type: 'MethodDefinition',
            loc:{start:{line:1,column:24},end:{line:1,column:69},source:''},
            key: {
              type: 'Identifier',
              loc:{start:{line:1,column:24},end:{line:1,column:27},source:''},
              name: 'meh'
            },
            static: false,
            computed: false,
            kind: 'method',
            value: {
              type: 'FunctionExpression',
              loc:{start:{line:1,column:24},end:{line:1,column:69},source:''},
              generator: false,
              async: false,
              id: null,
              params: [],
              body: {
                type: 'BlockStatement',
                loc:{start:{line:1,column:29},end:{line:1,column:69},source:''},
                body: [
                  {
                    type: 'ClassDeclaration',
                    loc:{start:{line:1,column:32},end:{line:1,column:66},source:''},
                    id: {
                      type: 'Identifier',
                      loc:{start:{line:1,column:38},end:{line:1,column:39},source:''},
                      name: 'x'
                    },
                    superClass: {
                      type: 'CallExpression',
                      loc:{start:{line:1,column:48},end:{line:1,column:62},source:''},
                      callee: {
                        type: 'Identifier',
                        loc:{start:{line:1,column:48},end:{line:1,column:51},source:''},
                        name: 'feh'
                      },
                      arguments: [
                        {
                          type: 'MemberExpression',
                          loc:{start:{line:1,column:52},end:{line:1,column:61},source:''},
                          object: {
                            type: 'Super',
                            loc:{start:{line:1,column:52},end:{line:1,column:57},source:''}
                          },
                          property: {
                            type: 'Identifier',
                            loc:{start:{line:1,column:58},end:{line:1,column:61},source:''},
                            name: 'foo'
                          },
                          computed: false
                        }
                      ]
                    },
                    body: {
                      type: 'ClassBody',
                      loc:{start:{line:1,column:63},end:{line:1,column:66},source:''},
                      body: []
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

tokens (23x):
       IDENT IDENT IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR IDENT IDENT IDENT IDENT PUNCTUATOR IDENT PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR PUNCTUATOR
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