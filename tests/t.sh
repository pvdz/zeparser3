#!/usr/bin/env bash

set -e # Exit on error

ACTION=''
ARG=''
MODE=''
ACORN=''
BABEL=''
EXTRA=''
ES=''
NODE=''
ANNEXB=''
BUILD=''
PSFIX=''
HF=''
NOCOMP=''
NOMIN=''
INSPECT=''
DEVTOOLS=''
PRETTIER=''

while [[ $# > 0 ]] ; do
  case "$1" in
    --help)
        echo "
ZeParser test runner help:

 Shortcuts for common test runner setups I use:

 i <code>      Run test with custom input, by default only runs sloppy script
 f <path>      Run a specific .md parser test file, by default only runs sloppy script
 F <path>      Run a specific file and consider its entire contents to be test input
 g             Regenerate _all_ auto generated files
 G             Autogenerate only files that don't already exist
 u             Run all test files and just write output
 U             Run all test files and force write output
 m             Run all tests and ask for update one-by-one
 s             Search for needles (call HIT() to place a needle and find all tests that hit them)
 t             Run test262 suite (only)
 a             Alias for ./t m --test-acorn, to verify ZeParser output against the Acorn AST
 b             Alias for ./t m --test-babel, to verify ZeParser output against the Babel AST
 fu            Test file and ask to update it if necessary
 fuzz          Run fuzzer
 hf            Log stats through HeatFiler (wip), can be used in conjunction with almost anything
 p             Run on two large js files (1mb) tucked away in ./ignore to get tentative parse times on them
 z             Create build
 --sloppy      Enable sloppy script mode, do not auto-enable other modes
 --strict      Enable strict script mode, do not auto-enable other modes
 --module      Enable module goal mode, do not auto-enable other modes
 --annexb      Enable the syntax extensions under Annex B
 --web         Alias for --sloppy and --web
 --min         Only for f and i, for invalid input; minify the test case while keeping same error
 --min-printer Only for f and i, for inputs that cause bad printer behavior; minify the test case while keeping same error
 --no-printer  Do not run the zeprinter-step (helps with debugging in certain cases)
 --acorn       Run in Acorn compat mode
 --test-acorn  Also compare AST of test cases to Acorn output
 --babel       Run in Babel compat mode
 --test-babel  Also compare AST of test cases to Babel output
 --no-fatals   Do not abort test run for (test) any assertion errors
 --node        Fuzzer: compare pass/fail to node by creating a new function and checking if it throws
 --consise     Do not dump AST and printer output to stdout. Only works with -i or -f (or anything that uses those)
 --build       Use the build (./t z) instead of dev sources for ZeParser in this call
 --no-compat   For `z`; Replace the compat flags for Acorn and Babel to `false` so the minifier eliminates the dead code
 --no-min      For `z`; Do not run Terser (minifier) on build output
 --pretty      For `z`; Run prettier on the build afterwards (useful with `--no-min`)
 --inspect     Run with `node --inspect-brk` to debug node in the chrome devtools. Use `--devtools` to auto-profile.
 --devtools    Call `console.profile()` before and after the core parse step (not all actions support this)
 6 ... 11      Parse according to the rules of this particular version of the spec
        "
      exit
      ;;

    i)
      # Custom input
      ACTION='-i'
      shift
      ARG=$1
      ;;
    f)
      # Target specific md test file
      ACTION='-f'
      shift
      ARG=$1
      ;;
    F)
      # Use (entire) contents of given file as input
      ACTION='-F'
      shift
      ARG=$1
      ;;
    g)
      # Regenerate anything from autogen files
      ACTION='-g'
      ;;
    G)
      # Regenerate only new files from autogen files
      ACTION='-G'
      ;;
    u)
      # Update all test files with their current output (fast)
      ACTION='-u'
      ;;
    U)
      # Force update all test files with their current output
      ACTION='-u --force-write'
      ;;
    m)
      # Run all files and ask for any test case that needs updating (slower)
      ACTION='-q -U'
      ;;
    s)
      # Add `HIT()` to zeparser src and this will report all inputs that trigger that call in a very concise list
      if [[ "${ACTION}" = "" ]]; then
          ACTION='-s'
      fi
      EXTRA='-s'
      ;;
    fu)
      # Update all test files with their current output (fast)
      ACTION='-U -f'
      shift
      ARG=$1
      ;;
    t)
      # Run all test262 tests
      ACTION='test262'
      ;;
    fuzz)
      # Run the fuzzer
      ACTION='fuzz'
      ;;
    hf)
      # Run in HeatFiler
      HF='yes'
      ACTION='hf'
      ;;
    a)
      # Alias for `m --test-acorn` because I'm lazy
      if [[ "${ACTION}" = "" ]]; then
          ACTION='-q -U'
      fi
      ACORN='--test-acorn'
      ;;
    b)
      # Alias for `m --test-acorn` because I'm lazy
      if [[ "${ACTION}" = "" ]]; then
          ACTION='-q -U'
      fi
      BABEL='--test-babel'
      ;;
    z)
      # Calls the build script
      ACTION='build'
      ;;
    p)
      ACTION='perf'
      ;;

    --sloppy)       MODE='--sloppy'       ;;
    --strict)       MODE='--strict'       ;;
    --module)       MODE='--module'       ;;
    --annexb)       ANNEXB='--annexb'     ;;
    --web)          MODE='--web'          ;;
    --acorn)        ACORN='--acorn'       ;;
    --test-acorn)   ACORN='--test-acorn'  ;;
    --babel)        BABEL='--babel'       ;;
    --test-babel)   BABEL='--test-babel'  ;;
    --min)          EXTRA='--min'         ;;
    --min-printer)  EXTRA='--min-printer' ;;
    --no-printer)   EXTRA='--no-printer'  ;;
    --no-fatals)    EXTRA='--no-fatals'   ;;
    --concise)      EXTRA='--concise'     ;;
    -b);&
    --build)        BUILD='-b'            ;;
    --no-compat)    NOCOMP='--no-compat'  ;;
    --no-min)       NOMIN='--no-min'      ;;
    --pretty)       PRETTIER='yes'        ;;
    --prefix)
        PSFIX='--prefix'
        shift
        ARG=$1
        ;;
    --suffix)
        PSFIX='--suffix'
        shift
        ARG=$1
        ;;
    --inspect)
        INSPECT_NODE='--inspect-brk'
        INSPECT_ZEPAR='--devtools'
        ;;
    --devtools)     DEVTOOLS='--devtools' ;;

    6)  ES='--es6'  ;;
    7)  ES='--es7'  ;;
    8)  ES='--es8'  ;;
    9)  ES='--es9'  ;;
    10) ES='--es10' ;;
    11) ES='--es11' ;;

    # special flags for fuzzer

    --node)         NODE='--node'         ;;

    *)
      echo "t: Unsupported action or option... \`$1\` Use --help for options"
      exit 1
      ;;
  esac
  shift
