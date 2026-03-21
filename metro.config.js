const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Restrict the watchFolders to reduce file watching overhead
config.watchFolders = [__dirname];

// Optimize through maxWorkers
config.maxWorkers = 1;

// Explicitly set entry points
config.resolver.sourceExts = ['tsx', 'ts', 'jsx', 'js', 'json'];

module.exports = config;
