"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const SETTINGS_DOC = "app";
const SETTINGS_COLLECTION = "settings";
const USERS_COLLECTION = "users";

export const ADMIN_ONLY_LOGIN_MESSAGE =
  "로그인을 못하게하고 관리자만 로그인이 가능합니다.";

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function getAllowNormalLogin(): Promise<boolean> {
  const ref = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC);
  const snap = await getDoc(ref);
  const data = snap.data();
  return data?.allowNormalLogin === true;
}

async function getUserIsAdmin(uid: string): Promise<boolean> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  const data = snap.data();
  return data?.isAdmin === true;
}

/** 로그인 시 users/{uid} 문서가 없으면 생성 (isAdmin: false). Firestore 규칙에서 본인 uid 문서만 create 가능해야 함 */
async function ensureUserDoc(uid: string, firebaseUser: User): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, {
    isAdmin: false,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName ?? "",
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const admin = await getUserIsAdmin(u.uid);
        setIsAdmin(admin);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const uid = cred.user.uid;

    try {
      await ensureUserDoc(uid, cred.user);
    } catch (e) {
      console.error("users 문서 생성 실패 (Firestore 규칙 확인):", e);
      await firebaseSignOut(auth);
      setUser(null);
      throw new Error(
        "회원 정보 저장에 실패했습니다. Firestore 규칙에서 users 컬렉션 create 권한을 확인해 주세요."
      );
    }

    const allowNormal = await getAllowNormalLogin();
    if (allowNormal) {
      const admin = await getUserIsAdmin(uid);
      setIsAdmin(admin);
      return;
    }

    const admin = await getUserIsAdmin(uid);
    if (!admin) {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
      throw new Error(ADMIN_ONLY_LOGIN_MESSAGE);
    }
    setIsAdmin(true);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value: AuthContextValue = {
    user,
    isAdmin,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
