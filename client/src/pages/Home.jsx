import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        
        // Separate featured posts
        const featured = data.filter(post => post.featured);
        setFeaturedPosts(featured);
      } else {
        setError('Failed to fetch posts');
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

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchPosts} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to NexBlog</h1>
          <p>Discover amazing stories and share your own with our community</p>
          <Link to="/register" className="cta-button">Start Writing Today</Link>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="featured-section">
          <h2>Featured Posts</h2>
          <div className="featured-grid">
            {featuredPosts.map(post => (
              <article key={post._id} className="featured-card">
                {post.cover && (
                  <img 
                    src={`http://localhost:4000/${post.cover}`} 
                    alt={post.title}
                    className="featured-image"
                  />
                )}
                <div className="featured-content">
                  <div className="post-meta">
                    <span className="author">By {post.author?.username}</span>
                    <span className="date">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  <Link to={`/post/${post._id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="recent-section">
        <h2>Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet</h3>
            <p>Be the first to share your thoughts!</p>
            <Link to="/create" className="create-first-btn">Create First Post</Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <article key={post._id} className="post-card">
                {post.cover && (
                  <img 
                    src={`http://localhost:4000/${post.cover}`} 
                    alt={post.title}
                    className="post-image"
                  />
                )}
                <div className="post-content">
                  <div className="post-meta">
                    <span className="author">By {post.author?.username}</span>
                    <span className="date">{formatDate(post.createdAt)}</span>
                    {post.category && (
                      <span className="category">{post.category}</span>
                    )}
                  </div>
                  <h3>{post.title}</h3>
                  <p className="post-summary">{post.summary}</p>
                  <div className="post-stats">
                    <span className="views">👁️ {post.views || 0} views</span>
                    <span className="likes">❤️ {post.likes?.length || 0} likes</span>
                  </div>
                  <Link to={`/post/${post._id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to share your story?</h2>
          <p>Join our community of writers and readers</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">Get Started</Link>
            <Link to="/login" className="cta-secondary">Sign In</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
