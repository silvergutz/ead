import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';

import AttachmentsList from '../../../../components/AttachmentsList';
import { updateLesson, storeLesson, findLesson } from '../../../../services/lessons';
import { deleteAttachment, storeAttachment } from '../../../../services/attachments';
import { globalNotifications } from '../../../../services';

function LessonsCreate({ id, type, moduleObj, refreshModules }) {
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
    const top = document.getElementById('LessonsCreate').offsetTop;
    window.scrollTo(0, top);
  }, [id, moduleObj]);

  async function handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    // Clean error messages
    const errorsElms = document.querySelectorAll('form .error')
    if (errorsElms)
      errorsElms.forEach(elm => elm.classList.remove('error'));

    const data = {
      module_id: moduleObj.id,
      name,
      description,
      video,
      status: status || 'draft',
    };

    const response = type === 'update' ?
                      await updateLesson(id, data) :
                      await storeLesson(data);

    if (response.error) {
      let errorMessage = '';
      if (response.errors) {
        errorMessage = 'Alguns campos não foram preenchidos corretamente:<br>';
        errorMessage += '<ul>';
        response.errors.map(e => {
          errorMessage += `<li>${e.detail}</li>`;
          if (e.source.pointer) {
            document.getElementById(e.source.pointer).classList.add('error');
          }
        });
        errorMessage += '</ul>';
      } else {
        errorMessage = 'Não foi possível gravar os dados da aula';
      }
      globalNotifications.sendErrorMessage(errorMessage);
    } else {
      if (type === 'update') {
        setLesson(response);
      }

      refreshModules(response);

      setLesson(response);
      setName(response.name);
      setDescription(response.description || '');
      setVideo(response.video || '');
      setStatus(response.status);

      globalNotifications.sendSuccessMessage('Dados gravados com sucesso');
    }
  }

  async function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length) {
      var reader = new FileReader();

      const promisses = acceptedFiles.map(async (file) => {
        reader.readAsDataURL(file)

        const data = new FormData();
        data.append('file', file);
        data.append('attachmentable_type', 'lessons');
        data.append('attachmentable_id', lesson.id);

        const response = await storeAttachment(data);

        if (response.error) {
          globalNotifications.sendErrorMessage('Ocorreu um erro ao enviar o anexo');
          console.error(response.error);
        } else {
          setLesson({ ...lesson, attachments: [...lesson.attachments, response] });
          globalNotifications.sendSuccessMessage('Anexo gravado com sucesso');
        }

        return response;
      })

      await Promise.all(promisses);
    }
  }

  async function handleRemoveFile(id) {
    const response = await deleteAttachment(id)

    if (response.error) {
      globalNotifications.sendErrorMessage('Não foi possível remove o anexo');
      console.log(response.error)
    } else {
      setLesson({ ...lesson, attachments: lesson.attachments.filter(v => v.id !== id) });
      globalNotifications.sendSuccessMessage('Anexo removido');
    }
  }

  return (
    <div id="LessonsCreate" className="LessonsCreate">
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

        <div className="form-field">
          <label htmlFor="attachments">Anexos:</label>

          <div className="field">
            {type !== 'update' ? 'Para enviar anexos você deve primeiro salvar a aula' :
              <div className="attachments">
                {(lesson && lesson.id) &&
                  <AttachmentsList attachmentable={lesson} type="lessons" handleRemoveFile={handleRemoveFile} />
                }
                <div className="attachment-field upload-field field">
                  <Dropzone onDrop={handleFileDrop} multiple={true}>
                    {({getRootProps, getInputProps}) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>Arraste e solte um arquivo aqui ou clique para selecionar</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              </div>
            }
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
