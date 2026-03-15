"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const STREAMERS_COLLECTION = "streamers";

export default function NewStreamerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<"SOOP">("SOOP");
  const [soopId, setSoopId] = useState("");
  const [team, setTeam] = useState("");
  const [role, setRole] = useState<"operator" | "normal">("normal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (platform === "SOOP" && !soopId.trim()) {
      setError("SOOP 사용 시 BJ ID(soopId)를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const data: Record<string, string> = {
        name: name.trim(),
        platform: platform || "SOOP",
      };
      if (soopId.trim()) data.soopId = soopId.trim();
      if (team.trim()) data.team = team.trim();
      if (role === "operator") data.role = "operator";

      await addDoc(collection(db, STREAMERS_COLLECTION), data);
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "스트리머 추가에 실패했습니다. Firebase 규칙을 확인해 주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin" className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          관리자로 돌아가기
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>스트리머 추가</CardTitle>
          <CardDescription>
            메인 페이지에 노출될 스트리머를 등록합니다. SOOP(아프리카) BJ ID는 방송 여부 조회에 사용됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                placeholder="스트리머 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>플랫폼</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as "SOOP")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOOP">SOOP (아프리카)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {platform === "SOOP" && (
              <div className="space-y-2">
                <Label htmlFor="soopId">BJ ID (soopId) *</Label>
                <Input
                  id="soopId"
                  placeholder="아프리카 BJ ID"
                  value={soopId}
                  onChange={(e) => setSoopId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  방송 여부 조회에 사용됩니다. 예: bjapi.afreecatv.com/api/[이 ID]/station
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="team">팀 / 길드</Label>
              <Input
                id="team"
                placeholder="팀 또는 길드명 (선택)"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>역할</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "operator" | "normal")}>
                <SelectTrigger>
                  <SelectValue placeholder="일반" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">일반</SelectItem>
                  <SelectItem value="operator">운영자</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "등록 중..." : "등록"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin">취소</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
