import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import globalNotifications from '../../../services/globalNotifications';
import auth from '../../../services/auth';
import { findCourse } from '../../../services/courses';
import { findLesson } from '../../../services/lessons';
import VideoPlayer from '../../../components/VideoPlayer';
import LessonComments from '../../../components/LessonComments';
import ProgressBar from '../../../components/ProgressBar';

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
    if (lesson.video === video) {
      setVideo('');
    }

    setVideo(lesson.video);
  }, [lesson])

  return (
    <div className="CourseShow">
      <h1 className="page-title">{course.name}</h1>

      {auth.isAdmin() &&
        <Link className="course edit button center-content" to={`/admin/cursos/${course.id}/editar`}>
          Editar
          <i className="mi">edit</i>
        </Link>
      }

      <div className="course-container">
        <div className="lesson-content">
          <VideoPlayer video={video} />

          <LessonComments lesson={lesson} />
        </div>
        <div className="course-lessons">
          <ProgressBar progress={80} />

          {modules.length === 0 ? 'Nenhum modulo cadastrado' :
            <ul>
              {modules.map((m, i) => (
                <li key={m.id} className="module">
                  <div className="module-name-wraper name-wraper">
                    <span className="module-number number">{i+1}</span>
                    <span className="module-name name">{m.name}</span>
                  </div>

                  {m.lessons.length > 0 &&
                    <ul className="module-lessons">
                      {m.lessons.map((value, i) => (
                        <li key={value.id} className={`lesson name-wraper${value === lesson ? ' active' : ''}`}>
                          <span className="lesson-number number">{i+1}</span>
                          <button className="lesson-name name" onClick={e => setLesson(value)} href="#">{value.name}</button>
                          <span className="lesson-view-status finished">
                            <i className="mi">clear</i>
                          </span>
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
