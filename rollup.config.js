import { resolve } from "path";
import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";

const dir = resolve(__dirname, "dist");

export default defineConfig({
  input: "src/index.ts",
  external: ["path", "fs", "fs/promises"],
  output: [
    {
      exports: "auto",
      sourcemap: true,
      file: resolve(dir, "index.cjs"),
      format: "cjs",
    },
    {
      exports: "auto",
      sourcemap: true,
      file: resolve(dir, "index.mjs"),
      format: "es",
    },
  ],
  plugins: [typescript()],
});
