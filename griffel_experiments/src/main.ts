import { hash } from "./hash";
import { murmur2 } from "./murmur2";

(async function run() {
  console.log(hash("hello"));
  console.log(hash("hello"));
  console.log(murmur2("hello"));
})();
