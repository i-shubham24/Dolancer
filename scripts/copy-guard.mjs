#!/usr/bin/env node
/**
 * Enforces the two hard copy rules on user-facing source.
 *
 * 1. The word "escrow" appears on no surface. Funds are held in a company account,
 *    not a regulated escrow, so the term is both inaccurate and a compliance
 *    problem. The doer-facing term for delivered-but-unapproved work is "Pending".
 * 2. No em dashes, per the house style.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const SCAN_EXT = new Set([".ts", ".tsx", ".css", ".html"]);

const RULES = [
  [/escrow/gi, 'the word "escrow" (use "Pending", "On hold" or "Awaiting approval")'],
  [/—/g, "an em dash (use a comma, period or colon)"],
  [/–/g, "an en dash (use a comma, period or colon)"],
  // A double hyphen is how an em dash usually sneaks back in.
  [/\s--\s/g, "a double hyphen standing in for a dash"],
];

const findings = [];

function scanFile(full) {
  if (!SCAN_EXT.has(extname(full))) return;
  const text = readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const [pattern, label] of RULES) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push(`${full.replace(ROOT, ".")}:${index + 1}  contains ${label}`);
      }
    }
  });
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("._")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    scanFile(full);
  }
}

walk(SRC);
scanFile(join(ROOT, "index.html"));

if (findings.length > 0) {
  console.error("Copy rule violations:\n");
  for (const finding of findings) console.error("  " + finding);
  process.exit(1);
}

console.log("copy-guard: clean");
