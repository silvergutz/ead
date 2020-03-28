import React, { useState, useEffect } from 'react';

import { globalNotifications } from '../../services';
import { getComments } from '../../services/comments';
import CommentsForm from '../CommentsForm';
import CommentsList from '../CommentsList';

function LessonComments({ lesson }) {
  const [ enabledReplyForm, setEnabledReplyForm ] = useState([]);
  const [ comments, setComments ] = useState([]);

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
      const data = response.map(parent => {
        response
          .filter(e => e.parent_id > 0)
          .map(comment => {
            if (comment.parent_id === parent.id) {
              if (!parent.children) parent.children = [comment]
              else parent.children.push(comment)
            }
          })

        return parent;
      }).filter(e => !e.parent_id)

      setComments(data);
    }
  }

  return (
    <div className="LessonComments">
      <CommentsForm refreshComments={loadComments} lesson={lesson.id} />

      {comments.length > 0 &&
        <CommentsList
          comments={comments}
          enabledReplyForm={enabledReplyForm}
          setEnabledReplyForm={setEnabledReplyForm}
          lesson={lesson.id}
          loadComments={loadComments}
        />
      }
    </div>
  )
}

export default LessonComments;
