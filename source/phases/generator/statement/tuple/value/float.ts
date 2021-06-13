import { LLVMFile } from "../../../file";
import { getFloat32 } from "../../../types";

export function getFloat(file: LLVMFile, value: number) {
  return getFloat32(file, value);
}
