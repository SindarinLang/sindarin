import { test, expect } from "@jest/globals";
import { scan, parse, generate } from "../../source/phases";

test("import", async () => {
  const tokens = scan({
    contents: "import { output };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const ast = parse(tokens.value ?? []).value;
  if(ast !== undefined) {
    const file = await generate(ast);
    expect(file.value?.name).toBe("main");
  }
});

test("export", async () => {
  const tokens = scan({
    contents: "a = () => 5;\nexport a;",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const ast = parse(tokens.value ?? []).value;
  if(ast !== undefined) {
    const file = await generate(ast);
    expect(typeof file.value?.exports.a).toBe("function");
  }
});
