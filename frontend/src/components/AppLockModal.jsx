import { useState } from "react";
import { api } from "../utils/api";

export default function AppLockModal({ isOpen, onClose, appLock, refreshAppLock }) {
  const [pin, setPin] = useState("");
  const [timeout, setTimeoutValue] = useState(appLock?.timeout || 5);
  const [enabled, setEnabled] = useState(appLock?.enabled || false);
  const [step, setStep] = useState("main"); // main | set | reset
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleSave = async () => {
    setError(""); setSuccess("");
    if (enabled && (!newPin || newPin.length < 4)) {
      setError("PIN must be at least 4 digits"); return;
    }
    if (enabled && newPin !== confirmPin) {
      setError("PINs do not match"); return;
    }
    try {
      await api.setAppLock({ enabled, pin: enabled ? newPin : undefined, timeout });
      setSuccess("App lock updated");
      setStep("main");
      setNewPin(""); setConfirmPin("");
      refreshAppLock();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleReset = async () => {
    setError(""); setSuccess("");
    try {
      await api.resetAppLock();
      setSuccess("App lock reset");
      setStep("main");
      refreshAppLock();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 400, margin: "80px auto", boxShadow: "0 4px 24px #0002" }}>
        <h2>App Lock Settings</h2>
        {step === "main" && (
          <>
            <label style={{ display: "block", marginBottom: 12 }}>
              <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Enable App Lock
            </label>
            <label style={{ display: "block", marginBottom: 12 }}>
              Timeout (minutes):
              <input type="number" min={1} value={timeout} onChange={e => setTimeoutValue(Number(e.target.value))} style={{ marginLeft: 8, width: 60 }} />
            </label>
            {enabled && (
              <button onClick={() => setStep("set")}>Set/Change PIN</button>
            )}
            <button onClick={() => setStep("reset")} style={{ marginLeft: 12 }}>Reset PIN</button>
            <div style={{ marginTop: 18 }}>
              <button onClick={handleSave}>Save</button>
              <button onClick={onClose} style={{ marginLeft: 12 }}>Cancel</button>
            </div>
          </>
        )}
        {step === "set" && (
          <>
            <div>Enter new PIN:</div>
            <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} maxLength={8} />
            <div>Confirm new PIN:</div>
            <input type="password" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} maxLength={8} />
            <div style={{ marginTop: 18 }}>
              <button onClick={handleSave}>Save PIN</button>
              <button onClick={() => setStep("main")} style={{ marginLeft: 12 }}>Back</button>
            </div>
          </>
        )}
        {step === "reset" && (
          <>
            <div>Reset your PIN? This will disable App Lock until you set a new PIN.</div>
            <div style={{ marginTop: 18 }}>
              <button onClick={handleReset}>Reset PIN</button>
              <button onClick={() => setStep("main")} style={{ marginLeft: 12 }}>Back</button>
            </div>
          </>
        )}
        {error && <div style={{ color: "#d81b60", marginTop: 12 }}>{error}</div>}
        {success && <div style={{ color: "#388e3c", marginTop: 12 }}>{success}</div>}
      </div>
    </div>
  );
}
