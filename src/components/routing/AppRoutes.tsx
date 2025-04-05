
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Loading } from "@/components/ui/loading";
import { isDemoMode } from "@/utils/demo";

// Lazy load components for code splitting
const Auth = lazy(() => import("@/pages/Auth"));
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const PatientDetails = lazy(() => import("@/pages/PatientDetails"));

// Create skeleton screens for lazy-loaded components
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-background/80 backdrop-blur-sm shadow-sm h-16 border-b"></div>
    <div className="container px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-lg skeleton"></div>
        ))}
      </div>
    </div>
  </div>
);

const PatientDetailsSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-background/80 backdrop-blur-sm shadow-sm h-16 border-b"></div>
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="h-32 rounded-lg skeleton mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-lg skeleton"></div>
        ))}
      </div>
    </div>
  </div>
);

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  const location = useLocation();
  const demoMode = isDemoMode();

  // Clear any stuck loading states on route changes
  useEffect(() => {
    // Force cleanup of any pending operations
    const timeoutId = setTimeout(() => {
      // This will trigger a small re-render that can help clear stuck states
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Get appropriate fallback based on route
  const getFallback = (path: string) => {
    if (path.startsWith('/patient/')) {
      return <PatientDetailsSkeleton />;
    }
    return <DashboardSkeleton />;
  };

  // In demo mode or when authenticated, show authenticated routes
  if (isAuthenticated || demoMode) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/patients"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Index />
            </Suspense>
          }
        />
        <Route
          path="/calendar"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Index view="calendar" />
            </Suspense>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <Suspense fallback={<PatientDetailsSkeleton />}>
              <PatientDetails />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Settings />
            </Suspense>
          }
        />
        {/* Redirect /auth to dashboard in demo mode */}
        <Route path="/auth/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Show auth routes when not authenticated and not in demo mode
  return (
    <Suspense fallback={<Loading fullScreen text="Preparing your application..." />}>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  );
};
