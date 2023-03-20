
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config()

console.log("env", process.env.NODE_ENV)
console.log("path",__dirname);
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const file = `./${env}.js`;

let data = await import(file);
let config = {};


export default Object.assign(config,data.config)
