
export default {
  name: 'OFFSHOT',
  slug: 'roml-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './attached_assets/kYGO7fSy_400x400.jpg',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './attached_assets/kYGO7fSy_400x400.jpg',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.roml.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './attached_assets/kYGO7fSy_400x400.jpg',
      backgroundColor: '#ffffff'
    },
    package: 'com.roml.app'
  }
};
