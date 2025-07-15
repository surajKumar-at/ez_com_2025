
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Licenses from "./pages/Licenses";
import GettingStarted from "./pages/GettingStarted";
import Frontend from "./pages/Frontend";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
