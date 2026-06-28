import api from './api';

export const sustainabilityAPI = {
  // Reward & Missions
  verifyQR: (data: { qrData: string; materialType: string; weight: number }) =>
    api.post('/sustainability/rewards/verify-qr', data),
  
  getMissions: () =>
    api.get('/sustainability/rewards/missions'),
  
  claimReferral: (referralCode: string) =>
    api.post('/sustainability/rewards/referral', { referralCode }),

  // Carbon reports
  getCarbonReport: () =>
    api.get('/sustainability/carbon/report'),

  // Waste Marketplace
  getListings: (params?: { search?: string; materialType?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/sustainability/marketplace', { params }),

  createListing: (data: {
    title: string;
    description: string;
    materialType: string;
    weight: number;
    price: number;
    coordinates: [number, number];
    address: string;
  }) => api.post('/sustainability/marketplace', data),

  placeBid: (id: string, amount: number) =>
    api.post(`/sustainability/marketplace/${id}/bid`, { amount }),

  schedulePickup: (id: string, pickupSchedule: string) =>
    api.post(`/sustainability/marketplace/${id}/pickup`, { pickupSchedule }),

  // Community discussion & cleanups
  getCommunityPosts: (category?: string) =>
    api.get('/sustainability/community/posts', { params: { category } }),

  createPost: (data: { title: string; content: string; tags?: string[]; category?: string }) =>
    api.post('/sustainability/community/posts', data),

  addComment: (postId: string, content: string) =>
    api.post(`/sustainability/community/posts/${postId}/comment`, { content }),

  getCleanupEvents: () =>
    api.get('/sustainability/community/events'),

  volunteerForEvent: (eventId: string) =>
    api.post(`/sustainability/community/events/${eventId}/volunteer`),

  // Admin Panel
  moderateListing: (id: string, data: { status?: string; notes?: string }) =>
    api.put(`/sustainability/admin/marketplace/${id}/moderate`, data),

  getFraudAudits: () =>
    api.get('/sustainability/admin/audit-logs'),
};
