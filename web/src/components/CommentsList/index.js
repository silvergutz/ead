import React from 'react';
import moment from 'moment';

import CommentsForm from '../CommentsForm';
import ImgProtected from '../ImgProtected';

import './styles.css';

function CommentsList(props) {
  const { comments, enabledReplyForm, setEnabledReplyForm, lesson, loadComments } = props;

  return (
    <div className="CommentsList">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <div className="comment-body">
            <div className="comment-body-inner">
              <div className="comment-user-photo">
                <ImgProtected file={comment.user.photo} />
              </div>

              <div className="comment-data">
                <div className="comment-user">{comment.user.name}</div>
                <div className="comment-content">{comment.content}</div>
              </div>
            </div>

            <div className="comment-date button">{moment(comment.created_at).format('DD/MM/YYYY')}</div>
            <div className="comment-reply-button button" onClick={e => setEnabledReplyForm(comment.id)}>Responder &rsaquo;</div>
          </div>

          {enabledReplyForm === comment.id &&
            <CommentsForm refreshComments={loadComments} lesson={lesson} parent={comment.id} />
          }

          {comment.children && comment.children.length > 0 &&
            <div className="comment-children">
              <div className="mi">reply</div>
              <CommentsList {...props} comments={comment.children} />
            </div>
          }
        </div>
      ))}
    </div>
  );
}

export default CommentsList;
