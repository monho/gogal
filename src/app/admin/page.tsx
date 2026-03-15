"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, Users, LogIn, Heart } from "lucide-react";
import { getAppSettings, setAppSettings, type AppSettings } from "@/lib/settings";

const STREAMERS_COLLECTION = "streamers";

export default function AdminPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [streamerCount, setStreamerCount] = useState<number | null>(null);

  useEffect(() => {
    getAppSettings().then(setSettings);
  }, []);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, STREAMERS_COLLECTION));
        setStreamerCount(snapshot.size);
      } catch (e) {
        console.error(e);
      }
    };
    loadCount();
  }, []);

  const handleAllowNormalChange = (allow: boolean) => {
    if (settings === null) return;
    setSettings((s) => (s ? { ...s, allowNormalLogin: allow } : null));
    setSaved(false);
  };

  const handleSaveLoginMode = async () => {
    if (settings === null) return;
    setSaving(true);
    setSaved(false);
    try {
      await setAppSettings({ allowNormalLogin: settings.allowNormalLogin });
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">관리자</h1>
        <p className="text-muted-foreground">
          서버 설정 및 스트리머를 관리합니다.
          {streamerCount !== null && (
            <span className="ml-1 font-medium text-foreground">등록 스트리머 {streamerCount}명</span>
          )}
        </p>
      </div>

      {/* 로그인 모드 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            로그인 모드
          </CardTitle>
          <CardDescription>
            관리자 로그인만 허용하면 users 컬렉션에서 isAdmin이 true인 유저만 로그인할 수 있습니다.
            일반 로그인 허용 시 모든 구글 계정으로 로그인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings === null ? (
            <p className="text-sm text-muted-foreground">로딩 중...</p>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Label className="flex cursor-pointer items-center gap-2 font-normal">
                  <input
                    type="radio"
                    name="loginMode"
                    checked={!settings.allowNormalLogin}
                    onChange={() => handleAllowNormalChange(false)}
                    className="h-4 w-4"
                  />
                  관리자 로그인만 허용 (users 컬렉션 isAdmin true만 로그인 가능)
                </Label>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Label className="flex cursor-pointer items-center gap-2 font-normal">
                  <input
                    type="radio"
                    name="loginMode"
                    checked={settings.allowNormalLogin}
                    onChange={() => handleAllowNormalChange(true)}
                    className="h-4 w-4"
                  />
                  일반 로그인 허용 (관리자가 아니어도 로그인 가능)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleSaveLoginMode} disabled={saving}>
                  {saving ? "저장 중..." : "저장"}
                </Button>
                {saved && (
                  <span className="text-sm text-muted-foreground">저장되었습니다.</span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              스트리머 추가
            </CardTitle>
            <CardDescription>
              새 스트리머를 등록합니다. 이름, 플랫폼, BJ ID(soopId) 등을 입력하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/streamers/new">스트리머 추가하기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              스트리머 목록
              {streamerCount !== null && (
                <span className="text-base font-normal text-muted-foreground">({streamerCount}명)</span>
              )}
            </CardTitle>
            <CardDescription>
              등록된 스트리머 목록을 보고 수정·삭제할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/admin/streamers">목록 보기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              후원 API 연동
            </CardTitle>
            <CardDescription>
              스트리머 목록에서 BJ ID(soopId)가 등록된 스트리머는 Bianca API로 후원 연동됩니다. 후원 대시보드에서 실시간 후원·순위를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/admin/donations">후원 대시보드</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
