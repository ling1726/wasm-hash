import { defineConfig } from "rollup";
import path from "node:path";
import wasm from "@rollup/plugin-wasm";

const BIN_PATH = path.resolve(
  "target/wasm32-unknown-unknown/release/wasm_hash.wasm",
);

export default [
  defineConfig({
    input: "src/hash.js",
    output: {
      file: "dist/wasm-hash.js",
      format: "es",
    },
    plugins: [
      wasm({
        sync: [BIN_PATH],
        targetEnv: "browser",
      }),
    ],
  }),
  defineConfig({
    input: "src/hash.js",
    output: {
      file: "dist/wasm-hash-node.cjs",
      format: "cjs",
    },
    plugins: [
      wasm({
        sync: [BIN_PATH],
        targetEnv: "node",
      }),
    ],
  }),
];
