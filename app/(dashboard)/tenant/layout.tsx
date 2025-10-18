// app/(dashboard)/tenant/layout.tsx
"use client";

import { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { Home, FileText, Bell, CreditCard, LogOut, ChevronLeft, ChevronRight, User, Settings, History, HelpCircle } from "lucide-react";
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

const tenantMenuItems = [
  {
    name: "Tableau de bord",
    href: "/tenant/dashboard",  
    icon: Home,
  },
  {
    name: "Mes Locations",
    href: "/tenant/rentals",
    icon: Home,
  },
  {
    name: "Paiements",
    href: "/tenant/payments",
    icon: CreditCard,
  },
  {
    name: "Factures & Reçus",
    href: "/tenant/invoices",
    icon: FileText,
  },
  {
    name: "Historique",
    href: "/tenant/history",
    icon: History,
  },
  {
    name: "Notifications",
    href: "/tenant/notifications",
    icon: Bell,
  },
  {
    name: "Aide & Support",
    href: "/tenant/support",
    icon: HelpCircle,
  },
  {
    name: "Paramètres",
    href: "/tenant/settings",
    icon: Settings,
  },
];

export default function TenantLayout({
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
            <Link href="/tenant/dashboard" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">RHM Locataire</span>
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
          {tenantMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  sidebarCollapsed ? "justify-center" : "justify-start"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "flex-shrink-0",
                    isActive ? "text-purple-600" : "text-gray-500 group-hover:text-gray-700"
                  )} 
                />
                {!sidebarCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-purple-700 font-medium mb-2">Prochain paiement</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600">Loyer du mois</span>
                <span className="text-sm font-semibold text-purple-800">75,000 FCFA</span>
              </div>
              <div className="text-xs text-purple-500 mt-1">Échéance: 05/12/2024</div>
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
              <h1 className="text-2xl font-bold text-gray-900">Espace Locataire</h1>
              <p className="text-sm text-gray-600">
                Gérez vos locations et paiements en toute simplicité
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 rounded-full">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {!sidebarCollapsed && (
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Locataire</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Locataire</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/tenant/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tenant/dashboard/settings">
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