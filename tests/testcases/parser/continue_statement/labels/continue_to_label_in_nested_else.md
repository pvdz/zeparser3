# ZeParser parser test case

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/continue_statement/labels/continue_to_label_in_nested_else.md

> :: continue statement : labels
>
> ::> continue to label in nested else

## Input

`````js
foo: while (true) if (x); else continue foo;
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 44 } },
  body: [
    {
      type: 'LabeledStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 44 },
        source: ''
      },
      label: {
        type: 'Identifier',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 3 },
          source: ''
        },
        name: 'foo'
      },
      body: {
        type: 'WhileStatement',
        loc: {
          start: { line: 1, col: 5 },
          end: { line: 1, col: 44 },
          source: ''
        },
        test: {
          type: 'Literal',
          loc: {
            start: { line: 1, col: 12 },
            end: { line: 1, col: 16 },
            source: ''
          },
          value: true,
          raw: 'true'
        },
        body: {
          type: 'IfStatement',
          loc: {
            start: { line: 1, col: 18 },
            end: { line: 1, col: 44 },
            source: ''
          },
          test: {
            type: 'Identifier',
            loc: {
              start: { line: 1, col: 22 },
              end: { line: 1, col: 23 },
              source: ''
            },
            name: 'x'
          },
          consequent: {
            type: 'EmptyStatement',
            loc: {
              start: { line: 1, col: 24 },
              end: { line: 1, col: 26 },
              source: ''
            }
          },
          alternate: {
            type: 'ContinueStatement',
            loc: {
              start: { line: 1, col: 31 },
              end: { line: 1, col: 44 },
              source: ''
            },
            label: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 40 },
                end: { line: 1, col: 40 },
                source: ''
              },
              name: 'foo'
            }
          }
        }
      }
    }
  ]
}

tokens (16x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT
       PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR IDENT IDENT IDENT
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