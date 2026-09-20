"use client";

import { useRef } from "react";

interface ProofOfWorkProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export default function ProofOfWork({
  files,
  onFilesChange,
}: ProofOfWorkProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);

    onFilesChange([...files, ...selectedFiles].slice(0, 15));

    event.target.value = "";
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const visibleFiles = files.slice(0, 3);
  const remainingCount = files.length - 3;

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
            {files.length} UPLOADED
          </span>
        </div>
      </div>

      {/* Image preview strip */}
      <div className="mb-4 flex gap-2">
        {visibleFiles.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-lg bg-[#292931]"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Proof of work ${index + 1}`}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-[#0d0e15]/80 font-mono text-[11px] text-[#ffb4ab] backdrop-blur"
            >
              ×
            </button>

            <span className="absolute bottom-1 right-1 rounded bg-[#0d0e15]/80 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase text-[#e3e1ec] backdrop-blur">
              {index === 0
                ? "MATH"
                : index === 1
                  ? "PHY"
                  : "CHEM"}
            </span>
          </div>
        ))}

        {files.length === 0 && (
          <>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="aspect-square min-w-0 flex-1 rounded-lg bg-[#292931]"
              />
            ))}
          </>
        )}

        {files.length > 3 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-[#292931] text-[#b9cbbd] transition hover:bg-[#34353e]"
          >
            <span className="mb-1 text-xl text-[#00f59b]">▣</span>

            <span className="font-mono text-[9px] font-bold uppercase">
              +{remainingCount} MORE
            </span>
          </button>
        )}

        {files.length > 0 && files.length <= 3 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
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
        className="hidden"
        onChange={handleFiles}
      />

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#00f59b] font-mono text-[11px] font-bold uppercase tracking-wider text-[#003920] transition hover:brightness-105 active:scale-[0.98]"
        >
          <span className="text-lg">▣</span>
          ADD PHOTOS
        </button>

        <button
          type="button"
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#292931] font-mono text-[11px] font-bold uppercase tracking-wider text-[#e3e1ec] transition hover:bg-[#34353e] active:scale-[0.98]"
        >
          <span className="text-lg text-[#b9cbbd]">▣</span>
          VIEW POW ({files.length})
        </button>
      </div>
    </section>
  );
}