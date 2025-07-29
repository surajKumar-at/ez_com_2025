export interface PageView {
  path: string;
  timestamp: Date;
  title: string;
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: Date;
}

export interface SessionData {
  pageViews: PageView[];
  events: AnalyticsEvent[];
  sessionStart: Date;
  duration: number;
}