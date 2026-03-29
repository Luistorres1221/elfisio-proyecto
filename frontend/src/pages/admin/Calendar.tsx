import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Appointment {
  id: number;
  patientName: string;
  serviceName: string;
  appointmentTime: string;
  status: string;
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/appointments`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar citas"));
      }
      setAppointments(await res.json());
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar citas");
    }
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentTime);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [] as Array<Date | null>;

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));

    return days;
  };

  const days = renderCalendar();
  const monthName = currentDate.toLocaleString("es-ES", { month: "long", year: "numeric" });
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    ATTENDED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-red-100 text-red-800",
    NO_SHOW: "bg-gray-100 text-gray-800",
  };
  const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Calendario</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                <ChevronLeft size={20} />
              </Button>
              <CardTitle className="capitalize">{monthName}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                <ChevronRight size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center font-semibold text-sm p-2">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const dayAppointments = day ? getAppointmentsForDate(day) : [];
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={idx}
                      onClick={() => day && setSelectedDate(day)}
                      className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-colors ${
                        !day
                          ? "bg-secondary/30"
                          : isToday
                            ? "bg-primary/10 border-primary"
                            : isSelected
                              ? "bg-blue-100 border-primary"
                              : "hover:bg-secondary/50"
                      }`}
                    >
                      {day && (
                        <>
                          <div className="font-semibold text-sm mb-1">{day.getDate()}</div>
                          <div className="space-y-1">
                            {dayAppointments.slice(0, 2).map((apt) => (
                              <div key={apt.id} className={`text-xs p-1 rounded ${statusColors[apt.status] || "bg-gray-100"}`}>
                                {apt.serviceName.slice(0, 8)}...
                              </div>
                            ))}
                            {dayAppointments.length > 2 && <div className="text-xs text-muted-foreground">+{dayAppointments.length - 2}</div>}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate
                ? selectedDate.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                : "Selecciona una fecha"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDate && getAppointmentsForDate(selectedDate).length > 0 ? (
                getAppointmentsForDate(selectedDate).map((apt) => (
                  <div key={apt.id} className={`p-3 rounded-lg border ${statusColors[apt.status] || "bg-gray-100"}`}>
                    <p className="font-semibold text-sm">{apt.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{apt.patientName}</p>
                    <p className="text-xs mt-1">
                      {new Date(apt.appointmentTime).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <span className="inline-block text-xs font-semibold mt-2 px-2 py-1 rounded bg-background">{apt.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{selectedDate ? "No hay citas para esta fecha" : ""}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
