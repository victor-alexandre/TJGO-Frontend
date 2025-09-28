import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth/authProvider";
import { AppRoutes } from "./routes/index";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};
