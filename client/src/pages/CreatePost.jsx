import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    category: 'general',
    published: false
  });
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const categories = [
    'general',
    'technology',
    'lifestyle',
    'travel',
    'food',
    'health',
    'business',
    'entertainment',
    'sports',
    'education'
  ];

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/auth/me', {
          credentials: 'include'
        });
        if (!response.ok) {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const formData = new FormData();
      formData.append('cover', file);

      try {
        const response = await fetch('http://localhost:4000/api/posts/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setCoverImage(data.path);
          setError('');
        } else {
          setError('Failed to upload image');
        }
      } catch (error) {
        setError('Network error while uploading image');
      }
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (formData.title.length > 200) {
      setError('Title must be less than 200 characters');
      return false;
    }
    if (!formData.summary.trim()) {
      setError('Summary is required');
      return false;
    }
    if (formData.summary.length > 500) {
      setError('Summary must be less than 500 characters');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Post created successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError('');

    try {
      const postData = {
        ...formData,
        published: false,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        setSuccess('Draft saved successfully!');
      } else {
        setError('Failed to save draft');
      }
    } catch (error) {
      setError('Network error while saving draft');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create New Post</h2>
        <p>Share your thoughts with the world</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter your post title"
              maxLength={200}
            />
            <small>{formData.title.length}/200 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="summary">Summary *</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              placeholder="Brief summary of your post"
              maxLength={500}
              rows={3}
            />
            <small>{formData.summary.length}/500 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="cover">Cover Image</label>
            <input
              type="file"
              id="cover"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {coverImage && (
              <div className="image-preview">
                <img src={`http://localhost:4000/${coverImage}`} alt="Cover preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., tech, javascript, tutorial)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Write your post content here..."
              className="quill-editor"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
              />
              Publish immediately
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="save-draft-btn"
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="publish-btn"
            >
              {loading ? 'Publishing...' : formData.published ? 'Publish Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
