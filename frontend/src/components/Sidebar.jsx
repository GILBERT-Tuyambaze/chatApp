/**
 * frontend/src/components/Sidebar.jsx
 */

import { useTheme } from "../context/ThemeContext";
import { useAuth  } from "../context/AuthContext";

export default function Sidebar({ partners, activePartner, setActivePartner, onLock, onSettingsOpen, onConnectionClick, onMyProfileOpen, pendingCount }) {
  const { C, theme, toggle } = useTheme();
  const { user } = useAuth();
  // Helper to check if avatar is a URL
  const isAvatarUrl = (val) => typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/uploads/') || val.match(/\.(jpg|jpeg|png|gif|webp)$/i));

  // Multi-user: show all partners as a list
  const getId = (p) => p._id || p.id;

  const s = {
    root: {
      width: 280, flexShrink: 0,
      background: C.sidebar,
      display: "flex", flexDirection: "column",
      borderRight: `1px solid ${C.border}`,
      height: '100vh', // Ensure sidebar takes full height
    },
    header: {
      padding: "22px 18px 14px",
      borderBottom: `1px solid ${C.border}`,
    },
    title: {
      fontSize: 19, fontWeight: "bold",
      color: C.text, fontFamily: "Georgia, serif",
      display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
    },
    search: {
      width: "100%", padding: "9px 14px", borderRadius: 22,
      border: `1px solid ${C.border}`, background: C.inputBg,
      color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box",
    },
    contact: {
      margin: "10px 12px", borderRadius: 16,
      background: "rgba(255,255,255,0.55)",
      border: `1px solid ${C.border}`,
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 12,
      cursor: "pointer",
    },
    avatar: {
      width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg, ${C.accentHex}, #ff6b9d)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, position: "relative",
      boxShadow: `0 2px 10px rgba(0,188,212,0.3)`,
    },
    footer: {
      display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      borderTop: `1px solid ${C.border}`,
      padding: '10px 0',
      background: C.sidebar,
    },
    iconBtn: {
      background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.text, padding: 8, borderRadius: 10,
      transition: 'background 0.2s',
    },
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  return (
    <div style={s.root} className={isMobile ? 'sidebar-mobile' : ''}>
      <div style={s.header}>
        <div style={s.title}>
          <span aria-hidden="true">💌</span>
          <span>Us, Always</span>
        </div>
        <input style={s.search} placeholder="🔍  Search messages…" readOnly aria-label="Search messages" />
      </div>
      {/* Multi-user: partner list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {partners && partners.length > 0 ? partners.map((p) => (
          <div
            key={getId(p)}
            style={{
              ...s.contact,
              background: getId(p) === getId(activePartner) ? '#ffe3ef' : s.contact.background,
              border: getId(p) === getId(activePartner) ? '2px solid #d81b60' : s.contact.border,
              boxShadow: getId(p) === getId(activePartner) ? '0 2px 12px #d81b6022' : s.contact.boxShadow,
            }}
            tabIndex={0}
            role="button"
            aria-label={`Chat with ${p.display_name || p.username}`}
            onClick={() => setActivePartner(p)}
          >
            <div style={s.avatar} aria-label="Partner avatar">
              {isAvatarUrl(p.avatar) ? (
                <img src={p.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                p.avatar || "🌸"
              )}
              {/* Online/offline dot */}
              <span style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: p.is_online ? '#4caf50' : '#bdbdbd',
                border: '2px solid #fff',
                boxShadow: '0 0 4px #0002',
                display: 'inline-block',
              }} title={p.is_online ? 'Online' : 'Offline'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
                  {p.display_name || p.username}
                </span>
                {/* Optionally, last seen or online status */}
              </div>
              {p.bio && <div style={{ fontSize: 12, color: C.subtext, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.bio}</div>}
            </div>
          </div>
        )) : (
          <div style={{ color: '#b71c1c', textAlign: 'center', marginTop: 32 }}>No partners yet</div>
        )}
        {/* My mini-profile */}
        {user && (
          <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ ...s.avatar, width: 32, height: 32, fontSize: 15 }} aria-label="My avatar">
              {isAvatarUrl(user.avatar) ? (
                <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                user.avatar || "💫"
              )}
            </div>
            <div style={{ fontSize: 12, color: C.subtext }}>
              Logged in as <strong style={{ color: C.text }}>{user.display_name || user.username}</strong>
            </div>
          </div>
        )}
      </div>
      {/* Footer: icon bar (always visible, mobile = only this) */}
      <div
        style={{
          ...s.footer,
          ...(isMobile
            ? {
                margin: 0,
                padding: 0,
                borderTop: 'none',
                borderRight: `1px solid ${C.border}`,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: C.sidebar,
                height: 60,
              }
            : {})
        }}
      >
        <button
          style={{ ...s.iconBtn, ...(isMobile ? { width: 44, height: 44, fontSize: 22 } : {}) }}
          onClick={onMyProfileOpen}
          title="My Profile"
          aria-label="Open my profile"
        >
          👤
        </button>
        <button
          style={{ ...s.iconBtn, ...(isMobile ? { width: 44, height: 44, fontSize: 22 } : {}) }}
          onClick={onConnectionClick}
          title="Connection Requests"
          aria-label="Connection Requests"
        >
          <span style={{ fontSize: 20, position: 'relative' }}>➕
            {pendingCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, background: '#d81b60', color: '#fff', borderRadius: '50%', fontSize: 11, padding: '2px 6px', fontWeight: 700
              }}>{pendingCount}</span>
            )}
          </span>
        </button>
        <button
          style={{ ...s.iconBtn, ...(isMobile ? { width: 44, height: 44, fontSize: 22 } : {}) }}
          onClick={onSettingsOpen}
          title="Settings"
          aria-label="Open settings"
        >
          ⚙️
        </button>
        <button
          style={{ ...s.iconBtn, ...(isMobile ? { width: 44, height: 44, fontSize: 22 } : {}) }}
          onClick={toggle}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button
          style={{ ...s.iconBtn, ...(isMobile ? { width: 44, height: 44, fontSize: 22 } : {}) }}
          onClick={onLock}
          title="Lock app"
          aria-label="Lock app"
        >
          🔒
        </button>
      </div>
    </div>
  );
}