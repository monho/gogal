"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

const STREAMERS_COLLECTION = "streamers";
const AFREECA_PLAY_URL = "https://play.afreecatv.com";

export default function StreamerPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [status, setStatus] = useState<"loading" | "found" | "notfound">("loading");

  useEffect(() => {
    if (!id) {
      setStatus("notfound");
      return;
    }

    const go = async () => {
      try {
        const ref = doc(db, STREAMERS_COLLECTION, id);
        const snap = await getDoc(ref);
        const data = snap.data();
        const soopId = data?.soopId as string | undefined;

        if (soopId) {
          setStatus("found");
          window.location.href = `${AFREECA_PLAY_URL}/${soopId}`;
          return;
        }
      } catch (e) {
        console.error(e);
      }
      setStatus("notfound");
    };

    go();
  }, [id]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-muted-foreground">방송국으로 이동 중...</p>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">방송국 정보를 찾을 수 없습니다.</p>
        <Button asChild variant="outline">
          <Link href="/">메인으로</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <p className="text-muted-foreground">방송국 페이지로 이동 중...</p>
    </div>
  );
}
