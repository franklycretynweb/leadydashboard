"use client";

import { usePathname } from "next/navigation";
import { Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/settings": "Ustawienia",
};

export function Topbar({
  onRunPipeline,
  onExport,
}: {
  onRunPipeline?: () => void;
  onExport?: () => void;
}) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06]">
      <h1 className="text-[15px] font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-2">
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white/50 hover:text-white/80 text-[13px] gap-1.5"
            onClick={onExport}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        )}
        {onRunPipeline && (
          <Button
            size="sm"
            className="bg-[#6B4EFF] hover:bg-[#5B3EEF] text-white text-[13px] gap-1.5"
            onClick={onRunPipeline}
          >
            <Play className="w-3.5 h-3.5" />
            Run Pipeline
          </Button>
        )}
      </div>
    </header>
  );
}
