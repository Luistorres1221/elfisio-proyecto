import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockNotifications = [
  { id: 1, title: "Cita confirmada", detail: "Tu cita del 25 de marzo a las 10:00 am ha sido confirmada." },
  { id: 2, title: "Recordatorio", detail: "Recuerda llevar tu evaluación médica previa a la sesión." },
  { id: 3, title: "Nuevo servicio", detail: "Hemos agregado nuevos servicios de fisioterapia." },
];

const NotificationsPage = () => (
  <div className="min-h-screen bg-background pt-28 px-4 pb-10">
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Alertas</p>
          <h1 className="text-2xl font-bold text-foreground">Notificaciones recientes</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">Regresar al inicio</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <Card key={notification.id} className="p-5">
            <div className="flex items-center gap-3">
              <Badge variant="outline">Nuevo</Badge>
              <p className="text-sm font-semibold text-foreground">{notification.title}</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{notification.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default NotificationsPage;
