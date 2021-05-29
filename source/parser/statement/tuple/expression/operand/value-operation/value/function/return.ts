import { ASTNode, Kinds } from "../../..";
import { ArgumentsNode } from "../value/identifier/arguments";

export interface ReturnNode extends ASTNode {
  kind: Kinds.return;
  value: ArgumentsNode; // TODO: end arguments on ';' ')' or '}'
}
