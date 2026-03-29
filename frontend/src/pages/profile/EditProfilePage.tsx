import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE, authFetch } from "@/lib/api";

const EditProfilePage = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const resolveImageUrl = (value?: string) => {
    if (!value) return "";
    if (value.startsWith("data:")) return value;
    try {
      return new URL(value, API_BASE).toString();
    } catch {
      return value;
    }
  };

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    avatarFile: null as File | null,
    avatarPreview: resolveImageUrl(user?.avatarUrl ?? ""),
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      avatarUrl: user?.avatarUrl ?? "",
      avatarFile: null,
      avatarPreview: resolveImageUrl(user?.avatarUrl ?? ""),
    });
  }, [user]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setForm((prev) => {
      const preview = file ? URL.createObjectURL(file) : prev.avatarUrl;
      return { ...prev, avatarFile: file, avatarPreview: preview };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      if (form.avatarFile) {
        formData.append("avatarFile", form.avatarFile);
      }

      const response = await authFetch(`${API_BASE}/auth/me`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No fue posible actualizar el perfil");
      }

      const updated = await response.json();
      const absoluteAvatar = resolveImageUrl(updated.avatarUrl);
      updateUser({
        email: updated.email,
        fullName: updated.fullName,
        phone: updated.phone,
        avatarUrl: absoluteAvatar,
      });
      await refreshUser();

      setForm((prev) => ({
        ...prev,
        fullName: updated.fullName ?? prev.fullName,
        email: updated.email ?? prev.email,
        phone: updated.phone ?? prev.phone,
        avatarFile: null,
        avatarPreview: absoluteAvatar || prev.avatarPreview,
      }));

      toast.success("Datos actualizados. El cambio se reflejará en tu perfil.");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "No se pudo actualizar el perfil"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fallbackInitials = (form.fullName || user?.fullName || user?.email || "US")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background pt-28 px-4 pb-10">
      <div className="mx-auto max-w-3xl">
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Gestiona tu cuenta</p>
              <h1 className="text-2xl font-bold text-foreground">Actualizar mis datos</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Regresar al inicio</Link>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs">Nombre completo</Label>
              <Input value={form.fullName} onChange={({ target }) => handleChange("fullName", target.value)} required />
            </div>
            <div>
              <Label className="text-xs">Correo electrónico</Label>
              <Input
                type="email"
                value={form.email}
                onChange={({ target }) => handleChange("email", target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-xs">Teléfono</Label>
              <Input type="tel" value={form.phone} onChange={({ target }) => handleChange("phone", target.value)} required />
            </div>
            <div>
              <Label className="text-xs">Avatar / foto</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {form.avatarPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    {form.avatarPreview && <AvatarImage src={form.avatarPreview} alt="Avatar actual" />}
                    <AvatarFallback>{fallbackInitials}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-muted-foreground">
                    {form.avatarFile ? `Nueva imagen: ${form.avatarFile.name}` : "Imagen actual"}
                  </p>
                </div>
              )}
            </div>
            <Button type="submit" className="mt-2" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;
