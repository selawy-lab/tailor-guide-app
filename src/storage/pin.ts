import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'tailor_app_pin';
const PIN_ENABLED_KEY = 'tailor_app_pin_enabled';

/**
 * Initialize PIN with default value
 */
export const initializePIN = async (): Promise<void> => {
  try {
    const existingPin = await SecureStore.getItemAsync(PIN_KEY);
    if (!existingPin) {
      // Set default PIN
      await SecureStore.setItemAsync(PIN_KEY, 'Safy2014');
      await SecureStore.setItemAsync(PIN_ENABLED_KEY, 'true');
    }
  } catch (error) {
    console.error('Error initializing PIN:', error);
  }
};

/**
 * Get stored PIN
 */
export const getStoredPIN = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(PIN_KEY);
  } catch (error) {
    console.error('Error retrieving PIN:', error);
    return null;
  }
};

/**
 * Verify entered PIN against stored PIN
 */
export const verifyPIN = async (enteredPin: string): Promise<boolean> => {
  try {
    const storedPin = await getStoredPIN();
    return storedPin === enteredPin;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
};

/**
 * Update PIN code
 */
export const updatePIN = async (newPin: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(PIN_KEY, newPin);
    return true;
  } catch (error) {
    console.error('Error updating PIN:', error);
    return false;
  }
};

/**
 * Check if PIN is enabled
 */
export const isPINEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await SecureStore.getItemAsync(PIN_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking PIN status:', error);
    return true; // Default to enabled for security
  }
};

/**
 * Enable/disable PIN
 */
export const setPINEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await SecureStore.setItemAsync(PIN_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting PIN status:', error);
  }
};

/**
 * Clear PIN and disable it
 */
export const clearPIN = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(PIN_KEY);
    await SecureStore.deleteItemAsync(PIN_ENABLED_KEY);
  } catch (error) {
    console.error('Error clearing PIN:', error);
  }
};
