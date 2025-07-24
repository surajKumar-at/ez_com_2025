
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAuth } from './hooks/useAuth';
import './i18n';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Licenses from "./pages/Licenses";
import GettingStarted from "./pages/GettingStarted";
import Frontend from "./pages/Frontend";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import UserRoles from "./pages/admin/config/UserRoles";
import Systems from "./pages/admin/config/Systems";
import MigrateUsers from "./pages/admin/config/MigrateUsers";
import AdverseEvents from "./pages/admin/config/AdverseEvents";
import SalesAreas from "./pages/admin/config/SalesAreas";
import SystemAuth from "./pages/admin/config/SystemAuth";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const AppContent = () => {
  useAuth(); // Initialize auth state
  
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/index" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/config/user-roles" element={
            <AdminLayout>
              <UserRoles />
            </AdminLayout>
          } />
          <Route path="/admin/config/systems" element={
            <AdminLayout>
              <Systems />
            </AdminLayout>
          } />
          <Route path="/admin/config/migrate-users" element={
            <AdminLayout>
              <MigrateUsers />
            </AdminLayout>
          } />
          <Route path="/admin/config/adverse-events" element={
            <AdminLayout>
              <AdverseEvents />
            </AdminLayout>
          } />
          <Route path="/admin/config/sales-areas" element={
            <AdminLayout>
              <SalesAreas />
            </AdminLayout>
          } />
          <Route path="/admin/system-auth" element={
            <AdminLayout>
              <SystemAuth />
            </AdminLayout>
          } />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/frontend" element={<Frontend />} />
            {/* Placeholder routes for other feature pages */}
            <Route path="/ui" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">UI Framework Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/data" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Data Management Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/forms" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Forms & Validation Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/routing" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Routing Demo</h1><p className="text-gray-600">You're already using React Router!</p></div></div>} />
            <Route path="/i18n" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Internationalization Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/datetime" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Date & Time Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/icons" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Icons Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/charts" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Charts & Visualization Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/mobile" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Mobile Development Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/payments" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Payment Processing Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/utilities" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Utilities & Styling Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            <Route path="/enhancements" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">UI Enhancements Demo</h1><p className="text-gray-600">Coming soon...</p></div></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
