import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { selectColumns } from "@/lib/select";
import { formatDate } from "@/lib/datetime";
import { cn } from "@/lib/cn";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { CONTACT } from "./content";

type LegalKind = "terms" | "privacy";

interface LegalDocument {
  kind: string;
  version: string;
  title: string;
  content: string;
  effectiveAt: string | null;
}

/**
 * Legal documents come from the database, not from this codebase.
 *
 * They are versioned server side and consent is recorded against a specific
 * version, so hardcoding the text in the frontend would let the page drift from what
 * people actually agreed to. If a document is missing, we say so plainly rather than
 * rendering a stale copy.
 */
async function fetchLegalDocument(kind: LegalKind): Promise<LegalDocument | null> {
  const { data, error } = await supabase
    .from("current_legal_documents")
    .select(selectColumns("kind", "version", "title", "content", "effective_at"))
    .eq("kind", kind)
    .limit(1);
  if (error) throw new Error(error.message);

  const row = (data as unknown as {
    kind: string;
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

/**
 * A deliberately small renderer: headings and paragraphs only.
 *
 * Legal text is stored as plain text with blank-line paragraph breaks. Running it
 * through a full markdown parser, or anything that emits raw HTML, would be a
 * needless injection surface on a document nobody should be able to inject into.
 */
function LegalBody({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter((block) => block.trim().length > 0);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const text = block.trim();
        const heading = /^#{1,3}\s+/.test(text);
        if (heading) {
          return (
            <h2
              key={index}
              className="pt-4 text-xl font-extrabold tracking-[-0.03em] first:pt-0"
            >
              {text.replace(/^#{1,3}\s+/, "")}
            </h2>
          );
        }
        return (
          <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
            {text}
          </p>
        );
      })}
    </div>
  );
}

export function LegalPage() {
  const { kind } = useParams<{ kind: string }>();
  const resolved: LegalKind = kind === "privacy" ? "privacy" : "terms";

  const document = useQuery({
    queryKey: ["legal", resolved],
    queryFn: () => fetchLegalDocument(resolved),
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 lg:px-6 lg:py-20">
      <nav className="mb-8 flex gap-2" aria-label="Legal documents">
        {(["terms", "privacy"] as const).map((option) => (
          <Link
            key={option}
            to={`/legal/${option}`}
            className={cn(
              "rounded-full border-[1.5px] border-ink px-4 py-2 text-sm font-extrabold transition-all duration-[120ms]",
              option === resolved
                ? "bg-lime shadow-offset-xs"
                : "bg-surface hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-xs",
            )}
          >
            {option === "terms" ? "Terms of service" : "Privacy policy"}
          </Link>
        ))}
      </nav>

      {document.isLoading ? (
        <div className="space-y-4">
          <LoadingAnnounce label="Loading the document" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : document.isError ? (
        <ErrorState
          description="This document did not load."
          onRetry={() => void document.refetch()}
        />
      ) : !document.data ? (
        <EmptyState
          title="Not published yet"
          description="This document has not been published. Contact us and we will send you the current version."
        />
      ) : (
        <article>
          <header className="border-b-2 border-ink pb-6">
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
              {document.data.title}
            </h1>
            <p className="mt-3 text-sm text-ink-muted">
              Version {document.data.version}
              {document.data.effectiveAt
                ? `, effective ${formatDate(document.data.effectiveAt)}`
                : ""}
            </p>
          </header>

          <div className="mt-8">
            <LegalBody content={document.data.content} />
          </div>

          <footer className="mt-12 border-t border-line-subtle pt-6 text-xs leading-relaxed text-ink-muted">
            <p>
              Dolancer is operated by {CONTACT.company}, {CONTACT.jurisdiction}. Questions
              about this document can go to{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="underline underline-offset-2 hover:text-ink"
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </footer>
        </article>
      )}
    </div>
  );
}
