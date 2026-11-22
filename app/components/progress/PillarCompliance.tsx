import type { PillarMetric, ProgressMetrics } from "@/lib/progress-utils";

const pillarColors = {
  revision: {
    text: "text-[#00f59b]",
    bar: "bg-[#00f59b]",
  },
  class: {
    text: "text-[#00f59b]",
    bar: "bg-[#00f59b]",
  },
  homework: {
    text: "text-[#bdf4ff]",
    bar: "bg-[#bdf4ff]",
  },
  doubt: {
    text: "text-[#ffb4ab]",
    bar: "bg-[#ffb4ab]",
  },
} as const;

function getDescription(pillar: PillarMetric, loggedDays: number) {
  if (loggedDays < 3) {
    return loggedDays === 0 ? "No records yet" : "Early signal";
  }
  if (pillar.percentage === null) return "No records yet";
  if (pillar.percentage >= 90) return "Consistent";
  if (pillar.percentage >= 75) return "On track";
  if (pillar.percentage >= 50) return "In progress";
  return "Needs focus";
}

function PillarCard({
  pillar,
  loggedDays,
}: {
  pillar: PillarMetric;
  loggedDays: number;
}) {
  const colors = pillarColors[pillar.key];
  const percent =
    pillar.percentage === null ? "—" : Math.round(pillar.percentage) + "%";

  return (
    <article className="flex min-h-[78px] flex-col justify-between rounded-xl border border-white/[0.02] bg-[#1a1b22] p-2.5">
      <div className="flex items-start justify-between gap-1.5">
        <h3 className="font-mono text-[9px] font-semibold leading-4 text-[#e3e1ec]">
          {pillar.label}
        </h3>
        <span className={"shrink-0 font-mono text-[10px] font-bold " + colors.text}>
          {percent}
        </span>
      </div>
      <p className="truncate font-mono text-[8px] uppercase tracking-wider text-[#b9cbbd]">
        {getDescription(pillar, loggedDays)}
      </p>
      <div
        className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#34343c]"
        role="progressbar"
        aria-label={pillar.label + " compliance"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pillar.percentage ?? 0}
      >
        <div
          className={"h-full rounded-full transition-[width] duration-700 ease-out " + colors.bar}
          style={{ width: (pillar.percentage ?? 0) + "%" }}
        />
      </div>
    </article>
  );
}

export default function PillarCompliance({
  metrics,
}: {
  metrics: ProgressMetrics;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#e3e1ec]">
          Core Pillars Compliance
        </h2>
        <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-[#b9cbbd]">
          Daily discipline
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.pillars.map((pillar) => (
          <PillarCard
            key={pillar.key}
            pillar={pillar}
            loggedDays={metrics.selectedDayCount}
          />
        ))}
      </div>
      <p className="mt-2 px-1 font-mono text-[8px] uppercase tracking-wider text-[#77847a]">
        {metrics.selectedDayCount} logged{" "}
        {metrics.selectedDayCount === 1 ? "day" : "days"} in selected range
      </p>
    </section>
  );
}
