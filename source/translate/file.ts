import { join } from "path";
import { LLVMContext, IRBuilder, Module, verifyModule } from "llvm-bindings";

export type LLVMFile = {
  context: LLVMContext;
  builder: IRBuilder;
  mod: Module;
  name: string;
};

export function getFile(name: string) {
  const context = new LLVMContext();
  const builder = new IRBuilder(context);
  const mod = new Module(name, context);
  return {
    context,
    builder,
    mod,
    name,
    write: () => {
      if(!verifyModule(mod)) {
        mod.print(join(process.cwd(), `code/${name}.ll`));
        return mod;
      } else {
        throw new Error("Module verification failed");
      }
    }
  };
}
