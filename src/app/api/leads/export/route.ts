import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LEADS_DIR = path.join(process.cwd(), "..", "data", "leads");
const STATUS_FILE = path.join(process.cwd(), "..", "data", "lead_statuses.json");

function loadStatuses(): Record<string, string> {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      return JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

function escapeCSV(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function GET() {
  try {
    if (!fs.existsSync(LEADS_DIR)) {
      return new NextResponse("No data", { status: 404 });
    }

    const files = fs
      .readdirSync(LEADS_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();

    const statuses = loadStatuses();
    const leads: Record<string, unknown>[] = [];

    for (const file of files) {
      const content = fs.readFileSync(path.join(LEADS_DIR, file), "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        for (const lead of parsed) {
          if (statuses[lead.id]) lead.status = statuses[lead.id];
          leads.push(lead);
        }
      }
    }

    leads.sort(
      (a, b) => ((b.score as number) || 0) - ((a.score as number) || 0)
    );

    const headers = [
      "id", "score", "status", "source", "title", "summary",
      "industry", "city", "phone", "email", "url",
      "intent", "readiness", "business_stage", "website_need",
      "outreach_subject", "outreach_message", "scraped_at",
    ];

    const rows = leads.map((l) => {
      const c = (l.classification || {}) as Record<string, unknown>;
      const o = (l.outreach || {}) as Record<string, unknown>;
      return [
        String(l.id || ""),
        String(l.score || ""),
        String(l.status || "new"),
        String(l.source || ""),
        String(l.title || ""),
        String(l.summary || ""),
        String(l.industry || ""),
        String(l.city || ""),
        String(l.phone || ""),
        String(l.email || ""),
        String(l.url || ""),
        String(c.intent || ""),
        String(c.buying_readiness || ""),
        String(c.business_stage || ""),
        String(c.website_need || ""),
        String(o.subject || ""),
        String(o.message || "").replace(/\n/g, " "),
        String(l.scraped_at || ""),
      ]
        .map(escapeCSV)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return new NextResponse(String(error), { status: 500 });
  }
}
