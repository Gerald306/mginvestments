// crashPrevention.ts - Utilities to prevent common React Native crashes

import { Alert, Platform } from 'react-native';

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  if (typeof global !== 'undefined') {
    global.addEventListener?.('unhandledrejection', (event) => {
      console.error('🚨 Unhandled Promise Rejection:', event.reason);
      
      // Prevent the default behavior (which would crash the app)
      event.preventDefault();
      
      // Log detailed error information
      const errorInfo = {
        type: 'UnhandledPromiseRejection',
        reason: event.reason,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
      };
      
      console.error('📊 Promise Rejection Details:', JSON.stringify(errorInfo, null, 2));
    });
  }

  // Handle uncaught exceptions
  if (typeof global !== 'undefined' && global.ErrorUtils) {
    const originalHandler = global.ErrorUtils.getGlobalHandler();
    
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.error('🚨 Global Error Handler:', error);
      console.error('💀 Is Fatal:', isFatal);
      
      // Log detailed error information
      const errorInfo = {
        type: 'GlobalError',
        message: error.message,
        stack: error.stack,
        isFatal,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
      };
      
      console.error('📊 Global Error Details:', JSON.stringify(errorInfo, null, 2));
      
      // Call the original handler
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
};

// Safe async wrapper to prevent unhandled promise rejections
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  fallbackValue?: T,
  errorMessage?: string
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error(`🛡️ Safe Async Error: ${errorMessage || 'Unknown error'}`, error);
    
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    
    return undefined;
  }
};

// Safe component wrapper to prevent render crashes
export const safeRender = <T>(
  renderFn: () => T,
  fallback?: T,
  componentName?: string
): T | null => {
  try {
    return renderFn();
  } catch (error) {
    console.error(`🛡️ Safe Render Error in ${componentName || 'Unknown Component'}:`, error);
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    return null;
  }
};

// Memory management utilities
export const memoryUtils = {
  // Clear large objects from memory
  clearObject: (obj: any) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        delete obj[key];
      });
    }
  },

  // Monitor memory usage (development only)
  logMemoryUsage: () => {
    if (__DEV__ && global.performance?.memory) {
      const memory = global.performance.memory;
      console.log('📊 Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      });
    }
  },
};

// Network error handling
export const safeNetworkRequest = async <T>(
  requestFn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T | null> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      console.error(`🌐 Network Request Failed (Attempt ${attempt}/${retries}):`, error);
      
      if (attempt === retries) {
        console.error('🚨 All network retry attempts failed');
        return null;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  return null;
};

// Firebase operation safety wrapper
export const safeFirebaseOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  fallbackValue?: T
): Promise<T | undefined> => {
  try {
    console.log(`🔥 Starting Firebase operation: ${operationName}`);
    const result = await operation();
    console.log(`✅ Firebase operation successful: ${operationName}`);
    return result;
  } catch (error: any) {
    console.error(`❌ Firebase operation failed: ${operationName}`, error);
    
    // Handle specific Firebase errors
    if (error.code) {
      switch (error.code) {
        case 'auth/network-request-failed':
          console.error('🌐 Network error - check internet connection');
          break;
        case 'auth/too-many-requests':
          console.error('⏰ Too many requests - please wait and try again');
          break;
        case 'firestore/unavailable':
          console.error('🔥 Firestore temporarily unavailable');
          break;
        default:
          console.error(`🔥 Firebase error code: ${error.code}`);
      }
    }
    
    return fallbackValue;
  }
};

// Component lifecycle safety
export const componentSafetyUtils = {
  // Safe state update that checks if component is mounted
  safeSetState: (component: any, stateUpdate: any) => {
    if (component._isMounted !== false) {
      component.setState(stateUpdate);
    }
  },

  // Mark component as mounted/unmounted
  markMounted: (component: any) => {
    component._isMounted = true;
  },

  markUnmounted: (component: any) => {
    component._isMounted = false;
  },
};

// Performance monitoring
export const performanceUtils = {
  // Measure function execution time
  measureTime: async <T>(fn: () => Promise<T>, label: string): Promise<T> => {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      console.log(`⏱️ ${label} took ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`⏱️ ${label} failed after ${duration}ms:`, error);
      throw error;
    }
  },

  // Debounce function to prevent rapid calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
};

// App crash recovery
export const crashRecovery = {
  // Show user-friendly error message
  showErrorAlert: (title: string, message: string, onRetry?: () => void) => {
    const buttons = [{ text: 'OK' }];
    
    if (onRetry) {
      buttons.unshift({ text: 'Retry', onPress: onRetry });
    }
    
    Alert.alert(title, message, buttons);
  },

  // Log crash for debugging
  logCrash: (error: Error, context: string) => {
    const crashReport = {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      version: Platform.Version,
    };
    
    console.error('💥 CRASH REPORT:', JSON.stringify(crashReport, null, 2));
  },
};

export default {
  setupGlobalErrorHandlers,
  safeAsync,
  safeRender,
  memoryUtils,
  safeNetworkRequest,
  safeFirebaseOperation,
  componentSafetyUtils,
  performanceUtils,
  crashRecovery,
};
