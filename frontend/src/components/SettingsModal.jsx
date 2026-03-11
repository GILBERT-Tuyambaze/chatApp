// SettingsModal.jsx
import React, { useState } from "react";

export default function SettingsModal({ isOpen, onClose, preferences, setPreferences }) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 400, margin: "80px auto", boxShadow: "0 4px 24px #0002" }}>
        <h2>Settings</h2>
        <div style={{ marginBottom: 18 }}>
          <label>
            <input type="checkbox" checked={localPrefs.notifications} onChange={e => setLocalPrefs(p => ({ ...p, notifications: e.target.checked }))} />
            Enable Notifications
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            Lock Timeout (min):
            <input type="number" min={1} value={localPrefs.lockTimeout} onChange={e => setLocalPrefs(p => ({ ...p, lockTimeout: Number(e.target.value) }))} style={{ marginLeft: 8, width: 60 }} />
          </label>
        </div>
        <button onClick={() => { setPreferences(localPrefs); onClose(); }} style={{ marginRight: 12 }}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
