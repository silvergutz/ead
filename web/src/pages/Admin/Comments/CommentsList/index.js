import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';

import { getComments, deleteComment } from '../../../../services/comments';
import { getUsers } from '../../../../services/users';
import { globalNotifications } from '../../../../services';
import useQuery from '../../../../helpers/useQuery';

import './styles.css';

function CommentsList({ location }) {
  const query = useQuery();
  const [ comments, setComments ] = useState([]);
  const [ user, setUser ] = useState(null);
  const [ usersList, setUsersList ] = useState([]);

  useEffect(() => {
    loadUsers();
    loadComments(user ? user.value : null);
  }, []);

  useEffect(() => {
    loadComments(user ? user.value : null);
  }, [user]);

  useEffect(() => {
    setUserFromLocation();
  }, [usersList]);

  async function loadComments(userId) {
    globalNotifications.clearMessages();

    const response = await getComments(null, userId);

    if (response.error) {
      globalNotifications.sendErrorMessage(`Ocorreu um erro ao processar a requisição. Detalhes: ${response.error}`);
    } else {
      setComments(response);
    }
  }

  async function loadUsers() {
    globalNotifications.clearMessages();

    const response = await getUsers();

    if (response.error) {
      globalNotifications.sendErrorMessage(`Ocorreu um erro ao processar a requisição. Detalhes: ${response.error}`);
    } else {
      setUsersList(response.map((v) => { return { value: v.id, label: v.name } }));
    }
  }

  function setUserFromLocation() {

    if (!usersList) return;

    const userFromQs = parseInt(query.get('user'));

    const selectedUser = usersList.filter((v) => v.value === userFromQs);
    setUser((userFromQs && selectedUser.length ? selectedUser[0] : false));
  }

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

      <form className="comments-filter">
        <div className="form-field">
          <label htmlFor="teachers">Filtro por Aluno / Professor:</label>
          <div className="field">
            <Select
              name="users"
              value={user}
              onChange={value => setUser(value)}
              options={usersList}
              isMulti={false}
              isSearchable={true}
              placeholder="Selecione para filtrar"
              />
          </div>
        </div>
        <div className="button" onClick={e => setUser(null)}>limpar</div>
      </form>

      <div className="comments list-items">
        {!comments || comments.length <= 0 ? 'Nenhuma pergunta encontrada' :
        comments.map(comment => (
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

export default withRouter(CommentsList);
