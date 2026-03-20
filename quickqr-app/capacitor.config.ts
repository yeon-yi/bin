import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickqr.app',
  appName: 'QuickQR',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {},
    StatusBar: {
      style: 'LIGHT'
    }
  }
};

export default config;
