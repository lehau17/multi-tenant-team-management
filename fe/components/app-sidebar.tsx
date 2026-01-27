"use client"

import { FolderKanban, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { Namespaces, SidebarKeys } from "@/i18n/keys"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react"

type SidebarItem = {
  title: string
  href: string
  icon: LucideIcon
}

type SidebarConfig = {
  title: string
  items: SidebarItem[]
} | null

function usePageSidebar(): SidebarConfig {
  const t = useTranslations(Namespaces.Sidebar)
  const pathname = usePathname()

  if (pathname.startsWith("/workspace")) {
    return {
      title: t(SidebarKeys.workspace),
      items: [
        {
          title: t(SidebarKeys.projects),
          href: "/workspace/projects",
          icon: FolderKanban,
        },
        {
          title: t(SidebarKeys.members),
          href: "/workspace/members",
          icon: Users,
        },
      ],
    }
  }

  return null
}

export function AppSidebar() {
  const pathname = usePathname()
  const config = usePageSidebar()

  if (!config) return null

  return (
    <Sidebar>
      <SidebarHeader className="p-4 font-semibold">
        {config.title}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {config.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
