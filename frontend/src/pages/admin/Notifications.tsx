import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Appointment {
  id: number;
  patient?: { fullName: string };
  appointmentTime: string;
  status: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await authFetch(`${API_BASE}/admin/appointments`);
        if (!res.ok) {
          throw new Error(await getErrorMessage(res, "Error al cargar notificaciones"));
        }

        const data: Appointment[] = await res.json();
        const now = new Date();
        const later = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const upcoming = data.filter((a) => {
          const d = new Date(a.appointmentTime);
          return a.status === "PENDING" && d >= now && d <= later;
        });
        setNotifications(upcoming);
      } catch (err) {
        console.error(err);
      }
    };

    loadNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Notificaciones</h2>
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <CardTitle>{n.patient?.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Proxima cita: {new Date(n.appointmentTime).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No hay notificaciones pendientes</p>
      )}
    </div>
  );
};

export default NotificationsPage;
