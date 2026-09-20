import Link from "next/link";

const navigation = [
  {
    label: "Today",
    href: "/",
    icon: "◷",
  },
  {
    label: "History",
    href: "/history",
    icon: "▣",
  },
  {
    label: "Progress",
    href: "/progress",
    icon: "⌁",
  },
  {
    label: "POW",
    href: "/pow",
    icon: "▦",
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.03] bg-[#0d0e15]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[480px] items-center justify-around px-3">
        {navigation.map((item) => {
          const active = item.href === "/";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 px-2 ${
                active ? "text-[#00f59b]" : "text-[#b9cbbd]"
              }`}
            >
              <span className="text-[22px]">{item.icon}</span>

              <span className="font-mono text-[11px] font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}