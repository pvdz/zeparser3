# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/labels/keywords/autogen.md
- Path: zeparser3/tests/testcases/parser/labels/keywords/gen/can_not_use_keywords_as_label_name

> :: test: can not use keywords as label name
> :: case: let

## Input


`````js
let: x
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 6 } },
  body: [
    {
      type: 'LabeledStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 6 },
        source: ''
      },
      label: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 3 },
          source: ''
        },
        name: 'let'
      },
      body: {
        type: 'ExpressionStatement',
        loc: {
          start: { line: 1, col: 5 },
          end: { line: 1, col: 6 },
          source: ''
        },
        expression: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 5 },
            end: { line: 1, col: 6 },
            source: ''
          },
          name: 'x'
        }
      }
    }
  ]
}

tokens (5x):
       IDENT PUNCTUATOR IDENT ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Let declaration missing binding names and `let` cannot be a regular var name in strict mode

let: x
   ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._