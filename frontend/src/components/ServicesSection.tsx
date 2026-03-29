import { Activity, Brain, Heart, Bone, Zap, Users, Waves, Wand2, Wind, Bandage } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Activity,
    title: "Valoración Fisioterapéutica",
    description: "Evaluación completa del estado físico y diagnóstico personalizado para tu plan de tratamiento.",
  },
  {
    icon: Heart,
    title: "Ventosas Cupping",
    description: "Terapia tradicional que mejora la circulación y alivia dolor muscular y tensión.",
  },
  {
    icon: Wand2,
    title: "Punción Seca",
    description: "Técnica invasiva mínima para tratar puntos gatillo y aliviar dolor crónico.",
  },
  {
    icon: Bandage,
    title: "Vendaje Neuromuscular",
    description: "Método de vendaje especializado que reduce dolor y mejora el movimiento.",
  },
  {
    icon: Users,
    title: "Masaje Terapéutico",
    description: "Masajes profesionales para aliviar tensión, estrés y dolor muscular.",
  },
  {
    icon: Activity,
    title: "Masaje Deportivo",
    description: "Masajes especializados para atletas, prevención y recuperación de lesiones deportivas.",
  },
  {
    icon: Bone,
    title: "Rehabilitación Física",
    description: "Programas personalizados de ejercicios y terapia para recuperación funcional.",
  },
  {
    icon: Wind,
    title: "Rehabilitación Deportiva",
    description: "Entrenamiento especializado para atletas en retorno al rendimiento deportivo.",
  },
  {
    icon: Zap,
    title: "Terapia con Electroestimulador",
    description: "Tratamientos con corrientes eléctricas para alivio del dolor y fortalecimiento muscular.",
  },
  {
    icon: Waves,
    title: "Presoterapia",
    description: "Terapia de compresión neumática para mejorar circulación y recuperación.",
  },
  {
    icon: Brain,
    title: "Masoterapia",
    description: "Masajes terapéuticos integrales para relax, circulación y bienestar general.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Nuestros Servicios
          </span>
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Atención integral para tu recuperación
          </h2>
          <p className="text-muted-foreground text-lg">
            Ofrecemos una amplia gama de servicios especializados para cada necesidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <service.icon size={24} className="text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
