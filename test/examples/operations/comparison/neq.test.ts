import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("comparison neq", async () => {
  const result = await run("examples/operations/comparison/neq.si");
  const output = [
    "false",
    "true",
    "false",
    "true",
    "false",
    "true",
    "false",
    "true"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
