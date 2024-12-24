import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import PatientDetails from "@/pages/PatientDetails";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/patients" 
          element={isAuthenticated ? <Index /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/calendar" 
          element={isAuthenticated ? <Index view="calendar" /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/auth/*" 
          element={!isAuthenticated ? <Auth /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/patient/:id" 
          element={isAuthenticated ? <PatientDetails /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
};