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
  const input = "a".repeat(3000);

  assert.equal(hash(input), referenceImpl(input));
  assert.equal(hash(input), "ri3z0c");
});

test("throws on strings longer than 3000 characters", () => {
  const input = "a".repeat(3001);

  assert.throws(
    () => {
      hash(input);
    },
    {
      name: "Error",
      message:
        "Input is too long, only strings with length <= 3000 are supported",
    },
  );
});
