import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("comparison lt", async () => {
  const result = await run("examples/operations/comparison/lt.si");
  const output = [
    "false",
    "true",
    "false",
    "true",
    "false",
    "false",
    "true",
    "false",
    "false",
    "true",
    "false",
    "false"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
