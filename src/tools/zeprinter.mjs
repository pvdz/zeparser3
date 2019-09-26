// Serialize an AST into source code
// The resulting string may be different than the original input but should parse into an equivalent AST
// The output of this printer is in particular overly saturated with parentheses.

// IT SEEMS THIS IS A PRETTY SLOW PRINTER. Seems to its job but consider yourself warned. I didn't write this for perf.

function ArrayExpression(node) {
  return '[' + node.elements.map(n => n === null ? ',' : ($(n) + (n.type === 'RestElement' ? '' : ','))).join(' ') + ']';
}
function ArrayPattern(node) {
  return '[' + node.elements.map(n => n === null ? ',' : ($(n) + (n.type === 'RestElement' ? '' : ','))).join(' ') + ']';
}
function ArrowFunctionExpression(node) {
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
}
function AssignmentExpression(node) {
  return '(' + $(node.left) + ' ' + node.operator + ' ' + $(node.right) + ')';
}
function AssignmentPattern(node) {
  return $(node.left) + ' = ' + $(node.right);
}
function AwaitExpression(node) {
  return 'await (' + $(node.argument) + ')';
}
function BigIntLiteral(node) {
  return node.bigint + 'n';
}
function BinaryExpression(node) {
  return '((' + $(node.left) + ') ' + node.operator + ' (' + $(node.right) + '))';
}
function BlockStatement(node) {
  return '{' + node.body.map($).join('\n') + '}';
}
function BooleanLiteral(node) {
  return node.value;
}
function BreakStatement(node) {
  return 'break' + (node.label ? ' ' + $(node.label) : '') + ';';
}
function CallExpression(node) {
  return (
    node.callee.type === 'Import' ||
    node.callee.type === 'Super' ||
    node.callee.name === 'async' // `async({__proto__: 1, __proto__: 2})`
      ? $(node.callee)
      : $w(node.callee)
  ) + '(' + node.arguments.map($).join(', ') + ')';
}
function CatchClause(node) {
  return 'catch ' + (node.param ? $w(node.param) + ' ' : '') + $(node.body);
}
function ClassBody(node) {
  return '{' + node.body.map($).join('\n') + '}';
}
function ClassDeclaration(node) {
  return 'class' + (node.id ? ' ' + $(node.id) : '') + (node.superClass ? ' extends (' + $(node.superClass) + ') ' : '') + $(node.body);
}
function ClassExpression(node) {
  return 'class' + (node.id ? ' ' + $(node.id) : '') + (node.superClass ? ' extends (' + $(node.superClass) + ') ' : '') + $(node.body);
}
function ClassMethod(node) {
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
}
function CommentBlock(node) {
  return '/*' + node.value + '*/';
}
function CommentLine(node) {
  return '//' + node.value + '\n';
}
function ConditionalExpression(node) {
  return '(' + $w(node.test) + '? ' + $w(node.consequent) + ' : ' + $w(node.alternate) + ')';
}
function ContinueStatement(node) {
  return 'continue' + (node.label ? ' ' + $(node.label) : '') + ';';
}
function DebuggerStatement(node) {
  return 'debugger;';
}
function Directive(node) {
  return $(node.value);
}
function DirectiveLiteral(node) {
  return "'" + node.value + "';";
}
function DoWhileStatement(node) {
  return 'do ' + $(node.body) + ' while ' + $w(node.test) + ';';
}
function EmptyStatement(node) {
  return ';';
}
function ExportAllDeclaration(node) {
  return 'export * from ' + $(node.source) + ';';
}
function ExportDefaultDeclaration(node) {
  return 'export default ' + $(node.declaration) + (node.declaration.type === 'ClassDeclaration' || node.declaration.type === 'FunctionDeclaration' ? '' : ';');
}
function ExportNamedDeclaration(node) {
  return 'export ' + (node.declaration ? $(node.declaration) : ('{' + node.specifiers.map($).join(', ') + '}')) + (node.source ? ' from ' + $(node.source) : '');
}
function ExportSpecifier(node) {
  return (node.local.name !== node.exported.name ? $(node.local) + ' as ' : '') + $(node.exported);
}
function ExpressionStatement(node) {
  if (node.directive === undefined && ( // Protect directives from demotion
    node.expression.type === 'ObjectExpression' ||
    node.expression.type === 'ArrayExpression' || // [{__proto__: 1, __proto__: 2}]
    node.expression.type === 'SequenceExpression' ||
    node.expression.type === 'FunctionExpression' ||
    node.expression.type === 'ClassExpression' ||
    node.expression.type === 'BinaryExpression' ||
    node.expression.type === 'MemberExpression' ||
    node.expression.type === 'Identifier' ||
    node.expression.type === 'UnaryExpression' ||
    node.expression.type === 'CallExpression' ||
    (!node.directive && node.expression.type === 'Literal' && typeof node.expression.value === 'string') || // Prevent grouped strings of being promoted to directives
    node.expression.type === 'AssignmentExpression'
  )) {
    // :'(
    return $w(node.expression) + ';';
  }
  return $(node.expression) + ';';
}
function ForInStatement(node) {
  return 'for (' + (node.left.type === 'VariableDeclaration' || node.left.type === 'ObjectPattern' || node.left.type === 'ArrayPattern' ? $(node.left, undefined, undefined, true) : $w(node.left)) + ' in ' + $(node.right) + ') ' + $(node.body);
}
function ForOfStatement(node) {
  return 'for ' + (node.await ? 'await ' : '') + '(' + (node.left.type === 'VariableDeclaration' || node.left.type === 'ObjectPattern' || node.left.type === 'ArrayPattern' ? $(node.left, undefined, undefined, true) : $w(node.left)) + ' of ' + $(node.right) + ') ' + $(node.body);
}
function ForStatement(node) {
  return 'for (' + (node.init ? (node.init.type === 'VariableDeclaration' ? $(node.init, undefined, undefined, true) : $w(node.init)) : '') + ';' + (node.test ? $(node.test) : '') + ';' + (node.update ? $(node.update) : '') + ') ' + $(node.body);
}
function FunctionDeclaration(node) {
  return (node.async ? 'async ' : '') + 'function' + (node.generator ? '*' : '') + (node.id ? ' ' + $(node.id) : '') + '(' + node.params.map($).join(', ') + ') {' + node.body.body.map($).join('\n') + '}';
}
function FunctionExpression(node) {
  return (node.async ? 'async ' : '') + 'function' + (node.generator ? '*' : '') + (node.id ? ' ' + $(node.id) : '') + '(' + node.params.map($).join(', ') + ') {' + node.body.body.map($).join('\n') + '}';
}
function Identifier(node) {
  return node.name;
}
function IfStatement(node) {
  return 'if ' + $w(node.test) + ' ' + $(node.consequent) + (node.alternate ? ' else ' + $(node.alternate) : '');
}
function Import(node) {
  return 'import';
}
function ImportDeclaration(node) {
  let importSpecifiers = node.specifiers.filter(s => s.type === 'ImportSpecifier');
  let otherSpecifiers = node.specifiers.filter(s => s.type !== 'ImportSpecifier');
  if (!importSpecifiers.length && !otherSpecifiers.length) {
    return 'import {}' + (node.source ? ' from ' + $(node.source) : '') + ';';
  }
  return 'import ' + (otherSpecifiers.length ? otherSpecifiers.map($).join(', ') : '') + (importSpecifiers.length && otherSpecifiers.length ? ', ' : '') + (importSpecifiers.length ? '{' + importSpecifiers.map($).join(', ') + '}' : '') + (node.source ? ' from ' + $(node.source) : '') + ';';
}
function ImportDefaultSpecifier(node) {
  return $(node.local);
}
function ImportExpression(node) {
  return 'import(' + node.arguments.map($).join(', ') + ')';
}
function ImportNamespaceSpecifier(node) {
  return '* as ' + $(node.local);
}
function ImportSpecifier(node) {
  return $(node.imported) + (node.local ? ' as ' + $(node.local) : '');
}
function LabeledStatement(node) {
  return $(node.label) + ': ' + $(node.body);
}
function Literal(node) {
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
}
function LogicalExpression(node) {
  return '(' + $w(node.left) + ' ' + node.operator + ' ' + $w(node.right) + ')';
}
function MemberExpression(node) {
  if (
    node.object.type === 'ObjectExpression' ||
    node.object.type === 'SequenceExpression' ||
    node.object.type === 'FunctionExpression' ||
    node.object.type === 'ClassExpression' ||
    node.object.type === 'Identifier' ||
    node.object.type === 'BinaryExpression' ||
    node.object.type === 'MemberExpression' ||
    node.object.type === 'Identifier' ||
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
}
function MetaProperty(node) {
  return $(node.meta) + '.' + $(node.property);
}
function MethodDefinition(node) {
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
}
function NewExpression(node) {
  return 'new ' + (node.callee.type !== 'Super' && node.callee.type !== 'Import' ? $w(node.callee) : $(node.callee)) + '(' + node.arguments.map($).join(', ') + ')';
}
function NullLiteral(node) {
  return 'null';
}
function NumericLiteral(node) {
  return node.raw;
}
function ObjectExpression(node) {
  return '{' + node.properties.map($).join(', ') + '}';
}
function ObjectMethod(node) {
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
}
function ObjectPattern(node) {
  return '{' + node.properties.map($).join(', ') + '}';
}
function ObjectProperty(node) {
  return node.body.map($).join('\n');
}
function Program(node) {
  return node.body.map($).join('\n');
}
function Property(node) {
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
}
function RegExpLiteral(node) {
  return node.raw;
}
function RestElement(node) {
  return '...' + $(node.argument);
}
function ReturnStatement(node) {
  return 'return' + (node.argument ? ' ' + $(node.argument) : '') + ';';
}
function SequenceExpression(node) {
  return '(' + node.expressions.map($).join(', ') + ')';
}
function SpreadElement(node) {
  return '...' + $(node.argument);
}
function StringLiteral(node) {
  return node.raw;
}
function Super(node) {
  return 'super';
}
function SwitchCase(node) {
  return (node.test ? 'case ' + $(node.test) : 'default') + ':\n' + node.consequent.map($).join('\n');
}
function SwitchStatement(node) {
  return 'switch ' + $w(node.discriminant) + ' {' + node.cases.map($).join('\n') + '}';
}
function TaggedTemplateExpression(node) {
  return $w(node.tag) + $(node.quasi);
}
function TemplateElement(node) {
  return node.value.raw;
}
function TemplateLiteral(node) {
  return '`' + $(node.quasis[0]) + (node.expressions.length ? '${' : '') + node.expressions.map((e, i) => $(e) + '}' + $(node.quasis[i+1])).join('${') + '`';
}
function ThisExpression(node) {
  return 'this';
}
function ThrowStatement(node) {
  return 'throw ' + $(node.argument) + ';';
}
function TryStatement(node) {
  return 'try ' + $(node.block) + (node.handler ? ' ' + $(node.handler) : '') + (node.finalizer ? ' finally ' + $(node.finalizer) : '');
}
function UnaryExpression(node) {
  return node.operator + ' ' + $w(node.argument);
}
function UpdateExpression(node) {
  return (node.prefix ? node.operator : '') + $(node.argument) + (node.prefix ? '' : node.operator);
}
function VariableDeclaration(node, fromFor) {
  return node.kind + ' ' + node.declarations.map($).join(', ') + (fromFor ? '' : ';'); // no semi inside `for`
}
function VariableDeclarator(node) {
  return $(node.id) + (node.init ? ' = ' + $(node.init) : '');
}
function WhileStatement(node) {
  return 'while ' + $w(node.test) + ' ' + $(node.body);
}
function WithStatement(node) {
  return 'with ' + $w(node.object) + ' ' + $(node.body);
}
function YieldExpression(node) {
  return '(yield' + (node.delegate ? ' *' : '') + (node.argument ? ' ' + $w(node.argument) : '') + ')';
}

function $w(node) {
  return '(' + $(node) + ')';
}
function $(node, _, __, fromFor) {
  switch(node.type) {
    case 'ArrayExpression': return ArrayExpression(node);
    case 'ArrayPattern': return ArrayPattern(node);
    case 'ArrowFunctionExpression': return ArrowFunctionExpression(node);
    case 'AssignmentExpression': return AssignmentExpression(node);
    case 'AssignmentPattern': return AssignmentPattern(node);
    case 'AwaitExpression': return AwaitExpression(node);
    case 'BigIntLiteral': return BigIntLiteral(node);
    case 'BinaryExpression': return BinaryExpression(node);
    case 'BlockStatement': return BlockStatement(node);
    case 'BooleanLiteral': return BooleanLiteral(node);
    case 'BreakStatement': return BreakStatement(node);
    case 'CallExpression': return CallExpression(node);
    case 'CatchClause': return CatchClause(node);
    case 'ClassBody': return ClassBody(node);
    case 'ClassDeclaration': return ClassDeclaration(node);
    case 'ClassExpression': return ClassExpression(node);
    case 'ClassMethod': return ClassMethod(node);
    case 'CommentBlock': return CommentBlock(node);
    case 'CommentLine': return CommentLine(node);
    case 'ConditionalExpression': return ConditionalExpression(node);
    case 'ContinueStatement': return ContinueStatement(node);
    case 'DebuggerStatement': return DebuggerStatement(node);
    case 'Directive': return Directive(node);
    case 'DirectiveLiteral': return DirectiveLiteral(node);
    case 'DoWhileStatement': return DoWhileStatement(node);
    case 'EmptyStatement': return EmptyStatement(node);
    case 'ExportAllDeclaration': return ExportAllDeclaration(node);
    case 'ExportDefaultDeclaration': return ExportDefaultDeclaration(node);
    case 'ExportNamedDeclaration': return ExportNamedDeclaration(node);
    case 'ExportSpecifier': return ExportSpecifier(node);
    case 'ExpressionStatement': return ExpressionStatement(node);
    case 'ForInStatement': return ForInStatement(node);
    case 'ForOfStatement':return ForOfStatement(node);
    case 'ForStatement': return ForStatement(node);
    case 'FunctionDeclaration': return FunctionDeclaration(node);
    case 'FunctionExpression': return FunctionExpression(node);
    case 'Identifier': return Identifier(node);
    case 'IfStatement': return IfStatement(node);
    case 'Import': return Import(node);
    case 'ImportDeclaration': return ImportDeclaration(node);
    case 'ImportDefaultSpecifier': return ImportDefaultSpecifier(node);
    case 'ImportExpression': return ImportExpression(node);
    case 'ImportNamespaceSpecifier': return ImportNamespaceSpecifier(node);
    case 'ImportSpecifier': return ImportSpecifier(node);
    case 'LabeledStatement':return LabeledStatement(node);
    case 'Literal': return Literal(node);
    case 'LogicalExpression': return LogicalExpression(node);
    case 'MemberExpression': return MemberExpression(node);
    case 'MetaProperty': return MetaProperty(node);
    case 'MethodDefinition': return MethodDefinition(node);
    case 'NewExpression': return NewExpression(node);
    case 'NullLiteral': return NullLiteral(node);
    case 'NumericLiteral': return NumericLiteral(node);
    case 'ObjectExpression': return ObjectExpression(node);
    case 'ObjectMethod': return ObjectMethod(node);
    case 'ObjectPattern': return ObjectPattern(node);
    case 'ObjectProperty': return ObjectProperty(node);
    case 'Program': return Program(node);
    case 'Property': return Property(node);
    case 'RegExpLiteral': return RegExpLiteral(node);
    case 'RestElement': return RestElement(node);
    case 'ReturnStatement': return ReturnStatement(node);
    case 'SequenceExpression': return SequenceExpression(node);
    case 'SpreadElement': return SpreadElement(node);
    case 'StringLiteral': return StringLiteral(node);
    case 'Super': return Super(node);
    case 'SwitchCase': return SwitchCase(node);
    case 'SwitchStatement': return SwitchStatement(node);
    case 'TaggedTemplateExpression': return TaggedTemplateExpression(node);
    case 'TemplateElement': return TemplateElement(node);
    case 'TemplateLiteral': return TemplateLiteral(node);
    case 'ThisExpression': return ThisExpression(node);
    case 'ThrowStatement': return ThrowStatement(node);
    case 'TryStatement': return TryStatement(node);
    case 'UnaryExpression': return UnaryExpression(node);
    case 'UpdateExpression': return UpdateExpression(node);
    case 'VariableDeclaration': return VariableDeclaration(node, fromFor);
    case 'VariableDeclarator': return VariableDeclarator(node);
    case 'WhileStatement': return WhileStatement(node);
    case 'WithStatement': return WithStatement(node);
    case 'YieldExpression': return YieldExpression(node);
    default:
      // console.log('ZePrinter error node:', node);
      throw new Error('Missing node type? ' + node.type);
  }
  throw new Error('TODO; implement stringify for ' + node.type);
}

export {
  $ as zeprinter,
};

