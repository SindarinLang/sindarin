import { isNode, Kinds, CallNode } from "../../../../parser";
import { getSymbol, LLVMFile } from "../../../file";
import { SymbolValue, isFunction, toPointer, fromPointer } from "../../../types";
import { buildTuple } from "..";

export function buildCall(file: LLVMFile, node: CallNode): SymbolValue {
  const args = buildTuple(file, node.arguments) ?? [];
  if(isNode(node.left, Kinds.identifier) && node.left.value) {
    const caller = getSymbol(file, node.left.value, args);
    if(caller && isFunction(caller)) {
      return {
        type: caller.type.returnType,
        value: file.builder.CreateCall(caller.value, args.map((symbol, index) => {
          if(caller.type.argumentTypes[index].isPointer && !symbol.type.isPointer) {
            return toPointer(file, symbol).value;
          } else if(!caller.type.argumentTypes[index].isPointer && symbol.type.isPointer) {
            if(symbol.type.isOptional) {
              throw new Error("Optional args not implemented");
            } else {
              return fromPointer(file, symbol).value;
            }
          } else {
            return symbol.value;
          }
        }))
      };
    } else {
      throw new Error("No matching override");
    }
  } else {
    throw new Error("Unsupported callee");
  }
}
