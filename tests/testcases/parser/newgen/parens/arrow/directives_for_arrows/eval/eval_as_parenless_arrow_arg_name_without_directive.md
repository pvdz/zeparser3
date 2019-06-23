# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/parens/arrow/directives_for_arrows/eval/eval_as_parenless_arrow_arg_name_without_directive.md

> :: parens : arrow : directives for arrows : eval
>
> ::> eval as parenless arrow arg name without directive

## Input

`````js
eval => {}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 10 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 10 },
        source: ''
      },
      expression: {
        type: 'ArrowFunctionExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 10 },
          source: ''
        },
        params: [
          {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 0 },
              end: { line: 1, col: 5 },
              source: ''
            },
            name: 'eval'
          }
        ],
        id: null,
        generator: false,
        async: false,
        expression: false,
        body: {
          type: 'BlockStatement',
          loc: {
            start: { line: 1, col: 8 },
            end: { line: 1, col: 10 },
            source: ''
          },
          body: []
        }
      }
    }
  ]
}

tokens (6x):
       IDENT PUNCTUATOR PUNCTUATOR PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Can not use `eval` as arg name in strict mode

eval => {}
     ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._