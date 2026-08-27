"use client";

import { useMemo, useState } from "react";
import { useRemindersList } from "@/features/reminders/useRemindersList";
import type {
  RemindersTargetTypeFilter,
  RemindersTimingFilter,
} from "@/features/reminders/remindersApiTypes";
import { ReminderFeedCard } from "@/widgets/Reminders/ReminderFeedCard";

type TimingTab = RemindersTimingFilter;
type TargetFilter = "ALL" | RemindersTargetTypeFilter;

const PAGE_LIMIT = 20;

const TIMING_TABS: { value: TimingTab; label: string }[] = [
  { value: "PAST_OR_SENT", label: "მოსული" },
  { value: "FUTURE_PENDING", label: "მოლოდინი" },
  { value: "ALL", label: "ყველა" },
];

const TARGET_TABS: { value: TargetFilter; label: string }[] = [
  { value: "ALL", label: "ყველა" },
  { value: "PROPERTY", label: "განცხადებები" },
  { value: "CLIENT", label: "კლიენტები" },
];

function emptyMessageForTiming(timing: TimingTab): string {
  if (timing === "PAST_OR_SENT") {
    return "მოსული შეხსენებები არ არის";
  }
  if (timing === "FUTURE_PENDING") {
    return "მომლოდინე შეხსენებები არ არის";
  }
  return "შეხსენებები ჯერ არ არის.";
}

function sectionTitle(timing: TimingTab): string {
  if (timing === "PAST_OR_SENT") return "მოსული შეხსენებები";
  if (timing === "FUTURE_PENDING") return "მოლოდინი";
  return "ყველა შეხსენება";
}

export function RemindersView() {
  const [timing, setTiming] = useState<TimingTab>("PAST_OR_SENT");
  const [targetFilter, setTargetFilter] = useState<TargetFilter>("ALL");
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({
      timing,
      targetType: targetFilter === "ALL" ? undefined : targetFilter,
      page,
      limit: PAGE_LIMIT,
    }),
    [timing, targetFilter, page],
  );

  const { reminders, total, isLoading, error, refetch } = useRemindersList({
    enabled: true,
    query,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">შეხსენებები</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          მოსული და მომლოდინე შეხსენებები განცხადებებსა და კლიენტებზე. დაარქივებული ჩანაწერებიც
          აქ ჩანს.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div
          className="inline-flex rounded-full border border-border bg-muted/90 p-0.5 shadow-sm"
          role="tablist"
          aria-label="შეხსენების დრო"
        >
          {TIMING_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={timing === tab.value}
              onClick={() => {
                setTiming(tab.value);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                timing === tab.value
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="inline-flex rounded-full border border-border bg-muted/90 p-0.5 shadow-sm"
          role="tablist"
          aria-label="შეხსენების ტიპი"
        >
          {TARGET_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={targetFilter === tab.value}
              onClick={() => {
                setTargetFilter(tab.value);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                targetFilter === tab.value
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">{sectionTitle(timing)}</h2>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">შეხსენებები იტვირთება…</p>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && reminders.length === 0 ? (
          <p className="rounded-2xl bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-border">
            {emptyMessageForTiming(timing)}
          </p>
        ) : null}

        {!isLoading && !error && reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <ReminderFeedCard
                key={reminder.id}
                reminder={reminder}
                onChanged={() => void refetch()}
              />
            ))}
          </div>
        ) : null}
      </section>

      {!isLoading && !error && total > 0 ? (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            გვერდი {page} / {totalPages} • სულ {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              წინა
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((previousPage) => Math.min(totalPages, previousPage + 1))}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              შემდეგი
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
