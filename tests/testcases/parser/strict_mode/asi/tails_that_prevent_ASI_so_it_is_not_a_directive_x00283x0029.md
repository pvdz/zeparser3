# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00283x0029.md

> :: strict mode : asi
>
> ::> tails that prevent ASI so it is not a directive (3)

## Input

`````js
function f(){ "use strict" 
 /* suffix = */ `x`; eval = 1; }
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
  loc:{start:{line:1,col:0},end:{line:2,col:32},source:''},
  body: [
    {
      type: 'FunctionDeclaration',
      loc:{start:{line:1,col:0},end:{line:2,col:32},source:''},
      generator: false,
      async: false,
      id: {
        type: 'Identifier',
        loc:{start:{line:1,col:9},end:{line:1,col:9},source:''},
        name: 'f'
      },
      params: [],
      body: {
        type: 'BlockStatement',
        loc:{start:{line:1,col:12},end:{line:2,col:32},source:''},
        body: [
          {
            type: 'ExpressionStatement',
            loc:{start:{line:1,col:14},end:{line:2,col:21},source:''},
            expression: {
              type: 'TaggedTemplateExpression',
              loc:{start:{line:1,col:14},end:{line:2,col:19},source:''},
              tag: {
                type: 'Literal',
                loc:{start:{line:1,col:14},end:{line:1,col:14},source:''},
                value: 'use strict',
                raw: '"use strict"'
              },
              quasi: {
                type: 'TemplateLiteral',
                loc:{start:{line:2,col:16},end:{line:2,col:19},source:''},
                expressions: [],
                quasis: [
                  {
                    type: 'TemplateElement',
                    loc:{start:{line:2,col:16},end:{line:2,col:16},source:''},
                    value: { raw: 'x', cooked: '<TODO>' },
                    tail: true
                  }
                ]
              }
            }
          },
          {
            type: 'ExpressionStatement',
            loc:{start:{line:2,col:21},end:{line:2,col:31},source:''},
            expression: {
              type: 'AssignmentExpression',
              loc:{start:{line:2,col:21},end:{line:2,col:29},source:''},
              left: {
                type: 'Identifier',
                loc:{start:{line:2,col:21},end:{line:2,col:26},source:''},
                name: 'eval'
              },
              operator: '=',
              right: {
                type: 'Literal',
                loc:{start:{line:2,col:28},end:{line:2,col:28},source:''},
                value: 1,
                raw: '1'
              }
            }
          }
        ]
      }
    }
  ]
}

tokens (14x):
       IDENT IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR STRING_DOUBLE
       TICK_PURE PUNCTUATOR IDENT PUNCTUATOR NUMBER_DEC PUNCTUATOR
       PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot assign to `eval` and `arguments` in strict mode

function f(){ "use strict"
 /* suffix = */ `x`; eval = 1; }
                          ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._