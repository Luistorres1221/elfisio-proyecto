import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Patient {
  id?: number;
  fullName: string;
  documentId: string;
  phone: string;
  email: string;
  age: number;
  medicalObservations?: string;
}

const EMPTY_PATIENT: Patient = {
  fullName: "",
  documentId: "",
  phone: "",
  email: "",
  age: 0,
  medicalObservations: "",
};

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Patient>(EMPTY_PATIENT);

  useEffect(() => {
    fetchPatients();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE}/admin/patients/${editingId}` : `${API_BASE}/admin/patients`;

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: Number.isNaN(formData.age) ? 0 : formData.age,
        }),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al guardar paciente"));
      }

      toast.success(editingId ? "Paciente actualizado" : "Paciente creado");
      fetchPatients();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al guardar paciente");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Estas seguro de eliminar este paciente?")) return;

    try {
      const res = await authFetch(`${API_BASE}/admin/patients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al eliminar paciente"));
      }

      toast.success("Paciente eliminado");
      fetchPatients();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al eliminar paciente");
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingId(patient.id || null);
    setFormData({ ...EMPTY_PATIENT, ...patient });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_PATIENT);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.documentId.includes(searchTerm) ||
      patient.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Gestion de Pacientes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus size={20} className="mr-2" /> Nuevo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Paciente" : "Nuevo Paciente"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Nombre completo"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <Input
                placeholder="Documento de identidad"
                value={formData.documentId}
                onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                required
              />
              <Input
                placeholder="Telefono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                placeholder="Correo electronico"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Edad"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              />
              <Textarea
                placeholder="Observaciones medicas"
                value={formData.medicalObservations || ""}
                onChange={(e) => setFormData({ ...formData, medicalObservations: e.target.value })}
              />
              <Button type="submit" className="w-full">
                {editingId ? "Actualizar" : "Crear"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, documento o telefono..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">Nombre</th>
                  <th className="text-left py-3 px-4">Documento</th>
                  <th className="text-left py-3 px-4">Telefono</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Edad</th>
                  <th className="text-right py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-secondary/50">
                    <td className="py-3 px-4">{patient.fullName}</td>
                    <td className="py-3 px-4">{patient.documentId}</td>
                    <td className="py-3 px-4">{patient.phone}</td>
                    <td className="py-3 px-4">{patient.email}</td>
                    <td className="py-3 px-4">{patient.age}</td>
                    <td className="py-3 px-4 flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(patient)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => patient.id && handleDelete(patient.id)}>
                        <Trash2 size={16} />
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

export default PatientsPage;
