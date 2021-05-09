import { Token } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { ModuleNode, parseModules } from "./";
import { FromNode } from "./from";

export interface ImportNode extends ASTNode {
  kind: "import";
  module: ModuleNode;
  from?: FromNode;
}

export function parseImport(tokens: Token[], from?: FromNode): ParseResult<ImportNode> {
  const result = parseModules(tokens.slice(1));
  return {
    tokens: result.tokens,
    node: {
      kind: "import",
      from,
      module: result.node
    }
  };
}
