"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DonationItem } from "@/types/donation";
import { Heart } from "lucide-react";

interface DonationPanelProps {
  donations: DonationItem[];
  connectionStatus: "idle" | "connecting" | "connected" | "error";
}

function formatAmount(platform: string, amount: number): string {
  if (platform === "afreeca") return `별풍선 ${amount}개`;
  return `${amount.toLocaleString()}원`;
}

export function DonationPanel({ donations, connectionStatus }: DonationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          실시간 후원 (Bianca 연동)
          {connectionStatus === "connecting" && (
            <span className="text-xs font-normal text-muted-foreground">연결 중...</span>
          )}
          {connectionStatus === "connected" && (
            <span className="text-xs font-normal text-green-600 dark:text-green-400">연결됨</span>
          )}
          {connectionStatus === "error" && (
            <span className="text-xs font-normal text-destructive">연결 오류</span>
          )}
        </CardTitle>
        <CardDescription>
          등록된 스트리머(BJ ID)로 Bianca API 후원 이벤트를 실시간 수신합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {connectionStatus === "idle"
              ? "후원 연동 가능한 스트리머가 없습니다. (관리자에서 BJ ID 등록)"
              : "아직 수신된 후원이 없습니다."}
          </p>
        ) : (
          <ul className="space-y-2 max-h-[240px] overflow-y-auto">
            {donations.map((d) => (
              <li
                key={d.id}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{d.streamerName}</span>
                  <span className="shrink-0 text-primary font-medium">
                    {formatAmount(d.platform, d.payAmount)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-muted-foreground">
                  <span>{d.nickname}</span>
                  {d.message.trim() && (
                    <span className="truncate" title={d.message}>
                      · {d.message}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
