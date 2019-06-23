# ZeParser parser test case

- Added: 2019-06-19 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/newgen/await/await_as_arg_default/await_with_arg/in_global/non-arrow_complex_nested_await/plain_class_method.md

> :: await : await as arg default : await with arg : in global : non-arrow, complex nested await
>
> ::> plain class method

## Input

`````js
class x {f(foo = [{m: t(await bar)}]){}}
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Next ord should be 41 (`)`) but was 98 (curc: `b`, token: `bar`)

class x {f(foo = [{m: t(await bar)}]){}}
                              ^------- error
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Cannot use `await` as var when goal=module but found `await` outside an async function

class x {f(foo = [{m: t(await bar)}]){}}
                              ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._