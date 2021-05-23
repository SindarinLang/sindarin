import llvm from "llvm-bindings";
import { ValueNode } from "../../parse/root/value";
import { LLVMFile } from "../file";
import { buildValue } from ".";
import { primitives } from "../primitive";

export function buildConditional(file: LLVMFile, condition: ValueNode, node: ValueNode) {
  const trueBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
  const falseBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
  const thenBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
  const conditionValue = buildValue(file, condition);
  file.builder.CreateCondBr(conditionValue.value, trueBlock, falseBlock);
  // true block
  file.builder.SetInsertionPoint(trueBlock);
  const value = buildValue(file, node);
  const pointer = file.builder.CreateAlloca(file.builder.getInt32Ty());
  file.builder.CreateStore(value.value, pointer);
  file.builder.CreateBr(thenBlock);
  // false block
  file.builder.SetInsertionPoint(falseBlock);
  const nullPointer = llvm.ConstantPointerNull.get(llvm.Type.getInt32PtrTy(file.context));
  file.builder.CreateBr(thenBlock);
  // then block
  file.builder.SetInsertionPoint(thenBlock);
  const phi = file.builder.CreatePHI(llvm.Type.getInt32PtrTy(file.context), 1);
  phi.addIncoming(pointer, trueBlock);
  phi.addIncoming(nullPointer, falseBlock);
  return {
    type: primitives.int32Ptr,
    value: phi
  };
}
