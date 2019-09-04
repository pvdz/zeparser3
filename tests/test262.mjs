// Run this suite by `./t t` in the zeparser project root
// Requires a clone of https://github.com/tc39/test262.git into zeparser3/ignore/test262

import fs from 'fs';
import path from 'path';
import {
  GOAL_MODULE,
  GOAL_SCRIPT,
  COLLECT_TOKENS_ALL,

  $COMMENT,
} from "../src/zetokenizer.mjs";
import {
  ASSERT,
  astToString,
} from "./utils.mjs";
import Par from "../src/zeparser.mjs";
import {
  compareBabel,
  ignoreTest262,
  processBabelResult,
} from './parse_babel.mjs';

// node does not expose __dirname under module mode, but we can use import.meta to get it
let filePath = import.meta.url.replace(/^file:\/\//, '');
let dirname = path.dirname(filePath);

const BABEL_AST = false; // run zeparser with babelCompat=true?
const COMPARE_BABEL = false; // compare zeparser output for each test with babel output?

const BOLD = '\x1b[;1;1m';
const BLINK = '\x1b[;5;1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

// cd zeparser3/ignore
// git clone https://github.com/tc39/test262.git
const PATH262 = path.join(dirname, './../ignore/test262/test');

let stdout = [];
function parse(input, strict, module, web) {
  stdout = [];
  return Par(
    input,
    module ? GOAL_MODULE : GOAL_SCRIPT,
    COLLECT_TOKENS_ALL,
    {
      strictMode: strict,
      webCompat: !!web,
      babelCompat: BABEL_AST,
      // astRoot: ast,
      // tokenStorage: tokens,
      // getTokenizer: tok => tokenizer = tok,
      // targetEsVersion: ES || Infinity,
      fullErrorContext: true,

      // Collect output but don't print it in case the retry fails
      $log: (...a) => stdout.push(a),
      $warn: (...a) => stdout.push(a),
      $error: (...a) => stdout.push(a),
    }
  );
}

function read(path, file, onContent) {
  let combo = path + file;
  if (fs.statSync(combo).isFile()) {
    if (file.slice(-3) === '.js') {
      onContent(combo, fs.readFileSync(combo, 'utf8'));
    }
  } else {
    fs.readdirSync(combo).forEach(s => read(combo + '/', s, onContent));
  }
}
let counter = 0;
read(PATH262, '', (file, content) => {
  ++counter;
  // if (counter < 32200) return;

  let displayFile = file.slice(path.resolve(dirname, '../ignore').length + 1);
  if (displayFile.includes('FIXTURE')) return;
  console.log(BOLD, counter, RESET, 'Testing', BOLD, displayFile, RESET)

  switch (displayFile) {
    case 'test262/test/annexB/language/expressions/object/__proto__-duplicate.js':
      // - Claims it should fail due to double __proto__ but the spec has an exception
      // - > In addition, it is not applied when initially parsing a CoverParenthesizedExpressionAndArrowParameterList or a CoverCallExpressionAndAsyncArrowHead.
      // - And `({` is most definitely initially parsing a CoverParenthesizedExpressionAndArrowParameterList

    // case 'test262/test/language/statements/break/S12.8_A1_T2.js':
      // TODO: report incorrect reason for failure of test  (fails because the label does not appear in the labelSet,
      //       since a break with label _can_ be valid)

    // case 'test262/test/annexB/built-ins/RegExp/named-groups/non-unicode-malformed.js':
      // TODO: discuss updating the spec on this wording. Currently the grammar would never allow the parser to parse a
      //       `GroupName` in ~N mode, so the condition would never trigger for the parser to restart in `+N` mode.
      //       Additionally, this test case implies that the missing name static semantics can be skipped, even though
      //       either we parse the whole thing as an AtomEscape, in which case the semantics seem to apply (because
      //       annexB doesn't update this rule), or it doesn't parse and the GroupName is invalid, but I don't think so.

    case 'test262/test/language/literals/string/S7.8.4_A4.3_T1.js':
    case 'test262/test/language/literals/string/S7.8.4_A4.3_T2.js':
    case 'test262/test/language/literals/string/legacy-octal-escape-sequence-strict.js':
      // TODO: I think that the spec allows \1 ~ \9 in strings in strict mode (but not templates)

      console.log(BOLD, 'SKIP', RESET, '(see test runner code for reasoning)');
      return;

    // Tests to ignore while comparing to Babel:
    case 'test262/test/language/comments/multi-line-asi-carriage-return.js':
    case 'test262/test/language/comments/multi-line-asi-line-separator.js':
    case 'test262/test/language/comments/multi-line-asi-paragraph-separator.js':
      // These tests multiline comment with newline. Stripping comments for Babel causes a syntax error. So just skip it.
    case 'test262/test/language/expressions/assignment/destructuring/obj-prop-__proto__dup.js':
      // Bug in Babel (I guess? Or wrong config ..?)
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-break-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-case-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-catch-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-class-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-const-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-continue-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-debugger-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-default-escaped-ext.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-default-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-delete-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-do-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-else-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-export-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-extends-escaped-ext.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-extends-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-finally-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-for-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-function-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-if-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-import-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-in-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-instanceof-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-new-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-return-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-super-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-switch-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-this-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-throw-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-try-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-typeof-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-var-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-void-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-while-escaped.js':
    case 'test262/test/language/expressions/assignment/dstr/ident-name-prop-name-literal-with-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-break-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-case-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-catch-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-class-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-const-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-continue-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-debugger-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-default-escaped-ext.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-default-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-delete-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-do-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-else-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-export-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-extends-escaped-ext.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-extends-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-finally-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-for-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-function-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-if-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-import-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-in-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-instanceof-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-new-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-return-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-super-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-switch-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-this-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-throw-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-try-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-typeof-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-var-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-void-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-while-escaped.js':
    case 'test262/test/language/expressions/assignment/member-expr-ident-name-with-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-break-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-case-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-catch-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-class-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-const-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-continue-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-debugger-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-default-escaped-ext.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-default-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-delete-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-do-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-else-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-export-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-extends-escaped-ext.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-extends-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-finally-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-for-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-function-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-if-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-import-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-in-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-instanceof-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-new-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-return-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-super-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-switch-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-this-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-throw-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-try-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-typeof-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-var-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-void-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-while-escaped.js':
    case 'test262/test/language/expressions/class/ident-name-method-def-with-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-break-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-case-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-catch-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-class-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-const-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-continue-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-debugger-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-default-escaped-ext.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-default-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-delete-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-do-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-else-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-export-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-extends-escaped-ext.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-extends-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-finally-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-for-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-function-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-if-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-import-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-in-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-instanceof-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-new-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-return-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-super-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-switch-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-this-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-throw-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-try-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-typeof-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-var-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-void-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-while-escaped.js':
    case 'test262/test/language/expressions/object/covered-ident-name-prop-name-literal-with-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-break-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-case-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-catch-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-class-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-const-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-continue-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-debugger-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-default-escaped-ext.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-default-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-delete-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-do-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-else-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-export-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-extends-escaped-ext.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-extends-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-finally-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-for-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-function-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-if-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-import-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-in-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-instanceof-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-new-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-return-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-super-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-switch-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-this-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-throw-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-try-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-typeof-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-var-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-void-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-while-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-method-def-with-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-break-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-case-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-catch-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-class-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-const-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-continue-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-debugger-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-default-escaped-ext.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-default-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-delete-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-do-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-else-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-export-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-extends-escaped-ext.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-extends-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-finally-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-for-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-function-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-if-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-import-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-in-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-instanceof-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-new-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-return-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-super-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-switch-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-this-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-throw-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-try-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-typeof-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-var-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-void-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-while-escaped.js':
    case 'test262/test/language/expressions/object/ident-name-prop-name-literal-with-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-break-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-case-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-catch-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-class-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-const-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-continue-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-debugger-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-default-escaped-ext.js':
    case 'test262/test/language/statements/class/ident-name-method-def-default-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-delete-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-do-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-else-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-export-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-extends-escaped-ext.js':
    case 'test262/test/language/statements/class/ident-name-method-def-extends-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-finally-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-for-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-function-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-if-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-import-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-in-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-instanceof-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-new-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-return-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-super-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-switch-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-this-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-throw-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-try-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-typeof-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-var-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-void-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-while-escaped.js':
    case 'test262/test/language/statements/class/ident-name-method-def-with-escaped.js':
      // I'm not sure why Babel throws here (why would it ever consider that part to be a block? Why else throw?)

    case 'test262/test/language/expressions/class/scope-name-lex-open-heritage.js':
    case 'test262/test/language/expressions/function/scope-name-var-open-non-strict.js':
    case 'test262/test/language/expressions/generators/scope-name-var-open-non-strict.js':
    case 'test262/test/language/statements/class/scope-name-lex-open-heritage.js':
      // Grouped sequence expression has incorrect range end

    case 'test262/test/language/expressions/template-literal/tv-line-continuation.js':
    case 'test262/test/language/expressions/template-literal/tv-line-terminator-sequence.js':
    case 'test262/test/language/literals/string/line-continuation-double.js':
    case 'test262/test/language/literals/string/line-continuation-single.js':
    case 'test262/test/language/literals/string/line-separator.js':
    case 'test262/test/language/literals/string/paragraph-separator.js':
      // Should PS/LS increment the location line? Pending https://github.com/estree/estree/issues/199

      if (COMPARE_BABEL) {
        console.log(BOLD, 'SKIP for Babel', RESET, '(see test runner code for reasoning)');
        return;
      }
      break;
  }

  ASSERT(content.includes('/*---') && content.includes('---*/'), 'missing test262 header', file);
  let header = content.slice(content.indexOf('/*---'), content.indexOf('---*/') + 5);
  // The header is yaml... ... Whatever, split all the things :)
  let flags = header.match(/\n\s*flags: \[(.*?)\]/);
  let features = header.match(/\n\s*features: \[(.*?)\]/);
  features = features ? features[1].split(', ') : [];
  flags = flags ? flags[1].split(/\s*,\s*/g) : [];
  let negative = /\n\s*negative:/.test(header) && !/\n\s*phase:\s*runtime/.test(header) && !header.includes('phase: resolution');
  let webcompat = file.includes('annexB');

  if (features.includes('BigInt')) {
    return  console.log(BOLD, 'SKIP', RESET, '(Stage 3: BigInt)');
  } else if (features.includes('class-fields-public')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-fields-public)');
  } else if (features.includes('class-fields-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-fields-private)');
  } else if (features.includes('class-static-fields-public')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-static-fields-public)');
  } else if (features.includes('class-static-fields-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage ?: class-static-fields-private)');
  } else if (features.includes('class-methods-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: class-methods-private)');
  } else if (features.includes('class-static-methods-private')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3?: class-static-methods-private)');
  } else if (features.includes('hashbang')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: hashbang)');
  } else if (features.includes('import.meta')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: import.meta)');
  } else if (features.includes('numeric-separator-literal')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: numeric-separator-literal)');
  } else if (features.includes('export-star-as-namespace-from-module')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 1?: export-star-as-namespace-from-module)');
  } else if (features.includes('optional-chaining')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: optional-chaining)');
  } else if (features.includes('top-level-await')) {
    return console.log(BOLD, 'SKIP', RESET, '(Stage 3: top-level-await)');
  }

  let webstr = webcompat ? 'web' : 'sloppy';
  if (!flags.includes('onlyStrict') && !flags.includes('module')) {
    let failed = false;
    let z;
    try {
      z = parse(content, false, false, webcompat);
      console.log(GREEN, 'PASS', RESET, webstr, webcompat);
    } catch (e) {
      console.log(GREEN, 'FAIL', RESET, webstr, webcompat);
      failed = e;
    }

    if (failed && failed.toString().toLowerCase().includes('assertion fail')) {
      console.log('\nUnrolling output;\n');
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw assertion error' + RESET + ' in ' + BOLD + webstr + RESET);
    }
    if (failed && !(failed.toString().toLowerCase().includes('parser error!') || failed.toString().toLowerCase().includes('tokenizer error!'))) {
      console.log('\nUnrolling output;\n');
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw an unexpected error' + RESET + ' in ' + BOLD + webstr + RESET);
    }
    if (!!failed !== negative) {
      console.log('\nUnrolling output;\n');
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed, negative);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + ' did not meet expectations in '+BOLD+webstr+RESET+', expecting ' + (negative?'fail':'pass') + ' but got '  + (failed?'fail':'pass'));
    }

    if (COMPARE_BABEL && !webcompat && !ignoreTest262(file)) {
      // Parse and hope for the best. Unsure what to do with annexb

      let noCommentContent = content;
      if (z) {
        // Strip comment nodes because that's the only expected difference between the two ASTs
        noCommentContent = z.tokens.map(token => (token.type & $COMMENT) !== $COMMENT ? token.str : token.str.includes('\n') ? '\n' : '').join('');
      }

      let [babelOk, babelFail, zasb] = compareBabel(noCommentContent, !failed, 'sloppy', file);
      let outputBabel = processBabelResult(babelOk, babelFail, failed, zasb, false);
      if (outputBabel) {``
        console.log('##### no comment content that was tested:');
        console.log(noCommentContent);
        console.log('#####');
        console.log(zasb ? astToString(zasb.ast) : '<no zasb>');
        console.log(outputBabel);
        console.log('File:', file);
        console.error('Exit now.');
        process.exit(1);
      }
    }
  }

  let modstr = flags.includes('module') ? 'module' : 'strict';
  if (!webcompat && !flags.includes('noStrict')) {
    let failed = false;
    try {
      parse(content, true, flags.includes('module'), webcompat);
      console.log(GREEN, 'PASS', RESET, modstr);
    } catch (e) {
      console.log(GREEN, 'FAIL', RESET, modstr);
      failed = e;
    }

    if (failed && failed.toString().toLowerCase().includes('assertion fail')) {
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw assertion error' + RESET + ' in ' + BOLD + modstr + RESET);
    }
    if (failed && !(failed.toString().toLowerCase().includes('parser error!') || failed.toString().toLowerCase().includes('tokenizer error!'))) {
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + BLINK + ' threw an unexpected error' + RESET + ' in ' + BOLD + modstr + RESET);
    }
    if (!!failed !== negative) {
      stdout.forEach(a => console.log.apply(console, a));
      console.log('e:', failed);
      console.log('flags:', flags);
      throw new Error('File ' + BOLD + file + RESET + ' did not meet expectations in '+BOLD+modstr+RESET+', expecting ' + (failed?'fail':'pass') + ' but got '  + (!failed?'fail':'pass'));
    }
  }
});

console.log('The end...? Wow really?');
