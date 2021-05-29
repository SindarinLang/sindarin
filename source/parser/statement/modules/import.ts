import { haveTokens, Token, Tokens } from "../../../lexer";
import { ASTNode, Kinds } from "../../node";
import { ParseResult } from "../..";
import { ModuleNode, parseModules } from "./module";
import { FromNode } from "./from";

export interface ImportNode extends ASTNode {
  kind: Kinds.import;
  module: ModuleNode;
  from?: FromNode;
}

export function parseImport(tokens: Token[], from?: FromNode): ParseResult<ImportNode> {
  if(haveTokens(tokens, Tokens.import)) {
    const result = parseModules(tokens.slice(1));
    if(result) {
      return {
        tokens: result.tokens,
        node: {
          kind: Kinds.import,
          from,
          module: result.node
        }
      };
    } else {
      throw new Error("Syntax error");
    }
  } else {
    return undefined;
  }
}
