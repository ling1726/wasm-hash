import { bin } from "./bin";

function pack(str: string, len: number) {
  let i = 0;
  while (i < len) {
    input_buf[i] = str.charCodeAt(i);
    i++;
  }
}

function unpack() {
  let str = "";

  for (var i = 0, l = 11; i < l; i++) {
    if (output_buf[i] === 0) {
      continue;
    }
    str += String.fromCharCode(output_buf[i]);
  }

  return str;
}

// Invoke the `hash` function from the module
// and log the result to the console.
export function hash(input: string) {
  const len = input.length;
  const { hash: myHash } = instance.exports;
  // transform the input string into its UTF-8
  // representation
  pack(input, len);
  // copy the contents of the string into
  // the module's memory
  // call the module's `hash` function and
  // get the offset into the memory where the
  // module wrote the result string
  (myHash as Function)(len);
  // read the string from the module's memory,
  // store it, and log it to the console

  const result = unpack();
  // console.log(output_buf);
  // console.log(input_buf);
  return result;
}

let instance: WebAssembly.Instance | null = null;
let input_buf = new Uint8Array(10);
let output_buf = new Uint8Array(10);

export function hashSync(str: string) {
  if (!instance) {
    const module = new WebAssembly.Module(bin);
    instance = new WebAssembly.Instance(module);

    input_buf = new Uint8Array(instance.exports.memory.buffer, 1, 3001);
    output_buf = new Uint8Array(instance.exports.memory.buffer, 1, 11);
  }

  return hash(str);
}

export async function init() {
  const bin = await fetch(
    "target/wasm32-unknown-unknown/release/griffel_experiments.wasm",
  ).then((res) => res.arrayBuffer());

  const memory = new WebAssembly.Memory({ initial: 1 });
  const module = new WebAssembly.Module(bin);

  instance = new WebAssembly.Instance(module, {
    env: {
      memory,
    },
  });

  input_buf = new Uint8Array(instance.exports.memory.buffer, 1, 3001);
  output_buf = new Uint8Array(instance.exports.memory.buffer, 1, 11);
}
