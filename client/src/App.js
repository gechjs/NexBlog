import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>NexBlog</h1>
          <p>A scalable blogging platform</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>Welcome to NexBlog</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/register" element={<div>Register Page</div>} />
            <Route path="/create" element={<div>Create Post</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
