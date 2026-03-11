// passwordReset.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/passwordResetController');

router.post('/request-reset', ctrl.requestReset);
router.post('/reset-password', ctrl.resetPassword);
router.post('/add-email', ctrl.addEmail);

module.exports = router;
