
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Brain, BarChart3, Store, FileText, Scale, Info, ShoppingCart, Package, TrendingUp } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg border-b border-blue-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-dark">Blue Store Manager Pro</span>
            </Link>
            
            <div className="flex space-x-1 overflow-x-auto">
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive("/dashboard")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <Store className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              
              <Link
                to="/sales"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive("/sales")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Vendas
              </Link>

              <Link
                to="/inventory"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive("/inventory")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <Package className="h-4 w-4 mr-2" />
                Inventário
              </Link>

              <Link
                to="/analytics"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive("/analytics")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Link>
              
              <Link
                to="/reports"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive("/reports")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios
              </Link>
              
              <Link
                to="/invoice-regulations"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive("/invoice-regulations")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <Scale className="h-4 w-4 mr-2" />
                Regulamentações
              </Link>
              
              <Link
                to="/about"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive("/about")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <Info className="h-4 w-4 mr-2" />
                Sobre
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
