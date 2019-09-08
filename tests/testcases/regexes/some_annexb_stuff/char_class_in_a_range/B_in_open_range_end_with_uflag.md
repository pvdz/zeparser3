# ZeParser parser test case

- Path: tests/testcases/regexes/some_annexb_stuff/char_class_in_a_range/B_in_open_range_end_with_uflag.md

> :: regexes : some annexb stuff : char class in a range
>
> ::> B in open range end with uflag
>
> The \B is valid in web compat mode as long as it's not part of a range.
>
> A dash at the end of a regex is allowed and does not make an implicit range.
>
> This test ensures we don't prematurely throw for `\B` when it could still be valid.

## Input

`````js
/[\b-]/u
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
  loc:{start:{line:1,column:0},end:{line:1,column:8},source:''},
  body: [
    {
      type: 'ExpressionStatement',
      loc:{start:{line:1,column:0},end:{line:1,column:8},source:''},
      expression: {
        type: 'Literal',
        loc:{start:{line:1,column:0},end:{line:1,column:8},source:''},
        value: null,
        regex: { pattern: '[\\b-]', flags: 'u' },
        raw: '/[\\b-]/u'
      }
    }
  ]
}

tokens (3x):
       REGEXU ASI
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