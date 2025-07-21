
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Palette, 
  Database, 
  FileText, 
  Route, 
  Globe, 
  Calendar, 
  Zap, 
  BarChart3, 
  Smartphone,
  CreditCard,
  Wrench,
  Sparkles,
  Scale,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const featureCategories = [
    {
      title: "Frontend Framework",
      description: "React 18.3.1 with TypeScript and Vite build system",
      icon: Code,
      route: "/frontend",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "UI Framework",
      description: "Tailwind CSS with Radix UI components",
      icon: Palette,
      route: "/ui",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Data Management",
      description: "TanStack Query with Supabase integration",
      icon: Database,
      route: "/data",
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      title: "Forms & Validation",
      description: "React Hook Form with Zod validation",
      icon: FileText,
      route: "/forms",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    },
    {
      title: "Routing",
      description: "React Router DOM navigation system",
      icon: Route,
      route: "/routing",
      color: "bg-cyan-50 text-cyan-600 border-cyan-200"
    },
    {
      title: "Internationalization",
      description: "i18next multi-language support",
      icon: Globe,
      route: "/i18n",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200"
    },
    {
      title: "Date & Time",
      description: "date-fns with React Day Picker",
      icon: Calendar,
      route: "/datetime",
      color: "bg-pink-50 text-pink-600 border-pink-200"
    },
    {
      title: "Icons & Assets",
      description: "Lucide React icon library",
      icon: Zap,
      route: "/icons",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200"
    },
    {
      title: "Data Visualization",
      description: "Recharts and AG Grid components",
      icon: BarChart3,
      route: "/charts",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      title: "Mobile Development",
      description: "Capacitor cross-platform capabilities",
      icon: Smartphone,
      route: "/mobile",
      color: "bg-teal-50 text-teal-600 border-teal-200"
    },
    {
      title: "Payment Processing",
      description: "Stripe integration components",
      icon: CreditCard,
      route: "/payments",
      color: "bg-red-50 text-red-600 border-red-200"
    },
    {
      title: "Utilities & Styling",
      description: "CVA, clsx, and utility libraries",
      icon: Wrench,
      route: "/utilities",
      color: "bg-gray-50 text-gray-600 border-gray-200"
    },
    {
      title: "UI Enhancements",
      description: "Advanced UI components and interactions",
      icon: Sparkles,
      route: "/enhancements",
      color: "bg-violet-50 text-violet-600 border-violet-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modern Web Application Foundation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            A comprehensive starter template showcasing modern web development technologies
            with proper licensing and attribution.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate("/auth")} 
              variant="default"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/licenses")} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              View Licenses
            </Button>
            <Button 
              onClick={() => navigate("/getting-started")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Getting Started
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featureCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.title}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-blue-300"
                onClick={() => navigate(category.route)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${category.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Built with ❤️ using modern web technologies • All licenses and attributions included
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
