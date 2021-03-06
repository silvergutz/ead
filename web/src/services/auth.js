import { BehaviorSubject } from 'rxjs';

import api from './api';
import { findUser } from './users';
import { handleError } from '../helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const auth = {
  login,
  logout,
  requestForgotPasswordToken,
  resetPassword,
  isAdmin,
  refreshUserData,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() { return currentUserSubject.value }
};

function login(credentials) {
  return api.post('/authenticate', credentials)
    .then(response => {
      if (response.status === 200 && response.data.token) {
        const user = response.data;

        // Store current user JWT token in local storage to keep user logged in between page refreshs
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);

        return true;
      } else {
        return response.data;
      }
    })
    // .catch(error => {
    //   console.error(error);
    //   return error;
    // })
  ;
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}

function isAdmin() {
  const user = auth.currentUserValue;
  if (user && user.level === 'manager') {
    return true;
  }

  return false;
}

async function refreshUserData() {
  const response = await findUser(auth.currentUserValue.id);

  if (!response.error) {
    const newUserInfos = { ...response, token: auth.currentUserValue.token };
    localStorage.setItem('currentUser', JSON.stringify(newUserInfos));
    currentUserSubject.next(newUserInfos);
  }

  return true;
}

async function requestForgotPasswordToken(email) {
  console.log('email', email);
  try {
    const response = await api.post('/forgot', { email });

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

async function resetPassword(data) {
  try {
    const response = await api.post('/reset', data);

    return response.data;
  } catch(e) {
    return handleError(e);
  }
}

export default auth;
