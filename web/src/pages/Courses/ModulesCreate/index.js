import React, { useState, useEffect } from 'react';

import { storeModule, updateModule } from '../../../services/modules';
import { globalNotifications } from '../../../services';

function ModulesCreate({ course, obj, children }) {
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
    if (moduleName === '') {
      setIsEditingName(true);
    }
  }, [course, moduleName])

  async function handleSubmit() {
    const data = {
      name: moduleName,
      course_id: course.id,
    };
    const response = typeof moduleObj.id !== undefined ?
                      await updateModule(moduleObj.id, data) :
                      await storeModule(data);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um error ao carregar as lojas';
      globalNotifications.sendErrorMessage(err);
    } else {
      setIsEditingName(false);
      setModuleObj(response);
    }
  }

  return (
    <div className="ModulesCreate">
      {(moduleObj && !isEditingName) &&
        <div className="module">
          <div className="module-name">{moduleObj.name}</div>
          <button className="button mi" onClick={e => setIsEditingName(true)}>edit</button>
        </div>
      }
      {isEditingName &&
        <div className="module-form">
          <input type="text" name="name" value={moduleName} onChange={e => setModuleName(e.target.value)} />
          <button className="button mi" onClick={handleSubmit}>done</button>
        </div>
      }

      {children || ''}
    </div>
  );
}

export default ModulesCreate;
