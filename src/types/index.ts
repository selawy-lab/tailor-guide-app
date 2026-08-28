// 1. بيانات الزبون
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

// 2. بيانات القياسات (تاريخية ولا تستبدل)
export type GarmentType = 'قميص' | 'بنطال' | 'جلابية' | 'جاكيت';

export interface Measurement {
  id: string;
  customerId: string;
  garmentType: GarmentType;
  detailsCm: Record<string, number>; // القياسات بالسنتيمتر cm
  createdAt: string;
}

// 3. حالات الطلب والطلبات
export type OrderStatus = 'جديد' | 'قيد التنفيذ' | 'جاهز' | 'تم التسليم' | 'ملغى';

export interface Payment {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  measurementId?: string;
  garmentType: GarmentType;
  quantity: number;
  fabricType: string;
  fabricColor: string;
  description?: string;
  totalPrice: number;
  payments: Payment[]; // الدفعات المضافة
  remainingAmount: number; // يحسب تلقائياً
  deliveryDate: string;
  status: OrderStatus;
  createdAt: string;
}

// 4. المصروفات
export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  notes?: string;
}

// 5. إعدادات التطبيق والقفل
export interface AppSettings {
  shopName: string;
  tailorName: string;
  pinCode: string;
  isPinEnabled: boolean;
  deliveryNotificationHours: number;
  isNotificationsEnabled: boolean;
}

// 6. تقارير الأرباح
export interface ProfitReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  ordersCount: number;
}

// 7. قاعدة البيانات الكاملة
export interface AppDatabase {
  customers: Customer[];
  measurements: Measurement[];
  orders: Order[];
  expenses: Expense[];
  settings: AppSettings;
  lastBackupDate?: string;
}
