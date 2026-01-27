"use client"

import { Home, LayoutDashboard, Settings } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { Namespaces, SidebarKeys } from "@/i18n/keys"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const mainItems = [
  { key: SidebarKeys.home, href: "/", icon: Home },
  { key: SidebarKeys.workspace, href: "/workspace", icon: LayoutDashboard },
]

const footerItems = [
  { key: SidebarKeys.settings, href: "/settings", icon: Settings },
]

export function IconSidebar() {
  const t = useTranslations(Namespaces.Sidebar)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="bg-sidebar border-sidebar-border flex h-svh w-14 shrink-0 flex-col items-center border-r py-4">
        <nav className="flex flex-1 flex-col items-center gap-1">
          {mainItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg transition-colors",
                    "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.href) &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{t(item.key)}</TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <nav className="flex flex-col items-center gap-1">
          {footerItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg transition-colors",
                    "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.href) &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{t(item.key)}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
