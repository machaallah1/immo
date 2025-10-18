// app/(dashboard)/owner/layout.tsx
"use client";

import { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { Building2, Users, Home, BarChart3, Settings, FileText, Bell, CreditCard, LogOut, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ownerMenuItems = [
  {
    name: "Tableau de bord",
    href: "/owner/dashboard",
    icon: BarChart3,
  },
  {
    name: "Mes Propriétés",
    href: "/owner/properties",
    icon: Building2,
  },
  {
    name: "Mes Locataires",
    href: "/owner/tenants",
    icon: Users,
  },
  {
    name: "Paiements",
    href: "/owner/payments",
    icon: CreditCard,
  },
  {
    name: "Factures",
    href: "/owner/invoices",
    icon: FileText,
  },
  {
    name: "Contrats",
    href: "/owner/contracts",
    icon: FileText,
  },
  {
    name: "Notifications",
    href: "/owner/notifications",
    icon: Bell,
  },
  {
    name: "Paramètres",
    href: "/owner/settings",
    icon: Settings,
  },
];

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <Link href="/owner/dashboard" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RHM Propriétaire</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {ownerMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  sidebarCollapsed ? "justify-center" : "justify-start"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "flex-shrink-0",
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                  )} 
                />
                {!sidebarCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">Propriétés</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">8</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-blue-700 font-medium">Locataires</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">24</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Espace Propriétaire</h1>
              <p className="text-sm text-gray-600">
                Gérez vos propriétés et locataires en toute simplicité
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 rounded-full">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {!sidebarCollapsed && (
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Propriétaire</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Propriétaire</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/owner/profile">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/owner/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}