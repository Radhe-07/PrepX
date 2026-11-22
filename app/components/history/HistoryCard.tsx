"use client";

import Image from "next/image";
import { useState } from "react";
import ProofGallery from "./ProofGallery";
import { getCheckpointCount, getCompletionPercent } from "./types";
import type { HistoryLog } from "./types";
import { optimizedCloudinaryUrl } from "@/lib/image-url";

type HistoryCardProps = {
  log: HistoryLog;
  printMode?: boolean;
};

const subjectTasks = [
  {
    subject: "Mathematics",
    short: "MATH",
    fields: [
      ["Revision", "mathRevision", "mathRevisionNote"],
      ["Homework", "mathHomework", "mathHomeworkNote"],
      ["Previous-day doubt", "mathDoubt", "mathDoubtNote"],
    ],
  },
  {
    subject: "Physics",
    short: "PHYSICS",
    fields: [
      ["Revision", "physicsRevision", "physicsRevisionNote"],
      ["Homework", "physicsHomework", "physicsHomeworkNote"],
      ["Previous-day doubt", "physicsDoubt", "physicsDoubtNote"],
    ],
  },
  {
    subject: "Chemistry",
    short: "CHEM",
    fields: [
      ["Revision", "chemistryRevision", "chemistryRevisionNote"],
      ["Homework", "chemistryHomework", "chemistryHomeworkNote"],
      ["Previous-day doubt", "chemistryDoubt", "chemistryDoubtNote"],
    ],
  },
] as const;

