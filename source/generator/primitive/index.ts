import llvm, { LLVMContext } from "llvm-bindings";
import { ConditionalKeys } from "../../utils";
import { LLVMFile, SymbolValue } from "../file";

export enum Types {
  Boolean = "Boolean",
  Int32 = "Int32",
  UInt8 = "UInt8",
  Float32 = "Float32"
}

export type Primitive = {
  type: Types;
  isPointer?: boolean;
};

interface PrimitivePointer extends Primitive {
  isPointer: true;
}

const llvmTypes: {
  [type in Types]: {
    base: ConditionalKeys<typeof llvm.Type, (context: LLVMContext) => llvm.Type>;
    pointer: ConditionalKeys<typeof llvm.Type, (context: LLVMContext) => llvm.PointerType>;
    unsigned?: boolean;
  };
} = {
  [Types.Boolean]: {
    base: "getInt1Ty",
    pointer: "getInt1PtrTy"
  },
  [Types.Int32]: {
    base: "getInt32Ty",
    pointer: "getInt32PtrTy"
  },
  [Types.UInt8]: {
    base: "getInt8Ty",
    pointer: "getInt8PtrTy",
    unsigned: true
  },
  [Types.Float32]: {
    base: "getFloatTy",
    pointer: "getFloatPtrTy"
  }
};

export function getPrimitivePointer(type: Types) {
  return getPrimitive(type, true);
}

export function getPrimitive(type: Types, isPointer = false) {
  return {
    type,
    isPointer
  };
}

export function getLLVMBaseType(file: LLVMFile, type: Types) {
  return getLLVMType(file, {
    type,
    isPointer: false
  });
}

export function getLLVMPointerType(file: LLVMFile, type: Types) {
  return getLLVMType(file, {
    type,
    isPointer: true
  });
}

export function getLLVMType(file: LLVMFile, primitive: PrimitivePointer): llvm.PointerType;
export function getLLVMType(file: LLVMFile, primitive: Primitive): llvm.Type;
export function getLLVMType(file: LLVMFile, primitive: Primitive): llvm.Type {
  if(primitive.isPointer) {
    return llvm.Type[llvmTypes[primitive.type].pointer](file.context);
  } else {
    return llvm.Type[llvmTypes[primitive.type].base](file.context);
  }
}

export function castToPointer(file: LLVMFile, symbol: SymbolValue): SymbolValue {
  if(symbol.isPointer) {
    return symbol;
  } else {
    const pointer = file.builder.CreateAlloca(getLLVMType(file, symbol));
    file.builder.CreateStore(symbol.value, pointer);
    return {
      type: symbol.type,
      isPointer: true,
      value: pointer
    };
  }
}

export function castFromPointer(file: LLVMFile, symbol: SymbolValue): SymbolValue {
  if(symbol.isPointer) {
    return {
      type: symbol.type,
      isPointer: false,
      value: file.builder.CreateLoad(getLLVMBaseType(file, symbol.type), symbol.value)
    };
  } else {
    return symbol;
  }
}

export function isBoolean(symbol: SymbolValue) {
  return symbol.type === Types.Boolean;
}

export function isInteger(symbol: SymbolValue) {
  return symbol.type === Types.Int32;
}

export function isFloat(symbol: SymbolValue) {
  return symbol.type === Types.Float32;
}
