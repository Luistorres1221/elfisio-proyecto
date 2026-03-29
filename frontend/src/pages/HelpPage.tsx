import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HelpPage = () => (
  <div className="min-h-screen bg-background pt-28 px-4 pb-10">
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Asistencia</p>
          <h1 className="text-2xl font-bold text-foreground">Centro de ayuda</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">Regresar al inicio</Link>
        </Button>
      </div>

      <Card className="space-y-4 p-6">
        <p className="text-sm text-muted-foreground">
          Si tienes dudas sobre tu cuenta, citas o pagos, puedes comunicarte con nuestro equipo de soporte.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">atencionalcliente@elfisio.com</p>
            <p className="text-sm text-muted-foreground">Lunes a viernes  8:00 am - 8:00 pm</p>
          </div>
          <Button asChild>
            <a href="mailto:chat@elfisio.com">Enviar correo</a>
          </Button>
        </div>
      </Card>

      <Card className="space-y-3 p-6">
        <h2 className="text-lg font-semibold text-foreground">Preguntas frecuentes</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>¿Cómo reprogramo una cita? - Ingresa a tu panel y selecciona la sección de citas.</li>
          <li>¿Qué métodos de pago aceptan? - Puedes usar tarjeta o transferencia.</li>
          <li>¿Cómo cambio de terapeuta? - Escríbenos por chat o al correo de soporte.</li>
        </ul>
      </Card>
    </div>
  </div>
);

export default HelpPage;
