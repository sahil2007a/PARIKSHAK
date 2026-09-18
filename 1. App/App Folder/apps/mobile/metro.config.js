const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [
  projectRoot,
  path.resolve(monorepoRoot, 'shared'),
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'AR Model/mobile_virtual_fire')
];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules')
];

// 3. Explicitly alias @parishak/shared and existing Fire Module
config.resolver.extraNodeModules = {
  '@parishak/shared': path.resolve(monorepoRoot, 'shared'),
  '@fire-module': path.resolve(monorepoRoot, 'AR Model/mobile_virtual_fire/src')
};

// 4. Ensure 3D asset extensions are recognized
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
