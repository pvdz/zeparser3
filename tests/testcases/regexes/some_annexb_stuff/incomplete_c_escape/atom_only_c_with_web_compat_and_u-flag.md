# ZeParser parser test case

- Path: tests/testcases/regexes/some_annexb_stuff/incomplete_c_escape/atom_only_c_with_web_compat_and_u-flag.md

> :: regexes : some annexb stuff : incomplete c escape
>
> ::> atom only c with web compat and u-flag

## Input


`````js
/\c/u
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Tokenizer error!
    Regex: Illegal char escape char (ord=47)

/\c/u
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
throws: Tokenizer error!
    Regex: Illegal char escape char (ord=47); Regex body had an escape or char class range that is invalid with a u-flag, but it did have a u-flag

/\c/u
^------- error
`````
