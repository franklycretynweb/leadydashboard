"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Settings {
  pkd_codes: { code: string; label: string; enabled: boolean }[];
  cities: string[];
  facebook_groups: string[];
  score_threshold: number;
}

const DEFAULT_PKD_CODES = [
  { code: "56.11.Z", label: "Restaurants / Gastro",       enabled: true  },
  { code: "96.02.Z", label: "Beauty / Hair Salons",        enabled: true  },
  { code: "93.13.Z", label: "Fitness / Gyms",              enabled: true  },
  { code: "45.20.Z", label: "Auto Repair",                 enabled: true  },
  { code: "86.21.Z", label: "Medical / Doctors",           enabled: true  },
  { code: "86.22.Z", label: "Specialist Medical",          enabled: true  },
  { code: "86.95.Z", label: "Physiotherapy",               enabled: true  },
  { code: "41.20.Z", label: "Construction",                enabled: true  },
  { code: "55.10.Z", label: "Hotels",                      enabled: true  },
  { code: "55.20.Z", label: "Tourism / Accommodation",     enabled: false },
  { code: "47.*",    label: "Retail",                      enabled: false },
  { code: "69-74",   label: "Professional Services",       enabled: false },
];

const DEFAULT_CITIES = [
  "Warszawa","Krakow","Wroclaw","Poznan","Gdansk",
  "Lodz","Katowice","Szczecin","Lublin","Bydgoszcz",
];

const DEFAULT_GROUPS = [
  "https://www.facebook.com/groups/zakladamfirme",
  "https://www.facebook.com/groups/wlasna.firma",
  "https://www.facebook.com/groups/marketing.internetowy",
  "https://www.facebook.com/groups/freelancerzy",
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    pkd_codes: DEFAULT_PKD_CODES,
    cities: DEFAULT_CITIES,
    facebook_groups: DEFAULT_GROUPS,
    score_threshold: 60,
  });
  const [newCity, setNewCity]   = useState("");
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  const save = async () => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  const togglePkd  = (code: string) =>
    setSettings((s) => ({ ...s, pkd_codes: s.pkd_codes.map((p) => p.code === code ? { ...p, enabled: !p.enabled } : p) }));
  const removeCity = (city: string) =>
    setSettings((s) => ({ ...s, cities: s.cities.filter((c) => c !== city) }));
  const addCity = () => {
    if (newCity.trim() && !settings.cities.includes(newCity.trim())) {
      setSettings((s) => ({ ...s, cities: [...s.cities, newCity.trim()] }));
      setNewCity("");
    }
  };
  const removeGroup = (url: string) =>
    setSettings((s) => ({ ...s, facebook_groups: s.facebook_groups.filter((g) => g !== url) }));
  const addGroup = () => {
    if (newGroup.trim() && !settings.facebook_groups.includes(newGroup.trim())) {
      setSettings((s) => ({ ...s, facebook_groups: [...s.facebook_groups, newGroup.trim()] }));
      setNewGroup("");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-[family:var(--font-serif)] text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Konfiguracja pipeline&apos;u lead generation.</p>
      </div>

      {/* PKD Codes */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Target industries</CardTitle>
            <CardDescription className="text-xs">Branże do scrapowania z Google Maps.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {settings.pkd_codes.map((pkd) => (
                <button
                  key={pkd.code}
                  onClick={() => togglePkd(pkd.code)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border ${
                    pkd.enabled
                      ? "bg-primary/5 border-primary/20 text-foreground"
                      : "bg-transparent border-border text-muted-foreground opacity-50 hover:opacity-70"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                    pkd.enabled ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {pkd.enabled && (
                      <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-mono">{pkd.code}</p>
                    <p className="text-xs text-muted-foreground">{pkd.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cities */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Target cities</CardTitle>
            <CardDescription className="text-xs">Miasta w których scraper szuka firm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {settings.cities.map((city) => (
                <Badge key={city} variant="secondary" className="gap-1.5 pr-1.5">
                  {city}
                  <button onClick={() => removeCity(city)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCity()}
                placeholder="Dodaj miasto..."
                className="h-8 text-xs"
              />
              <Button size="sm" variant="outline" onClick={addCity} className="h-8 gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Facebook Groups */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Facebook Groups</CardTitle>
            <CardDescription className="text-xs">Grupy do monitorowania (wymaga FACEBOOK_COOKIES w .env).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              {settings.facebook_groups.map((url) => (
                <div key={url} className="flex items-center justify-between px-3 py-2 rounded-md border bg-muted/30">
                  <span className="text-xs text-muted-foreground truncate">{url}</span>
                  <button onClick={() => removeGroup(url)} className="text-muted-foreground/40 hover:text-destructive transition-colors ml-2 shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGroup()}
                placeholder="https://www.facebook.com/groups/..."
                className="h-8 text-xs"
              />
              <Button size="sm" variant="outline" onClick={addGroup} className="h-8 gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Threshold */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Score threshold</CardTitle>
            <CardDescription className="text-xs">Leady poniżej tego progu nie pojawią się w domyślnym widoku.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                value={settings.score_threshold}
                onChange={(e) => setSettings((s) => ({ ...s, score_threshold: parseInt(e.target.value) }))}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-mono font-bold w-8 text-right tabular-nums">{settings.score_threshold}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator />

      <Button onClick={save} className="gap-2">
        <Save className="w-4 h-4" />
        Save settings
      </Button>
    </div>
  );
}
