import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Briefcase,
  Clock,
  FileText,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminMenuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Pacientes", icon: Users, href: "/admin/patients" },
  { label: "Citas", icon: Calendar, href: "/admin/appointments" },
  { label: "Calendario", icon: Clock, href: "/admin/calendar" },
  { label: "Servicios", icon: Briefcase, href: "/admin/services" },
  { label: "Horarios", icon: Clock, href: "/admin/schedules" },
  { label: "Reportes", icon: FileText, href: "/admin/reports" },
  { label: "Notificaciones", icon: Bell, href: "/admin/notifications" },
  { label: "Configuración", icon: Settings, href: "/admin/settings" },
];

const recepcionistaMenuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Pacientes", icon: Users, href: "/admin/patients" },
  { label: "Citas", icon: Calendar, href: "/admin/appointments" },
  { label: "Calendario", icon: Clock, href: "/admin/calendar" },
  { label: "Horarios", icon: Clock, href: "/admin/schedules" },
  { label: "Configuración", icon: Settings, href: "/admin/settings" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const menuItems = user
    ? user.role === "RECEPCIONISTA"
      ? recepcionistaMenuItems
      : adminMenuItems
    : [];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-foreground text-background transition-all duration-300 flex flex-col shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-background/20">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img src="/elfisio-logo.png" alt="ELFISIO" className="h-8 w-8 rounded-full" />
              <span className="font-bold text-sm">ELFISIO</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-background/10 transition-colors"
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-background/20">
          <Button
            variant="outline"
            className="w-full gap-2 justify-start text-background border-background/20 hover:bg-background/10"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border h-16 flex items-center px-6 shadow-sm">
          <h1 className="text-xl font-bold text-foreground">Panel Administrativo ELFISIO</h1>
        </div>

        <div className="flex-1 overflow-auto bg-secondary/30 p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;



