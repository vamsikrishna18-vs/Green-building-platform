/**
 * Production & Development API Configuration
 * Supports VITE_API_URL environment variable for cross-domain backend deployments,
 * with fallback to relative URLs (/api) when frontend and backend are served together.
 */

const API_HOST = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_HOST}${cleanEndpoint}`;
};

export default API_HOST;
