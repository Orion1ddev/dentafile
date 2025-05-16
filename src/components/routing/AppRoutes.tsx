import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { PageTransition } from "@/components/effects/PageTransition";
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
      <Suspense fallback={<RouteLoadingScreen message="Preparing your application..." />}>
        <PageTransition mode="fade">
          <Routes location={location} key={location.pathname}>
            <Route path="/auth/*" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </PageTransition>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<RouteLoadingScreen message="Loading your dashboard..." />}>
      <PageTransition mode="slide">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Index />} />
          <Route path="/calendar" element={<Index view="calendar" />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
};
