import referenceImpl from "@emotion/hash";
import hash from "../out/wasm-hash.js";

console.log(hash("hello, world!"));
console.log(referenceImpl("hello, world!"));
