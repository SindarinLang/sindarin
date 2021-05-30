import { Kinds } from "../../../parser/node";
import { LLVMFile, SymbolValue } from "../../file";
import { buildFloat } from "./float";
import { buildInteger } from "./integer";
import { buildBoolean } from "./boolean";
import { buildIdentifier } from "./identifier";
import { buildNull } from "./null";
import { buildCall } from "./call";
import { buildAccessor } from "./accessor";
import { buildBinaryOperation } from "./binary-operation";
import { buildUnaryOperation } from "./unary-operation";
import { ExpressionNode } from "../../../parser/statement/tuple/expression";
import { VoidNode } from "../../../parser/statement/tuple/void";

export type ValueBuilder = (file: LLVMFile, node: any) => SymbolValue;

export const builders: {
  [key: string]: ValueBuilder;
} = {
  [Kinds.boolean]: buildBoolean,
  [Kinds.integer]: buildInteger,
  [Kinds.float]: buildFloat,
  [Kinds.null]: buildNull,
  [Kinds.identifier]: buildIdentifier,
  [Kinds.binaryOperation]: buildBinaryOperation,
  [Kinds.unaryOperation]: buildUnaryOperation,
  [Kinds.call]: buildCall,
  [Kinds.accessor]: buildAccessor
};

export function buildValue(file: LLVMFile, node: ExpressionNode | VoidNode) {
  if(builders[node.kind]) {
    return builders[node.kind](file, node);
  } else {
    throw new Error(`Unsupported value for kind '${node.kind}'`);
  }
}
