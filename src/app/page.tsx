"use client";

import Link from "next/link";
import { ViewerChart } from "@/components/viewer-chart";
import { StreamerCard } from "@/components/streamer-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { useStreamers } from "@/hooks/use-streamers";
import { useViewerHistory } from "@/hooks/use-viewer-history";
import { LogIn, LogOut, Radio, Settings, Users } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [layoutCols, setLayoutCols] = useState("6");
  const { liveList, offlineList, loading, error } = useStreamers();
  const viewerHistory = useViewerHistory(liveList, loading);
  const { user, isAdmin, signOut } = useAuth();
  const totalCount = liveList.length + offlineList.length;

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더: 입주자 통계 */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <nav className="flex items-center gap-6 text-sm">
            <span className="font-semibold text-foreground">입주자통계</span>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              위키
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-sm">
              <span className="flex items-center gap-1.5 text-live">
                <Radio className="h-3.5 w-3.5" />
                라이브 {liveList.length}
              </span>
              <span className="text-muted-foreground">오프라인 {offlineList.length}</span>
            </div>
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin" className="gap-1.5">
                      <Settings className="h-3.5 w-3.5" />
                      관리
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
                  {isAdmin ? "관리자 로그아웃" : "로그아웃"}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="h-3.5 w-3.5" />
                  관리자 로그인
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* 히어로: 타이틀 + 설명 */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">고갈서버</h1>
            <Badge variant="secondary" className="font-normal">
              진행예정 (2026.04~)
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            미요의 고갈서버 지휘통제실
          </p>
        </section>

        {/* 필터 + 검색 */}
        <section className="flex flex-wrap items-center gap-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all">전체 {totalCount}</TabsTrigger>
              <TabsTrigger value="live">라이브만 {liveList.length}</TabsTrigger>
              <TabsTrigger value="offline">오프라인만 {offlineList.length}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select defaultValue="role-all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="역할" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role-all">전체</SelectItem>
              <SelectItem value="operator">운영자 4</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="guild-all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="길드" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="guild-all">전체</SelectItem>
              <SelectItem value="suni">수니그룹 17</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="sort-default">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sort-default">기본정렬</SelectItem>
              <SelectItem value="viewers">시청자수 내림차순</SelectItem>
              <SelectItem value="name">이름순 (가나다)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={layoutCols} onValueChange={setLayoutCols}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="배치" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2열</SelectItem>
              <SelectItem value="4">4열</SelectItem>
              <SelectItem value="6">기본 6열</SelectItem>
              <SelectItem value="8">8열</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* 시청자 추이 차트 (Nivo) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              시청자 추이
            </CardTitle>
            <CardDescription>시간대별 시청자 수 (실제 라이브 합계, 5분마다 기록)</CardDescription>
          </CardHeader>
          <CardContent>
            <ViewerChart data={viewerHistory} />
          </CardContent>
        </Card>

        {/* 로딩 / 에러 */}
        {loading && totalCount === 0 && (
          <div className="flex items-center justify-center min-h-[280px]">
            <div className="text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <p className="mt-3 text-muted-foreground">스트리머 목록 로딩 중...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error.message}
          </div>
        )}

        {/* 라이브 중 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-live animate-pulse" />
            라이브 중
            <span className="text-sm font-normal text-muted-foreground">
              {liveList.length}명
            </span>
          </h2>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${layoutCols}, minmax(0, 1fr))`,
            }}
          >
            {(statusFilter === "all" || statusFilter === "live") &&
              liveList.map((s) => (
                <StreamerCard key={s.id} streamer={s} />
              ))}
          </div>
        </section>

        {/* 오프라인 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            오프라인
            <span className="text-sm font-normal text-muted-foreground">
              {offlineList.length}명 1 / 3 페이지
            </span>
          </h2>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${layoutCols}, minmax(0, 1fr))`,
            }}
          >
            {(statusFilter === "all" || statusFilter === "offline") &&
              offlineList.map((s) => (
                <StreamerCard key={s.id} streamer={s} />
              ))}
          </div>
          <div className="flex justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" disabled>
              이전
            </Button>
            <Button variant="secondary" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              다음
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          본 사이트는 SOOP 관련 서비스와 제휴 관계가 없으며, 모든 상표는 각 소유자에게 귀속됩니다.
          <br />
          (c) 2026 MOONHO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
