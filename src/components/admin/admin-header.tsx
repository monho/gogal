"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AdminHeader() {
  const [time, setTime] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="mb-5 bg-primary shadow-lg">
      <div className="mx-auto max-w-[1920px] px-5 py-5 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-primary-foreground">
            고갈서버 지휘통제실
          </h1>
          <nav className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 font-medium text-primary-foreground/90 transition-colors hover:bg-white/10"
            >
              홈
            </Link>
            <Link
              href="/admin"
              className="rounded-lg px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-white/10"
            >
              관리자
            </Link>
          </nav>
        </div>
        <div className="text-lg font-bold font-mono text-primary-foreground min-w-[100px]">
          {mounted ? time : "--:--:--"}
        </div>
      </div>
    </header>
  );
}
