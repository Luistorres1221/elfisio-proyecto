import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import authMark from "@/assets/autenticacion.png";

interface AuthLayoutProps {
  mode: "login" | "register";
  title: string;
  description: string;
  eyebrow: string;
  form: ReactNode;
  switchPrompt: string;
  switchLabel: string;
  switchTo: string;
}

const heroCopy = {
  login: {
    pill: "Recuperacion guiada",
    headline: "Tu progreso empieza desde el primer acceso.",
    body:
      "Un ingreso claro, elegante y rapido para que el paciente sienta confianza desde el primer segundo.",
  },
  register: {
    pill: "Nuevo paciente",
    headline: "Crea tu cuenta y entra a una experiencia mas humana.",
    body:
      "Registro fluido, visualmente guiado y listo para acompañar cada cita, avance y seguimiento.",
  },
} as const;

const AuthLayout = ({
  mode,
  title,
  description,
  eyebrow,
  form,
  switchPrompt,
  switchLabel,
  switchTo,
}: AuthLayoutProps) => {
  const content = heroCopy[mode];

  return (
    <div className="auth-scene relative min-h-screen overflow-hidden bg-[#020817] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="auth-bg-orb auth-bg-orb-one" />
      <div className="auth-bg-orb auth-bg-orb-two" />
      <div className="auth-grid mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="auth-panel auth-panel-visual relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8 lg:min-h-[720px] lg:p-10">
          <div className="auth-panel-sheen" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="max-w-xl space-y-5">
              <span className="inline-flex w-fit items-center rounded-full border border-[#4da3ff]/35 bg-[#0b2c54]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-[#8cc8ff]">
                {content.pill}
              </span>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.38em] text-white/55">{eyebrow}</p>
                <h1 className="heading-display max-w-lg text-4xl leading-tight text-white sm:text-5xl">
                  {content.headline}
                </h1>
                <p className="max-w-xl text-base leading-7 text-[#c7d9f7] sm:text-lg">
                  {content.body}
                </p>
              </div>
            </div>

            <div className={`auth-logo-wrap ${mode === "login" ? "auth-logo-login" : "auth-logo-register"} relative mx-auto w-full max-w-[380px]`}>
              <div className="auth-logo-orbit auth-logo-orbit-one" />
              <div className="auth-logo-orbit auth-logo-orbit-two" />
              <div className="auth-logo-aura" />
              <div className="auth-logo-card">
                <img
                  src={authMark}
                  alt="Logo ELFISIO Rehabilitacion Fisica e Integral"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel auth-panel-form rounded-[2rem] border border-[#90c9ff]/20 bg-white/[0.96] p-6 text-slate-900 shadow-[0_32px_90px_rgba(3,12,30,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <ArrowLeft size={16} /> Volver al inicio
                </Link>
                
              </div>
              <div className="space-y-2 text-center">
                <h2 className="heading-display text-3xl font-bold text-slate-950 sm:text-4xl">{title}</h2>
                <p className="mx-auto max-w-md text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
              </div>
            </div>

            {form}

            <p className="text-center text-sm text-slate-500">
              {switchPrompt}{" "}
              <Link to={switchTo} className="font-semibold text-[#156fe6] transition hover:text-[#0f57b6]">
                {switchLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
