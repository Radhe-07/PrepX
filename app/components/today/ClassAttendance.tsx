"use client";

interface ClassAttendanceProps {
  completed: boolean;
  onToggle: () => void;
}

export default function ClassAttendance({
  completed,
  onToggle,
}: ClassAttendanceProps) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9cbbd]">
            TODAY'S CLASS
          </p>

          <p className="mt-1 text-xs text-[#6f8175]">
            Mark complete if today's scheduled class was attended.
          </p>
        </div>

        <span
          className={`font-mono text-[9px] font-bold uppercase tracking-widest ${
            completed ? "text-[#00f59b]" : "text-[#6f8175]"
          }`}
        >
          {completed ? "COMPLETE" : "PENDING"}
        </span>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
          completed
            ? "border-[#00f59b]/30 bg-[#00f59b]/[0.06]"
            : "border-white/[0.04] bg-[#1a1b22] hover:bg-[#1e1f26]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              completed
                ? "bg-[#00f59b] text-[#003920]"
                : "bg-[#292931] text-[#b9cbbd]"
            }`}
          >
            <span className="text-lg">◷</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#e3e1ec]">
              Scheduled class
            </p>

            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#6f8175]">
              CLASS ATTENDANCE
            </p>
          </div>
        </div>

        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
            completed
              ? "border-[#00f59b] bg-[#00f59b] text-[#003920]"
              : "border-[#6f8175] text-transparent"
          }`}
        >
          ✓
        </div>
      </button>
    </section>
  );
}