import {Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import CreatePost from './pages/createPost/CreatePost'
import PostDetail from './pages/postDetail/PostDetail'
import MyWins from './pages/myWins/MyWins'
import Auth from './pages/auth/Auth'
import Navbar from './components/navbar/navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <div className="page-container">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/auth' element={<Auth />} />
              <Route 
                path='/my-wins' 
                element={
                  <ProtectedRoute>
                    <MyWins />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path='/create-post' 
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path='/post/:id' 
                element={<PostDetail />} 
              />
            </Routes>
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
