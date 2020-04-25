import React, { useState, useEffect } from 'react';
import { withRouter, useParams, Link } from 'react-router-dom';

import ImgProtected from '../../../../components/ImgProtected';
import { globalNotifications } from '../../../../services';
import { findUser } from '../../../../services/users';

import './styles.css';
import ProgressBar from '../../../../components/ProgressBar';
import moment from 'moment';

import './styles.css';

function UsersShow({ history }) {
  const { id } = useParams();
  const levels = {
    admin: 'Administrador',
    manager: 'Gerente',
    student: 'Estudante',
  };

  const [ user, setUser ] = useState({});

  useEffect(() => {
    async function loadUser() {
      const response = await findUser(id, true);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível carregar os dados do usuário');
        console.error(response.error);
      } else {
        setUser(response);
      }
    }

    if (id) {
      loadUser();
    }
  }, [id]);

  return (
    <div className="UsersShow">
      <h1 className="page-title">Dados do Usuário</h1>

      <div className="user-fields">
        <div className="photo-field">
          {user.photo &&
            <ImgProtected file={user.photo} alt={user.name} />
          }
          {!user.photo &&
            <img src="/images/default-user-photo.png" alt="" />
          }
        </div>

        <div className="user-detais">
          <div className="user-field">
            <div className="label">Nome:</div>
            <div className="value">{user.name}</div>
          </div>
          <div className="user-field">
            <div className="label">Email:</div>
            <div className="value">{user.email}</div>
          </div>
          <div className="user-field">
            <div className="label">Nível:</div>
            <div className="value">{levels[user.level]}</div>
          </div>
          {user.school &&
            <div className="user-field">
              <div className="label">Loja:</div>
              <div className="value">{user.school.name}</div>
            </div>
          }
          <div className="user-field">
            <div className="label">Professor:</div>
            <div className="value">{user.teacher ? 'Sim' : 'Não'}</div>
          </div>
        </div>
      </div>

      <div className="user-courses">
        <h3>Cursos em Progresso:</h3>
        <div className="courses-list">
          {!user.courses || user.courses.length <= 0 ? 'Nenhum curso em progresso' :
            user.courses.map(course => (
              <div key={course.id} className="course">
                <Link className="course-name" to={`/cursos/${course.id}`} target="_blank">
                  {course.name}
                </Link>
                <div className="course-progress">
                  <ProgressBar progress={course.progress} />
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="user-comments">
        <h3>Perguntas Realizadas:</h3>

        <div className="comments-list list-items">
          {!user.comments || user.comments.length <= 0 ? 'Nenhuma pergunta realizada' :
            user.comments.map(comment => (
              <div key={comment.id} className="comment item">
                <div className="comment-wraper item-details">
                  <div className="comment-header item-header">
                    <div className="comment-user-date">
                      <div className="comment-user item-title">{user.name}</div>
                      <div className="comment-date">{moment(comment.created_at).format('DD/MM/YYYY')}</div>
                    </div>
                    <div className="comment-lesson">
                      <Link to={`/cursos/${comment.lesson.module.course_id}/aula/${comment.lesson.id}/#comment-${comment.id}`} target="_blank">
                        {comment.lesson.module.course.name} &rsaquo; {comment.lesson.name}
                      </Link>
                    </div>
                  </div>
                  <div className="comment-content item-content">{comment.content}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default withRouter(UsersShow);
