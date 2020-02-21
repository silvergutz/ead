import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import * as moment from 'moment';

import { getCourses } from '../../../services/courses';
import { Link } from 'react-router-dom';

import '../../../components/slick/slick.css';
import '../../../components/slick/slick-theme.css';
import './styles.css';
import globalNotifications from '../../../services/globalNotifications';

function CoursesList() {
  const [ courses, setCourses] = useState([]);

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  useEffect(() => {
    async function loadCourses() {
      globalNotifications.clearMessages();

      const courses = await getCourses();

      if (courses.error) {
        globalNotifications.sendErrorMessage(`Não foi posível carregar o curso. Erro: ${courses.error}`);
      } else {
        setCourses(courses);
      }
    }

    loadCourses();
  }, []);

  function calcDuration(lessons) {
    const duration = lessons.reduce((accumulator, current) => {
      let time = moment.duration(current.duration).asSeconds();
      return accumulator + time;
    }, 0);

    const dateTime = moment.duration(duration, 'seconds');

    let hours = String((dateTime.days() * 24) + dateTime.hours()).substr(-2);
    if (hours.length === 1)
      hours = '0' + hours;

    const minutes = ('0' + dateTime.minutes()).substr(-2);
    const seconds = ('0' + dateTime.seconds()).substr(-2);

    return hours + ':' + minutes + ':' + seconds;
  }

  return (
    <div className="CoursesList">
      <section>
        <h1 className="section-title">Treinamentos em andamento</h1>

        <Slider {...sliderSettings} className="courses">
          {courses.map(course => (
            <div key={course.id} className={`Course ${course.status}`}>
              <div className="course-cover">
                <img src={course.cover} alt={course.name} />
              </div>
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

              <Link to={`cursos/${course.id}`} className="course-button">Ver Curso</Link>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}

export default CoursesList;
