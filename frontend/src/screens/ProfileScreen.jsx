import { useState, useEffect } from "react";

export default function ProfileScreen({ user, onUpdate, onLogout }) {
  const [form, setForm] = useState({
    display_name: user.display_name || "",
    email: user.email || "",
    username: user.username || "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    // Generate shareable link for connection
    setLink(`${window.location.origin}/connect/${user._id}`);
  }, [user]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUpdate = async () => {
    setError(""); setSuccess("");
    try {
      // Call backend to update user info
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update profile.");
      setSuccess("Profile updated!");
      onUpdate && onUpdate();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", background: "#fff", borderRadius: 18, boxShadow: "0 8px 32px #0001", padding: 32 }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 24, marginBottom: 18 }}>Your Profile</h2>
      <input style={{ width: "100%", padding: "12px 16px", borderRadius: 12, marginBottom: 12 }}
        placeholder="Display Name" value={form.display_name} onChange={e => update("display_name", e.target.value)} />
      <input style={{ width: "100%", padding: "12px 16px", borderRadius: 12, marginBottom: 12 }}
        placeholder="Email" value={form.email} onChange={e => update("email", e.target.value)} />
      <input style={{ width: "100%", padding: "12px 16px", borderRadius: 12, marginBottom: 12 }}
        placeholder="Username" value={form.username} onChange={e => update("username", e.target.value)} />
      <input style={{ width: "100%", padding: "12px 16px", borderRadius: 12, marginBottom: 12 }}
        type="password" placeholder="New Password" value={form.password} onChange={e => update("password", e.target.value)} />
      <button onClick={handleUpdate} style={{ width: "100%", padding: 14, borderRadius: 14, background: "#00bcd4", color: "#fff", fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Update Profile</button>
      {error && <div style={{ color: "#c62828", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "#388e3c", marginBottom: 8 }}>{success}</div>}
      <div style={{ marginTop: 18, fontSize: 14 }}>
        <strong>Share this link to connect:</strong>
        <div style={{ background: "#f2f2f2", padding: "8px 12px", borderRadius: 8, marginTop: 6, wordBreak: "break-all" }}>{link}</div>
      </div>
      <button onClick={onLogout} style={{ marginTop: 24, width: "100%", padding: 12, borderRadius: 12, background: "#d81b60", color: "#fff", fontWeight: 600, fontSize: 15 }}>Logout</button>
    </div>
  );
}