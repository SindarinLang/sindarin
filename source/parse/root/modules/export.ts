import { Token } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { ModuleNode, parseModules } from ".";
import { FromNode } from "./from";

const exportKind = "export";

export type ExportKind = typeof exportKind;

export interface ExportNode extends ASTNode {
  kind: ExportKind;
  module: ModuleNode;
  from?: FromNode;
}

export function parseExport(tokens: Token[], from?: FromNode): ParseResult<ExportNode> {
  const result = parseModules(tokens.slice(1));
  return {
    tokens: result.tokens,
    node: {
      kind: exportKind,
      from,
      module: result.node
    }
  };
}

