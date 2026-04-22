export type LeadStatus = "new" | "contacted" | "interested" | "rejected" | "converted";

export interface Lead {
  id: string;
  source: string;
  url: string;
  title: string;
  summary: string;
  text_snippet: string;
  timestamp: string;
  score: number;
  status: LeadStatus;
  industry?: string;
  city?: string;
  phone?: string;
  email?: string;
  address?: string;
  owner?: { first_name: string; last_name: string; full_name: string; nip: string } | null;
  pkd_code?: string;
  business_age_days?: number;
  has_website?: boolean;
  classification: {
    intent: number;
    buying_readiness: number;
    business_stage: string;
    website_need: string;
    reasoning: string;
  };
  outreach: {
    subject: string;
    message: string;
  };
  scraped_at: string;
  query: string;
  snippet?: string;
  _file?: string;
}
