/** Bianca API 아프리카 후원 이벤트 (https://biancaapi.com/docs) */
export interface AfreecaDonationEvent {
  type: "AFREECA_DONATION";
  nickname: string;
  message: string;
  payAmount: number;
  BJID: string;
}

/** 치지직 후원 이벤트 */
export interface ChzzkDonationEvent {
  error: boolean;
  type: "CHZZK_DONATION";
  status: number;
  nickname: string;
  message: string;
  payAmount: number;
  msgTime?: number;
  channelId: string | null;
}

export type DonationEvent = AfreecaDonationEvent | ChzzkDonationEvent;

/** UI에 표시할 후원 정보 (스트리머 이름 포함) */
export interface DonationItem {
  id: string;
  streamerId: string;
  streamerName: string;
  platform: "afreeca" | "chzzk";
  nickname: string;
  message: string;
  payAmount: number;
  at: number;
}
