# ZeParser parser test case

- Path: tests/testcases/export_declaration/export_default_ident_asi_regex.md

> :: export declaration
>
> ::> export default ident asi regex
>
> This is an edge case with a regex after ASI
>
> In this case the export is a value so the next line cannot be a regex, instead a division

## FAIL

## Input

`````js
export default x
/y/
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  The `export` keyword can only be used with the module goal

export default x
^------- error

/y/
`````

### Strict mode

Parsed with script goal but as if it was starting with `"use strict"` at the top.

_Output same as sloppy mode._

### Module goal

Parsed with the module goal.

`````
throws: Parser error!
  Expected to parse a value (at EOF)

export default x
/y/
  ^------- error
`````


### Web compat mode

Parsed in sloppy script mode but with the web compat flag enabled.

_Output same as sloppy mode._