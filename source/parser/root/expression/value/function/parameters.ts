import { ASTNode } from "../../..";
import { Kinds } from "../../../node";
import { IdentifierNode } from "../value/identifier";

export interface ParametersNode extends ASTNode {
  kind: Kinds.parameter;
  value: IdentifierNode[];
}
