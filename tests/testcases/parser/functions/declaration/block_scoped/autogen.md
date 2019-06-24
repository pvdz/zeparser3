# ZeParser parser test cases

- Path: zeparser3/tests/testcases/parser/functions/declaration/block_scoped/autogen.md

> :: functions 
>
> ::> function statements
>
> Function declarations in block statements ("function statements") are considered
> lexical declarations so any redeclaration that follows, even `var`, is illegal.
>
> Function modifiers (`async` etc) do not change this.

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> function f(){}
> `````

> `````js
> function *f(){}
> `````

> `````js
> async function f(){}
> `````

> `````js
> async function *f(){}
> `````

> `````js
> function(){}
> `````

### Templates

#### func func

This should be okay as it is explicitly allowed

https://tc39.es/ecma262/#sec-block-duplicates-allowed-static-semantics

`````js
{ # # }
`````

#### var func

Not okay

`````js
{ # var f }
`````

#### func var

This is okay because the var preceded the func and the check is applied left to right

`````js
{ var f; # }
`````

#### let func

Not okay

`````js
{ # let f }
`````

#### func let

Not okay

`````js
{ let f; # }
`````

#### const func

Not okay

`````js
{ # const f = x }
`````

#### func const

Not okay

`````js
{ const f = x; # }
`````

#### class func

Not okay

`````js
{ # class f {} }
`````

#### func class

Not okay

`````js
{ class f {} # }
`````
