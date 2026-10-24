import axios from 'axios';

export const TOKEN_KEY = 'stockpilot_token';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach the JWT to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';

export default http;
