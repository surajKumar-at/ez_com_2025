
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Code, Zap, Package, TypeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Frontend = () => {
  const navigate = useNavigate();
  const [buildTime, setBuildTime] = useState<number>(0);

  useEffect(() => {
    const start = performance.now();
    const timer = setInterval(() => {
      setBuildTime(performance.now() - start);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const technologies = [
    {
      name: "React",
      version: "18.3.1",
      description: "A JavaScript library for building user interfaces with a component-based architecture.",
      features: ["Virtual DOM", "Component Lifecycle", "Hooks", "JSX", "State Management"],
      icon: <Code className="w-6 h-6 text-blue-600" />
    },
    {
      name: "TypeScript",
      version: "Latest",
      description: "Adds static type definitions to JavaScript for better development experience.",
      features: ["Type Safety", "IntelliSense", "Compile-time Errors", "Better Refactoring", "Enhanced IDE Support"],
      icon: <TypeIcon className="w-6 h-6 text-blue-700" />
    },
    {
      name: "Vite",
      version: "Latest",
      description: "Next generation frontend tooling with lightning fast cold start and hot module replacement.",
      features: ["Fast HMR", "ES Modules", "Optimized Build", "Plugin Ecosystem", "Dev Server"],
      icon: <Zap className="w-6 h-6 text-purple-600" />
    }
  ];

  const codeExamples = {
    react: `// React Component Example
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};`,
    typescript: `// TypeScript Interface Example
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const createUser = (userData: Partial<User>): User => {
  return {
    id: Date.now(),
    isActive: true,
    ...userData,
  } as User;
};`,
    vite: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
            <Package className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frontend Framework & Build Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Modern frontend development powered by React, TypeScript, and Vite for optimal developer experience and performance.
          </p>
          <div className="flex justify-center items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              Build Time: {(buildTime / 1000).toFixed(1)}s
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Hot Module Replacement: ✅
            </Badge>
          </div>
        </div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {technologies.map((tech) => (
            <Card key={tech.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {tech.icon}
                  <div>
                    <CardTitle className="text-xl">{tech.name}</CardTitle>
                    <Badge variant="secondary">{tech.version}</Badge>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {tech.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Key Features:</h4>
                  <ul className="text-xs space-y-1">
                    {tech.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code Examples */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900">Code Examples</h2>
          
          {Object.entries(codeExamples).map(([key, code]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="capitalize">{key} Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{code}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Development Performance</CardTitle>
            <CardDescription>
              Real-time metrics from your development environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">&lt; 100ms</div>
                <div className="text-sm text-gray-600">HMR Update</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">&lt; 2s</div>
                <div className="text-sm text-gray-600">Cold Start</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">ES2022</div>
                <div className="text-sm text-gray-600">Target Build</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Tree Shaking</div>
                <div className="text-sm text-gray-600">Optimized</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Frontend;
