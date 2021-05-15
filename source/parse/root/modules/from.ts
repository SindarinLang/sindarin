import { Token, Tokens } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { parseImport, ImportNode } from "./import";
import { parseExport, ExportNode } from "./export";
import { Kinds } from "../../node";

export interface FromNode extends ASTNode {
  kind: Kinds.from;
  source: string;
}

export function parseFrom(tokens: Token[]): ParseResult<ImportNode | ExportNode> {
  if(tokens[1].type === Tokens.string) {
    const fromNode: FromNode = {
      kind: Kinds.from,
      source: tokens[1].value
    };
    if(tokens[2].type === Tokens.import) {
      return parseImport(tokens.slice(2), fromNode);
    } else if(tokens[2].type === Tokens.export) {
      return parseExport(tokens.slice(2), fromNode);
    } else {
      throw new Error("syntax error");
    }
  } else {
    throw new Error("syntax error");
  }
}
