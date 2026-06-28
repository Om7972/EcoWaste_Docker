export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'collector' | 'driver' | 'municipality';
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

// ─── Smart Bin Types ─────────────────────────────────────────

export interface SmartBin {
  _id: string;
  binId: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
    address: string;
    zone: string;
  };
  binType: 'general' | 'recyclable' | 'organic' | 'hazardous' | 'ewaste';
  capacity: number;
  currentFillLevel: number;
  fillStatus: 'green' | 'yellow' | 'red';
  status: 'active' | 'inactive' | 'maintenance' | 'full' | 'offline';
  sensorStatus: 'online' | 'offline' | 'low_battery' | 'error';
  batteryLevel: number;
  lastEmptied: string;
  lastSensorPing: string;
  avgFillRate: number;
  predictedFullTime?: string;
  assignedCollector?: User;
  installDate: string;
  manufacturer: string;
  model: string;
  metadata: {
    temperature: number;
    humidity: number;
    odorLevel: number;
    weight: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SensorReading {
  _id: string;
  bin: string;
  binId: string;
  fillLevel: number;
  temperature: number;
  humidity: number;
  weight: number;
  batteryLevel: number;
  odorLevel: number;
  sensorStatus: string;
  timestamp: string;
}

export interface CollectionRouteData {
  _id: string;
  routeId: string;
  name: string;
  driver?: User;
  vehicle: string;
  stops: {
    bin: SmartBin;
    order: number;
    estimatedArrival: string;
    actualArrival?: string;
    completed: boolean;
    fillLevelAtCollection?: number;
  }[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  totalDistance: number;
  estimatedDuration: number;
  actualDuration: number;
  fuelEstimate: number;
  efficiency: number;
  optimized: boolean;
  zone: string;
}

export interface BinAlert {
  _id: string;
  bin: SmartBin;
  type: 'overflow' | 'predicted_overflow' | 'sensor_offline' | 'low_battery' | 'maintenance_due' | 'temperature_high' | 'collection_missed';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  acknowledged: boolean;
  resolved: boolean;
  createdAt: string;
}

export interface OverflowPrediction {
  binId: string;
  binName: string;
  currentFillLevel: number;
  fillRate: number;
  predictedOverflowTime: string | null;
  hoursToOverflow: number | null;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  dataPoints: number;
}

export interface SmartBinAnalytics {
  overview: {
    totalBins: number;
    activeBins: number;
    avgFillLevel: number;
    totalWasteCollected: number;
    totalCollections: number;
    overflowIncidents: number;
    routeEfficiency: number;
    fuelSaved: number;
  };
  heatmapData: {
    lat: number;
    lng: number;
    intensity: number;
    binId: string;
    fillLevel: number;
  }[];
  dailyTrends: {
    date: string;
    collections: number;
    wasteCollected: number;
    overflows: number;
  }[];
  zoneDistribution: {
    zone: string;
    bins: number;
    avgFillLevel: number;
    criticalBins: number;
  }[];
  recommendations: {
    type: string;
    priority: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface MaintenanceLogData {
  _id: string;
  bin: SmartBin;
  type: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: User;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  notes: string;
}

