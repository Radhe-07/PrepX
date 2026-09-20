export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.03] bg-[#0d0e15]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-between px-4">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00f59b] text-sm font-black text-[#003920]">
            P
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-semibold tracking-tight">
                PREPX
              </span>

              <span className="rounded bg-[#292931] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#00f59b]">
                Today
              </span>
            </div>

            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-[#b9cbbd]">
              JEE PREPARATION // DAILY LOG
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded bg-[#292931] px-2 py-1">
            <span className="text-[#ffce95]">🔥</span>

            <span className="font-mono text-[11px] font-semibold text-[#ffce95]">
              6D
            </span>
          </div>

          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#292931]">
            <span className="text-xs font-bold text-[#00f59b]">V</span>

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#00f59b] ring-2 ring-[#0d0e15]" />
          </div>
        </div>
      </div>
    </header>
  );
}