import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";

const ADMIN_EMAIL = "admin@fisioterapia.com";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Debes activar tu cuenta desde el correo antes de iniciar sesión.");
        } else {
          toast.error("Credenciales inválidas");
        }
        return;
      }

      const data = await response.json();
      const authenticatedUser = await signIn(data.token);
      const normalizedEmail = authenticatedUser.email.trim().toLowerCase();
      const shouldOpenAdminPanel =
        normalizedEmail === ADMIN_EMAIL ||
        authenticatedUser.role === "ADMIN";

      toast.success("Bienvenido/a");
      // Mostrar siempre el home tras login. Si quieres admin se puede dejar en /admin.
      navigate(shouldOpenAdminPanel ? "/admin" : "/", { replace: true });
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="login"
      eyebrow="Acceso seguro"
      title="Iniciar sesion"
      description="Ingresa a tu cuenta para revisar tu perfil, citas y opciones personales con una experiencia mas visual y profesional."
      switchPrompt="¿No tienes cuenta?"
      switchLabel="Registrate"
      switchTo="/register"
      form={
        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8"
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail size={16} className="text-[#156fe6]" /> Correo electrónico
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/70"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Lock size={16} className="text-[#156fe6]" /> Contraseña
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contrasena"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/70"
              required
            />
          </div>
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#156fe6] transition hover:text-[#0f57b6]"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#156fe6] text-white shadow-[0_18px_35px_rgba(21,111,230,0.35)] transition hover:bg-[#0f57b6]"
            size="lg"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesion"}
          </Button>
        </form>
      }
    />
  );
};

export default Login;
