
import { toast } from "sonner";
import { setupDemoInterceptor, restoreSupabaseMethods } from "./demoSupabase";
import { setDemoMode, isDemoMode } from "./demoConfig";

// Main demo initialization function
export const initDemoData = async (): Promise<boolean> => {
  try {
    console.log('Initializing demo data...');
    
    // Check if demo was already initialized to prevent multiple toasts
    if (localStorage.getItem('demoInitialized') === 'true') {
      console.log('Demo already initialized, skipping toast notification');
      return true;
    }
    
    // Setup mock interceptor
    setupDemoInterceptor();
    
    // Set flag to prevent multiple initializations
    localStorage.setItem('demoInitialized', 'true');
    
    // Show a welcome toast (only once)
    toast.success("Welcome to the demo version! Browse through sample patient data.");
    
    return true;
  } catch (error) {
    console.error('Error initializing demo data:', error);
    toast.error("Error setting up demo data. Please try again.");
    return false;
  }
};

// Function to exit demo mode
export const exitDemoMode = (): void => {
  // Remove demo flags from local storage
  setDemoMode(false);
  localStorage.removeItem('demoInitialized');
  
  // Restore original Supabase methods
  restoreSupabaseMethods();
  
  // Notify user
  toast.info("Exited demo mode. You can now log in with your account.");
  
  // Force page reload to reset all app state
  window.location.href = '/auth';
};

// Re-export everything from the demo modules
export * from "./demoConfig";
export * from "./demoPatients";
export * from "./demoDentalRecords";
