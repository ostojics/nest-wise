// Inspired by https://github.com/byCedric/expo-monorepo-example/blob/main/apps/example/metro.config.js
const {getDefaultConfig} = require('expo/metro-config');
const {FileStore} = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.disableHierarchicalLookup = true; // https://docs.expo.dev/guides/monorepos/#3-different-versions-of-dependencies-must-be

config.cacheStores = [new FileStore({root: path.join(__dirname, 'node_modules', '.cache', 'metro')})];

module.exports = config;
