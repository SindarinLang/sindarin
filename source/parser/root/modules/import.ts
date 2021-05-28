import { isToken, Token, Tokens } from "../../../lexer";
import { ASTNode, PotentialParseResult } from "../..";
import { ModuleNode, parseModules } from "./module";
import { FromNode } from "./from";
import { Kinds } from "../../node";

export interface ImportNode extends ASTNode {
  kind: Kinds.import;
  module: ModuleNode;
  from?: FromNode;
}

export function parseImport(tokens: Token[], from?: FromNode): PotentialParseResult<ImportNode> {
  if(isToken(tokens[0], Tokens.import)) {
    const result = parseModules(tokens.slice(1));
    return {
      tokens: result.tokens,
      node: {
        kind: Kinds.import,
        from,
        module: result.node
      }
    };
  } else {
    return undefined;
  }
}
