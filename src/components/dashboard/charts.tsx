"use client";

import { motion } from "framer-motion";
import type { Lead } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const COLORS = {
  ceidg: "#6B4EFF",
  gmaps: "#4EA8FF",
  facebook: "#22C55E",
  google: "#F59E0B",
  oferteo: "#EF4444",
  zleca: "#EC4899",
};

const INDUSTRY_COLORS = [
  "#6B4EFF", "#4EA8FF", "#22C55E", "#F59E0B", "#EF4444",
  "#EC4899", "#8B5CF6", "#06B6D4", "#F97316", "#84CC16",
];

function ChartCard({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-xl p-5"
    >
      <p className="text-[11px] uppercase tracking-wider text-white/35 font-medium mb-4">
        {title}
      </p>
      {children}
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-[12px]">
      <p className="text-white/50">{label}</p>
      <p className="text-white font-semibold">{payload[0].value}</p>
    </div>
  );
}

function LeadsPerDay({ leads }: { leads: Lead[] }) {
  const byDay = new Map<string, number>();
  for (const lead of leads) {
    const day = (lead.scraped_at || lead.timestamp || "").slice(0, 10);
    if (day) byDay.set(day, (byDay.get(day) || 0) + 1);
  }

  const data = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, count]) => ({
      date: date.slice(5),
      leads: count,
    }));

  if (data.length === 0) {
    data.push({ date: "today", leads: leads.length });
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B4EFF" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6B4EFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="#6B4EFF"
          strokeWidth={2}
          fill="url(#areaGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function LeadsBySource({ leads }: { leads: Lead[] }) {
  const bySource = new Map<string, number>();
  for (const lead of leads) {
    bySource.set(lead.source, (bySource.get(lead.source) || 0) + 1);
  }

  const data = Array.from(bySource.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={70}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.name}
              fill={COLORS[entry.name as keyof typeof COLORS] || INDUSTRY_COLORS[i % INDUSTRY_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="glass-strong rounded-lg px-3 py-2 text-[12px]">
                <p className="text-white font-semibold">{payload[0].name}: {payload[0].value}</p>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function LeadsByIndustry({ leads }: { leads: Lead[] }) {
  const byIndustry = new Map<string, number>();
  for (const lead of leads) {
    const ind = lead.industry || "inne";
    byIndustry.set(ind, (byIndustry.get(ind) || 0) + 1);
  }

  const data = Array.from(byIndustry.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="#4EA8FF" radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LeadsByCity({ leads }: { leads: Lead[] }) {
  const byCity = new Map<string, number>();
  for (const lead of leads) {
    const city = lead.city || "inne";
    byCity.set(city, (byCity.get(city) || 0) + 1);
  }

  const data = Array.from(byCity.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Charts({ leads }: { leads: Lead[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Leads per day" delay={0.2}>
        <LeadsPerDay leads={leads} />
      </ChartCard>
      <ChartCard title="By source" delay={0.25}>
        <LeadsBySource leads={leads} />
      </ChartCard>
      <ChartCard title="By industry" delay={0.3}>
        <LeadsByIndustry leads={leads} />
      </ChartCard>
      <ChartCard title="By city" delay={0.35}>
        <LeadsByCity leads={leads} />
      </ChartCard>
    </div>
  );
}
