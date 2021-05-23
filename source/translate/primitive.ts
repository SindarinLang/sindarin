import llvm from "llvm-bindings";
import { ConditionalKeys, ValueOf } from "./utils";

type PrimitiveKey = "int1" | "int32" | "float" | "int8Ptr";

export const primitives: {
  [key in PrimitiveKey]: ConditionalKeys<llvm.IRBuilder, () => llvm.Type>;
} = {
  int1: "getInt1Ty",
  int32: "getInt32Ty",
  float: "getFloatTy",
  int8Ptr: "getInt8PtrTy"
};

export type Primitive = ValueOf<typeof primitives>;

export const getPrimitive = (builder: llvm.IRBuilder) => {
  return (type: Primitive) => builder[type]();
};

export function isInteger(primitive: Primitive) {
  return primitive === primitives.int32;
}

export function isFloat(primitive: Primitive) {
  return primitive === primitives.float;
}

export function isNumeric(primitive: Primitive) {
  return isInteger(primitive) || isFloat(primitive);
}

export function isBoolean(primitive: Primitive) {
  return primitive === primitives.int1;
}
