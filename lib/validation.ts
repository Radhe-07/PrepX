import { z } from "zod";

export const dailyLogSchema = z.object({
  classAttended: z.boolean(),

  mathRevision: z.boolean(),
  mathRevisionNote: z.string().optional(),

  mathHomework: z.boolean(),
  mathHomeworkNote: z.string().optional(),

  mathDoubt: z.boolean(),
  mathDoubtNote: z.string().optional(),

  physicsRevision: z.boolean(),
  physicsRevisionNote: z.string().optional(),

  physicsHomework: z.boolean(),
  physicsHomeworkNote: z.string().optional(),

  physicsDoubt: z.boolean(),
  physicsDoubtNote: z.string().optional(),

  chemistryRevision: z.boolean(),
  chemistryRevisionNote: z.string().optional(),

  chemistryHomework: z.boolean(),
  chemistryHomeworkNote: z.string().optional(),

  chemistryDoubt: z.boolean(),
  chemistryDoubtNote: z.string().optional(),
});