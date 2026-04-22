"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Globe, GlobeOff, ArrowUpDown, Copy, Check } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type SortKey = "score" | "title" | "source" | "city" | "industry" | "scraped_at";
type SortDir = "asc" | "desc";

const SOURCE_COLORS: Record<string, string> = {
  maps:     "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  facebook: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
  google:   "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  olx:      "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  zleca:    "border-pink-500/20 bg-pink-500/10 text-pink-700 dark:text-pink-300",
};

const STATUS_COLORS: Record<string, string> = {
  new:       "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  contacted: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  interested:"border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  rejected:  "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400",
  converted: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
};

const STATUS_CYCLE: LeadStatus[] = ["new", "contacted", "interested", "rejected", "converted"];

function ScoreCell({ score }: { score: number }) {
  const color = score >= 85 ? "text-emerald-600 dark:text-emerald-400"
    : score >= 70 ? "text-amber-600 dark:text-amber-400"
    : "text-muted-foreground";
  return <span className={`font-mono font-bold tabular-nums text-sm ${color}`}>{score}</span>;
}

function CopyPhone({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    toast.success("Skopiowano numer");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5 group">
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        onClick={e => e.stopPropagation()}
        className="flex items-center gap-1 text-xs font-mono text-foreground/80 hover:text-primary transition-colors"
      >
        <Phone className="w-3 h-3 text-muted-foreground" />
        {phone}
      </a>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

export function LeadsTable({
  leads, onSelect, onStatusChange,
}: {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
  onStatusChange?: (id: string, status: LeadStatus) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...leads].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  function SortBtn({ label, k }: { label: string; k: SortKey }) {
    return (
      <button onClick={() => handleSort(k)} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortKey === k ? "text-primary" : ""}`} />
      </button>
    );
  }

  const cycleStatus = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    const current = lead.status || "new";
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onStatusChange(lead.id, next);
  };

  if (sorted.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-base font-medium text-muted-foreground">Brak leadów</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Uruchom: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">python pipeline.py --sources maps --skip-ai</code></p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Leads</CardTitle>
            <CardDescription className="text-xs">{leads.length} łącznie · kliknij wiersz aby zobaczyć szczegóły</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b bg-muted/30">
            <TableHead className="w-[60px]"><SortBtn label="Score" k="score" /></TableHead>
            <TableHead><SortBtn label="Firma" k="title" /></TableHead>
            <TableHead className="w-[75px]">Strona</TableHead>
            <TableHead className="w-[155px]">Telefon</TableHead>
            <TableHead className="w-[175px]">Email</TableHead>
            <TableHead className="w-[110px]"><SortBtn label="Branża" k="industry" /></TableHead>
            <TableHead className="w-[105px]"><SortBtn label="Miasto" k="city" /></TableHead>
            <TableHead className="w-[105px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((lead, i) => (
            <motion.tr
              key={lead.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: Math.min(i * 0.005, 0.3) }}
              onClick={() => onSelect(lead)}
              className="border-b last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <TableCell><ScoreCell score={lead.score} /></TableCell>

              {/* Firma + owner */}
              <TableCell>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-[260px]">{lead.title}</p>
                  {lead.owner?.full_name
                    ? <p className="text-xs text-primary/70 truncate max-w-[260px] mt-0.5 font-medium">{lead.owner.full_name}</p>
                    : lead.summary
                    ? <p className="text-xs text-muted-foreground truncate max-w-[260px] mt-0.5">{lead.summary}</p>
                    : null
                  }
                </div>
              </TableCell>

              {/* Strona */}
              <TableCell>
                {lead.snippet?.includes("_NO_SITE_") ? (
                  <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                    <GlobeOff className="w-3 h-3" />brak
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Globe className="w-3 h-3" />ma
                  </span>
                )}
              </TableCell>

              {/* Telefon z copy */}
              <TableCell>
                {lead.phone
                  ? <CopyPhone phone={lead.phone} />
                  : <span className="text-xs text-muted-foreground/40">—</span>
                }
              </TableCell>

              {/* Email */}
              <TableCell>
                {lead.email ? (
                  <span className="flex items-center gap-1 text-xs text-foreground/70 truncate max-w-[165px]">
                    <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </span>
                ) : <span className="text-xs text-muted-foreground/40">—</span>}
              </TableCell>

              {/* Branża */}
              <TableCell>
                <span className="text-xs text-muted-foreground">{lead.industry || "—"}</span>
              </TableCell>

              {/* Miasto */}
              <TableCell>
                {lead.city
                  ? <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{lead.city}</span>
                  : "—"
                }
              </TableCell>

              {/* Status — kliknij żeby przełączyć */}
              <TableCell>
                <button
                  onClick={(e) => cycleStatus(e, lead)}
                  title="Kliknij żeby zmienić status"
                  className="transition-opacity hover:opacity-80"
                >
                  <Badge variant="outline" className={`text-[10px] cursor-pointer ${STATUS_COLORS[lead.status || "new"] ?? ""}`}>
                    {lead.status || "new"}
                  </Badge>
                </button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
