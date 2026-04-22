"use client";

import type { Lead } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export function StatsBar({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const avgScore = total
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / total)
    : 0;
  const highIntent = leads.filter((l) => l.classification.intent >= 3).length;
  const ready = leads.filter(
    (l) => l.classification.buying_readiness >= 2
  ).length;
  const sources = {
    google: leads.filter((l) => l.source === "google").length,
    olx: leads.filter((l) => l.source === "olx").length,
  };

  const stats = [
    { label: "Leads", value: total, color: "text-foreground" },
    { label: "Avg Score", value: avgScore, color: "text-foreground" },
    { label: "High Intent", value: highIntent, color: "text-emerald-400" },
    { label: "Ready to Buy", value: ready, color: "text-amber-400" },
    { label: "Google", value: sources.google, color: "text-blue-400" },
    { label: "OLX", value: sources.olx, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
