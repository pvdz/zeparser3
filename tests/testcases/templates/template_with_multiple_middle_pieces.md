# ZeParser parser test case

- Path: tests/testcases/templates/template_with_multiple_middle_pieces.md

> :: templates
>
> ::> template with multiple middle pieces

## Input

`````js
`foo ${a} and ${b} and ${c} baz`
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
  loc:{start:{line:1,column:0},end:{line:1,column:32},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:32},source:''},
      expression: {
        type: 'TemplateLiteral',
        loc:{start:{line:1,column:0},end:{line:1,column:32},source:''},
        expressions: [
          {
            type: 'Identifier',
            loc:{start:{line:1,column:7},end:{line:1,column:8},source:''},
            name: 'a'
          },
          {
            type: 'Identifier',
            loc:{start:{line:1,column:16},end:{line:1,column:17},source:''},
            name: 'b'
          },
          {
            type: 'Identifier',
            loc:{start:{line:1,column:25},end:{line:1,column:26},source:''},
            name: 'c'
          }
        ],
        quasis: [
          {
            type: 'TemplateElement',
            loc:{start:{line:1,column:1},end:{line:1,column:5},source:''},
            tail: false,
            value: { raw: 'foo ', cooked: 'foo ' }
          },
          {
            type: 'TemplateElement',
            loc:{start:{line:1,column:9},end:{line:1,column:14},source:''},
            tail: false,
            value: { raw: ' and ', cooked: ' and ' }
          },
          {
            type: 'TemplateElement',
            loc:{start:{line:1,column:18},end:{line:1,column:23},source:''},
            tail: false,
            value: { raw: ' and ', cooked: ' and ' }
          },
          {
            type: 'TemplateElement',
            loc:{start:{line:1,column:27},end:{line:1,column:31},source:''},
            tail: true,
            value: { raw: ' baz', cooked: ' baz' }
          }
        ]
      }
    }
  ]
}

tokens (9x):
       TICK_HEAD IDENT TICK_BODY IDENT TICK_BODY IDENT TICK_TAIL ASI
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