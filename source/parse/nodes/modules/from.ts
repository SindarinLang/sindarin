import { Token, Tokens } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { getImportNode, ImportNode } from "./import";
import { getExportNode, ExportNode } from "./export";

export interface FromNode extends ASTNode {
  kind: "from";
  source: string;
}

export function parseFrom(tokens: Token[]): ParseResult<ImportNode | ExportNode> {
  if(tokens[1].type === Tokens.string) {
    const fromNode: FromNode = {
      kind: "from",
      source: tokens[1].value
    };
    if(tokens[2].type === Tokens.import) {
      return getImportNode(tokens.slice(2), fromNode);
    } else if(tokens[2].type === Tokens.export) {
      return getExportNode(tokens.slice(2), fromNode);
    } else {
      throw new Error("syntax error");
    }
  } else {
    throw new Error("syntax error");
  }
}
