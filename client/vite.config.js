import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'development' or 'production')
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      // Expose the environment variables to your application
      'process.env': env,
    },
    build: {
      rollupOptions: {
        output: {
          format: 'es',
        },
      },
    },
  };
});
