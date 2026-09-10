#!/usr/bin/env node
/**
 * Refuses privileged key material anywhere in the tracked source.
 *
 * The Supabase secret key carries BYPASSRLS. If one ever reached this bundle the
 * entire doer-anonymity boundary would dissolve, because RLS is the boundary. This
 * runs in `npm run verify` and belongs in a pre-commit hook too.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "coverage", ".turbo"]);
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".html", ".css", ".md"]);

const PATTERNS = [
  [new RegExp('sb_' + 'secret' + '_[A-Za-z0-9_-]+', 'g'), 'Supabase secret key'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./g, "raw JWT (possible privileged key)"],
  [new RegExp('service' + '_' + 'role', 'gi'), 'privileged role reference'],
  [/rzp_(live|test)_[A-Za-z0-9]+/g, "Razorpay key"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/g, "private key block"],
];

const findings = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("._")) continue;
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full);
      continue;
    }
    if (!SCAN_EXT.has(extname(entry))) continue;
    // The scanner and its own allowlist naturally contain these shapes.
    if (full.includes("secret-scan.mjs")) continue;

    const text = readFileSync(full, "utf8");
    text.split("\n").forEach((line, index) => {
      if (line.includes("pragma: allowlist secret")) return;
      for (const [pattern, label] of PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          findings.push(`${full.replace(ROOT, ".")}:${index + 1}  ${label}`);
        }
      }
    });
  }
}

walk(ROOT);

if (findings.length > 0) {
  console.error("Privileged key material found. This must never enter the frontend:\n");
  for (const finding of findings) console.error("  " + finding);
  console.error("\nPrivileged keys belong only in backend edge functions.");
  process.exit(1);
}

console.log("secret-scan: clean");
