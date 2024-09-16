import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header';
import PostList from './components/PostList';
import Post from './components/Post';
import About from './components/About';
import Sandbox from './components/Sandbox';

function App() {
  return (
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/about" element={<About />} />
            <Route path="/sandbox" element={<Sandbox />} />
          </Routes>
        </div>
      </Router>
    );
}

export default App;