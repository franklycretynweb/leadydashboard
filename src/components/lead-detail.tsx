"use client";

import type { Lead } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} skopiowany`);
}

export function LeadDetail({
  lead,
  onClose,
}: {
  lead: Lead | null;
  onClose: () => void;
}) {
  if (!lead) return null;

  return (
    <Dialog open={!!lead} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="pr-8 leading-tight">{lead.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Score + Meta */}
            <div className="flex flex-wrap gap-2">
              <Badge
                className={
                  lead.score >= 80
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                }
              >
                Score: {lead.score}
              </Badge>
              <Badge variant="outline">{lead.source}</Badge>
              <Badge variant="outline">
                Intent: {lead.classification.intent}/3
              </Badge>
              <Badge variant="outline">
                Readiness: {lead.classification.buying_readiness}/3
              </Badge>
              <Badge variant="outline" className="capitalize">
                {lead.classification.business_stage}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {lead.classification.website_need}
              </Badge>
            </div>

            {/* URL */}
            <div>
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline break-all"
              >
                {lead.url}
              </a>
            </div>

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{lead.summary}</p>
              </CardContent>
            </Card>

            {/* AI Reasoning */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {lead.classification.reasoning}
                </p>
              </CardContent>
            </Card>

            {/* Text Snippet */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Fragment tekstu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                  {lead.text_snippet}
                </p>
              </CardContent>
            </Card>

            {/* Outreach */}
            <Card className="border-emerald-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-emerald-400">
                    Outreach Message
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() =>
                      copyToClipboard(lead.outreach.message, "Wiadomość")
                    }
                  >
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Subject:
                  </span>
                  <p
                    className="text-sm font-medium cursor-pointer hover:text-emerald-400 transition-colors"
                    onClick={() =>
                      copyToClipboard(lead.outreach.subject, "Subject")
                    }
                  >
                    {lead.outreach.subject}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Message:
                  </span>
                  <p className="text-sm whitespace-pre-wrap mt-1">
                    {lead.outreach.message}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Meta */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Query: {lead.query}</span>
              <span>Scraped: {new Date(lead.scraped_at).toLocaleString("pl")}</span>
              {lead._file && <span>File: {lead._file}</span>}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
