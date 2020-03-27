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
      let data = response.filter(e => !e.parent_id);
      let hasParent = response.filter(e => e.parent_id > 0);

      console.log('comments that not has parent', data);
      console.log('has parent', hasParent);

      while (hasParent.length) {
        hasParent.forEach((comment, i) => {
          data.map((parent) => {
            if (parent.id === comment.parent_id) {
              if (!parent.children) parent.children = [];
              parent.children.push(comment);
              hasParent.splice(i, 1);
            }

            return parent;
          });
        });
      }
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
