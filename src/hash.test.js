import referenceImpl from "@emotion/hash";
import assert from "node:assert";
import { test } from "node:test";
import hash from "wasm-hash"

test("hash", () => {
  const input = "hello world";

  assert(hash(input), "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
  assert(hash(input), referenceImpl(input));
});
