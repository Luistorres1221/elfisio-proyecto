import InfoPageLayout from "@/components/InfoPageLayout";

const NosotrosPage = () => {
  return (
    <InfoPageLayout
      badge="Acerca de"
      title="Nosotros"
      summary="Somos un equipo orientado a la rehabilitacion fisica y al cuidado integral, con una atencion basada en cercania, criterio profesional y acompanamiento continuo."
    >
      <p>
        En ELFISIO creemos en una fisioterapia que combine conocimiento tecnico, empatia y
        compromiso con el bienestar integral de cada paciente. Nuestra labor se desarrolla
        bajo principios de respeto, responsabilidad y atencion personalizada.
      </p>
      <p>
        Trabajamos para ofrecer procesos terapeuticos claros, seguros y ajustados a cada
        necesidad clinica, promoviendo la recuperacion funcional, la prevencion de lesiones
        y el fortalecimiento de habitos que favorezcan una mejor calidad de vida.
      </p>
      <p>
        Nos proyectamos como un equipo confiable y cercano, enfocado en construir relaciones
        solidas con nuestros usuarios mediante una atencion oportuna, comunicacion
        transparente y vocacion permanente de servicio.
      </p>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">Mision</h2>
        <p className="mt-3">
          Brindar servicios de fisioterapia con altos estandares de calidad, enfoque humano
          y atencion personalizada, orientados a la recuperacion funcional, la prevencion de
          lesiones y la promocion del bienestar integral de nuestros pacientes.
        </p>
      </section>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">Vision</h2>
        <p className="mt-3">
          Ser reconocidos como un referente en servicios de fisioterapia por nuestra
          excelencia profesional, calidez en la atencion, confianza institucional y
          compromiso permanente con la salud y la calidad de vida de la comunidad.
        </p>
      </section>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">Valores</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-background p-4">
            <h3 className="font-semibold text-foreground">Compromiso</h3>
            <p className="mt-2 text-sm leading-7">
              Actuamos con responsabilidad y entrega en cada proceso terapeutico.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background p-4">
            <h3 className="font-semibold text-foreground">Empatia</h3>
            <p className="mt-2 text-sm leading-7">
              Escuchamos, comprendemos y acompanamos a cada paciente con respeto y calidez.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background p-4">
            <h3 className="font-semibold text-foreground">Excelencia</h3>
            <p className="mt-2 text-sm leading-7">
              Buscamos una atencion segura, actualizada y orientada a resultados efectivos.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-background p-4">
            <h3 className="font-semibold text-foreground">Integridad</h3>
            <p className="mt-2 text-sm leading-7">
              Trabajamos con etica, transparencia y respeto por la dignidad de las personas.
            </p>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">Politica de calidad</h2>
        <p className="mt-3">
          En ELFISIO estamos comprometidos con la prestacion de servicios de fisioterapia
          seguros, humanizados y oportunos, apoyados en talento humano calificado, mejora
          continua de nuestros procesos y seguimiento permanente a la satisfaccion de
          nuestros usuarios.
        </p>
        <p className="mt-3">
          Nuestra politica de calidad se enfoca en cumplir los requisitos aplicables,
          fortalecer la confianza institucional y promover resultados terapeuticos que
          respondan de manera efectiva a las necesidades de cada paciente.
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default NosotrosPage;
