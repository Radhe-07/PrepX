export type HistoryProof = {
  id: string;
  url: string;
  sortOrder: number;
};

export type HistoryLog = {
  id: string;
  date: string;
  classAttended: boolean;
  mathRevision: boolean;
  mathRevisionNote: string | null;
  mathHomework: boolean;
  mathHomeworkNote: string | null;
  mathDoubt: boolean;
  mathDoubtNote: string | null;
  physicsRevision: boolean;
  physicsRevisionNote: string | null;
  physicsHomework: boolean;
  physicsHomeworkNote: string | null;
  physicsDoubt: boolean;
  physicsDoubtNote: string | null;
  chemistryRevision: boolean;
  chemistryRevisionNote: string | null;
  chemistryHomework: boolean;
  chemistryHomeworkNote: string | null;
  chemistryDoubt: boolean;
  chemistryDoubtNote: string | null;
  proofOfWork: HistoryProof[];
};

export function getCheckpointCount(log: HistoryLog) {
  return [
    log.classAttended,
    log.mathRevision,
    log.mathHomework,
    log.mathDoubt,
    log.physicsRevision,
    log.physicsHomework,
    log.physicsDoubt,
    log.chemistryRevision,
    log.chemistryHomework,
    log.chemistryDoubt,
  ].filter(Boolean).length;
}

export function getCompletionPercent(log: HistoryLog) {
  return getCheckpointCount(log) * 10;
}
