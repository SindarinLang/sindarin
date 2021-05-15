import { ASTNode } from "../../..";
import { Kinds } from "../../../node";

export interface TypeNode extends ASTNode {
  kind: Kinds.type;
}
