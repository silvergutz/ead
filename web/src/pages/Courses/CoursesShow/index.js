import React, { useState, useEffect } from 'react';
import { findCourse, embedVideo } from '../../../services/courses';
import { useParams, Link } from 'react-router-dom';

import globalNotifications from '../../../services/globalNotifications';
import auth from '../../../services/auth';

import './styles.css';

function CoursesShow() {
  const { id } = useParams();

  const [ course, setCourse ] = useState([]);
  const [ modules, setModules ] = useState([]);
  const [ lesson, setLesson ] = useState({});
  const [ video, setVideo ] = useState('');

  useEffect(() => {
    async function loadCourse() {
      globalNotifications.clearMessages();

      const course = await findCourse(id);

      if (course.error) {
        globalNotifications.sendErrorMessage(`Não foi posível carregar o curso. Erro: ${course.error.message}`);
      } else {
        setCourse(course);
        if (course.modules) {
          setModules(course.modules);
          if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
            setLesson(course.modules[0].lessons[0]);
          }
        }
      }
    }

    loadCourse();
  }, [id]);

  useEffect(() => {
    if (lesson) {
      if (lesson.video) {
        embedVideo(lesson.video).then(setVideo);
      }
    }

  }, [lesson])

  return (
    <div className="CourseShow">
      <h1 className="page-title">{course.name}</h1>

      {auth.isAdmin() &&
        <Link className="course edit button center-content" to={`/admin/cursos/${course.id}/editar`}>
          <i className="mi">edit</i>
          Editar
        </Link>
      }

      <div className="course-container">
        <div className="lesson-content" dangerouslySetInnerHTML={{ __html: video }} />
        <div className="course-lessons">
          {modules.length === 0 ? 'Nenhum modulo cadastrado' :
            <ul>
              {modules.map(m => (
                <li key={m.id} className="module">
                  <div className="module-name">{m.name}</div>

                  {m.lessons.length > 0 &&
                    <ul className="module-lessons">
                      {m.lessons.map(value => (
                        <li key={value.id} className={`lesson${value === lesson ? ' active' : ''}`}>
                          <button onClick={e => setLesson(value)} href="#">{value.name}</button>
                        </li>
                      ))}
                    </ul>
                  }
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    </div>
  );
}

export default CoursesShow;
