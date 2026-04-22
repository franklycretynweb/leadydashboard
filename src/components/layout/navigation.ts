import { Users, Settings, type LucideIcon } from "lucide-react";

export type AppNavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const APP_NAVIGATION: AppNavigationItem[] = [
  { href: "/leads",    label: "Leads",    icon: Users    },
  { href: "/settings", label: "Settings", icon: Settings },
];
