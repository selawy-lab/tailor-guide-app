import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  AppDatabase,
  Customer,
  Order,
  Measurement,
  Expense,
  AppSettings,
  Payment,
} from '@types/index';

const STORAGE_KEY = 'tailor_guide_app_db';

const DEFAULT_SETTINGS: AppSettings = {
  shopName: 'دليل الخياطة',
  tailorName: 'الأستاذ حسين محمد الصلاوي',
  pinCode: 'Safy2014',
  isPinEnabled: true,
  deliveryNotificationHours: 24,
  isNotificationsEnabled: true,
};

const DEFAULT_DB: AppDatabase = {
  customers: [],
  measurements: [],
  orders: [],
  expenses: [],
  settings: DEFAULT_SETTINGS,
};

/**
 * Initialize or retrieve the database from AsyncStorage
 */
export const initializeDatabase = async (): Promise<AppDatabase> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DB));
    return DEFAULT_DB;
  } catch (error) {
    console.error('Error initializing database:', error);
    return DEFAULT_DB;
  }
};

/**
 * Get the complete database
 */
export const getDatabase = async (): Promise<AppDatabase> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_DB;
  } catch (error) {
    console.error('Error getting database:', error);
    return DEFAULT_DB;
  }
};

/**
 * Save database to AsyncStorage
 */
const saveDatabase = async (db: AppDatabase): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error('Error saving database:', error);
    throw error;
  }
};

// ============= CUSTOMER OPERATIONS =============

export const addCustomer = async (
  name: string,
  phone: string,
  address?: string,
  notes?: string
): Promise<Customer> => {
  const db = await getDatabase();
  const customer: Customer = {
    id: uuidv4(),
    name,
    phone,
    address,
    notes,
    createdAt: new Date().toISOString(),
  };
  db.customers.push(customer);
  await saveDatabase(db);
  return customer;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const db = await getDatabase();
  return db.customers;
};

export const getCustomerById = async (customerId: string): Promise<Customer | null> => {
  const db = await getDatabase();
  return db.customers.find((c) => c.id === customerId) || null;
};

export const updateCustomer = async (
  customerId: string,
  updates: Partial<Customer>
): Promise<Customer | null> => {
  const db = await getDatabase();
  const customer = db.customers.find((c) => c.id === customerId);
  if (!customer) return null;

  Object.assign(customer, updates);
  await saveDatabase(db);
  return customer;
};

export const deleteCustomer = async (customerId: string): Promise<boolean> => {
  const db = await getDatabase();
  db.customers = db.customers.filter((c) => c.id !== customerId);
  db.measurements = db.measurements.filter((m) => m.customerId !== customerId);
  db.orders = db.orders.filter((o) => o.customerId !== customerId);
  await saveDatabase(db);
  return true;
};

// ============= MEASUREMENT OPERATIONS =============

export const addMeasurement = async (
  customerId: string,
  garmentType: string,
  detailsCm: Record<string, number>
): Promise<Measurement> => {
  const db = await getDatabase();
  const measurement: Measurement = {
    id: uuidv4(),
    customerId,
    garmentType: garmentType as any,
    detailsCm,
    createdAt: new Date().toISOString(),
  };
  db.measurements.push(measurement);
  await saveDatabase(db);
  return measurement;
};

export const getMeasurementsByCustomer = async (customerId: string): Promise<Measurement[]> => {
  const db = await getDatabase();
  return db.measurements.filter((m) => m.customerId === customerId);
};

export const getLatestMeasurement = async (customerId: string, garmentType: string): Promise<Measurement | null> => {
  const db = await getDatabase();
  const measurements = db.measurements.filter(
    (m) => m.customerId === customerId && m.garmentType === garmentType
  );
  if (measurements.length === 0) return null;
  return measurements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
};

// ============= ORDER OPERATIONS =============

