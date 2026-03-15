"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useStreamers } from "@/hooks/use-streamers";
import { useBiancaDonations } from "@/hooks/use-bianca-donations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Trophy, TrendingUp } from "lucide-react";
import type { DonationItem } from "@/types/donation";

function formatAmount(platform: string, amount: number): string {
  if (platform === "afreeca") return `별풍선 ${amount.toLocaleString()}개`;
  return `${amount.toLocaleString()}원`;
}

export default function AdminDonationsPage() {
  const { liveList, offlineList, loading } = useStreamers();
  const allStreamers = useMemo(
    () =>
      [...liveList, ...offlineList].map((s) => ({
        id: s.id,
        name: s.name,
        soopId: s.soopId,
        platform: s.platform,
      })),
    [liveList, offlineList]
  );
  const { donations, connectionStatus } = useBiancaDonations(allStreamers);

  const { byStreamer, ranking } = useMemo(() => {
    const map = new Map<
      string,
      { streamerId: string; streamerName: string; total: number; count: number }
    >();
    for (const d of donations) {
      const cur = map.get(d.streamerId);
      if (cur) {
        cur.total += d.payAmount;
        cur.count += 1;
      } else {
        map.set(d.streamerId, {
          streamerId: d.streamerId,
          streamerName: d.streamerName,
          total: d.payAmount,
          count: 1,
        });
      }
    }
    const list = Array.from(map.values()).sort((a, b) => b.total - a.total);
    return { byStreamer: list, ranking: list };
  }, [donations]);

  const totalAmount = useMemo(
    () => donations.reduce((s, d) => s + d.payAmount, 0),
    [donations]
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              관리자로 돌아가기
            </Link>
          </Button>
          <h1 className="mt-2 text-2xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-7 w-7 text-red-500" />
            후원 대시보드
          </h1>
          <p className="text-muted-foreground mt-1">
            Bianca API 실시간 후원 · 스트리머별 금액 · 후원 순위 (현재 세션 기준)
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {connectionStatus === "connecting" && (
            <span className="text-muted-foreground">연결 중...</span>
          )}
          {connectionStatus === "connected" && (
            <span className="text-green-600 dark:text-green-400 font-medium">Bianca 연동됨</span>
          )}
          {connectionStatus === "error" && (
            <span className="text-destructive font-medium">연결 오류</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <>
          {/* 요약 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  총 후원 (현재 세션)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  별풍선 {totalAmount.toLocaleString()}개
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  후원 건수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{donations.length}건</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  연동 스트리머
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {allStreamers.filter((s) => s.platform === "SOOP" && s.soopId?.trim()).length}명
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 후원 순위 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                후원 순위
              </CardTitle>
              <CardDescription>
                현재 세션에서 수신된 후원 금액 기준 스트리머 순위입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ranking.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  아직 수신된 후원이 없습니다. Bianca에 스트리머 연동 후 후원이 들어오면 표시됩니다.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium">순위</th>
                        <th className="text-left py-3 px-2 font-medium">스트리머</th>
                        <th className="text-right py-3 px-2 font-medium">후원 합계</th>
                        <th className="text-right py-3 px-2 font-medium">건수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((row, i) => (
                        <tr key={row.streamerId} className="border-b border-border/50">
                          <td className="py-3 px-2">
                            <span className="font-medium">
                              {i + 1 === 1 ? "1위" : i + 1 === 2 ? "2위" : i + 1 === 3 ? "3위" : `${i + 1}위`}
                            </span>
                          </td>
                          <td className="py-3 px-2">{row.streamerName}</td>
                          <td className="py-3 px-2 text-right font-medium">
                            별풍선 {row.total.toLocaleString()}개
                          </td>
                          <td className="py-3 px-2 text-right text-muted-foreground">
                            {row.count}건
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 스트리머별 후원 금액 (동일 데이터, 카드 형태 선택) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                스트리머별 후원 금액
              </CardTitle>
              <CardDescription>
                스트리머별 후원 합계입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {byStreamer.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  후원 데이터가 없습니다.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {byStreamer.map((row) => (
                    <div
                      key={row.streamerId}
                      className="rounded-lg border border-border bg-muted/20 p-4"
                    >
                      <p className="font-medium">{row.streamerName}</p>
                      <p className="text-lg font-bold text-primary mt-1">
                        별풍선 {row.total.toLocaleString()}개
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{row.count}건</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 최근 후원 내역 */}
          <Card>
            <CardHeader>
              <CardTitle>최근 후원 내역</CardTitle>
              <CardDescription>
                실시간으로 수신된 최근 후원 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  아직 수신된 후원이 없습니다.
                </p>
              ) : (
                <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                  {donations.map((d) => (
                    <RecentDonationRow key={d.id} item={d} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function RecentDonationRow({ item }: { item: DonationItem }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.streamerName}</span>
          <span className="text-primary font-medium">
            {formatAmount(item.platform, item.payAmount)}
          </span>
        </div>
        <div className="mt-0.5 text-muted-foreground truncate">
          {item.nickname}
          {item.message.trim() ? ` · ${item.message}` : ""}
        </div>
      </div>
    </li>
  );
}
