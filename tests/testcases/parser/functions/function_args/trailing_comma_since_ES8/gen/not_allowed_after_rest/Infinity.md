# ZeParser parser autogenerated test case

- From: zeparser3/tests/testcases/parser/functions/function_args/trailing_comma_since_ES8/autogen.md
- Path: zeparser3/tests/testcases/parser/functions/function_args/trailing_comma_since_ES8/gen/not_allowed_after_rest

> :: test: not allowed after rest
> :: case: Infinity

## Input

- `es = Infinity`

`````js
function f(...a,){}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The rest argument was not destructible as it must be last and can not have a trailing comma

function f(...a,){}
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