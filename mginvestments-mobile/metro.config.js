const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure for React Native Web only when targeting web platform
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias = {
    'react-native': 'react-native-web',
  };
}

// Ensure proper module resolution for Firebase
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
