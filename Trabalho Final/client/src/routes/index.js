import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/layout';
import ProtectedRoute from '../components/auth/protectedRoute';
import Home from '../pages/home/home';
import Notes from '../pages/notes/notes';
import Profile from '../pages/profile/profile';
import SignInPage from '../pages/signIn/signInPage';
import SignUpPage from '../pages/signUp/signUpPage';
import TagManagement from '../pages/tags/TagManagement';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="notes/new" element={<Notes />} />
        <Route path="notes/edit/:id" element={<Notes />} />
        <Route path="tags" element={<TagManagement />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};