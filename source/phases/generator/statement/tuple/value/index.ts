import { TupletNode, isNode, Kinds } from "../../../../parser";
import { LLVMFile, SymbolFunction, SymbolValue } from "../../../file";
import { buildInteger } from "./integer";
import { buildBoolean } from "./boolean";
import { buildIdentifier } from "./identifier";
import { buildNull } from "./null";
import { buildCall } from "./call";
import { buildAccessor } from "./accessor";
import { buildBinaryOperation } from "./binary-operation";
import { buildUnaryOperation } from "./unary-operation";
import { buildFunction } from "./function";
import { buildTuple } from "..";

export type ValueBuilder = (file: LLVMFile, node: any) => SymbolValue | SymbolFunction;

export const getBuilders: () => {
  [key: string]: ValueBuilder;
} = () => ({
  [Kinds.boolean]: buildBoolean,
  [Kinds.number]: buildInteger,
  [Kinds.null]: buildNull,
  [Kinds.identifier]: buildIdentifier,
  [Kinds.binaryOperation]: buildBinaryOperation,
  [Kinds.unaryOperation]: buildUnaryOperation,
  [Kinds.call]: buildCall,
  [Kinds.accessor]: buildAccessor,
  [Kinds.function]: buildFunction
});

export function buildValue(file: LLVMFile, node: TupletNode): SymbolValue | SymbolFunction {
  const builders = getBuilders();
  if(builders[node.kind]) {
    return builders[node.kind](file, node);
  } else if(isNode(node, Kinds.tuple)) {
    return buildTuple(file, node)[0];
  } else {
    throw new Error(`Unsupported value for kind '${node.kind}'`);
  }
}
