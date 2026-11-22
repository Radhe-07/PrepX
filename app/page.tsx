import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import TodayClient from "./components/today/Today";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/date";
import { getCurrentUserStreak } from "@/lib/streak";


export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const todayDate = getTodayIST().toISOString().slice(0, 10);
  const streak = await getCurrentUserStreak(user.userId, todayDate);

  return (
    <main className="min-h-screen bg-[#12131a] text-[#e3e1ec]">
      <Header streak={streak} />
      <div className="mx-auto max-w-[480px] px-4 pb-24 pt-20">
        <TodayClient />
      </div>

      <BottomNav />
    </main>
  );
}
