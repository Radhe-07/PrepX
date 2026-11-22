"use client";

import { useMemo, useState } from "react";
import HistoryCard from "./HistoryCard";
import { getCheckpointCount } from "./types";
import type { HistoryLog } from "./types";
import AppIcon, { type AppIconName } from "@/app/components/AppIcon";

type Filter = "all" | "locked" | "incomplete";

type HistoryDashboardProps = {
  logs: HistoryLog[];
  todayDate: string;
  loadError: string | null;
};

const filterOptions: { value: Filter; label: string }[] = [
  { value: "all", label: "All Records" },
  { value: "locked", label: "100% Locked" },
  { value: "incomplete", label: "Incomplete" },
];

function dateFromKey(key: string) {
  return new Date(`${key}T00:00:00.000Z`);
}

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function shiftDate(key: string, dayCount: number) {
  const date = dateFromKey(key);
  date.setUTCDate(date.getUTCDate() + dayCount);
  return dateKey(date);
}

function calendarWeek(anchor: string) {
  const start = dateFromKey(anchor);
  const mondayOffset = (start.getUTCDay() + 6) % 7;
  start.setUTCDate(start.getUTCDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + index);
    return dateKey(day);
  });
}

function moveMonth(monthKey: string, amount: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1 + amount, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(monthKey: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateFromKey(`${monthKey}-01`));
}

function formatDayLabel(key: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", { ...options, timeZone: "UTC" }).format(dateFromKey(key));
}

