import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import CVBuilder from "./pages/cv/cv-build";
import CVList from "./pages/cv/cv-list";
import { AuthProvider } from "./store/AuthContext";
import CVUpdate from "./pages/cv/cv-update";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<CVList />} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/cv-create"element={<ProtectedRoute element={<CVBuilder />} />} />
        <Route path="/all-cv" element={<ProtectedRoute element={<CVList />} />} />
        <Route path="/update-cv/:cvId" element={<ProtectedRoute element={<CVUpdate />} />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
