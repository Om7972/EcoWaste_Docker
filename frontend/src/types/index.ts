export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'collector';
  avatar?: string;
  rewardPoints: number;
  address?: string;
  phone?: string;
  createdAt: string;
}

export interface Complaint {
  _id: string;
  user: User | string;
  title: string;
  description: string;
  category: 'overflow' | 'illegal_dump' | 'missed_pickup' | 'broken_bin' | 'other';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  images: string[];
  assignedTo?: User | string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WasteReport {
  _id: string;
  user: User | string;
  image: string;
  prediction: {
    category: 'plastic' | 'paper' | 'glass' | 'organic' | 'metal' | 'ewaste' | 'textile';
    confidence: number;
    recyclable: boolean;
    tips: string[];
  };
  location?: {
    type: string;
    coordinates: [number, number];
  };
  pointsEarned: number;
  createdAt: string;
}

export interface RecyclingCenter {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  acceptedMaterials: string[];
  operatingHours: string;
  phone: string;
  rating: number;
  isOpen: boolean;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Route {
  _id: string;
  name: string;
  collector: User | string;
  stops: {
    location: {
      type: string;
      coordinates: [number, number];
    };
    address: string;
    completed: boolean;
  }[];
  status: 'planned' | 'in_progress' | 'completed';
  scheduledDate: string;
  estimatedDuration: number;
}

export interface DashboardStats {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  totalWasteReported: number;
  recyclingRate: number;
  totalRewardPoints: number;
  wasteByCategory: { category: string; count: number }[];
  monthlyTrends: { month: string; complaints: number; resolved: number }[];
  topRecyclers: { user: User; points: number }[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
