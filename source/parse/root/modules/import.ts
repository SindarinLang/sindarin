import { Token } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { ModuleNode, parseModules } from ".";
import { FromNode } from "./from";
import { Kinds } from "../../node";

export interface ImportNode extends ASTNode {
  kind: Kinds.import;
  module: ModuleNode;
  from?: FromNode;
}

export function parseImport(tokens: Token[], from?: FromNode): ParseResult<ImportNode> {
  const result = parseModules(tokens.slice(1));
  return {
    tokens: result.tokens,
    node: {
      kind: Kinds.import,
      from,
      module: result.node
    }
  };
}
