/**
 * Generates public/installation/mood-lexicons.js from src/data/mood-lexicons.ts
 * Single source of truth: only edit the TS file.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MOOD_LEXICONS } from "../src/data/mood-lexicons.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outPath = join(__dirname, "..", "public", "installation", "mood-lexicons.js");
const content = `window.INSTALLATION_MOOD_LEXICONS = ${JSON.stringify(MOOD_LEXICONS)};
`;

writeFileSync(outPath, content, "utf-8");
console.log("Generated:", outPath);
