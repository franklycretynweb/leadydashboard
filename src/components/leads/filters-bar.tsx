"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface LeadFilters {
  source: string;
  minScore: number;
  search: string;
  status: string;
  industry: string;
  city: string;
}

export const DEFAULT_FILTERS: LeadFilters = {
  source: "all",
  minScore: 0,
  search: "",
  status: "all",
  industry: "all",
  city: "all",
};

const SOURCES  = ["all", "maps", "facebook", "google", "olx", "zleca"];
const STATUSES = ["all", "new", "contacted", "interested", "rejected", "converted"];
const SCORE_PRESETS = [
  { label: "All", value: 0 },
  { label: "70+", value: 70 },
  { label: "85+", value: 85 },
];

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
        active
          ? "bg-primary/10 text-primary border-primary/30"
          : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-border/80"
      }`}
    >
      {children}
    </button>
  );
}

export function LeadFiltersBar({
  filters,
  onChange,
  industries,
  cities,
}: {
  filters: LeadFilters;
  onChange: (f: LeadFilters) => void;
  industries: string[];
  cities: string[];
}) {
  const hasActive =
    filters.source !== "all" || filters.minScore > 0 || filters.search !== "" ||
    filters.status !== "all" || filters.industry !== "all" || filters.city !== "all";

  return (
    <div className="rounded-xl border bg-card p-3 space-y-2.5">
      {/* Row 1: Source + Score + Status */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">Source</span>
          {SOURCES.map((s) => (
            <Pill key={s} active={filters.source === s} onClick={() => onChange({ ...filters, source: s })}>
              {s === "all" ? "All" : s}
            </Pill>
          ))}
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">Score</span>
          {SCORE_PRESETS.map((p) => (
            <Pill key={p.value} active={filters.minScore === p.value} onClick={() => onChange({ ...filters, minScore: p.value })}>
              {p.label}
            </Pill>
          ))}
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">Status</span>
          {STATUSES.map((s) => (
            <Pill key={s} active={filters.status === s} onClick={() => onChange({ ...filters, status: s })}>
              {s === "all" ? "All" : s}
            </Pill>
          ))}
        </div>
      </div>

      {/* Row 2: Industry + City + Search + Clear */}
      <div className="flex flex-wrap items-center gap-2">
        {industries.length > 0 && (
          <select
            value={filters.industry}
            onChange={(e) => onChange({ ...filters, industry: e.target.value })}
            className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs text-foreground outline-none focus:border-ring"
          >
            <option value="all">All industries</option>
            {industries.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        )}
        {cities.length > 0 && (
          <select
            value={filters.city}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
            className="h-8 rounded-md border border-input bg-transparent px-2.5 text-xs text-foreground outline-none focus:border-ring"
          >
            <option value="all">All cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <Input
          placeholder="Szukaj..."
          className="h-8 text-xs flex-1 min-w-[180px]"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
        {hasActive && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
