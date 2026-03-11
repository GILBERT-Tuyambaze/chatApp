// backend/controllers/appLockController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// PATCH /api/users/me/app-lock
exports.setAppLock = async (req, res) => {
  try {
    const { enabled, pin, timeout } = req.body;
    const updates = { "appLock.enabled": !!enabled };
    if (timeout !== undefined) updates["appLock.timeout"] = timeout;
    if (pin) {
      updates["appLock.pinHash"] = await bcrypt.hash(pin, 10);
    }
    await User.findByIdAndUpdate(req.user._id, { $set: updates });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/users/me/app-lock/reset
exports.resetAppLock = async (req, res) => {
  try {
    // For demo: just disables app lock. In production, add verification!
    await User.findByIdAndUpdate(req.user._id, {
      $set: { "appLock.enabled": false, "appLock.pinHash": "" }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/users/me/app-lock/verify
exports.verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.appLock.enabled || !user.appLock.pinHash) return res.status(400).json({ error: "App lock not enabled" });
    const valid = await bcrypt.compare(pin, user.appLock.pinHash);
    if (!valid) return res.status(401).json({ error: "Invalid PIN" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
