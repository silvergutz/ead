import React, { useState, useEffect } from 'react';
import { findCourse } from '../../../services/courses';
import { useParams } from 'react-router-dom';

function CoursesShow() {
  const { id } = useParams();

  const [ course, setCourse ] = useState([]);
  const [ lesson, setLesson ] = useState({});
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    async function loadCourse() {
      const course = await findCourse(id);

      if (course.error) {
        setErrorMessage(course.error.message);
      } else {
        setErrorMessage('');
        setCourse(course);
        if (course.lessons.length) {
          setLesson(course.lessons[0])
        }
      }
    }

    loadCourse();
  }, []);

  return (
    <div className="Course">
      {errorMessage &&
        <div className="error-message">
          <span>Não foi posível carregar o curso.</span>
          <span>Detalhes: {errorMessage.toString()}</span>
        </div>
      }

      <h1>{course.name}</h1>

      <div className="course-container">
        <div className="lesson-content">
          {course.video}
        </div>
        <div className="course-lessons">
          {course.modules && course.modules.length == 0 ? 'Nenhum modulo cadastrado' :
            <ul>
              {course.modules.map(module => (
                <li className="module">
                  <div className="module-name">{module.name}</div>

                  {module.lessons.length > 0 &&
                    <ul className="module-lessons">
                      {module.lessons.map(lesson => (
                        <li className="lesson">
                          <a onClick={setLesson(lesson)}>{lesson.name}</a>
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
