// For production, set VITE_API_BASE_URL in your deployment environment
// GitHub Pages: set as GitHub secret or use .env.production
// During development with Vite proxy, use relative paths (empty string)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
