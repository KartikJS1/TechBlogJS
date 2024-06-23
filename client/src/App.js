import React from 'react';
import "./App.css";
import Post from './components/Post';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Register from "./components/Register";
import { UserContextProvider } from './UserContext';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';

const App = () => {
  return (
    <UserContextProvider>
      <div className="background-image"></div>
      <div className="overlay"></div>
      <main className="main-content">
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='edit/:id' element={<EditPost />} />
        </Routes>
      </main>
    </UserContextProvider>
  );
}

export default App;
