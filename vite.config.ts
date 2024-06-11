import * as path from 'path';
import { defineConfig } from 'vite';
import PackageInfo from './package.json';

export default defineConfig({
  define: {
    __APP_NAME__: JSON.stringify(PackageInfo.name),
    __APP_AUTHOR__: JSON.stringify(PackageInfo.author.name),
    __APP_VERSION__: JSON.stringify(PackageInfo.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
