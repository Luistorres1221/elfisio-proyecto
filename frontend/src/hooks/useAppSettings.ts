import { useEffect, useState } from "react";
import { API_BASE, authFetch } from "@/lib/api";

export interface AppSettings {
  siteName: string;
  logoUrl: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  address: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  siteName: "FisioVida",
  logoUrl: "",
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  address: "",
};

const STORAGE_KEY = "fisioterapia_settings";
const SETTINGS_EVENT = "fisioterapia-settings-updated";

const readCachedSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const persistSettings = (settings: AppSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: settings }));
};

export interface UseAppSettingsOptions {
  requireAuth?: boolean;
}

export const useAppSettings = ({ requireAuth = true }: UseAppSettingsOptions = {}) => {
  const [settings, setSettings] = useState<AppSettings>(readCachedSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      if (requireAuth && !localStorage.getItem("token")) {
        setLoading(false);
        return;
      }

      const url = requireAuth ? `${API_BASE}/admin/settings` : `${API_BASE}/settings`;

      try {
        const response = requireAuth ? await authFetch(url) : await fetch(url);

        if (!response.ok) {
          throw new Error("No se pudo cargar la configuración");
        }

        const data = { ...DEFAULT_SETTINGS, ...(await response.json()) };
        if (cancelled) return;
        setSettings(data);
        persistSettings(data);
      } catch (error) {
        console.error("Error loading app settings", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, [requireAuth]);

  useEffect(() => {
    const syncSettings = (event?: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        setSettings({ ...DEFAULT_SETTINGS, ...event.detail });
        return;
      }

      setSettings(readCachedSettings());
    };

    window.addEventListener("storage", syncSettings);
    window.addEventListener(SETTINGS_EVENT, syncSettings as EventListener);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener(SETTINGS_EVENT, syncSettings as EventListener);
    };
  }, []);

  return { settings, setSettings, loading };
};
