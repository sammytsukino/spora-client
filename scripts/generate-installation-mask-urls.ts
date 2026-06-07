import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { cldImage } from "../src/lib/cloudinary.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourcePath = join(__dirname, "..", "public", "installation", "mask-urls.js");
const source = readFileSync(sourcePath, "utf-8");

const urlRe = /"(https:\/\/res\.cloudinary\.com\/[^"]+)"/g;

const optimized = source.replace(urlRe, (_match, url: string) => {
  return `"${cldImage(url, "thumbnail")}"`;
});

writeFileSync(sourcePath, optimized, "utf-8");
console.log("Optimized mask URLs:", sourcePath);
