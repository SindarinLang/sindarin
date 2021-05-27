import { isToken, Token, Tokens } from "../../../lexer";
import { ASTNode, PotentialParseResult } from "../..";
import { ModuleNode, parseModules } from ".";
import { FromNode } from "./from";
import { Kinds } from "../../node";

export interface ExportNode extends ASTNode {
  kind: Kinds.export;
  module: ModuleNode;
  from?: FromNode;
}

export function parseExport(tokens: Token[], from?: FromNode): PotentialParseResult<ExportNode> {
  if(isToken(tokens[0], Tokens.export)) {
    const result = parseModules(tokens.slice(1));
    return {
      tokens: result.tokens,
      node: {
        kind: Kinds.export,
        from,
        module: result.node
      }
    };
  } else {
    return undefined;
  }
}

