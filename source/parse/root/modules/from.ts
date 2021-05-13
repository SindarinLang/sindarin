import { Token, Tokens } from "../../../lex";
import { ASTNode, ParseResult } from "../../";
import { parseImport, ImportNode } from "./import";
import { parseExport, ExportNode } from "./export";

const fromKind = "from";

export type FromKind = typeof fromKind;

export interface FromNode extends ASTNode {
  kind: FromKind;
  source: string;
}

export function parseFrom(tokens: Token[]): ParseResult<ImportNode | ExportNode> {
  if(tokens[1].type === Tokens.string) {
    const fromNode: FromNode = {
      kind: fromKind,
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
