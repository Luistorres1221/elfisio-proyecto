import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { API_BASE } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFullNameChange = (value: string) => {
    const sanitized = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    setFullName(sanitized);
  };

  const handlePhoneChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "");
    setPhone(sanitized);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.(com|co|org)$/i;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\[\]{}\-_=+\\|;:'",.<>/?]).{8,}$/;

  const validateEmailValue = (value: string) => emailRegex.test(value);
  const validatePasswordValue = (value: string) => passwordRegex.test(value);
  const passwordPattern = `(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\[\\]{}\\-_=+\\|;:'",.<>/?]).{8,}`;

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(
      validateEmailValue(value) ? "" : "El correo debe tener '@' y terminar en .com, .co o .org"
    );
  };

  const handleConfirmEmailChange = (value: string) => {
    setConfirmEmail(value);
    setConfirmEmailError(
      validateEmailValue(value) ? "" : "El correo debe tener '@' y terminar en .com, .co o .org"
    );
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(
      validatePasswordValue(value)
        ? ""
        : "La contraseña debe tener mayúscula, minúscula, número y símbolo especial"
    );
    if (confirmPassword) {
      setConfirmPasswordError(value === confirmPassword ? "" : "Las contraseñas no coinciden");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(value === password ? "" : "Las contraseñas no coinciden");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailValue(email) || !validateEmailValue(confirmEmail)) {
      toast.error("Correo inválido o con formato incorrecto");
      return;
    }
    if (email !== confirmEmail) {
      toast.error("Los correos electrónicos no coinciden");
      return;
    }
    if (!validatePasswordValue(password)) {
      toast.error("La contraseña debe ser más segura");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (!acceptedPolicies) {
      toast.error("Debes aceptar los Terminos y Condiciones y la Politica de Tratamiento de Datos");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password, phone }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success("¡Registro exitoso! Ya puedes iniciar sesión.");
        navigate("/login");
      } else {
        const error = await response.text();
        toast.error("Error en el registro: " + error);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      mode="register"
      eyebrow="Alta de pacientes"
      title="Crear cuenta"
      description="Registrate para agendar tus citas con una interfaz mas clara, moderna y conectada visualmente con la identidad de ELFISIO."
      switchPrompt="Ya tienes cuenta?"
      switchLabel="Iniciar sesion"
      switchTo="/login"
      form={
        <form
          onSubmit={handleRegister}
          className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <User size={16} className="text-[#156fe6]" /> Nombre completo
            </label>
            <Input
              value={fullName}
              onChange={(e) => handleFullNameChange(e.target.value)}
              placeholder="Juan Perez"
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
              title="Solo letras y espacios"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/70"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Mail size={16} className="text-[#156fe6]" /> Correo electrónico
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="correo@ejemplo.com"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.(com|co|org)$"
              title="Debes ingresar un correo electronico valido"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/70"
              required
            />
            {emailError && <p className="mt-1 text-xs text-destructive">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Mail size={16} className="text-[#156fe6]" /> Confirmar correo electrónico
            </label>
            <Input
              type="email"
              value={confirmEmail}
              onChange={(e) => handleConfirmEmailChange(e.target.value)}
              placeholder="Confirma tu correo"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.(com|co|org)$"
              title="Debes ingresar un correo electronico valido"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/70"
              required
            />
            {confirmEmailError && <p className="mt-1 text-xs text-destructive">{confirmEmailError}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <User size={16} className="text-[#156fe6]" /> Teléfono
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+57 300 000 0000"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/70"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Lock size={16} className="text-[#156fe6]" /> Contraseña
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Minimo 8 caracteres"
                pattern={passwordPattern}
                title="Debe tener mayuscula, minuscula, numero y simbolo especial"
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pr-11"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-xs text-destructive">{passwordError}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Lock size={16} className="text-[#156fe6]" /> Confirmar contraseña
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Repite tu contraseña"
                pattern={passwordPattern}
                title="Debe coincidir con la contrasena segura"
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pr-11"
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPasswordError && <p className="mt-1 text-xs text-destructive">{confirmPasswordError}</p>}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <label
              htmlFor="accept-policies"
              className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700"
            >
              <Checkbox
                id="accept-policies"
                checked={acceptedPolicies}
                onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                className="mt-1 border-slate-300 data-[state=checked]:border-[#156fe6] data-[state=checked]:bg-[#156fe6]"
              />
              <span>
                He leido y acepto los{" "}
                <a
                  href="/docs/terminos-condiciones.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#156fe6] underline underline-offset-4 transition hover:text-[#0f57b6]"
                >
                  Terminos y Condiciones
                </a>{" "}
                y la{" "}
                <a
                  href="/docs/politica-tratamiento-datos.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#156fe6] underline underline-offset-4 transition hover:text-[#0f57b6]"
                >
                  Politica de Tratamiento de Datos
                </a>
                .
              </span>
            </label>
          </div>
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#156fe6] text-white shadow-[0_18px_35px_rgba(21,111,230,0.35)] transition hover:bg-[#0f57b6]"
            size="lg"
            disabled={
              loading ||
              ![
                fullName,
                phone,
                email,
                confirmEmail,
                password,
                confirmPassword,
              ].every(Boolean) ||
              !acceptedPolicies ||
              !validateEmailValue(email) ||
              !validateEmailValue(confirmEmail) ||
              email !== confirmEmail ||
              !validatePasswordValue(password) ||
              password !== confirmPassword
            }
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </Button>
        </form>
      }
    />
  );
};

export default Register;
