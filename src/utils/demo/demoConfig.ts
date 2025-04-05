
// Core configuration for demo mode

// Demo User ID - will be used as the user_id for all created records
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

// Helper functions for demo mode state management
export const isDemoMode = (): boolean => localStorage.getItem('demoMode') === 'true';

export const setDemoMode = (enabled: boolean): void => {
  if (enabled) {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoUserId', DEMO_USER_ID);
  } else {
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoUserId');
    localStorage.removeItem('demoInitialized');
  }
};

// Get current demo user
export const getDemoUser = () => {
  return {
    id: DEMO_USER_ID,
    email: "demo@dentafile.com",
    user_metadata: {
      first_name: "Demo",
      last_name: "User"
    }
  };
};