done

HFPID=''
if [[ "${HF}" = "yes" ]]; then
    # Note: the build is self-hosted so we should start this before transforming with HF
    if [[ ! -z "${BUILD}" ]]; then
      set -x

      echo "Creating build without compat code and without minification"
      node --experimental-modules cli/build.mjs --no-compat --no-min

      echo "Remove the artifacts through Prettier"
      node_modules/.bin/prettier --write ../zeparser3/build/build_w_ast.mjs

      # Transform the build file inline
      node --experimental-modules ../heatfiler/bin/cli.mjs --file ../zeparser3/build/build_w_ast.mjs --inline --post-node --interval-sync 1000000
    else
      HAS_SRC_CHANGES=$(git diff src)
      if [[ ! -z "${HAS_SRC_CHANGES}" ]]; then
          git status -s src
          echo 'There are changes pending to ./src, please commit/stash them first. Exiting now.';
          exit 1;
      fi

      set -x

      # Transform the code inline (rely on git to restore it)
      node --experimental-modules ../heatfiler/bin/cli.mjs --dir ../zeparser3/src --inline --post-node --interval-sync 1000000
    fi

    # Start the HF server which accepts stats, serves stats, and serves the HF UI as a tiny webserver
    node --experimental-modules ../heatfiler/bin/cli.mjs --serve --shhh &

    # Get pid of server, it should be running in the background and we want to kill it when this script exits
    HFPID=$!

    set +x

    trap "echo '###### HF killing server #####'; kill ${HFPID}" SIGINT SIGTERM EXIT

    echo '###### HF setup complete #####'
fi

set -x

case "${ACTION}" in
    test262)
      node ${INSPECT_NODE} --experimental-modules tests/test262.mjs ${ACORN} ${BABEL} ${ANNEXB} ${BUILD} ${INSPECT_ZEPAR}
    ;;

    fuzz)
      node ${INSPECT_NODE} --experimental-modules --max-old-space-size=8192 tests/fuzz/zefuzz.mjs ${EXTRA} ${NODE} ${ANNEXB} ${BUILD} ${PSFIX} "${ARG}" ${INSPECT_ZEPAR}
    ;;

    build)
      node ${INSPECT_NODE} --experimental-modules cli/build.mjs ${NOCOMP} ${NOMIN} ${INSPECT_ZEPAR}
      if [[ ! -z "${PRETTIER}" ]]; then
          node_modules/.bin/prettier build/build_w_ast.mjs --write
      fi
    ;;

    perf)
      if [[ -z "${INSPECT_NODE}" ]]; then
        node ${INSPECT_NODE} --experimental-modules --max-old-space-size=8192 tests/perf.mjs ${BUILD} ${INSPECT_ZEPAR} ${DEVTOOLS}
      else
        if [[ ! -z "${BUILD}" ]]; then
          ./t z --no-compat --no-min
          node_modules/.bin/prettier build/build_w_ast.mjs --write
        fi
        node ${INSPECT_NODE} --experimental-modules --max-old-space-size=8192 tests/hf.mjs ${BUILD} ${INSPECT_ZEPAR} ${DEVTOOLS}
      fi
    ;;

    hf)
      node ${INSPECT_NODE} --experimental-modules --max-old-space-size=8192 tests/hf.mjs ${BUILD} ${INSPECT_ZEPAR}
    ;;

    *)
      node ${INSPECT_NODE} --experimental-modules --max-old-space-size=8192 tests/zeparser.spec.mjs ${ACTION} "${ARG}" ${MODE} ${ACORN} ${BABEL} ${EXTRA} ${ES} ${ANNEXB} ${BUILD} ${INSPECT_ZEPAR}
    ;;
esac
set +x

if [[ "${HF}" = "yes" ]]; then
    echo '###### END OF PARSER #####'
fi
