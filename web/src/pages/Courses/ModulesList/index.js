import React, { useState, useEffect } from 'react';

import { getModules, findModule } from '../../../services/modules';
import { globalNotifications } from '../../../services';
import ModulesCreate from '../ModulesCreate';
import LessonsCreate from '../LessonsCreate';

import './styles.css';

function ModulesList({ course }) {
  const [ modules, setModules ] = useState([]);
  const [ currentModule, setCurrentModule ] = useState({});
  const [ currentLesson, setCurrentLesson ] = useState({});
  const [ lessonUpdate, setLessonUpdate ] = useState(false);
  const [ activeLessonForm, setActiveLessonForm ] = useState(false);

  useEffect(() => {
    loadModules();
  }, [course]);

  async function loadModules() {
    if (course.id) {
      const response = await getModules(course.id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível carregar os módulos');
      } else {
        setModules(response);
      }
    }
  }

  function handleAddLesson(moduleObj) {
    setCurrentModule(moduleObj);
    setCurrentLesson(null);
    setLessonUpdate(false);
    setActiveLessonForm(true);
  }

  function handleEditLesson(moduleObj, lesson) {
    setCurrentModule(moduleObj);
    setCurrentLesson(lesson);
    setLessonUpdate(true);
    setActiveLessonForm(true);
  }

  return (
    <div className="ModulesList">
      <div className="current-lesson">
        {activeLessonForm &&
          <LessonsCreate moduleObj={currentModule} id={currentLesson ? currentLesson.id : null} type={lessonUpdate ? 'update' : 'create'} refreshModules={loadModules} />
        }
        {!activeLessonForm &&
          <div className="lesson-select-info">
            Use a lista ao lado para editar ou criar uma nova aula
          </div>
        }
      </div>
      <div className="modules-wraper">
        <ul className="modules">
          <li className="module new-module">
            <div className="new-module-title">Novo módulo</div>
            <ModulesCreate course={course} />
          </li>
          {modules.map(obj => (
            <li key={obj.id} className="module">
              <ModulesCreate course={course} obj={obj}>
                {obj.lessons.length > 0 &&
                  <ul className="lessons">
                    {obj.lessons.map(lesson => (
                      <li key={lesson.id} className="lesson">
                        {lesson.name}
                        <button className="mi edit" onClick={e => handleEditLesson(obj, lesson)}>edit</button>
                      </li>
                    ))}
                  </ul>
                }
                <div className="create-lesson">
                  <button onClick={e => handleAddLesson(obj)}>
                    Adicionar Aula <i className="mi">add_circle_outline</i>
                  </button>
                </div>
              </ModulesCreate>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ModulesList;
