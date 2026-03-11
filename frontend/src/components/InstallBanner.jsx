// InstallBanner.jsx
import React, { useState, useEffect } from "react";

function isElectron() {
  // Electron sets process.versions.electron and window.process.type
  return typeof window !== "undefined" &&
    (window.process?.type === "renderer" ||
     window.navigator.userAgent.includes("Electron"));
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("desktop");

  useEffect(() => {
    if (isElectron()) {
      setShow(false);
      return;
    }
    if (isMobile()) {
      setMode("mobile");
      setShow(true);
    } else {
      setMode("desktop");
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, minWidth: 220, maxWidth: 340, zIndex: 9999,
      background: mode === "desktop" ? "rgba(242,199,199,0.92)" : "rgba(213,243,216,0.92)",
      color: "#1a1a1a", padding: "10px 18px", fontSize: 14,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 2px 12px #0002", borderRadius: 14,
      backdropFilter: "blur(4px)",
      transition: "opacity 0.2s"
    }}>
      <span style={{ flex: 1 }}>
        {mode === "desktop" ? (
          <> Download the <a href="https://github.com/GILBERT-Tuyambaze/private-couple-chat/releases" target="_blank" rel="noopener" style={{ color: "#00bcd4", fontWeight: 600 }}>desktop app</a> for the best experience!</>
        ) : (
          <> Add to home screen for a native feel! <span style={{ color: "#00bcd4", fontWeight: 600 }}>Tap browser menu  "Add to Home Screen"</span></>
        )}
      </span>
      <button onClick={() => setShow(false)} style={{ marginLeft: 12, background: "#fff", border: "none", borderRadius: 8, padding: "2px 10px", fontWeight: 600, cursor: "pointer", color: "#d81b60", fontSize: 14, opacity: 0.8 }}>×</button>
    </div>
  );
}