export default function HistoryDashboard({
  logs,
  todayDate,
  loadError,
}: HistoryDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(todayDate.slice(0, 7));
  const [weekAnchorOverride, setWeekAnchorOverride] = useState<string | null>(null);

  const sortedLogs = useMemo(
    () => [...logs].sort((left, right) => right.date.localeCompare(left.date)),
    [logs],
  );
  const logsByDate = useMemo(() => new Set(logs.map((log) => log.date)), [logs]);
  const weekAnchor = selectedDate ?? weekAnchorOverride ?? (selectedMonth === todayDate.slice(0, 7) ? todayDate : `${selectedMonth}-01`);
  const weekDays = useMemo(() => calendarWeek(weekAnchor), [weekAnchor]);
  const weekLogCount = weekDays.filter((day) => logsByDate.has(day)).length;

  const monthLogs = useMemo(
    () => logs.filter((log) => log.date.startsWith(`${selectedMonth}-`)),
    [logs, selectedMonth],
  );
  const completedThisMonth = monthLogs.reduce((total, log) => total + getCheckpointCount(log), 0);
  const disciplineRate = monthLogs.length
    ? Math.round((completedThisMonth / (monthLogs.length * 10)) * 100)
    : 0;

  const dateFilteredLogs = selectedDate
    ? sortedLogs.filter((log) => log.date === selectedDate)
    : sortedLogs;
  const filteredLogs = dateFilteredLogs.filter((log) => {
    const completed = getCheckpointCount(log);
    if (activeFilter === "locked") return completed === 10;
    if (activeFilter === "incomplete") return completed < 10;
    return true;
  });

  const filterCounts = {
    all: dateFilteredLogs.length,
    locked: dateFilteredLogs.filter((log) => getCheckpointCount(log) === 10).length,
    incomplete: dateFilteredLogs.filter((log) => getCheckpointCount(log) < 10).length,
  };

  function chooseDate(day: string) {
    setSelectedDate(day);
    setSelectedMonth(day.slice(0, 7));
    setWeekAnchorOverride(day);
  }

  function chooseMonth(month: string) {
    setSelectedMonth(month);
    setSelectedDate(null);
    setWeekAnchorOverride(`${month}-01`);
  }

  function navigateWeek(offset: number) {
    setSelectedDate(null);
    setWeekAnchorOverride(shiftDate(weekAnchor, offset));
  }

  return (
    <>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#00f59b]">PREPX // HISTORY</p>
          <h1 className="text-[20px] font-bold tracking-tight">LOG ARCHIVES</h1>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.11em] text-[#b9cbbd]">
            PREVIOUS DAILY RECORDS // AUDIT TRAIL
          </p>
        </div>
        <span className="mb-0.5 shrink-0 rounded bg-[#292931] px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-[#b9cbbd]">
          SYS.VER // 0.1.0
        </span>
      </div>

      {loadError && (
        <div role="alert" className="mb-4 rounded-xl border border-[#f08b86]/20 bg-[#f08b86]/[0.06] p-3 text-xs text-[#f3aaa5]">
          {loadError}
        </div>
      )}

      <section aria-label="History filters" className="mb-4 print:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filterOptions.map((option) => {
            const active = activeFilter === option.value;

            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 font-mono text-[10px] font-semibold tracking-wide transition-colors ${
                  active
                    ? "border-[#00f59b] bg-[#00f59b] text-[#092c20]"
                    : "border-white/[0.06] bg-[#292931] text-[#b9cbbd] hover:border-[#00f59b]/40 hover:text-[#e3e1ec]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#092c20]" : "bg-[#00f59b]"}`} />
                {option.label}
                <span className={`text-[9px] ${active ? "text-[#092c20]/75" : "text-[#78847d]"}`}>
                  {filterCounts[option.value]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-4 rounded-2xl border border-white/[0.04] bg-[#1a1b22] p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.14)] print:hidden">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-[#b9cbbd]">
            CALENDAR STRIP // 7 DAY WINDOW
          </h2>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigateWeek(-7)}
              aria-label="Previous week"
              className="flex h-6 w-6 items-center justify-center rounded bg-[#292931] font-mono text-sm text-[#00f59b]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => navigateWeek(7)}
              aria-label="Next week"
              className="flex h-6 w-6 items-center justify-center rounded bg-[#292931] font-mono text-sm text-[#00f59b]"
            >
              ›
            </button>
            <span className="ml-1 font-mono text-[8px] font-bold uppercase tracking-wider text-[#00f59b]">
              {weekLogCount}/7 LOGGED
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin] [scrollbar-color:#34353d_transparent]">
          {weekDays.map((day) => {
            const hasLog = logsByDate.has(day);
            const isSelected = selectedDate === day;
            const isToday = day === todayDate;

            return (
              <button
                type="button"
                key={day}
                onClick={() => chooseDate(day)}
                aria-pressed={isSelected}
                aria-label={`${formatDayLabel(day, { weekday: "long", month: "long", day: "numeric" })}${hasLog ? ", has a daily log" : ", no daily log"}${isToday ? ", today" : ""}`}
                className={`relative flex min-w-[47px] flex-1 flex-col items-center rounded-lg border px-1 py-2 transition-colors ${
                  isSelected
                    ? "border-[#00f59b] bg-[#00f59b]/[0.12]"
                    : isToday
                      ? "border-[#00f59b]/40 bg-[#292931]"
                      : "border-transparent bg-[#14151c]"
                } ${!hasLog ? "opacity-45" : ""}`}
              >
                <span className="font-mono text-[8px] uppercase text-[#b9cbbd]">
                  {formatDayLabel(day, { weekday: "short" })}
                </span>
                <span className="mt-0.5 text-sm font-bold">{Number(day.slice(-2))}</span>
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${hasLog ? "bg-[#00f59b]" : "bg-[#484951]"}`} />
                {isToday && (
                  <span className="absolute -top-1.5 rounded bg-[#00f59b] px-1 py-0.5 font-mono text-[7px] font-bold uppercase text-[#092c20]">
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[8px] uppercase tracking-wider text-[#77847a]">
          <span>
            {selectedDate ? `FILTERED TO ${formatDayLabel(selectedDate, { day: "numeric", month: "short", year: "numeric" })}` : "SELECT A DAY TO FILTER RECORDS"}
          </span>
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="shrink-0 font-bold text-[#00f59b] hover:text-[#72ffc7]"
            >
              CLEAR DATE ×
            </button>
          )}
        </div>
      </section>

      <section aria-label="Monthly summary" className="mb-6 rounded-2xl border border-white/[0.04] bg-[#1a1b22] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.14)] print:mb-4 print:border print:border-gray-300 print:bg-white print:shadow-none">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#b9cbbd] print:text-gray-600">MONTHLY SUMMARY</p>
          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => chooseMonth(moveMonth(selectedMonth, -1))}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-[#292931] font-mono text-sm text-[#00f59b] hover:bg-[#33343d]"
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="min-w-[112px] text-center font-mono text-[9px] font-bold uppercase tracking-wider text-[#e3e1ec]">
              {formatMonth(selectedMonth)}
            </span>
            <button
              type="button"
              onClick={() => chooseMonth(moveMonth(selectedMonth, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-[#292931] font-mono text-sm text-[#00f59b] hover:bg-[#33343d]"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <span className="hidden font-mono text-xs font-bold uppercase print:inline">{formatMonth(selectedMonth)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SummaryMetric label="MONTHLY LOGS" value={String(monthLogs.length)} detail="RECORDED DAYS" icon="calendar" />
          <SummaryMetric label="DISCIPLINE RATE" value={`${disciplineRate}%`} detail="CHECKPOINTS COMPLETE" icon="chart" />
        </div>
      </section>

      <section aria-label="Audit log stream">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.15em]">AUDIT LOG STREAM</h2>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.13em] text-[#b9cbbd]">TAP TO INSPECT PROOF</p>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#00f59b] print:hidden">
            {filteredLogs.length} {filteredLogs.length === 1 ? "RECORD" : "RECORDS"}
          </span>
        </div>

        <div className="space-y-3 print:hidden">
          {filteredLogs.map((log) => <HistoryCard key={log.id} log={log} />)}
        </div>

        {!loadError && filteredLogs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#1a1b22] px-5 py-8 text-center print:hidden">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#b9cbbd]">
              {logs.length === 0 ? "NO DAILY RECORDS YET" : selectedDate ? "NO RECORD FOR THIS DATE" : "NO MATCHING RECORDS"}
            </p>
            <p className="mt-2 text-xs text-[#77847a]">
              {logs.length === 0
                ? "Completed daily logs will appear here."
                : "Try another date or history filter."}
            </p>
          </div>
        )}

        {loadError && filteredLogs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#1a1b22] px-5 py-8 text-center font-mono text-[10px] uppercase tracking-widest text-[#b9cbbd] print:hidden">
            Records are unavailable.
          </div>
        )}
      </section>

      <section className="mt-6 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          disabled={logs.length === 0}
          className="flex w-full items-center justify-between rounded-xl border border-white/[0.04] bg-[#1a1b22] px-4 py-3 text-left transition-colors hover:border-[#00f59b]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#292931] text-lg text-[#b9cbbd]">⇩</span>
            <span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-wider">EXPORT FULL AUDIT PDF</span>
              <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-wider text-[#b9cbbd]">
                {logs.length} RECORDS // PRINT OR SAVE AS PDF
              </span>
            </span>
          </span>
          <span className="rounded-md bg-[#292931] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-[#e3e1ec]">GENERATE</span>
        </button>
      </section>

      <section className="hidden print:block">
        <header className="mb-5 border-b border-gray-300 pb-3">
          <p className="font-mono text-xs font-bold uppercase tracking-widest">PREPX // FULL DAILY AUDIT</p>
          <h2 className="mt-1 text-xl font-bold">All historical records</h2>
          <p className="mt-1 text-xs text-gray-600">{logs.length} records · Exported from PREPX</p>
        </header>
        <div className="space-y-3">
          {sortedLogs.map((log) => <HistoryCard key={`print-${log.id}`} log={log} printMode />)}
        </div>
        {sortedLogs.length === 0 && <p className="text-sm text-gray-600">No daily records are available.</p>}
      </section>
    </>
  );
}

function SummaryMetric({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: AppIconName }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#14151c] p-2.5 print:bg-gray-100">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#292931] text-[#00d8e5] print:bg-white print:text-black">
        <AppIcon name={icon} className="h-[17px] w-[17px] print:text-black" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-[8px] uppercase tracking-[0.08em] text-[#b9cbbd] print:text-gray-600">{label}</p>
        <p className="mt-0.5 text-base font-bold leading-none">{value}</p>
        <p className="mt-1 truncate font-mono text-[7px] uppercase tracking-[0.08em] text-[#77847a] print:text-gray-600">{detail}</p>
      </div>
    </div>
  );
}
