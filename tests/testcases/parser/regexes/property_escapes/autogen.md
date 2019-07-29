# ZeParser parser test cases

- Added: 2019-06-17 (mass migration from old system)
- Modified: -
- Path: zeparser3/tests/testcases/parser/regexes/property_escapes/not_web_compat/autogen.md

> :: regexes : property escapes

These cases are automatically extrapolated and written to their own file.
Each case is applied to each test by simply replacing `#` with the actual case.

## Input

### Cases

> `````js
> undefined
> `````

> `````js
> 8
> `````

> `````js
> 9
> `````

> `````js
> Infinity
> `````

### Templates

- `es = #`

#### property escapes are invalid without u flag

`````js
/\p{AHex}b/
`````

#### property escapes are valid with u flag


`````js
/\p{AHex}b/u
`````

#### class property escapes are illegal without u flag

illegal escape char sans flag

`````js
/\p{AHex}b]/
`````

#### class property escapes are valid with u flag


`````js
/\p{AHex}b]/u
`````

#### double property escapes sans u flag


`````js
/\p{Hex}\P{Hex}/
`````

#### double class property escapes sans u flag


`````js
/\p{Hex}\P{Hex}]/
`````

#### double property escapes with u flag


`````js
/\P{Hex}\P{Hex}/u
`````

#### double class property escapes with u flag

`````js
/\p{Hex}\P{Hex}]/u
`````

#### Binaries

`````js
/\P{ASCII=LC}/u;
`````

#### Binary throws for unknown name

`````js
/\P{ASCNI=LC}/u;
`````

#### Binary throws for unknown value

`````js
/\P{ASCII=NONONO}/u;
`````

#### Binary throws for double =

`````js
/\P{ASCII=LC=LC}/u;
`````

#### Binary throws for empty name

`````js
/\P{=LC}/u;
`````

#### Binary throws for empty value

`````js
/\P{ASCII=}/u;
`````

#### Throws for empty arg

`````js
/\P{}/u;
`````

#### Throws for unknown lone name

`````js
/\P{JavaScript}/u;
`````
