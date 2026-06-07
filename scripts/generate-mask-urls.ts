import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { optimizeCloudinaryUrl } from "../src/lib/cloudinary.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourcePath = join(__dirname, "..", "public", "installation", "mask-urls.js");
const content = readFileSync(sourcePath, "utf-8");

const optimized = content.replace(
  /https:\/\/res\.cloudinary\.com\/[^"'`\s]+/g,
  (url) => optimizeCloudinaryUrl(url, "thumbnail")
);

writeFileSync(sourcePath, optimized, "utf-8");
console.log("Optimized Cloudinary URLs in:", sourcePath);
