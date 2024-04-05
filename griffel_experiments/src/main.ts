import { hash, init } from "./hash";
import { murmur2 } from "./murmur2";

(async function run() {
  await init();
  console.log(hash("hello"));
  console.log(murmur2("hello"));
})();
