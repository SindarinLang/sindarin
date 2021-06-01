import { join } from "path";
import { Phase } from "..";
import { getError } from "../../error";
import { LLVMFile } from "../builder/file";

export const getWriteError = getError("Write");

function print(file: LLVMFile) {
  file.mod.print(join(process.cwd(), `code/${file.name}.ll`));
}

export const write: Phase<LLVMFile, boolean> = (file: LLVMFile) => {
  print(file);
  file.imports.forEach((importedFile) => {
    write(importedFile);
  });
  return {
    value: true,
    errors: []
  };
};
