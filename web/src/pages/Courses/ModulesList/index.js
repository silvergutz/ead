import React, { useState, useEffect } from 'react';

import { getModules } from '../../../services/modules';
import { globalNotifications } from '../../../services';
import ModulesCreate from '../ModulesCreate';
import LessonsCreate from '../LessonsCreate';

import './styles.css';
import { deleteLesson } from '../../../services/lessons';

function ModulesList({ course }) {
  const [ modules, setModules ] = useState([]);
  const [ currentModule, setCurrentModule ] = useState({});
  const [ currentLesson, setCurrentLesson ] = useState({});
  const [ lessonUpdate, setLessonUpdate ] = useState(false);
  const [ activeLessonForm, setActiveLessonForm ] = useState(false);

  useEffect(() => {
    loadModules();
  }, [course]);

  async function loadModules(focusLesson) {
    if (course.id) {
      const response = await getModules(course.id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível carregar os módulos');
      } else {
        setModules(response);

        // Active Lesson Form to add new lesson to pretty new Module
        if (focusLesson) {
          console.log(focusLesson);
          if (focusLesson === true) {
            handleAddLesson(response[response.length-1]);
          } else {
            handleEditLesson(currentModule, focusLesson);
          }
        }
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

  async function handleDestroyLesson(lesson) {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      const response = await deleteLesson(lesson.id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível excluir a aula');
      } else {
        globalNotifications.sendSuccessMessage('Aula excluido com sucesso');
        loadModules();
      }
    }
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
            <ModulesCreate course={course} refreshModules={loadModules} />
          </li>
          {modules.map(obj => (
            <li key={obj.id} className="module">
              <ModulesCreate course={course} obj={obj} refreshModules={loadModules}>
                {(obj.lessons && obj.lessons.length) > 0 &&
                  <ul className="lessons">
                    {obj.lessons.map(lesson => (
                      <li key={lesson.id} className="lesson">
                        {lesson.name}
                        <div className="button-group">
                          <button className="mi small edit" onClick={e => handleEditLesson(obj, lesson)}>edit</button>
                          <button className="mi small remove" onClick={e => handleDestroyLesson(lesson)}>delete</button>
                        </div>
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
