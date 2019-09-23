// https://github.com/facebook/hermes
// https://github.com/facebook/hermes/blob/master/doc/BuildingAndRunning.md
// apt install cmake git ninja-build libicu-dev python zip libreadline-dev

// git clone https://github.com/facebook/hermes.git
// hermes/utils/build/build_llvm.py
// hermes/utils/build/configure.py
// cd build && ninja

// Took ~20min on my octocore machine. ymmv

import {
  ASSERT,
  astToString,
  encodeUnicode,
  PROJECT_ROOT_DIR,
} from "./utils.mjs";
import {execSync} from 'child_process';
import {COLLECT_TOKENS_SOLID, GOAL_MODULE, GOAL_SCRIPT} from "../src/zetokenizer.mjs";
import ZeParser from '../src/zeparser.mjs';

const TEST_SLOPPY = 'sloppy';
const TEST_STRICT = 'strict';
const TEST_MODULE = 'module';
const TEST_WEB = 'web';

function testHermes(code, mode) {
  if (mode !== 'strict') return false;

  // Hermes has some options that we can tweak

  let b64 = Buffer.from(code).toString('base64');
  if (b64.length > 5000) return; // Skirt command line limits. Whatever.

  let hermesCmd = [
    'echo ' + b64,
    'base64 -d -',
    // Update hermes executable here...
    '"bin/hermes" -dump-ast -dump-source-location -fenable-tdz -strict -Wundefined-variable -w',
  ].join(' | ');
  console.log('> ' + hermesCmd);
  let out = execSync(hermesCmd, {encoding: 'utf8'});
  return JSON.parse(out);
}

function compareHermes(code, zeparserPassed, testVariant, file) {
  const BOLD = '\x1b[;1;1m';
  const BLINK = '\x1b[;5;1m';
  const RED = '\x1b[31m';
  const GREEN = '\x1b[32m';
  const RESET = '\x1b[0m';

  let hermesOk, hermesFail, zash;
  try {
    hermesOk = testHermes(code, testVariant);
  } catch (e) {
    hermesFail = e;
  }

  if (zeparserPassed && hermesOk) {
    try {
      zash = ZeParser(
        code,
        testVariant === TEST_MODULE ? GOAL_MODULE : GOAL_SCRIPT,
        COLLECT_TOKENS_SOLID,
        {
          strictMode: testVariant === TEST_STRICT,
          webCompat: testVariant === TEST_WEB,
          hermesCompat: true,

          $log: () => {},
          $warn: () => {},
          $error: () => {},
        },
      );
    } catch (e) {
      ASSERT(false, 'file: ' + file + '; the output pass/fail with and without hermesCompat should be the same and the run without hermesCompat passed, so this should pass too', e);
    }
  }

  return [hermesOk, hermesFail, zash];
}

function normalizeAst(ast, parentProp) {
  // Given an object model, re-assign properties in lexicographical order except put `type` first

  let names = Object.getOwnPropertyNames(ast);
  names = names.sort((a,b) => a === 'type' ? -1 : b === 'type' ? b : a > b ? -1 : a < b ? 1 : 0);
  names.forEach(prop => {
    // Drop meta data I'm not adding atm
    if (ast.type === 'ExpressionStatement') {
      if (prop === 'directive') {
        // Not sure what's up with this one
        delete ast[prop];
      }
    }
    if (parentProp === 'loc') {
      if (prop === 'source') {
        delete ast[prop];
      }
    }
    if ([ // unguarded (!) be careful. This deletes any property from any node with this name
      'loc', // :'(

      'range',
      'typeAnnotation',
      'returnType',
    ].includes(prop)) {
      delete ast[prop];
      return;
    }
    // Work around a poisoned getter/setter on .canon in non-ident tokens in dev mode
    let opd = Object.getOwnPropertyDescriptor(ast, prop);
    if (opd && 'value' in opd) {
      if (ast[prop] && typeof ast[prop] === 'object') {
        normalizeAst(ast[prop], prop);
      }
      let v = ast[prop];
      // Have to delete the prop in some cases, or re-ordering won't work
      // Need to trap because deleting array.length will throw an error
      try { delete ast[prop]; } catch (e) {}
      ast[prop] = v;
    }
  });
  return ast;
}

function hermesScrub(ast) {
  return astToString(ast);
}

function processHermesResult(hermesOk, hermesFail, zeparserFail, zash, INPUT_OVERRIDE) {
  let outputHermes = '';
  if (hermesFail && hermesFail.message.includes('Assertion')) {
    outputHermes += '\nHermes threw an ASSERTION error: ' + hermesFail.message + '\n';
  } else if (hermesOk && !zeparserFail) {
    let b = hermesScrub(normalizeAst(hermesOk, 'program'));
    let z = astToString(normalizeAst(zash.ast, 'program'));
    if (b === z) {
      // outputHermes += '\nHermes: same';
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

      console.log('Hermes ast:')
      console.dir(hermesOk, {depth: null})

      outputHermes += '\nHermes AST is different:\n' + d;
      if (INPUT_OVERRIDE) console.log('=>', outputHermes);
    }
  } else if (!hermesFail && zeparserFail) {
    // outputHermes += '\nHermes did not throw an error\n' + [hermesOk, hermesFail];
  } else if (hermesFail && !zeparserFail) {
    outputHermes += '\nHermes threw an error (and zeparser did not): ' + hermesFail.message + '\n';
    if (INPUT_OVERRIDE) console.log('=>', hermesFail.message);
  } else {
    // outputHermes = '\n(Hermes did not run)\n';
  }

  return outputHermes;
}

