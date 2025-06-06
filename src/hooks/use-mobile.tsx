
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Initial check
    const updateMatches = () => {
      setMatches(media.matches);
    };
    
    updateMatches();
    
    // Add listener for subsequent changes
    media.addEventListener("change", updateMatches);
    
    // Clean up
    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

// Add the useIsMobile hook that uses the useMediaQuery hook
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
