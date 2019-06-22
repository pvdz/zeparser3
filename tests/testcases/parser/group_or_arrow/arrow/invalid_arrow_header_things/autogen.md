# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/parens/arrow/invalid_arrow_header_things/autogen.md

> :: parens : arrow
>
> ::> invalid arrow header things

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> async ()=>x
> `````

> `````js
> class{}
> `````

> `````js
> delete x.x
> `````

> `````js
> false
> `````

> `````js
> function(){}
> `````

> `````js
> new x
> `````

> `````js
> null
> `````

> `````js
> true
> `````

> `````js
> this
> `````

> `````js
> typeof x
> `````

> `````js
> void x
> `````

> `````js
> x + y
> `````

> `````js
> [].length
> `````

> `````js
> [x].length
> `````

> `````js
> {}.length
> `````

> `````js
> {x: y}.length
> `````

> `````js
> arguments
> `````

> `````js
> eval
> `````

> `````js
> static
> `````

### Templates

#### case

`````js
(#) => y
`````
