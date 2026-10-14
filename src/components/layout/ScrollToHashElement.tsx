import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToHashElement
 * Handles smooth scrolling to anchor IDs (e.g. #about, #contact)
 * when navigating from external pages (/shop -> /#about) or clicking links on the same page.
 */
export const ScrollToHashElement = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      // Slight timeout to ensure the DOM elements on the home page have mounted
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // If navigating to a route without a hash, scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
};
