export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'MARKETING' | 'OPERATOR' | 'ADMIN' | 'MANAGER';
  department: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unitPrice: number;
  unit: string;
  stock: number;
  status: 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface WeightRecord {
  id: string;
  materialId: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  vehicleNumber: string;
  operatorId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  entryDate: Date;
  weighingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  material?: Material;
  operator?: User;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  materials: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  rating: number;
  totalOrders: number;
  lastOrder: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  category: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  isRead: boolean;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalMaterials: number;
  totalWeightRecords: number;
  totalSuppliers: number;
  totalUsers: number;
  todayRecords: number;
  lowStockMaterials: number;
  unreadNotifications: number;
  avgWeight: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IoTWeighingData {
  deviceId: string;
  materialId: string;
  grossWeight: number;
  tareWeight: number;
  vehicleNumber: string;
  operatorId: string;
  timestamp?: string;
}

export interface IoTWeighingResponse {
  id: string;
  netWeight: number;
  material: string;
  operator: string;
  timestamp: string;
}