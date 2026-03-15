"use client";

import Link from "next/link";
import { MagicCard } from "@/components/magic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Streamer } from "@/types/streamer";
import { Radio, User } from "lucide-react";

export function StreamerCard({ streamer, layout = "default" }: { streamer: Streamer; layout?: "default" | "compact" }) {
  const isLive = streamer.status === "live";
  const streamerPageHref = `/streamer/${streamer.id}`;

  return (
    <Link href={streamerPageHref} className="block cursor-pointer" target="_blank" rel="noopener noreferrer">
    <MagicCard className="p-0 overflow-hidden">
      <div className="aspect-video bg-muted/50 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
        {isLive ? (
          <span className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded bg-red-500/90 px-1.5 py-0.5 text-xs font-medium text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className="absolute top-2 left-2 z-20">
            <Badge variant="offline">오프라인</Badge>
          </span>
        )}
        <User className="h-12 w-12 text-muted-foreground/50 z-0" />
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium truncate">{streamer.name}</span>
          {streamer.role === "operator" && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">운영자</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate" title={streamer.title}>
          {streamer.title}
        </p>
        <div className="flex items-center justify-between pt-1">
          {isLive ? (
            <span className="text-xs text-muted-foreground">
              {streamer.viewers >= 1000
                ? `${(streamer.viewers / 1000).toFixed(1)}K`
                : streamer.viewers}
              · {streamer.category}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">{streamer.category}</span>
          )}
          <div className="flex gap-1">
            {isLive && (
              <Button size="sm" variant="live" className="h-7 text-xs">
                <Radio className="h-3 w-3" />
                멀티뷰
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-7 text-xs">
              방송보기
            </Button>
          </div>
        </div>
      </div>
    </MagicCard>
    </Link>
  );
}
