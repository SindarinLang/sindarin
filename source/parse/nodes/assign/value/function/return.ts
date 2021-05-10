import { ASTNode } from "../../../..";
import { ArgumentsNode } from "../identifier/arguments";

export const returnKind = "return";

export interface ReturnNode extends ASTNode {
  kind: typeof returnKind;
  value: ArgumentsNode; // TODO: end arguments on ';' ')' or '}'
}
