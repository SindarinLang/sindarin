import { Token } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { ModuleNode, parseModules } from ".";
import { FromNode } from "./from";

export const importKind = "import";

export type ImportKind = typeof importKind;

export interface ImportNode extends ASTNode {
  kind: ImportKind;
  module: ModuleNode;
  from?: FromNode;
}

export function parseImport(tokens: Token[], from?: FromNode): ParseResult<ImportNode> {
  const result = parseModules(tokens.slice(1));
  return {
    tokens: result.tokens,
    node: {
      kind: importKind,
      from,
      module: result.node
    }
  };
}
