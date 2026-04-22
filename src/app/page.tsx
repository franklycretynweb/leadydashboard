"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/lib/types";
import { Topbar } from "@/components/layout/topbar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Charts } from "@/components/dashboard/charts";
import { RecentLeads } from "@/components/dashboard/recent-leads";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    const res = await fetch("/api/leads/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-[#6B4EFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Topbar onExport={handleExport} />
      <main className="p-6 space-y-6">
        <StatsCards leads={leads} />
        <Charts leads={leads} />
        <RecentLeads leads={leads} />
      </main>
    </>
  );
}
