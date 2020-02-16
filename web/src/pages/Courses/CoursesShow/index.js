import React, { useState, useEffect } from 'react';
import { findCourse, embedVideo } from '../../../services/courses';
import { useParams } from 'react-router-dom';

import './styles.css';

function CoursesShow() {
  const { id } = useParams();

  const [ course, setCourse ] = useState([]);
  const [ modules, setModules ] = useState([]);
  const [ lesson, setLesson ] = useState({});
  const [ video, setVideo ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    async function loadCourse() {
      const course = await findCourse(id);

      if (course.error) {
        setErrorMessage(course.error.message);
      } else {
        setErrorMessage('');
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
    if (lesson && lesson.video) {
      embedVideo(lesson.video).then(setVideo);
    }
  }, [lesson])

  return (
    <div className="CourseShow">
      {errorMessage &&
        <div className="error-message">
          <span>Não foi posível carregar o curso.</span>
          <span>Detalhes: {errorMessage.toString()}</span>
        </div>
      }

      <h1 className="page-title">{course.name}</h1>

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
