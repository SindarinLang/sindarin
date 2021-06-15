import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { getEnum, ValueOf } from "../../../utils";
import { getBooleanType } from "./boolean";
import { getFloat32Type } from "./float32";
import { getFunctionType, isFunctionType, isSameFunctionType } from "./function";
import { getInt32Type } from "./int32";
import { getRuneType } from "./rune";
import { getUInt8Type } from "./uint8";

export type Primitives = ValueOf<typeof Primitives>;

export const Primitives = getEnum({
  Boolean: true,
  UInt8: true,
  Int32: true,
  Float32: true,
  Function: true,
  Rune: true
});

export type Type = {
  primitive: Primitives;
  isPointer: boolean;
  isOptional: boolean;
};

export type LLVMValue = llvm.Value;

export type SymbolValue<V extends LLVMValue = LLVMValue, T extends Type = Type> = {
  value: V;
  type: T;
};

const scalarTypes: {
  [key: string]: (file: LLVMFile) => llvm.Type;
} = {
  [Primitives.Boolean]: getBooleanType,
  [Primitives.UInt8]: getUInt8Type,
  [Primitives.Int32]: getInt32Type,
  [Primitives.Float32]: getFloat32Type,
  [Primitives.Rune]: getRuneType
};

export function getType(primitive: Primitives, isPointer = false, isOptional = false) {
  return {
    primitive,
    isPointer,
    isOptional
  };
}

export function isSameType(a: Type, b: Type) {
  if(isFunctionType(a) && isFunctionType(b)) {
    return isSameFunctionType(a, b);
  } else {
    return a.primitive === b.primitive;
  }
}

function getLLVMBaseType(file: LLVMFile, type: Type): llvm.Type {
  if(scalarTypes[type.primitive]) {
    return scalarTypes[type.primitive](file);
  } else if(isFunctionType(type)) {
    return getFunctionType(file, type);
  } else {
    throw new Error("Unsupported type");
  }
}

function getLLVMPointerType(file: LLVMFile, type: Type): llvm.PointerType {
  return getLLVMType(file, {
    ...type,
    isPointer: true
  });
}

export function getLLVMType(file: LLVMFile, type: Type & { isPointer: true }): llvm.PointerType;
export function getLLVMType(file: LLVMFile, type: Type): llvm.Type;
export function getLLVMType(file: LLVMFile, type: Type): llvm.Type {
  const baseType = getLLVMBaseType(file, type);
  if(type.isPointer) {
    return llvm.PointerType.getUnqual(baseType);
  } else {
    return baseType;
  }
}

export function getNull(file: LLVMFile, type: Type) {
  return llvm.ConstantPointerNull.get(getLLVMPointerType(file, type));
}

export function toPointer(file: LLVMFile, symbol: SymbolValue) {
  if(symbol.type.isPointer) {
    return symbol;
  } else {
    const pointer = file.builder.CreateAlloca(getLLVMType(file, symbol.type));
    file.builder.CreateStore(symbol.value, pointer);
    return {
      value: pointer,
      type: {
        ...symbol.type,
        isPointer: true
      }
    };
  }
}

export function fromPointer(file: LLVMFile, symbol: SymbolValue) {
  if(symbol.type.isPointer) {
    if(symbol.type.isOptional) {
      throw new Error("Cannot get optional value from pointer");
    } else {
      return {
        type: {
          ...symbol.type,
          isPointer: false
        },
        value: file.builder.CreateLoad(getLLVMBaseType(file, symbol.type), symbol.value)
      };
    }
  } else {
    return symbol;
  }
}

export { getInt32, getInt32Value, getInt32Type } from "./int32";
export { getUInt8Value, getUInt8Type } from "./uint8";
export { getBoolean, getBooleanType, getBooleanValue, castToBoolean } from "./boolean";
export { getFloat32, castToFloat32, getFloat32Value } from "./float32";
export { getFunctionType, FunctionType, isFunctionType, isFunction } from "./function";
export { getRune } from "./rune";
