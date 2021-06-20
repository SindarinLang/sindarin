import llvm from "llvm-bindings";
import { getType, LLVMValue, Primitives, SymbolValue } from ".";
import { LLVMFile } from "..";
import { getInt32Value } from "./int32";
import { getStructType } from "./struct";
import { getUInt8Value } from "./uint8";

export function getRuneValue(file: LLVMFile, value: string | LLVMValue) {
  if(typeof value === "string") {
    const rune = file.builder.CreateAlloca(file.types.Rune);
    const buffer = Buffer.from(value);
    file.builder.CreateStore(llvm.ConstantInt.get(file.types.Int32, buffer.length), file.builder.CreateGEP(rune, [
      getInt32Value(file, 0),
      getInt32Value(file, 0)
    ]));
    const data = file.builder.CreateAlloca(llvm.ArrayType.get(file.types.UInt8, buffer.length));
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

export function getRuneType() {
  return getStructType({
    name: "Rune",
    fields: {
      length: getType(Primitives.Int32),
      data: getType(Primitives.UInt8, true)
    }
  });
}

export function getRune(file: LLVMFile, value: string): SymbolValue {
  return {
    type: getRuneType(),
    value: getRuneValue(file, value)
  };
}
