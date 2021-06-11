import { test, expect } from "@jest/globals";
import { scan } from "../../source/phases/scanner";

test("import", () => {
  const result = scan({
    contents: "import { output };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  expect(result.value?.[0].kind).toBe("import");
  expect(result.value?.[1].kind).toBe("space");
  expect(result.value?.[2].kind).toBe("open_curly");
});

test("rune", () => {
  const result = scan({
    contents: "'x'",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  expect(result.value?.[0].kind).toBe("rune");
  expect(result.value?.[0].value).toBe("x");
});

test("rune with emoji", () => {
  const result = scan({
    contents: "'🕊'",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  expect(result.value?.[0].kind).toBe("rune");
  expect(result.value?.[0].value).toBe("🕊");
});

test("rune with escape character", () => {
  const result = scan({
    contents: "'\\n'",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  expect(result.value?.[0].kind).toBe("rune");
  expect(result.value?.[0].value).toBe("\n");
});

test("string", () => {
  const result = scan({
    contents: "\"test\"",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  expect(result.value?.[0].kind).toBe("open_quote");
  expect(result.value?.[1].kind).toBe("string");
  expect(result.value?.[1].value).toBe("test");
  expect(result.value?.[2].kind).toBe("close_quote");
});
