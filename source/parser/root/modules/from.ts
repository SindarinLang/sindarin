import { Token, Tokens, isToken } from "../../../lexer";
import { ASTNode, PotentialParseResult } from "../..";
import { parseImport, ImportNode } from "./import";
import { parseExport, ExportNode } from "./export";
import { Kinds } from "../../node";

export interface FromNode extends ASTNode {
  kind: Kinds.from;
  source: string;
}

export function parseFrom(tokens: Token[]): PotentialParseResult<ImportNode | ExportNode> {
  if(isToken(tokens[0], Tokens.from)) {
    if(isToken(tokens[1], Tokens.string)) {
      const fromNode: FromNode = {
        kind: Kinds.from,
        source: tokens[1].value
      };
      if(isToken(tokens[2], Tokens.import)) {
        return parseImport(tokens.slice(2), fromNode);
      } else if(isToken(tokens[3], Tokens.export)) {
        return parseExport(tokens.slice(2), fromNode);
      } else {
        throw new Error("syntax error");
      }
    } else {
      throw new Error("syntax error");
    }
  } else {
    return undefined;
  }
}
