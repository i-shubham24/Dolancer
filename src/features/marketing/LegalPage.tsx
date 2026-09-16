import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { demoRespond, isDemo } from "@/lib/demo-data";
import { selectColumns } from "@/lib/select";
import { formatDate } from "@/lib/datetime";
import { cn } from "@/lib/cn";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { CONTACT } from "./content";

type LegalKind = "terms" | "privacy";

interface LegalDocument {
  kind: LegalKind;
  version: string;
  title: string;
  content: string;
  effectiveAt: string | null;
}

const LOCAL_DOCUMENTS: Record<LegalKind, LegalDocument> = {
  terms: {
    kind: "terms",
    version: "local-draft-2026-09-16",
    title: "Terms of Service",
    effectiveAt: "2026-09-16T00:00:00.000Z",
    content: `# Important notice

These local-preview terms are the product implementation baseline for review. They must be checked and approved by qualified Indian counsel, and replaced with the final published version, before production launch.

# 1. About Dolancer

Dolancer is a managed service operated by ${CONTACT.company}, ${CONTACT.jurisdiction}. The platform receives or coordinates client project requirements and routes specific offers to independent doers. Dolancer is not an open job marketplace. A doer does not bid against other doers, and a client does not receive a doer's personal identity through the normal workflow.

# 2. Eligibility and account

You must be at least 18 years old and legally able to enter a contract in your place of residence. You must provide accurate information, maintain one account, protect your sign-in access and promptly tell us if information becomes inaccurate. We may refuse, suspend or close an account where required for safety, fraud prevention, legal compliance, quality control or a breach of these terms.

# 3. Verification and payout setup

Before accepting offers or receiving a payout, we may require identity, age, tax and payout verification. You must submit documents that belong to you and are genuine, current and readable. We may use service providers to verify documents and process payments. Verification is not a guarantee that an offer will be routed to you or that every payout will be released.

# 4. Offers and acceptance

A supervisor may route a private project offer to you based on the disciplines, capacity and information associated with your account. An offer should state the relevant scope, deadline, workspace, review path and doer payout. You can decline it. When you accept it, you agree to deliver the stated scope by the stated deadline, to raise ambiguity early and to follow the supervisor's reasonable project instructions.

An accepted project is not permission to expand the scope without written approval. You must not transfer, subcontract or share an offer with another person unless Dolancer gives written permission.

# 5. Work, review and approval

You must do the work yourself, use lawful and properly licensed materials, keep confidential information secure and use the company workspace or other channel specified by your supervisor. Your work may be reviewed for completeness, quality, safety, originality and compliance with the brief. If changes are requested within the accepted scope, you must reasonably revise and resubmit them. Work outside scope must be discussed before it is performed.

A supervisor review does not remove the client approval gate. Payout is released only after the applicable approval, timeout or exception process has cleared. The earnings record may show gross payout, withholding and net payout as separate figures.

# 6. Payment and taxes

The doer payout is the amount shown in the accepted offer before any withholding required by law or payment processing rules. Payment timing depends on verification, the approval state, payment provider processing and applicable compliance checks. Dolancer does not promise a fixed payment time unless the final offer or a written policy says so.

You are responsible for your own tax filings and statutory obligations except for amounts Dolancer is required to withhold or report. You must provide information needed for lawful withholding and reporting. We may pause a payment if the payout account is unverified, a fraud or sanctions check is unresolved, or the law requires a hold.

# 7. Prohibited work and conduct

You must not use Dolancer for coursework, essays, dissertations, exams, graded assignments, impersonation, plagiarism, fabrication of research or data, fake reviews, deception, regulated professional advice without required authorisation, unauthorised access or cyber activity, infringement, harassment, discrimination, unlawful financial activity, malware, child sexual abuse material or any other illegal or harmful request.

You must not bypass the supervisor, reveal confidential client information, identify another participant, manipulate reviews or payout records, submit another person's work, or use automation to misrepresent authorship or activity. Report a suspicious or prohibited brief to support instead of completing it.

# 8. Intellectual property and licence

Unless the accepted offer or a separate written agreement says otherwise, you retain ownership of your pre-existing materials and tools. On release of the applicable payout, you grant or assign only the rights in the final deliverables that are stated in the accepted offer and legally capable of being transferred. You must not include third-party material unless you have the right to use and transfer it for the intended purpose.

# 9. Confidentiality and identity protection

You must keep project information, workspace links, client material and other non-public information confidential. Dolancer uses role-based access and supervisor routing to reduce unnecessary identity exposure, but no online service can promise absolute security. Do not place government identity documents, payment secrets or unnecessary personal data in project chat.

# 10. Availability, changes and termination

The service may change, pause or become unavailable for maintenance, safety, legal or operational reasons. We may update these terms by publishing a new version and recording its effective date. If an account closes, accepted work already completed and validly payable remains subject to the relevant review, verification, withholding and payment process. Confidentiality, intellectual property, payment, dispute and data provisions that should continue will survive closure.

# 11. Complaints and disputes

Contact support first with the account email, project identifier and a clear description of the issue. Complaints about privacy or personal data can be sent to ${CONTACT.email}. Grievances can be sent to ${CONTACT.grievanceEmail}. The final production version must identify the applicable grievance officer, escalation process, governing law and dispute forum after legal review.

# 12. Contact

Dolancer is operated by ${CONTACT.company}, ${CONTACT.jurisdiction}. General support: ${CONTACT.email}. Grievances: ${CONTACT.grievanceEmail}.`,
  },
  privacy: {
    kind: "privacy",
    version: "local-draft-2026-09-16",
    title: "Privacy Policy",
    effectiveAt: "2026-09-16T00:00:00.000Z",
    content: `# Important notice

This local-preview privacy policy is the product implementation baseline for review. It must be checked by qualified counsel and the final data-protection contact must be confirmed before production launch.

# 1. Who is responsible

Dolancer is operated by ${CONTACT.company}, ${CONTACT.jurisdiction}. For privacy questions, contact ${CONTACT.email}. For grievances, contact ${CONTACT.grievanceEmail}. The final production notice must add the confirmed legal address and any legally required officer details.

# 2. Information we collect

We collect account information such as email address, sign-in records, role and security events. During onboarding we may collect name, country, date of birth or age confirmation, contact details and selected disciplines. During verification we may collect government identity information, identity documents, selfie or liveness information, tax information and payout details. We collect project, workspace, message, attachment, review, progress, support ticket, notification, earnings and payout records needed to operate the service.

We also receive technical information such as device and browser data, approximate location derived from network information, log events, error reports and cookie or similar technology data. We do not ask you to place identity documents or payment secrets in ordinary project messages.

# 3. Why we use information

We use information to create and secure accounts, confirm age and identity, route suitable offers, administer projects, provide supervisor support, review work, process payouts, calculate or report required withholding, prevent fraud and abuse, answer support requests, improve reliability, protect the rights and safety of users and comply with law.

Where required, the legal basis or notice for each processing activity will be shown in the final production version. We do not use identity documents to make public profiles or expose a doer's personal identity to a client through the normal workflow.

# 4. Sharing

We share information only as needed with service providers that host the platform, provide authentication, verify identity, store files, process payments, monitor security or support communications. We may disclose information to authorities, professional advisers or another party when required by law, a valid legal process, a safety emergency, a corporate transaction or the protection of rights. We do not sell identity documents or use them for advertising.

Clients receive only the project information needed to receive the service. The doer's name, personal contact details and verification documents are not disclosed to the client through the normal workflow.

# 5. Identity and payout retention

Identity and payout data are retained only for as long as needed for verification, fraud prevention, accounting, tax, dispute handling, legal claims and other documented purposes. Verification files should be stored in restricted encrypted storage with a documented deletion schedule. Where a hash or audit record is retained after deletion, it must not be used to recreate the original document. The final production version must state the exact retention periods or criteria for each category.

# 6. Security

We use access controls, least-privilege service credentials, encrypted transport, restricted storage, audit logging and operational safeguards appropriate to the data involved. No service is completely secure. If a security incident affects personal data, Dolancer will assess it and provide notices required by applicable law.

# 7. Cookies and similar technologies

The service may use essential session, security, preference and performance technologies. Non-essential analytics or marketing technologies must be disabled until the applicable consent and notice experience is implemented. Browser settings may restrict some technologies, but essential authentication and security functions may stop working.

# 8. Your choices and rights

Depending on applicable law, you may request access to, correction of, deletion of, restriction of or information about personal data, and may withdraw consent where consent is the basis. You may also ask about processing, complain to the appropriate authority or contact our grievance channel. We may need to verify your identity before completing a request and may retain information where required for law, security, accounting or dispute handling.

Send a request to ${CONTACT.email} and include the account email, the request you are making and any detail needed to locate the record. The final production version must confirm response timelines and the applicable authority or appeal route.

# 9. Children

Dolancer is for adults. We do not knowingly create doer accounts for anyone under 18. If you believe a minor has submitted information, contact us so we can investigate and delete or restrict it where required.

# 10. International processing

Service providers may process information in locations outside your country. The final production notice must identify the relevant transfer safeguards, contractual protections and any consent or regulatory requirements before international processing is enabled.

# 11. Changes and contact

We may update this policy when our processing changes or when law requires it. We will publish the new version and effective date. Dolancer is operated by ${CONTACT.company}, ${CONTACT.jurisdiction}. Privacy questions: ${CONTACT.email}. Grievances: ${CONTACT.grievanceEmail}.`,
  },
};

