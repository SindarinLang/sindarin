import llvm from "llvm-bindings";
import { getType, LLVMValue, Primitives, SymbolValue } from ".";
import { LLVMFile } from "..";
import { getInt32Type, getInt32Value } from "./int32";

export function getRuneType(file: LLVMFile) {
  return llvm.StructType.create(file.context, [
    getInt32Type(file),
    llvm.Type.getInt8PtrTy(file.context)
  ], Primitives.Rune);
}

export function getRuneValue(file: LLVMFile, value: string | LLVMValue) {
  if(typeof value === "string") {
    const type = getRuneType(file);
    const rune = file.builder.CreateAlloca(type);
    const buffer = Buffer.from(value);
    file.builder.CreateStore(getInt32Value(file, buffer.length), file.builder.CreateGEP(rune, [
      getInt32Value(file, 0),
      getInt32Value(file, 0)
    ]));
    file.builder.CreateStore(file.builder.getInt8(buffer[0]), file.builder.CreateGEP(rune, [
      getInt32Value(file, 0),
      getInt32Value(file, 0)
    ]));
    return rune;
  } else {
    return value;
  }
}

export function getRune(file: LLVMFile, value: string): SymbolValue {
  return {
    type: getType(Primitives.Rune),
    value: getRuneValue(file, value)
  };
}
