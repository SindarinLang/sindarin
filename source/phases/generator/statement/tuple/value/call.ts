import { isNode, Kinds, CallNode } from "../../../../parser";
import { getSymbol, LLVMFile } from "../../../file";
import { SymbolValue, Type, isFunctionType, isFunction, toPointer, fromPointer } from "../../../types";
import { buildTuple } from "..";

function matchTypes(a: Type, b: Type) {
  return a.primitive === b.primitive;
}

function matchSignature(overrides: SymbolValue[], signature: SymbolValue[]) {
  return overrides.find((override) => {
    if(isFunctionType(override.type)) {
      return override.type.argumentTypes.reduce((retval, parameter, index) => {
        const arg = signature[index].type;
        return retval && matchTypes(arg, parameter);
      }, true as boolean);
    } else {
      return false;
    }
  });
}

export function buildCall(file: LLVMFile, node: CallNode): SymbolValue[] {
  const args = buildTuple(file, node.arguments)[0] ?? [];
  if(isNode(node.left, Kinds.identifier) && node.left.value) {
    const caller = getSymbol(file, node.left.value);
    const match = matchSignature(caller, args);
    if(match && isFunction(match)) {
      return [{
        type: match.type.returnType,
        value: file.builder.CreateCall(match.value, args.map((symbol, index) => {
          if(match.type.argumentTypes[index].isPointer && !symbol.type.isPointer) {
            return toPointer(file, symbol).value;
          } else if(!match.type.argumentTypes[index].isPointer && symbol.type.isPointer) {
            if(symbol.type.isOptional) {
              throw new Error("Optional args not implemented");
            } else {
              return fromPointer(file, symbol).value;
            }
          } else {
            return symbol.value;
          }
        }))
      }];
    } else {
      throw new Error("No matching override");
    }
  } else {
    throw new Error("Unsupported callee");
  }
}
