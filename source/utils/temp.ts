import { join } from "path";
import { tmpdir } from "os";
import { dir, DirectoryResult } from "tmp-promise";
import { writeDir } from "write-dir-safe";

export type Directory = DirectoryResult;

export async function getTempDir(): Promise<DirectoryResult> {
  const tmp = join(tmpdir(), "sindarin");
  await writeDir(tmp);
  return dir({
    tmpdir: join(tmpdir(), "sindarin"),
    unsafeCleanup: true
  });
}
