import { prisma } from "@/lib/prisma";
import { calculateCurrentStreak, toDateKey } from "@/lib/progress-utils";

export async function getCurrentUserStreak(userId: string, todayDate: string) {
  const dates = await prisma.dailyLog.findMany({
    where: {
      userId,
      date: { lte: new Date(`${todayDate}T00:00:00.000Z`) },
    },
    select: { date: true },
  });

  return calculateCurrentStreak(
    dates.map(({ date }) => toDateKey(date)),
    todayDate,
  );
}
