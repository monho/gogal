"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Streamer } from "@/types/streamer";
import type { FirestoreStreamer } from "@/types/streamer";

const STREAMERS_COLLECTION = "streamers";
const POLL_INTERVAL_MS = 60_000;

export function useStreamers() {
  const [liveList, setLiveList] = useState<Streamer[]>([]);
  const [offlineList, setOfflineList] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStreamers = async () => {
    try {
      setError(null);
      const snapshot = await getDocs(collection(db, STREAMERS_COLLECTION));
      const registered = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (FirestoreStreamer & { id: string })[];

      const results = await Promise.all(
        registered.map(async (streamer): Promise<Streamer> => {
          const base = {
            id: streamer.id,
            name: streamer.name,
            title: "방송 종료",
            category: "-",
            viewers: 0,
            status: "offline" as const,
            role: streamer.role,
            guild: streamer.team,
            thumbnail: undefined,
            soopId: streamer.soopId,
            platform: streamer.platform,
          };

          if (streamer.platform === "SOOP" && streamer.soopId) {
            try {
              const res = await fetch(
                `/api/afreeca/live?bj_id=${encodeURIComponent(streamer.soopId)}`
              );
              const liveData = await res.json();

              if (liveData.isLive) {
                return {
                  ...base,
                  title: liveData.title ?? base.title,
                  category: liveData.category ?? base.category,
                  viewers: liveData.viewers ?? 0,
                  status: "live",
                  thumbnail: liveData.thumbnail,
                };
              }
            } catch (e) {
              console.error(`[${streamer.name}] 방송 정보 로드 실패:`, e);
            }
          }

          return base;
        })
      );

      const live = results.filter((s) => s.status === "live");
      const offline = results.filter((s) => s.status === "offline");

      live.sort((a, b) => b.viewers - a.viewers);
      offline.sort((a, b) => a.name.localeCompare(b.name));

      setLiveList(live);
      setOfflineList(offline);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("스트리머 로드 실패"));
      setLiveList([]);
      setOfflineList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreamers();
    const interval = setInterval(loadStreamers, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return {
    liveList,
    offlineList,
    allStreamers: [...liveList, ...offlineList],
    loading,
    error,
    refetch: loadStreamers,
  };
}
