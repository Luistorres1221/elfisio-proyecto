import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, Clock } from "lucide-react";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface DashboardStats {
  totalPatients: number;
  totalTodayAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
}

interface Appointment {
  id?: number;
  patient?: { fullName: string };
  service?: { name: string };
  appointmentTime: string;
  status: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalTodayAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
  });
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          authFetch(`${API_BASE}/admin/patients/count`),
          authFetch(`${API_BASE}/admin/appointments/stats`),
        ]);

        if (!patientsRes.ok) {
          throw new Error(await getErrorMessage(patientsRes, "Error al cargar estadisticas de pacientes"));
        }

        if (!appointmentsRes.ok) {
          throw new Error(await getErrorMessage(appointmentsRes, "Error al cargar estadisticas de citas"));
        }

        const patientsData = await patientsRes.json();
        const appointmentsData = await appointmentsRes.json();

        setStats({
          totalPatients: patientsData || 0,
          totalTodayAppointments: appointmentsData.totalToday || 0,
          confirmedAppointments: appointmentsData.confirmedToday || 0,
          pendingAppointments: appointmentsData.pendingToday || 0,
          cancelledAppointments: appointmentsData.cancelledToday || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchUpcoming = async () => {
      try {
        const res = await authFetch(`${API_BASE}/admin/appointments`);
        if (!res.ok) {
          throw new Error(await getErrorMessage(res, "Error al cargar citas proximas"));
        }

        const data: Appointment[] = await res.json();
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const filtered = data
          .filter((a) => {
            const d = new Date(a.appointmentTime);
            return d >= now && d <= endOfDay;
          })
          .sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime())
          .slice(0, 5);
        setUpcoming(filtered);
      } catch (err) {
        console.error("Error fetching upcoming appointments:", err);
      }
    };

    fetchStats();
    fetchUpcoming();
    const interval = setInterval(() => {
      fetchStats();
      fetchUpcoming();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { title: "Total de Pacientes", value: stats.totalPatients, icon: Users, color: "bg-blue-100 text-blue-600" },
    { title: "Citas Hoy", value: stats.totalTodayAppointments, icon: Calendar, color: "bg-green-100 text-green-600" },
    { title: "Confirmadas", value: stats.confirmedAppointments, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
    { title: "Pendientes", value: stats.pendingAppointments, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Bienvenido al panel de administracion de ELFISIO</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-between justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proximas Citas del Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcoming.length > 0 ? (
              upcoming.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">
                      {a.patient?.fullName} - {a.service?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(a.appointmentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{a.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">No hay citas proximas</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
