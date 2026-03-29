import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

interface InfoPageLayoutProps {
  badge: string;
  title: string;
  summary: string;
  children: ReactNode;
}

const InfoPageLayout = ({
  badge,
  title,
  summary,
  children,
}: InfoPageLayoutProps) => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_32%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--muted)/0.35)_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
          <div className="border-b border-border/60 bg-muted/40 px-6 py-8 sm:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  {badge}
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {summary}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <div className="space-y-6 text-base leading-8 text-muted-foreground">
              {children}
            </div>

            <div className="mt-10 border-t border-border/60 pt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Regresar al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InfoPageLayout;
