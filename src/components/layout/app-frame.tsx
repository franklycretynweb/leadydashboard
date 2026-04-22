"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { APP_NAVIGATION } from "@/components/layout/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const currentSection = useMemo(
    () => APP_NAVIGATION.find((item) => pathname.startsWith(item.href)),
    [pathname]
  );

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <SidebarInset>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="min-h-screen"
          >
            <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
              <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <SidebarTrigger />
                <p className="text-sm font-medium">
                  {currentSection?.label ?? "OffScript"}
                </p>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </motion.div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
