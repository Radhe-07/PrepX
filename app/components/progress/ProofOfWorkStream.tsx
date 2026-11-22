"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDateKey, type ProgressProof } from "@/lib/progress-utils";
import { optimizedCloudinaryUrl } from "@/lib/image-url";

function ProgressProofGallery({
  proofs,
  activeIndex,
  onClose,
  onSelect,
}: {
  proofs: ProgressProof[];
  activeIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}) {
  const activeProof = proofs[activeIndex];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        onSelect((activeIndex - 1 + proofs.length) % proofs.length);
      }
      if (event.key === "ArrowRight") {
        onSelect((activeIndex + 1) % proofs.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onClose, onSelect, proofs.length]);

  if (!activeProof) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Proof of work gallery"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-5xl flex-col gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-[#b9cbbd]">
          <span>Proof of work · {formatDateKey(activeProof.date)}</span>
          <span className="ml-auto">{activeIndex + 1} / {proofs.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#292931] px-3 py-2 text-[#e3e1ec] hover:text-[#00f59b]"
            aria-label="Close proof gallery"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="relative flex h-[70vh] max-h-[620px] min-h-0 w-full items-center justify-center">
          <Image
            src={optimizedCloudinaryUrl(activeProof.url, 1600)}
            alt={"Proof of work submitted on " + formatDateKey(activeProof.date)}
            fill
            unoptimized
            sizes="100vw"
            className="object-contain"
          />
          {proofs.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  onSelect((activeIndex - 1 + proofs.length) % proofs.length)
                }
                className="absolute left-1 z-10 rounded-full bg-[#1a1b22]/90 px-4 py-3 text-xl text-[#00f59b]"
                aria-label="Previous proof image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => onSelect((activeIndex + 1) % proofs.length)}
                className="absolute right-1 z-10 rounded-full bg-[#1a1b22]/90 px-4 py-3 text-xl text-[#00f59b]"
                aria-label="Next proof image"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProofOfWorkStream({
  proofs,
  totalCount,
}: {
  proofs: ProgressProof[];
  totalCount: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const latestProofs = proofs.slice(0, 3);

  return (
    <section className="rounded-2xl border border-white/[0.025] bg-[#1a1b22] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#e3e1ec]">
          Proof of Work Stream
        </h2>
        <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-[#00f59b]">
          Latest submissions
        </span>
      </div>

      {latestProofs.length === 0 ? (
        <p className="rounded-lg bg-[#14151c] px-3 py-5 text-center font-mono text-[9px] uppercase tracking-wider text-[#77847a]">
          No proof of work in this range
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2.5">
            {latestProofs.map((proof, index) => (
              <button
                type="button"
                key={proof.id}
                onClick={() => setActiveIndex(index)}
                className="group min-w-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00f59b]"
                aria-label={
                  "Open proof of work submitted on " + formatDateKey(proof.date)
                }
              >
                <span className="relative block h-24 overflow-hidden rounded-lg bg-[#292931] sm:h-28">
                  <Image
                    src={optimizedCloudinaryUrl(proof.url, 480)}
                    alt={"Proof of work submitted on " + formatDateKey(proof.date)}
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="(max-width: 480px) 30vw, 140px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-[#0d0e15]/90 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-[#00f59b]">
                    POW
                  </span>
                </span>
                <span className="mt-1.5 block truncate font-mono text-[9px] tracking-wider text-[#b9cbbd]">
                  {formatDateKey(proof.date)}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-wider text-[#77847a]">
            Showing {latestProofs.length} latest of {totalCount} verified image
            {totalCount === 1 ? "" : "s"}
          </p>
        </>
      )}

      {activeIndex !== null && (
        <ProgressProofGallery
          proofs={proofs}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onSelect={setActiveIndex}
        />
      )}
    </section>
  );
}