function ignoreZeparserTestForHermes(file) {
  // There are some files where I've asserted that the AST mismatch between Hermes and ZeParser is caused by something
  // either I won't fix, Hermes does wrong, or a difference that is benign enough not to matter to me.

  let p = file.slice(PROJECT_ROOT_DIR.length + 1);

  // https://github.com/facebook/hermes/blob/master/doc/Features.md

  // Hermes doesn't support async atm
  if (p.includes('async') || p.includes('await')) return true;
  // Class support
  if (p.startsWith('tests/testcases/classes')) return true;
  // `with` is not supported
  if (p.startsWith('tests/testcases/with_statement')) return true;
  // dynamic import
  if (p.startsWith('tests/testcases/import_dynamic')) return true;
  // unicode flag :/
  if (p.startsWith('tests/testcases/lexer_cases/regexesu')) return true;
  // almost anything es7+

  return [
    // No support for certain types of spread (explicitly)
    'tests/testcases/arrays/destructuring/forward_slash_cases/spread_with_array-division.md',
    'tests/testcases/arrays/destructuring/forward_slash_cases/spread_with_just_a_regex.md',
    'tests/testcases/arrays/destructuring/forward_slash_cases/spread_with_object-division.md',
    'tests/testcases/arrays/destructuring/forward_slash_cases/spread_with_regex-division.md',
    'tests/testcases/arrays/destructuring/forward_slash_cases/spread_with_regex-flag-division.md',
    'tests/testcases/arrays/destructuring/forward_slash_cases/spread_with_regex-plus.md',
    'tests/testcases/arrays/destructuring/forward_slash_cases/spread_with_shorthand_object-division_will_throw.md',
    'tests/testcases/arrays/destructuring/spread_an_assignment_in_array.md',
    'tests/testcases/arrays/destructuring/spread_with_arged_yield_keyword.md',
    'tests/testcases/arrays/destructuring/spread_with_argless_yield_keyword.md',
    'tests/testcases/arrays/destructuring/spread_with_array_with_tail_is_ok.md',
    'tests/testcases/arrays/destructuring/spread_with_ident_and_compound_assignment_is_ok.md',
    'tests/testcases/arrays/destructuring/spread_with_ident_is_ok.md',
    'tests/testcases/arrays/destructuring/spread_with_ident_with_tail_is_ok.md',
    'tests/testcases/arrays/destructuring/spreadrest_keywords/spread_a_value_keyword.md',
    'tests/testcases/arrays/literal/spread/array_spread_with_comma.md',
    'tests/testcases/arrays/literal/spread/can_splat_a_call_at_the_end_1.md',
    'tests/testcases/arrays/literal/spread/can_splat_a_call_at_the_end_2.md',
    'tests/testcases/arrays/literal/spread/can_splat_an_assignment_at_the_end_1.md',
    'tests/testcases/arrays/literal/spread/can_splat_an_assignment_at_the_end_2.md',
    'tests/testcases/arrays/literal/spread/can_splat_an_expression_at_the_end_1.md',
    'tests/testcases/arrays/literal/spread/can_splat_an_expression_at_the_end_2.md',
    'tests/testcases/arrays/literal/spread/can_splat_in_the_middle.md',
    'tests/testcases/arrays/literal/spread/can_splat_this.md',
    'tests/testcases/arrays/literal/spread/splat_another_value.md',
    'tests/testcases/arrays/literal/spread/spread_on_string_property_assignment.md',
    'tests/testcases/call_expression/function_call_one_arg_spread.md',
    'tests/testcases/call_expression/function_call_three_args_spread.md',
    'tests/testcases/call_expression/trailing_comma/enabled_ESx003dx0060Infinityx0060/can_after_spread.md',
    'tests/testcases/call_expression/trailing_comma/enabled_ESx003dx0060undefinedx0060/can_after_spread.md',
    'tests/testcases/call_expression/trailing_comma/gen/can_after_spread/Infinity.md',
    'tests/testcases/call_expression/trailing_comma/gen/can_after_spread/undefined.md',
    'tests/testcases/const_statement/binding_generic/array_pattern_binding_declarations/gen/const/x005bax003dx005bx002ex002ex002ebx005d_x002ex002ex002ecx005d_x003d_obj_.md',
    'tests/testcases/const_statement/binding_generic/array_pattern_binding_declarations/gen/let/x005bax003dx005bx002ex002ex002ebx005d_x002ex002ex002ecx005d_x003d_obj_.md',
    'tests/testcases/const_statement/binding_generic/array_pattern_binding_declarations/gen/var/x005bax003dx005bx002ex002ex002ebx005d_x002ex002ex002ecx005d_x003d_obj_.md',
    'tests/testcases/const_statement/binding_generic/as_a_statement/destructuring/array/rest_operator/spread_vs_rest.md',
    'tests/testcases/const_statement/binding_generic/in_a_for-header/destructuring/for-in/array/rest_operator/spread_and_rest.md',
    'tests/testcases/const_statement/binding_generic/in_a_for-header/destructuring/for-of/array/rest_operator/spread_and_rest.md',
    'tests/testcases/const_statement/binding_generic/in_a_for-header/destructuring/regular_for-loop/array/rest_operator/spread_and_rest.md',
    'tests/testcases/functions/function_args/destructuring/array/rest_operator/spread_and_rest_sans_default.md',
    'tests/testcases/functions/function_args/destructuring/array/rest_operator/spread_and_rest_with_default.md',
    'tests/testcases/functions/function_args/destructuring/array/rest_operator/spread_on_array_with_default_on_array.md',
    'tests/testcases/let_declaration/binding_generic/as_a_statement/destructuring/array/rest_operator/spread_vs_rest.md',
    'tests/testcases/let_declaration/binding_generic/in_a_for-header/destructuring/for-in/array/rest_operator/spread_and_rest.md',
    'tests/testcases/let_declaration/binding_generic/in_a_for-header/destructuring/for-of/array/rest_operator/spread_and_rest.md',
    'tests/testcases/let_declaration/binding_generic/in_a_for-header/destructuring/regular_for-loop/array/rest_operator/spread_and_rest.md',
    'tests/testcases/mixed_arrayx002fobject_destructuring/inside_must_destruct_outside_cant.md',
    'tests/testcases/mixed_arrayx002fobject_destructuring/spread_of_an_obj_destructuring_assignment_with_property.md',
    'tests/testcases/operator_precedent/gen/spread/a_instanceof_b_x002b_c.md',
    'tests/testcases/operator_precedent/gen/spread/a_instanceof_b_x003e_c.md',
    'tests/testcases/operator_precedent/gen/spread/a_x002ax002a_b_x002b_c.md',
    'tests/testcases/operator_precedent/gen/spread/a_x002b_b_instanceof_c.md',
    'tests/testcases/operator_precedent/gen/spread/a_x002b_b_x002ax002a_c.md',
    'tests/testcases/operator_precedent/gen/spread/a_x002b_b_x002f_c.md',
    'tests/testcases/operator_precedent/gen/spread/a_x002f_b_x002b_c.md',
    'tests/testcases/operator_precedent/gen/spread/a_x003e_b_instanceof_c.md',
    'tests/testcases/var_statement/binding_generic/as_a_statement/destructuring/array/rest_operator/spread_vs_rest.md',
    'tests/testcases/var_statement/binding_generic/in_a_for-header/destructuring/for-in/array/rest_operator/spread_and_rest.md',
    'tests/testcases/var_statement/binding_generic/in_a_for-header/destructuring/for-of/array/rest_operator/spread_and_rest.md',
    'tests/testcases/var_statement/binding_generic/in_a_for-header/destructuring/regular_for-loop/array/rest_operator/spread_and_rest.md',
    'tests/testcases/yield/spread_a_yield.md',

    // Ignore: No support for async
    'tests/testcases/assigns/assigning_to_keyword/gen/array_with_assign_to_paren-wrapped/foo.md',
    'tests/testcases/assigns/assigning_to_keyword/gen/array_with_assign_to_unwrapped/foo.md',
    'tests/testcases/assigns/assigning_to_keyword/gen/assign_to_paren-wrapped_keyword_in_param_default/foo.md',
    'tests/testcases/assigns/assigning_to_keyword/gen/assign_to_paren-wrapped_keyword_inside_delete_in_param_default/foo.md',
    'tests/testcases/directive_prologues/default_expression_statement_behavior/function_variations/check_node_with_async_function.md',
    'tests/testcases/directive_prologues/into_Directive_node/function_variations/check_node_with_async_function.md',
    'tests/testcases/random_stuff/x002318/ax002f4.md',
    'tests/testcases/random_stuff/x002318/ax002f5.md',
    'tests/testcases/random_stuff/x002318/bx002f0.md',
    'tests/testcases/return_statement/should_work_in_arrow_D.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_func_declaration/const.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_func_declaration/let.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_func_declaration/var.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_func_expression/const.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_func_expression/let.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_func_expression/var.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_func_declaration/const.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_func_declaration/let.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_func_declaration/var.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_func_expression/const.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_func_expression/let.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_func_expression/var.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_method/const.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_method/let.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_generator_method/var.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_method/const.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_method/let.md',
    'tests/testcases/tests_related_to_bindings/functions/rebinding_func_name/gen/Async_method/var.md',

    // Classes not (fully) supported
    'tests/testcases/arrays/keywords_should_not_parse_as_regular_idents_in_awkward_places/gen/in_array/classx007bx007d.md',
    'tests/testcases/arrays/keywords_should_not_parse_as_regular_idents_in_awkward_places/x005bclassx007bx007dx005d_in_array.md',
    'tests/testcases/classes/as_expr.md',
    'tests/testcases/classes/assert_the_paren_1.md',
    'tests/testcases/group_or_arrow/arrow/position/gen/extends_arg/x0028x_x003dx003e_x007bx007dx0029.md',
    'tests/testcases/group_or_arrow/group/compound_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_1.md',
    'tests/testcases/group_or_arrow/group/compound_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_2.md',
    'tests/testcases/group_or_arrow/group/regular_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_1.md',
    'tests/testcases/group_or_arrow/group/regular_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_2.md',
    'tests/testcases/classes/class_expression_with_tail.md',
    'tests/testcases/classes/computed_generators.md',
    'tests/testcases/classes/constructor_name_checks/as_ident/constructor_as_dynamic_property_should_be_a_method.md',
    'tests/testcases/functions/class_expr_in_arrow_params.md',
    'tests/testcases/group_or_arrow/group/invalid_arrow_header_things_that_are_valid_in_a_group/gen/in_group/classx007bx007d.md',
    'tests/testcases/new/new_operator/argument_special_cases/class_extending.md',
    'tests/testcases/new/new_operator/argument_special_cases/class_extending_grouped_expression.md',
    'tests/testcases/new/new_operator/argument_special_cases/class_extending_objlit.md',
    'tests/testcases/new/new_operator/argument_special_cases/class_with_body.md',
    'tests/testcases/new/new_operator/argument_special_cases/new_super_call.md',
    'tests/testcases/new/new_operator/argument_special_cases/new_super_property.md',
    'tests/testcases/new/new_operator/edge_cases/after_spread.md',
    'tests/testcases/new/new_operator/edge_cases/extends_value.md',
    'tests/testcases/new/newx002etarget/edge_cases/after_spread.md',
    'tests/testcases/new/newx002etarget/edge_cases/extends_value.md',
    'tests/testcases/new/newx002etarget/inside_args/class_constructor.md',
    'tests/testcases/new/newx002etarget/inside_args/class_method.md',
    'tests/testcases/new/newx002etarget/inside_args/class_static_member.md',
    'tests/testcases/new/newx002etarget/objx002fclass_methods/class/constructor.md',
    'tests/testcases/new/newx002etarget/objx002fclass_methods/class/method.md',
    'tests/testcases/new/newx002etarget/objx002fclass_methods/class/static_member.md',
    'tests/testcases/objects/good_supers/gen/destructuring_with_number_key/superx002ecool.md',
    'tests/testcases/objects/good_supers/gen/destructuring_with_number_key/superx005bcoolx005d.md',
    'tests/testcases/objects/good_supers/gen/destructuring_with_string_key/superx002ecool.md',
    'tests/testcases/objects/good_supers/gen/destructuring_with_string_key/superx005bcoolx005d.md',
    'tests/testcases/objects/good_supers/gen/object_with_number_key/superx0028x0029.md',
    'tests/testcases/objects/good_supers/gen/object_with_number_key/superx002ecool.md',
    'tests/testcases/objects/good_supers/gen/object_with_number_key/superx005bcoolx005d.md',
    'tests/testcases/objects/good_supers/gen/object_with_string_key/superx0028x0029.md',
    'tests/testcases/objects/good_supers/gen/object_with_string_key/superx002ecool.md',
    'tests/testcases/objects/good_supers/gen/object_with_string_key/superx005bcoolx005d.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx0028x0029x0060/number_key/object.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx0028x0029x0060/string_key/object.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx002ecoolx0060/number_key/destructuring.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx002ecoolx0060/number_key/object.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx002ecoolx0060/string_key/destructuring.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx002ecoolx0060/string_key/object.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx005bcoolx005dx0060/number_key/destructuring.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx005bcoolx005dx0060/number_key/object.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx005bcoolx005dx0060/string_key/destructuring.md',
    'tests/testcases/objects/good_supers_keywordx003dx0060superx005bcoolx005dx0060/string_key/object.md',
    'tests/testcases/objects/keywords_should_not_parse_as_regular_idents_in_awkward_places/gen/in_object_as_value/classx007bx007d.md',
    'tests/testcases/objects/keywords_should_not_parse_as_regular_idents_in_awkward_places/x005bclassx007bx007dx005d_in_object_as_value.md',
    'tests/testcases/parens/group/compound_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_1.md',
    'tests/testcases/parens/group/compound_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_2.md',
    'tests/testcases/parens/group/invalid_arrow_header_things_that_are_valid_in_a_group/x005bclassx007bx007dx005d_in_group.md',
    'tests/testcases/parens/group/regular_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_1.md',
    'tests/testcases/parens/group/regular_assignment_to_group/assignment_to_a_wrapped_super_property_silly_but_valid_2.md',
    'tests/testcases/regexes/regular_expression_disambiguation/keyword_asi_div/keyword_asi_regex_flag/extends_class.md',
    'tests/testcases/regexes/regular_expression_disambiguation/keyword_asi_div/keyword_asi_regex_no_flag/extends_class.md',
    'tests/testcases/return_statement/should_work_in_class_method.md',
    'tests/testcases/return_statement/should_work_in_constructor.md',
    'tests/testcases/statements_and_declarations/cannot_nest_a_declaration_inside_a_non-block_statement/class/block.md',
    'tests/testcases/statements_and_declarations/cannot_nest_a_declaration_inside_a_non-block_statement/class/case.md',
    'tests/testcases/statements_and_declarations/cannot_nest_a_declaration_inside_a_non-block_statement/class/catch.md',
    'tests/testcases/statements_and_declarations/cannot_nest_a_declaration_inside_a_non-block_statement/class/default.md',
    'tests/testcases/statements_and_declarations/cannot_nest_a_declaration_inside_a_non-block_statement/class/finally.md',
    'tests/testcases/statements_and_declarations/cannot_nest_a_declaration_inside_a_non-block_statement/class/try.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_constructor_as_param_name_w_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_constructor_as_param_name_wx002fo_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_constructor_assigned_to_in_param_default_wx002fo_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/eval.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/implements.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/interface.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/let.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/package.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/private.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/protected.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/public.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/static.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/yield.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/arguments.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/eval.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/implements.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/interface.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/let.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/package.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/private.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/protected.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_w_directive/arguments.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/public.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/static.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_func_name_wx002fo_directive/yield.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_param_name_w_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_as_param_name_wx002fo_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/func_decl/gen/class_method_assigned_to_in_param_default_wx002fo_directive/ok.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bargumentsx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bargumentsx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bevalx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bevalx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bimplementsx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bimplementsx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005binterfacex005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005binterfacex005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bletx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bletx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bpackagex005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bpackagex005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bprivatex005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bprivatex005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bprotectedx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bprotectedx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bpublicx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bpublicx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bstaticx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005bstaticx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005byieldx005d/class_method/as_method_name_w_directive.md',
    'tests/testcases/strict_mode/header_requirements_for_directive_in_body/ident_x003d_x005byieldx005d/class_method/as_method_name_wx002fo_directive.md',
    'tests/testcases/super_keyword/call/class_constructors/allowed_in_constructor_arg_defaults.md',
    'tests/testcases/super_keyword/call/class_constructors/can_call_functions_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/call/class_constructors/can_call_super_twice.md',
    'tests/testcases/super_keyword/call/class_constructors/can_execute_things_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/call/class_constructors/can_refer_to_this_after_calling_superx0028x0029_in_arg_default.md',
    'tests/testcases/super_keyword/call/class_constructors/chicken_meet_egg_runtime_error.md',
    'tests/testcases/super_keyword/call/class_constructors/no_syntax_error_to_refer_to_x0060superx0060_prop_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/call/class_constructors/not_a_syntax_error_just_runtime_to_refer_to_x0060thisx0060_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/call/class_constructors/ok_inside_constructor_of_class_that_extends_another_class.md',
    'tests/testcases/super_keyword/call/class_constructors/ok_to_omit_from_constructor_of_class_that_extends_another_class.md',
    'tests/testcases/super_keyword/call/class_constructors/okay_to_omit_with_methods_without_constructor.md',
    'tests/testcases/super_keyword/call/class_constructors/okay_to_omit_without_constructor.md',
    'tests/testcases/super_keyword/call/class_constructors/referring_to_x0060thisx0060_in_arg_default_before_calling_x0060superx0028x0029x0060_is_a_runtime_error.md',
    'tests/testcases/super_keyword/call/could_be_used_in_class_in_func_arg_default.md',
    'tests/testcases/super_keyword/call/in_arrows/allowed_in_arg_of_extending_constructor.md',
    'tests/testcases/super_keyword/call/in_arrows/allowed_in_extending_constructor.md',
    'tests/testcases/super_keyword/call/in_arrows/allowed_in_nested_arrow_in_valid_constructor.md',
    'tests/testcases/super_keyword/property/dot/allowed_in_constructor_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dot/allowed_in_method_arg_default_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dot/allowed_in_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/allowed_in_constructor_arg_defaults.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/can_call_functions_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/can_call_super_twice.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/can_execute_things_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/can_refer_to_this_after_calling_superx0028x0029_in_arg_default.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/chicken_meet_egg_runtime_error.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/error_inside_constructor_of_class_that_does_NOT_extends_another_class.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/no_syntax_error_to_refer_to_x0060superx0060_prop_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/not_a_syntax_error_just_runtime_to_refer_to_x0060thisx0060_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/ok_inside_constructor_of_class_that_extends_another_class.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/ok_to_omit_from_constructor_of_class_that_extends_another_class.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/okay_to_omit_with_methods_without_constructor.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/okay_to_omit_without_constructor.md',
    'tests/testcases/super_keyword/property/dot/class_constructors/referring_to_x0060thisx0060_in_arg_default_before_calling_x0060superx0028x0029x0060_is_a_runtime_error.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_arg_of_extending_constructor.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_arg_of_method_of_extending_class.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_arg_of_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_arg_of_non-extending_constructor.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_extending_constructor.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_method_of_extending_class.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_nested_arrow_in_extending_constructor.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_nested_arrow_in_method_of_extending_class.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_nested_arrow_in_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_nested_arrow_in_non-extending_constructor.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_non-extending_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/allowed_in_constructor_arg_defaults.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/can_call_functions_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/can_call_super_twice.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/can_execute_things_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/can_refer_to_this_after_calling_superx0028x0029_in_arg_default.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/chicken_meet_egg_runtime_error.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/error_inside_constructor_of_class_that_does_NOT_extends_another_class.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/no_syntax_error_to_refer_to_x0060superx0060_prop_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/not_a_syntax_error_just_runtime_to_refer_to_x0060thisx0060_before_calling_x0060superx0028x0029x0060.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/ok_inside_constructor_of_class_that_extends_another_class.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/ok_to_omit_from_constructor_of_class_that_extends_another_class.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/okay_to_omit_with_methods_without_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/okay_to_omit_without_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/class_constructors/referring_to_x0060thisx0060_in_arg_default_before_calling_x0060superx0028x0029x0060_is_a_runtime_error.md',
    'tests/testcases/super_keyword/property/dynamic/computed_allowed_in_arg_default_method_of_object.md',
    'tests/testcases/super_keyword/property/dynamic/computed_allowed_in_constructor_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/computed_allowed_in_method_arg_default_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/computed_allowed_in_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/computed_allowed_in_method_of_object.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_arg_of_extending_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_arg_of_method_of_extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_arg_of_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_arg_of_non-extending_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_extending_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_method_of_extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_nested_arrow_in_extending_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_nested_arrow_in_method_of_extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_nested_arrow_in_method_of_non-extending_class.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_nested_arrow_in_method_of_objlit.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_nested_arrow_in_non-extending_constructor.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_non-extending_constructor.md',
    'tests/testcases/templates/class_quasi.md',
    'tests/testcases/tests_related_to_bindings/methods/classes/dupe_args_with_local_bindings/simple_arg_as_a_func_name.md',
    'tests/testcases/tests_related_to_bindings/methods/classes/dupe_args_with_local_bindings/simple_arg_as_own_func_name.md',
    'tests/testcases/tests_related_to_bindings/methods/classes/dupe_args_with_local_bindings/simple_arg_as_var_name.md',
    'tests/testcases/tests_related_to_bindings/methods/classes/dupe_local_vars/funcdecl_and_var.md',
    'tests/testcases/yield/state_resetting_edge_cases/can_grouped_yield_in_extend_value_of_class.md',
    'tests/testcases/yield/state_resetting_edge_cases/can_yield_in_computed_name_of_class_method.md',

    // Bug (or not supported?): super property is allowed in an object
    'tests/testcases/super_keyword/property/dot/allowed_in_arg_default_method_of_object.md',
    'tests/testcases/super_keyword/property/dot/allowed_in_method_of_object.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_arg_of_method_of_objlit.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_method_of_objlit.md',
    'tests/testcases/super_keyword/property/dot/in_arrows/allowed_in_nested_arrow_in_method_of_objlit.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_arg_of_method_of_objlit.md',
    'tests/testcases/super_keyword/property/dynamic/in_arrows/allowed_in_method_of_objlit.md',

    // Bug: `get`/`set` is a valid name but it seems like it's not allowing that case
    'tests/testcases/objects/literals/identifier_properties/get_can_be_special_but_can_also_be_destructured_shorthand.md',
    'tests/testcases/objects/literals/identifier_properties/get_can_be_special_but_can_also_be_shorthand.md',
    'tests/testcases/objects/literals/identifier_properties/set_can_be_special_but_can_also_be_destructured_shorthand.md',
    'tests/testcases/objects/literals/identifier_properties/set_can_be_special_but_can_also_be_shorthand.md',

    // Bug: forward slash on new line after
    // - class expression is division
    'tests/testcases/classes/babel_case_A.md',
    'tests/testcases/classes/babel_case_C.md',
    'tests/testcases/classes/class_as_arg_default_A.md',
    'tests/testcases/classes/class_as_arg_default_ABC.md',
    'tests/testcases/classes/class_as_arg_default_B.md',
    'tests/testcases/classes/class_as_arg_default_C1.md',
    'tests/testcases/classes/class_as_arg_default_C2.md',
    'tests/testcases/classes/class_expression_with_body_and_tail.md',
    'tests/testcases/classes/class_expression_with_body_sans_tail.md',
    // .. and on same line, too
    'tests/testcases/classes/babel_case_B.md',
    // - after directive
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/should_expect_a_div.md',
    'tests/testcases/directive_prologues/into_Directive_node/global/should_expect_a_div.md',

    // Bug: incorrectly parsing directives
    'tests/testcases/directive_prologues/default_expression_statement_behavior/global/should_not_over-aggressively_apply_ASI.md',
    'tests/testcases/directive_prologues/into_Directive_node/global/should_not_over-aggressively_apply_ASI.md',
    'tests/testcases/directive_prologues/octals/strict_mode_directive_as_tag.md',
    'tests/testcases/strict_mode/tails_relevant_to_ASI_which_affects_directive_status/gen/case/x0028x0029.md', // Well... technically it's calling a function, which is not a parse error
    'tests/testcases/strict_mode/tails_relevant_to_ASI_which_affects_directive_status/gen/case/x002b_x.md',
    'tests/testcases/strict_mode/tails_relevant_to_ASI_which_affects_directive_status/gen/case/x002efoo.md',
    'tests/testcases/strict_mode/tails_relevant_to_ASI_which_affects_directive_status/gen/case/x002ff.md',
    'tests/testcases/strict_mode/tails_relevant_to_ASI_which_affects_directive_status/gen/case/x002ffx002fg.md',
    'tests/testcases/strict_mode/tails_relevant_to_ASI_which_affects_directive_status/gen/case/x005bfoox005d.md',
    'tests/testcases/strict_mode/tails_relevant_to_ASI_which_affects_directive_status/gen/case/x0060xx0060.md',

    // Bug (?): 2028/2029 location
    'tests/testcases/string/2028_is_ok.md',
    'tests/testcases/string/2029_is_ok.md',
    'tests/testcases/string/escapes/2028.md',
    'tests/testcases/string/escapes/2029.md',
    'tests/testcases/templates/escapes/2028.md',
    'tests/testcases/templates/escapes/2029.md',

    // Bug: destructuring in catch
    'tests/testcases/tests_related_to_bindings/catch/destructed_catch_var_can_add_multiple_bindings.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward/gen/tryx002fcatch_no_finally/Infinity.md',
    'tests/testcases/try_statement/catch_arg/pattern_catch_does_not_shadow_arrow_param.md',
    'tests/testcases/try_statement/catch_arg/present/array_with_inside_default.md',
    'tests/testcases/try_statement/catch_arg/present/object_with_inside_default.md',
    'tests/testcases/try_statement/catch_arg/present/simple_array_destruct.md',
    'tests/testcases/try_statement/catch_arg/present/simple_object_destruct.md',

    // Ignore: optional catch binding (es8 or something?)
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward/gen/tryx002fcatch_no_finally/undefined.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward/gen/tryx002fcatchx002ffinally/Infinity.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward/gen/tryx002fcatchx002ffinally/undefined.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward_x0028versionx003dx0060Infinityx0060x0029/tryx002fcatch_asi.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward_x0028versionx003dx0060Infinityx0060x0029/tryx002fcatch_no_finally.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward_x0028versionx003dx0060Infinityx0060x0029/tryx002fcatchx002ffinally.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward_x0028versionx003dx0060undefinedx0060x0029/tryx002fcatch_asi.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward_x0028versionx003dx0060undefinedx0060x0029/tryx002fcatch_no_finally.md',
    'tests/testcases/try_statement/catch_arg/optional_catch_binding_supported_from_ES9_upward_x0028versionx003dx0060undefinedx0060x0029/tryx002fcatchx002ffinally.md',
    'tests/testcases/dowhile_statement/asi_is_weird/try_catch_finally.md',
    'tests/testcases/dowhile_statement/dowhile_throw.md',

    // Dunno :) eh, is it the name?
    'tests/testcases/unicode/double_byte_chars/named_group_with_unicode_escape_1.md',
    'tests/testcases/unicode/double_byte_chars/named_group_with_unicode_escape_2.md',
    'tests/testcases/unicode/double_byte_chars/named_group_with_unicode_escape_3.md',
    'tests/testcases/unicode/single_byte_chars/named_group_with_unicode_escape_1.md',


    // Bug: known and I assume fixed soon
    'tests/testcases/dowhile_statement/asi_is_weird/block.md',
    'tests/testcases/dowhile_statement/asi_is_weird/debugger_with_semi.md',
    'tests/testcases/dowhile_statement/asi_is_weird/if.md',
    'tests/testcases/dowhile_statement/asi_is_weird/switch.md',
    'tests/testcases/dowhile_statement/asi_is_weird/try_catch.md',
    'tests/testcases/dowhile_statement/do_missing_semi.md',
    'tests/testcases/dowhile_statement/do_while_asi_no_nl.md',

    // Ignore: __proto__ cases of web compat in strict mode. ZeParser does not do this :(
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_arr_in_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_arr_no_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_obj_in_web_compat.md',
    'tests/testcases/for_statement/for-loop/double_proto/double_proto_of_lhs_obj_no_web_compat.md',

    // Bug: `yield` in for-loop
    'tests/testcases/for_statement/for-loop/lhs_assign_expr_edge_cases/yield_keyword_lhs.md',
    'tests/testcases/for_statement/for-loop/lhs_assign_expr_edge_cases/yield_no-arg_lhs.md',

    // Bug: assertion failures in hermes :'(
    'tests/testcases/lexer_cases/numbers/decimal/5.pass.md',
    'tests/testcases/export_declaration/export_object_is_not_generic/cannot_contain_a_dynamic_method.md',
    'tests/testcases/export_declaration/export_object_is_not_generic/cannot_contain_a_dynamic_prop.md',
    'tests/testcases/export_declaration/export_object_is_not_generic/cannot_contain_a_generator.md',
    'tests/testcases/export_declaration/export_object_is_not_generic/cannot_destructure_a_rest.md',
    'tests/testcases/export_declaration/export_object_is_not_generic/cannot_destructure_an_array.md',
    'tests/testcases/export_declaration/export_object_is_not_generic/cannot_destructure_an_object_1.md',
    'tests/testcases/export_declaration/export_object_is_not_generic/cannot_destructure_an_object_2.md',
    'tests/testcases/for_statement/for-of/lhs_edge_cases/yield_arg_lhs.md',
    'tests/testcases/for_statement/for-of/lhs_edge_cases/yield_arg_with_x0060inx0060_lhs.md',
    'tests/testcases/for_statement/for-of/lhs_edge_cases/yield_keyword_lhs.md',
    'tests/testcases/for_statement/for-of/lhs_edge_cases/yield_no-arg_lhs_2.md',
    'tests/testcases/group_or_arrow/arrow/position/gen/yield_arg/async_x_x003dx003e_ok.md',
    'tests/testcases/group_or_arrow/arrow/position/gen/yield_arg/async_x_x003dx003e_x007bx007d.md',
    'tests/testcases/group_or_arrow/arrow/position/gen/yield_arg/async_async_x003dx003e_ok.md',
    'tests/testcases/group_or_arrow/arrow/position/gen/yield_arg/async_async_x003dx003e_x007bx007d.md',
    'tests/testcases/group_or_arrow/arrow/position/gen/yield_arg/async_x_x003dx003e_ok.md',
    'tests/testcases/group_or_arrow/arrow/position/gen/yield_arg/async_x_x003dx003e_x007bx007d.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_9/23x002eE56.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_9/x002e24e83.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/23x002eE56.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/x002e24e83.md',
    'tests/testcases/random_stuff/verified/for_header_instancoef.md',

    // No binary notation
    'tests/testcases/lexer_cases/numbers/binary/1.pass.md',
    'tests/testcases/literals/binary_literal/binary_number.md',
    'tests/testcases/numbers/must_be_separated/gen/Blocked/0B1.md',
    'tests/testcases/numbers/must_be_separated/gen/Blocked/0B0.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0B0.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0B1.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0b0.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0b1.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0B0.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0B1.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0b0.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0b1.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0B.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0B0.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0B1.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0b.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0b0.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0b1.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0B0.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0B1.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0b0.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0b1.md',
    // No octal notation
    'tests/testcases/lexer_cases/numbers/octal/1.pass.md',
    'tests/testcases/literals/octal_number.md',
    'tests/testcases/numbers/must_be_separated/gen/Blocked/0O0.md',
    'tests/testcases/numbers/must_be_separated/gen/Blocked/0O034.md',
    'tests/testcases/numbers/must_be_separated/gen/Blocked/0O5.md',
    'tests/testcases/numbers/must_be_separated/gen/Blocked/0o465.md',
    'tests/testcases/numbers/must_be_separated/gen/Blocked/0o7.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0O0.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0O034.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0O5.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0o0.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0o465.md',
    'tests/testcases/numbers/must_be_separated/gen/Plus/0o7.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0O034.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0O5.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0o0.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0o465.md',
    'tests/testcases/numbers/must_be_separated/gen/Semi/0o7.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0O.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0O0.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0O034.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0O5.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0o.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0o0.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0o465.md',
    'tests/testcases/numbers/must_be_separated/gen/Trailing_zero/0o7.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0O0.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0O034.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0O5.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0o0.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0o465.md',
    'tests/testcases/numbers/must_be_separated/gen/Valid_base/0o7.md',
    'tests/testcases/objects/literals/number_method/object_with_two_methods.md',
    'tests/testcases/objects/literals/number_properties/object_with_one_number_property_2.md',

    // Ignore: computed keys are not (properly?) supported
    'tests/testcases/objects/literals/setters_x0028destruct_argx0029/object_with_one_setter_method.md',

    // Ignore: regex uflag is not supported
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/gen/named_capturing_group_is_not_an_assert/x002a.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/gen/named_capturing_group_is_not_an_assert/x002ax003f.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/gen/named_capturing_group_is_not_an_assert/x002b.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/gen/named_capturing_group_is_not_an_assert/x002bx003f.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/gen/named_capturing_group_is_not_an_assert/x003f.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/gen/named_capturing_group_is_not_an_assert/x007b1x007d.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/gen/named_capturing_group_is_not_an_assert/x007b5_x007dx003f.md',
    'tests/testcases/regexes/named_capturing_groups/bad_syntax_cases/illegal_name_u_flag.md',
    'tests/testcases/regexes/some_annexb_stuff/char_class_in_a_range/unicode_bla.md',

    // Ignore: lookbehind not supported
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/negative_lookbehind_default.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/negative_lookbehind_es_latest.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/positive_lookbehind_default.md',
    'tests/testcases/regexes/assertions_have_no_quantifier_unless_web_and_sans_u/positive_lookbehind_es_latest.md',
    // Ignore: Named capturing groups
    'tests/testcases/regexes/named_capturing_groups/contains_dollar.md',
    'tests/testcases/regexes/named_capturing_groups/contains_underscore.md',
    'tests/testcases/regexes/named_capturing_groups/double_group.md',
    'tests/testcases/regexes/named_capturing_groups/k_escape/must_have_group.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode/idrest_group_name_dupe_check.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode/idrest_inside_groupname.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode/idstart_as_start_of_groupname.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode/idstart_as_whole_groupname.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode/idstart_name_dupe_check.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode/idstart_start_dupe_check.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idrest_es6_unicode.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idrest_group_name_dupe_check.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idrest_inside_groupname.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idstart_as_start_of_groupname.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idstart_as_whole_groupname.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idstart_es6_unicode.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idstart_name_dupe_check.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_double_escaped/idstart_start_dupe_check.u.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_long_escaped_with_uflag/idrest_group_name_dupe_check.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_long_escaped_with_uflag/idrest_inside_groupname.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_long_escaped_with_uflag/idstart_as_start_of_groupname.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_long_escaped_with_uflag/idstart_as_whole_groupname.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_long_escaped_with_uflag/idstart_name_dupe_check.md',
    'tests/testcases/regexes/named_capturing_groups/non_bmp_unicode_long_escaped_with_uflag/idstart_start_dupe_check.md',
    'tests/testcases/regexes/named_capturing_groups/simple_group.md',
    'tests/testcases/regexes/named_capturing_groups/start_with_dollar.md',
    'tests/testcases/regexes/named_capturing_groups/start_with_underscore.md',

    // Ignore: ZeParser does not normalize newlines
    'tests/testcases/zeprinter/template_with_cr.md',

    // Ignore: __proto__ in webcompat in strict mode (zeparser does not do this)
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/arr_paren_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_ident_and_string.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_string_and_ident.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_strings.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_two_idents.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_with_wrapped_in_array.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/bad_case_wrapped_in_array.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/ident_string.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/method_method.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/method_prop.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/obj_paren_wrapped_is_explicitly_exempted.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/okay_with_shorthand_left.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/okay_with_shorthand_right.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/paren_wrapped.md',
    'tests/testcases/objects/duplicate_keys/obj_expr/dunderproto___proto__/static_getter.md',

  ].includes(p);
}

function ignoreTest262Hermes(file) {
  // Comment nodes should be stripped from inputs
  return [
  ].includes(file.slice(file.indexOf('/test262/') + 1));
}

export {
  hermesScrub,
  compareHermes,
  ignoreTest262Hermes,
  ignoreZeparserTestForHermes,
  processHermesResult,
  testHermes,
};