function formatLogDate(dateKey: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${dateKey}T00:00:00.000Z`))
    .toUpperCase();
}

function subjectCount(log: HistoryLog, subject: "math" | "physics" | "chemistry") {
  const values = [
    log[`${subject}Revision`],
    log[`${subject}Homework`],
    log[`${subject}Doubt`],
  ];
  return values.filter(Boolean).length;
}

export default function HistoryCard({ log, printMode = false }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(printMode);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const completed = getCheckpointCount(log);
  const percent = getCompletionPercent(log);
  const status =
    completed === 10
      ? "PERFECT DAY"
      : completed === 0
        ? "NO CHECKPOINTS COMPLETED"
        : "PARTIAL";
  const statusColor =
    completed === 10
      ? "text-[#00f59b] bg-[#00f59b]/10"
      : completed === 0
        ? "text-[#f08b86] bg-[#f08b86]/10"
        : "text-[#ffc36c] bg-[#ffc36c]/10";
  const visibleProofs = log.proofOfWork.slice(0, 3);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.04] bg-[#1a1b22] shadow-[0_12px_30px_rgba(0,0,0,0.16)] print:break-inside-avoid print:border print:border-gray-300 print:bg-white print:text-black print:shadow-none">
      <div className="p-4 sm:p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[17px] font-bold tracking-tight sm:text-lg">
                {formatLogDate(log.date)}
              </h3>
              <span
                className={`rounded-full px-2 py-1 font-mono text-[8px] font-bold tracking-[0.12em] ${statusColor} print:bg-transparent print:text-black`}
              >
                {status}
              </span>
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b9cbbd] print:text-gray-600">
              TARGET: 10 CHECKPOINTS // DAILY AUDIT
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-[#292931] px-2.5 py-1.5 font-mono text-[10px] font-bold text-[#00f59b] print:bg-transparent print:text-black">
            {percent}%
          </div>
        </header>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#14151c] px-3 py-3 font-mono text-[10px] uppercase tracking-[0.08em] print:bg-gray-100">
          <span className="text-[#e3e1ec] print:text-black">
            <span className="mr-1.5 text-[#00f59b]">✓</span>
            {completed} / 10 <span className="text-[#b9cbbd] print:text-gray-600">COMPLETED</span>
          </span>
          <span className="text-[#b9cbbd] print:text-gray-700">
            <span className="mr-1.5 text-[#00d8e5]">▣</span>
            {log.proofOfWork.length} POW PROOFS
          </span>
          <span className="font-bold text-[#00f59b] print:text-black">{percent}%</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <SubjectPill label="Class" value={log.classAttended ? "Complete" : "Incomplete"} done={log.classAttended} />
          <SubjectPill label="Maths" value={`${subjectCount(log, "math")}/3`} done={subjectCount(log, "math") === 3} />
          <SubjectPill label="Physics" value={`${subjectCount(log, "physics")}/3`} done={subjectCount(log, "physics") === 3} />
          <SubjectPill label="Chemistry" value={`${subjectCount(log, "chemistry")}/3`} done={subjectCount(log, "chemistry") === 3} />
        </div>

        {log.proofOfWork.length > 0 && !printMode && (
          <div className="mt-4">
            <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[#b9cbbd] print:text-gray-600">
              PROOF OF WORK FEED ({log.proofOfWork.length} CAPTURES)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {visibleProofs.map((proof, index) => (
                <button
                  type="button"
                  key={proof.id}
                  onClick={() => !printMode && setGalleryIndex(index)}
                  className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg bg-[#292931] text-left"
                  aria-label={`Open proof image ${index + 1}`}
                >
                  <Image
                    src={optimizedCloudinaryUrl(proof.url, 480)}
                    alt={`Proof of work ${index + 1} for ${formatLogDate(log.date)}`}
                    width={320}
                    height={240}
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </button>
              ))}
              {!printMode && log.proofOfWork.length > 3 && (
                <button
                  type="button"
                  onClick={() => setGalleryIndex(3)}
                  className="flex aspect-[4/3] items-center justify-center rounded-lg border border-white/[0.06] bg-[#292931] font-mono text-[11px] font-bold tracking-wider text-[#00f59b] hover:bg-[#33343d]"
                >
                  +{log.proofOfWork.length - 3} MORE
                </button>
              )}
            </div>
          </div>
        )}

        {!printMode && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-3">
            <button
              type="button"
              onClick={() => {
                setExpanded(true);
                if (log.proofOfWork.length > 0) setGalleryIndex(0);
              }}
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#00f59b] hover:text-[#72ffc7]"
            >
              Inspect log →
            </button>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#b9cbbd] hover:text-[#e3e1ec]"
            >
              {expanded ? "Hide audit details ↑" : "Audit details ↓"}
            </button>
          </div>
        )}

        {expanded && (
          <section className="mt-4 border-t border-white/[0.05] pt-4 print:border-gray-300">
            <div className="rounded-lg bg-[#14151c] p-3 print:bg-gray-100">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest">Class attendance</h4>
                <TaskStatus done={log.classAttended} />
              </div>
            </div>

            <div className="mt-3 grid gap-3">
              {subjectTasks.map((group) => (
                <div key={group.short} className="rounded-lg border border-white/[0.04] bg-[#14151c] p-3 print:border-gray-300 print:bg-gray-50">
                  <h4 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#00f59b] print:text-black">
                    {group.subject}
                  </h4>
                  <div className="space-y-2">
                    {group.fields.map(([label, doneField, noteField]) => {
                      const done = log[doneField];
                      const note = log[noteField];

                      return (
                        <div key={doneField} className="flex items-start justify-between gap-3 border-t border-white/[0.04] pt-2 first:border-0 first:pt-0 print:border-gray-200">
                          <div>
                            <p className="text-xs font-medium">{label}</p>
                            <p className="mt-0.5 text-[11px] text-[#b9cbbd] print:text-gray-600">
                              {note?.trim() || "No note recorded."}
                            </p>
                          </div>
                          <TaskStatus done={done} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {log.proofOfWork.length > 0 && (
              <div className="mt-3 rounded-lg border border-white/[0.04] bg-[#14151c] p-3 print:border-gray-300 print:bg-gray-50">
                <h4 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest">All proof images</h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {log.proofOfWork.map((proof, index) => (
                    <button
                      type="button"
                      key={proof.id}
                      onClick={() => !printMode && setGalleryIndex(index)}
                      className="overflow-hidden rounded-lg bg-[#292931] print:cursor-default"
                      tabIndex={printMode ? -1 : 0}
                      aria-label={printMode ? undefined : `Open proof image ${index + 1}`}
                    >
                      <Image
                        src={optimizedCloudinaryUrl(proof.url, 720)}
                        alt={`Proof of work ${index + 1} for ${formatLogDate(log.date)}`}
                        width={480}
                        height={360}
                        unoptimized
                        className="aspect-[4/3] h-auto w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {galleryIndex !== null && !printMode && (
        <ProofGallery
          images={log.proofOfWork}
          initialIndex={galleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </article>
  );
}

function SubjectPill({ label, value, done }: { label: string; value: string; done: boolean }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-1 rounded-md bg-[#292931] px-2 py-1.5 font-mono text-[9px]">
      <span className="truncate text-[#e3e1ec]">{label}</span>
      <span className={done ? "shrink-0 text-[#00f59b]" : "shrink-0 text-[#ffc36c]"}>{value}</span>
    </div>
  );
}

function TaskStatus({ done }: { done: boolean }) {
  return (
    <span className={`shrink-0 font-mono text-[9px] font-bold uppercase tracking-wider ${done ? "text-[#00f59b] print:text-black" : "text-[#777b82] print:text-gray-500"}`}>
      {done ? "✓ COMPLETE" : "○ INCOMPLETE"}
    </span>
  );
}
