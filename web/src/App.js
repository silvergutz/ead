import React, { useState, useEffect } from 'react';
import { Link, Router } from 'react-router-dom';

import { auth } from './services';
import { history } from './helpers/history';
import Routes from './routes';

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
    <div className="App">
      <header className="App-header">
        <h1>EaD</h1>

        {currentUser &&
          <a onClick={logout}>Sair</a>
        }
      </header>

      <main>
        <Routes />
      </main>
    </div>
  );
}

export default App;
