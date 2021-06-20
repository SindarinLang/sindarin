import { test, expect } from "@jest/globals";
import { scan, parse, generate, write, build, execute } from "../../source/phases";

// Can't mock this test since it calls llvm to write

test("basic", async () => {
  const tokens = scan({
    contents: "import { output };\noutput(6);",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const ast = parse(tokens.value ?? []).value;
  if(ast !== undefined) {
    const generateResult = await generate(ast);
    if(generateResult.value) {
      const writeResult = await write(generateResult.value);
      if(writeResult.value) {
        const buildResult = await build(writeResult.value);
        if(buildResult.value) {
          const executeResult = await execute(buildResult.value);
          expect(executeResult.value?.stdout).toBe("6\n");
          expect(executeResult.value?.stderr).toBe("");
        }
      }
    }
  }
});
