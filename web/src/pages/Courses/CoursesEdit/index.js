import React, { useState, useEffect } from 'react';

import { withRouter, useParams } from 'react-router-dom';
import { globalNotifications } from '../../../services';
import CoursesForm from '../CoursesForm';
import ModulesList from '../ModulesList';
import { findCourse } from '../../../services/courses';

function CoursesEdit({ history }) {
  const { id } = useParams();

  const [ course, setCourse ] = useState({});

  useEffect(() => {
    async function loadCourse() {
      const response = await findCourse(id);

      if (response.error) {
        const err = response.error.message || 'Ocorreu um erro ao buscar os dados do Curso';
        globalNotifications.sendErrorMessage(err);
      } else {
        setCourse(response);
        console.log('CoursesEdit:setCourse ', response);
      }
    }

    loadCourse();
  }, [id]);

  function onCourseChange(state) {
    console.log('onCourseChange', state);
    // if (state !== course) {
    //   setCourse(state);
    // }
  }

  return (
    <div className="CoursesEdit">
      <h1 className="page-title">Editar Curso</h1>

      {course &&
        <>
          <CoursesForm type="update" course={course} onCourseChange={onCourseChange} />
          <ModulesList course={course} />
        </>
      }
    </div>
  )
}

export default withRouter(CoursesEdit);
