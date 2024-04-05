import { hashSync as hash, init } from "./hash";
import { murmur2 } from "./murmur2";

(async function run() {
  // await init();

  console.log(hash("privet"));
  console.log(hash("privet"));
  console.log(murmur2("privet"));
})();
