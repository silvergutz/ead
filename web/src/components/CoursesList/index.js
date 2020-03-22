import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ImgProtected from '../ImgProtected';
import { getCourses, deleteCourse, calcDuration } from '../../services/courses';
import { auth, globalNotifications } from '../../services';

import './styles.css';

function CoursesList() {
  const [ courses, setCourses ] = useState([]);
  const [ searchTerm, setSearchTerm ] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [searchTerm]);

  async function loadCourses() {
    globalNotifications.clearMessages();

    const response = await getCourses(searchTerm);

    if (response.errors) {
      globalNotifications.sendErrorMessage(response.error);
      setCourses([]);
    } else {
      setCourses(response);
    }
  }

  async function handleDestroyCourse(course) {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      const response = await deleteCourse(course.id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível excluir o curso');
      } else {
        globalNotifications.sendSuccessMessage('Aluno excluido com sucesso');
        loadCourses();
      }
    }
  }

  return (
    <div className="CoursesList">
      <h1 className="page-title">Cursos</h1>

      {auth.isAdmin() &&
        <>
          <div className="search-form">
            <input className="search-input" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} type="search" placeholder="Buscar nome do curso" />
          </div>

          <Link to="/admin/cursos/novo" className="add-course button center-content">
            Adicionar Curso
            <i className="mi">add_circle_outline</i>
          </Link>
        </>
      }

      <div className="courses">
        {courses.map(course => (
          <div key={course.id} className={`Course ${course.status}`}>
            <div className="course-cover">
              <Link to={`/cursos/${course.id}`}>
                {course.cover &&
                  <ImgProtected file={course.cover} alt={course.name} />
                }
                {!course.cover &&
                  <img src="/images/default-course-cover.jpg" alt={course.name} />
                }
              </Link>
            </div>
            <div className="course-details">
              <Link to={`/cursos/${course.id}`}>
                <h2 className="course-name">{course.name}</h2>

                <div className="course-status">
                  <span className="key">Status: </span>
                  <span className="value">{course.status === 'draft' ? 'rascunho' : 'publicado'}</span>
                </div>

                {(course.lessons && course.lessons.length) > 0 &&
                  <>
                    <div className="course-lessons">
                      <span className="key">Aulas:</span>
                      <span className="value">{course.lessons.length}</span>
                    </div>
                    <div className="course-duration">
                      <span className="key">Duração:</span>
                      <span className="value">
                        {calcDuration(course.lessons)}
                      </span>
                    </div>
                  </>
                }

                {(course.teachers && course.teachers.length) > 0 &&
                  <div className="course-teacher">
                    <span className="key">Professor:</span>
                    <span className="value">
                      {course.teachers.map((teacher, i, a) => teacher.name + (i !== a.length-1 ? ', ' : ''))}
                    </span>
                  </div>
                }
              </Link>
            </div>
            {auth.isAdmin() &&
              <div className="course-actions">
                <div className="button-group">
                  <Link to={`/admin/cursos/${course.id}/editar`} className="edit-course edit button small mi">
                    edit
                  </Link>
                  <button className="remove-course remove button small mi" onClick={e => handleDestroyCourse(course)}>
                    delete
                  </button>
                </div>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesList;
