import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("logical not", async () => {
  const result = await run("examples/operations/logical/not.si");
  const output = [
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
