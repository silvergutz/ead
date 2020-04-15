import React, { useState } from 'react';

import auth from '../../services/auth';
import { globalNotifications } from '../../services';
import { storeComment } from '../../services/comments';

import './styles.css';

function CommentsForm({ lesson, parent, refreshComments }) {
  const [ enabled, setEnabled ] = useState(true);
  const [ content, setContent ] = useState('');

  const type = parent ? 'reply' : 'new';

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      content,
      lesson_id: lesson,
      parent_id: parent,
      status: 'approved',
    }

    const response = await storeComment(data);

    if (response.error) {
      globalNotifications.sendErrorMessage('Não foi possível gravar os dados');
    } else {
      if (auth.isAdmin()) {
        globalNotifications.sendSuccessMessage('Dados gravados com sucesso');
        setContent('');
        refreshComments();
      } else {
        globalNotifications.sendErrorMessage('Sua dúvida foi enviada, em breve o professor responderá');
      }
      if (type === 'reply') {
        setEnabled(false);
      }
    }
  }

  if(!enabled) {
    return '';
  }

  return (
    <form className={(type === 'reply' ? 'comment-reply' : 'comment-new') + ' CommentsForm'} onSubmit={handleSubmit}>
      <div className="form-field">
        <div className="field">
          <textarea
            className="content-field"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={type === 'reply' ? 'Escreva a sua resposta' : 'Dúvidas sobre a aula?'}
          />
        </div>
      </div>
      <div className="form-field submit">
        <button className="button" type="submit">enviar {type === 'reply' ? 'resposta' : 'dúvida'}</button>
      </div>
    </form>
  )
}

export default CommentsForm;
