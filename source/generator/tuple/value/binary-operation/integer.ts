import { LLVMOperation } from ".";
import { Tokens } from "../../../../lexer";
import { IntegerOperator, BinaryOperationNode, isIntegerOperation } from "../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { matchSignature, Overrides, primitives } from "../../../primitive";

const overrides: Overrides = [{
  signature: [
    [primitives.int32],
    [primitives.int32]
  ],
  function: (file: LLVMFile, left: SymbolValue, operation: LLVMOperation, right: SymbolValue) => ({
    type: primitives.int32,
    value: file.builder[operation](left.value, right.value)
  })
}];

const operations: {
  [key in IntegerOperator]: LLVMOperation;
} = {
  [Tokens.add]: "CreateAdd",
  [Tokens.subtract]: "CreateSub",
  [Tokens.multiply]: "CreateMul",
  [Tokens.modulus]: "CreateSRem"
};

export function buildIntegerOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(isIntegerOperation(node)) {
    const override = matchSignature(overrides, [left.type, right.type]);
    return override(file, left, operations[node.operator], right);
  } else {
    return undefined;
  }
}
