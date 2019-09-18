# ZeParser 3

A "pixel perfect" 100% spec compliant JavaScript parser written in JavaScript, parsing ES6-ES11.

REPL: https://pvdz.github.io/zeparser3/tests/web/repl.html

The parser itself is currently feature complete but not ready for production. While I'm confident that it works, I haven't spent any time profiling / optimizing size and runtime yet.

- Supports:
  - Anything stage 4 up to ES10 / ES2019
  - ES11 / ES2020 support in progress as it unfolds
  - Regex syntax (deep)
  - Parsing modes:
    - Sloppy / non-strict
    - Web compat / AnnexB
    - Strict
    - Module
- AST
  - Is optional, enabled by default
  - Estree (default)
  - Acorn
  - Babel (anything stage 4, except comments)
  - Supports location data (matching Acorn/Babel for reference)
- Tests
  - 30k input syntax tests
  - Passes test262 suite (at least September 2019)
    
## ES modules

Note that the files use `import` and `export` declarations and `import()`, which requires node 10+ or a cutting edge browser.

At the time of writing node requires the experimental `--experimental-modules` flag (rendering the hashbang useless).

It's a burden in some ways and nice in others. A prod build would not have any modules.

## Usage

```
import ZeParser from 'src/zeparser.mjs';
const {
  ast,                 // estree compatible AST
  tokens,              // array of numbers (see ZeTokenier)
  tokenCountSolid,     // number of non-whitespace tokens
  tokenCountAny,       // number of tokens of any kind
} = ZeParser.parse(
  inputCode,           // string
  goal,                // true=module, false=script
  collectTokens,       // 0=no,1=non-whitespace,2=all
  {
    // Apply Annex B rules? (Only works in sloppy mode)
    webCompat = true,
    // Start parsing as if in strict mode? (Works with script goal)
    strictMode = false,
    // Output a Babel compatible AST? Note: comment nodes are not properly mirrored
    babelCompat = false,
    // Pass on a reference that will be used as the AST root
    astRoot = null,
    // Should it normalize \r and \r\n to \n in the .raw of template nodes?
    // Estree spec but makes it hard to serialize template nodes losslessly
    templateNewlineNormalization = true,
    // Pass on a reference to store the tokens
    tokenStorage = [],
    // Callback to receive the tokenizer instance once its created
    getTokenizer = null,
    // You use this to parse `eval` code
    allowGlobalReturn = false,
    // Target a very specific ecmascript version (like, reject async)
    targetEsVersion = lastVersion, // (currently es11)
    // Leave built up scope information in the ASTs (good luck)
    exposeScopes = false,
    // Assign each node a unique incremental id
    astUids = false,
    // When false and input is over 100 bytes, it will trunc the input
    fullErrorContext = false,
    // You can override the logging functions to catch or squash all output
    $log = console.log,
    $warn = console.warn,
    $error = console.error,
    // Value ot use for the `source` field of each `loc` object
    sourceField = '',
  }
);
```

## Testing

There is a simple access script in the root project called `t` which calls `tests/t.sh` which calls `tests/zeparser.spec.mjs` with certain params.

See [`tests/testcases/README.md`](./tests/parser/README.md) for details on test case formatting.

