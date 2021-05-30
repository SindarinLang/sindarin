import llvm from "llvm-bindings";
import { Tokens } from "../../../../lexer";
import { BinaryOperationNode } from "../../../../parser/statement/tuple/expression/binary-operation";
import { LLVMFile, SymbolValue } from "../../../file";
import { primitives } from "../../../primitive";

// TODO: use CreateSelect
export function buildConditionalOperation(file: LLVMFile, left: SymbolValue, node: BinaryOperationNode, right: SymbolValue) {
  if(node.operator === Tokens.conditional) {
    const trueBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
    const falseBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
    const thenBlock = llvm.BasicBlock.Create(file.context, undefined, file.functionStack[file.functionStack.length-1]);
    file.builder.CreateCondBr(left.value, trueBlock, falseBlock);
    // true block
    file.builder.SetInsertionPoint(trueBlock);
    const pointer = file.builder.CreateAlloca(file.builder.getInt32Ty());
    file.builder.CreateStore(right.value, pointer);
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
  } else {
    return undefined;
  }
}
