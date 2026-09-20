"use client";

import { useEffect, useRef, useState } from "react";

interface TaskRowProps {
  label: string;
  description: string;
  completed: boolean;
  onToggle: () => void;
  onDescriptionChange?: (description: string) => void;
}

export default function TaskRow({
  label,
  description,
  completed,
  onToggle,
  onDescriptionChange,
}: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(description);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(description);
  }, [description]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function saveDescription() {
    setEditing(false);

    if (value.trim() !== description) {
      onDescriptionChange?.(value.trim());
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveDescription();
    }

    if (event.key === "Escape") {
      setValue(description);
      setEditing(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#292931]/60 px-3 py-3 last:border-b-0">
      {/* Task information */}
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium leading-5 text-[#e3e1ec]">
          {label}
        </p>

        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={saveDescription}
            onKeyDown={handleKeyDown}
            className="mt-0.5 w-full bg-transparent font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-[#8c9b91] outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-0.5 block max-w-full truncate text-left font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-[#8c9b91]"
          >
            {value}
          </button>
        )}
      </div>

      {/* Status button */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-8 min-w-[78px] shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 font-mono text-[9px] font-bold uppercase tracking-wider transition ${
          completed
            ? "bg-[#00f59b] text-[#003920]"
            : "bg-[#292931] text-[#ffb4ab] hover:bg-[#34353e]"
        }`}
      >
        <span className="text-[13px] leading-none">
          {completed ? "✓" : "×"}
        </span>

        {completed ? "DONE" : "NOT DONE"}
      </button>
    </div>
  );
}