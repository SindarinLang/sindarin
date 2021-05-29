import { isToken, Token, Tokens } from "../../../lexer";
import { ModuleNode, parseModules } from "./module";
import { FromNode } from "./from";
import { ASTNode, Kinds } from "../../node";
import { ParseResult } from "../..";

export interface ExportNode extends ASTNode {
  kind: Kinds.export;
  module: ModuleNode;
  from?: FromNode;
}

export function parseExport(tokens: Token[], from?: FromNode): ParseResult<ExportNode> {
  if(isToken(tokens[0], Tokens.export)) {
    const result = parseModules(tokens.slice(1));
    if(result) {
      return {
        tokens: result.tokens,
        node: {
          kind: Kinds.export,
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

