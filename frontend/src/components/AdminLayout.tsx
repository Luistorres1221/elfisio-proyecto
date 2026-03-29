import { ReactNode } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSettings } from "@/hooks/useAppSettings";

const allLinks = [
  { label: "Dashboard", to: "/admin", roles: ["ADMIN", "RECEPCIONISTA"] },
  { label: "Pacientes", to: "/admin/patients", roles: ["ADMIN", "RECEPCIONISTA"] },
  { label: "Citas", to: "/admin/appointments", roles: ["ADMIN", "RECEPCIONISTA"] },
  { label: "Calendario", to: "/admin/calendar", roles: ["ADMIN", "RECEPCIONISTA"] },
  { label: "Servicios", to: "/admin/services", roles: ["ADMIN"] },
  { label: "Horarios", to: "/admin/schedules", roles: ["ADMIN", "RECEPCIONISTA"] },
  { label: "Historial Clinico", to: "/admin/clinical", roles: ["ADMIN", "RECEPCIONISTA"] },
  { label: "Reportes", to: "/admin/reports", roles: ["ADMIN"] },
  { label: "Usuarios", to: "/admin/users", roles: ["ADMIN"] },
  { label: "Roles", to: "/admin/roles", roles: ["ADMIN"] },
  { label: "Notificaciones", to: "/admin/notifications", roles: ["ADMIN"] },
  { label: "Configuracion", to: "/admin/settings", roles: ["ADMIN", "RECEPCIONISTA"] },
];

const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { settings } = useAppSettings();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-background border-r border-border p-4">
        <div className="mb-8 text-center">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="h-12 w-12 mx-auto rounded-full object-contain"
            />
          ) : (
            <div className="h-12 w-12 mx-auto rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs">Logo</span>
            </div>
          )}
          <h2 className="mt-2 font-heading text-lg">{settings.siteName || "ELFISIO Admin"}</h2>
          {settings.companyName && <p className="text-xs text-muted-foreground">{settings.companyName}</p>}
        </div>
        <nav className="space-y-2">
          {allLinks
            .filter((link) => user && link.roles.includes(user.role))
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded hover:bg-primary/10"
              >
                {link.label}
              </Link>
            ))}
        </nav>
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 rounded hover:bg-primary/10"
          >
            Cerrar sesion
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-secondary/50">
        <Outlet />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
