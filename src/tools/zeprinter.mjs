// Serialize an AST into source code
// The resulting string may be different than the original input but should parse into an equivalent AST
// The output of this printer is in particular overly saturated with parentheses.

function $w(node) {
  return '(' + $(node) + ')';
}
function $(node, _, __, fromFor) {
  switch(node.type) {
    case 'ArrayExpression':
      return '[' + node.elements.map(n => n === null ? ',' : ($(n) + (n.type === 'RestElement' ? '' : ','))).join(' ') + ']';
    case 'ArrayPattern':
      return '[' + node.elements.map(n => n === null ? ',' : ($(n) + (n.type === 'RestElement' ? '' : ','))).join(' ') + ']';
    case 'ArrowFunctionExpression':
      let body = node.expression ? $w(node.body) : $(node.body);
      if (
        node.params.length === 1 &&
        node.params[0].type !== 'AssignmentPattern' &&
        node.params[0].type !== 'ArrayPattern' &&
        node.params[0].type !== 'ObjectPattern' &&
        node.params[0].type !== 'RestElement'
      ) {
        return (node.async ? 'async ' : '') + $(node.params[0]) + ' => ' + body;
      }
      return (node.async ? 'async ' : '') + '(' + node.params.map($).join(', ') + ') => ' + body;
    case 'AssignmentExpression':
      return '(' + $(node.left) + ' ' + node.operator + ' ' + $(node.right) + ')';
    case 'AssignmentPattern':
      return $(node.left) + ' = ' + $(node.right);
    case 'AwaitExpression':
      return 'await (' + $(node.argument) + ')';
    case 'BinaryExpression':
      return '((' + $(node.left) + ') ' + node.operator + ' (' + $(node.right) + '))';
    case 'BlockStatement':
      return '{' + node.body.map($).join('\n') + '}';
    case 'BooleanLiteral':
      return node.value;
    case 'BreakStatement':
      return 'break' + (node.label ? ' ' + $(node.label) : '') + ';';
    case 'CallExpression':
      return (
        node.callee.type === 'Import' ||
        node.callee.type === 'Super' ||
        node.callee.name === 'async' // `async({__proto__: 1, __proto__: 2})`
          ? $(node.callee)
          : $w(node.callee)
      ) + '(' + node.arguments.map($).join(', ') + ')';
    case 'CatchClause':
      return 'catch ' + (node.param ? $w(node.param) + ' ' : '') + $(node.body);
    case 'ClassBody':
      return '{' + node.body.map($).join('\n') + '}';
    case 'ClassDeclaration':
    case 'ClassExpression':
      return 'class' + (node.id ? ' ' + $(node.id) : '') + (node.superClass ? ' extends (' + $(node.superClass) + ') ' : '') + $(node.body);
    case 'ClassMethod':
      return (
        (node.static ? 'static ' : '') +
        (node.kind === 'get' ? 'get ' : '') +
        (node.kind === 'set' ? 'set ' : '') +
        (node.value.async ? 'async ' : '') +
        (node.value.generator ? '* ' : '') +
        (node.computed ? '[' + $(node.value.id) + ']' : $(node.value.id)) +
        '(' + $(node.value.params).join(', ') + ')' +
        $(node.value.body) +
        ';'
      );
    case 'CommentBlock':
      return '/*' + node.value + '*/';
    case 'CommentLine':
      return '//' + node.value + '\n';
    case 'ConditionalExpression':
      return '(' + $w(node.test) + '? ' + $w(node.consequent) + ' : ' + $w(node.alternate) + ')';
    case 'ContinueStatement':
      return 'continue' + (node.label ? ' ' + $(node.label) : '') + ';';
    case 'DebuggerStatement':
      return 'debugger;';
    case 'Directive':
      return $(node.value);
    case 'DirectiveLiteral':
      return "'" + node.value + "';";
    case 'DoWhileStatement':
      return 'do ' + $(node.body) + ' while ' + $w(node.test) + ';';
    case 'EmptyStatement':
      return ';';
    case 'ExportAllDeclaration':
      return 'export * from ' + $(node.source) + ';';
    case 'ExportDefaultDeclaration':
      return 'export default ' + $(node.declaration) + (node.declaration.type === 'ClassDeclaration' || node.declaration.type === 'FunctionDeclaration' ? '' : ';');
    case 'ExportNamedDeclaration':
      return 'export ' + (node.declaration ? $(node.declaration) : ('{' + node.specifiers.map($).join(', ') + '}')) + (node.source ? ' from ' + $(node.source) : '');
    case 'ExportSpecifier':
      return (node.local.name !== node.exported.name ? $(node.local) + ' as ' : '') + $(node.exported);
    case 'ExpressionStatement':
      if (node.directive === undefined && ( // Protect directives from demotion
        node.expression.type === 'ObjectExpression' ||
        node.expression.type === 'ArrayExpression' || // [{__proto__: 1, __proto__: 2}]
        node.expression.type === 'SequenceExpression' ||
        node.expression.type === 'FunctionExpression' ||
        node.expression.type === 'ClassExpression' ||
        node.expression.type === 'BinaryExpression' ||
        node.expression.type === 'MemberExpression' ||
        node.expression.type === 'UnaryExpression' ||
        node.expression.type === 'CallExpression' ||
        (!node.directive && node.expression.type === 'Literal' && typeof node.expression.value === 'string') || // Prevent grouped strings of being promoted to directives
        node.expression.type === 'AssignmentExpression'
      )) {
        // :'(
        return $w(node.expression) + ';';
      }
      return $(node.expression) + ';';
    case 'ForInStatement':
      return 'for (' + (node.left.type === 'VariableDeclaration' || node.left.type === 'ObjectPattern' || node.left.type === 'ArrayPattern' ? $(node.left, undefined, undefined, true) : $w(node.left)) + ' in ' + $(node.right) + ') ' + $(node.body);
    case 'ForOfStatement':
      return 'for ' + (node.await ? 'await ' : '') + '(' + (node.left.type === 'VariableDeclaration' || node.left.type === 'ObjectPattern' || node.left.type === 'ArrayPattern' ? $(node.left, undefined, undefined, true) : $w(node.left)) + ' of ' + $(node.right) + ') ' + $(node.body);
    case 'ForStatement':
      return 'for (' + (node.init ? (node.init.type === 'VariableDeclaration' ? $(node.init, undefined, undefined, true) : $w(node.init)) : '') + ';' + (node.test ? $(node.test) : '') + ';' + (node.update ? $(node.update) : '') + ') ' + $(node.body);
    case 'FunctionDeclaration':
    case 'FunctionExpression':
      return (node.async ? 'async ' : '') + 'function' + (node.generator ? '*' : '') + (node.id ? ' ' + $(node.id) : '') + '(' + node.params.map($).join(', ') + ') {' + node.body.body.map($).join('\n') + '}';
    case 'Identifier':
      return node.name;
    case 'IfStatement':
      return 'if ' + $w(node.test) + ' ' + $(node.consequent) + (node.alternate ? ' else ' + $(node.alternate) : '');
    case 'Import':
      return 'import';
    case 'ImportDeclaration': {
      let importSpecifiers = node.specifiers.filter(s => s.type === 'ImportSpecifier');
      let otherSpecifiers = node.specifiers.filter(s => s.type !== 'ImportSpecifier');
      if (!importSpecifiers.length && !otherSpecifiers.length) {
        return 'import {}' + (node.source ? ' from ' + $(node.source) : '') + ';';
      }
      return 'import ' + (otherSpecifiers.length ? otherSpecifiers.map($).join(', ') : '') + (importSpecifiers.length && otherSpecifiers.length ? ', ' : '') + (importSpecifiers.length ? '{' + importSpecifiers.map($).join(', ') + '}' : '') + (node.source ? ' from ' + $(node.source) : '') + ';';
    }
    case 'ImportDefaultSpecifier':
      return $(node.local);
    case 'ImportExpression':
      return 'import(' + node.arguments.map($).join(', ') + ')';
    case 'ImportNamespaceSpecifier':
      return '* as ' + $(node.local);
    case 'ImportSpecifier':
      return $(node.imported) + (node.local ? ' as ' + $(node.local) : '');
    case 'LabeledStatement':
      return $(node.label) + ': ' + $(node.body);
    case 'Literal':
      switch (typeof node.value) {
        case 'boolean':
          return node.raw;
        case 'number':
          return node.raw;
        case 'string':
          return node.raw;
        case 'object': // regex
          return node.raw;
      }
      throw new Error('fixme; literal type');
    case 'LogicalExpression':
      return '(' + $w(node.left) + ' ' + node.operator + ' ' + $w(node.right) + ')';
    case 'MemberExpression':
      if (
        node.object.type === 'ObjectExpression' ||
        node.object.type === 'SequenceExpression' ||
        node.object.type === 'FunctionExpression' ||
        node.object.type === 'ClassExpression' ||
        node.object.type === 'BinaryExpression' ||
        node.object.type === 'MemberExpression' ||
        node.object.type === 'CallExpression' ||
        node.object.type === 'UnaryExpression' || // `(!t).y`
        node.object.type === 'ArrowFunctionExpression' ||
        node.object.type === 'UpdateExpression' || // `(++x)[x]`
        (node.object.type === 'Literal' && typeof node.object.value === 'number') || // `4 .p`
        node.object.type === 'AssignmentExpression'
      ) {
        return $w(node.object) + (node.computed ? '[' + $(node.property) + ']' : ('.' + $(node.property)));
      } else {
        return $(node.object) + (node.computed ? '[' + $(node.property) + ']' : ('.' + $(node.property)));
      }

    case 'MetaProperty':
      return $(node.meta) + '.' + $(node.property);
    case 'MethodDefinition':
      return (
        (node.static ? 'static ' : '') +
        (node.kind === 'get' ? 'get ' : '') +
        (node.kind === 'set' ? 'set ' : '') +
        (node.value.async ? 'async ' : '') +
        (node.value.generator ? '* ' : '') +
        (node.computed ? '[' + $(node.key) + ']' : $(node.key)) +
        '(' + node.value.params.map($).join(', ') + ')' +
        $(node.value.body) +
        ';'
      );
    case 'NewExpression':
      return 'new ' + (node.callee.type !== 'Super' && node.callee.type !== 'Import' ? $w(node.callee) : $(node.callee)) + '(' + node.arguments.map($).join(', ') + ')';
    case 'NullLiteral':
      return 'null';
    case 'NumericLiteral':
      return node.raw;
    case 'ObjectExpression':
      return '{' + node.properties.map($).join(', ') + '}';
    case 'ObjectMethod':
      return (
        (node.static ? 'static ' : '') +
        (node.kind === 'get' ? 'get ' : '') +
        (node.kind === 'set' ? 'set ' : '') +
        (node.value.async ? 'async ' : '') +
        (node.value.generator ? '* ' : '') +
        (node.computed ? '[' + $(node.value.id) + ']' : $(node.value.id)) +
        '(' + $(node.value.params).join(', ') + ')' +
        $(node.value.body) +
        ','
      );
    case 'ObjectPattern':
      return '{' + node.properties.map($).join(', ') + '}';
    case 'ObjectProperty':
    case 'Program':
      return node.body.map($).join('\n');
    case 'Property':
      return (
        (node.kind === 'get' || node.kind === 'set' || node.method) ?
        (
          (node.static ? 'static ' : '') +
          (node.kind === 'get' ? 'get ' : '') +
          (node.kind === 'set' ? 'set ' : '') +
          (node.value.async ? 'async ' : '') +
          (node.value.generator ? '* ' : '') +
          (node.computed ? '[' : '') + $(node.key) + (node.computed ? ']' : '') +
          '(' + node.value.params.map($).join(', ') + ')' +
          $(node.value.body) +
          ''
        ) : (
          (node.shorthand ? '' : ((node.computed ? '[' : '') + $(node.key) + (node.computed ? ']' : '') + ':')) + $(node.value)
        )
      );
    case 'RegExpLiteral':
      return node.raw;
    case 'RestElement':
      return '...' + $(node.argument);
    case 'ReturnStatement':
      return 'return' + (node.argument ? ' ' + $(node.argument) : '') + ';';
    case 'SequenceExpression':
      return '(' + node.expressions.map($).join(', ') + ')';
    case 'SpreadElement':
      return '...' + $(node.argument);
    case 'StringLiteral':
      return node.raw;
    case 'Super':
      return 'super';
    case 'SwitchCase':
      return (node.test ? 'case ' + $(node.test) : 'default') + ':\n' + node.consequent.map($).join('\n');
    case 'SwitchStatement':
      return 'switch ' + $w(node.discriminant) + ' {' + node.cases.map($).join('\n') + '}';
    case 'TaggedTemplateExpression':
      return $w(node.tag) + $(node.quasi);
    case 'TemplateElement':
      return node.value.raw;
    case 'TemplateLiteral':
      return '`' + $(node.quasis[0]) + (node.expressions.length ? '${' : '') + node.expressions.map((e, i) => $(e) + '}' + $(node.quasis[i+1])).join('${') + '`';
    case 'ThisExpression':
      return 'this';
    case 'ThrowStatement':
      return 'throw ' + $(node.argument) + ';';
    case 'TryStatement':
      return 'try ' + $(node.block) + (node.handler ? ' ' + $(node.handler) : '') + (node.finalizer ? ' finally ' + $(node.finalizer) : '');
    case 'UnaryExpression':
      return node.operator + ' ' + $w(node.argument);
    case 'UpdateExpression':
      return (node.prefix ? node.operator : '') + $(node.argument) + (node.prefix ? '' : node.operator);
    case 'VariableDeclaration':
      return node.kind + ' ' + node.declarations.map($).join(', ') + (fromFor ? '' : ';'); // no semi inside `for`
    case 'VariableDeclarator':
      return $(node.id) + (node.init ? ' = ' + $(node.init) : '');
    case 'WhileStatement':
      return 'while ' + $w(node.test) + ' ' + $(node.body);
    case 'WithStatement':
      return 'with ' + $w(node.object) + ' ' + $(node.body);
    case 'YieldExpression':
      return '(yield' + (node.delegate ? ' *' : '') + (node.argument ? ' ' + $w(node.argument) : '') + ')';
    default:
      // console.log('ZePrinter error node:', node);
      throw new Error('Missing node type? ' + node.type);
  }
  throw new Error('TODO; implement stringify for ' + node.type);
}

export {
  $ as zeprinter,
};

