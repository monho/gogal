"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { DonationItem } from "@/types/donation";

/** HTTPS면 wss, 로컬(http)이면 문서대로 ws 사용 */
const WS_BASE =
  typeof window !== "undefined" && window.location.protocol === "https:"
    ? "wss://streamer.biancaapi.com"
    : "ws://streamer.biancaapi.com";
const MAX_DONATIONS = 50;

interface StreamerForDonation {
  id: string;
  name: string;
  soopId?: string;
  platform?: string;
}

function isAfreecaDonation(data: unknown): data is { type: string; nickname: string; message: string; payAmount: number; BJID: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as { type: string }).type === "AFREECA_DONATION" &&
    "payAmount" in data
  );
}

/**
 * 관리자에 등록된 스트리머(soopId 있음)로 Bianca API WebSocket에 연결해
 * 실시간 후원 이벤트를 수집합니다.
 * @see https://biancaapi.com/docs
 */
export function useBiancaDonations(streamers: StreamerForDonation[]) {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const wsRef = useRef<Map<string, WebSocket>>(new Map());

  const addDonation = useCallback((item: DonationItem) => {
    setDonations((prev) => {
      const next = [item, ...prev];
      return next.slice(0, MAX_DONATIONS);
    });
  }, []);

  const connectionKey = useMemo(
    () =>
      streamers
        .filter((s) => s.platform === "SOOP" && s.soopId?.trim())
        .map((s) => `${s.id}:${s.soopId ?? ""}`)
        .sort()
        .join(","),
    [streamers]
  );

  useEffect(() => {
    const afreecaStreamers = streamers.filter((s) => s.platform === "SOOP" && s.soopId?.trim());
    if (afreecaStreamers.length === 0) {
      setConnectionStatus("idle");
      return;
    }

    setConnectionStatus("connecting");
    let openCount = 0;

    afreecaStreamers.forEach((streamer) => {
      const bjId = streamer.soopId!.trim();
      const url = `${WS_BASE}?platformId=afreeca&bjId=${encodeURIComponent(bjId)}`;
      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        console.error(`[Bianca] WebSocket 생성 실패: ${streamer.name}`, e);
        return;
      }

      wsRef.current.set(streamer.id, ws);

      ws.onopen = () => {
        openCount += 1;
        if (openCount >= afreecaStreamers.length) {
          setConnectionStatus("connected");
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (isAfreecaDonation(data)) {
            addDonation({
              id: `${streamer.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              streamerId: streamer.id,
              streamerName: streamer.name,
              platform: "afreeca",
              nickname: data.nickname ?? "",
              message: data.message ?? "",
              payAmount: Number(data.payAmount) || 0,
              at: Date.now(),
            });
          }
        } catch {
          // ignore parse error
        }
      };

      ws.onerror = () => {
        setConnectionStatus("error");
      };

      ws.onclose = () => {
        wsRef.current.delete(streamer.id);
      };
    });

    return () => {
      wsRef.current.forEach((ws) => ws.close());
      wsRef.current.clear();
      setConnectionStatus("idle");
    };
  }, [connectionKey, addDonation]);

  return { donations, connectionStatus };
}
