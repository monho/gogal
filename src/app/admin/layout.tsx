"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?from=admin");
      return;
    }
    if (!isAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!user || (!loading && !isAdmin)) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-[1600px] p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                로그인: {user.email ?? "(이메일 없음)"}
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
