const User = require('../models/User');
const Badge = require('../models/Badge');
const Achievement = require('../models/Achievement');
const MarketplaceListing = require('../models/MarketplaceListing');
const Transaction = require('../models/Transaction');
const CommunityPost = require('../models/CommunityPost');
const CarbonReport = require('../models/CarbonReport');
const CommunityEvent = require('../models/CommunityEvent');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// ==========================================
// 1. REWARDS & MISSIONS
// ==========================================

// @desc    Verify recycling QR code to award Green Points and log carbon footprint
// @route   POST /api/sustainability/rewards/verify-qr
// @access  Private
exports.verifyRecyclingQR = async (req, res) => {
  try {
    const { qrData, materialType, weight } = req.body;
    if (!materialType || !weight) {
      return res.status(400).json({ success: false, message: 'Material type and weight are required' });
    }

    // Award Green Points (10 points per kg)
    const pointsAwarded = Math.round(weight * 10);
    
    // Calculate CO2 savings factors (approximate kg of CO2 saved per kg recycled)
    const co2Factors = {
      plastic: 1.5,
      paper: 0.9,
      glass: 0.3,
      metal: 3.2,
      organic: 0.5,
      ewaste: 2.5,
      textile: 1.8,
      other: 0.5
    };
    const factor = co2Factors[materialType] || 0.5;
    const carbonSaved = weight * factor;

    // Update User points
    const user = await User.findById(req.user._id);
    user.rewardPoints += pointsAwarded;
    await user.save();

    // Create Carbon Report entry or update existing
    let carbonReport = await CarbonReport.findOne({ user: user._id });
    if (!carbonReport) {
      carbonReport = new CarbonReport({ user: user._id });
    }
    carbonReport.totalCarbonSaved += carbonSaved;
    carbonReport.recycledWeights[materialType] = (carbonReport.recycledWeights[materialType] || 0) + weight;
    carbonReport.monthlyImpactScore = Math.round(carbonReport.totalCarbonSaved * 1.2);
    
    // Dynamic AI Suggestions
    carbonReport.aiSuggestions = [
      `Awesome job recycling ${weight}kg of ${materialType}! You saved ${carbonSaved.toFixed(1)}kg of CO2.`,
      `Try to increase your paper recycling to offset more transport footprint next week.`,
      `Eco-tip: Always clean containers before recycling to avoid contamination.`
    ];
    carbonReport.lastCalculated = new Date();
    await carbonReport.save();

    // Log the transaction
    const mockListing = await MarketplaceListing.create({
      seller: user._id,
      title: `Recycled ${materialType}`,
      description: `IoT QR Code Scan verification`,
      materialType,
      weight,
      price: 0,
      location: { coordinates: [72.8777, 19.076], address: 'Verified Smart Bin Location' },
      status: 'sold'
    });

    await Transaction.create({
      listing: mockListing._id,
      seller: user._id,
      buyer: user._id,
      amount: pointsAwarded,
      transactionType: 'reward_redemption',
      paymentStatus: 'completed'
    });

    // Check Badge unlocks
    await checkAndAwardBadges(user._id, materialType);

    // Create Notification
    await Notification.create({
      user: user._id,
      title: '🎉 Points Verified!',
      message: `Successfully verified QR scan. Earned +${pointsAwarded} Green Points and saved ${carbonSaved.toFixed(1)}kg CO2!`,
      type: 'success'
    });

    res.json({
      success: true,
      pointsAwarded,
      carbonSaved,
      totalPoints: user.rewardPoints,
      totalCarbonSaved: carbonReport.totalCarbonSaved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to check and unlock achievements/badges
async function checkAndAwardBadges(userId, materialType) {
  try {
    // Find or seed default badges if none exist
    let badges = await Badge.find();
    if (badges.length === 0) {
      badges = await Badge.insertMany([
        { name: 'Eco Starter', description: 'Recycle for the first time', icon: '🌱', category: 'recycling' },
        { name: 'Recycling Pro', description: 'Unlock recycling milestone', icon: '🏆', category: 'recycling' },
        { name: 'Carbon Shield', description: 'Offset significant carbon footprint', icon: '🛡️', category: 'carbon' },
        { name: 'Community Hero', description: 'Participate in community cleanups', icon: '💖', category: 'community' }
      ]);
    }

    // Award first badge if not already owned
    const firstBadge = badges[0];
    const exists = await Achievement.findOne({ user: userId, badge: firstBadge._id });
    if (!exists) {
      await Achievement.create({ user: userId, badge: firstBadge._id, unlocked: true });
      await Notification.create({
        user: userId,
        title: '🏆 Achievement Unlocked!',
        message: `Unlocked the "${firstBadge.name}" Badge! ${firstBadge.description}`,
        type: 'success'
      });
    }
  } catch (err) {
    console.error('Badge awarding error:', err);
  }
}

// @desc    Get current daily missions & weekly challenges progress
// @route   GET /api/sustainability/rewards/missions
// @access  Private
exports.getMissions = async (req, res) => {
  try {
    // Return standard mock/simulated list of active missions
    res.json({
      success: true,
      dailyMissions: [
        { id: 'dm1', title: 'Recycle Plastic Bottle', target: 1, current: 1, completed: true, reward: 20 },
        { id: 'dm2', title: 'Scan 2 Smart Bins', target: 2, current: 1, completed: false, reward: 30 },
        { id: 'dm3', title: 'Share AI Scan on feed', target: 1, current: 0, completed: false, reward: 15 }
      ],
      weeklyChallenges: [
        { id: 'wc1', title: 'Recycle 5kg of Glass', target: 5, current: 2.5, completed: false, reward: 100 },
        { id: 'wc2', title: 'Zero waste day', target: 1, current: 0, completed: false, reward: 50 },
        { id: 'wc3', title: 'Join a cleanup drive', target: 1, current: 1, completed: true, reward: 150 }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Claim referral code rewards
// @route   POST /api/sustainability/rewards/referral
// @access  Private
exports.claimReferral = async (req, res) => {
  try {
    const { referralCode } = req.body;
    if (!referralCode) {
      return res.status(400).json({ success: false, message: 'Referral code is required' });
    }

    const user = await User.findById(req.user._id);
    // Award 50 points to user
    user.rewardPoints += 50;
    await user.save();

    await Notification.create({
      user: user._id,
      title: '👥 Referral Applied!',
      message: 'You have been awarded 50 points for entering referral code.',
      type: 'success'
    });

    res.json({ success: true, message: 'Referral processed successfully', points: user.rewardPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. CARBON CALCULATION & REPORTING
// ==========================================

// @desc    Get carbon footprint saving report
// @route   GET /api/sustainability/carbon/report
// @access  Private
exports.getCarbonReport = async (req, res) => {
  try {
    let report = await CarbonReport.findOne({ user: req.user._id });
    if (!report) {
      report = await CarbonReport.create({
        user: req.user._id,
        totalCarbonSaved: 0,
        recycledWeights: { plastic: 0, paper: 0, glass: 0, metal: 0, organic: 0, ewaste: 0 },
        aiSuggestions: [
          'Calculate your savings by doing your first scan.',
          'Recycling steel cans saves 74% energy compared to raw mining.'
        ]
      });
    }

    // Calculate community total carbon saved
    const aggResult = await CarbonReport.aggregate([
      { $group: { _id: null, total: { $sum: '$totalCarbonSaved' } } }
    ]);
    const communityTotal = aggResult.length > 0 ? aggResult[0].total : 0;

    res.json({
      success: true,
      data: report,
      communityTotalSaved: communityTotal,
      carbonReductionGoal: 100 // target in kg CO2
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. WASTE MARKETPLACE
// ==========================================

// @desc    Get all active marketplace listings (with search, pagination, filters)
// @route   GET /api/sustainability/marketplace
// @access  Private
exports.getListings = async (req, res) => {
  try {
    const { search, materialType, status = 'active', page = 1, limit = 10 } = req.query;
    const query = { status };

    if (materialType) {
      query.materialType = materialType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await MarketplaceListing.countDocuments(query);
    const listings = await MarketplaceListing.find(query)
      .populate('seller', 'name email avatar rewardPoints')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a listing on the waste marketplace
// @route   POST /api/sustainability/marketplace
// @access  Private
exports.createListing = async (req, res) => {
  try {
    const { title, description, materialType, weight, price, coordinates, address } = req.body;
    if (!title || !materialType || !weight || !price || !coordinates || !address) {
      return res.status(400).json({ success: false, message: 'All listing fields are required' });
    }

    const listing = await MarketplaceListing.create({
      seller: req.user._id,
      title,
      description,
      materialType,
      weight,
      price,
      location: { type: 'Point', coordinates, address }
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Place a bid on a marketplace listing
// @route   POST /api/sustainability/marketplace/:id/bid
// @access  Private
exports.placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    
    if (amount <= listing.highestBid && amount <= listing.price) {
      return res.status(400).json({ success: false, message: 'Bid must be higher than current highest bid/starting price' });
    }

    listing.bids.push({ buyer: req.user._id, amount });
    listing.highestBid = amount;
    listing.highestBidder = req.user._id;
    await listing.save();

    // Notify seller
    await Notification.create({
      user: listing.seller,
      title: '📈 New Bid Received!',
      message: `A new bid of $${amount} has been placed on your listing "${listing.title}"`,
      type: 'info'
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept bid & Schedule pickup
// @route   POST /api/sustainability/marketplace/:id/pickup
// @access  Private
exports.schedulePickup = async (req, res) => {
  try {
    const { pickupSchedule } = req.body;
    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only seller can schedule pickup' });
    }

    listing.status = 'pending_pickup';
    listing.pickupSchedule = new Date(pickupSchedule);
    await listing.save();

    // Create transaction log
    await Transaction.create({
      listing: listing._id,
      seller: listing.seller,
      buyer: listing.highestBidder || listing.seller,
      amount: listing.highestBid || listing.price,
      pickupTime: listing.pickupSchedule,
      paymentStatus: 'pending'
    });

    res.json({ success: true, data: listing, message: 'Pickup scheduled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. COMMUNITY DISCUSSION & CLEANUPS
// ==========================================

// @desc    Get all community discussion posts
// @route   GET /api/sustainability/community/posts
// @access  Private
exports.getCommunityPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const posts = await CommunityPost.find(query)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a community discussion post
// @route   POST /api/sustainability/community/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await CommunityPost.create({
      author: req.user._id,
      title,
      content,
      tags: tags || [],
      category: category || 'general_discussion'
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/sustainability/community/posts/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ author: req.user._id, content });
    await post.save();

    await post.populate('comments.author', 'name avatar');
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get cleanup drive events
// @route   GET /api/sustainability/community/events
// @access  Private
exports.getCleanupEvents = async (req, res) => {
  try {
    const events = await CommunityEvent.find()
      .populate('organizer', 'name')
      .populate('volunteers', 'name avatar')
      .sort({ date: 1 })
      .lean();

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register to volunteer for cleanup drive event
// @route   POST /api/sustainability/community/events/:id/volunteer
// @access  Private
exports.volunteerForEvent = async (req, res) => {
  try {
    const event = await CommunityEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.volunteers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already registered as volunteer' });
    }

    event.volunteers.push(req.user._id);
    await event.save();

    res.json({ success: true, message: 'Successfully registered for cleanup drive event', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. ADMIN CONTROLS MODERATION & FRAUD
// ==========================================

// @desc    Flag/Moderate marketplace listing
// @route   PUT /api/sustainability/admin/marketplace/:id/moderate
// @access  Private/Admin
exports.moderateListing = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    listing.status = status || listing.status;
    listing.moderated = true;
    listing.moderationNotes = notes || '';
    await listing.save();

    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Run simple rule-based AI fraud detection audits
// @route   GET /api/sustainability/admin/audit-logs
// @access  Private/Admin
exports.getFraudAudits = async (req, res) => {
  try {
    // Rules: Scan transaction amounts > 500 points (suspicious weight) or listings with duplicate coordinates
    const suspiciousTransactions = await Transaction.find({ amount: { $gt: 500 } })
      .populate('seller', 'name email')
      .lean();

    const suspectList = suspiciousTransactions.map(t => ({
      type: 'Points Reward Leak Risk',
      severity: 'high',
      details: `User ${t.seller?.name || 'Unknown'} claimed ${t.amount} points in a single transaction. Verify sensor log authenticity.`,
      timestamp: t.createdAt
    }));

    res.json({ success: true, data: suspectList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
