/**
 * frontend/src/components/Settings.jsx
 */

import { useTheme } from "../context/ThemeContext";
import { useAuth  } from "../context/AuthContext";
import { useState, useEffect } from "react";
import SettingsModal from "./SettingsModal";
import AppLockModal from "./AppLockModal";
import { api } from "../utils/api";

export default function Settings({ onClose, onLock, preferences, setPreferences }) {

  const { C, theme, toggle } = useTheme();
  const { logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showAppLock, setShowAppLock] = useState(false);
  const [appLock, setAppLock] = useState({ enabled: false, timeout: 5 });

  // Fetch app lock settings
  useEffect(() => {
    api.getAppLock().then(({ user }) => setAppLock(user.appLock || { enabled: false, timeout: 5 }));
  }, [showAppLock]);

  const refreshAppLock = async () => {
    const { user } = await api.getAppLock();
    setAppLock(user.appLock || { enabled: false, timeout: 5 });
  };

  const rows = [
    { icon: "🌙", label: "Dark Mode",      sub: `Currently ${theme}`,              action: toggle },
    { icon: "🔒", label: "App Lock",       sub: appLock.enabled ? `Enabled · ${appLock.timeout} min` : "Set PIN / biometrics", action: () => setShowAppLock(true) },
    { icon: "🔐", label: "Encryption",     sub: "End-to-end · active",             action: null },
    { icon: "🔔", label: "Notifications",  sub: "Push & badges · on",              action: () => setShowModal(true) },
    { icon: "🚪", label: "Log Out",        sub: "Sign out of your account",        action: () => { onClose(); logout(); } },
  ];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme === "dark" ? "#1e1e1e" : "#fff",
        borderRadius: 26, padding: "36px 32px",
        width: 360, boxShadow: "0 24px 72px rgba(0,0,0,0.3)",
        border: `1px solid ${C.border}`,
        fontFamily: "Georgia, serif",
        position: "relative"
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 22 }}>
          ⚙️ Settings
        </div>


        {rows.map(({ icon, label, sub, action }) => (
          <div key={label} onClick={action || undefined} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "15px 0", borderBottom: `1px solid ${C.border}`,
            cursor: action ? "pointer" : "default",
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 14, color: C.text }}>{label}</div>
                <div style={{ fontSize: 12, color: C.subtext, marginTop: 2 }}>{sub}</div>
              </div>
            </div>
            {action && <span style={{ color: C.accentHex, fontSize: 20 }}>›</span>}
          </div>
        ))}


        {/* Show SettingsModal only when showModal is true */}
        <SettingsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          preferences={preferences}
          setPreferences={setPreferences}
        />

        {/* Show AppLockModal only when showAppLock is true */}
        <AppLockModal
          isOpen={showAppLock}
          onClose={() => setShowAppLock(false)}
          appLock={appLock}
          refreshAppLock={refreshAppLock}
        />

        <button onClick={onClose} style={{
          marginTop: 24, width: "100%", padding: 13, borderRadius: 14,
          background: C.accentHex, border: "none", color: "#fff",
          fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif",
          boxShadow: `0 4px 14px rgba(0,188,212,0.35)`,
        }}>
          Done
        </button>
      </div>
    </div>
  );
}