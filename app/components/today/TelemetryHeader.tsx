export default function TelemetryHeader() {
  return (
    <section className="mb-5">
      <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b9cbbd]">
        DAILY TELEMETRY
      </p>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[#e3e1ec]">
            Good morning, Vishnu.
          </h1>

          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#b9cbbd]">
            Thursday, 20 September 2026
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#b9cbbd]">
            STATUS
          </p>
          <p className="mt-1 font-mono text-[11px] font-bold text-[#00f59b]">
            ACTIVE
          </p>
        </div>
      </div>
    </section>
  );
}