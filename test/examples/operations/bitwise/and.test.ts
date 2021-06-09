import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("bitwise and", async () => {
  const result = await run("examples/operations/bitwise/and.si");
  expect(result?.stdout).toBe("true\nfalse\n4\n");
  expect(result?.stderr).toBe("");
});
