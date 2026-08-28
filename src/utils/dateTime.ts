/**
 * حساب عدد الأيام المتبقية لتسليم الطلب
 */
export const getDaysRemaining = (dueDateString: string | Date): number => {
  const dueDate = new Date(dueDateString);
  const today = new Date();

  // تصغير التاريخين لتبدأ من بداية اليوم لحساب الأيام بدقة بدون فروقات الساعات
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const differenceInTime = dueDate.getTime() - today.getTime();
  // تحويل الفارق الزمني من ملي ثانية إلى أيام
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

/**
 * تحديد حالة استعجال الطلب بناءً على تاريخ التسليم المتبقي
 */
export type OrderUrgencyStatus = 'OVERDUE' | 'URGENT' | 'NORMAL';

export const getOrderUrgency = (dueDateString: string | Date): OrderUrgencyStatus => {
  const daysLeft = getDaysRemaining(dueDateString);

  if (daysLeft < 0) return 'OVERDUE'; // متأخر عن موعد التسليم
  if (daysLeft <= 3) return 'URGENT'; // عاجل جداً (3 أيام أو أقل)
  return 'NORMAL'; // وقت كافي وطبيعي
};

/**
 * تنسيق التاريخ لشكل مقروء واحترافي باللغة العربية (مثال: 28 أغسطس 2026)
 */
export const formatDateToArabic = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * تنسيق التاريخ بصيغة بسيطة (DD/MM/YYYY)
 */
export const formatDateSimple = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * دالة مساعدة لفلترة الطلبات المتأخرة فقط (لعرض تنبيه للخياط)
 */
export interface MinimalOrder {
  id: string;
  customerName: string;
  dueDate: string;
}

export const getOverdueOrders = (orders: MinimalOrder[]): MinimalOrder[] => {
  return orders.filter((order) => getOrderUrgency(order.dueDate) === 'OVERDUE');
};

/**
 * تنسيق الوقت بصيغة HH:MM
 */
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
