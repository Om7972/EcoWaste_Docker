const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  verifyRecyclingQR,
  getMissions,
  claimReferral,
  getCarbonReport,
  getListings,
  createListing,
  placeBid,
  schedulePickup,
  getCommunityPosts,
  createPost,
  addComment,
  getCleanupEvents,
  volunteerForEvent,
  moderateListing,
  getFraudAudits
} = require('../controllers/sustainabilityController');

// Reward APIs
router.post('/rewards/verify-qr', protect, verifyRecyclingQR);
router.get('/rewards/missions', protect, getMissions);
router.post('/rewards/referral', protect, claimReferral);

// Carbon Footprint Calculator
router.get('/carbon/report', protect, getCarbonReport);

// Waste Marketplace
router.get('/marketplace', protect, getListings);
router.post('/marketplace', protect, createListing);
router.post('/marketplace/:id/bid', protect, placeBid);
router.post('/marketplace/:id/pickup', protect, schedulePickup);

// Community Board
router.get('/community/posts', protect, getCommunityPosts);
router.post('/community/posts', protect, createPost);
router.post('/community/posts/:id/comment', protect, addComment);
router.get('/community/events', protect, getCleanupEvents);
router.post('/community/events/:id/volunteer', protect, volunteerForEvent);

// Admin Moderation & Fraud Detection
router.put('/admin/marketplace/:id/moderate', protect, authorize('admin'), moderateListing);
router.get('/admin/audit-logs', protect, authorize('admin'), getFraudAudits);

module.exports = router;
