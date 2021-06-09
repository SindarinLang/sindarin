import { test, expect, beforeAll, afterAll } from "@jest/globals";
import mock, { restore } from "mock-fs";
import { read } from "../../source/phases";

beforeAll(() => {
  mock({
    "/test": {
      "file.si": "..."
    }
  }, {
    createCwd: false
  });
});

afterAll(() => {
  restore();
});

test("basic", async () => {
  const result = await read(["/test/file.si"]);
  expect(result.value?.contents).toBe("...");
});
