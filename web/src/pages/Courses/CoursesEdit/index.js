import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { withRouter, useParams, useLocation } from 'react-router-dom';
import { globalNotifications } from '../../../services';
import CoursesForm from '../CoursesForm';
import ModulesList from '../ModulesList';
import { findCourse } from '../../../services/courses';

function CoursesEdit({ history }) {
  const { id } = useParams();
  let query = useQuery();

  const [ course, setCourse ] = useState({});
  const [ selectedIndex, setSelectedIndex ] = useState(0);

  useEffect(() => {
    async function loadCourse() {
      const response = await findCourse(id);

      if (response.error) {
        const err = response.error.message || 'Ocorreu um erro ao buscar os dados do Curso';
        globalNotifications.sendErrorMessage(err);
      } else {
        setCourse(response);

        const tab = query.get('tab');
        console.log(tab);
        if (tab === 'modulos') {
          setSelectedIndex(1);
        }
      }
    }

    loadCourse();
  }, [id]);

  // A custom hook that builds on useLocation to parse
  // the query string for you.
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  function onCourseChange(state) {
    console.log('onCourseChange', state);
    // if (state !== course) {
    //   setCourse(state);
    // }
  }

  return (
    <div className="CoursesEdit">
      <h1 className="page-title">Editar Curso</h1>

      {course &&
        <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
          <TabList>
            <Tab>Dados Gerais</Tab>
            <Tab>Módulos</Tab>
          </TabList>
          <TabPanel>
            <CoursesForm type="update" course={course} onCourseChange={onCourseChange} />
          </TabPanel>
          <TabPanel>
            <ModulesList course={course} />
          </TabPanel>
        </Tabs>
      }
    </div>
  )
}

export default withRouter(CoursesEdit);
