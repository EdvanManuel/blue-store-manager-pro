
import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Home, BarChart2, Info, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="blue-gradient-bg py-4 px-6 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl lg:text-2xl">Sistema de Gerenciamento de Lojas</span>
        </div>
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavItem to="/" icon={<Home size={20} />} label="Lojas" />
          <NavItem to="/reports" icon={<BarChart2 size={20} />} label="Relatórios Gerais" />
          <NavItem to="/about" icon={<Info size={20} />} label="Sobre o Desenvolvedor" />
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 w-full bg-blue-dark z-40 shadow-lg">
          <nav className="flex flex-col p-4 gap-4">
            <MobileNavItem to="/" icon={<Home size={20} />} label="Lojas" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavItem to="/reports" icon={<BarChart2 size={20} />} label="Relatórios Gerais" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavItem to="/about" icon={<Info size={20} />} label="Sobre o Desenvolvedor" onClick={() => setMobileMenuOpen(false)} />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow px-4 py-6 md:px-8 md:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="blue-gradient-bg text-white py-4 text-center">
        <p>© {new Date().getFullYear()} Sistema de Gerenciamento de Lojas</p>
      </footer>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-2 text-white/80 hover:text-white transition-colors",
      isActive && "font-semibold text-white"
    )}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const MobileNavItem = ({ 
  to, 
  icon, 
  label, 
  onClick 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
}) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-2 text-white/80 hover:text-white transition-colors p-3 rounded-md",
      isActive && "font-semibold text-white bg-blue-light/20"
    )}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Layout;
