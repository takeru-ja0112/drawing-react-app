"use client";

import { useEffect } from "react";

export default function Layout(
  {
    children,
  }:
    Readonly<{ children: React.ReactNode; }>
) {

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/custom-sw.js")
        .then((reg) => { console.log("SW registered!", reg); })
        .catch((err) => { console.error("SW registration failed!", err); alert("Service Worker登録に失敗しました。プッシュ通知は利用できません。"); });
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}