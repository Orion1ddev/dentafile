
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
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

// Loading component specific to route transitions
const RouteLoadingScreen = ({ message }: { message: string }) => (
  <Loading text={message} fullScreen />
);

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<RouteLoadingScreen message="Preparing your application..." />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/auth/*" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<RouteLoadingScreen message="Loading your dashboard..." />}>
      <Routes location={location} key={location.pathname}>
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
