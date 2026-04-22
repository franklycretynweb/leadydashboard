"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/settings", label: "Ustawienia", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar fixed left-0 top-0 bottom-0 w-[220px] flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#6B4EFF] flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-white">
          LeadGen
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative block"
              >
                <div
                  className={`
                    relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-white/[0.08] text-white nav-active-glow"
                        : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-white"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#6B4EFF]/20 flex items-center justify-center text-[11px] font-bold text-[#6B4EFF]">
            MB
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-white/70 truncate">
              OffScript
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