```
# Show help
./t --help

# Auto update all tests with current output (inline, use git to diff)
./t u
# Run all tests and ask what to do for any mismatch
./t m
# Run test suite and also compare against Babel AST
./t b

# Test a particular input from cli
./t i "some.input()"
# Test a particular test file
./t f "tests/testcases/regexes/foo.md"
# Use entire contents of given file as input
./t F "test262/test/annexB/built-ins/foo.js"

# Run test262 tests (requires some setup)
./t t

# Regenerate all autogen test files. Regenerates files still need to be updated (`./t u`).
./t g                All files, regardless
./t G                Only create new files

# QoL shortcuts:
./t a            Alias for `./t u --test-acorn`
./t b            Alias for `./t u --test-babel`
./t fu <file>    Combined `./t m` with `./t f <file>`

# Find out which tests execute a particular code branch in the parser
# Add `HIT()` to any part of the code in src
./t s                Optionally combinable with `-i` or `-f`. Reports all inputs that trigger a `HIT()` call in zeparser

Most flags can be modified:

--sloppy             Run in non-strict mode (but non-web compat!)
--strict             Run with script goal but consider the code strict
--module             Run with module goal (enabling strict mode by default)
--web                Run with script goal, non-strict, and enable web compat (AnnexB rules)

6                    Run as close to the rules as of ES6  / ES2015 as possible
7                    Run as close to the rules as of ES7  / ES2016 as possible
8                    Run as close to the rules as of ES8  / ES2017 as possible
9                    Run as close to the rules as of ES9  / ES2018 as possible
10                   Run as close to the rules as of ES10 / ES2019 as possible
11                   Run as close to the rules as of ES11 / ES2020 as possible

--min                Given a broken input, brute force minify the input while maintaining the same error message
--acorn              Output a Acorn compatible AST
--babel              Output a Babel compatible AST
--test-acorn         Compare the `--acorn` output to the actual output of Acorn on same input
--test-babel         Compare the `--babel` output to the actual output of Babel on same input
--test-node          Compile input in a `Function()` and report whether that throws when zeparser throws
```

You can find the REPL in [`tests/web/repl.html`](./tests/web/repl.js), github link: https://pvdz.github.io/zeparser3/tests/web/repl.html

_The REPL needs a very new browser due to es module syntax._

# Building

While the parser runs perfectly fine in dev mode it will be a bit slow. To generate a build run this in the project root:

```
mkdir build
./cli/build.js
```

(For now you'll need `node --experimental-modules cli/build.mjs`)

The [build script](cli/build.js):

- will remove non-assert dev artifacts
- can remove inline asserts (lines that start with `ASSERT`)
- can remove all the AST generation from the build (lines that start with `AST`)

You can toggle asserts and comments at the top of the build file.

The script will write two files:

```
build/build_w_ast.js
biuld/build_no_ast.js
```

The no-AST build is almost as perfect as the regular build except for certain validation cases where it requires the AST:

- Binary op after arrow with block body (`()=>{}*x` is illegal)
- Regular expression on new line after arrow with block body (`()=>{} \n /foo/g`, prohibited by ASI rules and can't be a division)
- Update operator anything that's writable but not a valid var or member expression (`++[]`)

# Testing

Each test is individually encapsulated in an `.md` file in `tests/testcases/**`. This file will contain the input code and the output as expected for sloppy mode, strict mode (script goal), module goal, and web compat mode (only works in sloppy mode, script goal).

If a run passes then the AST and types of tokens are printed in the output. Otherwise the error message and a pointer to where the error occurred are listed.

The files can be auto-updated with `./t u` or `./t m`. This makes it easy to update something in the parser and use SCM to confirm whether anything changed, and if so what.

There are also `autogen.md` files, which generate a bunch of combinatory tests (`./t g` or `./t G`), similar to the other tests.

To create a new test simply add a new file, start it with `@`, a description, a line with only `###` and the rest is considered the test case. When you run the test runner this file will automatically be converted to a proper test case.

# TODO

The parser itself supports ES5-ES11 but is not production ready;

- Verify and remove pending TODO roadblocks by creating test cases to cover their branches
- Compare against Babel while running test262, too
- Compare against other active parsers (acorn, meriyah, flow, typescript)
- Continue work on the fuzzer
- Make build dir automatically
- Work on perf, the fun stuff
  - Add better benchmarking
  - Do perf traces to find hot code
  - Tighter integration between parser and tokenizer of pre-known tokens
    - This ties into enforcing reserved keyword checks
- Make sure the parser works without AST building
- Improve and visualize test coverage
- Find out what the memory footprint is like, how much can it parse before bailing
- Improve error messages
