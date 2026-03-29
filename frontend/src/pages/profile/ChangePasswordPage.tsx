import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setLoading(false);
    toast.success("Contraseña actualizada correctamente");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-28 px-4 pb-10">
      <div className="mx-auto max-w-3xl">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Seguridad</p>
              <h1 className="text-2xl font-bold text-foreground">Cambiar contraseña</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Regresar al inicio</Link>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs">Contraseña actual</Label>
              <Input
                type="password"
                value={form.currentPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                required
              />
            </div>
            <div>
              <Label className="text-xs">Nueva contraseña</Label>
              <Input
                type="password"
                value={form.newPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                required
              />
            </div>
            <div>
              <Label className="text-xs">Confirmar nueva contraseña</Label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Guardar"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
