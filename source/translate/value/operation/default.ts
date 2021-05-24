import llvm from "llvm-bindings";
import { LLVMFile, SymbolValue } from "../../file";
import { primitives } from "../../primitive";

export function buildDefault(file: LLVMFile, left: SymbolValue, right: SymbolValue) {
  const pointer = file.builder.CreatePtrToInt(left.value, file.builder.getInt32Ty());
  const isDefined = file.builder.CreateICmpNE(pointer, llvm.Constant.getNullValue(file.builder.getInt32Ty()));
  const trueBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
  const falseBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
  const thenBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
  file.builder.CreateCondBr(isDefined, trueBlock, falseBlock);
  // true block
  file.builder.SetInsertionPoint(trueBlock);
  const value = file.builder.CreateLoad(llvm.Type.getInt32Ty(file.context), left.value);
  file.builder.CreateBr(thenBlock);
  // false block
  file.builder.SetInsertionPoint(falseBlock);
  file.builder.CreateBr(thenBlock);
  // then block
  file.builder.SetInsertionPoint(thenBlock);
  const phi = file.builder.CreatePHI(llvm.Type.getInt32Ty(file.context), 1);
  phi.addIncoming(value, trueBlock);
  phi.addIncoming(right.value, falseBlock);
  return {
    type: primitives.int32,
    value: phi
  };
}
