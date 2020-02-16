import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { auth } from './services';
import { history } from './helpers/history';
import Routes from './routes';
import Header from './components/Header';

import './App.css';

function App() {
  const [ currentUser, setCurrentUser ] = useState(null);

  useEffect(() => {
    auth.currentUser.subscribe(setCurrentUser);
  }, []);

  function logout() {
    auth.logout();
    history.push('/login');
  }

  return (
    <BrowserRouter forceRefresh={true}>
      <Header currentUser={currentUser} logout={logout} />
      <div className="App">
        <main>
            <Routes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
