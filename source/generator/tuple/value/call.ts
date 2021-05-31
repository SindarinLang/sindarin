import { buildTuple } from "..";
import { isNode, Kinds } from "../../../parser/node";
import { CallNode } from "../../../parser/statement/tuple/expression/operand/value-operation/call";
import { LLVMFile, SymbolFunction, SymbolValue } from "../../file";
import { Primitive, isValue, isFunction, castFromPointer } from "../../primitive";

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
  if(isNode(node.callee, Kinds.identifier)) {
    const overrides = file.symbolTable[node.callee.value];
    if(isFunction(overrides)) {
      const refs = args.map((arg) => castFromPointer(file, arg));
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
      throw new Error(`No function ${node.callee.value}`);
    }
  } else {
    throw new Error("Unsupported callee");
  }
}
