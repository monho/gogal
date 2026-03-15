/**
 * Bianca API WebSocket에 연결해 후원 이벤트를 받아 Firestore에 저장합니다.
 * Cloud Scheduler로 5~10분마다 호출하거나, 수동으로 HTTP 호출하면 됩니다.
 * 호출 시 즉시 200을 반환하고, 백그라운드에서 8분간 WebSocket 수신 후 종료됩니다.
 */
export declare const biancaDonationListener: import("firebase-functions/v2/https").HttpsFunction;
