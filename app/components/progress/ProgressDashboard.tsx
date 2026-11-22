"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateProgressMetrics,
  calculateWeekMetrics,
  getLogsInRange,
  getProofsForLogs,
  toDateKey,
  type ProgressLog,
  type ProgressRange,
} from "@/lib/progress-utils";
import MetricCards from "./MetricCards";
import SubjectMastery from "./SubjectMastery";
import WeeklyHeatmap from "./WeeklyHeatmap";
import PillarCompliance from "./PillarCompliance";
import ProofOfWorkStream from "./ProofOfWorkStream";
import PerformanceInsights from "./PerformanceInsights";
import AppIcon from "@/app/components/AppIcon";

type ProgressDashboardProps = {
  todayDate: string;
};

type ApiLog = Omit<ProgressLog, "date"> & { date: string | Date };

function normalizeLog(value: unknown): ProgressLog {
  if (!value || typeof value !== "object") {
    throw new Error("The progress response contained an invalid log.");
  }

  const log = value as Record<string, unknown>;
  if (
    typeof log.id !== "string" ||
    typeof log.date !== "string" ||
    !Array.isArray(log.proofOfWork)
  ) {
    throw new Error("The progress response was incomplete.");
  }

  const proofOfWork = log.proofOfWork.map((value) => {
    if (!value || typeof value !== "object") {
      throw new Error("The progress response contained an invalid POW record.");
    }

    const proof = value as Record<string, unknown>;
    if (
      typeof proof.id !== "string" ||
      typeof proof.url !== "string" ||
      typeof proof.sortOrder !== "number"
    ) {
      throw new Error("The progress response contained an invalid POW record.");
    }

    return {
      id: proof.id,
      url: proof.url,
      sortOrder: proof.sortOrder,
    };
  });

  const booleanFields = [
    "classAttended",
    "mathRevision",
    "mathHomework",
    "mathDoubt",
    "physicsRevision",
    "physicsHomework",
    "physicsDoubt",
    "chemistryRevision",
    "chemistryHomework",
    "chemistryDoubt",
  ] as const;

  for (const field of booleanFields) {
    if (typeof log[field] !== "boolean") {
      throw new Error("The progress response was missing checkpoint data.");
    }
  }

  const apiLog = log as unknown as ApiLog;
  return {
    id: apiLog.id,
    date: toDateKey(apiLog.date),
    classAttended: apiLog.classAttended,
    mathRevision: apiLog.mathRevision,
    mathHomework: apiLog.mathHomework,
    mathDoubt: apiLog.mathDoubt,
    physicsRevision: apiLog.physicsRevision,
    physicsHomework: apiLog.physicsHomework,
    physicsDoubt: apiLog.physicsDoubt,
    chemistryRevision: apiLog.chemistryRevision,
    chemistryHomework: apiLog.chemistryHomework,
    chemistryDoubt: apiLog.chemistryDoubt,
    proofOfWork,
  };
}

const rangeOptions: Array<{ value: ProgressRange; label: string }> = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "all", label: "All Time" },
];

export default function ProgressDashboard({
  todayDate,
}: ProgressDashboardProps) {
  const [range, setRange] = useState<ProgressRange>("7d");
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProgress() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/logs/history", {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          logs?: unknown;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Progress records could not be loaded.");
        }

        if (!Array.isArray(payload.logs)) {
          throw new Error("Progress records could not be read.");
        }

        setLogs(payload.logs.map(normalizeLog));
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Progress records could not be loaded. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadProgress();
    return () => controller.abort();
  }, [retryKey]);

  const selectedLogs = useMemo(
    () => getLogsInRange(logs, todayDate, range),
    [logs, todayDate, range]
  );
  const metrics = useMemo(
    () => calculateProgressMetrics(logs, todayDate, range),
    [logs, todayDate, range]
  );
  const weekMetrics = useMemo(
    () => calculateWeekMetrics(logs, todayDate),
    [logs, todayDate]
  );
  const proofs = useMemo(() => getProofsForLogs(selectedLogs), [selectedLogs]);

  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[23px] font-bold leading-tight tracking-[-0.03em] text-[#e3e1ec]">
              PERFORMANCE INTEL
            </h1>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b9cbbd]">
              Discipline &amp; execution metrics
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-[#292931] px-2.5 py-1.5 text-[#00f59b]">
              <AppIcon name="query" className="h-3.5 w-3.5" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
                Live telemetry
              </span>
            </div>
            <span className="font-mono text-[7px] uppercase tracking-wider text-[#77847a]">
              Latest database records
            </span>
          </div>
        </div>

        <div
          className="flex rounded-lg bg-[#0d0e15] p-1"
          role="group"
          aria-label="Progress time range"
        >
          {rangeOptions.map((option) => {
            const selected = option.value === range;

            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setRange(option.value)}
                aria-pressed={selected}
                className={
                  "min-h-9 flex-1 rounded-md px-1 text-center font-mono text-[10px] font-bold tracking-[0.07em] transition-colors " +
                  (selected
                    ? "bg-[#292931] text-[#00f59b]"
                    : "text-[#b9cbbd] hover:text-[#e3e1ec]")
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div
          className="flex min-h-40 items-center justify-center rounded-2xl border border-white/[0.03] bg-[#1a1b22]"
          role="status"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#b9cbbd]">
            Loading latest records…
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[#ffb4ab]/20 bg-[#1a1b22] p-5 text-center">
          <p className="font-mono text-xs text-[#ffb4ab]">{error}</p>
          <button
            type="button"
            onClick={() => setRetryKey((current) => current + 1)}
            className="mt-3 rounded-md bg-[#292931] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#00f59b]"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {logs.length === 0 && (
            <div className="rounded-xl border border-[#00f59b]/10 bg-[#1a1b22] px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#b9cbbd]">
                No daily logs yet. Submit a log on Today to build your progress history.
              </p>
            </div>
          )}

          <MetricCards metrics={metrics} range={range} />
          <SubjectMastery metrics={metrics} />
          <WeeklyHeatmap metrics={weekMetrics} />
          <PillarCompliance metrics={metrics} />
          <ProofOfWorkStream proofs={proofs} totalCount={metrics.verifiedPowCount} />
          <PerformanceInsights metrics={metrics} range={range} />
        </>
      )}
    </div>
  );
}
