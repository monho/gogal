"use client";

import { useEffect, useRef, useState } from "react";
import type { Streamer } from "@/types/streamer";

const INTERVAL_MS = 5 * 60 * 1000; // 5분
const MAX_POINTS = 24; // 5분 간격 24개 = 2시간

function formatTime(d: Date): string {
  return d.toTimeString().slice(0, 5); // "HH:mm"
}

/** 라이브 스트리머 시청자 합계 */
function totalViewers(liveList: Streamer[]): number {
  return liveList.reduce((sum, s) => sum + (s.viewers ?? 0), 0);
}

/**
 * 시청자 추이용 실제 데이터.
 * useStreamers의 라이브 목록 시청자 합계를 5분마다 한 번씩 기록해 최근 2시간치를 반환합니다.
 */
export function useViewerHistory(liveList: Streamer[], loading: boolean) {
  const [chartData, setChartData] = useState<{ time: string; viewers: number }[]>([]);
  const totalRef = useRef(0);
  const hasInitialized = useRef(false);

  totalRef.current = totalViewers(liveList);

  // 첫 데이터 로드 시 현재 시청자로 한 점 추가 (0명이어도 표시)
  useEffect(() => {
    if (loading || hasInitialized.current) return;
    hasInitialized.current = true;
    const t = formatTime(new Date());
    setChartData([{ time: t, viewers: totalRef.current }]);
  }, [loading]);

  // 5분마다 현재 시청자 합계를 한 점 추가
  useEffect(() => {
    const id = setInterval(() => {
      const viewers = totalRef.current;
      const time = formatTime(new Date());
      setChartData((prev) => {
        const next = [...prev, { time, viewers }];
        return next.slice(-MAX_POINTS);
      });
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return chartData;
}
