# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/regexes/some_annexb_stuff/syntax_chars_without_context/autogen.md

> :: regexes : some annexb stuff
>
> ::> syntax chars without context

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> ]
> `````

> `````js
> {
> `````

> `````js
> }
> `````

### Templates

#### without web compat


`````js
LUE/
`````

#### with web compat without u-flag


`````js
LUE/
`````

#### with web compat with u-flag


`````js
LUE/u
`````
