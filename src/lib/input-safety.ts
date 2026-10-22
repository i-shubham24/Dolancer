/**
 * Input hygiene shared by every form.
 *
 * These checks run in the browser, so they keep honest mistakes and casual abuse
 * out and give instant feedback. They are not the last line: anyone can call the
 * API directly, so the database constraints, storage policies and server checks
 * stay the real controls. Values never reach SQL as text here: supabase-js sends
 * them as parameters, and no query is built by joining strings.
 */

/**
 * Control characters (except tab and newline), zero-width spaces and the direction
 * marks and overrides used to disguise text, such as a file name that reads as
 * ".pdf" but ends in ".exe". The zero-width joiner and non-joiner (200C, 200D) are
 * kept: Hindi and other Indian scripts need them, and so do joined emoji.
 */
const HIDDEN_RANGES: [number, number][] = [
  [0x00, 0x08], [0x0b, 0x0c], [0x0e, 0x1f], [0x7f, 0x7f],
  [0x200b, 0x200b], [0x200e, 0x200f], [0x202a, 0x202e], [0x2060, 0x2064], [0x2066, 0x2069], [0xfeff, 0xfeff],
];
// Built from code points so the source holds no invisible characters itself.
const HIDDEN_CHARS = new RegExp(
  `[${HIDDEN_RANGES.map(([from, to]) => `${String.fromCharCode(from)}-${String.fromCharCode(to)}`).join("")}]`,
  "g",
);

/** Free text: hidden characters removed, cut to a maximum length. */
export function cleanText(value: string, max: number): string {
  return value.normalize("NFC").replace(HIDDEN_CHARS, "").slice(0, max);
}

/**
 * What a name may hold: letters in any script with their vowel signs and accents,
 * spaces, dots, apostrophes and hyphens. Every name check uses this one rule.
 */
export const NAME_PATTERN = /^[\p{L}\p{M}\s.'-]+$/u;

/** A person's name, keeping only what NAME_PATTERN allows. */
export function cleanName(value: string, max = 100): string {
  return cleanText(value, max).replace(/[^\p{L}\p{M}\s.'-]/gu, "").replace(/\s{2,}/g, " ");
}

/** A phone number as typed: digits, spaces, a leading plus and hyphens only. */
export function cleanPhone(value: string, max = 20): string {
  return cleanText(value, max).replace(/[^\d\s+-]/g, "");
}

export type SafeFileKind = "jpeg" | "png" | "webp" | "pdf";

/** What the first bytes say the file really is, whatever its name claims. */
function sniff(bytes: Uint8Array): SafeFileKind | null {
  const at = (offset: number, ...values: number[]) => values.every((value, index) => bytes[offset + index] === value);
  if (at(0, 0xff, 0xd8, 0xff)) return "jpeg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "png";
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return "webp";
  if (at(0, 0x25, 0x50, 0x44, 0x46, 0x2d)) return "pdf";
  return null;
}

/**
 * PDF features that run code or carry other files. A scanned PAN card needs none of
 * them, so a PDF that has any is turned away. OpenAction is not listed: plain
 * exports use it to set the first page or zoom, and a script it starts is caught
 * by the JavaScript and JS names anyway.
 */
const PDF_ACTIVE = /\/(JavaScript|JS|Launch|EmbeddedFile|EmbeddedFiles|AA|RichMedia|XFA|SubmitForm|ImportData)(?![A-Za-z0-9])/;

/**
 * The parts of a PDF that describe it, without the stream data. Image data is
 * random bytes that can spell any keyword by chance, so it is cut out, and names
 * written in hex (#61 for "a") are spelled out so they cannot hide.
 */
function pdfStructure(bytes: Uint8Array): string {
  // windows-1252 keeps every byte as one character, so the keywords can be searched.
  const text = new TextDecoder("latin1").decode(bytes);
  return text
    .replace(/stream\r?\n[\s\S]*?endstream/g, " ")
    .replace(/#([0-9A-Fa-f]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Check a file by its content: it must really be one of the allowed kinds, and a
 * PDF must be named as a PDF and carry no scripts or attachments. A photo may have
 * the wrong extension (a WEBP saved as .jpg is common): it is redrawn anyway.
 * Returns a problem to show, or null when the file is fine.
 *
 * Scripts inside compressed object streams cannot be seen from here; the server
 * scan is the check for those.
 */
export async function checkFileContent(file: File, allowed: SafeFileKind[]): Promise<string | null> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind || !allowed.includes(kind)) return "That file is not a real photo or PDF. Upload a JPG, PNG, WEBP or PDF.";
  const namedPdf = file.type === "application/pdf";
  if ((kind === "pdf") !== namedPdf) return "The file type does not match its name. Upload the original file.";
  if (kind === "pdf") {
    const text = new TextDecoder("latin1").decode(bytes);
    if (!text.includes("%%EOF")) return "This PDF looks damaged. Upload it again.";
    if (PDF_ACTIVE.test(pdfStructure(bytes))) return "This PDF has scripts or attachments in it. Upload a plain scan or a photo.";
  }
  return null;
}

/**
 * Draw a photo onto a fresh canvas and save it as a new JPEG. Only the pixels
 * survive: anything hidden after or inside the image data is dropped, and so is
 * the location and camera data phones add. Large photos are scaled down.
 */
export async function redrawImage(file: File, maxSide = 2400): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not read that photo.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!blob) throw new Error("Could not read that photo.");
    const base = file.name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").slice(0, 60) || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } finally {
    bitmap.close();
  }
}
