"use client";

import { useState } from "react";
import type { Lead } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadDetail } from "./lead-detail";

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80)
    return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">{score}</Badge>;
  if (score >= 60)
    return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-mono">{score}</Badge>;
  return <Badge variant="secondary" className="font-mono">{score}</Badge>;
}

function IntentDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i <= level ? "bg-emerald-400" : "bg-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    google: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    olx: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  return (
    <Badge className={colors[source] || "bg-muted"}>
      {source}
    </Badge>
  );
}

export function LeadTable({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<Lead | null>(null);

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">Brak leadów</p>
        <p className="text-sm mt-1">Uruchom pipeline: python run.py</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Score</TableHead>
              <TableHead className="w-[70px]">Source</TableHead>
              <TableHead>Tytuł</TableHead>
              <TableHead className="w-[200px]">Summary</TableHead>
              <TableHead className="w-[80px]">Intent</TableHead>
              <TableHead className="w-[80px]">Ready</TableHead>
              <TableHead className="w-[100px]">Stage</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelected(lead)}
              >
                <TableCell>
                  <ScoreBadge score={lead.score} />
                </TableCell>
                <TableCell>
                  <SourceBadge source={lead.source} />
                </TableCell>
                <TableCell className="font-medium max-w-[300px] truncate">
                  {lead.title}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {lead.summary}
                </TableCell>
                <TableCell>
                  <IntentDots level={lead.classification.intent} />
                </TableCell>
                <TableCell>
                  <IntentDots level={lead.classification.buying_readiness} />
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground capitalize">
                    {lead.classification.business_stage}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(lead); }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeadDetail lead={selected} onClose={() => setSelected(null)} />
    </>
  );
}
