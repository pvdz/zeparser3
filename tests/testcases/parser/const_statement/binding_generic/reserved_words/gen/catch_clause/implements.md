# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/const_statement/binding_generic/reserved_words/autogen.md
- Path: zeparser3/tests/testcases/parser/const_statement/binding_generic/reserved_words/gen/catch_clause

> :: test: catch clause
> :: case: implements

## Input


`````js
try {} catch (implements) {}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 28 } },
  body: [
    {
      type: 'TryStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 28 },
        source: ''
      },
      block: {
        type: 'BlockStatement',
        loc: {
          start: { line: 1, col: 4 },
          end: { line: 1, col: 7 },
          source: ''
        },
        body: []
      },
      handler: {
        type: 'CatchClause',
        loc: {
          start: { line: 1, col: 7 },
          end: { line: 1, col: 28 },
          source: ''
        },
        param: {
          type: 'Identifier',
          loc: {
            start: { line: 1, col: 14 },
            end: { line: 1, col: 14 },
            source: ''
          },
          name: 'implements'
        },
        body: {
          type: 'BlockStatement',
          loc: {
            start: { line: 1, col: 26 },
            end: { line: 1, col: 28 },
            source: ''
          },
          body: []
        }
      },
      finalizer: null
    }
  ]
}

tokens (10x):
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR
       PUNCTUATOR PUNCTUATOR
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot use this name (implements) as a variable name because: Cannot use this reserved word as a variable name in strict mode

try {} catch (implements) {}
              ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._