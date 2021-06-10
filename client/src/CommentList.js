import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <>
      {comments &&
        comments.map((comment) => (
          <div key={comment.id}>
            <ul>
              <li>{comment.content}</li>
            </ul>
          </div>
        ))}
    </>
  );
};

export default CommentList;
