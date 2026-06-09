import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/interview_assist/',
  server: {
    port: 8189,
    host: '0.0.0.0',
    proxy: {
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/interview_assist/index.html';
          }
        }
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/interview_assist/index.html';
          }
        }
      },
      '/resume': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/interview_assist/index.html';
          }
        }
      },
      '/candidate': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/interview_assist/index.html';
          }
        }
      },
      '/notification': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/interview_assist/index.html';
          }
        }
      },
      '/user': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/interview_assist/index.html';
          }
        }
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})