import React from 'react';

import CoursesForm from '../CoursesForm';

function CoursesSave() {
  return (
    <div className="CoursesSave">
      <h1 className="page-title">Novo Curso</h1>

      <CoursesForm type="create" course={{}} />
    </div>
  )
}

export default CoursesSave;
