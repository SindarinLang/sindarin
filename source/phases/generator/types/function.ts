import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { Type, getLLVMType, Primitives, SymbolValue, isSameType, TypeInterface } from ".";
import { SymbolResolver } from "../file";

type FunctionTypeFields = {
  name: string;
  argumentTypes: Type[];
  returnType: Type;
  isVarArg?: boolean;
};

export type FunctionType = TypeInterface & {
  primitive: "Function";
} & FunctionTypeFields;

export type TypeUnion = Type[];

export type FunctionSignature = {
  parameters: TypeUnion[];
  resolver: SymbolResolver;
};

export type FunctionOverrides = FunctionSignature[];

export function resolveOverride(overrides: FunctionOverrides, args: SymbolValue[] = []) {
  const match = matchSignature(overrides, args);
  if(match) {
    return match.resolver(args);
  } else {
    return undefined;
  }
}

function matchSignature(overrides: FunctionOverrides, args: SymbolValue[] = []) {
  return overrides.find((signature) => {
    return signature.parameters.reduce((retval, union, index) => {
      const match = args[index] && union.find((type) => isSameType(type, args[index].type));
      if(match) {
        return retval;
      } else {
        return false;
      }
    }, true as boolean);
  });
}

export function isSameFunctionType(a: FunctionType, b: FunctionType): boolean {
  return a.argumentTypes.length === b.argumentTypes.length && a.argumentTypes.reduce((retval, argType, index) => {
    return retval && isSameType(argType, b.argumentTypes[index]);
  }, isSameType(a.returnType, b.returnType));
}

export function isFunctionType(type: Type): type is FunctionType {
  return type.primitive === Primitives.Function;
}

export function isFunction(symbol: SymbolValue): symbol is SymbolValue<llvm.Function, FunctionType> {
  return isFunctionType(symbol.type);
}

export function getFunctionType(fields: FunctionTypeFields, isPointer = false, isOptional = false): FunctionType {
  return {
    primitive: "Function",
    isPointer,
    isOptional,
    ...fields
  };
}

export function getFunctionLLVMType(file: LLVMFile, type: FunctionType) {
  return llvm.FunctionType.get(
    getLLVMType(file, type.returnType),
    type.argumentTypes.map((argType) => getLLVMType(file, argType)),
    type.isVarArg ?? false
  );
}
