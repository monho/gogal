"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus } from "lucide-react";

const STREAMERS_COLLECTION = "streamers";

interface StreamerDoc {
  id: string;
  name: string;
  platform?: string;
  soopId?: string;
  team?: string;
  role?: string;
}

export default function AdminStreamersPage() {
  const [streamers, setStreamers] = useState<StreamerDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snapshot = await getDocs(collection(db, STREAMERS_COLLECTION));
        setStreamers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as StreamerDoc[]
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            관리자로 돌아가기
          </Link>
        </Button>
        <Button asChild>
          <Link href="/admin/streamers/new" className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            스트리머 추가
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>등록된 스트리머</CardTitle>
          <CardDescription>
            Firestore streamers 컬렉션에 등록된 목록입니다. 수정·삭제는 Firebase 콘솔에서 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">로딩 중...</p>
          ) : streamers.length === 0 ? (
            <p className="text-muted-foreground">등록된 스트리머가 없습니다.</p>
          ) : (
            <ul className="divide-y divide-border">
              {streamers.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <span className="font-medium">{s.name}</span>
                    {s.role === "operator" && (
                      <span className="ml-2 text-xs text-muted-foreground">(운영자)</span>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {s.platform ?? "SOOP"} {s.soopId && `· ${s.soopId}`} {s.team && `· ${s.team}`}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
