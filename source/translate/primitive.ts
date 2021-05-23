import llvm from "llvm-bindings";
import { ConditionalKeys, ValueOf } from "./utils";

type PrimitiveKey = "int1" | "int32" | "int32Ptr" | "float" | "int8Ptr";

export const primitives: {
  [key in PrimitiveKey]: ConditionalKeys<typeof llvm.Type, (context: llvm.LLVMContext) => llvm.Type>;
} = {
  int1: "getInt1Ty",
  int32: "getInt32Ty",
  int32Ptr: "getInt32PtrTy",
  float: "getFloatTy",
  int8Ptr: "getInt8PtrTy"
};

export type Primitive = ValueOf<typeof primitives>;

export const getPrimitive = (context: llvm.LLVMContext) => {
  return (type: Primitive) => llvm.Type[type](context);
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
