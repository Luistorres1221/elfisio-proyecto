import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-physio.jpg";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Clínica de fisioterapia moderna"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            Fisioterapia Profesional
          </div>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1]">
            Tu bienestar,{" "}
            <span className="text-primary">nuestra prioridad</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            Recupera tu movilidad y calidad de vida con tratamientos personalizados
            de fisioterapia. Agenda tu cita en minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="text-base px-8">
              <a href="#agendar">Agendar Cita</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <a href="#servicios">Ver Servicios</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
