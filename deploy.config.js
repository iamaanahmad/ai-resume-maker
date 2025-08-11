// Deployment Configuration
// This file contains deployment-specific settings

module.exports = {
  // Build output directory
  buildDir: 'dist',
  
  // Environment variables for different deployments
  environments: {
    development: {
      NODE_ENV: 'development',
      VITE_API_KEY: 'process.env.VITE_API_KEY',
      VITE_ENABLE_ANALYTICS: 'false',
      VITE_ENABLE_ERROR_MONITORING: 'false'
    },
    staging: {
      NODE_ENV: 'staging',
      VITE_API_KEY: 'process.env.VITE_API_KEY',
      VITE_ENABLE_ANALYTICS: 'true',
      VITE_ENABLE_ERROR_MONITORING: 'true'
    },
    production: {
      NODE_ENV: 'production',
      VITE_API_KEY: 'process.env.VITE_API_KEY',
      VITE_ENABLE_ANALYTICS: 'true',
      VITE_ENABLE_ERROR_MONITORING: 'true'
    }
  },
  
  // Build optimization settings
  build: {
    minify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ai: ['@google/genai'],
          pdf: ['html2canvas', 'jspdf']
        }
      }
    }
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 5173,
    host: '0.0.0.0'
  }
}; 