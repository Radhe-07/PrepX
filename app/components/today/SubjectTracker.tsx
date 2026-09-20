"use client";

import SubjectCard from "./SubjectCard";

type TaskState = {
  revision: boolean;
  homework: boolean;
  doubt: boolean;
};

type NoteState = {
  revision: string;
  homework: string;
  doubt: string;
};

interface SubjectTrackerProps {
  tasks: {
    math: TaskState;
    physics: TaskState;
    chemistry: TaskState;
  };

  notes: {
    math: NoteState;
    physics: NoteState;
    chemistry: NoteState;
  };

  onToggle: (
    subject: "math" | "physics" | "chemistry",
    task: "revision" | "homework" | "doubt"
  ) => void;

  onNoteChange: (
    subject: "math" | "physics" | "chemistry",
    task: "revision" | "homework" | "doubt",
    value: string
  ) => void;
}

const subjects = [
  {
    key: "math" as const,
    subject: "Mathematics",
    code: "M",
    subtitle: "CALCULUS & VECTORS",
    icon: "∫",
  },
  {
    key: "physics" as const,
    subject: "Physics",
    code: "P",
    subtitle: "MECHANICS // DYNAMICS",
    icon: "◯",
  },
  {
    key: "chemistry" as const,
    subject: "Chemistry",
    code: "C",
    subtitle: "INORGANIC & PHYSICAL",
    icon: "⚗",
  },
];

export default function SubjectTracker({
  tasks,
  notes,
  onToggle,
  onNoteChange,
}: SubjectTrackerProps) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9cbbd]">
            SYLLABUS EXECUTION // JEE ADVANCED
          </p>

          <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#6f8175]">
            DAILY CHECKPOINTS
          </p>
        </div>

        <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#00f59b]">
          TAP TO TOGGLE
          <br />
          STATE
        </span>
      </div>

      {subjects.map((subject) => (
        <SubjectCard
          key={subject.subject}
          subject={subject.subject}
          code={subject.code}
          subtitle={subject.subtitle}
          icon={subject.icon}
          tasks={tasks[subject.key]}
          notes={notes[subject.key]}
          onToggle={(task) => onToggle(subject.key, task)}
          onNoteChange={(task, value) =>
            onNoteChange(subject.key, task, value)
          }
        />
      ))}
    </section>
  );
}