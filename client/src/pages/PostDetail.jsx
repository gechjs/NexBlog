import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetail.css';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail-container">
        <div className="error">
          <p>{error}</p>
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-container">
        <div className="error">
          <p>Post not found</p>
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail">
        <Link to="/" className="back-btn">← Back to Home</Link>
        
        <article className="post-article">
          <header className="post-header">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span className="author">By {post.author?.username}</span>
              <span className="date">{formatDate(post.createdAt)}</span>
              {post.category && (
                <span className="category">{post.category}</span>
              )}
            </div>
            {post.cover && (
              <img 
                src={`http://localhost:4000/${post.cover}`} 
                alt={post.title}
                className="post-cover"
              />
            )}
          </header>

          <div className="post-content">
            <div 
              className="post-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <footer className="post-footer">
            <div className="post-stats">
              <span className="views">👁️ {post.views || 0} views</span>
              <span className="likes">❤️ {post.likes?.length || 0} likes</span>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                <h4>Tags:</h4>
                <div className="tags-list">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </footer>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
