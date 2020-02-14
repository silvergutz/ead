import React, { useState, useEffect } from 'react';
import * as moment from 'moment';

import { getCourses } from '../../../services/courses';
import { Link } from 'react-router-dom';

function CoursesList() {
  const [ courses, setCourses] = useState([]);
  const [ errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadCourses() {
      const courses = await getCourses();

      if (courses.error) {
        setErrorMessage(courses.error);
      } else {
        setErrorMessage('');
        console.log(courses);
        setCourses(courses);
      }
    }

    loadCourses();
  }, []);

  function calcDuration(lessons) {
    const duration = lessons.reduce((accumulator, current) => {
      let time = moment.duration(current.duration).asSeconds();

      // let hours = current.duration.split(':');
      // if (hours[0] && hours[1] && hours[2]) {
      //   time.setHours(hours[0], hours[1], hours[2]);
      //   return accumulator + time.getTime();
      // } else {
      //   return accumulator;
      // }

      return accumulator + time;
    }, 0);

    const dateTime = moment.duration(duration, 'seconds');

    let hours = String((dateTime.days() * 24) + dateTime.hours()).substr(-2);
    if (hours.length == 1)
      hours = '0' + hours;

    const minutes = ('0' + dateTime.minutes()).substr(-2);
    const seconds = ('0' + dateTime.seconds()).substr(-2);

    return hours + ':' + minutes + ':' + seconds;
  }

  return (
    <div className="CoursesList">
      {errorMessage && (
        <div className="error-message">
          Não foi posível carregar os cursos.
          Detalhes: {errorMessage}
        </div>
      )}

      <section>
        <h2>Treinamentos em andamento</h2>

        <div className="courses">
          {courses.map(course => (
            <div key={course.id} className={`Course ${course.status}`}>
              <img src={course.cover} alt={course.name} />
              <div className="course-name">{course.name}</div>

              {course.lessons.length > 0 &&
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

              {course.teachers.length > 0 &&
                <div className="course-teacher">
                  <span className="key">Professor:</span>
                  <span className="value">
                    {course.teachers.map((teacher, i, a) => teacher.name + (i !== a.length-1 ? ', ' : ''))}
                  </span>
                </div>
              }

              <Link to={`cursos/${course.id}`}>Ver Curso</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CoursesList;
