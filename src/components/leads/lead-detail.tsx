"use client";

import { Phone, Mail, MapPin, Copy, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Lead, LeadStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const STATUS_OPTIONS: { value: LeadStatus; label: string; className: string }[] = [
  { value: "new",       label: "New",       className: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300"          },
  { value: "contacted", label: "Contacted", className: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"      },
  { value: "interested",label: "Interested",className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"},
  { value: "rejected",  label: "Rejected",  className: "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400"      },
  { value: "converted", label: "Converted", className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"  },
];

function copy(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} skopiowany`);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

export function LeadDetailPanel({
  lead,
  onClose,
  onStatusChange,
}: {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
}) {
  return (
    <AnimatePresence>
      {lead && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-background border-l shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b">
              <div className="min-w-0 flex-1 pr-4">
                <p className="text-base font-semibold leading-tight">{lead.title}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`font-mono font-bold text-xl tabular-nums ${
                      lead.score >= 85 ? "text-emerald-600 dark:text-emerald-400"
                      : lead.score >= 70 ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground"
                    }`}
                  >
                    {lead.score}
                  </span>
                  <span className="text-xs text-muted-foreground">score</span>
                  <Badge variant="outline" className="text-[10px]">{lead.source}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* Status */}
              <Section title="Status">
                <div className="flex gap-1.5 flex-wrap">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onStatusChange(lead.id, opt.value)}
                      className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all border ${
                        (lead.status || "new") === opt.value
                          ? opt.className
                          : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Section>

              <Separator />

              {/* Owner */}
              {lead.owner?.full_name && (
                <Section title="Właściciel (CEIDG)">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{lead.owner.full_name}</p>
                    {lead.owner.nip && (
                      <p className="text-xs text-muted-foreground">NIP: {lead.owner.nip}</p>
                    )}
                  </div>
                </Section>
              )}

              {/* Contact */}
              {(lead.phone || lead.email || lead.address) && (
                <Section title="Kontakt">
                  <div className="space-y-2">
                    {lead.phone && (
                      <button
                        onClick={() => copy(lead.phone!, "Telefon")}
                        className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors w-full text-left"
                      >
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-mono">{lead.phone}</span>
                        <Copy className="w-3 h-3 ml-auto text-muted-foreground/40 hover:text-muted-foreground" />
                      </button>
                    )}
                    {lead.email && (
                      <button
                        onClick={() => copy(lead.email!, "Email")}
                        className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors w-full text-left"
                      >
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        {lead.email}
                        <Copy className="w-3 h-3 ml-auto text-muted-foreground/40 hover:text-muted-foreground" />
                      </button>
                    )}
                    {lead.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {lead.address}
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Details */}
              <Section title="Szczegóły">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  {lead.industry && <><span className="text-muted-foreground">Branża</span><span>{lead.industry}</span></>}
                  {lead.city && <><span className="text-muted-foreground">Miasto</span><span>{lead.city}</span></>}
                  <span className="text-muted-foreground">Intent</span>
                  <span>{lead.classification?.intent ?? 0}/3</span>
                  <span className="text-muted-foreground">Readiness</span>
                  <span>{lead.classification?.buying_readiness ?? 0}/3</span>
                  <span className="text-muted-foreground">Stage</span>
                  <span className="capitalize">{lead.classification?.business_stage ?? "—"}</span>
                </div>
              </Section>

              {lead.summary && (
                <>
                  <Separator />
                  <Section title="Summary">
                    <p className="text-sm text-muted-foreground leading-relaxed">{lead.summary}</p>
                  </Section>
                </>
              )}

              {lead.classification?.reasoning && (
                <Section title="AI Reasoning">
                  <p className="text-xs text-muted-foreground leading-relaxed">{lead.classification.reasoning}</p>
                </Section>
              )}

              <Separator />

              {/* Outreach */}
              <Section title="Outreach">
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Subject</span>
                    <button onClick={() => copy(lead.outreach?.subject ?? "", "Subject")} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-medium">{lead.outreach?.subject}</p>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Message</span>
                    <button onClick={() => copy(lead.outreach?.message ?? "", "Message")} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{lead.outreach?.message}</p>
                </div>
              </Section>

              {lead.url && (
                <a
                  href={lead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open source
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
