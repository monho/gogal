"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, Users } from "lucide-react";

const MENU_ITEMS = [
  { name: "대시보드", path: "/admin", icon: LayoutDashboard },
  { name: "스트리머 추가", path: "/admin/streamers/new", icon: UserPlus },
  { name: "스트리머 목록", path: "/admin/streamers", icon: Users },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card min-h-screen">
      <div className="p-6">
        <h2 className="mb-6 text-xl font-bold text-foreground">관리 메뉴</h2>
        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive =
              item.path === "/admin"
                ? pathname === "/admin"
                : pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
