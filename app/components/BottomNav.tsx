"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppIcon, { type AppIconName } from "./AppIcon";

const navigation: Array<{
  label: string;
  href: string;
  icon: AppIconName;
}> = [
  { label: "Today", href: "/", icon: "home" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Progress", href: "/progress", icon: "chart" },
  { label: "POW", href: "/pow", icon: "image" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.03] bg-[#0d0e15]/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-[480px] items-center justify-around px-3">
        {navigation.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 transition-colors ${
                active
                  ? "bg-[#00f59b]/[0.08] text-[#00f59b]"
                  : "text-[#87938b] hover:text-[#e3e1ec]"
              }`}
            >
              <AppIcon
                name={item.icon}
                className={`h-[21px] w-[21px] ${active ? "stroke-[2.2]" : ""}`}
              />
              <span className="font-mono text-[10px] font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
