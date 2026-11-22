import type {
  ProgressMetrics,
  ProgressRange,
  RatioMetric,
} from "@/lib/progress-utils";
import AppIcon, { type AppIconName } from "@/app/components/AppIcon";

type MetricCardsProps = {
  metrics: ProgressMetrics;
  range: ProgressRange;
};

function formatPercent(value: number | null, digits = 1) {
  return value === null ? "—" : value.toFixed(digits) + "%";
}

function MetricCard({
  title,
  icon,
  iconColor,
  children,
}: {
  title: string;
  icon: AppIconName;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex min-h-[112px] flex-col justify-between rounded-2xl border border-white/[0.025] bg-[#1a1b22] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#b9cbbd]">
          {title}
        </h2>
        <AppIcon name={icon} className={`h-[18px] w-[18px] ${iconColor}`} />
      </div>
      {children}
    </article>
  );
}

function RateValue({
  metric,
  note,
  color = "text-[#00f59b]",
}: {
  metric: RatioMetric;
  note: string;
  color?: string;
}) {
  return (
    <div>
      <div className={"font-mono text-[27px] font-semibold leading-none " + color}>
        {formatPercent(metric.percentage)}
      </div>
      <p className="mt-2 font-mono text-[9px] leading-4 text-[#b9cbbd]">
        {note}
      </p>
    </div>
  );
}

export default function MetricCards({ metrics, range }: MetricCardsProps) {
  const periodTitle =
    range === "7d"
      ? "7-DAY RATE"
      : range === "30d"
        ? "30-DAY RATE"
        : "ALL-TIME RATE";
  const bestShare =
    metrics.personalBest > 0
      ? Math.round((metrics.currentStreak / metrics.personalBest) * 100) + "% OF PB"
      : null;

  return (
    <section className="grid grid-cols-2 gap-3" aria-label="Performance metrics">
      <MetricCard
        title="Current Streak"
        icon="fire"
        iconColor="text-[#ffce95]"
      >
        <div>
          <div className="flex items-baseline gap-1.5 font-mono text-[26px] font-semibold leading-none text-[#e3e1ec]">
            <AppIcon name="fire" className="h-6 w-6 text-[#ffce95]" />
            <span>{metrics.currentStreak}</span>
            <span className="text-[10px] font-bold uppercase text-[#b9cbbd]">
              {metrics.currentStreak === 1 ? "day" : "days"}
            </span>
          </div>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-[#b9cbbd]">
            PB: {metrics.personalBest} {metrics.personalBest === 1 ? "day" : "days"}
            {bestShare && (
              <span className="ml-1.5 text-[#00f59b]">({bestShare})</span>
            )}
          </p>
        </div>
      </MetricCard>

      <MetricCard
        title={periodTitle}
        icon="trending"
        iconColor="text-[#00f59b]"
      >
        <RateValue
          metric={metrics.selectedRate}
          note={
            metrics.selectedDayCount === 0
              ? "No recorded days"
              : metrics.selectedDayCount +
                " logged days · missing days excluded"
          }
        />
      </MetricCard>

      <MetricCard
        title="30-Day Index"
        icon="sliders"
        iconColor="text-[#bdf4ff]"
      >
        <div>
          <RateValue
            metric={metrics.thirtyDayRate}
            note={
              metrics.thirtyDayRate.percentage === null
                ? "No recorded days"
                : metrics.thirtyDayRate.percentage >= 85
                  ? "Above 85% target"
                  : "Below 85% target"
            }
            color="text-[#e3e1ec]"
          />
          <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-[#77847a]">
            Target: <span className="text-[#bdf4ff]">85.0%</span>
          </p>
        </div>
      </MetricCard>

      <MetricCard
        title="Verified POW"
        icon="verified"
        iconColor="text-[#00f59b]"
      >
        <div>
          <div className="font-mono text-[27px] font-semibold leading-none text-[#e3e1ec]">
            {metrics.verifiedPowCount}
          </div>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-[#b9cbbd]">
            Actual photo logs · selected range
          </p>
        </div>
      </MetricCard>
    </section>
  );
}