export const addOrder = async (
  customerId: string,
  garmentType: string,
  quantity: number,
  fabricType: string,
  fabricColor: string,
  totalPrice: number,
  deliveryDate: string,
  description?: string,
  measurementId?: string
): Promise<Order> => {
  const db = await getDatabase();
  const order: Order = {
    id: uuidv4(),
    customerId,
    measurementId,
    garmentType: garmentType as any,
    quantity,
    fabricType,
    fabricColor,
    description,
    totalPrice,
    payments: [],
    remainingAmount: totalPrice,
    deliveryDate,
    status: 'جديد',
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  await saveDatabase(db);
  return order;
};

export const getOrders = async (): Promise<Order[]> => {
  const db = await getDatabase();
  return db.orders;
};

export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  const db = await getDatabase();
  return db.orders.filter((o) => o.customerId === customerId);
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const db = await getDatabase();
  return db.orders.find((o) => o.id === orderId) || null;
};

export const addPaymentToOrder = async (
  orderId: string,
  amount: number,
  notes?: string
): Promise<Order | null> => {
  const db = await getDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  const payment: Payment = {
    id: uuidv4(),
    amount,
    date: new Date().toISOString(),
    notes,
  };

  order.payments.push(payment);
  order.remainingAmount = order.totalPrice - order.payments.reduce((sum, p) => sum + p.amount, 0);
  await saveDatabase(db);
  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<Order | null> => {
  const db = await getDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status as any;
  await saveDatabase(db);
  return order;
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  const db = await getDatabase();
  db.orders = db.orders.filter((o) => o.id !== orderId);
  await saveDatabase(db);
  return true;
};

// ============= EXPENSE OPERATIONS =============

export const addExpense = async (
  title: string,
  amount: number,
  date: string,
  notes?: string
): Promise<Expense> => {
  const db = await getDatabase();
  const expense: Expense = {
    id: uuidv4(),
    title,
    amount,
    date,
    notes,
  };
  db.expenses.push(expense);
  await saveDatabase(db);
  return expense;
};

export const getExpenses = async (): Promise<Expense[]> => {
  const db = await getDatabase();
  return db.expenses;
};

export const getExpensesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Expense[]> => {
  const db = await getDatabase();
  return db.expenses.filter((e) => e.date >= startDate && e.date <= endDate);
};

export const deleteExpense = async (expenseId: string): Promise<boolean> => {
  const db = await getDatabase();
  db.expenses = db.expenses.filter((e) => e.id !== expenseId);
  await saveDatabase(db);
  return true;
};

// ============= SETTINGS OPERATIONS =============

export const getSettings = async (): Promise<AppSettings> => {
  const db = await getDatabase();
  return db.settings;
};

export const updateSettings = async (updates: Partial<AppSettings>): Promise<AppSettings> => {
  const db = await getDatabase();
  db.settings = { ...db.settings, ...updates };
  await saveDatabase(db);
  return db.settings;
};

export const updatePinCode = async (newPin: string): Promise<void> => {
  const db = await getDatabase();
  db.settings.pinCode = newPin;
  await saveDatabase(db);
};

export const togglePinEnabled = async (enabled: boolean): Promise<void> => {
  const db = await getDatabase();
  db.settings.isPinEnabled = enabled;
  await saveDatabase(db);
};

// ============= BACKUP & RESTORE =============

export const exportDatabase = async (): Promise<string> => {
  const db = await getDatabase();
  return JSON.stringify(db, null, 2);
};

export const importDatabase = async (jsonData: string): Promise<boolean> => {
  try {
    const importedDb: AppDatabase = JSON.parse(jsonData);
    // Validate basic structure
    if (!importedDb.customers || !importedDb.orders || !importedDb.expenses || !importedDb.settings) {
      throw new Error('Invalid database format');
    }
    await saveDatabase(importedDb);
    return true;
  } catch (error) {
    console.error('Error importing database:', error);
    return false;
  }
};

export const clearDatabase = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DB));
};
