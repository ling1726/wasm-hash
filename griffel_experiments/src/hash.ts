function pack(str: string, len: number) {
  let i = 0;
  while (i < len) {
    input_buf[i] = str.charCodeAt(i);
    i++;
  }
}

function unpack() {
  let str = "";

  for (var i = 0, l = 10; i < l; i++) {
    if (output_buf[i] === 0) {
      break;
    }
    str += String.fromCharCode(output_buf[i]);
  }

  return str;
}

// Invoke the `hash` function from the module
// and log the result to the console.
export function hash(input: string) {
  if (!instance) {
    throw new Error();
  }

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
  console.log(output_buf);
  console.log(input_buf);
  return result;
}

export async function init() {
  const res = await window.fetch(
    "target/wasm32-unknown-unknown/release/griffel_experiments.wasm"
  );
  const module = new WebAssembly.Module(await res.arrayBuffer());
  instance = new WebAssembly.Instance(module);

  input_ptr = instance.exports.alloc_input();
  output_ptr = instance.exports.alloc_output();
  input_buf = new Uint8Array(instance.exports.memory.buffer, input_ptr, 3000);
  output_buf = new Uint8Array(instance.exports.memory.buffer, output_ptr, 10);
}

let instance: WebAssembly.Instance | null = null;
let input_ptr = 0;
let output_ptr = 0;
let input_buf = new Uint8Array(10);
let output_buf = new Uint8Array(10);
