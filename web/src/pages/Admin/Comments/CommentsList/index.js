import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComments, deleteComment } from '../../../../services/comments';
import { globalNotifications } from '../../../../services';
import moment from 'moment';

function CommentsList() {
  const [ comments, setComments ] = useState([]);

  useEffect(() => {
    async function loadComments() {
      globalNotifications.clearMessages();

      const response = await getComments();

      if (response.error) {
        globalNotifications.sendErrorMessage(`Ocorreu um erro ao processar a requisição. Detalhes: ${response.error}`);
      } else {
        setComments(response);
      }
    }

    loadComments();
  }, []);

  async function handleDelete(id) {
    const response = await deleteComment(id);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um erro ao excluir o registro';
      globalNotifications.sendErrorMessage(err);
    } else {
      globalNotifications.sendSuccessMessage('Registro excluido');
      setComments(comments.filter(comment => comment.id !== id));
    }
  }

  return (
    <div className="CommentsList">
      <h1 className="page-title">Perguntas</h1>

      <div className="comments list-items">
        {comments.map(comment => (
          <div key={comment.id} className="comment item">
              <div className="comment-wraper item-details">
                <div className="comment-header item-header">
                  <div className="comment-user item-title">{comment.user.name}</div>
                  <div className="comment-lesson">
                    <Link to={`/cursos/${comment.lesson.module.course_id}/aula/${comment.lesson.id}/#comment-${comment.id}`} target="_blank">
                      {comment.lesson.module.course.name} &rsaquo; {comment.lesson.name}
                    </Link>
                  </div>
                  <div className="comment-date button">{moment(comment.created_at).format('DD/MM/YYYY')}</div>
                </div>
                <div className="comment-content item-content">{comment.content}</div>
              </div>
              <div className="actions .button-group">
                <button className="button remove link mi" onClick={e => handleDelete(comment.id)}>delete</button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsList;
