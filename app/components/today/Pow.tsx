"use client";

import { useEffect, useRef, useState } from "react";
import { optimizedCloudinaryUrl } from "@/lib/image-url";

interface ProofOfWorkProps {
  files: File[];
  uploadedProofs: Array<{ id: string; url: string }>;
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function ProofOfWork({
  files,
  uploadedProofs,
  onFilesChange,
  disabled = false,
}: ProofOfWorkProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Array<{ file: File; url: string }>>([]);
  const pendingPreviewLimit = Math.max(0, 3 - uploadedProofs.length);

  useEffect(() => {
    const entries = files.slice(0, pendingPreviewLimit).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(entries);
    return () => entries.forEach(({ url }) => URL.revokeObjectURL(url));
  }, [files, pendingPreviewLimit]);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || disabled) return;

    const selectedFiles = Array.from(event.target.files);
    const existing = new Set(
      files.map((file) => `${file.name}\u0000${file.size}\u0000${file.lastModified}`),
    );
    const uniqueFiles = selectedFiles.filter((file) => {
      const key = `${file.name}\u0000${file.size}\u0000${file.lastModified}`;
      if (existing.has(key)) return false;
      existing.add(key);
      return true;
    });

    const availableSlots = Math.max(0, 15 - uploadedProofs.length - files.length);
    onFilesChange([...files, ...uniqueFiles.slice(0, availableSlots)]);

    event.target.value = "";
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const visibleFiles = [
    ...uploadedProofs.slice(0, 3).map((proof) => ({
      key: `uploaded-${proof.id}`,
      url: optimizedCloudinaryUrl(proof.url, 320),
      uploaded: true,
      pendingIndex: null,
    })),
    ...previews.map(({ file, url }, index) => ({
      key: `pending-${file.name}-${file.size}-${file.lastModified}`,
      url,
      uploaded: false,
      pendingIndex: index,
    })),
  ];
  const totalCount = uploadedProofs.length + files.length;
  const remainingCount = totalCount - 3;

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-white/[0.04] bg-[#1a1b22] p-4">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#292931] text-[#00f59b]">
            <span className="text-sm">✿</span>
          </div>

          <div>
            <h2 className="text-[18px] font-semibold leading-5 text-[#e3e1ec]">
              Proof of Work
            </h2>

            <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[#b9cbbd]">
              SHOW THE WORK. ZERO EXCUSES.
            </p>
          </div>
        </div>

        <div className="rounded-md bg-[#292931] px-2.5 py-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#00f59b]">
            {uploadedProofs.length} STORED · {files.length} NEW
          </span>
        </div>
      </div>

      {/* Image preview strip */}
      <div className="mb-4 flex gap-2">
        {visibleFiles.map(({ url, uploaded, pendingIndex, key }, index) => (
          <div
            key={key}
            className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-lg bg-[#292931]"
          >
            <img
              src={url}
              alt={`Proof of work ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />

            {!uploaded && pendingIndex !== null && (
              <button
                type="button"
                onClick={() => removeFile(pendingIndex)}
                disabled={disabled}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-[#0d0e15]/80 font-mono text-[11px] text-[#ffb4ab] backdrop-blur"
              >
                ×
              </button>
            )}

            <span className="absolute bottom-1 right-1 rounded bg-[#0d0e15]/80 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase text-[#e3e1ec] backdrop-blur">
              {uploaded
                ? "STORED"
                : pendingIndex === 0
                  ? "MATH"
                  : pendingIndex === 1
                    ? "PHY"
                    : "CHEM"}
            </span>
          </div>
        ))}

        {totalCount === 0 && (
          <>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="aspect-square min-w-0 flex-1 rounded-lg bg-[#292931]"
              />
            ))}
          </>
        )}

        {totalCount > 3 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || totalCount >= 15}
            className="flex aspect-square min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-[#292931] text-[#b9cbbd] transition hover:bg-[#34353e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="mb-1 text-xl text-[#00f59b]">▣</span>

            <span className="font-mono text-[9px] font-bold uppercase">
              +{remainingCount} MORE
            </span>
          </button>
        )}

        {totalCount > 0 && totalCount <= 3 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || totalCount >= 15}
            className="flex aspect-square min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-[#292931] text-[#b9cbbd] transition hover:bg-[#34353e]"
          >
            <span className="mb-1 text-xl text-[#00f59b]">+</span>

            <span className="font-mono text-[8px] font-bold uppercase">
              ADD
            </span>
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        className="hidden"
        onChange={handleFiles}
      />

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || totalCount >= 15}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#00f59b] font-mono text-[11px] font-bold uppercase tracking-wider text-[#003920] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-lg">▣</span>
          ADD PHOTOS
        </button>

        <button
          type="button"
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#292931] font-mono text-[11px] font-bold uppercase tracking-wider text-[#e3e1ec] transition hover:bg-[#34353e] active:scale-[0.98]"
        >
          <span className="text-lg text-[#b9cbbd]">▣</span>
          VIEW POW ({totalCount})
        </button>
      </div>
    </section>
  );
}
