// MessageBanner.jsx
// Displays in-app notification banner for new messages.
import React from "react";

export default function MessageBanner({ sender, text, onClose }) {
  if (!sender || !text) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", zIndex: 9999,
      background: "#00bcd4", color: "#fff", padding: "16px 24px", fontSize: 16,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 2px 12px #0002"
    }}>
      <span>
        <strong>{sender}</strong>: {text}
      </span>
      <button onClick={onClose} style={{ marginLeft: 24, background: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 600, cursor: "pointer", color: "#d81b60", fontSize: 16 }}>Dismiss</button>
    </div>
  );
}
