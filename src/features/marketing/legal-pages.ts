/**
 * The list of legal pages, apart from their text, so the footer on every public page
 * does not download every document just to show five links.
 */
export type LegalKind = "terms" | "privacy" | "allowed-work" | "payouts" | "grievance";

/** Order here is the order of the tabs on the legal page and the buttons in the footer. */
export const LEGAL_PAGES: { kind: LegalKind; label: string }[] = [
  { kind: "terms", label: "Terms and Conditions" },
  { kind: "privacy", label: "Privacy Policy" },
  { kind: "allowed-work", label: "Allowed Work" },
  { kind: "payouts", label: "Payouts and Tax" },
  { kind: "grievance", label: "Grievances" },
];

export function isLegalKind(value: string | undefined): value is LegalKind {
  return LEGAL_PAGES.some((page) => page.kind === value);
}
