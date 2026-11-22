import Header from "@/app/components/Header";
import BottomNav from "@/app/components/BottomNav";
import HistoryDashboard from "@/app/components/history/HistoryDashboard";
import { getCurrentUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { HistoryLog } from "@/app/components/history/types";
import { calculateCurrentStreak } from "@/lib/progress-utils";

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let logs: HistoryLog[] = [];
  let loadError: string | null = null;

  try {
    const records = await prisma.dailyLog.findMany({
      where: { userId: user.userId },
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        classAttended: true,
        mathRevision: true,
        mathRevisionNote: true,
        mathHomework: true,
        mathHomeworkNote: true,
        mathDoubt: true,
        mathDoubtNote: true,
        physicsRevision: true,
        physicsRevisionNote: true,
        physicsHomework: true,
        physicsHomeworkNote: true,
        physicsDoubt: true,
        physicsDoubtNote: true,
        chemistryRevision: true,
        chemistryRevisionNote: true,
        chemistryHomework: true,
        chemistryHomeworkNote: true,
        chemistryDoubt: true,
        chemistryDoubtNote: true,
        proofOfWork: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, url: true, sortOrder: true },
        },
      },
    });

    logs = records.map((record) => ({
      ...record,
      // Prisma's @db.Date values represent calendar dates at UTC midnight.
      // Keep the date key intact so the browser's timezone cannot shift it.
      date: record.date.toISOString().slice(0, 10),
    }));
  } catch (error) {
    console.error("History page database error:", error);
    loadError = "History records could not be loaded. Please try again.";
  }

  const todayDate = getTodayIST().toISOString().slice(0, 10);
  const streak = calculateCurrentStreak(
    logs.map((log) => log.date),
    todayDate,
  );

  return (
    <main className="min-h-screen bg-[#12131a] text-[#e3e1ec] print:bg-white print:text-black">
      <div className="print:hidden">
        <Header streak={streak} />
      </div>

      <div className="mx-auto max-w-[480px] px-4 pb-28 pt-20 print:max-w-none print:px-0 print:pb-0 print:pt-0">
        <HistoryDashboard
          logs={logs}
          todayDate={todayDate}
          loadError={loadError}
        />
      </div>

      <div className="print:hidden">
        <BottomNav />
      </div>
    </main>
  );
}
