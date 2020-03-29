import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import globalNotifications from '../../../services/globalNotifications';
import auth from '../../../services/auth';
import { findCourse } from '../../../services/courses';
import VideoPlayer from '../../../components/VideoPlayer';
import LessonComments from '../../../components/LessonComments';
import ProgressBar from '../../../components/ProgressBar';

import './styles.css';
import PageNotFound from '../../PageNotFound';

function CoursesShow() {
  const { id } = useParams();

  const [ activeModules, setActiveModules ] = useState([]);
  const [ course, setCourse ] = useState({});
  const [ modules, setModules ] = useState([]);
  const [ lesson, setLesson ] = useState({});
  const [ video, setVideo ] = useState('');

  useEffect(() => {
    async function loadCourse() {
      globalNotifications.clearMessages();

      const course = await findCourse(id);

      if (course.error) {
        if (course.response.status === 404) {
          globalNotifications.sendErrorMessage(course.error);
          setCourse(false);
        } else {
          globalNotifications.sendErrorMessage(`Não foi posível carregar o curso. Erro: ${course.error.message}`);
        }
      } else {
        setCourse(course);
        if (course.modules) {
          setModules(course.modules);
          if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
            setLesson(course.modules[0].lessons[0]);
            setActiveModules([course.modules[0].id]);
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

  function isModuleActive(id) {
    return activeModules.indexOf(id) >= 0 ? true : false;
  }

  function toggleActiveModule(id) {
    if (isModuleActive(id)) {
      setActiveModules(activeModules.filter(e => e !== id));
    } else {
      setActiveModules([...activeModules, id]);
    }
  }

  if (course === false) {
    return (
      <PageNotFound />
    )
  }

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
          {(!lesson.id || modules.length === 0) ? 'Nenhum modulo cadastrado' :
            <>
              <VideoPlayer video={video} />

              <LessonComments lesson={lesson} />
            </>
          }
        </div>
        <div className="course-lessons">
          {modules.length > 0 &&
            <>
              <ProgressBar progress={80} />
              <ul>
                {modules.map((m, i) => (
                  <li key={m.id} className="module">
                    <div className="module-name-wraper name-wraper" onClick={e => toggleActiveModule(m.id)}>
                      <span className="module-number number">{i+1}</span>
                      <span className="module-name name">{m.name}</span>
                      <i className="mi toggle">
                        {isModuleActive(m.id) ? 'arrow_drop_up' : 'arrow_drop_down'}
                      </i>
                    </div>

                    {m.lessons.length > 0 &&
                      <ul className={`module-lessons${isModuleActive(m.id) ? ' active' : ''}`}>
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
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default CoursesShow;
