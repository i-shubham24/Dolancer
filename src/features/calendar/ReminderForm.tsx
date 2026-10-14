import { useEffect, useId, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "./DatePicker";
import { taskTitle } from "@/lib/task-title";
import { useReminders } from "@/stores/useReminderStore";
import type { DoerProject } from "@/types/domain";
import { addDays, formatDayRelative, formatTime, fromDateTimeInputs, toDateInput } from "./dates";

const MAX_TITLE = 120;

/** Every half hour of the day, as "HH:MM" values with readable labels. */
const TIMES = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? 0 : 30;
  const value = `${String(hours).padStart(2, "0")}:${minutes === 0 ? "00" : "30"}`;
  return { value, label: formatTime(new Date(2000, 0, 1, hours, minutes)) };
});

const triggerClass =
  "w-full min-h-[44px] rounded-xl border border-line-card bg-surface px-3.5 py-[11px] text-sm font-medium text-ink outline-none transition-all focus-visible:border-secondary focus-visible:ring-4 focus-visible:ring-secondary/15";

/**
 * Add a reminder. Saved in this browser only, which the form says plainly, because
 * a doer who adds one on a laptop will not find it on their phone.
 */
export function ReminderForm({
  projects,
  defaultDay,
  defaultProjectId,
  onSaved,
  autoFocus = false,
}: {
  projects: DoerProject[];
  defaultDay?: Date;
  defaultProjectId?: string | null;
  onSaved?: () => void;
  autoFocus?: boolean;
}) {
  const { add } = useReminders();
  const id = useId();
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(() => toDateInput(defaultDay ?? addDays(new Date(), 1)));
  const [time, setTime] = useState("10:00");
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [error, setError] = useState<string | null>(null);

  const defaultKey = defaultDay ? toDateInput(defaultDay) : null;
  useEffect(() => {
    if (defaultKey) setDay(defaultKey);
  }, [defaultKey]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = title.trim();
    if (!text) {
      setError("Write what you want to remember.");
      return;
    }
    const at = fromDateTimeInputs(day, time);
    if (!at) {
      setError("Pick a day and a time.");
      return;
    }
    if (at.getTime() < Date.now() - 60_000) {
      setError("That time has already passed. Pick a later one.");
      return;
    }
    add({ title: text.slice(0, MAX_TITLE), at: at.toISOString(), projectId: projectId || null });
    toast.success("Reminder saved", {
      description: `${formatDayRelative(at)}, ${formatTime(at)}. We will show it here when the time comes.`,
    });
    setTitle("");
    setError(null);
    onSaved?.();
  }

  return (
    <form onSubmit={submit} className="space-y-3.5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-title`} className="text-xs text-ink-2">
          What to remember
        </Label>
        <Input
          id={`${id}-title`}
          value={title}
          maxLength={MAX_TITLE}
          autoFocus={autoFocus}
          placeholder="For example: send the draft of post 6"
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-day`} className="text-xs text-ink-2">
            Day
          </Label>
          <DatePicker id={`${id}-day`} value={day} onChange={setDay} min={toDateInput(new Date())} className={triggerClass} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-time`} className="text-xs text-ink-2">
            Time
          </Label>
          <Select id={`${id}-time`} value={time} onChange={setTime} options={TIMES} portal={false} className={triggerClass} />
        </div>
      </div>
      {projects.length > 0 ? (
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-task`} className="text-xs text-ink-2">
            Link to a task (optional)
          </Label>
          <Select
            id={`${id}-task`}
            value={projectId}
            onChange={setProjectId}
            portal={false}
            options={[
              { value: "", label: "No task" },
              ...projects.map((project) => ({ value: project.id, label: taskTitle(project) })),
            ]}
            className={triggerClass}
          />
        </div>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-bold text-danger-ink">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full">
        Save reminder
      </Button>
      <p className="text-center text-2xs font-semibold text-ink-muted">
        Saved on this device only.
      </p>
    </form>
  );
}

/** The same form in a pop-up over a blurred page, opened from the dashboard. */
export function ReminderDialog({
  open,
  onOpenChange,
  projects,
  defaultProjectId = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: DoerProject[];
  defaultProjectId?: string | null;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/25 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              aria-describedby={undefined}
              // Escape inside an open list or day picker closes that, not the whole pop-up.
              onEscapeKeyDown={(event) => {
                const target = event.target as HTMLElement | null;
                if (target?.closest('[role="listbox"], [data-picker]')) event.preventDefault();
              }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="rounded-[22px] bg-white p-5 shadow-[0_24px_60px_-20px_rgba(11,31,58,0.45)] sm:p-6"
              >
            <div className="mb-4 flex items-start justify-between gap-4">
              <Dialog.Title className="text-xl font-extrabold tracking-[-0.03em]">New reminder</Dialog.Title>
              <Dialog.Close
                aria-label="Close"
                className="-mr-1 -mt-1 flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-subtle hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Dialog.Close>
            </div>
                <ReminderForm
                  key={defaultProjectId ?? "none"}
                  projects={projects}
                  defaultProjectId={defaultProjectId}
                  autoFocus
                  onSaved={() => onOpenChange(false)}
                />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
