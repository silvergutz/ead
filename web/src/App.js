import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { auth } from './services';
import Routes from './routes';
import Header from './components/Header';

import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalNotifications from './components/GlobalNotifications';

function App() {
  const [ currentUser, setCurrentUser ] = useState(null);

  useEffect(() => {
    auth.currentUser.subscribe(setCurrentUser);
  }, []);

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="App">
        <ErrorBoundary>
          <Header currentUser={currentUser} />
        </ErrorBoundary>
        <main>
          <GlobalNotifications />
          <ErrorBoundary>
            <Routes />
          </ErrorBoundary>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
