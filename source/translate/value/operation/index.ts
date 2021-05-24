import { buildValue } from "..";
import { Tokens } from "../../../lex";
import {
  BooleanOperationToken,
  ComparisonOperationToken,
  IntegerOperationToken,
  isBooleanOperation,
  isComparisonOperation,
  isIntegerOperation,
  isNumericOperation,
  NumericOperationToken,
  OperatorNode
} from "../../../parse/root/value/operator";
import { LLVMFile, SymbolValue } from "../../file";
import { primitives, isInteger, isNumeric, isBoolean } from "../../primitive";
import { ConditionalKeys } from "../../utils";
import { castFloat } from "../float";
import { castBoolean } from "../boolean";
import { buildConditional } from "./conditional";

export function isBooleanExpression(left: SymbolValue, right: SymbolValue) {
  return isBoolean(left.type) && isBoolean(right.type);
}

export function isIntegerExpression(left: SymbolValue, right: SymbolValue) {
  return isInteger(left.type) && isInteger(right.type);
}

export function isNumericExpression(left: SymbolValue, right: SymbolValue) {
  return isNumeric(left.type) && isNumeric(right.type);
}

type LLVMOperation = (lhs: llvm.Value, rhs: llvm.Value, name?: string) => llvm.Value;

const booleanOperations: {
  [key in BooleanOperationToken]: ConditionalKeys<llvm.IRBuilder, LLVMOperation>
} = {
  [Tokens.and]: "CreateAnd",
  [Tokens.or]: "CreateOr"
};

const integerComparisonOperations: {
  [key in ComparisonOperationToken]: ConditionalKeys<llvm.IRBuilder, LLVMOperation>
} = {
  [Tokens.eq]: "CreateICmpEQ",
  [Tokens.lt]: "CreateICmpSLT",
  [Tokens.gt]: "CreateICmpSGT",
  [Tokens.lte]: "CreateICmpSLE",
  [Tokens.gte]: "CreateICmpSGE",
  [Tokens.neq]: "CreateICmpNE"
};

const floatComparisonOperations: {
  [key in ComparisonOperationToken]: ConditionalKeys<llvm.IRBuilder, LLVMOperation>
} = {
  [Tokens.eq]: "CreateFCmpOEQ",
  [Tokens.lt]: "CreateFCmpOLT",
  [Tokens.gt]: "CreateFCmpOGT",
  [Tokens.lte]: "CreateFCmpOLE",
  [Tokens.gte]: "CreateFCmpOGE",
  [Tokens.neq]: "CreateFCmpONE"
};

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
  if(isBooleanOperation(node.operation)) {
    return {
      type: primitives.int1,
      value: file.builder[booleanOperations[node.operation]](
        castBoolean(file, left),
        castBoolean(file, right)
      )
    };
  } else if(isComparisonOperation(node.operation)) {
    if(isBooleanExpression(left, right) || isIntegerExpression(left, right)) {
      return {
        type: primitives.int1,
        value: file.builder[integerComparisonOperations[node.operation]](left.value, right.value)
      };
    } else if(isNumericExpression(left, right)) {
      return {
        type: primitives.int1,
        value: file.builder[floatComparisonOperations[node.operation]](
          castFloat(file, left),
          castFloat(file, right)
        )
      };
    } else {
      throw new Error("Unsupported expression");
    }
  } else if(isIntegerExpression(left, right) && isIntegerOperation(node.operation)) {
    return {
      type: primitives.int32,
      value: file.builder[integerOperations[node.operation]](left.value, right.value)
    };
  } else if(isNumericExpression(left, right) && isNumericOperation(node.operation)) {
    return {
      type: primitives.float,
      value: file.builder[floatOperations[node.operation]](
        castFloat(file, left),
        castFloat(file, right)
      )
    };
  } else if(node.operation === Tokens.question) {
    return buildConditional(file, left, right);
  } else {
    throw new Error("Unsupported expression");
  }
}
