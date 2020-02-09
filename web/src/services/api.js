import axios from 'axios';
import auth from './auth';
import { history } from '../helpers/history';

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

// api.interceptors.response.use(response => response, async error => {
//     if (String(error).indexOf('401') !== -1) {
//       auth.logout();
//       history.push('/login');
//       // window.location = '/login';
//     }
//     return error;
//   }
// );

export default api;
