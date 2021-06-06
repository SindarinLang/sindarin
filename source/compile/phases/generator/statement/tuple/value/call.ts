import { buildTuple } from "..";
import { isNode, Kinds, CallNode } from "../../../../parser";
import { LLVMFile, SymbolFunction, SymbolValue } from "../../../file";
import { Primitive, isValue, isFunction, castFromPointer } from "../../../primitive";

function matchPrimitives(a: Primitive, b: Primitive) {
  return a.type === b.type && a.isPointer === b.isPointer;
}

function matchSignature(overrides: SymbolFunction, signature: (SymbolValue | SymbolFunction)[]) {
  return overrides.find((override) => {
    return override.type.argumentTypes.reduce((retval, arg, index) => {
      const item = signature[index];
      return retval && isValue(item) && matchPrimitives(arg, item);
    }, true as boolean);
  });
}

export function buildCall(file: LLVMFile, node: CallNode) {
  const args = buildTuple(file, node.arguments);
  if(isNode(node.left, Kinds.identifier)) {
    const overrides = file.symbolTable[node.left.value];
    if(isFunction(overrides)) {
      const refs = args.map((arg) => {
        if(isValue(arg)) {
          return castFromPointer(file, arg);
        } else {
          throw new Error("Unsupported function argument");
        }
      });
      const match = matchSignature(overrides, refs);
      if(match) {
        return {
          type: match.type.returnType.type,
          value: file.builder.CreateCall(match.value, refs.map((ref) => ref.value))
        };
      } else {
        throw new Error("No matching override");
      }
    } else {
      throw new Error(`No function ${node.left.value}`);
    }
  } else {
    throw new Error("Unsupported callee");
  }
}
