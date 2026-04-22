"use client";

import { motion } from "framer-motion";
import type { Lead } from "@/lib/types";
import Link from "next/link";

function ScoreDot({ score }: { score: number }) {
  const color =
    score >= 85 ? "#22C55E" : score >= 70 ? "#F59E0B" : "rgba(255,255,255,0.25)";
  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: color }}
    />
  );
}

function SourcePill({ source }: { source: string }) {
  const colors: Record<string, string> = {
    ceidg: "bg-[#6B4EFF]/15 text-[#6B4EFF]",
    gmaps: "bg-[#4EA8FF]/15 text-[#4EA8FF]",
    facebook: "bg-[#22C55E]/15 text-[#22C55E]",
    google: "bg-[#F59E0B]/15 text-[#F59E0B]",
    oferteo: "bg-[#EF4444]/15 text-[#EF4444]",
    zleca: "bg-[#EC4899]/15 text-[#EC4899]",
  };
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[source] || "bg-white/10 text-white/50"}`}
    >
      {source}
    </span>
  );
}

export function RecentLeads({ leads }: { leads: Lead[] }) {
  const recent = leads.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-xl"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <p className="text-[11px] uppercase tracking-wider text-white/35 font-medium">
          Recent leads
        </p>
        <Link
          href="/leads"
          className="text-[12px] text-[#6B4EFF] hover:text-[#8B6FFF] transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {recent.length === 0 && (
          <p className="text-center text-white/30 text-[13px] py-8">
            Brak leadow. Uruchom pipeline.
          </p>
        )}
        {recent.map((lead, i) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.45 + i * 0.03,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-default"
          >
            <ScoreDot score={lead.score} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-white/80 truncate">
                {lead.title}
              </p>
              <p className="text-[11px] text-white/30 truncate mt-0.5">
                {lead.summary}
              </p>
            </div>
            <SourcePill source={lead.source} />
            <span className="text-[13px] font-mono text-white/50 tabular-nums w-8 text-right">
              {lead.score}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
