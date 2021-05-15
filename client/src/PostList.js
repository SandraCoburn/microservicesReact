import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts');
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  //make an array from an object
  const renderedPosts = Object.values(posts);
  console.log('posts', posts);
  return (
    <div className="d-flex flex-row flex-wrap justify-content-between ">
      {renderedPosts.map((post) => (
        <div
          className="card"
          style={{ width: '30%', marginBottom: '20px' }}
          key={post.id}
        >
          <div className="card-body">
            <h5>{post.title}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};
export default PostList;
