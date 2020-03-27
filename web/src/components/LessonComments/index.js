import React, { useState, useEffect } from 'react';

import auth from '../../services/auth';
import { globalNotifications } from '../../services';
import { storeComment, getComments } from '../../services/comments';
import ImgProtected from '../ImgProtected';

function LessonComments({ lesson }) {
  const [ comments, setComments ] = useState([]);
  const [ content, setContent ] = useState('');

  useEffect(() => {
    if (lesson.comments && lesson.comments.length) {
      setComments(lesson.comments)
    } else {
      loadComments();
    }
  }, [lesson])

  async function loadComments() {
    const response = await getComments(lesson.id);

    if (response.error) {
      globalNotifications.sendErrorMessage('Não foi possível carregar as dúvidas');
    } else {
      setComments(response);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      content,
      lesson_id: lesson.id,
      status: (auth.isAdmin() ? 'approved' : 'pending'),
    }

    const response = await storeComment(data);

    if (response.error) {
      globalNotifications.sendErrorMessage('Não foi possível gravar os dados');
    } else {
      if (auth.isAdmin()) {
        globalNotifications.sendSuccessMessage('Dados gravados com sucesso');
        setContent('');
        loadComments();
      } else {
        globalNotifications.sendErrorMessage('Sua dúvida foi enviada, em breve o professor responderá');
      }
    }
  }

  return (
    <div className="LessonComments">
      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <div className="field">
            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Dúvidas sobre a aula?" />
          </div>
        </div>
        <div className="form-field submit">
          <button type="submit">enviar dúvida</button>
        </div>
      </form>

      {comments.length > 0 &&
        <div className="comments">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-user-photo">
                <ImgProtected file={comment.user.photo} />
              </div>

              <div className="comment-data">
                <div className="comment-user">{comment.user.name}</div>
                <div className="comment-content">{comment.content}</div>
              </div>

              <div className="comment-date">{comment.created_at}</div>
              <div className="comment-reply-button">Responder &raquo;</div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default LessonComments;
