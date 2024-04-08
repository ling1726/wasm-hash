import _bin from "../dist/wasm_hash.wasm";

const bin =
  /** @type {(imports: WebAssembly.Imports) => WebAssembly.Instance} */ (_bin);

const OFFSET = 1;
const HASH_LENGTH = 10 + OFFSET;
const MAX_INPUT_LENGTH = 3000 + OFFSET;

/** @type {WebAssembly.Instance} */
let instance;
/** @type {(input: number) => void} */
let impl;
/** @type {Uint8Array} */
let inputBuf = null;
/** @type {Uint8Array} */
let outputBuf;

/**
 * @param {string} str
 * @param {number} len
 *
 * @returns {void}
 */
function pack(str, len) {
  let i = 0;

  while (i < len) {
    inputBuf[i] = str.charCodeAt(i);
    i++;
  }
}

/**
 * @returns {string}
 */
function unpack() {
  let str = "";

  for (let i = 0, l = HASH_LENGTH; i < l; i++) {
    if (outputBuf[i] === 0) {
      continue;
    }

    str += String.fromCharCode(outputBuf[i]);
  }

  return str;
}

/**
 * @param {string} input
 *
 * @returns {string}
 */
function hash(input) {
  if (!instance) {
    instance = bin({ env: { memory: new WebAssembly.Memory({ initial: 1 }) } });
    impl = instance.exports.hash;

    inputBuf = new Uint8Array(
      instance.exports.memory.buffer,
      OFFSET,
      MAX_INPUT_LENGTH,
    );
    outputBuf = new Uint8Array(
      instance.exports.memory.buffer,
      OFFSET,
      HASH_LENGTH,
    );
  }

  const length = input.length;

  pack(input, length);
  impl(length);

  return unpack();
}

export default hash;
