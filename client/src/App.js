import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<div className="welcome-section">
              <h1>Welcome to NexBlog</h1>
              <p>Your modern blogging platform - Start writing today!</p>
              <div className="feature-cards">
                <div className="feature-card">
                  <h3>📝 Easy Writing</h3>
                  <p>Rich text editor with formatting options</p>
                </div>
                <div className="feature-card">
                  <h3>🖼️ Media Support</h3>
                  <p>Upload images and enhance your posts</p>
                </div>
                <div className="feature-card">
                  <h3>🔒 Secure</h3>
                  <p>Safe authentication and data protection</p>
                </div>
              </div>
            </div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreatePost />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
