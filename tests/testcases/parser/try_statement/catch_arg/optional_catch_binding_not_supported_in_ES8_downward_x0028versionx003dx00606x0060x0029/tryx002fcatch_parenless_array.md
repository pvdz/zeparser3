# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/try_statement/catch_arg/optional_catch_binding_not_supported_in_ES8_downward_x0028versionx003dx00606x0060x0029/tryx002fcatch_parenless_array.md

> :: try statement : catch arg : optional catch binding not supported in ES8 downward (version=`6`)
>
> ::> try/catch parenless array

## Input

- `es = 6`

`````js
try {} catch [] {}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Next ord should be 40 (`(`) but was 91 (curc: `[`, token: `[`)

try {} catch [] {}
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

_Output same as sloppy mode._