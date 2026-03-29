import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";
import { AppSettings, DEFAULT_SETTINGS, persistSettings } from "@/hooks/useAppSettings";

const SettingsPage = () => {
  const [draft, setDraft] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await authFetch(`${API_BASE}/admin/settings`);
        if (!response.ok) {
          throw new Error(await getErrorMessage(response, "No se pudo cargar la configuracion"));
        }

        const data = { ...DEFAULT_SETTINGS, ...(await response.json()) };
        setDraft(data);
        persistSettings(data);
      } catch (error) {
        console.error(error);
        toast.error(error instanceof Error ? error.message : "No se pudo cargar la configuracion");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    document.title = draft.siteName ? `${draft.siteName} | Admin` : "FisioVida | Admin";
  }, [draft.siteName]);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setDraft((current) => ({ ...current, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await authFetch(`${API_BASE}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "No se pudo guardar la configuracion"));
      }

      const saved = { ...DEFAULT_SETTINGS, ...(await response.json()) };
      setDraft(saved);
      persistSettings(saved);
      toast.success("Configuracion guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la configuracion");
    } finally {
      setSaving(false);
    }
  };

  const clearLogo = () => {
    setDraft((current) => ({ ...current, logoUrl: "" }));
  };

  if (loading) {
    return <p>Cargando configuracion...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Configuracion</h2>
        <p className="text-muted-foreground">
          Desde aqui el administrador puede cambiar el nombre de la pagina, logo y datos de la empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la pagina</label>
            <Input
              placeholder="Nombre del sitio"
              value={draft.siteName}
              onChange={(e) => setDraft({ ...draft, siteName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo por URL</label>
            <Input
              placeholder="https://.../logo.png"
              value={draft.logoUrl}
              onChange={(e) => setDraft({ ...draft, logoUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">O cargar logo desde archivo</label>
            <Input type="file" accept="image/*" onChange={handleLogoChange} />
            {draft.logoUrl && (
              <Button type="button" variant="outline" onClick={clearLogo}>
                Quitar logo
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la empresa</label>
            <Input
              placeholder="Nombre de la empresa"
              value={draft.companyName}
              onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo de contacto</label>
            <Input
              placeholder="contacto@empresa.com"
              value={draft.companyEmail}
              onChange={(e) => setDraft({ ...draft, companyEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefono</label>
            <Input
              placeholder="3000000000"
              value={draft.companyPhone}
              onChange={(e) => setDraft({ ...draft, companyPhone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Direccion</label>
            <Textarea
              placeholder="Calle, numero, ciudad"
              value={draft.address}
              onChange={(e) => setDraft({ ...draft, address: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar configuracion"}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Vista previa</h3>
          <div className="flex items-center gap-4">
            {draft.logoUrl ? (
              <img src={draft.logoUrl} alt="Logo" className="h-16 w-16 object-contain rounded-lg border" />
            ) : (
              <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">Logo</div>
            )}
            <div>
              <p className="text-lg font-semibold">{draft.siteName || "FisioVida"}</p>
              <p className="text-sm text-muted-foreground">{draft.companyName || "Empresa"}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <p>
              <strong>Correo:</strong> {draft.companyEmail || "(no definido)"}
            </p>
            <p>
              <strong>Telefono:</strong> {draft.companyPhone || "(no definido)"}
            </p>
            <p>
              <strong>Direccion:</strong> {draft.address || "(no definido)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
