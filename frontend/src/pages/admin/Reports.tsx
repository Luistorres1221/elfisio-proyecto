import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import * as Recharts from "recharts";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Appointment {
  appointmentTime: string;
}

interface MonthCount {
  month: string;
  count: number;
}

const ReportsPage = () => {
  const [data, setData] = useState<MonthCount[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await authFetch(`${API_BASE}/admin/appointments`);
        if (!res.ok) {
          throw new Error(await getErrorMessage(res, "Error al cargar reportes"));
        }

        const appointments: Appointment[] = await res.json();
        const counts: Record<string, number> = {};
        appointments.forEach((a) => {
          const d = new Date(a.appointmentTime);
          const key = d.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit" });
          counts[key] = (counts[key] || 0) + 1;
        });
        setData(Object.entries(counts).map(([month, count]) => ({ month, count })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Reportes</h2>

      {data.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Citas por mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Citas", color: "#3b82f6" } }}>
              <Recharts.BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Recharts.XAxis dataKey="month" />
                <Recharts.YAxis />
                <Recharts.Tooltip />
                <Recharts.Bar dataKey="count" fill="#3b82f6" />
              </Recharts.BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">No hay datos para mostrar</p>
      )}
    </div>
  );
};

export default ReportsPage;
