import React, { useState, useEffect } from 'react';
import { api } from '../../services';

function CoursesList() {
  const [ courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await api.get('/courses');

        if (response && response.status === 200) {
          setCourses(response.data);
        }
      } catch(e) {
        console.error(e);
      }
    }

    loadCourses();
  }, []);

  return (
    <div className="CoursesList">
      {courses.map(course => (
        <div className="Course">
          <div className="course-name">{course.name}</div>
          <img src={course.cover} />
        </div>
      ))}
    </div>
  );
}

export default CoursesList;
