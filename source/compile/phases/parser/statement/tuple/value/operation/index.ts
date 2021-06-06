import { Token } from "../../../../../scanner";
import { ParsePhase, ParserNodes } from "../../../..";
import { AccessorNode, parseAccessor } from "./accessor";
import { CallNode, parseCall } from "./call";
import { getResultFrom } from "../../../../result";

export type ValueOperationNode = CallNode | AccessorNode;

export type PartialValueOperationNode = ParserNodes<typeof valueOperationParsers>;

const valueOperationParsers = [
  parseAccessor,
  parseCall
];

export const parseValueOperation: ParsePhase<PartialValueOperationNode> = (tokens: Token[]) => {
  return getResultFrom<PartialValueOperationNode>(tokens, valueOperationParsers);
};
