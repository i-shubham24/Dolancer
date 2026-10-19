import { useId, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, ChevronDown, PencilRuler, Plus, Search, X } from "lucide-react";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { Button } from "@/components/ui/button";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { Panel, PanelHeader } from "@/components/app/ui";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { toUserError } from "@/lib/user-error";
import { useSkillExtrasStore, type CustomSkill } from "@/stores/useSkillExtrasStore";
import { fetchSkills, addSkill, removeSkill, type SkillOption } from "./api";
import { SKILL_AREAS, areaLook } from "./catalog";

/** One row in the search list: a listed skill, or a suggestion to add as the doer's own. */
interface Match {
  key: string;
  name: string;
  category: string;
  skill?: SkillOption;
}

/**
 * Type to find any skill. A listed one is added straight away; anything else can be
 * added as the doer's own skill, after picking which area it belongs to.
 */
function SkillSearch({
  skills,
  ownNames,
  areas,
  onPick,
  onOwn,
}: {
  skills: SkillOption[];
  ownNames: Set<string>;
  areas: string[];
  onPick: (skill: SkillOption) => void;
  onOwn: (name: string, category: string) => void;
}) {
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [ownName, setOwnName] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const listed = new Set(skills.map((skill) => skill.name.toLowerCase()));

  const matches: Match[] = q
    ? [
        ...skills
          .filter((skill) => !skill.selected && skill.name.toLowerCase().includes(q))
          .map((skill) => ({ key: skill.id, name: skill.name, category: skill.category, skill })),
        // Names from the built-in list that this catalogue does not have yet.
        ...SKILL_AREAS.flatMap((area) =>
          area.skills
            .filter((name) => !listed.has(name.toLowerCase()) && !ownNames.has(name.toLowerCase()) && name.toLowerCase().includes(q))
            .map((name) => ({ key: `list-${name}`, name, category: area.name })),
        ),
      ]
        .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)))
        .slice(0, 7)
    : [];
  const exact = listed.has(q) || ownNames.has(q) || matches.some((match) => match.name.toLowerCase() === q);
  const offerOwn = q.length >= 2 && !exact;
  const total = matches.length + (offerOwn ? 1 : 0);

  function reset() {
    setQuery("");
    setActive(0);
    setOwnName(null);
  }

  function choose(index: number) {
    const match = matches[index];
    if (match) {
      if (match.skill) onPick(match.skill);
      else onOwn(match.name, match.category);
      reset();
      return;
    }
    if (offerOwn) setOwnName(query.trim());
  }

  const showList = open && (total > 0 || ownName !== null);

  return (
    <div className="relative">
      <div className="flex h-14 items-center gap-3 rounded-2xl bg-panel/70 px-4 ring-1 ring-transparent transition-shadow focus-within:bg-white focus-within:ring-primary/40">
        <Search className="h-5 w-5 shrink-0 text-ink-3" aria-hidden="true" />
        <input
          ref={input}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && ownName === null && total > 0 ? `${listId}-${active}` : undefined}
          aria-label="Search skills or add your own"
          value={query}
          placeholder="Search skills or type your own"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOwnName(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((index) => (total === 0 ? 0 : (index + 1) % total));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((index) => (total === 0 ? 0 : (index - 1 + total) % total));
            } else if (event.key === "Enter") {
              event.preventDefault();
              if (total > 0) choose(active);
            } else if (event.key === "Escape") {
              setOpen(false);
              setOwnName(null);
            }
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-ink-3"
        />
        {query ? (
          <button
            type="button"
            onClick={reset}
            aria-label="Clear search"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-white hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {showList ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.35)] ring-1 ring-ink/[0.06]"
            onMouseDown={(event) => event.preventDefault()}
          >
            {ownName !== null ? (
              <div className="p-2.5">
                <p className="text-[13px] font-bold text-ink-2">
                  Which area is <span className="text-ink">{ownName}</span> in?
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {areas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => {
                        onOwn(ownName, area);
                        reset();
                        input.current?.focus();
                      }}
                      className="rounded-full bg-panel px-3.5 py-2 text-[12.5px] font-bold text-ink-2 transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ul id={listId} role="listbox" aria-label="Matching skills">
                {matches.map((match, index) => (
                  <li
                    key={match.key}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(index)}
                    className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5", index === active ? "bg-info-bg" : "hover:bg-panel")}
                  >
                    <Plus className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-bold">{match.name}</span>
                    <span className="shrink-0 text-xs font-semibold text-ink-muted">{match.category}</span>
                  </li>
                ))}
                {offerOwn ? (
                  <li
                    id={`${listId}-${matches.length}`}
                    role="option"
                    aria-selected={active === matches.length}
                    onMouseEnter={() => setActive(matches.length)}
                    onClick={() => choose(matches.length)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                      active === matches.length ? "bg-info-bg" : "hover:bg-panel",
                    )}
                  >
                    <Plus className="h-4 w-4 shrink-0 text-success-ink" aria-hidden="true" />
                    <span className="min-w-0 flex-1 text-[14px] font-bold">Add &ldquo;{query.trim()}&rdquo; as my own skill</span>
                  </li>
                ) : null}
              </ul>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** A chip for one of the doer's skills, with a cross to take it off. */
function MySkill({ name, own, onRemove }: { name: string; own?: boolean; onRemove: () => void }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.18 }}
      className={cn("flex items-center gap-1.5 rounded-full py-1.5 pl-3.5 pr-1.5", own ? "bg-success-bg text-success-ink" : "bg-info-bg text-primary")}
    >
      <span className="text-[13px] font-bold">{name}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </motion.li>
  );
}

