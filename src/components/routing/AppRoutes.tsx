
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Loading } from "@/components/ui/loading";

// Lazy load components
const Auth = lazy(() => import("@/pages/Auth"));
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const PatientDetails = lazy(() => import("@/pages/PatientDetails"));

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  const location = useLocation();

  // Clear any stuck loading states on route changes
  useEffect(() => {
    // Force cleanup of any pending operations
    const timeoutId = setTimeout(() => {
      // This will trigger a small re-render that can help clear stuck states
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<Loading fullScreen text="Preparing your application..." />}>
        <Routes>
          <Route path="/auth/*" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading fullScreen text="Loading your dashboard..." />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Index />} />
        <Route path="/calendar" element={<Index view="calendar" />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
