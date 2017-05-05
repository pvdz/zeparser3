/*

asm.js / webassembly. simplicity is key.

any grouped expression should be parsed as an expression or as an arrow parameter list. a flag should be kept and passed on to track whether or not the current parse can or cannot be followed by an arrow. initially the structure of an arrow header is fairly straightforward to eliminate;

`(` ident [`=` expr] [, ident [`=` expr]]* `)` `=>` expr

an arrow may appear anywhere so while parsing something that may validate, later, as an arrow header, you may encounter another arrow. or even an arrow inside an arrow header

x=y=>y=>x
x=(y)=>y=>x
(x=y=>y)=>x
(x=(y)=>y)=>x
x=(x=y)=>x=>x

the recursiveness means we cant have a global or even scoped flag because several of these headers may be nested before any arrow is seen
so you must parse it initially as a group_or_arrow or something. and the assignments as a special init_or_assignmentexpr with a param that returns the arrow state

i'm not sure what would exactly cancel an arrow

i guess the arrow header pattern must match.

ident => expr
or
() => expr
or
(ident) => expr
or
(ident, ident) => expr

where ident can be just an ident or an ident + initializer. the initializer can be nearly any expression, i think

so an expression that starts with an identifier gets a special arrow path and a grouped expression is a whole special arrow path




but we also have to track vars for scoping, each scoping separately. and track whether it can be an arrow at all.

so is it better to backtrack or to just generate arrays for it to track refs by reference

generally the arrow header will be short, concise, and not have terrible nesting problems. the expression occurs too often to warrant creating an object for it every time

f=(x=()=>x)=>x

the default arrow function `()=>x` has access to the outer x. it also has access to other params (`f=(x=()=>y, y)=>x`) and but not to the arrow scope (`f=(x=()=>z, y)=>{let z; return x}`). these are different zones. and i guess different scopes, to some degree.



there's no way to do a quick scan because the expression can be arbitrary and so we find ourselves once again in the land of divregex.





*/


function parseExpression() {
  if (consumeChr('(')) {
    if (consumeChr(')')) {
      parseArrowRest();
    } else {
      parseGroupOrArrow();
    }
  } else if (peekAn(IDENT)) {
    parseIdentOrArrow();
  } else {
    parseNotArrowExpression();
  }
}

function parseGroupOrArrow() {
  // there could be a simple set of arg tracking vars to "unroll" a check. and then when the hardcoded max is hit we can go for a slower parser or something? or one that simple reparses it or something.

  let arrowable = parseExpressionOrArrow();
  // TODO: what about postfix? `f= (x++) => x` any other expression suffixes to take into account here?
  while (isChr(',')) {
    if (!parseArrowArgOrExpression()) arrowable = false;
  }

  if (!consumeChr(')')) THROW('Expected group/arrow header end');

  if (arrowable && consumeStr('=>')) parseArrowBody();
}

function parseArrowArgOrExpression() {
  if (!isAn(IDENT)) {
    parseGroupRemainderFromExpr();
    return false;
  }

  if (isChr('=')) {
    parseExpression(); // unrestricted?
  }

  return true;
}

function parseGroupRemainderFromIdent() {
  // we just parsed an ident which was followed by not a comma, not an eq sign, and not a closing paren.
  // the group cannot be followed by an arrow
  do {
    parseExpression();
  } while(when(','));
  must(')');

  // explicit check for arrow error here?
}

function parseArrowRest() {
  must('=>');
  parseArrowBody();
}

function parseIdentOrArrow() {
  let ident = consume();
  if (consumeStr('=>')) {
    parseArrowRest();
  }
}

function parseNotArrowExpression() {
  this
  Literal
  ArrayLiteral [?Yield]
  ObjectLiteral [?Yield]
  FunctionExpression
  ClassExpression [?Yield]
  GeneratorExpression
  RegularExpressionLiteral
  TemplateLiteral [?Yield]
}
