import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import ImgProtected from '../../../components/ImgProtected';
import { getCourses, calcDuration } from '../../../services/courses';
import globalNotifications from '../../../services/globalNotifications';
import { auth } from '../../../services';

import '../../../components/slick/slick.css';
import '../../../components/slick/slick-theme.css';
import './styles.css';

function CoursesPage() {
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

  return (
    <div className="CoursesPage">
      <section>
        <h1 className="section-title">Treinamentos em andamento</h1>

        {auth.isAdmin() &&
          <Link to="/admin/cursos/novo" className="add-course button center-content">
            Adicionar Curso
            <i className="mi">add_circle_outline</i>
          </Link>
        }

        <Slider {...sliderSettings} className="courses">
          {courses.map(course => (
            <div key={course.id} className={`Course ${course.status}`}>
              <div className="course-cover">
                <ImgProtected file={course.cover} alt={course.name} />
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

export default CoursesPage;
