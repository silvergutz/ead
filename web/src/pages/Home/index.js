import React from 'react';

import CoursesCarrossel from '../../components/CoursesCarrossel'
import { withRouter } from 'react-router-dom';

function Home() {
  return (
    <>
      <CoursesCarrossel />
    </>
  )
}

export default withRouter(Home);
