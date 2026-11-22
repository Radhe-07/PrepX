"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HistoryProof } from "./types";
import { optimizedCloudinaryUrl } from "@/lib/image-url";

type ProofGalleryProps = {
  images: HistoryProof[];
  initialIndex: number;
  onClose: () => void;
};

export default function ProofGallery({
  images,
  initialIndex,
  onClose,
}: ProofGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Proof of work gallery"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-4xl flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between font-mono text-xs uppercase tracking-widest text-[#b9cbbd]">
          <span>PROOF OF WORK</span>
          <span>{`${activeIndex + 1} / ${images.length}`}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#292931] px-3 py-2 text-[#e3e1ec] hover:text-[#00f59b]"
            aria-label="Close proof gallery"
          >
            CLOSE ×
          </button>
        </div>

        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          {images.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setActiveIndex((index) => (index - 1 + images.length) % images.length)
              }
              className="absolute left-0 z-10 rounded-full bg-[#1a1b22]/90 px-4 py-3 text-xl text-[#00f59b]"
              aria-label="Previous proof image"
            >
              ‹
            </button>
          )}
          <Image
            src={optimizedCloudinaryUrl(activeImage.url, 1600)}
            alt={`Proof of work ${activeIndex + 1}`}
            width={1600}
            height={1200}
            unoptimized
            className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain"
          />
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveIndex((index) => (index + 1) % images.length)}
              className="absolute right-0 z-10 rounded-full bg-[#1a1b22]/90 px-4 py-3 text-xl text-[#00f59b]"
              aria-label="Next proof image"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
