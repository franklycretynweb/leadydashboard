"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAVIGATION } from "@/components/layout/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            OS
          </div>
          {open && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">OffScript</p>
              <p className="truncate text-xs text-sidebar-foreground/60">Lead Pipeline</p>
            </div>
          )}
        </div>
        {open && (
          <Badge variant="outline" className="w-fit border-sidebar-border text-sidebar-foreground/70">
            Dashboard
          </Badge>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {APP_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={!open ? "justify-center px-0" : undefined}
                >
                  <Link href={item.href}>
                    <Icon className="size-4 shrink-0" />
                    {open && <span>{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="space-y-3">
        <div className={open ? "flex items-center justify-between gap-3" : "flex justify-center"}>
          {open && (
            <div className="min-w-0">
              <p className="text-xs font-medium">Theme</p>
              <p className="text-xs text-sidebar-foreground/60">Light, dark or system</p>
            </div>
          )}
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
