import { ASTNode } from "../../..";
import { ArgumentsNode } from "../identifier/arguments";

export const returnKind = "return";

export type ReturnKind = typeof returnKind;

export interface ReturnNode extends ASTNode {
  kind: ReturnKind;
  value: ArgumentsNode; // TODO: end arguments on ';' ')' or '}'
}
