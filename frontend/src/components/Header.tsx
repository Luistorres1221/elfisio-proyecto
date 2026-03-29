import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  LogOut,
  Edit3,
  Key,
  Bell,
  LifeBuoy,
  User,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const unauthNav = [
    { label: "Inicio", to: "/" },
    { label: "Servicios", to: "/#servicios" },
    { label: "Agendar", to: "/#agendar" },
    { label: "Contacto", to: "/#contacto" },
  ];

  const authNav = [
    { label: "Mis citas", to: "/profile/mis-citas" },
    { label: "Servicios", to: "/#servicios" },
    { label: "Agendar", to: "/#agendar" },
    { label: "Contacto", to: "/#contacto" },
  ];

  const aboutLinks = [
    { label: "Historia", to: "/historia" },
    { label: "Nosotros", to: "/nosotros" },
    { label: "Terminos y Condiciones", to: "/terminos-condiciones" },
    { label: "Politica de cookies", to: "/politica-cookies" },
    { label: "Politica de tratamiento de datos", to: "/tratamiento-datos" },
  ];

  const navigate = useNavigate();

  const displayName = user?.fullName || user?.email || "Usuario";
  const hasAdminAccess = user?.role === "ADMIN" || user?.role === "RECEPCIONISTA";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSectionClick = (to: string) => {
    const url = new URL(to, window.location.origin);
    const path = url.pathname === "" ? "/" : url.pathname;
    const hash = url.hash;
    navigate(path);
    if (hash) {
      setTimeout(() => {
        window.location.hash = hash;
      }, 0);
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/elfisio-logo.png"
              alt="ELFISIO"
              className="h-12 w-12 rounded-full border-2 border-primary object-contain"
            />
            <span className="heading-display text-xl font-semibold text-foreground md:text-2xl">
              ELFISIO
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {(user ? authNav : unauthNav).map((link) => (
              <button
                key={link.to}
                onClick={() => handleSectionClick(link.to)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
            {!user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Acerca de
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8} align="start" className="w-60">
                  {aboutLinks.map((link) => (
                    <DropdownMenuItem key={link.to} asChild>
                      <Link to={link.to}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
                      aria-label="Abrir menu de perfil"
                    >
                      <Avatar>
                        {user.avatarUrl ? (
                          <AvatarImage src={user.avatarUrl} alt={displayName} />
                        ) : (
                          <AvatarFallback>{initials}</AvatarFallback>
                        )}
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={8} className="w-48">
                    <DropdownMenuLabel>Perfil</DropdownMenuLabel>
                    {hasAdminAccess && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <User className="mr-2 h-4 w-4" />
                          Panel administrativo
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile/mis-citas">
                        <User className="mr-2 h-4 w-4" />
                        Mis citas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Mi perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/edit">
                        <User className="mr-2 h-4 w-4" />
                        Actualizar mis datos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/change-password">
                        <Key className="mr-2 h-4 w-4" />
                        Cambiar contrasena
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notificaciones
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Ayuda
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Iniciar sesion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav className="space-y-4 pb-6 md:hidden">
            {(user ? authNav : unauthNav).map((link) => (
              <button
                key={link.to}
                onClick={() => handleSectionClick(link.to)}
                className="block text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}

            {!user && (
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">Acerca de</p>
                {aboutLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="block pl-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {user ? (
              <div className="space-y-2">
                {hasAdminAccess && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Panel administrativo
                  </Link>
                )}
                <Link
                  to="/profile/mis-citas"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Mis citas
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Mi perfil
                </Link>
                <Link
                  to="/profile/edit"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Actualizar mis datos
                </Link>
                <Link
                  to="/profile/change-password"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cambiar contrasena
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Notificaciones
                </Link>
                <Link
                  to="/help"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Ayuda
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut size={16} className="mr-1.5" /> Cerrar sesion
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Iniciar sesion
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Registrarse
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
