"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Filters {
  source: string;
  minScore: number;
  search: string;
}

export function FiltersBar({
  filters,
  onChange,
  files,
  selectedFile,
  onFileChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  files: string[];
  selectedFile: string;
  onFileChange: (f: string) => void;
}) {
  const sources = ["all", "google", "olx"];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Source filter */}
      <div className="flex gap-1">
        {sources.map((s) => (
          <Button
            key={s}
            variant={filters.source === s ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...filters, source: s })}
          >
            {s === "all" ? "Wszystkie" : s}
          </Button>
        ))}
      </div>

      {/* Score filter */}
      <div className="flex gap-1">
        {[0, 60, 80].map((min) => (
          <Button
            key={min}
            variant={filters.minScore === min ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...filters, minScore: min })}
          >
            {min === 0 ? "All scores" : `≥${min}`}
          </Button>
        ))}
      </div>

      {/* Search */}
      <Input
        placeholder="Szukaj..."
        className="w-48"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      {/* File selector */}
      {files.length > 1 && (
        <div className="flex gap-1 items-center">
          <span className="text-xs text-muted-foreground">Plik:</span>
          {["all", ...files].map((f) => (
            <Badge
              key={f}
              className={`cursor-pointer ${
                selectedFile === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={() => onFileChange(f)}
            >
              {f === "all" ? "Wszystkie" : f.replace("leads_", "").replace(".json", "")}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
