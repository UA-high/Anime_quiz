import axios from 'axios';

// In-memory token storage
let memoryToken = null;

export const setAccessToken = (token) => {
  memoryToken = token;
};

export const getAccessToken = () => {
  return memoryToken;
};

export const api = axios.create({
  baseURL: '',
  withCredentials: true,
});

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not a refresh-token or login/register endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh-token') &&
      !originalRequest.url?.includes('/api/auth/login') &&
      !originalRequest.url?.includes('/api/auth/register')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          '/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );
        const newToken = refreshResponse.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Login API
export async function login({ email, password }) {
  const response = await api.post('/api/auth/login', { email, password });
  if (response.data?.token) {
    setAccessToken(response.data.token);
  }
  return response.data;
}

// Register API
export async function register({ username, email, password }) {
  const response = await api.post('/api/auth/register', { username, email, password });
  if (response.data?.token) {
    setAccessToken(response.data.token);
  }
  return response.data;
}

// Logout API
export async function logout() {
  try {
    const response = await api.post('/api/auth/logout');
    setAccessToken(null);
    return response.data;
  } catch (err) {
    setAccessToken(null);
    throw err;
  }
}

// Refresh Token API
export async function getRefreshToken() {
  const response = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken);
  }
  return response.data;
}

// Fetch user dashboard profile
export async function getDashboard() {
  const response = await api.get('/api/user/dashboard');
  return response.data;
}

export default api;