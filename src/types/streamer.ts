export type StreamStatus = "live" | "offline";

export interface Streamer {
  id: string;
  name: string;
  title: string;
  category: string;
  viewers: number;
  status: StreamStatus;
  role?: "operator";
  guild?: string;
  thumbnail?: string;
  /** 아프리카/SOOP BJ ID - 방송국 페이지 링크에 사용 */
  soopId?: string;
}

export interface FirestoreStreamer {
  name: string;
  platform?: string;
  team?: string;
  soopId?: string;
  role?: "operator";
  [key: string]: unknown;
}
