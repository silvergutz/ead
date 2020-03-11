import React, { useState, useEffect } from 'react';

import { withRouter, useParams } from 'react-router-dom';
import { globalNotifications } from '../../../services';
import CoursesForm from '../CoursesForm';

function CoursesEdit({ history }) {
  const { id } = useParams();

  useEffect(() => {

  }, []);

  return (
    <div className="CoursesEdit">
      <h1 className="page-title">Editar Curso</h1>

      <CoursesForm type="update" id={id} />
    </div>
  )
}

export default withRouter(CoursesEdit);
