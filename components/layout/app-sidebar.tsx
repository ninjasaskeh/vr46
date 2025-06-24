"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronRight,
  LayoutDashboard,
  Package,
  Scale,
  Settings,
  Truck,
  Users,
  FileText,
  Building2,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
  Wifi
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name?: string | null
    email?: string | null
    role: string
    department?: string | null
  }
  stats?: {
    unreadNotifications: number
    lowStockMaterials: number
    todayRecords: number
  }
}

export function AppSidebar({ user, stats, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        badge: stats?.todayRecords ? stats.todayRecords : undefined,
        description: "Overview & Analytics",
      },
    ]

    const managementItems = []
    const operationsItems = []
    const systemItems = []

    // Role-based navigation
    if (["ADMIN", "MANAGER", "MARKETING"].includes(user.role)) {
      managementItems.push(
        {
          title: "Materials",
          url: "/materials",
          icon: Package,
          badge: stats?.lowStockMaterials ? stats.lowStockMaterials : undefined,
          description: "Inventory Management",
        },
        {
          title: "Suppliers",
          url: "/suppliers",
          icon: Truck,
          description: "Supplier Management",
        }
      )
    }

    if (["ADMIN", "MANAGER", "OPERATOR"].includes(user.role)) {
      operationsItems.push({
        title: "Weight Records",
        url: "/weight-records",
        icon: Scale,
        description: "Weighing Operations",
      })
    }

    if (["ADMIN", "MANAGER"].includes(user.role)) {
      operationsItems.push({
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
        description: "Analytics & Reports",
      })
    }

    if (user.role === "ADMIN") {
      systemItems.push({
        title: "Users",
        url: "/users",
        icon: Users,
        description: "User Management",
      })
    }

    // Common items for all roles
    systemItems.push({
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      badge: stats?.unreadNotifications ? stats.unreadNotifications : undefined,
      description: "System Alerts",
    })

    return {
      main: baseItems,
      management: managementItems,
      operations: operationsItems,
      system: systemItems,
    }
  }

  const navigation = getNavigationItems()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "MANAGER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "MARKETING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "OPERATOR":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
            <Scale className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">WeighScale Pro</span>
            <span className="truncate text-xs text-muted-foreground">IoT Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.description}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs animate-pulse">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        {navigation.management.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.management.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.description}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs animate-pulse">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Operations Section */}
        {navigation.operations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.operations.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.description}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* System Section */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.system.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.description}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs animate-pulse">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid gap-2 px-2 py-1">
              <div className="flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-950 p-2 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <Wifi className="size-4 text-green-600" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-medium text-green-900 dark:text-green-100">System Online</div>
                  <div className="text-green-700 dark:text-green-300">All systems operational</div>
                </div>
              </div>
              {stats && (
                <>
                  <div className="flex items-center gap-2 rounded-md bg-blue-50 dark:bg-blue-950 p-2 border border-blue-200 dark:border-blue-800">
                    <TrendingUp className="size-4 text-blue-600" />
                    <div className="flex-1 text-xs">
                      <div className="font-medium text-blue-900 dark:text-blue-100">Today Records</div>
                      <div className="text-blue-700 dark:text-blue-300">{stats.todayRecords} operations</div>
                    </div>
                  </div>
                  {stats.lowStockMaterials > 0 && (
                    <div className="flex items-center gap-2 rounded-md bg-orange-50 p-2 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                      <AlertTriangle className="size-4 text-orange-600" />
                      <div className="flex-1 text-xs">
                        <div className="font-medium text-orange-900 dark:text-orange-100">Low Stock Alert</div>
                        <div className="text-orange-700 dark:text-orange-300">{stats.lowStockMaterials} items need attention</div>
                      </div>
                    </div>
                  )}
                  {stats.unreadNotifications > 0 && (
                    <div className="flex items-center gap-2 rounded-md bg-purple-50 p-2 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                      <Bell className="size-4 text-purple-600" />
                      <div className="flex-1 text-xs">
                        <div className="font-medium text-purple-900 dark:text-purple-100">New Notifications</div>
                        <div className="text-purple-700 dark:text-purple-300">{stats.unreadNotifications} unread messages</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/50">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src="" alt={user.name || ""} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name || "User"}</span>
                <div className="flex items-center gap-1">
                  <Badge className={cn("text-xs px-1.5 py-0", getRoleColor(user.role))}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}