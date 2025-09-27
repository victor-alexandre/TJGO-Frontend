import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignInPage } from "./pages/signIn/signInPage";
import { SignUpPage } from "./pages/signUp/signUpPage";
import { Dashboard } from "./pages/dashboard/dashboard";
import { ProtectedRoute } from "./components/auth/protectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<SignInPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<SignInPage />} />
    </Routes>
  );
};
