import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, LoaderCircle, MailWarning, XCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { API_BASE, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";

const ActivateAccountPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Estamos validando tu enlace de activacion.");

  useEffect(() => {
    let cancelled = false;

    const activateAccount = async () => {
      if (!token) {
        if (!cancelled) {
          setStatus("error");
          setMessage("El enlace de activacion no es valido o no contiene el token.");
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/verify?token=${encodeURIComponent(token)}`);

        if (!response.ok) {
          const errorMessage = await getErrorMessage(response, "No se pudo activar la cuenta");
          if (!cancelled) {
            setStatus("error");
            setMessage(errorMessage);
          }
          return;
        }

        const data = await response.json();
        if (!cancelled) {
          setStatus("success");
          setMessage(data.message ?? "Cuenta activada correctamente. Ya puedes iniciar sesion.");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Error al conectar con el servidor durante la activacion.");
        }
      }
    };

    activateAccount();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const statusBlock = {
    loading: {
      icon: <LoaderCircle className="h-10 w-10 animate-spin text-[#156fe6]" />,
      title: "Activando cuenta",
      text: message,
    },
    success: {
      icon: <CheckCircle2 className="h-10 w-10 text-emerald-500" />,
      title: "Cuenta activada",
      text: message,
    },
    error: {
      icon: <XCircle className="h-10 w-10 text-rose-500" />,
      title: "No se pudo activar",
      text: message,
    },
  }[status];

  return (
    <AuthLayout
      mode="login"
      eyebrow="Activacion de cuenta"
      title={statusBlock.title}
      description={statusBlock.text}
      switchPrompt="Necesitas ayuda?"
      switchLabel="Volver al inicio de sesion"
      switchTo="/login"
      form={
        <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex justify-center">{statusBlock.icon}</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-slate-900">{statusBlock.title}</h3>
            <p className="text-sm leading-6 text-slate-600">{statusBlock.text}</p>
          </div>

          <div className="flex flex-col gap-3">
            {status === "success" && (
              <Button asChild className="h-12 rounded-xl bg-[#156fe6] text-white hover:bg-[#0f57b6]">
                <Link to="/login">Ir a iniciar sesion</Link>
              </Button>
            )}

            {status === "error" && (
              <Button asChild variant="outline" className="h-12 rounded-xl">
                <Link to="/register">Volver a registrarme</Link>
              </Button>
            )}

            <Button asChild variant="ghost" className="h-12 rounded-xl text-slate-600 hover:text-slate-900">
              <Link to="/login">
                <MailWarning className="mr-2 h-4 w-4" />
                Volver al inicio de sesion
              </Link>
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default ActivateAccountPage;
