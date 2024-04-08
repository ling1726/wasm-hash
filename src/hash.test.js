import referenceImpl from "@emotion/hash";
import assert from "node:assert";
import { test } from "node:test";
import hash from "wasm-hash";

test("hash (short string)", () => {
  const input = "hello world";

  assert.equal(hash(input), referenceImpl(input));
  assert.equal(hash(input), "6opb3n");
});

test("hash (long string)", () => {
  const input = "hello world".repeat(100);

  assert.equal(hash(input), referenceImpl(input));
  assert.equal(hash(input), "1j833u4");
});
