import _bin from "../out/wasm_hash.wasm";

const bin =
  /** @type {(imports: WebAssembly.Imports) => WebAssembly.Instance} */ (_bin);

const HASH_LENGTH = 10;
const MAX_INPUT_LENGTH = 3000;

/** @type {WebAssembly.Instance} */
let instance;
/** @type {(input: number) => void} */
let impl;
/** @type {Uint8Array} */
let buffer = null;

/**
 * @param {string} str
 * @param {number} len
 *
 * @returns {void}
 */
function pack(str, len) {
  let i = 0;

  while (i < len) {
    buffer[i] = str.charCodeAt(i);
    i++;
  }
}

/**
 * @returns {string}
 */
function unpack() {
  let str = "";

  for (let i = 0, l = HASH_LENGTH; i < l; i++) {
    if (buffer[i] === 0) {
      continue;
    }

    str += String.fromCharCode(buffer[i]);
  }

  return str;
}

/**
 * @param {string} input
 *
 * @returns {string}
 */
function hash(input) {
  if (process.env.NODE_ENV !== "production") {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }

    if (input.length > MAX_INPUT_LENGTH) {
      throw new Error(
        "Input is too long, only strings with length <= 3000 are supported",
      );
    }
  }

  if (!instance) {
    const memory = new WebAssembly.Memory({ initial:1, maximum: 1 });
    instance = bin({ env: { memory } });
    impl = instance.exports.hash;
    const ptr = instance.exports.pointer();

    buffer = new Uint8Array(
      memory.buffer,
      ptr,
      MAX_INPUT_LENGTH,
    );
  }

  const length = input.length;

  pack(input, length);
  impl(length);

  return unpack();
}

export default hash;
