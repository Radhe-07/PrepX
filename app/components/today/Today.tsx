"use client";

import { useEffect, useMemo, useState } from "react";
import TelemetryHeader from "./TelemetryHeader";
import ProgressCard from "./ProgressCard";
import ClassAttendance from "./ClassAttendance";
import SubjectTracker from "./SubjectTracker";
import ProofOfWork from "./Pow";
import SubmitLog from "./SubmitLog";

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

type TodayLog = {
  classAttended: boolean;

  mathRevision: boolean;
  mathRevisionNote?: string | null;
  mathHomework: boolean;
  mathHomeworkNote?: string | null;
  mathDoubt: boolean;
  mathDoubtNote?: string | null;

  physicsRevision: boolean;
  physicsRevisionNote?: string | null;
  physicsHomework: boolean;
  physicsHomeworkNote?: string | null;
  physicsDoubt: boolean;
  physicsDoubtNote?: string | null;

  chemistryRevision: boolean;
  chemistryRevisionNote?: string | null;
  chemistryHomework: boolean;
  chemistryHomeworkNote?: string | null;
  chemistryDoubt: boolean;
  chemistryDoubtNote?: string | null;
};

const emptyTasks = {
  math: {
    revision: false,
    homework: false,
    doubt: false,
  },
  physics: {
    revision: false,
    homework: false,
    doubt: false,
  },
  chemistry: {
    revision: false,
    homework: false,
    doubt: false,
  },
};

const defaultNotes = {
  math: {
    revision: "DIFFERENTIAL EQUATIONS CORE",
    homework: "EXERCISE-1 (Q1-35) & EXERCISE-2",
    doubt: "DEFINITE INTEGRAL ASYMMETRY Q14",
  },
  physics: {
    revision: "CURRENT ELECTRICITY CORE",
    homework: "EXERCISE-1 (Q1-35) & EXERCISE-2",
    doubt: "PREVIOUS DAY DOUBT",
  },
  chemistry: {
    revision: "INORGANIC CHEMISTRY CORE",
    homework: "EXERCISE-1 (Q1-35) & EXERCISE-2",
    doubt: "PREVIOUS DAY DOUBT",
  },
};

export default function TodayClient() {
  const [classAttended, setClassAttended] = useState(false);

  const [tasks, setTasks] = useState<{
    math: TaskState;
    physics: TaskState;
    chemistry: TaskState;
  }>(emptyTasks);

  const [notes, setNotes] = useState<{
    math: NoteState;
    physics: NoteState;
    chemistry: NoteState;
  }>(defaultNotes);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [powFiles, setPowFiles] = useState<File[]>([]);

  const handleSubmit = async () => {
  setSaving(true);

  try {
    // 1. Save today's log
    const response = await fetch("/api/logs/today", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classAttended,

        mathRevision: tasks.math.revision,
        mathRevisionNote: notes.math.revision,
        mathHomework: tasks.math.homework,
        mathHomeworkNote: notes.math.homework,
        mathDoubt: tasks.math.doubt,
        mathDoubtNote: notes.math.doubt,

        physicsRevision: tasks.physics.revision,
        physicsRevisionNote: notes.physics.revision,
        physicsHomework: tasks.physics.homework,
        physicsHomeworkNote: notes.physics.homework,
        physicsDoubt: tasks.physics.doubt,
        physicsDoubtNote: notes.physics.doubt,

        chemistryRevision: tasks.chemistry.revision,
        chemistryRevisionNote: notes.chemistry.revision,
        chemistryHomework: tasks.chemistry.homework,
        chemistryHomeworkNote: notes.chemistry.homework,
        chemistryDoubt: tasks.chemistry.doubt,
        chemistryDoubtNote: notes.chemistry.doubt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save today's log");
    }

    // 2. Upload POW files
    if (powFiles.length > 0) {
      const formData = new FormData();

      powFiles.forEach((file) => {
        formData.append("files", file);
      });

      const powResponse = await fetch("/api/logs/today/pow", {
        method: "POST",
        body: formData,
      });

      const powData = await powResponse.json();

      if (!powResponse.ok) {
        throw new Error(
          powData.error || "Failed to upload proof of work"
        );
      }
    }

    console.log("Today's log saved:", data.log);
  } catch (error) {
    console.error("Submit error:", error);
  } finally {
    setSaving(false);
  }
};

  useEffect(() => {
    async function loadToday() {
      try {
        const response = await fetch("/api/logs/today");

        if (!response.ok) {
          const error = await response.text();

          console.error("Today API error:", {
            status: response.status,
            body: error,
          });

          throw new Error("Failed to load today's log");
        }

        const data = await response.json();
        const log: TodayLog | null = data.log;

        if (!log) {
          return;
        }

        setClassAttended(log.classAttended);

        setTasks({
          math: {
            revision: log.mathRevision,
            homework: log.mathHomework,
            doubt: log.mathDoubt,
          },
          physics: {
            revision: log.physicsRevision,
            homework: log.physicsHomework,
            doubt: log.physicsDoubt,
          },
          chemistry: {
            revision: log.chemistryRevision,
            homework: log.chemistryHomework,
            doubt: log.chemistryDoubt,
          },
        });

        setNotes({
          math: {
            revision:
              log.mathRevisionNote ?? defaultNotes.math.revision,
            homework:
              log.mathHomeworkNote ?? defaultNotes.math.homework,
            doubt:
              log.mathDoubtNote ?? defaultNotes.math.doubt,
          },
          physics: {
            revision:
              log.physicsRevisionNote ?? defaultNotes.physics.revision,
            homework:
              log.physicsHomeworkNote ?? defaultNotes.physics.homework,
            doubt:
              log.physicsDoubtNote ?? defaultNotes.physics.doubt,
          },
          chemistry: {
            revision:
              log.chemistryRevisionNote ??
              defaultNotes.chemistry.revision,
            homework:
              log.chemistryHomeworkNote ??
              defaultNotes.chemistry.homework,
            doubt:
              log.chemistryDoubtNote ??
              defaultNotes.chemistry.doubt,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadToday();
  }, []);

  const completedTasks = useMemo(() => {
    return (
      Number(classAttended) +
      Object.values(tasks.math).filter(Boolean).length +
      Object.values(tasks.physics).filter(Boolean).length +
      Object.values(tasks.chemistry).filter(Boolean).length
    );
  }, [classAttended, tasks]);

  const toggleTask = (
    subject: "math" | "physics" | "chemistry",
    task: "revision" | "homework" | "doubt"
  ) => {
    setTasks((current) => ({
      ...current,
      [subject]: {
        ...current[subject],
        [task]: !current[subject][task],
      },
    }));
  };

  const updateNote = (
    subject: "math" | "physics" | "chemistry",
    task: "revision" | "homework" | "doubt",
    value: string
  ) => {
    setNotes((current) => ({
      ...current,
      [subject]: {
        ...current[subject],
        [task]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6f8175]">
          Loading today...
        </p>
      </div>
    );
  }

  return (
    <>
      <TelemetryHeader />

      <ProgressCard completedTasks={completedTasks} />

      <ClassAttendance
        completed={classAttended}
        onToggle={() => setClassAttended((value) => !value)}
      />

      <SubjectTracker
        tasks={tasks}
        notes={notes}
        onToggle={toggleTask}
        onNoteChange={updateNote}
      />

      <ProofOfWork
        files={powFiles}
        onFilesChange={setPowFiles}
        />

      <SubmitLog
        completedTasks={completedTasks}
        onSubmit={handleSubmit}
        saving={saving}
        />
    </>
  );
}