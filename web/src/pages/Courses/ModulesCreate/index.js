import React, { useState, useEffect } from 'react';

import { storeModule, updateModule } from '../../../services/modules';
import { globalNotifications } from '../../../services';
import { withRouter } from 'react-router-dom';

function ModulesCreate({ history, course, obj, children }) {
  const [ moduleObj, setModuleObj ] = useState({});
  const [ isEditingName, setIsEditingName ] = useState(true);
  const [ moduleName, setModuleName ] = useState('');

  useEffect(() => {
    if (obj) {
      setModuleObj(obj);
      setModuleName(obj.name);
      setIsEditingName(false);
    }
  }, [obj]);

  useEffect(() => {
    // if (moduleName === '') {
    //   setIsEditingName(true);
    // }
  }, [course, moduleName])

  async function handleSubmit() {
    const data = {
      name: moduleName,
      course_id: course.id,
    };

    const response = moduleObj.id === undefined ?
                      await storeModule(data) :
                      await updateModule(moduleObj.id, data);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um error ao carregar as lojas';
      globalNotifications.sendErrorMessage(err);
    } else {
      window.location = `/cursos/${course.id}/editar?tab=modulos`;
      setIsEditingName(false);
      setModuleObj(response);
    }
  }

  return (
    <div className="ModulesCreate">
      {(moduleObj && !isEditingName) &&
        <div className="module">
          <div className="module-name">{moduleObj.name}</div>
          <button className="mi edit" onClick={e => setIsEditingName(true)}>edit</button>
        </div>
      }
      {(isEditingName && !moduleObj) &&
        <div className="module-form">
          <input type="text" name="name" value={moduleName} onChange={e => setModuleName(e.target.value)} />
          <button className="mi" onClick={handleSubmit}>done</button>
        </div>
      }
      {(isEditingName && moduleObj) &&
        <div className="module-form">
          <input type="text" name="name" value={moduleName} onChange={e => setModuleName(e.target.value)} />
          <button className="mi" onClick={handleSubmit}>done</button>
        </div>
      }

      {children || ''}
    </div>
  );
}

export default withRouter(ModulesCreate);
