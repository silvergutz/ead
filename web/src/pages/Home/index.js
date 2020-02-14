import React, { useState } from 'react';

import { auth } from '../../services';
import { withRouter } from 'react-router-dom';

function Home() {
  const [ currentUser ] = useState(auth.currentUserValue);

  return (
    <>
      <h1>Bem vindo ao Portal EaD</h1>
      <p>Você está logado como {currentUser.name}</p>
    </>
  )
}

export default withRouter(Home);
