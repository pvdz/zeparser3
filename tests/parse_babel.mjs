import babel from '@babel/parser';
import {
  ASSERT,
  astToString,
  encodeUnicode,
  normalizeAst,
  PROJECT_ROOT_DIR,
} from "./utils.mjs";
import {execSync} from 'child_process';
import {COLLECT_TOKENS_SOLID, GOAL_MODULE, GOAL_SCRIPT} from "../src/zetokenizer.mjs";
import ZeParser from '../src/zeparser.mjs';

const TEST_SLOPPY = 'sloppy';
const TEST_STRICT = 'strict';
const TEST_MODULE = 'module';
const TEST_WEB = 'web';

function testBabel(code, mode) {
  if (mode === 'strict' || mode === 'web') return false;
  // The Babel parser doesn't seem to support a web compat / AnnexB mode so we can't test that one :(
  return babel.parse(code, {
    sourceType: mode === 'module' ? 'module' : 'script',
    // https://babeljs.io/docs/en/babel-parser
    // It explicitly mentions a strictMode option, but when running it this fails :(
    // strictMode: mode === 'strict',
    plugins: ['dynamicImport'],
  });
}

function compareBabel(code, zeparserPassed, testVariant, file) {
  let babelOk, babelFail, zasb;
  try {
    babelOk = testBabel(code, testVariant);
  } catch (e) {
    babelFail = e;
  }

  if (zeparserPassed && babelOk) {
    try {
      zasb = ZeParser(
        code,
        testVariant === TEST_MODULE ? GOAL_MODULE : GOAL_SCRIPT,
        COLLECT_TOKENS_SOLID,
        {
          strictMode: testVariant === TEST_STRICT,
          webCompat: testVariant === TEST_WEB,
          babelCompat: true,

          $log: () => {},
          $warn: () => {},
          $error: () => {},
        },
      );
    } catch (e) {
      ASSERT(false, 'file: ' + file + '; the output pass/fail with and without babelCompat should be the same and the run without babelCompat passed, so this should pass too', e);
    }
  }

  return [babelOk, babelFail, zasb];
}

function babelScrub(ast) {
  return (
    astToString(
      JSON.parse(
        JSON.stringify(
          ast, null, 2
        )
      )
    )
  );
}

function processBabelResult(babelOk, babelFail, zeparserFail, zasb, INPUT_OVERRIDE) {
  let outputBabel = '';
  if (babelOk && !zeparserFail) {
    let b = babelScrub(normalizeAst(babelOk.program, 'program'));
    let z = astToString(normalizeAst(zasb.ast, 'program'));
    if (b === z) {
      // outputBabel += '\nBabel: same';
    } else {
      let d = execSync(
        // Use sub-shell `<(...)` to prevent temporary file management.
        // Use base64 to prevent shell interpretation of input.
        // Final `true` is to suppress `diff`'s non-zero exit code when input differs.
        `diff -U 0 --text -d --suppress-blank-empty --ignore-blank-lines --ignore-all-space <(
            echo '${Buffer.from(encodeUnicode(z)).toString('base64')}' | base64 -d -
          ) <(
            echo '${Buffer.from(encodeUnicode(b)).toString('base64')}' | base64 -d -
          ) || true`
        , {shell: '/bin/bash', encoding: 'utf8'}
      ).replace(/^(?:\+\+\+ \/|--- \/|@@ ).*$/gm, '').replace(/\n+/g, '\n');

      outputBabel += '\nBabel AST is different:\n' + d;
      if (INPUT_OVERRIDE) console.log('=>', outputBabel);
    }
  } else if (!babelFail && zeparserFail) {
    // outputBabel += '\nBabel did not throw an error\n' + [babelOk, babelFail];
  } else if (babelFail && !zeparserFail) {
    outputBabel += '\nBabel threw an error: ' + babelFail + '\n';
    if (INPUT_OVERRIDE) console.log('=>', babelFail);
  } else {
    // outputBabel = '\n(Babel did not run)\n';
  }

  return outputBabel;
}