/** Add a skill of the doer's own straight into the open area. */
function AddOwnInline({ area, onAdd }: { area: string; onAdd: (name: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="flex items-center gap-2 rounded-full bg-panel/70 p-1 pl-4 ring-1 ring-transparent focus-within:bg-white focus-within:ring-primary/40"
      onSubmit={(event) => {
        event.preventDefault();
        if (value.trim().length < 2) return;
        onAdd(value);
        setValue("");
      }}
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={60}
        placeholder="Not listed? Add your own"
        aria-label={`Add your own skill in ${area}`}
        className="h-9 min-w-0 flex-1 bg-transparent text-[13px] font-semibold outline-none placeholder:font-medium placeholder:text-ink-3"
      />
      <button
        type="submit"
        disabled={value.trim().length < 2}
        className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-primary px-4 text-xs font-extrabold text-white transition-colors hover:bg-primary-hover disabled:bg-ink/15"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add
      </button>
    </form>
  );
}

/**
 * Skills, kept simple: search to add one, see the ones you have, or browse a few
 * broad areas and tap to pick. Anything missing can be added as your own, under the
 * area it belongs to.
 *
 * Skills are not decoration: doer_pool joins doer_skills to the project category,
 * so an area with no listed skill picked means that work never reaches the doer.
 */
export function SkillsPage() {
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const skills = useQuery({ queryKey: qk.skills.catalogue(), queryFn: fetchSkills });
  const custom = useSkillExtrasStore((state) => state.custom);
  const addCustom = useSkillExtrasStore((state) => state.addCustom);
  const removeCustom = useSkillExtrasStore((state) => state.removeCustom);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = useMutation({
    mutationFn: ({ id, selected }: { id: string; selected: boolean }) => (selected ? removeSkill(id) : addSkill(id)),
    onMutate: async ({ id, selected }) => {
      await queryClient.cancelQueries({ queryKey: qk.skills.catalogue() });
      const previous = queryClient.getQueryData<SkillOption[]>(qk.skills.catalogue());
      queryClient.setQueryData<SkillOption[]>(qk.skills.catalogue(), (list) =>
        list?.map((skill) => (skill.id === id ? { ...skill, selected: !selected } : skill)),
      );
      return { previous };
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(qk.skills.catalogue(), context.previous);
      toast.error(toUserError(error, "Could not update skills. Try again."));
    },
    onSettled: () => {
      // Picking a skill changes what the board can show and can complete the
      // readiness gate, so both have to be refetched, not just this list.
      void queryClient.invalidateQueries({ queryKey: qk.skills.all() });
      void queryClient.invalidateQueries({ queryKey: qk.pool.all() });
      void queryClient.invalidateQueries({ queryKey: qk.gate() });
    },
  });

  const list = useMemo(() => skills.data ?? [], [skills.data]);
  const mine = list.filter((skill) => skill.selected);
  const ownNames = useMemo(() => new Set(custom.map((skill) => skill.name.toLowerCase())), [custom]);

  // The broad areas, in the list's order, plus any the server has that the list does not.
  const areas = useMemo(() => {
    const names = SKILL_AREAS.map((area) => area.name);
    for (const skill of list) if (!names.includes(skill.category)) names.push(skill.category);
    return names;
  }, [list]);

  const flip = (skill: SkillOption) => toggle.mutate({ id: skill.id, selected: skill.selected });
  const addOwn = (name: string, category: string) => {
    // A name already on the list is picked from the list instead, so it counts for offers.
    const listed = list.find((skill) => skill.name.toLowerCase() === name.trim().toLowerCase());
    if (listed) {
      if (!listed.selected) flip(listed);
      return;
    }
    addCustom(name, category);
    toast.success(`Added ${name.trim()} to ${category}.`);
  };

  function openUp(area: string) {
    setOpenArea((current) => (current === area ? null : area));
    window.setTimeout(() => panelRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" }), 80);
  }

  const total = mine.length + custom.length;
  const inOpen = openArea ? list.filter((skill) => skill.category === openArea) : [];
  const ownInOpen: CustomSkill[] = openArea ? custom.filter((skill) => skill.category === openArea) : [];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Skills" sub="Pick what you are good at. Offers match these." />

      {skills.isLoading ? (
        <div className="space-y-4">
          <LoadingAnnounce label="Loading skills" />
          <Skeleton className="h-48 w-full rounded-[20px]" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-28 rounded-[20px]" />
            ))}
          </div>
        </div>
      ) : skills.isError ? (
        <EmptyPanel
          tone="danger"
          icon={<AlertTriangle />}
          title="Skills did not load"
          action={
            <Button variant="outline" onClick={() => void skills.refetch()}>
              Try again
            </Button>
          }
        />
      ) : list.length === 0 ? (
        <EmptyPanel icon={<PencilRuler />} title="No skills to choose from yet" body="Once areas are published they show up here." />
      ) : (
        <CardGrid>
          <Panel className="z-20 gap-4" aria-labelledby="mine">
            <PanelHeader
              id="mine"
              title="Your skills"
              className="mb-0"
              right={<span className="rounded-full bg-info-bg px-3 py-1 text-xs font-extrabold tabular-nums text-primary">{total}</span>}
            />
            <SkillSearch skills={list} ownNames={ownNames} areas={areas} onPick={flip} onOwn={addOwn} />
            {mine.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl bg-warning-bg px-4 py-3 text-warning-ink">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="text-[13px] font-bold">Pick at least one skill from the list so offers can reach you.</p>
              </div>
            ) : null}
            {total > 0 ? (
              <ul className="flex flex-wrap gap-2" aria-label="Your skills">
                <AnimatePresence initial={false}>
                  {mine.map((skill) => (
                    <MySkill key={skill.id} name={skill.name} onRemove={() => flip(skill)} />
                  ))}
                  {custom.map((skill) => (
                    <MySkill key={skill.id} own name={skill.name} onRemove={() => removeCustom(skill.id)} />
                  ))}
                </AnimatePresence>
              </ul>
            ) : (
              <p className="text-[13px] font-medium text-ink-muted">Nothing yet. Search above or pick an area below.</p>
            )}
            {custom.length > 0 ? (
              <p className="flex items-center gap-2 text-[11.5px] font-semibold text-ink-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-success-dot" aria-hidden="true" />
                Green ones are skills you added yourself
              </p>
            ) : null}
          </Panel>

          <motion.section variants={cardMotion} aria-labelledby="areas" className="min-w-0">
            <h2 id="areas" className="mb-3 text-[17px] font-extrabold tracking-[-0.02em]">
              Browse by area
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {areas.map((area) => {
                const look = areaLook(area);
                const inArea = list.filter((skill) => skill.category === area);
                const picked =
                  inArea.filter((skill) => skill.selected).length + custom.filter((skill) => skill.category === area).length;
                const on = openArea === area;
                return (
                  <button
                    key={area}
                    type="button"
                    aria-expanded={on}
                    onClick={() => openUp(area)}
                    className={cn(
                      CARD,
                      "group items-start gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      on && "ring-2 ring-primary",
                    )}
                  >
                    <span className="flex w-full items-start justify-between gap-2">
                      <span
                        className={cn("flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105", look.tone)}
                        aria-hidden="true"
                      >
                        <look.icon className="h-5 w-5" />
                      </span>
                      {picked > 0 ? (
                        <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-extrabold text-white">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          {picked}
                        </span>
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-extrabold leading-snug tracking-[-0.01em]">{area}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-ink-muted">
                        {inArea.length} skills
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", on && "rotate-180")} aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div ref={panelRef} className="scroll-mt-6">
              <AnimatePresence mode="wait" initial={false}>
                {openArea ? (
                  <motion.div
                    key={openArea}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(CARD, "mt-3 gap-4")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[15px] font-extrabold tracking-[-0.02em]">{openArea}</h3>
                      <button
                        type="button"
                        onClick={() => setOpenArea(null)}
                        aria-label="Close this area"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-panel hover:text-ink"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inOpen.map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          aria-pressed={skill.selected}
                          onClick={() => flip(skill)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                            skill.selected ? "bg-primary text-white" : "bg-panel text-ink-2 hover:bg-hover hover:text-ink",
                          )}
                        >
                          {skill.selected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                          {skill.name}
                        </button>
                      ))}
                      {ownInOpen.map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          aria-pressed="true"
                          onClick={() => removeCustom(skill.id)}
                          title="Your own skill. Tap to remove."
                          className="inline-flex items-center gap-1.5 rounded-full bg-success-dot px-3.5 py-2 text-[13px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          {skill.name}
                        </button>
                      ))}
                    </div>
                    <AddOwnInline area={openArea} onAdd={(name) => addOwn(name, openArea)} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.section>
        </CardGrid>
      )}
    </div>
  );
}
