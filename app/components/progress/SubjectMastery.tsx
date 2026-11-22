import type { ProgressMetrics, SubjectMetric } from "@/lib/progress-utils";
import AppIcon from "@/app/components/AppIcon";

const subjectStyles = {
  math: {
    dot: "bg-[#00f59b]",
    text: "text-[#00f59b]",
    bar: "bg-[#00f59b]",
  },
  physics: {
    dot: "bg-[#ffce95]",
    text: "text-[#ffce95]",
    bar: "bg-[#ffce95]",
  },
  chemistry: {
    dot: "bg-[#bdf4ff]",
    text: "text-[#bdf4ff]",
    bar: "bg-[#bdf4ff]",
  },
} as const;

function formatPercent(value: number | null) {
  return value === null ? "—" : Math.round(value) + "%";
}

function SubjectRow({ subject }: { subject: SubjectMetric }) {
  const style = subjectStyles[subject.key];

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#e3e1ec]">
          <span className={"h-1.5 w-1.5 shrink-0 rounded-full " + style.dot} />
          <span className="truncate">{subject.label}</span>
        </span>
        <span className={"shrink-0 font-mono text-[10px] font-bold " + style.text}>
          {formatPercent(subject.percentage)}
          <span className="ml-1.5 font-normal text-[#b9cbbd]">
            ({subject.completed}/{subject.applicable})
          </span>
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-[#34343c]"
        role="progressbar"
        aria-label={subject.label + " task completion"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={subject.percentage ?? 0}
      >
        <div
          className={"h-full rounded-full transition-[width] duration-700 ease-out " + style.bar}
          style={{ width: (subject.percentage ?? 0) + "%" }}
        />
      </div>
    </div>
  );
}

export default function SubjectMastery({
  metrics,
}: {
  metrics: ProgressMetrics;
}) {
  const total =
    metrics.subjectTotal.applicable > 0
      ? metrics.subjectTotal.completed +
        " / " +
        metrics.subjectTotal.applicable +
        " TASKS"
      : "NO TASK DATA";

  return (
    <section className="rounded-2xl border border-white/[0.025] bg-[#1a1b22] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <AppIcon name="chart" className="h-[17px] w-[17px] text-[#00f59b]" />
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#e3e1ec]">
            Subject Mastery Ratio
          </h2>
        </div>
        <span className="shrink-0 font-mono text-[8px] font-bold tracking-wider text-[#b9cbbd]">
          {total}
        </span>
      </div>

      <div className="space-y-4">
        {metrics.subjects.map((subject) => (
          <SubjectRow key={subject.key} subject={subject} />
        ))}
      </div>
      <p className="mt-3 font-mono text-[8px] uppercase tracking-wider text-[#77847a]">
        3 subject checkpoints per recorded day · selected range
      </p>
    </section>
  );
}
