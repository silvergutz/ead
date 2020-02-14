import axios from 'axios';
import auth from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3333'
});

api.interceptors.request.use(async config => {
  // Set JWT token to every request if user is logged in
  const user = auth.currentUserValue;
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

api.interceptors.response.use(response => response,
  async error => {
    if (error.response && [401,403].indexOf(error.response.status) !== -1) {
      if (window.location.pathname !== '/login') {
        auth.logout();
        window.location = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
