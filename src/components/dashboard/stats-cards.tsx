"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Lead } from "@/lib/types";
import { Users, Flame, TrendingUp, Building2 } from "lucide-react";

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current || target === 0) {
      setValue(target);
      return;
    }
    counted.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return { value, ref };
}

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}

function StatCard({ label, value, suffix, icon: Icon, color, delay }: StatCardProps) {
  const counter = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-xl p-4 group hover:border-white/[0.12] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/35 font-medium">
            {label}
          </p>
          <p className="text-[26px] font-bold text-white mt-1 leading-none" ref={counter.ref}>
            {counter.value}
            {suffix && <span className="text-[16px] text-white/50 ml-0.5">{suffix}</span>}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

export function StatsCards({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const hot = leads.filter((l) => l.score >= 85).length;
  const avgScore = total
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / total)
    : 0;
  const sources = new Set(leads.map((l) => l.source)).size;

  const stats: StatCardProps[] = [
    { label: "Total Leads", value: total, icon: Users, color: "#6B4EFF", delay: 0 },
    { label: "Hot Leads", value: hot, icon: Flame, color: "#EF4444", delay: 0.05 },
    { label: "Avg Score", value: avgScore, icon: TrendingUp, color: "#22C55E", delay: 0.1 },
    { label: "Sources", value: sources, icon: Building2, color: "#4EA8FF", delay: 0.15 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
