import Header from "@/app/components/Header";
import BottomNav from "@/app/components/BottomNav";
import PowGallery from "@/app/pow/PowGallery";
import { getCurrentUser } from "@/lib/auth";
import { getTodayIST } from "@/lib/date";
import { getCurrentUserStreak } from "@/lib/streak";
import { redirect } from "next/navigation";

export default async function PowPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const todayDate = getTodayIST().toISOString().slice(0, 10);
  const streak = await getCurrentUserStreak(user.userId, todayDate);

  return (
    <main className="min-h-screen bg-[#12131a] text-[#e3e1ec]">
      <Header streak={streak} />
      <div className="mx-auto max-w-[480px] px-4 pb-28 pt-20">
        <PowGallery todayDate={todayDate} />
      </div>
      <BottomNav />
    </main>
  );
}
