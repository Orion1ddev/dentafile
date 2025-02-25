
import { Routes, Route, Navigate, Suspense } from "react-router-dom";
import { lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components
const Auth = lazy(() => import("@/pages/Auth"));
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings"));
const PatientDetails = lazy(() => import("@/pages/PatientDetails"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
);

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/auth/*" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
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
