# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/parens/arrow/regressions_x002312_obj_pattern_with_computed_props/object_pattern_alias_can_be_property_too.md

> :: parens : arrow : regressions #12, obj pattern with computed props
>
> ::> object pattern alias can be property too

## Input

`````js
({a, a:a, a:a=a, [a]:{a}, a:some_call()[a], a:this.a} = 0);
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
  loc:{start:{line:1,col:0},end:{line:1,col:59},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,col:0},end:{line:1,col:59},source:''},
      expression: {
        type: 'AssignmentExpression',
        loc:{start:{line:1,col:1},end:{line:1,col:57},source:''},
        left: {
          type: 'ObjectPattern',
          loc:{start:{line:1,col:1},end:{line:1,col:54},source:''},
          properties: [
            {
              type: 'Property',
              loc:{start:{line:1,col:2},end:{line:1,col:3},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:2},end:{line:1,col:3},source:''},
                name: 'a'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,col:2},end:{line:1,col:3},source:''},
                name: 'a'
              },
              shorthand: true
            },
            {
              type: 'Property',
              loc:{start:{line:1,col:5},end:{line:1,col:8},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:5},end:{line:1,col:7},source:''},
                name: 'a'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'Identifier',
                loc:{start:{line:1,col:7},end:{line:1,col:8},source:''},
                name: 'a'
              },
              shorthand: false
            },
            {
              type: 'Property',
              loc:{start:{line:1,col:10},end:{line:1,col:15},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:10},end:{line:1,col:12},source:''},
                name: 'a'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'AssignmentPattern',
                loc:{start:{line:1,col:12},end:{line:1,col:15},source:''},
                left: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:12},end:{line:1,col:13},source:''},
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:14},end:{line:1,col:15},source:''},
                  name: 'a'
                }
              },
              shorthand: false
            },
            {
              type: 'Property',
              loc:{start:{line:1,col:17},end:{line:1,col:24},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:18},end:{line:1,col:19},source:''},
                name: 'a'
              },
              kind: 'init',
              method: false,
              computed: true,
              value: {
                type: 'ObjectPattern',
                loc:{start:{line:1,col:21},end:{line:1,col:24},source:''},
                properties: [
                  {
                    type: 'Property',
                    loc:{start:{line:1,col:22},end:{line:1,col:23},source:''},
                    key: {
                      type: 'Identifier',
                      loc:{start:{line:1,col:22},end:{line:1,col:23},source:''},
                      name: 'a'
                    },
                    kind: 'init',
                    method: false,
                    computed: false,
                    value: {
                      type: 'Identifier',
                      loc:{start:{line:1,col:22},end:{line:1,col:23},source:''},
                      name: 'a'
                    },
                    shorthand: true
                  }
                ]
              },
              shorthand: false
            },
            {
              type: 'Property',
              loc:{start:{line:1,col:26},end:{line:1,col:42},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:26},end:{line:1,col:28},source:''},
                name: 'a'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'MemberExpression',
                loc:{start:{line:1,col:28},end:{line:1,col:42},source:''},
                object: {
                  type: 'CallExpression',
                  loc:{start:{line:1,col:28},end:{line:1,col:39},source:''},
                  callee: {
                    type: 'Identifier',
                    loc:{start:{line:1,col:28},end:{line:1,col:37},source:''},
                    name: 'some_call'
                  },
                  arguments: []
                },
                property: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:40},end:{line:1,col:41},source:''},
                  name: 'a'
                },
                computed: true
              },
              shorthand: false
            },
            {
              type: 'Property',
              loc:{start:{line:1,col:44},end:{line:1,col:52},source:''},
              key: {
                type: 'Identifier',
                loc:{start:{line:1,col:44},end:{line:1,col:46},source:''},
                name: 'a'
              },
              kind: 'init',
              method: false,
              computed: false,
              value: {
                type: 'MemberExpression',
                loc:{start:{line:1,col:46},end:{line:1,col:52},source:''},
                object: {
                  type: 'ThisExpression',
                  loc:{start:{line:1,col:46},end:{line:1,col:50},source:''}
                },
                property: {
                  type: 'Identifier',
                  loc:{start:{line:1,col:51},end:{line:1,col:51},source:''},
                  name: 'a'
                },
                computed: false
              },
              shorthand: false
            }
          ]
        },
        operator: '=',
        right: {
          type: 'Literal',
          loc:{start:{line:1,col:56},end:{line:1,col:56},source:''},
          value: 0,
          raw: '0'
        }
      }
    }
  ]
}

tokens (42x):
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       NUMBER_DEC PUNCTUATOR PUNCTUATOR
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