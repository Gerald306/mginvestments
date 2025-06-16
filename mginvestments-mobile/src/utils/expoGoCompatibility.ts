import Constants from 'expo-constants';

// Check if we're running in Expo Go
export const isExpoGo = Constants.appOwnership === 'expo';

// Expo Go compatibility warnings
export const showExpoGoWarnings = () => {
  if (isExpoGo) {
    console.log('🚀 Running in Expo Go');
    console.log('📱 Some features are limited in Expo Go:');
    console.log('   • Push notifications require a development build');
    console.log('   • Local notifications work with limitations');
    console.log('   • For full functionality, create a development build');
    console.log('   • Learn more: https://docs.expo.dev/develop/development-builds/introduction/');
  }
};

// Safe notification handler for Expo Go
export const safeNotificationHandler = {
  async registerForPush(): Promise<string | null> {
    if (isExpoGo) {
      console.log('⚠️ Push notifications not available in Expo Go');
      return null;
    }
    // This would contain the actual push notification logic
    return null;
  },

  async sendLocal(title: string, body: string): Promise<void> {
    if (isExpoGo) {
      console.log(`📱 Local Notification: ${title} - ${body}`);
    }
    // This would contain the actual local notification logic
  }
};

// Firebase Auth persistence helper
export const getAuthPersistence = () => {
  try {
    // Try to import AsyncStorage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage ? [AsyncStorage] : [];
  } catch (error) {
    console.log('AsyncStorage not available, using memory persistence');
    return [];
  }
};
