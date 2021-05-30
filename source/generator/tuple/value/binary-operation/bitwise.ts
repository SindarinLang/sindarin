import { LLVMOperation } from ".";
import { Tokens } from "../../../../lexer";
import { BitwiseOperator, BinaryOperationNode, isBitwiseOperation } from "../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { primitives, matchSignature, Overrides } from "../../../primitive";

const overrides: Overrides = [{
  function: buildBooleanBitwiseOperation,
  signature: [
    [primitives.int1],
    [primitives.int1]
  ]
}, {
  function: buildIntegerBitwiseOperation,
  signature: [
    [primitives.int32],
    [primitives.int32]
  ]
}];

const operations: {
  [key in BitwiseOperator]: LLVMOperation;
} = {
  [Tokens.bitwise_and]: "CreateAnd",
  [Tokens.bitwise_or]: "CreateOr"
};

function buildBooleanBitwiseOperation(file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) {
  return {
    type: primitives.int1,
    value: file.builder[operation](left.value, right.value)
  };
}

function buildIntegerBitwiseOperation(file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) {
  return {
    type: primitives.int32,
    value: file.builder[operation](left.value, right.value)
  };
}

export function buildBitwiseOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isBitwiseOperation(node)) {
    const override = matchSignature(overrides, [left.type, right.type]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
