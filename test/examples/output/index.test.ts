import { test, expect } from "@jest/globals";
import { run } from "../../../source/commands";

test("output", async () => {
  const result = await run("examples/output");
  expect(result?.stdout).toBe("true\nfalse\n1\n1.230000\na\n");
  expect(result?.stderr).toBe("");
});
