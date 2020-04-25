import React, { useState, useEffect } from 'react';
import { useParams, Link, withRouter } from 'react-router-dom';

import globalNotifications from '../../../services/globalNotifications';
import auth from '../../../services/auth';
import { findCourse } from '../../../services/courses';
import VideoPlayer from '../../../components/VideoPlayer';
import LessonComments from '../../../components/LessonComments';
import ProgressBar from '../../../components/ProgressBar';

import AttachmentsList from '../../../components/AttachmentsList';
import PageNotFound from '../../PageNotFound';
import { storeLessonAction } from '../../../services/lessons';

import './styles.css';

function CoursesShow({ history, location }) {
  const { id, lessonId } = useParams();

  const [ loading, setLoading ] = useState([]);
  const [ activeModules, setActiveModules ] = useState([]);
  const [ course, setCourse ] = useState({});
  const [ modules, setModules ] = useState([]);
  const [ lesson, setLesson ] = useState({});
  const [ video, setVideo ] = useState('');

  // Course or Location changed
  useEffect(() => {
    setLoading(true);
    loadCourse();
  }, [id, location]);

  // Lesson changed
  useEffect(() => {
    (async () => await storeLessonAction(lesson.id, 'open'))();

    if (lesson.video === video) {
      setVideo('');
    }

    setVideo(lesson.video);
  }, [lesson])

  async function loadCourse() {
    globalNotifications.clearMessages();

    const course = await findCourse(id, true);

    if (course.error) {
      if (course.response && course.response.status === 404) {
        globalNotifications.sendErrorMessage(course.error);
        setCourse(null);
      } else {
        const errorDetails = course.error.message ? ` Erro: ${course.error.message}` : '';
        globalNotifications.sendErrorMessage(`Não foi posível carregar o curso.${errorDetails}`);
        setCourse(false);
      }
    } else {
      setCourse(course);

      // If not has anyone module
      if (!course.modules || !course.modules.length) {
        setModules([]);
      } else {

        // find lesson passed on URL
        const formatedModules = course.modules.map(m => {
          if (!m.lessons.length) return m;

          m.lessons = m.lessons.map(l => {
            // Set the current progress of every lesson
            if (l.history && l.history.length) {
              const actions = l.history.reduce((p, c) => {
                p && p.push(c.action);
                return p;
              }, []);

              if (actions.indexOf('done') >= 0) l.progress = 'done';
              else if (actions.indexOf('start') >= 0) l.progress = 'start';
              else if (actions.indexOf('open') >= 0) l.progress = 'open';
              else l.progress = 'nothing';
            }

            // Set active Lesson based on URL
            if (lessonId) {
              if (l.id === parseInt(lessonId)) {
                setLesson(l);
                setActiveModules([m.id]);
              }
            }

            return l;
          });

          return m;
        });

        // if not passed a lesson on URL
        if (!lessonId) {
          // move to the next that was not finished
          moveToNextLesson(formatedModules);
          return;
        }

        setModules(formatedModules);
      }
    }

    setLoading(false);
  }

  function isModuleActive(id) {
    return (activeModules.length && activeModules.indexOf(id) >= 0) ? true : false;
  }

  function toggleActiveModule(id) {
    if (isModuleActive(id)) {
      setActiveModules(activeModules.filter(e => e !== id));
    } else {
      setActiveModules([...activeModules, id]);
    }
  }

  function changeActiveLesson(lesson) {
    history.push(`/cursos/${id}/aula/${lesson.id}`);
    setLesson(lesson);
    setActiveModules([lesson.module_id]);
  }

  async function handleVideoPlaying(event) {
    await storeLessonAction(lesson.id, 'start');
  }

  async function handleVideoEnded(event) {
    const response = await storeLessonAction(lesson.id, 'done');

    if (response.error) {
      console.error(response.error);
    } else {
      globalNotifications.sendSuccessMessage('Parabéns, você concluiu mais uma aula!');

      // move to next lesson if has or refresh course to update the progress
      moveToNextLesson(modules, lesson) || loadCourse();
    }
  }

  function moveToNextLesson(modules, current) {
    if (modules && modules.length) {
      let currentIndex;

      for (let m of modules) {
        if (!m.lessons || !m.lessons.length) continue;

        for (let i in m.lessons) {
          if (currentIndex) {
            changeActiveLesson(m.lessons[i]);
            return m.lessons[i];
          }

          // if has set current lesson, get the next one
          if (current) {
            if (m.lessons[i].id === current.id) {
              currentIndex = i;
            }

          // if not, get the next that was not finished yeat
          } else {
            if (m.lessons[i].progress !== 'done') {
              changeActiveLesson(m.lessons[i]);
              return m.lessons[i];
            }
          }
        }
      }

      // if not has set current lesson yeat means that current is the last one
      // ...or not passed lesson id on URL
      if (!current) {
        // then change to the first one
        if (modules[0].lessons && modules[0].lessons.length) {
          changeActiveLesson(modules[0].lessons[0]);
          return modules[0].lessons[0];
        }
      }
    }

    // not has next lesson or modules are empty
    return null;
  }

  if (course === null) {
    return (
      <PageNotFound />
    )
  }

  if (course === false) {
    return (
      <div className="error">Ocorreu um erro ao carregar o curso</div>
    )
  }

  return (
    <div className="CourseShow">
      {loading ? (
        <h1 className="page-title">Carregando...</h1>
      ) : (
        <>
          <h1 className="page-title">{course.name}</h1>

          {auth.isAdmin() &&
            <Link className="course edit button center-content" to={`/admin/cursos/${course.id}/editar`}>
              Editar
              <i className="mi">edit</i>
            </Link>
          }

          <div className="course-container">
            <div className="lesson-content">
              {lesson === false && 'Aula não encontrada'}
              {(!lesson.id || modules.length === 0) ? (lesson === false ? '' : 'Nenhum modulo cadastrado') :
                <>
                  <VideoPlayer video={video} onVideoEnded={handleVideoEnded} onVideoPlaying={handleVideoPlaying} />

                  <div className="lesson-attachments">
                    <span className="lesson-attachments-label">Anexos: </span>
                    <AttachmentsList attachmentable={lesson} type="lessons" />
                  </div>

                  <LessonComments lesson={lesson} />
                </>
              }
            </div>
            <div className="course-lessons">
              {modules.length > 0 &&
                <>
                  <ProgressBar progress={course.progress || 0} />
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
                              <li key={value.id} className={`lesson name-wraper${value === lesson ? ' active' : ''}${value.progress === 'done' ? ' finished' : ''}`}>
                                <span className="lesson-number number">{i+1}</span>
                                <button className="lesson-name name" onClick={e => changeActiveLesson(value)} href="#">{value.name}</button>
                                <span className="lesson-view-status">
                                  <i className="mi">{value.progress === 'done' ? 'done' : 'clear'}</i>
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
        </>
      )}
    </div>
  );
}

export default withRouter(CoursesShow);
