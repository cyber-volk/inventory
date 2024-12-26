"use client"

import { useEffect, useState } from "react"
import { Home, Package, Users, TrendingUp, BarChart2, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/', roles: ["admin", "manager", "warehouse"] },
  { icon: Package, label: 'Inventory', href: '/inventory', roles: ["admin", "manager", "warehouse"] },
  { icon: Users, label: 'Suppliers', href: '/suppliers', roles: ["admin", "manager"] },
  { icon: TrendingUp, label: 'Stock Movements', href: '/stock-movements', roles: ["admin", "manager", "warehouse"] },
  { icon: BarChart2, label: 'Reports', href: '/reports', roles: ["admin", "manager"] },
  { icon: Settings, label: 'Settings', href: '/settings', roles: ["admin"] },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const userString = localStorage.getItem("user")
    if (userString) {
      const user = JSON.parse(userString)
      setUserRole(user.role)
    }
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Inventory App</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                userRole && item.roles.includes(userRole) && (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

