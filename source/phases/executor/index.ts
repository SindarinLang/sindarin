import { execFile } from "child_process";
import { PromisePhase } from "..";
import { getError } from "../error";
import { WriteValue } from "../writer";

type ExecuteResult = {
  stdout: string;
  stderr: string;
};

export type ExecutePhase = PromisePhase<WriteValue, ExecuteResult>;

export const getExecuteError = getError("Execute");

export const execute: ExecutePhase = (out: WriteValue) => {
  return new Promise((resolve) => {
    execFile(out.path, (error, stdout, stderr) => {
      out.cleanup();
      if(error) {
        resolve({
          context: out,
          value: {
            stdout,
            stderr
          },
          errors: [getExecuteError(error.message)]
        });
      } else {
        resolve({
          context: out,
          value: {
            stdout,
            stderr
          },
          errors: []
        });
      }
    });
  });
};
