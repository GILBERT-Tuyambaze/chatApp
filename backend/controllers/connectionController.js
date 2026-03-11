// Get all partners for the authenticated user
exports.getPartners = async (req, res) => {
  try {
    if (!req.user.partners || req.user.partners.length === 0) {
      return res.json({ partners: [] });
    }
    const User = require('../models/User');
    const partners = await User.find({ _id: { $in: req.user.partners } });
    res.json({ partners: partners.map(u => u.toSafeObject()) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
// backend/controllers/connectionController.js
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');

// Send a connection request
exports.sendRequest = async (req, res) => {
  const { toUsername } = req.body;
  const from = req.user._id;
  const toUser = await User.findOne({ username: toUsername });
  if (!toUser) return res.status(404).json({ error: 'User not found' });

  // Prevent duplicate requests
  const existing = await ConnectionRequest.findOne({ from, to: toUser._id, status: 'pending' });
  if (existing) return res.status(400).json({ error: 'Request already sent' });

  const request = await ConnectionRequest.create({ from, to: toUser._id });
  res.json({ request });
};

// List incoming/outgoing requests
exports.listRequests = async (req, res) => {
  const userId = req.user._id;
  const incoming = await ConnectionRequest.find({ to: userId, status: 'pending' })
    .populate('from', 'username display_name avatar bio email');
  const outgoing = await ConnectionRequest.find({ from: userId, status: 'pending' })
    .populate('to', 'username display_name avatar bio email');
  res.json({ incoming, outgoing });
};

// Accept a request
exports.acceptRequest = async (req, res) => {
  const { requestId } = req.body;
  const request = await ConnectionRequest.findById(requestId);
  if (!request || request.to.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Request not found' });

  request.status = 'accepted';
  await request.save();

  // Add each user to the other's partners array
  await User.findByIdAndUpdate(request.from, { $addToSet: { partners: request.to }, connectionStatus: 'connected' });
  await User.findByIdAndUpdate(request.to, { $addToSet: { partners: request.from }, connectionStatus: 'connected' });

  res.json({ success: true });
};

// Decline a request
exports.declineRequest = async (req, res) => {
  const { requestId } = req.body;
  const request = await ConnectionRequest.findById(requestId);
  if (!request || request.to.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Request not found' });

  request.status = 'declined';
  await request.save();
  res.json({ success: true });
};

// Cancel an outgoing request
exports.cancelRequest = async (req, res) => {
  const { requestId } = req.body;
  const request = await ConnectionRequest.findById(requestId);
  if (!request || request.from.toString() !== req.user._id.toString()) return res.status(404).json({ error: 'Request not found' });

  await request.remove();
  res.json({ success: true });
};
