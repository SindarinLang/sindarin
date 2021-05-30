import { LLVMOperation } from ".";
import { Tokens } from "../../../../lexer";
import { NumericOperator, BinaryOperationNode, isNumericOperation } from "../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { matchSignature, Overrides, primitives } from "../../../primitive";
import { castFloat } from "../float";

const overrides: Overrides = [{
  signature: [
    [primitives.int32, primitives.float],
    [primitives.int32, primitives.float]
  ],
  function: (file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) => ({
    type: primitives.float,
    value: file.builder[operation](
      castFloat(file, left),
      castFloat(file, right)
    )
  })
}];

const operations: {
  [key in NumericOperator]: LLVMOperation;
} = {
  [Tokens.add]: "CreateFAdd",
  [Tokens.subtract]: "CreateFSub",
  [Tokens.multiply]: "CreateFMul",
  [Tokens.modulus]: "CreateFRem",
  [Tokens.divide]: "CreateFDiv"
};

export function buildFloatOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isNumericOperation(node)) {
    const override = matchSignature(overrides, [left.type, right.type]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
