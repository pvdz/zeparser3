# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/labels/keywords/autogen.md
- Path: zeparser3/tests/testcases/parser/labels/keywords/gen/can_not_use_keywords_as_label_name

> :: test: can not use keywords as label name
> :: case: static

## Input


`````js
static: x
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 9 } },
  body: [
    {
      type: 'LabeledStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 9 },
        source: ''
      },
      label: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 6 },
          source: ''
        },
        name: 'static'
      },
      body: {
        type: 'ExpressionStatement',
        loc: {
          start: { line: 1, col: 8 },
          end: { line: 1, col: 9 },
          source: ''
        },
        expression: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 8 },
            end: { line: 1, col: 9 },
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
  Cannot use this name (static) as a variable name because: `static` is a reserved word in strict mode

static: x
      ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._