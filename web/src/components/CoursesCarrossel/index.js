import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import ImgProtected from '../ImgProtected';
import { calcDuration, getCoursesCarrossel } from '../../services/courses';
import globalNotifications from '../../services/globalNotifications';
import { auth } from '../../services';

import '../slick/slick.css';
import '../slick/slick-theme.css';
import './styles.css';

function CoursesCarrossel() {
  const [ courses, setCourses] = useState([]);

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false
      }
    }]
    
  };

  useEffect(() => {
    async function loadCourses() {
      globalNotifications.clearMessages();

      const courses = await getCoursesCarrossel();

      if (courses.error) {
        globalNotifications.sendErrorMessage(`Não foi posível carregar o curso. Erro: ${courses.error}`);
      } else {
        setCourses(courses);
      }
    }

    loadCourses();
  }, []);

  return (
    <div className="CoursesCarrossel">
      <section>
        {auth.isAdmin() &&
          <Link to="/admin/cursos/novo" className="add-course button center-content">
            Adicionar Curso
            <i className="mi">add_circle_outline</i>
          </Link>
        }

        <div className="courses-carrossels">
          {(courses && courses.inProgress) &&
            <div className="courses-inProgresss">
              <h1 className="section-title">Treinamentos em andamento</h1>

              <Slider {...sliderSettings} slidesToShow={Math.min(courses.inProgress.length, 4)} className="courses">
                {courses.inProgress.map(course => (
                  <div key={course.id} className={`Course ${course.status}`}>
                    <div className="course-cover">
                      {course.cover &&
                        <ImgProtected file={course.cover} alt={course.name} />
                      }
                      {!course.cover &&
                        <img src="/images/default-course-cover.jpg" alt={course.name} />
                      }
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

                    <Link to={`cursos/${course.id}`} className="course-button">Ver Mais</Link>
                  </div>
                ))}
              </Slider>
            </div>
          }

          {(courses && courses.categories) &&
            <div className="courses-categories">
              {courses.categories.map(category => (
                <div key={category.category.id} className="course-category">
                  <h1 className="section-title">{category.category.name}</h1>

                  <Slider {...sliderSettings} slidesToShow={Math.min(category.courses.length, sliderSettings.slidesToShow)} className="courses">
                    {category.courses.map(course => (
                      <div key={course.id} className={`Course ${course.status}`}>
                        <div className="course-cover">
                          {course.cover &&
                            <ImgProtected file={course.cover} alt={course.name} />
                          }
                          {!course.cover &&
                            <img src="/images/default-course-cover.jpg" alt={course.name} />
                          }
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
                </div>
              ))}
            </div>
          }
        </div>
      </section>
    </div>
  );
}

export default CoursesCarrossel;
