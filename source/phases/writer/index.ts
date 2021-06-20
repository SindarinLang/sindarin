import llvm from "llvm-bindings";
import { join } from "path";
import { PromisePhase, Result } from "..";
import { Options } from "../";
import { Directory, getTempDir } from "../../utils";
import { getError } from "../error";
import { LLVMFile } from "../generator";

export type WriteValue = Directory;

type OutputOptions = {
  /**
   * Output .ll files. Default: `false`.
   */
  llvm: boolean;
};

export type WriteOptions = {
  output?: OutputOptions;
  tmpdir?: Directory;
};

export type WritePhase = PromisePhase<LLVMFile, WriteValue>;

export const getWriteError = getError("Write");

const print: WritePhase = async (file: LLVMFile, options?: Options) => {
  const result: Result<WritePhase> = {
    context: file,
    value: options?.writer?.tmpdir ?? await getTempDir(),
    errors: []
  };
  if(llvm.verifyModule(file.mod)) {
    result.errors.push(getWriteError("invalid module"));
  }
  if(options?.writer?.output?.llvm === undefined) {
    file.mod.print(join(process.cwd(), `code/${file.name}.ll`));
  }
  if(result.value?.path) {
    llvm.WriteBitcodeToFile(file.mod, join(result.value.path, `${file.name}.bc`));
  }
  return result;
};

export const write: WritePhase = async (file: LLVMFile, options?: Options) => {
  const result = await print(file, options);
  const results = await Promise.all(file.imports.map((importedFile) => write(importedFile, {
    ...options,
    writer: {
      ...options?.writer,
      tmpdir: result.value
    }
  })));
  results.forEach((importResult) => {
    result.errors.push(...importResult.errors);
  });
  return result;
};
