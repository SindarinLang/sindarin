import llvm from "llvm-bindings";
import { getType, LLVMValue, Primitives, SymbolValue } from ".";
import { LLVMFile } from "..";
import { getInt32Value } from "./int32";
import { getUInt8Type, getUInt8Value } from "./uint8";

export function getRuneType(file: LLVMFile) {
  return file.structs.Rune;
}

export function getRuneValue(file: LLVMFile, value: string | LLVMValue) {
  if(typeof value === "string") {
    const type = getRuneType(file);
    const rune = file.builder.CreateAlloca(type);
    const buffer = Buffer.from(value);
    file.builder.CreateStore(llvm.ConstantInt.get(file.structs.Int32, buffer.length), file.builder.CreateGEP(rune, [
      getInt32Value(file, 0),
      getInt32Value(file, 0)
    ]));
    const data = file.builder.CreateAlloca(llvm.ArrayType.get(getUInt8Type(file), buffer.length));
    buffer.forEach((byte, index) => {
      file.builder.CreateStore(getUInt8Value(file, byte), file.builder.CreateGEP(data, [
        getInt32Value(file, 0),
        getInt32Value(file, index)
      ]));
    });
    file.builder.CreateStore(file.builder.CreateGEP(data, [
      getInt32Value(file, 0),
      getInt32Value(file, 0)
    ]), file.builder.CreateGEP(rune, [
      getInt32Value(file, 0),
      getInt32Value(file, 1)
    ]));
    return rune;
  } else {
    return value;
  }
}

export function getRune(file: LLVMFile, value: string): SymbolValue {
  return {
    type: getType(Primitives.Rune, true),
    value: getRuneValue(file, value)
  };
}
