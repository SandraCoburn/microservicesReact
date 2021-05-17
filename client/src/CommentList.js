import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [commentList, setCommnetList] = useState([]);

  const fetchComments = async () => {
    const res = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );

    setCommnetList(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      {commentList &&
        commentList.map((comment) => (
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
