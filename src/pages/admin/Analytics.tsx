import { useTranslation } from 'react-i18next';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionAnalytics } from '@/hooks/useSessionAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ExternalLink, TrendingUp, Users, Clock, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const { t } = useTranslation();
  const { sessionData, trackEvent } = useSessionAnalytics();

  // Prepare data for charts
  const pageViewsOverTime = sessionData.pageViews.map((pv, index) => ({
    time: pv.timestamp.toLocaleTimeString(),
    views: index + 1,
    page: pv.path,
  }));

  const pageDistribution = sessionData.pageViews.reduce((acc, pv) => {
    const page = pv.path;
    acc[page] = (acc[page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pageDistributionData = Object.entries(pageDistribution).map(([page, count]) => ({
    name: page,
    value: count,
  }));

  const eventCategoriesData = sessionData.events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventCategoriesChartData = Object.entries(eventCategoriesData).map(([category, count]) => ({
    category,
    count,
  }));

  const handleDemoEvent = () => {
    trackEvent({
      action: 'button_click',
      category: 'user_interaction',
      label: 'demo_event',
    });
  };

  const openGA4Dashboard = () => {
    window.open('https://analytics.google.com/analytics/web/#/p428285803/reports/dashboard', '_blank');
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title', 'Analytics Dashboard')}</h1>
            <p className="text-muted-foreground">
              {t('analytics.description', 'Real-time session analytics and Google Analytics integration')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDemoEvent} variant="outline">
              <MousePointer className="w-4 h-4 mr-2" />
              Track Demo Event
            </Button>
            <Button onClick={openGA4Dashboard}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open GA4 Dashboard
            </Button>
          </div>
        </div>

        {/* Session Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(sessionData.duration)}</div>
              <p className="text-xs text-muted-foreground">
                Started at {sessionData.sessionStart.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionData.pageViews.length}</div>
              <p className="text-xs text-muted-foreground">
                {pageDistributionData.length} unique pages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Tracked</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionData.events.length}</div>
              <p className="text-xs text-muted-foreground">
                {Object.keys(eventCategoriesData).length} categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Page</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {sessionData.pageViews[sessionData.pageViews.length - 1]?.path || '/'}
              </div>
              <p className="text-xs text-muted-foreground">
                Last viewed page
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Page Views Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Page Views Over Session Time</CardTitle>
              <CardDescription>Cumulative page views during this session</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pageViewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} views`,
                      'Page Views'
                    ]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Page Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Page Distribution</CardTitle>
              <CardDescription>Views per page during this session</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pageDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pageDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Categories */}
          {eventCategoriesChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Event Categories</CardTitle>
                <CardDescription>Events tracked by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventCategoriesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Recent Page Views */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Page Views</CardTitle>
              <CardDescription>Latest pages visited in this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {sessionData.pageViews.slice(-10).reverse().map((pv, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border">
                    <div>
                      <div className="font-medium">{pv.path}</div>
                      <div className="text-sm text-muted-foreground">{pv.title}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pv.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {sessionData.pageViews.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No page views recorded yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* External Links */}
        <Card>
          <CardHeader>
            <CardTitle>External Analytics Resources</CardTitle>
            <CardDescription>Access full Google Analytics reports and dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" onClick={openGA4Dashboard} className="h-auto p-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-medium">Google Analytics 4 Dashboard</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    View complete analytics data and insights
                  </span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.open('https://datastudio.google.com/', '_blank')}
                className="h-auto p-4"
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-medium">Google Data Studio</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Create custom analytics reports and visualizations
                  </span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}