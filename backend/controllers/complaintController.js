const Complaint = require('../models/Complaint');

exports.getAll = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('user', 'name email avatar')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: complaints, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email avatar').populate('assignedTo', 'name email');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: complaint });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, description, category, priority, latitude, longitude, address } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    const complaint = await Complaint.create({
      user: req.user._id, title, description, category, priority, images,
      location: { type: 'Point', coordinates: [Number(longitude) || 0, Number(latitude) || 0], address: address || '' },
    });
    res.status(201).json({ success: true, data: complaint });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.status === 'resolved') updates.resolvedAt = new Date();
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: complaint });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.delete = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
