import {
  formatDateKey,
  type WeekMetrics,
} from "@/lib/progress-utils";
import AppIcon from "@/app/components/AppIcon";

function barColor(completed: number | null, isFuture: boolean) {
  if (isFuture) return "bg-[#292931]";
  if (completed === null) return "bg-[#34343c]";
  if (completed >= 8) return "bg-[#00f59b]";
  if (completed >= 5) return "bg-[#bdf4ff]";
  return "bg-[#ffce95]";
}

export default function WeeklyHeatmap({
  metrics,
}: {
  metrics: WeekMetrics;
}) {
  const average =
    metrics.average === null ? "—" : metrics.average.toFixed(1) + "/10";

  return (
    <section className="rounded-2xl border border-white/[0.025] bg-[#1a1b22] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <AppIcon name="chart" className="h-[17px] w-[17px] text-[#bdf4ff]" />
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#e3e1ec]">
            Weekly Execution Heatmap
          </h2>
        </div>
        <span className="shrink-0 font-mono text-[8px] font-bold uppercase tracking-wider text-[#00f59b]">
          AVG {average}
        </span>
      </div>

      <div className="mt-4 grid h-[116px] grid-cols-7 items-end gap-1.5">
        {metrics.days.map((day) => {
          const height =
            day.completed === null
              ? day.isFuture
                ? "0%"
                : "4%"
              : Math.max(day.completed * 10, 4) + "%";
          const dayText =
            day.completed === null
              ? day.isFuture
                ? "Future"
                : "No record"
              : day.completed + " of 10 checkpoints";

          return (
            <div
              key={day.date}
              className="flex h-full min-w-0 flex-col items-center justify-end gap-1.5"
              aria-label={
                formatDateKey(day.date, { weekday: "long" }) + ": " + dayText
              }
              title={
                formatDateKey(day.date, { weekday: "long" }) + ": " + dayText
              }
            >
              <span className="font-mono text-[8px] text-[#b9cbbd]">
                {day.completed === null ? "—" : day.completed}
              </span>
              <div className="flex h-[76px] w-full items-end overflow-hidden rounded-t-md bg-[#14151c]">
                <div
                  className={
                    "w-full rounded-t-md transition-[height] duration-700 ease-out " +
                    barColor(day.completed, day.isFuture)
                  }
                  style={{ height }}
                />
              </div>
              <span
                className={
                  "font-mono text-[8px] font-bold " +
                  (day.completed !== null
                    ? "text-[#00f59b]"
                    : "text-[#77847a]")
                }
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 font-mono text-[8px] uppercase tracking-wider text-[#77847a]">
        Average per logged day · {metrics.loggedDayCount}/7 days recorded
      </p>
    </section>
  );
}
