import { test, expect } from "@jest/globals";
import { scan, parse, generate, write, build } from "../../source/phases";

// Can't mock this test since it calls llvm to write

test("basic", async () => {
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
    const generateResult = generate(ast);
    if(generateResult.value) {
      const writeResult = await write(generateResult.value);
      expect(writeResult.value).toBeTruthy();
      if(writeResult.value) {
        const buildResult = await build(writeResult.value);
        expect(buildResult.value).toBeTruthy();
      }
    }
  }
});
