interface ProgressCardProps {
  completedTasks: number;
}

export default function ProgressCard({
  completedTasks,
}: ProgressCardProps) {
  const totalTasks = 10;
  const percentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-white/[0.04] bg-[#1a1b22]">
      <div className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9cbbd]">
              DAILY READINESS
            </p>

            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[#6f8175]">
              10 CHECKPOINTS
            </p>
          </div>

          <div className="rounded bg-[#292931] px-2 py-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#00f59b]">
              LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Score ring */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[7px] border-[#292931]" />

            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#00f59b ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                mask: "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 0)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 0)",
              }}
            />

            <div className="text-center">
              <p className="font-mono text-3xl font-black tracking-tight text-[#e3e1ec]">
                {completedTasks}
              </p>

              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#b9cbbd]">
                / {totalTasks}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#e3e1ec]">
              CHECKPOINT STATUS
            </p>

            <p className="mt-2 text-sm leading-5 text-[#b9cbbd]">
              {completedTasks} of {totalTasks} daily checkpoints completed.
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#292931]">
              <div
                className="h-full rounded-full bg-[#00f59b]"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider">
              <span className="text-[#6f8175]">PROGRESS</span>
              <span className="font-bold text-[#00f59b]">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoint segments */}
      <div className="flex gap-1 border-t border-white/[0.03] bg-[#0d0e15] p-3">
        {Array.from({ length: totalTasks }).map((_, index) => {
          const completed = index < completedTasks;

          return (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full ${
                completed ? "bg-[#00f59b]" : "bg-[#292931]"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}