"use client";

import { useState } from "react";
import TaskRow from "./TaskRow";

interface SubjectCardProps {
  subject: string;
  code: string;
  subtitle: string;
  icon: string;

  tasks: {
    revision: boolean;
    homework: boolean;
    doubt: boolean;
  };

  notes: {
    revision: string;
    homework: string;
    doubt: string;
  };

  onToggle: (task: "revision" | "homework" | "doubt") => void;

  onNoteChange: (
    task: "revision" | "homework" | "doubt",
    value: string
  ) => void;
}

export default function SubjectCard({
  subject,
  code,
  subtitle,
  icon,
  tasks,
  notes,
  onToggle,
  onNoteChange,
}: SubjectCardProps) {
  const [expanded, setExpanded] = useState(true);

  const completedCount = Object.values(tasks).filter(Boolean).length;

  return (
    <section className="mb-3 overflow-hidden rounded-xl border border-white/[0.04] bg-[#1a1b22]">
      {/* Subject Header */}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between gap-3 bg-[#1e1f26] px-4 py-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#292931]">
            <span className="text-[17px] text-[#00f59b]">
              {icon}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold leading-5 tracking-tight text-[#e3e1ec]">
              {subject}
            </h2>

            <p className="mt-0.5 truncate font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[#8c9b91]">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md bg-[#00f59b]/10 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#00f59b]">
            {completedCount} / 3 COMPLETED
          </span>

          <span
            className={`text-[16px] text-[#b9cbbd] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ⌄
          </span>
        </div>
      </button>

      {/* Tasks */}
      {expanded && (
        <div className="px-1.5 pb-1.5 pt-1.5">
          <div className="overflow-hidden rounded-lg bg-[#12131a]">
            <TaskRow
              label="Notes Revision"
              description={notes.revision}
              completed={tasks.revision}
              onToggle={() => onToggle("revision")}
              onDescriptionChange={(value) =>
                onNoteChange("revision", value)
              }
            />

            <TaskRow
              label="Homework Drill"
              description={notes.homework}
              completed={tasks.homework}
              onToggle={() => onToggle("homework")}
              onDescriptionChange={(value) =>
                onNoteChange("homework", value)
              }
            />

            <TaskRow
              label="Previous Day Doubt"
              description={notes.doubt}
              completed={tasks.doubt}
              onToggle={() => onToggle("doubt")}
              onDescriptionChange={(value) =>
                onNoteChange("doubt", value)
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}