"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { DonationItem } from "@/types/donation";

const DONATIONS_COLLECTION = "donations";
const MAX_ITEMS = 200;

/** Firebase Functions가 Firestore에 저장한 후원 목록을 실시간 구독 */
export function useDonationsFromFirestore() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, DONATIONS_COLLECTION),
      orderBy("at", "desc"),
      limit(MAX_ITEMS)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: DonationItem[] = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            streamerId: d.streamerId ?? "",
            streamerName: d.streamerName ?? "",
            platform: (d.platform as "afreeca" | "chzzk") ?? "afreeca",
            nickname: d.nickname ?? "",
            message: d.message ?? "",
            payAmount: Number(d.payAmount) ?? 0,
            at: Number(d.at) ?? 0,
          };
        });
        setDonations(items);
        setError(null);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    );
    setLoading(false);
    return () => unsub();
  }, []);

  return { donations, loading, error };
}
