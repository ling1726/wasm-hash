const fs = require("fs");

function toUint8Array(buf) {
  const arr = [];
  for (let i = 0; i < buf.length; i++) {
    arr.push(buf[i]);
  }

  fs.writeFileSync(
    "griffel_experiments/src/bin.ts",
    `export const bin =  new Uint8Array(${JSON.stringify(arr)})`
  );
}

const buf = fs.readFileSync(
  "target/wasm32-unknown-unknown/release/griffel_experiments.wasm"
);
const arr = toUint8Array(buf);
