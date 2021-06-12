import { test, expect } from "@jest/globals";
import { scan, parse } from "../../source/phases";

test("basic", () => {
  const tokens = scan({
    contents: "import { output };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("import");
});

test("array assignment", () => {
  const tokens = scan({
    contents: "a = [];",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("assignment");
});

test("array set max length", () => {
  const tokens = scan({
    contents: "[](5);",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("tuple");
});
