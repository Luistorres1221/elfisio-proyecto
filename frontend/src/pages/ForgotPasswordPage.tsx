import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE, getErrorMessage } from "@/lib/api";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\[\]{}\-_=+\\|;:'",.<>/?]).{8,}$/;
const passwordPattern =
  `(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\[\\]{}\\-_=+\\|;:'",.<>/?]).{8,}`;
const emailRegex = /^[^\s@]+@[^\s@]+\.(com|co|org)$/i;
const codeRegex = /^\d{6}$/;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEmailValid = emailRegex.test(email);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setCode("");
    setCodeError("");
    setCodeSent(false);
    setCodeVerified(false);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleCodeChange = (value: string) => {
    const numericCode = value.replace(/\D/g, "").slice(0, 6);
    setCode(numericCode);
    setCodeVerified(false);
    setCodeError(
      numericCode.length > 0 && !codeRegex.test(numericCode)
        ? "El codigo debe tener 6 digitos numericos"
        : "",
    );
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordError(
      passwordRegex.test(value)
        ? ""
        : "La contrasena debe tener mayuscula, minuscula, numero y simbolo especial",
    );

    if (confirmPassword) {
      setConfirmPasswordError(value === confirmPassword ? "" : "Las contrasenas no coinciden");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(value === newPassword ? "" : "Las contrasenas no coinciden");
  };

  const requestCode = async () => {
    if (!isEmailValid) {
      toast.error("Ingresa un correo electronico valido");
      return;
    }

    setSendingCode(true);

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password/request-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        toast.error(await getErrorMessage(response, "No se pudo enviar el codigo"));
        return;
      }

      setCode("");
      setCodeError("");
      setCodeSent(true);
      setCodeVerified(false);
      toast.success("Te enviamos un codigo de 6 digitos a tu correo");
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!codeRegex.test(code)) {
      setCodeError("El codigo debe tener 6 digitos numericos");
      toast.error("Ingresa un codigo valido de 6 digitos");
      return;
    }

    setVerifyingCode(true);

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        setCodeVerified(false);
        toast.error(await getErrorMessage(response, "No se pudo validar el codigo"));
        return;
      }

      setCodeError("");
      setCodeVerified(true);
      toast.success("Codigo validado correctamente");
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!codeVerified) {
      toast.error("Primero debes validar el codigo enviado a tu correo");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error("La nueva contrasena debe ser mas segura");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contrasenas no coinciden");
      return;
    }

    setResettingPassword(true);

    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      if (!response.ok) {
        toast.error(await getErrorMessage(response, "No se pudo restablecer la contrasena"));
        return;
      }

      toast.success("Contrasena actualizada. Ya puedes iniciar sesion.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <AuthLayout
      mode="login"
      eyebrow="Recuperacion de acceso"
      title="Restablecer contrasena"
      description="Primero valida tu correo con un codigo de 6 digitos. Cuando el codigo sea correcto, podras definir tu nueva contrasena."
      switchPrompt="Recordaste tu contrasena?"
      switchLabel="Volver a iniciar sesion"
      switchTo="/login"
      form={
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8"
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail size={16} className="text-[#156fe6]" /> Correo electronico
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="h-12 rounded-xl border-slate-200 bg-slate-50/70"
              required
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={requestCode}
            disabled={sendingCode || !isEmailValid}
            className="h-12 w-full rounded-xl border-[#156fe6]/20 text-[#156fe6] hover:bg-[#156fe6]/5 hover:text-[#0f57b6]"
          >
            {sendingCode ? "Enviando codigo..." : codeSent ? "Reenviar codigo" : "Enviar codigo"}
          </Button>

          {codeSent && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <ShieldCheck size={16} className="text-[#156fe6]" /> Codigo de validacion
                </label>
                <Input
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="123456"
                  className="h-12 rounded-xl border-slate-200 bg-white tracking-[0.35em]"
                  maxLength={6}
                  required
                />
                {codeError && <p className="mt-1 text-xs text-destructive">{codeError}</p>}
                {!codeVerified && (
                  <p className="text-xs text-slate-500">
                    Ingresa el codigo de 6 digitos enviado a tu correo. Si no lo recibes, puedes reenviarlo.
                  </p>
                )}
                {codeVerified && (
                  <p className="text-xs font-medium text-emerald-600">
                    Codigo validado. Ya puedes crear tu nueva contrasena.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={verifyCode}
                  disabled={verifyingCode || !codeRegex.test(code)}
                  className="h-11 flex-1 rounded-xl bg-[#156fe6] text-white hover:bg-[#0f57b6]"
                >
                  {verifyingCode ? "Validando..." : "Validar codigo"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={requestCode}
                  disabled={sendingCode || !isEmailValid}
                  className="h-11 rounded-xl"
                >
                  {sendingCode ? "Reenviando..." : "Reenviar codigo"}
                </Button>
              </div>
            </div>
          )}

          {codeVerified && (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock size={16} className="text-[#156fe6]" /> Nueva contrasena
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Minimo 8 caracteres"
                    pattern={passwordPattern}
                    title="Debe tener mayuscula, minuscula, numero y simbolo especial"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pr-11"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="mt-1 text-xs text-destructive">{passwordError}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock size={16} className="text-[#156fe6]" /> Confirmar contrasena
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    placeholder="Repite tu nueva contrasena"
                    pattern={passwordPattern}
                    title="Debe coincidir con la contrasena segura"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pr-11"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPasswordError && <p className="mt-1 text-xs text-destructive">{confirmPasswordError}</p>}
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-3 text-sm">
            <Link to="/login" className="font-medium text-slate-500 transition hover:text-slate-900">
              Volver al inicio de sesion
            </Link>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#156fe6] text-white shadow-[0_18px_35px_rgba(21,111,230,0.35)] transition hover:bg-[#0f57b6]"
            size="lg"
            disabled={
              resettingPassword ||
              !codeVerified ||
              !newPassword ||
              !confirmPassword ||
              !passwordRegex.test(newPassword) ||
              newPassword !== confirmPassword
            }
          >
            {resettingPassword ? "Actualizando..." : "Restablecer contrasena"}
          </Button>
        </form>
      }
    />
  );
};

export default ForgotPasswordPage;
