
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  <motion.div 
    className="min-h-screen flex items-center justify-center bg-background/60 fixed inset-0 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div 
      className="flex flex-col items-center p-8 rounded-lg bg-card/30 backdrop-blur-md shadow-lg"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <motion.div 
        className="relative h-16 w-16 mb-4"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-primary"></div>
      </motion.div>
      
      <motion.p 
        className="text-muted-foreground text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>
    </motion.div>
  </motion.div>
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
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/auth/*" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<RouteLoadingScreen message="Loading your dashboard..." />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Index />} />
          <Route path="/calendar" element={<Index view="calendar" />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};
