import { loadGenericEnv } from "./helper/loadGenericEnv.ts";
import { getSubdirs } from "./helper/getSubdirs.ts";

const dir = loadGenericEnv("LOCAL_DIRECTORY", "string");
const key = loadGenericEnv("API_KEY", "string");

console.log(dir);
console.log(key);
console.log(await getSubdirs(dir));