async function fetchLegalDocument(kind: LegalKind): Promise<LegalDocument | null> {
  if (isDemo()) return demoRespond(() => LOCAL_DOCUMENTS[kind]);

  const { data, error } = await supabase
    .from("current_legal_documents")
    .select(selectColumns("kind", "version", "title", "content", "effective_at"))
    .eq("kind", kind)
    .limit(1);
  if (error) throw new Error(error.message);

  const row = (data as unknown as {
    kind: LegalKind;
    version: string;
    title: string;
    content: string;
    effective_at: string | null;
  }[] | null)?.[0];

  return row
    ? {
        kind: row.kind,
        version: row.version,
        title: row.title,
        content: row.content,
        effectiveAt: row.effective_at,
      }
    : null;
}

function LegalBody({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter((block) => block.trim().length > 0);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const text = block.trim();
        const heading = /^#{1,3}\s+/.test(text);
        if (heading) {
          return (
            <h2 key={index} className="pt-4 text-xl font-extrabold tracking-[-0.03em] first:pt-0">
              {text.replace(/^#{1,3}\s+/, "")}
            </h2>
          );
        }
        return <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed text-ink-2">{text}</p>;
      })}
    </div>
  );
}

export function LegalPage() {
  const { kind } = useParams<{ kind: string }>();
  const resolved: LegalKind = kind === "privacy" ? "privacy" : "terms";
  const document = useQuery({ queryKey: ["legal", resolved], queryFn: () => fetchLegalDocument(resolved) });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 lg:px-6 lg:py-20">
      <nav className="mb-8 flex gap-2" aria-label="Legal documents">
        {(["terms", "privacy"] as const).map((option) => (
          <Link key={option} to={`/legal/${option}`} className={cn("rounded-full border border-line-card px-4 py-2 text-sm font-extrabold transition-all duration-[120ms]", option === resolved ? "bg-accent shadow-soft-sm" : "bg-surface hover:shadow-soft-sm")}>
            {option === "terms" ? "Terms of service" : "Privacy policy"}
          </Link>
        ))}
      </nav>

      {document.isLoading ? (
        <div className="space-y-4"><LoadingAnnounce label="Loading the document" /><Skeleton className="h-10 w-2/3" /><Skeleton className="h-4 w-40" /><Skeleton className="h-64 w-full" /></div>
      ) : document.isError ? (
        <ErrorState description="This document did not load." onRetry={() => void document.refetch()} />
      ) : !document.data ? (
        <EmptyState title="Not published yet" description="This document is not available in the current environment. Contact us and we will send the current version." />
      ) : (
        <article>
          <header className="border-b border-line-card pb-6">
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">{document.data.title}</h1>
            <p className="mt-3 text-sm text-ink-muted">Version {document.data.version}{document.data.effectiveAt ? `, effective ${formatDate(document.data.effectiveAt)}` : ""}</p>
          </header>
          <div className="mt-8"><LegalBody content={document.data.content} /></div>
          <footer className="mt-12 border-t border-line-subtle pt-6 text-xs leading-relaxed text-ink-muted">
            <p>Dolancer is operated by {CONTACT.company}, {CONTACT.jurisdiction}. Questions about this document can go to <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-2 hover:text-ink">{CONTACT.email}</a>.</p>
          </footer>
        </article>
      )}
    </div>
  );
}
