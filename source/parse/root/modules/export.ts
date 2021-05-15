import { Token } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { ModuleNode, parseModules } from ".";
import { FromNode } from "./from";
import { Kinds } from "../../node";

export interface ExportNode extends ASTNode {
  kind: Kinds.export;
  module: ModuleNode;
  from?: FromNode;
}

export function parseExport(tokens: Token[], from?: FromNode): ParseResult<ExportNode> {
  const result = parseModules(tokens.slice(1));
  return {
    tokens: result.tokens,
    node: {
      kind: Kinds.export,
      from,
      module: result.node
    }
  };
}

