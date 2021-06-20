import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { getEnum, ValueOf } from "../../../utils";
import { FunctionType, getFunctionType, isFunctionType, isSameFunctionType } from "./function";
import { getStructType, isSameStructType, isStructType, StructType } from "./struct";

export type Primitives = ValueOf<typeof Primitives>;

export const Primitives = getEnum({
  Void: true,
  Boolean: true,
  UInt8: true,
  Int8: true,
  UInt16: true,
  Int16: true,
  UInt32: true,
  Int32: true,
  UInt64: true,
  Int64: true,
  UInt128: true,
  Int128: true,
  Float32: true,
  Float64: true,
  Float128: true,
  Function: true,
  Struct: true
});

type Primitive = Type | Primitives;

export type TypeInterface = {
  primitive: Primitive;
  isPointer: boolean;
  isOptional: boolean;
};

export type Type = TypeInterface | FunctionType | StructType;

export type LLVMValue = llvm.Value;

export type SymbolValue<V extends LLVMValue = LLVMValue, T extends Type = Type> = {
  value: V;
  type: T;
};

export function getType(primitive: Primitive, isPointer = false, isOptional = false) {
  return {
    primitive,
    isPointer,
    isOptional
  };
}

export function isSameType(a: Type, b: Type) {
  if(isFunctionType(a) && isFunctionType(b)) {
    return isSameFunctionType(a, b);
  } else if(isStructType(a) && isStructType(b)) {
    return isSameStructType(a, b);
  } else {
    return a.primitive === b.primitive;
  }
}

function getLLVMBaseType(file: LLVMFile, type: Type): llvm.Type {
  if(typeof type.primitive === "string") {
    if(isFunctionType(type)) {
      return getFunctionType(file, type);
    } else if(isStructType(type)) {
      if(file.types[type.name]) {
        return file.types[type.name];
      } else {
        return getStructType(file, type);
      }
    } else if(file.types[type.primitive]) {
      return file.types[type.primitive];
    } else {
      throw new Error("Unknown type");
    }
  } else {
    return getLLVMType(file, type.primitive);
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

export { getInt32, getInt32Value } from "./int32";
export { getUInt8Value } from "./uint8";
export { getBoolean, getBooleanValue, castToBoolean } from "./boolean";
export { getFloat32, castToFloat32, getFloat32Value } from "./float32";
export { getFunctionType, isFunctionType, isFunction, FunctionType } from "./function";
export { StructType } from "./struct";
export { getRune } from "./rune";
