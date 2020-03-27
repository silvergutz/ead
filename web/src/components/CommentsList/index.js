import React from 'react';
import moment from 'moment';

import CommentsForm from '../CommentsForm';
import ImgProtected from '../ImgProtected';

function CommentsList(props) {
  const { comments, enabledReplyForm, setEnabledReplyForm, lesson, loadComments } = props;

  return (
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

          <div className="comment-date">{moment(comment.created_at).format('DD/MM/YYYY')}</div>
          <div className="comment-reply-button" onClick={e => setEnabledReplyForm(comment.id)}>Responder &raquo;</div>

          {enabledReplyForm === comment.id &&
            <CommentsForm refreshComments={loadComments} lesson={lesson} parent={comment.id} />
          }

          {comment.children && comment.children.length > 0 &&
            <CommentsList {...props} comments={comment.children} />
          }
        </div>
      ))}
    </div>
  );
}

export default CommentsList;
