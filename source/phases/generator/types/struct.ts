import llvm from "llvm-bindings";
import { LLVMFile } from "..";
import { getLLVMType, isSameType, Primitives, Type, TypeInterface } from ".";

export interface StructType extends TypeInterface {
  primitive: "Struct";
  name: string;
  fields: {
    [name: string]: Type;
  };
}

export function isStructType(type: Type): type is StructType {
  return type.primitive === Primitives.Struct;
}

export function isSameStructType(a: StructType, b: StructType): boolean {
  const keys = Object.keys(a.fields);
  for(let i=0; i<keys.length; i+=1) {
    const key = keys[i];
    if(b.fields[key] === undefined || !isSameType(a.fields[key], b.fields[key])) {
      return false;
    }
  }
  return true;
}

export function getStructType(file: LLVMFile, type: StructType) {
  return llvm.StructType.create(file.context, Object.keys(type.fields).map((key) => {
    return getLLVMType(file, type.fields[key]);
  }), type.name);
}