function ignoreZeparserTest(file) {
  // There are some files where I've asserted that the AST mismatch between Babel and ZeParser is caused by something
  // either I won't fix, Babel does wrong, or a difference that is benign enough not to matter to me.

  if (file.includes('octal_escapes')) return true; // temp, while I figure out what's up here

  return [
    // Double paren wrapped delete arg; babel uses outer-most paren for location, zeparser uses inner-most
    // (Neither is wrong, inner is just easier for us)
    'tests/testcases/assigns/assign_to_double_wrapped_group.md',
    'tests/testcases/assigns/assign_with_dud_group.md',
    'tests/testcases/assigns/destruct_assignment_to_noop-groups_ident.md',
    'tests/testcases/assigns/double_wrapped_group_in_the_middle.md',
    'tests/testcases/delete/for_header_ternary_flag.md',
    'tests/testcases/delete/single_ident_cases/multi_wrap_property.md',
    'tests/testcases/delete/single_ident_cases/wrapped_arrow_wrapped_prop.md',
    'tests/testcases/delete/single_ident_cases/wrapped_assign_outer_prop.md',
    'tests/testcases/destructuring/destructuring_assignments_of_groups/noop_parens/many_paren_base_case.md',
    'tests/testcases/destructuring/destructuring_assignments_of_groups/noop_parens/many_paren_properties_are_simple_assignments.md',

    // Bug in babel; regex on new line after typeof statement
    //     https://github.com/babel/babel/issues/10410
    'tests/testcases/functions/expression/regex_edge_case/with_async/expression/with_flag.md',

    // Bug in babel; incorrect use strict assignments to arguments/eval
    //    https://github.com/babel/babel/issues/10411
    'tests/testcases/objects/destructuring/identifier_properties/keyword_obj_key_check/gen/shorthand/arguments.md',
    'tests/testcases/objects/destructuring/identifier_properties/keyword_obj_key_check/gen/shorthand/eval.md',
    'tests/testcases/objects/literals/arguments_as_shorthand_keys.md',
    'tests/testcases/objects/literals/cannot_use_as_shorthand_objlit_x005bargumentsx005d.md',
    'tests/testcases/objects/literals/cannot_use_as_shorthand_objlit_x005bevalx005d.md',
    'tests/testcases/objects/literals/eval_as_shorthand_keys.md',
    'tests/testcases/objects/literals/keywords_in_object_shorthand/gen/cannot_use_as_shorthand_objlit/arguments.md',
    'tests/testcases/objects/literals/keywords_in_object_shorthand/gen/cannot_use_as_shorthand_objlit/eval.md',
    // same but because Babel doesn't pick up the assignment destructuring to a _property_ on the obj with shorthand
    'tests/testcases/random_stuff/x002318/ax002f0.md',
    'tests/testcases/random_stuff/x002318/gen/ax002f_case/x0028x007bx002ex002ex002ex007bevalx007dx002exx007d_x003d_x007bx007dx0029_.md',
    // same but because Babel doesn't notice the property access on the next line
    //    https://github.com/babel/babel/issues/10412
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00280x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00281x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00282x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00283x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00284x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00285x0029.md',
    'tests/testcases/strict_mode/asi/tails_that_prevent_ASI_so_it_is_not_a_directive_x00286x0029.md',

    // Comments, ugh
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/multi_directive_with_multi_comment_causing_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/multi_directive_with_multi_comment_sans_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/multi_directive_with_single_comment.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/regular_function/multi_directive_with_multi_comment_causing_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/regular_function/multi_directive_with_multi_comment_sans_asi.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/regular_function/multi_directive_with_single_comment.md',
    "tests/testcases/directive_prologues/into_Directive_node/global/multi_directive_with_multi_comment_causing_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/global/multi_directive_with_multi_comment_sans_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/global/multi_directive_with_single_comment.md",
    "tests/testcases/directive_prologues/into_Directive_node/regular_function/multi_directive_with_multi_comment_causing_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/regular_function/multi_directive_with_multi_comment_sans_asi.md",
    "tests/testcases/directive_prologues/into_Directive_node/regular_function/multi_directive_with_single_comment.md",

    // Bug in Babel is generating invalid location
    'tests/testcases/string/2028_is_ok.md',
    'tests/testcases/string/2029_is_ok.md',

    // This is just a weird sloppy/strict thing in Babel. Meh
    //    https://github.com/babel/babel/issues/10413
    'tests/testcases/var_statement/binding_generic/reserved_words/gen/catch_clause/let.md',

    // Babel has no webcompat mode but still rejects the double proto (which is an AnnexB-only error)
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_arr_in_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_arr_no_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_obj_in_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_obj_no_web_compat.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/arr_paren_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/arrow_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/async_arrow_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/async_call_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_ident_and_string.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_string_and_ident.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_strings.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_two_idents.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_wrapped_in_array.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_wrapped_in_array.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/arr_plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/as_an_arrow.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/destructuring_assignment.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/grouped_destructuring_assignment.md',
    // I think this is a different error because this is an actual error
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/inside_a_complex_destruct_in_an_arrow_1.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/obj_plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/not_async/plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/with_async/as_an_arrow.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/with_async/grouped_destructuring_assignment.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/exceptions/with_async/plain_group.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/obj_paren_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/paren_wrapped.md',

    // HTML comments are AnnexB only, but Babel applies it anyways
    'tests/testcases/whitespace/html_comments/html_open_on_its_own_line.md',
    'tests/testcases/whitespace/html_comments/html_open_without_close_2.md',

    // Babel has no notion of strict vs sloppy so can't deal with a tagged template containing bad escapes in sloppy:
    // (In sloppy the octal escape is fine so `cooked` has a value, in strict it's a bad escape so `cooked` is `null`)
    'tests/testcases/tagged_templates/bad_escapes/octal_escapes/normalize_high_escapes.md',
    'tests/testcases/tagged_templates/bad_escapes/octal_escapes/normalize_low_escapes.md',
    'tests/testcases/tagged_templates/bad_escapes/octal_escapes/octal_at_start.md',
    'tests/testcases/tagged_templates/bad_escapes/octal_escapes/octal_double_zero_in_template_is_always_illegal.md',
    'tests/testcases/templates/bad_escapes/octal_escapes/normalize_high_escapes.md',
    'tests/testcases/templates/bad_escapes/octal_escapes/normalize_low_escapes.md',
    'tests/testcases/templates/bad_escapes/octal_escapes/octal_at_start.md',
    'tests/testcases/templates/bad_escapes/octal_escapes/octal_double_zero_in_template_is_always_illegal.md',

    // Babel bug: incorrectly disallows non-zero digit escapes when more digits follow it:
    'tests/testcases/string/escapes/directives/octal/double_digit_high.md',
    'tests/testcases/string/escapes/directives/octal/double_digit_high_1.md',
    'tests/testcases/string/escapes/directives/octal/double_digit_high_8.md',
    'tests/testcases/string/escapes/directives/octal/double_digit_high_x.md',
    'tests/testcases/string/escapes/directives/octal/double_digit_low.md',
    'tests/testcases/string/escapes/directives/octal/double_digit_low_9.md',
    'tests/testcases/string/escapes/directives/octal/double_digit_low_x.md',
    'tests/testcases/string/escapes/directives/octal/escape_1.md',
    'tests/testcases/string/escapes/directives/octal/escape_4.md',
    'tests/testcases/string/escapes/directives/octal/quad_trailing_zero.md',
    'tests/testcases/string/escapes/directives/octal/triple_digit.md',
    'tests/testcases/string/escapes/directives/octal/triple_digit_9.md',
    'tests/testcases/string/escapes/directives/octal/triple_digit_high_start.md',
    'tests/testcases/string/escapes/directives/octal/triple_digit_low_start.md',
    'tests/testcases/string/escapes/directives/octal/triple_digit_x.md',
    'tests/testcases/string/escapes/nondirectives/rest/hex.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/double_digit_high.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/double_digit_high_1.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/double_digit_high_8.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/double_digit_high_x.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/double_digit_low.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/double_digit_low_9.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/double_digit_low_x.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/escape_1.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/escape_4.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/escape_8.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/escape_9.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/quad_trailing_zero.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/triple_digit.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/triple_digit_9.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/triple_digit_high_start.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/triple_digit_low_start.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/triple_digit_low_start.md',
    'tests/testcases/string/escapes/nondirectives/rest/octal/triple_digit_x.md',
    'tests/testcases/string/escapes/nondirectives/start/hex.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/double_digit_high.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/double_digit_high_1.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/double_digit_high_8.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/double_digit_high_x.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/double_digit_low.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/double_digit_low_9.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/double_digit_low_x.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/escape_1.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/escape_4.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/escape_8.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/escape_9.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/quad_trailing_zero.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/triple_digit.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/triple_digit_9.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/triple_digit_high_start.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/triple_digit_low_start.md',
    'tests/testcases/string/escapes/nondirectives/start/octal/triple_digit_x.md',
    'tests/testcases/tagged_templates/escapes/octal/double_digit_high.md',
    'tests/testcases/tagged_templates/escapes/octal/double_digit_high_1.md',
    'tests/testcases/tagged_templates/escapes/octal/double_digit_high_8.md',
    'tests/testcases/tagged_templates/escapes/octal/double_digit_high_x.md',
    'tests/testcases/tagged_templates/escapes/octal/double_digit_low.md',
    'tests/testcases/tagged_templates/escapes/octal/double_digit_low_9.md',
    'tests/testcases/tagged_templates/escapes/octal/double_digit_low_x.md',
    'tests/testcases/tagged_templates/escapes/octal/escape_1.md',
    'tests/testcases/tagged_templates/escapes/octal/escape_4.md',
    'tests/testcases/tagged_templates/escapes/octal/escape_8.md',
    'tests/testcases/tagged_templates/escapes/octal/escape_9.md',
    'tests/testcases/tagged_templates/escapes/octal/quad_trailing_zero.md',
    'tests/testcases/tagged_templates/escapes/octal/triple_digit.md',
    'tests/testcases/tagged_templates/escapes/octal/triple_digit_9.md',
    'tests/testcases/tagged_templates/escapes/octal/triple_digit_high_start.md',
    'tests/testcases/tagged_templates/escapes/octal/triple_digit_low_start.md',
    'tests/testcases/tagged_templates/escapes/octal/triple_digit_x.md',
    'tests/testcases/templates/escapes/octal/double_digit_high.md',
    'tests/testcases/templates/escapes/octal/double_digit_high_1.md',
    'tests/testcases/templates/escapes/octal/double_digit_high_4.md',
    'tests/testcases/templates/escapes/octal/double_digit_high_8.md',
    'tests/testcases/templates/escapes/octal/double_digit_high_x.md',
    'tests/testcases/templates/escapes/octal/double_digit_low.md',
    'tests/testcases/templates/escapes/octal/double_digit_low_9.md',
    'tests/testcases/templates/escapes/octal/double_digit_low_x.md',
    'tests/testcases/templates/escapes/octal/escape_1.md',
    'tests/testcases/templates/escapes/octal/escape_4.md',
    'tests/testcases/templates/escapes/octal/escape_8.md',
    'tests/testcases/templates/escapes/octal/escape_9.md',
    'tests/testcases/templates/escapes/octal/quad_trailing_zero.md',
    'tests/testcases/templates/escapes/octal/triple_digit.md',
    'tests/testcases/templates/escapes/octal/triple_digit_9.md',
    'tests/testcases/templates/escapes/octal/triple_digit_high_start.md',
    'tests/testcases/templates/escapes/octal/triple_digit_low_start.md',
    'tests/testcases/templates/escapes/octal/triple_digit_x.md',

    // I think this is a bug in test262 that was copied as fact by Babel:
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/ident_string.md',

    // Location bug in grouped sequence
    'tests/testcases/classes/extending/multi-line.md',
    'tests/testcases/group_or_arrow/group/multi_line_location.md',
    'tests/testcases/comma/toplevel_statement_expression/multiline.md',

    // Location of 2028/2029
    'tests/testcases/string/2028_is_ok.md',
    'tests/testcases/string/2029_is_ok.md',
    'tests/testcases/tagged_templates/escapes/2028.md',
    'tests/testcases/tagged_templates/escapes/2029.md',
    'tests/testcases/templates/escapes/2028.md',
    'tests/testcases/templates/escapes/2029.md',
    'tests/testcases/string/escapes/2028.md',
    'tests/testcases/string/escapes/2029.md',
    'tests/testcases/string/location_2028.md',
    'tests/testcases/string/location_2029.md',

  ].includes(file.slice(PROJECT_ROOT_DIR.length + 1));
}

function ignoreTest262(file) {
  // Comment nodes should be stripped from inputs
  return [
  ].includes(file.slice(file.indexOf('/test262/') + 1));
}

export {
  babelScrub,
  compareBabel,
  ignoreTest262,
  ignoreZeparserTest,
  processBabelResult,
  testBabel,
};
