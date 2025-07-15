
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Code, Terminal, Zap, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GettingStarted = () => {
  const navigate = useNavigate();

  const quickStartSteps = [
    {
      title: "Clone the Repository",
      description: "Get the codebase on your local machine",
      code: "git clone <repository-url>\ncd web-app-foundation"
    },
    {
      title: "Install Dependencies",
      description: "Install all required packages",
      code: "npm install\n# or\nyarn install"
    },
    {
      title: "Start Development Server",
      description: "Run the development server with hot reload",
      code: "npm run dev\n# or\nyarn dev"
    },
    {
      title: "Open Browser",
      description: "Navigate to the development URL",
      code: "http://localhost:5173"
    }
  ];

  const keyFeatures = [
    "✅ React 18.3.1 with TypeScript",
    "✅ Vite for fast development",
    "✅ Tailwind CSS for styling",
    "✅ Radix UI components",
    "✅ React Router for navigation",
    "✅ TanStack Query for data fetching",
    "✅ React Hook Form with Zod validation",
    "✅ Internationalization ready",
    "✅ Date/time utilities",
    "✅ Chart and visualization components",
    "✅ Mobile development with Capacitor",
    "✅ Payment processing with Stripe",
    "✅ Comprehensive license documentation"
  ];

  const projectStructure = [
    { path: "src/", description: "Main source code directory" },
    { path: "src/components/", description: "Reusable UI components" },
    { path: "src/pages/", description: "Application pages and routes" },
    { path: "src/hooks/", description: "Custom React hooks" },
    { path: "src/lib/", description: "Utility functions and configurations" },
    { path: "public/", description: "Static assets" },
    { path: "src/index.css", description: "Global styles and Tailwind imports" },
    { path: "tailwind.config.ts", description: "Tailwind CSS configuration" },
    { path: "vite.config.ts", description: "Vite build configuration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Code className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Getting Started
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quick setup guide to get your development environment running with this modern web application foundation.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get up and running in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickStartSteps.map((step, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                        <pre>{step.code}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Project Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectStructure.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                      {item.path}
                    </code>
                    <span className="text-xs text-gray-600 ml-3 flex-1">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Development Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Development Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Recommended Tools</h3>
                <ul className="space-y-2 text-sm">
                  <li>• VS Code with TypeScript extensions</li>
                  <li>• Tailwind CSS IntelliSense extension</li>
                  <li>• React Developer Tools browser extension</li>
                  <li>• Git for version control</li>
                  <li>• Node.js (LTS version recommended)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Available Scripts</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">dev</Badge>
                    <span className="text-sm">Start development server</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">build</Badge>
                    <span className="text-sm">Build for production</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">preview</Badge>
                    <span className="text-sm">Preview production build</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">lint</Badge>
                    <span className="text-sm">Run ESLint</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Explore the different technology demonstrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/ui")}
                className="justify-start"
              >
                Explore UI Components
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/forms")}
                className="justify-start"
              >
                Try Form Examples
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/charts")}
                className="justify-start"
              >
                View Data Visualization
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GettingStarted;
