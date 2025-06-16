const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable react-native-maps support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.assetExts.push('svg');

module.exports = config;
