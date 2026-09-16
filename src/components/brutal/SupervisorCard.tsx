import { ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SupervisorCard() {
  return (
    <div className="rounded-3xl border border-line-card bg-surface shadow-soft-md">
      <div className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-extrabold text-ink">Assigned Supervisor</h2>
          <p className="mt-0.5 text-xs font-medium text-ink-muted">
            Reviews deliveries and routes clarifications.
          </p>
        </div>
      </div>
      <div className="border-t border-line-subtle p-3">
        <Button variant="outline" className="w-full text-xs h-9 justify-center gap-2">
          <MessageCircle className="h-3.5 w-3.5" /> Message Supervisor
        </Button>
      </div>
    </div>
  );
}
