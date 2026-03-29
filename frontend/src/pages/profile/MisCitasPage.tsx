import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface BookingItem {
  id: number;
  name: string;
  appointmentTime: string;
  status: string;
}

type BookingStatus = "SCHEDULED" | "RESCHEDULED" | "CANCELLED" | "ATTENDED" | "ALL";

const MisCitasPage = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("ALL");
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00",
  ];

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/bookings`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "No se pudieron cargar las citas"));
      }
      const data: BookingItem[] = await res.json();
      setBookings(data);
      applyFilter(data, statusFilter);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las citas");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = (data: BookingItem[], filter: BookingStatus) => {
    if (filter === "ALL") {
      setFilteredBookings(data);
    } else {
      setFilteredBookings(data.filter((b) => b.status === filter));
    }
  };

  const handleStatusChange = (filter: BookingStatus) => {
    setStatusFilter(filter);
    applyFilter(bookings, filter);
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm("¿Estás seguro que quieres cancelar esta cita?")) return;

    try {
      const res = await authFetch(`${API_BASE}/bookings/${id}/status?status=CANCELLED`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "No se pudo cancelar la cita"));
      }
      toast.success("Cita cancelada");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error instanceof Error ? error.message : "No se pudo cancelar la cita");
    }
  };

  const handleRescheduleClick = (booking: BookingItem) => {
    setSelectedBooking(booking);
    const appointmentDate = new Date(booking.appointmentTime);
    const dateStr = appointmentDate.toISOString().split("T")[0];
    const timeStr = appointmentDate.toTimeString().slice(0, 5);
    setNewDate(dateStr);
    setNewTime(timeStr);
    setIsRescheduleOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedBooking || !newDate || !newTime) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    try {
      const newAppointmentTime = new Date(`${newDate}T${newTime}`).toISOString();
      
      const updateRes = await authFetch(`${API_BASE}/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedBooking.name,
          appointmentTime: newAppointmentTime,
        }),
      });

      if (!updateRes.ok) {
        throw new Error(await getErrorMessage(updateRes, "No se pudo reprogramar la cita"));
      }

      const statusRes = await authFetch(`${API_BASE}/bookings/${selectedBooking.id}/status?status=RESCHEDULED`, {
        method: "PUT",
      });

      if (!statusRes.ok) {
        throw new Error(await getErrorMessage(statusRes, "No se pudo actualizar el estado"));
      }

      toast.success("Cita reprogramada exitosamente");
      setIsRescheduleOpen(false);
      setSelectedBooking(null);
      setNewDate("");
      setNewTime("");
      fetchBookings();
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      toast.error(error instanceof Error ? error.message : "No se pudo reprogramar la cita");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "RESCHEDULED":
        return "bg-yellow-100 text-yellow-800";
      case "ATTENDED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Agendada";
      case "RESCHEDULED":
        return "Reprogramada";
      case "ATTENDED":
        return "Atendida";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-28 px-4 pb-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mis citas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Aquí puedes ver el historial completo de tus citas, reprogramarlas o cancelarlas.
            </p>
            <div className="mb-6 flex flex-wrap gap-3">
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={(val) => handleStatusChange(val as BookingStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas las citas</SelectItem>
                    <SelectItem value="SCHEDULED">Agendadas</SelectItem>
                    <SelectItem value="RESCHEDULED">Reprogramadas</SelectItem>
                    <SelectItem value="ATTENDED">Atendidas</SelectItem>
                    <SelectItem value="CANCELLED">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4 flex gap-2">
              <Button asChild size="sm">
                <Link to="/profile">Volver a mi perfil</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/">Ir al inicio</Link>
              </Button>
            </div>

            {isLoading ? (
              <p>Cargando citas...</p>
            ) : filteredBookings.length === 0 ? (
              <p>No tienes citas en este estado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-3">Paciente</th>
                      <th className="text-left py-2 px-3">Fecha y hora</th>
                      <th className="text-left py-2 px-3">Estado</th>
                      <th className="text-right py-2 px-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-secondary/50">
                        <td className="py-2 px-3">{booking.name}</td>
                        <td className="py-2 px-3">
                          {new Date(booking.appointmentTime).toLocaleString("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right flex gap-2 justify-end flex-wrap">
                          {booking.status === "SCHEDULED" && (
                            <>
                              <Dialog open={isRescheduleOpen && selectedBooking?.id === booking.id} onOpenChange={setIsRescheduleOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRescheduleClick(booking)}
                                  >
                                    Reprogramar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reprogramar cita</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-semibold">Nueva fecha</label>
                                      <Input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        min={getTodayDate()}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-semibold">Nueva hora</label>
                                      <Select value={newTime} onValueChange={setNewTime}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecciona hora" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {timeSlots.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                              {slot}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      onClick={handleRescheduleSubmit}
                                      disabled={isSubmitting || !newDate || !newTime}
                                      className="w-full"
                                    >
                                      {isSubmitting ? "Guardando..." : "Guardar cambios"}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                          {booking.status !== "SCHEDULED" && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MisCitasPage;
