"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, ADMIN_ONLY_LOGIN_MESSAGE } from "@/context/auth-context";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { signInWithGoogle, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = useMemo(() => (from === "admin" ? "/admin" : "/"), [from]);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo);
    }
  }, [authLoading, user, redirectTo, router]);

  if (user) {
    return null;
  }

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace(redirectTo);
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
      const msg = err && typeof err === "object" && "message" in err ? (err as { message?: string }).message : "";
      const message =
        code === "auth/popup-closed-by-user"
          ? "로그인 창이 닫혔습니다."
          : code === "auth/operation-not-allowed"
            ? "Google 로그인이 Firebase 콘솔에서 비활성화되어 있습니다. Authentication → Sign-in method에서 Google을 사용 설정해 주세요."
            : msg === ADMIN_ONLY_LOGIN_MESSAGE
              ? ADMIN_ONLY_LOGIN_MESSAGE
              : msg || "구글 로그인에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
          <CardDescription>
            Google 계정으로 로그인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-border bg-background hover:bg-muted"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="h-5 w-5" />
            {loading ? "로그인 중..." : "Google로 로그인"}
          </Button>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="underline hover:text-foreground">
              메인으로 돌아가기
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
