// House rule: the opening brace of a class or function body goes on its own line.
// Arrow functions and control blocks (if/for/try/...) keep the brace on the same line.

const MESSAGE = 'Opening brace of a {{kind}} body must be on a new line.';

function indentOf(sourceCode, line)
{
  return sourceCode.lines[line - 1].match(/^\s*/)[0];
}

function fixer(sourceCode, previous, brace)
{
  const indent = indentOf(sourceCode, previous.loc.end.line);
  return (fix) => fix.replaceTextRange([previous.range[1], brace.range[0]], `\n${indent}`);
}

function checkBody(context, body, kind)
{
  const sourceCode = context.sourceCode;
  const brace = sourceCode.getFirstToken(body);
  const previous = sourceCode.getTokenBefore(brace);
  if (previous.loc.end.line !== brace.loc.start.line) return;
  const fix = fixer(sourceCode, previous, brace);
  context.report({ node: body, loc: brace.loc, message: MESSAGE, data: { kind }, fix });
}

function create(context)
{
  const checkFunction = (node) => checkBody(context, node.body, 'function');
  return {
    ClassBody: (node) => checkBody(context, node, 'class'),
    FunctionDeclaration: checkFunction,
    FunctionExpression: checkFunction,
  };
}

const braceOnNewLine = {
  meta: { type: 'layout', fixable: 'whitespace', schema: [] },
  create,
};

export default { rules: { 'brace-on-new-line': braceOnNewLine } };
