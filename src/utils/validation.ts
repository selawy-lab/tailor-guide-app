/**
 * التحقق من صحة المقاسات المدخلة (يجب أن تكون أرقاماً منطقية وموجبة)
 */
export const isValidMeasurement = (value: string | number): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0 && num < 500; // التحقق من أن المقاس بين 0 و 500 سم
};

/**
 * التحقق من صيغة رقم الهاتف للعملاء
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // صيغة مرنة تقبل الأرقام الدولية والمحلية وتبدأ بـ + أو أرقام
  const phoneRegex = /^[+]?[0-9]{9,15}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * التحقق من أن النص غير فارغ
 */
export const isValidText = (text: string, minLength: number = 1): boolean => {
  return text.trim().length >= minLength;
};

/**
 * التحقق من أن السعر رقم موجب
 */
export const isValidPrice = (price: string | number): boolean => {
  const num = Number(price);
  return !isNaN(num) && num > 0;
};

/**
 * التحقق من أن التاريخ صحيح وليس في الماضي
 */
export const isValidFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};
