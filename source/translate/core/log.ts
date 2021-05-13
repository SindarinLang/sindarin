import llvm from "llvm-bindings";
import { LLVMFile } from "../file";

export function log({ context, builder, mod }: LLVMFile) {
  const format = builder.CreateGlobalString("%d\n", "format", 0, mod);
  const printf = llvm.Function.Create(
    llvm.FunctionType.get(
      builder.getInt32Ty(),
      [
        builder.getInt8PtrTy()
      ],
      true
    ),
    llvm.Function.LinkageTypes.ExternalLinkage,
    "printf",
    mod
  );
  const logI32 = llvm.Function.Create(
    llvm.FunctionType.get(
      builder.getInt32Ty(),
      [
        builder.getInt32Ty()
      ],
      false
    ),
    llvm.Function.LinkageTypes.ExternalLinkage,
    "_log_i32",
    mod
  );
  const logI32EntryBlock = llvm.BasicBlock.Create(context, "entry", logI32);
  builder.SetInsertionPoint(logI32EntryBlock);
  const res = builder.CreateCall(printf, [builder.CreateGEP(
    format,
    [
      builder.getInt32(0),
      builder.getInt32(0)
    ]
  ), logI32.getArg(0)]);
  builder.CreateRet(res);
  return llvm.verifyFunction(logI32) ? undefined : logI32;
}
