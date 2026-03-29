import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const displayName = user?.fullName || user?.email || "Usuario";

  return (
    <div className="min-h-screen bg-background pt-28 px-4 pb-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Perfil de usuario</p>
              <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Regresar al inicio</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={displayName} />
              ) : (
                <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Rol asignado</p>
              <p className="text-sm font-medium text-foreground">{user?.role ?? "Usuario"}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Correo electrónico</p>
              <p className="text-base font-medium text-foreground">{user?.email ?? "No registrado"}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Teléfono</p>
              <p className="text-base font-medium text-foreground">{user?.phone || "No disponible"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/profile/mis-citas">Mis citas</Link>
            </Button>
            <Button asChild>
              <Link to="/profile/edit">Actualizar mis datos</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/profile/change-password">Cambiar contraseña</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
