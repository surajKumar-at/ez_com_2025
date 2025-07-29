import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageView, AnalyticsEvent, SessionData } from '@/types/analytics';

export const useSessionAnalytics = () => {
  const location = useLocation();
  const [sessionData, setSessionData] = useState<SessionData>({
    pageViews: [],
    events: [],
    sessionStart: new Date(),
    duration: 0,
  });

  // Track page views
  useEffect(() => {
    const pageView: PageView = {
      path: location.pathname + location.search,
      timestamp: new Date(),
      title: document.title,
    };

    setSessionData(prev => ({
      ...prev,
      pageViews: [...prev.pageViews, pageView],
    }));
  }, [location]);

  // Update session duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionData(prev => ({
        ...prev,
        duration: Date.now() - prev.sessionStart.getTime(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track custom events
  const trackEvent = (event: Omit<AnalyticsEvent, 'timestamp'>) => {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
    };

    setSessionData(prev => ({
      ...prev,
      events: [...prev.events, analyticsEvent],
    }));
  };

  return { sessionData, trackEvent };
};