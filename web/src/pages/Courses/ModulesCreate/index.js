import React, { useState, useEffect } from 'react';

import { storeModule, updateModule, deleteModule } from '../../../services/modules';
import { globalNotifications } from '../../../services';
import { withRouter } from 'react-router-dom';

import './styles.css';

function ModulesCreate({ history, course, obj, refreshModules, children }) {
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

  async function handleSubmit() {
    if (!moduleName) {
      globalNotifications.sendErrorMessage('Por favor, preencha o nome do módulo');
      return;
    }

    const data = {
      name: moduleName,
      course_id: course.id,
    };

    const response = moduleObj.id === undefined ?
                      await storeModule(data) :
                      await updateModule(moduleObj.id, data);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um error ao gravar os dados';
      globalNotifications.sendErrorMessage(err);
    } else {
      if (!moduleObj.id) {
        globalNotifications.sendSuccessMessage('Novo módulo cadastrado');
        refreshModules(true);
        setModuleName('');
        // window.location = `/cursos/${course.id}/editar?tab=modulos`;
      } else {
        globalNotifications.sendSuccessMessage('Dados gravados com sucesso');
        setIsEditingName(false);
        setModuleObj(response);
      }
    }
  }

  async function handleDestroyModule(moduleObj) {
    if (window.confirm('Tem certeza que deseja excluir este módulo inteiro?')) {
      const response = await deleteModule(moduleObj.id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível excluir o módulo');
      } else {
        globalNotifications.sendSuccessMessage('Módulo excluido com sucesso');
        refreshModules();
      }
    }
  }

  return (
    <div className="ModulesCreate">
      {(moduleObj && !isEditingName) &&
        <div className="module-content">
          <div className="module-name">{moduleObj.name}</div>
          <div className="button-group">
            <button className="mi small edit" onClick={e => setIsEditingName(true)}>edit</button>
            <button className="mi small remove" onClick={e => handleDestroyModule(moduleObj)}>delete</button>
          </div>
        </div>
      }
      {(isEditingName) &&
        <div className="module-form module-content">
          <input type="text" name="name" value={moduleName} onChange={e => setModuleName(e.target.value)} />
          <button className="mi small send" onClick={handleSubmit}>done</button>
        </div>
      }

      {children || ''}
    </div>
  );
}

export default withRouter(ModulesCreate);
