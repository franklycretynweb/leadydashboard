"use client";

import { useEffect, useState, useMemo } from "react";
import { GlobeOff, Phone, TrendingUp, Users } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/types";
import { LeadFiltersBar, DEFAULT_FILTERS, type LeadFilters } from "@/components/leads/filters-bar";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadDetailPanel } from "@/components/leads/lead-detail";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-bold font-[family:var(--font-serif)] mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={`rounded-lg p-2 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </CardContent>
    </Card>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({
    ...DEFAULT_FILTERS,
    // Domyślnie pokazuj tylko bez strony — najgorętsze leady
    source: "all",
  });
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => { setLeads(data.leads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const industries = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => l.industry && s.add(l.industry));
    return Array.from(s).sort();
  }, [leads]);

  const cities = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => l.city && s.add(l.city));
    return Array.from(s).sort();
  }, [leads]);

  // Stats
  const stats = useMemo(() => {
    const noSite    = leads.filter(l => l.snippet?.includes("_NO_SITE_")).length;
    const contacted = leads.filter(l => l.status === "contacted").length;
    const interested = leads.filter(l => l.status === "interested").length;
    const converted = leads.filter(l => l.status === "converted").length;
    const withPhone = leads.filter(l => l.phone).length;
    return { noSite, contacted, interested, converted, withPhone, total: leads.length };
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.source !== "all" && lead.source !== filters.source) return false;
      if (lead.score < filters.minScore) return false;
      if (filters.status !== "all" && (lead.status || "new") !== filters.status) return false;
      if (filters.industry !== "all" && lead.industry !== filters.industry) return false;
      if (filters.city !== "all" && lead.city !== filters.city) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const s = `${lead.title} ${lead.summary} ${lead.phone || ""} ${lead.industry || ""} ${lead.city || ""}`.toLowerCase();
        if (!s.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filters]);

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
        toast.success(`Status → ${status}`);
      }
    } catch { toast.error("Błąd aktualizacji"); }
  };

  const handleExport = async () => {
    const res = await fetch("/api/leads/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family:var(--font-serif)] text-3xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} z {stats.total} leadów</p>
        </div>
        <button onClick={handleExport} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Export CSV
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Bez strony"
          value={stats.noSite}
          sub="cold call targets"
          icon={GlobeOff}
          color="bg-destructive/10 text-destructive"
        />
        <StatCard
          label="Z telefonem"
          value={stats.withPhone}
          sub={`z ${stats.total} leadów`}
          icon={Phone}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="Zadzwoniono"
          value={stats.contacted + stats.interested + stats.converted}
          sub={`${stats.interested} zainteresowanych`}
          icon={Users}
          color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Konwersja"
          value={stats.converted > 0 ? `${Math.round(stats.converted / Math.max(stats.contacted + stats.interested + stats.converted, 1) * 100)}%` : "—"}
          sub={`${stats.converted} zamkniętych`}
          icon={TrendingUp}
          color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <LeadFiltersBar filters={filters} onChange={setFilters} industries={industries} cities={cities} />
      <LeadsTable leads={filtered} onSelect={setSelected} onStatusChange={handleStatusChange} />
      <LeadDetailPanel lead={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
    </div>
  );
}
