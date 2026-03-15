import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SETTINGS_COLLECTION = "settings";
const SETTINGS_DOC = "app";

export interface AppSettings {
  allowNormalLogin: boolean;
}

const defaults: AppSettings = {
  allowNormalLogin: false,
};

export async function getAppSettings(): Promise<AppSettings> {
  const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { ...defaults };
  const data = snap.data();
  return {
    allowNormalLogin: data?.allowNormalLogin === true,
  };
}

export async function setAppSettings(settings: Partial<AppSettings>): Promise<void> {
  const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
  const current = await getAppSettings();
  await setDoc(ref, { ...current, ...settings });
}
