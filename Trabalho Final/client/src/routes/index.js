// client/src/routes/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/authProvider';
import Layout from '../components/layout/layout';
import NotesPage from '../pages/notes/notes'; // Importe o componente consolidado
import Profile from '../pages/profile/profile';
import SignIn from '../pages/signIn/signInPage';
import SignUp from '../pages/signUp/signUpPage'
import ProtectedRoute from '../components/auth/protectedRoute'
import TagManagement from '../pages/tags/TagManagement';

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
      
      {/* Rotas protegidas que utilizam o Layout da aplicação */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* A rota raiz agora exibe a lista de notas */}
        <Route index element={<NotesPage />} /> 
        {/* Rota para criar novas notas */}
        <Route path="notes/new" element={<NotesPage />} /> 
        {/* Rota para editar notas existentes, ':id' é um parâmetro de URL */}
        <Route path="notes/:id/edit" element={<NotesPage />} /> 
        {/* Rota para o gerenciamento de tags */}
        <Route path="tags" element={<TagManagement />} /> 
        {/* Rota para o perfil do usuário */}
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Rota fallback para URLs não correspondidas, redireciona para a home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};