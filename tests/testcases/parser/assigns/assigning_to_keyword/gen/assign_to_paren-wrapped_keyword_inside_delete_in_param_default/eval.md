# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/assigns/assigning_to_keyword/autogen.md
- Path: zeparser3/tests/testcases/parser/assigns/assigning_to_keyword/gen/assign_to_paren-wrapped_keyword_inside_delete_in_param_default

> :: test: assign to paren-wrapped keyword inside delete in param default
> :: case: eval

## Input


`````js
async (x = delete ((eval) = f)) => {}
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
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 37 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 37 },
        source: ''
      },
      expression: {
        type: 'ArrowFunctionExpression',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 37 },
          source: ''
        },
        params: [
          {
            type: 'AssignmentPattern',
            loc: {
              start: { line: 1, col: 7 },
              end: { line: 1, col: 30 },
              source: ''
            },
            left: {
              type: 'Identifier',
              loc: {
                start: { line: 1, col: 7 },
                end: { line: 1, col: 9 },
                source: ''
              },
              name: 'x'
            },
            right: {
              type: 'UnaryExpression',
              loc: {
                start: { line: 1, col: 11 },
                end: { line: 1, col: 30 },
                source: ''
              },
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'AssignmentExpression',
                loc: {
                  start: { line: 1, col: 19 },
                  end: { line: 1, col: 29 },
                  source: ''
                },
                left: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 20 },
                    end: { line: 1, col: 24 },
                    source: ''
                  },
                  name: 'eval'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  loc: {
                    start: { line: 1, col: 28 },
                    end: { line: 1, col: 29 },
                    source: ''
                  },
                  name: 'f'
                }
              }
            }
          }
        ],
        id: null,
        generator: false,
        async: true,
        expression: false,
        body: {
          type: 'BlockStatement',
          loc: {
            start: { line: 1, col: 35 },
            end: { line: 1, col: 37 },
            source: ''
          },
          body: []
        }
      }
    }
  ]
}

tokens (18x):
       IDENT PUNCTUATOR IDENT PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       IDENT PUNCTUATOR PUNCTUATOR IDENT PUNCTUATOR PUNCTUATOR
       PUNCTUATOR PUNCTUATOR PUNCTUATOR ASI
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

`````
throws: Parser error!
  Cannot assign to lhs because it is not a valid assignment target

async (x = delete ((eval) = f)) => {}
                          ^------- error
`````


### Module goal

Parsed with the module goal.

_Output same as strict mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._