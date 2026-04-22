"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

type SidebarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  children,
}: React.PropsWithChildren<{ defaultOpen?: boolean }>) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const saved = window.localStorage.getItem("app-sidebar-open")
    if (saved !== null) {
      setOpen(saved === "true")
    }

    const mediaQuery = window.matchMedia("(max-width: 1023px)")
    const handleMediaChange = () => setIsMobile(mediaQuery.matches)
    handleMediaChange()
    mediaQuery.addEventListener("change", handleMediaChange)

    return () => mediaQuery.removeEventListener("change", handleMediaChange)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setMobileOpen((current) => !current)
      return
    }

    setOpen((current) => {
      const next = !current
      window.localStorage.setItem("app-sidebar-open", String(next))
      return next
    })
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        mobileOpen,
        setMobileOpen,
        isMobile,
        toggleSidebar,
      }}
    >
      <div className="group/sidebar-wrapper min-h-screen w-full">{children}</div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const { open, mobileOpen, setMobileOpen, isMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className={cn("w-[18rem] p-0", className)}
        >
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      data-slot="sidebar"
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden border-r bg-sidebar text-sidebar-foreground transition-[width] duration-300 lg:flex lg:flex-col",
        open ? "w-64" : "w-20",
        className
      )}
    >
      {children}
    </aside>
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("border-b border-sidebar-border p-3", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto px-2 py-3", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("border-t border-sidebar-border p-3", className)}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  const { open } = useSidebar()

  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "min-h-screen transition-[padding-left] duration-300 lg:pl-64",
        !open && "lg:pl-20",
        className
      )}
      {...props}
    />
  )
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={className}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("grid gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("list-none", className)}
      {...props}
    />
  )
}

function SidebarMenuButton({
  isActive = false,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { isActive?: boolean }) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "h-10 w-full justify-start gap-3 px-3 text-sm",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        !isActive &&
          "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
