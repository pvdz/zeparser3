# ZeParser 3

A 100% spec compliant JavaScript parser written in JavaScript, parsing ES6-ES9.

The parser itself is currently feature complete but not ready for production. 

Test262 is passing and there are thousands of additional unit tests to improve coverage.

Anything stage 4 is supported by this parser, opted in by default (but you can request to parse in a specific version).

## ES modules

Note that the files use `import` and `export` declarations and `import()`, which requires node 10+ or a cutting edge browsers.

At the time of writing node requires an experimental flag (rendering shebang useless).

It's a burden in some ways and nice in others. A prod build would not have any modules.

## Usage

```
# Tokenizer tests (broken at the moment):
./tests/zetokenizer.spec.mjs

# Tokenizer fuzz testing (broken atm)
./tests/fuzz_tokens.mjs

# Parser tests
./tests/zeparser.spec.js
node --experimental-modules tests/zeparser.spec.mjs

# Run all tests and ignore failures
./tests/zeparser.spec.js -F
node --experimental-modules tests/zeparser.spec.mjs -F

# Run test262 tests (needs setup)
./tests/zeparser.spec.js -t
node --experimental-modules tests/zeparser.spec.mjs -t

# Generated combinator non-crash tests (broken)
./tests/generated.js
```

The REPL needs a very new browser due to es module syntax. You can find the REPL in [`tests/web/repl.html`](./zeparser3/blob/master/tests/web/repl.js), github link: https://pvdz.github.io/zeparser3/tests/web/repl.html

# Building

_(This is broken at the moment)_

While the parser runs perfectly fine in dev mode it will be a bit slow. To generate a build (stored in `build/build.js`) run this in the project root:

```
mkdir build
./cli/build.js
```

The [build script](cli/build.js):

- will remove non-assert dev artifacts
- can remove inline asserts (lines that start with `ASSERT`)
- can remove all the AST generation from the build (lines that start with `AST`)

You can toggle asserts and AST at the top of the build file.

# Perf testing

_(This is broken at the moment)_

Still setting up a more rigid way of perf testing but for now;

See [`tests/perf/parser/run.js`](tests/perf/parser/run.js) and update the location of the input file. I'm currently using [a 20mb webkit.js file](https://github.com/trevorlinton/webkit.js/blob/master/bin/webkit.bin.js) that is not part of this repo. You'll need to download it and update the link in the runner. Then you can build and run. 

```
./cli/build.js && ./tests/perf/parser/run.js
```

See above for configuring the build script. In the perf script you can adjust the call to the parser to tell it to retain tokens or not. Generating AST and retaining tokens will affect the parse times at large inputs.

# TODO

The parser itself supports ES5-ES9 but is not production ready;

- Add location to AST nodes
- Setup a test running that confirms AST nodes against other engines (Babel/Flow/etc)
- Setup tests on a "prod" build, sans assertions
- Wire up the fuzzer
- Tighter integration between parser and tokenizer of pre-known tokens
  - This ties into enforcing reserved keyword checks
- Make build dir automatically
- Work on perf, the fun stuff
  - Add better benchmarking
  - Do perf traces to find hot code
  - Make sure the parser works without AST building
- Improve code coverage
- Add a way to put input test cases inline and assert they reach that point. Helps with understanding why something is doing what.
- Setup a repl
- Find out what the memory footprint is like, how much can it parse before bailing

