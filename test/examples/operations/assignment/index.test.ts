import { test, expect } from "@jest/globals";
import { run } from "../../../../source/commands";

test("conditionals", async () => {
  const result = await run("examples/operations/assignment/index.si");
  expect(result?.stdout).toBe("5\n");
  expect(result?.stderr).toBe("");
});
