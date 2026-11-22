export type ProgressRange = "7d" | "30d" | "all";

export type ProgressProof = {
  id: string;
  url: string;
  sortOrder: number;
  date: string;
};

export type ProgressLog = {
  id: string;
  date: string;
  classAttended: boolean;
  mathRevision: boolean;
  mathHomework: boolean;
  mathDoubt: boolean;
  physicsRevision: boolean;
  physicsHomework: boolean;
  physicsDoubt: boolean;
  chemistryRevision: boolean;
  chemistryHomework: boolean;
  chemistryDoubt: boolean;
  proofOfWork: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
};

export type RatioMetric = {
  completed: number;
  applicable: number;
  percentage: number | null;
};

export type SubjectMetric = RatioMetric & {
  key: "math" | "physics" | "chemistry";
  label: string;
};

export type PillarMetric = RatioMetric & {
  key: "revision" | "class" | "homework" | "doubt";
  label: string;
};

export type ProgressMetrics = {
  currentStreak: number;
  personalBest: number;
  selectedDayCount: number;
  selectedRate: RatioMetric;
  thirtyDayRate: RatioMetric;
  verifiedPowCount: number;
  subjectTotal: RatioMetric;
  subjects: SubjectMetric[];
  pillars: PillarMetric[];
};

export type WeekDayMetric = {
  date: string;
  label: string;
  isFuture: boolean;
  completed: number | null;
};

export type WeekMetrics = {
  days: WeekDayMetric[];
  loggedDayCount: number;
  average: number | null;
};

const CHECKPOINT_FIELDS: Array<keyof ProgressLog> = [
  "classAttended",
  "mathRevision",
  "mathHomework",
  "mathDoubt",
  "physicsRevision",
  "physicsHomework",
  "physicsDoubt",
  "chemistryRevision",
  "chemistryHomework",
  "chemistryDoubt",
];

const SUBJECT_FIELDS = [
  {
    key: "math",
    label: "Mathematics",
    fields: ["mathRevision", "mathHomework", "mathDoubt"],
  },
  {
    key: "physics",
    label: "Physics",
    fields: ["physicsRevision", "physicsHomework", "physicsDoubt"],
  },
  {
    key: "chemistry",
    label: "Chemistry",
    fields: ["chemistryRevision", "chemistryHomework", "chemistryDoubt"],
  },
] as const;

function ratio(completed: number, applicable: number): RatioMetric {
  return {
    completed,
    applicable,
    percentage: applicable > 0 ? (completed / applicable) * 100 : null,
  };
}

