import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export const usePageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track pageview on route change
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
      title: document.title,
    });
  }, [location]);
};