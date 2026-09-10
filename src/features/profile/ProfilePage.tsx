import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { demo, demoId, demoRespond, isDemo } from "@/lib/demo-data";
import { callRowRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { qk } from "@/lib/query-keys";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/brutal/Skeleton";
import { useProfile } from "@/features/dashboard/queries";
import { updateProfileBasics } from "@/features/auth/api";
import type { DoerApplicationRow, RatingSummaryRow } from "@/types/database";

/**
 * my_rating_summary returns the level the DATABASE computes, and we render exactly
 * that. rating_level() has two tiers (L1, and L2 at an average of 4.7 across at
 * least 15 ratings) and drives the claim head-start. It does not match the three
 * tiers described in the PRD, so no third tier is invented here; the discrepancy is
 * on the backend handoff list for someone to settle.
 */
async function fetchRating(): Promise<{ average: number | null; count: number; level: string }> {
  if (isDemo()) return demoRespond(() => demo.rating);

  const row = unwrap(await callRowRpc<RatingSummaryRow>("my_rating_summary"));
  const average = row?.avg_score == null ? null : Number(row.avg_score);
  return {
    average: average && Number.isFinite(average) ? average : null,
    count: Number(row?.rating_count ?? 0),
    level: row?.level ?? "L1",
  };
}

async function fetchApplication(): Promise<DoerApplicationRow | null> {
  if (isDemo()) return demoRespond(() => demo.application);

  const { data, error } = await supabase
    .from("doer_applications")
    .select(selectColumns("id", "bio", "status", "created_at"))
    .limit(1);
  if (error) throw new Error(error.message);
  return (data as unknown as DoerApplicationRow[] | null)?.[0] ?? null;
}

async function submitApplication(bio: string): Promise<void> {
  if (isDemo()) {
    return demoRespond(() => {
      demo.application = {
        id: demoId("application"),
        bio: bio.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      };
    });
  }

  const { data: userData } = await supabase.auth.getUser();
  const id = userData.user?.id;
  if (!id) throw new Error("Not signed in");
  const { error } = await supabase
    .from("doer_applications")
    .insert({ applicant_id: id, bio: bio.trim() });
  if (error) throw new Error(error.message);
}

const APPLICATION_COPY: Record<string, { tone: string; title: string; body: string }> = {
  pending: {
    tone: "bg-warning-bg text-warning-ink",
    title: "Application under review",
    body: "Someone is reading it. You keep full access to the app meanwhile, and we will let you know.",
  },
  approved: {
    tone: "bg-success-bg text-success-ink",
    title: "Application approved",
    body: "You are in. Finish the remaining setup steps to start claiming work.",
  },
  rejected: {
    tone: "bg-danger-bg text-danger-ink",
    title: "Not approved this time",
    body: "We could not take your application forward. Support can tell you more.",
  },
};

export function ProfilePage() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const profile = useProfile();

  const rating = useQuery({ queryKey: qk.rating(), queryFn: fetchRating });
  const application = useQuery({ queryKey: qk.application(), queryFn: fetchApplication });

  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");

  // Seed the form once the profile arrives, without clobbering an in-progress edit.
  useEffect(() => {
    if (!profile.data) return;
    setFullName(profile.data.full_name ?? "");
    setWhatsapp(profile.data.whatsapp ?? "");
  }, [profile.data]);

  const save = useMutation({
    mutationFn: () =>
      updateProfileBasics({ fullName: fullName.trim(), whatsapp: whatsapp.trim() || null }),
    onSuccess: () => {
      toast.success("Saved.");
      void queryClient.invalidateQueries({ queryKey: qk.profile() });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const apply = useMutation({
    mutationFn: () => submitApplication(bio),
    onSuccess: () => {
      toast.success("Application sent.");
      void queryClient.invalidateQueries({ queryKey: qk.application() });
      void queryClient.invalidateQueries({ queryKey: qk.gate() });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const applicationStatus = application.data?.status;
  const needsApplication = role !== "doer" && !application.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Profile</h1>
        <p className="mt-2 text-md text-ink-2">{user?.email}</p>
      </header>

      {needsApplication ? (
        <Card className="border-2 bg-lime-light">
          <h2 className="text-lg font-extrabold tracking-[-0.025em]">Apply to join</h2>
          <p className="mt-1 text-sm text-ink-2">
            Tell us what you do and where you are strongest. A couple of sentences is plenty.
          </p>
          <div className="mt-4 space-y-3">
            <Label htmlFor="bio" className="sr-only">
              About your work
            </Label>
            <Textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="I have been writing technical documentation for six years, mostly for developer tools..."
            />
            <Button
              className="w-full"
              disabled={bio.trim().length < 20 || apply.isPending}
              onClick={() => apply.mutate()}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {apply.isPending ? "Sending..." : "Send application"}
            </Button>
            {bio.trim().length < 20 ? (
              <p className="text-center text-xs text-ink-muted">
                A little more detail helps. Twenty characters minimum.
              </p>
            ) : null}
          </div>
        </Card>
      ) : applicationStatus && role !== "doer" ? (
        <Card className={`border-2 ${APPLICATION_COPY[applicationStatus]?.tone ?? ""}`}>
          <h2 className="text-lg font-extrabold tracking-[-0.025em]">
            {APPLICATION_COPY[applicationStatus]?.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed opacity-90">
            {APPLICATION_COPY[applicationStatus]?.body}
          </p>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-lg font-extrabold tracking-[-0.025em]">Standing</h2>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
              Rating
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-lime text-ink" aria-hidden="true" />
              <span className="text-2xl font-extrabold tracking-[-0.03em]">
                {rating.isLoading ? (
                  <Skeleton className="inline-block h-6 w-10 align-middle" />
                ) : rating.data?.average != null ? (
                  rating.data.average.toFixed(1)
                ) : (
                  "Not rated"
                )}
              </span>
            </div>
          </div>
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
              Ratings
            </div>
            <div className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">
              {rating.data?.count ?? 0}
            </div>
          </div>
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
              Level
            </div>
            <div className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">
              {rating.data?.level ?? "L1"}
            </div>
          </div>
        </div>
        <p className="mt-4 border-t border-line-subtle pt-3 text-[11px] leading-snug text-ink-muted">
          Your level decides how quickly new work reaches you. At the top level, matching work
          appears the moment it is posted.
        </p>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-lg font-extrabold tracking-[-0.025em]">Your details</h2>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp number</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            autoComplete="tel"
            placeholder="+91 00000 00000"
          />
          <p className="text-xs text-ink-muted">
            Used only to reach you about your work. It is not a sign-in method.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={profile.data?.country ?? ""} disabled readOnly />
          <p className="text-xs text-ink-muted">
            Set once at signup, because it drives your currency, tax and timezone. Contact
            support if it is wrong.
          </p>
        </div>

        <Button
          className="w-full"
          disabled={save.isPending || !fullName.trim()}
          onClick={() => save.mutate()}
        >
          {save.isPending ? "Saving..." : "Save changes"}
        </Button>
      </Card>
    </div>
  );
}
