import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import TodayClient from "./components/today/Today";


export default function Home() {

   

  return (
    <main className="min-h-screen bg-[#12131a] text-[#e3e1ec]">
      <Header />
      <div className="mx-auto max-w-[480px] px-4 pb-24 pt-20">
      <TodayClient/>
        {/* Today page content will go here */}
      </div>

      <BottomNav />
    </main>
  );
}