export function toDateKey(value: string | Date) {
  return typeof value === "string"
    ? value.slice(0, 10)
    : value.toISOString().slice(0, 10);
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const date = new Date(dateKey + "T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(dateKeys: string[], todayDate: string) {
  const dateSet = new Set(dateKeys.filter((date) => date <= todayDate));
  let streakDate = dateSet.has(todayDate)
    ? todayDate
    : addDaysToDateKey(todayDate, -1);
  let currentStreak = 0;

  while (dateSet.has(streakDate)) {
    currentStreak += 1;
    streakDate = addDaysToDateKey(streakDate, -1);
  }

  return currentStreak;
}

export function getCompletedCheckpointCount(log: ProgressLog) {
  return CHECKPOINT_FIELDS.reduce(
    (total, field) => total + (log[field] ? 1 : 0),
    0
  );
}

export function getLogsInRange(
  logs: ProgressLog[],
  todayDate: string,
  range: ProgressRange
) {
  const startDate =
    range === "7d"
      ? addDaysToDateKey(todayDate, -6)
      : range === "30d"
        ? addDaysToDateKey(todayDate, -29)
        : null;

  return logs.filter((log) => {
    const date = toDateKey(log.date);
    return date <= todayDate && (!startDate || date >= startDate);
  });
}

function getStreaks(logs: ProgressLog[], todayDate: string) {
  const dates = Array.from(
    new Set(
      logs
        .map((log) => toDateKey(log.date))
        .filter((date) => date <= todayDate)
    )
  ).sort();
  const currentStreak = calculateCurrentStreak(dates, todayDate);

  let personalBest = 0;
  let runningStreak = 0;
  let previousDate: string | null = null;

  for (const date of dates) {
    runningStreak =
      previousDate && addDaysToDateKey(previousDate, 1) === date
        ? runningStreak + 1
        : 1;
    personalBest = Math.max(personalBest, runningStreak);
    previousDate = date;
  }

  return { currentStreak, personalBest };
}

export function calculateProgressMetrics(
  logs: ProgressLog[],
  todayDate: string,
  range: ProgressRange
): ProgressMetrics {
  const selectedLogs = getLogsInRange(logs, todayDate, range);
  const thirtyDayLogs = getLogsInRange(logs, todayDate, "30d");
  const streaks = getStreaks(logs, todayDate);

  const selectedComplete = selectedLogs.reduce(
    (total, log) => total + getCompletedCheckpointCount(log),
    0
  );
  const thirtyDayComplete = thirtyDayLogs.reduce(
    (total, log) => total + getCompletedCheckpointCount(log),
    0
  );

  const subjects: SubjectMetric[] = SUBJECT_FIELDS.map((subject) => {
    const completed = selectedLogs.reduce(
      (total, log) =>
        total +
        subject.fields.reduce(
          (subjectTotal, field) => subjectTotal + (log[field] ? 1 : 0),
          0
        ),
      0
    );
    const metric = ratio(completed, selectedLogs.length * 3);

    return { ...metric, key: subject.key, label: subject.label };
  });

  const revisionCompleted = subjects.reduce(
    (total, subject) => total +
      selectedLogs.reduce((dayTotal, log) => {
        const field =
          subject.key === "math"
            ? "mathRevision"
            : subject.key === "physics"
              ? "physicsRevision"
              : "chemistryRevision";
        return dayTotal + (log[field] ? 1 : 0);
      }, 0),
    0
  );
  const homeworkCompleted = selectedLogs.reduce(
    (total, log) =>
      total +
      Number(log.mathHomework) +
      Number(log.physicsHomework) +
      Number(log.chemistryHomework),
    0
  );
  const doubtCompleted = selectedLogs.reduce(
    (total, log) =>
      total +
      Number(log.mathDoubt) +
      Number(log.physicsDoubt) +
      Number(log.chemistryDoubt),
    0
  );
  const classCompleted = selectedLogs.filter((log) => log.classAttended).length;

  const pillars: PillarMetric[] = [
    {
      key: "revision",
      label: "Notes Revision",
      ...ratio(revisionCompleted, selectedLogs.length * 3),
    },
    {
      key: "class",
      label: "Class Lectures",
      ...ratio(classCompleted, selectedLogs.length),
    },
    {
      key: "homework",
      label: "Daily Homework",
      ...ratio(homeworkCompleted, selectedLogs.length * 3),
    },
    {
      key: "doubt",
      label: "Previous Doubts",
      ...ratio(doubtCompleted, selectedLogs.length * 3),
    },
  ];

  return {
    ...streaks,
    selectedDayCount: selectedLogs.length,
    selectedRate: ratio(selectedComplete, selectedLogs.length * 10),
    thirtyDayRate: ratio(thirtyDayComplete, thirtyDayLogs.length * 10),
    verifiedPowCount: selectedLogs.reduce(
      (total, log) => total + log.proofOfWork.length,
      0
    ),
    subjectTotal: ratio(
      subjects.reduce((total, subject) => total + subject.completed, 0),
      selectedLogs.length * 9
    ),
    subjects,
    pillars,
  };
}

export function calculateWeekMetrics(
  logs: ProgressLog[],
  todayDate: string
): WeekMetrics {
  const today = new Date(todayDate + "T00:00:00.000Z");
  const mondayOffset = (today.getUTCDay() + 6) % 7;
  const monday = addDaysToDateKey(todayDate, -mondayOffset);
  const logsByDate = new Map(
    logs
      .filter((log) => toDateKey(log.date) <= todayDate)
      .map((log) => [toDateKey(log.date), log])
  );
  const labels = ["M", "T", "W", "T", "F", "S", "SU"];
  const days = labels.map((label, index): WeekDayMetric => {
    const date = addDaysToDateKey(monday, index);
    const log = logsByDate.get(date);

    return {
      date,
      label,
      isFuture: date > todayDate,
      completed: log ? getCompletedCheckpointCount(log) : null,
    };
  });
  const loggedDays = days.filter((day) => day.completed !== null);
  const totalCompleted = loggedDays.reduce(
    (total, day) => total + (day.completed ?? 0),
    0
  );

  return {
    days,
    loggedDayCount: loggedDays.length,
    average: loggedDays.length ? totalCompleted / loggedDays.length : null,
  };
}

export function getProofsForLogs(logs: ProgressLog[]): ProgressProof[] {
  return logs
    .flatMap((log) =>
      log.proofOfWork.map((proof) => ({
        ...proof,
        date: toDateKey(log.date),
      }))
    )
    .sort((left, right) => {
      const dateOrder = right.date.localeCompare(left.date);
      return dateOrder || right.sortOrder - left.sortOrder;
    });
}

export function formatDateKey(dateKey: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    ...options,
  }).format(new Date(dateKey + "T00:00:00.000Z"));
}
