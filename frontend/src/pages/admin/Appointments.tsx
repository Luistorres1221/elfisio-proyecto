import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Appointment {
  id?: number;
  patient?: { fullName: string };
  service?: { name: string };
  appointmentTime: string;
  status: string;
  notes?: string;
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patients, setPatients] = useState<{ id: number; fullName: string }[]>([]);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    patientId: 0,
    serviceId: 0,
    appointmentTime: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  useEffect(() => {
    fetchPatients();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      const url =
        statusFilter === "ALL"
          ? `${API_BASE}/admin/appointments`
          : `${API_BASE}/admin/appointments/status/${statusFilter}`;

      const res = await authFetch(url);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar citas"));
      }

      setAppointments(await res.json());
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar citas");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/patients`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar pacientes"));
      }
      setPatients(await res.json());
    } catch (err) {
      console.error("Error fetching patients:", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar pacientes");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/services`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar servicios"));
      }
      setServices(await res.json());
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar servicios");
    }
  };

  const handleCreateAppointment = async () => {
    const { patientId, serviceId, appointmentTime, notes } = newAppointment;
    if (!patientId || !serviceId || !appointmentTime) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await authFetch(`${API_BASE}/admin/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, serviceId, appointmentTime, notes }),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al crear la cita"));
      }

      toast.success("Cita creada");
      setIsDialogOpen(false);
      setNewAppointment({ patientId: 0, serviceId: 0, appointmentTime: "", notes: "" });
      fetchAppointments();
    } catch (err) {
      console.error("Error creating appointment:", err);
      toast.error(err instanceof Error ? err.message : "Error al crear la cita");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await authFetch(`${API_BASE}/admin/appointments/${id}/status?status=${newStatus}`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al actualizar estado"));
      }

      toast.success("Estado actualizado");
      fetchAppointments();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al actualizar estado");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Estas seguro de eliminar esta cita?")) return;

    try {
      const res = await authFetch(`${API_BASE}/admin/appointments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al eliminar cita"));
      }

      toast.success("Cita eliminada");
      fetchAppointments();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al eliminar cita");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "ATTENDED":
        return "bg-blue-100 text-blue-800";
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Gestion de Citas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={20} className="mr-2" /> Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Cita</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Paciente</label>
                <Select
                  value={newAppointment.patientId.toString()}
                  onValueChange={(val) => setNewAppointment((prev) => ({ ...prev, patientId: Number(val) }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold">Servicio</label>
                <Select
                  value={newAppointment.serviceId.toString()}
                  onValueChange={(val) => setNewAppointment((prev) => ({ ...prev, serviceId: Number(val) }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold">Fecha y hora</label>
                <Input
                  type="datetime-local"
                  value={newAppointment.appointmentTime}
                  onChange={(e) => setNewAppointment((prev) => ({ ...prev, appointmentTime: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Notas</label>
                <Textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <Button className="w-full" onClick={handleCreateAppointment}>
                Crear cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmada</SelectItem>
            <SelectItem value="ATTENDED">Atendida</SelectItem>
            <SelectItem value="CANCELLED">Cancelada</SelectItem>
            <SelectItem value="NO_SHOW">No asistio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">Paciente</th>
                  <th className="text-left py-3 px-4">Servicio</th>
                  <th className="text-left py-3 px-4">Fecha y Hora</th>
                  <th className="text-left py-3 px-4">Estado</th>
                  <th className="text-right py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-secondary/50">
                    <td className="py-3 px-4">{appointment.patient?.fullName}</td>
                    <td className="py-3 px-4">{appointment.service?.name}</td>
                    <td className="py-3 px-4">{new Date(appointment.appointmentTime).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Select
                        value={appointment.status}
                        onValueChange={(val) => appointment.id && handleStatusChange(appointment.id, val)}
                      >
                        <SelectTrigger className={`w-32 ${getStatusColor(appointment.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                          <SelectItem value="ATTENDED">Atendida</SelectItem>
                          <SelectItem value="CANCELLED">Cancelada</SelectItem>
                          <SelectItem value="NO_SHOW">No asistio</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => appointment.id && handleDelete(appointment.id)}>
                        <X size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;
