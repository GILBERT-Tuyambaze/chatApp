/**
 * backend/routes/users.js
 */

const router = require("express").Router();
const auth   = require("../middleware/auth");
const User   = require("../models/User");

// GET /api/users/me/profile  – own profile (must be before /:id)
router.get("/me/profile", auth, (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

// GET /api/users/me/partner  – return real partner if set
// GET /api/users/me/partners  – return all partners
router.get("/me/partners", auth, async (req, res) => {
  try {
    if (!req.user.partners || req.user.partners.length === 0) return res.json({ partners: [] });
    const partners = await User.find({ _id: { $in: req.user.partners } });
    res.json({ partners: partners.map(u => u.toSafeObject()) });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/users/me  – update own profile (display_name, avatar, bio)
router.patch("/me", auth, async (req, res) => {
  try {
    const allowed = ["display_name", "avatar", "bio", "email", "username", "password"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    // Prevent default display_name or avatar
    const DEFAULT_AVATAR = "🌸";
    if (updates.display_name !== undefined && (!updates.display_name || updates.display_name.trim() === "")) {
      return res.status(400).json({ error: "Display name cannot be empty or default." });
    }
    if (updates.avatar !== undefined && updates.avatar === DEFAULT_AVATAR) {
      return res.status(400).json({ error: "Please choose a custom avatar." });
    }
    // If password change is requested, require currentPassword and verify
    if (updates.password) {
      const bcrypt = require("bcryptjs");
      const { currentPassword } = req.body;
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password required to change password." });
      }
      const user = await User.findById(req.user._id);
      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!valid) {
        return res.status(400).json({ error: "Current password is incorrect." });
      }
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/users/disconnect – disconnect from partner
// POST /api/users/disconnect – disconnect from a partner
router.post("/disconnect", auth, async (req, res) => {
  try {
    const { partnerId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.partners || !user.partners.includes(partnerId)) return res.status(400).json({ error: "No such partner to disconnect." });
    // Remove partner from both users
    await User.findByIdAndUpdate(req.user._id, { $pull: { partners: partnerId } });
    await User.findByIdAndUpdate(partnerId, { $pull: { partners: req.user._id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/:id  – public profile
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/search?q=term – search users by username or email
router.get("/search", auth, async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ users: [] });
  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { display_name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  })
    .limit(10)
    .select("_id username display_name avatar bio email");
  res.json({ users });
});


// App Lock routes
const appLockController = require("../controllers/appLockController");
router.patch("/me/app-lock", auth, appLockController.setAppLock);
router.post("/me/app-lock/reset", auth, appLockController.resetAppLock);
router.post("/me/app-lock/verify", auth, appLockController.verifyPin);

module.exports = router;
