# ZeParser parser test case

- Path: tests/testcases/classes/extending/regressionx003a_crashed_x0028unexpectedlyx0029_webx003dfalse.md

> :: classes : extending
>
> ::> regressionx003a crashed x0028unexpectedlyx0029 webx003dfalse
>
> #11
>
> This should throw an error because super can only be called in a constructor

## Input

`````js
(class A extends B { method() { super() } })
`````

## Output

_Note: the whole output block is auto-generated. Manual changes will be overwritten!_

Below follow outputs in four parsing modes: sloppy mode, strict mode script goal, module goal, web compat mode (always sloppy).

Note that the output parts are auto-generated by the test runner to reflect actual result.

### Sloppy mode

Parsed with script goal and as if the code did not start with strict mode header.

`````
throws: Parser error!
  Can only use `super()` in constructors of classes that extend another class

(class A extends B { method() { super() } })
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