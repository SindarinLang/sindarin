import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("logical and", async () => {
  const result = await run("examples/operations/logical/and.si");
  const output = [
    "true",
    "false",
    "true",
    "false",
    "true",
    "false"
  ].join("\n");
  expect(result?.stdout).toBe(`${output}\n`);
  expect(result?.stderr).toBe("");
});
