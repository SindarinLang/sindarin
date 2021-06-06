import llvm from "llvm-bindings";
import { join } from "path";
import { Phase, Result } from "..";
import { getError } from "../error";
import { LLVMFile } from "../generator";

export type WritePhase = Phase<LLVMFile, boolean>;

export const getWriteError = getError("Write");

function print(file: LLVMFile) {
  const invalid = llvm.verifyModule(file.mod);
  llvm.WriteBitcodeToFile(file.mod, `code/${file.name}.bc`);
  file.mod.print(join(process.cwd(), `code/${file.name}.ll`));
  return !invalid;
}

export const write: WritePhase = (file: LLVMFile) => {
  const result: Result<WritePhase> = {
    context: file,
    value: true,
    errors: []
  };
  const valid = print(file);
  if(valid === false) {
    result.value = valid;
    result.errors.push(getWriteError(`Invalid module - ${file}`));
  }
  file.imports.forEach((importedFile) => {
    const subResult = write(importedFile);
    result.value = result.value && subResult.value;
    result.errors.push(...subResult.errors);
  });
  return result;
};
