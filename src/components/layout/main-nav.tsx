"use client";

import { Link, usePathname } from "@/i18n/navigation"; // Use next-intl's Link and usePathname
import type { NavItem, UserRole } from "@/types"; 
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListOrdered,
  ClipboardCheck,
  SettingsIcon,
  Sparkles,
  Landmark 
} from "lucide-react";
import { useTranslations } from 'next-intl';

const currentUserRole: UserRole = 'Doctor'; 

// Fix allNavItems type to include fallbackTitle and titleKey
const allNavItems: (Omit<NavItem, 'title'> & { titleKey: string; fallbackTitle: string })[] = [
  {
    fallbackTitle: "Dashboard", 
    titleKey: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ['Doctor', 'Assistant'],
  },
  {
    fallbackTitle: "Patients",
    titleKey: "patients",
    href: "/patients",
    icon: Users,
    roles: ['Doctor', 'Assistant'],
  },
  {
    fallbackTitle: "Appointments",
    titleKey: "appointments",
    href: "/appointments",
    icon: CalendarDays,
    roles: ['Doctor', 'Assistant'],
  },
  {
    fallbackTitle: "Patient Queue",
    titleKey: "patientQueue",
    href: "/queue",
    icon: ListOrdered,
    roles: ['Doctor', 'Assistant'],
  },
  {
    fallbackTitle: "Check-in Kiosk",
    titleKey: "checkInKiosk",
    href: "/check-in",
    icon: ClipboardCheck,
    roles: ['Doctor', 'Assistant'],
  },
  {
    fallbackTitle: "AI Assistant",
    titleKey: "aiAssistant",
    href: "/assistant",
    icon: Sparkles,
    roles: ['Doctor', 'Assistant'],
  },
  {
    fallbackTitle: "Financials",
    titleKey: "financials",
    href: "/financials",
    icon: Landmark,
    roles: ['Doctor'], 
  },
  {
    fallbackTitle: "Settings",
    titleKey: "settings",
    href: "/settings",
    icon: SettingsIcon,
    roles: ['Doctor', 'Assistant'],
  },
];

export function MainNav() {
  const pathname = usePathname();
  const t = useTranslations('Dashboard');
  const translate = (key: string, fallback: string) => t(key, { default: fallback });

  const navItems = allNavItems.filter(item => 
    !item.roles || item.roles.includes(currentUserRole)
  );

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const translatedTitle = translate(item.titleKey, item.fallbackTitle);
        // Check if the current pathname (without locale) starts with the item's href
        // This logic is for highlighting parent nav items for nested routes
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <SidebarMenuItem key={item.titleKey}>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                className={cn(
                  "w-full justify-start",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                isActive={isActive}
                tooltip={{ children: translatedTitle, className: "bg-primary text-primary-foreground"}}
              >
                <item.icon className="h-5 w-5" /> 
                <span className="truncate">{translatedTitle}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
