import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/authProvider';
import Layout from '../components/layout/layout';
import Home from '../pages/home/home';
import Notes from '../pages/notes/notes';
import Profile from '../pages/profile/profile';
import SignIn from '../pages/signIn/signInPage';
import SignUp from '../pages/signUp/signUpPage'
import ProtectedRoute from '../components/auth/protectedRoute'

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
};

export const AppRoutes = () => {
  return (
    <Routes>     
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } 
      />

       <Route 
        path="/register" 
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } 
      />
      
      {/* Rotas protegidas com Layout */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="notes" element={<Notes />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};