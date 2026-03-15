import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import WebSocket from "ws";
initializeApp();
const STREAMERS_COLLECTION = "streamers";
const DONATIONS_COLLECTION = "donations";
const WS_RUN_MS = 8 * 60 * 1000; // 8분 후 종료 (Functions 타임아웃 9분 전)
function isAfreecaDonation(data) {
    return (typeof data === "object" &&
        data !== null &&
        "type" in data &&
        data.type === "AFREECA_DONATION" &&
        "payAmount" in data);
}
/**
 * Bianca API WebSocket에 연결해 후원 이벤트를 받아 Firestore에 저장합니다.
 * Cloud Scheduler로 5~10분마다 호출하거나, 수동으로 HTTP 호출하면 됩니다.
 * 호출 시 즉시 200을 반환하고, 백그라운드에서 8분간 WebSocket 수신 후 종료됩니다.
 */
export const biancaDonationListener = onRequest({ timeoutSeconds: 540, memory: "256MiB" }, async (req, res) => {
    res.status(200).send("Bianca listener started. Running for 8 minutes.");
    const db = getFirestore();
    const streamersSnap = await db.collection(STREAMERS_COLLECTION).get();
    const streamers = streamersSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((s) => s.platform === "SOOP" && s.soopId?.trim());
    if (streamers.length === 0) {
        console.log("No streamers with SOOP soopId, exiting.");
        return;
    }
    const sockets = [];
    const closeAll = () => {
        sockets.forEach((ws) => {
            try {
                ws.close();
            }
            catch (e) {
                console.error(e);
            }
        });
        sockets.length = 0;
    };
    for (const streamer of streamers) {
        const bjId = streamer.soopId.trim();
        const url = `ws://streamer.biancaapi.com?platformId=afreeca&bjId=${encodeURIComponent(bjId)}`;
        const ws = new WebSocket(url);
        ws.on("message", async (raw) => {
            try {
                const data = JSON.parse(raw.toString());
                if (!isAfreecaDonation(data))
                    return;
                await db.collection(DONATIONS_COLLECTION).add({
                    streamerId: streamer.id,
                    streamerName: streamer.name,
                    platform: "afreeca",
                    nickname: data.nickname ?? "",
                    message: data.message ?? "",
                    payAmount: Number(data.payAmount) || 0,
                    at: Date.now(),
                });
            }
            catch (e) {
                console.error("Donation parse/save error:", e);
            }
        });
        ws.on("error", (err) => {
            console.error(`WS error [${streamer.name}]:`, err.message);
        });
        sockets.push(ws);
    }
    setTimeout(() => {
        closeAll();
        console.log("Bianca listener finished after 8 minutes.");
    }, WS_RUN_MS);
});
