import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_BASE } from "@/lib/api";

export interface AuthUser {
  email: string;
  role: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => ({ email: "", role: "USER" }),
  signOut: async () => {},
  refreshUser: async () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Normaliza el rol del usuario
  const normalizeRole = (role: string): string => {
    if (!role) {
      return "USER";
    }
    const canonical = role.trim().toUpperCase();
    if (canonical === "RECEPTIONIST") {
      return "RECEPCIONISTA";
    }
    return canonical;
  };

  const normalizeAvatarUrl = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string" && value.startsWith("data:")) {
      return value;
    }
    try {
      return new URL(value, API_BASE).toString();
    } catch {
      return value;
    }
  };

  const normalizeUser = (data: any): AuthUser => {
    const role = normalizeRole(data.role ?? data.user_role ?? data.role_name ?? "");
    const fullName = data.full_name ?? data.fullName ?? data.name ?? "";
    const rawAvatar =
      data.avatar ??
      data.avatar_url ??
      data.avatarUrl ??
      data.photo ??
      data.photoUrl ??
      "";
    const avatarUrl = normalizeAvatarUrl(rawAvatar);
    const phone = data.phone ?? data.mobile_phone ?? data.telefono ?? "";
    return {
      email: data.email ?? data.user_email ?? "",
      role,
      fullName,
      avatarUrl,
      phone,
    };
  };

  const refreshUser = async (tokenOverride?: string | null) => {
    const activeToken = tokenOverride ?? token;
    setLoading(true);
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (!res.ok) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } else {
        const data = await res.json();
        setUser(normalizeUser(data));
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ...existing code...

  const signIn = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo cargar el usuario autenticado");
      }

      const data = await res.json();
      const normalizedUser = normalizeUser(data);
      setUser(normalizedUser);
      return normalizedUser;
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (data: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
