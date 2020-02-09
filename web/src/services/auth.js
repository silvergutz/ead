import { BehaviorSubject } from 'rxjs';

import api from './api';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const auth = {
  login,
  logout,
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

        return user;
      } else {
        console.error(response.data);
        return response.data;
      }
    })
    .catch(error => {
      console.error(error);
      return error;
    })
  ;
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
}

export default auth;
