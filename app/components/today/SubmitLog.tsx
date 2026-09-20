"use client";

interface SubmitLogProps {
  completedTasks: number;
}
interface SubmitLogProps {
  completedTasks: number;
  onSubmit: () => void;
  saving: boolean;
}

export default function SubmitLog({
  completedTasks,
  onSubmit,
  saving,
}: SubmitLogProps)  {
  const totalTasks = 10;

  return (
    <section className="mb-7">
          <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="flex h-20 w-full items-center justify-center gap-3 rounded-2xl bg-[#00f59b] text-[#003920] shadow-[0_8px_30px_rgba(0,245,155,0.12)] transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-2xl">♙</span>

        <span className="text-[21px] font-bold tracking-tight">
          {saving ? "SAVING..." : "SUBMIT TODAY'S LOG"}
        </span>
      </button>

      <div className="mt-2 flex items-center justify-center gap-1.5">
        <span className="text-[12px] text-[#00f59b]">
          ◈
        </span>

        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[#b9cbbd]">
          READY TO LOCK IN {completedTasks}/{totalTasks} TASKS FOR TODAY // VISHNU
        </span>
      </div>
    </section>
  );
}