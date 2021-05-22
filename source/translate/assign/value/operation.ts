import { buildValue } from ".";
import { Tokens } from "../../../lex";
import { IntegerOperationToken, isIntegerOperation, isNumericOperation, NumericOperationToken, OperatorNode } from "../../../parse/root/value/operator";
import { LLVMFile, SymbolValue } from "../../file";
import { primitives, isInteger, isNumeric } from "../../primitive";
import { ConditionalKeys } from "../../utils";
import { castFloat } from "./float";

export function isIntegerExpression(left: SymbolValue, right: SymbolValue) {
  return isInteger(left.type) && isInteger(right.type);
}

export function isFloatExpression(left: SymbolValue, right: SymbolValue) {
  return isNumeric(left.type) && isNumeric(right.type);
}

type LLVMOperation = (lhs: llvm.Value, rhs: llvm.Value, name?: string) => llvm.Value;

const integerOperations: {
  [key in IntegerOperationToken]: ConditionalKeys<llvm.IRBuilder, LLVMOperation>
} = {
  [Tokens.add]: "CreateAdd",
  [Tokens.subtract]: "CreateSub",
  [Tokens.multiply]: "CreateMul",
  [Tokens.modulus]: "CreateSRem"
};

const floatOperations: {
  [key in NumericOperationToken]: ConditionalKeys<llvm.IRBuilder, LLVMOperation>
} = {
  [Tokens.add]: "CreateFAdd",
  [Tokens.subtract]: "CreateFSub",
  [Tokens.multiply]: "CreateFMul",
  [Tokens.modulus]: "CreateFRem",
  [Tokens.divide]: "CreateFDiv"
};

export function buildOperation(file: LLVMFile, node: OperatorNode): SymbolValue {
  const left = buildValue(file, node.left);
  const right = buildValue(file, node.right);
  if(isIntegerExpression(left, right) && isIntegerOperation(node.operation)) {
    return {
      type: primitives.int32,
      value: file.builder[integerOperations[node.operation]](left.value, right.value)
    };
  } else if(isFloatExpression(left, right) && isNumericOperation(node.operation)) {
    return {
      type: primitives.float,
      value: file.builder[floatOperations[node.operation]](
        castFloat(file, left.value),
        castFloat(file, right.value)
      )
    };
  } else {
    throw new Error("Unsupported expression");
  }
}
