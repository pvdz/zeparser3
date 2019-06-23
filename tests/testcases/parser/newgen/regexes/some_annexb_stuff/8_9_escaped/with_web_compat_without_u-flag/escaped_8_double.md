# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/regexes/some_annexb_stuff/8_9_escaped/with_web_compat_without_u-flag/escaped_8_double.md

> :: regexes : some annexb stuff : 8 9 escaped : with web compat without u-flag
>
> ::> escaped 8 double

## Input

`````js
/7\89/
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Tokenizer error: Regex: Largest back reference index exceeded the number of capturing groups

/7\89/
^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

_Output same as sloppy mode._

### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

`````
ast: {
  type: 'Program',
  loc: { start: { line: 1, col: 0 }, end: { line: 1, col: 6 } },
  body: [
    {
      type: 'ExpressionStatement',
      loc: {
        start: { line: 1, col: 0 },
        end: { line: 1, col: 6 },
        source: ''
      },
      expression: {
        type: 'Literal',
        loc: {
          start: { line: 1, col: 0 },
          end: { line: 1, col: 6 },
          source: ''
        },
        value: null,
        regex: { pattern: '7\\89', flags: '' },
        raw: '/7\\89/'
      }
    }
  ]
}

tokens (3x):
       REGEX ASI
`````
