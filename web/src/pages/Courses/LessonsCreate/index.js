import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { updateLesson, storeLesson, findLesson } from '../../../services/lessons';
import { globalNotifications } from '../../../services';

function LessonsCreate({ id, history, type, moduleObj, refreshModules }) {
  const [ lesson, setLesson ] = useState({});
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ video, setVideo ] = useState('');
  const [ status, setStatus ] = useState('draft');

  useEffect(() => {
    async function loadLesson() {
      const response = await findLesson(id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível carregar a aula');
        console.error(response.error);
      } else {
        setLesson(response);
        setName(response.name);
        setDescription(response.description);
        setVideo(response.video);
        setStatus(response.status);
      }
    }

    setLesson({});
    setName('');
    setDescription('');
    setVideo('');
    setStatus('');

    if (id) {
      loadLesson();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, moduleObj]);

  async function handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    const data = {
      module_id: moduleObj.id,
      name,
      description,
      video,
      status,
    };

    const response = type === 'update' ?
                      await updateLesson(id, data) :
                      await storeLesson(data);

    if (response.error) {
      globalNotifications.sendErrorMessage('Não foi possível gravar os dados');
      console.error(response.error);
    } else {
      if (type === 'update') {
        setLesson(response);
      }

      refreshModules();

      globalNotifications.sendSuccessMessage('Dados gravados com sucesso');
    }
  }

  return (
    <div className="LessonsCreate">
      <hgroup className="lesson-form-title">
        <h2 className="title">Módulo: {moduleObj.name}</h2>
        <h3 className="subtitle">
          {type === 'update' ? `Editar Aula: ${lesson.name}` : 'Nova Aula'}
        </h3>
      </hgroup>

      <form onSubmit={handleSubmit} className="model-form lesson-form">
        <div className="form-field">
          <label htmlFor="name">Nome:</label>
          <div className="field">
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="description">Descrição:</label>
          <div className="field">
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="video">Vídeo URL:</label>
          <div className="field">
            <input id="video" type="text" value={video} onChange={e => setVideo(e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="status">Status:</label>
          <div className="field">
            <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>
        <div className="form-field submit">
          <button type="submit">Gravar</button>
        </div>
      </form>
    </div>
  );
}

export default withRouter(LessonsCreate);
