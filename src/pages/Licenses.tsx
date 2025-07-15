
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Licenses = () => {
  const navigate = useNavigate();

  const licenseCategories = [
    {
      category: "Frontend Framework & Build Tools",
      packages: [
        { name: "React", version: "v18.3.1", license: "MIT", url: "https://github.com/facebook/react/blob/main/LICENSE" },
        { name: "React DOM", version: "v18.3.1", license: "MIT", url: "https://github.com/facebook/react/blob/main/LICENSE" },
        { name: "Vite", version: "Latest", license: "MIT", url: "https://github.com/vitejs/vite/blob/main/LICENSE" },
        { name: "TypeScript", version: "Latest", license: "Apache-2.0", url: "https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt" }
      ]
    },
    {
      category: "UI Framework & Components",
      packages: [
        { name: "Tailwind CSS", version: "Latest", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE" },
        { name: "@radix-ui/* packages", version: "Latest", license: "MIT", url: "https://github.com/radix-ui/primitives/blob/main/LICENSE" }
      ]
    },
    {
      category: "Data Management & API",
      packages: [
        { name: "@tanstack/react-query", version: "Latest", license: "MIT", url: "https://github.com/TanStack/query/blob/main/LICENSE" },
        { name: "@supabase/supabase-js", version: "Latest", license: "MIT", url: "https://github.com/supabase/supabase-js/blob/master/LICENSE" }
      ]
    },
    {
      category: "Forms & Validation",
      packages: [
        { name: "react-hook-form", version: "Latest", license: "MIT", url: "https://github.com/react-hook-form/react-hook-form/blob/master/LICENSE" },
        { name: "@hookform/resolvers", version: "Latest", license: "MIT", url: "https://github.com/react-hook-form/resolvers/blob/master/LICENSE" },
        { name: "zod", version: "Latest", license: "MIT", url: "https://github.com/colinhacks/zod/blob/master/LICENSE" }
      ]
    },
    {
      category: "Routing & Navigation",
      packages: [
        { name: "react-router-dom", version: "Latest", license: "MIT", url: "https://github.com/remix-run/react-router/blob/main/LICENSE.md" }
      ]
    },
    {
      category: "Internationalization",
      packages: [
        { name: "i18next", version: "Latest", license: "MIT", url: "https://github.com/i18next/i18next/blob/master/LICENSE" },
        { name: "react-i18next", version: "Latest", license: "MIT", url: "https://github.com/i18next/react-i18next/blob/master/LICENSE" },
        { name: "i18next-browser-languagedetector", version: "Latest", license: "MIT", url: "https://github.com/i18next/i18next-browser-languageDetector/blob/master/LICENSE" }
      ]
    },
    {
      category: "Date & Time",
      packages: [
        { name: "date-fns", version: "Latest", license: "MIT", url: "https://github.com/date-fns/date-fns/blob/master/LICENSE.md" },
        { name: "date-fns-tz", version: "Latest", license: "MIT", url: "https://github.com/marnusw/date-fns-tz/blob/master/LICENSE" },
        { name: "react-day-picker", version: "Latest", license: "MIT", url: "https://github.com/gpbl/react-day-picker/blob/main/LICENSE" }
      ]
    },
    {
      category: "Icons & UI Assets",
      packages: [
        { name: "lucide-react", version: "Latest", license: "ISC", url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE" }
      ]
    },
    {
      category: "Data Grid & Tables",
      packages: [
        { name: "ag-grid-community", version: "Latest", license: "MIT", url: "https://github.com/ag-grid/ag-grid/blob/latest/LICENSE.txt" },
        { name: "ag-grid-react", version: "Latest", license: "MIT", url: "https://github.com/ag-grid/ag-grid/blob/latest/LICENSE.txt" }
      ]
    },
    {
      category: "Charts & Visualization",
      packages: [
        { name: "recharts", version: "Latest", license: "MIT", url: "https://github.com/recharts/recharts/blob/master/LICENSE" }
      ]
    },
    {
      category: "Mobile Development",
      packages: [
        { name: "@capacitor/core", version: "Latest", license: "MIT", url: "https://github.com/ionic-team/capacitor/blob/main/LICENSE" },
        { name: "@capacitor/cli", version: "Latest", license: "MIT", url: "https://github.com/ionic-team/capacitor/blob/main/LICENSE" },
        { name: "@capacitor/android", version: "Latest", license: "MIT", url: "https://github.com/ionic-team/capacitor/blob/main/LICENSE" }
      ]
    },
    {
      category: "Payment Processing",
      packages: [
        { name: "@stripe/stripe-js", version: "Latest", license: "MIT", url: "https://github.com/stripe/stripe-js/blob/master/LICENSE" },
        { name: "@stripe/react-stripe-js", version: "Latest", license: "MIT", url: "https://github.com/stripe/stripe-js/blob/master/LICENSE" }
      ]
    },
    {
      category: "Utilities & Styling",
      packages: [
        { name: "class-variance-authority", version: "Latest", license: "Apache-2.0", url: "https://github.com/joe-bell/cva/blob/main/LICENSE" },
        { name: "clsx", version: "Latest", license: "MIT", url: "https://github.com/lukeed/clsx/blob/master/LICENSE" },
        { name: "tailwind-merge", version: "Latest", license: "MIT", url: "https://github.com/dcastil/tailwind-merge/blob/v2.5.2/LICENSE" },
        { name: "uuid", version: "Latest", license: "MIT", url: "https://github.com/uuidjs/uuid/blob/main/LICENSE.md" }
      ]
    },
    {
      category: "UI Enhancements",
      packages: [
        { name: "cmdk", version: "Latest", license: "MIT", url: "#" },
        { name: "input-otp", version: "Latest", license: "MIT", url: "#" },
        { name: "next-themes", version: "Latest", license: "MIT", url: "#" },
        { name: "sonner", version: "Latest", license: "MIT", url: "#" },
        { name: "vaul", version: "Latest", license: "MIT", url: "#" },
        { name: "embla-carousel-react", version: "Latest", license: "MIT", url: "#" },
        { name: "react-resizable-panels", version: "Latest", license: "MIT", url: "#" }
      ]
    }
  ];

  const getLicenseColor = (license: string) => {
    switch (license) {
      case "MIT": return "bg-green-100 text-green-800";
      case "Apache-2.0": return "bg-blue-100 text-blue-800";
      case "ISC": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            <Scale className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Licenses & Attribution
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete licensing information for all open source packages used in this application.
          </p>
        </div>

        {/* License Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>License Types Summary</CardTitle>
            <CardDescription>
              Understanding the different open source licenses used in this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Badge className="mb-2 bg-green-100 text-green-800">MIT</Badge>
                <p className="text-sm text-gray-600">Commercial use, modify, distribute, private use (with copyright + license)</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge className="mb-2 bg-blue-100 text-blue-800">Apache-2.0</Badge>
                <p className="text-sm text-gray-600">Same as MIT + patent protection</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge className="mb-2 bg-purple-100 text-purple-800">ISC</Badge>
                <p className="text-sm text-gray-600">Similar to MIT, simple permissive license</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Categories */}
        <div className="space-y-6">
          {licenseCategories.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.packages.map((pkg) => (
                    <div key={pkg.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-sm text-gray-500">{pkg.version}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getLicenseColor(pkg.license)}>
                          {pkg.license}
                        </Badge>
                        {pkg.url !== "#" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => window.open(pkg.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Compliance Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Preserve copyright notices in distributed code</li>
              <li>• Include license text with distributions</li>
              <li>• Add proper attribution for all dependencies</li>
              <li>• Audit licenses regularly for updates</li>
              <li>• Last updated: 2025-01-14</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Licenses;
