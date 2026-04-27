/**
 * Centralized API URL configuration.
 * In development: defaults to localhost:8000
 * In production: reads from REACT_APP_API_URL env var
 */
export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000";
