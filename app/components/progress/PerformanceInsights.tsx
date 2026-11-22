"use client";

import { useState } from "react";
import type { ProgressMetrics, ProgressRange } from "@/lib/progress-utils";
import AppIcon from "@/app/components/AppIcon";

const rangeLabels: Record<ProgressRange, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  all: "all time",
};

function buildInsight(metrics: ProgressMetrics, range: ProgressRange) {
  if (metrics.selectedDayCount < 3) {
    return metrics.selectedDayCount === 0
      ? "There are no recorded days in this range yet. Add a few daily logs to establish a useful baseline."
      : "This is an early read from " +
          metrics.selectedDayCount +
          " logged " +
          (metrics.selectedDayCount === 1 ? "day" : "days") +
          ". Keep recording daily work to build a clearer baseline.";
  }

  const lowestSubject = [...metrics.subjects]
    .filter((subject) => subject.percentage !== null)
    .sort((left, right) => (left.percentage ?? 0) - (right.percentage ?? 0))[0];

  if (lowestSubject && (lowestSubject.percentage ?? 100) < 70) {
    return (
      lowestSubject.label +
      " has the lowest completion rate at " +
      Math.round(lowestSubject.percentage ?? 0) +
      "% for " +
      rangeLabels[range] +
      ". Give its checkpoints a focused review."
    );
  }

  const doubts = metrics.pillars.find((pillar) => pillar.key === "doubt");
  if (doubts && doubts.percentage !== null && doubts.percentage < 70) {
    return (
      "Previous-day doubts are at " +
      Math.round(doubts.percentage ?? 0) +
      "% for " +
      rangeLabels[range] +
      ". Give unresolved questions a dedicated follow-up."
    );
  }

  const revision = metrics.pillars.find((pillar) => pillar.key === "revision");
  if (revision && revision.percentage !== null && revision.percentage >= 90) {
    return (
      "Revision consistency is strong at " +
      Math.round(revision.percentage ?? 0) +
      "% for " +
      rangeLabels[range] +
      ". Keep that routine steady."
    );
  }

  const attendance = metrics.pillars.find((pillar) => pillar.key === "class");
  if (attendance && attendance.percentage !== null && attendance.percentage >= 90) {
    return (
      "Class attendance is consistent at " +
      Math.round(attendance.percentage ?? 0) +
      "% across the selected range."
    );
  }

  if ((metrics.selectedRate.percentage ?? 0) >= 85) {
    return (
      "Overall checkpoint completion is " +
      Math.round(metrics.selectedRate.percentage ?? 0) +
      "% across " +
      metrics.selectedDayCount +
      " logged days. Your execution is meeting the 85% benchmark."
    );
  }

  return (
    "Checkpoint completion is " +
    Math.round(metrics.selectedRate.percentage ?? 0) +
    "% across " +
    metrics.selectedDayCount +
    " logged days. Keep the next set of daily checkpoints consistent."
  );
}

export default function PerformanceInsights({
  metrics,
  range,
}: {
  metrics: ProgressMetrics;
  range: ProgressRange;
}) {
  const [acknowledged, setAcknowledged] = useState(false);
  const insight = buildInsight(metrics, range);

  if (acknowledged) {
    return (
      <div className="rounded-xl bg-[#1a1b22] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-[#77847a]">
        Tactical brief acknowledged
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.025] bg-[#1a1b22] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
      <div className="mb-2 flex items-center gap-1.5 text-[#00f59b]">
        <AppIcon name="terminal" className="h-[15px] w-[15px]" />
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
          Tactical Brief // Performance Insights
        </h2>
      </div>
      <p className="text-[13px] leading-[1.65] text-[#d4ddd5]">{insight}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="font-mono text-[8px] uppercase tracking-wider text-[#77847a]">
          Deterministic summary · {rangeLabels[range]}
        </span>
        <button
          type="button"
          onClick={() => setAcknowledged(true)}
          className="shrink-0 rounded-md bg-[#292931] px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-widest text-[#00f59b] transition-colors hover:bg-[#34343c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00f59b]"
        >
          Acknowledge
        </button>
      </div>
    </section>
  );
}
