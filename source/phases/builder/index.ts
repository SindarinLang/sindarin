import { exec } from "child_process";
import { join, isAbsolute } from "path";
import { removeFile } from "remove-file-safe";
import { Options, PromisePhase } from "..";
import { getError } from "../error";
import { WriteValue, getTempDir } from "../writer";

export type BuildPhase = PromisePhase<WriteValue, WriteValue>;

export const getBuildError = getError("Build");

async function resolveOutput(output?: string): Promise<WriteValue> {
  if(output) {
    const path = isAbsolute(output) ? output : join(process.cwd(), output);
    return Promise.resolve({
      path,
      cleanup: async () => {
        await removeFile(path);
      }
    });
  } else {
    return getTempDir().then((value) => ({
      path: join(value.path, "index.out"),
      cleanup: value.cleanup
    }));
  }
}

export const build: BuildPhase = async (dir: WriteValue, options?: Options) => {
  return resolveOutput(options?.output).then((output) => {
    return new Promise((resolve) => {
      exec(`clang ${dir.path}/*.bc -O3 -o ${output.path}`, (error) => {
        dir.cleanup();
        if(error) {
          resolve({
            context: dir,
            value: output,
            errors: [getBuildError(error.message)]
          });
        } else {
          resolve({
            context: dir,
            value: output,
            errors: []
          });
        }
      });
    });
  });
};
